// pages/invitation-light.tsx
'use client';

// pages/invitation.tsx
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

type RSVP = {
  name: string;
  guestCount: number;
  email: string;
  message?: string;
  attending: "yes" | "no" | "maybe";
};

export default function Invitation() {
  // ---------- CONFIG ----------
  // Ubah eventDate sesuai kebutuhan:
  const eventDate = new Date("2025-10-05T18:00:00"); // contoh: Oct 5, 2025 18:00
  const eventTimezone = "Asia/Jakarta";
  const heroImages = [
    "http://localhost:3005/assets/img/2149043983.jpg",
    // kamu bisa tambahkan path lain; contoh fallback
  ];
  const googleMapsEmbed =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126917.123456789!2d106.689429!3d-6.200000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMjQuMCJTIDEwNsKwNDEnMjEuMCJF!5e0!3m2!1sen!2sid!4v0000000000000";
  // ---------- REFS FOR SECTIONS ----------
  const homeRef = useRef<HTMLElement | null>(null);
  const welcomeRef = useRef<HTMLElement | null>(null);
  const detailRef = useRef<HTMLElement | null>(null);
  const galleryRef = useRef<HTMLElement | null>(null);
  const storyRef = useRef<HTMLElement | null>(null);
  const rsvpRef = useRef<HTMLElement | null>(null);
  const giftsRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);

  // ---------- COUNTDOWN ----------
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const msDiff = eventDate.getTime() - now.getTime();
  const isPast = msDiff < 0;
  const isSameDay =
    now.toDateString() === eventDate.toDateString() && !isPast; // saat H
  const timeLeft = {
    days: Math.max(0, Math.floor(Math.abs(msDiff) / (1000 * 60 * 60 * 24))),
    hours: Math.max(
      0,
      Math.floor((Math.abs(msDiff) / (1000 * 60 * 60)) % 24)
    ),
    minutes: Math.max(0, Math.floor((Math.abs(msDiff) / (1000 * 60)) % 60)),
    seconds: Math.max(0, Math.floor((Math.abs(msDiff) / 1000) % 60)),
  };

  // ---------- HERO MEDIA: play video or carousel fallback ----------
  const [useVideo] = useState<boolean>(true); // set false jika tidak ada video
  const [carouselIdx, setCarouselIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setCarouselIdx((i) => (i + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // ---------- NAVIGATION ----------
  const navTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ---------- REVEAL ON SCROLL (IntersectionObserver) ----------
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("revealed");
            // optionally unobserve to prevent toggling
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ---------- GALLERY SLIDER ----------
  const galleryPics = [
    "http://localhost:3005/assets/img/2149043983.jpg",
    // duplikasi catatan: tambahkan lebih banyak gambar jika tersedia
  ];
  const [galleryIndex, setGalleryIndex] = useState(0);
  const prevGallery = () =>
    setGalleryIndex((i) => (i - 1 + galleryPics.length) % galleryPics.length);
  const nextGallery = () => setGalleryIndex((i) => (i + 1) % galleryPics.length);

  // ---------- TIMELINE DATA ----------
  const timeline = [
    { year: "2005", title: "Pertama kali bertemu", text: "Momen lucu saat..." },
    { year: "2012", title: "Liburan bareng", text: "Cerita pantai dan..." },
    { year: "2020", title: "Momen penting", text: "Satu tahun yang penuh..." },
    { year: "2024", title: "Menuju hari ini", text: "Persiapan pesta..." },
  ];

  // ---------- RSVP ----------
  const [rsvp, setRsvp] = useState<RSVP>({
    name: "",
    guestCount: 1,
    email: "",
    attending: "yes",
    message: "",
  });
  const [rsvpStatus, setRsvpStatus] = useState<null | string>(null);
  const submitRSVP = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // minimal validation
    if (!rsvp.name || !rsvp.email) {
      setRsvpStatus("Silakan isi nama dan email.");
      return;
    }
    // Simulasi submit: kita akan membuka mailto sebagai fallback
    const body = encodeURIComponent(
      `Halo,\nSaya ${rsvp.name} (${rsvp.email})\nKehadiran: ${rsvp.attending}\nJumlah tamu: ${rsvp.guestCount}\nPesan: ${rsvp.message || "-" }\n\nTerima kasih.`
    );
    const subject = encodeURIComponent("RSVP Kehadiran Acara");
    window.location.href = `mailto:host@example.com?subject=${subject}&body=${body}`;
    setRsvpStatus("Membuka aplikasi email untuk mengirim RSVP...");
  };

  // ---------- ACCORDIONS ----------
  const [openGiftIdx, setOpenGiftIdx] = useState<number | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // ---------- STICKY HEADER HIDE ON SCROLL SMALL (optional) ----------
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ---------- COLORS & TYPOGRAPHY ----------
  // warna elegan: navy/teal/gold accents - hindari pink mencolok/full white
  return (
    <>
      <Head>
        {/* Fonts: script (great vibes or parisienne), serif, sans */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;600;700&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#3f0d12] via-[#1a1a2e] to-[#16213e] text-slate-200 selection:bg-rose-300/30">
        {/* ---------- HEADER / NAV ---------- */}
        <header
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl rounded-xl transition-all
            ${scrolled ? "backdrop-blur-md bg-white/6 shadow-lg" : "bg-white/4 backdrop-blur-sm"}
            border border-white/6`}
          style={{ backdropFilter: "saturate(120%) blur(8px)" }}
        >
          <nav className="flex items-center justify-between p-3 md:p-4">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navTo(homeRef)}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-amber-900 font-bold shadow-inner">
                R
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ fontFamily: "Montserrat" }}>
                  Rayakan Rara
                </div>
                <div className="text-xs text-white/60">5 Okt 2025</div>
              </div>
            </div>

            <ul className="hidden md:flex items-center gap-4 text-sm">
              <li className="cursor-pointer px-3 py-2 rounded-md hover:bg-white/6 transition"
                  onClick={() => navTo(homeRef)}>Home</li>
              <li className="cursor-pointer px-3 py-2 rounded-md hover:bg-white/6 transition"
                  onClick={() => navTo(welcomeRef)}>Welcome</li>
              <li className="cursor-pointer px-3 py-2 rounded-md hover:bg-white/6 transition"
                  onClick={() => navTo(detailRef)}>Detail Acara</li>
              <li className="cursor-pointer px-3 py-2 rounded-md hover:bg-white/6 transition"
                  onClick={() => navTo(galleryRef)}>Galeri</li>
              <li className="cursor-pointer px-3 py-2 rounded-md hover:bg-white/6 transition"
                  onClick={() => navTo(rsvpRef)}>RSVP</li>
            </ul>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navTo(rsvpRef)}
                className="px-3 py-2 rounded-md bg-amber-400/90 text-amber-900 font-semibold shadow hover:scale-105 transition-transform"
              >
                Konfirmasi
              </button>
            </div>
          </nav>
        </header>

        <main className="pt-28">
          {/* ---------------- HOME / HERO ---------------- */}
          <section
            ref={homeRef}
            className="relative overflow-hidden"
            aria-label="Home"
          >
            {/* Hero media */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
              {useVideo ? (
                <video
                  className="w-full h-full object-cover opacity-80 transform scale-105"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  {/* Tambahkan src video lokal di public folder */}
                  <source src="/assets/video/hero-loop.mp4" type="video/mp4" />
                  {/* fallback ke image carousel */}
                  <img src={heroImages[carouselIdx]} alt="hero fallback" />
                </video>
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src={heroImages[carouselIdx]}
                    alt="hero"
                    className="w-full h-full object-cover transition-opacity duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/60" />
                </div>
              )}
            </div>

            {/* overlay */}
            <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left: Countdown + CTA */}
                <div className="space-y-6" data-reveal>
                  <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/6 backdrop-blur-sm text-xs">
                    <span className="text-amber-300 font-semibold">Undangan Digital</span>
                    <span className="text-white/60">•</span>
                    <span className="text-white/60">{eventTimezone}</span>
                  </div>

                  <h1 className="text-4xl md:text-6xl leading-tight font-serif" style={{ fontFamily: "Great Vibes, Playfair Display, serif" }}>
                    <span className="block text-amber-300 text-6xl md:text-8xl drop-shadow-md">Rara</span>
                    <span className="block text-xl md:text-2xl font-playfair text-white/90">Merayakan 27 Tahun</span>
                  </h1>

                  <p className="text-white/80 max-w-xl md:text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Bergabunglah bersama kami dalam malam yang hangat, penuh tawa, dan kenangan.
                    Dress code: Semi-formal. Tema: Coastal Chic.
                  </p>

                  {/* Countdown Card */}
                  <div className="w-full md:w-auto mt-2">
                    <div
                      className="p-4 md:p-6 rounded-2xl bg-gradient-to-r from-slate-900/60 to-slate-800/50 border border-white/6 shadow-lg backdrop-blur"
                      data-reveal
                    >
                      {!isPast && !isSameDay && (
                        <div className="flex items-center gap-4">
                          <div className="flex gap-2">
                            {["Days", "Hours", "Min", "Sec"].map((lab, i) => {
                              const val = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds][i];
                              return (
                                <div key={lab} className="text-center px-3 py-2 min-w-[64px] bg-white/5 rounded-lg">
                                  <div className="text-2xl font-semibold">{val}</div>
                                  <div className="text-xs text-white/60">{lab}</div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="ml-auto text-right">
                            <div className="text-xs text-white/60">Acara dimulai pada:</div>
                            <div className="font-medium">{eventDate.toLocaleString()}</div>
                          </div>
                        </div>
                      )}

                      {isSameDay && (
                        <div className="text-center py-6">
                          <h3 className="text-2xl font-semibold">Hari Ini!</h3>
                          <p className="text-sm text-white/70">Acara sedang berlangsung — datang dan rayakan bersama kami.</p>
                          <div className="mt-3 flex items-center justify-center gap-3">
                            <button
                              onClick={() => navTo(detailRef)}
                              className="px-4 py-2 rounded-lg bg-amber-400 text-amber-900 font-semibold transform hover:scale-105 transition"
                            >
                              Detail Acara
                            </button>
                            <button
                              onClick={() => navTo(rsvpRef)}
                              className="px-4 py-2 rounded-lg border border-white/10 text-white/80 hover:bg-white/6 transition"
                            >
                              Konfirmasi Sekarang
                            </button>
                          </div>
                        </div>
                      )}

                      {isPast && (
                        <div className="text-center py-6">
                          <h3 className="text-2xl font-semibold">Acara Telah Selesai</h3>
                          <p className="text-sm text-white/70">Terima kasih kepada semua yang hadir. Lihat galeri kenangan di bawah.</p>
                          <div className="mt-3">
                            <button
                              onClick={() => navTo(galleryRef)}
                              className="px-4 py-2 rounded-lg bg-white/6 text-white/90 hover:scale-105 transition"
                            >
                              Lihat Galeri
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-4 mt-4" data-reveal>
                    <button
                      onClick={() => navTo(welcomeRef)}
                      className="px-6 py-3 rounded-full bg-amber-400 text-amber-900 font-bold shadow-lg transform transition hover:scale-105 hover:shadow-[0_6px_30px_rgba(250,204,21,0.18)]"
                      style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}
                    >
                      Lihat Undangan
                    </button>
                    <button
                      onClick={() => navTo(giftsRef)}
                      className="px-4 py-2 rounded-full border border-white/10 text-white/80 hover:bg-white/6 transition"
                    >
                      Info Hadiah
                    </button>
                  </div>
                </div>

                {/* Right: decorative card / quick info */}
                <div className="hidden md:flex items-center justify-center">
                  <div
                    className="w-[360px] h-[380px] rounded-3xl p-6 relative bg-gradient-to-b from-white/6 to-white/3 border border-white/6 shadow-xl"
                    data-reveal
                    style={{ backdropFilter: "blur(6px)" }}
                  >
                    <div className="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-tr from-amber-200 to-amber-400 opacity-80 blur-xl" />
                    <div className="relative z-10 flex flex-col items-start gap-3">
                      <div className="w-full flex items-center justify-between">
                        <div>
                          <div className="text-xs text-white/70">Untuk</div>
                          <div className="text-lg font-semibold">Keluarga & Teman</div>
                        </div>
                        <div className="text-xs text-white/60">5 Okt 2025</div>
                      </div>

                      <div className="mt-3">
                        <img
                          src="http://localhost:3005/assets/img/2149043983.jpg"
                          alt="profile"
                          className="w-28 h-28 rounded-xl object-cover border border-white/8 shadow-sm"
                        />
                      </div>

                      <div className="mt-4 text-white/80">
                        <div className="text-sm">Lokasi</div>
                        <div className="font-medium">The Coastal Hall — Jl. Kenangan No. 12</div>
                      </div>

                      <div className="mt-6 text-sm text-white/60">
                        <div>Dress Code</div>
                        <div className="font-medium">Semi-formal • Coastal Chic</div>
                      </div>

                      <div className="mt-4">
                        <button
                          onClick={() => navTo(detailRef)}
                          className="px-4 py-2 rounded-md bg-white/6 hover:bg-white/8 transition"
                        >
                          Arah & Detail
                        </button>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 text-[10px] text-white/40">💫</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- WELCOME ---------------- */}
          <section ref={welcomeRef} className="py-20 px-6 max-w-6xl mx-auto" aria-label="Welcome">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2" data-reveal>
                <h2 className="text-3xl md:text-4xl font-serif mb-3" style={{ fontFamily: "Playfair Display, serif" }}>
                  Selamat Datang
                </h2>
                <p className="text-white/80 max-w-2xl">
                  Terima kasih telah menjadi bagian dari perjalanan hidup Rara. Malam ini adalah perayaan kecil yang
                  hangat — penuh cerita, tawa, dan kenangan. <br />
                  Kami harap kamu dapat hadir dan berbagi momen spesial ini bersama kami.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/4 border border-white/6">
                    <div className="text-xs text-white/60">Nama</div>
                    <div className="font-semibold text-lg">Rara A. Putri</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/4 border border-white/6">
                    <div className="text-xs text-white/60">Umur</div>
                    <div className="font-semibold text-lg">27 Tahun</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center md:justify-end" data-reveal>
                <div className="w-64 h-64 rounded-2xl overflow-hidden border border-white/6 shadow-lg">
                  <img
                    src="http://localhost:3005/assets/img/2149043983.jpg"
                    alt="birthday-person"
                    className="w-full h-full object-cover transform hover:scale-105 transition"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- DETAIL ACARA ---------------- */}
          <section ref={detailRef} className="py-16 px-6 bg-slate-900/20 border-t border-white/6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div data-reveal>
                <h3 className="text-2xl font-serif mb-4">Detail Acara</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/4 border border-white/6">
                    <div className="text-xs text-white/60">Tanggal</div>
                    <div className="font-medium">{eventDate.toLocaleDateString()}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/4 border border-white/6">
                    <div className="text-xs text-white/60">Waktu</div>
                    <div className="font-medium">{eventDate.toLocaleTimeString()}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/4 border border-white/6">
                    <div className="text-xs text-white/60">Tempat</div>
                    <div className="font-medium">The Coastal Hall — Jl. Kenangan No. 12</div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/4 border border-white/6">
                    <div className="text-xs text-white/60">Dress Code</div>
                    <div className="font-medium">Semi-formal • Coastal Chic</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-2">Agenda Singkat</h4>
                  <ul className="list-inside list-disc text-white/80">
                    <li>18:00 - Kedatangan & Welcome Drink</li>
                    <li>19:00 - Sambutan & Makan Malam</li>
                    <li>20:30 - Potong Kue & Hiburan</li>
                    <li>22:00 - Penutupan</li>
                  </ul>
                </div>
              </div>

              <div data-reveal>
                <h4 className="text-lg font-semibold mb-3">Lokasi (Maps)</h4>
                <div className="w-full h-64 rounded-xl overflow-hidden border border-white/6">
                  <iframe
                    src={googleMapsEmbed}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="maps"
                  ></iframe>
                </div>

                <div className="mt-4 text-sm text-white/60">
                  <div className="mb-2">Parkir tersedia di area belakang. Jika butuh antar-jemput, hubungi panitia.</div>
                  <button
                    onClick={() => navTo(rsvpRef)}
                    className="mt-2 px-4 py-2 rounded-md bg-amber-400 text-amber-900 font-semibold"
                  >
                    Konfirmasi Kehadiran
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- GALERI ---------------- */}
          <section ref={galleryRef} className="py-16 px-6">
            <div className="max-w-6xl mx-auto" data-reveal>
              <h3 className="text-2xl font-serif mb-6">Galeri</h3>

              <div className="relative rounded-xl overflow-hidden border border-white/6">
                <img
                  src={galleryPics[galleryIndex]}
                  alt={`gallery-${galleryIndex}`}
                  className="w-full h-[420px] object-cover transition-transform duration-700"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <button
                    onClick={prevGallery}
                    className="p-3 rounded-full bg-white/6 hover:bg-white/8 transition"
                  >
                    ◀
                  </button>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <button
                    onClick={nextGallery}
                    className="p-3 rounded-full bg-white/6 hover:bg-white/8 transition"
                  >
                    ▶
                  </button>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {galleryPics.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIndex(i)}
                      className={`w-3 h-3 rounded-full ${i === galleryIndex ? "bg-amber-400" : "bg-white/20"}`}
                      aria-label={`dot-${i}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- CERITA / KENANGAN (TIMELINE) ---------------- */}
          <section ref={storyRef} className="py-16 px-6 bg-slate-900/12 border-t border-white/6">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-2xl font-serif mb-6" data-reveal>Kenangan & Cerita</h3>

              <div className="space-y-6">
                {timeline.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-4 md:p-6 rounded-xl bg-white/4 border border-white/6 flex gap-4 items-center"
                    data-reveal
                  >
                    <div className="w-16 h-16 shrink-0 rounded-lg bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-slate-900 font-bold">
                      {t.year}
                    </div>
                    <div>
                      <div className="font-semibold">{t.title}</div>
                      <div className="text-sm text-white/70">{t.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- RSVP ---------------- */}
          <section ref={rsvpRef} className="py-16 px-6">
            <div className="max-w-4xl mx-auto" data-reveal>
              <h3 className="text-2xl font-serif mb-4">RSVP</h3>
              <p className="text-white/70 mb-6">Konfirmasi kehadiranmu — sangat dinantikan!</p>

              <form onSubmit={submitRSVP} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="text-sm text-white/70">Nama</label>
                  <input
                    value={rsvp.name}
                    onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })}
                    className="mt-2 w-full rounded-lg p-3 bg-white/5 border border-white/6 outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="Nama lengkap"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70">Email</label>
                  <input
                    value={rsvp.email}
                    onChange={(e) => setRsvp({ ...rsvp, email: e.target.value })}
                    className="mt-2 w-full rounded-lg p-3 bg-white/5 border border-white/6 outline-none focus:ring-2 focus:ring-amber-300"
                    placeholder="email@contoh.com"
                    type="email"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70">Jumlah Tamu</label>
                  <input
                    value={rsvp.guestCount}
                    onChange={(e) => setRsvp({ ...rsvp, guestCount: Number(e.target.value) })}
                    className="mt-2 w-full rounded-lg p-3 bg-white/5 border border-white/6 outline-none"
                    type="number"
                    min={1}
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70">Kehadiran</label>
                  <select
                    value={rsvp.attending}
                    onChange={(e) => setRsvp({ ...rsvp, attending: e.target.value as any })}
                    className="mt-2 w-full rounded-lg p-3 bg-white/5 border border-white/6 outline-none"
                  >
                    <option value="yes">Hadir</option>
                    <option value="no">Tidak Bisa</option>
                    <option value="maybe">Mungkin</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-white/70">Pesan</label>
                  <textarea
                    value={rsvp.message}
                    onChange={(e) => setRsvp({ ...rsvp, message: e.target.value })}
                    className="mt-2 w-full rounded-lg p-3 bg-white/5 border border-white/6 outline-none"
                    rows={4}
                  />
                </div>

                <div className="col-span-2 flex items-center gap-4">
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-full bg-amber-400 text-amber-900 font-semibold hover:scale-105 transition"
                  >
                    Kirim RSVP
                  </button>

                  <div className="text-sm text-white/60">{rsvpStatus}</div>
                </div>
              </form>
            </div>
          </section>

          {/* ---------------- HADIAH (CARD / ACCORDION) ---------------- */}
          <section ref={giftsRef} className="py-16 px-6 bg-slate-900/12 border-t border-white/6">
            <div className="max-w-6xl mx-auto" data-reveal>
              <h3 className="text-2xl font-serif mb-6">Hadiah</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Rekening */}
                <div className="p-4 bg-white/4 rounded-xl border border-white/6">
                  <div className="text-sm text-white/60">Rekening Bank</div>
                  <div className="font-semibold text-lg mt-2">BCA • 123-456-7890</div>
                  <div className="text-sm text-white/60 mt-2">A/N Rara A. Putri</div>
                </div>

                {/* Card 2: E-Wallet */}
                <div className="p-4 bg-white/4 rounded-xl border border-white/6">
                  <div className="text-sm text-white/60">E-Wallet</div>
                  <div className="font-semibold text-lg mt-2">OVO • 0812-3456-7890</div>
                  <div className="text-sm text-white/60 mt-2">Terima kasih atas perhatiannya</div>
                </div>

                {/* Accordion for digital links */}
                <div className="p-4 bg-white/4 rounded-xl border border-white/6">
                  <button
                    onClick={() => setOpenGiftIdx(openGiftIdx === 0 ? null : 0)}
                    className="w-full text-left flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm text-white/60">Tautan Digital</div>
                      <div className="font-medium">Gift Registry</div>
                    </div>
                    <div className="text-white/60">{openGiftIdx === 0 ? "−" : "+"}</div>
                  </button>
                  {openGiftIdx === 0 && (
                    <div className="mt-3 text-sm text-white/70">
                      <div>Link: <a className="underline" href="#" onClick={(e)=>e.preventDefault()}>https://gift.example.com/rara</a></div>
                      <div className="mt-2 text-xs text-white/60">Khusus yang ingin memberikan hadiah non-fisik.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- FAQ ---------------- */}
          <section ref={faqRef} className="py-16 px-6">
            <div className="max-w-6xl mx-auto" data-reveal>
              <h3 className="text-2xl font-serif mb-6">FAQ</h3>

              <div className="space-y-4">
                {[
                  { q: "Apakah acara indoor atau outdoor?", a: "Acara utama indoor, namun area lounge semi-outdoor dengan sirkulasi udara." },
                  { q: "Apakah anak-anak diperbolehkan?", a: "Semua boleh hadir, namun mohon konfirmasi bila membawa lebih dari 1 anak." },
                  { q: "Apakah ada parkir?", a: "Tersedia parkir terbatas; disarankan carpool atau ojek online." },
                ].map((f, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/4 border border-white/6">
                    <button
                      onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}
                      className="w-full text-left flex items-center justify-between"
                    >
                      <div className="font-medium">{f.q}</div>
                      <div className="text-white/60">{openFaqIdx === i ? "−" : "+"}</div>
                    </button>
                    {openFaqIdx === i && <div className="mt-3 text-sm text-white/70">{f.a}</div>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- FOOTER ---------------- */}
          <footer className="py-10 px-6 border-t border-white/6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-white/60">
                © {new Date().getFullYear()} Undangan Ulang Tahun • Terima kasih atas perhatiannya
              </div>
              <div className="flex items-center gap-3">
                <a className="text-white/60 hover:text-amber-300" href="#" onClick={(e)=>{e.preventDefault(); navTo(homeRef);}}>Home</a>
                <a className="text-white/60 hover:text-amber-300" href="#" onClick={(e)=>{e.preventDefault(); navTo(detailRef);}}>Detail</a>
                <a className="text-white/60 hover:text-amber-300" href="#" onClick={(e)=>{e.preventDefault(); navTo(rsvpRef);}}>RSVP</a>
              </div>
            </div>
          </footer>
        </main>

        {/* ---------------- INLINE STYLES FOR ANIMATIONS / REVEAL ---------------- */}
        <style jsx global>{`
          /* base fonts */
          :root {
            --script: "Great Vibes", "Playfair Display", serif;
            --serif: "Playfair Display", serif;
            --sans: "Montserrat", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          }
          h1, h2, h3 { font-family: var(--serif); }
          body, input, button, textarea { font-family: var(--sans); }

          /* subtle reveal animation */
          [data-reveal] {
            opacity: 0;
            transform: translateY(18px) scale(0.997);
            transition: opacity 700ms cubic-bezier(.16,.84,.32,1), transform 700ms cubic-bezier(.16,.84,.32,1);
            will-change: opacity, transform;
          }
          [data-reveal].revealed {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          /* small glow on hover for CTA */
          button, a {
            transition: all 220ms ease;
          }

          /* add subtle floating animation to hero name */
          @keyframes floaty {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0px); }
          }
          .floaty {
            animation: floaty 5s ease-in-out infinite;
          }

          /* responsive tweaks */
          @media (max-width: 768px) {
            header { left: 2%; right: 2%; transform: none; width: auto; }
          }

          /* small accessibility: focus outlines */
          button:focus, a:focus, input:focus, textarea:focus {
            outline: 3px solid rgba(250,204,21,0.16);
            outline-offset: 2px;
          }
        `}</style>
      </div>
    </>
  );
}
