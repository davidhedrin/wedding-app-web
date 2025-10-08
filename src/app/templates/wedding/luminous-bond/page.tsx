"use client";

// pages/index.tsx
import React, { useEffect, useState } from "react";
import Head from "next/head";
import useCountdown from "@/lib/countdown";

import bgImage from './bg.jpg';
import { formatDate } from "@/lib/utils";

/**
 * Invitation Type: Wedding
 * Theme Name: "Luminous Bond"
 * Create At: 10-09-2025
 * Create By: David
*/

const WEDDING_DATE = new Date();
WEDDING_DATE.setDate(WEDDING_DATE.getDate() + 12);

const HERO_IMAGES = [
  "http://localhost:3005/assets/img/2149043983.jpg",
  "http://localhost:3005/assets/img/2149043983.jpg",
  "http://localhost:3005/assets/img/2149043983.jpg",
];

const MAP_LAT = -6.200000; // contoh: Jakarta
const MAP_LNG = 106.816666;

const NavItem: React.FC<{ href: string; label: string; active?: boolean }> = ({
  href,
  label,
  active,
}) => (
  <a
    href={href}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-transform transform hover:-translate-y-0.5 ${active
      ? "text-white bg-gradient-to-r from-rose-500 to-amber-400 shadow-lg"
      : "text-rose-100/90 hover:text-white"
      }`}
    aria-current={active ? "page" : undefined}
  >
    {label}
  </a>
);

const formatTwo = (n: number) => String(n).padStart(2, "0");

export default function WeddingInvitePage() {
  // background carousel state
  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setBgIndex((i) => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(id);
  }, []);

  // countdown
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(WEDDING_DATE.toString());

  // active nav highlight (simple)
  const [active, setActive] = useState<string>("#hero");
  useEffect(() => {
    const sections = ["hero", "mempelai", "acara", "galeri", "cerita", "rsvp", "hadiah", "faq"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(`#${e.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // gallery slider
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryImages = HERO_IMAGES;

  // RSVP state (client-only)
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpEmail, setRsvpEmail] = useState("");
  const [rsvpGuest, setRsvpGuest] = useState(1);
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpSent, setRsvpSent] = useState(false);

  function submitRsvp(e: React.FormEvent) {
    e.preventDefault();
    // client-side fake submit
    setRsvpSent(true);
    setTimeout(() => {
      // reset form (optional)
      setRsvpName("");
      setRsvpEmail("");
      setRsvpGuest(1);
      setRsvpMessage("");
    }, 400);
  }

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqList = [
    { q: "Apakah tamu boleh membawa anak?", a: "Ya, anak boleh hadir. Mohon konfirmasi jumlah saat RSVP." },
    { q: "Adakah parkir untuk tamu?", a: "Tersedia parkir di lokasi resepsi. Mohon datang lebih awal untuk memudahkan penempatan." },
    { q: "Dress code apa yang disarankan?", a: "Dress code: Smart Formal / Kebaya modern. Pilih warna pastel atau netral." },
  ];

  // smooth scroll polyfill via CSS
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, []);

  // background overlay styles
  const bgStyle: React.CSSProperties = {
    backgroundImage: `url(${HERO_IMAGES[bgIndex]})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: "brightness(0.65) saturate(0.9)",
  };

  return (
    <>
      <Head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Page background fixed with overlay color (not plain white theme) */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage.src})`,
          filter: "blur(0px) brightness(0.7)",
        }}
        aria-hidden
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-rose-900/50 via-amber-900/30 to-slate-900/50" />

      <div className="min-h-screen text-rose-50 font-inter antialiased">
        {/* Navigation */}
        <header className="sticky top-0 z-40 backdrop-blur-sm bg-rose-900/30 border-b border-rose-800/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <a href="#hero" className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-300 to-rose-500 shadow-xl flex items-center justify-center text-rose-900 font-bold animate-pulse">
                    W
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-playfair text-rose-50">Undangan Pernikahan</div>
                    <div className="text-xs text-rose-200/70">Nadian & Stephen</div>
                  </div>
                </a>
              </div>

              <nav className="hidden md:flex items-center space-x-2">
                <NavItem href="#mempelai" label="Mempelai" active={active === "#mempelai"} />
                <NavItem href="#acara" label="Acara" active={active === "#acara"} />
                <NavItem href="#galeri" label="Galeri" active={active === "#galeri"} />
                <NavItem href="#cerita" label="Cerita" active={active === "#cerita"} />
                <NavItem href="#rsvp" label="RSVP" active={active === "#rsvp"} />
                <NavItem href="#hadiah" label="Hadiah" active={active === "#hadiah"} />
                <NavItem href="#faq" label="FAQ" active={active === "#faq"} />
              </nav>

              <div className="flex items-center gap-3">
                <a
                  href="#rsvp"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-rose-500 to-amber-400 text-slate-900 font-semibold shadow-lg transform transition hover:scale-105"
                >
                  Konfirmasi Kehadiran
                </a>
                <button
                  onClick={() => {
                    const el = document.getElementById("mempelai");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="md:hidden p-2 rounded-md bg-rose-800/40 hover:bg-rose-700/50"
                  aria-label="toggle menu"
                >
                  <i className='bx bx-chevrons-down text-lg'></i>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* HERO */}
          <section
            id="hero"
            className="relative overflow-hidden"
            style={{ minHeight: "80vh", fontFamily: "'Playfair Display', serif" }}
          >
            {/* Background carousel layer */}
            <div
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ ...bgStyle }}
              aria-hidden
            />
            {/* subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-rose-900/30 via-transparent to-slate-900/60" />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left (text) */}
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 bg-rose-800/40 px-4 py-2 rounded-full shadow-sm animate-fade-in">
                    <span className="text-xs uppercase tracking-wider text-amber-200">Undangan Resmi</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl md:text-6xl leading-tight font-playfair font-semibold">
                    Kami Mengundang Anda <br />
                    Untuk Menghadiri Hari Bahagia Kami
                  </h1>

                  <p className="text-rose-100/90 max-w-xl text-lg">
                    Dengan penuh suka cita, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan
                    kami. Kehadiran dan doa restu Anda sangat berarti bagi kami.
                  </p>

                  {/* Countdown card */}
                  <div
                    className="flex flex-col sm:flex-row items-center gap-4 bg-rose-800/40 p-4 rounded-xl shadow-lg border border-rose-700/40"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="text-center px-4 py-3 bg-rose-900/30 rounded-lg">
                      <div className="text-xs uppercase text-amber-200">Tanggal</div>
                      <div className="text-sm text-rose-100">{formatDate(WEDDING_DATE, "full", "short")}</div>
                    </div>

                    <div className="flex-1 grid grid-cols-4 gap-3">
                      {isExpired ? (
                        <div className="col-span-4 text-center p-4 bg-rose-900/40 rounded-md">
                          <div className="text-sm text-rose-200">Terima kasih telah hadir</div>
                          <div className="text-lg font-semibold">Acara telah berlalu — Kenang momen bersama kami</div>
                        </div>
                      ) : isToday ? (
                        <div className="col-span-4 text-center p-4 bg-gradient-to-r from-amber-400 to-rose-500 text-slate-900 rounded-md shadow-md">
                          <div className="text-sm font-semibold">Hari Ini</div>
                          <div className="text-lg font-bold">Selamat! Hari bahagia dimulai 🎉</div>
                        </div>
                      ) : (
                        <>
                          <div className="text-center p-2 bg-rose-900/20 rounded-md hover:scale-105 transition">
                            <div className="text-2xl font-semibold">{days}</div>
                            <div className="text-xs text-rose-200/70">Hari</div>
                          </div>
                          <div className="text-center p-2 bg-rose-900/20 rounded-md hover:scale-105 transition">
                            <div className="text-2xl font-semibold">{formatTwo(hours)}</div>
                            <div className="text-xs text-rose-200/70">Jam</div>
                          </div>
                          <div className="text-center p-2 bg-rose-900/20 rounded-md hover:scale-105 transition">
                            <div className="text-2xl font-semibold">{formatTwo(minutes)}</div>
                            <div className="text-xs text-rose-200/70">Menit</div>
                          </div>
                          <div className="text-center p-2 bg-rose-900/20 rounded-md hover:scale-105 transition">
                            <div className="text-2xl font-semibold">{formatTwo(seconds)}</div>
                            <div className="text-xs text-rose-200/70">Detik</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href="#mempelai"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 text-slate-900 font-semibold shadow-lg transform hover:scale-105 transition"
                    >
                      Buka Undangan
                      <span className="opacity-80">→</span>
                    </a>
                    <a
                      href="#rsvp"
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-rose-700 text-rose-100 bg-rose-900/30 hover:bg-rose-800/40 transition"
                    >
                      Konfirmasi Sekarang
                    </a>
                  </div>
                </div>

                {/* Right (image / couple card) */}
                <div className="relative">
                  <div className="rounded-2xl backdrop-blur-sm bg-rose-800/30 border border-rose-700/30 p-4 shadow-2xl transform hover:-translate-y-2 transition">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <img
                          src="http://localhost:3005/assets/img/2149043983.jpg"
                          alt="Mempelai 1"
                          className="w-full h-44 object-cover rounded-lg border border-rose-700/30 shadow-inner"
                        />
                        <div>
                          <div className="text-xs text-rose-200">Mempelai Wanita</div>
                          <div className="text-lg font-semibold">Nama Wanita</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <img
                          src="http://localhost:3005/assets/img/2149043983.jpg"
                          alt="Mempelai 2"
                          className="w-full h-44 object-cover rounded-lg border border-rose-700/30 shadow-inner"
                        />
                        <div>
                          <div className="text-xs text-rose-200">Mempelai Pria</div>
                          <div className="text-lg font-semibold">Nama Pria</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-rose-100/90">
                      Kami merasa sangat bahagia dan berharap Anda dapat hadir untuk memberi doa restu pada hari istimewa
                      kami.
                    </div>
                  </div>

                  {/* decorative badge */}
                  <div className="absolute -top-4 -right-4 rotate-6 bg-amber-400/20 border border-amber-300/30 px-3 py-1 rounded-lg text-amber-50 text-xs font-medium shadow">
                    10.10.2025
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mempelai */}
          <section id="mempelai" className="py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-playfair font-semibold">Mempelai</h2>
                <p className="text-rose-200/80 mt-2 max-w-2xl mx-auto">
                  Perkenalkan kedua mempelai beserta kata sambutan singkat untuk para tamu undangan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col items-center text-center space-y-4">
                  <img
                    src="http://localhost:3005/assets/img/2149043983.jpg"
                    alt="Mempelai 1"
                    className="w-64 h-64 object-cover rounded-full border-4 border-rose-700 shadow-lg"
                  />
                  <h3 className="text-2xl font-semibold">Nama Wanita</h3>
                  <p className="text-rose-200/80 max-w-sm">
                    Putri dari Bapak X & Ibu Y. Singkat tentang beliau, pendidikan, hobi, atau kutipan romantis.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <img
                    src="http://localhost:3005/assets/img/2149043983.jpg"
                    alt="Mempelai 2"
                    className="w-64 h-64 object-cover rounded-full border-4 border-rose-700 shadow-lg"
                  />
                  <h3 className="text-2xl font-semibold">Nama Pria</h3>
                  <p className="text-rose-200/80 max-w-sm">
                    Putra dari Bapak A & Ibu B. Informasi singkat mengenai beliau, pekerjaan, dan harapan untuk masa
                    depan.
                  </p>
                </div>
              </div>

              <div className="mt-10 bg-rose-900/30 p-6 rounded-2xl border border-rose-700/40 shadow-inner backdrop-blur-sm">
                <div className="text-lg font-playfair mb-2">Kata Sambutan</div>
                <p className="text-rose-200/80">
                  Assalamualaikum/Salam sejahtera. Kami berterima kasih atas kehadiran dan doa restu dari teman, keluarga
                  dan kerabat. Semoga acara ini membawa berkah dan kebahagiaan untuk kita semua.
                </p>
              </div>
            </div>
          </section>

          {/* Acara */}
          <section id="acara" className="py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-playfair font-semibold">Acara</h2>
                <p className="text-rose-200/80 mt-2 max-w-2xl mx-auto">Detail lengkap akad & resepsi beserta lokasi.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-rose-900/30 border border-rose-700/40 shadow backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="text-amber-300 text-2xl">💍</div>
                      <div>
                        <h3 className="font-semibold text-lg">Akad Nikah</h3>
                        <p className="text-rose-200/80">Jumat, 10 Oktober 2025 • 09:00 WIB</p>
                        <p className="mt-2 text-rose-200/70">Lokasi: Masjid Contoh, Jl. Contoh No.1, Kota</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-rose-900/30 border border-rose-700/40 shadow backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="text-amber-300 text-2xl">🎉</div>
                      <div>
                        <h3 className="font-semibold text-lg">Resepsi</h3>
                        <p className="text-rose-200/80">Sabtu, 11 Oktober 2025 • 18:00 WIB</p>
                        <p className="mt-2 text-rose-200/70">Lokasi: Ballroom Contoh, Jl. Resepsi No.2</p>
                        <p className="mt-2 text-sm text-rose-200/60">
                          Dress code: Smart Formal / Kebaya modern. Mohon hadir tepat waktu.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 text-sm rounded-lg bg-rose-900/20 border border-rose-700/30 backdrop-blur-sm">
                    <strong>Info Penting:</strong> Mohon konfirmasi kehadiran melalui form RSVP. Jika memerlukan
                    informasi tambahan (akomodasi / transport), hubungi panitia.
                  </div>
                </div>

                <div>
                  <div className="w-full h-80 rounded-xl overflow-hidden border border-rose-700/30 shadow-lg">
                    <iframe
                      title="Lokasi Pernikahan"
                      src={`https://maps.google.com/maps?q=${MAP_LAT},${MAP_LNG}&z=15&output=embed`}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Galeri */}
          <section id="galeri" className="py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-playfair font-semibold">Galeri</h2>
                <p className="text-rose-200/80 mt-2 max-w-2xl mx-auto">Kenangan kami dalam gambar.</p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-rose-700/30">
                    <img
                      src={galleryImages[galleryIndex]}
                      alt={`Gallery ${galleryIndex}`}
                      className="w-full h-96 object-cover transition-transform duration-700 transform hover:scale-105"
                    />
                  </div>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <button
                      onClick={() => setGalleryIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)}
                      className="p-3 rounded-full bg-rose-900/40 hover:bg-rose-800/60 transition"
                      aria-label="previous"
                    >
                      ‹
                    </button>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <button
                      onClick={() => setGalleryIndex((i) => (i + 1) % galleryImages.length)}
                      className="p-3 rounded-full bg-rose-900/40 hover:bg-rose-800/60 transition"
                      aria-label="next"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  {galleryImages.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIndex(i)}
                      className={`w-20 h-12 rounded-md overflow-hidden border-2 transition-transform transform hover:scale-105 ${galleryIndex === i ? "border-amber-400" : "border-rose-700/40"
                        }`}
                    >
                      <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Cerita */}
          <section id="cerita" className="py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-playfair font-semibold">Cerita Kami</h2>
                <p className="text-rose-200/80 mt-2 max-w-2xl mx-auto">Perjalanan cinta yang ingin kami bagi kepada Anda.</p>
              </div>

              <div className="relative">
                <div className="border-l-2 border-rose-700/50 ml-6 pl-8 space-y-8">
                  {/* timeline item */}
                  <div className="relative">
                    <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-rose-900 font-bold shadow">
                      1
                    </div>
                    <div className="bg-rose-900/30 p-4 rounded-xl border border-rose-700/30 backdrop-blur-sm">
                      <div className="font-semibold">Pertemuan Pertama</div>
                      <div className="text-sm text-rose-200/80">Di sebuah acara kecil, kami bertemu dan saling berkenalan.</div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-rose-900 font-bold shadow">
                      2
                    </div>
                    <div className="bg-rose-900/30 p-4 rounded-xl border border-rose-700/30 backdrop-blur-sm">
                      <div className="font-semibold">Perjalanan Bersama</div>
                      <div className="text-sm text-rose-200/80">Banyak momen berharga, liburan, hingga dukungan untuk mimpi masing-masing.</div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-rose-900 font-bold shadow">
                      3
                    </div>
                    <div className="bg-rose-900/30 p-4 rounded-xl border border-rose-700/30 backdrop-blur-sm">
                      <div className="font-semibold">Lamaran</div>
                      <div className="text-sm text-rose-200/80">Momen spesial yang mengikat janji untuk hidup bersama selamanya.</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4 justify-center">
                  <img
                    src="http://localhost:3005/assets/img/2149043983.jpg"
                    alt="cerita"
                    className="w-48 h-32 object-cover rounded-lg border border-rose-700/30 shadow"
                  />
                  <img
                    src="http://localhost:3005/assets/img/2149043983.jpg"
                    alt="cerita2"
                    className="w-48 h-32 object-cover rounded-lg border border-rose-700/30 shadow"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* RSVP */}
          <section id="rsvp" className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-playfair font-semibold">RSVP</h2>
                <p className="text-rose-200/80 mt-2 max-w-2xl mx-auto">Konfirmasi kehadiran Anda melalui form berikut.</p>
              </div>

              <form
                onSubmit={submitRsvp}
                className="bg-rose-900/30 p-6 rounded-2xl border border-rose-700/40 shadow-lg backdrop-blur-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-sm text-rose-200">Nama Lengkap</span>
                    <input
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      required
                      className="mt-1 px-3 py-2 rounded-md bg-rose-800/30 border border-rose-700/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="Nama Anda"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm text-rose-200">Email / WA</span>
                    <input
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      required
                      className="mt-1 px-3 py-2 rounded-md bg-rose-800/30 border border-rose-700/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="contoh@email.com / 08xxxxxxxx"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className="text-sm text-rose-200">Jumlah Tamu</span>
                    <input
                      type="number"
                      min={1}
                      value={rsvpGuest}
                      onChange={(e) => setRsvpGuest(Number(e.target.value))}
                      className="mt-1 px-3 py-2 rounded-md bg-rose-800/30 border border-rose-700/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className="text-sm text-rose-200">Kehadiran</span>
                    <select
                      className="mt-1 px-3 py-2 rounded-md bg-rose-800/30 border border-rose-700/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option>Hadir</option>
                      <option>Tidak Hadir</option>
                      <option>Belum Pasti</option>
                    </select>
                  </label>

                  <label className="flex flex-col col-span-1 md:col-span-2">
                    <span className="text-sm text-rose-200">Pesan / Doa</span>
                    <textarea
                      value={rsvpMessage}
                      onChange={(e) => setRsvpMessage(e.target.value)}
                      rows={4}
                      className="mt-1 px-3 py-2 rounded-md bg-rose-800/30 border border-rose-700/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="Tinggalkan pesan atau doa untuk kami..."
                    />
                  </label>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-rose-200/80">Data Anda akan digunakan hanya untuk keperluan acara.</div>
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 text-slate-900 font-semibold shadow hover:scale-105 transition"
                    >
                      Kirim
                    </button>
                  </div>
                </div>

                {rsvpSent && (
                  <div className="mt-4 p-3 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-200">
                    Terima kasih! RSVP telah diterima. Kami akan menghubungi Anda apabila diperlukan.
                  </div>
                )}
              </form>
            </div>
          </section>

          {/* Hadiah */}
          <section id="hadiah" className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-playfair font-semibold">Hadiah</h2>
                <p className="text-rose-200/80 mt-2">Jika ingin memberi hadiah, berikut informasi rekening & e-wallet.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-rose-900/30 border border-rose-700/30 text-center backdrop-blur-sm">
                  <div className="text-sm text-rose-200">Bank</div>
                  <div className="font-semibold text-lg mt-2">BCA</div>
                  <div className="text-rose-200/80 mt-1">a.n. Nama Rekening</div>
                  <div className="mt-3">
                    <button className="px-4 py-2 rounded-md border border-rose-700/40 hover:bg-rose-800/40 transition">
                      Salin No. Rekening
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-900/30 border border-rose-700/30 text-center backdrop-blur-sm">
                  <div className="text-sm text-rose-200">OVO / GoPay / Dana</div>
                  <div className="font-semibold text-lg mt-2">0812-xxxx-xxxx</div>
                  <div className="text-rose-200/80 mt-1">a.n. Nama</div>
                  <div className="mt-3">
                    <a
                      href="#"
                      className="px-4 py-2 rounded-md bg-amber-400 text-rose-900 font-medium hover:scale-105 transition inline-block"
                    >
                      Buka Pembayaran
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-900/30 border border-rose-700/30 text-center backdrop-blur-sm">
                  <div className="text-sm text-rose-200">Wishlist</div>
                  <div className="font-semibold text-lg mt-2">Link Online</div>
                  <div className="text-rose-200/80 mt-1">Pilihan hadiah praktis</div>
                  <div className="mt-3">
                    <a
                      href="#"
                      className="px-4 py-2 rounded-md border border-rose-700/40 hover:bg-rose-800/40 transition inline-block"
                    >
                      Lihat Wishlist
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-playfair font-semibold">FAQ</h2>
                <p className="text-rose-200/80 mt-2">Pertanyaan yang sering ditanyakan.</p>
              </div>

              <div className="space-y-3">
                {faqList.map((f, i) => (
                  <div key={i} className="bg-rose-900/30 p-3 rounded-lg border border-rose-700/30 backdrop-blur-sm">
                    <button
                      className="w-full flex items-center justify-between text-left"
                      onClick={() => setOpenFaq((prev) => (prev === i ? null : i))}
                      aria-expanded={openFaq === i}
                    >
                      <div>
                        <div className="font-semibold">{f.q}</div>
                        <div className="text-sm text-rose-200/70">{openFaq === i ? "Klik untuk tutup" : "Klik untuk buka"}</div>
                      </div>
                      <div className="text-2xl">{openFaq === i ? "−" : "+"}</div>
                    </button>
                    {openFaq === i && <div className="mt-3 text-rose-200/80">{f.a}</div>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-10 border-t border-rose-800/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    W
                  </div>
                  <div>
                    <div className="font-semibold">Nadian & Stephen</div>
                    <div className="text-sm text-rose-200/80">10 Oktober 2025</div>
                  </div>
                </div>

                <nav className="flex flex-wrap items-center gap-2">
                  <a className="text-sm text-rose-200/80 hover:text-amber-300" href="#mempelai">Mempelai</a>
                  <a className="text-sm text-rose-200/80 hover:text-amber-300" href="#acara">Acara</a>
                  <a className="text-sm text-rose-200/80 hover:text-amber-300" href="#galeri">Galeri</a>
                  <a className="text-sm text-rose-200/80 hover:text-amber-300" href="#rsvp">RSVP</a>
                  <a className="text-sm text-rose-200/80 hover:text-amber-300" href="#faq">FAQ</a>
                </nav>

                <div className="text-sm text-rose-200/70">Made with ❤️ — Terima kasih atas doa dan kehadirannya.</div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <style jsx global>{`
        html,
        body,
        #__next {
          height: 100%;
        }
        body {
          margin: 0;
          background-color: #0f1724;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
        }
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
