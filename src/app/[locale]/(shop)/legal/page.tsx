import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function LegalNoticePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  return (
    <PolicyPage locale={locale} title={t("legalNotice")} backLabel={t("backToHome")}>
      <h2>{t("legal.identityTitle")}</h2>
      <table>
        <tbody>
          <tr>
            <td><strong>{t("legal.companyName")}</strong></td>
            <td>{t("legal.companyNameValue")}</td>
          </tr>
          <tr>
            <td><strong>{t("legal.legalForm")}</strong></td>
            <td>{t("legal.legalFormValue")}</td>
          </tr>
          <tr>
            <td><strong>{t("legal.shareCapital")}</strong></td>
            <td>{t("legal.shareCapitalValue")}</td>
          </tr>
          <tr>
            <td><strong>{t("legal.headquarters")}</strong></td>
            <td>{t("legal.headquartersValue")}</td>
          </tr>
          <tr>
            <td><strong>{t("legal.rcs")}</strong></td>
            <td>{t("legal.rcsValue")}</td>
          </tr>
          <tr>
            <td><strong>{t("legal.vat")}</strong></td>
            <td>{t("legal.vatValue")}</td>
          </tr>
          <tr>
            <td><strong>{t("legal.director")}</strong></td>
            <td>{t("legal.directorValue")}</td>
          </tr>
          <tr>
            <td><strong>{t("legal.contactLabel")}</strong></td>
            <td>{t("legal.contactValue")}</td>
          </tr>
        </tbody>
      </table>

      <h2>{t("legal.ipTitle")}</h2>
      <p>{t("legal.ipP1")}</p>

      <h2>{t("legal.dataTitle")}</h2>
      <p>{t("legal.dataP1")}</p>

      <h2>{t("legal.cookiesTitle")}</h2>
      <p>{t("legal.cookiesP1")}</p>

      <h2>{t("legal.linksTitle")}</h2>
      <p>{t("legal.linksP1")}</p>

      <h2>{t("legal.liabilityTitle")}</h2>
      <p>{t("legal.liabilityP1")}</p>

      <h2>{t("legal.lawTitle")}</h2>
      <p>{t("legal.lawP1")}</p>
    </PolicyPage>
  );
}
