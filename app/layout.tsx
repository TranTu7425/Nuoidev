import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import TransactionNotification from "@/components/TransactionNotification";
import CoffeeRain from "@/components/CoffeeRain";
import ForbiddenButton from "@/components/ForbiddenButton";

export const metadata: Metadata = {
  title: "Nuoidev - Gây quỹ ủng hộ Developer minh bạch",
  description: "Trang web gây quỹ minh bạch và công khai, tự động xác thực qua hệ thống Webhook ngân hàng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <TransactionNotification />
          <CoffeeRain />
          <ForbiddenButton />
          <main className="flex-grow pt-24">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
