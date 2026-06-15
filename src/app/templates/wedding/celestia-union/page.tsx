'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Great_Vibes, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import useCountdown from '@/lib/countdown';
import { AnimatePresence, motion } from 'framer-motion';
import bgImage from './bg.jpeg';

import Configs, { MusicThemeKeys, PaymentMethodKeys } from '@/lib/config';
import { useSearchParams } from 'next/navigation';
import { EventInitProps, GroomBrideProps, InvitationParams } from '@/lib/model-types';
import { EventGifts, EventRsvp, RsvpStatusEnum } from '@/generated/prisma';
import { GetDataEventGifts, GetDataEventRsvp } from '@/server/event-detail';
import { CombineDateAndTime, copyToClipboard, delay, ExecuteMinimumDelay, ExtractYtID, formatDate, getMonthName, playMusic, rsvpLabels, toast } from '@/lib/utils';
import { GetSplashScreenEventData, UpadateRsvp } from '@/server/event';
import { GenProfileDescWedding } from '../../utils';
import LoadingUI from '@/components/loading/loading-ui';
import FloatingActionButton from '../../floating-action';
import { ModalWishlist } from '../../modal-wishlist';

const greatVibes = Great_Vibes({ subsets: ['latin'], weight: ['400'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '600', '700', '800'] });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'] });

/**
 * Invitation Type: Wedding
 * Theme Name: "Celestia Union"
 * Create At: 09-09-2025
 * Create By: David
*/

const THEME = {
  bgGradient: 'from-indigo-950 via-slate-900 to-black', // latar elegan gelap
  accent: 'text-amber-300', // aksen “emas”
  accentBg: 'bg-amber-300',
  accentRing: 'focus:ring-amber-300/40',
  cardBg: 'bg-white/5 backdrop-blur-md',
  borderSoft: 'border-white/10',
};

const IMAGES = [
  `${Configs.base_url}/assets/img/2149043983.jpg`,
  `${Configs.base_url}/assets/img/2149043983.jpg`,
  `${Configs.base_url}/assets/img/2149043983.jpg`,
  `${Configs.base_url}/assets/img/2149043983.jpg`,
];

const NAV = [
  { id: 'mempelai', label: 'Mempelai' },
  { id: 'acara', label: 'Acara' },
  { id: 'galeri', label: 'Galeri' },
  { id: 'cerita', label: 'Cerita' },
  { id: 'rsvp', label: 'RSVP' },
  { id: 'hadiah', label: 'Hadiah' },
  { id: 'faq', label: 'FAQ' },
];

function classNames(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(' ');
}

function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isLocked])
}

/**
 * =========================
 * Komponen Utama Halaman
 * =========================
 */
