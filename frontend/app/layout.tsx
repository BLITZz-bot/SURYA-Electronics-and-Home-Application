'use dynamic';

import "./globals.css";
import { Providers } from "./providers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import SiteHeader from "../components/site-header";

export const metadata = {
  title: "SURYA Electronics",
  description: "SURYA Electronics and Home appliances store built with Google authentication.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("NextAuth session error:", error);
  }

  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          <SiteHeader />
          <div className="min-h-[calc(100vh-104px)]">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
