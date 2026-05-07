import { LuMapPin, LuPhone, LuMail, LuClock } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa6";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import ContactForm from "@/components/public/ContactForm";
import { CONTACT, SITE } from "@/lib/constants";

export const metadata = {
  title: `Contact - ${SITE.name}`,
  description: "Get in touch. We respond within 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Get in touch"
          title="Tell us what you're looking for."
          subtitle="One advisor will respond within 24 hours. No call queues, no telecallers."
        />

        <section className="bg-[var(--color-bg-soft)] py-16 lg:py-20">
          <div className="container-x">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Form */}
              <div className="lg:col-span-7 order-2 lg:order-1">
                <div className="bg-white rounded-2xl border border-[var(--color-ink-100)] p-6 lg:p-8">
                  <h2 className="text-xl lg:text-2xl font-semibold text-[var(--color-ink-900)] mb-1">
                    Send us a message
                  </h2>
                  <p className="text-sm text-[var(--color-ink-600)] mb-6">
                    We'll get back to you within one business day.
                  </p>
                  <ContactForm />
                </div>
              </div>

              {/* Info */}
              <aside className="lg:col-span-5 order-1 lg:order-2 space-y-4">
                <ContactBlock
                  icon={LuPhone}
                  title="Call us"
                  value={CONTACT.phone}
                  href={CONTACT.phoneHref}
                  hint="Mon–Sat, 9 AM – 7 PM"
                />
                <ContactBlock
                  icon={FaWhatsapp}
                  title="WhatsApp"
                  value="Chat on WhatsApp"
                  href={CONTACT.whatsappHref}
                  hint="Quickest replies, 9 AM – 11 PM"
                />
                <ContactBlock
                  icon={LuMail}
                  title="Email"
                  value={CONTACT.email}
                  href={CONTACT.emailHref}
                  hint="Replies within 24 hours"
                />
                <ContactBlock
                  icon={LuMapPin}
                  title="Visit us"
                  value={`${CONTACT.address.line1}, ${CONTACT.address.line2}`}
                  hint="By appointment"
                />
                <ContactBlock
                  icon={LuClock}
                  title="Response time"
                  value="Same business day"
                  hint="Usually within 4 hours"
                />
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ContactBlock({ icon: Icon, title, value, href, hint }) {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href ? { href, target: href.startsWith("http") ? "_blank" : undefined } : {};
  return (
    <Wrapper
      {...wrapperProps}
      className={`block bg-white rounded-xl border border-[var(--color-ink-100)] p-5 ${href ? "hover:border-[var(--color-brand-600)] hover:shadow-sm transition-all" : ""}`}
    >
      <div className="flex items-start gap-4">
        <span className="w-10 h-10 grid place-items-center rounded-lg bg-[var(--color-brand-50)] text-[var(--color-brand-700)] flex-shrink-0">
          <Icon className="text-lg" />
        </span>
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] font-medium mb-1">
            {title}
          </p>
          <p className="text-sm font-medium text-[var(--color-ink-900)]">{value}</p>
          {hint && (
            <p className="text-xs text-[var(--color-ink-500)] mt-1">{hint}</p>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
