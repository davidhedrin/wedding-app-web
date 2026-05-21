"use client";

import { useLoading } from "@/components/loading/loading-context";
import Configs from "@/lib/config";
import { useSmartLink } from "@/lib/smart-link";
import { useEffect } from "react";

export default function ServicesPage() {
  const smartLink = useSmartLink();
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="pb-16">
      <div className='relative w-full h-[70vh] flex items-end justify-center text-center pb-20'>
        <div className="absolute -z-30 inset-0 bg-linear-to-b from-gray-800/25 to-gray-100 backdrop-blur-xs pointer-events-none" />

        <div className="absolute -z-30 top-16 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 lg:w-136 lg:h-136 bg-linear-to-r from-cyan-400/50 to-blue-600/50 blur-3xl rounded-full mix-blend-multiply" />
        <div className="absolute -z-30 bottom-10 left-0 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-linear-to-tr from-pink-400/50 to-rose-500/60 blur-3xl rounded-full mix-blend-multiply" />
        <div className="absolute -z-30 top-1/3 right-0 w-60 h-60 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-linear-to-bl from-violet-500/50 to-indigo-600/60 blur-3xl rounded-full mix-blend-multiply" />
        <div className="absolute -z-30 bottom-24 right-1/4 w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-linear-to-t from-amber-300/40 to-orange-500/50 blur-2xl rounded-full mix-blend-screen" />

        <div className="max-w-3xl px-4 xl:px-0 mx-auto text-center">
          <span className="text-pink-600 font-semibold uppercase tracking-widest">
            Our Services
          </span>

          <h2 className="mt-4 text-2xl md:text-4xl font-bold">
            Everything You Need
            <br />
            For Your Dream Invitation
          </h2>

          <p className="mt-6 text-gray-600 md:text-base leading-relaxed">
            Discover our wedding invitation services designed to make your special day even more memorable. From elegant digital invitations to fully customized designs, we create beautiful invitations that reflect your unique love story with style, creativity, and attention to detail.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className='max-w-5xl px-4 xl:px-0 mx-auto pb-20'>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-28">
          {[
            {
              title: "Lots of Templates",
              desc: "Choose from a wide collection of elegant and modern invitation for every event style.",
              color: "from-violet-500 to-purple-600",
              icon: "bx bx-layer",
            },
            {
              title: "Flexible Form",
              desc: "Easily input and customize all your event details through flexible invitation forms.",
              color: "from-cyan-500 to-blue-600",
              icon: "bx bx-edit-alt",
            },
            {
              title: "Event Scheduling",
              desc: "Organize multiple events with detailed schedules, times, and locations in one invitation.",
              color: "from-amber-400 to-orange-500",
              icon: "bx bx-time-five",
            },
            {
              title: "Online RSVP",
              desc: "Manage guest names and share personalized invitation links for each attendee easily.",
              color: "from-pink-500 to-rose-500",
              icon: "bx bx-calendar-check",
            },
            {
              title: "Photo Gallery",
              desc: "Showcase your best prewedding moments in stunning interactive galleries.",
              color: "from-violet-500 to-indigo-600",
              icon: "bx bx-photo-album",
            },
            {
              title: "Event Countdown",
              desc: "Build excitement with elegant countdown timers for your event day.",
              color: "from-orange-400 to-red-500",
              icon: "bx bx-timer",
            },
            {
              title: "Location & Maps",
              desc: "Help guests find your venue quickly with integrated maps and directions.",
              color: "from-teal-400 to-emerald-500",
              icon: "bx bx-map-alt",
            },
            {
              title: "Barcode Invitation",
              desc: "Provide seamless guest check-ins with unique QR code for efficient wedding experience.",
              color: "from-sky-500 to-cyan-600",
              icon: "bx bx-qr",
            },
            {
              title: "Send Gift",
              desc: "Allow guests to send wedding gifts bank transfers or curated wishlist features directly.",
              color: "from-emerald-500 to-teal-600",
              icon: "bx bx-gift",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-4xl border border-white/50 bg-white/70 backdrop-blur-xl p-8 shadow-xl hover:-translate-y-2 transition duration-300"
            >
              <div className="absolute top-3 right-3 opacity-8 group-hover:opacity-30 transition duration-300">
                <i className="bx bxs-badge-check text-9xl text-cyan-600"></i>
              </div>

              <div
                className={`w-12 h-12 rounded-2xl bg-linear-to-r ${item.color} flex items-center justify-center text-white text-2xl shadow-lg`}
              >
                <i className={`${item.icon} text-3xl text-white`}></i>
              </div>

              <h3 className="mt-4 font-bold">{item.title}</h3>

              <p className="md:text-base mt-1 text-gray-600 leading-relaxed">
                {item.desc}
              </p>

              <div className="absolute inset-0 opacity-100 transition duration-300 bg-linear-to-br from-white/0 to-cyan-200/50 pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/70 backdrop-blur-xl shadow-2xl p-8 sm:p-10">

          {/* Background Blur */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-violet-500/20 blur-3xl rounded-full" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 text-cyan-700 px-4 py-2 text-sm font-semibold">
              <i className="bx bx-star text-lg"></i>
              More Features & Services
            </div>

            <h2 className="mt-6 text-2xl md:text-4xl font-bold leading-tight text-gray-800">
              And Many More Services
              <br />
              For Every Special Event
            </h2>

            <p className="mt-5 text-gray-600 md:text-base leading-relaxed">
              Our platform is designed not only for weddings, but also for various
              special events such as engagements, birthdays, graduations, aqiqah,
              reunions, corporate events, and more. We continuously add modern
              features to help you create elegant and interactive invitations with
              ease.
            </p>

            {/* Event Categories */}
            <div className="mt-10 flex flex-wrap gap-4">
              {[
                "Wedding",
                "Engagement",
                "Birthday",
                "Graduation",
                "Aqiqah",
                "Corporate Event",
                "Anniversary",
                "Baby Shower",
                "Family Gathering",
              ].map((event, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-2xl border border-white/50 bg-white/80 px-5 py-3 shadow-md hover:-translate-y-1 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-red-200 to-red-500 flex items-center justify-center text-white">
                    <i className="bx bx-check text-lg"></i>
                  </div>

                  <span className="font-medium md:text-base text-gray-700">
                    {event}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="bg-gray-200 py-16 mb-20">
        <div className='max-w-5xl px-4 xl:px-0 mx-auto'>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop"
                alt="Wedding"
                className="rounded-4xl shadow-2xl"
              />

              <div className="absolute -bottom-8 -right-8 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
                <h3 className="text-4xl font-bold text-cyan-600">10K+</h3>
                <p className="text-gray-600 mt-2">Invitations Created</p>
              </div>
            </div>

            <div>
              <span className="text-violet-600 font-semibold uppercase tracking-widest">
                Why Choose Us
              </span>

              <h2 className="mt-5 text-2xl md:text-4xl font-bold leading-tight">
                Designed To Make
                <br />
                Your Event More Special
              </h2>

              <p className="mt-8 text-muted md:text-base leading-relaxed">
                We combine elegant design, modern technology, and user-friendly
                experiences to create digital invitations that leave lasting
                impressions on your guests.
              </p>

              <div className="mt-10 space-y-6">
                {[
                  "Elegant & modern invitation designs",
                  "Fast and easy customization process",
                  "Responsive on all devices",
                  "Interactive premium features",
                  "Affordable pricing for everyone",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center text-sm">
                      ✓
                    </div>

                    <p className="text-gray-700 md:text-base">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-5xl px-4 xl:px-0 mx-auto pb-16'>
        {/* CTA */}
        <div className="relative overflow-hidden rounded-[3rem] bg-linear-to-r from-slate-900 via-cyan-900 to-blue-900 p-12 sm:p-16 text-white">
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <img src="/assets/img/logo/wedlyvite-logo.png" className="h-14 w-auto" />
            </div>

            <h2 className="text-xl md:text-2xl font-bold leading-tight">
              Ready To Create
              <br />
              Your Dream Invitation?
            </h2>

            <p className="my-6 md:text-base text-gray-300 leading-relaxed">
              Start creating beautiful online invitations today and make your
              special moment unforgettable for everyone.
            </p>

            <a href="/catalog" onClick={() => smartLink("/catalog")} className="py-2 px-4 md:text-base rounded-lg bg-white text-slate-900 font-medium hover:scale-105 transition shadow-xl">
              Create Invitation Now
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}