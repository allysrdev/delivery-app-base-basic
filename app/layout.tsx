import type { Metadata } from "next";
import "./globals.css";
import { LucideHouse, LucideReceiptText, LucideSearch, LucideUser } from "lucide-react";
import Link from "next/link";
import { CldOgImage } from "next-cloudinary";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Image from "next/image";
import { CartProvider } from "./context/CartContext";

export const metadata: Metadata = {
  title: "Dummy Lanches",
  description: "Loja de lanches fictícia",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        async 
        defer
      />

      <body className="antialiased p-4">
        <SessionProvider>
          <CartProvider>
            {children}
            </CartProvider>
          <CldOgImage src="og-image" alt="social image"/>

          <nav className="bg-black/30 backdrop-blur-md border border-white/10 shadow-lg rounded-md p-2 fixed bottom-0 left-0 w-full flex items-center justify-around">
            <Link href="/" className="rounded-md p-2 hover:bg-zinc-600 cursor-pointer">
              <LucideHouse />
            </Link>
            <Link href="/search" className="rounded-md p-2 hover:bg-zinc-600 cursor-pointer">
              <LucideSearch />
            </Link>
            <Link href="/" className="rounded-md p-2 hover:bg-zinc-600 cursor-pointer">
              <LucideReceiptText />
            </Link>
            <Link href="/user" className="rounded-md p-2 hover:bg-zinc-600 cursor-pointer">
              {session?.user?.image ? (
                <Image 
                  src={session.user.image}
                  width={35}
                  height={35}
                  alt="user-image"
                  className="rounded-full object-cover border-[2.5px] border-[#ededed]"
                />
              ) : (
                <LucideUser />
              )}
            </Link>
          </nav>
        </SessionProvider>
      </body>
    </html>
  );
}
