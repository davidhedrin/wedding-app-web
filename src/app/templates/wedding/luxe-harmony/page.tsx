"use client";

// pages/invitation.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import useCountdown from "@/lib/countdown";

/**
 * Invitation Type: Wedding
 * Theme Name: "Luxe Harmony"
 * Create At: 09-09-2025
 * Create By: David
*/

type RSVPForm = {
  name: string;
  email?: string;
  guests: number;
  attending: "yes" | "no" | "maybe";
  message?: string;
};

const IMAGE = "http://localhost:3005/assets/img/2149043983.jpg";

/**
 * Ubah TARGET_DATE di sini (ISO string). Contoh: "2025-12-31T09:00:00+07:00"
 */
const TARGET_DATE = "2025-12-31T09:00:00+07:00";

const formatNumber = (n: number) => String(n).padStart(2, "0");

export default function InvitationPage() {
  // Countdown state
  const target = useMemo(() => new Date(TARGET_DATE), []);
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(TARGET_DATE.toString());

  // Hero carousel
  const [heroIndex, setHeroIndex] = useState(0);
  const heroSlides = [IMAGE, IMAGE, IMAGE]; // reuse same image for demo
  useEffect(() => {
    const id = setInterval(() => setHeroIndex((i) => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(id);
  }, [heroSlides.length]);

  // Gallery slider
  const [galleryIndex, setGalleryIndex] = useState(0);
  const gallerySlides = [IMAGE, IMAGE, IMAGE, IMAGE];

  // Smooth "open invitation" (scroll to content)
  const mainRef = useRef<HTMLElement | null>(null);
  const openInvitation = () => mainRef.current?.scrollIntoView({ behavior: "smooth" });

  // RSVP
  const [rsvp, setRsvp] = useState<RSVPForm>({ name: "", email: "", guests: 1, attending: "yes", message: "" });
  const [rsvpStatus, setRsvpStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvp.name.trim()) {
      setRsvpStatus({ ok: false, msg: "Nama harus diisi." });
      return;
    }
    // TODO: kirim ke API. Untuk sekarang tampilkan success simulasi
    setRsvpStatus({ ok: true, msg: `Terima kasih ${rsvp.name}, konfirmasi terkirim!` });
    // reset sedikit UI
    setTimeout(() => setRsvpStatus(null), 6000);
  };

  // Accordion state for FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // small helper for nav highlight: simple scroll spy
  const [activeSection, setActiveSection] = useState<string>("hero");
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[id]")) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* Dua font elegan; bisa diganti */}
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Page wrapper */}
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-amber-50 to-emerald-50 text-slate-800 font-sans scroll-smooth">
        {/* Sticky navigation */}
        <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-white/30 dark:bg-slate-900/40 border-b border-white/20">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <a href="#hero" className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/70">
                    <img src={IMAGE} alt="logo" className="object-cover w-full h-full" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg font-playfair leading-none">Rina & Arif</h1>
                    <p className="text-xs opacity-80">09 Desember 2025</p>
                  </div>
                </a>
              </div>

              <div className="hidden md:flex items-center gap-6">
                {["hero", "mempelai", "acara", "galeri", "cerita", "rsvp", "hadiah", "faq"].map((id) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`text-sm font-medium px-2 py-1 rounded hover:bg-white/40 transition ${activeSection === id ? "underline decoration-2 decoration-amber-400" : "opacity-90"
                      }`}
                  >
                    {navLabel(id)}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={openInvitation}
                  className="hidden sm:inline-flex items-center gap-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 text-sm font-medium shadow-lg transition transform hover:-translate-y-0.5"
                >
                  Buka Undangan
                </button>

                {/* mobile nav dropdown */}
                <div className="md:hidden">
                  <MobileMenu />
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* Hero */}
        <section id="hero" className="relative pt-20 mb-28">
          <div className="h-[70vh] md:h-[80vh] w-full relative overflow-hidden rounded-b-3xl shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center">
              {heroSlides.map((src, i) => {
                const isActive = i === heroIndex;
                const isPrev = i === (heroIndex - 1 + heroSlides.length) % heroSlides.length;
                const isNext = i === (heroIndex + 1) % heroSlides.length;

                return (
                  <div
                    key={i}
                    className={`absolute transition-all duration-700 ease-in-out`}
                    style={{
                      transform: isActive
                        ? "translateX(0) scale(1)"
                        : isPrev
                          ? "translateX(-30%) scale(0.9)"
                          : isNext
                            ? "translateX(30%) scale(0.9)"
                            : "translateX(0) scale(0.8)",
                      opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0.15,
                      zIndex: isActive ? 30 : isPrev || isNext ? 20 : 10,
                    }}
                  >
                    <img
                      src={src}
                      alt={`hero-${i}`}
                      className="w-[80vw] md:w-[50vw] h-[70vh] md:h-[80vh] object-cover object-center rounded-2xl shadow-2xl transition"
                    />
                    {/* Overlay gradasi supaya teks tetap terbaca */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 rounded-2xl" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hero content overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-40">
              <div className="max-w-3xl backdrop-blur-sm bg-white/10 rounded-3xl p-6 border border-white/20 shadow-xl">
                <h2 className="text-4xl sm:text-5xl font-playfair font-bold tracking-tight text-white drop-shadow-lg">
                  Undangan Pernikahan
                </h2>
                <p className="mt-2 text-sm sm:text-base text-white/90">
                  Dengan segala kerendahan hati, kami mengundangmu untuk hadir di hari kebahagiaan kami.
                </p>

                {/* Countdown box */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="rounded-xl p-4 bg-white/10 border border-white/20 shadow-inner">
                    {isExpired ? (
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-semibold text-white">Terima Kasih</div>
                        <div className="text-sm text-white/80">Acara telah berlangsung. Terima kasih atas doa & kehadiran.</div>
                      </div>
                    ) : isToday ? (
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-amber-200">Hari Ini!</div>
                        <div className="text-sm text-white/90">Saksikan pesta dan doa bersama kami.</div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="text-center px-3">
                          <div className="text-2xl sm:text-3xl font-semibold text-white">{formatNumber(days)}</div>
                          <div className="text-xs text-white/80">Hari</div>
                        </div>
                        <div className="text-center px-3">
                          <div className="text-2xl sm:text-3xl font-semibold text-white">{formatNumber(hours)}</div>
                          <div className="text-xs text-white/80">Jam</div>
                        </div>
                        <div className="text-center px-3 hidden sm:block">
                          <div className="text-2xl sm:text-3xl font-semibold text-white">{formatNumber(minutes)}</div>
                          <div className="text-xs text-white/80">Menit</div>
                        </div>
                        <div className="text-center px-3 hidden sm:block">
                          <div className="text-2xl sm:text-3xl font-semibold text-white">{formatNumber(seconds)}</div>
                          <div className="text-xs text-white/80">Detik</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={openInvitation}
                      className="inline-flex items-center gap-3 rounded-full bg-white/90 text-slate-900 px-5 py-3 font-medium shadow-lg hover:scale-[1.02] transition"
                      aria-label="Buka undangan"
                    >
                      Buka Undangan
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-80" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0V9h2a1 1 0 100-2h-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots nav */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className={`w-3 h-3 rounded-full transition ${i === heroIndex ? "bg-amber-400 scale-110" : "bg-white/60"
                    }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <main ref={mainRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          {/* Mempelai Section */}
          <section id="mempelai" className="mb-24 bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-lg border border-white/30">
            <h3 className="text-2xl font-playfair font-bold">Mempelai</h3>
            <p className="mt-2 text-sm text-slate-700">Dengan penuh suka cita, kami memperkenalkan pasangan yang akan disatukan.</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Mempelai A */}
              <div className="flex items-start gap-4">
                <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-md ring-1 ring-white/40">
                  <img src={IMAGE} alt="mempelai-a" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Rina Nur Azzah</h4>
                  <p className="text-sm text-slate-600">Putri dari Bapak & Ibu Nur</p>
                  <p className="mt-3 text-sm text-slate-700">"Dengan hati tulus, siap memulai bab baru bersama."</p>
                </div>
              </div>

              {/* Mempelai B */}
              <div className="flex items-start gap-4">
                <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-md ring-1 ring-white/40">
                  <img src={IMAGE} alt="mempelai-b" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Arif Pratama</h4>
                  <p className="text-sm text-slate-600">Putra dari Bapak & Ibu Pratama</p>
                  <p className="mt-3 text-sm text-slate-700">"Terima kasih atas doa dan restunya. Sampai jumpa di hari bahagia."</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-slate-700">
              <p>Assalamu'alaikum Wr. Wb. Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan kami.</p>
            </div>
          </section>

          {/* Acara Section */}
          <section id="acara" className="mb-24 bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-lg border border-white/30">
            <h3 className="text-2xl font-playfair font-bold">Acara</h3>
            <p className="mt-2 text-sm text-slate-700">Detail waktu, tempat, dan informasi penting.</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 shadow-sm">
                  <h4 className="text-sm font-semibold">Akad & Resepsi</h4>
                  <p className="mt-1 text-sm text-slate-700">Akad: <strong>09:00 WIB</strong> — Resepsi: <strong>11:00 - 14:00 WIB</strong></p>
                  <p className="mt-1 text-sm text-slate-700">Tanggal: <strong>{target.toLocaleDateString()}</strong></p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-white/30 shadow-sm">
                  <h4 className="text-sm font-semibold">Informasi Tambahan</h4>
                  <ul className="mt-2 text-sm text-slate-700 list-disc list-inside space-y-1">
                    <li>Dress code: Smart Casual / Kemeja & dress sopan</li>
                    <li>Mohon hadir tepat waktu.</li>
                    <li>Parkir tersedia di area gedung.</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-white/30">
                <iframe
                  title="Lokasi"
                  src={"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126917.123456789!2d106.816666!3d-6.200000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2zMTLCsDAwJzAwLjAiUyAxMDYuNTE2Nzc4J0E!5e0!3m2!1sid!2sid!4v0000000000000"}
                  className="w-full h-56 md:h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          {/* Galeri */}
          <section id="galeri" className="mb-24 bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-lg border border-white/30">
            <h3 className="text-2xl font-playfair font-bold">Galeri</h3>
            <p className="mt-2 text-sm text-slate-700">Kumpulan momen kami — geser untuk melihat gambar.</p>

            <div className="mt-6">
              <div className="relative rounded-xl overflow-hidden">
                <img src={gallerySlides[galleryIndex]} alt={`gallery-${galleryIndex}`} className="w-full h-64 object-cover transition-transform duration-700 hover:scale-[1.02]" />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <button
                    onClick={() => setGalleryIndex((i) => (i - 1 + gallerySlides.length) % gallerySlides.length)}
                    className="bg-white/80 rounded-full p-2 shadow hover:scale-110 transition"
                    aria-label="prev"
                  >
                    ◀
                  </button>
                </div>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <button
                    onClick={() => setGalleryIndex((i) => (i + 1) % gallerySlides.length)}
                    className="bg-white/80 rounded-full p-2 shadow hover:scale-110 transition"
                    aria-label="next"
                  >
                    ▶
                  </button>
                </div>
              </div>

              {/* thumbnails */}
              <div className="mt-4 flex gap-3 overflow-x-auto py-2">
                {gallerySlides.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIndex(i)}
                    className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 ${i === galleryIndex ? "border-amber-400" : "border-white/30"} shadow-sm transform hover:scale-105 transition`}
                  >
                    <img src={s} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Cerita */}
          <section id="cerita" className="mb-24 bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-lg border border-white/30">
            <h3 className="text-2xl font-playfair font-bold">Cerita Kami</h3>
            <p className="mt-2 text-sm text-slate-700">Sebuah garis waktu singkat perjalanan cinta kami.</p>

            <ol className="mt-6 relative border-l border-white/20">
              {[
                { date: "2018", title: "Pertemuan Pertama", desc: "Kami bertemu saat acara teman bersama." },
                { date: "2019", title: "Mulai Dekat", desc: "Serangkaian obrolan panjang dan kopi bersama." },
                { date: "2021", title: "Menjadi Satu Tim", desc: "Memutuskan untuk saling mendukung dalam karier & impian." },
                { date: "2025", title: "Melamar & Bersatu", desc: "Kami memutuskan untuk menutup bab ini dengan janji seumur hidup." },
              ].map((item, i) => (
                <li key={i} className="mb-8 ml-6">
                  <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-amber-400 rounded-full ring-4 ring-white/50 text-xs font-semibold">{i + 1}</span>
                  <div className="text-sm font-semibold">{item.title} <span className="text-xs text-slate-500 ml-2">{item.date}</span></div>
                  <div className="mt-1 text-sm text-slate-700">{item.desc}</div>
                </li>
              ))}
            </ol>
          </section>

          {/* RSVP */}
          <section id="rsvp" className="mb-24 bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-lg border border-white/30">
            <h3 className="text-2xl font-playfair font-bold">RSVP</h3>
            <p className="mt-2 text-sm text-slate-700">Konfirmasi kehadiranmu. Sangat membantu kami untuk persiapan.</p>

            <form onSubmit={handleRsvpSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-700">Nama</label>
                <input
                  value={rsvp.name}
                  onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className="text-sm text-slate-700">Email (opsional)</label>
                <input
                  value={rsvp.email}
                  onChange={(e) => setRsvp({ ...rsvp, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  placeholder="email@contoh.com"
                />
              </div>

              <div>
                <label className="text-sm text-slate-700">Jumlah Tamu</label>
                <input
                  type="number"
                  min={0}
                  value={rsvp.guests}
                  onChange={(e) => setRsvp({ ...rsvp, guests: Math.max(0, Number(e.target.value)) })}
                  className="mt-1 w-full rounded-lg border border-black/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <div>
                <label className="text-sm text-slate-700">Hadir?</label>
                <select
                  value={rsvp.attending}
                  onChange={(e) => setRsvp({ ...rsvp, attending: e.target.value as RSVPForm["attending"] })}
                  className="mt-1 w-full rounded-lg border border-black/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  <option value="yes">Hadir</option>
                  <option value="no">Tidak Hadir</option>
                  <option value="maybe">Mungkin</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-slate-700">Pesan / Doa</label>
                <textarea
                  value={rsvp.message}
                  onChange={(e) => setRsvp({ ...rsvp, message: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-black/30 px-3 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  placeholder="Pesan untuk mempelai..."
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-4">
                <button type="submit" className="rounded-full bg-amber-500 text-white px-6 py-2 font-medium shadow hover:scale-[1.02] transition">
                  Kirim Konfirmasi
                </button>
                {rsvpStatus && (
                  <div className={`px-4 py-2 rounded-md text-sm ${rsvpStatus.ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {rsvpStatus.msg}
                  </div>
                )}
              </div>
            </form>
          </section>

          {/* Hadiah */}
          <section id="hadiah" className="mb-24 bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-lg border border-white/30">
            <h3 className="text-2xl font-playfair font-bold">Hadiah</h3>
            <p className="mt-2 text-sm text-slate-700">Bila ingin memberikan hadiah, berikut informasi rekening dan e-wallet kami.</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="text-sm font-semibold">Bank BCA</div>
                <div className="mt-1 text-sm">a/n Rina Nur — 123 456 7890</div>
                <button className="mt-3 text-xs rounded-full px-3 py-1 bg-white/90 hover:bg-white transition">Salin Nomor</button>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="text-sm font-semibold">GoPay / OVO</div>
                <div className="mt-1 text-sm">0812-3456-7890</div>
                <button className="mt-3 text-xs rounded-full px-3 py-1 bg-white/90 hover:bg-white transition">Buka Aplikasi</button>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="text-sm font-semibold">Link Hadiah</div>
                <div className="mt-1 text-sm">Toko Online / Gift Registry (opsional)</div>
                <a className="mt-3 inline-block text-xs rounded-full px-3 py-1 bg-white/90 hover:bg-white transition" href="#">
                  Buka Link
                </a>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-lg border border-white/30 mb-12">
            <h3 className="text-2xl font-playfair font-bold">FAQ</h3>
            <p className="mt-2 text-sm text-slate-700">Pertanyaan umum yang sering ditanyakan.</p>

            <div className="mt-6 space-y-4">
              {[
                { q: "Apakah tamu boleh membawa anak?", a: "Boleh, namun mohon konfirmasi jumlah anak pada RSVP." },
                { q: "Bagaimana jika terlambat?", a: "Acara akan dimulai tepat waktu — mohon hadir 15 menit lebih awal." },
                { q: "Adakah dress code?", a: "Smart Casual; hindari warna serupa dengan pengantin." },
              ].map((item, i) => (
                <div key={i} className="border border-white/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq((prev) => (prev === i ? null : i))}
                    className="w-full text-left px-4 py-3 flex items-center justify-between bg-white/30 hover:bg-white/40 transition"
                  >
                    <span className="font-medium">{item.q}</span>
                    <span className="text-sm text-slate-600">{openFaq === i ? "-" : "+"}</span>
                  </button>
                  <div className={`px-4 py-0 transition-all ${openFaq === i ? "max-h-96" : "max-h-0 overflow-hidden"}`}>
                    <p className="text-sm text-slate-700">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-10 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img src={IMAGE} alt="logo-footer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-playfair text-lg">Rina & Arif</div>
                  <div className="text-xs text-slate-300">09 Desember 2025 • Terima kasih atas doa & kehadiranmu</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {["Mempelai", "Acara", "Galeri", "Cerita", "RSVP", "Hadiah", "FAQ"].map((lab) => (
                  <a key={lab} href={`#${lab.toLowerCase()}`} className="text-sm text-slate-200 hover:text-white/90 transition">
                    {lab}
                  </a>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-slate-500 mt-4">Designed with ❤️ • Digital Invitation Template</p>
          </div>
        </footer>

        <style jsx global>{`
          /* Simple font family mapping */
          :root {
            --ff-title: "Playfair Display", serif;
            --ff-body: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          }
          .font-playfair {
            font-family: var(--ff-title);
          }
          html {
            scroll-behavior: smooth;
          }
        `}</style>
      </div>
    </>
  );
}

/** Small helper components & labels **/

function navLabel(id: string) {
  const map: Record<string, string> = {
    hero: "Home",
    mempelai: "Mempelai",
    acara: "Acara",
    galeri: "Galeri",
    cerita: "Cerita",
    rsvp: "RSVP",
    hadiah: "Hadiah",
    faq: "FAQ",
  };
  return map[id] ?? id;
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-md bg-white/20 hover:bg-white/30 transition"
        aria-label="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-4 top-16 w-52 bg-white/90 rounded-lg shadow-lg p-3">
          {["hero", "mempelai", "acara", "galeri", "cerita", "rsvp", "hadiah", "faq"].map((id) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="block px-2 py-2 rounded hover:bg-white/70 text-sm">
              {navLabel(id)}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
