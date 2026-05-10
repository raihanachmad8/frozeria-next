import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppShell } from "@/components/layout/app-shell";
import { AntDesignProvider } from "@/components/providers/ant-design-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { APP_METADATA } from "@/commons/constants";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_METADATA.title,
  description: APP_METADATA.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AntDesignProvider>
          <QueryProvider>
            <AppShell>{children}</AppShell>
          </QueryProvider>
        </AntDesignProvider>
      </body>
    </html>
  );
}
