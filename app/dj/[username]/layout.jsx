import { Inter } from "next/font/google";


export default function ProfileLayout({ children }) {
  return (
    <html lang="en">
      <body>
          <main className="mx-5">
            {children}
          </main>
      </body>
    </html>
  );
}
