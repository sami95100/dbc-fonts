import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function RefundPolicyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  return (
    <PolicyPage
      locale={locale}
      title={t("refundPolicy")}
      backLabel={t("backToHome")}
      lastUpdated={t("lastUpdated", { date: t("lastUpdatedDateJuly2025") })}
    >
      <p className="text-lg font-medium">{t("refund.intro")}</p>

      <h2>{t("refund.s1Title")}</h2>
      <p>{t.rich("refund.s1P1", { strong })}</p>
      <ul>
        <li>{t("refund.s1Li1")}</li>
        <li>{t("refund.s1Li2")}</li>
        <li>{t("refund.s1Li3")}</li>
      </ul>

      <h2>{t("refund.s2Title")}</h2>
      <p>{t("refund.s2P1")}</p>
      <ul>
        <li>{t.rich("refund.s2Li1", { strong })}</li>
        <li>{t.rich("refund.s2Li2", { strong })}</li>
        <li>{t.rich("refund.s2Li3", { strong })}</li>
      </ul>
      <p>{t.rich("refund.s2P2", { strong })}</p>

      <h2>{t("refund.s3Title")}</h2>
      <ul>
        <li>{t.rich("refund.s3Li1", { strong })}</li>
        <li>{t.rich("refund.s3Li2", { strong })}</li>
        <li>{t("refund.s3Li3")}</li>
        <li>{t("refund.s3Li4")}</li>
        <li>{t("refund.s3Li5")}</li>
      </ul>

      <h2>{t("refund.s4Title")}</h2>
      <table>
        <caption className="sr-only">{t("refund.s4Caption")}</caption>
        <thead>
          <tr>
            <th>{t("refund.s4ThMethod")}</th>
            <th>{t("refund.s4ThTrigger")}</th>
            <th>{t("refund.s4ThBank")}</th>
            <th>{t("refund.s4ThSupport")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t("refund.s4Row1Method")}</td>
            <td>{t("refund.s4Row1Trigger")}</td>
            <td>{t("refund.s4Row1Bank")}</td>
            <td>{t("refund.s4Row1Support")}</td>
          </tr>
          <tr>
            <td>{t("refund.s4Row2Method")}</td>
            <td>{t("refund.s4Row2Trigger")}</td>
            <td>{t("refund.s4Row2Bank")}</td>
            <td>{t("refund.s4Row2Support")}</td>
          </tr>
          <tr>
            <td>{t("refund.s4Row3Method")}</td>
            <td>{t("refund.s4Row3Trigger")}</td>
            <td>{t("refund.s4Row3Bank")}</td>
            <td>{t("refund.s4Row3Support")}</td>
          </tr>
        </tbody>
      </table>
      <p>{t("refund.s4P1")}</p>

      <h2>{t("refund.s5Title")}</h2>
      <p>{t.rich("refund.s5P1", { strong })}</p>
      <h3>{t("refund.s5CoveredTitle")}</h3>
      <ul>
        <li>{t("refund.s5CoveredLi1")}</li>
        <li>{t("refund.s5CoveredLi2")}</li>
        <li>{t("refund.s5CoveredLi3")}</li>
      </ul>
      <h3>{t("refund.s5ExcludedTitle")}</h3>
      <ul>
        <li>{t("refund.s5ExcludedLi1")}</li>
        <li>{t("refund.s5ExcludedLi2")}</li>
        <li>{t("refund.s5ExcludedLi3")}</li>
      </ul>
      <p>{t("refund.s5P2")}</p>
      <p>{t("refund.s5P3")}</p>

      <h2>{t("refund.s6Title")}</h2>
      <ul>
        <li>{t.rich("refund.s6Li1", { strong })}</li>
        <li>{t.rich("refund.s6Li2", { strong })}</li>
        <li>{t.rich("refund.s6Li3", { strong })}</li>
      </ul>

      <h2>{t("refund.s7Title")}</h2>
      <p>{t("refund.s7P1")}</p>

      <h2>{t("refund.s8Title")}</h2>
      <ul>
        <li>{t.rich("refund.s8Li1", { strong })}</li>
        <li>{t.rich("refund.s8Li2", { strong })}</li>
        <li>{t.rich("refund.s8Li3", { strong })}</li>
      </ul>
      <p>{t("refund.s8P1")}</p>
    </PolicyPage>
  );
}
