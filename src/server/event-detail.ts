"use server";

import { CommonParams, PaginateResult, RsvpStatsParams, UploadFileRespons } from "@/lib/model-types";
import { db } from "../../prisma/db-init";
import { DefaultArgs } from "@prisma/client/runtime/client";
import { auth } from "@/app/api/auth/auth-setup";
import { DtoEventFAQ, DtoEventGallery, DtoEventGift, DtoEventHistory, DtoEventRsvp, DtoGroomBride, DtoMainInfoWedding, DtoScheduler } from "@/lib/dto";
import { CloudflareDeleteFile, CloudflareUploadFile } from "./common";
import Configs from "@/lib/config";
import { EventFAQ, EventGalleries, EventGifts, EventHistories, EventRsvp, GroomBrideInfo, Prisma, PrismaClient, ScheduleInfo } from "@/generated/prisma";
import { User } from "next-auth";
import pLimit from "p-limit";
import { stringWithTimestamp } from "@/lib/utils";

// Groom Bride Info
export async function GetGroomBrideDataByEventId(event_id: number) : Promise<GroomBrideInfo[]> {
  const getData = await db.groomBrideInfo.findMany({ where: { event_id } });
  return getData;
}

export async function StoreUpdateMainInfoWedding(formData: DtoMainInfoWedding) {
  try{
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    if(!user) throw new Error("Authentication credential not Found!");

    const event_id = formData.event_id ?? 0;

    const findEventData = await db.events.findUnique({
      where: { id: event_id }
    });
    if(findEventData && findEventData.couple_img_name && formData.couple_file_img === null) CloudflareDeleteFile(Configs.s3_bucket, findEventData.couple_img_name).catch(err => {});
    if(formData.couple_file_img !== null) {
      if(findEventData && findEventData.couple_img_name) CloudflareDeleteFile(Configs.s3_bucket, findEventData.couple_img_name).catch(err => {});

      var upFile = await CloudflareUploadFile(formData.couple_file_img, "webp", Configs.s3_bucket, "wedding-couple");
      if(upFile != null && upFile.status == true) {
        formData.couple_img_name = upFile.filename;
        formData.couple_img_url = upFile.path;
      };
    };

    await db.$transaction(async (tr) => {
      await tr.events.update({
        where: { id: event_id },
        data: {
          greeting_msg: formData.greeting_msg,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          couple_img_name: formData.couple_img_name,
          couple_img_path: formData.couple_img_url,
          music_url: formData.music_url,
          updatedBy: user?.email
        }
      });

      const groomData = formData.groom_bride.find((x) => x.type === "Groom");
      const brideData = formData.groom_bride.find((x) => x.type === "Bride");
      const tasksGroomBride = [];
      if (groomData) tasksGroomBride.push(upsertGroomBride({ tr, data: groomData, event_id, user }));
      if (brideData) tasksGroomBride.push(upsertGroomBride({ tr, data: brideData, event_id, user }));
      await Promise.all(tasksGroomBride);
    });
  } catch (error: any) {
    throw error;
  }
};

async function upsertGroomBride({
  tr,
  data,
  event_id,
  user
} : {
  tr: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">,
  data: DtoGroomBride | undefined,
  event_id: number,
  user: User
}) {
  if (data === undefined) return;

  const typeGroomBride = data.type.toString().toLowerCase();
  const dataId = data.id ?? 0;

  if (dataId > 0) {
    const existing = await tr.groomBrideInfo.findUnique({
      where: { id: data.id! }
    });

    if (!existing) return;

    // Hapus gambar lama jika img dihapus dari form
    if (existing.img_name && data.img_name === null) CloudflareDeleteFile(Configs.s3_bucket, existing.img_name).catch(() => {});
    // Upload gambar baru
    if (data.file_img) {
      if (existing.img_name) CloudflareDeleteFile(Configs.s3_bucket, existing.img_name).catch(() => {});
      const upFile = await CloudflareUploadFile(data.file_img, "webp", Configs.s3_bucket, `${typeGroomBride}-${data.id}`);
      if (upFile?.status) {
        data.img_name = upFile.filename;
        data.img_url = upFile.path;
      };
    };

    await tr.groomBrideInfo.update({
      where: { id: dataId },
      data: {
        fullname: data.fullname,
        shortname: data.shortname,
        birth_place: data.birth_place,
        birth_date: data.birth_date,
        birth_order: data.birth_order,
        father_name: data.father_name,
        mother_name: data.mother_name,
        place_origin: data.place_origin,
        occupation: data.occupation,
        personal_msg: data.personal_msg,
        img_name: data.img_name,
        img_path: data.img_url,
        updatedBy: user?.email
      }
    });

    return;
  } else {
    const created = await tr.groomBrideInfo.create({
      data: {
        event_id,
        type: data.type,
        fullname: data.fullname,
        shortname: data.shortname,
        birth_place: data.birth_place,
        birth_date: data.birth_date,
        birth_order: data.birth_order,
        father_name: data.father_name,
        mother_name: data.mother_name,
        place_origin: data.place_origin,
        occupation: data.occupation,
        personal_msg: data.personal_msg,
        createdBy: user?.email
      }
    });

    if (data.file_img) {
      const upFile = await CloudflareUploadFile(data.file_img, "webp", Configs.s3_bucket, `${typeGroomBride}-${created.id}`);
      if (upFile?.status) {
        await tr.groomBrideInfo.update({
          where: { id: created.id },
          data: {
            img_name: upFile.filename,
            img_path: upFile.path
          }
        });
      };
    };
  };
};
// End Groom Bride Info

