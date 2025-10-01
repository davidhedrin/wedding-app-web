"use client";

import useCountdown from "@/lib/countdown";
// pages/invitation.tsx
import Head from "next/head";
import { JSX, useEffect, useRef, useState } from "react";

/**
 * Invitation Type: Birthday
 * Theme Name: "Aurora Celebration"
 * Create At: 10-09-2025
 * Create By: David
*/

const TARGET_DATE = new Date();
TARGET_DATE.setDate(TARGET_DATE.getDate() + 12);

const carouselImages: string[] = [
  "http://localhost:3005/assets/img/2149043983.jpg",
  // Tambahkan URL gambar lain jika tersedia
  "http://localhost:3005/assets/img/2149043983.jpg",
  "http://localhost:3005/assets/img/2149043983.jpg",
];

/** Hook: reveal on scroll (adds class 'reveal' when visible) */
function useScrollReveal(refs: React.RefObject<HTMLElement | null>[]) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
            // keep revealed - remove unobserve if you like
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );

    refs.forEach((r) => {
      if (r.current) observer.observe(r.current);
    });

    return () => observer.disconnect();
  }, [refs]);
}

export default function InvitationPage(): JSX.Element {
  // countdown
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(TARGET_DATE.toString());

  // carousel
  const [index, setIndex] = useState(0);
  const carouselTimer = useRef<number | null>(null);

  // menu open (mobile)
  const [menuOpen, setMenuOpen] = useState(false);

  // RSVP state
  const [rsvp, setRsvp] = useState({ name: "", email: "", attending: "yes", guests: 0, note: "" });
  const [rsvpSent, setRsvpSent] = useState(false);

  // Refs for scroll reveal
  const heroRef = useRef<HTMLElement | null>(null);
  const welcomeRef = useRef<HTMLElement | null>(null);
  const acaraRef = useRef<HTMLElement | null>(null);
  const galeriRef = useRef<HTMLElement | null>(null);
  const ceritaRef = useRef<HTMLElement | null>(null);
  const rsvpRef = useRef<HTMLElement | null>(null);
  const hadiahRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  useScrollReveal([
    heroRef,
    welcomeRef,
    acaraRef,
    galeriRef,
    ceritaRef,
    rsvpRef,
    hadiahRef,
    faqRef,
    footerRef,
  ]);

  // Carousel auto-play
  useEffect(() => {
    carouselTimer.current = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => {
      if (carouselTimer.current) window.clearInterval(carouselTimer.current);
    };
  }, []);

  // Smooth scroll to section
  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // RSVP submit (temporary - simulated)
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submit
    setRsvpSent(true);
    setTimeout(() => {
      // reset form optionally
    }, 1400);
  };

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <Head>
        {/* Fonts: playful script + modern sans */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@300;400;600;800&family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen font-inter text-slate-900 bg-gradient-to-b from-indigo-50 via-sky-50 to-emerald-50">
        {/* Sticky Header */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/30 border-b border-white/10 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => scrollTo("hero")}
              aria-hidden
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md transform-gpu transition-transform hover:scale-105">
                🎉
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Undangan
                </div>
                <div className="text-xs -mt-0.5 text-slate-700">Ulang Tahun</div>
              </div>
            </div>

            <nav className="hidden md:flex gap-6 items-center text-sm">
              {[
                ["hero", "Beranda"],
                ["welcome", "Welcome"],
                ["acara", "Acara"],
                ["galeri", "Galeri"],
                ["cerita", "Cerita"],
                ["rsvp", "RSVP"],
                ["hadiah", "Hadiah"],
                ["faq", "FAQ"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="hover:text-indigo-600 transition-colors font-medium"
                >
                  {label}
                </button>
              ))}
            </nav>

            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen((s) => !s)}
                aria-label="menu"
                className="p-2 rounded-md bg-white/70 shadow hover:scale-105 transition-transform"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-4 mt-2 w-48 bg-white/90 rounded-lg shadow-lg p-3 text-sm">
                  {[
                    ["hero", "Beranda"],
                    ["welcome", "Welcome"],
                    ["acara", "Acara"],
                    ["galeri", "Galeri"],
                    ["cerita", "Cerita"],
                    ["rsvp", "RSVP"],
                    ["hadiah", "Hadiah"],
                    ["faq", "FAQ"],
                  ].map(([id, label]) => (
                    <div key={id} className="py-2">
                      <button onClick={() => scrollTo(id)} className="w-full text-left">
                        {label}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="pt-20">
          {/* HERO */}
          <section
            id="hero"
            ref={heroRef as React.RefObject<HTMLElement>}
            className="relative overflow-hidden"
          >
            {/* Background carousel */}
            <div className="absolute inset-0 -z-10">
              {carouselImages.map((src, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transform-gpu transition-opacity duration-1200 ${i === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
                    }`}
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(7,10,41,0.28), rgba(255,255,255,0.02)), url('${src}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "saturate(1.05) contrast(1.02)",
                  }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/60 pointer-events-none" />
            </div>

            <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Left content */}
                <div className="md:col-span-7">
                  <div className="max-w-2xl">
                    <div className="text-sm uppercase tracking-wide font-semibold text-indigo-700 mb-2">
                      Undangan Spesial
                    </div>

                    <h1
                      className="text-5xl md:text-6xl font-extrabold leading-tight"
                      style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                      Selamat Ulang Tahun, <span className="text-indigo-600">Nama</span>
                    </h1>

                    <p className="mt-4 text-slate-700 text-base md:text-lg font-medium">
                      Kamu diundang untuk merayakan hari istimewa dengan penuh kegembiraan, tawa, dan
                      kenangan. Mari bersama rayakan momen yang tak terlupakan.
                    </p>

                    {/* Countdown card */}
                    <div className="mt-6">
                      <div
                        className={`inline-flex items-center gap-4 p-4 rounded-xl shadow-xl transition-all transform-gpu
      ${!isToday && !isExpired
                            ? "bg-gradient-to-r from-emerald-50 via-sky-50 to-indigo-50 border border-white/30"
                            : isToday
                              ? "bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border border-white/30"
                              : "bg-slate-50/80 border border-white/20"
                          }`}
                      >
                        <div className="text-sm text-slate-600">Countdown</div>
                        <div className="flex gap-2 items-center">
                          {!isToday && !isExpired && (
                            <>
                              <div className="bg-white/90 px-3 py-2 rounded-lg text-center shadow-sm">
                                <div className="text-xs text-slate-500">Hari</div>
                                <div className="text-lg font-semibold">{days}</div>
                              </div>
                              <div className="bg-white/90 px-3 py-2 rounded-lg text-center shadow-sm">
                                <div className="text-xs text-slate-500">Jam</div>
                                <div className="text-lg font-semibold">{String(hours).padStart(2, "0")}</div>
                              </div>
                              <div className="bg-white/90 px-3 py-2 rounded-lg text-center shadow-sm">
                                <div className="text-xs text-slate-500">Menit</div>
                                <div className="text-lg font-semibold">{String(minutes).padStart(2, "0")}</div>
                              </div>
                              <div className="bg-white/90 px-3 py-2 rounded-lg text-center shadow-sm">
                                <div className="text-xs text-slate-500">Detik</div>
                                <div className="text-lg font-semibold">{String(seconds).padStart(2, "0")}</div>
                              </div>
                            </>
                          )}

                          {isToday && (
                            <div className="px-4 py-3 rounded-lg bg-white/95 shadow-md text-amber-700">
                              <div className="text-sm">Hari ini</div>
                              <div className="text-xl font-bold">🎂 Hari H! Yuk rayakan sekarang</div>
                            </div>
                          )}

                          {isExpired && (
                            <div className="px-4 py-3 rounded-lg bg-white/95 shadow-md text-slate-700">
                              <div className="text-sm">Sudah lewat</div>
                              <div className="text-xl font-bold">Terima kasih sudah hadir & merayakan ✨</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>


                    {/* Buttons */}
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => scrollTo("welcome")}
                        className="px-5 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transform-gpu transition"
                      >
                        Buka Undangan
                      </button>

                      <button
                        onClick={() => scrollTo("acara")}
                        className="px-5 py-3 rounded-full border border-indigo-200 bg-white/70 backdrop-blur-sm hover:shadow-md transition"
                      >
                        Cek Detail Acara
                      </button>
                    </div>

                    {/* little interactive chips */}
                    <div className="mt-6 flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs">Dresscode: Konsep Elegan</span>
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs">Tema: Garden Chic</span>
                      <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs">Lokasi: Jakarta</span>
                    </div>
                  </div>
                </div>

                {/* Right visual */}
                <div className="md:col-span-5">
                  <div className="rounded-2xl shadow-2xl overflow-hidden transform-gpu transition-all hover:scale-[1.01]">
                    <div className="relative">
                      <img
                        src={carouselImages[index]}
                        alt="hero visual"
                        className="w-full h-64 md:h-80 object-cover"
                      />
                      <div className="absolute bottom-3 left-3 bg-white/80 rounded-lg px-3 py-2 text-sm shadow">
                        <div className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Nama yang Berulang Tahun
                        </div>
                        <div className="text-xs text-slate-600">Usia • 25 Tahun</div>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          onClick={() => setIndex((i) => (i - 1 + carouselImages.length) % carouselImages.length)}
                          className="p-2 bg-white/80 rounded-full shadow hover:scale-110 transition"
                          aria-label="prev"
                        >
                          ◀
                        </button>
                        <button
                          onClick={() => setIndex((i) => (i + 1) % carouselImages.length)}
                          className="p-2 bg-white/80 rounded-full shadow hover:scale-110 transition"
                          aria-label="next"
                        >
                          ▶
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-b from-white/60 to-white/40">
                      <div className="text-sm text-slate-700">Preview Moment</div>
                      <div className="mt-1 text-xs text-slate-600">
                        Swipe atau gunakan tombol untuk melihat foto lain. Sentuhan kilau (hover) memberikan nuansa premium.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* subtle decorative confetti */}
              <div className="pointer-events-none">
                <svg className="absolute right-4 top-12 w-40 opacity-20" viewBox="0 0 100 100">
                  <circle cx="10" cy="10" r="3" fill="#7c3aed" />
                  <rect x="50" y="20" width="4" height="4" fill="#06b6d4" />
                  <circle cx="80" cy="70" r="2.5" fill="#16a34a" />
                </svg>
              </div>
            </div>

            {/* wave divider */}
            <div className="mt-6">
              <svg viewBox="0 0 1440 80" className="w-full -mb-1" preserveAspectRatio="none">
                <path fill="#ffffff" d="M0,48L48,42.7C96,37,192,27,288,21.3C384,16,480,16,576,21.3C672,27,768,37,864,42.7C960,48,1056,48,1152,53.3C1248,59,1344,69,1392,74.7L1440,80L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
              </svg>
            </div>
          </section>

          {/* Welcome */}
          <section id="welcome" ref={welcomeRef as React.RefObject<HTMLElement>} className="max-w-6xl mx-auto px-6 py-12 reveal:opacity-100 reveal:translate-y-0 transition-all duration-700 opacity-0 translate-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1 flex justify-center md:justify-start">
                <div className="w-44 h-44 md:w-52 md:h-52 rounded-2xl overflow-hidden shadow-2xl transform transition hover:scale-105">
                  <img src={carouselImages[0]} alt="foto" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="md:col-span-2">
                <h2 className="text-3xl font-extrabold" style={{ fontFamily: "'Great Vibes', cursive" }}>
                  Halo, Sahabat!
                </h2>
                <p className="mt-3 text-slate-700">
                  Terima kasih sudah menjadi bagian dari hidupku. Aku berharap kamu bisa hadir dan
                  merayakan bersama pada hari spesial ini. Berikut sedikit perkenalan:
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-white/80 rounded-lg p-3 shadow">
                    <div className="text-xs text-slate-500">Nama</div>
                    <div className="font-semibold">Nama Lengkap</div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 shadow">
                    <div className="text-xs text-slate-500">Usia</div>
                    <div className="font-semibold">25 Tahun</div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 shadow col-span-2">
                    <div className="text-xs text-slate-500">Sedikit Tentang</div>
                    <div className="mt-1 text-sm text-slate-700">
                      Suka kopi, musik indie, dan berkumpul dengan teman. Pernah tinggal di beberapa kota, kini kembali rapat dengan keluarga.
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button onClick={() => scrollTo("acara")} className="px-4 py-2 rounded-md bg-emerald-600 text-white shadow hover:scale-105 transition">
                    Lihat Rincian Acara
                  </button>
                  <button onClick={() => scrollTo("galeri")} className="px-4 py-2 rounded-md border bg-white/70 hover:shadow transition">
                    Lihat Galeri
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Acara */}
          <section
            id="acara"
            ref={acaraRef as React.RefObject<HTMLElement>}
            className="bg-white/40 py-12"
          >
            <div className="max-w-6xl mx-auto px-6">
              {/* Title dan deskripsi di atas */}
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold">Detail Acara</h3>
                <p className="mt-2 text-slate-700">
                  Semua yang perlu kamu ketahui tentang waktu dan tempat acara.
                </p>
              </div>

              {/* Grid konten acara */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Kolom kiri (informasi + maps) */}
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-sky-50 shadow">
                      <div className="text-xs text-slate-500">Tanggal</div>
                      <div className="font-semibold">5 Desember 2025</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Pukul 18:00 - 21:00 WIB
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-lime-50 shadow">
                      <div className="text-xs text-slate-500">Tempat</div>
                      <div className="font-semibold">Garden Hall, Jakarta</div>
                      <div className="text-sm text-slate-600 mt-1">Jl. Contoh No. 123</div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 shadow">
                      <div className="text-xs text-slate-500">Tema</div>
                      <div className="font-semibold">Garden Chic</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Nuansa hangat & elegan
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 shadow">
                      <div className="text-xs text-slate-500">Dress Code</div>
                      <div className="font-semibold">Semi formal / Casual Glam</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Warna netral direkomendasikan
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg overflow-hidden border">
                    <div className="h-64 md:h-80 w-full">
                      {/* Google Maps iframe - update src sesuai lokasi */}
                      <iframe
                        title="lokasi"
                        src="https://www.google.com/maps?q=jakarta&output=embed"
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 bg-white/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="text-sm text-slate-600">Lokasi</div>
                        <div className="font-semibold">
                          Garden Hall — Jl. Contoh No. 123, Jakarta
                        </div>
                      </div>
                      <div>
                        <a
                          href="https://www.google.com/maps"
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm text-center block sm:inline-block hover:shadow-md transition"
                        >
                          Buka di Maps
                        </a>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Kolom kanan (aside) */}
                <aside className="md:col-span-1">
                  <div className="p-4 rounded-xl bg-white/90 shadow">
                    <div className="text-slate-500 text-xs">Agenda</div>
                    <ul className="mt-3 space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500" />
                        <div>
                          <div className="font-medium">18:00</div>
                          <div className="text-slate-600">Sambutan & Pembukaan</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500" />
                        <div>
                          <div className="font-medium">18:30</div>
                          <div className="text-slate-600">Makan malam & Hiburan</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 w-2 h-2 rounded-full bg-amber-500" />
                        <div>
                          <div className="font-medium">20:00</div>
                          <div className="text-slate-600">Pemotongan kue</div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-white shadow">
                    <div className="text-xs text-slate-500">Catatan</div>
                    <div className="mt-2 text-sm text-slate-700">
                      Parkir tersedia di area gedung. Jika membutuhkan akses khusus, hubungi
                      panitia.
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          {/* Galeri */}
          <section id="galeri" ref={galeriRef as React.RefObject<HTMLElement>} className="max-w-6xl mx-auto px-6 py-12 reveal:opacity-100 reveal:translate-y-0 transition-all duration-700 opacity-0 translate-y-6">
            <h3 className="text-2xl font-bold">Galeri</h3>
            <p className="text-slate-600 mt-2">Kumpulan momen berharga — geser atau klik untuk melihat.</p>

            <div className="mt-6">
              <Gallery images={carouselImages} />
            </div>
          </section>

          {/* Cerita / Timeline */}
          <section id="cerita" ref={ceritaRef as React.RefObject<HTMLElement>} className="bg-white/30 py-12">
            <div className="max-w-6xl mx-auto px-6">
              <h3 className="text-2xl font-bold">Cerita & Momen Spesial</h3>
              <p className="text-slate-600 mt-2">Sebuah perjalanan kecil yang penuh arti.</p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <TimelineItem
                  year="2000"
                  title="Kelahiran"
                  body="Permulaan sebuah cerita. Kelahiran yang membawa kebahagiaan bagi keluarga."
                />
                <TimelineItem
                  year="2015"
                  title="Momen Sekolah"
                  body="Bertemu banyak teman, pengalaman yang membentuk kepribadian."
                />
                <TimelineItem
                  year="2020"
                  title="Langkah Baru"
                  body="Mencoba hal baru dan mengejar passion."
                />
                <TimelineItem
                  year="2024"
                  title="Kebersamaan"
                  body="Banyak momen sederhana dengan orang-orang tersayang."
                />
              </div>
            </div>
          </section>

          {/* RSVP */}
          <section id="rsvp" ref={rsvpRef as React.RefObject<HTMLElement>} className="max-w-6xl mx-auto px-6 py-12 reveal:opacity-100 reveal:translate-y-0 transition-all duration-700 opacity-0 translate-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold">RSVP — Konfirmasi Kehadiran</h3>
                <p className="text-slate-600 mt-2">Mohon konfirmasi kehadiranmu supaya kami bisa mempersiapkan tempat dengan baik.</p>

                <form onSubmit={handleRsvpSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    value={rsvp.name}
                    onChange={(e) => setRsvp((s) => ({ ...s, name: e.target.value }))}
                    required
                    placeholder="Nama lengkap"
                    className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                  <input
                    value={rsvp.email}
                    onChange={(e) => setRsvp((s) => ({ ...s, email: e.target.value }))}
                    required
                    placeholder="Email"
                    type="email"
                    className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                  <div className="p-3 rounded-lg border flex items-center gap-3">
                    <label className="text-sm text-slate-600">Hadir?</label>
                    <div className="ml-auto flex gap-2">
                      <label className={`px-3 py-1 rounded ${rsvp.attending === "yes" ? "bg-emerald-600 text-white" : "bg-white"}`}>
                        <input type="radio" name="att" checked={rsvp.attending === "yes"} onChange={() => setRsvp((s) => ({ ...s, attending: "yes" }))} /> Ya
                      </label>
                      <label className={`px-3 py-1 rounded ${rsvp.attending === "no" ? "bg-rose-500 text-white" : "bg-white"}`}>
                        <input type="radio" name="att" checked={rsvp.attending === "no"} onChange={() => setRsvp((s) => ({ ...s, attending: "no" }))} /> Tidak
                      </label>
                    </div>
                  </div>

                  <input
                    value={rsvp.guests}
                    onChange={(e) => setRsvp((s) => ({ ...s, guests: Number(e.target.value) }))}
                    placeholder="Jumlah tamu tambahan"
                    type="number"
                    className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                  <textarea
                    value={rsvp.note}
                    onChange={(e) => setRsvp((s) => ({ ...s, note: e.target.value }))}
                    placeholder="Pesan / kebutuhan khusus"
                    className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:col-span-2"
                  />
                  <div className="sm:col-span-2 flex gap-3">
                    <button type="submit" className="px-5 py-3 rounded-full bg-indigo-600 text-white shadow hover:scale-105 transition">
                      {rsvpSent ? "Terkirim — Terima Kasih!" : "Kirim Konfirmasi"}
                    </button>
                    <button type="button" onClick={() => window.print()} className="px-5 py-3 rounded-full border bg-white/80">
                      Cetak Undangan
                    </button>
                  </div>
                </form>
              </div>

              <aside className="md:col-span-1">
                <div className="p-4 rounded-lg bg-white/90 shadow">
                  <div className="text-sm text-slate-500">Kontak Panitia</div>
                  <div className="font-semibold mt-2">+62 812-3456-7890</div>
                  <div className="text-slate-600 text-sm mt-1">WhatsApp / Telepon</div>

                  <div className="mt-4">
                    <div className="text-xs text-slate-500">Catatan</div>
                    <div className="text-sm text-slate-700 mt-1">Tolong konfirmasi sebelum 25 November 2025.</div>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {/* Hadiah */}
          <section id="hadiah" ref={hadiahRef as React.RefObject<HTMLElement>} className="max-w-6xl mx-auto px-6 py-12 reveal:opacity-100 reveal:translate-y-0 transition-all duration-700 opacity-0 translate-y-6">
            <h3 className="text-2xl font-bold">Hadiah & Amplop Digital</h3>
            <p className="text-slate-600 mt-2">Jika ingin memberi kado, berikut info rekening dan e-wallet.</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white/90 shadow">
                <div className="text-xs text-slate-500">Rekening Bank</div>
                <div className="font-semibold mt-1">Nama Bank • 123-456-789</div>
                <div className="text-sm text-slate-600 mt-1">Atas nama: Nama Penerima</div>
              </div>

              <div className="p-4 rounded-lg bg-white/90 shadow">
                <div className="text-xs text-slate-500">GoPay</div>
                <div className="font-semibold mt-1">+62 812-3456-7890</div>
                <div className="text-sm text-slate-600 mt-1">Nama Penerima</div>
              </div>

              <div className="p-4 rounded-lg bg-white/90 shadow">
                <div className="text-xs text-slate-500">Link Kado</div>
                <div className="font-semibold mt-1 text-indigo-600">https://link.donasi/contoh</div>
                <div className="text-sm text-slate-600 mt-1">Tautan untuk gift registry</div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" ref={faqRef as React.RefObject<HTMLElement>} className="bg-white/30 py-12">
            <div className="max-w-6xl mx-auto px-6">
              <h3 className="text-2xl font-bold">FAQ — Pertanyaan Umum</h3>
              <p className="text-slate-600 mt-2">Jawaban singkat untuk keperluan tamu.</p>

              <div className="mt-6 space-y-3">
                {[
                  { q: "Apakah ada biaya masuk?", a: "Tidak, acara ini gratis. Hanya konfirmasi kehadiran melalui RSVP." },
                  { q: "Apakah tersedia makanan vegetarian?", a: "Tersedia pilihan vegetarian, beri tahu kami di form RSVP." },
                  { q: "Bagaimana dengan parkir?", a: "Parkir tersedia di area gedung (terbatas)." },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/90 rounded-lg p-3 shadow">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left flex items-center justify-between"
                    >
                      <div className="font-medium">{item.q}</div>
                      <div className="text-slate-500">{openFaq === idx ? "−" : "+"}</div>
                    </button>
                    {openFaq === idx && <div className="mt-2 text-slate-700 text-sm">{item.a}</div>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer id="footer" ref={footerRef as React.RefObject<HTMLElement>} className="max-w-6xl mx-auto px-6 py-10 reveal:opacity-100 reveal:translate-y-0 transition-all duration-700 opacity-0 translate-y-6">
            <div className="border-t pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-slate-700">© {new Date().getFullYear()} Undangan Ulang Tahun. Terima kasih sudah mampir!</div>
                <div className="flex items-center gap-4">
                  <nav className="hidden md:flex gap-4 text-sm">
                    <button onClick={() => scrollTo("hero")} className="hover:text-indigo-600">Beranda</button>
                    <button onClick={() => scrollTo("acara")} className="hover:text-indigo-600">Acara</button>
                    <button onClick={() => scrollTo("rsvp")} className="hover:text-indigo-600">RSVP</button>
                  </nav>
                  <div className="flex gap-3">
                    <a title="Instagram" href="#" className="p-2 rounded-full bg-white/80 shadow hover:scale-105 transition">IG</a>
                    <a title="Facebook" href="#" className="p-2 rounded-full bg-white/80 shadow hover:scale-105 transition">FB</a>
                    <a title="WhatsApp" href="#" className="p-2 rounded-full bg-white/80 shadow hover:scale-105 transition">WA</a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <style jsx global>{`
        /* Tailwind fonts fallback: require Tailwind's base to not override */
        :root {
          --script-font: 'Great Vibes', cursive;
        }

        /* Reveal animation */
        .reveal {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        /* small helpers for transitions */
        .transition-opacity {
          transition: opacity 0.6s cubic-bezier(.22,.9,.37,1);
        }
        .transition-transform {
          transition: transform 0.45s cubic-bezier(.22,.9,.37,1);
        }
        /* custom durations */
        .duration-1200 {
          transition-duration: 1200ms;
        }

        /* responsive font stacks */
        .font-inter {
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
        }
      `}</style>
    </>
  );
}

/** Gallery component: simple slider with thumbnails */
function Gallery({ images }: { images: string[] }) {
  const [i, setI] = useState(0);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden shadow-xl">
        <img src={images[i]} alt={`gallery-${i}`} className="w-full h-80 object-cover" />
      </div>

      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setI((x) => (x - 1 + images.length) % images.length)} className="p-2 rounded-md bg-white/90 shadow hover:scale-105 transition">◀</button>
          <div className="flex gap-2 overflow-auto">
            {images.map((src, idx) => (
              <button key={idx} onClick={() => setI(idx)} className={`rounded-lg overflow-hidden border ${idx === i ? "ring-2 ring-indigo-300" : ""}`}>
                <img src={src} alt={`thumb-${idx}`} className="w-20 h-12 object-cover" />
              </button>
            ))}
          </div>
          <button onClick={() => setI((x) => (x + 1) % images.length)} className="p-2 rounded-md bg-white/90 shadow hover:scale-105 transition">▶</button>
        </div>

        <div className="text-sm text-slate-600"> {i + 1} / {images.length}</div>
      </div>
    </div>
  );
}

/** Timeline Item */
function TimelineItem({ year, title, body }: { year: string; title: string; body: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/95 shadow">
      <div className="text-xs text-slate-500">{year}</div>
      <div className="font-semibold mt-1">{title}</div>
      <div className="text-slate-700 mt-2 text-sm">{body}</div>
    </div>
  );
}
