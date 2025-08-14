import { BreadcrumbType } from "@/lib/model-types";
import { useSmartLink } from "@/lib/smart-link";
import { cn } from "@/lib/utils";
import Link from "next/link";

type BreadcrumbProp = {
  listBr: BreadcrumbType[]
}

export default function BreadcrumbList({ listBr, className, ...props }: BreadcrumbProp & React.ComponentProps<"ol">) {
  const smartLink = useSmartLink();

  return (
    <ol className={cn("flex items-center whitespace-nowrap", className)}>
      {
        listBr.map((x, i) => (
          x.url !== null ? <li key={i} className="inline-flex items-center">
            <Link href={x.url} onClick={() => smartLink(x.url)} className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600">
              {x.name}
            </Link>
            <svg className="shrink-0 mx-1.5 size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </li> : <li key={i} className="inline-flex items-center text-sm text-gray-800 truncate" aria-current="page">
            {x.name}
          </li>
        ))
      }
    </ol>
  )
}
