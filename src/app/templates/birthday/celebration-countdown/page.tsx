'use client';

import useCountdown from "@/lib/countdown";
// Invitation.tsx
import Head from "next/head";
import React, { JSX, useEffect, useMemo, useRef, useState } from "react";

/**
 * Invitation Type: Birthday
 * Theme Name: "Celebration Countdown"
 * Create At: 22-09-2025
 * Create By: David
*/

/* -------------- Konfigurasi (ganti sesuai kebutuhan) ---------------- */
const TARGET_DATE = new Date();
TARGET_DATE.setDate(TARGET_DATE.getDate() + 12);

const CELEBRANT = {
  name: "Nama yang Berulang Tahun",
  age: 27,
  photo: "http://localhost:3005/assets/img/2149043983.jpg",
  description:
    "Merayakan perjalanan penuh warna, tawa, dan kenangan. Yuk hadir dan rayakan hari spesial ini bersama!",
};

const EVENT = {
  title: "Pesta Ulang Tahun",
  locationName: "Cafe Meriah, Jakarta",
  address: "Jl. Contoh No.99, Jakarta",
  dressCode: "Smart Casual (warna hangat dianjurkan)",
  theme: "Tropical Chic",
  mapEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!2m12!1m3!1d3162.00000000000!2d106.000000000000!3d-6.0000000000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDAwJzAwLjAiUyAxMDbCsDAwJzAwLjAiRQ!5e0!3m2!1sid!2sid!4v0000000000000", // placeholder
};

const GALLERY_IMAGES = [
  "http://localhost:3005/assets/img/2149043983.jpg",
  // add more local images if available
  "http://localhost:3005/assets/img/2149043983.jpg",
  "http://localhost:3005/assets/img/2149043983.jpg",
];
/* -------------------------------------------------------------------- */

