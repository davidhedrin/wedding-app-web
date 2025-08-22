"use client";

import { useLoading } from "@/components/loading/loading-context";
import TypingEffect from "@/components/ui/typing-text";
import Configs from "@/lib/config";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function CatalogPage() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);

  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const filters = [
    { id: "all", label: "Semua Template" },
    { id: "modern", label: "Modern" },
    { id: "classic", label: "Klasik" },
    { id: "elegant", label: "Elegan" },
    { id: "rustic", label: "Rustic" }
  ];

    const templates = [
      {
        id: 1,
        name: "Elegant Rose",
        category: "elegant",
        price: "Gratis",
        image: "/api/placeholder/400/300",
        description: "Template elegan dengan motif mawar yang cocok untuk pernikahan formal",
        features: ["RSVP Integration", "Photo Gallery", "Music Player"]
      },
    ];

    const filteredTemplates = activeFilter === "all" 
    ? templates 
    : templates.filter(template => template.category === activeFilter);

  return (
    <>
      {/* title header */}
      <section className="relative h-[400px] w-full bg-gray-200/80 flex items-center justify-center">
          <div className="container mx-auto px-4 ">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                Katalog <span className="text-theme">Template</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Pilih dari koleksi template undangan pernikahan yang telah dirancang khusus 
                untuk momen spesial Anda
              </p>
            </div>
          </div>
      </section>

      <section className="max-w-5xl px-4 xl:px-0 mx-auto py-6 border-b border-gray-200/80">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2 mr-4">
                {/* <Filter className="w-4 h-4 text-muted-foreground" /> */}
                <span className="text-sm font-medium text-foreground">Filter:</span>
              </div>
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
                    activeFilter === filter.id
                      ? "bg-theme text-white shadow-accent"
                      : "bg-grey-theme text-gray-500 hover:bg-gray-300"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>



          </div>
        </div>
      </section>
    </>
  )
}
