"use server";

import { CommonParams, PaginateResult, RsvpStatsParams, UploadFileRespons } from "@/lib/model-types";
import { db } from "../../prisma/db-init";
import { DefaultArgs } from "@prisma/client/runtime/client";
import { auth } from "@/app/api/auth/auth-setup";
import { DtoEventFAQ, DtoEventGallery, DtoEventGift, DtoEventHistory, DtoEventRsvp, DtoGroomBride, DtoMainInfoWedding, DtoScanQrRsvp, DtoScheduler, DtoUploadRsvp, DtoWhislistRsvp } from "@/lib/dto";
import { CloudflareDeleteFile, CloudflareUploadAnyFile, CloudflareUploadFile } from "./common";
import Configs from "@/lib/config";
import { EventFAQ, EventGalleries, EventGifts, EventGiftTypeEnum, EventHistories, EventRsvp, GroomBrideInfo, Prisma, PrismaClient, ScheduleInfo, WishlistReservation } from "@/generated/prisma";
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
    var groomData = formData.groom_bride.find((x) => x.type === "Groom");
    var brideData = formData.groom_bride.find((x) => x.type === "Bride");

    const findEventData = await db.events.findUnique({
      where: { id: event_id }
    });
    if(Configs.s3_bucket !== undefined){
      if (groomData) groomData = await uploadImgGroomBride(groomData, event_id);
      if (brideData) brideData = await uploadImgGroomBride(brideData, event_id);

      // if(findEventData && findEventData.couple_img_name && formData.couple_file_img === null) CloudflareDeleteFile(Configs.s3_bucket, findEventData.couple_img_name).catch(err => {});
      if(formData.couple_file_img !== null) {
        var upFile = await CloudflareUploadFile(formData.couple_file_img, "webp", Configs.s3_bucket, "wedding-couple");
        if(upFile != null && upFile.status == true) {
          if(findEventData && findEventData.couple_img_name) CloudflareDeleteFile(Configs.s3_bucket, findEventData.couple_img_name).catch(err => {});
          formData.couple_img_name = upFile.filename;
          formData.couple_img_url = upFile.path;
        };
      };

      if(formData.music_url == Configs.keyCustomMusic) {
        if(findEventData && findEventData.custom_music_r2 && formData.custom_music_file === null) CloudflareDeleteFile(Configs.s3_bucket, findEventData.custom_music_r2).catch(err => {});
        if(formData.custom_music_file !== null) {
          var upFileMusic = await CloudflareUploadAnyFile(formData.custom_music_file, Configs.s3_bucket, "custom-music");
          if(upFileMusic != null && upFileMusic.status == true) {
            if(findEventData && findEventData.custom_music_r2) CloudflareDeleteFile(Configs.s3_bucket, findEventData.custom_music_r2).catch(err => {});
            formData.custom_music_r2 = upFileMusic.filename;
            formData.custom_music_url = upFileMusic.path;
          }
        }
      } else {
        if(findEventData && findEventData.custom_music_r2) CloudflareDeleteFile(Configs.s3_bucket, findEventData.custom_music_r2).catch(err => {});
      }
    }

    await db.$transaction(async (tr) => {
      await tr.events.update({
        where: { id: event_id },
        data: {
          greeting_msg: formData.greeting_msg,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          couple_img_name: formData.couple_img_name,
          couple_img_path: formData.couple_img_url,
          youtube_url: formData.youtube_url,
          music_url: formData.music_url,
          custom_music_url: formData.custom_music_url,
          custom_music_name: formData.custom_music_name,
          custom_music_r2: formData.custom_music_r2,
          updatedBy: user?.email
        }
      });

      const tasksGroomBride = [];
      if (groomData) tasksGroomBride.push(upsertGroomBride({ tr, data: groomData, event_id, user }));
      if (brideData) tasksGroomBride.push(upsertGroomBride({ tr, data: brideData, event_id, user }));
      await Promise.all(tasksGroomBride);
    });
  } catch (error: any) {
    throw error;
  }
};

