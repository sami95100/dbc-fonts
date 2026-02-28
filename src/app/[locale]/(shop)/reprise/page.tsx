import { getTranslations } from "next-intl/server";
import { TradeInWizard } from "@/components/trade-in/TradeInWizard";

export default async function ReprisePage() {
  const t = await getTranslations("tradeIn");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-gray-900 md:text-[36px]">
          {t("title")}
        </h1>
        <p className="mt-3 text-base text-gray-600 md:text-lg">
          {t("subtitle")}
        </p>
      </div>

      {/* Wizard */}
      <TradeInWizard />
    </div>
  );
}
