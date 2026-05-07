import Link from "next/link";
import {
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import {
  SITE,
  CONTACT,
  RERA,
  SOCIAL,
  FOOTER_COLUMNS,
} from "@/lib/constants";

const SOCIAL_ICONS = [
  { Icon: FaInstagram, href: SOCIAL.instagram, label: "Instagram" },
  { Icon: FaXTwitter, href: SOCIAL.twitter, label: "Twitter" },
  { Icon: FaLinkedinIn, href: SOCIAL.linkedin, label: "LinkedIn" },
  { Icon: FaWhatsapp, href: SOCIAL.whatsapp, label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-ink-900)] text-white/80">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container-x py-12 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-6">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white leading-tight">
                A monthly letter, no noise.
              </h3>
              <p className="mt-3 text-sm sm:text-base text-white/65 leading-relaxed max-w-md">
                One handpicked project, one neighbourhood essay, one buyer's
                lesson. Sent on the first Sunday.
              </p>
            </div>
            <div className="lg:col-span-6">
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 sm:px-5 py-3 sm:py-3.5 rounded-md bg-white/5 border border-white/15 text-white placeholder:text-white/40 outline-none focus:border-[var(--color-accent-500)] transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 sm:py-3.5 rounded-md bg-white text-[var(--color-ink-900)] hover:bg-[var(--color-accent-500)] transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-[10px] tracking-[0.22em] uppercase text-white/40 mt-2">
                ~6,200 readers, replies welcome
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container-x py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-9 h-9 rounded-lg bg-[var(--color-accent-500)] grid place-items-center text-[var(--color-ink-900)]">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M12 3 L21 10 L21 21 L15 21 L15 14 L9 14 L9 21 L3 21 L3 10 Z" />
                </svg>
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-semibold text-white">
                  {SITE.logoText}
                </span>
                <span className="text-[10px] tracking-[0.22em] uppercase text-white/55 mt-0.5">
                  {SITE.logoSub}
                </span>
              </div>
            </div>
            <p className="text-sm text-white/65 leading-relaxed mb-6 max-w-sm">
              {SITE.description}
            </p>

            <div className="flex items-center gap-2">
              {SOCIAL_ICONS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 grid place-items-center rounded-md border border-white/15 text-white/80 hover:bg-white hover:text-[var(--color-ink-900)] hover:border-transparent transition-colors"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="col-span-1 lg:col-span-2">
              <h4 className="text-[10px] tracking-[0.28em] uppercase text-[var(--color-accent-500)] font-medium mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="col-span-2 lg:col-span-2">
            <h4 className="text-[10px] tracking-[0.28em] uppercase text-[var(--color-accent-500)] font-medium mb-4">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <a
                  href={CONTACT.phoneHref}
                  className="hover:text-white transition-colors"
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.emailHref}
                  className="hover:text-white transition-colors break-all"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="text-xs leading-relaxed text-white/55 mt-3">
                {CONTACT.address.line1}
                <br />
                {CONTACT.address.line2}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="text-[11px] text-white/45">
            © {new Date().getFullYear()} {SITE.name} Pvt. Ltd. RERA: {RERA.number}
          </p>
          <div className="flex items-center gap-5 text-[11px] text-white/45">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link
              href="/sitemap.xml"
              className="hover:text-white transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
