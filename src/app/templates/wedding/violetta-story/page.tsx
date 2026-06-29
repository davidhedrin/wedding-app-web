"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import useCountdown from "@/lib/countdown";
import { AnimatePresence, motion } from 'framer-motion';
import bgImage from './bg.jpg';

import { CombineDateAndTime, copyToClipboard, delay, ExecuteMinimumDelay, ExtractYtID, formatDate, getMonthName, playMusic, rsvpLabels, toast } from "@/lib/utils";
import Configs, { MusicThemeKeys, PaymentMethodKeys } from "@/lib/config";
import { useSearchParams } from "next/navigation";
import { EventInitProps, GroomBrideProps, InvitationParams } from "@/lib/model-types";
import { EventGifts, EventRsvp, RsvpStatusEnum } from "@/generated/prisma";
import { GetDataEventGifts, GetDataEventRsvp } from "@/server/event-detail";
import { GetSplashScreenEventData, UpadateRsvp } from "@/server/event";
import { GenProfileDescWedding } from "../../utils";
import LoadingUI from '@/components/loading/loading-ui';
import FloatingActionButton from '../../floating-action';
import { ModalWishlist } from '../../modal-wishlist';

/**
 * Invitation Type: Wedding
 * Theme Name: "Violetta Story"
 * Create At: 09-09-2025
 * Create By: David
*/

// === FONTS (Elegan & Modern) ===
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// === KONFIGURASI DASAR UNDANGAN ===
const WEDDING_DATE = new Date();
WEDDING_DATE.setDate(WEDDING_DATE.getDate() + 12);

const THEME = {
  primary: "from-purple-900 via-fuchsia-900 to-purple-800",
  primarySoft: "bg-purple-900/60",
  accent: "text-amber-300",
  btn:
    "bg-fuchsia-600 hover:bg-fuchsia-500 focus-visible:outline-fuchsia-300 text-white",
  chip: "bg-white/10 border-white/20",
  glass: "bg-white/10 backdrop-blur-md",
};

const IMAGES = Array.from({ length: 8 }).map(
  () => `${Configs.base_url}/assets/img/2149043983.jpg`
);