// Schedule Info
export async function GetScheduleByEventId(event_id: number): Promise<ScheduleInfo[]> {
  const getData = await db.scheduleInfo.findMany({ where: { event_id } });
  return getData;
}

export async function StoreUpdateSchedule(event_id: number, formData: DtoScheduler[], schedule_note: string | null) {
  try{
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const existingIds = await db.scheduleInfo.findMany({
      where: { event_id },
      select: {
        id: true
      }
    });
    const incomingIds = new Set(formData.map(item => item.id).filter(id => id != null));
    const idsToDelete = existingIds.filter(item => !incomingIds.has(item.id)).map(item => item.id);

    if(formData.length > 0) {
      await db.$transaction(async (tx) => {
        for (const x of formData) {
          const sch_id = x.id ?? 0;
          const latitude = x.langLat?.[0] ?? 0;
          const longitude = x.langLat?.[1] ?? 0;

          await tx.scheduleInfo.upsert({
            where: {
              id: sch_id,
            },
            update: {
              date: x.date ?? new Date(),
              start_time: x.start_time,
              end_time: x.end_time,
              location: x.loc_name,
              address: x.loc_address,
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              notes: x.notes,
              ceremony_type: x.ceremon_type,
              use_main_loc: x.use_main_loc,
              updatedBy: user?.email,
            },
            create: {
              event_id,
              type: x.type,
              date: x.date ?? new Date(),
              start_time: x.start_time,
              end_time: x.end_time,
              location: x.loc_name,
              address: x.loc_address,
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              notes: x.notes,
              ceremony_type: x.ceremon_type,
              use_main_loc: x.use_main_loc,
              createdBy: user?.email,
            },
          });
        };

        await tx.events.update({
          where: { id: event_id },
          data: { schedule_note }
        });

        if (idsToDelete.length > 0) await tx.scheduleInfo.deleteMany({
          where: {
            id: { in: idsToDelete }
          }
        });
      });
    }
  } catch (error: any) {
    throw error;
  }
};
// End Schedule Info

// Event Galleries
export async function StoreEventGalleries(event_id: number, formData: DtoEventGallery[]) {
  try{
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const limit = pLimit(Configs.p_limit);
    let uploadPromises: Promise<UploadFileRespons>[] = [];
    
    formData.forEach(x => {
      if (x.file !== undefined) {
        const file: File = x.file;
        const setLimit = limit(() => CloudflareUploadFile(
          file,
          "webp",
          Configs.s3_bucket,
          `event-gallery-${event_id}`
        ));
        uploadPromises.push(setLimit);
      }
    });

    if(uploadPromises.length === 0) return;
    const results = await Promise.all(uploadPromises);
    console.log(results)

    const createData = results.map(x => ({
      event_id,
      img_name: x.filename,
      img_path: x.path,
      createdBy: user?.email
    }));
    await db.eventGalleries.createMany({data: createData});
  } catch (error: any) {
    throw error;
  }
};

