import { BuybackWizard } from "@/components/buyback";

export default function ReprisePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-gray-900 md:text-[36px]">
          Revends ton telephone au meilleur prix
        </h1>
        <p className="mt-3 text-base text-gray-600 md:text-lg">
          Estimation instantanee, paiement rapide. En magasin ou par courrier.
        </p>
      </div>

      {/* Wizard */}
      <BuybackWizard />
    </div>
  );
}
