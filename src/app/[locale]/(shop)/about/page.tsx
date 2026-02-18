import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";
import { MapPin, Users, Leaf, ShieldCheck } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  return (
    <PolicyPage locale={locale} title={t("aboutTitle")} backLabel={t("backToHome")}>
      {/* Mission cards */}
      <div className="not-prose mb-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("about.storesTitle")}</h3>
          <p className="text-sm text-gray-600">{t("about.storesDesc")}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <Users className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("about.teamTitle")}</h3>
          <p className="text-sm text-gray-600">{t("about.teamDesc")}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <Leaf className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("about.planetTitle")}</h3>
          <p className="text-sm text-gray-600">{t("about.planetDesc")}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("about.warrantyTitle")}</h3>
          <p className="text-sm text-gray-600">{t("about.warrantyDesc")}</p>
        </div>
      </div>

      <h2>{t("about.historyTitle")}</h2>
      <p>{t("about.historyP1")}</p>
      <p>{t("about.historyP2")}</p>

      <h2>{t("about.missionTitle")}</h2>
      <p>{t.rich("about.missionP1", { strong })}</p>

      <h2>{t("about.valuesTitle")}</h2>
      <ul>
        <li>{t.rich("about.valueSimple", { strong })}</li>
        <li>{t.rich("about.valueInspiring", { strong })}</li>
        <li>{t.rich("about.valueStrong", { strong })}</li>
      </ul>

      <h2>{t("about.storesContentTitle")}</h2>
      <p>{t("about.storesContentP1")}</p>
    </PolicyPage>
  );
}
