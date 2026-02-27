"use client";
import React, { useEffect, useRef, useState } from "react";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import useCountdown from "@/lib/countdown";
import { AnimatePresence, motion } from 'framer-motion';

import bgImage from './bg.jpg';
import { formatDate } from "@/lib/utils";

/**
 * Invitation Type: Wedding
 * Theme Name: "Violetta Story"
 * Create At: 09-09-2025
 * Create By: David
*/

// === FONTS (Elegan & Modern) ===
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// === KONFIGURASI DASAR UNDANGAN ===
const WEDDING_DATE = new Date();
WEDDING_DATE.setDate(WEDDING_DATE.getDate() + 12);

const THEME = {
  primary: "from-purple-900 via-fuchsia-900 to-purple-800",
  primarySoft: "bg-purple-900/60",
  accent: "text-amber-300",
  btn:
    "bg-fuchsia-600 hover:bg-fuchsia-500 focus-visible:outline-fuchsia-300 text-white",
  chip: "bg-white/10 border-white/20",
  glass: "bg-white/10 backdrop-blur-md",
};

const IMAGES = Array.from({ length: 8 }).map(
  () => "http://localhost:3005/assets/img/2149043983.jpg"
);

type RSVPForm = {
  name: string;
  phone: string;
  attendance: "Hadir" | "Tidak Hadir" | "Belum Pasti";
  guests: number;
  message: string;
};