// === KOMPONEN KECIL ===
const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <div className="text-center mb-10">
    <h2
      className={`text-3xl md:text-4xl tracking-wide ${playfair.className} text-white`}
    >
      {title}
    </h2>
    {subtitle && (
      <p className={`mt-2 text-white/70 ${inter.className}`}>{subtitle}</p>
    )}
    <div className="mt-6 flex justify-center">
      <span className="h-0.5 w-24 bg-linear-to-r from-white/0 via-white/60 to-white/0" />
    </div>
  </div>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-wider text-white/90 ${THEME.chip}`}
  >
    {children}
  </span>
);

function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isLocked])
};

// === HALAMAN ===
function Inner() {
  const musicThemeWedding = MusicThemeKeys.find(x => x.key === "wed");
  const allPaymentMethod = PaymentMethodKeys.filter(x => x.status === true);

  const [isLoading, setIsloading] = useState(true);
  const searchParams = useSearchParams();
  const invtParams = Object.fromEntries(searchParams.entries()) as InvitationParams;
  const [eventDatas, setEventDatas] = useState<EventInitProps | null>(null);

  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [groom, setGroom] = useState<GroomBrideProps | null>(null);
  const [bride, setBride] = useState<GroomBrideProps | null>(null);
  const [groomProfile, setGroomProfile] = useState<string>();
  const [brideProfile, setBrideProfile] = useState<string>();
  const [longlatLoc, setLonglatLoc] = useState<string>();

  const [rsvpName, setRsvpName] = useState<string>("");
  const [rsvpHp, setRsvpHp] = useState<string>("");
  const [rsvpAtt, setRsvpAtt] = useState<RsvpStatusEnum | string>("");
  const [rsvpAttNumber, setRsvpAttNumber] = useState<number>(1);
  const [rsvpDesc, setRsvpDesc] = useState<string>("");

  const [timeWedMb, setTimeWedMb] = useState<{ title: string, time: string, loc: string | null } | null>(null);
  const [timeWedTor, setTimeWedTor] = useState<{ title: string, time: string, loc: string | null } | null>(null);

  const [pageTableWs, setPageTableWs] = useState(1);
  const [perPageWs, setPerPageWs] = useState(6);
  const [totalPageWs, setTotalPageWs] = useState(0);
  const [datasWs, setDatasWs] = useState<EventGifts[] | null>(null);
  const fatchWishlist = async (event_id: number, page: number = pageTableWs, countPage: number = perPageWs) => {
    const result = await GetDataEventGifts(event_id, {
      curPage: page,
      perPage: countPage,
      where: {
        type: "Wishlist"
      },
      select: {
        id: true,
        name: true,
        product_price: true,
        qty: true,
        product_url: true,
        reserve_qty: true,
      },
      orderBy: {
        id: "asc"
      }
    });

    setTotalPageWs(result.meta.totalPages);
    setPageTableWs(result.meta.page);
    setDatasWs(result.data);
  };
  const changePaginateWs = async (page: number) => {
    if (eventDatas) {
      setPageTableWs(page);
      await fatchWishlist(eventDatas.event_rsvp.event_id, page);
    }
  };

  const [pageTableRsvp, setPageTableRsvp] = useState(1);
  const [perPageRsvp, setPerPageRsvp] = useState(6);
  const [totalPageRsvp, setTotalPageRsvp] = useState(0);
  const [datasRsvp, setDatasRsvp] = useState<EventRsvp[] | null>(null);
  const fatchRsvpMsg = async (event_id: number, page: number = pageTableRsvp, countPage: number = perPageRsvp) => {
    const result = await GetDataEventRsvp(event_id, {
      curPage: page,
      perPage: countPage,
      where: {
        show_desc: true,
        att_status: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        desc: true,
        show_desc: true,
        att_status: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    setTotalPageRsvp(result.meta.totalPages);
    setPageTableRsvp(result.meta.page);
    setDatasRsvp(result.data);
  };
  const changePaginateRsvp = async (page: number) => {
    if (eventDatas) {
      setPageTableRsvp(page);
      await fatchRsvpMsg(eventDatas.event_rsvp.event_id, page);
    }
  };

  const [isMusic, setIsMusic] = useState(false);
  const [openedModalWs, setOpenedModalWs] = useState(false);
  const [wishlistActiveId, setWishlistActiveId] = useState<number>(0);
  const openModalWislist = (wislist_id: number) => {
    setWishlistActiveId(wislist_id);
    setOpenedModalWs(true);
  }

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
            setRsvpName(findData.event_rsvp.name);
            setRsvpHp(findData.event_rsvp.phone ?? "");
            setRsvpAtt(findData.event_rsvp.att_status ?? "");
            setRsvpAttNumber(findData.event_rsvp.att_number ?? 1);
            setRsvpDesc(findData.event_rsvp.desc ?? "");
            setMusicUrl(findData.music_url === Configs.keyCustomMusic ? findData.custom_music_url : findData.music_url);

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

            findData.schedule_info.map((x, i) => {
              const time = `${formatDate(CombineDateAndTime(x.date, x.start_time), "full", "short")} - ${x.end_time}`
              if (x.type === "WED_MB") {
                setTimeWedMb({ title: "Akad", time, loc: x.location });
                setLonglatLoc(`${x.latitude},${x.longitude}`);
              } else if (x.type === "WED_TOR") {
                let title = "";
                if (x.ceremony_type === "Reception") title = "Resepsi";
                else if (x.ceremony_type === "Traditional") title = "Tradisional";

                setTimeWedTor({ title: title, time, loc: x.location });
              }
            });

            fatchWishlist(findData.event_rsvp.event_id);
            fatchRsvpMsg(findData.event_rsvp.event_id);
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

  const [opened, setOpened] = useState(false)
  useLockBodyScroll(!opened)

  // Smooth fade-in saat scroll
  const revealRef = useRef<Record<string, Element | null>>({});
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
          }
        }),
      { threshold: 0.15 }
    );
    Object.values(revealRef.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Countdown
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(eventDatas?.event_time ?? WEDDING_DATE);

  const goToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Galeri slider
  const [galIdx, setGalIdx] = useState(0);
  const galNext = () => setGalIdx((i) => (i + 1) % IMAGES.length);
  const galPrev = () => setGalIdx((i) => (i - 1 + IMAGES.length) % IMAGES.length);

  // RSVP
  const [sending, setSending] = useState(false);
  const submitRSVP = async (e: React.FormEvent<HTMLFormElement>) => {
    if (invtParams.code !== undefined && eventDatas !== null) {
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const payload = Object.fromEntries(form.entries());
      setSending(true);

      await ExecuteMinimumDelay(
        UpadateRsvp(invtParams.code, {
          rsvp_hp: rsvpHp.trim() !== "" ? rsvpHp : null,
          rsvp_att: rsvpAtt !== "" ? rsvpAtt as RsvpStatusEnum : null,
          rsvp_att_number: rsvpAtt as RsvpStatusEnum === "PRESENCE" ? rsvpAttNumber : null,
          rsvp_desc: rsvpDesc.trim() !== "" ? rsvpDesc : null,
        }),
        2000
      );

      setSending(false);
      (e.target as HTMLFormElement).reset();
    }

    toast({
      type: "success",
      title: "Submit successfully",
      message: "Your submission has been successfully completed"
    });
  };

  // FAQ
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  // Nav shrink saat scroll
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Daftar nav
  const nav = [
    { id: "mempelai", label: "Mempelai" },
    { id: "acara", label: "Acara" },
    { id: "galeri", label: "Galeri" },
    { id: "cerita", label: "Cerita" },
    { id: "rsvp", label: "RSVP" },
    { id: "hadiah", label: "Hadiah" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <main
      className={`min-h-screen text-white relative ${playfair.variable} ${cormorant.variable} ${inter.variable}`}
    >
      {/* BACKGROUND GRADIENT */}
      <div
        aria-hidden
        className={`fixed inset-0 -z-30 bg-linear-to-b ${THEME.primary}`}
      />

      {/* BACKGROUND HERO CAROUSEL (blur + parallax-ish) */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <img
          src={bgImage.src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover opacity-45`}
          style={{ transform: "scale(1.05)" }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* GLOBAL smooth scroll fallback */}
      <style jsx global>{`
        html,
        body {
          scroll-behavior: smooth;
          background: transparent;
        }
        .reveal {
          opacity: 0;
          transform: translateY(24px) scale(0.98);
          transition: all 600ms ease;
        }
        .reveal.in-view {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .card {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
        }
        .btn {
          border-radius: 9999px;
          padding: 0.75rem 1.25rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: transform 200ms ease, filter 200ms ease;
        }
        .btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }
        .btn:active {
          transform: translateY(0);
        }
        .nav-blur {
          backdrop-filter: blur(10px);
          background: rgba(20, 0, 30, 0.45);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .chip {
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
        }
      `}</style>

      <AnimatePresence mode="wait">
        {
          isLoading ? <div className="fixed inset-0 z-98">
            <div className="absolute inset-0">
              <img
                src={bgImage.src}
                alt="cover"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-b from-purple-900/30 via-fuchsia-900/50 to-purple-800/80 backdrop-blur-sm" />
            </div>

            <LoadingUI activeTitle={false} />
          </div> : !opened && (
            <motion.div
              key="intro"
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
                <div className="absolute inset-0 bg-linear-to-b from-purple-900/30 via-fuchsia-900/50 to-purple-800/80 backdrop-blur-sm" />
              </div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative z-10 space-y-4"
              >
                <p className="tracking-widest uppercase text-sm mb-4 text-white">Wedding Invitation</p>
                <h1
                  className={`mt-4 text-4xl sm:text-5xl lg:text-6xl leading-tight ${playfair.className}`}
                >
                  <span className={THEME.accent}>{groom?.shortname ?? "Aisyah"}</span> &{" "}
                  <span className={THEME.accent}>{bride?.shortname ?? "Zidan"}</span>
                </h1>
                <p className="mt-4 text-lg"><strong className={THEME.accent}>Tanggal:</strong> {formatDate(eventDatas?.event_time ?? WEDDING_DATE, "long")}</p>
                <p className="mt-2 italic text-white">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                <p className="font-semibold text-xl mt-1 text-white">{eventDatas?.event_rsvp.name ?? "Nama Tamu"}</p>

                <button
                  onClick={() => {
                    if (musicUrl) playMusic(musicUrl);
                    else playMusic(musicThemeWedding?.items[0].url ?? "");
                    setIsMusic(prev => !prev);
                    setOpened(prev => !prev);
                  }}
                  className={`btn ${THEME.btn}`}
                >
                  Buka Undangan
                  <span className="inline-block translate-x-0 group-hover:translate-x-0.5 transition">↗</span>
                </button>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* NAVIGATION */}
      <header
        className={`sticky top-0 z-40 transition-all ${scrolled ? "nav-blur" : "bg-transparent"
          }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <button
              className={`text-lg md:text-xl ${playfair.className} font-semibold tracking-wide`}
              onClick={() => goToSection("hero")}
              aria-label="Kembali ke atas"
            >
              <span className={`${THEME.accent}`}>{groom?.shortname ? groom.shortname.charAt(0).toUpperCase() : "A"} & {bride?.shortname ? bride.shortname.charAt(0).toUpperCase() : "Z"}</span> Wedding
            </button>

            <nav className="hidden md:flex items-center gap-1">
              {nav.map((n) => (
                <button
                  key={n.id}
                  onClick={() => goToSection(n.id)}
                  className={`px-3 py-2 rounded-full text-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/40 transition`}
                >
                  {n.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToSection("rsvp")}
                className={`btn ${THEME.btn} hidden md:inline-flex`}
              >
                Konfirmasi Hadir
              </button>
              <button
                className="md:hidden rounded-full p-2 hover:bg-white/10"
                aria-label="Menu"
                onClick={() => {
                  const m = document.getElementById("mobile-menu");
                  m?.classList.toggle("hidden");
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="#fff" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div id="mobile-menu" className="md:hidden hidden pt-3">
            <div className="flex flex-col gap-2">
              {nav.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    goToSection(n.id);
                    document.getElementById("mobile-menu")?.classList.add("hidden");
                  }}
                  className="text-left px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="relative">
        <div className="mx-auto max-w-7xl px-4 py-16 md:pb-28 md:pt-16">
          <div className="grid md:grid-cols-2 items-center gap-10">
            <div className="reveal" ref={(el) => {
              if (el) (revealRef.current["hero1"] = el)
            }}>
              <Pill>Undangan Pernikahan</Pill>
              <h1
                className={`mt-4 text-4xl sm:text-5xl lg:text-6xl leading-tight ${playfair.className}`}
              >
                <span className={THEME.accent}>{groom?.shortname ?? "Aisyah"}</span> &{" "}
                <span className={THEME.accent}>{bride?.shortname ?? "Zidan"}</span>
              </h1>
              <p className={`mt-4 text-white/80 ${cormorant.className} text-lg`}>
                Dengan memohon rahmat Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami. Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.
              </p>

              {/* COUNTDOWN */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className={`chip px-3 py-2 rounded-full ${THEME.chip}`}>
                  {formatDate(eventDatas?.event_time ?? WEDDING_DATE, "full")} pukul {formatDate(eventDatas?.event_time ?? WEDDING_DATE, undefined, "short")}
                </span>
              </div>

              <div className="mt-6 card rounded-2xl p-5">
                {/* Kondisi Countdown */}
                {isExpired ? (
                  <div className="text-center">
                    <p className="text-sm uppercase tracking-widest text-white/70">
                      Terima kasih atas doa & kehadirannya
                    </p>
                    <h3 className={`mt-2 text-2xl ${playfair.className}`}>
                      Acara telah terlaksana
                    </h3>
                    <p className="text-white/80 mt-1">
                      Berlalu {days} hari yang lalu
                    </p>
                  </div>
                ) : isToday ? (
                  <div className="text-center">
                    <p className="text-sm uppercase tracking-widest text-amber-300">
                      Hari H!
                    </p>
                    <h3 className={`mt-2 text-2xl ${playfair.className}`}>
                      Acara sedang berlangsung hari ini
                    </h3>
                    <p className="text-white/80 mt-1">
                      Sisa waktu hari ini: {String(hours).padStart(2, "0")}
                      j:{String(minutes).padStart(2, "0")}
                      m:{String(seconds).padStart(2, "0")}d
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm uppercase tracking-widest text-white/70">
                      Menuju Hari Bahagia
                    </p>
                    <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
                      {[
                        ["Hari", days],
                        ["Jam", hours],
                        ["Menit", minutes],
                        ["Detik", seconds],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-xl bg-black/30 border border-white/10 py-3 sm:py-4 text-center"
                        >
                          <div className="text-2xl sm:text-3xl font-bold">
                            {String(value).padStart(2, "0")}
                          </div>
                          <div className="text-[11px] uppercase tracking-wider text-white/70">
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => goToSection("mempelai")}
                  className={`btn ${THEME.btn}`}
                >
                  Lihat Undangan
                </button>
                <button
                  onClick={() => goToSection("acara")}
                  className="btn bg-white/10 hover:bg-white/20 focus-visible:outline focus-visible:outline-white/40"
                >
                  Lihat Detail Acara
                </button>
              </div>
            </div>

            {/* Kartu foto */}
            <div
              className="reveal relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              ref={(el) => {
                if (el) revealRef.current["hero2"] = el
              }}
            >
              <img
                src={eventDatas ? (eventDatas.couple_img_path ?? "") : IMAGES[0]}
                alt="Foto prewedding"
                className="h-80 sm:h-96 w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${THEME.accent}`}>#{groom?.shortname ?? "Aisyah"}{bride?.shortname ?? "Zidan"}</span>
                  <span className="text-white/60 text-sm">•</span>
                  <span className="text-white/80 text-sm">{formatDate(eventDatas?.event_time ?? WEDDING_DATE, "long")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEMPELAI */}
      <section id="mempelai" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-18 md:py-20">
          <SectionTitle
            title="Mempelai"
            subtitle="Bersama dalam cinta dan harapan"
          />
          <div className="grid md:grid-cols-2 gap-6">
            {
              eventDatas ? eventDatas.gb_info.map((x, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl overflow-hidden card"
                  ref={(el) => {
                    if (el) revealRef.current[`m-${idx}`] = el
                  }}
                >
                  <div className="relative">
                    <img
                      src={x.img_path ?? ""}
                      alt={x.shortname}
                      className="h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className={`text-2xl ${playfair.className}`}>{x.fullname}</h3>
                    <p className={`text-white/80 mt-1 ${inter.className}`}>
                      {x.type === "Groom" ? groomProfile : brideProfile}
                    </p>
                    <p className={`mt-4 text-white/80 ${cormorant.className}`}>
                      “{x.personal_msg}”
                    </p>
                  </div>
                </div>
              )) : [
                { name: "Aisyah Rahma", desc: "Putri dari Bapak X & Ibu Y" },
                { name: "Zidan Arya", desc: "Putra dari Bapak A & Ibu B" },
              ].map((p, idx) => (
                <div
                  key={p.name}
                  className="rounded-3xl overflow-hidden card"
                  ref={(el) => {
                    if (el) revealRef.current[`m-${idx}`] = el
                  }}
                >
                  <div className="relative">
                    <img
                      src={IMAGES[idx]}
                      alt={p.name}
                      className="h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className={`text-2xl ${playfair.className}`}>{p.name}</h3>
                    <p className={`text-white/80 mt-1 ${inter.className}`}>{p.desc}</p>
                    <p className={`mt-4 text-white/80 ${cormorant.className}`}>
                      “Semoga Allah menghimpun yang terserak dari keduanya,
                      memberkahi keduanya, dan menuntun keduanya pada kebaikan.”
                    </p>
                  </div>
                </div>
              ))
            }
          </div>

          <div className="reveal mt-8 text-center" ref={(el) => {
            if (el) revealRef.current["m-sapaan"] = el
          }}>
            <p className={`${cormorant.className} text-white/85 text-lg`}>
              {eventDatas ? (eventDatas.greeting_msg ?? "-") : "Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari bahagia kami. Doa restu Anda adalah hadiah terindah bagi kami."}
            </p>
          </div>
        </div>
      </section>

      {/* ACARA */}
      <section id="acara" className="relative">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-18 md:py-20">
          <SectionTitle
            title="Acara"
            subtitle="Waktu & Tempat Penyelenggaraan"
          />

          <div className="grid lg:grid-cols-2 gap-6">
            {/* LEFT */}
            <div className="space-y-6">

              {
                eventDatas ? eventDatas.schedule_info.map((x, i) => {
                  let title = "";
                  if (x.type === "WED_MB") title = "Akad Nikah";
                  else if (x.type === "WED_TOR") {
                    if (x.ceremony_type === "Reception") title = "Resepsi";
                    else if (x.ceremony_type === "Traditional") title = "Tradisional / Adat";
                  }

                  return <div
                    key={i}
                    className="reveal card rounded-2xl p-6"
                    ref={(el) => {
                      if (el) revealRef.current[`ac-${i}`] = el;
                    }}
                  >
                    <h4 className={`text-xl ${playfair.className}`}>
                      {title}
                    </h4>

                    <ul className="mt-3 space-y-2 text-white/85">
                      <li>{`${formatDate(CombineDateAndTime(x.date, x.start_time), "full", "short")} - ${x.end_time}`}</li>
                      <li>
                        {`${x.location} · ${x.address}`}. <a
                          href={`https://www.google.com/maps?q=${x.latitude},${x.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-500 underline"
                        >
                          Lihat Lokasi
                        </a>
                      </li>
                    </ul>

                    {x.notes.length > 0 && <div className="mt-4 flex flex-wrap gap-2">
                      {x.notes.map((tag, tagIndex) => (
                        <Pill key={tagIndex}>{tag}</Pill>
                      ))}
                    </div>
                    }

                    {
                      x.youtube_url && <a
                        href={x.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex mt-4 btn ${THEME.btn}`}
                      >
                        <div className="flex items-center">
                          <span className="me-1">
                            Live Youtube
                          </span>
                          <i className="bx bxl-youtube text-2xl"></i>
                        </div>
                      </a>
                    }
                  </div>
                }) : [
                  {
                    title: "Akad Nikah",
                    date: "Sabtu, 20 Desember 2025 | 10:00 WIB",
                    location: "Masjid Agung Contoh",
                    tags: ["Formal", "Masker Opsional"],
                    livestream: "https://youtu.be/17aqk4WUhIA?si=KDgGKd2wTs1FpVTo",
                  },
                  {
                    title: "Resepsi",
                    date: "Sabtu, 20 Desember 2025 | 19:00 — 21:00 WIB",
                    location: "Gedung Serbaguna Contoh",
                    tags: ["Dress Code: Ungu / Netral", "Parkir Luas"],
                    livestream: "https://youtu.be/17aqk4WUhIA?si=KDgGKd2wTs1FpVTo",
                  },
                ].map((event, index) => (
                  <div
                    key={index}
                    className="reveal card rounded-2xl p-6"
                    ref={(el) => {
                      if (el) revealRef.current[`ac-${index}`] = el;
                    }}
                  >
                    <h4 className={`text-xl ${playfair.className}`}>
                      {event.title}
                    </h4>

                    <ul className="mt-3 space-y-2 text-white/85">
                      <li>{event.date}</li>
                      <li>{event.location}</li>
                    </ul>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.tags.map((tag, tagIndex) => (
                        <Pill key={tagIndex}>{tag}</Pill>
                      ))}
                    </div>

                    {event.livestream && (
                      <a
                        href={event.livestream}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex mt-4 btn ${THEME.btn}`}
                      >
                        <div className="flex items-center">
                          <span className="me-1">
                            Live Youtube
                          </span>
                          <i className="bx bxl-youtube text-2xl"></i>
                        </div>
                      </a>
                    )}
                  </div>
                ))}

              {/* CATATAN */}
              {
                eventDatas ? eventDatas.schedule_note !== null && <div
                  className="reveal card rounded-2xl p-6"
                  ref={(el) => {
                    if (el) revealRef.current["ac-note"] = el;
                  }}
                >
                  <h4 className={`text-xl ${playfair.className}`}>
                    Catatan
                  </h4>

                  <p className="mt-3 text-white/85">
                    {eventDatas.schedule_note}
                  </p>

                  <button
                    onClick={() => goToSection("rsvp")}
                    className={`mt-4 btn ${THEME.btn}`}
                  >
                    Isi RSVP
                  </button>
                </div> : <div
                  className="reveal card rounded-2xl p-6"
                  ref={(el) => {
                    if (el) revealRef.current["ac-note"] = el;
                  }}
                >
                  <h4 className={`text-xl ${playfair.className}`}>
                    Catatan
                  </h4>

                  <p className="mt-3 text-white/85">
                    Mohon konfirmasi kehadiran melalui form RSVP.
                    Datang tepat waktu ya! Tersedia photobooth
                    dan live music.
                  </p>

                  <button
                    onClick={() => goToSection("rsvp")}
                    className={`mt-4 btn ${THEME.btn}`}
                  >
                    Isi RSVP
                  </button>
                </div>
              }
            </div>

            {/* RIGHT */}
            {
              eventDatas ? <div
                className="reveal card rounded-2xl overflow-hidden border border-white/10 min-h-150"
                ref={(el) => {
                  if (el) revealRef.current["ac-map"] = el;
                }}
              >
                <iframe
                  title="Lokasi Acara"
                  src={`https://www.google.com/maps?q=${longlatLoc}&z=14&output=embed`}
                  className="w-full h-full min-h-150"
                  loading="lazy"
                />
              </div> : <div
                className="reveal card rounded-2xl overflow-hidden border border-white/10 min-h-150"
                ref={(el) => {
                  if (el) revealRef.current["ac-map"] = el;
                }}
              >
                <iframe
                  title="Lokasi Acara"
                  src="https://www.google.com/maps?q=Monas%20Jakarta&output=embed"
                  className="w-full h-full min-h-150"
                  loading="lazy"
                />
              </div>
            }
          </div>
        </div>
      </section>

      {/* GALERI */}
      <section id="galeri" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-18 md:py-20">
          <SectionTitle
            title="Galeri"
            subtitle="Potret kisah kami"
          />

          <div className="reveal relative rounded-3xl overflow-hidden border border-white/10" ref={(el) => {
            if (el) revealRef.current["gal"] = el
          }}>
            {
              eventDatas ? <div className="relative h-72 sm:h-96">
                {eventDatas.event_galleries.map((src, i) => (
                  <img
                    key={i}
                    src={src.img_path ?? ""}
                    alt={`Galeri ${i + 1}`}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === galIdx ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

                {/* Controls */}
                <button
                  aria-label="Sebelumnya"
                  onClick={galPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/40 hover:bg-black/60"
                >
                  ‹
                </button>
                <button
                  aria-label="Berikutnya"
                  onClick={galNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/40 hover:bg-black/60"
                >
                  ›
                </button>

                {/* Dots */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                  {eventDatas.event_galleries.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-2 w-2 rounded-full transition ${i === galIdx ? "bg-white" : "bg-white/50 hover:bg-white/70"}`}
                      onClick={() => setGalIdx(i)}
                    />
                  ))}
                </div>
              </div> : <div className="relative h-72 sm:h-96">
                {IMAGES.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Galeri ${i + 1}`}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === galIdx ? "opacity-100" : "opacity-0"
                      }`}
                  />
                ))}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

                {/* Controls */}
                <button
                  aria-label="Sebelumnya"
                  onClick={galPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/40 hover:bg-black/60"
                >
                  ‹
                </button>
                <button
                  aria-label="Berikutnya"
                  onClick={galNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/40 hover:bg-black/60"
                >
                  ›
                </button>

                {/* Dots */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                  {IMAGES.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-2 w-2 rounded-full transition ${i === galIdx ? "bg-white" : "bg-white/50 hover:bg-white/70"
                        }`}
                      onClick={() => setGalIdx(i)}
                    />
                  ))}
                </div>
              </div>
            }
          </div>

          {
            eventDatas ? eventDatas.youtube_url !== null && <div className="snap-center shrink-0 mt-16">
              <div
                className="bg-black/40 backdrop-blur-md group relative aspect-video w-full overflow-hidden rounded-2xl border shadow-lg"
              >
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${ExtractYtID(eventDatas.youtube_url)}`}
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                {/* Overlay play */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                  <svg
                    className="h-12 w-12 text-white drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div> : <div className="snap-center shrink-0 mt-16">
              <div
                className="bg-black/40 backdrop-blur-md group relative aspect-video w-full overflow-hidden rounded-2xl border shadow-lg"
              >
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/vtIGvGigw4g"
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                {/* Overlay play */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                  <svg
                    className="h-12 w-12 text-white drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          }
        </div>
      </section>

      {/* CERITA (Timeline) */}
      <section id="cerita" className="relative">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-18 md:py-20">
          <SectionTitle title="Cerita Kami" subtitle="Jejak perjalanan cinta" />
          <ol className="relative border-l border-white/20 ml-2">
            {
              eventDatas ? eventDatas.event_histories.map((ev, i) => {
                return <li
                  key={i}
                  className="mb-10 ml-4 reveal"
                  ref={(el) => {
                    if (el) revealRef.current[`story-${i}`] = el
                  }}
                >
                  <div className="flex flex-col md:flex-row items-start">
                    {/* Teks bagian kiri */}
                    <div className="md:w-2/3 md:pr-4">
                      <div className="absolute w-3 h-3 bg-amber-300 rounded-full -left-1.5 top-1.5 border border-white/30" />
                      <time className="text-sm text-white/70 ps-2.5">{getMonthName(ev.month)} - {ev.year}</time>
                      <h3 className={`text-xl mt-1 ${playfair.className}`}>
                        {ev.name}
                      </h3>
                      <p className="text-white/85 mt-1">{ev.desc}</p>
                    </div>

                    {/* Gambar bagian kanan */}
                    {ev.gallery?.img_path && (
                      <div className="md:w-1/3 mt-3 md:mt-0">
                        <img
                          src={ev.gallery.img_path}
                          alt={ev.name}
                          className="h-44 w-full object-cover rounded-xl border border-white/10"
                        />
                      </div>
                    )}
                  </div>
                </li>
              }) : [
                {
                  t: "Jan - 2018",
                  title: "Pertemuan Pertama",
                  body: "Kami bertemu di kampus, sebuah awal sederhana yang bermakna.",
                },
                {
                  t: "Feb - 2020",
                  title: "Komitmen",
                  body: "Di tengah banyak hal, kami semakin yakin melangkah bersama.",
                },
                {
                  t: "Mar - 2024",
                  title: "Lamaran",
                  body: "Momen khidmat bersama keluarga yang mengikat janji kami.",
                },
                {
                  t: "Apr - 2025",
                  title: "Menuju Pelaminan",
                  body: "Dengan doa restu, kami siap memasuki babak baru kehidupan.",
                },
              ].map((item, i) => (
                <li
                  key={i}
                  className="mb-10 ml-4 reveal"
                  ref={(el) => {
                    if (el) revealRef.current[`story-${i}`] = el
                  }}
                >
                  <div className="flex flex-col md:flex-row items-start">
                    {/* Teks bagian kiri */}
                    <div className="md:w-2/3 md:pr-4">
                      <div className="absolute w-3 h-3 bg-amber-300 rounded-full -left-1.5 top-1.5 border border-white/30" />
                      <time className="text-sm text-white/70 ps-2.5">{item.t}</time>
                      <h3 className={`text-xl mt-1 ${playfair.className}`}>
                        {item.title}
                      </h3>
                      <p className="text-white/85 mt-1">{item.body}</p>
                    </div>

                    {/* Gambar bagian kanan */}
                    <div className="md:w-1/3 mt-3 md:mt-0">
                      <img
                        src={IMAGES[i % IMAGES.length]}
                        alt={item.title}
                        className="h-44 w-full object-cover rounded-xl border border-white/10"
                      />
                    </div>
                  </div>
                </li>
              ))
            }
          </ol>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="relative">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:py-18 md:py-20">
          <SectionTitle title="RSVP" subtitle="Konfirmasi kehadiran Anda" />

          <form
            onSubmit={submitRSVP}
            className="reveal grid grid-cols-1 md:grid-cols-2 gap-4 card rounded-3xl p-6"
            ref={(el) => {
              if (el) revealRef.current["rsvp-form"] = el
            }}
          >
            <div className="md:col-span-1">
              <label className="text-sm text-white/80">Nama Lengkap</label>
              <input
                required
                disabled={eventDatas !== null} value={rsvpName} onChange={(e) => setRsvpName(e.target.value)}
                className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="Nama Anda"
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-sm text-white/80">No. WhatsApp</label>
              <input
                required
                value={rsvpHp} onChange={(e) => setRsvpHp(e.target.value)}
                className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="text-sm text-white/80">Kehadiran</label>
              <select
                value={rsvpAtt} onChange={(e) => setRsvpAtt(e.target.value as RsvpStatusEnum)}
                className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                <option value={RsvpStatusEnum.PRESENCE}>Hadir</option>
                <option value={RsvpStatusEnum.ABSENCE}>Tidak hadir</option>
                <option value={RsvpStatusEnum.UNKNOWN}>Belum pasti</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-white/80">Jumlah Tamu</label>
              {/* <input
                type="number"
                value={rsvpAttNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setRsvpAttNumber(1);
                    return;
                  }
                  setRsvpAttNumber(parseInt(value));
                }}
                className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-500"
              /> */}
              <select
                value={rsvpAttNumber} onChange={(e) => setRsvpAttNumber(parseInt(e.target.value))}
                className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                <option value="1">1 Orang</option>
                <option value="2">2 Orang</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-white/80">Pesan / Doa</label>
              <textarea
                rows={4}
                value={rsvpDesc} onChange={(e) => setRsvpDesc(e.target.value)}
                className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="Tulis pesan terbaik Anda..."
              />
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button type="submit" className={`btn ${THEME.btn} w-full sm:w-auto`}>
                Kirim Konfirmasi
              </button>
            </div>
          </form>

          {
            datasRsvp !== null ? <div className="mt-14">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white">
                  Guest Book
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  Ucapan & doa dari para tamu
                </p>
              </div>

              <div className="space-y-4">
                {datasRsvp.map((msg, i) => (
                  <div
                    key={i}
                    className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 hover:bg-white/10 transition"
                  >

                    {/* glow line */}
                    <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-fuchsia-500/40 rounded-full" />

                    <div className="pl-4">

                      {/* header */}
                      <div className="flex items-center justify-between">

                        <p className="text-white font-medium">
                          {msg.name}
                        </p>

                        <span
                          className={`text-[11px] px-3 py-1 rounded-full border ${msg.att_status === 'PRESENCE'
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-400/30"
                            : msg.att_status === 'UNKNOWN'
                              ? "bg-yellow-500/10 text-yellow-300 border-yellow-400/30"
                              : "bg-rose-500/10 text-rose-300 border-rose-400/30"
                            }`}
                        >
                          {msg.att_status ? rsvpLabels[msg.att_status] : "-"}
                        </span>

                      </div>

                      {/* message */}
                      <p className="mt-2 text-sm text-white/70 leading-relaxed">
                        {msg.desc || "-"}
                      </p>

                      {/* date */}
                      <p className="mt-3 text-xs text-white/40">
                        {msg.createdAt ? msg.createdAt.toLocaleDateString("id-ID") : "-"}
                      </p>

                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-xs text-white/50">
                  Page {pageTableRsvp} of {totalPageRsvp}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={pageTableRsvp <= 1}
                    onClick={() => {
                      if (pageTableRsvp >= 1) changePaginateRsvp(pageTableRsvp - 1);
                    }}
                    className="px-3 py-1 text-sm rounded-full border border-white/20 text-white/70 hover:bg-white/10 transition"
                  >
                    Prev
                  </button>

                  {
                    Array.from({ length: totalPageRsvp }, (x, i) => {
                      const numberPage = i + 1;
                      return <button key={i}
                        onClick={() => changePaginateRsvp(numberPage)}
                        className={`px-3 py-1 text-sm rounded-full ${pageTableRsvp === numberPage ? "bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]" : "border border-white/20 text-white/70 hover:bg-white/10 transition"}`}>
                        {numberPage}
                      </button>
                    })
                  }

                  <button
                    disabled={pageTableRsvp >= totalPageRsvp}
                    onClick={() => {
                      if (pageTableRsvp <= totalPageRsvp) changePaginateRsvp(pageTableRsvp + 1);
                    }}
                    className="px-3 py-1 text-sm rounded-full border border-white/20 text-white/70 hover:bg-white/10 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div> : <div className="mt-14">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white">
                  Guest Book
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  Ucapan & doa dari para tamu
                </p>
              </div>

              <div className="space-y-4">

                {[
                  {
                    name: "Kevin Pratama",
                    message:
                      "Selamat menempuh hidup baru, semoga langgeng sampai tua ✨",
                    date: "15 Apr 2026",
                    status: "Hadir",
                  },
                  {
                    name: "Dinda Lestari",
                    message:
                      "Maaf belum bisa hadir, tapi doa terbaik selalu menyertai kalian 💜",
                    date: "16 Apr 2026",
                    status: "Tidak Hadir",
                  },
                  {
                    name: "Rizky Aditya",
                    message:
                      "Semoga menjadi keluarga yang sakinah mawaddah warahmah 🔥",
                    date: "17 Apr 2026",
                    status: "Belum Pasti",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 hover:bg-white/10 transition"
                  >

                    {/* glow line */}
                    <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-fuchsia-500/40 rounded-full" />

                    <div className="pl-4">

                      {/* header */}
                      <div className="flex items-center justify-between">

                        <p className="text-white font-medium">
                          {item.name}
                        </p>

                        <span
                          className={`text-[11px] px-3 py-1 rounded-full border ${item.status === "Hadir"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-400/30"
                            : item.status === "Belum Pasti"
                              ? "bg-yellow-500/10 text-yellow-300 border-yellow-400/30"
                              : "bg-rose-500/10 text-rose-300 border-rose-400/30"
                            }`}
                        >
                          {item.status}
                        </span>

                      </div>

                      {/* message */}
                      <p className="mt-2 text-sm text-white/70 leading-relaxed">
                        {item.message}
                      </p>

                      {/* date */}
                      <p className="mt-3 text-xs text-white/40">
                        {item.date}
                      </p>

                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              <div className="mt-10 flex flex-col items-center gap-3">

                <p className="text-sm text-white/50">
                  Page 1 of 3
                </p>

                <div className="flex items-center gap-2">

                  <button className="px-3 py-1 text-sm rounded-full border border-white/20 text-white/70 hover:bg-white/10 transition">
                    Prev
                  </button>

                  <button className="px-3 py-1 text-sm rounded-full bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                    1
                  </button>

                  <button className="px-3 py-1 text-sm rounded-full border border-white/20 text-white/70 hover:bg-white/10 transition">
                    2
                  </button>

                  <button className="px-3 py-1 text-sm rounded-full border border-white/20 text-white/70 hover:bg-white/10 transition">
                    3
                  </button>

                  <button className="px-3 py-1 text-sm rounded-full border border-white/20 text-white/70 hover:bg-white/10 transition">
                    Next
                  </button>

                </div>
              </div>
            </div>
          }

        </div>
      </section>

      {/* HADIAH */}
      <section id="hadiah" className="relative">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20 md:py-24">
          <SectionTitle
            title="Hadiah"
            subtitle="Doa restu adalah yang utama. Namun bagi yang berkenan memberi hadiah:"
          />

          {/* ================= TRANSFER ================= */}
          <div className="relative mt-10">
            {/* BANK */}
            <div ref={(el) => {
              if (el) revealRef.current["gift-bank"] = el
            }}
              className="reveal card rounded-2xl p-6"
            >
              <h4 className={`text-xl mb-4 ${playfair.className}`}>
                Transfer Bank
              </h4>

              {
                eventDatas ? <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {
                    eventDatas.event_gifts.map((x, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-4 rounded-xl bg-black/30 border border-white/10 p-4"
                      >
                        <div className="text-sm">
                          <div className="flex items-center gap-3 text-white mb-2">
                            <img className="h-5" src={allPaymentMethod.find(m => m.key === x.name)?.icon} />
                          </div>
                          <p className="text-white/70">No. Rek: {x.no_rek}</p>
                          <p className="text-white/50">a.n. {x.account}</p>
                        </div>

                        <button
                          className="btn bg-white/10 text-sm px-4 py-2 rounded-full"
                          onClick={() => navigator.clipboard.writeText(x.no_rek ?? "")}
                        >
                          Salin
                        </button>
                      </div>
                    ))
                  }
                </div> : <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    {
                      icon: "bca",
                      no: "1234567890",
                      name: "Aisyah Rahma",
                    },
                    {
                      icon: "dana",
                      no: "0812-3456-7890",
                      name: "Zidan Arya",
                    },
                    {
                      icon: "ovo",
                      no: "0812-3456-7890",
                      name: "Zidan Arya",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4 rounded-xl bg-black/30 border border-white/10 p-4"
                    >
                      <div className="text-sm">
                        <div className="flex items-center gap-3 text-white mb-2">
                          <img className="h-5" src={allPaymentMethod.find(m => m.key === item.icon)?.icon} />
                        </div>
                        <p className="text-white/70">No. Rek: {item.no}</p>
                        <p className="text-white/50">a.n. {item.name}</p>
                      </div>

                      <button
                        className="btn bg-white/10 text-sm px-4 py-2 rounded-full"
                        onClick={() => navigator.clipboard.writeText(item.no)}
                      >
                        Salin
                      </button>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>

          <div className="relative">
            {/* ================= WISHLIST ================= */}
            <div ref={(el) => {
              if (el) revealRef.current["gift-wishlist"] = el
            }} className="mt-14 reveal card rounded-2xl p-6 md:p-8">
              <h4 className={`text-xl mb-2 ${playfair.className}`}>
                Wishlist Hadiah
              </h4>

              {/* ================= ALAMAT ================= */}
              <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-4">

                {/* GRID TOP: Recipient + Phone */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {/* Recipient */}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">
                      Penerima
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="text-sm text-white/70 wrap-break-word">
                        {
                          eventDatas
                            ? (eventDatas.wishlist_recip ?? "Please wait...")
                            : "Aisyah Rahma"
                        }
                      </p>

                      {
                        eventDatas ? (
                          eventDatas.wishlist_recip && (
                            <button
                              onClick={() => {
                                copyToClipboard(eventDatas.wishlist_recip ?? "");
                                toast({
                                  type: "success",
                                  title: "Copy to Clipboard",
                                  message: "Recipient copied successfully.",
                                });
                              }}
                              className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                            >
                              <svg viewBox="0 0 24 24" className="h-4 w-4">
                                <path
                                  fill="currentColor"
                                  d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"
                                />
                              </svg>
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => {
                              copyToClipboard("Aisyah Rahma");
                              toast({
                                type: "success",
                                title: "Copy to Clipboard",
                                message: "Recipient copied successfully.",
                              });
                            }}
                            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                          >
                            <svg viewBox="0 0 24 24" className="h-4 w-4">
                              <path
                                fill="currentColor"
                                d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"
                              />
                            </svg>
                          </button>
                        )
                      }
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">
                      Nomor HP
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="text-sm text-white/70 wrap-break-word">
                        {
                          eventDatas
                            ? (eventDatas.wishlist_phone ?? "Please wait...")
                            : "+62 812 3456 7890"
                        }
                      </p>

                      {
                        eventDatas ? (
                          eventDatas.wishlist_phone && (
                            <button
                              onClick={() => {
                                copyToClipboard(eventDatas.wishlist_phone ?? "");
                                toast({
                                  type: "success",
                                  title: "Copy to Clipboard",
                                  message: "Phone number copied successfully.",
                                });
                              }}
                              className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                            >
                              <svg viewBox="0 0 24 24" className="h-4 w-4">
                                <path
                                  fill="currentColor"
                                  d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"
                                />
                              </svg>
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => {
                              copyToClipboard("+62 812 3456 7890");
                              toast({
                                type: "success",
                                title: "Copy to Clipboard",
                                message: "Phone number copied successfully.",
                              });
                            }}
                            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                          >
                            <svg viewBox="0 0 24 24" className="h-4 w-4">
                              <path
                                fill="currentColor"
                                d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"
                              />
                            </svg>
                          </button>
                        )
                      }
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-white/10" />

                {/* Address */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/50">
                    Alamat Pengiriman
                  </p>

                  <div className="mt-2 flex items-start justify-between gap-3">
                    <p className="text-sm leading-relaxed text-white/70 wrap-break-word">
                      {
                        eventDatas
                          ? (eventDatas.wishlist_address ?? "Please wait... Shipping address is waiting to adding.")
                          : "Aisyah Rahma Jl. Melati No. 10 Bandung 40123 Indonesia"
                      }
                    </p>

                    {
                      eventDatas ? (
                        eventDatas.wishlist_address && (
                          <button
                            onClick={() => {
                              copyToClipboard(eventDatas.wishlist_address ?? "");
                              toast({
                                type: "success",
                                title: "Copy to Clipboard",
                                message: "Address copied successfully.",
                              });
                            }}
                            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                          >
                            <svg viewBox="0 0 24 24" className="h-4 w-4">
                              <path
                                fill="currentColor"
                                d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"
                              />
                            </svg>
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => {
                            copyToClipboard("Aisyah Rahma Jl. Melati No. 10 Bandung 40123 Indonesia");
                            toast({
                              type: "success",
                              title: "Copy to Clipboard",
                              message: "Address copied successfully.",
                            });
                          }}
                          className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4">
                            <path
                              fill="currentColor"
                              d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"
                            />
                          </svg>
                        </button>
                      )
                    }
                  </div>
                </div>

              </div>

              <p className="mt-3 text-sm text-white/70">
                Beberapa referensi hadiah yang mungkin bermanfaat bagi kami.
                Tidak ada kewajiban — kehadiran Anda tetap yang utama 🤍
              </p>

              <div className="mt-6 grid md:grid-cols-3 gap-5">
                {
                  datasWs !== null ? datasWs.map((x, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-black/30 border border-white/10 p-4 flex flex-col justify-between"
                    >
                      <div>
                        <p className="font-medium">{x.name}{x.qty === x.reserve_qty && " (FULL)"}</p>
                        <p className="text-sm text-white/60 mt-1">
                          Estimasi: Rp {x.product_price ? (x.product_price ?? 0).toLocaleString('id-ID') : "-"}
                        </p>
                        <p className="text-sm text-white/60 mt-1">
                          Jumlah: {x.qty} Unit • Direservasi: {x.reserve_qty} Unit
                        </p>
                      </div>

                      <div className='flex justify-between items-center gap-3'>
                        <a
                          href={x.product_url ?? ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 text-center text-sm rounded-full border border-white/20 py-2 px-3 hover:bg-white/10 transition"
                        >
                          Lihat
                        </a>
                        <button
                          onClick={() => openModalWislist(x.id)}
                          className="flex-1 mt-3 text-center text-sm rounded-full border border-white/20 py-2 hover:bg-white/10 transition"
                        >
                          Reservasi <i className='bx bx-gift text-base ml-1'></i>
                        </button>
                      </div>
                    </div>
                  )) : [
                    { name: "Set Peralatan Makan", price: "Rp 1.500.000", qty: 1 },
                    { name: "Sprei Premium King Size", price: "Rp 2.200.000", qty: 1 },
                    { name: "Lampu Meja Minimalis", price: "Rp 850.000", qty: 1 },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-black/30 border border-white/10 p-4 flex flex-col justify-between"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-white/60 mt-1">
                          Estimasi: {item.price}
                        </p>
                        <p className="text-sm text-white/60 mt-1">
                          Jumlah: {item.qty} Unit • Direservasi: 1 Unit
                        </p>
                      </div>

                      <div className='flex justify-between items-center gap-3'>
                        <a
                          href="#"
                          className="mt-3 text-center text-sm rounded-full border border-white/20 py-2 px-3 hover:bg-white/10 transition"
                        >
                          Lihat
                        </a>
                        <button
                          className="flex-1 mt-3 text-center text-sm rounded-full border border-white/20 py-2 hover:bg-white/10 transition"
                        >
                          Reservasi <i className='bx bx-gift text-base ml-1'></i>
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>

              {/* ================= PAGINATION (UI ONLY) ================= */}
              {
                datasWs !== null ? <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    {
                      Array.from({ length: totalPageWs }, (x, i) => {
                        const numberPage = i + 1;
                        return <button key={i}
                          onClick={() => changePaginateWs(numberPage)}
                          className={`w-8 h-8 rounded-full ${pageTableWs === numberPage ? "bg-white text-black text-xs font-semibold" : "border border-white/30 text-xs text-white/70"}`}>
                          {numberPage}
                        </button>
                      })
                    }
                  </div>

                  <div className="flex gap-3">
                    <button
                      disabled={pageTableWs <= 1}
                      onClick={() => {
                        if (pageTableWs >= 1) changePaginateWs(pageTableWs - 1);
                      }}
                      className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10 transition"
                    >
                      Prev
                    </button>
                    <button
                      disabled={pageTableWs >= totalPageWs}
                      onClick={() => {
                        if (pageTableWs <= totalPageWs) changePaginateWs(pageTableWs + 1);
                      }}
                      className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10 transition"
                    >
                      Next
                    </button>
                  </div>
                </div> : <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-white text-black text-xs font-semibold">
                      1
                    </button>
                    <button className="w-8 h-8 rounded-full border border-white/30 text-xs text-white/70">
                      2
                    </button>
                    <button className="w-8 h-8 rounded-full border border-white/30 text-xs text-white/70">
                      3
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10 transition">
                      Prev
                    </button>
                    <button className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10 transition">
                      Next
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <ModalWishlist
        open={openedModalWs}
        setOpen={setOpenedModalWs}
        wishlist_id={wishlistActiveId}
        barcode={invtParams.code ?? ""}
        fatchWishlist={fatchWishlist}
      />

      {/* FAQ */}
      <section id="faq" className="relative">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:py-18 md:py-20">
          <SectionTitle title="FAQ" subtitle="Pertanyaan yang sering diajukan" />

          <div className="reveal space-y-3" ref={(el) => {
            if (el) revealRef.current["faq"] = el
          }}>
            {
              eventDatas ? eventDatas.event_faq.map((x, idx) => {
                const isOpen = openFAQ === idx;
                return (
                  <div key={idx} className="rounded-2xl border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setOpenFAQ(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between px-4 py-4 bg-white/5 hover:bg-white/10 transition"
                      aria-expanded={isOpen}
                    >
                      <span className="text-left font-medium">{x.question}</span>
                      <span className="text-xl">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="px-4 py-3 bg-black/30 text-white/85">{x.answer}</div>
                    )}
                  </div>
                );
              }) : [
                {
                  q: "Apakah anak-anak diperbolehkan?",
                  a: "Tentu, kami senang menyambut seluruh keluarga.",
                },
                {
                  q: "Apakah ada dress code?",
                  a: "Menggunakan warna ungu/netral akan sangat serasi dengan tema.",
                },
                {
                  q: "Kapan sebaiknya datang?",
                  a: "Mohon hadir 15-30 menit sebelum acara dimulai.",
                },
                {
                  q: "Apakah tersedia parkir?",
                  a: "Ya, area parkir luas dan terkoordinir.",
                },
              ].map((f, idx) => {
                const isOpen = openFAQ === idx;
                return (
                  <div key={idx} className="rounded-2xl border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setOpenFAQ(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between px-4 py-4 bg-white/5 hover:bg-white/10 transition"
                      aria-expanded={isOpen}
                    >
                      <span className="text-left font-medium">{f.q}</span>
                      <span className="text-xl">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="px-4 py-3 bg-black/30 text-white/85">{f.a}</div>
                    )}
                  </div>
                );
              })
            }
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h4 className={`text-xl ${playfair.className}`}>
                <span className={THEME.accent}>{groom?.shortname ? groom.shortname.charAt(0).toUpperCase() : "A"} & {bride?.shortname ? bride.shortname.charAt(0).toUpperCase() : "Z"}</span> Wedding
              </h4>
              <p className="text-white/80 mt-2">
                {eventDatas ? (eventDatas.greeting_msg ?? "-") : "Assalamualaikum/Salam sejahtera, kami bermaksud menyelenggarakan pernikahan putra-putri kami. Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."}
              </p>
              <div className="mt-4 flex gap-2">
                <span className="chip px-3 py-1 rounded-full">#{groom?.shortname ?? "Aisyah"}{bride?.shortname ?? "Zidan"}</span>
                <span className="chip px-3 py-1 rounded-full">#{formatDate(eventDatas?.event_time ?? WEDDING_DATE, "medium").replace(/\s+/g, "")}</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <h5 className="font-semibold mb-3">Navigasi</h5>
              <ul className="space-y-2">
                {nav.map((n) => (
                  <li key={n.id}>
                    <button
                      className="text-white/85 hover:underline"
                      onClick={() => goToSection(n.id)}
                    >
                      {n.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <h5 className="font-semibold mb-3">Informasi</h5>
              <ul className="space-y-2 text-white/85">
                {
                  eventDatas ? <>
                    {
                      timeWedMb && <li>{`${timeWedMb.title}: ${timeWedMb.time}`}</li>
                    }
                    {
                      timeWedTor && <li>{`${timeWedTor.title}: ${timeWedTor.time}`}</li>
                    }
                    {
                      timeWedMb && <li>Lokasi: {timeWedMb.loc}</li>
                    }
                  </> : <>
                    <li>Akad: 20 Des 2025, 10:00 WIB</li>
                    <li>Resepsi: 20 Des 2025, 19:00 WIB</li>
                    <li>Lokasi: Jakarta</li>
                  </>
                }
              </ul>
            </div>

            <div className="md:col-span-3">
              <h5 className="font-semibold mb-3">Kontak</h5>
              <ul className="space-y-2 text-white/85">
                <li>Phone/WA: {eventDatas ? eventDatas.contact_phone ?? "-" : "0812-3456-7890"}</li>
                <li>Email: {eventDatas ? eventDatas.contact_email ?? "-" : "undangan@aisyah-zidan.id"}</li>
              </ul>
              <button
                onClick={() => goToSection("rsvp")}
                className={`mt-4 btn w-full ${THEME.btn}`}
              >
                RSVP Sekarang
              </button>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-white/70 text-sm">
            <div>
              © {new Date().getFullYear()} {groom?.shortname ?? "Aisyah"} & {bride?.shortname ?? "Zidan"} — All rights reserved.
            </div>
            <div className="mt-1">Designed by <a href={Configs.base_url} target='_blank' className='text-purple-400 underline'>Wedlyvite</a></div>
          </div>
        </div>
      </footer>

      <FloatingActionButton
        isMusic={isMusic}
        setIsMusic={setIsMusic}
        musicUrl={musicUrl ?? (musicThemeWedding?.items[0].url ?? "")}
        qrValue={invtParams.code ?? "Wedlyvite"}
        guestName={eventDatas?.event_rsvp.name ?? "Thomas Edison"}
        eventDate={formatDate(eventDatas?.event_time ?? WEDDING_DATE, "full")}
      />
    </main>
  );
}

export default function WeddingInvitationPage() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}