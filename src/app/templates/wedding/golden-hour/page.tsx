"use client"

// pages/wedding-invite.tsx
import React, { JSX, useEffect, useRef, useState } from "react";
import Head from "next/head";
import useCountdown from "@/lib/countdown";
import { formatDate } from "@/lib/utils";
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Invitation Type: Wedding
 * Theme Name: "Golden Hour Promise"
 * Create At: 09-09-2025
 * Create By: David
*/

/* ---------------------------- CONFIG ---------------------------- */
const WEDDING_DATE = new Date();
WEDDING_DATE.setDate(WEDDING_DATE.getDate() + 12);

const HERO_IMAGES = [
  "http://localhost:3005/assets/img/2149043983.jpg",
  "http://localhost:3005/assets/img/2149043983.jpg",
  "http://localhost:3005/assets/img/2149043983.jpg",
]; // sementara gunakan yang diberikan

/* ---------------------------- UTIL ---------------------------- */
function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isLocked])
};

/* ---------------------------- COMPONENT ---------------------------- */
export default function WeddingInvitePage(): JSX.Element {
  const [opened, setOpened] = useState(false)
  useLockBodyScroll(!opened)

  const [tick, setTick] = useState(0); // simple re-render every second
  const [heroIdx, setHeroIdx] = useState(0);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpGuestCount, setRsvpGuestCount] = useState(1);
  const [rsvpNote, setRsvpNote] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<null | "success" | "error">(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  // Countdown
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(WEDDING_DATE);

  // auto-advance hero carousel
  useEffect(() => {
    const t = setInterval(() => {
      setHeroIdx((i) => (i + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  // countdown tick
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // smooth scroll behavior (for older browsers fallback)
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, []);

  // RSVP mock submission (no backend) — we'll simulate success
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // simple validation
    if (!rsvpName.trim()) {
      setRsvpStatus("error");
      setTimeout(() => setRsvpStatus(null), 3000);
      return;
    }
    // Simulate success
    setRsvpStatus("success");
    // reset fields lightly
    setTimeout(() => {
      setRsvpName("");
      setRsvpGuestCount(1);
      setRsvpNote("");
    }, 500);
    setTimeout(() => setRsvpStatus(null), 4000);
  };

  // helper: scroll to id
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // nav items
  const navItems = [
    { id: "mempelai", label: "Mempelai" },
    { id: "acara", label: "Acara" },
    { id: "galeri", label: "Galeri" },
    { id: "cerita", label: "Cerita" },
    { id: "rsvp", label: "RSVP" },
    { id: "hadiah", label: "Hadiah" },
    { id: "faq", label: "FAQ" },
  ];

  // color theme classes (elegant, not white)
  const BG = "bg-linear-to-br from-[#0b1221] via-[#1b2330] to-[#2b3441] text-slate-100";
  const ACCENT = "text-amber-300"; // accent color for highlights

  return (
    <>
      <Head>
        {/* Fonts: two elegant fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;600;700&display=swap" />
        <style>{`
          :root {
            --ff-heading: "Playfair Display", serif;
            --ff-body: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          }
          html { scroll-behavior: smooth; }
        `}</style>
      </Head>

      <div className={`min-h-screen ${BG} font-body`}>
        <AnimatePresence>
          {!opened && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-98 flex items-center justify-center text-center px-6"
            >
              <div className="absolute inset-0">
                <img
                  src='http://localhost:3005/assets/img/2149043983.jpg'
                  alt="cover"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/60 via-slate-950/70 to-slate-950/95 backdrop-blur-sm" />
              </div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative z-10 space-y-4"
              >
                <p className="tracking-widest uppercase text-sm mb-4 text-white">Wedding Invitation</p>

                <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight font-serif" style={{ fontFamily: "var(--ff-heading)" }}>
                  Betrice Anastasya <br />
                  <span className="text-amber-300">•</span><br />
                  Jhonson Derullo
                </h2>
                <p className="mt-4 text-lg"><strong className="text-amber-200">Tanggal:</strong> {formatDate(WEDDING_DATE, "long")}</p>
                <p className="mt-2 italic text-white">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                <p className="font-semibold text-xl mt-1 text-white">Nama Tamu</p>

                <button
                  onClick={() => setOpened(true)}
                  className="px-4 py-2 rounded-md bg-amber-300 text-[#0b1221] font-semibold shadow hover:-translate-y-0.5 transition transform"
                >
                  Buka Undangan
                  <span className="inline-block translate-x-0 group-hover:translate-x-0.5 transition">↗</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Nav */}
        <header className="fixed top-0 left-0 right-0 z-40">
          <nav className="backdrop-blur-md bg-black/20 border-b border-white/5">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="flex items-center gap-2"
                    aria-label="Buka undangan"
                  >
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-300/70 to-rose-400/60 flex items-center justify-center shadow-lg">
                      <span className="font-serif text-sm text-[#0b1221]">W</span>
                    </div>
                    <div className="hidden sm:block">
                      <h1 className="text-sm font-semibold" style={{ fontFamily: "var(--ff-heading)" }}>
                        Betrice & Jhonson
                      </h1>
                      <p className="text-xs text-amber-100/60">Undangan Digital</p>
                    </div>
                  </button>
                </div>

                <div className="hidden md:flex items-center gap-4">
                  {navItems.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => scrollToId(n.id)}
                      className="text-sm text-slate-200/80 hover:text-white transition-colors"
                    >
                      {n.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => scrollToId("rsvp")}
                    className="px-4 py-2 rounded-md border border-white/10 text-sm text-slate-100/90 hover:text-white cursor-pointer flex items-center gap-2"
                  >
                    RSVP
                  </button>
                  {/* Mobile menu trigger */}
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* MAIN CONTENT */}
        <main className="pt-20">

          {/* HERO */}
          <section id="hero" className="relative overflow-hidden">
            {/* background carousel */}
            <div className="absolute inset-0 -z-10">
              {HERO_IMAGES.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`hero ${i}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1200 ${i === heroIdx ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
                  style={{ filter: "brightness(0.55) saturate(1.05) contrast(0.95)" }}
                />
              ))}

              {/* subtle overlay patterns */}
              <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/30 to-black/60" />
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(255,200,120,0.06),transparent 25%)]" />
            </div>

            <div className="max-w-5xl mx-auto px-4 pb-20 sm:pb-28 lg:pb-36 pt-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left / Main content */}
                <div className="space-y-6">
                  <p className="inline-block px-3 py-1 rounded-full bg-white/8 text-amber-200 text-xs font-medium" style={{ letterSpacing: "0.08em" }}>
                    Undangan Resmi • Kami Mengundang Anda
                  </p>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight font-serif" style={{ fontFamily: "var(--ff-heading)" }}>
                    Betrice Anastasya &nbsp;<span className="text-amber-300">•</span>&nbsp; Jhonson Derullo
                  </h2>

                  <p className="text-slate-200/90 max-w-xl">
                    Dengan segala kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami. Kehadiran dan doa restu Anda sangat berarti bagi kami.
                  </p>

                  {/* Countdown card */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-lg bg-white/6 backdrop-blur-sm border border-white/5 shadow-md w-full sm:w-auto">
                      {/* Countdown states */}
                      {isExpired ? (
                        <div className="text-center">
                          <p className="text-amber-200 font-medium">Terima kasih atas kehadiran Anda</p>
                          <p className="text-xs text-slate-300 mt-1">Acara telah berlalu pada {formatDate(WEDDING_DATE, "full")}</p>
                        </div>
                      ) : isToday ? (
                        <div className="text-center animate-pulse">
                          <p className="text-amber-300 font-semibold text-lg">Hari Ini!</p>
                          <p className="text-xs text-slate-300">Mari rayakan bersama</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-xs uppercase text-amber-200/90">Hari H dalam</p>
                          <div className="flex gap-2 mt-2">
                            <div className="px-3 py-2 rounded bg-white/5 text-center min-w-17">
                              <div className="text-lg font-semibold">{days}</div>
                              <div className="text-xs text-slate-300">Hari</div>
                            </div>
                            <div className="px-3 py-2 rounded bg-white/5 text-center min-w-17">
                              <div className="text-lg font-semibold">{pad(hours)}</div>
                              <div className="text-xs text-slate-300">Jam</div>
                            </div>
                            <div className="px-3 py-2 rounded bg-white/5 text-center min-w-17">
                              <div className="text-lg font-semibold">{pad(minutes)}</div>
                              <div className="text-xs text-slate-300">Menit</div>
                            </div>
                            <div className="px-3 py-2 rounded bg-white/5 text-center min-w-17">
                              <div className="text-lg font-semibold">{pad(seconds)}</div>
                              <div className="text-xs text-slate-300">Detik</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => scrollToId("acara")}
                        className="px-4 py-2 rounded-md bg-amber-300 text-[#0b1221] font-semibold shadow hover:-translate-y-0.5 transition transform"
                      >
                        Lihat Undangan
                      </button>
                      <a
                        onClick={() => scrollToId("rsvp")}
                        className="px-4 py-2 rounded-md border border-white/10 text-sm text-slate-100/90 hover:text-white cursor-pointer flex items-center gap-2"
                      >
                        Konfirmasi Kehadiran
                      </a>
                    </div>
                  </div>

                  {/* small event preview */}
                  <div className="text-sm text-slate-300">
                    <strong className="text-amber-200">Tanggal:</strong> {formatDate(WEDDING_DATE, "long")} •{" "}
                    <strong className="text-amber-200">Lokasi:</strong> [Nama Gedung / Lokasi] • <strong className="text-amber-200">Dress Code:</strong> Semi Formal
                  </div>
                </div>

                {/* Right / Photo card */}
                <div className="relative">
                  <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5 transform hover:scale-[1.01] transition">
                    <img src={HERO_IMAGES[heroIdx]} alt="mempelai" className="w-full h-72 object-cover sm:h-96" />
                    <div className="p-4 bg-linear-to-t from-black/50 to-transparent">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-amber-200">Kami</p>
                          <h3 className="text-lg font-serif" style={{ fontFamily: "var(--ff-heading)" }}>Betrice Anastasya</h3>
                          <p className="text-xs text-slate-300">Putri dari Bapak ... & Ibu ...</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-amber-200">&amp;</p>
                          <h3 className="text-lg font-serif" style={{ fontFamily: "var(--ff-heading)" }}>Jhonson Derullo</h3>
                          <p className="text-xs text-slate-300">Putra dari Bapak ... & Ibu ...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mempelai */}
          <section id="mempelai" className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
            <div className="bg-white/5 rounded-2xl p-6 shadow-lg border border-white/6">
              <h2 className="text-2xl font-serif mb-4" style={{ fontFamily: "var(--ff-heading)" }}>Mempelai</h2>
              <p className="text-slate-200 mb-6">Assalamu'alaikum / Salam sejahtera. Dengan hormat kami mengundang Anda untuk hadir menyaksikan akad dan resepsi pernikahan kami.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                {/* Person card */}
                <div className="flex gap-4 items-center">
                  <img src={HERO_IMAGES[0]} alt="mempelai wanita" className="w-28 h-28 rounded-lg object-cover shadow" />
                  <div>
                    <h3 className="font-serif text-lg" style={{ fontFamily: "var(--ff-heading)" }}>[Nama Mempelai Wanita]</h3>
                    <p className="text-sm text-slate-300">Deskripsi singkat — hobbi, sedikit kata-kata hangat.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <img src={HERO_IMAGES[1]} alt="mempelai pria" className="w-28 h-28 rounded-lg object-cover shadow" />
                  <div>
                    <h3 className="font-serif text-lg" style={{ fontFamily: "var(--ff-heading)" }}>[Nama Mempelai Pria]</h3>
                    <p className="text-sm text-slate-300">Deskripsi singkat — profesi, kepribadian singkat.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <blockquote className="border-l-2 border-amber-300 pl-4 text-slate-200">
                  <p>"Terima kasih atas doa dan kehadiran Anda. Semoga kebahagiaan selalu bersama." — Keluarga</p>
                </blockquote>
              </div>
            </div>
          </section>

          {/* Acara */}
          <section id="acara" className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
            <div className="bg-white/5 rounded-2xl p-6 shadow-lg border border-white/6">
              <h2 className="text-2xl font-serif mb-4" style={{ fontFamily: "var(--ff-heading)" }}>Acara</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/6 flex items-center justify-center">
                      <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V11H3v6a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Akad Nikah</h3>
                      <p className="text-sm text-slate-300">{WEDDING_DATE.toLocaleDateString()} • {WEDDING_DATE.toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/6 flex items-center justify-center">
                      <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l6 6-6 6M21 7l-6 6 6 6" /></svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Resepsi</h3>
                      <p className="text-sm text-slate-300">Selesai akad • Dilanjutkan resepsi di [Nama Lokasi]</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/6 flex items-center justify-center">
                      <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Dress Code</h3>
                      <p className="text-sm text-slate-300">Semi Formal • Tone: Pastel / Earthy</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300">Catatan penting: Mohon hadir 15 menit lebih awal. Parkir terbatas — gunakan transportasi bersama bila memungkinkan.</p>
                </div>

                <div>
                  <div className="rounded-lg overflow-hidden border border-white/6 shadow-sm">
                    {/* Google Maps iframe — ganti src ke embed link lokasi sebenarnya */}
                    <iframe
                      title="lokasi"
                      src="https://www.google.com/maps?q=Monas%20Jakarta&output=embed"
                      className="w-full h-64 border-0"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs text-slate-300 mt-2">Klik pada peta untuk membuka di Google Maps.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Galeri */}
          <section id="galeri" className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
            <div className="bg-white/5 rounded-2xl p-6 shadow-lg border border-white/6">
              <h2 className="text-2xl font-serif mb-4" style={{ fontFamily: "var(--ff-heading)" }}>Galeri</h2>

              <PhotoCarousel images={HERO_IMAGES} />
            </div>
          </section>

          {/* Cerita / Timeline */}
          <section id="cerita" className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
            <div className="bg-white/5 rounded-2xl p-6 shadow-lg border border-white/6">
              <h2 className="text-2xl font-serif mb-4" style={{ fontFamily: "var(--ff-heading)" }}>Cerita Kami</h2>
              <div className="space-y-6">
                <StoryItem date="2019" title="Bertemu untuk pertama kali" text="Singkat cerita, kami bertemu di ..." img={HERO_IMAGES[0]} />
                <StoryItem date="2021" title="Mulai serius" text="Setelah melalui banyak hal, kami semakin dekat..." img={HERO_IMAGES[1]} />
                <StoryItem date="2024" title="Lamaran" text="Dengan restu keluarga, lamaran berlangsung ..." img={HERO_IMAGES[2]} />
                <div className="text-center text-slate-300 mt-4">... dan kini menuju hari spesial kami.</div>
              </div>
            </div>
          </section>

          {/* RSVP */}
          <section id="rsvp" className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
            <div className="bg-white/6 rounded-2xl p-6 shadow-lg border border-white/6">
              <h2 className="text-2xl font-serif mb-4" style={{ fontFamily: "var(--ff-heading)" }}>Konfirmasi Kehadiran (RSVP)</h2>
              <p className="text-slate-300 mb-6">Mohon konfirmasi kehadiran dengan mengisi form di bawah. Terima kasih.</p>

              <form onSubmit={handleRsvpSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="col-span-1 sm:col-span-3 p-3 rounded bg-transparent border border-white/6 focus:border-amber-300 outline-none"
                />
                <select
                  value={rsvpGuestCount}
                  onChange={(e) => setRsvpGuestCount(Number(e.target.value))}
                  className="p-3 rounded bg-transparent border border-white/6"
                >
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Tamu</option>)}
                </select>
                <input
                  placeholder="Kontak (no. HP / email)"
                  className="p-3 rounded bg-transparent border border-white/6"
                />
                <select
                  className="p-3 rounded bg-transparent border border-white/6"
                >
                  <option>Hadir</option>
                  <option>Tidak Hadir</option>
                  <option>Belum Pasti</option>
                </select>
                <textarea
                  value={rsvpNote}
                  onChange={(e) => setRsvpNote(e.target.value)}
                  placeholder="Catatan / Pesan"
                  className="col-span-1 sm:col-span-3 p-3 rounded bg-transparent border border-white/6"
                />

                <div className="col-span-1 sm:col-span-3 flex items-center gap-3">
                  <button type="submit" className="px-4 py-2 rounded bg-amber-300 text-[#0b1221] font-semibold">Kirim</button>
                  {rsvpStatus === "success" && <div className="text-sm text-emerald-300">Terima kasih, konfirmasi diterima!</div>}
                  {rsvpStatus === "error" && <div className="text-sm text-rose-300">Mohon isi nama.</div>}
                </div>
              </form>
            </div>
          </section>

          {/* Hadiah */}
          <section id="hadiah" className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
            <div className="bg-white/5 rounded-2xl p-6 sm:p-8 shadow-lg border border-white/10 backdrop-blur-md">
              <h2
                className="text-2xl font-serif mb-3 text-white"
                style={{ fontFamily: 'var(--ff-heading)' }}
              >
                Hadiah
              </h2>

              <p className="text-slate-300 mb-8 leading-relaxed">
                Doa dan kehadiran Anda adalah hadiah terindah bagi kami.
                Namun bila berkenan berbagi kebahagiaan, berikut informasi
                yang dapat digunakan.
              </p>

              <div className="space-y-8">
                {/* ===================================== */}
                {/* TRANSFER / E-WALLET                   */}
                {/* ===================================== */}
                <div className="rounded-xl bg-white/6 border border-white/10 p-5">
                  <h4 className="font-serif text-lg text-white mb-3">
                    Kado Digital
                  </h4>

                  <div className="grid md:grid-cols-3 gap-5">
                    {/* Bank */}
                    <div className="rounded-lg bg-black/30 border border-white/10 p-4">
                      <p className="text-sm text-amber-200">
                        Transfer Bank
                      </p>
                      <p className="font-medium text-white mt-1">
                        Bank Contoh
                      </p>
                      <p className="text-sm text-slate-300">
                        a.n. Nama Penerima
                      </p>

                      <div className="my-1">
                        <code className="rounded bg-black/40 px-3 py-1 text-sm text-slate-100">
                          123-456-7890
                        </code>
                      </div>
                      <div>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText('123-456-7890')
                          }
                          className="text-xs text-amber-300 underline underline-offset-4 hover:no-underline"
                        >
                          Salin
                        </button>
                      </div>
                    </div>

                    {/* E-Wallet */}
                    <div className="rounded-lg bg-black/30 border border-white/10 p-4">
                      <p className="text-sm text-amber-200">
                        E-Wallet
                      </p>
                      <p className="font-medium text-white mt-1">
                        Bank
                      </p>
                      <p className="text-sm text-slate-300">
                        a.n. Nama Tertera
                      </p>

                      <div className="my-1">
                        <code className="rounded bg-black/40 px-3 py-1 text-sm text-slate-100">
                          123-456-7890
                        </code>
                      </div>
                      <div>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText('123-456-7890')
                          }
                          className="text-xs text-amber-300 underline underline-offset-4 hover:no-underline"
                        >
                          Salin
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===================================== */}
                {/* WISHLIST + ALAMAT                     */}
                {/* ===================================== */}
                <div className="rounded-xl bg-white/6 border border-white/10 p-5">
                  <h4 className="font-serif text-lg text-white mb-2">
                    Wishlist Hadiah
                  </h4>

                  {/* Alamat Pengiriman */}
                  <div className="my-3 rounded-lg bg-black/30 border border-white/10 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Alamat Pengiriman
                    </p>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      Nama Penerima Jl. Contoh Bahagia No. 12 Jakarta Selatan, 12345 Indonesia
                    </p>

                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          'Nama Penerima, Jl. Contoh Bahagia No. 12, Jakarta Selatan, 12345, Indonesia'
                        )
                      }
                      className="mt-3 text-xs text-amber-300 underline underline-offset-4 hover:no-underline"
                    >
                      Salin Alamat
                    </button>
                  </div>

                  <p className="text-sm text-slate-300 mb-5">
                    Berikut beberapa referensi hadiah yang mungkin bermanfaat
                    bagi kami. Tidak ada kewajiban — kehadiran Anda tetap yang utama.
                  </p>

                  {/* Wishlist Items */}
                  <div className="grid md:grid-cols-3 gap-5">
                    {[
                      {
                        name: 'Set Peralatan Makan',
                        price: 'Rp 1.500.000',
                        qty: 1,
                        url: '#',
                      },
                      {
                        name: 'Sprei Premium King Size',
                        price: 'Rp 2.200.000',
                        qty: 1,
                        url: '#',
                      },
                      {
                        name: 'Lampu Meja Minimalis',
                        price: 'Rp 850.000',
                        qty: 2,
                        url: '#',
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-black/30 border border-white/10 p-4"
                      >
                        <p className="text-sm font-medium text-white">
                          {item.name}
                        </p>
                        <div className="mt-1 text-xs text-slate-300 space-y-0.5">
                          <p>Perkiraan Harga: {item.price}</p>
                          <p>Jumlah: {item.qty} unit</p>
                        </div>

                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex w-full justify-center rounded-md border border-amber-300/40 px-3 py-2 text-xs text-amber-200 hover:bg-amber-300/10 transition"
                        >
                          Lihat Referensi
                        </a>
                      </div>
                    ))}
                  </div>

                  {/* Pagination UI */}
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <div className="flex gap-2">
                      <button className="h-8 w-8 rounded-full bg-amber-300 text-xs font-semibold text-slate-900">
                        1
                      </button>
                      <button className="h-8 w-8 rounded-full border border-white/20 text-xs text-slate-300">
                        2
                      </button>
                      <button className="h-8 w-8 rounded-full border border-white/20 text-xs text-slate-300">
                        3
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 rounded-md border border-white/20 px-3 py-2 text-xs text-slate-300">
                        Prev
                      </button>
                      <button className="flex-1 rounded-md border border-white/20 px-3 py-2 text-xs text-slate-300">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
            <div className="bg-white/5 rounded-2xl p-6 shadow-lg border border-white/6">
              <h2 className="text-2xl font-serif mb-4" style={{ fontFamily: "var(--ff-heading)" }}>FAQ</h2>

              <div className="space-y-3">
                {[
                  { q: "Apakah ada dress code?", a: "Dress code: Semi Formal. Tone pastel/earthy sangat dianjurkan." },
                  { q: "Apakah acara bebas membawa anak?", a: "Anak-anak dipersilakan, namun mohon tetap memperhatikan kenyamanan bersama." },
                  { q: "Apakah terdapat fasilitas parkir?", a: "Tersedia parkir terbatas. Disarankan carpool atau ojol." },
                ].map((item, idx) => (
                  <div key={idx} className="border border-white/6 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                      className="w-full text-left p-4 flex justify-between items-center"
                    >
                      <span>{item.q}</span>
                      <span className="text-amber-300">{activeFAQ === idx ? "-" : "+"}</span>
                    </button>
                    <div className={`px-4 pb-4 text-sm text-slate-300 transition-all duration-300 ${activeFAQ === idx ? "block" : "hidden"}`}>
                      {item.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 pb-12">
            <div className="max-w-5xl mx-auto px-4">
              <div className="bg-black/20 rounded-2xl p-6 flex flex-col md:flex-row md:justify-between items-start gap-4">
                <div>
                  <h3 className="font-serif text-lg" style={{ fontFamily: "var(--ff-heading)" }}>Betrice & Jhonson</h3>
                  <p className="text-sm text-slate-300">Terima kasih telah mengunjungi undangan digital kami.</p>
                </div>

                <nav className="flex gap-4 flex-wrap">
                  {navItems.map(n => (
                    <button key={n.id} onClick={() => scrollToId(n.id)} className="text-sm text-slate-200/80 hover:text-white">
                      {n.label}
                    </button>
                  ))}
                </nav>

                <div className="text-sm text-slate-400">© {new Date().getFullYear()} [Nama Keluarga]. All rights reserved.</div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}

/* ---------------------------- Subcomponents ---------------------------- */

function PhotoCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div>
      <div className="relative rounded-lg overflow-hidden">
        <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${index * 100}%)` }}>
          {images.map((src, i) => (
            <div key={i} className="min-w-full h-64 sm:h-80">
              <img src={src} alt={`galeri-${i}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* controls */}
        <div className="absolute inset-0 flex items-center justify-between p-3 pointer-events-none">
          <button
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            className="pointer-events-auto p-2 rounded bg-black/30 text-white"
            aria-label="prev"
          >
            ‹
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            className="pointer-events-auto p-2 rounded bg-black/30 text-white"
            aria-label="next"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-3 flex gap-2 justify-center">
        {images.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i === index ? "bg-amber-300" : "bg-white/30"}`} />
        ))}
      </div>
    </div>
  );
}

function StoryItem({ date, title, text, img }: { date: string; title: string; text: string; img: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
        <img src={img} alt={title} className="w-full h-full object-cover" />
      </div>
      <div>
        <div className="text-xs text-amber-200">{date}</div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-slate-300">{text}</p>
      </div>
    </div>
  );
}
