import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sanchit Sahay",
  description: "Welcome to my website!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className='debug'>
        <Header />
        {children}
        {/*<div className="debug-grid"></div>*/}

        <Footer />
      </body>
    </html>
  );
}
