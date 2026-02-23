"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Playfair_Display, Great_Vibes, Inter } from "next/font/google";
import useCountdown from "@/lib/countdown";
import { formatDate } from "@/lib/utils";
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Invitation Type: Wedding
 * Theme Name: "Luminara Elegance"
 * Create At: 09-09-2025
 * Create By: David
*/

// Elegant wedding typography
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-script" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// ---------- Configurable Data ----------
const WEDDING_DATE = new Date();
WEDDING_DATE.setDate(WEDDING_DATE.getDate() + 12);

const THEME_IMG = "http://localhost:3005/assets/img/2149043983.jpg";
const GALLERY_IMAGES = Array.from({ length: 10 }, () => THEME_IMG);
const COUPLE = {
  bride: {
    name: "Aisyah Putri",
    desc:
      "Putri dari Bapak Ahmad & Ibu Salma. Lembut, ceria, dan penuh perhatian.",
    img: THEME_IMG,
  },
  groom: {
    name: "Rama Pratama",
    desc:
      "Putra dari Bapak Budi & Ibu Rina. Ramah, bijak, dan berjiwa petualang.",
    img: THEME_IMG,
  },
};
const VENUE = {
  akad: {
    title: "Akad Nikah",
    time: "Sabtu, 20 Desember 2025 • 10.00 WIB",
    place: "Masjid Al-Ikhlas, Jakarta Selatan",
    note: "Mohon kehadiran 15 menit sebelum acara dimulai.",
  },
  resepsi: {
    title: "Resepsi",
    time: "Sabtu, 20 Desember 2025 • 12.00-15.00 WIB",
    place: "Grand Emerald Hall, Jakarta",
    note: "Dress code: Elegant Emerald / White.",
  },
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.310223930973!2d106.7999999!3d-6.2199999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1f1f1f1f1f1%3AEmeraldHall!2sJakarta!5e0!3m2!1sen!2sid!4v1680000000000",
};
const GIFTS = [
  {
    label: "BCA • 1234567890 • A/N Rama Pratama",
    copy: "1234567890",
  },
  {
    label: "Mandiri • 9876543210 • A/N Aisyah Putri",
    copy: "9876543210",
  },
  {
    label: "E-Wallet • 0812-0000-0000 (QRIS di lokasi)",
    copy: "081200000000",
  },
];
const FAQS = [
  {
    q: "Apakah boleh membawa anak?",
    a: "Tentu boleh. Kami menyediakan area duduk yang nyaman untuk keluarga.",
  },
  {
    q: "Apakah ada parkir?",
    a: "Tersedia area parkir basement dan valet (terbatas).",
  },
  {
    q: "Dress code seperti apa?",
    a: "Elegant Emerald / White. Gunakan pakaian yang nyaman & sopan.",
  },
  {
    q: "Bolehkah memberi hadiah secara digital?",
    a: "Boleh. Informasi rekening & e-wallet tersedia pada bagian Hadiah.",
  },
];

const sections = [
  { id: "mempelai", label: "Mempelai" },
  { id: "acara", label: "Acara" },
  { id: "galeri", label: "Galeri" },
  { id: "cerita", label: "Cerita" },
  { id: "rsvp", label: "RSVP" },
  { id: "hadiah", label: "Hadiah" },
  { id: "faq", label: "FAQ" },
];

function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isLocked])
};

