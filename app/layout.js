import { Orbitron, Righteous } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from '@next/third-parties/google'
import AudioPlayer from "./(components)/audioplayer";
import { PlayerProvider } from "@/context/PlayerContext";

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
        <PlayerProvider>
          <div className="dark:bg-gray-900 min-h-screen">
            <Toaster position="top-center" />
            <header className="p-3">
              <Navbar />
            </header>
            <GoogleAnalytics gaId="G-C87ETLJK5C"/>
            <main className="mx-5">{children}</main>
            <AudioPlayer/>
            <footer>
              <Footer />
            </footer>
          </div>
        </PlayerProvider>
      </body>
    </html>
  );
}