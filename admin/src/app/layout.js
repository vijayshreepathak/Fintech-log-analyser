"use client";

import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import Navbar from "@/components/Navbar";
import NavbarCollapseButton from "@/components/NavbarCollapseButton";
import { useState } from "react";

export default function RootLayout({ children }) {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <html lang="en">
      <body className="dark min-h-screen w-full overflow-x-hidden transition-colors duration-300">
        <NextUIProvider className="flex flex-col lg:flex-row">
          <header className="sticky top-0 max-h-screen z-50 bg-primary shadow-lg transition-all duration-300">
            <Navbar navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} />
            <NavbarCollapseButton
              navbarOpen={navbarOpen}
              setNavbarOpen={setNavbarOpen}
            />
          </header>
          <main className="px-8 w-full py-0 lg:py-8 bg-background transition-colors duration-300 ease-in-out">
            {children}
          </main>
        </NextUIProvider>
      </body>
    </html>
  );
}
