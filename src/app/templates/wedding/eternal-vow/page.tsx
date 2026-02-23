/**
 * ✨ ETERNAL VOW ✨
 * Premium Wedding Invitation Template
 * Next.js App Router + Tailwind CSS
 * Mobile-First | Luxury | Production-Ready
 */

'use client'

import React, {
  useEffect,
  useState,
  Fragment,
} from 'react'

/* -------------------------------------------------------------------------- */
/*                               GLOBAL CONFIG                                */
/* -------------------------------------------------------------------------- */

const IMAGE_URL = 'http://localhost:3005/assets/img/2149043983.jpg'

const WEDDING_DATE = new Date('2026-06-20T09:00:00')

/* -------------------------------------------------------------------------- */
/*                               TYPE DEFINITIONS                              */
/* -------------------------------------------------------------------------- */

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  isBefore: boolean
  isToday: boolean
  isAfter: boolean
}

interface NavItem {
  id: string
  label: string
}

interface GalleryImage {
  id: number
  src: string
  alt: string
}

interface TimelineItem {
  id: number
  title: string
  description: string
  date: string
}

interface FAQItem {
  id: number
  question: string
  answer: string
}

interface RSVPFormState {
  name: string
  attendance: 'yes' | 'no' | ''
  guests: number
  message: string
}

interface CarouselState {
  index: number
  isAnimating: boolean
}

/* -------------------------------------------------------------------------- */
/*                               CUSTOM HOOKS                                  */
/* -------------------------------------------------------------------------- */

function useCountdown(targetDate: Date): CountdownTime {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isBefore: true,
    isToday: false,
    isAfter: false,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const diff = target - now

      const isBefore = diff > 0
      const isAfter = diff < -86400000
      const isToday = diff <= 86400000 && diff >= 0

      const absDiff = Math.abs(diff)

      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((absDiff / (1000 * 60)) % 60)
      const seconds = Math.floor((absDiff / 1000) % 60)

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isBefore,
        isToday,
        isAfter,
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return timeLeft
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

/* -------------------------------------------------------------------------- */
/*                               DUMMY DATA                                    */
/* -------------------------------------------------------------------------- */

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Home' },
  { id: 'couple', label: 'Couple' },
  { id: 'event', label: 'Event' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'story', label: 'Story' },
  { id: 'rsvp', label: 'RSVP' },
  { id: 'gift', label: 'Gift' },
  { id: 'faq', label: 'FAQ' },
]

const GALLERY_IMAGES: GalleryImage[] = Array.from({ length: 12 }).map(
  (_, i) => ({
    id: i + 1,
    src: IMAGE_URL,
    alt: `Gallery Image ${i + 1}`,
  })
)

const STORY_TIMELINE: TimelineItem[] = [
  {
    id: 1,
    title: 'First Encounter',
    description:
      'A brief moment that unknowingly became the start of a lifetime journey.',
    date: '2018',
  },
  {
    id: 2,
    title: 'First Promise',
    description:
      'Two hearts aligned, choosing each other in the chaos of the world.',
    date: '2019',
  },
  {
    id: 3,
    title: 'The Proposal',
    description:
      'Under the stars, a question was asked, and a forever was born.',
    date: '2024',
  },
  {
    id: 4,
    title: 'The Wedding Day',
    description:
      'A sacred union witnessed by love, family, and divine grace.',
    date: '2026',
  },
]

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 1,
    question: 'What time should guests arrive?',
    answer:
      'We recommend arriving at least 30 minutes before the ceremony begins.',
  },
  {
    id: 2,
    question: 'Is there a dress code?',
    answer:
      'Elegant formal attire. Please avoid wearing white or ivory colors.',
  },
  {
    id: 3,
    question: 'Can I bring additional guests?',
    answer:
      'Please confirm the number of guests through the RSVP form provided.',
  },
]

/* -------------------------------------------------------------------------- */
/*                            UTILITY FUNCTIONS                                */
/* -------------------------------------------------------------------------- */

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

function smoothScrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* -------------------------------------------------------------------------- */
/*                         OPENING SCREEN OVERLAY                               */
/* -------------------------------------------------------------------------- */

