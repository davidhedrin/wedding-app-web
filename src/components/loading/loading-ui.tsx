import Configs from "@/lib/config";
import { cn } from "@/lib/utils";
import UiPortal from "../ui-portal";

export default function LoadingUI({ className, ...props }: React.ComponentProps<"div">) {
  const appName = Configs.app_name;

  return <UiPortal>
    <div
      className={cn(
        "fixed inset-0 z-[99] flex items-center justify-center",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center space-y-1">
        <img src="/assets/img/logo/wedlyvite-logo-web.png" className="w-8 h-auto tada-animation" />
        <p className='text-sm font-medium'>{appName}...</p>
      </div>
    </div>
  </UiPortal>
}