import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from '@next/third-parties/google'
import AudioPlayer from "./(components)/AudioPlayer";
import { PlayerProvider } from "@/context/PlayerContext";
import SessionProvider from "@/providers/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { ThemeProvider } from "@/providers/ThemeProvider";
import RegisterSW from "./register-sw";
import PwaInstallPrompt from "./(components)/PwaInstallPrompt";
import { Orbitron } from "next/font/google";
import { Righteous } from "next/font/google";

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

export const metadata = {
  applicationName: "Mixtapped",
  title: {
    default: "Mixtapped",
    template: "%s | Mixtapped",
  },
  description:
    "Find your favorite mixes from top DJs around the world or create your own DJ profile and share your music with a global audience",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mixtapped",
  },
  icons: {
    icon: "/og.jpg",
    apple: "/og.jpg",
  },
};

export const viewport = {
  themeColor: "#111827",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${righteous.variable}`}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider session={session}>
          <PlayerProvider>
            <div className="dark:bg-gray-900 min-h-screen">
              <RegisterSW />
              <PwaInstallPrompt />
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
        </ThemeProvider>
      </body>
    </html>
  );
}