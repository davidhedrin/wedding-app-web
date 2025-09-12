"use client";

// filename: pages/invitation.tsx
import React, { JSX, useEffect, useRef, useState } from "react";
import Head from "next/head";
import useCountdown from "@/lib/countdown";
import { formatDate } from "@/lib/utils";

/**
 * Invitation Type: Birthday
 * Theme Name: "Celestial Party"
 * Create At: 12-09-2025
 * Create By: David
*/

// --------------------------- Configuration ---------------------------
const EVENT_DATE_ISO = new Date("2025-09-20T18:00:00");
const HERO_IMAGES = [
  "http://localhost:3005/assets/img/2149043983.jpg",
  "http://localhost:3005/assets/img/2149043983.jpg",
  "http://localhost:3005/assets/img/2149043983.jpg",
];

type RSVP = {
  name: string;
  guests: number;
  attending: "yes" | "no" | "maybe";
  message?: string;
};

// --------------------------- Utilities ---------------------------
function pad(n: number) {
  return n.toString().padStart(2, "0");
}

// --------------------------- Component ---------------------------
export default function InvitationPage(): JSX.Element {
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(EVENT_DATE_ISO.toString());

  // countdown state
  const [heroIndex, setHeroIndex] = useState(0);
  const [opened, setOpened] = useState(false); // whether "Buka Undangan" clicked
  const [rsvpState, setRsvpState] = useState<RSVP>({
    name: "",
    guests: 1,
    attending: "yes",
    message: "",
  });
  const [showToast, setShowToast] = useState<string | null>(null);

  // scroll reveal refs
  const revealRefs = useRef<Record<string, HTMLElement | null>>({});
  const sections = [
    { id: "hero", title: "Home" },
    { id: "welcome", title: "Welcome" },
    { id: "acara", title: "Acara" },
    { id: "galeri", title: "Galeri" },
    { id: "cerita", title: "Cerita" },
    { id: "rsvp", title: "RSVP" },
    { id: "hadiah", title: "Hadiah" },
    { id: "faq", title: "FAQ" },
  ];

  // hero carousel auto slide
  useEffect(() => {
    const t = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  // scroll reveal using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("revealed");
          }
        });
      },
      { threshold: 0.15 }
    );

    Object.values(revealRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // handle navigation smooth scroll
  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // RSVP handler (store in localStorage for demo)
  const submitRsvp = (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const existing = JSON.parse(localStorage.getItem("rsvps") || "[]");
      localStorage.setItem(
        "rsvps",
        JSON.stringify([...existing, { ...rsvpState, timestamp: new Date().toISOString() }])
      );
      setShowToast("Terima kasih! Konfirmasi Anda telah tersimpan.");
      setTimeout(() => setShowToast(null), 4000);
      // reset
      setRsvpState((s) => ({ ...s, name: "", guests: 1, message: "" }));
    } catch (err) {
      setShowToast("Gagal menyimpan. Silakan coba lagi.");
    }
  };

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // timeline data (example)
  const timeline = [
    { year: "2010", title: "Langkah kecil pertama", desc: "Kisah kecil yang manis..." },
    { year: "2015", title: "Petualangan remaja", desc: "Penuh warna dan tawa..." },
    { year: "2019", title: "Melejit", desc: "Mencapai impian-impian kecil..." },
    { year: "2024", title: "Menuju hari ini", desc: "Bersyukur dan terus bersemangat!" },
  ];

  return (
    <div className="relative min-h-screen font-sans text-gray-900">
      <Head>
        {/* Google Fonts: playful script + elegant sans */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Fixed background image + overlay */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url('http://localhost:3005/assets/img/2149043983.jpg')`,
        }}
      />
      <div className="fixed inset-0 -z-9 bg-gradient-to-b from-[rgb(191,219,254)] via-[rgba(147,196,253)] to-[rgba(134,239,172)] backdrop-blur-xl mix-blend-multiply" />

      {/* Sticky Header / Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/30 dark:bg-black/30 border-b border-white/10">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleNavClick("hero")}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-rose-400 shadow-lg flex items-center justify-center transform hover:scale-105 transition">
                <span className="font-bold text-white">BD</span>
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold" style={{ fontFamily: "'Great Vibes', cursive" }}>
                  Aurel & Keluarga
                </div>
                <div className="text-xs text-gray-700/80">Undangan Ulang Tahun</div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleNavClick(s.id)}
                  className="text-sm px-3 py-2 rounded-md hover:bg-white/40 transition font-medium text-gray-800/90"
                  aria-label={`Go to ${s.title}`}
                >
                  {s.title}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const el = document.getElementById("rsvp");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-300/90 hover:bg-amber-300 transition shadow"
              >
                Konfirmasi Kehadiran
              </button>

              {/* mobile menu (simple) */}
              <div className="md:hidden">
                <MobileMenu sections={sections} onNavClick={handleNavClick} />
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white/90 backdrop-blur rounded-full px-5 py-2 shadow-lg font-medium">
            {showToast}
          </div>
        </div>
      )}

      <main className="relative">
        {/* HERO */}
        <section
          id="hero"
          ref={(el) => {
            if (el) revealRefs.current["hero"] = el;
          }}
          className="min-h-screen flex items-center py-12 px-6 sm:px-10 lg:px-20"
        >
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left / Content */}
            <div className="col-span-7 md:col-span-7 lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-3 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                <span className="text-xs font-semibold">Undangan Digital</span>
                <span className="text-xs opacity-80">— Gratis & Interaktif</span>
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl leading-tight font-extrabold"
                style={{ fontFamily: "'Great Vibes', cursive", color: "rgb(20,20,20)" }}
              >
                Aurel's Birthday Bash
              </h1>

              <p className="text-gray-800/90 text-sm sm:text-base max-w-prose">
                Selamat datang! Kamu diundang untuk merayakan hari istimewa bersama keluarga & teman.
                Datang dan rayakan momen penuh tawa, kue, dan kenangan manis.
              </p>

              {/* Countdown card */}
              <div
                className={`
                  rounded-2xl p-6 w-full max-w-md shadow-xl transition 
                  ${!isToday && !isExpired ? "bg-blue-50 border border-blue-200" : ""}
                  ${isToday ? "bg-amber-50 border border-amber-200 animate-pulse" : ""}
                  ${isExpired ? "bg-gray-100 border border-gray-200" : ""}
                `}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className={`
                        text-xs uppercase tracking-wide font-semibold
                        ${!isToday && !isExpired ? "text-blue-600" : ""}
                        ${isToday ? "text-amber-600" : ""}
                        ${isExpired ? "text-gray-500" : ""}
                      `}
                    >
                      {!isToday && !isExpired ? "Menuju Hari H" : isToday ? "Hari Ini!" : "Sudah Lewat"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(EVENT_DATE_ISO, "long", "short")}
                    </div>
                  </div>

                  {/* Countdown / Icon */}
                  <div className="flex items-center gap-2">
                    {!isToday && !isExpired && (
                      <div className="flex gap-2 text-center">
                        <TimeBlock label="Hari" value={pad(days)} color="blue" />
                        <TimeBlock label="Jam" value={pad(hours)} color="blue" />
                        <TimeBlock label="Menit" value={pad(minutes)} color="blue" />
                        <TimeBlock label="Detik" value={pad(seconds)} color="blue" />
                      </div>
                    )}

                    {isToday && (
                      <div className="flex items-center text-3xl">🎉🎂✨</div>
                    )}

                    {isExpired && (
                      <div className="flex items-center text-2xl text-gray-400">💖</div>
                    )}
                  </div>
                </div>

                {/* Dynamic Message */}
                <div className="mt-4">
                  {!isToday && !isExpired && (
                    <div className="text-sm text-blue-700 font-medium">
                      Siapkan diri untuk pesta meriah 🎊
                    </div>
                  )}
                  {isToday && (
                    <div className="text-lg text-amber-700 font-bold animate-bounce">
                      Hari ini waktunya bersenang-senang 🎂🎶
                    </div>
                  )}
                  {isExpired && (
                    <div className="text-sm text-gray-600">
                      Terima kasih atas kebersamaan — acara telah selesai.
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setOpened(true);
                    const el = document.getElementById("welcome");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-full px-6 py-3 bg-gradient-to-r from-amber-400 to-rose-400 text-white font-semibold shadow-lg hover:scale-105 transform transition"
                >
                  Buka Undangan
                </button>

                <button
                  onClick={() => handleNavClick("acara")}
                  className="rounded-full px-4 py-2 border border-white/30 bg-white/5 text-sm hover:backdrop-brightness-110 transition"
                >
                  Lihat Detail Acara
                </button>
              </div>

              {/* small social / meta */}
              <div className="flex items-center gap-3 text-xs text-gray-700">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400 shadow" />
                  RSVP Recommended
                </span>
                <span>•</span>
                <span>Dress Code: Pastel / Smart Casual</span>
              </div>
            </div>

            {/* Right / Hero visual */}
            <div className="col-span-5 md:col-span-5 lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition">
                {/* carousel */}
                <div className="h-80 sm:h-96 md:h-[28rem] relative">
                  {HERO_IMAGES.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`hero-${idx}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === heroIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                        }`}
                    />
                  ))}

                  {/* ribbon */}
                  <div className="absolute left-4 top-4 bg-white/80 px-3 py-1 rounded-full text-xs font-semibold">
                    🎈 20 September 2025
                  </div>

                  {/* confetti floating decoration */}
                  <div className="absolute bottom-4 right-4">
                    <div className="px-3 py-2 rounded-xl bg-gradient-to-tr from-white/30 to-white/10 backdrop-blur-sm">
                      <div className="text-right">
                        <div className="text-xs font-semibold">Get ready</div>
                        <div className="text-sm">Party Starts Soon</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* overlay content - interactive */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Welcome */}
        <section
          id="welcome"
          ref={(el) => {
            if (el) revealRefs.current["welcome"] = el;
          }}
          className="py-12 px-6 sm:px-10 lg:px-20"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 flex items-center justify-center">
              <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-2xl transform hover:rotate-1 transition">
                <img src="http://localhost:3005/assets/img/2149043983.jpg" alt="birthday-person" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="md:col-span-7">
              <h2 className="text-3xl font-bold" style={{ fontFamily: "'Great Vibes', cursive" }}>
                Halo, Teman-teman!
              </h2>
              <p className="mt-3 text-gray-800/90 max-w-prose">
                Terima kasih sudah mampir ke undangan digital kami. Nama yang dirayakan: <strong>Aurel</strong>, usia <strong>24</strong> tahun.
                Acara ini akan dipenuhi musik, games, dan kenangan yang hangat — jadi harap hadir dengan hati yang riang!
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 max-w-sm">
                <div className="p-3 rounded-xl bg-white/60 backdrop-blur-sm shadow">
                  <div className="text-xs text-gray-600">Nama</div>
                  <div className="font-semibold">Aurel</div>
                </div>
                <div className="p-3 rounded-xl bg-white/60 backdrop-blur-sm shadow">
                  <div className="text-xs text-gray-600">Umur</div>
                  <div className="font-semibold">24</div>
                </div>
                <div className="p-3 rounded-xl bg-white/60 backdrop-blur-sm shadow">
                  <div className="text-xs text-gray-600">Hobi</div>
                  <div className="font-semibold">Fotografi • Musik</div>
                </div>
                <div className="p-3 rounded-xl bg-white/60 backdrop-blur-sm shadow">
                  <div className="text-xs text-gray-600">Mood</div>
                  <div className="font-semibold">Meriah & Hangat</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Acara */}
        <section
          id="acara"
          ref={(el) => {
            if (el) revealRefs.current["acara"] = el;
          }}
          className="py-12 px-6 sm:px-10 lg:px-20"
        >
          <div className="max-w-6xl mx-auto">
            {/* Title & Desc selalu di paling atas */}
            <div className="mb-8 text-center md:text-left">
              <h3 className="text-2xl font-bold">Detail Acara</h3>
              <p className="text-gray-700 max-w-prose">
                Berikut adalah informasi lengkap acara—catat tanggalnya ya!
              </p>
            </div>

            {/* Grid utama */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Konten kiri */}
              <div className="md:col-span-2 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InfoCard title="Tanggal" value="20 September 2025" icon="📅" />
                  <InfoCard title="Waktu" value="18:00 - Selesai" icon="🕒" />
                  <InfoCard title="Tempat" value="Cafe Harmoni, Jl. Kenangan No. 10" icon="📍" />
                  <InfoCard title="Dress Code" value="Pastel / Smart Casual" icon="👗" />
                </div>

                {/* Google Maps */}
                <div>
                  <div className="rounded-xl overflow-hidden border border-white/10 shadow">
                    <iframe
                      title="Lokasi Acara"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126915.123456789!2d106.736!3d-6.200!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMtCwMjAnMDAuMCJTIDEwNsKwNDMnMDUuMCJF!5e0!3m2!1sen!2sid!4v1600000000000!5m2!1sen!2sid"
                      width="100%"
                      height="360"
                      className="border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>

              {/* Aside kanan */}
              <aside className="md:col-span-1 space-y-5">
                <InfoCard title="Tema" value="Golden Pastel Party" icon="🎉" />
                <InfoCard title="Catatan" value="Mohon hadir 15 menit lebih awal" icon="✨" />
                <div className="p-4 rounded-2xl bg-white/70 shadow-xl">
                  <div className="text-xs text-gray-600">Poin Penting</div>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li>• Parkir terbatas — gunakan rideshare bila perlu.</li>
                    <li>• Tidak dipungut biaya masuk.</li>
                    <li>• Bawa semangat terbaikmu ✨</li>
                  </ul>

                  <div className="mt-4">
                    <button
                      onClick={() => handleNavClick("rsvp")}
                      className="w-full rounded-full px-4 py-2 bg-rose-400 text-white font-semibold shadow hover:scale-105 transition"
                    >
                      Konfirmasi Sekarang
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>


        {/* Galeri */}
        <section
          id="galeri"
          ref={(el) => {
            if (el) revealRefs.current["galeri"] = el;
          }}
          className="py-12 px-6 sm:px-10 lg:px-20"
        >
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold">Galeri Foto</h3>
            <p className="text-gray-700 mt-2">Momen-momen manis sepanjang perjalanan.</p>

            <Gallery images={[...HERO_IMAGES, ...HERO_IMAGES]} />
          </div>
        </section>

        {/* Cerita / Timeline */}
        <section
          id="cerita"
          ref={(el) => {
            if (el) revealRefs.current["cerita"] = el;
          }}
          className="py-12 px-6 sm:px-10 lg:px-20"
        >
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold">Cerita & Momen Spesial</h3>
            <p className="text-gray-700 mt-2">Kilasan perjalanan hidup yang berkesan.</p>

            <div className="mt-8 space-y-6">
              {timeline.map((t, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-16">
                    <div className="text-sm font-semibold">{t.year}</div>
                    <div className="h-1/3 w-px bg-gray-300 mt-2" />
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-white/60 shadow">
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-sm text-gray-700 mt-1">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RSVP */}
        <section
          id="rsvp"
          ref={(el) => {
            if (el) revealRefs.current["rsvp"] = el;
          }}
          className="py-12 px-6 sm:px-10 lg:px-20"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold">Konfirmasi Kehadiran (RSVP)</h3>
            <p className="text-gray-700 mt-2">Mohon konfirmasi kehadiran untuk memudahkan persiapan.</p>

            <form
              onSubmit={submitRsvp}
              className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/70 p-6 rounded-2xl shadow-lg"
            >
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Nama</label>
                <input
                  value={rsvpState.name}
                  onChange={(e) => setRsvpState((s) => ({ ...s, name: e.target.value }))}
                  className="mt-2 w-full px-4 py-3 rounded-lg border border-white/20 bg-transparent focus:ring-2 focus:ring-amber-200"
                  placeholder="Nama lengkap"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Jumlah Tamu</label>
                <input
                  type="number"
                  min={1}
                  value={rsvpState.guests}
                  onChange={(e) => setRsvpState((s) => ({ ...s, guests: Number(e.target.value) }))}
                  className="mt-2 w-full px-4 py-3 rounded-lg border border-white/20 bg-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Kehadiran</label>
                <select
                  value={rsvpState.attending}
                  onChange={(e) => setRsvpState((s) => ({ ...s, attending: e.target.value as RSVP["attending"] }))}
                  className="mt-2 w-full px-4 py-3 rounded-lg border border-white/20 bg-transparent"
                >
                  <option value="yes">Hadir</option>
                  <option value="no">Tidak Hadir</option>
                  <option value="maybe">Mungkin</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Pesan / Doa</label>
                <textarea
                  value={rsvpState.message}
                  onChange={(e) => setRsvpState((s) => ({ ...s, message: e.target.value }))}
                  className="mt-2 w-full px-4 py-3 rounded-lg border border-white/20 bg-transparent"
                  rows={4}
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="rounded-full px-6 py-3 bg-amber-300 font-semibold shadow hover:scale-105 transition"
                >
                  Kirim Konfirmasi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRsvpState({ name: "", guests: 1, attending: "yes", message: "" });
                    setShowToast("Form direset.");
                    setTimeout(() => setShowToast(null), 2500);
                  }}
                  className="rounded-full px-4 py-2 border border-white/20"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Hadiah */}
        <section
          id="hadiah"
          ref={(el) => {
            if (el) revealRefs.current["hadiah"] = el;
          }}
          className="py-12 px-6 sm:px-10 lg:px-20"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold">Hadiah</h3>
            <p className="text-gray-700 mt-2">Jika ingin memberikan hadiah, berikut informasi rekening & e-wallet.</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/70 shadow">
                <div className="text-xs text-gray-600">Bank</div>
                <div className="font-semibold">BCA</div>
                <div className="text-sm text-gray-700 mt-2">a.n. Aurel</div>
                <div className="text-sm text-gray-700">No. Rek: 123-456-7890</div>
                <div className="mt-3">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText("1234567890");
                      setShowToast("Nomor rekening disalin.");
                      setTimeout(() => setShowToast(null), 2200);
                    }}
                    className="rounded-full px-4 py-2 border"
                  >
                    Salin Nomor
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/70 shadow">
                <div className="text-xs text-gray-600">E-Wallet</div>
                <div className="font-semibold">OVO / GoPay / Dana</div>
                <div className="text-sm text-gray-700 mt-2">0812-3456-7890</div>
                <div className="mt-3">
                  <a
                    href="#"
                    className="rounded-full px-4 py-2 bg-rose-400 text-white font-semibold inline-block"
                  >
                    Kirim Hadiah Digital
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          ref={(el) => {
            if (el) revealRefs.current["faq"] = el;
          }}
          className="py-12 px-6 sm:px-10 lg:px-20"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold">FAQ</h3>
            <p className="text-gray-700 mt-2">Pertanyaan umum seputar acara.</p>

            <div className="mt-6 space-y-3">
              {[
                { q: "Apakah acara terbuka untuk umum?", a: "Acara bersifat undangan — mohon konfirmasi kehadiran melalui RSVP." },
                { q: "Bolehkah membawa tamu?", a: "Boleh — mohon cantumkan jumlah tamu di formulir RSVP." },
                { q: "Apakah tersedia makanan vegetarian?", a: "Ya, tersedia pilihan menu vegetarian. Harap informasikan via RSVP." },
              ].map((f, i) => (
                <div key={i} className="bg-white/60 rounded-xl shadow overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3"
                    aria-expanded={openFaqIndex === i}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{f.q}</div>
                      <div className="text-xs text-gray-600">Klik untuk melihat jawaban</div>
                    </div>
                    <div className={`transform transition ${openFaqIndex === i ? "rotate-180" : ""}`}>⌄</div>
                  </button>

                  <div
                    className={`px-4 pb-0 transition-all duration-300 ${openFaqIndex === i ? "max-h-96 pb-4" : "max-h-0 overflow-hidden"
                      }`}
                  >
                    <div className="text-sm text-gray-700">{f.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 sm:px-10 lg:px-20 pt-0 backdrop-blur-md bg-white/30 dark:bg-black/30">
          <div className="max-w-6xl mx-auto pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-lg font-semibold" style={{ fontFamily: "'Great Vibes', cursive" }}>
                Aurel's Party
              </div>
              <div className="text-sm text-gray-700 mt-2">Terima kasih telah menjadi bagian dari momen kami.</div>
            </div>
            <div className="text-sm text-gray-700">
              <div className="font-semibold">Menu</div>
              <div className="mt-3 flex gap-3 flex-wrap">
                {sections.map((s) => (
                  <button key={s.id} onClick={() => handleNavClick(s.id)} className="text-xs px-2 py-1 rounded hover:bg-white/10 transition">
                    {s.title}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold text-sm">Ikuti Kami</div>
              <div className="flex gap-3 mt-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">IG</a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">FB</a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">YT</a>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mt-6 text-center text-xs text-gray-600">© {new Date().getFullYear()} — Terima kasih atas kehadirannya.</div>
        </footer>
      </main>

      {/* optional modal or micro-interaction when opened */}
      <div
        aria-hidden={!opened}
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${opened ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setOpened(false)} />

        <div className="relative z-10 p-6 w-[min(95%,720px)] rounded-2xl bg-white/90 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-semibold" style={{ fontFamily: "'Great Vibes', cursive" }}>
                Selamat Datang!
              </div>
              <div className="text-sm text-gray-700">Klik di mana saja untuk menutup.</div>
            </div>
            <button onClick={() => setOpened(false)} className="text-gray-700">✕</button>
          </div>

          <div className="mt-4 text-gray-800">
            <p>Terima kasih sudah datang ke undangan digital ini. Kami menantikan kehadiranmu — jangan lupa konfirmasi!</p>
          </div>
        </div>
      </div>

      {/* Inline styles / keyframes */}
      <style jsx global>{`
        /* smooth scroll via CSS fallback */
        html {
          scroll-behavior: smooth;
        }

        /* reveal animation */
        [id] .revealed,
        .revealed {
          opacity: 1 !important;
          transform: translateY(0) scale(1) !important;
        }

        section {
          opacity: 0;
          transform: translateY(18px) scale(0.995);
          transition: all 700ms cubic-bezier(.2,.9,.2,1);
        }

        section.revealed {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* timeblock */
        .time-block > div {
          font-weight: 700;
        }

        /* mobile menu helper */
        @media (max-width: 767px) {
          header nav > div > div { gap: 10px; }
        }
      `}</style>
    </div>
  );
}

// --------------------------- Helper Components ---------------------------

function MobileMenu({ sections, onNavClick }: { sections: { id: string; title: string }[]; onNavClick: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((s) => !s)} className="p-2 rounded-md border">
        ☰
      </button>

      <div
        className={`absolute right-0 mt-2 w-48 rounded-lg overflow-hidden shadow-lg transition transform ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
          }`}
      >
        <div className="bg-white/90 p-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onNavClick(s.id);
                setOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded hover:bg-white/30"
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const TimeBlock = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div className={`flex flex-col px-2 py-1 rounded-lg shadow 
    ${color === "blue" ? "bg-blue-100 text-blue-700" : ""}`}>
    <span className="text-lg font-bold">{value}</span>
    <span className="text-xs">{label}</span>
  </div>
);

function InfoCard({ title, value, icon }: { title: string; value: string; icon?: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/70 shadow flex items-start gap-3">
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="text-xs text-gray-600">{title}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}

function Gallery({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="mt-6">
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <img src={images[idx]} alt={`gallery-${idx}`} className="w-full h-80 object-cover transition-transform duration-700 transform hover:scale-105" />
        <div className="absolute left-4 bottom-4 flex gap-2">
          <button onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)} className="px-3 py-2 rounded-full bg-white/70">‹</button>
          <button onClick={() => setIdx((i) => (i + 1) % images.length)} className="px-3 py-2 rounded-full bg-white/70">›</button>
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-20 h-14 rounded-lg overflow-hidden border ${i === idx ? "ring-2 ring-amber-300" : "border-white/10"}`}
          >
            <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
