import { StatusType } from "@/lib/model-types";

const statusStyles: Record<StatusType, string> = {
  secondary: "bg-gray-100 text-gray-800",
  primary: "bg-blue-100 text-blue-800",
  success: "bg-teal-100 text-teal-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
};

export default function Badge({ status, label }: { status: StatusType; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-x-1.5 py-1 px-3 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {label}
    </span>
  );
}

// export default function Badge({ status, label }: { status: StatusType, label: string }) {
//   if (status === "secondary") return (
//     <span className="inline-flex items-center gap-x-1.5 py-1 px-3 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//       {label}
//     </span>
//   );

//   if(status === "primary") return (
//     <span className="inline-flex items-center gap-x-1.5 py-1 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//       {label}
//     </span>
//   );

//   if(status === "success") return (
//     <span className="inline-flex items-center gap-x-1.5 py-1 px-3 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
//       {label}
//     </span>
//   );

//   if(status === "warning") return (
//     <span className="inline-flex items-center gap-x-1.5 py-1 px-3 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//       {label}
//     </span>
//   );

//   if(status === "danger") return (
//     <span className="inline-flex items-center gap-x-1.5 py-1 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800">
//       {label}
//     </span>
//   );
// }