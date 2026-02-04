"use server";

import { CommonParams, PaginateResult } from "@/lib/model-types";
import { db } from "../../prisma/db-init";
import { DefaultArgs } from "@prisma/client/runtime/client";
import { auth } from "@/app/api/auth/auth-setup";
import { DtoEventGallery, DtoGroomBride, DtoMainInfoWedding, DtoScheduler } from "@/lib/dto";
import { CloudflareDeleteFile, CloudflareUploadFile } from "./common";
import Configs from "@/lib/config";
import { GroomBrideInfo, Prisma, PrismaClient, ScheduleInfo } from "@/generated/prisma";
import { User } from "next-auth";

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
    throw new Error(error.message);
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
    throw new Error(error.message);
  }
};

export async function StoreEventGalleries(event_id: number, formData: DtoEventGallery[]) {
  try{
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    
  } catch (error: any) {
    throw new Error(error.message);
  }
}