"use client";

import useCountdown from "@/lib/countdown";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Invitation Type: Wedding
 * Theme Name: "Serenade Amora"
 * Create At: 08-09-2025
 * Create By: David
*/

const WEDDING_DATE = new Date();
WEDDING_DATE.setDate(WEDDING_DATE.getDate() + 12);

const PLACEHOLDER_IMG = "http://localhost:3005/assets/img/2149043983.jpg";
const HERO_IMAGES = [PLACEHOLDER_IMG, PLACEHOLDER_IMG, PLACEHOLDER_IMG]; // bisa ganti beragam foto
const MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.821823820262!2d106.827153!3d-6.162959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5c5b6c8d3d7%3A0xf1e2b1d3c2a4!2sMonas%20-%20Jakarta!5e0!3m2!1sen!2sid!4v1680000000000!5m2!1sen!2sid";

/** Utility: format angka 2 digit */
const pad2 = (n: number) => n.toString().padStart(2, "0");

/** Smooth scroll helper */
const smoothScrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/** Hook sederhana untuk scroll-spy (aktifkan link nav sesuai section terlihat) */
function useScrollSpy(ids: string[], offset = 120) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const handler = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - offset <= 0) current = id;
      }
      setActive(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [ids, offset]);
  return active;
}

/** Badge kecil */
const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-white/60 backdrop-blur border border-white/70 shadow-sm">
    {children}
  </span>
);

/** Divider elegan */
const Flourish: React.FC = () => (
  <div className="mx-auto my-10 flex items-center gap-4 w-full max-w-3xl">
    <span className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-300 to-transparent" />
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8 opacity-60"
      aria-hidden="true"
    >
      <path
        d="M12 2c-2 5-4 7-10 10 6 3 8 5 10 10 2-5 4-7 10-10C16 9 14 7 12 2Z"
        fill="currentColor"
      />
    </svg>
    <span className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-300 to-transparent" />
  </div>
);

/** Tombol utama */
const PrimaryButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className = "", ...props }) => (
  <button
    {...props}
    className={
      "px-5 py-3 rounded-full font-medium shadow hover:shadow-lg transition-all border border-neutral-200 bg-white/80 backdrop-blur hover:bg-white " +
      className
    }
  />
);

/** NAV ITEMS */
const NAV = [
  { id: "mempelai", label: "Mempelai" },
  { id: "acara", label: "Acara" },
  { id: "galeri", label: "Galeri" },
  { id: "cerita", label: "Cerita" },
  { id: "rsvp", label: "RSVP" },
  { id: "hadiah", label: "Hadiah" },
  { id: "faq", label: "FAQ" },
] as const;

function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isLocked])
};

