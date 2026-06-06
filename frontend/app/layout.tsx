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
  const session = await getServerSession(authOptions);

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