// === KOMPONEN KECIL ===
const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <div className="text-center mb-10">
    <h2
      className={`text-3xl md:text-4xl tracking-wide ${playfair.className} text-white`}
    >
      {title}
    </h2>
    {subtitle && (
      <p className={`mt-2 text-white/70 ${inter.className}`}>{subtitle}</p>
    )}
    <div className="mt-6 flex justify-center">
      <span className="h-0.5 w-24 bg-linear-to-r from-white/0 via-white/60 to-white/0" />
    </div>
  </div>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-wider text-white/90 ${THEME.chip}`}
  >
    {children}
  </span>
);

function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isLocked])
};

// === HALAMAN ===
export default function WeddingInvitationPage() {
  const [opened, setOpened] = useState(false)
  useLockBodyScroll(!opened)

  // Smooth fade-in saat scroll
  const revealRef = useRef<Record<string, Element | null>>({});
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
          }
        }),
      { threshold: 0.15 }
    );
    Object.values(revealRef.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Countdown
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(WEDDING_DATE);

  const goToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Galeri slider
  const [galIdx, setGalIdx] = useState(0);
  const galNext = () => setGalIdx((i) => (i + 1) % IMAGES.length);
  const galPrev = () => setGalIdx((i) => (i - 1 + IMAGES.length) % IMAGES.length);

  // RSVP
  const [form, setForm] = useState<RSVPForm>({
    name: "",
    phone: "",
    attendance: "Hadir",
    guests: 1,
    message: "",
  });
  const [sent, setSent] = useState(false);
  const submitRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrasikan ke API/Sheet/Email sesuai kebutuhan
    console.log("RSVP:", form);
    setSent(true);
  };

  // FAQ
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  // Nav shrink saat scroll
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Daftar nav
  const nav = [
    { id: "mempelai", label: "Mempelai" },
    { id: "acara", label: "Acara" },
    { id: "galeri", label: "Galeri" },
    { id: "cerita", label: "Cerita" },
    { id: "rsvp", label: "RSVP" },
    { id: "hadiah", label: "Hadiah" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <main
      className={`min-h-screen text-white relative ${playfair.variable} ${cormorant.variable} ${inter.variable}`}
    >
      {/* BACKGROUND GRADIENT */}
      <div
        aria-hidden
        className={`fixed inset-0 -z-30 bg-linear-to-b ${THEME.primary}`}
      />

      {/* BACKGROUND HERO CAROUSEL (blur + parallax-ish) */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <img
          src={bgImage.src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover opacity-45`}
          style={{ transform: "scale(1.05)" }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* GLOBAL smooth scroll fallback */}
      <style jsx global>{`
        html,
        body {
          scroll-behavior: smooth;
          background: transparent;
        }
        .reveal {
          opacity: 0;
          transform: translateY(24px) scale(0.98);
          transition: all 600ms ease;
        }
        .reveal.in-view {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .card {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
        }
        .btn {
          border-radius: 9999px;
          padding: 0.75rem 1.25rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: transform 200ms ease, filter 200ms ease;
        }
        .btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }
        .btn:active {
          transform: translateY(0);
        }
        .nav-blur {
          backdrop-filter: blur(10px);
          background: rgba(20, 0, 30, 0.45);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .chip {
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
        }
      `}</style>

      <AnimatePresence>
        {!opened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-98 flex items-center justify-center text-center px-6"
          >
            <div className="absolute inset-0">
              <img
                src={bgImage.src}
                alt="cover"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-b from-purple-900/30 via-fuchsia-900/50 to-purple-800/80 backdrop-blur-sm" />
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10 space-y-4"
            >
              <p className="tracking-widest uppercase text-sm mb-4 text-white">Wedding Invitation</p>
              <h1
                className={`mt-4 text-4xl sm:text-5xl lg:text-6xl leading-tight ${playfair.className}`}
              >
                <span className={THEME.accent}>Aisyah</span> &{" "}
                <span className={THEME.accent}>Zidan</span>
              </h1>
              <p className="mt-4 text-lg"><strong className={THEME.accent}>Tanggal:</strong> {formatDate(WEDDING_DATE, "long")}</p>
              <p className="mt-2 italic text-white">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="font-semibold text-xl mt-1 text-white">Nama Tamu</p>

              <button
                onClick={() => setOpened(true)}
                className={`btn ${THEME.btn}`}
              >
                Buka Undangan
                <span className="inline-block translate-x-0 group-hover:translate-x-0.5 transition">↗</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVIGATION */}
      <header
        className={`sticky top-0 z-40 transition-all ${scrolled ? "nav-blur" : "bg-transparent"
          }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <button
              className={`text-lg md:text-xl ${playfair.className} font-semibold tracking-wide`}
              onClick={() => goToSection("hero")}
              aria-label="Kembali ke atas"
            >
              <span className={`${THEME.accent}`}>A&Z</span> Wedding
            </button>

            <nav className="hidden md:flex items-center gap-1">
              {nav.map((n) => (
                <button
                  key={n.id}
                  onClick={() => goToSection(n.id)}
                  className={`px-3 py-2 rounded-full text-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/40 transition`}
                >
                  {n.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToSection("rsvp")}
                className={`btn ${THEME.btn} hidden md:inline-flex`}
              >
                Konfirmasi Hadir
              </button>
              <button
                className="md:hidden rounded-full p-2 hover:bg-white/10"
                aria-label="Menu"
                onClick={() => {
                  const m = document.getElementById("mobile-menu");
                  m?.classList.toggle("hidden");
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="#fff" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div id="mobile-menu" className="md:hidden hidden pt-3">
            <div className="flex flex-col gap-2">
              {nav.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    goToSection(n.id);
                    document.getElementById("mobile-menu")?.classList.add("hidden");
                  }}
                  className="text-left px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="relative">
        <div className="mx-auto max-w-7xl px-4 py-16 md:pb-28 md:pt-16">
          <div className="grid md:grid-cols-2 items-center gap-10">
            <div className="reveal" ref={(el) => {
              if (el) (revealRef.current["hero1"] = el)
            }}>
              <Pill>Undangan Pernikahan</Pill>
              <h1
                className={`mt-4 text-4xl sm:text-5xl lg:text-6xl leading-tight ${playfair.className}`}
              >
                <span className={THEME.accent}>Aisyah</span> &{" "}
                <span className={THEME.accent}>Zidan</span>
              </h1>
              <p className={`mt-4 text-white/80 ${cormorant.className} text-lg`}>
                Dengan memohon rahmat Tuhan Yang Maha Esa, kami bermaksud
                menyelenggarakan pernikahan putra-putri kami. Merupakan kehormatan
                bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.
              </p>

              {/* COUNTDOWN */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className={`chip px-3 py-2 rounded-full ${THEME.chip}`}>
                  {WEDDING_DATE.toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  WIB
                </span>
              </div>

              <div className="mt-6 card rounded-2xl p-5">
                {/* Kondisi Countdown */}
                {isExpired ? (
                  <div className="text-center">
                    <p className="text-sm uppercase tracking-widest text-white/70">
                      Terima kasih atas doa & kehadirannya
                    </p>
                    <h3 className={`mt-2 text-2xl ${playfair.className}`}>
                      Acara telah terlaksana
                    </h3>
                    <p className="text-white/80 mt-1">
                      Berlalu {days} hari yang lalu
                    </p>
                  </div>
                ) : isToday ? (
                  <div className="text-center">
                    <p className="text-sm uppercase tracking-widest text-amber-300">
                      Hari H!
                    </p>
                    <h3 className={`mt-2 text-2xl ${playfair.className}`}>
                      Acara sedang berlangsung hari ini
                    </h3>
                    <p className="text-white/80 mt-1">
                      Sisa waktu hari ini: {String(hours).padStart(2, "0")}
                      j:{String(minutes).padStart(2, "0")}
                      m:{String(seconds).padStart(2, "0")}d
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm uppercase tracking-widest text-white/70">
                      Menuju Hari Bahagia
                    </p>
                    <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
                      {[
                        ["Hari", days],
                        ["Jam", hours],
                        ["Menit", minutes],
                        ["Detik", seconds],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-xl bg-black/30 border border-white/10 py-3 sm:py-4 text-center"
                        >
                          <div className="text-2xl sm:text-3xl font-bold">
                            {String(value).padStart(2, "0")}
                          </div>
                          <div className="text-[11px] uppercase tracking-wider text-white/70">
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => goToSection("mempelai")}
                  className={`btn ${THEME.btn}`}
                >
                  Lihat Undangan
                </button>
                <button
                  onClick={() => goToSection("acara")}
                  className="btn bg-white/10 hover:bg-white/20 focus-visible:outline focus-visible:outline-white/40"
                >
                  Lihat Detail Acara
                </button>
              </div>
            </div>

            {/* Kartu foto */}
            <div
              className="reveal relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              ref={(el) => {
                if (el) revealRef.current["hero2"] = el
              }}
            >
              <img
                src={IMAGES[0]}
                alt="Foto prewedding"
                className="h-80 sm:h-96 w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${THEME.accent}`}>#AisyahZidan</span>
                  <span className="text-white/60 text-sm">•</span>
                  <span className="text-white/80 text-sm">12.20.2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEMPELAI */}
      <section id="mempelai" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-18 md:py-20">
          <SectionTitle
            title="Mempelai"
            subtitle="Bersama dalam cinta dan harapan"
          />
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Aisyah Rahma", desc: "Putri dari Bapak X & Ibu Y" },
              { name: "Zidan Arya", desc: "Putra dari Bapak A & Ibu B" },
            ].map((p, idx) => (
              <div
                key={p.name}
                className="reveal rounded-3xl overflow-hidden card"
                ref={(el) => {
                  if (el) revealRef.current[`m-${idx}`] = el
                }}
              >
                <div className="relative">
                  <img
                    src={IMAGES[idx]}
                    alt={p.name}
                    className="h-72 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className={`text-2xl ${playfair.className}`}>{p.name}</h3>
                  <p className={`text-white/80 mt-1 ${inter.className}`}>{p.desc}</p>
                  <p className={`mt-4 text-white/80 ${cormorant.className}`}>
                    “Semoga Allah menghimpun yang terserak dari keduanya,
                    memberkahi keduanya, dan menuntun keduanya pada kebaikan.”
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal mt-8 text-center" ref={(el) => {
            if (el) revealRef.current["m-sapaan"] = el
          }}>
            <p className={`${cormorant.className} text-white/85 text-lg`}>
              Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk
              menghadiri hari bahagia kami. Doa restu Anda adalah hadiah
              terindah bagi kami.
            </p>
          </div>
        </div>
      </section>

      {/* ACARA */}
      <section id="acara" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-18 md:py-20">
          <SectionTitle
            title="Acara"
            subtitle="Waktu & Tempat Penyelenggaraan"
          />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="reveal card rounded-2xl p-6" ref={(el) => {
              if (el) revealRef.current["ac-1"] = el
            }}>
              <h4 className={`text-xl ${playfair.className}`}>Akad Nikah</h4>
              <ul className="mt-3 space-y-2 text-white/85">
                <li>Sabtu, 20 Desember 2025</li>
                <li>10:00 WIB</li>
                <li>Masjid Agung Contoh</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill>Formal</Pill>
                <Pill>Masker Opsional</Pill>
              </div>
            </div>

            <div className="reveal card rounded-2xl p-6" ref={(el) => {
              if (el) revealRef.current["ac-2"] = el
            }}>
              <h4 className={`text-xl ${playfair.className}`}>Resepsi</h4>
              <ul className="mt-3 space-y-2 text-white/85">
                <li>Sabtu, 20 Desember 2025</li>
                <li>19:00 — 21:00 WIB</li>
                <li>Gedung Serbaguna Contoh</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill>Dress Code: Ungu / Netral</Pill>
                <Pill>Parkir Luas</Pill>
              </div>
            </div>

            <div className="reveal card rounded-2xl p-6" ref={(el) => {
              if (el) revealRef.current["ac-3"] = el
            }}>
              <h4 className={`text-xl ${playfair.className}`}>Catatan</h4>
              <p className="mt-3 text-white/85">
                Mohon konfirmasi kehadiran melalui form RSVP. Datang tepat waktu
                ya! Tersedia photobooth dan live music.
              </p>
              <button onClick={() => goToSection("rsvp")} className={`mt-4 btn w-full ${THEME.btn}`}>
                Isi RSVP
              </button>
            </div>
          </div>

          <div className="reveal mt-8 rounded-2xl overflow-hidden border border-white/10" ref={(el) => {
            if (el) revealRef.current["ac-map"] = el
          }}>
            {/* Google Maps Iframe (contoh tempat) */}
            <iframe
              title="Lokasi Acara"
              src="https://www.google.com/maps?q=Monas%20Jakarta&output=embed"
              className="w-full h-80 md:h-105"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* GALERI */}
      <section id="galeri" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-18 md:py-20">
          <SectionTitle
            title="Galeri"
            subtitle="Potret kisah kami"
          />

          <div className="reveal relative rounded-3xl overflow-hidden border border-white/10" ref={(el) => {
            if (el) revealRef.current["gal"] = el
          }}>
            <div className="relative h-72 sm:h-96">
              {IMAGES.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Galeri ${i + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === galIdx ? "opacity-100" : "opacity-0"
                    }`}
                />
              ))}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

              {/* Controls */}
              <button
                aria-label="Sebelumnya"
                onClick={galPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/40 hover:bg-black/60"
              >
                ‹
              </button>
              <button
                aria-label="Berikutnya"
                onClick={galNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/40 hover:bg-black/60"
              >
                ›
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {IMAGES.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2 w-2 rounded-full transition ${i === galIdx ? "bg-white" : "bg-white/50 hover:bg-white/70"
                      }`}
                    onClick={() => setGalIdx(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CERITA (Timeline) */}
      <section id="cerita" className="relative">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-18 md:py-20">
          <SectionTitle title="Cerita Kami" subtitle="Jejak perjalanan cinta" />
          <ol className="relative border-l border-white/20 ml-2">
            {[
              {
                t: "2018",
                title: "Pertemuan Pertama",
                body:
                  "Kami bertemu di kampus, sebuah awal sederhana yang bermakna.",
              },
              {
                t: "2020",
                title: "Komitmen",
                body:
                  "Di tengah banyak hal, kami semakin yakin melangkah bersama.",
              },
              {
                t: "2024",
                title: "Lamaran",
                body:
                  "Momen khidmat bersama keluarga yang mengikat janji kami.",
              },
              {
                t: "2025",
                title: "Menuju Pelaminan",
                body:
                  "Dengan doa restu, kami siap memasuki babak baru kehidupan.",
              },
            ].map((item, i) => (
              <li
                key={i}
                className="mb-10 ml-4 reveal"
                ref={(el) => {
                  if (el) revealRef.current[`story-${i}`] = el
                }}
              >
                <div className="flex flex-col md:flex-row items-start">
                  {/* Teks bagian kiri */}
                  <div className="md:w-2/3 md:pr-4">
                    <div className="absolute w-3 h-3 bg-amber-300 rounded-full -left-1.5 top-1.5 border border-white/30" />
                    <time className="text-sm text-white/70 ps-2.5">{item.t}</time>
                    <h3 className={`text-xl mt-1 ${playfair.className}`}>
                      {item.title}
                    </h3>
                    <p className="text-white/85 mt-1">{item.body}</p>
                  </div>

                  {/* Gambar bagian kanan */}
                  <div className="md:w-1/3 mt-3 md:mt-0">
                    <img
                      src={IMAGES[i % IMAGES.length]}
                      alt={item.title}
                      className="h-44 w-full object-cover rounded-xl border border-white/10"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="relative">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:py-18 md:py-20">
          <SectionTitle title="RSVP" subtitle="Konfirmasi kehadiran Anda" />

          <form
            onSubmit={submitRSVP}
            className="reveal grid grid-cols-1 md:grid-cols-2 gap-4 card rounded-3xl p-6"
            ref={(el) => {
              if (el) revealRef.current["rsvp-form"] = el
            }}
          >
            <div className="md:col-span-1">
              <label className="text-sm text-white/80">Nama Lengkap</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="Nama Anda"
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-sm text-white/80">No. WhatsApp</label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="text-sm text-white/80">Kehadiran</label>
              <select
                value={form.attendance}
                onChange={(e) =>
                  setForm({ ...form, attendance: e.target.value as RSVPForm["attendance"] })
                }
                className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                <option>Hadir</option>
                <option>Tidak Hadir</option>
                <option>Belum Pasti</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-white/80">Jumlah Tamu</label>
              <input
                type="number"
                min={1}
                value={form.guests}
                onChange={(e) =>
                  setForm({ ...form, guests: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-white/80">Pesan / Doa</label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="Tulis pesan terbaik Anda..."
              />
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button type="submit" className={`btn ${THEME.btn} w-full sm:w-auto`}>
                Kirim Konfirmasi
              </button>
              {sent && (
                <span className="text-sm text-emerald-300">
                  Terima kasih! RSVP Anda sudah kami terima.
                </span>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* HADIAH */}
      <section id="hadiah" className="relative">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20 md:py-24">
          <SectionTitle
            title="Hadiah"
            subtitle="Doa restu adalah yang utama. Namun bagi yang berkenan memberi hadiah:"
          />

          {/* ================= TRANSFER ================= */}
          <div className="relative mt-10">
            {/* BANK */}
            <div ref={(el) => {
              if (el) revealRef.current["gift-bank"] = el
            }}
              className="reveal card rounded-2xl p-6"
            >
              <h4 className={`text-xl mb-4 ${playfair.className}`}>
                Transfer Bank
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    bank: "Bank BCA",
                    no: "1234567890",
                    name: "Aisyah Rahma",
                  },
                  {
                    bank: "Bank BRI",
                    no: "9876543210",
                    name: "Zidan Arya",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 rounded-xl bg-black/30 border border-white/10 p-4"
                  >
                    <div className="text-sm">
                      <p className="font-medium">{item.bank}</p>
                      <p className="text-white/70">No. Rek: {item.no}</p>
                      <p className="text-white/50">a.n. {item.name}</p>
                    </div>

                    <button
                      className="btn bg-white/10 text-sm px-4 py-2 rounded-full"
                      onClick={() => navigator.clipboard.writeText(item.no)}
                    >
                      Salin
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            {/* ================= WISHLIST ================= */}
            <div ref={(el) => {
              if (el) revealRef.current["gift-wishlist"] = el
            }} className="mt-14 reveal card rounded-2xl p-6 md:p-8">
              <h4 className={`text-xl mb-2 ${playfair.className}`}>
                Wishlist Hadiah
              </h4>

              {/* ================= ALAMAT ================= */}
              <div className="mt-3 rounded-xl bg-black/30 border border-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">
                  Alamat Pengiriman
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Aisyah Rahma Jl. Melati No. 10 Bandung 40123 Indonesia
                </p>

                <button
                  className="btn bg-white/10 text-sm px-4 py-2 rounded-full mt-3"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "Aisyah Rahma, Jl. Melati No. 10, Bandung 40123, Indonesia"
                    )
                  }
                >
                  Salin Alamat
                </button>
              </div>

              <p className="mt-3 text-sm text-white/70">
                Beberapa referensi hadiah yang mungkin bermanfaat bagi kami.
                Tidak ada kewajiban — kehadiran Anda tetap yang utama 🤍
              </p>

              <div className="mt-6 grid md:grid-cols-3 gap-5">
                {[
                  { name: "Set Peralatan Makan", price: "Rp 1.500.000", qty: 1 },
                  { name: "Sprei Premium King Size", price: "Rp 2.200.000", qty: 1 },
                  { name: "Lampu Meja Minimalis", price: "Rp 850.000", qty: 1 },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-black/30 border border-white/10 p-4 flex flex-col justify-between"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-white/60 mt-1">
                        Estimasi: {item.price}
                      </p>
                      <p className="text-sm text-white/60 mt-1">
                        Jumlah: {item.qty}
                      </p>
                    </div>

                    <a
                      href="#"
                      className="mt-4 text-center text-sm rounded-full border border-white/20 py-2 hover:bg-white/10 transition"
                    >
                      Lihat Detail
                    </a>
                  </div>
                ))}
              </div>

              {/* ================= PAGINATION (UI ONLY) ================= */}
              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-white text-black text-xs font-semibold">
                    1
                  </button>
                  <button className="w-8 h-8 rounded-full border border-white/30 text-xs text-white/70">
                    2
                  </button>
                  <button className="w-8 h-8 rounded-full border border-white/30 text-xs text-white/70">
                    3
                  </button>
                </div>

                <div className="flex gap-3">
                  <button className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10 transition">
                    Prev
                  </button>
                  <button className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10 transition">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:py-18 md:py-20">
          <SectionTitle title="FAQ" subtitle="Pertanyaan yang sering diajukan" />

          <div className="reveal space-y-3" ref={(el) => {
            if (el) revealRef.current["faq"] = el
          }}>
            {[
              {
                q: "Apakah anak-anak diperbolehkan?",
                a: "Tentu, kami senang menyambut seluruh keluarga.",
              },
              {
                q: "Apakah ada dress code?",
                a: "Menggunakan warna ungu/netral akan sangat serasi dengan tema.",
              },
              {
                q: "Kapan sebaiknya datang?",
                a: "Mohon hadir 15-30 menit sebelum acara dimulai.",
              },
              {
                q: "Apakah tersedia parkir?",
                a: "Ya, area parkir luas dan terkoordinir.",
              },
            ].map((f, idx) => {
              const isOpen = openFAQ === idx;
              return (
                <div key={idx} className="rounded-2xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setOpenFAQ(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between px-4 py-4 bg-white/5 hover:bg-white/10 transition"
                    aria-expanded={isOpen}
                  >
                    <span className="text-left font-medium">{f.q}</span>
                    <span className="text-xl">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="px-4 py-3 bg-black/30 text-white/85">{f.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className={`text-xl ${playfair.className}`}>
                <span className={THEME.accent}>A&Z</span> Wedding
              </h4>
              <p className="text-white/80 mt-2">
                Terima kasih telah menjadi bagian dari kisah kami.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="chip px-3 py-1 rounded-full">#AisyahZidan</span>
                <span className="chip px-3 py-1 rounded-full">#20Des2025</span>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-3">Navigasi</h5>
              <ul className="space-y-2">
                {nav.map((n) => (
                  <li key={n.id}>
                    <button
                      className="text-white/85 hover:underline"
                      onClick={() => goToSection(n.id)}
                    >
                      {n.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-3">Informasi</h5>
              <ul className="space-y-2 text-white/85">
                <li>Akad: 20 Des 2025, 10:00 WIB</li>
                <li>Resepsi: 20 Des 2025, 19:00 WIB</li>
                <li>Lokasi: Jakarta</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-3">Kontak</h5>
              <ul className="space-y-2 text-white/85">
                <li>WA Aisyah: 08xxxxxxxxxx</li>
                <li>WA Zidan: 08xxxxxxxxxx</li>
                <li>Email: hello@wedding.com</li>
              </ul>
              <button
                onClick={() => goToSection("rsvp")}
                className={`mt-4 btn w-full ${THEME.btn}`}
              >
                RSVP Sekarang
              </button>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-white/70 text-sm">
            © {new Date().getFullYear()} Aisyah & Zidan — All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
