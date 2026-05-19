import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { BottomNav } from "@/app/components/BottomNav";
import { ToastProvider } from "@/app/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Semelo — Watch & Earn",
  description:
    "Turn your attention into income. Watch short videos and earn real cUSD on Celo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="talentapp:project_verification" content="bcec7c3e0b72860c2ca5ceb3e42d0ba8c44b7e27ee7baf9c2b00d7cc19ce17eabcc6fb358ed5445447b7b58ac3be4295265714982df62e08e8fc4477b1874268" />
        <meta name="theme-color" content="#0A0E1A" />
      </head>
      <body className="min-h-dvh bg-bg text-primary">
        <Providers>
          <main className="pb-20">{children}</main>
          <BottomNav />
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