type GetDataEventGalleriesParams = {
  where?: Prisma.EventGalleriesWhereInput;
  orderBy?: Prisma.EventGalleriesOrderByWithRelationInput | Prisma.EventGalleriesOrderByWithRelationInput[];
  select?: Prisma.EventGalleriesSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetEventGalleryByEventId(event_id: number, params: GetDataEventGalleriesParams): Promise<PaginateResult<EventGalleries>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.eventGalleries.findMany({
      skip,
      take: perPage,
      where: { ...where, event_id },
      orderBy,
      select
    }),
    db.eventGalleries.count({ where: { ...where, event_id } })
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
};

export async function DeleteEventGalleryById(event_id: number, gallery_id: number) {
  try{
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const findGallery = await db.eventGalleries.findUnique({
      where: { id: gallery_id }
    });
    if(!findGallery) throw new Error("Gallery photo not Found!");

    if (findGallery.img_name) CloudflareDeleteFile(Configs.s3_bucket, findGallery.img_name).catch(err => {});
    await db.eventGalleries.delete({
      where: { id: gallery_id, event_id }
    });
  } catch (error: any) {
    throw error;
  }
};
// End Event Galleries

// Event Histories
type GetDataEventHistoriesParams = {
  where?: Prisma.EventHistoriesWhereInput;
  orderBy?: Prisma.EventHistoriesOrderByWithRelationInput | Prisma.EventHistoriesOrderByWithRelationInput[];
  select?: Prisma.EventHistoriesSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataEventHistories(params: GetDataEventHistoriesParams): Promise<PaginateResult<EventHistories & {
  gallery?: EventGalleries | null
}>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.eventHistories.findMany({
      skip,
      take: perPage,
      where,
      orderBy,
      select: {
        ...select,
        gallery: select?.gallery
      }
    }),
    db.eventHistories.count({ where })
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
};

export async function GetDataEventHistoriesById(id: number): Promise<EventHistories | null> {
  const getData = await db.eventHistories.findUnique({
    where: { id }
  });
  return getData;
};

export async function StoreUpdateHistory(event_id: number, formData: DtoEventHistory) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const data_id = formData.id ?? 0;
    const monthYear = formData.month_year.split("-");
    await db.eventHistories.upsert({
      where: { id: data_id },
      update: {
        name: formData.name,
        month: monthYear[1],
        year: monthYear[0],
        desc: formData.desc,
        gallery_id: formData.gallery_id,
        updatedBy: user?.email
      },
      create: {
        event_id,
        name: formData.name,
        month: monthYear[1],
        year: monthYear[0],
        desc: formData.desc,
        gallery_id: formData.gallery_id,
        createdBy: user?.email
      }
    });
  } catch (error: any) {
    throw error;
  }
};

export async function DeleteDataEventHistories(id: number) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    
    await db.eventHistories.delete({
      where: { id }
    });
  } catch (error: any) {
    throw error;
  }
};
// End Event Histories

// Event Gifts
type GetDataEventGiftsParams = {
  where?: Prisma.EventGiftsWhereInput;
  orderBy?: Prisma.EventGiftsOrderByWithRelationInput | Prisma.EventGiftsOrderByWithRelationInput[];
  select?: Prisma.EventGiftsSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataEventGifts(event_id: number, params: GetDataEventGiftsParams): Promise<PaginateResult<EventGifts & {
  gallery?: EventGalleries | null
}>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.eventGifts.findMany({
      skip,
      take: perPage,
      where: { ...where, event_id },
      orderBy,
      select
    }),
    db.eventGifts.count({ where: { ...where, event_id } })
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
};

export async function GetDataEventGiftsById(id: number): Promise<EventGifts | null> {
  const getData = await db.eventGifts.findUnique({
    where: { id }
  });
  return getData;
};

export async function StoreUpdateGift(event_id: number, formData: DtoEventGift) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const data_id = formData.id ?? 0;
    await db.eventGifts.upsert({
      where: { id: data_id },
      update: {
        name: formData.name,
        account: formData.account,
        no_rek: formData.no_rek,
        qty: formData.qty,
        product_url: formData.product_url,
        product_price: formData.product_price,
        updatedBy: user?.email
      },
      create: {
        event_id,
        type: formData.type,
        name: formData.name,
        account: formData.account,
        no_rek: formData.no_rek,
        qty: formData.qty,
        product_url: formData.product_url,
        product_price: formData.product_price,
        createdBy: user?.email
      }
    });
  } catch (error: any) {
    throw error;
  }
};