export default function Invitation(): JSX.Element {
  // Smooth scroll globally
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  // Countdown
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(TARGET_DATE.toString());

  // scroll reveal - simple fade/slide
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("reveal-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // RSVP form state (local only)
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpGuests, setRsvpGuests] = useState<number | "">("");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpWillAttend, setRsvpWillAttend] = useState<boolean | null>(null);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  function handleRsvpSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simpan ke localStorage (demo)
    const existing = JSON.parse(
      (localStorage.getItem("rsvps") as string) || "[]"
    );
    existing.push({
      name: rsvpName,
      guests: rsvpGuests,
      message: rsvpMessage,
      willAttend: rsvpWillAttend,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("rsvps", JSON.stringify(existing));
    setRsvpSubmitted(true);
    // reset
    setRsvpName("");
    setRsvpGuests("");
    setRsvpMessage("");
    setRsvpWillAttend(null);
    setTimeout(() => setRsvpSubmitted(false), 2500);
  }

  // Gallery slider refs
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const scrollGallery = (dir: "left" | "right") => {
    if (!galleryRef.current) return;
    const el = galleryRef.current;
    const width = el.clientWidth;
    el.scrollBy({ left: dir === "left" ? -width : width, behavior: "smooth" });
  };

  // Accordion state for FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // derived formatted date
  const eventDate = useMemo(
    () => new Date(TARGET_DATE).toLocaleString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    []
  );

  return (
    <>
      <Head>
        <title>{CELEBRANT.name} • Undangan Ulang Tahun</title>
        <meta name="description" content={`${CELEBRANT.name} mengundangmu!`} />
        {/* Google Fonts - kombinasi script + sans */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx>{`
        html, body, #__next {
          height: 100%;
        }

        /* fonts */
        h1, h2, h3 {
          color: #fff;
        }

        /* scroll reveal: initial state */
        .reveal {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 700ms ease, transform 700ms ease;
        }
        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* float animations */
        @keyframes float-slow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }

        /* hero background fade */
        .transition-opacity {
          transition-property: opacity, transform;
          transition-duration: 1500ms;
        }

        /* responsive tweaks */
        @media (min-width: 1024px) {
          .count-pill { min-width: 72px; }
        }
        .count-pill {
          min-width: 64px;
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
          padding: 8px 10px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(4px);
        }
      `}</style>

      {/* Page background with decorative shapes */}
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#081126] to-[#081018] text-gray-100">
        {/* decorative SVG shapes (top-left, bottom-right) */}
        <svg
          className="pointer-events-none absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4 opacity-30"
          width="520"
          height="520"
          viewBox="0 0 520 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0" stopColor="#FFB86B" />
              <stop offset="1" stopColor="#FF7AAD" />
            </linearGradient>
          </defs>
          <circle cx="260" cy="260" r="260" fill="url(#g1)" />
        </svg>

        <svg
          className="pointer-events-none absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/4 opacity-20"
          width="420"
          height="420"
          viewBox="0 0 420 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="g2" x1="0" x2="1">
              <stop offset="0" stopColor="#7EE7F7" />
              <stop offset="1" stopColor="#6EE7B7" />
            </linearGradient>
          </defs>
          <rect width="420" height="420" rx="80" fill="url(#g2)" />
        </svg>

        {/* Sticky navigation */}
        <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[92%] md:w-11/12 lg:w-4/5 backdrop-blur-md bg-black/20 border border-white/5 rounded-xl shadow-xl">
          <nav className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex flex-col leading-tight">
                <span className="text-sm text-white/80">Undangan</span>
                <span
                  className="text-lg md:text-xl font-semibold tracking-tight"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {CELEBRANT.name}
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <a href="#home" className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition">
                Home
              </a>
              <a href="#welcome" className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition">
                Welcome
              </a>
              <a href="#acara" className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition">
                Acara
              </a>
              <a href="#galeri" className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition">
                Galeri
              </a>
              <a href="#cerita" className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition">
                Cerita
              </a>
              <a href="#rsvp" className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition">
                RSVP
              </a>
              <a href="#hadiah" className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition">
                Hadiah
              </a>
              <a href="#faq" className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition">
                FAQ
              </a>
            </div>

            <div className="md:hidden">
              {/* mobile hamburger toggles simple menu via anchor links */}
              <details className="relative">
                <summary className="list-none cursor-pointer p-2 rounded-md hover:bg-white/5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M3 12h18M3 18h18" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </summary>
                <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur py-2 rounded-md border border-white/5">
                  <a href="#home" className="block px-4 py-2">Home</a>
                  <a href="#welcome" className="block px-4 py-2">Welcome</a>
                  <a href="#acara" className="block px-4 py-2">Acara</a>
                  <a href="#galeri" className="block px-4 py-2">Galeri</a>
                  <a href="#cerita" className="block px-4 py-2">Cerita</a>
                  <a href="#rsvp" className="block px-4 py-2">RSVP</a>
                  <a href="#hadiah" className="block px-4 py-2">Hadiah</a>
                  <a href="#faq" className="block px-4 py-2">FAQ</a>
                </div>
              </details>
            </div>
          </nav>
        </header>

        {/* Content container */}
        <main className="pt-28 pb-16">
          {/* HOME / HERO */}
          <section id="home" className="relative min-h-[78vh] flex items-center justify-center px-4 md:px-8 lg:px-16">

            {/* hero card */}
            <div className="relative z-10 w-full max-w-6xl rounded-2xl p-6 md:p-10 backdrop-blur bg-white/5 border border-white/6 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                {/* left: textual / countdown */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full w-14 h-14 flex items-center justify-center bg-white/8 border border-white/8">
                      <span className="text-xl font-semibold" style={{ fontFamily: "Great Vibes, cursive" }}>
                        {CELEBRANT.name.split(" ")[0]}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-white/80">You are invited</div>
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: "Great Vibes, cursive" }}>
                        {CELEBRANT.name}
                      </h1>
                      <div className="text-xs text-white/70 mt-1">{EVENT.theme} · {EVENT.locationName}</div>
                    </div>
                  </div>

                  {/* dynamic countdown card */}
                  <div className="mt-2 p-4 rounded-xl bg-gradient-to-r from-white/6 to-white/3 border border-white/8 shadow-inner">
                    {/* Before Event (countdown) */}
                    {!isToday && !isExpired && (
                      <div className="flex flex-col gap-4 w-full">
                        {/* Title */}
                        <div>
                          <div className="text-xs text-white/80 text-center">Countdown menuju hari H</div>
                          <div className="mt-2 flex gap-2 items-center justify-center md:flex-wrap">
                            <div className="count-pill">
                              <div className="text-lg font-bold">{Math.max(0, days)}</div>
                              <div className="text-[11px] text-white/70">Hari</div>
                            </div>
                            <div className="count-pill">
                              <div className="text-lg font-bold">{Math.abs(hours).toString().padStart(2, "0")}</div>
                              <div className="text-[11px] text-white/70">Jam</div>
                            </div>
                            <div className="count-pill">
                              <div className="text-lg font-bold">{Math.abs(minutes).toString().padStart(2, "0")}</div>
                              <div className="text-[11px] text-white/70">Menit</div>
                            </div>
                            <div className="count-pill">
                              <div className="text-lg font-bold">{Math.abs(seconds).toString().padStart(2, "0")}</div>
                              <div className="text-[11px] text-white/70">Detik</div>
                            </div>
                          </div>
                          <div className="text-xs text-white/70 mt-2 text-center">
                            Acara: {eventDate}
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                          <button
                            onClick={() =>
                              document.getElementById("welcome")?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="w-full px-4 py-3 rounded-md bg-gradient-to-r from-[#FFB86B] to-[#FF7AAD] text-black font-semibold hover:scale-[1.02] transform transition"
                          >
                            Buka Undangan
                          </button>
                          <button
                            onClick={() =>
                              document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition"
                          >
                            Konfirmasi Hadir
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Today */}
                    {isToday && (
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
                        <div>
                          <div className="text-xs text-white/80">Hari ini adalah hari spesial!</div>
                          <div
                            className="mt-2 text-2xl font-bold"
                            style={{ fontFamily: "Great Vibes, cursive" }}
                          >
                            Selamat Ulang Tahun, {CELEBRANT.name.split(" ")[0]} 🎉
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={() =>
                              document.getElementById("acara")?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="px-4 py-2 rounded-md bg-[#7EE7F7] text-black font-semibold hover:scale-[1.02] transform transition"
                          >
                            Lihat Detail Acara
                          </button>
                        </div>
                      </div>
                    )}

                    {/* After / Expired */}
                    {isExpired && (
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
                        <div>
                          <div className="text-xs text-white/80">Acara telah berlalu</div>
                          <div className="mt-2 text-lg font-semibold">Terima kasih atas kehadiranmu</div>
                          <div className="text-xs text-white/70 mt-1">Kenangan akan tersimpan selamanya.</div>
                        </div>
                        <div>
                          <button
                            onClick={() =>
                              document.getElementById("galeri")?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="px-4 py-2 rounded-md bg-[#6EE7B7] text-black font-semibold hover:scale-[1.02] transform transition"
                          >
                            Lihat Galeri
                          </button>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* small CTA */}
                  <div className="mt-3 text-sm text-white/80">
                    <span className="font-semibold">{CELEBRANT.name}</span> mengundangmu untuk hadir dan merayakan momen istimewa ini.
                  </div>
                </div>

                {/* right: celebrant photo + interactive small card */}
                <div className="flex items-center justify-center">
                  <div className="w-full rounded-xl overflow-hidden border border-white/6 bg-gradient-to-b from-white/3 to-white/6 p-3 shadow-lg">
                    <div className="relative">
                      <img
                        src={CELEBRANT.photo}
                        alt={CELEBRANT.name}
                        className="w-full h-56 object-cover rounded-lg transform hover:scale-105 transition"
                      />
                      <div className="absolute left-3 bottom-3 bg-black/40 px-3 py-2 rounded-md backdrop-blur">
                        <div className="text-xs text-white/90">Merayakan</div>
                        <div className="text-sm font-semibold" style={{ fontFamily: "Great Vibes, cursive" }}>
                          {CELEBRANT.name}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-white/70">Umur</div>
                          <div className="text-2xl font-bold">{CELEBRANT.age}</div>
                        </div>
                        <div>
                          <button
                            className="px-3 py-2 rounded-md bg-white/6 border border-white/10 hover:bg-white/8 transition"
                            onClick={() => {
                              const shareUrl = typeof window !== "undefined" ? window.location.href : "#";
                              navigator.clipboard?.writeText(shareUrl);
                              alert("Link undangan disalin ke clipboard!");
                            }}
                          >
                            Salin Link
                          </button>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-white/80">{CELEBRANT.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* WELCOME */}
          <section id="welcome" className="reveal mt-12 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto rounded-2xl p-6 md:p-10 bg-gradient-to-r from-white/3 to-white/4 border border-white/6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-1 flex justify-center">
                  <img
                    src={CELEBRANT.photo}
                    alt={CELEBRANT.name}
                    className="w-48 h-48 object-cover rounded-full border-4 border-white/8 shadow-inner transform hover:rotate-1 transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "Great Vibes, cursive" }}>
                    Halo, Selamat datang!
                  </h2>
                  <p className="mt-3 text-white/80">
                    Dengan penuh suka cita kami mengundangmu untuk hadir dalam perayaan ulang tahun{" "}
                    <span className="font-semibold">{CELEBRANT.name}</span>. {CELEBRANT.description}
                  </p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-white/4 border border-white/6">
                      <div className="text-xs text-white/70">Nama</div>
                      <div className="font-semibold">{CELEBRANT.name}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/4 border border-white/6">
                      <div className="text-xs text-white/70">Umur</div>
                      <div className="font-semibold">{CELEBRANT.age}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/4 border border-white/6">
                      <div className="text-xs text-white/70">Tema</div>
                      <div className="font-semibold">{EVENT.theme}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ACARA */}
          <section id="acara" className="reveal mt-10 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto rounded-2xl p-6 md:p-10 bg-gradient-to-r from-white/3 to-white/4 border border-white/6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Detail Acara</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-white/4 border border-white/6">
                    <div className="text-xs text-white/70">Tanggal & Waktu</div>
                    <div className="font-semibold mt-1">{eventDate}</div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/4 border border-white/6">
                    <div className="text-xs text-white/70">Lokasi</div>
                    <div className="font-semibold mt-1">{EVENT.locationName}</div>
                    <div className="text-sm text-white/70 mt-1">{EVENT.address}</div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/4 border border-white/6">
                    <div className="text-xs text-white/70">Dress Code</div>
                    <div className="font-semibold mt-1">{EVENT.dressCode}</div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/4 border border-white/6">
                    <div className="text-xs text-white/70">Catatan</div>
                    <div className="text-sm text-white/80 mt-1">Silakan konfirmasi kehadiran melalui bagian RSVP. Parkir tersedia di lokasi.</div>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden border border-white/6">
                  {/* Google Maps iframe */}
                  <iframe
                    title="Lokasi Acara"
                    src={EVENT.mapEmbedSrc}
                    className="w-full h-80 border-0"
                    loading="lazy"
                    aria-hidden="false"
                    tabIndex={0}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* GALERI */}
          <section id="galeri" className="reveal mt-10 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">Galeri</h3>
              <div className="relative rounded-2xl overflow-hidden bg-white/4 border border-white/6 p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-white/80">Kumpulan foto momen</div>
                  <div className="flex gap-2">
                    <button onClick={() => scrollGallery("left")} className="px-3 py-2 rounded-md bg-white/6">◀</button>
                    <button onClick={() => scrollGallery("right")} className="px-3 py-2 rounded-md bg-white/6">▶</button>
                  </div>
                </div>

                <div ref={galleryRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2">
                  {GALLERY_IMAGES.map((src, idx) => (
                    <div key={idx} className="snap-start min-w-[70%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[24%] rounded-lg overflow-hidden border border-white/6">
                      <img src={src} alt={`gallery-${idx}`} className="w-full h-56 object-cover transform hover:scale-105 transition" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CERITA / MOMEN */}
          <section id="cerita" className="reveal mt-10 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto rounded-2xl p-6 md:p-10 bg-gradient-to-r from-white/3 to-white/4 border border-white/6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Cerita & Momen Spesial</h3>

              <div className="relative timeline pl-4">
                {/* timeline item example - kamu bisa menambah / ubah */}
                {[
                  { year: "2000", title: "Kelahiran", body: "Titik awal perjalanan yang penuh harapan." },
                  { year: "2015", title: "Lulus Sekolah", body: "Menempuh langkah baru menuju mimpi." },
                  { year: "2020", title: "Awal Karier", body: "Langkah kecil membawa banyak pelajaran." },
                  { year: "2024", title: "Momen Spesial", body: "Banyak kenangan dan tawa bersama keluarga & teman." },
                ].map((it, i) => (
                  <div key={i} className="mb-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FFB86B] to-[#FF7AAD] flex items-center justify-center text-black font-bold">{it.year}</div>
                    <div>
                      <div className="font-semibold">{it.title}</div>
                      <div className="text-sm text-white/80 mt-1">{it.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RSVP */}
          <section id="rsvp" className="reveal mt-10 px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto rounded-2xl p-6 md:p-10 bg-gradient-to-r from-white/3 to-white/4 border border-white/6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">RSVP — Konfirmasi Kehadiran</h3>
              <form onSubmit={handleRsvpSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/80">Nama</label>
                  <input
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    className="mt-2 w-full rounded-md px-3 py-2 bg-black/20 border border-white/6 focus:outline-none"
                    placeholder="Nama lengkap"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/80">Jumlah Tamu</label>
                  <input
                    type="number"
                    min={0}
                    value={rsvpGuests === "" ? "" : rsvpGuests}
                    onChange={(e) => setRsvpGuests(e.target.value === "" ? "" : Number(e.target.value))}
                    className="mt-2 w-full rounded-md px-3 py-2 bg-black/20 border border-white/6 focus:outline-none"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-white/80">Will you attend?</label>
                  <div className="mt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRsvpWillAttend(true)}
                      className={`px-4 py-2 rounded-md ${rsvpWillAttend === true ? "bg-[#7EE7F7] text-black" : "bg-white/6"}`}
                    >
                      Ya, hadir
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpWillAttend(false)}
                      className={`px-4 py-2 rounded-md ${rsvpWillAttend === false ? "bg-[#FFB86B] text-black" : "bg-white/6"}`}
                    >
                      Maaf, tidak bisa
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-white/80">Pesan untuk yang berulang tahun (opsional)</label>
                  <textarea
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    className="mt-2 w-full rounded-md px-3 py-2 bg-black/20 border border-white/6 focus:outline-none"
                    rows={4}
                    placeholder="Tulis pesan singkat..."
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-3">
                  <button type="submit" className="px-5 py-2 rounded-md bg-gradient-to-r from-[#FFB86B] to-[#FF7AAD] font-semibold text-black">
                    Kirim Konfirmasi
                  </button>
                  {rsvpSubmitted && <div className="text-sm text-white/80">Terima kasih! Konfirmasi tersimpan (demo).</div>}
                </div>
              </form>
            </div>
          </section>

          {/* HADIAH */}
          <section id="hadiah" className="reveal mt-10 px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto rounded-2xl p-6 md:p-10 bg-gradient-to-r from-white/3 to-white/4 border border-white/6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Hadiah & Donasi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/4 border border-white/6">
                  <div className="text-xs text-white/70">Rekening Bank</div>
                  <div className="font-semibold mt-1">Bank Contoh • 0123456789</div>
                  <div className="text-sm text-white/70 mt-1">a.n. {CELEBRANT.name}</div>
                </div>

                <div className="p-4 rounded-lg bg-white/4 border border-white/6">
                  <div className="text-xs text-white/70">E-Wallet</div>
                  <div className="font-semibold mt-1">GoPay / OVO / Dana • 0812xxxxxxx</div>
                  <div className="text-sm text-white/70 mt-1">Silakan hubungi via WA untuk detail.</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-white/70">Atau klik tombol di bawah untuk membuka link hadiah digital:</div>
              <div className="mt-3">
                <a className="inline-block px-4 py-2 rounded-md bg-white/6 border border-white/8 hover:bg-white/8" href="#" onClick={(e) => e.preventDefault()}>
                  Buka Link Hadiah
                </a>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="reveal mt-10 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto rounded-2xl p-6 md:p-10 bg-gradient-to-r from-white/3 to-white/4 border border-white/6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">FAQ</h3>

              {[
                {
                  q: "Apakah perlu membawa hadiah fisik?",
                  a: "Tidak wajib. Kehadiran dan doa sudah sangat berarti. Jika ingin memberi, info hadiah ada di bagian Hadiah.",
                },
                {
                  q: "Bagaimana dengan parkir?",
                  a: "Tersedia area parkir di sekitar lokasi. Disarankan datang lebih awal untuk tempat parkir yang nyaman.",
                },
                {
                  q: "Apakah acara ramah anak?",
                  a: "Acara ini ramah keluarga, namun harap tetap mengawasi anak demi kenyamanan bersama.",
                },
              ].map((faq, i) => (
                <div key={i} className="mb-3 border border-white/6 rounded-md overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-4 py-3 bg-white/6 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold">{faq.q}</div>
                    </div>
                    <div className="text-white/80">{openFaq === i ? "−" : "+"}</div>
                  </button>
                  <div className={`px-4 py-3 transition-all ${openFaq === i ? "max-h-60" : "max-h-0 overflow-hidden"}`}>
                    <div className="text-sm text-white/80">{faq.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-12 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto rounded-2xl p-6 md:p-10 bg-gradient-to-r from-white/4 to-white/5 border border-white/6 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold" style={{ fontFamily: "Great Vibes, cursive" }}>{CELEBRANT.name}</div>
                  <div className="text-sm text-white/80">Terima kasih atas waktumu — sampai jumpa di acara!</div>
                </div>

                <div className="flex items-center gap-3">
                  <a href="#" className="text-white/80">Instagram</a>
                  <a href="#" className="text-white/80">Facebook</a>
                  <a href="#" className="text-white/80">WhatsApp</a>
                </div>
              </div>

              <div className="mt-6 text-xs text-white/60">© {new Date().getFullYear()} Undangan Digital • dibuat dengan ❤️</div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
