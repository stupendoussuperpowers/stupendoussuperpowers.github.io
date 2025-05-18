import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import React from 'react';

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
        <div className='actualbody'>
          <Header />
          {children}
          {/* <div className="debug-grid"></div> */}
          <Footer />
        </div>
        <div className="cmyk start">
          <div className="c box"></div>
          <div className="m box"></div>
          <div className="y box"></div>
          <div className="k box"></div>
        </div>
      </body>
    </html>
  );
}