/** PAGE COMPONENT */
const WeddingInvitationPage: React.FC = () => {
  const [opened, setOpened] = useState(false)
  useLockBodyScroll(!opened)

  const { days, hours, minutes, seconds, isExpired } = useCountdown(WEDDING_DATE);
  const active = useScrollSpy(NAV.map((n) => n.id));
  const [menuOpen, setMenuOpen] = useState(false);

  /** HERO background carousel autoplay */
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const i = setInterval(
      () => setHeroIdx((s) => (s + 1) % HERO_IMAGES.length),
      4500
    );
    return () => clearInterval(i);
  }, []);

  /** Close mobile menu on navigation */
  const onNavigate = (id: string) => {
    smoothScrollTo(id);
    setMenuOpen(false);
  };

  /** RSVP dummy handler */
  const rsvpFormRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const onSubmitRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    rsvpFormRef.current?.reset();
    setTimeout(() => setSubmitted(false), 4000);
  };

  /** FAQ data */
  const faqs = useMemo(
    () => [
      {
        q: "Apakah boleh membawa pendamping/anak?",
        a: "Dengan senang hati! Mohon tuliskan di kolom catatan pada formulir RSVP agar kami dapat menyiapkan tempat terbaik.",
      },
      {
        q: "Apakah ada dress code?",
        a: "Smart casual dengan sentuhan warna netral atau pastel. Silakan sesuaikan agar tetap nyaman.",
      },
      {
        q: "Apakah tersedia parkir?",
        a: "Tersedia area parkir di lokasi utama dan area overflow di gedung seberang (tersedia shuttle).",
      },
      {
        q: "Bila berhalangan hadir, apakah perlu konfirmasi?",
        a: "Kami akan sangat terbantu jika tetap melakukan RSVP dan memilih opsi 'Berhalangan'. Terima kasih!",
      },
    ],
    []
  );
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="scroll-smooth bg-[radial-gradient(1250px_circle_at_10%_10%,#ffffff,rgba(244,244,245,0.8))] text-neutral-800 antialiased">
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
              <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/20 to-white/40 backdrop-blur-sm" />
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10 space-y-4"
            >
              <p className="tracking-widest uppercase text-sm mb-4 text-white">Wedding Invitation</p>
              <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight text-white drop-shadow">
                Aurel & Bagas
              </h1>
              <p className="mt-4 text-lg text-white">Sabtu, 10 Desember 2019</p>
              <p className="mt-2 italic text-white">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="font-semibold text-xl mt-1 text-white">Nama Tamu</p>

              <PrimaryButton onClick={() => setOpened(true)}>
                Buka Undangan
              </PrimaryButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Sticky Header ===== */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl">
          <div className="m-3 rounded-full border bg-white/70 backdrop-blur shadow-sm">
            <div className="flex items-center justify-between px-5 py-3">
              <div
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => smoothScrollTo("hero")}
                aria-label="Kembali ke atas"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-neutral-200">
                  {/* Mini avatar logo */}
                  <img
                    src={PLACEHOLDER_IMG}
                    alt="Logo pasangan"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="leading-tight">
                  <div className="font-semibold tracking-wide">
                    A & B Wedding
                  </div>
                  <div className="text-xs opacity-70">
                    {WEDDING_DATE.toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-1">
                {NAV.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-white hover:shadow ${active === item.id
                      ? "bg-white shadow border border-neutral-200"
                      : "border border-transparent"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border bg-white/70"
                aria-label="Toggle menu"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Nav Drawer */}
            {menuOpen && (
              <div className="md:hidden px-3 pb-3">
                <div className="grid grid-cols-2 gap-2">
                  {NAV.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all hover:bg-white hover:shadow ${active === item.id
                        ? "bg-white shadow border border-neutral-200"
                        : "border border-neutral-200/40"
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section
        id="hero"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background carousel */}
        <div className="absolute inset-0">
          {HERO_IMAGES.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Hero ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1200 ${heroIdx === i ? "opacity-100" : "opacity-0"
                }`}
            />
          ))}
          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/20 to-white/40" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6">
          <Pill>Undangan Pernikahan</Pill>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight text-white drop-shadow">
            Aurel & Bagas
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-white/90">
            Dengan memohon rahmat dan ridho Allah SWT, kami mengundang
            Bapak/Ibu/Saudara/i untuk hadir dan memberi doa terbaik.
          </p>

          {/* Countdown */}
          <div className="mt-8 flex justify-center">
            <div className="grid grid-cols-4 gap-3 sm:gap-5">
              {[
                { label: "Hari", value: days },
                { label: "Jam", value: hours },
                { label: "Menit", value: minutes },
                { label: "Detik", value: seconds },
              ].map((c, i) => (
                <div
                  key={i}
                  className="backdrop-blur bg-white/70 border border-white/80 rounded-2xl px-4 py-3 sm:px-6 sm:py-4 shadow"
                >
                  <div className="text-2xl sm:text-3xl font-semibold font-mono">
                    {pad2(c.value)}
                  </div>
                  <div className="text-xs sm:text-sm opacity-70">{c.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <PrimaryButton onClick={() => smoothScrollTo("rsvp")}>
              Konfirmasi Kehadiran
            </PrimaryButton>
            <button
              onClick={() => smoothScrollTo("acara")}
              className="px-5 py-3 rounded-full font-medium border border-white/70 text-white/95 hover:bg-white/10 hover:backdrop-blur transition"
            >
              Lihat Detail Acara
            </button>
          </div>

          {/* Indicator slides */}
          <div className="mt-8 flex justify-center gap-2">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                aria-label={`Hero slide ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all ${heroIdx === i ? "w-6 bg-white" : "bg-white/60"
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== MEMPELAI ===== */}
      <section id="mempelai" className="relative py-20 md:py-24">
        <div className="absolute inset-x-0 top-0 -mt-20 h-20 bg-linear-to-b from-white/40 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <Pill>Mempelai</Pill>
            <h2 className="mt-5 text-3xl md:text-4xl font-serif">
              Dengan penuh sukacita
            </h2>
            <p className="mt-3 text-neutral-600">
              Kami, dua insan yang dipertemukan pada waktu terbaik, memohon doa
              restu agar pernikahan ini menjadi awal kisah yang penuh berkah.
            </p>
          </div>

          <Flourish />

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Pengantin Wanita */}
            <div className="group">
              <div className="relative overflow-hidden rounded-3xl shadow ring-1 ring-neutral-200">
                <img
                  src={PLACEHOLDER_IMG}
                  alt="Mempelai wanita"
                  className="w-full h-72 md:h-105 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5">
                <h3 className="text-2xl font-serif">Aurel Rahma</h3>
                <p className="text-neutral-500 text-sm">
                  Putri dari Bpk. Rahmat & Ibu Sari
                </p>
                <p className="mt-3 text-neutral-700">
                  Sosok hangat yang selalu percaya bahwa setiap hal indah lahir
                  dari ketulusan.
                </p>
              </div>
            </div>

            {/* Pengantin Pria */}
            <div className="group">
              <div className="relative overflow-hidden rounded-3xl shadow ring-1 ring-neutral-200">
                <img
                  src={PLACEHOLDER_IMG}
                  alt="Mempelai pria"
                  className="w-full h-72 md:h-105 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5">
                <h3 className="text-2xl font-serif">Bagas Pratama</h3>
                <p className="text-neutral-500 text-sm">
                  Putra dari Bpk. Budi & Ibu Ratih
                </p>
                <p className="mt-3 text-neutral-700">
                  Sahabat terbaik yang selalu menjaga, mendengar, dan
                  memperjuangkan dengan sepenuh hati.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center text-neutral-700">
            <p>
              &ldquo;Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i
              berkenan hadir untuk memberikan doa restu.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ===== ACARA ===== */}
      <section id="acara" className="py-20 md:py-24 bg-white/70">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <Pill>Detail Acara</Pill>
            <h2 className="mt-5 text-3xl md:text-4xl font-serif">
              Waktu & Tempat
            </h2>
          </div>

          <div className="mt-10 grid lg:grid-cols-2 gap-8">
            {/* Info Cards */}
            <div className="space-y-5">
              {/* Akad */}
              <div className="rounded-2xl border bg-white/80 backdrop-blur p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Akad Nikah</h3>
                  <Pill>
                    {WEDDING_DATE.toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </Pill>
                </div>
                <p className="mt-2 text-neutral-600">
                  Pukul 10.00 WIB - 11.00 WIB
                </p>
                <p className="mt-1 text-neutral-700">
                  Aula Harmoni, Jl. Merpati No. 1, Jakarta
                </p>
              </div>

              {/* Resepsi */}
              <div className="rounded-2xl border bg-white/80 backdrop-blur p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold">Resepsi</h3>
                <p className="mt-2 text-neutral-600">Pukul 12.00 – 15.00 WIB</p>
                <p className="mt-1 text-neutral-700">
                  Aula Harmoni, Jl. Merpati No. 1, Jakarta
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill>Dress Code: Pastel / Netral</Pill>
                  <Pill>Buku Tamu & Photo Booth</Pill>
                  <Pill>Area Parkir Luas</Pill>
                </div>
              </div>

              {/* Tambahan */}
              <div className="rounded-2xl border bg-white/80 backdrop-blur p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-semibold">Informasi Tambahan</h3>
                <ul className="mt-3 space-y-2 list-disc list-inside text-neutral-700">
                  <li>Mohon hadir 15 menit sebelum acara dimulai.</li>
                  <li>Silakan konfirmasi kehadiran melalui formulir RSVP.</li>
                  <li>
                    Bagi yang berhalangan, dapat menyampaikan ucapan melalui
                    RSVP atau tombol Hadiah.
                  </li>
                </ul>
              </div>
            </div>

            {/* Maps */}
            <div className="rounded-3xl overflow-hidden border shadow-sm">
              <iframe
                src={MAPS_EMBED_SRC}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALERI ===== */}
      <section id="galeri" className="py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <Pill>Galeri</Pill>
            <h2 className="mt-5 text-3xl md:text-4xl font-serif">
              Jejak Potret Bahagia
            </h2>
          </div>

          {/* Carousel */}
          <GalleryCarousel images={Array.from({ length: 8 }, () => PLACEHOLDER_IMG)} />
        </div>
      </section>

      {/* ===== CERITA (Timeline) ===== */}
      <section id="cerita" className="py-20 md:py-24 bg-white/70">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <Pill>Kisah Kami</Pill>
            <h2 className="mt-5 text-3xl md:text-4xl font-serif">
              Perjalanan Cinta
            </h2>
          </div>

          <div className="mt-12 relative">
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-linear-to-b from-neutral-300 via-neutral-300/50 to-transparent" />
            <ol className="space-y-10">
              {[
                {
                  t: "2019",
                  title: "Pertama Bertemu",
                  d: "Dipertemukan di sebuah acara kampus, perbincangan singkat menjadi awal yang hangat.",
                },
                {
                  t: "2020",
                  title: "Menjalin Komitmen",
                  d: "Semakin mengenal, semakin yakin. Kami memutuskan berjalan bersama.",
                },
                {
                  t: "2023",
                  title: "Lamaran",
                  d: "Dengan restu kedua keluarga, lamaran berlangsung haru dan bahagia.",
                },
                {
                  t: "2025",
                  title: "Pernikahan",
                  d: "Kami mantapkan langkah menuju babak baru kehidupan.",
                },
              ].map((item, i) => (
                <li key={i} className="relative">
                  <div
                    className={`md:grid md:grid-cols-2 md:gap-10 items-start ${i % 2 === 0 ? "" : "md:direction-rtl"
                      }`}
                  >
                    <div
                      className={`md:col-span-1 ${i % 2 === 0 ? "" : "md:order-2"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow">
                          {item.t}
                        </span>
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                      </div>
                      <p className="mt-3 text-neutral-700">{item.d}</p>
                    </div>
                    <div
                      className={`md:col-span-1 mt-4 md:mt-0 ${i % 2 === 0 ? "" : "md:order-1"
                        }`}
                    >
                      <div className="rounded-2xl overflow-hidden ring-1 ring-neutral-200 shadow-sm">
                        <img
                          src={PLACEHOLDER_IMG}
                          alt={item.title}
                          className="w-full h-56 md:h-64 object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Dot on line */}
                  <span className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-2 w-3 h-3 rounded-full bg-neutral-700 ring-4 ring-white" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ===== RSVP ===== */}
      <section id="rsvp" className="py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <Pill>RSVP</Pill>
            <h2 className="mt-5 text-3xl md:text-4xl font-serif">
              Konfirmasi Kehadiran
            </h2>
            <p className="mt-3 text-neutral-600">
              Mohon isi formulir berikut untuk membantu kami menyiapkan
              kehadiran Anda.
            </p>
          </div>

          <form
            ref={rsvpFormRef}
            onSubmit={onSubmitRSVP}
            className="mt-8 rounded-3xl border bg-white/80 backdrop-blur p-6 md:p-8 shadow-sm space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium">Nama Lengkap</label>
                <input
                  required
                  type="text"
                  placeholder="Nama Anda"
                  className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  required
                  type="email"
                  placeholder="email@contoh.com"
                  className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nomor WhatsApp</label>
                <input
                  required
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Jumlah Tamu</label>
                <input
                  required
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Kehadiran</label>
                <div className="mt-2 flex gap-3">
                  {["Hadir", "Berhalangan"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 rounded-xl border px-4 py-3 cursor-pointer hover:shadow-sm"
                    >
                      <input type="radio" name="status" value={opt} required />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Catatan</label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan pesan atau kebutuhan khusus (opsional)"
                  className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-neutral-500">
                Data Anda aman. Kami hanya menggunakannya untuk keperluan
                kehadiran.
              </div>
              <PrimaryButton type="submit">Kirim RSVP</PrimaryButton>
            </div>

            {submitted && (
              <div className="rounded-xl border bg-green-50 text-green-700 px-4 py-3 text-sm">
                Terima kasih! RSVP Anda sudah kami terima.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ===== HADIAH ===== */}
      <section id="hadiah" className="py-20 md:py-24 bg-white/70">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <Pill>Hadiah</Pill>
            <h2 className="mt-5 text-3xl md:text-4xl font-serif">
              Tanda Kasih
            </h2>
            <p className="mt-3 text-neutral-600">
              Doa restu adalah hadiah terindah. Jika berkenan berbagi hadiah,
              silakan gunakan informasi berikut.
            </p>
          </div>

          {/* ================= TRANSFER ================= */}
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border bg-white/80 p-4 shadow-sm hover:shadow-md transition">
              <div className="text-sm text-neutral-500">BCA</div>

              <div className="mt-1 space-y-1 text-neutral-700">
                <div className="font-medium text-lg">1234567890</div>
                <div className="text-sm">a.n. Aurel Rahma</div>
              </div>

              <div className="mt-2">
                <CopyButton text="BCA 1234567890 a.n. Aurel Rahma" />
              </div>
            </div>

            <div className="rounded-2xl border bg-white/80 p-4 shadow-sm hover:shadow-md transition">
              <div className="text-sm text-neutral-500">GoPay / OVO</div>

              <div className="mt-1 text-neutral-700">
                <div className="font-medium text-lg">0812-3456-7890</div>
                <div className="text-sm">a.n. Aurel Rahma</div>
              </div>

              <div className="mt-2">
                <CopyButton text="081234567890 a.n. Aurel Rahma" />
              </div>
            </div>
          </div>

          {/* ================= WISHLIST ================= */}
          <div className="mt-12 rounded-2xl border bg-white/80 p-6 shadow-sm">
            <h3 className="font-semibold text-lg">Wishlist Hadiah</h3>

            {/* ================= ALAMAT ================= */}
            <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Alamat Pengiriman
              </p>
              <p className="mt-1 text-sm text-neutral-700 leading-relaxed">
                Aurel Rahma Jl. Melati No. 10 Bandung, 40123 Indonesia
              </p>

              <div className="mt-3">
                <CopyButton
                  text="Aurel Rahma, Jl. Melati No. 10, Bandung, 40123, Indonesia"
                />
              </div>
            </div>

            <p className="mt-3 text-sm text-neutral-600">
              Berikut beberapa referensi hadiah yang mungkin bermanfaat bagi kami.
              Tidak ada kewajiban — kehadiran Anda tetap yang utama.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "Set Peralatan Makan", price: "Rp 1.500.000", qty: 1 },
                { name: "Sprei Premium King Size", price: "Rp 2.200.000", qty: 1 },
                { name: "Lampu Meja Minimalis", price: "Rp 850.000", qty: 1 },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-neutral-200 bg-white p-4 flex flex-col justify-between hover:shadow-sm transition"
                >
                  <div>
                    <p className="font-medium text-neutral-800">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      Estimasi harga: {item.price}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      Jumlah: {item.qty}
                    </p>
                  </div>

                  <a
                    href="#"
                    className="mt-2 inline-flex justify-center rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition"
                  >
                    Lihat Referensi
                  </a>
                </div>
              ))}
            </div>

            {/* ================= PAGINATION (UI ONLY) ================= */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <button className="h-8 w-8 rounded-full bg-neutral-900 text-xs font-semibold text-white">
                  1
                </button>
                <button className="h-8 w-8 rounded-full border border-neutral-300 text-xs text-neutral-600">
                  2
                </button>
                <button className="h-8 w-8 rounded-full border border-neutral-300 text-xs text-neutral-600">
                  3
                </button>
              </div>

              <div className="flex gap-3">
                <button className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition">
                  Prev
                </button>
                <button className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <Pill>FAQ</Pill>
            <h2 className="mt-5 text-3xl md:text-4xl font-serif">
              Pertanyaan Umum
            </h2>
          </div>

          <div className="mt-8 divide-y rounded-2xl border bg-white/80 backdrop-blur shadow-sm">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className="p-5">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between text-left"
                    aria-expanded={open}
                  >
                    <span className="font-medium">{f.q}</span>
                    <span
                      className={`transition-transform ${open ? "rotate-45" : ""
                        }`}
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path
                          d="M12 4v16M4 12h16"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-3 text-neutral-700">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center text-sm text-neutral-500">
            Dibuat dengan ❤️ — {new Date().getFullYear()}
          </div>
        </div>
      </section>
    </main>
  );
};

export default WeddingInvitationPage;

/* ========= SUB COMPONENTS ========= */

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          alert("Tidak dapat menyalin. Salin manual: " + text);
        }
      }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-white/80 hover:bg-white transition shadow-sm text-sm"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path
          d="M8 8h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Zm0-4h8a2 2 0 0 1 2 2"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      {copied ? "Disalin!" : "Salin"}
    </button>
  );
};

const GalleryCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const slideTo = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const max = images.length - 1;
    const clamped = Math.max(0, Math.min(i, max));
    setIndex(clamped);
    const child = el.children[clamped] as HTMLElement;
    if (child) el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  };

  useEffect(() => {
    const t = setInterval(() => slideTo((index + 1) % images.length), 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length]);

  return (
    <div className="mt-8">
      <div className="relative">
        {/* Slides */}
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-p-4 [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ scrollbarWidth: "none" }}
        >
          {/* hide scrollbar chrome */}
          <style>{`.hide-scroll::-webkit-scrollbar{display:none}`}</style>
          {images.map((src, i) => (
            <div
              key={i}
              className="min-w-[80%] sm:min-w-[60%] md:min-w-[48%] lg:min-w-[40%] snap-start"
            >
              <div className="group relative rounded-3xl overflow-hidden ring-1 ring-neutral-200 shadow-sm">
                <img
                  src={src}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            aria-label="Sebelumnya"
            className="px-3 py-2 rounded-full border bg-white/80 hover:bg-white shadow-sm"
            onClick={() => slideTo(index - 1)}
          >
            ◀
          </button>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => slideTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all ${index === i ? "w-6 bg-neutral-800" : "bg-neutral-400/60"
                }`}
            />
          ))}
          <button
            aria-label="Berikutnya"
            className="px-3 py-2 rounded-full border bg-white/80 hover:bg-white shadow-sm"
            onClick={() => slideTo(index + 1)}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};
