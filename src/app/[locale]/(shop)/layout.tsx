import { Toaster } from "sonner";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { CategoryNav } from "@/components/layout/CategoryNav";
import { PromoBanner } from "@/components/layout/PromoBanner";
import { Footer } from "@/components/layout/Footer";

interface ShopLayoutProps {
  children: React.ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Toaster position="top-right" richColors />
      <TopBar />
      <Header />
      <CategoryNav />
      <PromoBanner />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
