import { Orbitron, Righteous } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from '@next/third-parties/google'
import AudioPlayer from "./(components)/audioplayer";

export const orbitron = Orbitron({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-orbitron",
});

const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
});



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${righteous.variable} ${orbitron.variable}`}>
        <div className="dark:bg-gray-900 min-h-screen">
          <Toaster position="top-center" />
          <header className="p-3">
            <Navbar />
          </header>
          <SpeedInsights />
          <Analytics />
          <GoogleAnalytics gaId="G-C87ETLJK5C"/>
          <main className="mx-5">{children}</main>
          <AudioPlayer/>
          <footer>
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}
