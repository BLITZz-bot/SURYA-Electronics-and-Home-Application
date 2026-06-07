'use dynamic';

import "./globals.css";
import { Providers } from "./providers";
import SiteHeader from "../components/site-header";

export const metadata = {
  title: "SURYA Electronics",
  description: "SURYA Electronics and Home appliances store built with Firebase authentication.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SiteHeader />
          <div className="min-h-[calc(100vh-104px)]">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
