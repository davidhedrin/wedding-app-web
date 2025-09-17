"use client";

import BreadcrumbList from '@/components/breadcrumb-list';
import { useLoading } from '@/components/loading/loading-context';
import { Color } from '@/lib/model-types';
import { useSmartLink } from '@/lib/smart-link';
import { calculateRateProduct } from '@/lib/utils';
import { GetDataTemplatesBySlug } from '@/server/systems/catalog';
import { TemplateCaptures, Templates } from '@prisma/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function page() {
  const smartLink = useSmartLink();
  const { setLoading } = useLoading();

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
          console.log(data);
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

  // 👉 Carousel logic
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % captureImage.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? captureImage.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [captureImage.length]);

  return (
    <div>
      {
        dataTemplate ? <>
          <div className='relative w-full pt-20'>
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800/30 to-gray-100 backdrop-blur-xs pointer-events-none -z-30" />
            <div className='max-w-5xl px-4 xl:px-0 mx-auto'>
              <BreadcrumbList className='mb-2' listBr={listBr} />
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
                                className="w-8 h-5"
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
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-3 py-2 rounded-lg transition">
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
