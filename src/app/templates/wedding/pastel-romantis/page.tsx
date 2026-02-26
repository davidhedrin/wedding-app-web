"use client";

import useCountdown from "@/lib/countdown";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Invitation Type: Wedding
 * Theme Name: "Pastel Romantis"
 * Create At: 08-09-2025
 * Create By: David
*/

const IMG = "http://localhost:3005/assets/img/2149043983.jpg";
const weddingDate = new Date();
weddingDate.setDate(weddingDate.getDate() + 12);

type NavItem = { id: string; label: string };

const NAV_ITEMS: NavItem[] = [
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

export default function WeddingInvitationPage() {
  const [opened, setOpened] = useState(false)
  useLockBodyScroll(!opened)

  const { days, hours, minutes, seconds, isExpired } = useCountdown(weddingDate.toString());

  // Smooth scroll offset handling
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<string>(NAV_ITEMS[0].id);

  // Background carousel state
  const heroImages = useMemo(() => [IMG, IMG, IMG], []);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(id);
  }, [heroImages.length]);

  // Active section tracking (IntersectionObserver)
  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(
      Boolean
    ) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: [0, 0.2, 0.6, 1],
      }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Smooth scroll handler
  const onNavClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const headerH = headerRef.current?.offsetHeight ?? 0;
    const y = el.getBoundingClientRect().top + window.scrollY - (headerH + 16);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="scroll-smooth antialiased min-h-screen text-slate-800 bg-linear-to-b from-rose-50 via-white to-indigo-50">
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
              <div className="absolute inset-0 bg-linear-to-b from-rose-100 via-white to-indigo-300 backdrop-blur-sm" />
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10 space-y-4"
            >
              <p className="tracking-widest uppercase text-sm mb-4 text-slate-600">Wedding Invitation</p>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl drop-shadow-md">
                Aisyah & Raka
              </h1>
              <p className="mt-4 text-lg">Sabtu, 20 Desember 2025</p>
              <p className="mt-2 italic text-slate-600">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="font-semibold text-xl mt-1 text-slate-600">Nama Tamu</p>

              <button
                onClick={() => setOpened(true)}
                className="sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white bg-linear-to-r from-indigo-500 to-rose-500 hover:opacity-95 active:scale-[.99] transition"
              >
                Buka Undangan
                <span className="inline-block translate-x-0 group-hover:translate-x-0.5 transition">↗</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky / Glassy Navigation */}
      <div
        ref={headerRef}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <a
            href="#mempelai"
            onClick={onNavClick("mempelai")}
            className="inline-flex items-center gap-2"
          >
            <LogoIcon className="w-6 h-6" />
            <span className="font-serif text-lg tracking-wide">
              Undangan Pernikahan
            </span>
          </a>
          <nav className="hidden md:flex gap-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={onNavClick(item.id)}
                className={[
                  "px-3 py-1.5 rounded-full text-sm transition-all",
                  active === item.id
                    ? "bg-linear-to-r from-rose-400 to-indigo-400 text-white shadow"
                    : "hover:bg-white hover:shadow text-slate-600",
                ].join(" ")}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#rsvp"
            onClick={onNavClick("rsvp")}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white bg-linear-to-r from-indigo-500 to-rose-500 hover:opacity-95 active:scale-[.99] transition"
          >
            <SparkleIcon className="w-4 h-4" />
            RSVP
          </a>
          {/* Mobile menu (quick jump) */}
          <div className="md:hidden">
            <select
              aria-label="Navigasi"
              className="rounded-lg border border-slate-200 px-3 py-2 bg-white/70 backdrop-blur"
              value={active}
              onChange={(e) => onNavClick(e.target.value)({ preventDefault() { } } as any)}
            >
              {NAV_ITEMS.map((n) => (
                <option value={n.id} key={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hero with Carousel + Countdown */}
      <section
        id="hero"
        className="relative h-screen overflow-hidden"
        aria-label="Sampul Undangan"
      >
        {/* Background carousel layers */}
        <div className="absolute inset-0">
          {heroImages.map((src, i) => (
            <div
              key={i}
              className={[
                "absolute inset-0 bg-center bg-cover transition-opacity duration-1500 will-change-opacity",
                heroIndex === i ? "opacity-100" : "opacity-0",
              ].join(" ")}
              style={{ backgroundImage: `url(${src})` }}
              aria-hidden={heroIndex !== i}
            />
          ))}
          {/* overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-white/40" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="mx-auto max-w-5xl px-6 text-center text-white">
            <p className="uppercase tracking-[0.35em] text-xs md:text-sm/relaxed text-white/90">
              The Wedding of
            </p>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl drop-shadow-md">
              Aisyah & Raka
            </h1>
            <p className="mt-3 md:mt-4 text-white/90">
              Sabtu, 20 Desember 2025 • Jakarta
            </p>

            {/* Countdown */}
            <div className="mt-8 md:mt-10 grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
              {[
                { label: "Hari", value: days },
                { label: "Jam", value: hours },
                { label: "Menit", value: minutes },
                { label: "Detik", value: seconds },
              ].map((b, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 py-3 md:py-4"
                >
                  <div className="text-2xl md:text-4xl font-semibold tabular-nums">
                    {pad2(b.value)}
                  </div>
                  <div className="text-xs md:text-sm opacity-90">{b.label}</div>
                </div>
              ))}
            </div>

            <a
              href="#acara"
              onClick={onNavClick("acara")}
              className="inline-flex items-center gap-2 mt-8 md:mt-10 px-6 py-3 rounded-full bg-white/90 text-slate-800 hover:bg-white shadow-lg transition"
            >
              <ArrowDownIcon className="w-4 h-4" />
              Lihat Undangan
            </a>
          </div>
        </div>
      </section>

      {/* Mempelai */}
      <Section id="mempelai" title="Mempelai">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Foto dan nama */}
          <div className="space-y-6">
            <ProfileCard
              name="Aisyah Putri"
              subtitle="Putri dari Bpk. Ahmad & Ibu Siti"
              img={IMG}
              align="left"
            />
            <ProfileCard
              name="Raka Pratama"
              subtitle="Putra dari Bpk. Budi & Ibu Rina"
              img={IMG}
              align="left"
            />
          </div>

          {/* Sambutan */}
          <div className="rounded-3xl bg-white shadow-xl/30 shadow-gray-200 border border-white/60 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-linear-to-br from-rose-300/30 to-indigo-300/30 blur-3xl" />
            <p className="font-serif text-2xl md:text-3xl">
              Kata Sambutan
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              Dengan memohon rahmat Tuhan Yang Maha Esa, kami bermaksud
              mengundang Bapak/Ibu/Saudara/i untuk menghadiri akad dan resepsi
              pernikahan kami. Kehadiran dan doa restu Anda merupakan
              kebahagiaan dan kehormatan bagi kami.
            </p>
            <p className="mt-4 text-slate-600">
              Semoga kehadiran Anda menambah keberkahan di hari bahagia kami.
              Terima kasih atas doa dan perhatiannya.
            </p>
          </div>
        </div>
      </Section>

      {/* Acara */}
      <Section id="acara" title="Acara">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Detail waktu & tempat */}
            <div className="grid sm:grid-cols-2 gap-6">
              <EventCard
                title="Akad Nikah"
                time="Sabtu, 20 Desember 2025"
                desc="Pukul 10.00 WIB – selesai"
                place="Masjid Al-Ikhlas, Jakarta Selatan"
              />
              <EventCard
                title="Resepsi"
                time="Sabtu, 20 Desember 2025"
                desc="Pukul 12.00 – 16.00 WIB"
                place="Gedung Graha Cinta, Jakarta Selatan"
              />
            </div>

            {/* Info tambahan */}
            <div className="rounded-3xl border bg-white p-6 border-white/60 shadow-xl/30 shadow-gray-200">
              <h4 className="font-semibold text-lg">Informasi Tambahan</h4>
              <ul className="mt-3 space-y-2 text-slate-600">
                <li>• Mohon hadir 15 menit sebelum acara dimulai.</li>
                <li>• Parkir tersedia di basement gedung.</li>
                <li>• Dress code: Nuansa pastel elegan.</li>
              </ul>
            </div>

            {/* Maps */}
            <div className="overflow-hidden rounded-3xl border border-white/60 shadow-xl/30 shadow-gray-200">
              <iframe
                title="Lokasi Acara"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.317606346648!2d106.82715267603856!3d-6.2197248937606305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3dfb3d5e0d9%3A0x3f4c9dd5b27d0b0b!2sJakarta%20Selatan!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                width="100%"
                height="360"
                loading="lazy"
                className="border-0 w-full"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Samping: Card ringkas */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-linear-to-br from-indigo-50 to-rose-50 p-6 border border-white/60 shadow-xl/30 shadow-gray-200">
              <h4 className="font-semibold text-lg">Catat Tanggalnya</h4>
              <p className="text-slate-600 mt-2">
                Sabtu, 20 Desember 2025 • Pukul 10.00 WIB
              </p>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                <Badge label="Hari" value={pad2(days)} />
                <Badge label="Jam" value={pad2(hours)} />
                <Badge label="Menit" value={pad2(minutes)} />
                <Badge label="Detik" value={pad2(seconds)} />
              </div>
              <a
                href="#rsvp"
                onClick={onNavClick("rsvp")}
                className="mt-6 inline-flex items-center justify-center w-full rounded-xl px-5 py-3 bg-linear-to-r from-indigo-500 to-rose-500 text-white hover:opacity-95 transition"
              >
                Konfirmasi Kehadiran
              </a>
            </div>

            <div className="rounded-3xl border bg-white p-6 border-white/60 shadow-xl/30 shadow-gray-200">
              <h4 className="font-semibold text-lg">Dress Code</h4>
              <p className="text-slate-600 mt-2">
                Pastel modern (elegan). Mohon menyesuaikan.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Galeri – slider */}
      <Section id="galeri" title="Galeri">
        <Gallery images={[IMG, IMG, IMG, IMG, IMG, IMG]} />
      </Section>

      {/* Cerita – timeline */}
      <Section id="cerita" title="Cerita">
        <Timeline
          items={[
            {
              title: "Pertama Bertemu",
              date: "2019",
              desc: "Kami dipertemukan melalui sahabat dekat di sebuah acara kampus.",
            },
            {
              title: "Mulai Serius",
              date: "2021",
              desc: "Pandemi membuat kami semakin dekat dan berkomitmen.",
            },
            {
              title: "Lamaran",
              date: "2025",
              desc: "Kedua keluarga bertemu dan menyatakan keseriusan kami.",
            },
            {
              title: "Menuju Akad",
              date: "2025",
              desc: "Dengan izin-Nya, kami akan memulai babak baru bersama.",
            },
          ]}
        />
      </Section>

      {/* RSVP */}
      <Section id="rsvp" title="RSVP">
        <RSVPForm />
      </Section>

      {/* Hadiah */}
      <Section id="hadiah" title="Hadiah">
        <GiftSection />
      </Section>

      {/* FAQ */}
      <Section id="faq" title="FAQ">
        <FAQ
          items={[
            {
              q: "Apakah saya boleh membawa pendamping?",
              a: "Boleh, mohon cantumkan jumlah tamu saat mengisi form RSVP.",
            },
            {
              q: "Apakah tersedia parkir?",
              a: "Ya, parkir tersedia di basement gedung.",
            },
            {
              q: "Dress code-nya apa?",
              a: "Pastel modern (elegan).",
            },
            {
              q: "Apakah ada live streaming?",
              a: "Kami akan menginformasikan link jika tersedia mendekati hari H.",
            },
          ]}
        />
      </Section>

      {/* Footer */}
      <footer className="mt-16 py-10 border-t border-white/60">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate-500">
          Terima kasih atas doa & kehadiran Anda.
          <div className="mt-2">
            <span className="inline-flex items-center gap-1">
              <HeartLineIcon className="w-4 h-4" /> Aisyah & Raka
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 mx-auto max-w-6xl px-6 py-16 md:py-20"
      aria-labelledby={`${id}-title`}
    >
      <div className="flex items-center justify-between mb-10">
        <h2
          id={`${id}-title`}
          className="font-serif text-3xl md:text-4xl bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-rose-600"
        >
          {title}
        </h2>
        <div className="h-px flex-1 ml-6 bg-linear-to-r from-slate-200 to-transparent" />
      </div>
      {children}
    </section>
  );
}

