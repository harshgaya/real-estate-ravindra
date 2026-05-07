import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import { SITE, CONTACT } from "@/lib/constants";

export const metadata = {
  title: `Privacy Policy - ${SITE.name}`,
  description: "How we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Legal"
          title="Privacy Policy"
          subtitle="Last updated: 1 January 2026"
        />

        <section className="bg-white py-16 lg:py-20">
          <div className="container-x max-w-3xl">
            <div className="space-y-8 text-[var(--color-ink-700)] leading-[1.75]">
              <Section title="1. Who we are">
                <p>
                  {SITE.name} Pvt. Ltd. ("we", "us", "our") operates the website{" "}
                  {SITE.url} and provides real estate advisory services.
                  Registered office: {CONTACT.address.line1}, {CONTACT.address.line2}.
                </p>
              </Section>

              <Section title="2. Information we collect">
                <p>
                  When you fill out a form on our website, request a callback,
                  download a brochure, or schedule a site visit, we collect:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 mt-3">
                  <li>Your name, mobile number, and email address</li>
                  <li>The property or project you expressed interest in</li>
                  <li>Your stated budget, configuration preference, and timeline</li>
                  <li>UTM parameters, referring URL, and IP address</li>
                  <li>Communications you have with our advisors</li>
                </ul>
              </Section>

              <Section title="3. How we use your information">
                <p>We use the information you provide to:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 mt-3">
                  <li>Respond to your inquiry within one business day</li>
                  <li>Send you property recommendations matching your stated preferences</li>
                  <li>Schedule site visits and book consultations</li>
                  <li>Comply with KYC requirements during a property booking</li>
                  <li>
                    Send you our monthly newsletter (which you can unsubscribe from
                    at any time)
                  </li>
                </ul>
              </Section>

              <Section title="4. Who we share it with">
                <p>
                  We share your information only with the specific developer or
                  property owner whose listing you have inquired about, and only
                  to the extent needed to facilitate the conversation. We never
                  sell your data to third parties or marketing lists.
                </p>
                <p className="mt-3">
                  We use Google Analytics, Meta Pixel, and Google Ads conversion
                  tracking on our website. These services may collect anonymized
                  browsing data, but we do not share personally identifiable
                  information with them.
                </p>
              </Section>

              <Section title="5. How long we keep it">
                <p>
                  We retain your information for as long as we have an active
                  relationship with you, plus seven years thereafter as required
                  by Indian tax and real estate regulations. After that, we
                  delete your records.
                </p>
              </Section>

              <Section title="6. Your rights">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 mt-3">
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction of any inaccurate information</li>
                  <li>Request deletion (subject to our retention obligations)</li>
                  <li>Withdraw consent for marketing communications at any time</li>
                  <li>File a complaint with the Data Protection Board of India</li>
                </ul>
                <p className="mt-3">
                  To exercise any of these rights, write to us at{" "}
                  <a
                    href={CONTACT.emailHref}
                    className="text-[var(--color-brand-700)] underline"
                  >
                    {CONTACT.email}
                  </a>
                  .
                </p>
              </Section>

              <Section title="7. Cookies">
                <p>
                  We use functional cookies to remember your preferences (such as
                  whether you've already seen our welcome popup) and analytics
                  cookies to understand how the site is used. You can disable
                  cookies in your browser settings.
                </p>
              </Section>

              <Section title="8. Changes to this policy">
                <p>
                  We may update this policy occasionally. The "Last updated" date
                  at the top reflects the most recent version. Material changes
                  will be communicated via email if we have one on file for you.
                </p>
              </Section>

              <Section title="9. Contact us">
                <p>
                  Questions about this policy or how we handle your data?
                  <br />
                  Email:{" "}
                  <a
                    href={CONTACT.emailHref}
                    className="text-[var(--color-brand-700)] underline"
                  >
                    {CONTACT.email}
                  </a>
                  <br />
                  Phone:{" "}
                  <a
                    href={CONTACT.phoneHref}
                    className="text-[var(--color-brand-700)] underline"
                  >
                    {CONTACT.phone}
                  </a>
                </p>
              </Section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-[var(--color-ink-900)] mb-3">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
