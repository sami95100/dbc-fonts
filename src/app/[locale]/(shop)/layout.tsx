import { Toaster } from "sonner";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";

import { Footer } from "@/components/layout/Footer";

interface ShopLayoutProps {
  children: React.ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-gray-100">
      {/* Always-on sticky element for Safari iOS status bar color */}
      <div className="pointer-events-none sticky top-0 z-[-1] -mb-16 h-16 bg-gray-100" aria-hidden="true" />
      <Toaster position="top-right" richColors />
      <TopBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
