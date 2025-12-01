"use client";

import BreadcrumbList from '@/components/breadcrumb-list';
import { useLoading } from '@/components/loading/loading-context';
import { DtoEvents } from '@/lib/dto';
import { Color } from '@/lib/model-types';
import { useSmartLink } from '@/lib/smart-link';
import { calculateRateProduct, toast } from '@/lib/utils';
import { userLoginData } from '@/lib/zustand';
import { StoreUpdateDataEvents } from '@/server/event';
import { GetDataTemplatesBySlug } from '@/server/systems/catalog';
import { TemplateCaptures, Templates } from '@/generated/prisma';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function page() {
  const { push } = useRouter();
  const smartLink = useSmartLink();
  const { setLoading } = useLoading();
  const { statusLogin } = userLoginData();

  const searchParams = useSearchParams();
  const slugTemplate = searchParams.get('name');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [captureImage, setCaptureImage] = useState<TemplateCaptures[]>([]);
  const [templateColor, setTemplateColor] = useState<Color[]>([]);
  const [dataTemplate, setDataTemplate] = useState<Templates | null>(null);

  const [totalVotes, setTotalVotes] = useState(0);
  const [totalRates, setTotalRates] = useState(0);

  useEffect(() => {
    const firstInit = async () => {
      setLoading(false);
      if (slugTemplate && slugTemplate.trim() !== '') {
        const data = await GetDataTemplatesBySlug(slugTemplate);

        if (data) {
          setDataTemplate(data);
          setCaptureImage(data.captures);
          setTemplateColor(data.colors ? JSON.parse(data.colors) : []);

          const totalVoteRate = (data.rate_1_count || 0) +
            (data.rate_2_count || 0) +
            (data.rate_3_count || 0) +
            (data.rate_4_count || 0) +
            (data.rate_5_count || 0);

          const totalRates = calculateRateProduct({
            rate_1: data.rate_1_count || 0,
            rate_2: data.rate_2_count || 0,
            rate_3: data.rate_3_count || 0,
            rate_4: data.rate_4_count || 0,
            rate_5: data.rate_5_count || 0
          });

          setTotalVotes(totalVoteRate);
          setTotalRates(totalRates);
        }
      }
    };

    firstInit();
  }, [slugTemplate]);

  const listBr = [
    { name: "Home", url: "/" },
    { name: "Template", url: null },
    { name: dataTemplate ? `"${dataTemplate.name}"` : "", url: null }
  ];

  // Fatch detail here

  //---------------------------------------------------------------

  const reviews = [
    {
      user: "Andi",
      comment: "Desainnya keren banget dan mudah dipakai!",
      rating: 5,
      date: "12 Sep 2025",
    },
    {
      user: "Sinta",
      comment: "Simple tapi elegan, keluarga suka banget.",
      rating: 4,
      date: "12 Sep 2025",
    },
  ];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % captureImage.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? captureImage.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [captureImage.length]);

  const addTemplate = async () => {
    if(dataTemplate === null) return;

    setLoading(true);
    if (statusLogin !== "authenticated") {
      push("/auth");
      return;
    }

    const createDto: DtoEvents = {
      id: null,
      user_id: null,
      tmp_id: dataTemplate.id,
      tmp_status: "PENDING",
      tmp_ctg: dataTemplate.ctg_name ?? "",
      tmp_ctg_key: dataTemplate.ctg_key ?? ""
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
    <div>
      {
        dataTemplate ? <>
          <div className='relative w-full pt-20'>
            {/* <div className="absolute -z-30 inset-0 bg-gradient-to-b from-gray-800/25 to-gray-100 backdrop-blur-xs pointer-events-none" />
            <div className="absolute -z-30 top-10 left-10 w-72 h-72 rounded-full bg-indigo-400/70 blur-3xl" />
            <div className="absolute -z-30 bottom-20 right-20 w-80 h-80 rounded-full bg-pink-400/70 blur-3xl" />
            <div className="absolute -z-30 -top-16 right-1/3 w-96 h-96 bg-gradient-to-tr from-purple-400/40 to-blue-400/40 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse" />
            <div className="absolute -z-30 bottom-10 left-1/4 w-32 h-32 bg-teal-400/70 rounded-full blur-xl opacity-60" /> */}

            {/* <div className="absolute -z-30 inset-0 bg-gradient-to-b from-gray-800/25 to-gray-100 backdrop-blur-xs pointer-events-none" />
            <div className="absolute top-0 -left-30 w-[500px] h-[500px] bg-purple-400/40 blur-3xl rounded-full mix-blend-multiply [clip-path:polygon(60%_0%,100%_38%,84%_100%,20%_80%,0%_20%)]" />
            <div className="absolute bottom-0 -right-30 w-[400px] h-[400px] bg-blue-400/40 blur-3xl rounded-full mix-blend-multiply [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]" /> */}

            <ShapeBackground templateColor={templateColor} />

            <div className='max-w-5xl px-4 xl:px-0 mx-auto'>
              <BreadcrumbList className='my-3' listBr={listBr} textColor='text-gray-800' />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Carousel */}
                <div className="relative w-full md:h-[460px] h-[300px] overflow-hidden rounded-xl shadow-lg">
                  {captureImage.map((x, idx) => (
                    <img
                      key={idx}
                      src={x.file_path}
                      alt={`Preview ${idx + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === currentIndex ? "opacity-100" : "opacity-0"}`}
                    />
                  ))}

                  {/* Badge */}
                  {
                    dataTemplate.flag_name && <span className={`absolute top-4 left-4 ${dataTemplate.flag_color ?? "bg-indigo-600"} text-white text-xs font-bold px-3 py-1 rounded-full shadow`}>
                      {dataTemplate.flag_name}
                    </span>
                  }

                  {/* Tombol navigasi */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 rounded-full px-3 py-2 shadow transition"
                  >
                    ◀
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 rounded-full px-3 py-2 shadow transition"
                  >
                    ▶
                  </button>

                  {/* Dot */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {captureImage.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-3 h-3 rounded-full cursor-pointer transition ${idx === currentIndex ? "bg-indigo-600" : "bg-gray-300"}`}
                        onClick={() => setCurrentIndex(idx)}
                      />
                    ))}
                  </div>
                </div>

                {/* Detail Info */}
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-semibold text-indigo-500 uppercase tracking-wide">
                    {dataTemplate.ctg_name}
                  </span>
                  <h1 className="text-2xl font-bold mt-1 text-gray-800">{dataTemplate.name}</h1>

                  <div className="flex items-center mt-1 gap-4">
                    <div className="text-sm text-muted flex items-center gap-2">
                      <span>
                        Rate: ⭐&nbsp;{totalRates}
                      </span>
                      <span>•</span>
                      <span>Chosen: {dataTemplate.sold || 0} times</span>
                    </div>
                  </div>

                  {/* Harga */}
                  {
                    dataTemplate.disc_price ? <div className="mt-3 flex items-center gap-3">
                      <span className="text-lg line-through text-muted">
                        Rp {dataTemplate.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-2xl font-bold text-indigo-600">
                        Rp {(dataTemplate.price - dataTemplate.disc_price).toLocaleString("id-ID")}
                      </span>
                    </div> : <div className='mt-3'>
                      <span className="text-2xl font-bold text-indigo-600">
                        Rp {dataTemplate.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                  }


                  {/* Short Description */}
                  <p className="mt-3 text-gray-600">{dataTemplate.short_desc}</p>

                  {/* Detail & Spesifikasi */}
                  <div className="mt-3">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      Detail & Spesification
                    </h2>

                    <table className="w-full border border-gray-200 text-sm text-gray-600">
                      <tbody>
                        <tr className="bg-gray-50">
                          <td className="px-4 py-2 font-medium text-gray-700 w-1/3">
                            Category
                          </td>
                          <td>: </td>
                          <td className="px-4 py-2">{dataTemplate.ctg_name}</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-4 py-2 font-medium text-gray-700 w-1/3">
                            Colors
                          </td>
                          <td>: </td>
                          <td className="flex items-center px-4 py-2 gap-2">
                            {templateColor.length > 0 ? templateColor.map((x, i) => (
                              <div
                                key={i}
                                className="w-8 h-5 border"
                                style={{ backgroundColor: x.value }}
                              ></div>
                            )) : "-"}
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-4 py-2 font-medium text-gray-700 w-1/3">
                            Language
                          </td>
                          <td>: </td>
                          <td className="px-4 py-2">{dataTemplate.language}</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-4 py-2 font-medium text-gray-700 w-1/3">
                            Layouts
                          </td>
                          <td>: </td>
                          <td className="px-4 py-2">{dataTemplate.layouts}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="mt-6 flex gap-4">
                    <button onClick={addTemplate} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-3 py-2 rounded-lg transition">
                      Use Template
                    </button>
                    <Link href={`/${dataTemplate.url}`} className='text-center w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold text-sm px-3 py-2 rounded-lg transition' target='_blank'>
                      Live Preview
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='max-w-5xl px-4 xl:px-0 mx-auto'>
            {/* Bawah: Description panjang */}
            <div className='mt-10 pt-4 border-t border-gray-300'>
              {/* <h2 className="text-xl font-bold text-gray-800">Description</h2> */}
              <div
                className="prose prose-indigo max-w-none"
                dangerouslySetInnerHTML={{ __html: dataTemplate.desc ?? "" }}
              />
            </div>

            {/* Bawah: Ulasan */}
            <div className="mt-6 pt-4 border-t border-gray-300">
              <div className="text-lg font-semibold text-gray-800 mb-3">Review & Rate</div>

              {/* Ringkasan skor */}
              <div className="flex items-center gap-6 mb-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-color-app">
                    {totalRates}
                  </p>
                </div>
                <div className="flex-1">
                  {[
                    { rate: 5, value: dataTemplate.rate_5_count || 0 },
                    { rate: 4, value: dataTemplate.rate_4_count || 0 },
                    { rate: 3, value: dataTemplate.rate_3_count || 0 },
                    { rate: 2, value: dataTemplate.rate_2_count || 0 },
                    { rate: 1, value: dataTemplate.rate_1_count || 0 }
                  ].map((star, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-6 text-sm">{star.rate}★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded">
                        <div
                          className="h-2 bg-yellow-400 rounded"
                          style={{ width: totalVotes > 0 ? `${(star.value / totalVotes) * 100}%` : '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* List review */}
              <div className="space-y-5">
                {reviews.map((review, idx) => (
                  <div key={idx} className="flex gap-4 border-b border-gray-200 pb-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {review.user.charAt(0)}
                    </div>

                    {/* Isi */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-gray-800">{review.user}</p>
                        <div className='space-x-2'>
                          <span className="text-yellow-500 text-base">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </span>
                          <span className="text-sm text-muted">{review.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm italic">"{review.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </> : <div className='max-w-5xl px-4 xl:px-0 mx-auto pt-20'>
          <div className="animate-pulse h-screen w-full bg-gray-200 rounded-xl dark:bg-neutral-700"></div>
        </div>
      }
    </div>
  )
}

function ShapeBackground({ templateColor }: { templateColor: Color[] }) {
  if (!templateColor || templateColor.length === 0) return null;

  const positions: Array<Record<string, string>> = [
    { top: "0%", left: "0%" },
    { top: "0%", right: "0%" },
    { bottom: "0%", left: "0%" },
    { bottom: "0%", right: "0%" },
    { top: "20%", left: "10%" },
    { top: "20%", right: "10%" },
    { bottom: "20%", left: "30%" },
    { bottom: "20%", right: "30%" },
    { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
  ];

  return (
    <div className="absolute -z-30 inset-0 bg-linear-to-b from-gray-800/30 to-transparent backdrop-blur-xs pointer-events-none">
      {templateColor.map((x, i) => {
        const pos = positions[i % positions.length];

        const maxPx = 300 + (i % 3) * 100;
        const vwPreferred = 30 + (i % 3) * 5;
        const size = `clamp(160px, ${vwPreferred}vw, ${maxPx}px)`;

        return (
          <div
            key={i}
            className="absolute rounded-full blur-xl md:blur-3xl mix-blend-multiply opacity-60"
            style={{
              backgroundColor: x.value,
              width: size,
              height: size,
              ...pos,
            }}
          />
        );
      })}
    </div>
  );
}