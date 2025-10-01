'use client';

import useCountdown from "@/lib/countdown";
import { formatDate } from "@/lib/utils";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";

/**
 * Invitation Type: Birthday
 * Theme Name: "Timeless Birthday Elegance"
 * Create At: 25-09-2025
 * Create By: David
*/

type RSVP = {
  name: string;
  guests: number;
  email?: string;
  note?: string;
  coming: "yes" | "no" | "maybe";
};

const TARGET_DATE = new Date();
TARGET_DATE.setDate(TARGET_DATE.getDate() + 12);

export default function Invitation() {
  // === CONFIG: ganti tanggal/waktu/nama/gambar sesuai kebutuhan ===
  const BIRTHDAY_NAME = "Alya Putri";
  const BIRTHDAY_PHOTO = "http://localhost:3005/assets/img/2149043983.jpg";
  const LOCATION_IFRAME =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1234567890123!2d106.827153315315!3d-6.175110000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5e1a1234567%3A0xabcdef1234567890!2sMonas!5e0!3m2!1sen!2sid!4v1690000000000!5m2!1sen!2sid";

  // === state ===
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [rsvpState, setRsvpState] = useState<RSVP>({
    name: "",
    guests: 1,
    email: "",
    note: "",
    coming: "yes",
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});
  const [revealMap, setRevealMap] = useState(false);

  // demo carousel images (kamu bisa ganti array ini)
  const carouselImages = [
    BIRTHDAY_PHOTO,
    BIRTHDAY_PHOTO,
    BIRTHDAY_PHOTO,
    // tambahkan path lain bila ada
  ];

  // countdown
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(TARGET_DATE.toString());

  // carousel autoplay
  useEffect(() => {
    const id = setInterval(() => {
      setCarouselIndex((p) => (p + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [carouselImages.length]);

  // keyboard left/right for carousel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCarouselIndex((p) => (p - 1 + carouselImages.length) % carouselImages.length);
      if (e.key === "ArrowRight") setCarouselIndex((p) => (p + 1) % carouselImages.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [carouselImages.length]);

  // smooth scroll helper
  function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // focus for accessibility
      (el as HTMLElement).focus({ preventScroll: true });
    }
  }

  // reveal on scroll (IntersectionObserver)
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-active");
            obs.unobserve(e.target);
            if ((e.target as HTMLElement).id === "map") setRevealMap(true);
          }
        });
      },
      { threshold: 0.12 }
    );
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // RSVP submit (simulasi - simpan localStorage)
  function handleRsvpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem("rsvps") || "[]");
    existing.push({ ...rsvpState, ts: Date.now() });
    localStorage.setItem("rsvps", JSON.stringify(existing));
    setRsvpSubmitted(true);
    // small confetti effect (CSS)
    document.documentElement.classList.add("rsvp-sent");
    setTimeout(() => document.documentElement.classList.remove("rsvp-sent"), 2500);
  }

  // FAQ sample
  const faqs = [
    { q: "Apakah undangan bersifat pribadi?", a: "Ya, ini adalah undangan personal. Mohon konfirmasi kehadiran melalui form RSVP." },
    { q: "Apakah anak-anak boleh ikut?", a: "Tentu boleh. Mohon cantumkan jumlah tamu di RSVP." },
    { q: "Dress code apa yang disarankan?", a: "Smart casual dengan sentuhan warna tema (emerald/teal/gold)." },
    { q: "Apakah ada parkir?", a: "Tersedia area parkir di lokasi, namun jumlah terbatas. Disarankan carpool jika memungkinkan." },
  ];

  return (
    <>
      <Head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen relative bg-gradient-to-br from-emerald-50 via-slate-50 to-sky-50 text-slate-900 antialiased overflow-hidden">
        {/* decorative shapes */}
        <div aria-hidden className="pointer-events-none">
          <svg className="absolute -left-24 -top-24 w-80 opacity-30 transform rotate-12" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0" stopColor="#60a5fa" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="200" height="200" rx="30" fill="url(#g1)" />
          </svg>

          <svg className="absolute right-0 top-40 w-72 opacity-25 transform rotate-6" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="g2" x1="0" x2="1">
                <stop offset="0" stopColor="#34d399" />
                <stop offset="1" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="100" fill="url(#g2)" />
          </svg>

          <svg className="absolute -right-24 bottom-0 w-96 opacity-20 transform -rotate-12" viewBox="0 0 600 200">
            <path d="M0 100 Q150 0 300 100 T600 100 L600 200 L0 200 Z" fill="#fff" opacity="0.6" />
          </svg>
        </div>

        {/* sticky nav */}
        <header className="fixed top-4 left-0 right-0 z-50 flex justify-center">
          <nav className="w-full max-w-5xl mx-4 bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg px-4 py-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollToId("home")}
                className="flex items-center gap-2 focus:outline-none"
                aria-label="Home"
              >
                <img src={BIRTHDAY_PHOTO} alt="avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                <div className="leading-tight text-left">
                  <div className="text-sm font-semibold" style={{ fontFamily: "'Great Vibes', cursive" }}>{BIRTHDAY_NAME}</div>
                  <div className="text-xs text-slate-600">Undangan Ulang Tahun</div>
                </div>
              </button>
            </div>

            <ul className="hidden md:flex items-center gap-4 text-sm font-medium">
              <li><button onClick={() => scrollToId("home")} className="nav-btn">Home</button></li>
              <li><button onClick={() => scrollToId("welcome")} className="nav-btn">Welcome</button></li>
              <li><button onClick={() => scrollToId("acara")} className="nav-btn">Acara</button></li>
              <li><button onClick={() => scrollToId("galeri")} className="nav-btn">Galeri</button></li>
              <li><button onClick={() => scrollToId("cerita")} className="nav-btn">Cerita</button></li>
              <li><button onClick={() => scrollToId("rsvp")} className="nav-btn">RSVP</button></li>
              <li><button onClick={() => scrollToId("hadiah")} className="nav-btn">Hadiah</button></li>
            </ul>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollToId("rsvp")}
                className="px-3 py-1 rounded-md bg-amber-400 hover:bg-amber-500 transition text-sm font-semibold shadow-sm"
              >
                Konfirmasi
              </button>
              <button className="md:hidden p-2 rounded-md bg-white/50 hover:bg-white/70" onClick={() => {
                const menu = document.getElementById("mobile-menu");
                if (menu) menu.classList.toggle("hidden");
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* mobile menu */}
            <div id="mobile-menu" className="absolute left-1/2 -translate-x-1/2 top-16 w-[90%] hidden md:hidden">
              <div className="bg-white/70 rounded-xl p-3 shadow-lg backdrop-blur">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { scrollToId("home"); (document.getElementById("mobile-menu")!).classList.add("hidden"); }} className="p-2 rounded-md">Home</button>
                  <button onClick={() => { scrollToId("welcome"); (document.getElementById("mobile-menu")!).classList.add("hidden"); }} className="p-2 rounded-md">Welcome</button>
                  <button onClick={() => { scrollToId("acara"); (document.getElementById("mobile-menu")!).classList.add("hidden"); }} className="p-2 rounded-md">Acara</button>
                  <button onClick={() => { scrollToId("galeri"); (document.getElementById("mobile-menu")!).classList.add("hidden"); }} className="p-2 rounded-md">Galeri</button>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <main className="pt-28">
          {/* ================= HOME / HERO ================= */}
          <section id="home" tabIndex={-1} className="reveal relative isolate overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* left - text & countdown */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/60 backdrop-blur text-sm font-medium ring-1 ring-white/30 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H8V3a1 1 0 00-1-1zM2 10v6a2 2 0 002 2h12a2 2 0 002-2v-6H2z" />
                    </svg>
                    <span className="text-slate-700">Undangan Premium • {BIRTHDAY_NAME}</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-tight font-extrabold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span className="block text-amber-600" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "2.6rem" }}>{BIRTHDAY_NAME}</span>
                    <span className="block text-slate-800 text-lg sm:text-xl">Mari rayakan momen spesial bersama — penuh tawa & kenangan</span>
                  </h1>

                  {/* countdown card */}
                  <div
                    className={`p-4 rounded-2xl shadow-xl ring-1 ring-white/40 bg-gradient-to-br from-white/60 to-amber-50 w-full max-w-sm transform transition-all ${isToday ? "scale-105 border-2 border-amber-300" : ""
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-600">Waktu Perayaan</div>
                        <div className="text-sm font-semibold">
                          {formatDate(TARGET_DATE, "full", "short")}
                        </div>
                      </div>
                      <div className="text-right">
                        {!isToday && !isExpired && (
                          <div className="text-sm text-slate-700">Countdown</div>
                        )}
                        {isToday && (
                          <div className="text-sm text-amber-600 font-semibold">Hari Ini!</div>
                        )}
                        {isExpired && (
                          <div className="text-sm text-slate-500">Telah Lewat</div>
                        )}
                      </div>
                    </div>

                    {/* big countdown visual */}
                    <div className="mt-4">
                      {!isToday && !isExpired && (
                        <div className="flex gap-2 justify-between text-center">
                          <div className="flex-1 bg-white/80 p-3 rounded-lg shadow-sm">
                            <div className="text-2xl font-bold">{days}</div>
                            <div className="text-xs text-slate-600">Hari</div>
                          </div>
                          <div className="flex-1 bg-white/80 p-3 rounded-lg shadow-sm">
                            <div className="text-2xl font-bold">{hours}</div>
                            <div className="text-xs text-slate-600">Jam</div>
                          </div>
                          <div className="flex-1 bg-white/80 p-3 rounded-lg shadow-sm">
                            <div className="text-2xl font-bold">{minutes}</div>
                            <div className="text-xs text-slate-600">Menit</div>
                          </div>
                          <div className="flex-1 bg-white/80 p-3 rounded-lg shadow-sm">
                            <div className="text-2xl font-bold">{seconds}</div>
                            <div className="text-xs text-slate-600">Detik</div>
                          </div>
                        </div>
                      )}

                      {isToday && (
                        <div className="p-4 rounded-lg bg-amber-100 text-amber-800 font-semibold text-center shadow-inner animate-pulse">
                          Hari ini perayaan berlangsung — Sampai jumpa di lokasi! 🎉
                        </div>
                      )}

                      {isExpired && (
                        <div className="p-4 rounded-lg bg-white/70 text-slate-600 text-center italic">
                          Perayaan telah berlangsung. Terima kasih untuk semua yang hadir dan ucapan hangat.
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => scrollToId("rsvp")}
                        className="flex-1 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 transition font-semibold shadow"
                      >
                        Konfirmasi
                      </button>
                      <button
                        onClick={() => scrollToId("acara")}
                        className="px-4 py-2 rounded-lg border border-white/30 bg-white/60 hover:bg-white/80 transition"
                      >
                        Detail Acara
                      </button>
                    </div>
                  </div>


                  <p className="text-sm text-slate-600 max-w-xl">
                    Undangan digital ini berisi semua informasi yang diperlukan untuk merayakan momen spesial bersama {BIRTHDAY_NAME}. Silakan eksplor setiap bagian, konfirmasi kehadiran melalui RSVP, dan jika ingin mengirim hadiah digital lihat bagian Hadiah.
                  </p>
                </div>

                {/* right - carousel */}
                <div className="lg:col-span-6 relative">
                  <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/30">
                    <div className="relative w-full h-72 sm:h-96">
                      {/* background carousel image */}
                      <img
                        src={carouselImages[carouselIndex]}
                        alt="hero"
                        className="w-full h-full object-cover transform transition duration-1000 scale-100 hover:scale-105"
                        draggable={false}
                      />
                      {/* confetti sprinkle */}
                      <div className="absolute inset-0 pointer-events-none">
                        <svg className="absolute -top-10 left-6 w-44 opacity-30 animate-float" viewBox="0 0 100 100">
                          <circle cx="20" cy="30" r="6" fill="#f59e0b" />
                          <circle cx="70" cy="10" r="4" fill="#60a5fa" />
                        </svg>
                      </div>

                      {/* carousel controls */}
                      <div className="absolute inset-0 flex items-end justify-between p-4">
                        <button aria-label="prev" onClick={() => setCarouselIndex((p) => (p - 1 + carouselImages.length) % carouselImages.length)} className="bg-white/60 hover:bg-white/80 p-2 rounded-full shadow">
                          {"<"}
                        </button>
                        <div className="bg-gradient-to-r from-amber-300/70 to-white/30 px-3 py-1 rounded-full text-xs font-semibold shadow">
                          {carouselIndex + 1} / {carouselImages.length}
                        </div>
                        <button aria-label="next" onClick={() => setCarouselIndex((p) => (p + 1) % carouselImages.length)} className="bg-white/60 hover:bg-white/80 p-2 rounded-full shadow">
                          {">"}
                        </button>
                      </div>

                      {/* interactive open button */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-12">
                        <button onClick={() => {
                          const c = document.getElementById("welcome");
                          if (c) c.scrollIntoView({ behavior: "smooth" });
                        }} className="px-6 py-3 rounded-full bg-amber-500 hover:scale-105 transform transition text-white font-bold shadow-lg ring-4 ring-amber-200/30">
                          Buka Undangan
                        </button>
                      </div>
                    </div>

                    {/* small indicators */}
                    <div className="p-3 bg-white/40 flex items-center justify-between">
                      <div className="text-xs text-slate-600">Klik untuk lihat foto lain • Gunakan ← →</div>
                      <div className="flex gap-2">
                        {carouselImages.map((_, i) => (
                          <button key={i} onClick={() => setCarouselIndex(i)} className={`w-2 h-2 rounded-full ${i === carouselIndex ? 'bg-amber-500' : 'bg-white/40'} ring-1 ring-white/40`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* subtle floating badge */}
                  <div className="absolute -left-6 -top-6 bg-amber-100/70 p-3 rounded-2xl shadow-md ring-1 ring-white/30">
                    <div className="text-xs">Umur</div>
                    <div className="text-2xl font-bold">{new Date().getFullYear() - new Date("2000-01-01").getFullYear()}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= WELCOME ================= */}
          <section id="welcome" tabIndex={-1} className="reveal max-w-5xl mx-auto px-4 py-12 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-1 flex justify-center">
                <div className="w-44 h-44 rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition">
                  <img src={BIRTHDAY_PHOTO} alt="foto" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Halo, Sahabat!</h2>
                  <span className="text-xs text-slate-500">Selamat datang</span>
                </div>
                <p className="text-slate-700">
                  Terima kasih telah mampir. Perkenalkan, <span className="font-semibold">{BIRTHDAY_NAME}</span> — yang akan merayakan ulang tahun pada <span className="font-medium">{new Date(TARGET_DATE).toLocaleDateString()}</span>.
                  Dia dikenal ramah, penuh semangat, dan menyukai momen kumpul bersama keluarga & teman. Mari hadir dan beri doa terbaik!
                </p>

                <div className="flex gap-4 flex-wrap">
                  <div className="p-3 rounded-lg bg-white/70 shadow-sm">
                    <div className="text-xs text-slate-500">Nama</div>
                    <div className="font-semibold">{BIRTHDAY_NAME}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/70 shadow-sm">
                    <div className="text-xs text-slate-500">Umur</div>
                    <div className="font-semibold">— tahun</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/70 shadow-sm">
                    <div className="text-xs text-slate-500">Hobi</div>
                    <div className="font-semibold">Musik, Fotografi, Travel</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= ACARA ================= */}
          <section
            id="acara"
            tabIndex={-1}
            className="reveal bg-gradient-to-r from-slate-50 to-emerald-50 py-16"
          >
            <div className="max-w-6xl mx-auto px-4">
              {/* Title */}
              <div className="text-center mb-10">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800">
                  Detail Acara
                </h3>
                <div className="mt-2 w-24 h-1 mx-auto bg-emerald-400 rounded-full" />
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left (Main Info) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/80 shadow hover:shadow-md transition">
                      <div className="text-xs text-slate-500">Tanggal</div>
                      <div className="font-semibold">
                        {new Date(TARGET_DATE).toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Mohon hadir tepat waktu
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/80 shadow hover:shadow-md transition">
                      <div className="text-xs text-slate-500">Waktu</div>
                      <div className="font-semibold">
                        {new Date(TARGET_DATE).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Rangkaian acara: sambutan, games, potong kue
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/80 shadow hover:shadow-md transition">
                      <div className="text-xs text-slate-500">Tempat</div>
                      <div className="font-semibold">Gedung Serbaguna Harmoni</div>
                      <div className="text-xs text-slate-400 mt-1">
                        Jl. Kenangan No. 10, Jakarta
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/80 shadow hover:shadow-md transition">
                      <div className="text-xs text-slate-500">Dress Code</div>
                      <div className="font-semibold">
                        Smart Casual (nuansa teal / emerald)
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-slate-800">Lokasi</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Gunakan peta berikut untuk navigasi. Klik zoom untuk petunjuk arah.
                    </p>

                    <div
                      id="map"
                      className="w-full rounded-xl overflow-hidden border ring-1 ring-white/30 shadow"
                      style={{ minHeight: 220 }}
                    >
                      {/* iframe Google Maps (lazy reveal) */}
                      {revealMap ? (
                        <iframe
                          title="lokasi"
                          src={LOCATION_IFRAME}
                          className="w-full h-56 md:h-72 border-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-56 md:h-72 flex items-center justify-center text-sm text-slate-500 bg-white/60">
                          Memuat peta...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right (Aside Info) */}
                <aside className="lg:col-span-1 space-y-4">
                  <div className="p-4 rounded-xl bg-white/90 shadow hover:shadow-md transition">
                    <div className="text-xs text-slate-500">Tema Pesta</div>
                    <div className="font-semibold">
                      Garden Glow — Elegan &amp; Ceria
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/90 shadow hover:shadow-md transition">
                    <div className="text-xs text-slate-500">Protokol Kesehatan</div>
                    <div className="text-sm text-slate-700">
                      Kami menghargai kenyamanan bersama. Silakan jaga kesehatan; jika
                      sakit, mohon konfirmasi ketidakhadiran &amp; doakan dari jauh.
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          {/* ================= GALERI ================= */}
          <section id="galeri" tabIndex={-1} className="reveal max-w-6xl mx-auto px-4 py-12">
            <h3 className="text-2xl font-bold mb-6">Galeri</h3>

            <div className="space-y-4">
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory py-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="snap-start min-w-[240px] md:min-w-[320px] rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition">
                    <img src={BIRTHDAY_PHOTO} alt={`galeri-${i}`} className="w-full h-48 object-cover" />
                    <div className="p-3 bg-white/80">
                      <div className="text-sm font-semibold">Kenangan #{i + 1}</div>
                      <div className="text-xs text-slate-500">Momen berharga bersama teman & keluarga</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* ================= CERITA / TIMELINE ================= */}
          <section id="cerita" tabIndex={-1} className="reveal py-12 bg-gradient-to-tr from-white to-slate-50">
            <div className="max-w-6xl mx-auto px-4">
              <h3 className="text-2xl font-bold mb-6">Cerita & Momen Spesial</h3>
              <div className="relative">
                <div className="border-l-2 border-dashed border-emerald-200 absolute left-6 top-0 bottom-0" />
                <div className="ml-12 space-y-8">
                  {[
                    { year: "2000", title: "Lahir ke dunia", text: "Hari pertama menuju banyak cerita." },
                    { year: "2010", title: "Sekolah dasar", text: "Mulai berteman & bermimpi besar." },
                    { year: "2016", title: "Menemukan hobi", text: "Cinta pada fotografi dan musik." },
                    { year: "2023", title: "Momen berharga", text: "Perayaan bersama orang tercinta." },
                    { year: "2025", title: "Ulang tahun ini", text: "Semoga menjadi babak baru yang lebih berkilau." },
                  ].map((item, idx) => (
                    <div key={idx} className="relative reveal">
                      <div className="absolute -left-8 -top-1 w-12 h-12 rounded-full bg-white/80 ring-2 ring-emerald-100 shadow flex items-center justify-center font-bold">
                        {item.year}
                      </div>
                      <div className="bg-white/80 ps-6 p-4 rounded-xl shadow">
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-sm text-slate-600">{item.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ================= RSVP ================= */}
          <section id="rsvp" tabIndex={-1} className="reveal py-12">
            <div className="max-w-3xl mx-auto px-4">
              <h3 className="text-2xl font-bold mb-4">Konfirmasi Kehadiran (RSVP)</h3>

              {rsvpSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 shadow text-center">
                  <div className="text-lg font-semibold">Terima kasih!</div>
                  <div className="text-sm text-slate-600 mt-2">Konfirmasi Anda telah tersimpan. Kami tidak sabar bertemu Anda di acara.</div>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      required
                      value={rsvpState.name}
                      onChange={(e) => setRsvpState({ ...rsvpState, name: e.target.value })}
                      placeholder="Nama lengkap"
                      className="p-3 rounded-lg border border-white/30 bg-white/80"
                    />
                    <input
                      type="email"
                      value={rsvpState.email}
                      onChange={(e) => setRsvpState({ ...rsvpState, email: e.target.value })}
                      placeholder="Email (opsional)"
                      className="p-3 rounded-lg border border-white/30 bg-white/80"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500">Kehadiran</label>
                    <select value={rsvpState.coming} onChange={(e) => setRsvpState({ ...rsvpState, coming: e.target.value as any })} className="w-full p-3 rounded-lg border bg-white/80">
                      <option value="yes">Hadir</option>
                      <option value="no">Tidak Bisa</option>
                      <option value="maybe">Mungkin</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500">Jumlah tamu</label>
                    <input type="number" min={0} value={rsvpState.guests} onChange={(e) => setRsvpState({ ...rsvpState, guests: Number(e.target.value) })}
                      className="w-full p-3 rounded-lg border bg-white/80" />
                  </div>

                  <div className="md:col-span-2">
                    <textarea value={rsvpState.note} onChange={(e) => setRsvpState({ ...rsvpState, note: e.target.value })} placeholder="Pesan atau catatan (opsional)" className="w-full p-3 rounded-lg border bg-white/80" rows={4} />
                  </div>

                  <div className="md:col-span-2 flex gap-3 items-center">
                    <button type="submit" className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 transition text-white font-semibold shadow">
                      Kirim Konfirmasi
                    </button>
                    <div className="text-sm text-slate-600">Kami akan menyimpan data ini untuk keperluan tamu undangan.</div>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* ================= HADIAH ================= */}
          <section id="hadiah" tabIndex={-1} className="reveal py-12 bg-gradient-to-r from-white to-sky-50">
            <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <h3 className="text-2xl font-bold">Hadiah & Donasi Digital</h3>
                <p className="text-sm text-slate-600 mt-2">Jika ingin memberi hadiah, berikut beberapa opsi rekening / e-wallet. Terima kasih atas kebaikan hati Anda.</p>

                <div className="mt-4 space-y-3">
                  <div className="p-4 rounded-lg bg-white/90 shadow flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">Bank BCA</div>
                      <div className="font-semibold">A/N: Alya Putri • 1234567890</div>
                    </div>
                    <button className="px-3 py-2 rounded-md bg-emerald-100">Salin</button>
                  </div>

                  <div className="p-4 rounded-lg bg-white/90 shadow flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">OVO</div>
                      <div className="font-semibold">081234567890</div>
                    </div>
                    <button className="px-3 py-2 rounded-md bg-emerald-100">Salin</button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Tips Mengirim Hadiah Digital</h4>
                <ul className="list-disc text-sm ml-5 mt-2 text-slate-600 space-y-2">
                  <li>Cantumkan nama pengirim pada kolom berita transfer agar bisa kami ucapkan terima kasih.</li>
                  <li>Jika ingin mengirim paket fisik, hubungi kami terlebih dahulu untuk alamat pengiriman.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ================= FAQ ================= */}
          <section id="faq" tabIndex={-1} className="reveal py-12">
            <div className="max-w-4xl mx-auto px-4">
              <h3 className="text-2xl font-bold mb-4">FAQ</h3>

              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <div key={i} className="bg-white/90 rounded-xl shadow overflow-hidden">
                    <button onClick={() => setFaqOpen((p) => ({ ...p, [i]: !p[i] }))} className="w-full px-4 py-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{f.q}</div>
                      </div>
                      <div className="text-slate-500">{faqOpen[i] ? "−" : "+"}</div>
                    </button>
                    <div className={`px-4 pb-4 transition-all ${faqOpen[i] ? 'block' : 'hidden'}`}>
                      <div className="text-sm text-slate-600">{f.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= FOOTER ================= */}
          <footer className="py-8">
            <div className="max-w-6xl mx-auto px-4 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-slate-600">© {new Date().getFullYear()} Undangan {BIRTHDAY_NAME}. Terima kasih atas perhatian & doanya.</div>
              <div className="flex items-center gap-4">
                <nav className="flex gap-3 text-sm">
                  <button onClick={() => scrollToId("home")} className="text-slate-600 hover:text-slate-800">Home</button>
                  <button onClick={() => scrollToId("acara")} className="text-slate-600 hover:text-slate-800">Acara</button>
                  <button onClick={() => scrollToId("rsvp")} className="text-slate-600 hover:text-slate-800">RSVP</button>
                </nav>
                <div className="flex gap-2">
                  <a aria-label="instagram" href="#" className="p-2 rounded-full bg-white/60 shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10z" /></svg>
                  </a>
                  <a aria-label="facebook" href="#" className="p-2 rounded-full bg-white/60 shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5 3.66 9.14 8.44 9.93v-7.03H8.07v-2.9h2.37V9.29c0-2.35 1.4-3.65 3.55-3.65 1.03 0 2.11.18 2.11.18v2.32h-1.19c-1.17 0-1.53.73-1.53 1.48v1.78h2.6l-.42 2.9h-2.18V22C18.34 21.21 22 17.07 22 12.07z" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>

        {/* small global decorative confetti when RSVP sent */}
        <div className="pointer-events-none fixed inset-0 z-50 rsvp-confetti" aria-hidden></div>

        {/* styles for reveal, animations, and small utility classes */}
        <style jsx global>{`
          :root {
            --accent: #f59e0b;
            --muted: #64748b;
          }
          html, body, #__next {
            height: 100%;
          }
          .nav-btn {
            background: transparent;
            padding: 6px 8px;
            border-radius: 8px;
            transition: all .18s;
          }
          .nav-btn:hover { background: rgba(255,255,255,0.6); transform: translateY(-2px); }
          .reveal { opacity: 0; transform: translateY(20px); transition: all 700ms cubic-bezier(.2,.9,.3,1); }
          .reveal-active { opacity: 1; transform: translateY(0); }
          .animate-float { animation: float 6s ease-in-out infinite; }
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }
          /* confetti on RSVP */
          .rsvp-sent .rsvp-confetti::before,
          .rsvp-sent .rsvp-confetti::after {
            content: "";
            position: absolute;
            inset: 0;
            background-image: radial-gradient(circle at 20% 20%, rgba(245,158,11,0.12), transparent 20%),
                              radial-gradient(circle at 80% 40%, rgba(96,165,250,0.12), transparent 20%),
                              radial-gradient(circle at 50% 80%, rgba(34,197,94,0.12), transparent 20%);
            animation: confettiBurst 1.6s ease-out forwards;
          }
          @keyframes confettiBurst {
            0% { opacity: 0; transform: scale(0.9); }
            30% { opacity: 1; transform: scale(1.02); }
            100% { opacity: 0; transform: scale(1.2); }
          }
          /* small responsive tweaks */
          @media (max-width: 640px) {
            h1 { font-size: 1.6rem !important; }
          }
        `}</style>
      </div>
    </>
  );
}

