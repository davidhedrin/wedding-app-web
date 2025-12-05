import { StatusType } from "@/lib/dto";

const statusStyles: Record<StatusType, string> = {
  secondary: "bg-gray-50 border-gray-500",
  primary: "bg-blue-50 border-blue-500",
  success: "bg-teal-50 border-teal-500",
  warning: "bg-yellow-50 border-yellow-500",
  danger: "bg-red-50 border-red-500",
};

interface AlertProps {
  status: StatusType;
  children: React.ReactNode;
}

export default function Alert({ status, children }: AlertProps) {
  return (
    <div
      className={`border-s-4 p-3 mt-3 ${statusStyles[status]}`}
      role="alert"
    >
      <div className="text-sm text-gray-700">
        {children}
      </div>
    </div>
  );
}