"use client";

// pages/invitation.tsx
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { NextPage } from "next";
import useCountdown from "@/lib/countdown";
import { formatDate } from "@/lib/utils";

/**
 * Invitation Type: Birthday
 * Theme Name: "Midnight Glow"
 * Create At: 13-09-2025
 * Create By: David
*/

type RSVPState = {
  name: string;
  email: string;
  guests: number;
  message: string;
  attending: "yes" | "no" | "";
};

const TARGET_DATE = new Date();
TARGET_DATE.setDate(TARGET_DATE.getDate() + 12);

const Invitation: NextPage = () => {
  // countdown
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(TARGET_DATE.toString());

  // navigation active
  const [active, setActive] = useState("hero");
  const sections = ["hero", "welcome", "acara", "galeri", "cerita", "rsvp", "hadiah", "faq", "footer"];

  // scroll reveal
  const revealRef = useRef<HTMLElement | null>(null);
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
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // active nav highlight on scroll
  useEffect(() => {
    const onScroll = () => {
      let current = "hero";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          current = id;
          break;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // RSVP form
  const [rsvp, setRsvp] = useState<RSVPState>({ name: "", email: "", guests: 1, message: "", attending: "" });
  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // fake submit
    setRsvpStatus("submitting");
    setTimeout(() => {
      setRsvpStatus("success");
      // reset after a bit
    }, 900);
  };

  // gallery images
  const GALLERY = [
    "http://localhost:3005/assets/img/birthday-hero1.jpg",
    "http://localhost:3005/assets/img/birthday-hero1.jpg",
    "http://localhost:3005/assets/img/birthday-hero1.jpg",
  ];
  const [galleryIndex, setGalleryIndex] = useState(0);

  // small utility scrollTo
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Head>
        <title>Undangan Ulang Tahun Digital</title>
        <meta name="description" content="Undangan ulang tahun digital elegan & modern" />
        {/* Fonts: playful script + modern sans */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#071026] to-[#09121a] text-gray-100 scroll-smooth">
        {/* Sticky Header */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-black/30 border-b border-white/5">
          <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => scrollTo("hero")}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center transform group-hover:scale-105 transition">
                    <span style={{ fontFamily: "Great Vibes, serif" }} className="text-black text-lg">A</span>
                  </div>
                  <span className="hidden sm:inline-block font-semibold tracking-wide">Undangan Kejutan</span>
                </button>
              </div>

              <div className="hidden md:flex items-center gap-2">
                {sections.slice(0, -1).map((s) => (
                  <button
                    key={s}
                    onClick={() => scrollTo(s)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${active === s ? "text-amber-300" : "text-gray-200 hover:text-gray-50"} `}
                  >
                    {s === "hero" ? "Home" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })}
                  className="hidden sm:inline-flex items-center gap-2 rounded-full px-3 py-2 bg-amber-500/90 hover:bg-amber-500 transform hover:scale-[1.02] transition-shadow shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 15h-2v-2h2zm0-4h-2V7h2z" /></svg>
                  <span className="text-black text-sm font-semibold">RSVP</span>
                </button>

                {/* mobile nav dropdown */}
                <div className="md:hidden">
                  <MobileMenu sections={sections} active={active} onNavigate={scrollTo} />
                </div>
              </div>
            </div>
          </nav>
        </header>

        <main className="pt-20">
          {/* HERO SECTION */}
          <section id="hero" className="relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 items-center gap-8">
                <div className="reveal reveal-from-left">
                  <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-black/30 to-white/5 border border-white/5 shadow-xl backdrop-blur-lg">
                    <h1 style={{ fontFamily: "Great Vibes, serif" }} className="text-4xl sm:text-5xl tracking-tight leading-tight text-amber-300 drop-shadow-lg">Selamat Ulang Tahun, [Nama]!</h1>
                    <p className="mt-2 text-sm text-gray-300 max-w-xl">Undangan resmi untuk merayakan momen spesial — penuh warna, tawa, dan kenangan. Yuk hadir dan rayakan bersama!</p>

                    {/* Countdown Card */}
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-white/5 to-black/20 border border-white/6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs uppercase tracking-widest text-gray-300">Acara Dimulai</div>
                          <div className="text-sm text-gray-200">{formatDate(TARGET_DATE, "long", "short")}</div>
                        </div>

                        <div className="ml-4">
                          <CountdownDisplay isToday={isToday} isExpired={isExpired} days={days} hours={hours} minutes={minutes} seconds={seconds} />
                        </div>
                      </div>
                      {/* status banners */}
                      <div className="mt-4">
                        {isExpired ? (
                          <div className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-700/30 text-gray-200 border border-white/6">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v6l4 2" /></svg>
                            <span>Acara telah berlalu — terima kasih untuk yang hadir.</span>
                          </div>
                        ) : isToday ? (
                          <div className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-600/10 text-emerald-200 border border-emerald-600/20">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v6l4 2" /></svg>
                            <span>Hari H — Ayo rayakan sekarang!</span>
                          </div>
                        ) : (
                          <div className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-full bg-amber-600/10 text-amber-200 border border-amber-600/20">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 6v6l4 2" /></svg>
                            <span>Segera berlangsung — jangan lupa catat di kalender!</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => {
                          // reveal the invitation - scroll to welcome and animate
                          const w = document.getElementById("welcome");
                          if (w) w.scrollIntoView({ behavior: "smooth" });
                          // little pulse effect
                          const el = document.querySelector("#welcome .inner-card");
                          if (el) {
                            el.classList.add("ring-amber-400/30");
                            setTimeout(() => el.classList.remove("ring-amber-400/30"), 1200);
                          }
                        }}
                        className="px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow-md transform hover:-translate-y-0.5 transition"
                      >
                        Buka Undangan
                      </button>

                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`https://www.google.com/calendar/render?action=TEMPLATE&text=Undangan+Ulang+Tahun&dates=${toGoogleDate(TARGET_DATE)}&details=Yuk+hadir+di+acara+ulang+tahun`}
                        className="px-4 py-3 rounded-lg border border-white/8 text-sm hover:border-amber-300 transition inline-flex items-center gap-2"
                      >
                        <svg className="w-4 h-4 text-amber-300" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z" /></svg>
                        Tambahkan ke Kalender
                      </a>
                    </div>
                  </div>
                </div>

                {/* right side - single column card with profile */}
                <div className="reveal reveal-from-right">
                  <div className="inner-card rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-black/30 to-white/5 border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <img src="http://localhost:3005/assets/img/birthday-hero1.jpg" alt="Foto" className="w-20 h-20 object-cover rounded-lg border border-white/10 shadow" />
                      <div>
                        <div style={{ fontFamily: "Great Vibes, serif" }} className="text-2xl text-amber-300 leading-tight">Nama Yang Berulang Tahun</div>
                        <div className="text-sm text-gray-300">Usia: <span className="font-semibold">25</span></div>
                      </div>
                    </div>

                    <div className="mt-4 text-gray-200 text-sm">
                      <p>Kami sangat bahagia berbagi momen ini dengan orang-orang terdekat. Harap datang dengan hati riang — dress code chic-casual.</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-amber-600/20 text-amber-200 text-xs">Tema: Golden Night</span>
                        <span className="px-3 py-1 rounded-full bg-white/5 text-xs">Dress Code: Chic Casual</span>
                        <span className="px-3 py-1 rounded-full bg-white/5 text-xs">Lokasi: [Nama Tempat]</span>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <a onClick={() => scrollTo("acara")} className="cursor-pointer px-4 py-2 bg-white/5 rounded-md border border-white/6 hover:bg-white/6 transition">Lihat Detail Acara</a>
                      <a onClick={() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })} className="cursor-pointer px-4 py-2 bg-amber-500 text-black rounded-md hover:scale-[1.02] transition">Konfirmasi Kehadiran</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* WELCOME */}
          <section id="welcome" className="py-12 sm:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
              <div className="inner-card rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-white/5 to-black/20 border border-white/6 shadow-lg">
                <h2 className="text-2xl font-semibold text-amber-300" style={{ fontFamily: "Great Vibes, serif" }}>Selamat Datang</h2>
                <p className="mt-2 text-gray-300">Terima kasih sudah meluangkan waktu untuk membuka undangan ini. Berikut adalah sedikit kata sambutan untuk para tamu yang kami sayangi.</p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <img src="http://localhost:3005/assets/img/birthday-hero1.jpg" alt="Foto utama" className="w-full h-44 object-cover rounded-lg border border-white/6 shadow" />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex flex-col gap-2">
                      <div className="text-sm text-gray-200">Halo sahabat & keluarga — aku sangat bersemangat merayakan ulang tahun kali ini. Doakan agar acara berjalan hangat dan penuh kebahagiaan.</div>
                      <div className="mt-3 text-sm text-gray-300">
                        Catatan kecil: Hadir secara fisik sangat berarti, namun doa juga sangat kami hargai. Silakan konfirmasi lewat form RSVP.
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <a onClick={() => scrollTo("rsvp")} className="cursor-pointer px-4 py-2 rounded-md bg-amber-500 text-black inline-flex items-center gap-2 hover:scale-[1.02] transition">Konfirmasi Sekarang</a>
                      <a onClick={() => scrollTo("galeri")} className="cursor-pointer px-4 py-2 rounded-md border border-white/6">Lihat Galeri</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ACARA */}
          <section id="acara" className="py-12 sm:py-16 reveal">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-black/30 to-white/5 border border-white/6 shadow-lg">
                <h3 className="text-xl font-semibold text-amber-300">Detail Acara</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <dl className="grid grid-cols-1 gap-3 text-sm text-gray-300">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/6">
                        <dt className="text-xs text-gray-400">Tanggal</dt>
                        <dd className="mt-1 font-semibold">{TARGET_DATE.toLocaleDateString()}</dd>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/6">
                        <dt className="text-xs text-gray-400">Waktu</dt>
                        <dd className="mt-1 font-semibold">{TARGET_DATE.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</dd>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/6">
                        <dt className="text-xs text-gray-400">Tempat</dt>
                        <dd className="mt-1 font-semibold">[Nama Lokasi], Jalan Contoh No. 123</dd>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/6">
                        <dt className="text-xs text-gray-400">Dress Code</dt>
                        <dd className="mt-1 font-semibold">Chic Casual — Sentuhan gold disarankan</dd>
                      </div>
                    </dl>
                    <div className="mt-4 flex gap-3">
                      <a onClick={() => document.getElementById("acara")?.scrollIntoView({ behavior: "smooth" })} className="cursor-pointer px-3 py-2 rounded-md bg-amber-500 text-black">Tambah ke Kalender</a>
                      <a onClick={() => window.open("https://maps.google.com", "_blank")} className="cursor-pointer px-3 py-2 rounded-md border border-white/6">Buka Google Maps</a>
                    </div>
                  </div>

                  <div>
                    <div className="w-full h-56 rounded-lg overflow-hidden border border-white/6">
                      {/* Google Maps iframe */}
                      <iframe
                        title="Lokasi Acara"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3169.123456789!2d106.827153315%21%3F!3d-6.1751100!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNjPCsDAwJzAwLjAiTiAxMDbCsDM4JzAwLjAiRQ!5e0!3m2!1sid!2sid!4v0000000000"
                        width="100%"
                        height="100%"
                        loading="lazy"
                        className="border-0"
                      />
                    </div>
                    <p className="mt-3 text-sm text-gray-400">Lokasi dapat berubah—cek kembali di pengumuman resmi jika perlu.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* GALERI */}
          <section id="galeri" className="py-12 sm:py-16 reveal">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-xl font-semibold text-amber-300">Galeri Kenangan</h3>
              <div className="mt-6">
                <div className="relative rounded-xl overflow-hidden border border-white/5 shadow-lg">
                  <img src={GALLERY[galleryIndex]} alt={`gallery-${galleryIndex}`} className="w-full h-64 object-cover" />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <button onClick={() => setGalleryIndex((i) => (i - 1 + GALLERY.length) % GALLERY.length)} className="p-2 rounded-full bg-black/30 hover:bg-black/40 transition">
                      ‹
                    </button>
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <button onClick={() => setGalleryIndex((i) => (i + 1) % GALLERY.length)} className="p-2 rounded-full bg-black/30 hover:bg-black/40 transition">
                      ›
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {GALLERY.map((_, i) => (
                      <button key={i} onClick={() => setGalleryIndex(i)} className={`w-2 h-2 rounded-full ${i === galleryIndex ? "bg-amber-400" : "bg-white/30"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CERITA / TIMELINE */}
          <section id="cerita" className="py-12 sm:py-16 reveal">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-xl font-semibold text-amber-300">Cerita & Momen Spesial</h3>
              <div className="mt-6 space-y-6">
                <TimelineItem date="2000" title="Kelahiran" text="Awal kisah, lahir membawa cahaya baru..." />
                <TimelineItem date="2010" title="Sekolah Dasar" text="Pertemanan yang bersemi dan petualangan kecil..." />
                <TimelineItem date="2018" title="Memulai Karir" text="Langkah pertama di dunia profesional..." />
                <TimelineItem date="2024" title="Momen Tak Terlupakan" text="Perjalanan, belajar, dan bertemu banyak orang hebat." />
              </div>
            </div>
          </section>

          {/* RSVP */}
          <section id="rsvp" className="py-12 sm:py-16 reveal">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-xl font-semibold text-amber-300">Konfirmasi Kehadiran (RSVP)</h3>
              <div className="mt-6 rounded-xl p-6 bg-gradient-to-br from-black/30 to-white/5 border border-white/6 shadow-md">
                {rsvpStatus === "success" ? (
                  <div className="p-4 rounded-md bg-emerald-600/10 border border-emerald-500/20 text-emerald-200">
                    Terima kasih! Konfirmasi Anda telah diterima.
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        required
                        value={rsvp.name}
                        onChange={(e) => setRsvp((s) => ({ ...s, name: e.target.value }))}
                        placeholder="Nama lengkap"
                        className="px-3 py-2 rounded-md bg-white/3 border border-white/6 placeholder-gray-400 text-sm"
                      />
                      <input
                        required
                        value={rsvp.email}
                        onChange={(e) => setRsvp((s) => ({ ...s, email: e.target.value }))}
                        placeholder="Email / Nomor WA"
                        className="px-3 py-2 rounded-md bg-white/3 border border-white/6 placeholder-gray-400 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <select
                        required
                        value={rsvp.attending}
                        onChange={(e) => setRsvp((s) => ({ ...s, attending: e.target.value as RSVPState["attending"] }))}
                        className="px-3 py-2 rounded-md bg-white/3 border border-white/6 text-sm"
                      >
                        <option value="">Apakah Anda hadir?</option>
                        <option value="yes">Hadir</option>
                        <option value="no">Tidak hadir</option>
                      </select>
                      <input
                        type="number"
                        min={0}
                        value={rsvp.guests}
                        onChange={(e) => setRsvp((s) => ({ ...s, guests: Number(e.target.value) }))}
                        className="px-3 py-2 rounded-md bg-white/3 border border-white/6 text-sm"
                        placeholder="Jumlah tamu"
                      />
                      <button
                        type="button"
                        onClick={() => setRsvp((s) => ({ ...s, guests: Math.min(10, s.guests + 1) }))}
                        className="px-3 py-2 rounded-md border border-white/6 text-sm"
                      >
                        + Tambah tamu
                      </button>
                    </div>

                    <textarea
                      value={rsvp.message}
                      onChange={(e) => setRsvp((s) => ({ ...s, message: e.target.value }))}
                      placeholder="Pesan / catatan untuk tuan rumah"
                      className="px-3 py-2 rounded-md bg-white/3 border border-white/6 placeholder-gray-400 text-sm min-h-[90px]"
                    />

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-300">Dengan mengirim, Anda membantu kami menyiapkan acara lebih baik.</div>
                      <button
                        type="submit"
                        disabled={rsvpStatus === "submitting"}
                        className="px-4 py-2 rounded-md bg-amber-500 text-black font-semibold hover:scale-[1.02] transition"
                      >
                        {rsvpStatus === "submitting" ? "Mengirim..." : "Kirim RSVP"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>

          {/* HADIAH */}
          <section id="hadiah" className="py-12 sm:py-16 reveal">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-black/30 to-white/5 border border-white/6 shadow-lg">
                <h3 className="text-xl font-semibold text-amber-300">Hadiah & Donasi</h3>
                <p className="mt-2 text-sm text-gray-300">Jika berkenan memberikan hadiah, berikut informasi rekening atau e-wallet. Kehadiran jauh lebih berharga — hadiah bersifat opsional.</p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/6">
                    <div className="text-xs text-gray-400">Bank</div>
                    <div className="font-semibold mt-1">BANK ABC - 1234567890</div>
                    <div className="text-xs text-gray-400 mt-1">a.n. Nama Penerima</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/6">
                    <div className="text-xs text-gray-400">E-Wallet</div>
                    <div className="font-semibold mt-1">OVO / DANA / GOPAY</div>
                    <div className="text-xs text-gray-400 mt-1">0812-3456-7890</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/6">
                    <div className="text-xs text-gray-400">Link Kado Digital</div>
                    <a href="#" className="underline text-amber-300 mt-1 inline-block">Kirim Kado (contoh)</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="py-12 sm:py-16 reveal">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-xl font-semibold text-amber-300">FAQ</h3>
              <div className="mt-4 space-y-3">
                <Accordion title="Apakah acara open to public?">
                  Acara bersifat undangan. Mohon konfirmasi lewat RSVP sebelum hadir.
                </Accordion>
                <Accordion title="Apakah ada parkir?">
                  Tersedia area parkir terbatas. Disarankan agar teman-teman carpool atau gunakan transportasi online.
                </Accordion>
                <Accordion title="Bisakah membawa anak?">
                  Tentu boleh — beri tahu kami jumlah anak saat RSVP agar kami siapkan tempat.
                </Accordion>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer id="footer" className="py-8 border-t border-white/6 bg-gradient-to-t from-black/10 to-transparent reveal">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center text-black" style={{ fontFamily: "Great Vibes, serif" }}>A</div>
                  <div>
                    <div className="font-semibold">Undangan Ulang Tahun</div>
                    <div className="text-xs text-gray-400">Terima kasih sudah menjadi bagian dari kenangan ini.</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <nav className="flex gap-3">
                  {sections.map((s) => (
                    <button key={s} onClick={() => scrollTo(s)} className="text-sm text-gray-300 hover:text-amber-300">{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                  ))}
                </nav>

                <div className="flex items-center gap-2">
                  <a href="#" className="p-2 rounded-full bg-white/5 border border-white/6">IG</a>
                  <a href="#" className="p-2 rounded-full bg-white/5 border border-white/6">FB</a>
                  <a href="#" className="p-2 rounded-full bg-white/5 border border-white/6">WA</a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* extra styles */}
      <style jsx>{`
        .reveal {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 700ms ease, transform 700ms ease;
        }
        .reveal-visible {
          opacity: 1;
          transform: none;
        }
        .reveal-from-left {
          transform: translateX(-12px);
        }
        .reveal-from-right {
          transform: translateX(12px);
        }
        .inner-card.ring-amber-400\\/30 {
          box-shadow: 0 0 0 8px rgba(250, 204, 21, 0.12);
        }
        /* countdown digits styling tweak */
        .count-digit {
          min-width: 48px;
        }
      `}</style>
    </>
  );
};

export default Invitation;

/* ---------------------------
   Helper components & utils
   --------------------------- */

function MobileMenu({ sections, active, onNavigate }: { sections: string[]; active: string; onNavigate: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((s) => !s)} className="p-2 rounded-md bg-white/5 border border-white/6">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-black/60 backdrop-blur rounded-md border border-white/6 shadow-lg z-50">
          <div className="flex flex-col p-2">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onNavigate(s);
                  setOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-md text-sm ${active === s ? "text-amber-300" : "text-white/80"} hover:bg-white/5`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CountdownDisplay({ isToday, isExpired, days, hours, minutes, seconds }: { isToday: boolean; isExpired: boolean; days: number; hours: number; minutes: number; seconds: number; }) {
  // show as segments
  if (isExpired) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-3 py-2 rounded-lg bg-slate-700/30 border border-white/6">
          <div className="text-xs text-gray-300">Telah berlalu</div>
          <div className="text-sm text-gray-200">{days} hari lalu</div>
        </div>
      </div>
    );
  } else if (isToday) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-400/20">
          <div className="text-xs text-emerald-200">Sekarang</div>
          <div className="text-lg font-bold text-emerald-200">Waktunya Rayakan 🎉</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md border border-white/6">
          <span className="text-xs text-gray-300 mr-2">Hingga</span>
          <div className="text-lg font-semibold text-amber-200 mr-1">{pad(days)}</div>
          <div className="text-xs text-gray-300">hari</div>
          <div className="ml-3 text-sm text-gray-400">{pad(hours)}:{pad(minutes)}:{pad(seconds)}</div>
        </div>
      </div>
    );
  }
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toGoogleDate(d: Date) {
  // YYYYMMDDTHHMMSSZ (UTC)
  const z = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  const mm = z(d.getUTCMonth() + 1);
  const dd = z(d.getUTCDate());
  const hh = z(d.getUTCHours());
  const min = z(d.getUTCMinutes());
  const ss = z(d.getUTCSeconds());
  return `${yyyy}${mm}${dd}T${hh}${min}${ss}Z`;
}

function TimelineItem({ date, title, text }: { date: string; title: string; text: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-200 font-semibold">{date}</div>
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-amber-200">{title}</div>
        <div className="text-sm text-gray-300 mt-1">{text}</div>
      </div>
    </div>
  );
}

/* Accordion */
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-md border border-white/6 overflow-hidden">
      <button onClick={() => setOpen((s) => !s)} className="w-full px-4 py-3 text-left flex justify-between items-center bg-white/3">
        <span className="font-medium text-gray-200">{title}</span>
        <svg className={`w-5 h-5 transform transition ${open ? "rotate-180" : "rotate-0"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && <div className="px-4 py-3 bg-black/20 text-sm text-gray-300">{children}</div>}
    </div>
  );
}
