import { Orbitron, Righteous } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from '@next/third-parties/google'
import AudioPlayer from "./(components)/audioplayer";
import { PlayerProvider } from "@/context/PlayerContext";
import SessionProvider from "@/providers/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

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

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${righteous.variable} ${orbitron.variable}`}>
        <SessionProvider session={session}>
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
        </SessionProvider>
      </body>
    </html>
  );
}