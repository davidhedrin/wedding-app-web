"use client";

// pages/invitation.tsx
import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import useCountdown from "@/lib/countdown";
import { formatDate } from "@/lib/utils";

/**
 * Invitation Type: Birthday
 * Theme Name: "Eternal Birthday Moments"
 * Create At: 14-09-2025
 * Create By: David
*/

type FAQItem = { q: string; a: string };

const HERO_BG = "http://localhost:3005/assets/img/birthday-hero1.jpg";

const faqData: FAQItem[] = [
  { q: "Apakah tamu boleh membawa pendamping?", a: "Tentu, mohon konfirmasi pada form RSVP jumlah pendamping jika membawa." },
  { q: "Apakah ada parkir di lokasi?", a: "Ya, tersedia area parkir umum di sekitar lokasi. Disarankan datang sedikit lebih awal." },
  { q: "Dress code apa ya?", a: "Dressy Casual — elegan namun santai. Tema warna aksen emas dan teal." },
  { q: "Boleh kirim hadiah?", a: "Bisa — lihat section Hadiah untuk detail rekening/e-wallet." },
];

const galleryImages = [
  HERO_BG,
  // ulangi / tambahkan placeholder lain jika perlu
  "http://localhost:3005/assets/img/birthday-hero1.jpg",
  "http://localhost:3005/assets/img/birthday-hero1.jpg",
  "http://localhost:3005/assets/img/birthday-hero1.jpg",
];

const TARGET_DATE = new Date();
TARGET_DATE.setDate(TARGET_DATE.getDate() + 12);

