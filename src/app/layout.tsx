import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ri88 | بوابة الأدوات الرقمية",
  description: "أدوات ذكية لاستخدامك اليومي - بوابة ريان (Rayyan Portal)",
};

import GlobalFooter from "@/components/GlobalFooter";
import SessionWrapper from "@/components/auth/SessionWrapper";

import AppShell from "@/components/Navigation/AppShell";
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
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SessionWrapper>
          <NavigationProvider>
            <AppShell>
              {children}
            </AppShell>
          </NavigationProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
