import "./globals.css";
import { SITE } from "@/lib/constants";
import WelcomePopup from "@/components/public/WelcomePopup";

export const metadata = {
  title: `${SITE.name} - ${SITE.tagline}`,
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <WelcomePopup />
      </body>
    </html>
  );
}
