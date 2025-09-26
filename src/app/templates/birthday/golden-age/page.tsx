"use client";

import React, { JSX, useEffect, useRef, useState } from "react";
import Head from "next/head";
import useCountdown from "@/lib/countdown";

import bgImage from './bg.jpg'

/**
 * Invitation Type: Birthday
 * Theme Name: "Golden Age"
 * Create At: 10-09-2025
 * Create By: David
*/

type FAQItem = {
  q: string;
  a: string;
};

const EVENT_DATE_ISO = new Date("2025-12-25T18:00:00"); // <-- change to the actual event date/time (ISO)
const HERO_IMAGES = [
  "http://localhost:3005/assets/img/2149043983.jpg",
  // For demonstration, reuse same image with slight query variations (in production use different images)
  "http://localhost:3005/assets/img/2149043983.jpg?v=2",
  "http://localhost:3005/assets/img/2149043983.jpg?v=3",
];

export default function Invitation(): JSX.Element {
  // Smooth scroll behavior
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, []);

  // Countdown state
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(EVENT_DATE_ISO.toString());

  // Hero image carousel state
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Gallery slider
  const GALLERY = [
    "http://localhost:3005/assets/img/2149043983.jpg",
    "http://localhost:3005/assets/img/2149043983.jpg?v=2",
    "http://localhost:3005/assets/img/2149043983.jpg?v=3",
    "http://localhost:3005/assets/img/2149043983.jpg?v=4",
  ];
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Scroll reveal (intersection observer)
  const revealRefs = useRef<Record<string, HTMLElement | null>>({});
  useEffect(() => {
    const els = Object.values(revealRefs.current).filter(Boolean) as Element[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // RSVP form (client-side demo)
  const [rsvp, setRsvp] = useState({
    name: "",
    email: "",
    attending: "yes",
    guests: "0",
    message: "",
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  function handleRsvpSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Here you'd send to your backend or email service. For demo we just mark submitted.
    console.log("RSVP submitted:", rsvp);
    setRsvpSubmitted(true);
    setTimeout(() => setRsvpSubmitted(false), 6000);
  }

  // FAQ accordion
  const FAQ: FAQItem[] = [
    {
      q: "Apakah acara terbuka untuk umum?",
      a: "Acara ini bersifat private — khusus undangan. Harap konfirmasi kehadiran melalui form RSVP.",
    },
    {
      q: "Apakah tersedia parkir di lokasi?",
      a: "Tersedia area parkir di tempat acara. Kami sarankan carpool jika memungkinkan.",
    },
    {
      q: "Apakah membawa hadiah wajib?",
      a: "Tidak wajib — kehadiranmu sudah menjadi hadiah terbaik. Namun jika ingin, informasi hadiah ada di bagian 'Hadiah'.",
    },
  ];
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Timeline / story
  const MILESTONES = [
    { year: "2008", title: "Lahir ke dunia", desc: "Hari yang penuh kebahagiaan — awal perjalanan hidup." },
    { year: "2016", title: "Pertama kali pentas", desc: "Menemukan kecintaan pada seni dan panggung." },
    { year: "2020", title: "Melewati ujian besar", desc: "Belajar resiliency dan tumbuh lebih dewasa." },
    { year: "2024", title: "Merayakan pencapaian", desc: "Kini bersiap menyambut babak baru dalam hidup." },
  ];

  // Utility: scroll to id
  function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Colors / design tokens (Tailwind classes used across)
  // Use playful script font for name, sans for body.
  // We'll include fonts in Head.

  return (
    <>
      <Head>
        {/* Fonts: playful script + modern sans */}
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@300;400;600;700;800&family=Poppins:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root{
            --accent:#F6C1D8; /* pastel pink */
            --accent-2:#FBE8A6; /* pastel gold */
            --muted:#6B7280;
            --nav-bg: rgba(10,10,12,0.55);
            --glass: rgba(255,255,255,0.06);
          }
          html,body,#__next{height:100%}
          /* Reveal animation */
          .reveal {
            opacity: 0;
            transform: translateY(24px) scale(.99);
            transition: all 700ms cubic-bezier(.2,.9,.25,1);
            will-change: opacity, transform;
          }
          .reveal-visible {
            opacity: 1;
            transform: none;
          }
          /* Fancy glass hover */
          .glass-hover:hover{ background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)); box-shadow: 0 8px 30px rgba(2,6,23,0.32) }
          /* Smooth image fade for hero */
          .hero-image {
            transition: opacity 900ms ease-in-out, transform 900ms ease-in-out;
            will-change: opacity, transform;
          }
          /* sticky background fixed image with overlay blend and slight parallax */
          .fixed-bg {
            background-attachment: fixed;
            background-position: center;
            background-size: cover;
          }
          /* small visual helpers */
          .outline-soft { outline: 1px solid rgba(255,255,255,0.03); }
          /* Accessible focus rings */
          :focus { outline: 3px solid rgba(99,102,241,0.18); outline-offset: 3px; }
        `}</style>
      </Head>

      {/* Background fixed image with overlay */}
      <div
        className="fixed inset-0 -z-20 fixed-bg"
        style={{
          backgroundImage: `url(${bgImage.src})`,
          filter: "saturate(1.05) contrast(1.02) brightness(.92)",
        }}
        aria-hidden
      />

      {/* overlay gradient to give pastel/meriah look */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(249,115,22,0.7), rgba(236,72,153,0.7) 40%, rgba(234,179,8,0.5))",
          backdropFilter: "saturate(1.05) blur(1px)",
        }}
        aria-hidden
      />

      {/* Main container */}
      <div className="min-h-screen relative text-slate-900">
        {/* Sticky navigation header */}
        <header
          className="fixed top-4  left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-6xl backdrop-blur-md rounded-xl"
          style={{ background: "var(--nav-bg)", border: "1px solid rgba(255,255,255,0.04)" }}
        >
          <nav className="flex items-center justify-between py-3 px-4 md:px-6 bg-gray-800/25">
            <div className="flex items-center gap-3">
              <button
                className="px-3 py-1 rounded-md text-white/95 font-semibold glass-hover"
                onClick={() => scrollToId("hero")}
                aria-label="Go to hero"
                style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: ".4px" }}
              >
                <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: 20, color: "white" }}>
                  Raya's
                </span>
                <span className="ml-2 text-sm text-white/80">Birthday</span>
              </button>
            </div>

            <ul className="hidden md:flex items-center gap-4 text-sm text-white/90">
              {[
                { k: "hero", label: "Home" },
                { k: "welcome", label: "Welcome" },
                { k: "acara", label: "Acara" },
                { k: "galeri", label: "Galeri" },
                { k: "cerita", label: "Cerita" },
                { k: "rsvp", label: "RSVP" },
                { k: "hadiah", label: "Hadiah" },
                { k: "faq", label: "FAQ" },
              ].map((it) => (
                <li key={it.k}>
                  <button
                    onClick={() => scrollToId(it.k)}
                    className="px-3 py-2 rounded-md hover:backdrop-blur-sm bg-gray-800/25 transition-colors"
                  >
                    {it.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <a
                href="#rsvp"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("rsvp");
                }}
                className="md:block hidden bg-gradient-to-r from-pink-400 to-yellow-300 text-slate-900 px-3 py-2 rounded-md font-semibold shadow-sm transform hover:-translate-y-0.5 transition"
              >
                Konfirmasi
              </a>
              <div className="md:hidden">
                {/* Mobile quick nav (dropdown) */}
                <details className="relative">
                  <summary className="text-white/90 px-2 py-1 cursor-pointer">Menu</summary>
                  <div className="absolute right-0 mt-2 w-44 rounded-md overflow-hidden bg-gray-600 backdrop-blur-md p-2 shadow-lg">
                    <ul className="flex flex-col gap-1 text-sm text-white/90">
                      {[
                        { k: "hero", label: "Home" },
                        { k: "welcome", label: "Welcome" },
                        { k: "acara", label: "Acara" },
                        { k: "galeri", label: "Galeri" },
                        { k: "cerita", label: "Cerita" },
                        { k: "rsvp", label: "RSVP" },
                        { k: "hadiah", label: "Hadiah" },
                        { k: "faq", label: "FAQ" },
                      ].map((it) => (
                        <li key={it.k}>
                          <button
                            onClick={() => {
                              scrollToId(it.k);
                              // close details
                              const d = document.querySelector("details");
                              if (d) (d as HTMLDetailsElement).open = false;
                            }}
                            className="w-full text-left px-2 py-2 rounded hover:bg-white/4"
                          >
                            {it.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              </div>
            </div>
          </nav>
        </header>

        {/* Page content wrapper */}
        <main className="pt-28 pb-24">
          {/* HERO SECTION */}
          <section
            id="hero"
            ref={(el) => {
              if (el) revealRefs.current["hero"] = el;
            }}
            className="min-h-[78vh] flex items-center justify-center px-4 md:px-8 lg:px-12"
          >
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left - hero content */}
              <div className="space-y-6 reveal rounded-xl p-6 md:p-8 outline-soft glass-hover">
                <div className="flex items-center gap-3">
                  <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold bg-white/8">
                    🎉 You're invited
                  </span>
                  <span className="text-sm text-white/70">Please join the celebration</span>
                </div>

                <div>
                  <h1
                    className="text-4xl md:text-5xl leading-[1.02]"
                    style={{ fontFamily: "'Great Vibes', cursive", color: "white", textShadow: "0 6px 30px rgba(2,6,23,0.6)" }}
                  >
                    Raya Putri
                  </h1>
                  <p className="mt-1 text-sm md:text-base text-white/90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Merayakan hari yang spesial — bertambah usia, penuh syukur & kebahagiaan.
                  </p>
                </div>

                {/* Countdown card */}
                <div
                  className="rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-6 backdrop-blur-sm bg-white/25"
                  style={{ border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div className="flex-1">
                    {isExpired ? (
                      <div>
                        <div className="text-sm text-white/90 font-semibold">Acara telah berlalu</div>
                        <div className="mt-2 text-white/70">Terima kasih untuk semua yang sudah hadir dan memberi doa.</div>
                      </div>
                    ) : isToday ? (
                      <div>
                        <div className="text-sm text-amber-100 font-semibold">Hari ini adalah hari H! 🎂</div>
                        <div className="mt-2 text-white/90">Acara dimulai pada {EVENT_DATE_ISO.toLocaleTimeString()}</div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm text-white/80">Countdown menuju hari H</div>
                        <div className="mt-2 flex gap-2 items-center">
                          <CounterUnit label="Hari" value={String(Math.max(0, days))} />
                          <CounterUnit label="Jam" value={String(Math.max(0, hours))} />
                          <CounterUnit label="Menit" value={String(Math.max(0, minutes))} />
                          <CounterUnit label="Detik" value={String(Math.max(0, seconds))} />
                        </div>
                        <div className="mt-2 text-xs text-white/60">Catat tanggalnya: {EVENT_DATE_ISO.toLocaleString()}</div>
                      </>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() => scrollToId("welcome")}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-yellow-300 font-semibold transform hover:-translate-y-0.5 transition"
                      aria-label="Buka Undangan"
                    >
                      Buka Undangan
                    </button>
                  </div>
                </div>

                <div className="text-xs text-white/70">
                  <em>Tip: Klik tombol "Buka Undangan" atau gulir untuk melihat detail lengkap.</em>
                </div>
              </div>

              {/* Right - hero carousel image */}
              <div className="relative rounded-xl overflow-hidden h-72 md:h-[420px]">
                {/* carousel images */}
                {HERO_IMAGES.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Hero ${i}`}
                    className="absolute inset-0 w-full h-full object-cover hero-image"
                    style={{
                      opacity: i === heroIndex ? 1 : 0,
                      transform: i === heroIndex ? "scale(1)" : "scale(1.06)",
                      transitionDelay: i === heroIndex ? "0ms" : "0ms",
                    }}
                  />
                ))}

                {/* overlay decorations */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(2,6,23,0.08), rgba(2,6,23,0.28) 70%)" }} />

                {/* interactive open invitation button (on image) */}
                <div className="absolute left-4 bottom-4">
                  <button
                    onClick={() => scrollToId("welcome")}
                    className="px-4 py-2 rounded-full bg-white/90 text-slate-900 font-semibold shadow-lg hover:scale-105 transition transform"
                    aria-label="Open invitation"
                  >
                    ✨ Buka Undangan
                  </button>
                </div>

                {/* subtle confetti-like floating circles */}
                <div aria-hidden className="absolute right-4 top-4 grid gap-2">
                  <span className="w-10 h-10 rounded-full bg-pink-300/40 blur-sm animate-pulse" />
                  <span className="w-6 h-6 rounded-full bg-yellow-200/40 blur-sm animate-pulse" />
                </div>
              </div>
            </div>
          </section>

          {/* WELCOME SECTION */}
          <section
            id="welcome"
            ref={(el) => {
              if (el) revealRefs.current["welcome"] = el;
            }}
            className="mt-12 max-w-6xl mx-auto px-4 md:px-6 reveal"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center backdrop-blur-sm bg-gray-800/25 p-6 rounded-2xl outline-soft">
              <div className="col-span-1 flex items-center justify-center">
                <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-white/10 shadow-lg">
                  <img src="http://localhost:3005/assets/img/2149043983.jpg" alt="Foto Raya" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="col-span-2 space-y-3">
                <h2 className="text-3xl" style={{ fontFamily: "'Great Vibes', cursive", color: "white" }}>
                  Raya Putri — celebrating <span style={{ fontFamily: "'Poppins', sans-serif" }}>11th Year</span>
                </h2>
                <p className="text-white/80">
                  Dengan penuh suka cita, kami mengundang sahabat & keluarga untuk bergabung merayakan hari ulang tahun Raya.
                  Acara akan dipenuhi dengan permainan, kue, musik, dan momen hangat — jangan sampai ketinggalan!
                </p>

                <div className="flex flex-wrap gap-3 mt-2">
                  <Badge label="Usia" value="11 Tahun" />
                  <Badge label="Hobi" value="Menari & Menggambar" />
                  <Badge label="Tempat Favorit" value="Pantai & Taman" />
                </div>
              </div>
            </div>
          </section>

          {/* ACARA SECTION */}
          <section
            id="acara"
            ref={(el) => {
              if (el) revealRefs.current["acara"] = el;
            }}
            className="mt-12 max-w-6xl mx-auto px-4 md:px-6 reveal"
          >
            <div className="backdrop-blur-sm bg-gray-800/25 rounded-2xl p-6 md:p-8 outline-soft grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-white">Detail Acara</h3>

                <div className="grid grid-cols-2 gap-3">
                  <InfoCard label="Tanggal" value={EVENT_DATE_ISO.toLocaleDateString()} />
                  <InfoCard label="Waktu" value={EVENT_DATE_ISO.toLocaleTimeString()} />
                  <InfoCard label="Tempat" value="Garden Hall, Jl. Bahagia No. 10" />
                  <InfoCard label="Dress code" value="Casual Fancy (pastel & gold accents)" />
                </div>

                <div className="mt-2">
                  <h4 className="text-sm text-white/90 font-medium">Tema Pesta</h4>
                  <p className="text-white/80 text-sm">
                    "Pastel Dream & Golden Moments" — kombinasi warna pastel lembut dengan aksen emas yang elegan.
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <a
                    href="#rsvp"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId("rsvp");
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-yellow-300 text-slate-900 font-semibold"
                  >
                    Konfirmasi Kehadiran
                  </a>
                  <a
                    href="#hadiah"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId("hadiah");
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/6 text-white/90"
                  >
                    Informasi Hadiah
                  </a>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-white/6">
                {/* Google Maps iframe — replace src with the real embed URL for the venue */}
                <iframe
                  title="Lokasi Acara"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.9163527239946!2d-122.08424968469225!3d37.42206597982586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb0b2b7b5b1a5%3A0x2a2e8f3bc0a9f7c3!2sGoogleplex!5e0!3m2!1sen!2sus!4v1694299180000!5m2!1sen!2sus"
                  className="w-full h-72 md:h-full"
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          {/* GALERI SECTION */}
          <section
            id="galeri"
            ref={(el) => {
              if (el) revealRefs.current["galeri"] = el;
            }}
            className="mt-12 max-w-6xl mx-auto px-4 md:px-6 reveal"
          >
            <h3 className="text-2xl font-semibold text-white mb-4">Galeri Momen</h3>
            <div className="backdrop-blur-sm bg-gray-800/25 p-4 rounded-2xl outline-soft">
              <div className="relative">
                <div className="overflow-hidden rounded-xl">
                  <img src={GALLERY[galleryIndex]} alt={`Gallery ${galleryIndex}`} className="w-full h-64 object-cover transition-transform duration-700" />
                </div>

                <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                  <button
                    onClick={() => setGalleryIndex((i) => (i - 1 + GALLERY.length) % GALLERY.length)}
                    className="pointer-events-auto bg-white/8 p-2 rounded-full"
                    aria-label="Prev image"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => setGalleryIndex((i) => (i + 1) % GALLERY.length)}
                    className="pointer-events-auto bg-white/8 p-2 rounded-full"
                    aria-label="Next image"
                  >
                    ▶
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIndex(i)}
                    className={`rounded-md overflow-hidden border ${i === galleryIndex ? "border-amber-300/80" : "border-white/6"}`}
                  >
                    <img src={src} alt={`Thumb ${i}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* CERITA / TIMELINE SECTION */}
          <section
            id="cerita"
            ref={(el) => {
              if (el) revealRefs.current["cerita"] = el;
            }}
            className="mt-12 max-w-6xl mx-auto px-4 md:px-6 reveal"
          >
            <h3 className="text-2xl font-semibold text-white mb-6">Cerita & Momen Spesial</h3>
            <div className="backdrop-blur-sm bg-gray-800/25 p-6 rounded-2xl outline-soft">
              <div className="relative pl-8 md:pl-12">
                {/* Vertical timeline line */}
                <div className="absolute left-4 top-4 bottom-4 w-1 bg-gradient-to-b from-pink-300 to-yellow-200 rounded" style={{ opacity: 0.6 }} />

                <div className="space-y-8">
                  {MILESTONES.map((m, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-2 top-1 w-5 h-5 rounded-full bg-white/90 border border-white/20 shadow-sm" />
                      <div className="ml-8 md:ml-12">
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-amber-100 font-semibold">{m.year}</div>
                          <div className="text-lg font-semibold text-white">{m.title}</div>
                        </div>
                        <div className="text-white/80 mt-1">{m.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* RSVP SECTION */}
          <section
            id="rsvp"
            ref={(el) => {
              if (el) revealRefs.current["rsvp"] = el;
            }}
            className="mt-12 max-w-6xl mx-auto px-4 md:px-6 reveal"
          >
            <h3 className="text-2xl font-semibold text-white mb-4">RSVP — Konfirmasi Kehadiran</h3>

            <div className="backdrop-blur-sm bg-gray-800/25 p-6 md:p-8 rounded-2xl outline-soft grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/80">Nama</label>
                  <input
                    value={rsvp.name}
                    onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })}
                    required
                    className="mt-1 w-full rounded-md px-3 py-2 bg-transparent border border-white/6 text-white"
                    placeholder="Nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/80">Email / WA</label>
                  <input
                    value={rsvp.email}
                    onChange={(e) => setRsvp({ ...rsvp, email: e.target.value })}
                    required
                    className="mt-1 w-full rounded-md px-3 py-2 bg-transparent border border-white/6 text-white"
                    placeholder="example@mail.com / 08xx..."
                  />
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm text-white/80">Kehadiran</label>
                    <select
                      value={rsvp.attending}
                      onChange={(e) => setRsvp({ ...rsvp, attending: e.target.value })}
                      className="mt-1 w-full rounded-md px-3 py-2 bg-transparent border border-white/6 text-white"
                    >
                      <option value="yes">Hadir</option>
                      <option value="no">Tidak Hadir</option>
                      <option value="maybe">Mungkin</option>
                    </select>
                  </div>
                  <div className="w-36">
                    <label className="block text-sm text-white/80">Jumlah Tamu</label>
                    <input
                      value={rsvp.guests}
                      onChange={(e) => setRsvp({ ...rsvp, guests: e.target.value })}
                      className="mt-1 w-full rounded-md px-3 py-2 bg-transparent border border-white/6 text-white"
                      type="number"
                      min={0}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/80">Pesan untuk yang berulang tahun</label>
                  <textarea
                    value={rsvp.message}
                    onChange={(e) => setRsvp({ ...rsvp, message: e.target.value })}
                    className="mt-1 w-full rounded-md px-3 py-2 bg-transparent border border-white/6 text-white min-h-[96px]"
                    placeholder="Tinggalkan pesan & doa..."
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-yellow-300 font-semibold"
                  >
                    Kirim Konfirmasi
                  </button>

                  {rsvpSubmitted && (
                    <span className="ml-3 text-sm text-emerald-200">Terima kasih! Konfirmasi sudah dikirim.</span>
                  )}
                </div>
              </form>

              <div className="space-y-4">
                <h4 className="text-lg text-white">Panduan RSVP</h4>
                <p className="text-white/80">
                  Mohon isi data dengan benar agar kami dapat mempersiapkan tempat dan konsumsi. Untuk perubahan mendadak, hubungi nomor panitia.
                </p>

                <div className="bg-white/4 p-3 rounded-lg">
                  <div className="text-sm text-white/90 font-semibold">Kontak Panitia</div>
                  <div className="text-sm text-white/80">+62 812-3456-7890 (Andi)</div>
                  <div className="text-sm text-white/80">Email: panitia@example.com</div>
                </div>

                <div className="text-sm text-white/80">
                  <strong>Catatan:</strong> Pastikan membawa undangan digital ini saat hadir (tidak wajib).
                </div>
              </div>
            </div>
          </section>

          {/* HADIAH SECTION */}
          <section
            id="hadiah"
            ref={(el) => {
              if (el) revealRefs.current["hadiah"] = el;
            }}
            className="mt-12 max-w-6xl mx-auto px-4 md:px-6 reveal"
          >
            <h3 className="text-2xl font-semibold text-white mb-4">Informasi Hadiah</h3>

            <div className="backdrop-blur-sm bg-gray-800/25 rounded-2xl p-6 outline-soft">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-white/6">
                  <div className="text-sm text-white/80">Rekening Bank</div>
                  <div className="text-white font-semibold mt-1">BCA • 123-456-7890</div>
                  <div className="text-white/70 text-sm">Atas nama: Putri Raya</div>
                </div>

                <div className="p-4 rounded-lg border border-white/6">
                  <div className="text-sm text-white/80">OVO / Dana</div>
                  <div className="text-white font-semibold mt-1">0812-3456-7890</div>
                  <div className="text-white/70 text-sm">Catatan: Pilih transfer sesuai preferensi</div>
                </div>

                <div className="p-4 rounded-lg border border-white/6">
                  <div className="text-sm text-white/80">Link Kado Digital</div>
                  <a
                    href="#"
                    className="block mt-1 text-white/90 underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    https://gift.example.com/raya
                  </a>
                </div>
              </div>

              <p className="mt-4 text-white/80 text-sm">
                Jika ingin memberikan hadiah fisik, hubungi panitia untuk koordinasi pengiriman.
              </p>
            </div>
          </section>

          {/* FAQ SECTION */}
          <section
            id="faq"
            ref={(el) => {
              if (el) revealRefs.current["faq"] = el;
            }}
            className="mt-12 max-w-6xl mx-auto px-4 md:px-6 reveal"
          >
            <h3 className="text-2xl font-semibold text-white mb-4">Pertanyaan Umum (FAQ)</h3>

            <div className="backdrop-blur-sm bg-gray-800/25 p-4 md:p-6 rounded-2xl outline-soft">
              <div className="space-y-3">
                {FAQ.map((f, i) => (
                  <div key={i} className="border border-white/6 rounded-md overflow-hidden">
                    <button
                      onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                      className="w-full text-left px-4 py-3 flex items-center justify-between bg-transparent"
                    >
                      <div>
                        <div className="text-white/90 font-medium">{f.q}</div>
                        <div className="text-sm text-white/70">{openFAQ === i ? "Tutup" : "Buka jawaban"}</div>
                      </div>
                      <div className="ml-4 text-white/80">{openFAQ === i ? "−" : "+"}</div>
                    </button>
                    <div
                      style={{ display: openFAQ === i ? "block" : "none" }}
                      className="px-4 py-3 text-white/80 bg-white/2 text-sm"
                    >
                      {f.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-12">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 rounded-2xl backdrop-blur-sm bg-white/25" style={{ border: "1px solid rgba(255,255,255,0.03)" }}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: "white" }}>Raya Putri</div>
                  <div className="text-white/70 text-sm">Terima kasih atas doa & kehadiranmu.</div>
                </div>

                <div className="flex items-center gap-4">
                  <nav className="hidden md:flex gap-3 text-white/80">
                    <button onClick={() => scrollToId("hero")} className="text-sm">Home</button>
                    <button onClick={() => scrollToId("acara")} className="text-sm">Acara</button>
                    <button onClick={() => scrollToId("galeri")} className="text-sm">Galeri</button>
                    <button onClick={() => scrollToId("rsvp")} className="text-sm">RSVP</button>
                  </nav>

                  <div className="flex items-center gap-3">
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-white/90">✉</a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-white/90">📸</a>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-white/90">🎵</a>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-white/70 text-sm">© {new Date().getFullYear()} Raya's Birthday Invitation — Created with love.</div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}

/* ---------------------------
   Small subcomponents below
   --------------------------- */

function CounterUnit({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center md:items-start">
      <div className="text-2xl md:text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/80">{label}</div>
    </div>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 bg-white/4 px-3 py-2 rounded-full border border-white/6">
      <div className="text-xs text-white/80">{label}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-md bg-white/3 border border-white/6">
      <div className="text-xs text-white/80">{label}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
