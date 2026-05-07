import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PageHeader from "@/components/public/PageHeader";
import { SITE, CONTACT, RERA } from "@/lib/constants";

export const metadata = {
  title: `Terms of Service - ${SITE.name}`,
  description: "Terms governing your use of our website and advisory services.",
};

export default function TermsPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Legal"
          title="Terms of Service"
          subtitle="Last updated: 1 January 2026"
        />

        <section className="bg-white py-16 lg:py-20">
          <div className="container-x max-w-3xl">
            <div className="space-y-8 text-[var(--color-ink-700)] leading-[1.75]">
              <Section title="1. Acceptance of terms">
                <p>
                  By accessing or using {SITE.url} or engaging our advisory
                  services, you agree to be bound by these Terms of Service. If
                  you do not agree, please do not use our website or services.
                </p>
              </Section>

              <Section title="2. About our services">
                <p>
                  {SITE.name} is a real estate advisory firm. We do not own,
                  develop, or directly sell properties. We facilitate
                  introductions between buyers, renters, and developers or
                  property owners.
                </p>
                <p>
                  Our RERA registration number is{" "}
                  <strong className="text-[var(--color-ink-900)] numeral">
                    {RERA.number}
                  </strong>
                  . We act as registered real estate agents under the Real
                  Estate (Regulation and Development) Act, 2016.
                </p>
              </Section>

              <Section title="3. Information accuracy">
                <p>
                  We do our best to ensure that all property information,
                  pricing, and amenities listed on our website are accurate at
                  the time of publication. However, prices, availability,
                  configurations, and project specifications are subject to
                  change without notice by the respective developers.
                </p>
                <p>
                  Buyers and renters are advised to independently verify all
                  details, including title documents, RERA registration,
                  approvals, and amenities, before making any payment.
                </p>
              </Section>

              <Section title="4. No guarantees">
                <p>
                  Property values may go up or down. Past performance of any
                  project, locality, or asset class is not indicative of future
                  returns. We do not guarantee any rental yield, capital
                  appreciation, or possession date. Statements about possession
                  timelines reflect developer commitments at the time of
                  listing.
                </p>
              </Section>

              <Section title="5. Site visits and bookings">
                <p>
                  Site visits are scheduled subject to advisor and developer
                  availability. We do not guarantee availability of any specific
                  unit at any specific price after the date of inquiry.
                </p>
                <p>
                  Booking amounts paid to developers are governed by the terms
                  of the booking form between you and the developer. We are not
                  a party to such contracts and are not liable for refunds,
                  cancellations, or disputes between you and the developer.
                </p>
              </Section>

              <Section title="6. Brokerage">
                <p>
                  For most listings on our website, our advisory fee is paid by
                  the developer or property owner, not by the buyer or renter.
                  Where a brokerage is payable by you, this will be disclosed in
                  writing before any commitment is made.
                </p>
              </Section>

              <Section title="7. User conduct">
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 mt-3">
                  <li>Submit false or misleading information through any form</li>
                  <li>Scrape, copy, or republish content from our website without permission</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>
                    Use our services to facilitate illegal activity or money
                    laundering
                  </li>
                </ul>
              </Section>

              <Section title="8. Intellectual property">
                <p>
                  All content on this website - text, photographs, illustrations,
                  logos, and software - is the property of {SITE.name} Pvt. Ltd.
                  or its licensors and is protected under Indian copyright and
                  trademark law. Property photographs displayed on listing pages
                  are used with permission from the respective developers.
                </p>
              </Section>

              <Section title="9. Limitation of liability">
                <p>
                  To the maximum extent permitted by law, {SITE.name} Pvt. Ltd.
                  shall not be liable for any indirect, incidental,
                  consequential, or punitive damages arising from your use of
                  our website or services. Our total aggregate liability shall
                  not exceed the brokerage paid by you to us in the twelve
                  months preceding the claim.
                </p>
              </Section>

              <Section title="10. Governing law and disputes">
                <p>
                  These terms are governed by the laws of India. Any dispute
                  arising out of or in connection with these terms shall be
                  subject to the exclusive jurisdiction of the courts at
                  Bengaluru, Karnataka.
                </p>
                <p>
                  Disputes related to RERA-registered transactions may also be
                  filed before the relevant State Real Estate Regulatory
                  Authority.
                </p>
              </Section>

              <Section title="11. Changes to these terms">
                <p>
                  We may update these terms from time to time. The most recent
                  version will always be available at this URL. Continued use of
                  the website after changes are posted constitutes acceptance.
                </p>
              </Section>

              <Section title="12. Contact">
                <p>
                  Questions about these terms?
                  <br />
                  Email:{" "}
                  <a
                    href={CONTACT.emailHref}
                    className="text-[var(--color-brand-700)] underline"
                  >
                    {CONTACT.email}
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
