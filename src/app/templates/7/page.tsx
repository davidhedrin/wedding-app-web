// app/page.tsx
"use client";

import useCountdown from "@/lib/countdown";
import React, { useEffect, useMemo, useRef, useState } from "react";

// =======================
// Konfigurasi Dasar
// =======================
const THEME = {
  // Pilih satu tema elegan: emerald-teal gelap (bukan putih)
  bgGradient:
    "from-emerald-950 via-teal-900 to-emerald-950", // latar utama
  glass:
    "bg-white/5 backdrop-blur-md ring-1 ring-white/10", // efek kaca elegan
  accent: "text-emerald-300",
  accentBg: "bg-emerald-400/20 hover:bg-emerald-400/30",
  pill: "bg-emerald-300/20 text-emerald-100 ring-1 ring-emerald-300/30",
  link: "text-emerald-200 hover:text-emerald-100",
  btn:
    "px-5 py-3 rounded-full font-medium ring-1 ring-white/10 hover:ring-white/30 transition",
  btnPrimary:
    "bg-emerald-400/90 hover:bg-emerald-400 text-emerald-950",
  btnGhost:
    "bg-white/5 hover:bg-white/10 text-white",
};

const IMAGE = "http://localhost:3005/assets/img/2149043983.jpg";

// Tanggal pernikahan (silakan ubah sesuai kebutuhan, format: YYYY-MM-DDTHH:mm:ss)
const WEDDING_DATE = "2025-12-20T10:00:00"; // 20 Des 2025 10:00

const NAV_ITEMS = [
  { id: "mempelai", label: "Mempelai" },
  { id: "acara", label: "Acara" },
  { id: "galeri", label: "Galeri" },
  { id: "cerita", label: "Cerita" },
  { id: "rsvp", label: "RSVP" },
  { id: "hadiah", label: "Hadiah" },
  { id: "faq", label: "FAQ" },
];

type SectionId =
  | "mempelai"
  | "acara"
  | "galeri"
  | "cerita"
  | "rsvp"
  | "hadiah"
  | "faq";

// =======================
// Helper UI
// =======================
const SectionWrap: React.FC<
  React.PropsWithChildren<{ id: SectionId; className?: string; title?: string; subtitle?: string }>
