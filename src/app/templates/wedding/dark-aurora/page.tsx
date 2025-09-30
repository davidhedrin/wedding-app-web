"use client";

import React, { useEffect, useRef, useState } from "react";
import { Playfair_Display, Lora, Great_Vibes } from "next/font/google";
import useCountdown from "@/lib/countdown";

/**
 * Invitation Type: Wedding
 * Theme Name: "Dark Aurora"
 * Create At: 09-09-2025
 * Create By: David
*/

// === FONTS ===
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-greatvibes" });

// === THEME ===
const THEME = {
  // Tema elegan dark navy + aksen emas
  bgGradient: "from-slate-950 via-indigo-950 to-slate-900",
  card: "bg-white/5 backdrop-blur-md border border-white/10",
  ring: "ring-1 ring-amber-300/30",
  goldText: "text-amber-300",
  gold: "bg-amber-300",
  goldSoft: "bg-amber-200/20",
  link: "text-amber-300 hover:text-amber-200",
  heading: "text-slate-100",
  body: "text-slate-200/90",
};

// === DATA DUMMY: SESUAIKAN ===
const COUPLE = {
  groom: { name: "Fajar Pratama", desc: "Putra pertama dari Bpk. Pratama & Ibu Sari" },
  bride: { name: "Anindya Sarasvati", desc: "Putri kedua dari Bpk. Handoyo & Ibu Retno" },
  // Tanggal pernikahan (YYYY-MM-DDTHH:mm:ss lokal)
  venueName: "The Grand Atrium",
  venueAddress: "Jl. Kemang Raya No. 88, Jakarta Selatan",
  dressCode: "Formal / Touch of Gold",
  extraInfo: "Mohon hadir 15 menit sebelum acara dimulai.",
  // GMaps embed (contoh Istiqlal – bebas ganti)
  gmapsSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d997.8231467925161!2d106.8317317!3d-6.169963699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d67f2b7f1f%3A0xe9a0e6f3c0b02f!2sIstiqlal%20Mosque!5e0!3m2!1sen!2sid!4v1696755555555!5m2!1sen!2sid",
};

const PLACEHOLDER_IMG = "http://localhost:3005/assets/img/2149043983.jpg";
const HERO_IMAGES = [PLACEHOLDER_IMG, PLACEHOLDER_IMG, PLACEHOLDER_IMG]; // bisa diganti variasi
const GALLERY_IMAGES = Array.from({ length: 10 }, () => PLACEHOLDER_IMG);

// === HELPER: SCROLL ===
const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 76; // offset header
  window.scrollTo({ top: y, behavior: "smooth" });
};

const WEDDING_DATE = new Date();
WEDDING_DATE.setDate(WEDDING_DATE.getDate() + 12);

