"use client";

import { DtoEvents } from "@/lib/dto";
import { useSmartLink } from "@/lib/smart-link";
import { calculateRateProduct, showConfirm, toast } from "@/lib/utils";
import { userLoginData } from "@/lib/zustand";
import { StoreUpdateDataEvents } from "@/server/event";
import { TemplateCaptures, Templates } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoading } from "./loading/loading-context";

type TemplateCatalogProp = {
  template: Templates & {
    captures: TemplateCaptures[] | null
  };
}

export default function TemplateCatalog({ template }: TemplateCatalogProp) {
  const { push } = useRouter();
  const { setLoading } = useLoading();
  const smartLink = useSmartLink();
  const { statusLogin } = userLoginData();

  const addTemplate = async () => {
    const confirmed = await showConfirm({
      title: 'Add New Event?',
      message: 'Your not preview this template detail yet! Are you sure want to add this template to your event?',
      confirmText: 'Continue',
      cancelText: 'No, Go Back',
      icon: 'bx bx-error bx-tada text-blue-500'
    });
    if (!confirmed) return;

    setLoading(true);
    if (statusLogin !== "authenticated") {
      push("/auth");
      return;
    }

    const createDto: DtoEvents = {
      id: null,
      user_id: null,
      tmp_id: template.id,
      tmp_status: "PENDING",
      tmp_ctg: template.ctg_name ?? "",
      tmp_ctg_key: template.ctg_key ?? ""
    };

    try {
      const eventCode = await StoreUpdateDataEvents(createDto);
      toast({
        type: "success",
        title: "Add successfully",
        message: "New template has been add to your event."
      });
      push(`/client/events/event-detail?code=${eventCode}`);
    } catch (error: any) {
      toast({
        type: "warning",
        title: "Request Failed",
        message: error.message
      });
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition transform">
      {/* Gambar dengan aspect ratio */}
      <div className="relative w-full aspect-[4/3]">
        <Link href={`/template-detail?name=${template.slug}`} onClick={() => smartLink(`/template-detail?name=${template.slug}`)}>
          <img
            src={template.captures ? template.captures[0].file_path : ""}
            alt="Produk"
            className="object-cover w-full h-full"
          />
        </Link>

        {/* Badge */}
        <div className="absolute flex items-center top-3 left-3 gap-x-1.5">
          <span className="inline-flex items-center py-1 px-3 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            {template.ctg_name}
          </span>
          {template.flag_name && (
            <span
              className={`${template.flag_color ?? "bg-indigo-600"} inline-flex items-center text-white text-xs font-semibold px-3 py-1 rounded-full shadow`}
            >
              {template.flag_name}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span>
            ⭐&nbsp;
            {calculateRateProduct({
              rate_1: template.rate_1_count || 0,
              rate_2: template.rate_2_count || 0,
              rate_3: template.rate_3_count || 0,
              rate_4: template.rate_4_count || 0,
              rate_5: template.rate_5_count || 0,
            })}
          </span>
          <span>•</span>
          <span>{template.sold || 0} Choosen</span>
        </div>
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-1 line-clamp-2">
          <Link href={`/template-detail?name=${template.slug}`} onClick={() => smartLink(`/template-detail?name=${template.slug}`)} className='underline'>
            {template.name}
          </Link>
        </h3>
        <p className="text-gray-500 mt-1 text-sm line-clamp-2">
          {template.short_desc}
        </p>

        {/* Harga + Button */}
        <div className="mt-2.5 flex items-center justify-between">
          <div>
            {template.disc_price && template.disc_price > 0 ? (
              <div>
                <p className="text-gray-400 line-through text-sm">
                  Rp {template.price.toLocaleString("id-ID")}
                </p>
                <p className="text-color-app font-bold text-base">
                  Rp {(template.price - template.disc_price).toLocaleString("id-ID")}
                </p>
              </div>
            ) : (
              <p className="text-color-app font-bold text-base">
                Rp {template.price.toLocaleString("id-ID")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button onClick={addTemplate} className="bg-indigo-600 text-white px-3 py-1.5 text-xs md:text-sm rounded-lg font-medium hover:bg-indigo-700 transition">
              Use
            </button>
            <Link
              href={`/${template.url}`}
              className="text-center border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold text-xs md:text-sm px-3 py-1.5 rounded-lg transition"
              target="_blank"
            >
              Preview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

