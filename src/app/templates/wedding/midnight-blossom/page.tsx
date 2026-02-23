"use client";

import useCountdown from "@/lib/countdown";
import { formatDate } from "@/lib/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Invitation Type: Wedding
 * Theme Name: "Midnight Blossom"
 * Create At: 08-09-2025
 * Create By: David
*/

type NavItem = {
  id: string;
  label: string;
};

const WEDDING_DATE = new Date();
WEDDING_DATE.setDate(WEDDING_DATE.getDate() + 12);

const IMAGE_URL = "http://localhost:3005/assets/img/2149043983.jpg";

const navItems: NavItem[] = [
  { id: "mempelai", label: "Mempelai" },
  { id: "acara", label: "Acara" },
  { id: "galeri", label: "Galeri" },
  { id: "cerita", label: "Cerita" },
  { id: "rsvp", label: "RSVP" },
  { id: "hadiah", label: "Hadiah" },
  { id: "faq", label: "FAQ" },
];

function classNames(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
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

export default function UndanganPage() {
  const [opened, setOpened] = useState(false)
  useLockBodyScroll(!opened)

  const [active, setActive] = useState<string>(navItems[0].id);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
  const { days, hours, minutes, seconds, isExpired } = useCountdown(WEDDING_DATE.toString());

  // Smooth scroll handler
  const handleNavClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = sectionsRef.current[id];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  // Scroll spy
  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.25, 0.5, 0.75] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Hero background carousel (auto-play)
  const [slide, setSlide] = useState(0);
  const heroImages = useMemo(
    () => [IMAGE_URL, IMAGE_URL, IMAGE_URL, IMAGE_URL],
    []
  );
  useEffect(() => {
    const t = setInterval(
      () => setSlide((s) => (s + 1) % heroImages.length),
      4500
    );
    return () => clearInterval(t);
  }, [heroImages.length]);

  // Gallery slider
  const [galIndex, setGalIndex] = useState(0);
  const galleryImages = useMemo(
    () => new Array(8).fill(0).map((_, i) => `${IMAGE_URL}?v=${i}`),
    []
  );
  useEffect(() => {
    const t = setInterval(
      () => setGalIndex((i) => (i + 1) % galleryImages.length),
      3500
    );
    return () => clearInterval(t);
  }, [galleryImages.length]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Disalin ke clipboard ✅");
    } catch {
      alert("Gagal menyalin. Silakan salin manual.");
    }
  };

  return (
    <main className="relative min-h-screen text-neutral-100 bg-neutral-800 selection:bg-rose-300 selection:text-neutral-800">
      {/* Elegant radial gradient + subtle overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-linear-to-b from-neutral-800 via-neutral-800 to-black"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(60rem 60rem at 10% -10%, rgba(244,114,182,0.15), rgba(0,0,0,0) 70%), radial-gradient(50rem 50rem at 90% 110%, rgba(56,189,248,0.12), rgba(0,0,0,0) 70%)",
        }}
      />

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
              <div className="absolute inset-0 bg-linear-to-b from-neutral-80/60 via-neutral-800 to-black backdrop-blur-sm" />
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10 space-y-4"
            >
              <p className="tracking-widest uppercase text-sm mb-4 text-rose-200/90">Wedding Invitation</p>
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-tight">
                <span className="bg-clip-text text-transparent bg-linear-to-b from-neutral-50 to-neutral-300">
                  Aisyah & Raka
                </span>
              </h1>
              <p className="mt-4 text-lg">{formatDate(WEDDING_DATE, "full", "short")}</p>
              <p className="mt-2 italic text-white">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="font-semibold text-xl mt-1 text-white">Nama Tamu</p>

              <button
                onClick={() => setOpened(true)}
                className="px-4 py-2 rounded-md bg-rose-200 text-[#0b1221] font-semibold shadow hover:-translate-y-0.5 transition transform"
              >
                Buka Undangan
                <span className="inline-block translate-x-0 group-hover:translate-x-0.5 transition">↗</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mt-4 mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-black/20">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                heroRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-serif text-xl tracking-wide"
            >
              <span className="inline-block bg-clip-text text-transparent bg-linear-to-r from-rose-300 via-rose-200 to-rose-100">
                The Wedding
              </span>
            </a>

            <button
              className="sm:hidden rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5 transition"
              onClick={() => setMenuOpen((m) => !m)}
              aria-label="Toggle menu"
            >
              Menu
            </button>

            <ul
              className={classNames(
                "sm:flex gap-1 hidden",
                "text-sm font-medium"
              )}
            >
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={handleNavClick(item.id)}
                    className={classNames(
                      "rounded-full px-3 py-2 transition",
                      "hover:bg-white/5",
                      active === item.id
                        ? "text-rose-200 bg-white/5"
                        : "text-neutral-200"
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile dropdown */}
        <div
          className={classNames(
            "sm:hidden overflow-hidden transition-[max-height] duration-300",
            menuOpen ? "max-h-96" : "max-h-0"
          )}
        >
          <ul className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-3 space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={handleNavClick(item.id)}
                  className={classNames(
                    "block rounded-xl border border-white/10 px-4 py-3",
                    "bg-black/30 backdrop-blur hover:bg-white/5 transition"
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* HERO */}
      <section
        id="hero"
        ref={heroRef}
        className="relative isolate"
        aria-label="Hero"
      >
        {/* Background carousel */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-b-[2.5rem] border-b border-white/10">
          {heroImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className={classNames(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
                i === slide ? "opacity-100" : "opacity-0"
              )}
            />
          ))}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 sm:py-36 lg:py-44 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-rose-200/90">
            Undangan Pernikahan
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-tight">
            <span className="bg-clip-text text-transparent bg-linear-to-b from-neutral-50 to-neutral-300">
              Aisyah & Raka
            </span>
          </h1>
          <p className="mt-4 text-neutral-200/90 max-w-2xl mx-auto">
            {formatDate(WEDDING_DATE, "full", "short")}
          </p>

          {/* Countdown */}
          <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 px-6 py-4 backdrop-blur">
            {[
              { label: "Hari", value: days },
              { label: "Jam", value: hours },
              { label: "Menit", value: minutes },
              { label: "Detik", value: seconds },
            ].map((d, i) => (
              <div
                key={i}
                className="text-center px-3 py-2 rounded-xl bg-white/5 min-w-17.5"
              >
                <div className="text-3xl font-semibold tabular-nums">
                  {String(d.value).padStart(2, "0")}
                </div>
                <div className="text-xs mt-1 text-neutral-300">{d.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll cue */}
          <div className="mt-16 flex justify-center">
            <a
              href="#mempelai"
              onClick={handleNavClick("mempelai")}
              className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-neutral-100 transition hover:bg-white/10"
            >
              Lihat Detail
              <span className="inline-block translate-y-0 group-hover:translate-y-1 transition">
                ↓
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* MEMPELAI */}
      <Section id="mempelai" title="Mempelai" title2="Mempelai Berbahagia" sectionsRef={sectionsRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative">
            <div className="absolute -inset-2 rounded-3xl bg-linear-to-tr from-rose-300/20 via-rose-200/0 to-cyan-200/10 blur-2xl" />
            <img
              src={IMAGE_URL}
              alt="Foto Mempelai"
              className="relative rounded-3xl border border-white/10 shadow-2xl w-full object-cover aspect-4/3"
            />
          </div>
          <div>
            <h3 className="font-serif text-3xl text-rose-200">Aisyah</h3>
            <p className="text-neutral-300">
              Putri dari Bapak Ahmad & Ibu Siti.
            </p>

            <div className="my-6 h-px w-24 bg-linear-to-r from-rose-300/70 to-transparent" />

            <h3 className="font-serif text-3xl text-rose-200">Raka</h3>
            <p className="text-neutral-300">
              Putra dari Bapak Budi & Ibu Ratna.
            </p>

            <p className="mt-8 text-neutral-200 leading-relaxed">
              Dengan segala hormat, kami mengundang Bapak/Ibu/Saudara/i untuk
              hadir dan memberikan doa restu pada acara pernikahan kami.
              Kehadiran Anda merupakan kebahagiaan bagi kami.
            </p>
          </div>
        </div>
      </Section>

      {/* ACARA */}
      <Section id="acara" title="Acara" title2="Susunan Acara" sectionsRef={sectionsRef}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h4 className="font-serif text-2xl text-rose-100">Akad Nikah</h4>
              <p className="text-neutral-300 mt-2">
                Sabtu, 20 Desember 2025 · 09.00 WIB
              </p>
              <p className="text-neutral-300">Masjid Agung Jakarta</p>
            </Card>
            <Card>
              <h4 className="font-serif text-2xl text-rose-100">Resepsi</h4>
              <p className="text-neutral-300 mt-2">
                Sabtu, 20 Desember 2025 · 19.00 WIB
              </p>
              <p className="text-neutral-300">Grand Ballroom Jakarta</p>
            </Card>
            <Card>
              <h4 className="font-serif text-xl text-rose-100">Dress Code</h4>
              <p className="text-neutral-300">
                Nuansa{" "}
                <span className="font-medium text-rose-200">
                  Rose / Champagne / Black Tie
                </span>
              </p>
              <h4 className="font-serif text-xl text-rose-100 mt-4">
                Catatan
              </h4>
              <ul className="list-disc pl-5 text-neutral-300 space-y-1">
                <li>Mohon hadir 15 menit sebelum acara dimulai.</li>
                <li>Parkir tersedia di area basement & outdoor.</li>
                <li>Mohon menjaga ketertiban dan kebersihan.</li>
              </ul>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
              <iframe
                title="Lokasi Acara"
                src="https://www.google.com/maps?q=-6.200000,106.816666&z=14&output=embed"
                className="w-full h-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://maps.google.com/?q=Grand+Ballroom+Jakarta"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
            >
              Buka di Google Maps
            </a>
          </div>
        </div>
      </Section>

      {/* GALERI */}
      <Section id="galeri" title="Galeri" title2="Kebersamaan Kami" sectionsRef={sectionsRef}>
        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${galIndex * 100}%)`,
              }}
            >
              {galleryImages.map((src, i) => (
                <div key={i} className="w-full shrink-0">
                  <img
                    src={src}
                    alt={`Galeri ${i + 1}`}
                    className="h-150 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setGalIndex(
                    (i) => (i - 1 + galleryImages.length) % galleryImages.length
                  )
                }
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10 transition text-sm"
              >
                {"<"} Prev
              </button>
              <button
                onClick={() =>
                  setGalIndex((i) => (i + 1) % galleryImages.length)
                }
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10 transition text-sm"
              >
                Next {">"}
              </button>
            </div>
            <div className="flex gap-1">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setGalIndex(i)}
                  className={classNames(
                    "h-2 w-2 rounded-full transition",
                    i === galIndex ? "bg-rose-300" : "bg-white/30"
                  )}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* CERITA */}
      <Section id="cerita" title="Cerita" title2="Perjalanan Kami" sectionsRef={sectionsRef}>
        <ol className="relative border-s border-white/10 ps-6 space-y-10">
          {[
            {
              t: "2019",
              title: "Pertemuan Pertama",
              d: "Bertemu di kampus saat kegiatan organisasi. Percakapan sederhana menumbuhkan rasa nyaman.",
            },
            {
              t: "2020",
              title: "Perjalanan Bersama",
              d: "Belajar bertumbuh, saling mendukung dan menguatkan hingga melewati masa sulit.",
            },
            {
              t: "2023",
              title: "Lamaran",
              d: "Kedua keluarga bertemu dalam suasana hangat, memohon doa menuju jenjang yang lebih serius.",
            },
            {
              t: "2025",
              title: "Menuju Akad",
              d: "Kami mantap melangkah, memohon restu agar cinta ini menjadi ibadah seumur hidup.",
            },
          ].map((it, i) => (
            <li key={i}>
              <span className="absolute -start-1.5 mt-1 h-3 w-3 rounded-full bg-rose-300 ring-4 ring-rose-300/20" />
              <time className="text-sm text-neutral-400">{it.t}</time>
              <h4 className="mt-1 font-serif text-xl text-rose-100">
                {it.title}
              </h4>
              <p className="text-neutral-300">{it.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* RSVP */}
      <Section id="rsvp" title="RSVP" title2="Pastikan Kehadiran" sectionsRef={sectionsRef}>
        <RSVPForm />
      </Section>

      {/* HADIAH */}
      <Section id="hadiah" title="Hadiah" title2="Hadiah" sectionsRef={sectionsRef}>
        <div className="space-y-8">

          {/* ================= TRANSFER ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <h4 className="font-serif text-2xl text-rose-100">
                Beri Hadiah Kasih
              </h4>
              <p className="text-neutral-300 mt-2">
                Doa dan kehadiran Anda adalah hadiah terindah. Namun bila berkenan,
                Anda dapat mengirimkan tanda kasih melalui rekening berikut:
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    bank: "BCA",
                    name: "Aisyah Putri",
                    no: "1234567890",
                  },
                  {
                    bank: "Mandiri",
                    name: "Raka Pratama",
                    no: "9876543210",
                  },
                ].map((acc, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs uppercase tracking-wide text-neutral-400">
                        {acc.bank}
                      </div>
                      <div className="font-medium text-lg text-white">
                        {acc.no}
                      </div>
                      <div className="text-sm text-neutral-300">
                        a.n. {acc.name}
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(acc.no)}
                      className="rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-sm hover:bg-white/10 transition"
                    >
                      Salin
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Visual / QR */}
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-4">
              <img
                src={IMAGE_URL}
                alt="QR / Kartu Ucapan"
                className="rounded-xl aspect-square object-cover"
              />
            </div>
          </div>

          {/* ================= WISHLIST ================= */}
          <Card>
            <h4 className="font-serif text-xl text-rose-100 mb-1">
              Wishlist Hadiah
            </h4>

            {/* ================= ALAMAT ================= */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                Alamat Pengiriman
              </p>
              <p className="mt-1 text-sm text-neutral-200 leading-relaxed">
                Aisyah Putri Jl. Melati No. 10 Bandung, 40123 Indonesia
              </p>

              <button
                onClick={() =>
                  copyToClipboard(
                    "Aisyah Putri, Jl. Melati No. 10, Bandung, 40123, Indonesia"
                  )
                }
                className="mt-3 rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-xs hover:bg-white/10 transition"
              >
                Salin Alamat
              </button>
            </div>

            <p className="mt-5 text-sm text-neutral-300">
              Berikut beberapa referensi hadiah yang mungkin bermanfaat bagi kami.
              Tidak ada kewajiban — kehadiran Anda tetap yang utama.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  name: "Set Peralatan Makan",
                  price: "Rp 1.500.000",
                  qty: 1
                },
                {
                  name: "Sprei Premium",
                  price: "Rp 2.200.000",
                  qty: 1
                },
                {
                  name: "Lampu Meja Minimalis",
                  price: "Rp 850.000",
                  qty: 1
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between"
                >
                  <div>
                    <p className="font-medium text-white">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">
                      Estimasi harga: {item.price}
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">Jumlah: {item.qty} unit</p>
                  </div>

                  <a
                    href="#"
                    className="mt-4 inline-flex justify-center rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/10 transition"
                  >
                    Lihat Referensi
                  </a>
                </div>
              ))}
            </div>

            {/* ================= PAGINATION ================= */}
            <div className="mt-7 flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <button className="h-8 w-8 rounded-full bg-rose-300 text-sm font-semibold text-rose-950">
                  1
                </button>
                <button className="h-8 w-8 rounded-full border border-white/20 text-sm">
                  2
                </button>
                <button className="h-8 w-8 rounded-full border border-white/20 text-sm">
                  3
                </button>
              </div>

              <div className="flex gap-3">
                <button className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/10 transition">
                  Prev
                </button>
                <button className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/10 transition">
                  Next
                </button>
              </div>
            </div>
          </Card>

        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" title="FAQ" title2="Temukan Jawaban" sectionsRef={sectionsRef}>
        <FAQ />
      </Section>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-center text-neutral-400">
          <p className="font-serif text-neutral-200">
            Terima kasih atas doa dan restu Anda
          </p>
          <p className="text-sm mt-2">
            © {new Date().getFullYear()} Aisyah & Raka — All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ------------------------- Reusable Components ------------------------- */

function Section({
  id,
  title,
  title2,
  sectionsRef,
  children,
}: {
  id: string;
  title: string;
  title2: string;
  sectionsRef: React.MutableRefObject<Record<string, HTMLElement | null>>;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      ref={(el) => {
        if (el) (sectionsRef.current[id] = el)
      }}
      className="scroll-mt-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
    >
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.35em] text-rose-200/80">
          {title}
        </p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-neutral-50">
          {title2}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl",
        "hover:shadow-rose-300/10 transition-shadow",
        className
      )}
    >
      {children}
    </div>
  );
}

function RSVPForm() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<null | "ok" | "fail">(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    attendance: "Hadir",
    guests: 1,
    message: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      // Simulasi submit. Ganti dengan fetch ke API/Sheet sesuai kebutuhan.
      await new Promise((r) => setTimeout(r, 900));
      setStatus("ok");
      setForm({
        name: "",
        email: "",
        phone: "",
        attendance: "Hadir",
        guests: 1,
        message: "",
      });
    } catch {
      setStatus("fail");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <Card>
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Nama Lengkap"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          />
          <Input
            label="No. HP/WA"
            value={form.phone}
            onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
          />
          <Select
            label="Konfirmasi Kehadiran"
            value={form.attendance}
            onChange={(v) => setForm((f) => ({ ...f, attendance: v }))}
            options={["Hadir", "Tidak Hadir", "Belum Pasti"]}
          />
          <NumberInput
            label="Jumlah Tamu"
            value={form.guests}
            min={1}
            max={10}
            onChange={(v) => setForm((f) => ({ ...f, guests: v }))}
          />
          <Textarea
            label="Pesan/Ucapan"
            value={form.message}
            onChange={(v) => setForm((f) => ({ ...f, message: v }))}
            rows={4}
          />
          <button
            type="submit"
            disabled={sending}
            className={classNames(
              "mt-2 inline-flex items-center justify-center rounded-xl px-5 py-3",
              "border border-rose-300/30 bg-rose-300/10 text-rose-100",
              "hover:bg-rose-300/20 transition disabled:opacity-60"
            )}
          >
            {sending ? "Mengirim..." : "Kirim RSVP"}
          </button>
          {status === "ok" && (
            <p className="text-emerald-300 text-sm mt-2">
              Terima kasih! RSVP Anda telah kami terima.
            </p>
          )}
          {status === "fail" && (
            <p className="text-rose-300 text-sm mt-2">
              Maaf, terjadi kesalahan. Coba lagi.
            </p>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        <Card>
          <h4 className="font-serif text-xl text-rose-100">
            Informasi Tambahan
          </h4>
          <ul className="mt-2 list-disc pl-5 text-neutral-300 space-y-1">
            <li>RSVP paling lambat 7 hari sebelum acara.</li>
            <li>Mohon isi jumlah tamu dengan benar.</li>
            <li>Untuk informasi lebih lanjut, hubungi CP: 08xx-xxxx-xxxx.</li>
          </ul>
        </Card>
        <Card>
          <h4 className="font-serif text-xl text-rose-100">Kursi Terbatas</h4>
          <p className="text-neutral-300">
            Kami menyiapkan tempat terbaik untuk Anda. Mohon konfirmasi
            kehadiran agar kami dapat menyambut dengan hangat.
          </p>
        </Card>
      </div>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-neutral-300">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-300/40"
      />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-neutral-300">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-300/40"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-neutral-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-300/40"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-neutral-300">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:ring-2 focus:ring-rose-300/40"
      />
    </label>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const items = [
    {
      q: "Apakah boleh membawa anak?",
      a: "Tentu, anak-anak dan keluarga sangat kami nantikan. Mohon perhatikan area venue dan keamanan.",
    },
    {
      q: "Apakah tersedia parkir?",
      a: "Ya, tersedia parkir basement dan outdoor. Mohon datang lebih awal untuk mendapat tempat.",
    },
    {
      q: "Dress code yang disarankan?",
      a: "Nuansa Rose / Champagne / Black Tie agar tampak serasi dalam dokumentasi.",
    },
    {
      q: "Apakah perlu membawa undangan fisik?",
      a: "Tidak perlu. Undangan digital ini sudah cukup untuk registrasi di pintu masuk.",
    },
  ];
  return (
    <div className="space-y-3">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
          >
            <button
              className="w-full text-left px-4 py-4 flex items-center justify-between"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="font-medium">{it.q}</span>
              <span
                className={classNames(
                  "transition-transform",
                  isOpen ? "rotate-45" : ""
                )}
              >
                +
              </span>
            </button>
            <div
              className={classNames(
                "grid transition-[grid-template-rows] duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-4 text-neutral-300">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
