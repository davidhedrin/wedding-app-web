"use client";

import { useLoading } from "@/components/loading/loading-context";
import TypingEffect from "@/components/ui/typing-text";
import Configs from "@/lib/config";
import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div>
      {/* Create Your Own */}
      <div className="relative h-screen w-full">
        <img src="/assets/img/2149043983.jpg" className="h-full w-full object-cover" alt="background" />

        <div className="absolute inset-0 bg-gradient-to-b from-gray-500/30 to-gray-100 backdrop-blur-xs pointer-events-none" />

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4 mt-12">
          <div className="inline-flex items-center space-x-1 bg-color-app-50 text-muted px-4 py-2 rounded-full text-sm font-medium mb-5">
            <i className='bx bx-check-shield text-lg'></i>
            <span>Trusted Digital Invitation Platform</span>
          </div>

          <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-snug">
            Create Your Own <br /> <span className="text-color-app px-3 py-0 bg-white/30"><TypingEffect texts={["Invitations"]} /></span> &nbsp; Easily
          </div>

          <p className="text-sm md:text-base text-muted mb-8 leading-relaxed max-w-2xl mx-auto">
            A modern platform for creating elegant, personalized, and easily shareable digital invitations for weddings, birthdays, parties, and other events.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
              Try {Configs.tryDays} Days <i className='bx bx-rocket bx-tada text-lg'></i>
            </button>

            <button type="button" className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-blue-600 text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:outline-hidden focus:border-blue-500 focus:text-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-blue-500 dark:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400">
              Find Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-muted mb-1">1000+</div>
              <div className="text-muted">Pasangan Bahagia</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-muted mb-1">50+</div>
              <div className="text-muted">Template Premium</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-muted mb-1">24/7</div>
              <div className="text-muted">Customer Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* What Makes Your Invitation Special */}
      <div className="max-w-5xl px-4 xl:px-0 mx-auto py-16">
        <div className="text-center mb-4">
          <div className="text-xl md:text-2xl font-bold">
            What Makes Your Invitation <span className="text-color-app">Special</span>
          </div>
          <p className="text-sm md:text-base text-muted max-w-2xl mx-auto">
            Everything you need to create memorable invitations for your important events
          </p>
        </div>

        <div className="flex justify-end mb-2">
          <Link href="/" className="text-blue-500 inline-flex items-center gap-x-1 text-sm font-medium">More Services <i className='bx bx-right-arrow-alt text-lg'></i></Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {
            [
              { icon: "bx bx-happy-heart-eyes", name: "Lots of Templates", desc: "Choose an elegant template according to your wishes." },
              { icon: "bx bx-bell", name: "RSVP Integration", desc: "Attendance confirmation integrated with dashboard." },
              { icon: "bx bx-qr", name: "Barcode Invitations", desc: "Invitations with unique barcodes for each guest." },
              { icon: "bx bx-bell-minus", name: "Event Scheduling", desc: "Prepare for important events with an event schedule." },
            ].map((x, i) => (
              <div key={i} className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-3 text-center group hover:shadow-medium transition-smooth hover-lift border-border-soft">
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                  <i className={`${x.icon} text-4xl text-blue-500`}></i>
                </div>
                <div className="text-muted font-semibold mb-1">
                  {x.name}
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  {x.desc}
                </p>
              </div>
            ))
          }
        </div>
      </div>

      {/* What Medlyvite User's Say */}
      <div className="bg-gray-200 py-16">
        <div className="max-w-5xl px-4 xl:px-0 mx-auto">
          <div className="text-center mb-8">
            <div className="text-xl md:text-2xl font-bold">
              What <span className="text-color-app">Medlyvite</span> User's Say
            </div>
            <p className="text-sm md:text-base text-muted max-w-2xl mx-auto">
              Thousands of users have trusted Medlyvite for their special events and moments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {
              [
                { name: "Maya & Ardi", quote: "Platform yang sangat mudah digunakan! Undangan kami jadi terlihat profesional dan elegant." },
                { name: "Caroline & Budi", quote: "Tim support yang responsif dan template yang benar-benar cantik. Highly recommended!" },
                { name: "Jonatan", quote: "Fitur RSVP sangat membantu untuk tracking tamu. Undangannya juga mobile-friendly!" },
              ].map((x, i) => (
                <div key={i} className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-3 group hover:shadow-medium transition-smooth hover-lift border-border-soft">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-soft rounded-full overflow-hidden">
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <i className='bx bx-donate-heart text-muted text-3xl'></i>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{x.name}</div>
                        <div className="flex text-accent-primary">
                          <i className='bx bxs-star text-base text-color-app fill-current'></i>
                          <i className='bx bxs-star text-base text-color-app fill-current'></i>
                          <i className='bx bxs-star text-base text-color-app fill-current'></i>
                          <i className='bx bxs-star text-base text-color-app fill-current'></i>
                          <i className='bx bxs-star text-base text-color-app fill-current'></i>
                        </div>
                      </div>
                    </div>
                    <i className='bx bxs-quote-right text-color-app text-4xl mb-2'></i>
                  </div>
                  <p className="text-muted leading-relaxed">
                    "{x.quote}"
                  </p>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div className="max-w-5xl px-4 xl:px-0 mx-auto py-16">
        <div className="text-center mb-8">
          <div className="text-xl md:text-2xl font-bold">
            Just Doing <span className="text-color-app">4-Easy</span> Steps
          </div>
          <p className="text-sm md:text-base text-muted max-w-2xl mx-auto">
            A simple and intuitive process to create your dream invitations
          </p>
        </div>

        {/* Just Doing 4-Easy Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { step: "01", title: "Select Templates", desc: "Browse and select your favorite template" },
              { step: "02", title: "Customization", desc: "Form add invitation details and photos" },
              { step: "03", title: "Preview", desc: "View preview results and make adjustments" },
              { step: "04", title: "Share Invitation", desc: "Invitations ready to be distributed to guests" }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2 group">
                <div className="w-11 h-11 bg-blue-500 rounded-full text-white flex items-center justify-center text-accent-foreground font-bold text-lg group-hover:scale-105 transition-smooth shadow-accent">
                  {item.step}
                </div>
                <i className='bx bx-minus'></i>
                <div className="flex-1">
                  <div className="font-semibold">
                    {item.title}
                  </div>
                  <p className="text-muted">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ready to Create Your Dream Invitation */}
        <div className="text-center mt-24 space-y-8">
          <div className="flex justify-center mb-6">
            <img src="/assets/img/logo/wedlyvite-logo.png" className="h-14 w-auto" />
          </div>

          <div>
            <div className="text-xl md:text-2xl font-bold">
              Ready to Create Your Dream Invitation?
            </div>
            <p className="text-sm md:text-base text-muted max-w-xl mx-auto">
              Join thousands of users who have made their special moments unforgettable with Wedlyvite
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
              Create Invitation Now
            </button>

            <button type="button" className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-blue-600 text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:outline-hidden focus:border-blue-500 focus:text-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-blue-500 dark:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}