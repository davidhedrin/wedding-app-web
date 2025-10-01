"use client";

// pages/invitation.tsx
import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import useCountdown from "@/lib/countdown";

/**
 * Invitation Type: Birthday
 * Theme Name: "Radiant Party"
 * Create At: 10-09-2025
 * Create By: David
*/

type RSVPData = {
  name: string;
  guests: number;
  message?: string;
  attending: "yes" | "no" | "maybe";
  contact?: string;
};

const TARGET_DATE = new Date();
TARGET_DATE.setDate(TARGET_DATE.getDate() + 12);

const HERO_IMAGES = [
  "http://localhost:3005/assets/img/2149043983.jpg",
  // Anda bisa menambahkan url gambar lain di sini bila tersedia
];

export default function InvitationPage() {
  // Countdown state
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(TARGET_DATE.toString());

  // hero carousel
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setHeroIdx((p) => (p + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  // reveal on scroll
  const revealRefs = useRef<HTMLDivElement[]>([]);
  const addRevealRef = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // gallery simple slider
  const galleryImages = [
    ...HERO_IMAGES,
    // dummy repeats for demo
    "http://localhost:3005/assets/img/2149043983.jpg",
  ];
  const [gIdx, setGIdx] = useState(0);

  // RSVP form state
  const [rsvp, setRsvp] = useState<RSVPData>({
    name: "",
    guests: 1,
    attending: "yes",
    message: "",
    contact: "",
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  function handleRsvpSubmit(e: React.FormEvent) {
    e.preventDefault();
    // NOTE: hanya front-end demo. Integrasi backend / API sesuai kebutuhan.
    setRsvpSubmitted(true);
    setTimeout(() => {
      // reset atau tetap tampil sukses
    }, 1200);
  }

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    {
      q: "Apakah acara terbuka untuk umum?",
      a: "Acara ini adalah undangan tertutup untuk tamu yang diundang. Mohon konfirmasi melalui form RSVP.",
    },
    {
      q: "Apakah disediakan parkir?",
      a: "Tersedia area parkir di lokasi, namun disarankan untuk datang lebih awal atau berbagi tumpangan.",
    },
    {
      q: "Apakah ada dress code?",
      a: "Dress code: Smart Casual dengan sentuhan warna pastel / gold untuk foto yang estetik.",
    },
  ];

  // helper smooth scroll
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, []);

  return (
    <>
      <Head>
        <title>Undangan Ulang Tahun - Digital</title>

        {/* Fonts: playful script + modern sans */}
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@300;400;600;800&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-yellow-50 text-slate-800 antialiased">
        {/* decorative global overlay */}
        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none opacity-70"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,99,132,0.12), rgba(255,215,0,0.08))",
            mixBlendMode: "overlay",
          }}
        />

        {/* Sticky header / nav */}
        <header className="fixed top-4 left-0 right-0 z-50">
          <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="backdrop-blur-sm bg-white/30 border border-white/30 rounded-3xl shadow-lg py-3 px-4 flex items-center justify-between">
              <a
                href="#hero"
                className="flex items-center gap-3"
                aria-label="Beranda"
              >
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center ring-1 ring-white/40">
                  <span className="text-pink-600 font-bold" style={{ fontFamily: 'Great Vibes, cursive' }}>A</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold">Undangan</div>
                  <div className="text-xs text-slate-700/80">Birthday Party</div>
                </div>
              </a>

              <div className="hidden md:flex items-center gap-4">
                <a className="nav-link" href="#welcome">Welcome</a>
                <a className="nav-link" href="#acara">Acara</a>
                <a className="nav-link" href="#galeri">Galeri</a>
                <a className="nav-link" href="#momen">Cerita</a>
                <a className="nav-link" href="#rsvp">RSVP</a>
                <a className="nav-link" href="#hadiah">Hadiah</a>
                <a className="nav-link" href="#faq">FAQ</a>
              </div>

              <div className="flex items-center gap-3">
                <a href="#rsvp" className="btn-primary px-3 py-2 rounded-lg text-sm">
                  Konfirmasi
                </a>
                <button
                  onClick={() =>
                    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
                  }
                  className="p-2 rounded-full bg-white/40 hover:bg-white/60 transition"
                  title="Scroll ke bawah"
                >
                  <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
            </div>
          </nav>
        </header>

        <main className="pt-28">
          {/* HERO */}
          <section id="hero" className="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                {/* background carousel */}
                <div className="lg:col-span-7 relative h-[420px] sm:h-[520px] lg:h-[620px]">
                  {HERO_IMAGES.map((src, i) => (
                    <div
                      key={i}
                      className={`absolute inset-0 transition-opacity duration-1200 ease-out transform ${i === heroIdx ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                        }`}
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(255,255,255,0.02)), url(${src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      aria-hidden
                    />
                  ))}

                  {/* decorative confetti overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                      {/* subtle shapes */}
                      <circle cx="680" cy="60" r="120" fill="rgba(255,215,0,0.06)" />
                      <circle cx="80" cy="540" r="160" fill="rgba(255,99,132,0.04)" />
                    </svg>
                  </div>

                  {/* overlay content - center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-6 sm:px-10">
                      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-lg" style={{ fontFamily: "Great Vibes, cursive" }}>
                        Selamat Ulang Tahun, Anna!
                      </h1>
                      <p className="mt-3 text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto drop-shadow">
                        Mari rayakan momen spesial dengan hangat, tawa, dan kenangan tak terlupakan.
                      </p>

                      <div className="mt-8 flex items-center justify-center gap-4">
                        <button
                          onClick={() =>
                            document.getElementById("welcome")?.scrollIntoView({ behavior: "smooth" })
                          }
                          className="btn-cta px-6 py-3 rounded-full shadow-lg transform hover:-translate-y-0.5 transition"
                        >
                          Buka Undangan
                        </button>

                        <a
                          href="#rsvp"
                          className="px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white text-sm hover:bg-white/30 transition"
                        >
                          Konfirmasi Kehadiran
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* right panel with countdown + details */}
                <div className="lg:col-span-5 bg-gradient-to-b from-white/70 via-white/50 to-white/30 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <div className="rounded-xl p-4 bg-white/60 backdrop-blur-sm border border-white/40 shadow-md">
                    <div className="mt-6 text-center">
                      {isExpired ? (
                        <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-100 via-slate-100 to-gray-200 border shadow">
                          <h4 className="text-lg font-semibold text-slate-600">Acara Telah Selesai</h4>
                          <p className="mt-3 text-sm text-slate-500">
                            Terima kasih banyak untuk semua yang hadir dan memberikan doa terbaik 💕
                          </p>
                          <div className="mt-4 text-xs text-slate-400 italic">
                            Sampai jumpa di momen spesial berikutnya.
                          </div>
                        </div>
                      ) : isToday ? (
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-200 via-rose-200 to-pink-100 border shadow-xl animate-pulse">
                          <h4 className="text-xl font-bold text-amber-700 flex items-center justify-center gap-2">
                            🎉 Hari Ini Pesta Dimulai! 🎉
                          </h4>
                          <div className="mt-4 flex items-center justify-center gap-6 text-center">
                            <div className="px-6 py-4 bg-white/80 rounded-xl shadow-lg border">
                              <span className="block text-3xl font-extrabold text-rose-600">Mulai</span>
                              <span className="text-sm text-slate-600">18:00 WIB</span>
                            </div>
                            <div className="px-6 py-4 bg-white/80 rounded-xl shadow-lg border">
                              <span className="block text-3xl font-extrabold text-rose-600">Sampai</span>
                              <span className="text-sm text-slate-600">Selesai</span>
                            </div>
                          </div>
                          <p className="mt-5 text-sm font-medium text-amber-800">
                            Saatnya bersenang-senang, jangan lewatkan momen berharga ini ✨
                          </p>
                        </div>
                      ) : (
                        <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-50 to-yellow-100 border shadow-inner">
                          <h4 className="text-lg font-semibold text-rose-600">Hitung Mundur Menuju Hari Spesial 🎂</h4>
                          <div className="mt-4 grid grid-cols-4 gap-3">
                            <TimeCard label="Hari" value={days} highlight />
                            <TimeCard label="Jam" value={hours} />
                            <TimeCard label="Menit" value={minutes} />
                            <TimeCard label="Detik" value={seconds} />
                          </div>
                          <p className="mt-4 text-sm text-slate-700">
                            Tidak sabar menunggu kamu hadir dengan senyum terbaikmu 💖
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="text-xs text-slate-600">Tanggal</div>
                      <div className="text-sm font-medium">25 Sep 2025 • 18:00 WIB</div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs text-slate-600">Tempat</div>
                      <div className="text-sm font-medium">Garden Hall, The Green Lounge</div>
                    </div>
                  </div>

                  {/* small CTA */}
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => document.getElementById("acara")?.scrollIntoView({ behavior: "smooth" })}
                      className="px-4 py-2 rounded-full bg-rose-500 text-white shadow hover:scale-[1.01] transition"
                    >
                      Lihat Detail Acara
                    </button>
                  </div>
                </div>
              </div>

              {/* small pager dots */}
              <div className="mt-4 flex items-center justify-center gap-2">
                {HERO_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setHeroIdx(i)}
                    className={`w-3 h-3 rounded-full transition ${i === heroIdx ? "bg-rose-600 scale-110" : "bg-white/60"
                      }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* WELCOME */}
          <section id="welcome" className="pt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                ref={(el) => {
                  if (el) addRevealRef(el);
                }}
                className="reveal-card rounded-2xl bg-white/80 border border-white/40 p-6 sm:p-8 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
              >
                <div className="md:col-span-1 flex items-center justify-center">
                  <img
                    src="http://localhost:3005/assets/img/2149043983.jpg"
                    alt="Foto yang berulang tahun"
                    className="w-48 h-48 rounded-xl object-cover ring-4 ring-white shadow"
                  />
                </div>
                <div className="md:col-span-2">
                  <h2 className="text-3xl font-extrabold" style={{ fontFamily: "Great Vibes, cursive" }}>
                    Anna Salsabila <span className="text-sm font-medium ml-2 align-top">• 25 Tahun</span>
                  </h2>
                  <p className="mt-3 text-slate-700">
                    Halo sahabat & keluarga—terima kasih sudah menjadi bagian dari perjalanan hidupku.
                    Mari bergabung dan rayakan ulang tahunku dengan hangat, tawa, dan kenangan baru.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <div className="badge">🎂 Birthday Girl</div>
                    <div className="badge">📍 Jakarta</div>
                    <div className="badge">✨ Tema: Pastel & Gold</div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <a href="#galeri" className="btn-outline">Lihat Galeri</a>
                    <a href="#rsvp" className="btn-primary">Konfirmasi Sekarang</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ACARA */}
          <section id="acara" className="pt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div ref={(el) => {
                if (el) addRevealRef(el);
              }} className="rounded-2xl bg-gradient-to-r from-amber-50 to-pink-50 p-6 sm:p-8 shadow-inner border border-white/30">
                <h3 className="text-2xl font-semibold">Detail Acara</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-white/80 rounded-xl border">
                    <div className="text-xs text-slate-500">Tanggal</div>
                    <div className="mt-2 font-medium">Kamis, 25 September 2025</div>
                    <div className="text-sm text-slate-600 mt-1">Mulai 18:00 WIB</div>
                  </div>
                  <div className="p-4 bg-white/80 rounded-xl border">
                    <div className="text-xs text-slate-500">Tempat</div>
                    <div className="mt-2 font-medium">Garden Hall, The Green Lounge</div>
                    <div className="text-sm text-slate-600 mt-1">Jl. Merdeka No. 42, Jakarta</div>
                  </div>
                  <div className="p-4 bg-white/80 rounded-xl border">
                    <div className="text-xs text-slate-500">Dress Code</div>
                    <div className="mt-2 font-medium">Smart Casual — Sentuhan Pastel / Gold</div>
                    <div className="text-sm text-slate-600 mt-1">Tema foto: Pastel & Gold</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white/70 p-4 rounded-xl border">
                    <h4 className="font-semibold">Agenda Singkat</h4>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      <li>18:00 — Registrasi & Welcome Drink</li>
                      <li>19:00 — Pembukaan & Sambutan</li>
                      <li>19:30 — Makan Bersama & Games</li>
                      <li>20:30 — Potong Kue & Foto Bersama</li>
                      <li>21:00 — Penutupan</li>
                    </ul>
                  </div>

                  <div className="bg-white/70 rounded-xl p-3 border">
                    <h4 className="font-semibold">Lokasi</h4>
                    <div className="mt-3 w-full h-48 rounded overflow-hidden">
                      {/* Google Maps iframe - ganti src dengan koordinat sebenarnya */}
                      <iframe
                        title="Lokasi Acara"
                        src="https://www.google.com/maps?q=jakarta+city+hall&output=embed"
                        className="w-full h-full"
                      />
                    </div>
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-sm text-rose-600"
                    >
                      Buka di Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* GALERI */}
          <section id="galeri" className="pt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div ref={(el) => {
                if (el) addRevealRef(el);
              }} className="bg-gradient-to-r from-amber-100 to-pink-100 rounded-2xl p-6 sm:p-8 shadow">
                <h3 className="text-2xl font-semibold">Galeri Foto</h3>
                <div className="mt-6 relative">
                  <div className="h-64 sm:h-80 rounded-xl overflow-hidden">
                    <img
                      src={galleryImages[gIdx]}
                      alt={`Gallery ${gIdx + 1}`}
                      className="w-full h-full object-cover transform transition-transform duration-700"
                      style={{ filter: "saturate(1.05) contrast(1.02)" }}
                    />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-between px-3">
                    <button
                      onClick={() => setGIdx((p) => (p - 1 + galleryImages.length) % galleryImages.length)}
                      className="p-2 rounded-lg bg-white/40 hover:bg-white/60"
                      aria-label="Prev"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setGIdx((p) => (p + 1) % galleryImages.length)}
                      className="p-2 rounded-lg bg-white/40 hover:bg-white/60"
                      aria-label="Next"
                    >
                      ›
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    {galleryImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setGIdx(i)}
                        className={`w-2 h-2 rounded-full ${i === gIdx ? "bg-rose-600" : "bg-slate-200"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CERITA / MOMEN */}
          <section id="momen" className="pt-20 pb-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div ref={(el) => {
                if (el) addRevealRef(el);
              }} className="rounded-2xl bg-gradient-to-r from-amber-50 to-pink-50 p-6 sm:p-8 shadow">
                <h3 className="text-2xl font-semibold">Cerita & Momen Spesial</h3>
                <div className="mt-6 space-y-6">
                  <TimelineItem year="2000" title="Kelahiran" desc="Lahir di sebuah keluarga hangat, membawa kebahagiaan." />
                  <TimelineItem year="2012" title="SMP" desc="Mulai suka kreativitas, ikut lomba seni, dan bertemu teman terbaik." />
                  <TimelineItem year="2018" title="Perguruan Tinggi" desc="Mengembangkan passion, berpetualang, dan belajar banyak hal baru." />
                  <TimelineItem year="2024" title="Karier & Mimpi" desc="Mencapai milestone penting dan mempersiapkan masa depan cerah." />
                </div>
              </div>
            </div>
          </section>

          {/* RSVP */}
          <section id="rsvp" className="pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div ref={(el) => {
                if (el) addRevealRef(el);
              }} className="rounded-2xl bg-gradient-to-r from-amber-100 to-pink-100 p-6 sm:p-8 border shadow">
                <h3 className="text-2xl font-semibold">Konfirmasi Kehadiran (RSVP)</h3>
                <p className="mt-2 text-sm text-slate-600">Mohon isi form berikut supaya kami bisa menyiapkan tempat & konsumsi.</p>

                {!rsvpSubmitted ? (
                  <form onSubmit={handleRsvpSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm">Nama</label>
                      <input
                        required
                        value={rsvp.name}
                        onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })}
                        className="mt-1 block w-full rounded-lg p-3 border focus:outline-none focus:ring focus:ring-rose-200"
                        placeholder="Nama lengkap"
                      />
                    </div>

                    <div>
                      <label className="text-sm">Kontak (WA / Email)</label>
                      <input
                        value={rsvp.contact}
                        onChange={(e) => setRsvp({ ...rsvp, contact: e.target.value })}
                        className="mt-1 block w-full rounded-lg p-3 border focus:outline-none focus:ring focus:ring-rose-200"
                        placeholder="+62 812-3456-7890"
                      />
                    </div>

                    <div>
                      <label className="text-sm">Hadir?</label>
                      <select
                        value={rsvp.attending}
                        onChange={(e) => setRsvp({ ...rsvp, attending: e.target.value as any })}
                        className="mt-1 block w-full rounded-lg p-3 border"
                      >
                        <option value="yes">Ya, hadir</option>
                        <option value="no">Tidak bisa</option>
                        <option value="maybe">Mungkin</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm">Jumlah Tamu</label>
                      <input
                        type="number"
                        min={0}
                        value={rsvp.guests}
                        onChange={(e) => setRsvp({ ...rsvp, guests: Number(e.target.value) })}
                        className="mt-1 block w-full rounded-lg p-3 border"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm">Pesan untuk yang berulang tahun</label>
                      <textarea
                        value={rsvp.message}
                        onChange={(e) => setRsvp({ ...rsvp, message: e.target.value })}
                        className="mt-1 block w-full rounded-lg p-3 border h-28"
                        placeholder="Semoga bahagia selalu..."
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3">
                      <button type="submit" className="btn-primary px-6 py-3 rounded-full">
                        Kirim RSVP
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRsvp({
                            name: "",
                            guests: 1,
                            message: "",
                            attending: "yes",
                            contact: "",
                          });
                        }}
                        className="btn-outline"
                      >
                        Reset
                      </button>

                      <div className="text-sm text-slate-500 ml-auto">Terima kasih atas konfirmasinya!</div>
                    </div>
                  </form>
                ) : (
                  <div className="mt-6 p-6 bg-white/60 rounded-xl border text-center">
                    <h4 className="text-lg font-semibold">Terima kasih!</h4>
                    <p className="mt-2 text-sm text-slate-700">RSVP Anda telah kami terima. Sampai jumpa di acara! 🎉</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* HADIAH */}
          <section id="hadiah" className="pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div ref={(el) => {
                if (el) addRevealRef(el);
              }} className="rounded-2xl bg-white/80 p-6 sm:p-8 border shadow">
                <h3 className="text-2xl font-semibold">Hadiah & Ucapan</h3>
                <p className="mt-2 text-sm text-slate-600">Jika Anda ingin memberikan kado digital, kami sangat menghargainya. Berikut beberapa opsi:</p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-rose-50 rounded-xl border">
                    <div className="text-xs text-slate-500">Bank</div>
                    <div className="font-medium mt-2">BCA • 123-456-789</div>
                    <div className="text-sm text-slate-600">a.n. Anna Salsabila</div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border">
                    <div className="text-xs text-slate-500">GoPay</div>
                    <div className="font-medium mt-2">0812-3456-7890</div>
                    <div className="text-sm text-slate-600">Nama: Anna S.</div>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl border">
                    <div className="text-xs text-slate-500">E-Wallet</div>
                    <div className="font-medium mt-2">Link: bit.ly/hadiah-anna</div>
                    <div className="text-sm text-slate-600">Klik untuk transfer cepat</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
              <div ref={(el) => {
                if (el) addRevealRef(el);
              }} className="rounded-2xl bg-gradient-to-t from-white/80 to-pink-50 p-6 sm:p-8 shadow">
                <h3 className="text-2xl font-semibold">FAQ</h3>
                <div className="mt-4 space-y-3">
                  {faqs.map((f, i) => (
                    <div key={i} className="bg-white/70 rounded-lg border">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full text-left px-4 py-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{f.q}</div>
                        </div>
                        <div className="text-slate-600">{openFaq === i ? "−" : "+"}</div>
                      </button>
                      <div className={`px-4 pb-0 transition-maxh overflow-hidden ${openFaq === i ? "max-h-96" : "max-h-0"}`}>
                        <p className="text-sm text-slate-700">{f.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-10 bg-gradient-to-t from-white/60 to-transparent">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold" style={{ fontFamily: "Great Vibes, cursive" }}>Anna's Birthday</div>
                  <div className="text-sm text-slate-600">Terima kasih atas doa & kehadirannya.</div>
                </div>

                <div className="flex items-center gap-3">
                  <a className="social" href="#" aria-label="Instagram">IG</a>
                  <a className="social" href="#" aria-label="WhatsApp">WA</a>
                  <a className="social" href="#" aria-label="YouTube">YT</a>
                </div>
              </div>

              <div className="mt-6 text-sm text-slate-500">
                © {new Date().getFullYear()} — Undangan Digital • Dibuat dengan ❤
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Inline styles for reusable components */}
      <style jsx>{`
        :root {
          --accent: #ff4d6d;
          --muted: #6b7280;
        }
        .btn-primary {
          background: linear-gradient(90deg, rgba(255,94,109,1) 0%, rgba(255,148,114,1) 100%);
          color: white;
          font-weight: 600;
          box-shadow: 0 8px 24px rgba(255,94,109,0.18);
        }
        .btn-cta {
          background: linear-gradient(90deg, rgba(255,215,64,1) 0%, rgba(255,99,132,0.95) 100%);
          color: #111827;
          font-weight: 700;
        }
        .btn-outline {
          background: transparent;
          border: 1px solid rgba(99,102,241,0.08);
          padding: 0.6rem 1rem;
        }
        .nav-link {
          color: #111827;
          padding: 0.5rem 0.75rem;
          border-radius: 999px;
          font-weight: 600;
          transition: all 160ms;
        }
        .nav-link:hover {
          transform: translateY(-2px);
          background: rgba(255,99,132,0.06);
        }
        .badge {
          background: linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.55));
          padding: 0.375rem 0.65rem;
          border-radius: 999px;
          font-size: 0.85rem;
          border: 1px solid rgba(0,0,0,0.04);
        }
        .social {
          background: rgba(255,255,255,0.6);
          padding: 0.45rem 0.6rem;
          border-radius: 8px;
          font-weight: 600;
          border: 1px solid rgba(0,0,0,0.04);
        }

        /* reveal animations */
        .reveal-card {
          opacity: 0;
          transform: translateY(18px) scale(0.995);
          transition: opacity 700ms ease, transform 700ms cubic-bezier(.2,.9,.2,1);
        }
        .reveal-visible {
          opacity: 1 !important;
          transform: translateY(0) scale(1) !important;
        }

        /* FAQ collapse */
        .transition-maxh {
          transition: max-height 450ms cubic-bezier(.2,.9,.2,1), padding 250ms;
        }
      `}</style>
    </>
  );
}

/* small subcomponents */
function TimeCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div
      className={`rounded-lg p-4 flex flex-col items-center justify-center border shadow-sm transition transform ${highlight
        ? "bg-rose-500 text-white scale-105"
        : "bg-white/90 text-slate-800 hover:scale-105 hover:shadow-md"
        }`}
    >
      <div className="text-xs font-medium opacity-80">{label}</div>
      <div className="text-2xl font-bold mt-1">{value.toString().padStart(2, "0")}</div>
    </div>
  );
}

function TimelineItem({ year, title, desc }: { year: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 text-center">
        <div className="text-sm font-semibold text-rose-600">{year}</div>
      </div>
      <div className="flex-1 bg-white/60 border rounded-lg p-4">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-slate-600 mt-1">{desc}</div>
      </div>
    </div>
  );
}