const TARGET_DATE = new Date();
TARGET_DATE.setDate(TARGET_DATE.getDate() + 12);

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

            const getfirstSchedule = findData.schedule_info.find(x => x.type === "WED_MB");
            if (getfirstSchedule) setLonglatLoc(`${getfirstSchedule.latitude},${getfirstSchedule.longitude}`);

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
  // Atur tanggal pernikahan di sini (format ISO agar aman):

  const [active, setActive] = useState<string>('mempelai');
  const [navOpen, setNavOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
  const { days, hours, minutes, seconds, isToday, isExpired } = useCountdown(eventDatas?.event_time ?? TARGET_DATE);

  // Hero background carousel
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Intersection Observer utk highlight nav
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.2, 0.6, 1] }
    );

    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) {
        sectionsRef.current[id] = el as HTMLElement;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setNavOpen(false);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
  };

  // Galeri slider
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollGallery = (dir: 'left' | 'right') => {
    const node = galleryRef.current;
    if (!node) return;
    const amount = node.clientWidth * 0.9;
    node.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  // FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // RSVP form (dummy handler)
  const [sending, setSending] = useState(false);
  const onSubmitRSVP = async (e: React.FormEvent<HTMLFormElement>) => {
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

  if (isLoading) return <div>
    <div className="absolute inset-0">
      <img
        src={bgImage.src}
        alt="cover"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
    </div>

    <LoadingUI activeTitle={false} />
  </div>

  return (
    <main className={classNames('min-h-screen scroll-smooth', jakarta.className)}>
      {/* Background global */}
      <div className={classNames('fixed inset-0 -z-10', `bg-linear-to-br ${THEME.bgGradient}`)} />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.5),transparent_90%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 mix-blend-overlay" style={{ backgroundImage: `url(${bgImage.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />

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
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10"
            >
              <p className="tracking-widest uppercase text-sm mb-4 text-white">Wedding Invitation</p>
              <span className={classNames(greatVibes.className, 'text-5xl leading-none md:text-7xl', THEME.accent)}>
                {groom?.shortname ?? "Alya"} & {bride?.shortname ?? "Rizky"}
              </span>
              <p className="mt-4 text-lg"><span className={THEME.accent}>{formatDate(eventDatas?.event_time ?? TARGET_DATE, "full")}</span></p>
              <p className="mt-2 italic text-white">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="font-semibold text-xl mt-1 text-white">{eventDatas?.event_rsvp.name ?? "Nama Tamu"}</p>

              <button
                onClick={() => {
                  if (musicUrl) playMusic(musicUrl);
                  else playMusic(musicThemeWedding?.items[0].url ?? "");
                  setIsMusic(prev => !prev);
                  setOpened(prev => !prev);
                }}
                className={classNames(
                  'group mt-8 inline-flex items-center gap-3 rounded-full px-6 py-3 text-black transition focus:outline-none focus:ring-4',
                  THEME.accentBg, THEME.accentRing
                )}
              >
                <span className="font-semibold">Buka Undangan</span>
                <span className="rounded-full bg-black/10 p-1 transition group-hover:translate-x-0.5">
                  <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="m13 5l7 7l-7 7v-4H4v-6h9V5z" /></svg>
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header ref={headerRef} className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className={classNames(greatVibes.className, 'text-2xl md:text-3xl', THEME.accent)}>{groom?.shortname ? groom.shortname.charAt(0).toUpperCase() : "A"} & {bride?.shortname ? bride.shortname.charAt(0).toUpperCase() : "R"}</span>
            <span className={classNames(playfair.className, 'hidden text-sm uppercase tracking-widest text-white/70 sm:block')}>Undangan Pernikahan</span>
          </div>
          <nav className="hidden items-center gap-2 md:flex">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className={classNames(
                  'rounded-full px-3 py-2 text-sm transition-all',
                  active === n.id ? `bg-white/10 text-white ${THEME.accentRing} ring-2` : 'text-white/70 hover:text-white'
                )}
              >
                {n.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden rounded-full border border-white/20 p-2 text-white/90 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" /></svg>
          </button>
        </div>
        {/* Mobile menu */}
        {navOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/60 backdrop-blur-xl">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-4 py-3">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => scrollTo(n.id)}
                  className={classNames(
                    'rounded-lg px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/10',
                    active === n.id && 'ring-2 ring-white/30'
                  )}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="hero" className="relative">
        {/* Background carousel */}
        <div className="relative h-[82vh] w-full overflow-hidden md:h-[88vh]">
          <div className="absolute inset-0">
            {/* Background image */}
            <img
              src={eventDatas ? eventDatas.couple_img_path ?? IMAGES[0] : IMAGES[0]}
              alt="Background"
              className="h-full w-full object-cover"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/40 to-black/70" />

            {/* Extra effect */}
            <div
              className="absolute inset-0 mix-blend-overlay opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.15), transparent 35%)',
              }}
            />
          </div>

          {/* Konten hero */}
          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 text-center text-white">
            <span className={classNames(greatVibes.className, 'text-5xl leading-none md:text-7xl', THEME.accent)}>{groom?.shortname ?? "Alya"} & {bride?.shortname ?? "Rizky"}</span>
            <h1 className={classNames(playfair.className, 'mt-3 text-2xl font-semibold md:text-4xl')}>Dengan Penuh Cinta, Kami Mengundang</h1>
            <p className="mt-2 max-w-2xl text-white/80 md:text-lg">
              Mohon doa restu atas pernikahan kami pada <span className={THEME.accent}>{formatDate(eventDatas?.event_time ?? TARGET_DATE, "full")}</span>, pukul <span className={THEME.accent}>{formatDate(eventDatas?.event_time ?? TARGET_DATE, undefined, "short")} WIB</span>.
            </p>

            {/* Countdown */}
            <div className="mt-6 grid w-full max-w-xl grid-cols-4 gap-2">
              {isExpired ? (
                <div className="col-span-4 rounded-2xl border border-emerald-200/20 bg-emerald-400/10 p-4 backdrop-blur">
                  <p className="text-sm text-emerald-200">Acara Telah Berakhir</p>
                  <p className={classNames(playfair.className, 'text-xl text-white')}>Terima kasih atas doa & kehadiran Anda.</p>
                </div>
              ) : isToday ? (
                <div className="col-span-4 rounded-2xl border border-amber-200/20 bg-amber-400/10 p-4 backdrop-blur">
                  <p className="text-sm text-amber-200">Hari H Telah Tiba</p>
                  <p className={classNames(playfair.className, 'text-xl text-white')}>Sampai jumpa di tempat acara! 🎉</p>
                </div>
              ) : (
                <>
                  {[
                    { label: 'Hari', value: days },
                    { label: 'Jam', value: hours },
                    { label: 'Menit', value: minutes },
                    { label: 'Detik', value: seconds },
                  ].map((item) => (
                    <div key={item.label} className={classNames('rounded-2xl border p-3 text-center backdrop-blur', THEME.borderSoft, THEME.cardBg)}>
                      <div className={classNames(playfair.className, 'text-3xl md:text-4xl')}>{String(item.value).padStart(2, '0')}</div>
                      <div className="text-xs uppercase tracking-wider text-white/70">{item.label}</div>
                    </div>
                  ))}
                </>
              )}
            </div>

            <button
              onClick={() => scrollTo('mempelai')}
              className={classNames(
                'group mt-8 inline-flex items-center gap-3 rounded-full px-6 py-3 text-black transition focus:outline-none focus:ring-4',
                THEME.accentBg, THEME.accentRing
              )}
            >
              <span className="font-semibold">Lihat Undangan</span>
              <span className="rounded-full bg-black/10 p-1 transition group-hover:translate-x-0.5">
                <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="m13 5l7 7l-7 7v-4H4v-6h9V5z" /></svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Section: Mempelai */}
      <section id="mempelai" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className={classNames(playfair.className, 'text-3xl text-white md:text-4xl')}>Kata Sambutan</h2>
            <p className="mt-3 text-white/80">
              {eventDatas ? (eventDatas.greeting_msg ?? "-") : "Assalamualaikum/Salam sejahtera, kami bermaksud menyelenggarakan pernikahan putra-putri kami. Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."}
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {
              eventDatas ? eventDatas.gb_info.map((x, i) => (
                <div
                  key={i}
                  className={classNames(
                    'group relative overflow-hidden rounded-3xl border p-5 md:p-6',
                    THEME.borderSoft,
                    THEME.cardBg,
                    'min-h-87.5'
                  )}
                >
                  <div className="relative w-full h-62.5 overflow-hidden rounded-2xl">
                    <img
                      src={x.img_path ?? ""}
                      alt={x.shortname}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      style={{
                        objectPosition: 'center',
                      }}
                    />
                  </div>

                  <div className="mt-4 z-10 relative">
                    <h3 className={classNames(playfair.className, 'text-2xl text-white')}>
                      {x.fullname}
                    </h3>
                    <p className="text-white/70">
                      {x.type === "Groom" ? groomProfile : brideProfile}
                    </p>
                    {
                      x.personal_msg && <p className="text-white/70 italic">{`“${x.personal_msg}”`}</p>
                    }
                  </div>

                  <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                    <div className="absolute inset-0 bg-linear-to-t from-amber-300/10 via-transparent to-transparent" />
                  </div>
                </div>
              )) : [
                { name: 'Alya Putri', desc: 'Putri dari Bpk. Ahmad & Ibu Sari' },
                { name: 'Rizky Pratama', desc: 'Putra dari Bpk. Budi & Ibu Rina' },
              ].map((p, idx) => (
                <div
                  key={idx}
                  className={classNames(
                    'group relative overflow-hidden rounded-3xl border p-5 md:p-6',
                    THEME.borderSoft,
                    THEME.cardBg,
                    'min-h-87.5'
                  )}
                >
                  <div className="relative w-full h-62.5 overflow-hidden rounded-2xl">
                    <img
                      src={IMAGES[0]}
                      alt={p.name}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      style={{
                        objectPosition: 'center',
                      }}
                    />
                  </div>

                  <div className="mt-4 z-10 relative">
                    <h3 className={classNames(playfair.className, 'text-2xl text-white')}>
                      {p.name}
                    </h3>
                    <p className="text-white/70">{p.desc}</p>
                  </div>

                  <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                    <div className="absolute inset-0 bg-linear-to-t from-amber-300/10 via-transparent to-transparent" />
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </section>

      {/* Section: Acara */}
      <section id="acara" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h2 className={classNames(playfair.className, 'text-3xl text-white md:text-4xl')}>Rangkaian Acara</h2>
          <p className="mt-2 text-white/80">Berikut informasi waktu & tempat pelaksanaan.</p>

          {
            eventDatas ? <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className={classNames('rounded-3xl border p-6', THEME.borderSoft, THEME.cardBg)}>
                <div className="space-y-5">
                  {
                    eventDatas.schedule_info.map((x, i) => {
                      let title = "";
                      if (x.type === "WED_MB") title = "Akad Nikah";
                      else if (x.type === "WED_TOR") {
                        if (x.ceremony_type === "Reception") title = "Resepsi";
                        else if (x.ceremony_type === "Traditional") title = "Tradisional / Adat";
                      }

                      return <div key={i} className='space-y-2'>
                        <h3 className={classNames(playfair.className, 'text-xl text-white')}>{title}</h3>
                        <p className="text-white/70">{`${formatDate(CombineDateAndTime(x.date, x.start_time), "full", "short")} - ${x.end_time}`}</p>
                        <div className="text-white/70">
                          {`${x.location} · ${x.address}`}. <a
                            href={`https://www.google.com/maps?q=${x.latitude},${x.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-500 underline"
                          >
                            Lihat Lokasi
                          </a>
                        </div>
                        {x.notes.length > 0 && <p className="text-white/70 mb-2">Catatan: {x.notes.join(", ")}.</p>}

                        {
                          x.youtube_url && <div>
                            <a
                              href={x.youtube_url}
                              target="_blank"
                              className={classNames('inline-block rounded-full px-5 py-2 text-sm font-semibold text-black transition', THEME.accentBg)}
                            >
                              <div className='flex items-center'>
                                <div className='me-1 leading-none'>Live Youtube</div><i className='bx bxl-youtube text-2xl'></i>
                              </div>
                            </a>
                          </div>
                        }
                      </div>
                    })
                  }
                  {
                    eventDatas.schedule_note !== null && <div className="rounded-2xl border p-4 text-white/80 backdrop-blur-sm">
                      <div className="text-sm">Catatan</div>
                      <div className="text-white">{(eventDatas.schedule_note)}</div>
                    </div>
                  }
                </div>
              </div>

              <div className={classNames('overflow-hidden rounded-3xl border relative', THEME.borderSoft, THEME.cardBg)}>
                <div className="h-full w-full">
                  <iframe
                    title="Lokasi Acara"
                    className="h-125 md:h-full w-full"
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${longlatLoc}&z=14&output=embed`}
                  />
                </div>

                {/* Overlay Button */}
                <div className="w-full flex justify-center absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
                  <a
                    href={`https://www.google.com/maps?q=${longlatLoc}`}
                    target="_blank"
                    className={classNames(
                      'inline-block rounded-full px-5 py-2 text-sm font-semibold text-black shadow-lg transition',
                      THEME.accentBg
                    )}
                  >
                    Buka di Google Maps
                  </a>
                </div>
              </div>
            </div> : <div className="mt-8 grid gap-6 md:grid-cols-2">
              {/* Detail */}
              <div className={classNames('rounded-3xl border p-6', THEME.borderSoft, THEME.cardBg)}>
                <div className="space-y-5">
                  <div className='space-y-2'>
                    <h3 className={classNames(playfair.className, 'text-xl text-white')}>Akad Nikah</h3>
                    <p className="text-white/70">Minggu, 21 Desember 2025 • 10.00 WIB</p>
                    <p className="text-white/70">
                      Masjid Al-Falah, Jl. Damai No. 21, Jakarta. <a
                        href={`https://www.google.com/maps?q=1234,2345`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-500 underline"
                      >
                        Lihat Lokasi
                      </a>
                    </p>
                    <p className="text-white/70 mb-2">Catatan: Nuansa Navy/Gold.</p>
                    <div>
                      <a
                        href="https://youtu.be/17aqk4WUhIA?si=KDgGKd2wTs1FpVTo"
                        target="_blank"
                        className={classNames('inline-block rounded-full px-5 py-2 text-sm font-semibold text-black transition', THEME.accentBg)}
                      >
                        <div className='flex items-center'>
                          <div className='me-1 leading-none'>Live Youtube</div><i className='bx bxl-youtube text-2xl'></i>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <h3 className={classNames(playfair.className, 'text-xl text-white')}>Resepsi</h3>
                    <p className="text-white/70">Minggu, 21 Desember 2025 • 12.00 - 15.00 WIB</p>
                    <p className="text-white/70">
                      Gedung Graha Cinta, Jl. Bahagia No. 5, Jakarta. <a
                        href={`https://www.google.com/maps?q=1234,2345`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-500 underline"
                      >
                        Lihat Lokasi
                      </a>
                    </p>
                    <p className="text-white/70 mb-2">Catatan: Nuansa Navy/Gold.</p>
                    <div>
                      <a
                        href="https://youtu.be/17aqk4WUhIA?si=KDgGKd2wTs1FpVTo"
                        target="_blank"
                        className={classNames('inline-block rounded-full px-5 py-2 text-sm font-semibold text-black transition', THEME.accentBg)}
                      >
                        <div className='flex items-center'>
                          <div className='me-1 leading-none'>Live Youtube</div><i className='bx bxl-youtube text-2xl'></i>
                        </div>
                      </a>
                    </div>
                  </div>

                  <div className="rounded-2xl border p-4 text-white/80 backdrop-blur-sm">
                    <div className="text-sm">Catatan</div>
                    <div className="text-white">Mohon hadir tepat waktu & menjaga ketertiban.</div>
                  </div>
                </div>
              </div>

              {/* Maps */}
              <div className={classNames('overflow-hidden rounded-3xl border relative', THEME.borderSoft, THEME.cardBg)}>
                <div className="h-full w-full">
                  <iframe
                    title="Lokasi Acara"
                    className="h-125 md:h-full w-full"
                    loading="lazy"
                    src="https://www.google.com/maps?q=-6.200000,106.816666&z=14&output=embed"
                  />
                </div>

                {/* Overlay Button */}
                <div className="w-full flex justify-center absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
                  <a
                    href="https://maps.google.com/?q=Gedung%20Graha%20Cinta%20Jakarta"
                    target="_blank"
                    className={classNames(
                      'inline-block rounded-full px-5 py-2 text-sm font-semibold text-black shadow-lg transition',
                      THEME.accentBg
                    )}
                  >
                    Buka di Google Maps
                  </a>
                </div>
              </div>
            </div>
          }
        </div>
      </section>

      {/* Section: Galeri */}
      <section id="galeri" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center">
            <h2 className={classNames(playfair.className, 'text-3xl text-white md:text-4xl')}>
              Galeri
            </h2>
            <p className="mt-2 text-white/80">Potret kebahagiaan kami.</p>
          </div>

          {
            eventDatas ? <div className="relative mt-10">
              {/* Tombol panah kiri */}
              <button
                onClick={() => scrollGallery('left')}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white shadow-lg backdrop-blur hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path fill="currentColor" d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Tombol panah kanan */}
              <button
                onClick={() => scrollGallery('right')}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white shadow-lg backdrop-blur hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path fill="currentColor" d="M9 6l6 6-6 6" />
                </svg>
              </button>

              {/* Container galeri */}
              <div
                ref={galleryRef}
                className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4"
              >
                {eventDatas.event_galleries.map((x, i) => (
                  <div key={i} className="snap-center shrink-0">
                    <div
                      className={classNames(
                        'group relative h-72 w-52 md:h-96 md:w-72 overflow-hidden rounded-2xl border shadow-lg transition-transform hover:scale-[1.02]',
                        THEME.borderSoft,
                        THEME.cardBg
                      )}
                    >
                      <img
                        src={x.img_path ?? ""}
                        alt={`Foto ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay hover */}
                      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/60 via-black/30 to-transparent opacity-0 transition group-hover:opacity-100">
                        <svg
                          className="h-10 w-10 text-amber-300 drop-shadow-md"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5L20.49 19l-5-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> : <div className="relative mt-10">
              {/* Tombol panah kiri */}
              <button
                onClick={() => scrollGallery('left')}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white shadow-lg backdrop-blur hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path fill="currentColor" d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Tombol panah kanan */}
              <button
                onClick={() => scrollGallery('right')}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white shadow-lg backdrop-blur hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path fill="currentColor" d="M9 6l6 6-6 6" />
                </svg>
              </button>

              {/* Container galeri */}
              <div
                ref={galleryRef}
                className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4"
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="snap-center shrink-0">
                    <div
                      className={classNames(
                        'group relative h-72 w-52 md:h-96 md:w-72 overflow-hidden rounded-2xl border shadow-lg transition-transform hover:scale-[1.02]',
                        THEME.borderSoft,
                        THEME.cardBg
                      )}
                    >
                      <img
                        src={IMAGES[0]}
                        alt={`Foto ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay hover */}
                      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/60 via-black/30 to-transparent opacity-0 transition group-hover:opacity-100">
                        <svg
                          className="h-10 w-10 text-amber-300 drop-shadow-md"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5L20.49 19l-5-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }

          {
            eventDatas ? (
              eventDatas.youtube_url !== null &&
              <>
                <div className="text-center mt-12">
                  <h2 className={classNames(playfair.className, 'text-3xl text-white md:text-4xl')}>
                    Video
                  </h2>
                  <p className="mt-2 text-white/80">Cuplikan momen spesial yang kami abadikan.</p>
                </div>
                <div className="snap-center shrink-0 mt-10">
                  <div
                    className={classNames(
                      'group relative aspect-video w-full overflow-hidden rounded-2xl border shadow-lg',
                      THEME.borderSoft,
                      THEME.cardBg
                    )}
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
                </div>
              </>
            ) : <>
              <div className="text-center mt-12">
                <h2 className={classNames(playfair.className, 'text-3xl text-white md:text-4xl')}>
                  Video
                </h2>
                <p className="mt-2 text-white/80">Cuplikan momen spesial yang kami abadikan.</p>
              </div>
              <div className="snap-center shrink-0 mt-10">
                <div
                  className={classNames(
                    'group relative aspect-video w-full overflow-hidden rounded-2xl border shadow-lg',
                    THEME.borderSoft,
                    THEME.cardBg
                  )}
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
            </>
          }
        </div>
      </section>

      {/* Section: Cerita (Timeline) */}
      <section id="cerita" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h2 className={classNames(playfair.className, 'text-3xl text-white md:text-4xl')}>Cerita Kami</h2>
          <p className="mt-2 text-white/80">Perjalanan singkat menuju hari bahagia.</p>

          <div className="relative mx-auto mt-8 max-w-3xl">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-white/10 md:left-1/2 md:-translate-x-1/2" />
            {
              eventDatas ? eventDatas.event_histories.map((ev, i) => {
                const isRight = i % 2 === 1;
                return (
                  <div key={i} className={classNames('relative mb-8 md:flex md:items-center',)}>
                    <div className={classNames(
                      'relative z-10 w-full rounded-2xl border p-5 backdrop-blur',
                      THEME.borderSoft, THEME.cardBg,
                      'md:max-w-[46%]',
                      isRight ? 'md:ml-auto' : 'md:mr-auto'
                    )}>
                      <div className="flex items-center gap-3">
                        <div className={classNames('rounded-full px-3 py-1 text-xs font-semibold text-black', THEME.accentBg)}>{getMonthName(ev.month)} - {ev.year}</div>
                        <h3 className={classNames(playfair.className, 'text-xl text-white')}>{ev.name}</h3>
                      </div>
                      <p className="mt-2 text-white/80">{ev.desc}</p>

                      {ev.gallery?.img_path && (
                        <div className="col-span-12 md:col-span-6 mt-2">
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
                    <div className={classNames('absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-black/40 md:left-1/2 md:-translate-x-1/2', THEME.accentBg)} />
                  </div>
                );
              }) : [
                { t: '2018', title: 'Pertama Bertemu', desc: 'Bersua di kampus dan memulai pertemanan.' },
                { t: '2020', title: 'Perjalanan Bersama', desc: 'Belajar saling memahami dalam suka & duka.' },
                { t: '2024', title: 'Lamaran', desc: 'Mengikat janji untuk melangkah lebih serius.' },
                { t: '2025', title: 'Menuju Akad', desc: 'Menyiapkan hari H dengan penuh harap.' },
              ].map((item, idx) => {
                const isRight = idx % 2 === 1;
                return (
                  <div key={idx} className={classNames('relative mb-8 md:flex md:items-center',)}>
                    <div className={classNames(
                      'relative z-10 w-full rounded-2xl border p-5 backdrop-blur',
                      THEME.borderSoft, THEME.cardBg,
                      'md:max-w-[46%]',
                      isRight ? 'md:ml-auto' : 'md:mr-auto'
                    )}>
                      <div className="flex items-center gap-3">
                        <div className={classNames('rounded-full px-3 py-1 text-xs font-semibold text-black', THEME.accentBg)}>{item.t}</div>
                        <h3 className={classNames(playfair.className, 'text-xl text-white')}>{item.title}</h3>
                      </div>
                      <p className="mt-2 text-white/80">{item.desc}</p>
                    </div>
                    <div className={classNames('absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-black/40 md:left-1/2 md:-translate-x-1/2', THEME.accentBg)} />
                  </div>
                );
              })
            }
          </div>
        </div>
      </section>

      {/* Section: RSVP */}
      <section id="rsvp" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className={classNames(playfair.className, 'text-3xl text-white md:text-4xl')}>Konfirmasi Kehadiran</h2>
            <p className="mt-2 text-white/80">Mohon isi formulir berikut untuk RSVP.</p>

            <form
              onSubmit={onSubmitRSVP}
              className={classNames('mt-6 grid gap-4 rounded-3xl border p-6', THEME.borderSoft, THEME.cardBg)}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-white/80">Nama Lengkap</label>
                  <input disabled={eventDatas !== null} value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} name="nama" required placeholder="Nama Anda" className={classNames('w-full rounded-xl border bg-black/30 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring', THEME.borderSoft, THEME.accentRing)} />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-white/80">No. WhatsApp</label>
                  <input value={rsvpHp} onChange={(e) => setRsvpHp(e.target.value)} name="wa" type="tel" placeholder="08xxxxxxxxxx" className={classNames('w-full rounded-xl border bg-black/30 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring', THEME.borderSoft, THEME.accentRing)} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-white/80">Jumlah Tamu</label>
                  <input value={rsvpAttNumber} onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setRsvpAttNumber(1);
                      return;
                    }
                    setRsvpAttNumber(parseInt(value));
                  }} name="jumlah" type="number" min={1} className={classNames('w-full rounded-xl border bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring', THEME.borderSoft, THEME.accentRing)} />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-white/80">Kehadiran</label>
                  <select value={rsvpAtt} onChange={(e) => setRsvpAtt(e.target.value as RsvpStatusEnum)} name="status" className={classNames('w-full rounded-xl border bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring', THEME.borderSoft, THEME.accentRing)}>
                    <option value={RsvpStatusEnum.PRESENCE}>Hadir</option>
                    <option value={RsvpStatusEnum.ABSENCE}>Tidak hadir</option>
                    <option value={RsvpStatusEnum.UNKNOWN}>Belum pasti</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/80">Ucapan / Doa</label>
                <textarea value={rsvpDesc} onChange={(e) => setRsvpDesc(e.target.value)} name="ucapan" rows={4} placeholder="Titipkan doa terbaik untuk kami..." className={classNames('w-full rounded-xl border bg-black/30 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring', THEME.borderSoft, THEME.accentRing)} />
              </div>

              <button type="submit" className={classNames('mt-2 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-black transition hover:brightness-95 focus:outline-none focus:ring-4', THEME.accentBg, THEME.accentRing)}>
                Kirim RSVP
              </button>
            </form>

            {
              datasRsvp !== null ? <div className="mt-12">
                <h3 className={classNames(playfair.className, 'text-2xl text-white md:text-3xl')}>
                  Ucapan & Doa
                </h3>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {datasRsvp.map((msg, i) => (
                    <div
                      key={i}
                      className={classNames(
                        'flex flex-col rounded-2xl border p-5',
                        THEME.borderSoft,
                        THEME.cardBg
                      )}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-white">{msg.name}</p>
                          <p className="text-xs text-white/60">{msg.createdAt ? msg.createdAt.toLocaleDateString("id-ID") : "-"}</p>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={classNames(
                            'rounded-full px-3 py-1 text-xs font-medium',
                            msg.att_status === 'PRESENCE' && 'bg-green-400/20 text-green-300',
                            msg.att_status === 'UNKNOWN' && 'bg-yellow-400/20 text-yellow-300',
                            msg.att_status === 'ABSENCE' && 'bg-red-400/20 text-red-300'
                          )}
                        >
                          {msg.att_status ? rsvpLabels[msg.att_status] : "-"}
                        </span>
                      </div>

                      {/* Message */}
                      <p className="mt-4 text-sm leading-relaxed text-white/80">
                        {msg.desc || "-"}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <p className="text-sm text-white/70">Page {pageTableRsvp} of {totalPageRsvp}</p>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={pageTableRsvp <= 1}
                      onClick={() => {
                        if (pageTableRsvp >= 1) changePaginateRsvp(pageTableRsvp - 1);
                      }}
                      className={classNames(
                        'rounded-full border px-4 py-2 text-sm text-white/70 transition hover:bg-white/10',
                        THEME.borderSoft
                      )}
                    >
                      Prev
                    </button>

                    {
                      Array.from({ length: totalPageRsvp }, (x, i) => {
                        const numberPage = i + 1;
                        return <button key={i}
                          onClick={() => changePaginateRsvp(numberPage)}
                          className={`rounded-full px-4 py-2 text-sm ${pageTableRsvp === numberPage ? "font-semibold text-black " + THEME.accentBg : "text-white/70 hover:bg-white/10"}`}>
                          {numberPage}
                        </button>
                      })
                    }

                    <button
                      disabled={pageTableRsvp >= totalPageRsvp}
                      onClick={() => {
                        if (pageTableRsvp <= totalPageRsvp) changePaginateRsvp(pageTableRsvp + 1);
                      }}
                      className={classNames(
                        'rounded-full border px-4 py-2 text-sm text-white/70 transition hover:bg-white/10',
                        THEME.borderSoft
                      )}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div> : <div className="mt-12">
                <h3 className={classNames(playfair.className, 'text-2xl text-white md:text-3xl')}>
                  Ucapan & Doa
                </h3>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      nama: 'Andi Pratama',
                      pesan: 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah 🤍',
                      tanggal: '12 Jan 2026',
                      status: 'Hadir',
                    },
                    {
                      nama: 'Siti Nurhaliza',
                      pesan: 'Selamat menempuh hidup baru! Bahagia selalu ya 💐',
                      tanggal: '13 Jan 2026',
                      status: 'Mungkin',
                    },
                    {
                      nama: 'Budi Santoso',
                      pesan: 'Maaf tidak bisa hadir, tapi doa terbaik untuk kalian 🙏',
                      tanggal: '14 Jan 2026',
                      status: 'Tidak',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={classNames(
                        'flex flex-col justify-between rounded-2xl border p-5',
                        THEME.borderSoft,
                        THEME.cardBg
                      )}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-white">{item.nama}</p>
                          <p className="text-xs text-white/60">{item.tanggal}</p>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={classNames(
                            'rounded-full px-3 py-1 text-xs font-medium',
                            item.status === 'Hadir' && 'bg-green-400/20 text-green-300',
                            item.status === 'Mungkin' && 'bg-yellow-400/20 text-yellow-300',
                            item.status === 'Tidak' && 'bg-red-400/20 text-red-300'
                          )}
                        >
                          {item.status}
                        </span>
                      </div>

                      {/* Message */}
                      <p className="mt-4 text-sm leading-relaxed text-white/80">
                        {item.pesan}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <p className="text-sm text-white/70">Page 1 of 3</p>

                  <div className="flex items-center gap-2">
                    <button
                      className={classNames(
                        'rounded-full border px-4 py-2 text-sm text-white/70 transition hover:bg-white/10',
                        THEME.borderSoft
                      )}
                    >
                      Prev
                    </button>

                    <button
                      className={classNames(
                        'rounded-full px-4 py-2 text-sm font-semibold text-black',
                        THEME.accentBg
                      )}
                    >
                      1
                    </button>

                    <button className="rounded-full px-4 py-2 text-sm text-white/70 hover:bg-white/10">
                      2
                    </button>

                    <button className="rounded-full px-4 py-2 text-sm text-white/70 hover:bg-white/10">
                      3
                    </button>

                    <button
                      className={classNames(
                        'rounded-full border px-4 py-2 text-sm text-white/70 transition hover:bg-white/10',
                        THEME.borderSoft
                      )}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      {/* Section: Hadiah */}
      <section id="hadiah" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          {/* Header */}
          <h2
            className={classNames(
              playfair.className,
              'text-3xl text-white md:text-4xl'
            )}
          >
            Hadiah Kasih
          </h2>
          <p className="mt-2 text-white/80 max-w-2xl">
            Kehadiran Anda sudah lebih dari cukup. Namun bila berkenan, berikut informasi
            untuk memberikan hadiah sebagai ungkapan kasih.
          </p>

          {/* ====================================================== */}
          {/* PRIMARY GIFT OPTIONS                                  */}
          {/* ====================================================== */}
          {
            eventDatas ? <div className="mt-8 grid gap-6 md:grid-cols-3">
              {
                eventDatas.event_gifts.map((x, i) => (
                  <div
                    key={i}
                    className={classNames(
                      'rounded-3xl border p-6 backdrop-blur',
                      THEME.borderSoft,
                      THEME.cardBg
                    )}
                  >
                    <div className="flex items-center gap-3 text-white">
                      <img className="h-5" src={allPaymentMethod.find(m => m.key === x.name)?.icon} /> • <span className="text-sm">{x.account}</span>
                    </div>

                    <div className="mt-1 text-white leading-relaxed">
                      {x.no_rek}
                    </div>

                    <button
                      onClick={() => {
                        copyToClipboard(x.no_rek ?? "");
                        toast({
                          type: "success",
                          title: "Copy to Clipboard",
                          message: "Well done, Text copied to clipboard.",
                        });
                      }}
                      className={classNames(
                        'mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-black',
                        THEME.accentBg,
                        THEME.accentRing
                      )}
                    >
                      Salin
                      <svg viewBox="0 0 24 24" className="h-4 w-4">
                        <path
                          fill="currentColor"
                          d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              }
            </div> : <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                { icon: 'bca', desc: '1234567890', account: "Alya Putri" },
                { icon: 'dana', desc: '0812-3456-7890', account: "Alya Putri" },
                { icon: 'ovo', desc: '0812-3456-7890', account: "Alya Putri" },
              ].map((h, i) => (
                <div
                  key={i}
                  className={classNames(
                    'rounded-3xl border p-6 backdrop-blur',
                    THEME.borderSoft,
                    THEME.cardBg
                  )}
                >
                  <div className="flex items-center gap-3 text-white">
                    <img className="h-5" src={allPaymentMethod.find(m => m.key === h.icon)?.icon} /> • <span className="text-sm">{h.account}</span>
                  </div>

                  <div className="mt-1 text-white leading-relaxed">
                    {h.desc}
                  </div>

                  <button
                    onClick={() => navigator.clipboard?.writeText(h.desc)}
                    className={classNames(
                      'mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-black',
                      THEME.accentBg,
                      THEME.accentRing
                    )}
                  >
                    Salin
                    <svg viewBox="0 0 24 24" className="h-4 w-4">
                      <path
                        fill="currentColor"
                        d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          }

          {/* ====================================================== */}
          {/* WISHLIST SECTION                                      */}
          {/* ====================================================== */}
          <div className="mt-16">
            <h3
              className={classNames(
                playfair.className,
                'text-2xl text-white mb-2'
              )}
            >
              Wishlist Hadiah
            </h3>

            <div
              className={classNames(
                'relative rounded-3xl border p-6 md:p-8 backdrop-blur',
                THEME.borderSoft,
                THEME.cardBg
              )}
            >
              {/* Decorative Accent */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

              <div className="flex flex-col gap-5">
                {/* Nama Penerima */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase tracking-wider text-white/60">
                      Penerima
                    </div>

                    <div className="mt-1 text-white wrap-break-word">
                      {
                        eventDatas
                          ? (eventDatas.wishlist_recip ?? "Please wait! Recipient is waiting to adding.")
                          : "Budi Santoso"
                      }
                    </div>
                  </div>

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
                          className="shrink-0 rounded-full border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
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
                      <button className="shrink-0 rounded-full border border-white/10 p-2 text-white/70">
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

                {/* Nomor HP */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase tracking-wider text-white/60">
                      Nomor HP
                    </div>

                    <div className="mt-1 text-white">
                      {
                        eventDatas
                          ? (eventDatas.wishlist_phone ?? "Please wait! Phone number is waiting to adding.")
                          : "+62 812 3456 7890"
                      }
                    </div>
                  </div>

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
                          className="shrink-0 rounded-full border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
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
                      <button className="shrink-0 rounded-full border border-white/10 p-2 text-white/70">
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

                {/* Alamat */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase tracking-wider text-white/60">
                      Alamat Pengiriman
                    </div>

                    <div className="mt-1 text-white leading-relaxed">
                      {
                        eventDatas
                          ? (eventDatas.wishlist_address ?? "Please wait! Shipping address is waiting to adding.")
                          : "Jl. Mawar No. 10 Kel. Melati Indah Jakarta Selatan DKI Jakarta 12345 Indonesia"
                      }
                    </div>
                  </div>

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
                          className="shrink-0 rounded-full border border-white/10 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
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
                      <button className="shrink-0 rounded-full border border-white/10 p-2 text-white/70">
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

            <p className="mt-5 text-white/70 text-sm max-w-2xl mb-6">
              Berikut adalah beberapa referensi hadiah yang mungkin bermanfaat bagi
              kami. Tidak ada kewajiban sama sekali — kasih dan doa Anda adalah yang
              utama.
            </p>

            {/* Wishlist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {
                datasWs !== null ? datasWs.map((x, i) => (
                  <div
                    key={i}
                    className={classNames(
                      'rounded-3xl border p-5 backdrop-blur transition',
                      THEME.borderSoft,
                      THEME.cardBg
                    )}
                  >
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="text-white font-medium leading-snug">
                          {x.name}{x.qty === x.reserve_qty && " (FULL)"}
                        </div>

                        <div className="mt-2 text-sm text-white/70 space-y-1">
                          <div>
                            <span className="text-white/80">Perkiraan Harga:</span>{' '}
                            Rp {x.product_price ? (x.product_price ?? 0).toLocaleString('id-ID') : "-"}
                          </div>
                          <div>
                            <span className="text-white/80">Jumlah:</span>{' '}
                            {x.qty} Unit • Direservasi: {x.reserve_qty} Unit
                          </div>
                        </div>
                      </div>

                      <div className='flex justify-between items-center gap-3'>
                        <a
                          href={x.product_url ?? ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={classNames(
                            'inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-xs font-semibold transition',
                            'border border-amber-300 text-amber-300',
                            'flex-1'
                          )}
                        >
                          Lihat
                        </a>
                        <button
                          onClick={() => openModalWislist(x.id)}
                          className={classNames(
                            'inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-xs font-semibold transition',
                            THEME.accentBg,
                            THEME.accentRing,
                            'text-black',
                          )}
                        >
                          Reservasi <i className='bx bx-gift text-base ml-1'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                )) : [
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
                    name: 'Vas Kaca Dekoratif',
                    price: 'Rp 750.000',
                    qty: 2,
                    url: '#',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={classNames(
                      'rounded-3xl border p-5 backdrop-blur transition',
                      THEME.borderSoft,
                      THEME.cardBg
                    )}
                  >
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="text-white font-medium leading-snug">
                          {item.name}
                        </div>

                        <div className="mt-2 text-sm text-white/70 space-y-1">
                          <div>
                            <span className="text-white/80">Perkiraan Harga:</span>{' '}
                            {item.price}
                          </div>
                          <div>
                            <span className="text-white/80">Jumlah:</span>{' '}
                            {item.qty} Unit • Direservasi: 1 Unit
                          </div>
                        </div>
                      </div>

                      <div className='flex justify-between items-center gap-3'>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={classNames(
                            'inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-xs font-semibold transition',
                            'border border-amber-300 text-amber-300',
                            'flex-1'
                          )}
                        >
                          Lihat
                        </a>
                        <button
                          className={classNames(
                            'inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-xs font-semibold transition',
                            THEME.accentBg,
                            THEME.accentRing,
                            'text-black',
                          )}
                        >
                          Reservasi <i className='bx bx-gift text-base ml-1'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>

            {/* ====================================================== */}
            {/* PAGINATION UI (UI ONLY)                                */}
            {/* ====================================================== */}
            {
              datasWs !== null ? <div className="mt-10 flex flex-col items-center gap-4">
                <div className="flex flex-wrap justify-center gap-2">
                  {
                    Array.from({ length: totalPageWs }, (x, i) => {
                      const numberPage = i + 1;
                      return <button key={i}
                        onClick={() => changePaginateWs(numberPage)}
                        className={`h-10 w-10 rounded-full text-xs ${pageTableWs === numberPage ? "font-semibold text-black " + THEME.accentBg : "border text-white/70"}`}>
                        {numberPage}
                      </button>
                    })
                  }
                </div>

                <div className="flex w-full max-w-xs gap-4">
                  <button
                    disabled={pageTableWs <= 1}
                    onClick={() => {
                      if (pageTableWs >= 1) changePaginateWs(pageTableWs - 1);
                    }}
                    className="flex-1 rounded-full border px-4 py-3 text-xs text-white/70">
                    Prev
                  </button>
                  <button
                    disabled={pageTableWs >= totalPageWs}
                    onClick={() => {
                      if (pageTableWs <= totalPageWs) changePaginateWs(pageTableWs + 1);
                    }}
                    className="flex-1 rounded-full border px-4 py-3 text-xs text-white/70">
                    Next
                  </button>
                </div>
              </div> : <div className="mt-10 flex flex-col items-center gap-4">
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    className={classNames(
                      'h-10 w-10 rounded-full text-xs font-semibold text-black',
                      THEME.accentBg
                    )}
                  >
                    1
                  </button>
                  <button className="h-10 w-10 rounded-full border text-xs text-white/70">
                    2
                  </button>
                  <button className="h-10 w-10 rounded-full border text-xs text-white/70">
                    3
                  </button>
                  <span className="px-2 text-white/50 text-xs self-center">…</span>
                  <button className="h-10 w-10 rounded-full border text-xs text-white/70">
                    8
                  </button>
                </div>

                <div className="flex w-full max-w-xs gap-4">
                  <button className="flex-1 rounded-full border px-4 py-3 text-xs text-white/70">
                    Prev
                  </button>
                  <button className="flex-1 rounded-full border px-4 py-3 text-xs text-white/70">
                    Next
                  </button>
                </div>
              </div>
            }
          </div>

          <ModalWishlist
            open={openedModalWs}
            setOpen={setOpenedModalWs}
            wishlist_id={wishlistActiveId}
            barcode={invtParams.code ?? ""}
            fatchWishlist={fatchWishlist}
          />
        </div>
      </section>

      {/* Section: FAQ */}
      <section id="faq" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h2 className={classNames(playfair.className, 'text-3xl text-white md:text-4xl')}>Pertanyaan Umum</h2>
          <div className="mt-6 divide-y divide-white/10 rounded-3xl border backdrop-blur md:mt-8">
            {
              eventDatas ? eventDatas.event_faq.map((x, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} className={classNames('overflow-hidden transition', open ? 'bg-white/5' : '')}>
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left text-white/90"
                    >
                      <span className="font-medium">{x.question}</span>
                      <span className={classNames('transition-transform', open ? 'rotate-180' : '')}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M7 10l5 5 5-5z" /></svg>
                      </span>
                    </button>
                    <div className={classNames('px-5 pb-5 text-white/70', open ? 'block' : 'hidden')}>
                      {x.answer}
                    </div>
                  </div>
                );
              }) : [
                { q: 'Apakah boleh membawa anak?', a: 'Tentu, kami dengan senang hati menyambut keluarga Anda.' },
                { q: 'Apakah tersedia parkir?', a: 'Tersedia lahan parkir cukup luas di area gedung.' },
                { q: 'Kapan waktu terbaik untuk hadir?', a: 'Mohon hadir 15–30 menit sebelum jadwal agar lebih nyaman.' },
                { q: 'Apakah ada protokol kesehatan?', a: 'Silakan gunakan masker jika diperlukan dan jaga kebersihan tangan.' },
              ].map((item, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} className={classNames('overflow-hidden transition', open ? 'bg-white/5' : '')}>
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left text-white/90"
                    >
                      <span className="font-medium">{item.q}</span>
                      <span className={classNames('transition-transform', open ? 'rotate-180' : '')}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M7 10l5 5 5-5z" /></svg>
                      </span>
                    </button>
                    <div className={classNames('px-5 pb-5 text-white/70', open ? 'block' : 'hidden')}>
                      {item.a}
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="grid gap-8 grid-cols-12">
            <div className='col-span-12 md:col-span-5'>
              <div className={classNames(greatVibes.className, 'text-3xl', THEME.accent)}>{groom?.shortname ? groom.shortname.charAt(0).toUpperCase() : "A"} & {bride?.shortname ? bride.shortname.charAt(0).toUpperCase() : "R"}</div>
              <p className="mt-2 text-white/70">
                {eventDatas ? (eventDatas.greeting_msg ?? "-") : "Assalamualaikum/Salam sejahtera, kami bermaksud menyelenggarakan pernikahan putra-putri kami. Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."}
              </p>
            </div>
            <div className='col-span-12 md:col-span-3'>
              <div className="text-white">Navigasi</div>
              <div className="mt-3 grid gap-2 text-white/70">
                {NAV.map((n) => (
                  <button key={n.id} onClick={() => scrollTo(n.id)} className="text-left transition hover:text-white">
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
            <div className='col-span-12 md:col-span-4'>
              <div className="text-white">Kontak</div>
              <div className="mt-3 grid gap-2 text-white/70">
                <span>Phone/WA: {eventDatas ? eventDatas.contact_phone ?? "-" : "0812-3456-7890"}</span>
                <span>Email: {eventDatas ? eventDatas.contact_email ?? "-" : "undangan@alya-rizky.id"}</span>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/60 md:flex-row">
            <div>© {new Date().getFullYear()} • {groom?.shortname ?? "Alya"} & {bride?.shortname ?? "Rizky"} Wedding</div>
            <div>Designed by <a href={Configs.base_url} target='_blank' className='text-amber-300'>Wedlyvite</a></div>
          </div>
        </div>
      </footer>

      {/* Tombol back-to-top */}
      {/* <BackToTop /> */}
      <FloatingActionButton
        isMusic={isMusic}
        setIsMusic={setIsMusic}
        musicUrl={musicUrl ?? (musicThemeWedding?.items[0].url ?? "")}
        qrValue={invtParams.code ?? "Wedlyvite"}
        guestName={eventDatas?.event_rsvp.name ?? "Thomas Edison"}
        eventDate={formatDate(eventDatas?.event_time ?? TARGET_DATE, "full")}
      />
    </main>
  );
};

export default function WeddingInvitationPage() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}

/**
 * Tombol back-to-top mengapung
 */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-5 right-5 z-50 rounded-full border border-white/20 bg-black/60 p-3 text-white/80 backdrop-blur transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
      aria-label="Kembali ke atas"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6"><path fill="currentColor" d="M7 14l5-5l5 5H7z" /></svg>
    </button>
  );
}
