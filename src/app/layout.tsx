import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CinematicToaster } from "@/components/ui/CinematicToaster";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
    url: "https://ri88.info",
    siteName: "Ri88",
    locale: "ar_SA",
    type: "website",
  },
};

import SessionWrapper from "@/components/auth/SessionWrapper";

import { NavigationProvider } from "@/context/NavigationContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FavoritesProvider } from "@/context/FavoritesContext";

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
        <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600;700&family=Geist:wght@300;400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          id="ri88-cache-killer"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function(regs) {
                      for (var i = 0; i < regs.length; i++) {
                        regs[i].unregister();
                      }
                    });
                  }
                  if ('caches' in window) {
                    caches.keys().then(function(names) {
                      for (var i = 0; i < names.length; i++) {
                        caches.delete(names[i]);
                      }
                    });
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <SessionWrapper>
          <ThemeProvider>
            <FavoritesProvider>
              <WorkspaceProvider>
                <NavigationProvider>
                  {children}
                  <CinematicToaster />
                </NavigationProvider>
              </WorkspaceProvider>
            </FavoritesProvider>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
