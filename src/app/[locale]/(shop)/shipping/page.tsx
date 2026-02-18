import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ShippingPolicyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  return (
    <PolicyPage locale={locale} title={t("shippingPolicy")} backLabel={t("backToHome")}>
      <h2>{t("shipping.s1Title")}</h2>
      <p>{t("shipping.s1P1")}</p>

      <h2>{t("shipping.s2Title")}</h2>
      <p>{t("shipping.s2P1")}</p>
      <ul>
        <li>{t("shipping.s2Li1")}</li>
        <li>{t("shipping.s2Li2")}</li>
        <li>{t("shipping.s2Li3")}</li>
        <li>{t("shipping.s2Li4")}</li>
      </ul>

      <h2>{t("shipping.s3Title")}</h2>
      <p>{t("shipping.s3P1")}</p>

      <h2>{t("shipping.s4Title")}</h2>
      <p>{t("shipping.s4P1")}</p>

      <h2>{t("shipping.s5Title")}</h2>
      <p>{t("shipping.s5P1")}</p>

      <h2>{t("shipping.s6Title")}</h2>
      <p>{t("shipping.s6P1")}</p>

      <h2>{t("shipping.s7Title")}</h2>
      <p>{t("shipping.s7P1")}</p>

      <h2>{t("shipping.s8Title")}</h2>
      <p>{t("shipping.s8P1")}</p>

      <h2>{t("shipping.s9Title")}</h2>
      <p>{t("shipping.s9P1")}</p>
    </PolicyPage>
  );
}
