import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "../globals.css";

// Police principale pour les titres
const almarenaNeue = localFont({
  src: [
    {
      path: "../../../public/fonts/almarena-neue/AlmarenaNeueDisplay-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/almarena-neue/AlmarenaNeueDisplay-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/almarena-neue/AlmarenaNeueDisplay-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/almarena-neue/AlmarenaNeueDisplay-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-almarena-neue",
  display: "swap",
});

// Police secondaire pour le texte courant
const generalSans = localFont({
  src: [
    {
      path: "../../../public/fonts/GeneralSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/GeneralSans-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/GeneralSans-Semibold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/GeneralSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FF3300",
};

export const metadata: Metadata = {
  title: "DBC - Telephones Reconditionnes",
  description: "Telephones reconditionnes premium avec garantie 12 mois",
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fr" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head />
      <body
        className={cn(almarenaNeue.variable, generalSans.variable, geistMono.variable, "font-sans antialiased")}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>{children}</AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
