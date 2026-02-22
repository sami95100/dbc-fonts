import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { PromoBanner } from "@/components/layout/PromoBanner";
import { Footer } from "@/components/layout/Footer";

interface ShopLayoutProps {
  children: React.ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-gray-100">
      <Toaster position="top-right" richColors />
      <Header />
      <PromoBanner />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
