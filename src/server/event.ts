"use server";

import { CommonParams, PaginateResult } from "@/lib/model-types";
import db from "../../prisma/db-init";
import { DtoEvents, MidtransSnapResponse } from "@/lib/dto";
import { auth } from "@/app/api/auth/auth-setup";
import { stringWithTimestamp } from "@/lib/utils";
import { ulid } from "ulid";
import midtrans from "@/lib/midtrans-init";
import { DefaultArgs } from "@prisma/client/runtime/client";
import { Events, EventStatusEnum, Prisma, TemplateCaptures, Templates } from "@/generated/prisma";

type GetDataEventsParams = {
  where?: Prisma.EventsWhereInput;
  orderBy?: Prisma.EventsOrderByWithRelationInput | Prisma.EventsOrderByWithRelationInput[];
  select?: Prisma.EventsSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataEvents(params: GetDataEventsParams): Promise<PaginateResult<Events & {
  template: (Templates & { captures?: TemplateCaptures[] | null }) | null
}>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.events.findMany({
      skip,
      take: perPage,
      where,
      orderBy,
      select: {
        ...select,
        template: select?.template
      }
    }),
    db.events.count({ where })
  ]);

  return {
    data,
    meta: {
      page: curPage,
      limit: perPage,
      total,
      totalPages: Math.ceil(total/perPage)
    }
  };
  
  // const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  // const skip = (curPage - 1) * perPage;

  // const finalSelect: Prisma.EventsSelect = {
  //   ...(select || {}),
  // };

  // if (select?.template) {
  //   const userTemplateSelect =
  //     typeof select.template === "object" && "select" in select.template ? select.template.select : {};

  //   finalSelect.template = {
  //     select: {
  //       ...userTemplateSelect,
  //       captures: {
  //         take: 1,
  //         orderBy: { index: "asc" },
  //         select: { file_path: true },
  //       },
  //     },
  //   };
  // }

  // const [data, total] = await Promise.all([
  //   db.events.findMany({
  //     skip,
  //     take: perPage,
  //     where,
  //     orderBy,
  //     select: finalSelect,
  //   }),
  //   db.events.count({ where }),
  // ]);

  // return {
  //   data,
  //   meta: {
  //     page: curPage,
  //     limit: perPage,
  //     total,
  //     totalPages: Math.ceil(total / perPage),
  //   },
  // };
};

export async function StoreUpdateDataEvents(formData: DtoEvents): Promise<string | null> {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const data_id = formData.id ?? 0;
    
    const action = await db.events.upsert({
      where: { id: data_id },
      create: {
        user_id: Number(user?.id),
        tmp_status: formData.tmp_status,

        tmp_id: formData.tmp_id,
        tmp_code: stringWithTimestamp.v2(15, true, formData.tmp_ctg_key.toUpperCase()),
        tmp_ctg: formData.tmp_ctg,
        tmp_ctg_key: formData.tmp_ctg_key,
        createdBy: user?.email
      },
      update: {
        tmp_id: formData.tmp_id,
        tmp_status: formData.tmp_status,
        tmp_ctg: formData.tmp_ctg,
        tmp_ctg_key: formData.tmp_ctg_key,
        updatedBy: user?.email
      }
    });

    return action.tmp_code;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function GetDataEventByCode(code: string): Promise<Events & { template: Templates & { captures: { file_path: string }[] | null } | null } | null> {
  const getData = await db.events.findUnique({
    where: { tmp_code: code },
    include: {
      template: {
        include: {
          captures: {
            take: 1,
            orderBy: { index: "asc" },
            select: { file_path: true },
          }
        }
      }
    }
  });
  return getData;
};

export async function StoreSnapMidtrans(eventId:number): Promise<MidtransSnapResponse | undefined> {
  try{
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");

    const getDataEvent = await db.events.findUnique({
      where: { id: eventId },
      include: {
        template: true
      }
    });
    if(!getDataEvent) throw new Error("Event data not found!");

    const findIsTr = await db.tr.findFirst({
      where: {
        user_id: getDataEvent.user_id,
        event_id: eventId
      }
    });
    const nowDate = new Date();

    if(findIsTr && findIsTr.pay_token && findIsTr.pay_redirect_url){
      if(nowDate > findIsTr.pay_expiry_time){

      }

      const dataExistTr: MidtransSnapResponse = {
        token: findIsTr.pay_token,
        redirect_url: findIsTr.pay_redirect_url
      };

      // const statusMidTr = await midtrans.core.transaction.status(findIsTr.tr_id);

      return dataExistTr;
    };
  
    let dataPriceInit = 0;
    if(getDataEvent.template) dataPriceInit = getDataEvent.template.disc_price ? getDataEvent.template.price - getDataEvent.template.disc_price : getDataEvent.template.price;

    const transDb: MidtransSnapResponse = await db.$transaction(async (tx: Prisma.TransactionClient) => {
      const trData = await tx.tr.create({
        data: {
          tr_id: ulid(),
          user_id: getDataEvent.user_id,
          event_id: eventId,

          subtotal: getDataEvent.template.price,
          disc_value: getDataEvent.template.disc_price,
          total_amount: dataPriceInit
        }
      });
      
      const createSnap: MidtransSnapResponse = await midtrans.snap.createTransaction({
        transaction_details: {
          order_id: trData.tr_id,
          gross_amount: dataPriceInit
        },
      });

      const expiredPay = new Date(nowDate.getTime() + 86400000); 
      
      await Promise.all([
        tx.events.update({
          where: { id: eventId },
          data: {
            tmp_status: EventStatusEnum.NOT_PAID,
          }
        }),
        tx.tr.update({
          where: { tr_id: trData.tr_id },
          data: {
            pay_expiry_time: expiredPay,
            pay_token: createSnap.token,
            pay_redirect_url: createSnap.redirect_url
          }
        })
      ]);

      return createSnap;
    }, {
      maxWait: 3000,
      timeout: 5000,
    });

    return transDb;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function CancelOrderEvent(eventId: number) {
  try{
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const findIsTr = await db.tr.findFirst({
      where: {
        user_id: Number(user?.id),
        event_id: eventId
      }
    });
    if(findIsTr) {
      try{
        await midtrans.snap.transaction.cancel(findIsTr.tr_id);
      }catch(errMt: any){}
    }

    await db.events.delete({ where: { id: eventId } });
  } catch (error: any) {
    throw new Error(error.message);
  }
}