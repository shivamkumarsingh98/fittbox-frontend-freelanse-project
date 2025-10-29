import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navebar from "./Component/Navebar";
import Footer from "./Component/Footer";
import ModalProvider from "./Component/ModalContext";
import { Providers } from "./Component/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FittBox",
  description: "Diet food delivery website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ModalProvider>
            <Navebar />
            {children}
            <Footer />
          </ModalProvider>
        </Providers>
      </body>
    </html>
  );
}
