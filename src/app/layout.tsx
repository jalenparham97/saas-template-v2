import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

import { APP_NAME } from "@/lib/contants";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "SaaS App Template",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <NextTopLoader showSpinner={false} color="#000" />
        <Toaster />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
