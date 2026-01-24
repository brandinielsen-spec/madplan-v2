import type { Metadata, Viewport } from "next";
import { Nunito, Poppins } from "next/font/google";
import "./globals.css";
import { SWRProvider } from "@/providers/swr-provider";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { OfflineBanner } from "@/components/layout/offline-banner";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Madplan",
  description: "Planlaeg ugens maaltider",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Madplan",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#CB6843",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" className={`${nunito.variable} ${poppins.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased">
        <ServiceWorkerRegistration />
        <OfflineBanner />
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  );
}
