"use client";

import { useLoading } from "@/components/loading/loading-context";
import Configs from "@/lib/config";
import { useEffect } from "react";

export default function AboutUsPage() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="pb-16">
      <div className='relative w-full h-[50vh] flex items-end justify-center text-center pb-14'>
        <div className="absolute -z-30 inset-0 bg-gradient-to-b from-gray-800/25 to-gray-100 backdrop-blur-xs pointer-events-none" />

        <div className="absolute -z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] lg:w-[650px] lg:h-[650px]
          bg-gradient-to-t from-red-500/40 to-pink-400/60 blur-3xl rounded-md mix-blend-multiply
          animate-floating"
        />
        <div className="absolute -z-30 top-20 left-20 w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[300px] lg:h-[300px]
        bg-pink-400 blur-3xl rounded-md mix-blend-multiply animate-floating"
        />
        <div className="absolute -z-30 top-40 right-10 w-60 h-60 md:w-96 md:h-96 rounded-full bg-indigo-400/70 blur-3xl" />

        <div className='max-w-3xl px-4 xl:px-0 mx-auto text-center'>
          <h1 className="text-2xl md:text-4xl font-bold mb-3 drop-shadow-lg">
            Welcome to Our Journey
          </h1>
          <p className="md:text-base mb-8">
            At {Configs.app_name}, we believe every celebration deserves a personal touch. Our platform lets you easily create stunning,
            customizable digital invitations for weddings, birthdays, and other special events, helps you share your moments effortlessly
            and make them truly unforgettable.
          </p>
        </div>
      </div>

      <div className='max-w-5xl px-4 xl:px-0 mx-auto'>
        <div className="grid grid-cols-12 gap-8 md:gap-10 py-16">
          <div className="col-span-12 md:col-span-8 space-y-4 md:space-y-3">
            <div className="text-xl md:text-2xl font-semibold text-foreground">
              Our Story
            </div>
            <div className="space-y-2 leading-relaxed text-justify text-base">
              <p>
                {Configs.app_name} was born from our personal experience planning important and historic events.
                We learned how complex the process of creating invitations that fit your vision and budget can be.
              </p>
              <p>
                With this platform, we want to provide a solution that allows every couple, individual or group to
                create beautiful digital invitations without having to spend a lot of money or complicated processes.
              </p>
              <p>
                Every template and feature we develop is designed with attention to detail and ease of use,
                so you can focus on your happy and important moments.
              </p>
            </div>

            {/* Key Features */}
            <div className="flex flex-wrap md:flex-row flex-col gap-4 md:gap-5 mt-4">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full font-medium bg-blue-100 text-blue-800">
                  <i className='bx bx-check-circle text-lg'></i>
                  <span className="font-medium text-sm">Template Premium</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full font-medium bg-blue-100 text-blue-800">
                  <i className='bx bx-check-circle text-lg'></i>
                  <span className="font-medium text-sm">Mudah Digunakan</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full font-medium bg-blue-100 text-blue-800">
                  <i className='bx bx-check-circle text-lg'></i>
                  <span className="font-medium text-sm">Support 24/7</span>
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="relative flex justify-center items-center">
              <div className="rounded-xl p-7 shadow-lg relative z-10 border-t-4 border-t-blue-400">
                <div className="bg-gray-100/50 rounded-lg p-4 shadow-xl">
                  <div className="text-center">
                    <i className='bx bx-heart text-4xl mx-auto mb-4 text-color-app'></i>
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                      Our Vision
                    </h3>
                    <p className="text-muted text-base">
                      Becoming a trusted platform for creating digital invitations easily, beautifully and meaningfully for every important historic event need.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-gray-200 py-16">
        <div className="max-w-5xl px-4 xl:px-0 mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              How Our Platform Works
            </h2>
            <p className="text-sm md:text-base text-muted max-w-2xl mx-auto">
              A simple and intuitive process to create your dream wedding invitations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Select Templates", desc: "Browse and select your favorite template" },
              { step: "02", title: "Customization", desc: "Form add invitation details and photos" },
              { step: "03", title: "Preview", desc: "View preview results and make adjustments" },
              { step: "04", title: "Share Invitation", desc: "Invitations ready to be distributed to guests" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-smooth shadow-accent">
                  <span className="text-xl font-bold">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">
                  {item.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='max-w-5xl px-4 xl:px-0 mx-auto py-16'>
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Our Team
          </h2>
          <p className="text-sm md:text-base text-muted max-w-2xl mx-auto">
            Behind {Configs.app_name}, there is a team dedicated to providing the best experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { name: "David Hedrin", role: "IT Programmer", },
            { name: "Yonatan Hudson", role: "Designer UI & UX", },
            { name: "Surya Hasan", role: "Product Manager", }
          ].map((member, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto overflow-hidden shadow-xl group-hover:shadow-accent transition-smooth">
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <i className='bx bx-group text-muted text-5xl'></i>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-foreground text-lg">
                {member.name}
              </h3>
              <p className="text-color-app font-medium">
                {member.role}
              </p>
            </div>
          ))}
        </div>

        <hr className="my-24 text-gray-400" />

        <div className="text-center space-y-8">
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
            <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm md:text-base font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
              Create Invitation Now
            </button>

            <button type="button" className="py-2 px-3 inline-flex items-center gap-x-1 text-sm md:text-base font-medium rounded-lg border border-blue-600 text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:outline-hidden focus:border-blue-500 focus:text-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-blue-500 dark:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
