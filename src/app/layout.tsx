import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ri88 | بوابة الأدوات الرقمية",
  description: "أدوات ذكية لاستخدامك اليومي - بوابة ريان (Rayyan Portal)",
};

import GlobalFooter from "@/components/GlobalFooter";
import SessionWrapper from "@/components/auth/SessionWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <SessionWrapper>
          {children}
          <GlobalFooter />
        </SessionWrapper>
      </body>
    </html>
  );
}
