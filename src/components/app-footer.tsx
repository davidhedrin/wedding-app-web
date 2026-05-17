import Configs from "@/lib/config";
import { useSmartLink } from "@/lib/smart-link";

export default function AppFooter() {
  const smartLink = useSmartLink();

  return (
    <footer className="bg-soft-background border-t border-gray-300">
      <div className="max-w-5xl px-4 xl:px-0 mx-auto py-16">
        <div className="grid grid-cols-12 gap-8 md:gap-16">
          {/* Brand */}
          <div className="col-span-12 md:col-span-5 space-y-2">
            <div className="flex items-center space-x-2">
              <img src="/assets/img/logo/wedlyvite-landscape.png" className="h-8 w-auto" />
            </div>
            <p className="text-muted md:text-base leading-relaxed text-justify">
              A modern platform for creating elegant and personalized digital invitations for weddings, birthdays, parties and other events.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-12 md:col-span-2">
            <h3 className="font-semibold text-foreground mb-4">Fast Link</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" onClick={() => smartLink("/")} aria-current="page" className="text-muted hover:text-accent-primary transition-smooth md:text-base hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/about-us" onClick={() => smartLink("/about-us")} className="text-muted hover:text-accent-primary transition-smooth md:text-base hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="/services" onClick={() => smartLink("/services")} className="text-muted hover:text-accent-primary transition-smooth md:text-base hover:underline">
                  Services
                </a>
              </li>
              <li>
                <a href="/contact" onClick={() => smartLink("/contact")} className="text-muted hover:text-accent-primary transition-smooth md:text-base hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/catalog" onClick={() => smartLink("/catalog")} className="text-muted hover:text-accent-primary transition-smooth md:text-base hover:underline">
                  Catalog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-12 md:col-span-3">
            <h3 className="font-semibold text-foreground mb-4">Supports</h3>
            <ul className="space-y-2">
              <li>
                <div className="text-muted hover:text-accent-primary transition-smooth md:text-base">
                  Usage Guide
                </div>
              </li>
              <li>
                <div className="text-muted hover:text-accent-primary transition-smooth md:text-base">
                  Term & Condition
                </div>
              </li>
              <li>
                <div className="text-muted hover:text-accent-primary transition-smooth md:text-base">
                  Privacy Policy
                </div>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-12 md:col-span-2">
            <h3 className="font-semibold text-foreground mb-4">Ikuti Kami</h3>
            <div className="flex space-x-3">
              <a
                href="#"
                className="bg-muted rounded-full flex items-center justify-center text-muted hover:bg-accent-primary hover:text-accent-foreground transition-smooth"
              >
                <i className='bx bxl-instagram text-xl'></i>
              </a>
              <a
                href="#"
                className="bg-muted rounded-full flex items-center justify-center text-muted hover:bg-accent-primary hover:text-accent-foreground transition-smooth"
              >
                <i className='bx bxl-facebook-square text-xl'></i>
              </a>
              <a
                href="#"
                className="bg-muted rounded-full flex items-center justify-center text-muted hover:bg-accent-primary hover:text-accent-foreground transition-smooth"
              >
                <i className='bx bxl-twitter text-xl'></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="py-3 text-center border-t border-gray-300">
        <p className="text-muted text-sm">
          Copyright © 2025 <span className="text-color-app font-semibold">{Configs.app_name}</span>. All rights reserved.
        </p>
      </div>
    </footer>
  )
}