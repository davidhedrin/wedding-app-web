"use server";

import { CommonParams, PaginateResult } from "@/lib/model-types";
import { db } from "../../prisma/db-init";
import { DefaultArgs } from "@prisma/client/runtime/client";
import { auth } from "@/app/api/auth/auth-setup";
import { DtoMainInfoWedding } from "@/lib/dto";

export async function StoreUpdateMainInfoWedding(formData: DtoMainInfoWedding) {
  try{
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const event_id = formData.id ?? 0;
    await db.$transaction(async (tr) => {
      await tr.events.update({
        where: { id: event_id },
        data: {
          greeting_msg: formData.greeting_msg,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          music_url: formData.music_url,
          updatedBy: user?.email
        }
      });
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}