async function uploadImgGroomBride(data: DtoGroomBride, event_id: number): Promise<DtoGroomBride> {
  if(Configs.s3_bucket !== undefined){
    const groomBrideType = data.type.toString().toLowerCase();
    const dataId = data.id ?? 0;
  
    const existing = await db.groomBrideInfo.findUnique({
      where: { id: dataId }
    });
  
    if(existing){
      if (data.file_img) {
        const upFile = await CloudflareUploadFile(data.file_img, "webp", Configs.s3_bucket, `${groomBrideType}-${event_id}`);
        if (upFile?.status) {
          if (existing.img_name) CloudflareDeleteFile(Configs.s3_bucket, existing.img_name).catch(() => {});
          data.img_name = upFile.filename;
          data.img_url = upFile.path;
        };
      };
    } else {
      if (data.file_img) {
        const upFile = await CloudflareUploadFile(data.file_img, "webp", Configs.s3_bucket, `${groomBrideType}-${event_id}`);
        if (upFile?.status) {
          data.img_name = upFile.filename;
          data.img_url = upFile.path;
        };
      };
    }
  }

  return data;
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
  const dataId = data.id ?? 0;

  await tr.groomBrideInfo.upsert({
    where: { id: dataId },
    update: {
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
    },
    create: {
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
      img_name: data.img_name,
      img_path: data.img_url,
      createdBy: user?.email
    }
  })
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
              youtube_url: x.youtube_url,
              ceremony_type: x.ceremon_type,
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
              youtube_url: x.youtube_url,
              ceremony_type: x.ceremon_type,
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
export async function StoreEventGalleries(event_id: number, formData: DtoEventGallery[]): Promise<boolean> {
  try{
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const limit = pLimit(Configs.p_limit);
    let uploadPromises: Promise<UploadFileRespons>[] = [];
    
    if(Configs.s3_bucket !== undefined){
      formData.forEach(x => {
        if (x.file !== undefined) {
          const file: File = x.file;
          const setLimit = limit(() => CloudflareUploadFile(
            file,
            "webp",
            Configs.s3_bucket ?? "",
            `event-gallery-${event_id}`
          ));
          uploadPromises.push(setLimit);
        }
      });
    }

    if(uploadPromises.length === 0) return false;
    const results = await Promise.allSettled(uploadPromises);
    const failed = results.filter(r => r.status === "rejected");
    if (failed.length > 0) return false;

    const successResults = results.filter((r): r is PromiseFulfilledResult<UploadFileRespons> => r.status === "fulfilled").map((r) => r.value);
    const createData = successResults.map(x => ({
      event_id,
      img_name: x.filename,
      img_path: x.path,
      createdBy: user?.email,
      width: x.width,
      height: x.height,
    }));
    await db.eventGalleries.createMany({data: createData});
    return true;
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

    if (Configs.s3_bucket !== undefined && findGallery.img_name) CloudflareDeleteFile(Configs.s3_bucket, findGallery.img_name).catch(err => {});
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
  _count: { wishlist_reserve: number }
}>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;

  const [data, total] = await Promise.all([
    db.eventGifts.findMany({
      skip,
      take: perPage,
      where: { ...where, event_id },
      orderBy,
      select: {
        ...select,
        _count: {
          select: {
            wishlist_reserve: true,
          }
        }
      }
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

export async function GetDataEventGiftsById(id: number): Promise<EventGifts & { wishlist_reserve: WishlistReservation[] } | null> {
  const getData = await db.eventGifts.findUnique({
    where: { id },
    include: {
      wishlist_reserve: true
    }
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
        qty: formData.qty ?? 0,
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
        qty: formData.qty ?? 0,
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

export async function GetDataWishlistRsv(wishlist_id: number, barcode: string): Promise<WishlistReservation | null> {
  const findData = await db.wishlistReservation.findFirst({
    where: {
      gift_id: wishlist_id,
      barcode
    }
  });

  return findData;
};
// End Event Gifts

// Event FAQ
type GetDataEventFAQParams = {
  where?: Prisma.EventFAQWhereInput;
  orderBy?: Prisma.EventFAQOrderByWithRelationInput | Prisma.EventFAQOrderByWithRelationInput[];
  select?: Prisma.EventFAQSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataEventFAQ(event_id: number, params: GetDataEventFAQParams): Promise<PaginateResult<EventFAQ>> {
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
export async function GetDataEventRsvp(event_id: number, params: GetDataEventRsvpParams): Promise<PaginateResult<EventRsvp>> {
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

export async function StoreUploadExcelRsvp(datas: DtoUploadRsvp[]) {
  try{
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    
    await db.eventRsvp.createMany({
      data: datas
    });
  } catch (error: any) {
    throw error;
  }
}

export async function ChangeDataEventPosting(id: number, status: boolean) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    
    await db.eventRsvp.update({
      where: { id },
      data: {
        show_desc: status
      }
    });
  } catch (error: any) {
    throw error;
  }
};

export async function ScanningQrCodeRsvp(event_id: number, barcode: string): Promise<DtoScanQrRsvp | null> {
  const getData: DtoScanQrRsvp | null = await db.$transaction(async (tx) => {
    const findData = await tx.eventRsvp.findUnique({
      where: { event_id, barcode }
    });
    if(!findData) return null;
    if(findData.att_count > 0) return {
      data: findData,
      isFirst: false,
    };

    const updateData = await tx.eventRsvp.update({
      where: { id: findData.id },
      data: {
        att_count: {
          increment: 1
        }
      }
    });
    return {
      data: updateData,
      isFirst: true,
    };
  });

  return getData;
}

export async function IncreasRscpBarcode(id: number): Promise<DtoScanQrRsvp> {
  const updateData = await db.eventRsvp.update({
    where: { id: id },
    data: {
      att_count: {
        increment: 1
      }
    }
  });

  return {
    data: updateData,
    isFirst: true
  }
}
// End Event RSVP

export async function UpdateShippingAddress(formData: DtoWhislistRsvp) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    await db.events.update({
      where: { id: formData.event_id },
      data: {
        wishlist_recip: formData.wishlist_recip,
        wishlist_phone: formData.wishlist_phone,
        wishlist_address: formData.wishlist_address
      }
    });
  } catch (error: any) {
    throw error;
  }
};