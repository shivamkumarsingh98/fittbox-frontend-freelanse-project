"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navebar from "./Component/Navebar";
import Footer from "./Component/Footer";
import ModalProvider from "./Component/ModalContext";
import { Providers } from "./Component/Providers";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata = {
  title: "FittBox",
  description: "Diet food delivery website",
  Image: "/logo.png",
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.toLowerCase().startsWith("/dashboard");
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ModalProvider>
            {!isDashboard && <Navebar />}
            {children}
            {!isDashboard && <Footer />}
          </ModalProvider>
        </Providers>
      </body>
    </html>
  );
}
