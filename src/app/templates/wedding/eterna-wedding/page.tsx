"use client";

import useCountdown from "@/lib/countdown";
import React, { useEffect, useRef, useState } from "react";

import bgImage from './bg.jpg';

/**
 * Invitation Type: Wedding
 * Theme Name: "Eterna Wedding"
 * Create At: 08-09-2025
 * Create By: David
*/

type SectionKey =
  | "mempelai"
  | "acara"
  | "galeri"
  | "cerita"
  | "rsvp"
  | "hadiah"
  | "faq";

const IMAGES = [
  "http://localhost:3005/assets/img/2149043983.jpg",
  "http://localhost:3005/assets/img/2149043983.jpg",
  "http://localhost:3005/assets/img/2149043983.jpg",
];

const GALLERY = new Array(8).fill(
  "http://localhost:3005/assets/img/2149043983.jpg"
);

const WEDDING_DATE = "2025-12-20T10:00:00+07:00"; // Ubah sesuai tanggal acara (WIB)

export default function WeddingInvitationPage() {
  // Carousel (Hero)
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Countdown
  const { days, hours, minutes, seconds, isExpired } = useCountdown(WEDDING_DATE.toString());

  // Smooth scroll + Active section (scroll spy)
  const sectionOrder: { id: SectionKey; label: string }[] = [
    { id: "mempelai", label: "Mempelai" },
    { id: "acara", label: "Acara" },
    { id: "galeri", label: "Galeri" },
    { id: "cerita", label: "Cerita" },
    { id: "rsvp", label: "RSVP" },
    { id: "hadiah", label: "Hadiah" },
    { id: "faq", label: "FAQ" },
  ];
  const [active, setActive] = useState<SectionKey>("mempelai");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsRef = useRef<Record<SectionKey, HTMLElement | null>>({
    mempelai: null,
    acara: null,
    galeri: null,
    cerita: null,
    rsvp: null,
    hadiah: null,
    faq: null,
  });

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (visible[0]) {
          const id = visible[0].target.getAttribute("id") as SectionKey | null;
          if (id) setActive(id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0.1, 0.25, 0.5, 0.75] }
    );
    const obs = observerRef.current;
    Object.values(sectionsRef.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: SectionKey) => {
    const el = sectionsRef.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  // Gallery slider
  const [gIndex, setGIndex] = useState(0);
  const slideTo = (idx: number) =>
    setGIndex(((idx % GALLERY.length) + GALLERY.length) % GALLERY.length);

  // RSVP form (dummy handler)
  const [sending, setSending] = useState(false);
  const onSubmitRSVP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    setSending(true);
    // Simulasi submit
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    alert(
      `Terima kasih, ${payload.nama || "Tamu"}! Konfirmasi Anda telah tercatat.`
    );
    (e.target as HTMLFormElement).reset();
  };

  // Copy to clipboard (Hadiah)
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Disalin ke clipboard.");
    } catch {
      alert("Gagal menyalin, silakan salin manual.");
    }
  };

  return (
    <main className="scroll-smooth bg-fixed bg-cover bg-center" style={{ backgroundImage: `url(${bgImage.src})` }}>
      {/* Overlay theme */}
      <div className="min-h-screen bg-stone-900/60 text-stone-100">
        {/* Header */}
        <header className="sticky top-0 z-50">
          <nav className="backdrop-blur-xl bg-stone-900/60 border-b border-white/10">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("mempelai");
                }}
                className="font-serif tracking-wide text-xl md:text-2xl"
              >
                A & B
              </a>
              <ul className="hidden md:flex items-center gap-2">
                {sectionOrder.map(({ id, label }) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollTo(id)}
                      className={`px-3 py-2 rounded-full text-sm transition-all duration-300 hover:bg-white/10 ${active === id
                          ? "bg-white/10 ring-1 ring-white/20 underline underline-offset-8"
                          : ""
                        }`}
                      aria-current={active === id ? "page" : undefined}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
              {/* Mobile menu (simple scroll buttons) */}
              <div className="md:hidden">
                <select
                  className="bg-stone-800/70 border border-white/10 rounded-lg px-2 py-2 text-sm"
                  value={active}
                  onChange={(e) => scrollTo(e.target.value as SectionKey)}
                  aria-label="Navigasi"
                >
                  {sectionOrder.map(({ id, label }) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </nav>
        </header>

        {/* Hero */}
        <section className="relative min-h-[80vh] flex items-center justify-center">
          {/* Background carousel */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            {IMAGES.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Background"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-out ${i === heroIndex ? "opacity-100" : "opacity-0"
                  }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-950/70 to-stone-950"></div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="uppercase tracking-[0.3em] text-xs md:text-sm text-stone-300">
              Undangan Pernikahan
            </p>
            <h1 className="mt-4 font-serif text-4xl md:text-6xl leading-tight">
              Aisyah & Bagas
            </h1>
            <p className="mt-3 text-stone-300">
              Sabtu, 20 Desember 2025 · Jakarta
            </p>

            {/* Countdown */}
            <div className="mt-8 grid grid-cols-4 gap-2 md:gap-4">
              {[
                { label: "Hari", value: days },
                { label: "Jam", value: hours },
                { label: "Menit", value: minutes },
                { label: "Detik", value: seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4 md:p-6 transition hover:translate-y-[-2px]"
                >
                  <div className="text-2xl md:text-4xl font-semibold tracking-wider">
                    {isExpired ? "0" : String(item.value).padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-xs md:text-sm text-stone-300">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollTo("mempelai")}
              className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-stone-900 hover:bg-stone-100 transition shadow-lg"
            >
              Lihat Undangan
              <ArrowDownIcon />
            </button>
          </div>
        </section>

        {/* Mempelai */}
        <Section
          id="mempelai"
          title="Mempelai"
          subtitle="Dengan penuh syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada hari bahagia kami."
          sectionsRef={sectionsRef}
        >
          <div className="grid md:grid-cols-2 gap-6 md:gap-10">
            {[
              {
                name: "Aisyah Putri",
                desc:
                  "Putri pertama dari Bapak Ahmad & Ibu Siti. Lahir dan besar di Jakarta, berkarier di bidang kreatif.",
              },
              {
                name: "Bagas Pratama",
                desc:
                  "Putra kedua dari Bapak Budi & Ibu Rina. Seorang penggiat teknologi yang menyukai fotografi.",
              },
            ].map((p, i) => (
              <div
                key={i}
                className="group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition"
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={IMAGES[0]}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl">{p.name}</h3>
                  <p className="mt-2 text-stone-300">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Acara */}
        <Section
          id="acara"
          title="Acara"
          subtitle="Berikut rangkaian acara pada hari bahagia kami."
          sectionsRef={sectionsRef}
        >
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <InfoCard
                title="Akad Nikah"
                time="Sabtu, 20 Desember 2025 · 10.00 WIB"
                place="Balai Kartini, Ballroom"
                extra="Mohon hadir 15 menit lebih awal."
              />
              <InfoCard
                title="Resepsi"
                time="Sabtu, 20 Desember 2025 · 12.00 – 15.00 WIB"
                place="Balai Kartini, Ballroom"
                extra="Dress code: Formal / Palet warna netral elegan."
              />
              <div className="rounded-3xl border border-white/10 p-6 bg-white/5 backdrop-blur-md">
                <h4 className="font-serif text-xl">Informasi Tambahan</h4>
                <ul className="mt-3 list-disc list-inside text-stone-300 space-y-1">
                  <li>Mohon menjaga protokol kebersihan.</li>
                  <li>Parkir tersedia di basement dan area timur.</li>
                  <li>Ucapan & doa dapat dititipkan pada buku tamu.</li>
                </ul>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2104161705646!2d106.825908!3d-6.236658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e3d7d9a0a7%3A0x5c8b2b94a3055f0!2sBalai%20Kartini!5e0!3m2!1sen!2sid!4v1699999999999"
                  allowFullScreen
                />
              </div>
              <div className="p-4 text-sm text-stone-300">
                Lokasi: Balai Kartini, Jakarta.
              </div>
            </div>
          </div>
        </Section>

        {/* Galeri */}
        <Section
          id="galeri"
          title="Galeri"
          subtitle="Sejumlah momen yang kami abadikan."
          sectionsRef={sectionsRef}
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5">
            <div className="relative aspect-[16/9]">
              {/* Slides */}
              {GALLERY.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Foto ${i + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === gIndex ? "opacity-100" : "opacity-0"
                    }`}
                />
              ))}
              {/* Controls */}
              <button
                onClick={() => slideTo(gIndex - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-stone-900/50 hover:bg-stone-900/70 p-3 backdrop-blur border border-white/10"
                aria-label="Sebelumnya"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={() => slideTo(gIndex + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-stone-900/50 hover:bg-stone-900/70 p-3 backdrop-blur border border-white/10"
                aria-label="Berikutnya"
              >
                <ChevronRightIcon />
              </button>
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {GALLERY.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => slideTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2 w-2 rounded-full transition ${i === gIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Cerita (timeline) */}
        <Section
          id="cerita"
          title="Cerita Kami"
          subtitle="Perjalanan yang membawa kami ke pelaminan."
          sectionsRef={sectionsRef}
        >
          <ol className="relative border-s border-white/10 ms-3">
            {[
              {
                t: "2018",
                title: "Pertemuan Pertama",
                body:
                  "Kami berkenalan saat kegiatan kampus. Dari sapaan singkat, tumbuh rasa yang hangat.",
              },
              {
                t: "2019",
                title: "Mulai Serius",
                body:
                  "Berjalan bersama melewati suka duka, saling menguatkan mimpi satu sama lain.",
              },
              {
                t: "2023",
                title: "Lamaran",
                body:
                  "Keluarga bertemu, doa dipanjatkan, niat kami dimantapkan.",
              },
              {
                t: "2025",
                title: "Menuju Pelaminan",
                body:
                  "Dengan restu orang tua dan sahabat, kami melangkah ke babak baru.",
              },
            ].map((ev, i) => (
              <li key={i} className="mb-10 ms-2">
                <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-white/80 border border-white/30"></span>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition backdrop-blur-md">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-serif text-xl">{ev.title}</h4>
                    <span className="text-xs uppercase tracking-widest text-stone-300">
                      {ev.t}
                    </span>
                  </div>
                  <p className="mt-2 text-stone-300">{ev.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* RSVP */}
        <Section
          id="rsvp"
          title="RSVP"
          subtitle="Mohon konfirmasi kehadiran Anda."
          sectionsRef={sectionsRef}
        >
          <form
            onSubmit={onSubmitRSVP}
            className="grid md:grid-cols-2 gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
          >
            <Field label="Nama" name="nama" placeholder="Nama lengkap" />
            <Field
              label="No. HP/WA"
              name="kontak"
              placeholder="08xxxxxxxxxx"
              inputMode="tel"
            />
            <div>
              <Label>Konfirmasi Kehadiran</Label>
              <select
                name="status"
                required
                className="mt-2 w-full rounded-xl bg-stone-900/70 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="">Pilih salah satu</option>
                <option value="hadir">Hadir</option>
                <option value="tidak_hadir">Tidak hadir</option>
                <option value="belum_pasti">Belum pasti</option>
              </select>
            </div>
            <Field
              label="Jumlah Tamu"
              name="jumlah"
              type="number"
              min={1}
              placeholder="1"
            />
            <div className="md:col-span-2">
              <Label>Catatan</Label>
              <textarea
                name="catatan"
                rows={4}
                className="mt-2 w-full rounded-xl bg-stone-900/70 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Tambahkan pesan untuk mempelai..."
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-full bg-white text-stone-900 px-6 py-3 hover:bg-stone-100 transition shadow-lg disabled:opacity-60"
              >
                <PaperAirplaneIcon />
                {sending ? "Mengirim..." : "Kirim Konfirmasi"}
              </button>
              <p className="text-sm text-stone-300">
                *Data Anda hanya digunakan untuk keperluan daftar tamu.
              </p>
            </div>
          </form>
        </Section>

        {/* Hadiah */}
        <Section
          id="hadiah"
          title="Hadiah"
          subtitle="Doa restu adalah hadiah terindah. Namun bila berkenan berbagi kebahagiaan, berikut informasi hadiah."
          sectionsRef={sectionsRef}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h4 className="font-serif text-xl">Transfer Rekening</h4>
              <div className="mt-3 space-y-2 text-stone-300">
                <p>Bank BCA · A/N Aisyah Putri</p>
                <div className="flex items-center gap-3">
                  <code className="bg-black/30 rounded px-3 py-1">
                    1234567890
                  </code>
                  <button
                    onClick={() => copyText("1234567890")}
                    className="text-sm underline underline-offset-4 hover:no-underline"
                  >
                    Salin
                  </button>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h4 className="font-serif text-xl">E-Wallet / Link Hadiah</h4>
              <div className="mt-3 space-y-2 text-stone-300">
                <p>OVO / GoPay / Dana</p>
                <div className="flex items-center gap-3">
                  <code className="bg-black/30 rounded px-3 py-1">
                    089876543210
                  </code>
                  <button
                    onClick={() => copyText("089876543210")}
                    className="text-sm underline underline-offset-4 hover:no-underline"
                  >
                    Salin
                  </button>
                </div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Tautan hadiah bisa diarahkan ke halaman pembayaran.");
                  }}
                  className="inline-flex items-center gap-2 mt-3 rounded-full bg-white text-stone-900 px-5 py-2 hover:bg-stone-100 transition"
                >
                  Buka Link Hadiah
                  <ExternalLinkIcon />
                </a>
              </div>
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section
          id="faq"
          title="FAQ"
          subtitle="Pertanyaan yang sering diajukan."
          sectionsRef={sectionsRef}
        >
          <Accordion
            items={[
              {
                q: "Apakah boleh membawa anak?",
                a: "Tentu, kami dengan senang hati menyambut keluarga.",
              },
              {
                q: "Apakah ada parkir tersedia?",
                a: "Ya, tersedia parkir di basement dan area timur gedung.",
              },
              {
                q: "Dress code-nya apa?",
                a: "Formal dengan palet warna netral elegan (bebas rapi).",
              },
              {
                q: "Apakah boleh memberikan hadiah secara digital?",
                a: "Boleh. Silakan gunakan informasi pada bagian Hadiah.",
              },
            ]}
          />
        </Section>

        {/* Footer */}
        <footer className="py-12 text-center text-stone-400">
          <p className="text-sm">
            Terima kasih atas doa & kehadiran Anda. Sampai jumpa di hari bahagia
            kami!
          </p>
          <p className="mt-2 text-xs">© {new Date().getFullYear()} Aisyah & Bagas</p>
        </footer>
      </div>
    </main>
  );
}

/* ========== Subcomponents ========== */

function Section({
  id,
  title,
  subtitle,
  sectionsRef,
  children,
}: {
  id: SectionKey;
  title: string;
  subtitle?: string;
  sectionsRef: React.MutableRefObject<Record<SectionKey, HTMLElement | null>>;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      ref={(el) => {
        if (el) (sectionsRef.current[id] = el)
      }}
      className="scroll-mt-24 max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24"
    >
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl">{title}</h2>
        {subtitle && (
          <p className="mt-3 text-stone-300">{subtitle}</p>
        )}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function InfoCard({
  title,
  time,
  place,
  extra,
}: {
  title: string;
  time: string;
  place: string;
  extra?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 backdrop-blur-md transition">
      <h4 className="font-serif text-xl">{title}</h4>
      <div className="mt-2 space-y-1 text-stone-300">
        <p className="flex items-center gap-2">
          <ClockIcon /> {time}
        </p>
        <p className="flex items-center gap-2">
          <MapPinIcon /> {place}
        </p>
        {extra && <p className="text-sm">{extra}</p>}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  inputMode,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  min?: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        inputMode={inputMode}
        min={min}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl bg-stone-900/70 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-white/20"
      />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm uppercase tracking-wider text-stone-300">
      {children}
    </label>
  );
}

function Accordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="p-5">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between text-left"
              aria-expanded={isOpen}
            >
              <span className="font-medium">{it.q}</span>
              <span
                className={`transition-transform ${isOpen ? "rotate-45" : ""
                  }`}
                aria-hidden
              >
                <PlusIcon />
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"
                }`}
            >
              <div className="overflow-hidden">
                <p className="text-stone-300">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ========== Minimal inline SVG icons (no deps) ========== */

function ArrowDownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
      <path d="M12 3v14.17l5.59-5.58L19 13l-7 7-7-7 1.41-1.41L11 17.17V3h1z" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
      <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
      <path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
      <path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1Zm1 12h-5V7h2v4h3Z" />
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z" />
    </svg>
  );
}
function PaperAirplaneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
      <path d="m2.01 21 20-9L2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}
function ExternalLinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
      <path d="M14 3v2h3.59L10 12.59 11.41 14 19 6.41V10h2V3z" />
      <path d="M5 5h6V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-2v6H5z" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
      <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
    </svg>
  );
}
