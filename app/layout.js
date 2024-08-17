import { Orbitron, Righteous } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";

export const orbitron = Orbitron({
  subsets : ["latin"],
  weight:"400",
  variable : "--font-orbitron"
})
const righteous = Righteous({ 
  subsets : ["latin"],
  weight:"400",
  variable:"--font-righteous"
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${righteous.variable} ${orbitron.variable}`}>
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
