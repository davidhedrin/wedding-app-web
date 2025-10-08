"use client";

// pages/invitation.tsx
import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import useCountdown from "@/lib/countdown";

import bgImage from './bg.jpg'

/**
 * Invitation Type: Birthday
 * Theme Name: "Shimmering Gold"
 * Create At: 10-09-2025
 * Create By: David
*/

type FAQItem = { q: string; a: string };

const TARGET_DATE = new Date();
TARGET_DATE.setDate(TARGET_DATE.getDate() + 12);

export default function Invitation() {
  // === CONFIG ===
  const BIRTHDAY_NAME = "Alya Putri";
  const BIRTHDAY_AGE = 25;
  // Set the target date/time for the birthday event (UTC+7 assumed)
  const BG_IMAGE = "http://localhost:3005/assets/img/birthday-hero1.jpg";

  // === Countdown state ===
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(TARGET_DATE.toString());

  // === Background carousel (simple) ===
  const carouselImages = [
    BG_IMAGE,
    BG_IMAGE + "?v=2",
    BG_IMAGE + "?v=3",
  ]; // using same image variations for demo
  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setBgIndex((i) => (i + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  // === Scroll reveal (intersection observer) ===
  const revealRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            // once revealed, unobserve
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // === RSVP form (local) ===
  const [rsvp, setRsvp] = useState({ name: "", guests: 1, hadir: "Ya", msg: "" });
  const [rsvpSent, setRsvpSent] = useState<null | { name: string; when: Date }>(null);
  function handleRsvpSubmit(e: React.FormEvent) {
    e.preventDefault();
    // local confirmation (no backend)
    setRsvpSent({ name: rsvp.name || "Tamu", when: new Date() });
    // animate / temporary reset
    setTimeout(() => {
      setRsvp({ name: "", guests: 1, hadir: "Ya", msg: "" });
    }, 500);
  }

  // === Gallery carousel controls (simple) ===
  const gallery = [
    BG_IMAGE,
    BG_IMAGE + "?1",
    BG_IMAGE + "?2",
    BG_IMAGE + "?3",
    BG_IMAGE + "?4",
  ];
  const [gIndex, setGIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setGIndex((i) => (i + 1) % gallery.length), 5000);
    return () => clearInterval(id);
  }, []);

  // === FAQ data ===
  const faqs: FAQItem[] = [
    { q: "Apakah tamu boleh membawa pasangan?", a: "Boleh. Silakan konfirmasi di form RSVP jumlah tamu." },
    { q: "Adakah parkir di lokasi?", a: "Tersedia area parkir luar gedung. Disarankan berangkat lebih awal." },
    { q: "Dress code apa yang disarankan?", a: "Dress code: Smart Casual dengan sentuhan warna navy atau pastel." },
    { q: "Bisakah hadir secara virtual?", a: "Ya, link streaming akan dibagikan via pesan kepada yang RSVP 'Tidak Bisa Datang'." },
  ];
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // === Smooth scroll for nav links ===
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, []);

  // util for formatted date/time
  const formatDate = (d: Date) =>
    d.toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <Head>
        <title>{BIRTHDAY_NAME} — Undangan Ulang Tahun</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root{
            --accent: #D4AF37; /* gold */
            --muted: rgba(255,255,255,0.85);
            --navy: #0b2545;
            --glass: rgba(255,255,255,0.06);
          }
          html,body,#__next { height: 100%; }
          /* smooth reveal */
          .reveal { opacity: 0; transform: translateY(18px) scale(0.995); transition: all 700ms cubic-bezier(.2,.9,.2,1); will-change: transform, opacity; }
          .reveal.revealed { opacity: 1; transform: translateY(0) scale(1); }
          /* simple utility for script font */
          .script { font-family: 'Great Vibes', cursive; }
        `}</style>
      </Head>

      {/* BACKGROUND */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url("${bgImage.src}")`,
          filter: "saturate(1.05) contrast(1.02)",
        }}
        aria-hidden
      >
        {/* overlay with elegant tint */}
        <div
          className="absolute inset-0 bg-gray-800/60 backdrop-blur-xs"
        />
      </div>

      {/* PAGE CONTAINER */}
      <div className="min-h-screen text-gray-100 antialiased">
        {/* NAV BAR */}
        <header className="sticky top-0 z-40 bg-gray-800/50 backdrop-blur-xl">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md border border-white/20">
                <span className="script text-lg text-navy-900 text-white">A</span>
              </div>
              <div>
                <h1 className="script text-2xl leading-none">Alya's 25th</h1>
                <p className="text-xs -mt-0.5 opacity-80">Undangan Digital</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <a href="#welcome" className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition">Welcome</a>
              <a href="#acara" className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition">Acara</a>
              <a href="#galeri" className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition">Galeri</a>
              <a href="#cerita" className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition">Momen</a>
              <a href="#rsvp" className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition">RSVP</a>
              <a href="#faq" className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition">FAQ</a>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#rsvp"
                className="hidden sm:inline-block text-sm px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-navy-900 font-semibold shadow-lg hover:scale-[1.02] transform transition"
              >
                Konfirmasi Hadir
              </a>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="p-2 rounded-full bg-white/5 hover:bg-white/7 transition"
                aria-label="Back to top"
                title="Back to top"
              >
                ↑
              </button>
            </div>
          </nav>
        </header>

        {/* MAIN */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HERO */}
          <section
            id="hero"
            className="pt-12 pb-20 grid grid-cols-1 md:grid-cols-12 items-center gap-8"
            aria-labelledby="hero-heading"
          >
            <div className="md:col-span-7 lg:col-span-8">
              <div className="reveal rounded-2xl p-6 md:p-10 bg-gradient-to-r from-yellow-400/10 to-amber-500/6 border border-white/10 shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <h2 id="hero-heading" className="script text-4xl md:text-6xl leading-tight tracking-tight">
                      {BIRTHDAY_NAME}
                    </h2>
                    <p className="text-sm md:text-base opacity-90">Mengundangmu untuk merayakan hari spesialnya</p>
                  </div>

                  {/* fancy badge */}
                  <div className="ml-auto">
                    <div className="rounded-full px-4 py-2 bg-white/6 border border-white/10 shadow backdrop-blur-sm">
                      <div className="text-right">
                        <div className="text-xs opacity-80">Usia</div>
                        <div className="text-lg font-semibold">{BIRTHDAY_AGE}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Countdown + CTA */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {/* countdown card */}
                  <div className="rounded-xl p-4 bg-gradient-to-r from-white/3 to-white/6 border border-white/10 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs opacity-80">Countdown</div>
                        <div className="text-sm md:text-base">{formatDate(TARGET_DATE)}</div>
                      </div>
                      <div className="text-right">
                        {isExpired ? (
                          <div className="text-sm md:text-base opacity-90">Telah berlalu — terima kasih untuk semua kenangan 💛</div>
                        ) : isToday ? (
                          <div className="text-xl md:text-3xl font-bold text-amber-300 script animate-pulse">
                            Hari Ini! 🎉
                          </div>
                        ) : (
                          <div className="text-lg md:text-2xl font-semibold">
                            <span>{days}</span>d <span>{hours}</span>h{" "}
                            <span>{minutes}</span>m <span>{seconds}</span>s
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col gap-3 items-center sm:items-center">
                    <p className="text-sm md:text-base opacity-90">Klik tombol di bawah untuk membuka undangan penuh.</p>
                    <button
                      onClick={() => {
                        const el = document.getElementById("welcome");
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-navy-900 font-semibold shadow-2xl transform transition hover:scale-[1.02]"
                    >
                      <span className="text-lg">Buka Undangan</span>
                      <span className="opacity-80 text-xs">→</span>
                      <span
                        aria-hidden
                        className="absolute -inset-0.5 rounded-full opacity-0 group-hover:opacity-60 transition duration-500"
                        style={{ background: "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.08), transparent)" }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* side card with decorative */}
            <div className="md:col-span-5 lg:col-span-4">
              <aside className="reveal rounded-2xl p-6 md:p-8 bg-white/5 border border-white/8 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                    <img src={BG_IMAGE} alt="photo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm opacity-80">Kepada</div>
                    <div className="text-lg font-semibold">Kamu yang istimewa</div>
                    <div className="text-xs opacity-70">Jangan lupa datang ya ✨</div>
                  </div>
                </div>

                <div className="mt-4 text-sm opacity-90">
                  <p>Dress code: <span className="font-semibold">Smart Casual (navy / pastel)</span></p>
                  <p className="mt-2 text-xs opacity-80">Tanggal & lokasi tertera di bagian acara. Konfirmasi kehadiran via RSVP.</p>
                </div>

                <div className="mt-5 flex gap-3">
                  <a href="#galeri" className="px-3 py-2 rounded-md bg-white/6 hover:bg-white/8 transition">Lihat Galeri</a>
                  <a href="#rsvp" className="px-3 py-2 rounded-md bg-amber-400 text-navy-900 font-semibold hover:scale-[1.02] transition">RSVP</a>
                </div>
              </aside>
            </div>
          </section>

          {/* WELCOME */}
          <section id="welcome" className="reveal mt-8 mb-12 bg-transparent" aria-labelledby="welcome-title">
            <div className="rounded-2xl p-6 md:p-10 bg-gradient-to-r from-yellow-400/10 to-amber-500/6 border border-white/8 shadow">
              <h2 id="welcome-title" className="script text-3xl md:text-4xl">Selamat Datang</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-1 flex justify-center">
                  <div className="w-44 h-44 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    <img src={BG_IMAGE} alt="profile" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-lg md:text-2xl font-semibold">{BIRTHDAY_NAME} — {BIRTHDAY_AGE} Tahun</h3>
                  <p className="mt-2 text-sm md:text-base opacity-90">
                    Terima kasih telah menjadi bagian dari perjalanan hidupku. Aku harap kamu dapat hadir untuk berbagi tawa, kue, dan cerita pada hari spesial ini.
                  </p>
                  <div className="mt-4 flex gap-3 flex-wrap">
                    <div className="px-3 py-2 rounded-md bg-white/5">Hobi: Fotografi & travelling</div>
                    <div className="px-3 py-2 rounded-md bg-white/5">Tempat Favorit: Kota Tua</div>
                    <div className="px-3 py-2 rounded-md bg-white/5">Makanan: Kue Coklat</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ACARA */}
          <section id="acara" className="reveal mt-12 mb-12" aria-labelledby="acara-title">
            <div className="rounded-2xl p-6 md:p-10  bg-gradient-to-r from-yellow-400/10 to-amber-500/6 border border-white/8 shadow">
              <h2 id="acara-title" className="script text-3xl md:text-4xl">Detail Acara</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-white/6 border border-white/8">
                    <div className="text-xs opacity-80">Tanggal & Waktu</div>
                    <div className="mt-1 font-semibold">{formatDate(TARGET_DATE)}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/6 border border-white/8">
                    <div className="text-xs opacity-80">Tempat</div>
                    <div className="mt-1 font-semibold">Gedung Serba Guna Anggrek</div>
                    <div className="text-sm opacity-80 mt-1">Jl. Kenangan No.10, Jakarta</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/6 border border-white/8">
                    <div className="text-xs opacity-80">Tema & Dress Code</div>
                    <div className="mt-1 font-semibold">Golden Pastel — Smart Casual</div>
                  </div>
                </div>

                <div>
                  <div className="h-64 rounded-lg overflow-hidden border border-white/10">
                    <iframe
                      title="maps"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.1234567890123!2d106.816666!3d-6.200000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNiwzNTnCsDAwJzAwLjAiUyAxMDYuNTEzNDAwJzAwLjAiRQ!5e0!3m2!1sid!2sid!4v1610000000000"
                      width="100%"
                      height="100%"
                      className="border-0"
                    />
                  </div>
                  <div className="mt-3 text-sm opacity-80">
                    Catatan: Silakan parkir di area sebelah barat gedung. Pintu akan dibuka 30 menit sebelum acara.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* GALERI */}
          <section id="galeri" className="reveal mt-12 mb-12" aria-labelledby="galeri-title">
            <div className="rounded-2xl p-6 md:p-10  bg-gradient-to-r from-yellow-400/10 to-amber-500/6 border border-white/8 shadow">
              <h2 id="galeri-title" className="script text-3xl md:text-4xl">Galeri</h2>

              <div className="mt-6">
                <div className="relative">
                  <div className="h-64 rounded-2xl overflow-hidden">
                    <img src={gallery[gIndex]} alt={`galeri-${gIndex}`} className="w-full h-full object-cover transform transition duration-700" />
                  </div>

                  {/* controls */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4">
                    <button
                      onClick={() => setGIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                      className="pointer-events-auto rounded-full p-2 bg-white/6 shadow hover:bg-white/8 transition"
                      aria-label="Prev"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setGIndex((i) => (i + 1) % gallery.length)}
                      className="pointer-events-auto rounded-full p-2 bg-white/6 shadow hover:bg-white/8 transition"
                      aria-label="Next"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* thumbnails */}
                <div className="mt-4 flex gap-3 overflow-x-auto py-2">
                  {gallery.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setGIndex(i)}
                      className={`w-28 h-20 rounded-lg overflow-hidden border ${i === gIndex ? "ring-2 ring-amber-300" : "opacity-70"} transform transition hover:scale-105`}
                    >
                      <img src={src} className="w-full h-full object-cover" alt={`thumb-${i}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CERITA / TIMELINE */}
          <section id="cerita" className="reveal mt-12 mb-12" aria-labelledby="cerita-title">
            <div className="rounded-2xl p-6 md:p-10  bg-gradient-to-r from-yellow-400/10 to-amber-500/6 border border-white/8 shadow">
              <h2 id="cerita-title" className="script text-3xl md:text-4xl">Momen Spesial</h2>
              <div className="mt-6 space-y-6">
                {[
                  { year: "2000", title: "Lahir", desc: "Hari yang penuh cinta." },
                  { year: "2012", title: "Petualangan Pertama", desc: "Pertama kali travelling keluar kota." },
                  { year: "2018", title: "Kuliah Selesai", desc: "Wisuda penuh kebahagiaan." },
                  { year: "2023", title: "Pekerjaan Impian", desc: "Mulai bekerja di bidang kreatif." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="min-w-[72px]">
                      <div className="text-xs opacity-80">{item.year}</div>
                      <div className="mt-1 w-1 h-1 rounded-full bg-amber-400" />
                    </div>
                    <div className="flex-1 bg-white/5 rounded-lg p-4 border border-white/6">
                      <div className="font-semibold">{item.title}</div>
                      <div className="mt-1 text-sm opacity-85">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RSVP */}
          <section id="rsvp" className="reveal mt-12 mb-12" aria-labelledby="rsvp-title">
            <div className="rounded-2xl p-6 md:p-10  bg-gradient-to-r from-yellow-400/10 to-amber-500/6 border border-white/8 shadow">
              <h2 id="rsvp-title" className="script text-3xl md:text-4xl">Konfirmasi Kehadiran (RSVP)</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm opacity-85">Nama</label>
                    <input
                      value={rsvp.name}
                      onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })}
                      type="text"
                      placeholder="Nama lengkap"
                      className="mt-1 w-full rounded-lg px-3 py-2 bg-white/4 border border-white/8"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm opacity-85">Jumlah Tamu</label>
                      <input
                        value={rsvp.guests}
                        onChange={(e) => setRsvp({ ...rsvp, guests: Number(e.target.value) })}
                        type="number"
                        min={1}
                        className="mt-1 w-full rounded-lg px-3 py-2 bg-white/4 border border-white/8"
                      />
                    </div>
                    <div>
                      <label className="block text-sm opacity-85">Kehadiran</label>
                      <select
                        value={rsvp.hadir}
                        onChange={(e) => setRsvp({ ...rsvp, hadir: e.target.value })}
                        className="mt-1 w-full rounded-lg px-3 py-2 bg-white/4 border border-white/8"
                      >
                        <option>Ya</option>
                        <option>Tidak</option>
                        <option>Mungkin</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm opacity-85">Pesan untuk yang berulang tahun</label>
                    <textarea
                      value={rsvp.msg}
                      onChange={(e) => setRsvp({ ...rsvp, msg: e.target.value })}
                      rows={4}
                      className="mt-1 w-full rounded-lg px-3 py-2 bg-white/4 border border-white/8"
                      placeholder="Tulis ucapan atau catatan..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button type="submit" className="px-5 py-2 rounded-full bg-amber-400 text-navy-900 font-semibold hover:scale-[1.02] transition">
                      Kirim RSVP
                    </button>
                    <button type="button" onClick={() => setRsvp({ name: "", guests: 1, hadir: "Ya", msg: "" })} className="px-4 py-2 rounded-md bg-white/5">
                      Reset
                    </button>
                  </div>

                  {rsvpSent && (
                    <div className="mt-2 p-3 rounded-md bg-emerald-500/20 border border-emerald-400/30">
                      <div className="font-semibold">Terima kasih, {rsvpSent.name}!</div>
                      <div className="text-sm opacity-80">Konfirmasi diterima pada {rsvpSent.when.toLocaleString()}</div>
                    </div>
                  )}
                </form>

                <div className="p-4 rounded-lg bg-white/5 border border-white/8">
                  <h4 className="font-semibold">Info Hadiah</h4>
                  <p className="mt-2 text-sm opacity-85">Kehadiranmu adalah hadiah terbaik. Jika ingin memberikan hadiah, berikut alternatif:</p>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="p-3 rounded-md bg-white/6">
                      <div className="text-xs opacity-80">Rekening Bank</div>
                      <div className="font-semibold">BCA - 1234567890 (Alya Putri)</div>
                    </div>
                    <div className="p-3 rounded-md bg-white/6">
                      <div className="text-xs opacity-80">E-Wallet</div>
                      <div className="font-semibold">Gopay / OVO: 0812-3456-7890</div>
                    </div>
                    <div className="p-3 rounded-md bg-white/6">
                      <div className="text-xs opacity-80">Link Hadiah Digital</div>
                      <div className="font-semibold text-amber-300">https://gift.example.com/alya25</div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs opacity-80">Mohon konfirmasi pada RSVP agar mudah penataan tempat duduk & konsumsi.</div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="reveal mt-12 mb-12" aria-labelledby="faq-title">
            <div className="rounded-2xl p-6 md:p-10  bg-gradient-to-r from-yellow-400/10 to-amber-500/6 border border-white/8 shadow">
              <h2 id="faq-title" className="script text-3xl md:text-4xl">FAQ</h2>
              <div className="mt-6 space-y-3">
                {faqs.map((f, i) => (
                  <div key={i} className="bg-white/6 rounded-lg border border-white/8 overflow-hidden">
                    <button
                      onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between"
                      aria-expanded={openFAQ === i}
                    >
                      <div>
                        <div className="font-semibold">{f.q}</div>
                        <div className="text-xs opacity-80">Klik untuk lihat jawaban</div>
                      </div>
                      <div className={`transform transition ${openFAQ === i ? "rotate-180" : ""}`}>⌄</div>
                    </button>
                    <div
                      className={`
                        transition-all duration-500 ease-in-out overflow-hidden 
                        ${openFAQ === i ? "max-h-full px-4 pb-4 opacity-100" : "max-h-0 px-4 pb-0 opacity-0"}
                      `}
                    >
                      <div className="text-sm opacity-85">{f.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-12 mb-8 reveal">
            <div className="rounded-2xl p-6 md:p-10 bg-gradient-to-b from-white/6 to-white/8 border border-white/8 shadow">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="script text-2xl">Alya's 25th</div>
                  <div className="mt-2 text-sm opacity-80">Terima kasih atas doa & kehadiranmu. Sampai jumpa di acara!</div>
                  <div className="mt-4 flex gap-3">
                    <a href="#" className="text-sm opacity-80 hover:underline">Instagram</a>
                    <a href="#" className="text-sm opacity-80 hover:underline">YouTube</a>
                    <a href="#" className="text-sm opacity-80 hover:underline">Contact</a>
                  </div>
                </div>

                <div>
                  <div className="font-semibold">Menu</div>
                  <div className="mt-2 flex flex-col gap-2 text-sm">
                    <a href="#welcome" className="opacity-80 hover:underline">Welcome</a>
                    <a href="#acara" className="opacity-80 hover:underline">Acara</a>
                    <a href="#galeri" className="opacity-80 hover:underline">Galeri</a>
                    <a href="#rsvp" className="opacity-80 hover:underline">RSVP</a>
                  </div>
                </div>

                <div>
                  <div className="font-semibold">Alamat</div>
                  <div className="mt-2 text-sm opacity-85">
                    Gedung Serba Guna Anggrek<br />
                    Jl. Kenangan No.10, Jakarta
                  </div>
                  <div className="mt-3 text-xs opacity-70">© {new Date().getFullYear()} {BIRTHDAY_NAME}. All rights reserved.</div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
