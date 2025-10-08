"use client";

import { useLoading } from "@/components/loading/loading-context";
import { useEffect } from "react";

export default function ContactPage() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="pb-16">
      <div className='relative w-full h-[50vh] flex items-end justify-center text-center pb-14'>
        <div className="absolute -z-30 inset-0 bg-gradient-to-b from-gray-800/25 to-gray-100 backdrop-blur-xs pointer-events-none" />

        <div className="absolute -z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        h-[450px] sm:h-[600px] lg:w-[700px] lg:h-[700px]
        bg-gradient-to-tr from-teal-400/60 to-blue-700/60 blur-3xl rounded-full mix-blend-multiply" />

        <div className="absolute -z-30 top-24 left-10 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[250px] lg:h-[250px]
        bg-gradient-to-bl from-yellow-500/50 to-pink-500/70 blur-3xl rounded-full mix-blend-multiply" />

        <div className="absolute -z-30 top-40 right-5 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72
        bg-gradient-to-t from-purple-600/50 to-red-500/50 blur-3xl rounded-full mix-blend-multiply" />

        <div className='max-w-3xl px-4 xl:px-0 mx-auto text-center'>
          <h1 className="text-2xl md:text-4xl font-bold mb-3 drop-shadow-lg">
            Contact Us
          </h1>
          <p className="md:text-base mb-8">
            Have questions about our services? Our team is ready to help you create your dream wedding invitations.
          </p>
        </div>
      </div>

    </div>
  )
}
