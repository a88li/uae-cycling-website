import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a365d" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: "مسارات الإمارات للجري | UAE Running Routes",
  description:
    "دليلك الشامل لأفضل مسارات الجري في الإمارات - دبي، أبوظبي، الشارقة والإمارات الشمالية. اكتشف المسارات الحضرية والصحراوية والجبلية مع نصائح السلامة والمعدات.",
  keywords: [
    "مسارات جري",
    "الإمارات",
    "دبي",
    "أبوظبي",
    "جري",
    "running UAE",
    "running routes Dubai",
    "UAE running tracks",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "مسارات الإمارات للجري",
  },
  openGraph: {
    title: "مسارات الإمارات للجري",
    description: "دليلك الشامل لأفضل مسارات الجري في الإمارات",
    type: "website",
    locale: "ar_AE",
    siteName: "مسارات الإمارات للجري",
    images: [{ url: "/images/hero-cycling.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="UAE Running" />
        <meta name="apple-mobile-web-app-title" content="UAE Running" />
        <meta name="theme-color" content="#f97316" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `,
        }} />
      </head>
      <body suppressHydrationWarning className={`${cairo.variable} font-[family-name:var(--font-cairo)] antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
