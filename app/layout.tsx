import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Servinas — Aracının her şeyi, tek yerde.",
  description: "Araç bakımını, masraflarını ve önemli tarihlerini tek bir uygulamada yönet. Yakında iOS ve Android'de.",
  openGraph: {
    title: "Servinas — Aracının her şeyi, tek yerde.",
    description: "Araç bakımını, masraflarını ve önemli tarihlerini tek bir uygulamada yönet.",
    siteName: "Servinas",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} antialiased`}>
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
