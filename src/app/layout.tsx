import type { Metadata } from "next";
import "./globals.css";
import { CinematicToaster } from "@/components/ui/CinematicToaster";

export const metadata: Metadata = {
  title: "Ri88 | بوابة المبدع العربي الرقمية",
  description: "أدوات ذكية، محولات أكواد، ومعالجة ملفات متقدمة - مصممة للمبدع العربي الحديث.",
  keywords: ["أدوات", "تطوير", "إنتاجية", "محول أكواد", "ذكاء اصطناعي", "ريان", "Ri88"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Ri88 | بوابة المبدع العربي الرقمية",
    description: "أدوات ذكية ومعالجة ملفات متقدمة.",
    url: "https://ri88.pro",
    siteName: "Ri88",
    locale: "ar_SA",
    type: "website",
  },
};

import SessionWrapper from "@/components/auth/SessionWrapper";

import { NavigationProvider } from "@/context/NavigationContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Cairo:wght@400;600;700;900&family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SessionWrapper>
          <NavigationProvider>
            {children}
            <CinematicToaster />
          </NavigationProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
