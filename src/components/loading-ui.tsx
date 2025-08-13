import Configs from "@/lib/config";
import { cn } from "@/lib/utils";

export default function LoadingUI({ className, ...props }: React.ComponentProps<"div">) {
  const appName = Configs.app_name;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center space-y-1">
        <i className='bx bx-shopping-bag bx-tada text-3xl'></i>
        <p className='text-sm font-medium'>{appName}...</p>
      </div>
    </div>
  )
}
