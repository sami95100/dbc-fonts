import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  return (
    <PolicyPage
      locale={locale}
      title={t("privacyTitle")}
      backLabel={t("backToHome")}
      lastUpdated={t("lastUpdated", { date: t("lastUpdatedDateJuly2025") })}
    >
      <h2>{t("privacy.responsibleTitle")}</h2>
      <p>{t("privacy.responsibleP1")}</p>
      <p>{t.rich("privacy.responsibleEmail", { link: (chunks) => <a href="mailto:contact@dbcstore.fr">{chunks}</a> })}</p>

      <h2>{t("privacy.collectedTitle")}</h2>
      <p>{t("privacy.collectedIntro")}</p>
      <ul>
        <li>{t.rich("privacy.collectedId", { strong })}</li>
        <li>{t.rich("privacy.collectedOrder", { strong })}</li>
        <li>{t.rich("privacy.collectedNav", { strong })}</li>
      </ul>

      <h2>{t("privacy.purposeTitle")}</h2>
      <p>{t("privacy.purposeIntro")}</p>
      <ul>
        <li>{t("privacy.purposeAccount")}</li>
        <li>{t("privacy.purposeDelivery")}</li>
        <li>{t("privacy.purposeAfterSales")}</li>
        <li>{t("privacy.purposeMarketing")}</li>
        <li>{t("privacy.purposeImprovement")}</li>
        <li>{t("privacy.purposeLegal")}</li>
      </ul>

      <h2>{t("privacy.legalBasisTitle")}</h2>
      <p>{t("privacy.legalBasisP1")}</p>

      <h2>{t("privacy.retentionTitle")}</h2>
      <ul>
        <li>{t.rich("privacy.retentionClients", { strong })}</li>
        <li>{t.rich("privacy.retentionOrders", { strong })}</li>
        <li>{t.rich("privacy.retentionCookies", { strong })}</li>
      </ul>

      <h2>{t("privacy.cookiesTitle")}</h2>
      <p>{t("privacy.cookiesP1")}</p>

      <h2>{t("privacy.sharingTitle")}</h2>
      <p>{t("privacy.sharingIntro")}</p>
      <ul>
        <li>{t("privacy.sharingPayment")}</li>
        <li>{t("privacy.sharingCarriers")}</li>
        <li>{t("privacy.sharingHosting")}</li>
        <li>{t("privacy.sharingDatabase")}</li>
      </ul>
      <p>{t("privacy.sharingNoSell")}</p>

      <h2>{t("privacy.rightsTitle")}</h2>
      <p>{t("privacy.rightsIntro")}</p>
      <ul>
        <li>{t.rich("privacy.rightAccess", { strong })}</li>
        <li>{t.rich("privacy.rightRectification", { strong })}</li>
        <li>{t.rich("privacy.rightErasure", { strong })}</li>
        <li>{t.rich("privacy.rightPortability", { strong })}</li>
        <li>{t.rich("privacy.rightObjection", { strong })}</li>
        <li>{t.rich("privacy.rightRestriction", { strong })}</li>
      </ul>
      <p>{t.rich("privacy.rightsExercise", { link: (chunks) => <a href="mailto:contact@dbcstore.fr">{chunks}</a> })}</p>

      <h2>{t("privacy.complaintTitle")}</h2>
      <p>{t.rich("privacy.complaintP1", { cnil: (chunks) => <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">{chunks}</a> })}</p>
    </PolicyPage>
  );
}