export default function InvitationPage() {
  // --- Countdown state and logic ------------------------------------------------
  // Set target date/time (UTC or local). Ganti tanggal sesuai kebutuhan.
  // Contoh: hari ulang tahun 2025-12-05 18:00 (local)
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(TARGET_DATE.toString());

  // --- Carousel (hero background) ------------------------------------------------
  const bgImages = [HERO_BG, ...galleryImages];
  const [bgIndex, setBgIndex] = useState(0);
  const bgTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // auto-play carousel
    bgTimerRef.current = window.setInterval(() => {
      setBgIndex((i) => (i + 1) % bgImages.length);
    }, 5000);
    return () => {
      if (bgTimerRef.current) window.clearInterval(bgTimerRef.current);
    };
  }, []);

  // --- Smooth scroll navigation --------------------------------------------------
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // --- Scroll reveal using IntersectionObserver ---------------------------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("reveal-visible");
            observer.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // --- Gallery slider controls ---------------------------------------------------
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const scrollGallery = (dir: "left" | "right") => {
    const el = galleryRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  // --- RSVP form mock -----------------------------------------------------------
  const [rsvp, setRsvp] = useState({ name: "", email: "", guests: 0, note: "", attending: "yes" });
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitting(true);
    // mock delay
    await new Promise((res) => setTimeout(res, 900));
    setRsvpSubmitting(false);
    setRsvpSuccess(true);
    // Reset form or keep values
    // setRsvp({ name: "", email: "", guests: 0, note: "", attending: "yes" });
  };

  // --- FAQ accordion ------------------------------------------------------------
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // --- Modal for opening invitation (hero button) -------------------------------
  const [openContent, setOpenContent] = useState(false);

  return (
    <>
      <Head>
        <title>Undangan Ulang Tahun — Digital Invite</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Fonts: script for name, playful sans for body */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;600;800&family=Inter:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Global style tweaks for custom animations and fonts */}
      <style jsx global>{`
        html,
        body,
        #__next {
          height: 100%;
        }
        body {
          font-family: "Poppins", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          background: linear-gradient(180deg, rgba(250,253,255,1) 0%, rgba(240,248,250,1) 100%);
          /* subtle background, avoid full white & pink */
        }

        /* reveal animation */
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 700ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .reveal-visible {
          opacity: 1;
          transform: none;
        }

        /* thin glass card */
        .glass {
          background: linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5));
          backdrop-filter: blur(6px) saturate(1.1);
        }

        /* custom countdown digit look */
        .digit {
          font-family: "Inter", sans-serif;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        /* smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* hero background fade */
        .bg-fade {
          transition: opacity 900ms ease;
        }

        /* subtle floating */
        .floaty {
          animation: floaty 6s ease-in-out infinite;
        }
        @keyframes floaty {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }

        /* modal backdrop */
        .modal-backdrop {
          background: rgba(3, 7, 18, 0.6);
          backdrop-filter: blur(3px);
        }

        /* responsive typography tweaks */
        @media (min-width: 768px) {
          .hero-title { font-size: 2.8rem; }
        }
      `}</style>

      {/* Sticky header navigation */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8">
        <nav className="max-w-5xl mx-auto flex items-center justify-between glass rounded-xl shadow-lg p-3 md:p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToId("home")}
              className="flex items-center gap-2 focus:outline-none"
              aria-label="Home"
            >
              <span style={{ fontFamily: '"Great Vibes", cursive' }} className="text-2xl md:text-3xl text-emerald-800">
                Rayakan
              </span>
              <span className="hidden md:inline text-sm text-slate-600">Undangan Ulang Tahun</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a className="nav-link text-sm cursor-pointer text-slate-700 hover:text-emerald-700 transition" onClick={() => scrollToId("home")}>Home</a>
            <a className="nav-link text-sm cursor-pointer text-slate-700 hover:text-emerald-700 transition" onClick={() => scrollToId("welcome")}>Welcome</a>
            <a className="nav-link text-sm cursor-pointer text-slate-700 hover:text-emerald-700 transition" onClick={() => scrollToId("acara")}>Acara</a>
            <a className="nav-link text-sm cursor-pointer text-slate-700 hover:text-emerald-700 transition" onClick={() => scrollToId("galeri")}>Galeri</a>
            <a className="nav-link text-sm cursor-pointer text-slate-700 hover:text-emerald-700 transition" onClick={() => scrollToId("cerita")}>Cerita</a>
            <a className="nav-link text-sm cursor-pointer text-slate-700 hover:text-emerald-700 transition" onClick={() => scrollToId("rsvp")}>RSVP</a>
            <a className="nav-link text-sm cursor-pointer text-slate-700 hover:text-emerald-700 transition" onClick={() => scrollToId("hadiah")}>Hadiah</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToId("rsvp")}
              className="px-3 py-1.5 rounded-full text-sm bg-emerald-700 text-white shadow-md hover:scale-105 transform transition"
            >
              Konfirmasi
            </button>
            <button
              onClick={() => window.open("#")}
              className="p-2 rounded-md text-slate-600 hover:text-emerald-700 transition"
              aria-label="share"
              title="Share"
            >
              {/* simple share icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <path d="M8.6 13.5L15.4 7.5"></path>
                <path d="M15.4 16.5L8.6 10.5"></path>
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-28">
        {/* ---------------- HERO / HOME ---------------- */}
        <section id="home" className="min-h-[80vh] md:min-h-[88vh] relative overflow-hidden flex items-start justify-center">
          {/* background carousel */}
          <div className="absolute inset-0 -z-10">
            {bgImages.map((src, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat bg-fade ${idx === bgIndex ? "opacity-100" : "opacity-0"} transition-opacity duration-900`}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(8,10,12,0.14), rgba(255,255,255,0.14)), url(${src})`,
                  filter: "saturate(1.05) contrast(1.02)",
                }}
              />
            ))}
            {/* subtle confetti overlay */}
            <div className="relative w-full h-full">
              {/* isi hero section / konten lain */}
              <ConfettiOverlay />
            </div>
          </div>

          {/* content single column */}
          <div className="w-full max-w-3xl px-6 md:px-12 text-center py-12">
            <div className="glass rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-md reveal">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800 font-semibold">You're Invited</span>
              </div>

              <h1 className="hero-title text-3xl md:text-4xl font-extrabold text-slate-900 mb-3" style={{ fontFamily: '"Poppins", "Great Vibes", sans-serif' }}>
                <span style={{ fontFamily: '"Great Vibes", cursive' }} className="text-4xl md:text-5xl block text-emerald-800">[Nama Panggilan]</span>
                <span className="text-base md:text-lg block text-slate-700 mt-1">Merayakan Hari Ulang Tahun ke-<span className="font-bold">25</span></span>
              </h1>

              {/* countdown */}
              <div className="mt-6 mb-6">
                {/* Sebelum hari H */}
                {!isExpired && !isToday && (
                  <div className="flex flex-col gap-4 items-center animate-fadeIn">
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 tracking-wide">
                      Hitung mundur menuju hari spesial 🎉
                    </p>

                    <div className="flex gap-3 md:gap-6 items-center justify-center mt-2">
                      {/* Hari */}
                      <div className="px-4 py-3 bg-white/70 dark:bg-slate-700/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 text-emerald-700 dark:text-emerald-300 transition-transform hover:scale-105">
                        <div className="text-2xl md:text-4xl font-bold digit">{days}</div>
                        <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Hari</div>
                      </div>
                      {/* Jam */}
                      <div className="px-4 py-3 bg-white/70 dark:bg-slate-700/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 text-emerald-700 dark:text-emerald-300 transition-transform hover:scale-105">
                        <div className="text-2xl md:text-4xl font-bold digit">
                          {String(hours).padStart(2, "0")}
                        </div>
                        <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Jam</div>
                      </div>
                      {/* Menit */}
                      <div className="px-4 py-3 bg-white/70 dark:bg-slate-700/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 text-emerald-700 dark:text-emerald-300 transition-transform hover:scale-105">
                        <div className="text-2xl md:text-4xl font-bold digit">
                          {String(minutes).padStart(2, "0")}
                        </div>
                        <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Menit</div>
                      </div>
                      {/* Detik */}
                      <div className="px-4 py-3 bg-white/70 dark:bg-slate-700/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 text-emerald-700 dark:text-emerald-300 transition-transform hover:scale-105">
                        <div className="text-2xl md:text-4xl font-bold digit">
                          {String(seconds).padStart(2, "0")}
                        </div>
                        <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Detik</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
                      *Waktu lokal
                    </div>
                  </div>
                )}

                {/* Saat hari H */}
                {isToday && !isExpired && (
                  <div className="p-6 text-center rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 text-white shadow-2xl animate-bounceIn">
                    <div className="text-xl md:text-2xl font-semibold drop-shadow-sm">
                      🎂 Hari Ini!
                    </div>
                    <div className="text-sm md:text-base mt-2 opacity-90">
                      Yuk rayakan bersama, acara dimulai pukul{" "}
                      <span className="font-bold underline decoration-dotted">
                        {formatDate(TARGET_DATE, "long", "short")}
                      </span>
                      .
                    </div>
                  </div>
                )}

                {/* Setelah hari H */}
                {isExpired && (
                  <div className="p-6 text-center rounded-2xl bg-slate-900/90 text-white shadow-lg backdrop-blur-md animate-fadeIn">
                    <div className="text-lg md:text-xl font-semibold">
                      🥳 Sudah Lewat
                    </div>
                    <div className="text-sm md:text-base mt-2 text-slate-300">
                      Terima kasih untuk semua yang hadir dan merayakan.
                      Jangan lupa lihat <span className="font-semibold">galeri</span>
                      dan <span className="font-semibold">momen spesial</span> di bawah ✨
                    </div>
                  </div>
                )}
              </div>

              {/* action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={() => setOpenContent(true)}
                  className="px-6 py-3 rounded-full bg-emerald-700 text-white font-semibold shadow-xl transform hover:-translate-y-1 hover:scale-105 transition"
                >
                  Buka Undangan
                </button>
                <button
                  onClick={() => scrollToId("acara")}
                  className="px-4 py-2 rounded-full border border-emerald-700 text-emerald-700 bg-white/60 hover:bg-emerald-50 transition"
                >
                  Lihat Detail Acara
                </button>
              </div>

              {/* small hint */}
              <div className="text-xs text-slate-500 mt-3">(Geser atau klik tombol untuk membuka seluruh undangan)</div>
            </div>

            {/* background carousel controls */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setBgIndex((i) => (i - 1 + bgImages.length) % bgImages.length)}
                className="p-2 rounded-full bg-white/70 shadow hover:scale-105 transition"
              >
                ◀
              </button>
              <div className="flex gap-2 items-center">
                {bgImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setBgIndex(i)}
                    className={`w-2 h-2 rounded-full ${i === bgIndex ? "bg-emerald-700" : "bg-white/60"} shadow`}
                    aria-label={`bg-${i}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setBgIndex((i) => (i + 1) % bgImages.length)}
                className="p-2 rounded-full bg-white/70 shadow hover:scale-105 transition"
              >
                ▶
              </button>
            </div>
          </div>
        </section>

        {/* =================== Welcome =================== */}
        <section id="welcome" className="py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 reveal">
                <h2 className="text-2xl font-extrabold text-slate-900">Selamat Datang</h2>
                <p className="mt-2 text-slate-600">Dengan penuh suka cita, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam perayaan ulang tahun.</p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <div className="w-full aspect-[4/5] rounded-xl overflow-hidden shadow-lg">
                      <img src={HERO_BG} alt="Foto yang berulang tahun" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="bg-white/80 glass p-4 rounded-xl shadow">
                      <h3 className="text-lg font-semibold">[Nama Lengkap]</h3>
                      <p className="text-sm text-slate-600 mt-1">Usia: <span className="font-bold">25 tahun</span></p>
                      <p className="mt-3 text-slate-700">Sedikit tentang [Nama]: dia suka kopi, musik, dan menghargai momen bersama keluarga dan teman. Acara ini adalah kesempatan untuk berkumpul dan merayakan kebersamaan.</p>
                      <div className="mt-4 flex gap-3">
                        <button onClick={() => scrollToId("cerita")} className="text-sm px-3 py-1.5 rounded-full border border-emerald-700 text-emerald-700 hover:bg-emerald-50 transition">Lihat Cerita</button>
                        <button onClick={() => scrollToId("galeri")} className="text-sm px-3 py-1.5 rounded-full bg-emerald-700 text-white hover:scale-105 transition">Lihat Galeri</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <aside className="hidden md:block reveal">
                <div className="p-4 rounded-xl glass shadow text-center">
                  <div className="text-xs text-slate-500">Quote</div>
                  <div className="mt-2 text-sm italic text-slate-700">"Hidup adalah kumpulan momen — mari tambah satu lagi yang tak terlupakan."</div>
                  <div className="mt-3">
                    <span className="text-xs text-slate-500">Hosted by</span>
                    <div className="text-sm font-semibold">Keluarga [Nama]</div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* =================== Acara =================== */}
        <section id="acara" className="py-12 md:py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6 md:px-8">
            <h2 className="text-2xl font-extrabold reveal">Detail Acara</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 reveal">
                <div className="p-6 rounded-xl glass shadow">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500">Tanggal</div>
                      <div className="font-semibold">{formatDate(TARGET_DATE, "long")}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Waktu</div>
                      <div className="font-semibold">{formatDate(TARGET_DATE, undefined, "short")}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Tempat</div>
                      <div className="font-semibold">Gedung Serbaguna [Nama], Jakarta</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Dress Code</div>
                      <div className="font-semibold">Dressy Casual — aksen emas/teal</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold">Agenda Singkat</h4>
                    <ol className="mt-2 text-sm text-slate-700 list-decimal ml-5">
                      <li>Registrasi & Welcome Drink (17:30)</li>
                      <li>Acara Utama & Sambutan (18:00)</li>
                      <li>Makan Malam & Hiburan (19:00)</li>
                      <li>Pemotongan Kue & Foto Bersama (20:30)</li>
                    </ol>
                  </div>
                </div>

                <div className="mt-6 rounded-xl overflow-hidden shadow reveal">
                  <iframe
                    title="maps"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63247.123456789!2d106.6894!3d-6.2297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6f6e0!2sJakarta!5e0!3m2!1sen!2sid!4v1590000000000!5m2!1sen!2sid"
                    className="w-full aspect-video border-0"
                    loading="lazy"
                  />
                </div>
              </div>

              <aside className="reveal">
                <div className="p-4 rounded-xl glass shadow">
                  <h4 className="text-sm font-semibold">Informasi Tambahan</h4>
                  <ul className="mt-3 text-sm text-slate-700 space-y-2">
                    <li>Parkir: Tersedia area parkir gedung & jalan sekitar.</li>
                    <li>Keamanan: Pemeriksaan tas singkat demi kenyamanan bersama.</li>
                    <li>Kontak Panitia: +62 812 3456 7890</li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* =================== Galeri =================== */}
        <section id="galeri" className="py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <h2 className="text-2xl font-extrabold reveal">Galeri</h2>

            <div className="mt-6 reveal">
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-slate-600">Koleksi momen</div>
                  <div className="flex gap-2">
                    <button onClick={() => scrollGallery("left")} className="px-3 py-1 rounded-full bg-white/80 shadow">◀</button>
                    <button onClick={() => scrollGallery("right")} className="px-3 py-1 rounded-full bg-white/80 shadow">▶</button>
                  </div>
                </div>

                <div ref={galleryRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3">
                  {galleryImages.map((src, idx) => (
                    <div key={idx} className="snap-center min-w-[260px] md:min-w-[340px] rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition">
                      <img src={src} alt={`galeri-${idx}`} className="w-full h-64 object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================== Cerita / Momen Spesial =================== */}
        <section id="cerita" className="py-12 md:py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-5xl mx-auto px-6 md:px-8">
            <h2 className="text-2xl font-extrabold reveal">Cerita & Momen Spesial</h2>

            <div className="mt-6 reveal">
              <ol className="border-l-2 border-emerald-100 ml-4 md:ml-8">
                <li className="mb-8 ml-6">
                  <div className="text-sm text-emerald-700 font-semibold">2000 — Lahir</div>
                  <div className="mt-1 text-slate-700">Sebuah kebahagiaan—keluarga kecil bertambah.</div>
                </li>
                <li className="mb-8 ml-6">
                  <div className="text-sm text-emerald-700 font-semibold">2015 — Sekolah Menengah</div>
                  <div className="mt-1 text-slate-700">Bertemu teman-teman yang menjadi keluarga kedua.</div>
                </li>
                <li className="mb-8 ml-6">
                  <div className="text-sm text-emerald-700 font-semibold">2023 — Awal Karier</div>
                  <div className="mt-1 text-slate-700">Mengambil langkah besar dan membangun mimpi.</div>
                </li>
                <li className="mb-8 ml-6">
                  <div className="text-sm text-emerald-700 font-semibold">2025 — Momen Ini</div>
                  <div className="mt-1 text-slate-700">Merayakan pencapaian dan bersyukur bersama orang-orang tercinta.</div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* =================== RSVP =================== */}
        <section id="rsvp" className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <h2 className="text-2xl font-extrabold reveal">RSVP</h2>

            <div className="mt-6 reveal">
              <form onSubmit={handleRsvpSubmit} className="bg-white/80 glass p-6 rounded-xl shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-600">Nama</label>
                    <input
                      required
                      value={rsvp.name}
                      onChange={(e) => setRsvp((s) => ({ ...s, name: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-200"
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Email / Telepon</label>
                    <input
                      required
                      value={rsvp.email}
                      onChange={(e) => setRsvp((s) => ({ ...s, email: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-200"
                      placeholder="email atau nomor"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Hadir?</label>
                    <select
                      value={rsvp.attending}
                      onChange={(e) => setRsvp((s) => ({ ...s, attending: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200"
                    >
                      <option value="yes">Ya, hadir</option>
                      <option value="no">Maaf, tidak bisa</option>
                      <option value="maybe">Mungkin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Jumlah Tamu</label>
                    <input
                      type="number"
                      min={0}
                      value={rsvp.guests}
                      onChange={(e) => setRsvp((s) => ({ ...s, guests: Number(e.target.value) }))}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm text-slate-600">Pesan / Catatan</label>
                  <textarea
                    value={rsvp.note}
                    onChange={(e) => setRsvp((s) => ({ ...s, note: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 min-h-[90px]"
                    placeholder="Contoh: Saya akan datang bersama 1 pendamping."
                  />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button type="submit" disabled={rsvpSubmitting} className="px-5 py-2 rounded-full bg-emerald-700 text-white font-semibold shadow hover:scale-105 transition">
                    {rsvpSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}
                  </button>

                  <button type="button" onClick={() => { setRsvp({ name: "", email: "", guests: 0, note: "", attending: "yes" }); }} className="px-4 py-2 rounded-full border border-slate-200">
                    Reset
                  </button>

                  {rsvpSuccess && <div className="text-sm text-emerald-700 font-medium">Terima kasih! Konfirmasi Anda telah kami terima.</div>}
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* =================== Hadiah =================== */}
        <section id="hadiah" className="py-12 md:py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <h2 className="text-2xl font-extrabold reveal">Hadiah</h2>

            <div className="mt-6 reveal">
              <div className="p-6 rounded-xl glass shadow">
                <p className="text-slate-700">Kehadiran Anda adalah hadiah terbaik. Jika ingin memberikan kado, berikut beberapa opsi:</p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white/80">
                    <div className="text-xs text-slate-500">Transfer Bank</div>
                    <div className="font-semibold">BCA - 1234567890 a.n. Nama Penerima</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/80">
                    <div className="text-xs text-slate-500">E-Wallet</div>
                    <div className="font-semibold">OVO / GoPay / Dana: +62 812 3456 7890</div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-600">Atau kirim hadiah digital melalui link berikut: <a className="text-emerald-700 underline" href="#">Kirim Hadiah</a></div>
              </div>
            </div>
          </div>
        </section>

        {/* =================== FAQ =================== */}
        <section id="faq" className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <h2 className="text-2xl font-extrabold reveal">FAQ</h2>

            <div className="mt-6 space-y-3 reveal">
              {faqData.map((f, i) => (
                <div key={i} className="bg-white/80 glass p-4 rounded-xl shadow">
                  <button
                    onClick={() => setOpenFaq((cur) => (cur === i ? null : i))}
                    className="w-full flex items-center justify-between text-left"
                    aria-expanded={openFaq === i}
                  >
                    <div>
                      <div className="font-semibold text-slate-800">{f.q}</div>
                      {openFaq === i && <div className="text-sm text-slate-600 mt-1">{f.a}</div>}
                    </div>
                    <div className="ml-4 text-slate-500">{openFaq === i ? "−" : "+"}</div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================== Footer =================== */}
        <footer className="py-8 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div style={{ fontFamily: '"Great Vibes", cursive' }} className="text-2xl">Terima Kasih</div>
              <div className="text-sm text-slate-300">Kami tunggu kehadiran Anda.</div>
            </div>

            <nav className="flex gap-4">
              <button onClick={() => scrollToId("home")} className="text-sm text-slate-300 hover:text-white">Home</button>
              <button onClick={() => scrollToId("acara")} className="text-sm text-slate-300 hover:text-white">Acara</button>
              <button onClick={() => scrollToId("rsvp")} className="text-sm text-slate-300 hover:text-white">RSVP</button>
            </nav>

            <div className="flex items-center gap-3">
              <a className="text-sm text-slate-300 hover:text-white" href="#" aria-label="instagram">IG</a>
              <a className="text-sm text-slate-300 hover:text-white" href="#" aria-label="facebook">FB</a>
              <a className="text-sm text-slate-300 hover:text-white" href="#" aria-label="tiktok">TT</a>
            </div>
          </div>
        </footer>

      </main>

      {/* ---------------- Modal: open invitation (detail overlay) -------------------- */}
      {openContent && (
        <div className="fixed inset-0 z-60 flex items-center justify-center modal-backdrop" role="dialog" aria-modal="true">
          <div className="w-full max-w-3xl mx-4 md:mx-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-extrabold">Detail Undangan</h3>
                  <p className="text-sm text-slate-600 mt-1">Terima kasih sudah membuka undangan — silakan lihat detail acara, konfirmasi, dan galeri.</p>
                </div>
                <button onClick={() => setOpenContent(false)} aria-label="close" className="text-slate-500 hover:text-slate-800">
                  ✕
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden">
                  <img src={HERO_BG} alt="hero" className="w-full h-56 object-cover" />
                </div>
                <div>
                  <div className="text-sm text-slate-700">Tanggal: <span className="font-semibold">{TARGET_DATE.toLocaleDateString()}</span></div>
                  <div className="text-sm text-slate-700 mt-1">Waktu: <span className="font-semibold">{TARGET_DATE.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>
                  <div className="text-sm text-slate-700 mt-3">Lokasi: <span className="font-semibold">Gedung Serbaguna [Nama]</span></div>

                  <div className="mt-4 flex gap-2">
                    <button onClick={() => { setOpenContent(false); scrollToId("rsvp"); }} className="px-3 py-2 rounded-full bg-emerald-700 text-white">Konfirmasi Sekarang</button>
                    <a href="#" onClick={(e) => { e.preventDefault(); window.open("#"); }} className="px-3 py-2 rounded-full border">Lihat Maps</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-100 text-right">
              <button onClick={() => setOpenContent(false)} className="px-4 py-2 rounded-full bg-white border">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ConfettiOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const confs = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 2 + Math.random() * 6,
      vx: -0.5 + Math.random(),
      vy: -1 + Math.random() * 2,
      c: ["#FDE68A", "#34D399", "#60A5FA", "#F472B6"][
        Math.floor(Math.random() * 4)
      ],
      rot: Math.random() * 360,
    }));

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (const c of confs) {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.02;
        c.rot += 1;
        if (c.y > h + 20) {
          c.y = -10;
          c.x = Math.random() * w;
          c.vy = Math.random();
        }
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rot * Math.PI) / 180);
        ctx.fillStyle = c.c;
        ctx.fillRect(-c.r / 2, -c.r / 2, c.r, c.r * 1.8);
        ctx.restore();
      }
      requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}