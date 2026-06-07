import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "SURYA Electronics",
  description: "SURYA Electronics and Home appliances store built with Firebase authentication.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
