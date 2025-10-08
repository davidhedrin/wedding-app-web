"use client";

// pages/wedding.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import useCountdown from "@/lib/countdown";

/**
 * Invitation Type: Wedding
 * Theme Name: "Sacred Union"
 * Create At: 09-09-2025
 * Create By: David
*/

/* ==================== CONFIG ==================== */
const IMAGE_SRC = "http://localhost:3005/assets/img/2149043983.jpg";
// Example date (YYYY-MM-DDTHH:MM:SS); replace with actual wedding datetime in local timezone.
const WEDDING_DATE = new Date();
WEDDING_DATE.setDate(WEDDING_DATE.getDate() + 12);
/* ================================================= */

type RSVPData = {
  name: string;
  email?: string;
  guests: number;
  message?: string;
  attending: "yes" | "no" | "maybe";
};

export default function WeddingInvite() {
  /* Countdown logic */
  const target = useMemo(() => new Date(WEDDING_DATE), []);
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(WEDDING_DATE.toString());

  /* Hero carousel (simple) */
  const heroImages = [IMAGE_SRC, IMAGE_SRC, IMAGE_SRC]; // can add multiple unique urls
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setHeroIndex((i) => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(iv);
  }, [heroImages.length]);

  /* Smooth scroll helper */
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* RSVP state */
  const [rsvp, setRsvp] = useState<RSVPData>({
    name: "",
    guests: 1,
    attending: "yes",
  });
  const [rsvpStatus, setRsvpStatus] = useState<null | "idle" | "sending" | "done" | "error">(null);

  async function submitRsvp(e: React.FormEvent) {
    e.preventDefault();
    setRsvpStatus("sending");
    try {
      // Example: POST to /api/rsvp (implement server-side)
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rsvp),
      });
      setRsvpStatus("done");
    } catch (err) {
      console.error(err);
      setRsvpStatus("error");
    }
  }

  /* Gallery slider refs */
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const slideGallery = (dir: "left" | "right") => {
    if (!galleryRef.current) return;
    const w = galleryRef.current.clientWidth;
    galleryRef.current.scrollBy({ left: dir === "right" ? w * 0.8 : -w * 0.8, behavior: "smooth" });
  };

  /* FAQ accordion */
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* small utility for formatted wedding date */
  const formattedDate = target.toLocaleString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root{
            --accent: #b8846b; /* elegant warm accent */
            --muted: #e6ddd8;
            --bg-dark: #0f1113; /* optional dark layer */
            --paper: #f6f2ef;
          }
          html { scroll-behavior: smooth; }
          /* small utility to enable backdrop blur on supported browsers */
          .backdrop-blur-smooth { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        `}</style>
      </Head>

      <div className="min-h-screen font-inter text-gray-100 bg-gradient-to-b from-[#0b0f10] via-[#121313] to-[#1b1d1f]">
        {/* Sticky nav */}
        <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-8">
          <nav className="max-w-5xl mx-auto flex items-center justify-between bg-black backdrop-blur-smooth border border-white/6 rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollTo("hero")}
                className="flex items-center gap-2"
                aria-label="home"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ring-1 ring-white/6 hover:scale-105 transition-transform">
                  <span className="font-playfair text-lg text-white">W</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-sm font-semibold">Undangan</span>
                  <div className="text-xs text-white/60">Nadian &amp; Stephen</div>
                </div>
              </button>
            </div>

            <ul className="hidden md:flex items-center gap-4 text-sm">
              {[
                ["mempelai", "Mempelai"],
                ["acara", "Acara"],
                ["galeri", "Galeri"],
                ["cerita", "Cerita"],
                ["rsvp", "RSVP"],
                ["hadiah", "Hadiah"],
                ["faq", "FAQ"],
              ].map(([id, label]) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollTo("rsvp")}
                className="hidden sm:inline-block px-4 py-2 rounded-md bg-gradient-to-r from-[#b8846b] to-[#a46d49] text-sm font-semibold shadow hover:brightness-105 transform hover:-translate-y-0.5 transition"
              >
                RSVP
              </button>
              <button
                onClick={() => scrollTo("hadiah")}
                className="px-3 py-2 rounded-md border border-white/6 hover:bg-white/3 transition"
                aria-label="Hadiah"
              >
                Hadiah
              </button>
            </div>
          </nav>
        </header>

        {/* HERO */}
        <section id="hero" className="pt-24 pb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Background carousel */}
              <div className="relative h-screen sm:h-[480px] md:h-[420px] lg:h-[520px]">
                {heroImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`hero ${i}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === heroIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                      }`}
                    style={{ willChange: "opacity, transform" }}
                  />
                ))}

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60"></div>

                {/* content */}
                <div className="absolute inset-0 flex flex-col md:flex-row items-center md:items-end justify-center md:justify-between p-6 md:p-12 gap-6">
                  {/* Left content: titles + countdown */}
                  <div className="max-w-xl text-center md:text-left text-white/95 space-y-4">
                    <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl leading-tight drop-shadow-lg">
                      Undangan Pernikahan
                      <span className="block text-2xl sm:text-3xl font-medium mt-1 opacity-90">Nadian Kristel Anisa &amp; Stephen Angga</span>
                    </h1>

                    <p className="text-sm sm:text-base text-white/80 max-w-md">
                      Dengan penuh bahagia kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan
                      memberikan do'a restu pada acara pernikahan kami.
                    </p>

                    {/* Countdown card */}
                    <div
                      className="mt-4 inline-flex items-center gap-4 rounded-xl bg-white/6 px-4 py-3 backdrop-blur-smooth border border-white/8 shadow-sm"
                      style={{ alignItems: "center" }}
                    >
                      {/* Visual badge for state */}
                      <div
                        className={`px-3 py-2 rounded-md text-sm font-semibold ${isExpired ? "bg-white/6" : isToday ? "bg-[#b8846b]" : "bg-white/6"}`}
                      >
                        {isExpired ? "Telah Lewat" : isToday ? "Hari H" : "Menunggu Hari H"}
                      </div>

                      {/* Countdown numbers or message */}
                      <div className="flex items-center gap-2 text-sm sm:text-base">
                        {isExpired ? (
                          <div className="text-sm">
                            <div className="font-semibold">Terima kasih</div>
                            <div className="text-xs text-white/70">Telah hadir / memberikan doa restu</div>
                          </div>
                        ) : isToday ? (
                          <div className="text-sm">
                            <div className="font-semibold">Hari Ini</div>
                            <div className="text-xs text-white/70">Selamat datang di hari bahagia kami</div>
                          </div>
                        ) : (
                          <>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{days}</div>
                              <div className="text-xs text-white/60">Hari</div>
                            </div>
                            <div className="text-center hidden sm:block">
                              <div className="text-lg font-semibold">{hours}</div>
                              <div className="text-xs text-white/60">Jam</div>
                            </div>
                            <div className="text-center hidden sm:block">
                              <div className="text-lg font-semibold">{minutes}</div>
                              <div className="text-xs text-white/60">Menit</div>
                            </div>
                            <div className="text-center hidden md:block">
                              <div className="text-lg font-semibold">{seconds}</div>
                              <div className="text-xs text-white/60">Detik</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center">
                      <button
                        onClick={() => scrollTo("mempelai")}
                        className="px-5 py-3 rounded-full bg-gradient-to-r from-[#b8846b] to-[#a46d49] font-semibold shadow hover:scale-[1.02] transition transform"
                      >
                        Buka Undangan
                      </button>

                      <a
                        href="#acara"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollTo("acara");
                        }}
                        className="text-sm text-white/80 underline hover:text-white transition"
                      >
                        Lihat Detail Acara & Lokasi
                      </a>
                    </div>
                  </div>

                  {/* Right content: decorative card with names + small image */}
                  <div className="w-full md:w-80 lg:w-96 backdrop-blur-smooth bg-white/5 rounded-2xl p-4 border border-white/6 shadow-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src={IMAGE_SRC}
                        alt="mempelai"
                        className="w-20 h-20 rounded-lg object-cover ring-1 ring-white/10"
                      />
                      <div>
                        <div className="text-sm text-white/80">Kami yang berbahagia</div>
                        <div className="font-playfair text-lg">Nadian</div>
                        <div className="font-playfair text-lg"> &amp; </div>
                        <div className="font-playfair text-lg">Stephen</div>
                        <div className="text-xs text-white/60 mt-1">{formattedDate}</div>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-white/70">
                      Dress code: <span className="font-semibold">Elegant / Semi Formal</span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => scrollTo("rsvp")}
                        className="flex-1 px-3 py-2 rounded-md border border-white/10 hover:bg-white/5 transition"
                      >
                        Konfirmasi Sekarang
                      </button>
                      <a
                        href="#hadiah"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollTo("hadiah");
                        }}
                        className="px-3 py-2 rounded-md bg-white/6 text-sm hover:brightness-105 transition"
                      >
                        Hadiah
                      </a>
                    </div>
                  </div>
                </div>

                {/* hero controls small */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {heroImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroIndex(i)}
                      className={`w-10 h-2 rounded-full ${i === heroIndex ? "bg-white" : "bg-white/30"} transition`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Mempelai */}
          <section id="mempelai" className="pt-4">
            <div className="bg-white/3 rounded-2xl p-5 md:p-8 border border-white/6 shadow-lg">
              <h2 className="font-playfair text-2xl text-white mb-3">Mempelai</h2>
              <p className="text-sm text-white/70 mb-6">
                Dengan hormat, kami mempersembahkan kedua mempelai. Terima kasih atas kehadiran & doa restunya.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { name: "Nadian", role: "Calon Pengantin Wanita / Pria", desc: "Putri/Putra dari keluarga ..." },
                  { name: "Stephen", role: "Calon Pengantin Pria / Wanita", desc: "Putri/Putra dari keluarga ..." },
                ].map((p, idx) => (
                  <div key={idx} className="bg-white/5 p-4 rounded-xl flex gap-4 items-center">
                    <img src={IMAGE_SRC} alt={p.name} className="w-24 h-24 object-cover rounded-lg ring-1 ring-white/8" />
                    <div>
                      <div className="text-sm text-white/50">{p.role}</div>
                      <div className="font-playfair text-lg">{p.name}</div>
                      <div className="text-xs text-white/60 mt-1 max-w-xs">{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-white/80">
                <h3 className="font-semibold mb-2">Sambutan</h3>
                <p className="text-sm text-white/70">
                  Assalamu’alaikum/ Salam sejahtera. Terima kasih atas kehadiran Anda. Kami berharap acara ini membawa kebahagiaan bagi kita semua.
                </p>
              </div>
            </div>
          </section>

          {/* Acara */}
          <section id="acara">
            <div className="bg-white/3 rounded-2xl p-5 md:p-8 border border-white/6 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="font-playfair text-2xl text-white">Acara</h2>
                  <p className="text-sm text-white/70">Detail waktu &amp; tempat</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Akad Nikah */}
                <div className="bg-white/5 p-4 rounded-xl">
                  <h4 className="font-semibold text-white">Akad Nikah</h4>
                  <p className="text-xs text-white/60">Sabtu, 12 Desember 2025 • 09.00 WIB</p>
                  <p className="text-xs text-white/70 mt-1">Gedung Ceria, Jl. Contoh No.123, Kota</p>

                  <div className="mt-3 aspect-[16/9] rounded-md overflow-hidden border border-white/5">
                    <iframe
                      src={`https://www.google.com/maps?q=Gedung+Contoh+Jakarta&output=embed`}
                      width="100%"
                      height="100%"
                      frameBorder={0}
                      loading="lazy"
                      aria-label="map akad"
                    />
                  </div>

                  <div className="mt-3 flex gap-2">
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-md bg-white/6 text-xs hover:brightness-105 transition"
                    >
                      Buka di Google Maps
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText("Gedung Ceria, Jl. Contoh No.123, Kota");
                        alert("Alamat akad disalin");
                      }}
                      className="px-3 py-2 rounded-md border border-white/6 text-xs"
                    >
                      Salin Alamat
                    </button>
                  </div>
                </div>

                {/* Resepsi */}
                <div className="bg-white/5 p-4 rounded-xl">
                  <h4 className="font-semibold text-white">Resepsi</h4>
                  <p className="text-xs text-white/60">Sabtu, 12 Desember 2025 • 11.00 – 14.00 WIB</p>
                  <p className="text-xs text-white/70 mt-1">Gedung Ceria, Jl. Contoh No.123, Kota</p>

                  <div className="mt-3 aspect-[16/9] rounded-md overflow-hidden border border-white/5">
                    <iframe
                      src={`https://www.google.com/maps?q=Gedung+Contoh+Jakarta&output=embed`}
                      width="100%"
                      height="100%"
                      frameBorder={0}
                      loading="lazy"
                      aria-label="map resepsi"
                    />
                  </div>

                  <div className="mt-3 flex gap-2">
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-md bg-white/6 text-xs hover:brightness-105 transition"
                    >
                      Buka di Google Maps
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText("Gedung Ceria, Jl. Contoh No.123, Kota");
                        alert("Alamat resepsi disalin");
                      }}
                      className="px-3 py-2 rounded-md border border-white/6 text-xs"
                    >
                      Salin Alamat
                    </button>
                  </div>
                </div>
              </div>

              {/* Informasi tambahan */}
              <div className="mt-6 bg-white/5 p-4 rounded-xl">
                <h4 className="font-semibold text-white">Informasi Tambahan</h4>
                <ul className="mt-2 text-sm text-white/70 space-y-2">
                  <li>- Dress code: Elegant / Semi Formal</li>
                  <li>- Mohon hadir tepat waktu</li>
                  <li>- Parkir berbayar di area gedung</li>
                  <li>- Kontak panitia: +62 812 3456 7890</li>
                </ul>

                <div className="mt-4 text-xs">
                  <button
                    onClick={() => scrollTo("faq")}
                    className="text-sm px-3 py-2 rounded-md bg-gradient-to-r from-[#b8846b] to-[#a46d49] font-semibold"
                  >
                    Lihat FAQ
                  </button>
                </div>
              </div>
            </div>
          </section>


          {/* Galeri */}
          <section id="galeri">
            <div className="bg-white/3 rounded-2xl p-5 md:p-8 border border-white/6 shadow-lg">
              <h2 className="font-playfair text-2xl text-white">Galeri</h2>
              <p className="text-sm text-white/70">Kumpulan foto kenangan</p>

              <div className="mt-6 relative">
                <div ref={galleryRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="min-w-[70%] sm:min-w-[40%] md:min-w-[28%] lg:min-w-[22%] snap-center rounded-xl overflow-hidden transform hover:scale-105 transition"
                    >
                      <img src={IMAGE_SRC} alt={`gal-${i}`} className="w-full h-56 object-cover" />
                    </div>
                  ))}
                </div>

                <div className="absolute -left-2 top-1/2 -translate-y-1/2">
                  <button
                    onClick={() => slideGallery("left")}
                    className="rounded-full p-2 bg-black/40 hover:bg-black/60"
                    aria-label="prev"
                  >
                    ‹
                  </button>
                </div>
                <div className="absolute -right-2 top-1/2 -translate-y-1/2">
                  <button
                    onClick={() => slideGallery("right")}
                    className="rounded-full p-2 bg-black/40 hover:bg-black/60"
                    aria-label="next"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Cerita */}
          <section id="cerita">
            <div className="bg-white/3 rounded-2xl p-5 md:p-8 border border-white/6 shadow-lg">
              <h2 className="font-playfair text-2xl text-white">Cerita Kita</h2>
              <p className="text-sm text-white/70">Perjalanan singkat kisah cinta kami</p>

              <div className="mt-6 space-y-6">
                {[
                  { year: "2018", title: "Pertemuan Pertama", text: "Kami bertemu di sebuah acara kampus..." },
                  { year: "2019", title: "Mulai Dekat", text: "Mulai sering bertukar pesan dan bertemu..." },
                  { year: "2021", title: "Jadian", text: "Resmi berpacaran dan saling support..." },
                  { year: "2024", title: "Lamaran", text: "Momen indah saat melamar di tepi pantai..." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-12 flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#b8846b] mt-1" />
                      <div className="flex-1 w-px bg-white/6 my-2" />
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 flex-1 hover:scale-[1.01] transition">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-white">{item.title}</div>
                        <div className="text-xs text-white/60">{item.year}</div>
                      </div>
                      <p className="text-sm text-white/70 mt-2">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RSVP */}
          <section id="rsvp">
            <div className="bg-white/3 rounded-2xl p-5 md:p-8 border border-white/6 shadow-lg">
              <h2 className="font-playfair text-2xl text-white">RSVP</h2>
              <p className="text-sm text-white/70">Mohon konfirmasi kehadiran Anda</p>

              <form onSubmit={submitRsvp} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="text-xs text-white/60">Nama</label>
                  <input
                    required
                    value={rsvp.name}
                    onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })}
                    className="mt-1 w-full rounded-md bg-white/5 border border-white/6 p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#b8846b]"
                    placeholder="Nama lengkap"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60">Email (opsional)</label>
                  <input
                    value={rsvp.email}
                    onChange={(e) => setRsvp({ ...rsvp, email: e.target.value })}
                    className="mt-1 w-full rounded-md bg-white/5 border border-white/6 p-3 text-white text-sm"
                    placeholder="email@contoh.com"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60">Kehadiran</label>
                  <select
                    value={rsvp.attending}
                    onChange={(e) => setRsvp({ ...rsvp, attending: e.target.value as any })}
                    className="mt-1 w-full rounded-md bg-white/5 border border-white/6 p-3 text-white text-sm"
                  >
                    <option value="yes">Hadir</option>
                    <option value="no">Tidak Hadir</option>
                    <option value="maybe">Mungkin</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/60">Jumlah Tamu</label>
                  <input
                    type="number"
                    min={0}
                    value={rsvp.guests}
                    onChange={(e) => setRsvp({ ...rsvp, guests: parseInt(e.target.value || "0") })}
                    className="mt-1 w-full rounded-md bg-white/5 border border-white/6 p-3 text-white text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-white/60">Pesan / Doa</label>
                  <textarea
                    value={rsvp.message}
                    onChange={(e) => setRsvp({ ...rsvp, message: e.target.value })}
                    className="mt-1 w-full rounded-md bg-white/5 border border-white/6 p-3 text-white text-sm min-h-[90px]"
                    placeholder="Tulis pesan singkat..."
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className={`px-5 py-3 rounded-full bg-gradient-to-r from-[#b8846b] to-[#a46d49] font-semibold shadow transform hover:-translate-y-0.5 transition ${rsvpStatus === "sending" ? "opacity-70 pointer-events-none" : ""
                      }`}
                  >
                    {rsvpStatus === "sending" ? "Mengirim..." : "Kirim Konfirmasi"}
                  </button>

                  {rsvpStatus === "done" && <div className="text-sm text-green-300">Terima kasih! Konfirmasi terkirim.</div>}
                  {rsvpStatus === "error" && <div className="text-sm text-rose-300">Terjadi kesalahan. Coba lagi.</div>}
                </div>
              </form>
            </div>
          </section>

          {/* Hadiah */}
          <section id="hadiah">
            <div className="bg-white/3 rounded-2xl p-5 md:p-8 border border-white/6 shadow-lg">
              <h2 className="font-playfair text-2xl text-white">Hadiah</h2>
              <p className="text-sm text-white/70">Informasi rekening / e-wallet untuk memberi hadiah</p>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl">
                  <div className="text-sm text-white/60">Bank / Rekening</div>
                  <div className="mt-2 font-semibold text-white">Nama Bank — 1234567890</div>
                  <div className="text-xs text-white/60 mt-1">Atas nama: Nama Penerima</div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText("1234567890");
                        alert("Nomor rekening disalin");
                      }}
                      className="px-3 py-2 rounded-md bg-white/6"
                    >
                      Salin Rekening
                    </button>
                    <a href="#" className="px-3 py-2 rounded-md border border-white/6">
                      Buka Transfer
                    </a>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl">
                  <div className="text-sm text-white/60">E-Wallet</div>
                  <div className="mt-2 font-semibold text-white">Gopay / OVO / Dana: 081234567890</div>
                  <div className="text-xs text-white/60 mt-1">Nama penerima</div>
                </div>
              </div>

              <div className="mt-4 text-xs text-white/60">
                Terima kasih untuk niat baik dan kebaikan Anda — kehadiran saja sudah lebih dari cukup.
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq">
            <div className="bg-white/3 rounded-2xl p-5 md:p-8 border border-white/6 shadow-lg">
              <h2 className="font-playfair text-2xl text-white">FAQ</h2>
              <p className="text-sm text-white/70">Pertanyaan umum</p>

              <div className="mt-4 space-y-3">
                {[
                  { q: "Apakah ada dress code?", a: "Dress code: Elegant / Semi Formal." },
                  { q: "Apakah acara indoor/outdoor?", a: "Utamanya indoor, ada area outdoor untuk foto." },
                  { q: "Bolehkah membawa anak?", a: "Tentu, mohon cantumkan jumlah tamu pada RSVP." },
                ].map((f, i) => (
                  <div key={i} className="bg-white/5 rounded-lg overflow-hidden">
                    <button
                      className="w-full text-left p-4 flex items-center justify-between"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <div>
                        <div className="font-medium text-white">{f.q}</div>
                        <div className="text-xs text-white/60">Klik untuk melihat jawaban</div>
                      </div>
                      <div className={`text-2xl transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</div>
                    </button>
                    <div
                      style={{
                        maxHeight: openFaq === i ? 200 : 0,
                        transition: "max-height 300ms ease",
                      }}
                      className="px-4 overflow-hidden"
                    >
                      <div className="pb-4 text-sm text-white/70">{f.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-6 pb-12">
            <div className="bg-[#b8846b] rounded-2xl p-6 md:p-8 border border-white/6 shadow-lg">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/8 flex items-center justify-center">
                      <span className="font-playfair text-xl">W</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Nadian &amp; Stephen</div>
                      <div className="text-xs text-white/60">Terima kasih telah mengunjungi undangan kami</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {[
                    ["Mempelai", "mempelai"],
                    ["Acara", "acara"],
                    ["Galeri", "galeri"],
                    ["Cerita", "cerita"],
                    ["RSVP", "rsvp"],
                    ["Hadiah", "hadiah"],
                    ["FAQ", "faq"],
                  ].map(([label, id]) => (
                    <button key={id} onClick={() => scrollTo(id)} className="text-xs text-white/70 hover:text-white">
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-xs text-white/60 text-center">
                © {new Date().getFullYear()} Nadian &amp; Stephen — Dibuat dengan ❤
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}