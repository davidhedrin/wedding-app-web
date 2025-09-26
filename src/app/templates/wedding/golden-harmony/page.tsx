'use client';
// pages/wedding.tsx
import React, { useEffect, useState } from "react";
import Head from "next/head";
import useCountdown from "@/lib/countdown";

import bgImage from './bg.jpg';

/**
 * Invitation Type: Wedding
 * Theme Name: "Golden Harmony"
 * Create At: 09-09-2025
 * Create By: David
*/

const HERO_IMAGES = [
  "http://localhost:3005/assets/img/2149043983.jpg",
  "http://localhost:3005/assets/img/2149043983.jpg",
  "http://localhost:3005/assets/img/2149043983.jpg",
];

const WEDDING_DATE = new Date("2025-12-20T09:00:00"); // <-- set tanggal & jam akad di sini (ISO)
const MAP_EMBED = `https://www.google.com/maps?q=-6.200000,106.816666&z=15&output=embed`; // contoh: Jakarta

export default function WeddingInvite() {
  // hero carousel
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setHeroIdx((s) => (s + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // countdown
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(WEDDING_DATE.toString());

  // gallery slider
  const [galleryIdx, setGalleryIdx] = useState(0);
  const galleryCount = 6;

  // RSVP form
  const [rsvp, setRsvp] = useState({ name: "", email: "", guests: 1, message: "" });
  const [rsvpSent, setRsvpSent] = useState(false);
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo: store localStorage and show modal
    const stored = JSON.parse(localStorage.getItem("rsvps") || "[]");
    stored.push({ ...rsvp, time: new Date().toISOString() });
    localStorage.setItem("rsvps", JSON.stringify(stored));
    setRsvpSent(true);
    setTimeout(() => setRsvpSent(false), 5000);
    setRsvp({ name: "", email: "", guests: 1, message: "" });
  };

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // scroll helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Head>
        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        className="min-h-screen font-inter text-slate-100"
        style={{
          // background image fixed + elegant color overlay
          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.4), rgba(8,10,20,0.6)), url(${bgImage.src})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Sticky navbar */}
        <header className="fixed top-0 left-0 right-0 z-40">
          <nav className="backdrop-blur-sm bg-slate-900/40 border-b border-slate-800">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className="w-10 h-10 rounded-full border border-slate-200/20 overflow-hidden">
                  <img
                    src="http://localhost:3005/assets/img/2149043983.jpg"
                    alt="logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="leading-tight">
                  <div className="font-playfair text-lg">A & B</div>
                  <div className="text-xs text-slate-300">10.10.2025</div>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-6">
                {["mempelai", "acara", "galeri", "cerita", "rsvp", "hadiah", "faq"].map(
                  (id) => (
                    <button
                      key={id}
                      className="text-sm text-slate-200 hover:text-amber-300 transition"
                      onClick={() => scrollTo(id)}
                    >
                      {id.charAt(0).toUpperCase() + id.slice(1)}
                    </button>
                  )
                )}
              </div>

              <div className="md:hidden">
                <button
                  className="p-2 rounded-md bg-slate-800/50 hover:bg-slate-700/60 transition"
                  onClick={() =>
                    document.getElementById("mobile-nav")?.classList.toggle("hidden")
                  }
                  aria-label="Open menu"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" className="text-slate-100">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M3 12h18M3 18h18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* mobile nav */}
            <div id="mobile-nav" className="hidden md:hidden border-t border-slate-800">
              <div className="px-4 py-3 flex flex-col gap-2">
                {["mempelai", "acara", "galeri", "cerita", "rsvp", "hadiah", "faq"].map((id) => (
                  <button
                    key={id}
                    className="text-left text-slate-200 py-2 px-2 hover:bg-slate-800/40 rounded transition"
                    onClick={() => {
                      scrollTo(id);
                      document.getElementById("mobile-nav")?.classList.add("hidden");
                    }}
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </header>

        <main className="pt-20">
          {/* HERO */}
          <section
            id="hero"
            className="min-h-[72vh] md:min-h-[88vh] flex items-center"
            aria-label="Hero"
          >
            <div className="max-w-6xl mx-auto w-full px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
              {/* left content */}
              <div className="relative z-10">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-200/10 text-amber-200 text-xs mb-4">
                  Undangan Digital • Save the Date
                </div>

                <h1 className="font-playfair text-4xl sm:text-3xl md:text-5xl leading-tight mb-4">
                  Kami Mengundang Anda<br />
                  Untuk Menyaksikan Pernikahan Kami
                </h1>

                <p className="text-slate-300 mb-6 max-w-xl">
                  Dengan rasa syukur kami, mengundang Bapak/Ibu/Saudara/i untuk hadir
                  pada acara pernikahan kami. Kehadiran dan doa restu Anda sangat berarti.
                </p>

                {/* Countdown design with three states */}
                <div
                  className="inline-flex items-center gap-4 p-4 rounded-xl shadow-lg bg-slate-800/50 border border-slate-700"
                  role="status"
                >
                  {isExpired ? (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-slate-400" />
                      <div>
                        <div className="text-xs text-slate-400">Selesai</div>
                        <div className="text-lg font-semibold">Terima kasih atas kehadiran dan doanya</div>
                      </div>
                    </div>
                  ) : isToday ? (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse" />
                      <div>
                        <div className="text-xs text-emerald-300">Hari Ini</div>
                        <div className="text-lg font-semibold">Selamat! Acara Sedang Berlangsung</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                        <div className="text-xs text-amber-300">Hari</div>
                        <div className="text-2xl font-semibold">
                          {days} <span className="text-sm">hari</span>
                        </div>
                      </div>
                      <div className="text-center px-3 border-l border-slate-700">
                        <div className="text-xs text-slate-400">Jam</div>
                        <div className="text-lg font-medium">
                          {String(hours).padStart(2, "0")}:
                          {String(minutes).padStart(2, "0")}:
                          {String(seconds).padStart(2, "0")}
                        </div>
                      </div>
                      <div className="pl-4">
                        <div className="text-xs text-slate-400">Tanggal</div>
                        <div className="text-sm">
                          {WEDDING_DATE.toLocaleDateString()} • {WEDDING_DATE.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => scrollTo("mempelai")}
                    className="px-5 py-3 rounded-full bg-amber-300 text-slate-900 font-medium shadow-md hover:scale-[1.02] transition"
                  >
                    Buka Undangan
                  </button>
                  <button
                    onClick={() => scrollTo("rsvp")}
                    className="px-5 py-3 rounded-full border border-slate-600 text-slate-200 hover:bg-slate-800 transition"
                  >
                    Konfirmasi Kehadiran
                  </button>
                </div>

                <div className="mt-6 text-xs text-slate-400">
                  <strong>Catatan:</strong> Dress code: Semi formal / Batik. Acara akan dimulai tepat waktu.
                </div>
              </div>

              {/* right: visual hero with carousel overlay */}
              <div className="relative order-first md:order-last w-full">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] lg:aspect-[5/6]">
                  {HERO_IMAGES.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`hero-${i}`}
                      className={`
                        absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out
                        ${i === heroIdx ? "opacity-100 scale-100" : "opacity-0 scale-105"}
                      `}
                    />
                  ))}

                  {/* overlay gradient biar mewah */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/30 to-transparent" />

                  {/* subtle overlay content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="bg-slate-900/50 p-4 rounded-xl backdrop-blur-sm border border-slate-700/50 max-w-xs">
                      <div className="text-xs text-amber-200">Simbol Kebersamaan</div>
                      <div className="font-playfair text-2xl">A & B</div>
                      <div className="text-sm text-slate-200 mt-1">
                        Bersama keluarga besar, kami menantikan kehadiran Anda.
                      </div>
                    </div>
                  </div>
                </div>

                {/* dots */}
                <div className="mt-4 flex gap-2 justify-center">
                  {HERO_IMAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroIdx(i)}
                      className={`
                        w-3 h-3 rounded-full transition-all
                        ${i === heroIdx ? "bg-amber-300 scale-110" : "bg-slate-600 hover:bg-slate-500"}
                      `}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Main container for sections */}
          <div className="max-w-6xl mx-auto px-6 space-y-24 pb-24">

            {/* Mempelai */}
            <section id="mempelai" className="pt-8">
              <h2 className="font-playfair text-3xl mb-6">Mempelai</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col items-center text-center bg-slate-800/40 p-6 rounded-2xl border border-slate-700 shadow">
                  <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-amber-300 mb-4">
                    <img src="http://localhost:3005/assets/img/2149043983.jpg" alt="Mempelai 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="font-playfair text-xl">Nama Mempelai Pria</div>
                  <div className="text-slate-300 text-sm mt-2">Putra dari Bpk. ... & Ibu ...</div>
                </div>

                <div className="flex flex-col items-center text-center bg-slate-800/40 p-6 rounded-2xl border border-slate-700 shadow">
                  <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-amber-300 mb-4">
                    <img src="http://localhost:3005/assets/img/2149043983.jpg" alt="Mempelai 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="font-playfair text-xl">Nama Mempelai Wanita</div>
                  <div className="text-slate-300 text-sm mt-2">Putri dari Bpk. ... & Ibu ...</div>
                </div>
              </div>

              <div className="mt-8 text-slate-300 bg-slate-800/30 rounded-xl p-6 border border-slate-700">
                <p className="mb-3">Assalamu’alaikum / Salam sejahtera,</p>
                <p>
                  Dengan penuh rasa syukur kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu
                  pada acara pernikahan kami. Kehadiran Anda menjadi berkah bagi kami.
                </p>
              </div>
            </section>

            {/* Acara */}
            <section id="acara">
              <h2 className="font-playfair text-3xl mb-6">Acara</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700 shadow">
                    <div className="text-xs text-slate-400">Akad Nikah</div>
                    <div className="font-semibold text-lg">Sabtu, 20 Desember 2025</div>
                    <div className="text-slate-300 mt-2">Pukul 09.00 WIB</div>
                    <div className="mt-3 text-sm text-slate-400">Tempat: Gedung Serbaguna / Masjid ...</div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700 shadow">
                    <div className="text-xs text-slate-400">Resepsi</div>
                    <div className="font-semibold text-lg">Sabtu, 20 Desember 2025</div>
                    <div className="text-slate-300 mt-2">Pukul 11.00 - 14.00 WIB</div>
                    <div className="mt-3 text-sm text-slate-400">Dress Code: Semi formal / Batik</div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700 shadow">
                    <div className="text-xs text-slate-400">Informasi Penting</div>
                    <ul className="list-disc ml-5 text-slate-300 mt-2 text-sm">
                      <li>Mohon hadir tepat waktu.</li>
                      <li>Parkir tersedia di area sebelah gedung.</li>
                      <li>Konfirmasi kehadiran melalui form RSVP.</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-700">
                  <iframe
                    title="Lokasi Acara"
                    src={MAP_EMBED}
                    className="w-full h-full min-h-[320px]"
                    loading="lazy"
                  />
                </div>
              </div>
            </section>

            {/* Galeri */}
            <section id="galeri">
              <h2 className="font-playfair text-3xl mb-6">Galeri</h2>
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-300">Kenangan & Foto Kami</div>
                  <div className="text-sm text-slate-400">{galleryIdx + 1} / {galleryCount}</div>
                </div>

                <div className="w-full overflow-hidden">
                  <div
                    className="flex transition-transform duration-700"
                    style={{
                      transform: `translateX(-${galleryIdx * 100}%)`,
                      width: `${galleryCount * 100}%`,
                    }}
                  >
                    {Array.from({ length: galleryCount }).map((_, i) => (
                      <div key={i} className="w-full flex-shrink-0 px-2">
                        <div className="h-72 sm:h-80 md:h-96 rounded-xl overflow-hidden border border-slate-700">
                          <img
                            src="http://localhost:3005/assets/img/2149043983.jpg"
                            alt={`galeri-${i}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGalleryIdx((s) => (s - 1 + galleryCount) % galleryCount)}
                      className="px-3 py-2 rounded-md bg-slate-700/60 hover:bg-slate-600 transition"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setGalleryIdx((s) => (s + 1) % galleryCount)}
                      className="px-3 py-2 rounded-md bg-slate-700/60 hover:bg-slate-600 transition"
                    >
                      Next
                    </button>
                  </div>

                  <div className="hidden sm:flex gap-2">
                    {Array.from({ length: galleryCount }).map((_, i) => (
                      <button
                        key={i}
                        className={`w-12 h-8 rounded overflow-hidden border ${i === galleryIdx ? 'ring-2 ring-amber-300' : 'border-slate-700'}`}
                        onClick={() => setGalleryIdx(i)}
                      >
                        <img src="http://localhost:3005/assets/img/2149043983.jpg" alt={`thumb-${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Cerita */}
            <section id="cerita">
              <h2 className="font-playfair text-3xl mb-6">Cerita Kita</h2>
              <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700">
                <ol className="relative border-l border-slate-700 ml-4">
                  {[
                    { date: "2019", title: "Berkenalan", desc: "Pertemuan pertama di sebuah acara kampus." },
                    { date: "2020", title: "Mulai Dekat", desc: "Saling mengenal dan menjadi teman dekat." },
                    { date: "2022", title: "Resmi Pacaran", desc: "Kami memutuskan untuk bersama." },
                    { date: "2025", title: "Lamaran", desc: "Melewati proses lamaran keluarga." },
                  ].map((it, idx) => (
                    <li key={idx} className="mb-8 ml-6">
                      <span className="absolute -left-6 w-4 h-4 rounded-full bg-amber-300 border border-slate-800" />
                      <div className="text-sm text-amber-200">{it.date}</div>
                      <div className="font-semibold text-lg mt-1">{it.title}</div>
                      <div className="text-slate-300 mt-2">{it.desc}</div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* RSVP */}
            <section id="rsvp">
              <h2 className="font-playfair text-3xl mb-6">RSVP</h2>
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <form onSubmit={handleRsvpSubmit} className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700 shadow">
                  <div className="grid gap-3">
                    <label className="text-sm text-slate-300">
                      Nama
                      <input
                        required
                        value={rsvp.name}
                        onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })}
                        className="mt-1 w-full bg-slate-900/40 rounded px-3 py-2 text-slate-100 placeholder:text-slate-400 border border-slate-700"
                        placeholder="Nama lengkap"
                      />
                    </label>

                    <label className="text-sm text-slate-300">
                      Email / No. HP
                      <input
                        value={rsvp.email}
                        onChange={(e) => setRsvp({ ...rsvp, email: e.target.value })}
                        className="mt-1 w-full bg-slate-900/40 rounded px-3 py-2 text-slate-100 placeholder:text-slate-400 border border-slate-700"
                        placeholder="email atau no hp"
                      />
                    </label>

                    <label className="text-sm text-slate-300">
                      Jumlah Tamu
                      <input
                        type="number"
                        min={1}
                        value={rsvp.guests}
                        onChange={(e) => setRsvp({ ...rsvp, guests: Number(e.target.value) })}
                        className="mt-1 w-32 bg-slate-900/40 rounded px-3 py-2 text-slate-100 placeholder:text-slate-400 border border-slate-700"
                      />
                    </label>

                    <label className="text-sm text-slate-300">
                      Pesan / Doa
                      <textarea
                        value={rsvp.message}
                        onChange={(e) => setRsvp({ ...rsvp, message: e.target.value })}
                        rows={3}
                        className="mt-1 w-full bg-slate-900/40 rounded px-3 py-2 text-slate-100 placeholder:text-slate-400 border border-slate-700"
                        placeholder="Pesan atau doa untuk kami"
                      />
                    </label>

                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 rounded-full bg-amber-300 text-slate-900 font-medium shadow hover:scale-[1.02] transition" type="submit">
                        Kirim
                      </button>
                      <button type="button" className="px-4 py-2 rounded-md border border-slate-700 text-slate-200" onClick={() => {
                        const stored = JSON.parse(localStorage.getItem("rsvps") || "[]");
                        alert(`Terdapat ${stored.length} RSVP tersimpan (lokal)`);
                      }}>
                        Lihat Jumlah RSVP (lokal)
                      </button>
                    </div>

                    {rsvpSent && <div className="text-sm text-emerald-300">Terima kasih! Konfirmasi Anda telah diterima.</div>}
                  </div>
                </form>

                <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700">
                  <div className="font-semibold mb-2">Informasi Tambahan</div>
                  <div className="text-slate-300 text-sm">
                    Jika Anda ingin mengirim kado atau transfer, silakan gunakan informasi di bagian Hadiah.
                    Untuk pertanyaan lebih lanjut, hubungi keluarga.
                  </div>

                  <div className="mt-4">
                    <button onClick={() => scrollTo("hadiah")} className="px-4 py-2 rounded-md bg-amber-300 text-slate-900">Lihat Info Hadiah</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Hadiah */}
            <section id="hadiah">
              <h2 className="font-playfair text-3xl mb-6">Hadiah</h2>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700 text-center">
                  <div className="text-slate-400 text-sm">Rekening Bank</div>
                  <div className="font-semibold text-lg mt-2">Bank Indonesia • 123-456-7890</div>
                  <div className="text-slate-300 text-sm mt-2">Atas Nama: Nama Mempelai</div>
                  <div className="mt-4">
                    <a href="https://example.com" className="inline-block px-4 py-2 rounded-md bg-amber-300 text-slate-900">Salin Nomor</a>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700 text-center">
                  <div className="text-slate-400 text-sm">E-wallet</div>
                  <div className="font-semibold text-lg mt-2">OVO / GoPay • 0812xxxx</div>
                  <div className="text-slate-300 text-sm mt-2">QRIS tersedia saat acara</div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700 text-center">
                  <div className="text-slate-400 text-sm">Ingin Hadiah Lain?</div>
                  <div className="font-semibold mt-2">Gift Registry</div>
                  <div className="text-slate-300 text-sm mt-2">Link ke daftar hadiah jika ada</div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="font-playfair text-3xl mb-6">FAQ</h2>
              <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700">
                {[
                  {
                    q: "Apakah ada parkir?",
                    a: "Tersedia parkir di area samping gedung dengan akses ke pintu utama.",
                  },
                  {
                    q: "Apakah anak-anak diperkenankan hadir?",
                    a: "Dipersilakan — mohon perhatikan kenyamanan bersama.",
                  },
                  {
                    q: "Apakah acara terbuka untuk umum?",
                    a: "Undangan bersifat personal; mohon konfirmasi RSVP.",
                  },
                ].map((f, i) => (
                  <div key={i} className="border-b border-slate-700 py-3">
                    <button
                      className="w-full text-left flex items-center justify-between gap-3"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                    >
                      <div>
                        <div className="font-medium">{f.q}</div>
                        <div className="text-slate-400 text-sm mt-1">{openFaq === i ? "Klik untuk tutup" : "Klik untuk lihat jawaban"}</div>
                      </div>
                      <div className="text-slate-300">
                        {openFaq === i ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 9l-7 7-7-7" /></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 15l7-7 7 7" /></svg>
                        )}
                      </div>
                    </button>

                    <div className={`mt-2 text-slate-300 text-sm overflow-hidden transition-all ${openFaq === i ? 'max-h-96' : 'max-h-0'}`}>
                      {f.a}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="pt-6 pb-16">
              <div className="border-t border-slate-700 pt-8">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-700">
                      <img src="http://localhost:3005/assets/img/2149043983.jpg" alt="footer" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-playfair">A & B</div>
                      <div className="text-xs text-slate-400">20 Desember 2025</div>
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm">
                    {["mempelai", "acara", "galeri", "cerita", "rsvp", "hadiah", "faq"].map((id) => (
                      <button key={id} className="text-slate-300 hover:text-amber-300 transition" onClick={() => scrollTo(id)}>
                        {id}
                      </button>
                    ))}
                  </div>

                  <div className="text-slate-400 text-xs">
                    © {new Date().getFullYear()} Undangan Pernikahan — Dibuat dengan ❤️
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* Inline styles for fonts (Tailwind config might already have Playfair class) */}
      <style jsx global>{`
        :root {
          --font-heading: 'Playfair Display', serif;
          --font-body: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
        }
        .font-playfair { font-family: var(--font-heading); }
        .font-inter { font-family: var(--font-body); }
        html { scroll-behavior: smooth; }
        /* reduced motion */
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </>
  );
}
