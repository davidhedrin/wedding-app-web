"use server";

import { CommonParams, PaginateResult } from "@/lib/model-types";
import { db } from "../../prisma/db-init";
import { DefaultArgs } from "@prisma/client/runtime/client";
import { auth } from "@/app/api/auth/auth-setup";
import { DtoGroomBride, DtoMainInfoWedding } from "@/lib/dto";
import { CloudflareDeleteFile, CloudflareUploadFile } from "./common";
import Configs from "@/lib/config";
import { Prisma, PrismaClient } from "@/generated/prisma";
import { User } from "next-auth";

export async function StoreUpdateMainInfoWedding(formData: DtoMainInfoWedding) {
  try{
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    if(!user) throw new Error("Authentication credential not Found!");

    const event_id = formData.id ?? 0;

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
  const findExistData = await tr.groomBrideInfo.findUnique({
    where: { id: dataId }
  });

  if(findExistData && findExistData.img_name && data.img_name === null) CloudflareDeleteFile(Configs.s3_bucket, findExistData.img_name).catch(err => {});
  if(data.file_img !== null) {
    if(findExistData && findExistData.img_name) CloudflareDeleteFile(Configs.s3_bucket, findExistData.img_name).catch(err => {});

    var upFile = await CloudflareUploadFile(data.file_img, "webp", Configs.s3_bucket, `${typeGroomBride}-${dataId}`);
    if(upFile != null && upFile.status == true) {
      data.img_name = upFile.filename;
      data.img_url = upFile.path;
    };
  };
  
  await tr.groomBrideInfo.upsert({
    where: { id : dataId },
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
      event_id: event_id,
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
  });
};