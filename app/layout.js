import { Orbitron, Righteous } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  title: "MixTube | Explore Your Favorite Mixtapes",
  description:
    "Explore, play, and download your favorite mixtapes with MixTube. Discover new music and share your mixes with friends.",
  keywords: "mixtapes, music, download, streaming, playlists",
  openGraph: {
    title: "MixTube | Explore Your Favorite Mixtapes",
    description:
      "Explore, play, and download your favorite mixtapes with MixTube. Discover new music and share your mixes with friends.",
    images: [
      {
        url: "https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png",
        width: 800,
        height: 600,
        alt: "MixTube - Explore, play and download your favorite mixtapes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MixTube | Explore Your Favorite Mixtapes",
    description:
      "Explore, play, and download your favorite mixtapes with MixTube. Discover new music and share your mixes with friends.",
    images: ["https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://mixtube.xyz" />
        <title>MixTube</title>
        <meta
          name="description"
          content="Explore, play and download your favourite mixtapes"
        />
        <meta property="og:url" content="https://www.mixtube.xyz" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="MixTube" />
        <meta
          property="og:description"
          content="Explore, play and download your favourite mixtapes"
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="mixtube.xyz" />
        <meta property="twitter:url" content="https://www.mixtube.xyz" />
        <meta name="twitter:title" content="MixTube" />
        <meta
          name="twitter:description"
          content="Explore, play and download your favourite mixtapes"
        />
        <meta
          name="twitter:image"
          content="https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png"
        />
      </head>
      <body className={`${righteous.variable} ${orbitron.variable}`}>
        <div className="dark:bg-gray-900 min-h-screen">
          <Toaster position="top-center" />
          <header className="p-3">
            <Navbar />
          </header>
          <SpeedInsights />
          <Analytics />
          <main className="mx-5">{children}</main>
          <footer>
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}
