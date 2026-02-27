"use client";

import useCountdown from "@/lib/countdown";
import React, { useEffect, useRef, useState } from "react";

import bgImage from './bg.jpg';
import { CombineDateAndTime, copyToClipboard, delay, ExecuteMinimumDelay, formatDate, getMonthName, toast } from "@/lib/utils";
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from "next/navigation";
import { EventInitProps, GroomBrideProps, InvitationParams } from "@/lib/model-types";
import { useLoading } from "@/components/loading/loading-context";
import { GetSplashScreenEventData } from "@/server/event";
import LoadingUI from "@/components/loading/loading-ui";
import { GenProfileDescWedding } from "../../utils";

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

const WEDDING_DATE = new Date();
WEDDING_DATE.setDate(WEDDING_DATE.getDate() + 12);

function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isLocked])
}

export default function WeddingInvitationPage() {
  const [isLoading, setIsloading] = useState(true);
  const searchParams = useSearchParams();
  const invtParams = Object.fromEntries(searchParams.entries()) as InvitationParams;
  const [eventDatas, setEventDatas] = useState<EventInitProps | null>(null);

  const [groom, setGroom] = useState<GroomBrideProps | null>(null);
  const [bride, setBride] = useState<GroomBrideProps | null>(null);
  const [groomProfile, setGroomProfile] = useState<string>();
  const [brideProfile, setBrideProfile] = useState<string>();
  const [longlatLoc, setLonglatLoc] = useState<string>();

  useEffect(() => {
    const delayMs = 2000;
    const fatchData = async () => {
      if (invtParams.code !== undefined && invtParams.code.trim() !== "") {
        try {
          const findData = await ExecuteMinimumDelay(
            GetSplashScreenEventData(invtParams.code),
            delayMs
          );

          if (findData) {
            setEventDatas(findData);
            const groomData = findData.gb_info.find(x => x.type === "Groom");
            const brideData = findData.gb_info.find(x => x.type === "Bride");
            setGroom(groomData ?? null);
            setBride(brideData ?? null);

            if (groomData) setGroomProfile(GenProfileDescWedding({
              type: groomData.type,
              birth_order: groomData.birth_order,
              father_name: groomData.father_name,
              mother_name: groomData.mother_name,
              place_origin: groomData.place_origin,
              occupation: groomData.occupation,
            }));

            if (brideData) setBrideProfile(GenProfileDescWedding({
              type: brideData.type,
              birth_order: brideData.birth_order,
              father_name: brideData.father_name,
              mother_name: brideData.mother_name,
              place_origin: brideData.place_origin,
              occupation: brideData.occupation,
            }));

            const getfirstSchedule = findData.schedule_info.find(x => x.type === "WED_MB");
            if (getfirstSchedule) setLonglatLoc(`${getfirstSchedule.latitude},${getfirstSchedule.longitude}`);
          }
        } catch (error: any) {
          await delay(delayMs);
          toast({
            type: "warning",
            title: "Unknown Invitation",
            message: error?.message ?? "We are sorry, your invitation was not recognized!"
          });
        }
      } else {
        await delay(delayMs);
      }

      setIsloading(false);
    };

    fatchData();
  }, []);
  //--------------------------------------------------------------------

  const [opened, setOpened] = useState(false);
  useLockBodyScroll(!opened);

  // Carousel (Hero)
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Countdown
  const { days, hours, minutes, seconds, isExpired } = useCountdown(eventDatas?.event_time ?? WEDDING_DATE);

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
  const slideTo = (idx: number) => {
    const length = eventDatas ? eventDatas.event_galleries.length : GALLERY.length;
    return setGIndex(((idx % length) + length) % length)
  };

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

  if (isLoading) return <LoadingUI className="bg-stone-900" activeTitle={false} />

  return (
    <main className="scroll-smooth bg-fixed bg-cover bg-center" style={{ backgroundImage: `url(${bgImage.src})` }}>
      {/* Overlay theme */}
      <div className="min-h-screen bg-stone-900/60 text-stone-100">
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
                <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" />
              </div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative z-10 space-y-5"
              >
                <p className="tracking-widest uppercase text-sm mb-4 text-white">Wedding Invitation</p>
                <h1 className="mt-4 font-serif text-4xl md:text-6xl leading-tight">
                  {groom?.shortname ?? "Aisyah"} & {bride?.shortname ?? "Bagas"}
                </h1>
                <p className="mt-4 text-lg text-amber-300">{formatDate(eventDatas?.event_time ?? WEDDING_DATE, "full")}</p>
                <p className="mt-2 italic text-white">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                <p className="font-semibold text-xl mt-1 text-white">{eventDatas?.event_rsvp.name ?? "Guest"}</p>

                <button
                  onClick={() => setOpened(true)}
                  className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-stone-900 hover:bg-stone-100 transition shadow-lg"
                >
                  Buka Undangan
                  <ArrowDownIcon />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                {groom?.shortname ? groom.shortname.charAt(0).toUpperCase() : "A"} & {bride?.shortname ? bride.shortname.charAt(0).toUpperCase() : "B"}
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
          {/* Content */}
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="uppercase tracking-[0.3em] text-xs md:text-sm text-stone-300">
              Undangan Pernikahan
            </p>
            <h1 className="mt-4 font-serif text-4xl md:text-6xl leading-tight">
              {groom?.shortname ?? "Aisyah"} & {bride?.shortname ?? "Bagas"}
            </h1>
            <p className="mt-3 text-stone-300">
              {formatDate(eventDatas?.event_time ?? WEDDING_DATE, "full", "short")}
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
                  className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4 md:p-6 transition hover:-translate-y-0.5"
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
          subtitle={eventDatas ? (eventDatas.greeting_msg ?? "-") : "Dengan penuh syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada hari bahagia kami."}
          sectionsRef={sectionsRef}
        >
          {
            eventDatas ? <div className="grid md:grid-cols-2 gap-6 md:gap-10">
              {
                eventDatas.gb_info.map((x, i) => {
                  return <div key={i} className="group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition">
                    <div className="relative aspect-4/3">
                      <img
                        src={x.img_path ?? ""}
                        alt={x.shortname}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-2xl">{x.fullname}</h3>
                      <p className="mt-2 text-stone-300">
                        {x.type === "Bride" ? groomProfile : brideProfile}
                      </p>
                      {
                        x.personal_msg && <p className="mt-2 italic text-stone-300">
                          {`“${x.personal_msg}”`}
                        </p>
                      }
                    </div>
                  </div>
                })
              }

            </div> : <div className="grid md:grid-cols-2 gap-6 md:gap-10">
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
                  <div className="relative aspect-4/3">
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
          }
        </Section>

        {/* Acara */}
        <Section
          id="acara"
          title="Acara"
          subtitle="Berikut rangkaian acara pada hari bahagia kami."
          sectionsRef={sectionsRef}
        >
          {
            eventDatas ? <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {
                  eventDatas.schedule_info.map((x, i) => {
                    let title = "";
                    if (x.type === "WED_MB") title = "Akad Nikah";
                    else if (x.type === "WED_TOR") {
                      if (x.ceremony_type === "Reception") title = "Resepsi";
                      else if (x.ceremony_type === "Traditional") title = "Tradisional / Adat";
                    }

                    return <InfoCard
                      key={i}
                      title={title}
                      time={`${formatDate(CombineDateAndTime(x.date, x.start_time), "full", "short")} - ${x.end_time}`}
                      place={`${x.location} · ${x.address}`}
                      extra={x.notes.length > 0 ? x.notes.join(", ") : undefined}
                      lat={x.latitude ?? undefined}
                      long={x.longitude ?? undefined}
                    />
                  })
                }
                {
                  eventDatas.schedule_note !== null && <div className="rounded-3xl border border-white/10 p-6 bg-white/5 backdrop-blur-md">
                    <h4 className="font-serif text-xl">Informasi Tambahan</h4>
                    <p className="mt-3 text-stone-300">
                      {(eventDatas.schedule_note)}
                    </p>
                  </div>
                }
              </div>
              <div className="h-100 md:h-auto rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                <div className="h-full">
                  <iframe
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${longlatLoc}&z=18&output=embed`}
                    allowFullScreen
                  />
                </div>
                <div className="p-4 text-sm text-stone-300">
                  Lokasi: Balai Kartini, Jakarta.
                </div>
              </div>
            </div> : <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <InfoCard
                  title="Akad Nikah"
                  time="Sabtu, 20 Desember 2025 · 10.00 WIB"
                  place="Balai Kartini, Ballroom"
                  extra="Mohon hadir 15 menit lebih awal."
                />
                <InfoCard
                  title="Resepsi"
                  time="Sabtu, 20 Desember 2025 · 12.00 - 15.00 WIB"
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
              <div className="h-100 md:h-auto rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                <div className="h-full">
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
          }
        </Section>

        {/* Galeri */}
        <Section
          id="galeri"
          title="Galeri"
          subtitle="Sejumlah momen yang kami abadikan."
          sectionsRef={sectionsRef}
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5">
            {
              eventDatas ? <div className="relative aspect-video">
                {/* Slides */}
                {eventDatas.event_galleries.map((x, i) => (
                  <img
                    key={i}
                    src={x.img_path ?? ""}
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
                  {eventDatas.event_galleries.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => slideTo(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-2 w-2 rounded-full transition ${i === gIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"
                        }`}
                    />
                  ))}
                </div>
              </div> : <div className="relative aspect-video">
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
            }
          </div>
        </Section>

        {/* Cerita (timeline) */}
        <Section
          id="cerita"
          title="Cerita Kami"
          subtitle="Perjalanan yang membawa kami ke pelaminan."
          sectionsRef={sectionsRef}
        >
          {
            eventDatas ? <ol className="relative border-s border-white/10 ms-3">
              {eventDatas.event_histories.map((ev, i) => (
                <li key={i} className="mb-10 ms-5">
                  <span className="absolute -left-1.75 mt-1 h-3 w-3 rounded-full bg-white/80 border border-white/30"></span>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition backdrop-blur-md">
                    <div className="flex items-baseline justify-between">
                      <h4 className="font-serif text-xl">{ev.name}</h4>
                      <span className="text-xs uppercase tracking-widest text-stone-300">
                        {getMonthName(ev.month)} - {ev.year}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-12 gap-6 items-start">
                      <div className={`col-span-12 ${ev.gallery?.img_path ? "md:col-span-6" : "md:col-span-12"}`}>
                        <p className="text-stone-300">
                          {ev.desc}
                        </p>
                      </div>

                      {ev.gallery?.img_path && (
                        <div className="col-span-12 md:col-span-6">
                          <div className="overflow-hidden rounded-xl border border-white/10">
                            <div className="aspect-4/3 w-full md:aspect-3/2">
                              <img
                                src={ev.gallery.img_path}
                                alt={ev.name}
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol> : <ol className="relative border-s border-white/10 ms-3">
              {[
                {
                  m: "05",
                  t: "2018",
                  title: "Pertemuan Pertama",
                  body: "Kami berkenalan saat kegiatan kampus. Dari sapaan singkat, tumbuh rasa yang hangat.",
                },
                {
                  m: "08",
                  t: "2019",
                  title: "Mulai Serius",
                  body: "Berjalan bersama melewati suka duka, saling menguatkan mimpi satu sama lain.",
                },
                {
                  m: "03",
                  t: "2023",
                  title: "Lamaran",
                  body: "Keluarga bertemu, doa dipanjatkan, niat kami dimantapkan.",
                },
                {
                  m: "06",
                  t: "2025",
                  title: "Menuju Pelaminan",
                  body: "Dengan restu orang tua dan sahabat, kami melangkah ke babak baru.",
                },
              ].map((ev, i) => (
                <li key={i} className="mb-10 ms-5">
                  <span className="absolute -left-1.75 mt-1 h-3 w-3 rounded-full bg-white/80 border border-white/30"></span>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition backdrop-blur-md">
                    <div className="flex items-baseline justify-between">
                      <h4 className="font-serif text-xl">{ev.title}</h4>
                      <span className="text-xs uppercase tracking-widest text-stone-300">
                        {getMonthName(ev.m)} - {ev.t}
                      </span>
                    </div>
                    <p className="mt-2 text-stone-300">{ev.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          }
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
          <div className="space-y-8">
            {/* ========================================= */}
            {/* TRANSFER REKENING                         */}
            {/* ========================================= */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h4 className="font-serif text-xl text-white">
                Transfer Rekening
              </h4>

              <p className="mt-2 text-sm text-stone-300 leading-relaxed">
                Kehadiran Anda sudah lebih dari cukup. Namun bila berkenan
                mengirimkan tanda kasih, berikut informasi rekening kami.
              </p>

              <div className="mt-5 grid md:grid-cols-3 gap-5">
                {/* Rekening Item */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-sm text-stone-200">
                    Bank BCA · A/N Aisyah Putri
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <code className="rounded bg-black/40 px-3 py-1 text-sm text-stone-100">
                      1234567890
                    </code>
                    <button
                      onClick={() => {
                        copyToClipboard("1234567890");
                        toast({
                          type: "success",
                          title: "Copy to Clipboard",
                          message: "Well done, Text copied to clipboard.",
                        });
                      }}
                      className="text-xs text-stone-300 underline underline-offset-4 hover:no-underline"
                    >
                      Salin
                    </button>
                  </div>
                </div>

                {/* Rekening Item */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-sm text-stone-200">
                    Bank Mandiri · A/N Rizky Pratama
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <code className="rounded bg-black/40 px-3 py-1 text-sm text-stone-100">
                      9876543210
                    </code>
                    <button
                      onClick={() => {
                        copyToClipboard("1234567890");
                        toast({
                          type: "success",
                          title: "Copy to Clipboard",
                          message: "Well done, Text copied to clipboard.",
                        });
                      }}
                      className="text-xs text-stone-300 underline underline-offset-4 hover:no-underline"
                    >
                      Salin
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================= */}
            {/* WISHLIST + ALAMAT                         */}
            {/* ========================================= */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h4 className="font-serif text-xl text-white">
                Wishlist
              </h4>

              {/* Alamat Pengiriman */}
              <div className="my-3 rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-wider text-stone-400">
                  Alamat Pengiriman
                </p>
                <p className="my-3 text-sm text-stone-200 leading-relaxed">
                  Aisyah & Rizky Jl. Mawar Indah No. 12 Jakarta Selatan, 12345 Indonesia
                </p>
                <button
                  onClick={() => {
                    copyToClipboard("Aisyah & Rizky Jl. Mawar Indah No. 12 Jakarta Selatan, 12345 Indonesia");
                    toast({
                      type: "success",
                      title: "Copy to Clipboard",
                      message: "Well done, Text copied to clipboard.",
                    });
                  }} className="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-xs text-stone-200 transition hover:bg-white/10">
                  Salin
                </button>
              </div>

              <p className="my-2 text-sm text-stone-300 leading-relaxed">
                Berikut beberapa referensi hadiah yang mungkin bermanfaat bagi
                kami. Tidak ada kewajiban — kehadiran dan doa Anda tetap yang utama.
              </p>

              {/* Wishlist Cards */}
              <div className="mt-5 grid md:grid-cols-3 gap-5">
                {[
                  {
                    name: 'Set Peralatan Makan Keramik',
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
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-white/20"
                  >
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-stone-100">
                        {item.name}
                      </p>
                      <div className="text-xs text-stone-300 space-y-0.5">
                        <p>Harga: {item.price}</p>
                        <p>Jumlah: {item.qty} unit</p>
                      </div>

                      <a
                        href={item.url}
                        target="_blank"
                        className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-xs text-stone-200 transition hover:bg-white/10"
                      >
                        Lihat Referensi
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination UI */}
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex gap-2">
                  <button className="h-8 w-8 rounded-full bg-white text-xs font-semibold text-black">
                    1
                  </button>
                  <button className="h-8 w-8 rounded-full border border-white/20 text-xs text-stone-300">
                    2
                  </button>
                  <button className="h-8 w-8 rounded-full border border-white/20 text-xs text-stone-300">
                    3
                  </button>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 rounded-xl border border-white/20 px-3 py-2 text-xs text-stone-300">
                    Prev
                  </button>
                  <button className="flex-1 rounded-xl border border-white/20 px-3 py-2 text-xs text-stone-300">
                    Next
                  </button>
                </div>
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
            items={eventDatas ? eventDatas.event_faq.map(x => ({ q: x.question, a: x.answer })) : [
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
          <p className="mt-2 text-xs">© {eventDatas ? (eventDatas.event_time?.getFullYear() ?? new Date().getFullYear()) : new Date().getFullYear()} Aisyah & Bagas</p>
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
  long,
  lat
}: {
  title: string;
  time: string;
  place: string;
  extra?: string;
  long?: string;
  lat?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 backdrop-blur-md transition">
      <h4 className="font-serif text-xl">{title}</h4>
      <div className="mt-2 space-y-1 text-stone-300">
        <p className="flex items-start gap-2">
          <ClockIcon /> {time}
        </p>
        <p className="flex items-start gap-2">
          <MapPinIcon />
          <div>
            {place}. {
              long !== undefined && lat !== undefined && long.trim() !== "" && lat.trim() !== "" && <a
                href={`https://www.google.com/maps?q=${lat},${long}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Lihat Lokasi
              </a>
            }
          </div>
        </p>
        {extra && <p>{extra}</p>}
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
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
      <path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1Zm1 12h-5V7h2v4h3Z" />
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
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
