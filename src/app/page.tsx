"use client";

import { useLoading } from "@/components/loading/loading-context";
import TypingEffect from "@/components/ui/typing-text";
import Configs from "@/lib/config";
import { useSmartLink } from "@/lib/smart-link";
import { useEffect } from "react";

export default function Page() {
  const smartLink = useSmartLink();
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div>
      {/* Create Your Own */}
      <div className="relative h-screen w-full">
        <img src="/assets/img/2149043983.jpg" className="h-full w-full object-cover" alt="background" />
        <div className="absolute inset-0 bg-linear-to-b from-gray-500/30 to-gray-100 backdrop-blur-xs pointer-events-none" />

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4 mt-12">
          <div className="inline-flex items-center space-x-1 bg-color-app-50 text-muted px-4 py-2 rounded-full text-sm font-medium mb-10">
            <i className='bx bx-check-shield text-lg'></i>
            <span>Trusted Digital Invitation Platform</span>
          </div>

          <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 leading-snug">
            Create Your Own <br /> <span className="text-color-app px-3 py-0 bg-black/25"><TypingEffect texts={["Invitations"]} /></span>&nbsp; Easily
          </div>

          <p className="md:text-base text-muted mb-12 leading-relaxed max-w-2xl mx-auto">
            A modern platform for creating elegant, personalized, and easily shareable digital invitations for weddings, birthdays, parties, and other events.
          </p>

          <div className="flex gap-4 justify-center mb-14">
            <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 md:text-base font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
              Try {Configs.tryDays} Days <i className='bx bx-rocket bx-tada text-lg'></i>
            </button>

            <a href="/catalog" onClick={() => smartLink("/catalog")} type="button" className="py-2 px-3 inline-flex items-center gap-x-1 md:text-base font-medium rounded-lg border border-blue-600 text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:outline-hidden focus:border-blue-500 focus:text-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-blue-500 dark:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400">
              Find Template
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-muted mb-1">100+</div>
              <div className="text-muted">Happy Couples</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-muted mb-1">30+</div>
              <div className="text-muted">Premium Templates</div>
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
          <p className="md:text-base text-muted max-w-2xl mx-auto">
            Everything you need to create memorable invitations for your important events
          </p>
        </div>

        <div className="flex justify-end mb-2">
          <a href="/services" onClick={() => smartLink("/services")} className="text-blue-500 inline-flex items-center gap-x-1 md:text-base font-medium">More Services <i className='bx bx-right-arrow-alt text-lg'></i></a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {
            [
              { icon: "bx bx-layer", name: "Lots of Templates", desc: "Choose an elegant template according to your wishes." },
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
                <p className="text-muted md:text-base leading-relaxed">
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
            <p className="md:text-base text-muted max-w-2xl mx-auto">
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
                  <p className="text-muted md:text-base leading-relaxed">
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
          <p className="md:text-base text-muted max-w-2xl mx-auto">
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
                  <p className="md:text-base text-muted">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-200 py-16">
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
                Your Wedding More Special
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

      <div className="max-w-5xl px-4 xl:px-0 mx-auto py-16">
        <div className="mb-20">
          {/* Heading */}
          <div className="text-center mb-14">
            <div className="text-xl md:text-2xl font-bold mb-2">
              Frequently Asked <span className="text-color-app">Questions</span>
            </div>

            <p className="md:text-base text-muted max-w-2xl mx-auto">
              Everything you need to know about creating and sharing digital invitations with Wedlyvite.
            </p>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {[
              {
                question: "How do I create a digital invitation?",
                answer:
                  "Simply choose your favorite template, customize your event details, upload photos, and publish your invitation instantly."
              },
              {
                question: "Can I personalize my invitation content?",
                answer:
                  "Yes, you can easily fill in your own event details through the dashboard, including names, event schedules, locations, photo galleries, background music, RSVP settings, and other personal information."
              },
              {
                question: "Does Wedlyvite support RSVP features?",
                answer:
                  "Absolutely. Guests can confirm attendance directly through your invitation page and all responses are automatically recorded."
              },
              {
                question: "Can invitations be opened on mobile devices?",
                answer:
                  "Yes. All invitation templates are fully responsive and optimized for smartphones, tablets, and desktop devices."
              },
              {
                question: "How long does it take to publish an invitation?",
                answer:
                  "Only a few minutes. After completing the customization process, your invitation can immediately be shared with guests."
              },
              {
                question: "Do you provide customer support?",
                answer:
                  "Yes, our support team is available every day to help you with technical issues, customization, and other questions."
              }
            ].map((item, index) => (
              <details
                key={index}
                className="group overflow-hidden rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(59,130,246,0.10)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <summary className="list-none cursor-pointer">
                  <div className="flex items-center justify-between gap-4 px-5 py-4">

                    {/* Left */}
                    <div className="flex items-center gap-4">
                      <div className="min-w-11 w-11 h-11 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <i className='bx bx-help-circle text-white text-2xl'></i>
                      </div>

                      <div>
                        <div className="font-semibold text-base md:text-lg text-slate-800 leading-relaxed">
                          {item.question}
                        </div>

                        <div className="text-sm text-muted">
                          Click to view answer
                        </div>
                      </div>
                    </div>

                    {/* Right Icon */}
                    <div
                      className="min-w-10 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:rotate-180 group-open:bg-blue-500 group-open:text-white transition-all duration-300">
                      <i className='bx bx-chevron-down text-2xl'></i>
                    </div>

                  </div>
                </summary>

                {/* Content */}
                <div
                  className="border-t border-slate-100 px-6 pb-6 pt-4 text-muted leading-relaxed bg-linear-to-b from-transparent to-slate-50/60">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Ready to Create Your Dream Invitation */}
        <div className="text-center space-y-8">
          <div className="flex justify-center mb-6">
            <img src="/assets/img/logo/wedlyvite-logo.png" className="h-14 w-auto" />
          </div>

          <div>
            <div className="text-xl md:text-2xl font-bold">
              Ready to Create Your Dream Invitation?
            </div>
            <p className="md:text-base text-muted max-w-xl mx-auto">
              Join thousands of users who have made their special moments unforgettable with Wedlyvite
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <a href="/catalog" onClick={() => smartLink("/catalog")} className="py-2 px-3 inline-flex items-center gap-x-2 md:text-base font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
              Create Invitation Now
            </a>

            <a href="/about-us" onClick={() => smartLink("/about-us")} className="py-2 px-3 inline-flex items-center gap-x-1 md:text-base font-medium rounded-lg border border-blue-600 text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:outline-hidden focus:border-blue-500 focus:text-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-blue-500 dark:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}