// ---------- Page ----------
export default function WeddingInvitationPage() {
  const [opened, setOpened] = useState(false)
  useLockBodyScroll(!opened)

  // Countdown
  const countDown = useCountdown(WEDDING_DATE.toString());

  const [active, setActive] = useState<string>("mempelai");
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [rsvp, setRsvp] = useState({ name: "", phone: "", attendance: "Hadir", guests: 1, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Smooth scroll globally
  useEffect(() => {
    const root = document.documentElement;
    root.style.scrollBehavior = "smooth";
    return () => {
      root.style.scrollBehavior = "";
    };
  }, []);

  // ScrollSpy with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const onCopy = useCallback((text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1500);
    });
  }, []);

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Di sini kamu bisa kirim ke API / Google Sheet / Supabase, dll.
    setSubmitted(true);
  }, []);

  return (
    <main className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} font-sans bg-emerald-950 text-emerald-50 min-h-screen overflow-x-hidden`}>
      {/* Decorative gradient + noise overlay */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 bg-linear-to-b from-emerald-900 via-emerald-950 to-black"></div>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mix-blend-overlay opacity-20 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,.08),transparent_40%),radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,.06),transparent_40%)]"></div>

      <AnimatePresence>
        {!opened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999 flex items-center justify-center text-center px-6"
          >
            <div className="absolute inset-0">
              <img
                src='http://localhost:3005/assets/img/2149043983.jpg'
                alt="cover"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-emerald-950/70 bg-linear-to-b from-black/40 via-transparent to-emerald-950/90 backdrop-blur-sm" />
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10 space-y-4"
            >
              <p className="tracking-widest uppercase text-sm mb-4 text-white">Wedding Invitation</p>

              <h1 className="mt-3 font-display text-4xl sm:text-6xl tracking-wide">
                Rama <span className="text-amber-300">&</span> Aisyah
              </h1>
              <p className="mt-4 text-lg text-emerald-100/90">{formatDate(WEDDING_DATE, "full", "short")}</p>
              <p className="mt-2 italic text-white">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="font-semibold text-xl mt-1 text-white">Nama Tamu</p>

              <button
                onClick={() => setOpened(true)}
                className="btn-shimmer floaty inline-flex items-center gap-2 rounded-full bg-amber-300/90 px-6 py-3 text-emerald-950 font-medium ring-2 ring-amber-200/50 hover:-translate-y-0.5 transition"
              >
                Buka Undangan
                <span className="inline-block translate-x-0 group-hover:translate-x-0.5 transition">↗</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Header */}
      <Header active={active} />

      {/* Hero */}
      <Hero countDown={countDown} />

      {/* Sections */}
      <section id="mempelai" className="scroll-mt-24">
        <Mempelai />
      </section>

      <section id="acara" className="scroll-mt-24">
        <Acara />
      </section>

      <section id="galeri" className="scroll-mt-24">
        <Galeri />
      </section>

      <section id="cerita" className="scroll-mt-24">
        <Cerita />
      </section>

      <section id="rsvp" className="scroll-mt-24">
        <RSVP
          rsvp={rsvp}
          submitted={submitted}
          setRsvp={setRsvp}
          onSubmit={onSubmit}
        />
      </section>

      <section id="hadiah" className="scroll-mt-24">
        <Hadiah onCopy={onCopy} copiedIndex={copiedIndex} />
      </section>

      <section id="faq" className="scroll-mt-24">
        <FAQ open={openAccordion} setOpen={setOpenAccordion} />
      </section>

      {/* Footer */}
      <Footer />

      {/* Styles: carousel, animations, embellishments */}
      <style jsx global>{`
        :root {
          --ring: 220 13% 69%;
        }
        .font-sans { font-family: var(--font-sans), ui-sans-serif, system-ui; }
        .font-display { font-family: var(--font-playfair), serif; letter-spacing: .2px; }
        .font-script { font-family: var(--font-script), cursive; }
        /* Hero background carousel (fade) */
        .hero-carousel {
          position: absolute; inset: 0; overflow: hidden;
        }
        .hero-slide {
          position: absolute; inset: 0; background-size: cover; background-position: center;
          opacity: 0; animation: heroFade 18s infinite;
          transform: scale(1.05);
        }
        .hero-slide:nth-child(1) { animation-delay: 0s; }
        .hero-slide:nth-child(2) { animation-delay: 6s; }
        .hero-slide:nth-child(3) { animation-delay: 12s; }
        @keyframes heroFade {
          0% { opacity: 0; transform: scale(1.06); }
          8%, 30% { opacity: .9; transform: scale(1.0); }
          38%, 100% { opacity: 0; transform: scale(1.06); }
        }
        /* Subtle float */
        @keyframes floaty { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-6px);} }
        .floaty { animation: floaty 6s ease-in-out infinite; }

        /* Shimmer button */
        .btn-shimmer {
          position: relative; overflow: hidden;
        }
        .btn-shimmer:before {
          content: ""; position: absolute; top: 0; left: -150%; height: 100%; width: 150%;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.15) 50%, transparent 100%);
          transform: skewX(-20deg);
        }
        .btn-shimmer:hover:before { animation: shimmer 1.2s ease; }
        @keyframes shimmer {
          0% { left: -150%; }
          100% { left: 150%; }
        }

        /* Card glass */
        .glass {
          background: rgba(4, 120, 87, 0.14);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Scroll snap for gallery */
        .snap-x { scroll-snap-type: x mandatory; }
        .snap-center { scroll-snap-align: center; }

        /* Fancy divider */
        .divider {
          --c: rgba(252, 211, 77, .55);
          height: 1px;
          background: linear-gradient(to right, transparent, var(--c), transparent);
        }
      `}</style>
    </main>
  );
}

// ---------- Components ----------

function Header({ active }: { active: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-4 rounded-2xl glass">
          <nav className="flex items-center justify-between px-4 py-3">
            <a href="#mempelai" className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800/60 ring-1 ring-white/10">
                <span className="font-script text-xl leading-none text-amber-300">R♥A</span>
              </span>
              <span className="hidden sm:block font-display text-sm tracking-wide text-emerald-100">
                The Wedding of <span className="text-amber-300">Rama & Aisyah</span>
              </span>
            </a>

            {/* Desktop menu */}
            <ul className="hidden md:flex items-center gap-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`px-3 py-2 rounded-full text-sm transition ${active === s.id
                      ? "bg-emerald-800/60 text-amber-200 ring-1 ring-amber-200/30"
                      : "text-emerald-100 hover:bg-emerald-800/40"
                      }`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile menu button */}
            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-800/50 hover:bg-emerald-800/70 ring-1 ring-white/10"
            >
              <span className="i">☰</span>
            </button>
          </nav>

          {/* Mobile drawer */}
          {open && (
            <div className="md:hidden px-2 pb-3">
              <ul className="grid grid-cols-2 gap-2">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={() => setOpen(false)}
                      className={`block w-full text-center rounded-xl px-3 py-2 text-sm transition ${active === s.id
                        ? "bg-emerald-800/60 text-amber-200 ring-1 ring-amber-200/30"
                        : "text-emerald-100 hover:bg-emerald-800/40"
                        }`}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Hero({ countDown }: {
  countDown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isToday: boolean;
    isExpired: boolean;
  }
}) {
  return (
    <section className="relative isolate min-h-[94vh] md:pt-44 pt-60">
      {/* Background carousel */}
      <div className="hero-carousel -z-10">
        {[THEME_IMG, THEME_IMG, THEME_IMG].map((src, i) => (
          <div key={i} className="hero-slide" style={{ backgroundImage: `url(${src})` }} />
        ))}
        <div className="absolute inset-0 bg-emerald-950/70" />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-emerald-950/90" />
      </div>

      <div className="mx-auto max-w-5xl px-5">
        <div className="text-center">
          <p className="font-script text-4xl sm:text-5xl text-amber-200/90">Undangan Pernikahan</p>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl tracking-wide">
            Rama <span className="text-amber-300">&</span> Aisyah
          </h1>
          <p className="mt-3 text-sm/6 sm:text-base text-emerald-100/90">
            {formatDate(WEDDING_DATE, "full", "short")}
          </p>
        </div>

        {/* Countdown / Day UI */}
        <div className="mt-8 grid place-items-center">
          {countDown.isExpired ? (
            <div className="glass rounded-2xl px-5 py-4 sm:px-8 sm:py-6">
              <p className="text-center text-xs uppercase tracking-[0.25em] text-emerald-100/80">
                Terima Kasih
              </p>
              <h3 className="mt-1 font-display text-2xl">
                Acara telah selesai dengan penuh sukacita 🤍
              </h3>
              <p className="mt-1 text-sm text-emerald-100/90">Terima kasih atas doa & kehadiran Anda.</p>
            </div>
          ) : countDown.isToday ? (
            <div className="glass rounded-2xl px-5 py-4 sm:px-8 sm:py-6">
              <p className="text-center text-xs uppercase tracking-[0.25em] text-emerald-100/80">
                Hari Ini
              </p>
              <h3 className="mt-1 font-display text-2xl">
                Saatnya merayakan cinta 🎉
              </h3>
              <p className="mt-1 text-sm text-emerald-100/90">
                Kami nantikan kehadiran & doa restu Anda.
              </p>
            </div>
          ) : (
            <div className="glass rounded-2xl px-5 py-4 sm:px-8 sm:py-6">
              <p className="text-center text-xs uppercase tracking-[0.25em] text-emerald-100/80">
                Menuju Hari Bahagia
              </p>
              <div className="mt-3 flex items-stretch gap-2 sm:gap-4">
                <TimeBox label="Hari" value={countDown.days} />
                <TimeBox label="Jam" value={countDown.hours} />
                <TimeBox label="Menit" value={countDown.minutes} />
                <TimeBox label="Detik" value={countDown.seconds} />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="#mempelai"
            className="btn-shimmer floaty inline-flex items-center gap-2 rounded-full bg-amber-300/90 px-6 py-3 text-emerald-950 font-medium ring-2 ring-amber-200/50 hover:-translate-y-0.5 transition"
          >
            ✨ Lihat Undangan
          </a>
        </div>
      </div>

      {/* Decorative bottom divider */}
      <div className="mx-auto mt-12 max-w-6xl px-6">
        <div className="divider" />
      </div>
    </section>
  );
}

function TimeBox({ label, value }: { label: string; value: number }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="relative grid min-w-16.5 place-items-center rounded-xl bg-black/30 px-3 py-2 ring-1 ring-white/10">
      <div className="text-2xl font-display tabular-nums">{padded}</div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-100/80">{label}</div>
      <span aria-hidden className="absolute inset-0 rounded-xl ring-1 ring-white/10 pointer-events-none" />
    </div>
  );
}

function SectionTitle({ overline, title, subtitle }: { overline?: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6 text-center">
      {overline && (
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-100/70">{overline}</p>
      )}
      <h2 className="mt-1 font-display text-3xl sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-emerald-100/80">{subtitle}</p>}
      <div className="mx-auto mt-6 h-px w-40 divider" />
    </div>
  );
}

function Mempelai() {
  return (
    <div className="relative py-16 sm:py-20">
      <SectionTitle
        overline="Kata Sambutan"
        title="Mempelai"
        subtitle="Dengan penuh rasa syukur, kami bermaksud menyelenggarakan pernikahan kami."
      />
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2">
        {[COUPLE.bride, COUPLE.groom].map((p, i) => (
          <div key={i} className="group glass rounded-3xl p-4 sm:p-6 transition hover:-translate-y-1">
            <div className="aspect-4/3 w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
              <img src={p.img} alt={p.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <h3 className="mt-4 font-display text-2xl">{p.name}</h3>
            <p className="mt-2 text-emerald-100/85 text-sm">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-3xl px-6 text-center">
        <p className="font-script text-2xl text-amber-200/90">Assalamualaikum/Salam sejahtera,</p>
        <p className="mt-3 text-emerald-100/85">
          Dengan memohon rahmat dan ridha Allah Subhanahu Wa Ta’ala, kami bermaksud mengundang Bapak/Ibu/Saudara/i
          untuk hadir dan memberi doa restu pada pernikahan kami.
        </p>
      </div>
    </div>
  );
}

function Acara() {
  return (
    <div className="relative py-16 sm:py-20">
      <SectionTitle title="Acara" subtitle="Informasi waktu & tempat pelaksanaan." />
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 px-6 lg:grid-cols-3">
        {[VENUE.akad, VENUE.resepsi].map((ev, i) => (
          <div key={i} className="glass rounded-3xl p-5">
            <h3 className="font-display text-xl">{ev.title}</h3>
            <p className="mt-2 text-sm text-emerald-100/85">{ev.time}</p>
            <p className="mt-1 text-sm text-emerald-100/85">{ev.place}</p>
            <p className="mt-3 text-xs text-emerald-100/70">{ev.note}</p>
          </div>
        ))}
        <div className="glass rounded-3xl p-5">
          <h3 className="font-display text-xl">Informasi Tambahan</h3>
          <ul className="mt-3 space-y-2 text-sm text-emerald-100/85">
            <li>• Dress code: <span className="text-amber-200">Elegant Emerald / White</span></li>
            <li>• Mohon menjaga ketertiban & kebersihan lokasi.</li>
            <li>• Doa restu Anda sangat berarti bagi kami 🤍</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-6">
        <div className="aspect-video overflow-hidden rounded-3xl ring-1 ring-white/10">
          <iframe
            title="Lokasi Acara"
            src={VENUE.mapsEmbed}
            className="h-full w-full"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

function Galeri() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <div className="relative py-16 sm:py-20">
      <SectionTitle title="Galeri" subtitle="Kenangan indah perjalanan kami." />
      <div className="mx-auto mt-8 max-w-6xl px-3 sm:px-6">
        <div className="relative">
          <div
            ref={scrollerRef}
            className="flex snap-x gap-3 overflow-x-auto scroll-px-4 rounded-3xl p-2"
          >
            {GALLERY_IMAGES.map((src, i) => (
              <div key={i} className="snap-center shrink-0 w-[78%] sm:w-[48%] md:w-[38%] lg:w-[30%]">
                <div className="group relative aspect-4/5 overflow-hidden rounded-2xl ring-1 ring-white/10">
                  <img src={src} alt={`Galeri ${i + 1}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-emerald-950/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between md:flex">
            <button
              onClick={() => scrollBy(-1)}
              className="pointer-events-auto rounded-full bg-black/30 px-4 py-3 ring-1 ring-white/10 hover:bg-black/40 transition"
              aria-label="Sebelumnya"
            >
              ‹
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="pointer-events-auto rounded-full bg-black/30 px-4 py-3 ring-1 ring-white/10 hover:bg-black/40 transition"
              aria-label="Berikutnya"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cerita() {
  const timeline = [
    { date: "2018", title: "Pertemuan Pertama", desc: "Bertemu di kampus dan menjadi teman baik." },
    { date: "2020", title: "Mulai Serius", desc: "Hubungan berkomitmen meski penuh kesibukan." },
    { date: "2023", title: "Lamaran", desc: "Meminta restu orang tua, momen haru penuh syukur." },
    { date: "2025", title: "Pernikahan", desc: "Mengikat janji suci untuk seumur hidup." },
  ];
  return (
    <div className="relative py-16 sm:py-20">
      <SectionTitle title="Cerita Kami" subtitle="Sekilas perjalanan cinta dalam beberapa momen." />
      <div className="mx-auto mt-10 max-w-4xl px-6">
        <ol className="relative border-s border-emerald-800/60 ps-6">
          {timeline.map((t, i) => (
            <li key={i} className="mb-10 ms-4">
              <span className="absolute -start-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-300/90 text-emerald-950 ring-2 ring-amber-200/60">
                <span className="text-[10px] font-bold">{i + 1}</span>
              </span>
              <h3 className="font-display text-xl">{t.title}</h3>
              <p className="text-xs uppercase tracking-widest text-emerald-100/70">{t.date}</p>
              <p className="mt-1 text-emerald-100/85">{t.desc}</p>
              <div className="mt-6 h-px w-24 divider" />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function RSVP({
  rsvp,
  submitted,
  setRsvp,
  onSubmit,
}: {
  rsvp: { name: string; phone: string; attendance: string; guests: number; message: string };
  submitted: boolean;
  setRsvp: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="relative py-16 sm:py-20">
      <SectionTitle title="RSVP" subtitle="Konfirmasi kehadiran Anda." />
      <div className="mx-auto mt-8 max-w-3xl px-6">
        <form onSubmit={onSubmit} className="glass rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nama Lengkap">
              <input
                required
                value={rsvp.name}
                onChange={(e) => setRsvp((s: any) => ({ ...s, name: e.target.value }))}
                className="input w-full border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
                placeholder="Nama Anda"
              />
            </Field>
            <Field label="No. HP / WhatsApp">
              <input
                required
                value={rsvp.phone}
                onChange={(e) => setRsvp((s: any) => ({ ...s, phone: e.target.value }))}
                className="input w-full border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
                placeholder="08xxxxxxxxxx"
                inputMode="tel"
              />
            </Field>
            <Field label="Kehadiran">
              <select
                value={rsvp.attendance}
                onChange={(e) => setRsvp((s: any) => ({ ...s, attendance: e.target.value }))}
                className="input w-full border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
              >
                <option>Hadir</option>
                <option>Tidak Hadir</option>
                <option>Mungkin</option>
              </select>
            </Field>
            <Field label="Jumlah Tamu">
              <input
                type="number"
                min={1}
                max={10}
                value={rsvp.guests}
                onChange={(e) => setRsvp((s: any) => ({ ...s, guests: Number(e.target.value) }))}
                className="input w-full border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
              />
            </Field>
          </div>
          <Field label="Ucapan / Pesan" full>
            <textarea
              rows={4}
              value={rsvp.message}
              onChange={(e) => setRsvp((s: any) => ({ ...s, message: e.target.value }))}
              className="input resize-y w-full border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
              placeholder="Doa & pesan untuk kedua mempelai…"
            />
          </Field>

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-emerald-100/70">
              Data Anda aman. Kami hanya menggunakan untuk keperluan RSVP.
            </div>
            <button
              type="submit"
              className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-amber-300/90 px-5 py-2.5 text-emerald-950 font-medium ring-2 ring-amber-200/50 hover:-translate-y-0.5 transition"
            >
              Kirim RSVP
            </button>
          </div>

          {submitted && (
            <div className="mt-3 rounded-xl bg-emerald-900/60 px-4 py-3 text-sm ring-1 ring-white/10">
              Terima kasih! RSVP Anda sudah kami terima. Sampai jumpa di hari bahagia!
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        .input {
          @apply w-full rounded-xl bg-black/30 px-3 py-2 ring-1 ring-white/10 placeholder:text-emerald-100/50 focus:outline-none focus:ring-2 focus:ring-amber-200/40;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-emerald-100/70">{label}</span>
      {children}
    </label>
  );
}

function Hadiah({
  onCopy,
  copiedIndex,
}: {
  onCopy: (text: string, idx: number) => void;
  copiedIndex: number | null;
}) {
  return (
    <section className="relative py-16 sm:py-20">
      <SectionTitle
        title="Hadiah"
        subtitle="Doa restu adalah yang utama. Jika berkenan, Anda juga dapat mengirim hadiah."
      />

      <div className="mx-auto mt-10 max-w-5xl space-y-8">
        {/* ================================================= */}
        {/* KADO DIGITAL                                     */}
        {/* ================================================= */}
        <div className="glass rounded-3xl p-6">
          <h4 className="mb-3 font-serif text-lg text-emerald-50">
            Kado Digital
          </h4>

          <p className="mb-5 text-sm text-emerald-100/80">
            Kehadiran Anda sudah lebih dari cukup. Namun bila berkenan,
            tanda kasih dapat disampaikan melalui informasi berikut:
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {GIFTS.map((g, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 rounded-2xl bg-black/30 p-4 ring-1 ring-white/10"
              >
                <div className="text-sm text-emerald-100/90">
                  {g.label}
                </div>

                <button
                  onClick={() => onCopy(g.copy, i)}
                  className="
                    rounded-full
                    bg-black/40
                    px-3 py-1.5
                    text-xs
                    ring-1 ring-white/10
                    transition
                    hover:bg-black/60
                  "
                >
                  {copiedIndex === i ? 'Disalin ✓' : 'Salin'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================= */}
        {/* WISHLIST + ALAMAT                                */}
        {/* ================================================= */}
        <div className="glass rounded-3xl p-6">
          <h4 className="mb-2 font-serif text-lg text-emerald-50">
            Wishlist Hadiah
          </h4>

          {/* Alamat Pengiriman */}
          <div className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
            <p className="text-xs uppercase tracking-wider text-emerald-100/60">
              Alamat Pengiriman
            </p>
            <p className="mt-1 text-sm text-emerald-50 leading-relaxed">
              Nama Penerima Jl. Contoh Bahagia No. 12 Jakarta Selatan, 12345 Indonesia
            </p>

            <button
              onClick={() =>
                onCopy(
                  'Nama Penerima, Jl. Contoh Bahagia No. 12, Jakarta Selatan, 12345, Indonesia',
                  999
                )
              }
              className="mt-3 text-xs text-amber-300 underline underline-offset-4 hover:no-underline"
            >
              Salin Alamat
            </button>
          </div>

          <p className="my-5 text-sm text-emerald-100/80">
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
                className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/10"
              >
                <p className="text-sm font-medium text-emerald-50">
                  {item.name}
                </p>

                <div className="mt-1 text-xs text-emerald-100/70 space-y-0.5">
                  <p>Perkiraan Harga: {item.price}</p>
                  <p>Jumlah: {item.qty} unit</p>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mt-3 inline-flex w-full justify-center
                    rounded-xl
                    border border-amber-300/40
                    px-4 py-2
                    text-xs
                    text-amber-200
                    transition
                    hover:bg-amber-300/10
                  "
                >
                  Lihat Referensi
                </a>
              </div>
            ))}
          </div>

          {/* Pagination UI */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex gap-2">
              <button className="h-8 w-8 rounded-full bg-amber-300 text-xs font-semibold text-emerald-950">
                1
              </button>
              <button className="h-8 w-8 rounded-full ring-1 ring-white/20 text-xs text-emerald-100/70">
                2
              </button>
              <button className="h-8 w-8 rounded-full ring-1 ring-white/20 text-xs text-emerald-100/70">
                3
              </button>
            </div>

            <div className="flex w-full gap-3">
              <button className="flex-1 rounded-xl ring-1 ring-white/20 px-3 py-2 text-xs text-emerald-100/70">
                Prev
              </button>
              <button className="flex-1 rounded-xl ring-1 ring-white/20 px-3 py-2 text-xs text-emerald-100/70">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ({ open, setOpen }: { open: number | null; setOpen: (v: number | null) => void }) {
  return (
    <div className="relative py-16 sm:py-20">
      <SectionTitle title="Pertanyaan Umum" subtitle="Beberapa hal yang sering ditanyakan." />
      <div className="mx-auto mt-8 max-w-3xl px-6">
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 bg-emerald-900/40 px-4 py-3 text-left"
                >
                  <span className="font-medium">{f.q}</span>
                  <span className="text-amber-200">{isOpen ? "–" : "+"}</span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <div className="bg-emerald-900/20 px-4 py-3 text-emerald-100/85">{f.a}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const menuGroups = [
    {
      title: "Navigasi",
      links: sections.map((s) => ({ label: s.label, href: `#${s.id}`, external: undefined })),
    },
    {
      title: "Informasi",
      links: [
        { label: "Lokasi", href: "#acara", external: undefined },
        { label: "Dress Code", href: "#acara", external: undefined },
        { label: "RSVP", href: "#rsvp", external: undefined },
      ],
    },
    {
      title: "Kontak",
      links: [
        { label: "DM Instagram", href: "https://instagram.com/", external: true },
        { label: "WhatsApp", href: "https://wa.me/6281200000000", external: true },
      ],
    },
  ];

  return (
    <footer className="relative mt-10 border-t border-emerald-800/50 bg-emerald-950/60">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800/60 ring-1 ring-white/10">
                <span className="font-script text-xl leading-none text-amber-300">R♥A</span>
              </span>
              <div>
                <p className="font-display text-lg">Rama & Aisyah</p>
                <p className="text-sm text-emerald-100/80">20 Desember 2025 · Jakarta</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-emerald-100/80">
              Terima kasih telah menjadi bagian dari hari bahagia kami.
            </p>
          </div>

          {menuGroups.map((g, i) => (
            <div key={i}>
              <p className="font-display text-lg">{g.title}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {g.links.map((l, j) => (
                  <li key={j}>
                    <a
                      href={l.href}
                      {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="text-emerald-100/85 hover:text-amber-200 transition"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-emerald-800/50 pt-6 text-xs text-emerald-100/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Rama & Aisyah — All rights reserved.</p>
          <p className="text-center">
            Dibuat dengan ❤️ menggunakan Next.js & Tailwind.
          </p>
        </div>
      </div>
    </footer>
  );
}
