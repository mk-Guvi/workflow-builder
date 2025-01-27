import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "./providers/modalProvider";
import DrawerProvider from "./providers/drawerProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Workflow Builder",
  description: "Build Automations Your Way.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex overflow-hidden h-screen">
          <DrawerProvider>
            <ModalProvider>
              <Sidebar />
              <Toaster />
              <div className="w-full h-full">{children}</div>
            </ModalProvider>
          </DrawerProvider>
        </div>
      </body>
    </html>
  );
}
