'use client';

// pages/invitation.tsx
import React, { JSX, useEffect, useRef, useState } from "react";
import Head from "next/head";
import useCountdown from "@/lib/countdown";

/**
 * Invitation Type: Birthday
 * Theme Name: "Cozy Elegance"
 * Create At: 02-10-2025
 * Create By: David
*/

type RSVPData = {
  name: string;
  email: string;
  attending: "yes" | "no" | "maybe";
  guests: number;
  note: string;
};

const TARGET_DATE = new Date();
TARGET_DATE.setDate(TARGET_DATE.getDate() + 12);

const HERO_IMG = "http://localhost:3005/assets/img/birthday-hero1.jpg";

export default function InvitationPage(): JSX.Element {
  // Countdown state
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(TARGET_DATE.toString());

  // Navigation smooth scroll refs
  const homeRef = useRef<HTMLElement | null>(null);
  const welcomeRef = useRef<HTMLElement | null>(null);
  const eventRef = useRef<HTMLElement | null>(null);
  const galleryRef = useRef<HTMLElement | null>(null);
  const storyRef = useRef<HTMLElement | null>(null);
  const rsvpRef = useRef<HTMLElement | null>(null);
  const giftRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  // sticky navbar state for small shadow
  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Simple carousel state
  const carouselImages = [
    HERO_IMG,
    // reuse or add different hosted images if available
    HERO_IMG,
    HERO_IMG,
  ];
  const [carouselIndex, setCarouselIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(id);
  }, [carouselImages.length]);

  // Gallery slider separate
  const galleryImgs = [
    HERO_IMG,
    HERO_IMG,
    HERO_IMG,
    HERO_IMG,
    HERO_IMG,
    HERO_IMG,
  ];
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Scroll reveal: add "is-visible" to elements when entering viewport
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // optional: unobserve to keep it once revealed
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // RSVP form
  const [rsvp, setRsvp] = useState<RSVPData>({
    name: "",
    email: "",
    attending: "yes",
    guests: 0,
    note: "",
  });
  const [rsvpStatus, setRsvpStatus] = useState<null | "sent" | "error">(null);
  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now simulate submission
    try {
      // Here you could call API or send mailto with encoded data.
      // We'll simulate success:
      setRsvpStatus("sent");
      // reset the form lightly
      setTimeout(() => setRsvpStatus(null), 5000);
    } catch {
      setRsvpStatus("error");
    }
  };

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // small helper: scroll to ref
  const scrollToRef = (r: React.RefObject<HTMLElement | null>) => {
    r.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Head>
        <title>Undangan Ulang Tahun — Digital Invite</title>
        <meta name="description" content="Undangan ulang tahun digital yang elegan dan modern." />
        {/* Google Fonts: playful script + modern sans */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Quicksand:wght@300;400;600&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen text-gray-800 antialiased bg-gradient-to-br from-emerald-50 via-slate-100 to-amber-50 relative overflow-hidden">
        {/* global styles for smooth scroll & custom classes */}
        <style jsx global>{`
          html, body, #__next {
            height: 100%;
          }
          html {
            scroll-behavior: smooth;
          }
          /* decorative shapes */
          .shape-glow {
            filter: blur(36px);
            opacity: 0.16;
            transform: translateZ(0);
          }
          /* reveal animation */
          .reveal {
            opacity: 0;
            transform: translateY(18px) scale(0.995);
            transition: opacity 700ms cubic-bezier(.2,.9,.2,1), transform 700ms cubic-bezier(.2,.9,.2,1);
          }
          .reveal.is-visible {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          /* fancy card shadow */
          .card-frost {
            background: linear-gradient(180deg, rgba(255,255,255,0.66), rgba(255,255,255,0.44));
            backdrop-filter: blur(6px) saturate(120%);
            -webkit-backdrop-filter: blur(6px) saturate(120%);
            border: 1px solid rgba(255,255,255,0.28);
          }
          /* subtle premium focus */
          .focus-glow:focus {
            outline: none;
            box-shadow: 0 6px 24px rgba(99,102,241,0.18), 0 2px 8px rgba(16,24,40,0.06);
            transform: translateY(-2px);
          }
        `}</style>

        {/* Decorative shapes (absolute) */}
        <div aria-hidden className="pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-300 via-amber-200 to-indigo-200 opacity-70 blur-sm"></div>
          <div className="absolute top-1/3 -right-48 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-indigo-300 via-sky-200 to-emerald-200 opacity-65 blur-sm"></div>
          <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-300 via-pink-200 to-emerald-300 opacity-50 blur-sm"></div>

          {/* Transparent Circles */}
          <div className="absolute top-20 right-40 w-40 h-40 border-4 border-emerald-200/65 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 left-20 w-32 h-32 border-2 border-indigo-300/65 rounded-full animate-spin-slow"></div>

          {/* Diamond / Polygon */}
          <div className="absolute top-1/2 left-10 w-24 h-24 rotate-45 bg-gradient-to-br from-amber-200/70 to-emerald-200/70 blur-xs"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 rotate-45 bg-gradient-to-tr from-indigo-200/70 to-sky-200/70 blur-xs"></div>
        </div>

        {/* NAV */}
        <header
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-xl transition-all duration-300 ${navScrolled ? "backdrop-blur-md bg-white/40 shadow-md" : "bg-transparent"
            }`}
        >
          <nav className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollToRef(homeRef)}
                className="flex items-center gap-2"
                aria-label="home"
              >
                <div className="w-10 h-10 rounded-full card-frost flex items-center justify-center shadow-sm">
                  <span style={{ fontFamily: "'Great Vibes', cursive" }} className="text-2xl">
                    R
                  </span>
                </div>
              </button>
              <div className="hidden sm:flex items-center gap-1">
                <h3 className="text-sm font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Undangan – R.
                </h3>
                <p className="text-xs text-gray-600">Ulang Tahun ke-XX</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => scrollToRef(homeRef)} className="nav-link">
                Home
              </button>
              <button onClick={() => scrollToRef(welcomeRef)} className="nav-link">
                Welcome
              </button>
              <button onClick={() => scrollToRef(eventRef)} className="nav-link">
                Acara
              </button>
              <button onClick={() => scrollToRef(galleryRef)} className="nav-link">
                Galeri
              </button>
              <button onClick={() => scrollToRef(storyRef)} className="nav-link">
                Cerita
              </button>
              <button onClick={() => scrollToRef(rsvpRef)} className="nav-link">
                RSVP
              </button>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToRef(rsvpRef);
                }}
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-emerald-400 text-white text-sm font-semibold shadow-lg hover:scale-[1.02] transition-transform"
              >
                Konfirmasi
              </a>
            </div>
          </nav>
        </header>

        <main className="pt-28">
          {/* HOME / HERO */}
          <section ref={homeRef} id="home" className="max-w-6xl mx-auto px-4 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left: content */}
              <div className="space-y-6 reveal">
                <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/60 card-frost shadow-sm">
                  <span className="text-xs uppercase font-semibold tracking-wider text-gray-700">You're invited</span>
                  <span className="text-xs text-gray-500">Save the date</span>
                </div>

                <h1
                  className="text-4xl sm:text-5xl md:text-6xl leading-tight font-extrabold"
                  style={{ fontFamily: "'Great Vibes', cursive", color: "rgb(20,24,32)" }}
                >
                  Rayakan Hari Spesial R.
                </h1>

                <p className="text-gray-700 max-w-xl text-lg" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                  Gabung bersama kami merayakan momen penuh tawa, cerita, dan kebahagiaan. Dress code semi-formal —
                  warna hangat direkomendasikan. Nantikan kejutan kecil & suasana cozy yang elegan.
                </p>

                {/* Countdown card */}
                <div className="card-frost p-4 rounded-2xl shadow-xl flex gap-4 items-center flex-col sm:flex-row">
                  {/* Thumbnail / Icon */}
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-200 to-emerald-200 shrink-0">
                    <img
                      src={HERO_IMG}
                      alt="celebrate"
                      className="w-full h-full object-cover rounded-lg shadow-sm"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 w-full text-center sm:text-left">
                    {/* Kondisi Sebelum Hari-H */}
                    {!isToday && !isExpired && (
                      <>
                        <div className="flex gap-3 items-center justify-center sm:justify-start">
                          <div className="text-xs uppercase text-gray-600">Countdown</div>
                          <div className="px-2 py-1 text-xs rounded bg-white/60">Live</div>
                        </div>

                        <div className="mt-2 grid grid-cols-4 gap-2 text-center">
                          <div className="p-2 rounded-lg bg-white/40">
                            <div className="text-2xl font-bold">{days}</div>
                            <div className="text-xs text-gray-600">Hari</div>
                          </div>
                          <div className="p-2 rounded-lg bg-white/40">
                            <div className="text-2xl font-bold">{hours}</div>
                            <div className="text-xs text-gray-600">Jam</div>
                          </div>
                          <div className="p-2 rounded-lg bg-white/40">
                            <div className="text-2xl font-bold">{minutes}</div>
                            <div className="text-xs text-gray-600">Menit</div>
                          </div>
                          <div className="p-2 rounded-lg bg-white/40">
                            <div className="text-2xl font-bold">{seconds}</div>
                            <div className="text-xs text-gray-600">Detik</div>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => scrollToRef(eventRef)}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-400 text-white font-semibold hover:scale-[1.02] transition-transform"
                          >
                            Lihat Detail Acara
                          </button>
                          <button
                            onClick={() => {
                              scrollToRef(welcomeRef);
                              const el = document.querySelector("#open-button");
                              el?.classList.add("animate-pulse");
                              setTimeout(() => el?.classList.remove("animate-pulse"), 800);
                            }}
                            id="open-button"
                            className="px-4 py-2 rounded-lg border border-gray-200 bg-white/80 hover:bg-white focus-glow transition"
                          >
                            Buka Undangan
                          </button>
                        </div>
                      </>
                    )}

                    {/* Kondisi Hari-H */}
                    {isToday && !isExpired && (
                      <>
                        <div className="text-sm text-emerald-700 font-semibold">Hari Ini!</div>
                        <h3 className="mt-1 text-lg font-bold">Selamat Ulang Tahun R. 🎉</h3>
                        <p className="text-gray-600">
                          Acara sedang berlangsung atau akan segera dimulai. Terima kasih atas doanya — kami tunggu kehadiranmu.
                        </p>
                        <div className="mt-3 flex flex-col sm:flex-row gap-3">
                          <a
                            href="#rsvp"
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToRef(rsvpRef);
                            }}
                            className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold"
                          >
                            Konfirmasi Kehadiran
                          </a>
                          <a
                            href={HERO_IMG}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded-lg border"
                          >
                            Lihat Foto Acara
                          </a>
                        </div>
                      </>
                    )}

                    {/* Kondisi Setelah Event */}
                    {isExpired && (
                      <>
                        <div className="text-sm text-gray-500 font-medium">Sudah Terlewat</div>
                        <h3 className="mt-1 text-lg font-bold">Terima kasih sudah menjadi bagian dari momen ini</h3>
                        <p className="text-gray-600">
                          Acara telah berlangsung. Silakan lihat galeri dan cerita momen spesial.
                        </p>
                        <div className="mt-3 flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => scrollToRef(galleryRef)}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
                          >
                            Lihat Galeri
                          </button>
                          <button
                            onClick={() => scrollToRef(storyRef)}
                            className="px-4 py-2 rounded-lg border"
                          >
                            Lihat Cerita
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>

              {/* Right: image + carousel UI */}
              <div className="reveal">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={carouselImages[carouselIndex]}
                    alt="hero"
                    className="w-full h-80 md:h-[420px] object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                  {/* overlay */}
                  <div className="absolute inset-0 flex items-end p-6">
                    <div className="card-frost rounded-xl p-3 backdrop-blur-sm max-w-xs">
                      <div className="text-xs text-gray-600">Tamu Spesial</div>
                      <div className="text-sm font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                        R. — Ulang Tahun ke-XX
                      </div>
                    </div>
                  </div>

                  {/* carousel controls */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {carouselImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCarouselIndex(i)}
                        className={`w-8 h-8 rounded-full border transition ${i === carouselIndex ? "bg-white/90 scale-105" : "bg-white/30"
                          }`}
                        aria-label={`slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* quick stats */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg card-frost text-center">
                    <div className="text-sm text-gray-600">Tamu Undangan</div>
                    <div className="text-lg font-bold">120+</div>
                  </div>
                  <div className="p-3 rounded-lg card-frost text-center">
                    <div className="text-sm text-gray-600">Tema</div>
                    <div className="text-lg font-bold">Cozy Elegance</div>
                  </div>
                  <div className="p-3 rounded-lg card-frost text-center">
                    <div className="text-sm text-gray-600">Dress Code</div>
                    <div className="text-lg font-bold">Semi-Formal</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* WELCOME */}
          <section ref={welcomeRef} id="welcome" className="max-w-5xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 reveal">
                <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Selamat Datang
                </h2>
                <p className="mt-2 text-gray-600 max-w-prose">
                  Terima kasih atas waktu dan perhatianmu. Semoga kehadiranmu membawa kebahagiaan untuk hari spesial ini.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl card-frost flex gap-4 items-center">
                    <img src={HERO_IMG} alt="foto" className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <div className="text-sm font-semibold">R.</div>
                      <div className="text-xs text-gray-600">Umur: 29</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl card-frost">
                    <div className="text-sm text-gray-600">Tentang</div>
                    <div className="mt-2 text-sm">
                      R. adalah pribadi yang hangat, penyuka musik & kopi, yang senang berkumpul bersama teman. Ini adalah
                      momen untuk berbagi cerita dan menciptakan kenangan baru.
                    </div>
                  </div>
                </div>
              </div>

              <div className="reveal">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img src={HERO_IMG} alt="portrait" className="w-full h-64 object-cover" />
                </div>
              </div>
            </div>
          </section>

          {/* ACARA */}
          <section ref={eventRef} id="acara" className="bg-gradient-to-br from-amber-50 to-emerald-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="reveal">
                  <h3 className="text-2xl font-bold">Detail Acara</h3>
                  <p className="mt-2 text-gray-600">Informasi lengkap agar kamu bisa datang tepat waktu.</p>

                  <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl card-frost">
                      <div className="text-xs text-gray-500">Tanggal</div>
                      <div className="text-lg font-semibold">25 Desember 2025</div>
                      <div className="text-sm text-gray-600 mt-1">Mulai 18:00 WIB</div>
                    </div>
                    <div className="p-4 rounded-xl card-frost">
                      <div className="text-xs text-gray-500">Tempat</div>
                      <div className="text-lg font-semibold">Gedung Serbaguna Cahaya</div>
                      <div className="text-sm text-gray-600 mt-1">Jl. Kebahagiaan No. 10, Jakarta</div>
                    </div>
                    <div className="p-4 rounded-xl card-frost">
                      <div className="text-xs text-gray-500">Tema</div>
                      <div className="text-lg font-semibold">Cozy Elegance</div>
                      <div className="text-sm text-gray-600 mt-1">Warna hangat, dekor minimalis</div>
                    </div>
                    <div className="p-4 rounded-xl card-frost">
                      <div className="text-xs text-gray-500">Dress Code</div>
                      <div className="text-lg font-semibold">Semi-Formal</div>
                      <div className="text-sm text-gray-600 mt-1">Kenakan warna netral & hangat</div>
                    </div>
                  </div>
                </div>

                <div className="reveal">
                  <h4 className="text-lg font-semibold">Lokasi (Google Maps)</h4>
                  <div className="mt-3 rounded-xl overflow-hidden border">
                    {/* Google Maps iframe: sesuaikan src dengan lokasi Anda */}
                    <iframe
                      title="maps"
                      src="https://www.google.com/maps?q=Jakarta&output=embed"
                      className="w-full h-64 border-0"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-4 flex gap-3">
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
                    >
                      Buka di Maps
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText("Gedung Serbaguna Cahaya, Jl. Kebahagiaan No.10, Jakarta");
                        const el = document.createElement("div");
                        el.innerText = "Alamat disalin!";
                        document.body.appendChild(el);
                        setTimeout(() => el.remove(), 1200);
                      }}
                      className="px-4 py-2 rounded-lg border"
                    >
                      Salin Alamat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* GALERI */}
          <section ref={galleryRef} id="galeri" className="max-w-6xl mx-auto px-4 py-12">
            <div className="reveal">
              <h3 className="text-2xl font-bold">Galeri</h3>
              <p className="mt-2 text-gray-600">Sejumlah momen indah dari perjalanan hidup R.</p>

              <div className="mt-6">
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <img src={galleryImgs[galleryIndex]} alt={`gallery-${galleryIndex}`} className="w-full h-80 object-cover transition-transform duration-700" />
                  <div className="absolute inset-0 flex items-end p-4">
                    <div className="bg-white/70 card-frost rounded px-3 py-2">
                      <div className="text-sm font-semibold">Foto {galleryIndex + 1}</div>
                      <div className="text-xs text-gray-600">Kenangan manis</div>
                    </div>
                  </div>

                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <button
                      onClick={() => setGalleryIndex((i) => (i - 1 + galleryImgs.length) % galleryImgs.length)}
                      className="w-10 h-10 rounded-full bg-white/80 shadow"
                    >
                      ‹
                    </button>
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <button
                      onClick={() => setGalleryIndex((i) => (i + 1) % galleryImgs.length)}
                      className="w-10 h-10 rounded-full bg-white/80 shadow"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {galleryImgs.map((g, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIndex(i)}
                      className={`overflow-hidden rounded-lg ${i === galleryIndex ? "ring-4 ring-amber-200" : ""}`}
                    >
                      <img src={g} alt={`thumb-${i}`} className="w-full h-20 object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CERITA / MOMEN */}
          <section ref={storyRef} id="cerita" className="bg-gradient-to-br from-emerald-50 to-amber-50 py-12">
            <div className="max-w-5xl mx-auto px-4 reveal">
              <h3 className="text-2xl font-bold">Cerita & Momen Spesial</h3>
              <p className="mt-2 text-gray-600">Perjalanan singkat yang membentuk kenangan berharga.</p>

              <div className="mt-6 space-y-6">
                {[
                  { year: 2000, title: "Awal kisah", text: "Lahir di kota ... momen penuh cinta keluarga." },
                  { year: 2015, title: "Pertemanan", text: "Bertemu teman-teman yang selalu mendukung." },
                  { year: 2020, title: "Petualangan", text: "Mulai menjelajah dunia & bertemu banyak inspirasi." },
                  { year: 2024, title: "Momen Terbaru", text: "Momen-momen kecil yang berarti." },
                ].map((it, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-white/60 card-frost">
                      <div className="text-sm font-semibold">{it.year}</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{it.title}</div>
                      <div className="text-sm text-gray-600">{it.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RSVP */}
          <section ref={rsvpRef} id="rsvp" className="max-w-4xl mx-auto px-4 py-12">
            <div className="reveal">
              <h3 className="text-2xl font-bold">Konfirmasi Kehadiran (RSVP)</h3>
              <p className="mt-2 text-gray-600">Mohon konfirmasi kehadiran agar kami dapat menyiapkan tempat & hidangan.</p>

              <form onSubmit={handleRSVPSubmit} className="mt-6 grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    required
                    placeholder="Nama lengkap"
                    value={rsvp.name}
                    onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })}
                    className="px-4 py-3 rounded-lg border focus-glow"
                  />
                  <input
                    required
                    placeholder="Email"
                    type="email"
                    value={rsvp.email}
                    onChange={(e) => setRsvp({ ...rsvp, email: e.target.value })}
                    className="px-4 py-3 rounded-lg border focus-glow"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <select
                    value={rsvp.attending}
                    onChange={(e) => setRsvp({ ...rsvp, attending: e.target.value as any })}
                    className="px-4 py-3 rounded-lg border"
                  >
                    <option value="yes">Hadir</option>
                    <option value="no">Tidak Hadir</option>
                    <option value="maybe">Mungkin</option>
                  </select>
                  <input
                    type="number"
                    min={0}
                    value={rsvp.guests}
                    onChange={(e) => setRsvp({ ...rsvp, guests: Number(e.target.value) })}
                    className="px-4 py-3 rounded-lg border"
                    placeholder="Jumlah tamu"
                  />
                  <input
                    placeholder="Nomor/WA (opsional)"
                    className="px-4 py-3 rounded-lg border"
                  />
                </div>

                <textarea
                  placeholder="Catatan untuk tuan rumah (opsional)"
                  value={rsvp.note}
                  onChange={(e) => setRsvp({ ...rsvp, note: e.target.value })}
                  className="px-4 py-3 rounded-lg border"
                  rows={4}
                />

                <div className="flex items-center gap-3">
                  <button type="submit" className="px-5 py-3 rounded-lg bg-emerald-500 text-white font-semibold shadow">
                    Kirim Konfirmasi
                  </button>
                  {rsvpStatus === "sent" && <div className="text-emerald-600">Terima kasih! Konfirmasi tersimpan.</div>}
                  {rsvpStatus === "error" && <div className="text-red-500">Terjadi kesalahan, coba lagi.</div>}
                </div>
              </form>
            </div>
          </section>

          {/* HADIAH */}
          <section ref={giftRef} id="hadiah" className="max-w-4xl mx-auto px-4 py-12">
            <div className="reveal">
              <h3 className="text-2xl font-bold">Hadiah</h3>
              <p className="mt-2 text-gray-600">Jika Anda berkenan memberikan hadiah, berikut beberapa pilihan transfer elektronik.</p>

              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl card-frost">
                  <div className="text-xs text-gray-500">Bank</div>
                  <div className="text-lg font-semibold">BCA • 123-456-7890</div>
                  <div className="text-sm text-gray-600 mt-1">a.n R.</div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => navigator.clipboard?.writeText("BCA • 123-456-7890")}
                      className="px-3 py-2 rounded border"
                    >
                      Salin
                    </button>
                    <a href="#" className="px-3 py-2 rounded bg-amber-400 text-white">Buka</a>
                  </div>
                </div>

                <div className="p-4 rounded-xl card-frost">
                  <div className="text-xs text-gray-500">E-Wallet</div>
                  <div className="text-lg font-semibold">OVO • 0812-3456-7890</div>
                  <div className="text-sm text-gray-600 mt-1">a.n R.</div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => navigator.clipboard?.writeText("OVO • 0812-3456-7890")} className="px-3 py-2 rounded border">Salin</button>
                    <a href="#" className="px-3 py-2 rounded bg-indigo-600 text-white">Bayar</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section ref={faqRef} id="faq" className="bg-gradient-to-br from-amber-50 to-emerald-50 py-12">
            <div className="max-w-5xl mx-auto px-4 reveal">
              <h3 className="text-2xl font-bold">FAQ</h3>
              <p className="mt-2 text-gray-600">Pertanyaan umum seputar acara.</p>

              <div className="mt-6 space-y-3">
                {[
                  { q: "Apakah ada parkir?", a: "Tersedia area parkir di halaman gedung." },
                  { q: "Bolehkah membawa anak?", a: "Anak diperbolehkan, harap konfirmasi jumlah saat RSVP." },
                  { q: "Apakah ada makanan khusus?", a: "Kami menyediakan pilihan vegetarian; sebutkan di catatan RSVP." },
                ].map((item, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border bg-white/60 card-frost">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left px-4 py-3 flex justify-between items-center"
                    >
                      <div className="font-semibold">{item.q}</div>
                      <div className="text-gray-500">{openFaq === i ? "-" : "+"}</div>
                    </button>

                    {/* Wrapper dengan animasi max-height */}
                    <div
                      className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${openFaq === i ? "max-h-40" : "max-h-0"
                        }`}
                    >
                      <div className="px-4 pb-4 text-gray-600">{item.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer ref={footerRef} className="py-10">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-6 items-start">
                <div>
                  <div className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>R. — Ulang Tahun</div>
                  <div className="text-sm text-gray-600 mt-2">Terima kasih atas kehadiran & doanya.</div>
                </div>

                <div className="flex gap-4">
                  <div>
                    <div className="text-sm font-semibold">Menu</div>
                    <div className="mt-2 flex flex-col gap-2">
                      <button onClick={() => scrollToRef(homeRef)} className="text-sm text-gray-600">Home</button>
                      <button onClick={() => scrollToRef(eventRef)} className="text-sm text-gray-600">Acara</button>
                      <button onClick={() => scrollToRef(rsvpRef)} className="text-sm text-gray-600">RSVP</button>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold">Ikuti Kami</div>
                    <div className="mt-2 flex gap-2">
                      <a href="#" className="px-3 py-2 rounded bg-gray-100">Instagram</a>
                      <a href="#" className="px-3 py-2 rounded bg-gray-100">TikTok</a>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500">Dibuat dengan ❤ oleh Keluarga & Teman</div>
                  <div className="text-xs text-gray-400 mt-2">© 2025 Undangan Digital</div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