const OpeningScreen: React.FC<{
  guestName: string
  onOpen: () => void
}> = ({ guestName, onOpen }) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-100',
        'flex items-center justify-center',
        'bg-linear-to-br from-[#1a1a1a] via-[#111] to-black',
        'transition-opacity duration-1000'
      )}
    >
      <div className="relative text-center px-6">
        <div className="absolute inset-0 blur-3xl opacity-30 bg-linear-to-r from-amber-500 to-pink-500 rounded-full" />

        <h1 className="relative z-10 font-serif text-4xl md:text-6xl text-amber-300 tracking-wide mb-4">
          Alexander & Isabella
        </h1>

        <p className="relative z-10 text-sm uppercase tracking-[0.3em] text-neutral-300 mb-8">
          June 20, 2026
        </p>

        <p className="relative z-10 text-neutral-400 mb-10">
          Dear <span className="text-amber-400">{guestName}</span>
        </p>

        <button
          onClick={onOpen}
          className={cn(
            'relative z-10 px-10 py-4 rounded-full',
            'bg-linear-to-r from-amber-500 to-pink-500',
            'text-black font-semibold tracking-wide',
            'transition-all duration-500',
            'hover:scale-105 hover:shadow-[0_0_40px_rgba(255,191,0,0.6)]'
          )}
        >
          Open Invitation
        </button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                           STICKY HEADER NAV                                  */
/* -------------------------------------------------------------------------- */

const StickyHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50',
        'transition-all duration-500',
        scrolled
          ? 'backdrop-blur-xl bg-black/40 shadow-lg'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <span className="font-serif text-amber-400 tracking-widest">
          Eternal Vow
        </span>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <li
              key={item.id}
              className="text-sm uppercase tracking-widest text-neutral-300 cursor-pointer hover:text-amber-400 transition"
              onClick={() => smoothScrollTo(item.id)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*                              MAIN PAGE                                       */
/* -------------------------------------------------------------------------- */

export default function Page() {
  const [opened, setOpened] = useState(false)

  useLockBodyScroll(!opened)

  return (
    <Fragment>
      {!opened && (
        <OpeningScreen
          guestName="Mr. & Mrs. Smith"
          onOpen={() => setOpened(true)}
        />
      )}

      <StickyHeader />

      <main className="min-h-screen bg-[#0b0b0b] text-neutral-200 overflow-x-hidden">
        <HeroSection />
        <CoupleSection />
        <EventSection />
        <GalleryCarousel />
        <StorySection />
        <RSVPSection />
        <GiftSection />
        <FAQSection />
        <Footer />
      </main>
    </Fragment>
  )
}

/* -------------------------------------------------------------------------- */
/*                              HERO SECTION                                   */
/* -------------------------------------------------------------------------- */

const HERO_BACKGROUNDS: string[] = [
  IMAGE_URL,
  IMAGE_URL,
  IMAGE_URL,
]

const HeroSection: React.FC = () => {
  const countdown = useCountdown(WEDDING_DATE)
  const [bgIndex, setBgIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Carousel */}
      {HERO_BACKGROUNDS.map((bg, index) => (
        <div
          key={index}
          className={cn(
            'absolute inset-0 transition-opacity duration-2000',
            index === bgIndex ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-[#0b0b0b]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="font-serif text-5xl md:text-7xl tracking-wide text-amber-300 mb-6 animate-fadeIn">
          Alexander <span className="text-neutral-200">&</span> Isabella
        </h1>

        <p className="uppercase tracking-[0.35em] text-sm text-neutral-300 mb-10">
          We Are Getting Married
        </p>

        <CountdownDisplay {...countdown} />

        <button
          onClick={() => smoothScrollTo('couple')}
          className="mt-14 px-10 py-4 rounded-full border border-amber-400/40 text-amber-300 tracking-widest text-sm uppercase hover:bg-amber-400 hover:text-black transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,191,0,0.6)]"
        >
          View Invitation
        </button>
      </div>

      {/* Decorative Divider */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-px h-20 bg-linear-to-b from-amber-400 to-transparent animate-pulse" />
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                           COUNTDOWN DISPLAY                                  */
/* -------------------------------------------------------------------------- */

const CountdownDisplay: React.FC<CountdownTime> = ({
  days,
  hours,
  minutes,
  seconds,
  isBefore,
  isToday,
  isAfter,
}) => {
  if (isAfter) {
    return (
      <p className="text-lg text-amber-300 tracking-widest animate-fadeIn">
        Thank You For Celebrating With Us
      </p>
    )
  }

  if (isToday) {
    return (
      <p className="text-xl text-amber-400 tracking-[0.4em] animate-pulse">
        TODAY IS THE DAY
      </p>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
      {[
        { label: 'Days', value: days },
        { label: 'Hours', value: hours },
        { label: 'Minutes', value: minutes },
        { label: 'Seconds', value: seconds },
      ].map((item) => (
        <div
          key={item.label}
          className="bg-black/40 backdrop-blur-md rounded-xl py-4 border border-white/10 shadow-lg hover:shadow-amber-500/30 transition"
        >
          <div className="text-2xl md:text-3xl font-semibold text-amber-300">
            {item.value}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                         BRIDE & GROOM SECTION                                 */
/* -------------------------------------------------------------------------- */

const CoupleSection: React.FC = () => {
  return (
    <section
      id="couple"
      className="relative py-32 px-6 bg-[#0b0b0b]"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {[
          {
            name: 'Alexander William',
            role: 'The Groom',
          },
          {
            name: 'Isabella Rose',
            role: 'The Bride',
          },
        ].map((person, index) => (
          <div
            key={person.name}
            className={cn(
              'relative group',
              index % 2 === 1 && 'md:translate-y-20'
            )}
          >
            <div className="absolute inset-0 bg-linear-to-br from-amber-500/20 to-pink-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition" />

            <div className="relative bg-black/50 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              <img
                src={IMAGE_URL}
                alt={person.name}
                className="w-full h-105 object-cover grayscale group-hover:grayscale-0 transition duration-700"
              />

              <div className="p-8 text-center">
                <h3 className="font-serif text-3xl text-amber-300 mb-2">
                  {person.name}
                </h3>
                <p className="uppercase tracking-[0.3em] text-xs text-neutral-400">
                  {person.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                           EVENT SECTION                                      */
/* -------------------------------------------------------------------------- */

interface WeddingEvent {
  id: number
  title: string
  subtitle: string
  date: string
  time: string
  venue: string
  description?: string
}

const WEDDING_EVENTS: WeddingEvent[] = [
  {
    id: 1,
    title: 'Wedding Blessing',
    subtitle: 'Holy Matrimony',
    date: 'Saturday, June 20, 2026',
    time: '09:00 AM – 11:00 AM',
    venue: 'St. Royal Cathedral, Jakarta',
    description:
      'A sacred ceremony to bless the union of two souls before God.',
  },
  {
    id: 2,
    title: 'Reception',
    subtitle: 'Traditional Celebration',
    date: 'Saturday, June 20, 2026',
    time: '18:30 PM – Finish',
    venue: 'Grand Royal Hall, Jakarta',
    description:
      'A joyful evening celebrating love, family, and togetherness.',
  },
]

const EventSection: React.FC = () => {
  return (
    <section
      id="event"
      className="relative py-32 px-6 bg-linear-to-b from-[#0b0b0b] to-black"
    >
      {/* Section Header */}
      <div className="max-w-5xl mx-auto text-center mb-20">
        <h2 className="font-serif text-4xl md:text-5xl text-amber-300 mb-4">
          Wedding Events
        </h2>
        <p className="text-neutral-400 tracking-wide">
          A day filled with sacred vows and joyful celebration
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        {/* Event Cards */}
        <div className="space-y-10">
          {WEDDING_EVENTS.map((event) => (
            <div
              key={event.id}
              className="relative group bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl transition hover:shadow-amber-500/30"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition bg-linear-to-br from-amber-500/10 to-pink-500/10 blur-xl" />

              <div className="relative">
                <span className="text-xs uppercase tracking-[0.3em] text-amber-400">
                  {event.subtitle}
                </span>

                <h3 className="text-2xl font-serif text-amber-300 mt-2 mb-4">
                  {event.title}
                </h3>

                <div className="space-y-2 text-neutral-400 leading-relaxed">
                  <p>
                    <span className="text-neutral-300">Date:</span>{' '}
                    {event.date}
                  </p>
                  <p>
                    <span className="text-neutral-300">Time:</span>{' '}
                    {event.time}
                  </p>
                  <p>
                    <span className="text-neutral-300">Venue:</span>{' '}
                    {event.venue}
                  </p>
                </div>

                {event.description && (
                  <p className="mt-4 text-sm text-neutral-500 leading-relaxed">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <iframe
            title="Google Maps"
            src="https://maps.google.com/maps?q=jakarta&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-105 grayscale hover:grayscale-0 transition duration-700"
          />
          <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/60 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                        STORY TIMELINE SECTION                                 */
/* -------------------------------------------------------------------------- */

const StorySection: React.FC = () => {
  return (
    <section
      id="story"
      className="relative py-32 px-6 bg-[#0b0b0b]"
    >
      <div className="max-w-4xl mx-auto mb-20 text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-amber-300 mb-4">
          Our Story
        </h2>
        <p className="text-neutral-400">
          Every love story is beautiful, but ours is our favorite
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-linear-to-b from-amber-400 to-transparent" />

        {STORY_TIMELINE.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              'relative mb-16 flex items-center',
              index % 2 === 0
                ? 'justify-start md:pr-1/2'
                : 'justify-end md:pl-1/2'
            )}
          >
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-md shadow-lg hover:shadow-amber-500/30 transition">
              <span className="text-xs tracking-widest text-amber-400">
                {item.date}
              </span>
              <h4 className="text-xl text-amber-300 mt-2 mb-2">
                {item.title}
              </h4>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                         GALLERY CAROUSEL SECTION                             */
/* -------------------------------------------------------------------------- */

const GalleryCarousel: React.FC = () => {
  const [state, setState] = useState<CarouselState>({
    index: 0,
    isAnimating: false,
  })

  const total = GALLERY_IMAGES.length

  const next = () => {
    if (state.isAnimating) return
    setState({ index: (state.index + 1) % total, isAnimating: true })
    setTimeout(() => setState((s) => ({ ...s, isAnimating: false })), 600)
  }

  const prev = () => {
    if (state.isAnimating) return
    setState({
      index: (state.index - 1 + total) % total,
      isAnimating: true,
    })
    setTimeout(() => setState((s) => ({ ...s, isAnimating: false })), 600)
  }

  return (
    <section
      id="gallery"
      className="relative py-32 px-6 bg-linear-to-b from-black to-[#0b0b0b]"
    >
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="font-serif text-4xl md:text-5xl text-amber-300 mb-4">
          Gallery
        </h2>
        <p className="text-neutral-400">
          A glimpse of our journey together
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${state.index * 100}%)`,
          }}
        >
          {GALLERY_IMAGES.map((img) => (
            <img
              key={img.id}
              src={img.src}
              alt={img.alt}
              className="min-w-full h-105 md:h-130 object-cover"
            />
          ))}
        </div>

        {/* Controls */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-amber-300 hover:bg-amber-400 hover:text-black transition"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-amber-300 hover:bg-amber-400 hover:text-black transition"
        >
          ›
        </button>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                              RSVP SECTION                                    */
/* -------------------------------------------------------------------------- */

const RSVPSection: React.FC = () => {
  const [form, setForm] = useState<RSVPFormState>({
    name: '',
    attendance: '',
    guests: 1,
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const isValid =
    form.name.trim() !== '' && form.attendance !== ''

  const submit = () => {
    if (!isValid) return
    setSubmitted(true)
  }

  return (
    <section
      id="rsvp"
      className="relative py-32 px-6 bg-[#0b0b0b]"
    >
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="font-serif text-4xl md:text-5xl text-amber-300 mb-4">
          RSVP
        </h2>
        <p className="text-neutral-400">
          Kindly respond before the event
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-xl">
        {submitted ? (
          <div className="text-center text-amber-300 tracking-widest animate-fadeIn">
            Thank you for your response
          </div>
        ) : (
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-neutral-200 focus:outline-none focus:border-amber-400"
            />

            <select
              value={form.attendance}
              onChange={(e) =>
                setForm({
                  ...form,
                  attendance: e.target.value as any,
                })
              }
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-neutral-200"
            >
              <option value="">Will you attend?</option>
              <option value="yes">Yes, with pleasure</option>
              <option value="no">Sorry, cannot attend</option>
            </select>

            <input
              type="number"
              min={1}
              max={5}
              value={form.guests}
              onChange={(e) =>
                setForm({
                  ...form,
                  guests: Number(e.target.value),
                })
              }
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-neutral-200"
            />

            <textarea
              placeholder="Message for the couple"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-neutral-200 h-28"
            />

            <button
              onClick={submit}
              disabled={!isValid}
              className={cn(
                'w-full py-4 rounded-full tracking-widest uppercase transition',
                isValid
                  ? 'bg-linear-to-r from-amber-400 to-pink-500 text-black hover:shadow-[0_0_30px_rgba(255,191,0,0.6)]'
                  : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
              )}
            >
              Send RSVP
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                               GIFT SECTION                                  */
/* -------------------------------------------------------------------------- */

interface BankAccount {
  id: number
  bankName: string
  accountNumber: string
  accountHolder: string
}

interface WishlistItem {
  id: number
  name: string
  price: string
  quantity: number
  url: string
}

const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 1,
    bankName: 'BCA',
    accountNumber: '1234 5678 9012',
    accountHolder: 'Alexander William',
  },
  {
    id: 2,
    bankName: 'Mandiri',
    accountNumber: '9876 5432 1000',
    accountHolder: 'Alexander William',
  },
]

const WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: 1,
    name: 'Luxury Dinnerware Set',
    price: 'Rp 1.500.000',
    quantity: 1,
    url: 'https://www.tokopedia.com/',
  },
  {
    id: 2,
    name: 'Premium Bed Linen – King Size',
    price: 'Rp 2.200.000',
    quantity: 1,
    url: 'https://www.tokopedia.com/',
  },
  {
    id: 3,
    name: 'Decorative Crystal Vase',
    price: 'Rp 750.000',
    quantity: 2,
    url: 'https://www.tokopedia.com/',
  },
]

const SHIPPING_ADDRESS = `Jl. Mawar Indah No. 21 Jakarta Selatan DKI Jakarta 12345 Indonesia`

const GiftSection: React.FC = () => {
  return (
    <section
      id="gift"
      className="relative py-28 px-5 bg-linear-to-b from-[#0b0b0b] to-black"
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="font-serif text-4xl md:text-5xl text-amber-300 mb-5">
          Wedding Gift
        </h2>
        <p className="text-neutral-400 leading-relaxed text-sm md:text-base">
          Your presence means everything to us. Should you wish to bless us with
          a gift, we would receive it with sincere gratitude.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-14">
        {/* ================================================================ */}
        {/* BANK TRANSFER                                                     */}
        {/* ================================================================ */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10">
          <h3 className="font-serif text-2xl text-amber-300 mb-6 text-center md:text-left">
            Bank Transfer
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {BANK_ACCOUNTS.map((bank) => (
              <div
                key={bank.id}
                className="
                  relative overflow-hidden
                  bg-black/30
                  border border-white/10
                  rounded-2xl
                  px-6 py-5
                  transition
                  hover:border-amber-400/40
                "
              >
                <div className="flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-widest text-neutral-400">
                    {bank.bankName}
                  </p>

                  <p className="text-amber-300 text-lg tracking-widest">
                    {bank.accountNumber}
                  </p>

                  <p className="text-neutral-400 text-sm">
                    a/n {bank.accountHolder}
                  </p>
                </div>

                {/* Decorative Glow */}
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-linear-to-r from-amber-500/5 to-transparent" />
              </div>
            ))}
          </div>
        </div>

        {/* ================================================================ */}
        {/* WISHLIST                                                         */}
        {/* ================================================================ */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10">
          <h3 className="font-serif text-2xl text-amber-300 mb-3 text-center md:text-left">
            Gift Wishlist
          </h3>

          {/* Shipping Address */}
          <div className="mb-5 bg-black/30 border border-white/10 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">
              Shipping Address
            </p>
            <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
              {SHIPPING_ADDRESS}
            </p>
          </div>

          <p className="text-neutral-400 text-sm leading-relaxed mb-6">
            Below is a small wishlist as a reference. Please feel absolutely no
            obligation — your presence is already a precious gift.
          </p>

          {/* Wishlist Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WISHLIST_ITEMS.map((item) => (
              <div
                key={item.id}
                className="
                  bg-black/30
                  border border-white/10
                  rounded-2xl
                  p-5
                  transition
                  hover:border-amber-400/40
                  hover:shadow-[0_0_20px_rgba(255,191,0,0.2)]
                "
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-neutral-200 font-medium leading-snug mb-2">
                      {item.name}
                    </h4>

                    <div className="space-y-1 text-sm text-neutral-400">
                      <p>
                        <span className="text-neutral-300">Estimated Price:</span>{' '}
                        {item.price}
                      </p>
                      <p>
                        <span className="text-neutral-300">Requested:</span>{' '}
                        {item.quantity} unit
                      </p>
                    </div>
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      w-full
                      inline-flex items-center justify-center
                      px-6 py-3
                      rounded-full
                      border border-amber-400/40
                      text-amber-300
                      text-xs uppercase tracking-widest
                      transition
                      hover:bg-amber-400 hover:text-black
                    "
                  >
                    View Reference
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination (UI Only) */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-2">
              <button className="w-10 h-10 rounded-full bg-amber-400 text-black text-xs shadow-[0_0_20px_rgba(255,191,0,0.4)]">
                1
              </button>
              <button className="w-10 h-10 rounded-full border border-white/10 text-neutral-400 text-xs hover:border-amber-400/40 hover:text-amber-300 transition">
                2
              </button>
              <button className="w-10 h-10 rounded-full border border-white/10 text-neutral-400 text-xs hover:border-amber-400/40 hover:text-amber-300 transition">
                3
              </button>
              <span className="px-2 text-neutral-500 text-xs self-center">
                …
              </span>
              <button className="w-10 h-10 rounded-full border border-white/10 text-neutral-400 text-xs hover:border-amber-400/40 hover:text-amber-300 transition">
                8
              </button>
            </div>

            <div className="flex gap-4 w-full max-w-xs">
              <button className="flex-1 py-3 rounded-full border border-white/10 text-xs uppercase tracking-widest text-neutral-400 hover:border-amber-400/40 hover:text-amber-300 transition">
                Prev
              </button>
              <button className="flex-1 py-3 rounded-full border border-white/10 text-xs uppercase tracking-widest text-neutral-400 hover:border-amber-400/40 hover:text-amber-300 transition">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                              FAQ SECTION                                     */
/* -------------------------------------------------------------------------- */

const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <section
      id="faq"
      className="relative py-32 px-6 bg-[#0b0b0b]"
    >
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="font-serif text-4xl md:text-5xl text-amber-300 mb-4">
          FAQ
        </h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {FAQ_ITEMS.map((item) => {
          const open = openId === item.id
          return (
            <div
              key={item.id}
              className="border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenId(open ? null : item.id)
                }
                className="w-full flex justify-between items-center px-6 py-4 text-left"
              >
                <span className="text-neutral-200">
                  {item.question}
                </span>
                <span className="text-amber-300">
                  {open ? '−' : '+'}
                </span>
              </button>

              <div
                className={cn(
                  'px-6 overflow-hidden transition-all duration-500',
                  open ? 'max-h-40 py-4' : 'max-h-0'
                )}
              >
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                              FOOTER                                          */
/* -------------------------------------------------------------------------- */

const Footer: React.FC = () => {
  return (
    <footer className="py-16 px-6 bg-black border-t border-white/10">
      <div className="max-w-6xl mx-auto text-center space-y-6">
        <p className="font-serif text-amber-300 text-2xl tracking-widest">
          Alexander & Isabella
        </p>

        <ul className="flex flex-wrap justify-center gap-6 text-sm text-neutral-400">
          {NAV_ITEMS.map((item) => (
            <li
              key={item.id}
              onClick={() => smoothScrollTo(item.id)}
              className="cursor-pointer hover:text-amber-400 transition"
            >
              {item.label}
            </li>
          ))}
        </ul>

        <p className="text-xs text-neutral-600 tracking-widest">
          © 2026 Eternal Vow. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}