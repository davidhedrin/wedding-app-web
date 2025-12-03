"use server";

import { CommonParams, PaginateResult } from "@/lib/model-types";
import { Prisma, TemplateCaptures, Templates } from "@/generated/prisma";
import { db } from "../../../prisma/db-init";
import { DtoTemplates } from "@/lib/dto";
import { auth } from "@/app/api/auth/auth-setup";
import { genSlugify } from "@/lib/utils";
import Configs, { CategoryKeys } from "@/lib/config";
import { DeleteFile, UploadFile } from "../common";
import { DefaultArgs } from "@prisma/client/runtime/client";

type GetDataTemplatesParams = {
  where?: Prisma.TemplatesWhereInput;
  orderBy?: Prisma.TemplatesOrderByWithRelationInput | Prisma.TemplatesOrderByWithRelationInput[];
  select?: Prisma.TemplatesSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataTemplates(params: GetDataTemplatesParams): Promise<PaginateResult<Templates & {
  captures: TemplateCaptures[] | null
}>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.templates.findMany({
      skip,
      take: perPage,
      where,
      orderBy,
      select: {
        ...select,
        captures: select?.captures
      }
    }),
    db.templates.count({ where })
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

export async function StoreUpdateDataTemplates(formData: DtoTemplates) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const data_id = formData.id ?? 0;
    const findCategory = CategoryKeys.find(x => x.key === formData.ctg_key);

    const directoryImg = "public/template";
    await Promise.all(
      formData.captures.map(async (x) => {
        if (x.file !== null) {
          const upFile = await UploadFile(x.file, directoryImg);
          if (upFile?.status) {
            x.file_name = upFile.filename;
            x.file_path = `${Configs.base_url}/template/${upFile.filename}`;
          }
        }
      })
    );

    const fatchDbCapture = await db.templateCaptures.findMany({
      where: { tmp_id: data_id }
    });
    const deletedCaptures = fatchDbCapture.filter((old: any) => !formData.captures.some((cur) =>
      old.id != null && cur.id === old.id ? true : old.file_name && cur.file_name === old.file_name
    ));
    await Promise.all(deletedCaptures.map(async (x: any) => {
      if (x.file_name) await DeleteFile(directoryImg, x.file_name);
      await db.templateCaptures.delete({ where: { id: x.id } });
    }));

    await db.$transaction(async (tx) => {
      const templateData = await tx.templates.upsert({
        where: { id: data_id },
        update: {
          name: formData.name,
          price: formData.price,
          disc_price: formData.disc_price,
          short_desc: formData.short_desc,
          desc: formData.desc,
          ctg_key: formData.ctg_key,
          ctg_name: findCategory?.name,
          url: formData.url,
          flag_name: formData.flag_name,
          flag_color: formData.flag_color,
          language: formData.language,
          layouts: formData.layouts,
          colors: formData.colors,
          is_active: formData.is_active,
          updatedBy: user?.email
        },
        create: {
          slug: genSlugify(formData.name),
          name: formData.name,
          price: formData.price,
          disc_price: formData.disc_price,
          short_desc: formData.short_desc,
          desc: formData.desc,
          ctg_key: formData.ctg_key,
          ctg_name: findCategory?.name,
          url: formData.url,
          flag_name: formData.flag_name,
          flag_color: formData.flag_color,
          language: formData.language,
          layouts: formData.layouts,
          colors: formData.colors,
          is_active: formData.is_active,
          createdBy: user?.email
        }
      });

      const capturesData = formData.captures.filter(x => x.id === null).map(x => ({
        tmp_id: templateData.id,
        index: x.idx,
        file_name: x.file_name ?? "",
        file_path: x.file_path ?? ""
      }));
      if(capturesData.length > 0) await tx.templateCaptures.createMany({
        data: capturesData
      })
    });

  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function GetDataTemplatesById(id: number): Promise<Templates & {
  captures: TemplateCaptures[]
} | null> {
  const getData = await db.templates.findUnique({
    where: { id },
    include: {
      captures: true
    }
  });
  return getData;
};

export async function DeleteDataTemplates(id: number) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    
    await db.templates.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: user?.email
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function GetDataTemplatesBySlug(slug: string): Promise<Templates & {
  captures: TemplateCaptures[]
} | null> {
  const getData = await db.templates.findUnique({
    where: { slug },
    include: {
      captures: true
    }
  });
  return getData;
};