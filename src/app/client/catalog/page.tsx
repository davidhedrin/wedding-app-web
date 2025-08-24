"use client";

import BreadcrumbList from '@/components/breadcrumb-list';
import { useLoading } from '@/components/loading/loading-context';
import { BreadcrumbType } from '@/lib/model-types';
import { useEffect } from 'react'

export default function Page() {
  const listBr: BreadcrumbType[] = [
    { name: "Systems", url: null },
    { name: "Catalog", url: "/client/catalog" },
  ];
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      <div className="py-2 px-4 flex flex-wrap justify-between items-center gap-2 bg-white border-b border-gray-200">
        <div>
          <h1 className="font-medium text-gray-800">
            Catalog
          </h1>
        </div>

        <div className="flex items-center gap-x-5">
          <BreadcrumbList listBr={listBr} />
        </div>
      </div>
    </>
  )
}
