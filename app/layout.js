import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mixtube",
  description: "Explore, play and download your favourite mixtapes",
  icon:{
    icon : "https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png"
  },
  openGraph: {
    title: 'MixTube',
    description: 'Explore, play and download your favourite mixtapes',
    images: 'https://i.ibb.co/gtjZdNv/57a1a20d3463360140345.jpg', // Path to your preview image
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="MixTube" />
        <meta property="og:description" content="Explore, play and download your favourite mixtapes" />
        <meta property="og:image" content="https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MixTube" />
        <meta name="twitter:description" content="A brief description of your app" />
        <meta name="twitter:image" content="https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png" />
      </head>
      <body className={inter.className}>
        <div className="dark:bg-gray-900 min-h-screen">
          <header className="p-3">
            <Navbar />
          </header>
          <main className="mx-5">
            {children}
          </main>
          <footer>
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}
