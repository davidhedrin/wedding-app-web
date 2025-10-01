"use client";

import useCountdown from "@/lib/countdown";
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Invitation Type: Wedding
 * Theme Name: "Midnight Elegance"
 * Create At: 08-09-2025
 * Create By: David
*/

// --- Configurable bits ---
const THEME = {
  bg: "from-[#0B1220] via-[#0E1627] to-[#121A2E]", // deep navy gradient
  accent: "text-[#F2C265]", // warm gold
  accentBg: "bg-[#F2C265]",
  accentRing: "ring-[#F2C265]/40",
  soft: "text-[#B8C2D6]", // soft slate
  softBg: "bg-white/5",
};
const PLACEHOLDER_IMG = "http://localhost:3005/assets/img/2149043983.jpg";
const WEDDING_DATE = new Date();
WEDDING_DATE.setDate(WEDDING_DATE.getDate() + 12);


export default function Page() {
  // --- Refs for nav ---
  const sections = {
    mempelai: useRef<HTMLDivElement | null>(null),
    acara: useRef<HTMLDivElement | null>(null),
    galeri: useRef<HTMLDivElement | null>(null),
    cerita: useRef<HTMLDivElement | null>(null),
    rsvp: useRef<HTMLDivElement | null>(null),
    hadiah: useRef<HTMLDivElement | null>(null),
    faq: useRef<HTMLDivElement | null>(null),
  };

  // --- Active link tracking ---
  const [active, setActive] = useState<keyof typeof sections>("mempelai");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.getAttribute("data-section-id") as keyof typeof sections;
            if (id) setActive(id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.3, 0.6, 1] }
    );
    Object.entries(sections).forEach(([id, ref]) => {
      if (ref.current) {
        ref.current.setAttribute("data-section-id", id);
        obs.observe(ref.current);
      }
    });
    return () => obs.disconnect();
  }, []);

  // --- Smooth scroll helper ---
  const goTo = (key: keyof typeof sections) => {
    sections[key].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // --- Countdown ---
  const { days, hours, minutes, seconds, isExpired } = useCountdown(WEDDING_DATE.toString());

  // --- Hero background carousel (auto-play) ---
  const heroImages = useMemo(() => [PLACEHOLDER_IMG, PLACEHOLDER_IMG, PLACEHOLDER_IMG], []);
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(t);
  }, [heroImages.length]);

  // --- Gallery slider state ---
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const nextSlide = () => galleryRef.current?.scrollBy({ left: galleryRef.current.clientWidth, behavior: "smooth" });
  const prevSlide = () => galleryRef.current?.scrollBy({ left: -galleryRef.current.clientWidth, behavior: "smooth" });

  // --- RSVP fake submit ---
  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "sending" | "sent">("idle");
  const onSubmitRSVP = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRsvpStatus("sending");
    setTimeout(() => setRsvpStatus("sent"), 1200);
  };

  // --- Copy helper ---
  const copy = async (txt: string) => {
    try {
      await navigator.clipboard.writeText(txt);
      alert("Disalin ke clipboard.");
    } catch {
      alert("Gagal menyalin, silakan salin manual.");
    }
  };

  return (
    <main className={`min-h-screen bg-gradient-to-b ${THEME.bg} text-white relative`}>
      {/* Global smooth scroll & decorative noise */}
      <style>{`
        html { scroll-behavior: smooth; }
        .noise:before {
          content:"";
          position: absolute; inset:0;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events:none;
        }
      `}</style>

      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-[#0C1323]/60 bg-[#0C1323]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${THEME.accentBg} grid place-items-center ring-2 ${THEME.accentRing}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 12c2-5 6-8 8-8s6 3 8 8-6 8-8 8-10-3-8-8Z" stroke="#1B2236" strokeWidth="1.5" />
                <path d="M12 7l-3 5h6l-3 5" stroke="#1B2236" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="font-serif text-lg tracking-wide">
              <span className={THEME.accent}>A & R</span> — Wedding
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {[
              ["Mempelai", "mempelai"],
              ["Acara", "acara"],
              ["Galeri", "galeri"],
              ["Cerita", "cerita"],
              ["RSVP", "rsvp"],
              ["Hadiah", "hadiah"],
              ["FAQ", "faq"],
            ].map(([label, key]) => (
              <button
                key={key}
                onClick={() => goTo(key as keyof typeof sections)}
                className={`uppercase tracking-wider transition ${active === (key as keyof typeof sections) ? `${THEME.accent}` : "text-white/70 hover:text-white"
                  }`}
              >
                {label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => goTo("rsvp")}
            className={`md:inline-flex hidden px-4 py-2 rounded-full ${THEME.accentBg} text-[#1B2236] font-medium shadow-lg shadow-black/20 hover:scale-[1.03] active:scale-[0.98] transition`}
          >
            Konfirmasi Kehadiran
          </button>
        </div>
      </header>

      {/* Hero with background carousel + countdown */}
      <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
        {/* Background carousel */}
        <div className="absolute inset-0">
          {heroImages.map((src, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out will-change-opacity ${i === heroIndex ? "opacity-100" : "opacity-0"
                }`}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(11,18,32,.65), rgba(11,18,32,.85)), url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
        </div>

        {/* Floating decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-20 bg-[#F2C265]" />
          <div className="absolute -bottom-24 -left-24 w-[380px] h-[380px] rounded-full blur-3xl opacity-10 bg-[#F2C265]" />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <p className="uppercase tracking-[0.35em] text-white/70 text-xs md:text-sm mb-4">
            The Wedding of
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
            <span className={THEME.accent}>Alya</span> & <span className={THEME.accent}>Raka</span>
          </h1>
          <p className={`mt-4 md:mt-6 max-w-2xl ${THEME.soft}`}>
            Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir
            dalam acara pernikahan kami.
          </p>

          {/* Countdown */}
          <div className="mt-8 md:mt-10 grid grid-cols-4 gap-3 md:gap-4">
            {[
              ["Hari", days],
              ["Jam", hours],
              ["Menit", minutes],
              ["Detik", seconds],
            ].map(([label, val], idx) => (
              <div
                key={label}
                className={`px-4 py-3 md:px-6 md:py-4 rounded-2xl ${THEME.softBg} ring-1 ring-white/10 backdrop-blur transition-transform ${idx % 2 ? "hover:-translate-y-1" : "hover:translate-y-1"
                  }`}
              >
                <div className="text-2xl md:text-3xl font-semibold">{String(val).padStart(2, "0")}</div>
                <div className={`text-[11px] md:text-xs tracking-wider uppercase ${THEME.soft}`}>{label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex items-center gap-3">
            <button
              onClick={() => goTo("acara")}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 transition backdrop-blur text-sm md:text-base"
            >
              Lihat Detail Acara
            </button>
            <button
              onClick={() => goTo("rsvp")}
              className={`px-6 py-3 rounded-full ${THEME.accentBg} text-[#1B2236] font-medium shadow-lg shadow-black/20 hover:scale-[1.03] active:scale-[0.98] transition text-sm md:text-base`}
            >
              RSVP Sekarang
            </button>
          </div>

          <div className="mt-10 text-xs md:text-sm text-white/60">
            {isExpired ? "Acara telah dimulai" : `Menuju hari bahagia • ${WEDDING_DATE.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}
          </div>
        </div>
      </section>

      {/* —— Mempelai —— */}
      <section ref={sections.mempelai} className="relative noise">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28 scroll-mt-24">
          <Header title="Mempelai" subtitle="Kami yang berbahagia" />
          <div className="mt-10 grid md:grid-cols-2 gap-8 lg:gap-12">
            {[
              { name: "Alya Putri", role: "Putri dari Bapak A & Ibu B", img: PLACEHOLDER_IMG },
              { name: "Raka Pratama", role: "Putra dari Bapak C & Ibu D", img: PLACEHOLDER_IMG },
            ].map((p, i) => (
              <div key={i} className="group relative rounded-3xl overflow-hidden ring-1 ring-white/10">
                <img src={p.img} alt={p.name} className="h-72 md:h-96 w-full object-cover group-hover:scale-[1.03] transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/40 to-transparent" />
                <div className="absolute bottom-0 p-6 md:p-8">
                  <h3 className="font-serif text-2xl md:text-3xl">{p.name}</h3>
                  <p className={`${THEME.soft} mt-1`}>{p.role}</p>
                </div>
              </div>
            ))}
          </div>

          <p className={`mt-10 md:mt-12 max-w-3xl mx-auto text-center ${THEME.soft}`}>
            “Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
            berkenan hadir untuk memberikan doa restu kepada kami.”
          </p>
        </div>
      </section>

      {/* —— Acara —— */}
      <section ref={sections.acara} className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28 scroll-mt-24">
          <Header title="Acara" subtitle="Waktu & Tempat" />
          <div className="mt-10 grid lg:grid-cols-2 gap-8">
            {/* Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Akad Nikah",
                  time: "Sabtu, 20 Desember 2025 • 10.00 WIB",
                  place: "Masjid Agung Sentosa",
                  addr: "Jl. Melati No. 1, Jakarta",
                },
                {
                  title: "Resepsi",
                  time: "Sabtu, 20 Desember 2025 • 19.00 — 21.00 WIB",
                  place: "Grand Aurora Ballroom",
                  addr: "Jl. Bunga No. 88, Jakarta",
                },
              ].map((a, i) => (
                <div key={i} className={`p-6 rounded-2xl ${THEME.softBg} ring-1 ring-white/10`}>
                  <h4 className="font-serif text-xl">{a.title}</h4>
                  <p className={`${THEME.soft} mt-2`}>{a.time}</p>
                  <p className="mt-2 font-medium">{a.place}</p>
                  <p className={`${THEME.soft}`}>{a.addr}</p>
                </div>
              ))}
              <div className={`p-6 rounded-2xl ${THEME.softBg} ring-1 ring-white/10 sm:col-span-2`}>
                <h4 className="font-serif text-xl">Dress Code & Info</h4>
                <ul className={`${THEME.soft} mt-2 space-y-1 text-sm`}>
                  <li>• Formal / Batik Elegan (nuansa navy & gold)</li>
                  <li>• Mohon hadir 15 menit sebelum acara dimulai</li>
                  <li>• Parkir tersedia di basement & area timur</li>
                </ul>
              </div>
            </div>

            {/* Map */}
            <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10 aspect-[4/3]">
              <iframe
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.317606346648!2d106.82715267603856!3d-6.2197248937606305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3dfb3d5e0d9%3A0x3f4c9dd5b27d0b0b!2sJakarta%20Selatan!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                title="Lokasi Acara"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 text-xs text-center bg-gradient-to-t from-[#0B1220] to-transparent">
                <span className="opacity-80">Gunakan peta di atas untuk navigasi.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* —— Galeri —— */}
      <section ref={sections.galeri}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28 scroll-mt-24">
          <Header title="Galeri" subtitle="Jejak kenangan kami" />
          <div className="mt-8 relative">
            <div className="flex justify-between mb-3">
              <div className={`${THEME.soft}`}>Geser untuk menjelajah</div>
              <div className="flex gap-2">
                <button onClick={prevSlide} className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20">‹</button>
                <button onClick={nextSlide} className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20">›</button>
              </div>
            </div>

            <div
              ref={galleryRef}
              className="snap-x snap-mandatory overflow-x-auto flex gap-4 scroll-px-4 pb-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-white/20 rounded-2xl"
            >
              {Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="snap-start shrink-0 w-[78%] sm:w-[56%] md:w-[44%] lg:w-[32%] aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-white/10 relative group">
                  <img src={PLACEHOLDER_IMG} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-[1.04] transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* —— Cerita / Timeline —— */}
      <section ref={sections.cerita} className="relative">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28 scroll-mt-24">
          <Header title="Cerita Kami" subtitle="Perjalanan cinta dalam waktu" />
          <div className="mt-10 relative">
            <div className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
            <div className="space-y-10">
              {[
                { t: "2018", title: "Pertama Bertemu", desc: "Dipertemukan di kampus saat kegiatan organisasi." },
                { t: "2020", title: "Menjalin Komitmen", desc: "Saling mengenal lebih dalam dan bertumbuh bersama." },
                { t: "2024", title: "Lamaran", desc: "Mendapat restu kedua keluarga pada momen yang hangat." },
                { t: "2025", title: "Menuju Pelaminan", desc: "Menyiapkan hari bahagia dengan penuh syukur." },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="grid sm:grid-cols-2 gap-6 items-center">
                    <div className={`sm:col-start-${i % 2 === 0 ? 1 : 2} ${i % 2 === 0 ? "" : "sm:order-2"}`}>
                      <div className={`p-6 rounded-2xl ${THEME.softBg} ring-1 ring-white/10`}>
                        <div className="text-xs uppercase tracking-widest opacity-70">{item.t}</div>
                        <h4 className="font-serif text-2xl mt-1">{item.title}</h4>
                        <p className={`${THEME.soft} mt-2`}>{item.desc}</p>
                      </div>
                    </div>
                    <div className={`sm:col-start-${i % 2 === 0 ? 2 : 1}`}>
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden ring-1 ring-white/10">
                        <img src={PLACEHOLDER_IMG} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                    </div>
                  </div>
                  <div className={`absolute left-6 sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${THEME.accentBg} ring-4 ring-[#F2C265]/20`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* —— RSVP —— */}
      <section ref={sections.rsvp} className="relative">
        <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28 scroll-mt-24">
          <Header title="RSVP" subtitle="Konfirmasi kehadiran Anda" />
          <form onSubmit={onSubmitRSVP} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Nama Lengkap" placeholder="Tulis nama Anda" required />
            <Input label="Kontak (Email/HP)" placeholder="Contoh: 08xx atau email" required />
            <Select
              label="Kehadiran"
              options={["Hadir", "Tidak Hadir", "Masih Ragu"]}
              required
            />
            <Select
              label="Jumlah Tamu"
              options={["1 Orang", "2 Orang", "3 Orang", "4+ Orang"]}
              required
            />
            <Textarea label="Ucapan / Doa" placeholder="Tinggalkan pesan hangat untuk pengantin" className="md:col-span-2" />
            <div className="md:col-span-2 flex items-center justify-between gap-3">
              <div className={`${THEME.soft} text-sm`}>Kami sangat menantikan kehadiran Anda.</div>
              <button
                type="submit"
                disabled={rsvpStatus !== "idle"}
                className={`px-6 py-3 rounded-full ${THEME.accentBg} text-[#1B2236] font-medium shadow-lg shadow-black/20 transition hover:scale-[1.02] disabled:opacity-60`}
              >
                {rsvpStatus === "sending" ? "Mengirim..." : rsvpStatus === "sent" ? "Terkirim ✓" : "Kirim RSVP"}
              </button>
            </div>
          </form>
          {rsvpStatus === "sent" && (
            <div className="mt-5 p-4 rounded-xl bg-emerald-500/15 text-emerald-200 border border-emerald-300/20">
              Terima kasih! RSVP Anda sudah tercatat.
            </div>
          )}
        </div>
      </section>

      {/* —— Hadiah —— */}
      <section ref={sections.hadiah} className="relative">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28 scroll-mt-24">
          <Header title="Hadiah" subtitle="Wujud kasih sayang Anda" />
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl ${THEME.softBg} ring-1 ring-white/10`}>
              <h4 className="font-serif text-xl">Transfer Bank</h4>
              <div className="mt-3 space-y-2 text-sm">
                <RowItem label="Bank" value="BCA" />
                <RowItem label="No. Rekening" value="1234567890" copyable onCopy={() => copy("1234567890")} />
                <RowItem label="Atas Nama" value="Alya Putri" />
              </div>
            </div>
            <div className={`p-6 rounded-2xl ${THEME.softBg} ring-1 ring-white/10`}>
              <h4 className="font-serif text-xl">E-Wallet</h4>
              <div className="mt-3 space-y-2 text-sm">
                <RowItem label="OVO" value="081234567890" copyable onCopy={() => copy("081234567890")} />
                <RowItem label="GoPay" value="081234567891" copyable onCopy={() => copy("081234567891")} />
                <RowItem label="DANA" value="081234567892" copyable onCopy={() => copy("081234567892")} />
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#"
              className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 transition"
            >
              Kirim Hadiah via Link
            </a>
            <div className={`${THEME.soft} text-sm`}>Terima kasih atas doa dan perhatiannya.</div>
          </div>
        </div>
      </section>

      {/* —— FAQ —— */}
      <section ref={sections.faq} className="relative">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28 scroll-mt-24">
          <Header title="FAQ" subtitle="Pertanyaan yang sering diajukan" />
          <div className="mt-8 divide-y divide-white/10 rounded-2xl overflow-hidden ring-1 ring-white/10">
            {[
              { q: "Apakah anak-anak diperbolehkan hadir?", a: "Tentu, mohon tetap dalam pendampingan orang tua." },
              { q: "Apakah ada area parkir?", a: "Ya, tersedia di basement & area timur gedung." },
              { q: "Bolehkah membawa bunga atau kado fisik?", a: "Boleh. Panitia akan membantu penempatan kado di area welcome desk." },
              { q: "Apakah ada live streaming?", a: "Informasi tautan akan dibagikan mendekati hari-H melalui pesan." },
            ].map((item, idx) => (
              <Accordion key={idx} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* —— Footer —— */}
      <footer className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${THEME.accentBg} grid place-items-center ring-2 ${THEME.accentRing}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12c2-5 6-8 8-8s6 3 8 8-6 8-8 8-10-3-8-8Z" stroke="#1B2236" strokeWidth="1.5" />
                    <path d="M12 7l-3 5h6l-3 5" stroke="#1B2236" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="font-serif text-lg tracking-wide">
                  <span className={THEME.accent}>A & R</span> — Wedding
                </div>
              </div>
              <p className={`${THEME.soft} mt-4 text-sm`}>
                Terima kasih telah menjadi bagian dari momen berharga kami.
              </p>
            </div>
            <div>
              <h5 className="font-serif text-lg mb-3">Navigasi</h5>
              <ul className="space-y-2 text-sm">
                {[
                  ["Mempelai", "mempelai"],
                  ["Acara", "acara"],
                  ["Galeri", "galeri"],
                  ["Cerita", "cerita"],
                  ["RSVP", "rsvp"],
                  ["Hadiah", "hadiah"],
                  ["FAQ", "faq"],
                ].map(([label, key]) => (
                  <li key={key}>
                    <button onClick={() => goTo(key as keyof typeof sections)} className="opacity-80 hover:opacity-100">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-serif text-lg mb-3">Kontak</h5>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Email: alyaandraka@example.com</li>
                <li>Telepon: 0812-3456-7890</li>
                <li>Instagram: @alya.raka.wedding</li>
              </ul>
            </div>
            <div>
              <h5 className="font-serif text-lg mb-3">Aksi Cepat</h5>
              <div className="flex flex-col gap-2">
                <button onClick={() => goTo("rsvp")} className={`px-4 py-2 rounded-lg ${THEME.accentBg} text-[#1B2236] font-medium`}>
                  Konfirmasi Kehadiran
                </button>
                <a href="#" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-center">
                  Tambah ke Kalender
                </a>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 text-xs text-white/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>© {new Date().getFullYear()} Alya & Raka — All rights reserved.</div>
            <div className="flex items-center gap-3">
              <a href="#" className="opacity-75 hover:opacity-100">Kebijakan Privasi</a>
              <span className="opacity-40">•</span>
              <a href="#" className="opacity-75 hover:opacity-100">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* =================== Reusable UI =================== */

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      {subtitle && <div className="uppercase tracking-[0.35em] text-white/60 text-xs">{subtitle}</div>}
      <h2 className="font-serif text-3xl md:text-4xl mt-2">{title}</h2>
      <div className="mx-auto mt-4 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#F2C265] to-transparent" />
    </div>
  );
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-sm opacity-90">{label}</span>
      <input
        {...props}
        className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-[#F2C265]/40"
      />
    </label>
  );
}

function Select({ label, options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="text-sm opacity-90">{label}</span>
      <select
        {...props}
        className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-[#F2C265]/40"
      >
        <option value="" disabled hidden>
          Pilih salah satu
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({ label, className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-sm opacity-90">{label}</span>
      <textarea
        {...props}
        rows={4}
        className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-[#F2C265]/40 resize-y"
      />
    </label>
  );
}

function RowItem({
  label,
  value,
  copyable,
  onCopy,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-white/10 last:border-0">
      <div className="opacity-70">{label}</div>
      <div className="flex items-center gap-2">
        <div className="font-mono">{value}</div>
        {copyable && (
          <button onClick={onCopy} className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/15 border border-white/20">
            Salin
          </button>
        )}
      </div>
    </div>
  );
}

function Accordion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white/5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-white/[.06] transition"
      >
        <span className="font-medium">{question}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      <div
        className={`px-5 overflow-hidden transition-[grid-template-rows] grid ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
      >
        <div className="min-h-0">
          <p className="pb-5 text-sm opacity-85">{answer}</p>
        </div>
      </div>
    </div>
  );
}
