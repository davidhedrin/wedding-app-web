"use client";

import useCountdown from "@/lib/countdown";
import { formatDate } from "@/lib/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Invitation Type: Wedding
 * Theme Name: "Emerald Grace"
 * Create At: 08-09-2025
 * Create By: David
*/

const WEDDING_DATE = new Date();
WEDDING_DATE.setDate(WEDDING_DATE.getDate() + 12);

const PLACEHOLDER_IMG = "http://localhost:3005/assets/img/2149043983.jpg";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const navItems = [
  { id: "mempelai", label: "Mempelai" },
  { id: "acara", label: "Acara" },
  { id: "galeri", label: "Galeri" },
  { id: "cerita", label: "Cerita" },
  { id: "rsvp", label: "RSVP" },
  { id: "hadiah", label: "Hadiah" },
  { id: "faq", label: "FAQ" },
];

export default function Page() {
  const [activeId, setActiveId] = useState<string>("mempelai");
  const [isMenuOpen, setMenuOpen] = useState(false);

  // Countdown
  const { days, hours, minutes, seconds, isExpired } = useCountdown(WEDDING_DATE.toString());

  // Hero background carousel
  const heroImages = useMemo(
    () => [PLACEHOLDER_IMG, PLACEHOLDER_IMG, PLACEHOLDER_IMG],
    []
  );
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [heroImages.length]);

  // Gallery slider
  const galleryImages = useMemo(
    () =>
      new Array(8).fill(0).map((_, i) => ({
        src: PLACEHOLDER_IMG,
        alt: `Galeri ${i + 1}`,
      })),
    []
  );
  const [galIndex, setGalIndex] = useState(0);
  const galTimerRef = useRef<number | null>(null);
  useEffect(() => {
    galTimerRef.current = window.setInterval(() => {
      setGalIndex((i) => (i + 1) % galleryImages.length);
    }, 4000);
    return () => {
      if (galTimerRef.current) window.clearInterval(galTimerRef.current);
    };
  }, [galleryImages.length]);

  // Smooth active section highlight (IntersectionObserver)
  const observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 }
    );

    sections.forEach((sec) => observerRef.current?.observe(sec));
    return () => observerRef.current?.disconnect();
  }, []);

  // Touch handlers for gallery
  const touchStartX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    if (galTimerRef.current) window.clearInterval(galTimerRef.current);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 40) setGalIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
    else if (dx < -40) setGalIndex((i) => (i + 1) % galleryImages.length);
  };

  const handleNavClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  // RSVP submit (demo only)
  const onSubmitRSVP = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    // eslint-disable-next-line no-console
    console.log("RSVP:", payload);
    alert("Terima kasih! Konfirmasi Anda telah kami terima.");
    e.currentTarget.reset();
  };

  // Copy to clipboard (Hadiah)
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Tersalin ke clipboard");
    } catch {
      toast("Gagal menyalin");
    }
  };

  const [toastMsg, setToastMsg] = useState<string>("");
  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 1800);
  };

  // Decorative particles gentle float
  const particles = useMemo(() => new Array(12).fill(0).map((_, i) => i), []);

  return (
    <main className="scroll-smooth text-emerald-50 selection:bg-emerald-300/40">
      {/* Global Background (gradient + subtle texture via overlay image blur) */}
      <div
        aria-hidden
        className="fixed inset-0 -z-20 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950"
      />
      <div
        aria-hidden
        className="fixed inset-0 -z-10 opacity-[0.08] bg-cover bg-center blur-3xl"
        style={{ backgroundImage: `url(${PLACEHOLDER_IMG})` }}
      />

      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mt-4 md:mb-3 flex items-center justify-between rounded-2xl border border-emerald-300/10 bg-emerald-900/40 px-4 py-3 backdrop-blur-xl shadow-lg shadow-black/20">
            <button
              onClick={() => handleNavClick("mempelai")}
              className="group inline-flex items-center gap-2"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 group-hover:scale-125 transition" />
              <span className="font-serif text-xl tracking-wide">A & B</span>
            </button>

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center gap-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`rounded-full px-4 py-2 text-sm tracking-wide transition hover:bg-emerald-300/10 hover:text-white ${activeId === item.id
                      ? "bg-emerald-300/15 ring-1 ring-emerald-300/30"
                      : "text-emerald-100/80"
                      }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-950/40"
              onClick={() => setMenuOpen((s) => !s)}
              aria-label="Toggle Menu"
            >
              <div className="space-y-1.5">
                <span className="block h-0.5 w-5 bg-emerald-200"></span>
                <span className="block h-0.5 w-5 bg-emerald-200"></span>
                <span className="block h-0.5 w-5 bg-emerald-200"></span>
              </div>
            </button>
          </nav>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`md:hidden transition-[max-height] duration-500 overflow-hidden ${isMenuOpen ? "max-h-96" : "max-h-0"
            }`}
        >
          <ul className="mx-4 max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-2 p-4 bg-emerald-500 rounded-2xl">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm tracking-wide transition hover:bg-emerald-300/10 ${activeId === item.id
                    ? "bg-emerald-300/15 ring-1 ring-emerald-300/30"
                    : "text-emerald-100/80"
                    }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* HERO */}
      <section
        id="hero"
        className="relative min-h-[92vh] flex items-center justify-center pt-28"
      >
        {/* Background Carousel */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-b-[2.5rem] md:rounded-b-[4rem]">
          {heroImages.map((src, i) => (
            <div
              key={i}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ${i === heroIndex ? "opacity-100" : "opacity-0"
                }`}
              style={{ backgroundImage: `url(${src})` }}
              aria-hidden
            />
          ))}
          <div className="absolute inset-0 bg-emerald-950/60 mix-blend-multiply" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-emerald-950/70 to-transparent" />
        </div>

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {particles.map((p) => (
            <span
              key={p}
              className="absolute block h-1.5 w-1.5 rounded-full bg-emerald-300/40 animate-float"
              style={{
                top: `${10 + (p * 7) % 80}%`,
                left: `${(p * 13) % 90}%`,
                animationDelay: `${(p % 6) * 0.7}s`,
              }}
              aria-hidden
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-emerald-200/80">
            The Wedding of
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-wide [text-shadow:0_1px_12px_rgba(0,0,0,.25)]">
            <span className="inline-block animate-fade-in">Aisyah</span>
            <span className="mx-3 inline-block text-emerald-300/90">&</span>
            <span className="inline-block animate-fade-in [animation-delay:.15s]">Brahma</span>
          </h1>
          <p className="mt-4 text-emerald-100/90">
            Kami mengundang Anda untuk hadir dan menjadi saksi momen bahagia kami.
          </p>

          {/* Countdown */}
          <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-4">
            {([
              ["Hari", days],
              ["Jam", hours],
              ["Menit", minutes],
              ["Detik", seconds],
            ] as const).map(([label, val], i) => (
              <div
                key={label}
                className="rounded-2xl border border-emerald-300/20 bg-emerald-900/50 px-2 py-4 sm:px-4 sm:py-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,.25)] animate-fade-in-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-semibold tabular-nums">
                  {zeroPad(val)}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-emerald-100/75">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#rsvp"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("rsvp");
              }}
              className="group inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-6 py-3 text-sm font-medium tracking-wide hover:bg-emerald-400/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              Konfirmasi Kehadiran
              <span className="transition group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#acara"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("acara");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 px-6 py-3 text-sm tracking-wide hover:bg-emerald-300/10 transition"
            >
              Lihat Detail Acara
            </a>
          </div>

          <p className="mt-6 text-sm text-emerald-100/70">
            {formatDate(WEDDING_DATE, "full", "short")}
          </p>
        </div>
      </section>

      {/* MEMPELAI */}
      <section id="mempelai" className="section">
        <Container>
          <SectionHeading eyebrow="Assalamu’alaikum Wr. Wb." title="Mempelai">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan
            pernikahan kami dan berharap kehadiran Bapak/Ibu/Saudara/i untuk memberikan doa
            restu.
          </SectionHeading>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              {
                name: "Aisyah Putri",
                desc:
                  "Putri dari Bapak Ahmad & Ibu Siti. Lembut, ceria, dan mencintai seni fotografi.",
              },
              {
                name: "Brahma Pradana",
                desc:
                  "Putra dari Bapak Budi & Ibu Lestari. Tenang, setia, dan penggemar musik klasik.",
              },
            ].map((p, i) => (
              <div
                key={p.name}
                className="group rounded-3xl border border-emerald-300/20 bg-emerald-900/40 p-4 sm:p-6 backdrop-blur-xl transition hover:translate-y-[-2px] hover:border-emerald-300/30"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={PLACEHOLDER_IMG}
                    alt={p.name}
                    className="h-20 w-20 rounded-2xl object-cover ring-1 ring-emerald-300/30"
                  />
                  <div>
                    <h3 className="font-serif text-xl">{p.name}</h3>
                    <p className="text-sm text-emerald-100/80">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ACARA */}
      <section id="acara" className="section">
        <Container>
          <SectionHeading eyebrow="Save the Date" title="Informasi Acara">
            Berikut ini adalah waktu dan lokasi acara. Mohon hadir dengan tepat waktu.
          </SectionHeading>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-3xl border border-emerald-300/20 bg-emerald-900/40 p-6 backdrop-blur-xl">
              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                <InfoRow label="Akad Nikah" value="Minggu, 14 Des 2025 • 10:00 WIB" />
                <InfoRow label="Resepsi" value="Minggu, 14 Des 2025 • 12:00–15:00 WIB" />
                <InfoRow label="Lokasi" value="The Emerald Hall, Jl. Anggrek No. 12, Jakarta" />
                <InfoRow label="Dress Code" value="Formal • Nuansa Emerald & Champagne" />
                <InfoRow
                  label="Catatan"
                  value="Harap menjaga ketenangan saat prosesi akad. Mohon konfirmasi kehadiran melalui form RSVP."
                />
              </dl>
            </div>

            <div className="rounded-3xl overflow-hidden border border-emerald-300/20 bg-emerald-950/40">
              <iframe
                title="Lokasi Acara - Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.969461437036!2d112.750!3d-7.168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMTAnMDQuOCJTIDExMsKwNDUnMDAuMCJF!5e0!3m2!1sen!2sid!4v1680000000000"
                width="100%"
                height="360"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* GALERI */}
      <section id="galeri" className="section">
        <Container>
          <SectionHeading eyebrow="Our Moments" title="Galeri Foto">
            Kenangan yang kami abadikan dalam perjalanan cinta kami.
          </SectionHeading>

          <div className="relative mt-8 rounded-3xl overflow-hidden border border-emerald-300/20 bg-emerald-900/30 max-w-5xl px-4 xl:px-0 mx-auto">
            {/* Slides */}
            <div
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              className="relative aspect-[16/9] max-h-[70vh] w-full"
            >
              {galleryImages.map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  alt={img.alt}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === galIndex ? "opacity-100" : "opacity-0"
                    }`}
                  draggable={false}
                />
              ))}
              {/* Overlay gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
            </div>

            {/* Controls */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
              <button
                onClick={() =>
                  setGalIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)
                }
                aria-label="Sebelumnya"
                className="control-btn"
              >
                ‹
              </button>
              <div className="flex items-center gap-1.5">
                {galleryImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setGalIndex(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2.5 w-2.5 rounded-full transition ${i === galIndex ? "bg-emerald-300" : "bg-emerald-300/30 hover:bg-emerald-300/60"
                      }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setGalIndex((i) => (i + 1) % galleryImages.length)}
                aria-label="Berikutnya"
                className="control-btn"
              >
                ›
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* CERITA */}
      <section id="cerita" className="section">
        <Container>
          <SectionHeading eyebrow="Our Story" title="Kisah Perjalanan">
            Beberapa momen penting yang membawa kami sampai ke hari ini.
          </SectionHeading>

          <ol className="mt-10 relative border-l border-emerald-300/20 pl-6">
            {[
              {
                t: "2019",
                h: "Pertemuan Pertama",
                d: "Kami bertemu di sebuah acara komunitas fotografi dan mulai berbagi cerita.",
              },
              {
                t: "2021",
                h: "Komitmen",
                d: "Memutuskan untuk serius melangkah bersama, melewati suka dan duka.",
              },
              {
                t: "2024",
                h: "Lamaran",
                d: "Momen hangat bersama keluarga, menjadi awal babak baru.",
              },
              {
                t: "2025",
                h: "Menuju Pelaminan",
                d: "Dengan doa dan restu, kami siap melangkah ke jenjang pernikahan.",
              },
            ].map((it, i) => (
              <li key={i} className="mb-10 ml-2 animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <span className="absolute -left-1.5 mt-1 flex h-3 w-3 items-center justify-center">
                  <span className="h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_0_6px_rgba(16,185,129,.15)]" />
                </span>
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-900/40 p-4 backdrop-blur-xl">
                  <div className="text-xs text-emerald-200/70">{it.t}</div>
                  <h4 className="font-serif text-xl">{it.h}</h4>
                  <p className="text-emerald-100/80">{it.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="section">
        <Container>
          <SectionHeading eyebrow="Be Our Guest" title="Konfirmasi Kehadiran">
            Mohon isi form berikut untuk membantu kami mempersiapkan tempat terbaik untuk Anda.
          </SectionHeading>

          <form
            onSubmit={onSubmitRSVP}
            className="mt-8 grid gap-4 rounded-3xl border border-emerald-300/20 bg-emerald-900/40 p-6 backdrop-blur-xl"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nama Lengkap">
                <input
                  required
                  name="name"
                  placeholder="Nama Anda"
                  className="input"
                />
              </Field>

              <Field label="Email">
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="email@contoh.com"
                  className="input"
                />
              </Field>

              <Field label="Nomor WhatsApp">
                <input
                  type="tel"
                  name="phone"
                  placeholder="+62..."
                  className="input"
                />
              </Field>

              <Field label="Kehadiran">
                <select name="attendance" className="input">
                  <option value="hadir">Hadir</option>
                  <option value="tidak">Tidak dapat hadir</option>
                </select>
              </Field>

              <Field label="Jumlah Tamu">
                <input
                  type="number"
                  min={1}
                  name="guests"
                  placeholder="1"
                  className="input"
                />
              </Field>

              <Field label="Ucapan">
                <input
                  name="message"
                  placeholder="Doa & ucapan untuk mempelai"
                  className="input"
                />
              </Field>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button type="submit" className="btn-primary">
                Kirim Konfirmasi
              </button>
              <a
                href="https://forms.gle/"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                Isi via Google Form
              </a>
            </div>
          </form>
        </Container>
      </section>

      {/* HADIAH */}
      <section id="hadiah" className="section">
        <Container>
          <SectionHeading eyebrow="With Love" title="Hadiah">
            Doa restu adalah hadiah terbaik. Jika berkenan mengirim hadiah, berikut opsinya.
          </SectionHeading>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-emerald-300/20 bg-emerald-900/40 p-6 backdrop-blur-xl">
              <h4 className="font-serif text-xl mb-3">Transfer Bank</h4>
              <div className="grid gap-3">
                <GiftRow
                  bank="BCA"
                  name="Aisyah Putri"
                  number="1234567890"
                  onCopy={() => copyText("BCA 1234567890 a.n. Aisyah Putri")}
                />
                <GiftRow
                  bank="Mandiri"
                  name="Brahma Pradana"
                  number="9876543210"
                  onCopy={() => copyText("Mandiri 9876543210 a.n. Brahma Pradana")}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-300/20 bg-emerald-900/40 p-6 backdrop-blur-xl">
              <h4 className="font-serif text-xl mb-3">E-Wallet / QRIS</h4>
              <div className="flex items-center gap-4">
                <img
                  src={PLACEHOLDER_IMG}
                  alt="QRIS"
                  className="h-36 w-36 rounded-xl object-cover ring-1 ring-emerald-300/30"
                />
                <div className="grid gap-2">
                  <a href="#" className="btn-chip">OVO</a>
                  <a href="#" className="btn-chip">GoPay</a>
                  <a href="#" className="btn-chip">DANA</a>
                  <a href="#" className="btn-chip">LinkAja</a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="section pb-24">
        <Container>
          <SectionHeading eyebrow="Questions" title="FAQ">
            Beberapa pertanyaan yang sering ditanyakan.
          </SectionHeading>

          <div className="mt-8 divide-y divide-emerald-300/10 rounded-3xl border border-emerald-300/20 bg-emerald-900/40 backdrop-blur-xl">
            {[
              {
                q: "Apakah saya boleh membawa anak?",
                a: "Tentu, acara kami ramah keluarga. Mohon diinformasikan jumlah tamu pada form RSVP.",
              },
              {
                q: "Apakah ada parkir?",
                a: "Tersedia area parkir di venue, namun jumlah terbatas. Disarankan datang lebih awal.",
              },
              {
                q: "Bolehkah memberikan karangan bunga?",
                a: "Boleh. Silakan kirim ke alamat venue pada hari H.",
              },
              {
                q: "Dress code seperti apa?",
                a: "Formal / semi-formal dengan nuansa Emerald & Champagne.",
              },
            ].map((item, i) => (
              <Accordion key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </Container>
      </section>

      <footer className="relative border-t border-emerald-300/20 bg-emerald-950/80 backdrop-blur-xl text-emerald-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-10 md:grid-cols-3">
            {/* Brand / Quotes */}
            <div>
              <h3 className="font-serif text-2xl">Aisyah & Brahma</h3>
              <p className="mt-2 text-emerald-100/70 text-sm leading-relaxed">
                “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan
                untukmu pasangan-pasangan dari jenismu sendiri, agar kamu merasa
                tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan
                sayang.” <br />
                <span className="italic text-emerald-200/70">
                  (QS. Ar-Rum: 21)
                </span>
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:text-center">
              <h4 className="font-semibold mb-3">Navigasi</h4>
              <ul className="space-y-2">
                {[
                  { id: "mempelai", label: "Mempelai" },
                  { id: "acara", label: "Acara" },
                  { id: "galeri", label: "Galeri" },
                  { id: "cerita", label: "Cerita" },
                  { id: "rsvp", label: "RSVP" },
                  { id: "hadiah", label: "Hadiah" },
                  { id: "faq", label: "FAQ" },
                ].map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="transition hover:text-emerald-300 hover:underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact / Social */}
            <div className="md:text-right">
              <h4 className="font-semibold mb-3">Kontak</h4>
              <p className="text-sm text-emerald-100/80">Telp/WA: +62 812-3456-7890</p>
              <p className="text-sm text-emerald-100/80">Email: aisyah.brahma@wedding.id</p>
              <div className="mt-4 flex gap-3 md:justify-end">
                {[
                  { name: "Instagram", href: "#", icon: "📸" },
                  { name: "YouTube", href: "#", icon: "▶️" },
                  { name: "TikTok", href: "#", icon: "🎵" },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-900/40 transition hover:scale-110 hover:bg-emerald-300/20"
                    aria-label={s.name}
                  >
                    <span className="text-lg">{s.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-10 border-t border-emerald-300/10 pt-6 text-center text-sm text-emerald-100/60">
            © {new Date().getFullYear()} Aisyah & Brahma Wedding. All Rights Reserved.
            <br />
            <span className="text-emerald-100/50">
              Made with ❤ using Next.js & Tailwind CSS
            </span>
          </div>
        </div>
      </footer>

      {/* Toast */}
      <div
        className={`fixed left-1/2 top-20 z-[60] -translate-x-1/2 transform rounded-full border border-emerald-300/20 bg-emerald-950/80 px-4 py-2 text-sm shadow-lg backdrop-blur-xl transition ${toastMsg ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        role="status"
        aria-live="polite"
      >
        {toastMsg}
      </div>

      {/* Global styles for animations & utilities */}
      <style jsx global>{`
        .section {
          padding-top: 6rem;
          padding-bottom: 6rem;
        }
        @media (min-width: 768px) {
          .section {
            padding-top: 7rem;
            padding-bottom: 7rem;
          }
        }
        .control-btn {
          @apply inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-950/50 backdrop-blur-xl hover:bg-emerald-800/60 transition;
        }
        .btn-primary {
          @apply inline-flex items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/20 px-6 py-3 text-sm font-medium tracking-wide hover:bg-emerald-400/30 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300;
        }
        .btn-ghost {
          @apply inline-flex items-center justify-center rounded-full border border-emerald-300/20 px-6 py-3 text-sm tracking-wide hover:bg-emerald-300/10 transition;
        }
        .btn-chip {
          @apply inline-flex items-center justify-center rounded-full border border-emerald-300/20 px-4 py-2 text-xs tracking-wide hover:bg-emerald-300/10 transition;
        }
        .input {
          @apply w-full rounded-xl border border-emerald-300/20 bg-emerald-950/40 px-4 py-3 outline-none placeholder:text-emerald-100/40 focus:border-emerald-300/50 focus:ring-1 focus:ring-emerald-300/30;
        }

        /* Animations */
        @keyframes fade-in {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        .animate-fade-in { animation: fade-in .9s both; }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(6px) }
          to { opacity: 1; transform: translateY(0) }
        }
        .animate-fade-in-up { animation: fade-in-up .7s both; }

        @keyframes float {
          0% { transform: translateY(0) }
          50% { transform: translateY(-10px) }
          100% { transform: translateY(0) }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </main>
  );
}

/* ------------------------ Subcomponents ------------------------ */

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {eyebrow && (
        <div className="mb-2 text-xs uppercase tracking-[0.35em] text-emerald-200/80">
          {eyebrow}
        </div>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl">{title}</h2>
      {children && <p className="mt-3 text-emerald-100/80">{children}</p>}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-emerald-300/10 bg-emerald-950/40 p-4">
      <dt className="text-xs uppercase tracking-wider text-emerald-200/70">{label}</dt>
      <dd className="font-serif text-lg">{value}</dd>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm text-emerald-100/80">{label}</span>
      {children}
    </label>
  );
}

function GiftRow({
  bank,
  name,
  number,
  onCopy,
}: {
  bank: string;
  name: string;
  number: string;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-300/10 bg-emerald-950/40 p-4">
      <div>
        <div className="text-sm text-emerald-100/80">{bank}</div>
        <div className="font-serif text-lg leading-tight">{number}</div>
        <div className="text-xs text-emerald-100/70">a.n. {name}</div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onCopy} className="btn-chip">Salin</button>
        <a href="#" className="btn-chip">Kirim</a>
      </div>
    </div>
  );
}

function Accordion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-4 sm:px-6">
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-medium">{question}</span>
        <span
          className={`ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-300/20 transition ${open ? "bg-emerald-300/20 rotate-180" : "bg-emerald-950/40"
            }`}
          aria-hidden
        >
          ˅
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="overflow-hidden pb-4 text-emerald-100/80">{answer}</div>
      </div>
      <div className="mx-4 border-b border-emerald-300/10" />
    </div>
  );
}

/* ------------------------ Utilities ------------------------ */

function getCountdown(dateStr: string): Countdown {
  const now = new Date().getTime();
  const target = new Date(dateStr).getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);
  return { days, hours, minutes, seconds };
}

function zeroPad(n: number) {
  return String(n).padStart(2, "0");
}
