"use server";

import { CommonParams, PaginateResult } from "@/lib/model-types";
import { db } from "../../prisma/db-init";
import { DefaultArgs } from "@prisma/client/runtime/client";
import { auth } from "@/app/api/auth/auth-setup";
import { DtoMainInfoWedding } from "@/lib/dto";
import { CloudflareDeleteFile, CloudflareUploadFile } from "./common";
import Configs from "@/lib/config";

export async function StoreUpdateMainInfoWedding(formData: DtoMainInfoWedding) {
  try{
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const event_id = formData.id ?? 0;

    const findEventData = await db.events.findUnique({
      where: { id: event_id }
    });
    if(findEventData && findEventData.couple_img_name) CloudflareDeleteFile(Configs.s3_bucket, findEventData.couple_img_name).catch(err => {});
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
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}