// === COMPONENT ===
export default function WeddingInvitationPage() {
  // Countdown
  const { days, hours, minutes, seconds, isExpired } = useCountdown(WEDDING_DATE.toString());

  // Hero background carousel sederhana
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_IMAGES.length), 4500);
    return () => clearInterval(t);
  }, []);

  // Gallery slider (drag + auto)
  const [galleryIdx, setGalleryIdx] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const perView = 1; // mobile default
  useEffect(() => {
    const t = setInterval(() => setGalleryIdx((i) => (i + 1) % GALLERY_IMAGES.length), 4000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    galleryRef.current?.scrollTo({ left: galleryIdx * (galleryRef.current.clientWidth || 0), behavior: "smooth" });
  }, [galleryIdx]);

  // RSVP state (dummy submission)
  const [rsvp, setRsvp] = useState({ name: "", phone: "", guests: 1, attend: "Hadir", message: "" });
  const [rsvpSent, setRsvpSent] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Smooth active section highlight
  const sections = [
    { id: "mempelai", label: "Mempelai" },
    { id: "acara", label: "Acara" },
    { id: "galeri", label: "Galeri" },
    { id: "cerita", label: "Cerita" },
    { id: "rsvp", label: "RSVP" },
    { id: "hadiah", label: "Hadiah" },
    { id: "faq", label: "FAQ" },
  ];
  const [active, setActive] = useState(sections[0].id);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-50% 0px -45% 0px", threshold: 0.01 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <main className={`${playfair.variable} ${lora.variable} ${greatVibes.variable} scroll-smooth min-h-screen bg-gradient-to-br ${THEME.bgGradient}`}>
      {/* ===== Sticky Header ===== */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <nav
            className={`mt-3 flex items-center justify-between rounded-2xl ${THEME.card} ${THEME.ring} px-3 py-2`}
            aria-label="Main Navigation"
          >
            <button
              onClick={() => scrollToId("hero")}
              className="group flex items-center gap-2 rounded-xl px-3 py-1.5 transition"
              aria-label="Kembali ke atas"
            >
              <span className="font-[var(--font-greatvibes)] text-2xl leading-none text-amber-300 group-hover:scale-105 transition">
                F
              </span>
              <span className="font-[var(--font-greatvibes)] text-2xl leading-none text-amber-300 group-hover:scale-105 transition">
                &
              </span>
              <span className="font-[var(--font-greatvibes)] text-2xl leading-none text-amber-300 group-hover:scale-105 transition">
                A
              </span>
              <span className="sr-only">Beranda</span>
            </button>
            <ul className="flex items-center gap-1 overflow-x-auto">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => scrollToId(s.id)}
                    className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm md:text-[15px] transition hover:bg-white/10 ${active === s.id ? "text-amber-200" : "text-slate-100/80"
                      }`}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => scrollToId("rsvp")}
              className="hidden sm:inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium bg-amber-300 text-slate-900 hover:brightness-110 active:scale-[0.98] transition"
            >
              Konfirmasi
            </button>
          </nav>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section id="hero" className="relative h-[92svh] min-h-[560px] w-full overflow-hidden">
        {/* Background Carousel */}
        <div className="absolute inset-0">
          {HERO_IMAGES.map((src, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-[1500ms]"
              style={{ opacity: heroIdx === i ? 1 : 0 }}
              aria-hidden={heroIdx !== i}
            >
              {/* pakai Image untuk optimasi; bisa juga pakai div bg-cover */}
              <img src={src} alt={`Hero ${i + 1}`} className="object-cover h-svh w-full" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-slate-950/70 to-slate-950/95" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full">
          <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 text-center">
            <p className="font-[var(--font-greatvibes)] text-4xl sm:text-5xl md:text-6xl text-amber-300 drop-shadow">
              Undangan Pernikahan
            </p>
            <h1 className={`mt-3 text-3xl sm:text-5xl md:text-6xl font-semibold ${THEME.heading} tracking-tight`}>
              {COUPLE.groom.name} <span className="font-[var(--font-greatvibes)] text-amber-300">&</span> {COUPLE.bride.name}
            </h1>
            <p className={`mt-4 max-w-2xl ${THEME.body} font-[var(--font-lora)]`}>
              Dengan penuh rasa syukur, kami mengundang Anda untuk hadir dan memberikan doa restu pada hari bahagia kami.
            </p>

            {/* Countdown */}
            <div
              className={`mt-8 grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-2xl ${THEME.card} ${THEME.ring} rounded-2xl p-3 sm:p-4`}
              aria-label="Hitung Mundur"
            >
              {[
                { label: "Hari", value: days },
                { label: "Jam", value: hours },
                { label: "Menit", value: minutes },
                { label: "Detik", value: seconds },
              ].map((it) => (
                <div key={it.label} className="flex flex-col items-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-100 tabular-nums">{it.value}</div>
                  <div className="mt-1 text-[11px] sm:text-xs uppercase tracking-wider text-slate-300/80">{it.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => scrollToId("mempelai")}
                className="group inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium bg-amber-300 text-slate-900 shadow-lg shadow-amber-900/20 hover:shadow-amber-800/30 hover:translate-y-[-1px] active:translate-y-0 transition"
              >
                Buka Undangan
                <span className="inline-block translate-x-0 group-hover:translate-x-0.5 transition">↗</span>
              </button>
              <button
                onClick={() => scrollToId("rsvp")}
                className="inline-flex items-center rounded-2xl px-5 py-3 text-sm font-medium border border-amber-300/50 text-amber-200 hover:bg-amber-200/10 transition"
              >
                RSVP Sekarang
              </button>
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-24 bg-gradient-to-b from-transparent to-slate-950" />
      </section>

      {/* ===== Mempelai ===== */}
      <Section id="mempelai" title="Mempelai">
        <div className="grid gap-6 md:grid-cols-2">
          {[COUPLE.groom, COUPLE.bride].map((p, idx) => (
            <div
              key={p.name}
              className={`group overflow-hidden rounded-3xl ${THEME.card} ${THEME.ring} p-5 sm:p-6 grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] gap-4`}
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <img src={PLACEHOLDER_IMG} alt={p.name} className="object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className={`text-xl sm:text-2xl font-semibold ${THEME.heading}`}>{p.name}</h3>
                <p className={`mt-1 text-sm ${THEME.body} font-[var(--font-lora)]`}>{p.desc}</p>
                <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
                <p className="mt-3 text-sm text-slate-200/80">
                  “Dengan ridho Allah SWT dan doa restu Bapak/Ibu/Saudara/i, kami akan melangsungkan akad dan resepsi pernikahan.”
                </p>
              </div>
            </div>
          ))}
        </div>
        <blockquote className="mt-8 mx-auto max-w-3xl text-center font-[var(--font-lora)] text-slate-200/90 italic">
          “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu...” (QS. Ar-Rum: 21)
        </blockquote>
      </Section>

      {/* ===== Acara ===== */}
      <Section id="acara" title="Acara">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className={`rounded-3xl ${THEME.card} ${THEME.ring} p-6`}>
            <h4 className="text-xl font-semibold text-slate-100">Waktu & Tempat</h4>
            <ul className="mt-4 space-y-3 text-slate-200/90">
              <li>
                <span className="font-semibold">Akad:</span> Sabtu, 20 Desember 2025 — 10.00 WIB
              </li>
              <li>
                <span className="font-semibold">Resepsi:</span> Sabtu, 20 Desember 2025 — 12.00-15.00 WIB
              </li>
              <li>
                <span className="font-semibold">Tempat:</span> {COUPLE.venueName}, {COUPLE.venueAddress}
              </li>
            </ul>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoChip label="Dress Code" value={COUPLE.dressCode} />
              <InfoChip label="Catatan" value={COUPLE.extraInfo} />
            </div>
          </div>

          <div className={`overflow-hidden rounded-3xl ${THEME.card} ${THEME.ring}`}>
            <iframe
              title="Lokasi Acara"
              src={COUPLE.gmapsSrc}
              className="h-[320px] w-full md:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Section>

      {/* ===== Galeri ===== */}
      <Section id="galeri" title="Galeri">
        <div className={`relative overflow-hidden rounded-3xl ${THEME.card} ${THEME.ring}`}>
          {/* Slides */}
          <div className="relative h-[54svh] min-h-[320px] w-full">
            {GALLERY_IMAGES.map((src, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${galleryIdx === i ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
              >
                <img
                  src={src}
                  alt={`Galeri ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
              </div>
            ))}
          </div>

          {/* Indicator dots */}
          <div className="absolute inset-x-0 bottom-3 z-30 flex items-center justify-center gap-2">
            {GALLERY_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setGalleryIdx(i)}
                className={`h-2 w-2 rounded-full transition-all ${i === galleryIdx ? "bg-amber-300 scale-110" : "bg-white/40 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>

          {/* Navigation controls */}
          <button
            aria-label="Sebelumnya"
            onClick={() => setGalleryIdx((i) => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
            className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-3 text-lg text-white backdrop-blur hover:bg-black/60 transition"
          >
            ‹
          </button>
          <button
            aria-label="Berikutnya"
            onClick={() => setGalleryIdx((i) => (i + 1) % GALLERY_IMAGES.length)}
            className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-3 text-lg text-white backdrop-blur hover:bg-black/60 transition"
          >
            ›
          </button>
        </div>
      </Section>


      {/* ===== Cerita (Timeline) ===== */}
      <Section id="cerita" title="Cerita Kami">
        <ol className="relative ms-4 space-y-8 before:absolute before:left-3 before:top-1 before:h-full before:w-px before:bg-amber-300/40">
          {[
            { t: "2019", title: "Pertama Berjumpa", desc: "Bertemu di sebuah acara kampus dan mulai saling mengenal." },
            { t: "2021", title: "Menjalin Komitmen", desc: "Memutuskan untuk serius menjalani hubungan." },
            { t: "2024", title: "Lamaran", desc: "Prosesi lamaran sederhana bersama keluarga terdekat." },
            { t: "2025", title: "Menuju Ijab Kabul", desc: "Menanti hari penuh doa dan kebahagiaan." },
          ].map((item, idx) => (
            <li key={idx} className="relative">
              <span className="absolute -left-[26px] top-1 grid h-5 w-5 place-items-center rounded-full bg-amber-300/90 text-slate-900 text-xs font-bold shadow ring-2 ring-slate-900">
                {idx + 1}
              </span>
              <div className={`rounded-2xl ${THEME.card} ${THEME.ring} p-4 sm:p-5`}>
                <div className="flex items-center gap-2 text-slate-300/90 text-sm">
                  <span className="font-medium">{item.t}</span>
                  <span className="h-1 w-1 rounded-full bg-amber-300/80" />
                  <span>{item.title}</span>
                </div>
                <p className="mt-2 text-slate-200/90">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* ===== RSVP ===== */}
      <Section id="rsvp" title="RSVP">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Di proyek nyata, kirim ke API/Sheet.
            setRsvpSent(true);
            setTimeout(() => setRsvpSent(false), 3500);
          }}
          className={`grid gap-4 rounded-3xl ${THEME.card} ${THEME.ring} p-6 sm:p-7`}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama Lengkap">
              <input
                required
                value={rsvp.name}
                onChange={(e) => setRsvp((s) => ({ ...s, name: e.target.value }))}
                className="w-full rounded-xl bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-300/50 outline-none ring-1 ring-white/10 focus:ring-amber-300/50"
                placeholder="Nama Anda"
              />
            </Field>
            <Field label="No. WhatsApp">
              <input
                required
                inputMode="tel"
                value={rsvp.phone}
                onChange={(e) => setRsvp((s) => ({ ...s, phone: e.target.value }))}
                className="w-full rounded-xl bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-300/50 outline-none ring-1 ring-white/10 focus:ring-amber-300/50"
                placeholder="08xxxxxxxxxx"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Jumlah Tamu">
              <input
                required
                type="number"
                min={1}
                max={10}
                value={rsvp.guests}
                onChange={(e) => setRsvp((s) => ({ ...s, guests: Number(e.target.value) }))}
                className="w-full rounded-xl bg-white/5 px-4 py-3 text-slate-100 outline-none ring-1 ring-white/10 focus:ring-amber-300/50"
              />
            </Field>
            <Field label="Kehadiran">
              <select
                value={rsvp.attend}
                onChange={(e) => setRsvp((s) => ({ ...s, attend: e.target.value }))}
                className="w-full rounded-xl bg-white/5 px-4 py-3 text-slate-100 outline-none ring-1 ring-white/10 focus:ring-amber-300/50"
              >
                <option>Hadir</option>
                <option>Berhalangan</option>
              </select>
            </Field>
          </div>

          <Field label="Ucapan / Doa (opsional)">
            <textarea
              rows={4}
              value={rsvp.message}
              onChange={(e) => setRsvp((s) => ({ ...s, message: e.target.value }))}
              className="w-full rounded-xl bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-300/50 outline-none ring-1 ring-white/10 focus:ring-amber-300/50"
              placeholder="Tulis ucapan hangat untuk kedua mempelai..."
            />
          </Field>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-300/80">Data Anda hanya digunakan untuk keperluan konfirmasi.</span>
            <button
              type="submit"
              className="inline-flex items-center rounded-xl px-5 py-3 text-sm font-semibold bg-amber-300 text-slate-900 hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-amber-900/20"
            >
              Kirim RSVP
            </button>
          </div>

          {/* Toast */}
          <div
            className={`pointer-events-none fixed inset-x-0 bottom-6 z-50 mx-auto w-fit translate-y-8 rounded-2xl px-4 py-2 text-sm text-slate-900 transition ${rsvpSent ? "opacity-100 translate-y-0 bg-amber-300 shadow-lg" : "opacity-0"
              }`}
            aria-live="polite"
          >
            Terima kasih! RSVP Anda telah terekam.
          </div>
        </form>
      </Section>

      {/* ===== Hadiah ===== */}
      <Section id="hadiah" title="Hadiah">
        <div className={`grid gap-6 md:grid-cols-2`}>
          <div className={`rounded-3xl ${THEME.card} ${THEME.ring} p-6`}>
            <h4 className="text-lg font-semibold text-slate-100">Kado Digital</h4>
            <p className="mt-2 text-slate-200/90">
              Kehadiran dan doa adalah hadiah terbaik. Namun bila berkenan, Anda dapat mengirimkan tanda kasih melalui:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {/* Contoh Rekening/E-Wallet */}
              <GiftCard bank="BCA" name="Anindya Sarasvati" number="1234567890" />
              <GiftCard bank="BCA" name="Fajar Pratama" number="0987654321" />
              <GiftCard bank="DANA" name="Anindya" number="0812-xxxx-xxxx" />
              <GiftCard bank="OVO" name="Fajar" number="0813-xxxx-xxxx" />
            </div>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-xl border border-amber-300/50 px-4 py-2 text-sm text-amber-200 hover:bg-amber-200/10 transition"
              >
                Salin Semua Info
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:brightness-110 transition"
              >
                Kirim via Link
              </a>
            </div>
          </div>

          <div className={`overflow-hidden rounded-3xl ${THEME.card} ${THEME.ring} p-0`}>
            <div className="relative h-full min-h-[280px]">
              <img src={PLACEHOLDER_IMG} alt="Hadiah" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-[var(--font-greatvibes)] text-3xl text-amber-300">Terima kasih</p>
                <p className="text-slate-200/90">Atas doa, dukungan, dan kasih sayang yang Anda berikan.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ===== FAQ ===== */}
      <Section id="faq" title="FAQ">
        <div className="grid gap-3">
          {[
            { q: "Apakah anak-anak diperbolehkan hadir?", a: "Tentu, mohon pendampingan orang tua selama acara." },
            { q: "Apakah ada parkir di lokasi?", a: "Tersedia area parkir gedung dan valet service." },
            { q: "Kapan waktu terbaik untuk datang?", a: "Sebaiknya 10–15 menit sebelum acara dimulai." },
            { q: "Apakah wajib RSVP?", a: "Iya, agar kami dapat menyiapkan kursi dan konsumsi dengan optimal." },
          ].map((f, idx) => (
            <div key={idx} className={`rounded-2xl ${THEME.card} ${THEME.ring}`}>
              <button
                onClick={() => setOpenFaq((o) => (o === idx ? null : idx))}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                aria-expanded={openFaq === idx}
              >
                <span className="font-medium text-slate-100">{f.q}</span>
                <span className="text-amber-300">{openFaq === idx ? "−" : "+"}</span>
              </button>
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${openFaq === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden px-4 pb-4 text-slate-200/90">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== Footer ===== */}
      <footer className="mt-16 border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-[var(--font-greatvibes)] text-3xl text-amber-300">F & A</span>
              </div>
              <p className="mt-3 text-sm text-slate-300/90">
                Terima kasih telah menjadi bagian dari hari bahagia kami. Sampai jumpa di acara!
              </p>
            </div>
            <div>
              <h5 className="text-slate-100 font-semibold">Navigasi</h5>
              <ul className="mt-3 space-y-2">
                {sections.map((s) => (
                  <li key={`f-${s.id}`}>
                    <button onClick={() => scrollToId(s.id)} className={`${THEME.link} text-sm`}>
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-slate-100 font-semibold">Acara</h5>
              <ul className="mt-3 space-y-2 text-sm text-slate-300/90">
                <li>{COUPLE.venueName}</li>
                <li>{COUPLE.venueAddress}</li>
                <li>Sabtu, 20 Desember 2025</li>
              </ul>
            </div>
            <div>
              <h5 className="text-slate-100 font-semibold">Kontak</h5>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="https://wa.me/6281234567890" className={THEME.link}>
                    Hubungi via WhatsApp
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@wedding.com" className={THEME.link}>
                    Kirim Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
            <span>© {new Date().getFullYear()} Fajar & Anindya Wedding</span>
            <span>
              Made with <span className="text-amber-300">♥</span> | Tema{" "}
              <span className="text-amber-300">Royal Navy & Gold</span>
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

// ====== Sub Components ======
function Section({ id, title, children }: React.PropsWithChildren<{ id: string; title: string }>) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <header className="mb-8 text-center">
          <p className="font-[var(--font-greatvibes)] text-3xl text-amber-300">{title}</p>
          <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight">{title}</h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />
        </header>
        {children}
      </div>
    </section>
  );
}

function Field({ label, children }: React.PropsWithChildren<{ label: string }>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-200">{label}</span>
      {children}
    </label>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-amber-300/30 bg-amber-200/5 px-4 py-3">
      <div className="text-xs uppercase tracking-wider text-amber-200/90">{label}</div>
      <div className="mt-1 text-slate-100">{value}</div>
    </div>
  );
}

function GiftCard({ bank, name, number }: { bank: string; name: string; number: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${bank} • ${name} • ${number}`);
      alert("Disalin ke clipboard!");
    } catch {
      // fallback
    }
  };
  return (
    <div className="flex items-center justify-between rounded-xl border border-amber-300/30 bg-amber-200/5 p-4">
      <div>
        <div className="text-sm text-slate-300/80">{bank}</div>
        <div className="text-slate-100 font-medium">{name}</div>
        <div className="text-slate-200/80 text-sm">{number}</div>
      </div>
      <button
        onClick={copy}
        className="rounded-lg bg-amber-300 px-3 py-2 text-xs font-semibold text-slate-900 hover:brightness-110 transition"
      >
        Salin
      </button>
    </div>
  );
}
