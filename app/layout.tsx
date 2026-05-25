import type { Metadata } from "next";
import { headers } from "next/headers";
import { Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { ToastProvider } from "@/app/components/Toast";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Samelo — Watch & Earn",
  description:
    "Turn your attention into income. Watch short videos and earn CELO on Celo.",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const heads = await headers();
  const cookie = heads.get("cookie");
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <meta name="talentapp:project_verification" content="bcec7c3e0b72860c2ca5ceb3e42d0ba8c44b7e27ee7baf9c2b00d7cc19ce17eabcc6fb358ed5445447b7b58ac3be4295265714982df62e08e8fc4477b1874268" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#030303" />
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="min-h-dvh bg-bg text-primary">
        <Providers cookie={cookie}>
          <main>{children}</main>
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
