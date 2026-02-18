import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";
import { ClipboardCheck, Eye, Battery, ShieldCheck } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function QualityPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  return (
    <PolicyPage locale={locale} title={t("qualityTitle")} backLabel={t("backToHome")}>
      {/* Quality pillars */}
      <div className="not-prose mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <ClipboardCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("quality.checkpointsTitle")}</h3>
          <p className="text-sm text-gray-600">{t("quality.checkpointsDesc")}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <Eye className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("quality.gradesTitle")}</h3>
          <p className="text-sm text-gray-600">{t("quality.gradesDesc")}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <Battery className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("quality.batteryTitle")}</h3>
          <p className="text-sm text-gray-600">{t("quality.batteryDesc")}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("quality.warrantyTitle")}</h3>
          <p className="text-sm text-gray-600">{t("quality.warrantyDesc")}</p>
        </div>
      </div>

      <h2>{t("quality.processTitle")}</h2>
      <p>{t.rich("quality.processIntro", { strong })}</p>
      <ul>
        <li>{t("quality.processScreen")}</li>
        <li>{t("quality.processSensors")}</li>
        <li>{t("quality.processAudio")}</li>
        <li>{t("quality.processCamera")}</li>
        <li>{t("quality.processConnectivity")}</li>
        <li>{t("quality.processBattery")}</li>
        <li>{t("quality.processButtons")}</li>
        <li>{t("quality.processChassis")}</li>
        <li>{t("quality.processReset")}</li>
        <li>{t("quality.processFinal")}</li>
      </ul>

      <h2>{t("quality.gradesContentTitle")}</h2>
      <p>{t("quality.gradesContentIntro")}</p>

      <h3>{t("quality.gradePerfectTitle")}</h3>
      <p>{t("quality.gradePerfectDesc")}</p>

      <h3>{t("quality.gradeVeryGoodTitle")}</h3>
      <p>{t("quality.gradeVeryGoodDesc")}</p>

      <h3>{t("quality.gradeGoodTitle")}</h3>
      <p>{t("quality.gradeGoodDesc")}</p>

      <h3>{t("quality.gradeImperfectTitle")}</h3>
      <p>{t("quality.gradeImperfectDesc")}</p>

      <h2>{t("quality.batteryContentTitle")}</h2>
      <p>{t("quality.batteryContentIntro")}</p>
      <ul>
        <li>{t.rich("quality.batteryOriginal", { strong })}</li>
        <li>{t.rich("quality.batteryNewOption", { strong })}</li>
      </ul>

      <h2>{t("quality.warrantyContentTitle")}</h2>
      <p>{t.rich("quality.warrantyContentP1", { strong })}</p>
      <p>{t("quality.warrantyContentP2")}</p>
    </PolicyPage>
  );
}