function ProfileCard({
  name,
  subtitle,
  img,
  align = "center",
}: {
  name: string;
  subtitle: string;
  img: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-3xl border bg-white p-5 md:p-6 border-white/60 shadow-xl/30 shadow-gray-200",
        align === "left" ? "text-left" : "text-center",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-20 h-20 rounded-2xl bg-center bg-cover ring-4 ring-white shrink-0"
          style={{ backgroundImage: `url(${img})` }}
          aria-label={`Foto ${name}`}
        />
        <div>
          <h3 className="font-serif text-2xl">{name}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function EventCard({
  title,
  time,
  desc,
  place,
}: {
  title: string;
  time: string;
  desc: string;
  place: string;
}) {
  return (
    <div className="rounded-3xl border bg-white p-6 border-white/60 shadow-xl/30 shadow-gray-200 hover:shadow-xl transition">
      <div className="flex items-center gap-2">
        <CalendarIcon className="w-5 h-5 text-indigo-600" />
        <h4 className="font-semibold">{title}</h4>
      </div>
      <p className="mt-2 text-slate-700">{time}</p>
      <p className="text-slate-500">{desc}</p>
      <div className="mt-2 inline-flex items-center gap-2 text-slate-600">
        <MapPinIcon className="w-4 h-4" /> {place}
      </div>
    </div>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/70 backdrop-blur border border-white/70 py-3">
      <div className="text-xl font-semibold tabular-nums">{value}</div>
      <div className="text-[11px] opacity-70">{label}</div>
    </div>
  );
}

function Gallery({ images }: { images: string[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = useState(0);

  const scrollTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const children = el.querySelectorAll<HTMLDivElement>("[data-slide]");
    const target = children[i];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", inline: "center" });
      setIdx(i);
    }
  };

  const next = () => scrollTo((idx + 1) % images.length);
  const prev = () => scrollTo((idx - 1 + images.length) % images.length);

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
      >
        {images.map((src, i) => (
          <div
            key={i}
            data-slide
            className="snap-center shrink-0 w-[78%] sm:w-[45%] md:w-[32%] lg:w-[30%]"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/60 shadow-xl/30 shadow-gray-200 aspect-4/5 group">
              <img
                src={src}
                alt={`Galeri ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 text-xs text-white/95 bg-linear-to-t from-black/50 to-transparent">
                Momen {i + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={prev}
          className="px-3 py-2 rounded-full bg-white border hover:shadow transition"
          aria-label="Sebelumnya"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <div className="inline-flex items-center gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              onClick={() => scrollTo(i)}
              className={[
                "w-2.5 h-2.5 rounded-full cursor-pointer transition",
                i === idx ? "bg-linear-to-r from-indigo-500 to-rose-500" : "bg-slate-300",
              ].join(" ")}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="px-3 py-2 rounded-full bg-white border hover:shadow transition"
          aria-label="Berikutnya"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Timeline({
  items,
}: {
  items: { title: string; date: string; desc: string }[];
}) {
  return (
    <ol className="relative border-l-2 border-slate-200 ml-2 md:ml-4">
      {items.map((it, i) => (
        <li key={i} className="mb-10 ml-4">
          <span className="absolute -left-2.25 flex items-center justify-center w-5 h-5 bg-linear-to-r from-indigo-500 to-rose-500 rounded-full ring-4 ring-white" />
          <h4 className="font-semibold">
            {it.title} <span className="text-slate-400 font-normal">• {it.date}</span>
          </h4>
          <p className="mt-2 text-slate-600">{it.desc}</p>
        </li>
      ))}
    </ol>
  );
}

function RSVPForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    attendance: "Hadir",
    guests: 1,
    message: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulasi proses submit — ganti dengan integrasi API/email sesuai kebutuhan
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="grid md:grid-cols-5 gap-8">
      <div className="md:col-span-3 rounded-3xl border bg-white p-6 md:p-8 border-white/60 shadow-xl/30 shadow-gray-200">
        <h4 className="font-semibold text-lg">Konfirmasi Kehadiran</h4>
        <p className="text-slate-600 text-sm mt-1">
          Mohon isi formulir ini untuk membantu kami menyiapkan tempat terbaik.
        </p>
        <form onSubmit={submit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600">Nama Lengkap</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full px-3 py-1.5 border rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-200"
              placeholder="Nama Anda"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Kontak (HP/Email)</label>
            <input
              required
              value={form.contact}
              onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
              className="mt-1 w-full px-3 py-1.5 border rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-200"
              placeholder="08xx / email"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Kehadiran</label>
            <select
              value={form.attendance}
              onChange={(e) => setForm((f) => ({ ...f, attendance: e.target.value }))}
              className="mt-1 w-full px-3 py-1.5 border rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-200"
            >
              <option>Hadir</option>
              <option>Tidak Hadir</option>
              <option>Masih Ragu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-600">Jumlah Tamu</label>
            <input
              type="number"
              min={1}
              value={form.guests}
              onChange={(e) =>
                setForm((f) => ({ ...f, guests: Math.max(1, Number(e.target.value)) }))
              }
              className="mt-1 w-full px-3 py-1.5 border rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-200"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-slate-600">Ucapan</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="mt-1 w-full px-3 py-1.5 border rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-200"
              placeholder="Doa & ucapan..."
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-white bg-linear-to-r from-indigo-500 to-rose-500 hover:opacity-95 active:scale-[.99] transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <SpinnerIcon className="w-4 h-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <SparkleIcon className="w-4 h-4" /> Kirim RSVP
                </>
              )}
            </button>
            {done && (
              <p className="text-emerald-600 text-sm mt-3">
                Terima kasih! RSVP Anda telah kami terima.
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Info kontak & catatan */}
      <div className="md:col-span-2 space-y-6">
        <div className="rounded-3xl border bg-white p-6 border-white/60 shadow-xl/30 shadow-gray-200">
          <h4 className="font-semibold text-lg">Kontak</h4>
          <div className="mt-3 space-y-2 text-slate-600">
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" /> 08xx-xxxx-xxxx (Aisyah)
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" /> 08xx-xxxx-xxxx (Raka)
            </div>
          </div>
        </div>
        <div className="rounded-3xl border bg-white p-6 border-white/60 shadow-xl/30 shadow-gray-200">
          <h4 className="font-semibold text-lg">Catatan</h4>
          <p className="text-slate-600 mt-2">
            Mohon konfirmasi kehadiran paling lambat H-7. Terima kasih!
          </p>
        </div>
      </div>
    </div>
  );
}

function GiftSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="space-y-10">

      {/* ================= TRANSFER + QR ================= */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Kado Digital */}
        <div className="rounded-3xl border bg-white p-6 border-white/60 shadow-xl/30 shadow-gray-200">
          <h4 className="font-semibold text-lg">Kado Digital</h4>
          <p className="text-slate-600 mt-2">
            Untuk berbagi kebahagiaan, Anda dapat mengirim hadiah melalui
            rekening atau e-wallet berikut:
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <GiftCard
              bank="BCA"
              name="AISYAH PUTRI"
              number="1234567890"
              onCopy={() => copy("1234567890", "bca")}
              copied={copied === "bca"}
            />
            <GiftCard
              bank="Mandiri"
              name="RAKA PRATAMA"
              number="9876543210"
              onCopy={() => copy("9876543210", "mandiri")}
              copied={copied === "mandiri"}
            />
            <GiftCard
              bank="GoPay"
              name="AISYAH"
              number="081234567890"
              onCopy={() => copy("081234567890", "gopay")}
              copied={copied === "gopay"}
            />
          </div>
        </div>

        {/* QR / Poster */}
        <div className="rounded-3xl overflow-hidden border bg-white p-0 border-white/60 shadow-xl/30 shadow-gray-200 flex flex-col">
          <div className="relative w-full grow">
            <img
              src={IMG}
              alt="Kartu Ucapan"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h5 className="font-serif text-2xl">Terima kasih 🙏</h5>
              <p className="text-sm text-white/90">
                Segala bentuk hadiah & doa sangat berarti bagi kami.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= WISHLIST ================= */}
      <div className="rounded-3xl border bg-white p-6 border-white/60 shadow-xl/30 shadow-gray-200">
        <h4 className="font-semibold text-lg">Wishlist Hadiah</h4>

        {/* ================= ALAMAT ================= */}
        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Alamat Pengiriman
          </p>
          <p className="mt-1 text-sm text-slate-700 leading-relaxed">
            Aisyah Putri Jl. Melati No. 10 Jakarta Selatan, 12345 Indonesia
          </p>

          <button
            onClick={() =>
              copy(
                "Aisyah Putri, Jl. Melati No. 10, Jakarta Selatan, 12345, Indonesia",
                "alamat"
              )
            }
            className="mt-3 inline-flex rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs hover:bg-slate-100 transition"
          >
            Salin Alamat
          </button>
        </div>

        <p className="mt-4 text-slate-600">
          Berikut beberapa referensi hadiah yang mungkin bermanfaat bagi kami.
          Tidak ada kewajiban — kehadiran Anda tetap yang utama.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: "Set Peralatan Makan", price: "Rp 1.500.000", qty: 1 },
            { name: "Sprei Premium King Size", price: "Rp 2.200.000", qty: 1 },
            { name: "Lampu Meja Minimalis", price: "Rp 850.000", qty: 1 },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <p className="font-medium text-slate-800">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Estimasi harga: {item.price}
                </p>
                <p className="mt-1 text-sm text-slate-500">Jumlah: {item.qty} unit</p>
              </div>

              <a
                href="#"
                className="mt-4 inline-flex justify-center rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
              >
                Lihat Referensi
              </a>
            </div>
          ))}
        </div>

        {/* ================= PAGINATION UI ================= */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <button className="h-8 w-8 rounded-full bg-slate-800 text-xs font-semibold text-white">
              1
            </button>
            <button className="h-8 w-8 rounded-full border border-slate-300 text-xs text-slate-600">
              2
            </button>
            <button className="h-8 w-8 rounded-full border border-slate-300 text-xs text-slate-600">
              3
            </button>
          </div>

          <div className="flex gap-3">
            <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition">
              Prev
            </button>
            <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition">
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

function GiftCard({
  bank,
  name,
  number,
  onCopy,
  copied,
}: {
  bank: string;
  name: string;
  number: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 border-slate-200 flex items-start justify-between">
      <div>
        <div className="font-semibold">{bank}</div>
        <div className="text-sm text-slate-600">{name}</div>
        <div className="mt-1 font-mono tracking-wide">{number}</div>
      </div>
      <button
        onClick={onCopy}
        className="text-sm inline-flex items-center gap-1 transition underline"
      >
        <CopyIcon className="w-4 h-4" />
        {copied ? "Tersalin!" : "Salin"}
      </button>
    </div>
  );
}

function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="rounded-2xl border bg-white border-white/60 shadow-xl/30 shadow-gray-200"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full px-5 py-4 flex items-center justify-between text-left"
              aria-expanded={isOpen}
            >
              <span className="font-medium">{it.q}</span>
              <span
                className={[
                  "transition-transform",
                  isOpen ? "rotate-180" : "",
                ].join(" ")}
              >
                <ChevronDownIcon className="w-5 h-5" />
              </span>
            </button>
            <div
              className={[
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              ].join(" ")}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-slate-600">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Utils ---------- */

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

/* ---------- Icons (inline SVG, no external deps) ---------- */

function LogoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2c3 0 5 2 5 5 0 5-5 9-5 9S7 12 7 7c0-3 2-5 5-5z" />
      <circle cx="12" cy="7" r="2" fill="white" />
    </svg>
  );
}
function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" />
    </svg>
  );
}
function ArrowDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" {...props}>
      <path d="M12 5v14M5 12l7 7 7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" {...props}>
      <path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" {...props}>
      <path d="M15 19l-7-7 7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" {...props}>
      <path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" {...props}>
      <path d="M6 9l6 6 6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function HeartLineIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" {...props}>
      <path d="M12 21s-7-4.534-9-8.5C1.17 9.64 3.5 7 6.5 7c1.74 0 3.41.81 4.5 2.09C12.09 7.81 13.76 7 15.5 7 18.5 7 20.83 9.64 21 12.5 19 16.466 12 21 12 21z" />
    </svg>
  );
}
function GiftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" {...props}>
      <path d="M20 12v8a2 2 0 0 1-2 2h-4v-10h6zM4 12h6v10H6a2 2 0 0 1-2-2v-8z" />
      <path d="M2 7h20v5H2z" />
      <path d="M12 7v15" />
      <path d="M12 7s-2-3-4-3-3 1.5-3 3 7 0 7 0zM12 7s2-3 4-3 3 1.5 3 3-7 0-7 0z" />
    </svg>
  );
}
function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <rect x="2" y="2" width="13" height="13" rx="2" />
    </svg>
  );
}
function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.31 1.78.57 2.63a2 2 0 0 1-.45 2.11L8 9a16 16 0 0 0 7 7l.54-1.18a2 2 0 0 1 2.11-.45c.85.26 1.73.45 2.63.57A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function SpinnerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 016 6h2a8 8 0 10-8-8v2z" />
    </svg>
  );
}
