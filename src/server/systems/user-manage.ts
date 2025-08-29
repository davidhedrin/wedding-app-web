"use server";

import { CommonParams, PaginateResult } from "@/lib/model-types";
import { Prisma, User } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { db } from "../../../prisma/db-init";
import { auth } from "@/app/api/auth/auth-setup";
import { DtoUser } from "@/lib/dto";
import { DeleteFile, UploadFile } from "../common";
import Configs from "@/lib/config";

type GetDataUserParams = {
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
  select?: Prisma.UserSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataUser(params: GetDataUserParams): Promise<PaginateResult<User>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.user.findMany({
      skip,
      take: perPage,
      where,
      orderBy,
      select
    }),
    db.user.count({ where })
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

export async function UpdateDataUser(formData: DtoUser) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const data_id = formData.id ?? 0;
    const findUserData = await db.user.findUnique({
      where: { id: data_id }
    });

    const directoryImg = "public/upload/profile";
    if(findUserData && findUserData.image && formData.img_url === null) await DeleteFile(directoryImg, findUserData.image);
    if(formData.file_img !== null) {
      if(findUserData && findUserData.image) await DeleteFile(directoryImg, findUserData.image);
      var upFile = await UploadFile(formData.file_img, directoryImg);
      if(upFile != null && upFile.status == true) {
        formData.img_name = upFile.filename;
        formData.img_url = `${Configs.base_url}/upload/profile/${upFile.filename}`;
      };
    };
    
    await db.user.update({
      where: { id: data_id },
      data: {
        fullname: formData.fullname,
        role: formData.role,
        no_phone: formData.no_phone,
        gender: formData.gender,
        birth_date: formData.birth_date,
        birth_place: formData.birth_place,
        image: formData.img_name,
        image_path: formData.img_url,
        is_active: formData.is_active,
        updatedBy: user?.email
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function GetDataUserById(id: number): Promise<User | null> {
  const getData = await db.user.findUnique({
    where: { id }
  });
  return getData;
};