import { HiOutlinePhone, HiOutlineMail } from "react-icons/hi";
import { CONTACT, RERA } from "@/lib/constants";

export default function TopBar() {
  return (
    <div className="hidden md:block bg-[var(--color-ink-900)] text-white text-xs">
      <div className="container-x flex items-center justify-between py-2">
        <div className="flex items-center gap-6">
          <a
            href={CONTACT.phoneHref}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <HiOutlinePhone className="text-[var(--color-accent-500)]" />
            {CONTACT.phone}
          </a>
          <a
            href={CONTACT.emailHref}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <HiOutlineMail className="text-[var(--color-accent-500)]" />
            {CONTACT.email}
          </a>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-500)] animate-pulse" />
          <span>{RERA.status}</span>
        </div>
      </div>
    </div>
  );
}