export async function DeleteDataEventGifts(id: number) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    
    await db.eventGifts.delete({
      where: { id }
    });
  } catch (error: any) {
    throw error;
  }
};
// End Event Gifts

// Event FAQ
type GetDataEventFAQParams = {
  where?: Prisma.EventFAQWhereInput;
  orderBy?: Prisma.EventFAQOrderByWithRelationInput | Prisma.EventFAQOrderByWithRelationInput[];
  select?: Prisma.EventFAQSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataEventFAQ(event_id: number, params: GetDataEventFAQParams): Promise<PaginateResult<EventFAQ & {
  gallery?: EventGalleries | null
}>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.eventFAQ.findMany({
      skip,
      take: perPage,
      where: { ...where, event_id },
      orderBy,
      select
    }),
    db.eventFAQ.count({ where: { ...where, event_id } })
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
};

export async function GetDataEventFAQById(id: number): Promise<EventFAQ | null> {
  const getData = await db.eventFAQ.findUnique({
    where: { id }
  });
  return getData;
};

export async function StoreUpdateEventFAQ(event_id: number, formData: DtoEventFAQ) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const data_id = formData.id ?? 0;
    await db.eventFAQ.upsert({
      where: { id: data_id },
      update: {
        question: formData.question,
        answer: formData.answer,
        updatedBy: user?.email
      },
      create: {
        event_id,
        question: formData.question,
        answer: formData.answer,
        createdBy: user?.email
      }
    });
  } catch (error: any) {
    throw error;
  }
};

export async function DeleteDataEventFAQ(id: number) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    
    await db.eventFAQ.delete({
      where: { id }
    });
  } catch (error: any) {
    throw error;
  }
};
// End Event FAQ

// Event RSVP
type GetDataEventRsvpParams = {
  where?: Prisma.EventRsvpWhereInput;
  orderBy?: Prisma.EventRsvpOrderByWithRelationInput | Prisma.EventRsvpOrderByWithRelationInput[];
  select?: Prisma.EventRsvpSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataEventRsvp(event_id: number, params: GetDataEventRsvpParams): Promise<PaginateResult<EventRsvp & {
  gallery?: EventGalleries | null
}>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.eventRsvp.findMany({
      skip,
      take: perPage,
      where: { ...where, event_id },
      orderBy,
      select
    }),
    db.eventRsvp.count({ where: { ...where, event_id } })
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
};

export async function GetDataRsvpCountStatistics(event_id: number): Promise<RsvpStatsParams> {
  const getCount = await db.eventRsvp.groupBy({
    by: ['att_status'],
    _count: true,
    _sum: {
      att_number: true
    },
    where: {
      event_id
    }
  });

  const stats = {
    total: getCount.reduce((sum, g) => sum + g._count, 0),
    present: getCount.find(g => g.att_status === "PRESENCE")?._count || 0,
    absent: getCount.find(g => g.att_status === "ABSENCE")?._count || 0,
    unknown: getCount.find(g => g.att_status === "UNKNOWN")?._count || 0,
    no_response: getCount.find(g => g.att_status === null)?._count || 0,

    present_persons: getCount.find(g => g.att_status === "PRESENCE")?._sum.att_number || 0,
  }
  return stats;
};

export async function StoreUpdateEventRSVP(event_id: number, formData: DtoEventRsvp) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const data_id = formData.id ?? 0;
    await db.eventRsvp.upsert({
      where: { id: data_id },
      update: {
        name: formData.name,
        phone: formData.phone,
        updatedBy: user?.email
      },
      create: {
        event_id,
        barcode: `${event_id}${stringWithTimestamp.v2(9)}`,
        name: formData.name,
        phone: formData.phone,
        createdBy: user?.email
      }
    });
  } catch (error: any) {
    throw error;
  }
};

export async function GetDataEventRsvpById(id: number): Promise<EventRsvp | null> {
  const getData = await db.eventRsvp.findUnique({
    where: { id }
  });
  return getData;
};

export async function DeleteDataEventRsvp(id: number) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    
    await db.eventRsvp.delete({
      where: { id }
    });
  } catch (error: any) {
    throw error;
  }
};
// End Event RSVP

export async function UpdateShippingAddress(event_id: number, address: string) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    await db.events.update({
      where: { id: event_id },
      data: {
        wishlist_address: address
      }
    });
  } catch (error: any) {
    throw error;
  }
};