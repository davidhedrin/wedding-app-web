import Configs from "@/lib/config";

export default function AppFooter() {
  return (
    <footer className="bg-soft-background border-t border-gray-300">
      <div className="max-w-5xl px-4 xl:px-0 mx-auto py-16">
        <div className="grid grid-cols-12 gap-8 md:gap-16">
          {/* Brand */}
          <div className="col-span-12 md:col-span-5 space-y-2">
            <div className="flex items-center space-x-2">
              <img src="/assets/img/logo/wedlyvite-landscape.png" className="h-8 w-auto" />
            </div>
            <p className="text-muted text-sm leading-relaxed text-justify">
              A modern platform for creating elegant and personalized digital invitations for weddings, birthdays, parties and other events.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-12 md:col-span-2">
            <h3 className="font-semibold text-foreground mb-4">Fast Link</h3>
            <ul className="space-y-2">
              <li>
                <div className="text-muted hover:text-accent-primary transition-smooth text-sm">
                  Home
                </div>
              </li>
              <li>
                <div className="text-muted hover:text-accent-primary transition-smooth text-sm">
                  Catalog
                </div>
              </li>
              <li>
                <div className="text-muted hover:text-accent-primary transition-smooth text-sm">
                  About Us
                </div>
              </li>
              <li>
                <div className="text-muted hover:text-accent-primary transition-smooth text-sm">
                  FAQ
                </div>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-12 md:col-span-3">
            <h3 className="font-semibold text-foreground mb-4">Supports</h3>
            <ul className="space-y-2">
              <li>
                <div className="text-muted hover:text-accent-primary transition-smooth text-sm">
                  Usage Guide
                </div>
              </li>
              <li>
                <div className="text-muted hover:text-accent-primary transition-smooth text-sm">
                  Contact Us
                </div>
              </li>
              <li>
                <div className="text-muted hover:text-accent-primary transition-smooth text-sm">
                  Term & Condition
                </div>
              </li>
              <li>
                <div className="text-muted hover:text-accent-primary transition-smooth text-sm">
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