"use client";

import { useLoading } from '@/components/loading/loading-context';
import { useSmartLink } from '@/lib/smart-link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function page() {
  const smartLink = useSmartLink();
  const { setLoading } = useLoading();
  const { push } = useRouter();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('name');

  // Fatch detail here

  //---------------------------------------------------------------
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "http://localhost:3005/assets/img/2149043983.jpg",
    "http://localhost:3005/assets/img/2149043983.jpg",
    "http://localhost:3005/assets/img/2149043983.jpg",
  ];

  // 👉 Contoh Data
  const name = "Undangan Pernikahan Elegan";
  const price = 350000;
  const discountPrice = 199000;
  const shortDescription =
    "Template undangan pernikahan modern, elegan, dan responsif. Cocok untuk acara formal maupun casual.";
  const description = `
    <h2>Deskripsi Lengkap</h2>
    <p>Template undangan dengan desain elegan, responsif, dan dapat di-custom sepenuhnya.</p>
    <p>Fitur utama meliputi:</p>
    <ul>
      <li>Countdown acara otomatis</li>
      <li>Peta lokasi dengan Google Maps</li>
      <li>Tampilan foto & galeri</li>
      <li>Form konfirmasi kehadiran (RSVP)</li>
    </ul>
  `;
  const categoryName = "Pernikahan";
  const badgeName = "Best Seller";

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
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 3500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className='max-w-5xl px-4 xl:px-0 mx-auto py-24'>
      <div className='text-muted text-sm mb-3'>Home {">"} Product Detail  {">"} "Paper Towels"</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Carousel */}
        <div className="relative w-full md:h-[480px] h-[300px] overflow-hidden rounded-xl shadow-lg">
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Preview ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === currentIndex ? "opacity-100" : "opacity-0"
                }`}
            />
          ))}

          {/* Badge */}
          <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            {badgeName}
          </span>

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
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${idx === currentIndex ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </div>

        {/* Detail Info */}
        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold text-indigo-500 uppercase tracking-wide">
            {categoryName}
          </span>
          <h1 className="text-3xl font-bold mt-2 text-gray-800">{name}</h1>

          {/* Harga */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-indigo-600">
              Rp {discountPrice.toLocaleString("id-ID")}
            </span>
            <span className="text-lg line-through text-gray-400">
              Rp {price.toLocaleString("id-ID")}
            </span>
          </div>

          {/* Short Description */}
          <p className="mt-4 text-gray-600">{shortDescription}</p>

          {/* Detail & Spesifikasi */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Detail & Spesifikasi
            </h2>

            <table className="w-full border border-gray-200 text-sm text-gray-600">
              <tbody>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-700 w-1/3">
                    Category
                  </td>
                  <td>: </td>
                  <td className="px-4 py-2">Pernikahan</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-2 font-medium text-gray-700 w-1/3">
                    Colors
                  </td>
                  <td>: </td>
                  <td className="px-4 py-2">Digital Invitation</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-2 font-medium text-gray-700 w-1/3">
                    Language
                  </td>
                  <td>: </td>
                  <td className="px-4 py-2">Indonesia & English</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-700 w-1/3">
                    Layouts
                  </td>
                  <td>: </td>
                  <td className="px-4 py-2">Mobile & Desktop</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tombol Aksi */}
          <div className="mt-8 flex gap-4">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-3 py-2 rounded-lg transition">
              Use Template
            </button>
            <button className="w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold text-sm px-3 py-2 rounded-lg transition">
              Live Preview
            </button>
          </div>
        </div>
      </div>

      {/* Bawah: Description panjang */}
      <div className='mt-10'>
        <h2 className="text-xl font-bold text-gray-800">Description</h2>
        <div
          className="prose prose-indigo max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      {/* Bawah: Ulasan */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Review & Rate</h2>

        {/* Ringkasan skor */}
        <div className="flex items-center gap-6 mb-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-color-app">4.5</p>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="w-6 text-sm">{star}★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-yellow-400 rounded"
                    style={{ width: `${star * 15}%` }} // contoh dummy
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
                    <span className="text-yellow-500 text-sm">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{review.comment}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* List review */}
        {/* <div className="space-y-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">{review.user}</span>
                  <div className="text-right">
                    <span className="block text-yellow-500">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                    <span className="block text-xs text-gray-400 mt-1">
                      {review.date}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{review.comment}</p>
              </div>
            ))}
          </div> */}
      </div>
    </div>
  )
}