> = ({ id, className, title, subtitle, children }) => {
  return (
    <section
      id={id}
      className={`scroll-mt-28 py-16 md:py-24 ${className || ""}`}
    >
      <div className="max-w-6xl mx-auto px-4">
        {title && (
          <div className="mb-10 md:mb-14 text-center">
            <span className={`inline-block mb-3 px-3 py-1 rounded-full text-sm tracking-wider ${THEME.pill}`}>
              {id.toUpperCase()}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-4 text-emerald-100/80 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className={`${THEME.glass} rounded-3xl p-6 md:p-10`}>
          {children}
        </div>
      </div>
    </section>
  );
};

// =======================
// Sticky Header
// =======================
const Header: React.FC<{ active: SectionId | null }> = ({ active }) => {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50`}>
      <nav
        className={`${THEME.glass} mx-auto mt-4 max-w-6xl rounded-full px-4 py-3 md:px-6 md:py-4 shadow-[0_10px_40px_rgba(0,0,0,.35)]`}
      >
        <div className="flex items-center gap-3">
          <a
            href="#mempelai"
            onClick={(e) => onClick(e, "mempelai")}
            className="shrink-0 flex items-center gap-2"
          >
            <span className="inline-block w-9 h-9 rounded-full ring-1 ring-white/20 overflow-hidden">
              {/* Logo kecil (pakai gambar placeholder) */}
              <img src={IMAGE} alt="Logo" className="w-full h-full object-cover" />
            </span>
            <span className="font-serif text-white text-lg hidden sm:inline">Undangan</span>
          </a>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => onClick(e, item.id)}
                className={`px-3 py-2 rounded-full text-sm sm:text-[0.95rem] transition ${active === (item.id as SectionId)
                    ? "bg-white/15 text-white"
                    : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

// =======================
// Hero Section (Countdown + Background Carousel)
// =======================
const Hero: React.FC = () => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(WEDDING_DATE.toString());

  const [index, setIndex] = useState(0);
  const images = useMemo(() => [IMAGE, IMAGE, IMAGE], []);

  useEffect(() => {
    const slide = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(slide);
  }, [images.length]);

  return (
    <section className="relative min-h-[96vh] md:min-h-screen overflow-hidden">
      {/* Background carousel */}
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Slide ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-out ${i === index ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        {/* Overlay gradient untuk elegan & keterbacaan */}
        <div className={`absolute inset-0 bg-gradient-to-b ${THEME.bgGradient} mix-blend-multiply`} />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Konten */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-40 md:pt-48 pb-24 text-center">
        <span className={`inline-block mb-4 px-4 py-1 rounded-full ${THEME.pill} text-xs tracking-[.2em]`}>
          THE WEDDING OF
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight drop-shadow-lg">
          Aisyah & Fajar
        </h1>
        <p className="mt-4 text-emerald-100/90">
          Sabtu, 20 Desember 2025 • Jakarta
        </p>

        {/* Countdown */}
        <div className={`${THEME.glass} mt-8 md:mt-10 inline-flex gap-4 md:gap-6 px-6 py-4 rounded-2xl text-white`}>
          <TimeBox label="Hari" value={days} />
          <Sep />
          <TimeBox label="Jam" value={hours} />
          <Sep />
          <TimeBox label="Menit" value={minutes} />
          <Sep />
          <TimeBox label="Detik" value={seconds} />
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a href="#rsvp" className={`${THEME.btn} ${THEME.btnPrimary}`}>Konfirmasi Kehadiran</a>
          <a href="#acara" className={`${THEME.btn} ${THEME.btnGhost}`}>Lihat Detail Acara</a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <a href="#mempelai" className="group inline-flex flex-col items-center text-white/70 hover:text-white transition">
          <span className="text-sm mb-1">Gulir</span>
          <span className="w-[2px] h-8 bg-white/50 rounded-full overflow-hidden relative">
            <span className="absolute top-0 left-0 right-0 w-full h-3 bg-white/90 rounded-full animate-[scrollcue_1.5s_ease-in-out_infinite]" />
          </span>
        </a>
      </div>
    </section>
  );
};

const TimeBox: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="text-center min-w-[64px]">
    <div className="text-2xl md:text-4xl font-semibold font-mono">{String(value).padStart(2, "0")}</div>
    <div className="text-xs opacity-80 mt-1">{label}</div>
  </div>
);
const Sep = () => <span className="w-px h-8 md:h-10 bg-white/20 self-center" />;

// =======================
// Galeri Carousel Sederhana
// =======================
const Gallery: React.FC = () => {
  const images = Array.from({ length: 10 }, () => IMAGE);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (delta: number) => {
    containerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 no-scrollbar"
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-[80%] sm:w-[55%] md:w-[40%] lg:w-[32%] rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-white/20 transition"
          >
            <img
              src={src}
              alt={`Galeri ${i + 1}`}
              className="w-full h-64 md:h-80 object-cover hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute -top-14 right-0 flex gap-2">
        <button
          onClick={() => scrollBy(-400)}
          className={`${THEME.btn} ${THEME.btnGhost}`}
          aria-label="Sebelumnya"
        >
          ‹
        </button>
        <button
          onClick={() => scrollBy(400)}
          className={`${THEME.btn} ${THEME.btnGhost}`}
          aria-label="Berikutnya"
        >
          ›
        </button>
      </div>
    </div>
  );
};

// =======================
// FAQ Accordion
// =======================
const Accordion: React.FC<{
  items: { q: string; a: string }[];
}> = ({ items }) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-white/10">
      {items.map((it, idx) => {
        const isOpen = open === idx;
        return (
          <div key={idx}>
            <button
              onClick={() => setOpen(isOpen ? null : idx)}
              className="w-full text-left py-4 md:py-5 flex items-center justify-between"
            >
              <span className="text-white text-lg">{it.q}</span>
              <span className={`ml-4 transition-transform ${isOpen ? "rotate-45" : ""}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current text-white/80">
                  <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} overflow-hidden`}
            >
              <div className="min-h-0">
                <p className="text-emerald-100/85 pb-4">
                  {it.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =======================
// Halaman
// =======================
export default function Page() {
  const [active, setActive] = useState<SectionId | null>(null);

  // Intersection Observer untuk menyorot link aktif
  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActive(vis[0].target.id as SectionId);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.2, 0.5, 1] }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <main className={`min-h-screen relative overflow-x-hidden`}>
      {/* Background Global: gradient + image lembut */}
      <div className={`fixed inset-0 -z-10`}>
        <div className={`absolute inset-0 bg-gradient-to-b ${THEME.bgGradient}`} />
        <img
          src={IMAGE}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.08),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,.05),transparent_40%)]" />
      </div>

      <Header active={active} />
      <Hero />

      {/* Mempelai */}
      <SectionWrap
        id="mempelai"
        title="Mempelai"
        subtitle="Dengan penuh rasa syukur dan bahagia, kami mengundang Anda untuk hadir dan memberikan doa restu di hari pernikahan kami."
      >
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          {/* Mempelai 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-40 h-40 rounded-full overflow-hidden ring-2 ring-white/20">
              <img src={IMAGE} alt="Mempelai Wanita" className="w-full h-full object-cover" />
            </div>
            <h3 className="mt-4 text-2xl font-serif text-white">Aisyah Putri</h3>
            <p className="text-emerald-100/80 mt-2">
              Putri dari Bapak Ahmad & Ibu Fatimah
            </p>
            <div className="mt-4 flex gap-3">
              <Social icon="ig" href="#" />
              <Social icon="tiktok" href="#" />
            </div>
          </div>
          {/* Mempelai 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-40 h-40 rounded-full overflow-hidden ring-2 ring-white/20">
              <img src={IMAGE} alt="Mempelai Pria" className="w-full h-full object-cover" />
            </div>
            <h3 className="mt-4 text-2xl font-serif text-white">Fajar Ramadhan</h3>
            <p className="text-emerald-100/80 mt-2">
              Putra dari Bapak Yusuf & Ibu Amina
            </p>
            <div className="mt-4 flex gap-3">
              <Social icon="ig" href="#" />
              <Social icon="tiktok" href="#" />
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <blockquote className="text-emerald-100/90 italic max-w-3xl mx-auto">
            “Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.”
          </blockquote>
        </div>
      </SectionWrap>

      {/* Acara */}
      <SectionWrap id="acara" title="Acara" subtitle="Waktu, tempat, dan informasi penting lainnya.">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card title="Akad Nikah">
              <ul className="text-emerald-100/85 space-y-1">
                <li><b className="text-white">Tanggal:</b> Sabtu, 20 Desember 2025</li>
                <li><b className="text-white">Waktu:</b> 10.00 – 11.00 WIB</li>
                <li><b className="text-white">Tempat:</b> Masjid Raya Al-Falah</li>
                <li><b className="text-white">Alamat:</b> Jl. Contoh No. 123, Jakarta</li>
              </ul>
            </Card>
            <Card title="Resepsi">
              <ul className="text-emerald-100/85 space-y-1">
                <li><b className="text-white">Waktu:</b> 12.00 – 15.00 WIB</li>
                <li><b className="text-white">Tempat:</b> Gedung Nusantara Ballroom</li>
                <li><b className="text-white">Alamat:</b> Jl. Contoh Raya No. 88, Jakarta</li>
              </ul>
            </Card>
            <Card title="Informasi Tambahan">
              <ul className="text-emerald-100/85 list-disc list-inside space-y-1">
                <li>Dress code: <span className={`${THEME.accent}`}>Emerald / Earthy Tone</span></li>
                <li>Mohon hadir tepat waktu</li>
                <li>Harap menjaga protokol sopan santun selama acara</li>
              </ul>
            </Card>
          </div>

          {/* Google Maps */}
          <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
            <div className="aspect-video">
              <iframe
                title="Lokasi Acara"
                src="https://maps.google.com/maps?q=Monas%2C%20Jakarta&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </SectionWrap>

      {/* Galeri */}
      <SectionWrap id="galeri" title="Galeri" subtitle="Memori kebersamaan yang kami abadikan.">
        <Gallery />
      </SectionWrap>

      {/* Cerita */}
      <SectionWrap id="cerita" title="Cerita Kami" subtitle="Jejak perjalanan cinta dalam beberapa babak.">
        <ol className="relative border-l border-white/10 pl-6 space-y-8">
          {[
            {
              title: "Pertemuan Pertama",
              time: "2019",
              text:
                "Bertemu di sebuah komunitas fotografi. Perkenalan singkat yang ternyata menjadi awal cerita panjang.",
            },
            {
              title: "Menjadi Pasangan",
              time: "2020",
              text:
                "Seiring waktu, kami saling menguatkan. Banyak hal dipelajari bersama, terutama tentang menghargai perbedaan.",
            },
            {
              title: "Lamaran",
              time: "2025",
              text:
                "Dengan keikhlasan dan restu keluarga, kami memutuskan untuk melangkah ke tahap yang lebih serius.",
            },
            {
              title: "Menuju Hari Bahagia",
              time: "2025",
              text:
                "Kami siap melangkah bersama, menapaki bab baru dengan harapan dan doa baik.",
            },
          ].map((item, i) => (
            <li key={i} className="group">
              <div className="absolute -left-[9px] mt-1 w-4 h-4 rounded-full bg-emerald-400/80 ring-4 ring-emerald-950" />
              <div className="ml-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-xl font-serif text-white">{item.title}</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-emerald-100/90">
                    {item.time}
                  </span>
                </div>
                <p className="text-emerald-100/85 mt-2">{item.text}</p>
                <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-white/10">
                  <img
                    src={IMAGE}
                    alt={item.title}
                    className="w-full h-56 md:h-72 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </SectionWrap>

      {/* RSVP */}
      <SectionWrap id="rsvp" title="RSVP" subtitle="Konfirmasi kehadiran Anda di bawah ini.">
        <RSVPForm />
      </SectionWrap>

      {/* Hadiah */}
      <SectionWrap id="hadiah" title="Hadiah" subtitle="Terima kasih atas doa dan dukungan Anda.">
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Transfer Rekening">
            <ul className="text-emerald-100/85 space-y-3">
              {[
                { bank: "BCA", no: "1234567890", nama: "Aisyah Putri" },
                { bank: "Mandiri", no: "9876543210", nama: "Fajar Ramadhan" },
              ].map((acc, i) => (
                <li key={i} className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-white font-medium">{acc.bank}</div>
                    <div className="text-sm opacity-80">{acc.no} a.n. {acc.nama}</div>
                  </div>
                  <button
                    onClick={() => copy(`${acc.bank} ${acc.no} a.n. ${acc.nama}`)}
                    className={`${THEME.btn} ${THEME.btnGhost}`}
                  >
                    Salin
                  </button>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="E-Wallet / Link Hadiah">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-emerald-100/85">QR (contoh)</span>
                <button className={`${THEME.btn} ${THEME.btnGhost}`} onClick={() => copy("https://contoh.link/hadiah")}>
                  Salin Link
                </button>
              </div>
              <div className="rounded-xl overflow-hidden ring-1 ring-white/10">
                <img src={IMAGE} alt="QR Gift" className="w-full h-56 object-cover" />
              </div>
            </div>
          </Card>
        </div>
      </SectionWrap>

      {/* FAQ */}
      <SectionWrap id="faq" title="FAQ" subtitle="Pertanyaan yang sering diajukan.">
        <Accordion
          items={[
            { q: "Apakah boleh membawa anak kecil?", a: "Tentu, kami senang menyambut keluarga Anda. Mohon tetap diawasi selama acara." },
            { q: "Apakah ada parkir?", a: "Ya, tersedia area parkir di lokasi gedung dan area sekitar." },
            { q: "Apakah harus membawa undangan fisik?", a: "Tidak wajib. Undangan digital ini sudah cukup." },
            { q: "Apakah ada dress code?", a: "Emerald / Earthy Tone, namun silakan sesuaikan dengan kenyamanan Anda." },
          ]}
        />
      </SectionWrap>

      {/* Footer */}
      <footer className="pt-10 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`${THEME.glass} rounded-3xl p-8 md:p-10`}>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/20">
                    <img src={IMAGE} alt="Logo" className="w-full h-full object-cover" />
                  </span>
                  <span className="font-serif text-white text-xl">Aisyah & Fajar</span>
                </div>
                <p className="text-emerald-100/80 mt-4 max-w-md">
                  Terima kasih telah menjadi bagian dari kisah kami. Doa dan kehadiran Anda sangat berarti.
                </p>
                <div className="mt-4 flex gap-3">
                  <Social icon="ig" href="#" />
                  <Social icon="tiktok" href="#" />
                </div>
              </div>

              <div>
                <h5 className="text-white font-semibold mb-3">Navigasi</h5>
                <ul className="space-y-2">
                  {NAV_ITEMS.map((n) => (
                    <li key={n.id}>
                      <a href={`#${n.id}`} className={`${THEME.link}`}>
                        {n.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-white font-semibold mb-3">Kontak</h5>
                <ul className="text-emerald-100/85 space-y-2">
                  <li>Email: <a className={`${THEME.link}`} href="mailto:hello@wedding.com">hello@wedding.com</a></li>
                  <li>Telepon: <a className={`${THEME.link}`} href="tel:+6200000000">+62 000 0000</a></li>
                  <li>Instagram: <a className={`${THEME.link}`} href="#">@aisyahfajarwedding</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center gap-3 md:gap-6 justify-between">
              <p className="text-emerald-100/70 text-sm">
                © {new Date().getFullYear()} Aisyah & Fajar. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <a href="#rsvp" className={`${THEME.btn} ${THEME.btnPrimary}`}>RSVP</a>
                <a href="#acara" className={`${THEME.btn} ${THEME.btnGhost}`}>Detail Acara</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Styles tambahan */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        /* Scroll cue keyframes */
        @keyframes scrollcue {
          0% { transform: translateY(0); opacity: .9; }
          100% { transform: translateY(14px); opacity: .2; }
        }
        /* Sembunyikan scrollbar horizontal galeri pada beberapa browser */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}

// =======================
// Komponen Kecil
// =======================
const Social: React.FC<{ icon: "ig" | "tiktok"; href: string }> = ({ icon, href }) => {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/10 transition"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={icon === "ig" ? "Instagram" : "TikTok"}
    >
      {icon === "ig" ? (
        <svg width="20" height="20" viewBox="0 0 24 24" className="fill-white/90">
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" className="fill-white/90">
          <path d="M21 7.5c-1.1-.4-2.1-1-3-1.8v9.1a5.7 5.7 0 1 1-5-5.6v2.7a3 3 0 1 0 2.2 2.9V2h2.7a7.5 7.5 0 0 0 3.1 3.7z" />
        </svg>
      )}
    </a>
  );
};

const Card: React.FC<React.PropsWithChildren<{ title: string; className?: string }>> = ({
  title,
  className,
  children,
}) => (
  <div className={`rounded-2xl p-5 ring-1 ring-white/10 bg-white/5 ${className || ""}`}>
    <h4 className="text-white font-semibold text-lg mb-3">{title}</h4>
    <div>{children}</div>
  </div>
);

function copy(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(text);
    alert("Tersalin!");
  }
}

// =======================
// RSVP Form
// =======================
const RSVPForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [data, setData] = useState({
    nama: "",
    email: "",
    hadir: "Hadir",
    jumlah: 1,
    pesan: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulasi submit — integrasikan ke API Anda sendiri di sini.
      await new Promise((r) => setTimeout(r, 800));
      console.log("RSVP:", data);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Field label="Nama Lengkap">
          <input
            required
            type="text"
            value={data.nama}
            onChange={(e) => setData((d) => ({ ...d, nama: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-emerald-300/40 focus:outline-none text-white placeholder:text-white/50"
            placeholder="Nama Anda"
          />
        </Field>
        <Field label="Email">
          <input
            required
            type="email"
            value={data.email}
            onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-emerald-300/40 focus:outline-none text-white placeholder:text-white/50"
            placeholder="email@contoh.com"
          />
        </Field>
        <Field label="Kehadiran">
          <div className="flex gap-3">
            {["Hadir", "Tidak Bisa Hadir"].map((opt) => (
              <label key={opt} className={`flex-1 cursor-pointer ${THEME.accentBg} rounded-xl px-4 py-3 text-emerald-100/90 text-sm ring-1 ring-emerald-300/20 transition`}>
                <input
                  type="radio"
                  name="hadir"
                  value={opt}
                  checked={data.hadir === opt}
                  onChange={() => setData((d) => ({ ...d, hadir: opt }))}
                  className="mr-2 accent-emerald-400"
                />
                {opt}
              </label>
            ))}
          </div>
        </Field>
      </div>

      <div className="space-y-4">
        <Field label="Jumlah Tamu">
          <input
            type="number"
            min={1}
            value={data.jumlah}
            onChange={(e) => setData((d) => ({ ...d, jumlah: Number(e.target.value) }))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-emerald-300/40 focus:outline-none text-white"
          />
        </Field>
        <Field label="Pesan">
          <textarea
            rows={5}
            value={data.pesan}
            onChange={(e) => setData((d) => ({ ...d, pesan: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 focus:ring-emerald-300/40 focus:outline-none text-white placeholder:text-white/50"
            placeholder="Ucapan & doa..."
          />
        </Field>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || sent}
            className={`${THEME.btn} ${THEME.btnPrimary} disabled:opacity-60`}
          >
            {sent ? "Terkirim ✓" : loading ? "Mengirim..." : "Kirim RSVP"}
          </button>
          <button
            type="button"
            onClick={() => setData({ nama: "", email: "", hadir: "Hadir", jumlah: 1, pesan: "" })}
            className={`${THEME.btn} ${THEME.btnGhost}`}
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};

const Field: React.FC<React.PropsWithChildren<{ label: string }>> = ({ label, children }) => (
  <label className="block">
    <div className="text-white/90 mb-2">{label}</div>
    {children}
  </label>
);
