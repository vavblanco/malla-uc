import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BodyWrapper from "@/components/utils/BodyWrapper";
import ServiceWorkerRegister from "@/components/utils/ServiceWorkerRegister";
import AppleSplashScreens from "@/components/utils/AppleSplashScreens";
import "./scrollbar.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  weight: ['500', '600', '700', '800'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  weight: ['500', '600', '700'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Malla FCB PUC - Avance Curricular",
    template: "%s | Malla FCB PUC"
  },
  description: "Calculadora de avance curricular para las carreras de la Facultad de Ciencias Biológicas de la Pontificia Universidad Católica de Chile. Visualiza tu malla curricular, gestiona requisitos y calcula tu avance curricular.",
  manifest: "site.webmanifest",
  keywords: [
    "PUC",
    "Pontificia Universidad Católica de Chile",
    "malla curricular",
    "avance curricular",
    "ciencias biológicas",
    "carreras universitarias",
    "plan de estudios",
    "requisitos de asignaturas",
    "Biología",
    "Biología Marina",
    "Bioquímica"
  ],
  authors: [
  {
    name: "Consejería Académica de Ciencias Biológicas",
  },
],
  creator: "FCB",
  publisher: "Facultad de Ciencias Biológicas",
  
  // ?v=3 fuerza a los navegadores a descargar de nuevo el favicon (lo cachean mucho).
  // Si cambias los íconos otra vez, sube el número.
  icons: {
    icon: [
      { url: '/malla-uc/favicon.ico?v=3', sizes: '48x48' },
      { url: '/malla-uc/favicon-32x32.png?v=3', type: 'image/png', sizes: '32x32' },
      { url: '/malla-uc/favicon-16x16.png?v=3', type: 'image/png', sizes: '16x16' },
      { url: '/malla-uc/icon.png?v=3', type: 'image/png', sizes: '192x192' },
      { url: '/malla-uc/android-chrome-512x512.png?v=3', type: 'image/png', sizes: '512x512' }
    ],
    shortcut: '/malla-uc/favicon.ico?v=3',
    apple: [
      { url: '/malla-uc/apple-touch-icon.png?v=3', sizes: '180x180', type: 'image/png' }
    ]
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Malla FCB PUC',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-navbutton-color': '#f9fafb',
    'msapplication-TileColor': '#f9fafb',
    'msapplication-tap-highlight': 'no',
    'viewport-fit': 'cover',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="overflow-x-hidden">
      <BodyWrapper className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden max-w-full`}>
        <ServiceWorkerRegister />
        <AppleSplashScreens />
        {children}
      </BodyWrapper>
    </html>
  );
}
