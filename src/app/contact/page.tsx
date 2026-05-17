"use client";

import { useLoading } from "@/components/loading/loading-context";
import { delay, showConfirm, toast } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);

  const [loadingForm, setLoadingForm] = useState(false);
  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const confirmed = await showConfirm({
      title: 'Submit Confirmation?',
      message: 'Are you sure you want to submit this form? Please double-check before proceeding!',
      confirmText: 'Yes, Submit',
      cancelText: 'No, Go Back',
      icon: 'bx bx-error bx-tada text-blue-500'
    });
    if (!confirmed) return;

    setLoadingForm(true);
    await delay(2500);
    setLoadingForm(false);

    toast({
      type: "success",
      title: "Submit successfully",
      message: "Your message has been send successfully completed"
    });
    form.reset();
  };

  return (
    <div className="pb-16">
      <div className='relative w-full h-[70vh] flex items-end justify-center text-center pb-24'>
        <div className="absolute -z-30 inset-0 bg-linear-to-b from-gray-800/25 to-gray-100 backdrop-blur-xs pointer-events-none" />

        <div className="absolute -z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        h-112.5 sm:h-150 lg:w-175 lg:h-175
        bg-linear-to-tr from-teal-400/60 to-blue-700/60 blur-3xl rounded-full mix-blend-multiply" />

        <div className="absolute -z-30 top-24 left-10 w-45 h-45 sm:w-55 sm:h-55 lg:w-62.5 lg:h-62.5
        bg-linear-to-bl from-yellow-500/50 to-pink-500/70 blur-3xl rounded-full mix-blend-multiply" />

        <div className="absolute -z-30 top-40 right-5 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72
        bg-linear-to-t from-purple-600/50 to-red-500/50 blur-3xl rounded-full mix-blend-multiply" />

        {/* <div className='max-w-3xl px-4 xl:px-0 mx-auto text-center'>
          <h1 className="text-2xl md:text-4xl font-bold mb-3 drop-shadow-lg">
            Contact Us
          </h1>
          <p className="md:text-base mb-8">
            Have questions about our services? Our team is ready to help you create your dream wedding invitations.
          </p>
        </div> */}

        <div className="max-w-3xl px-4 xl:px-0 mx-auto text-center">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-x-2 bg-blue-50/60 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <i className='bx bx-message-rounded-dots text-lg'></i>
              Contact Wedlyvite
            </div>

            <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-6">
              Let's Make Your <span className="text-color-app">Special Event</span> More Memorable
            </h1>

            <p className="text-muted md:text-base leading-relaxed max-w-2xl mx-auto">
              Have questions about digital invitations, templates, RSVP systems,
              or custom event solutions? Our team is ready to help you anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-5xl px-4 xl:px-0 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
          {/* Left Content */}
          <div className="col-span-12 md:col-span-5 space-y-6">
            <div>
              <div className="text-xl font-bold mb-1">
                Get In Touch
              </div>

              <p className="text-muted md:text-base leading-relaxed">
                We would love to hear from you. Whether you need support,
                partnership opportunities, or assistance creating your dream
                invitation, our team is here to help.
              </p>
            </div>

            <div className="space-y-5">

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-2xs hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <i className='bx bx-envelope text-2xl text-blue-500'></i>
                </div>

                <div>
                  <div className="font-semibold mb-1">Email Address</div>
                  <p className="text-muted text-sm">
                    support@wedlyvite.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-2xs hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <i className='bx bx-phone-call text-2xl text-purple-500'></i>
                </div>

                <div>
                  <div className="font-semibold mb-1">Phone Number</div>
                  <p className="text-muted text-sm">
                    +62 812-3456-7890
                  </p>
                </div>
              </div>

              {/* <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-2xs hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center shrink-0">
                    <i className='bx bx-map text-2xl text-pink-500'></i>
                  </div>

                  <div>
                    <div className="font-semibold mb-1">Office Location</div>
                    <p className="text-muted text-sm">
                      Bandung, West Java, Indonesia
                    </p>
                  </div>
                </div> */}

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-2xs hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <i className='bx bx-time text-2xl text-amber-500'></i>
                </div>

                <div>
                  <div className="font-semibold mb-1">Working Hours</div>
                  <p className="text-muted text-sm">
                    Monday - Sunday • 08:00 AM - 10:00 PM
                  </p>
                </div>
              </div>

            </div>

            {/* Social */}
            <div className="pt-2">
              <div className="font-semibold mb-3">
                Follow Our Social Media
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-11 h-11 rounded-xl shadow-md bg-white flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                >
                  <i className='bx bxl-instagram text-xl'></i>
                </a>

                <a
                  href="#"
                  className="w-11 h-11 rounded-xl shadow-md bg-white flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all"
                >
                  <i className='bx bxl-twitter text-xl'></i>
                </a>

                <a
                  href="#"
                  className="w-11 h-11 rounded-xl shadow-md bg-white flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all"
                >
                  <i className='bx bxl-facebook text-xl'></i>
                </a>

                <a
                  href="#"
                  className="w-11 h-11 rounded-xl shadow-md bg-white flex items-center justify-center hover:bg-green-500 hover:text-white transition-all"
                >
                  <i className='bx bxl-whatsapp text-xl'></i>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-span-12 md:col-span-7 bg-white rounded-3xl shadow-xl p-6">
            <div className="mb-4">
              <div className="text-xl font-bold">
                Send Us Message
              </div>

              <p className="text-muted md:text-base">
                Fill out the form below and our team will contact you shortly.
              </p>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium mb-1 block">
                    Full Name
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-medium mb-1 block">
                    Email Address
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-medium mb-1 block">
                  Subject
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                />
              </div>

              <div>
                <label className="font-medium mb-1 block">
                  Message
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows={3}
                  placeholder="Write your message here..."
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loadingForm}
                className={`
                    mt-2 w-full py-2 px-4 rounded-xl
                    text-white font-medium
                    inline-flex items-center justify-center gap-x-2
                    transition-all duration-200

                    ${loadingForm
                    ? "bg-blue-400 cursor-not-allowed opacity-70"
                    : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99]"
                  }
                  `}
              >
                {
                  loadingForm ? "Sending..." : <>
                    Send Message
                    <i className='bx bx-send text-lg'></i>
                  </>
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
