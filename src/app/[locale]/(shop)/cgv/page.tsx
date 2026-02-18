import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function TermsOfSalePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  return (
    <PolicyPage
      locale={locale}
      title={t("termsOfSale")}
      backLabel={t("backToHome")}
      lastUpdated={t("lastUpdated", { date: t("lastUpdatedDateJuly2025") })}
    >
      <p className="text-lg font-medium">{t("cgv.intro")}</p>

      <h2>{t("cgv.s0Title")}</h2>
      <p>{t.rich("cgv.s0P1", { strong })}</p>
      <p>{t("cgv.s0P2")}</p>

      <h2>{t("cgv.s1Title")}</h2>
      <p>{t("cgv.s1P1")}</p>

      <h2>{t("cgv.s2Title")}</h2>
      <ul>
        <li>{t.rich("cgv.s2Li1", { strong })}</li>
        <li>{t.rich("cgv.s2Li2", { strong })}</li>
        <li>{t.rich("cgv.s2Li3", { strong })}</li>
      </ul>

      <h2>{t("cgv.s3Title")}</h2>
      <p>{t("cgv.s3P1")}</p>
      <p>{t("cgv.s3P2")}</p>
      <p>{t("cgv.s3P3")}</p>

      <h2>{t("cgv.s4Title")}</h2>
      <ul>
        <li>{t("cgv.s4Li1")}</li>
        <li>{t("cgv.s4Li2")}</li>
        <li>{t("cgv.s4Li3")}</li>
      </ul>

      <h2>{t("cgv.s5Title")}</h2>
      <table>
        <caption className="sr-only">{t("cgv.s5Caption")}</caption>
        <thead>
          <tr>
            <th>{t("cgv.s5ThOption")}</th>
            <th>{t("cgv.s5ThDelay")}</th>
            <th>{t("cgv.s5ThPrice")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t("cgv.s5Row1Option")}</td>
            <td>{t("cgv.s5Row1Delay")}</td>
            <td>{t("cgv.s5Row1Price")}</td>
          </tr>
          <tr>
            <td>{t("cgv.s5Row2Option")}</td>
            <td>{t("cgv.s5Row2Delay")}</td>
            <td>{t("cgv.s5Row2Price")}</td>
          </tr>
          <tr>
            <td>{t("cgv.s5Row3Option")}</td>
            <td>{t("cgv.s5Row3Delay")}</td>
            <td>{t("cgv.s5Row3Price")}</td>
          </tr>
        </tbody>
      </table>
      <p>{t("cgv.s5P1")}</p>

      <h2>{t("cgv.s6Title")}</h2>
      <p>{t.rich("cgv.s6P1", { strong })}</p>
      <p>{t("cgv.s6P2")}</p>
      <p>{t("cgv.s6P3")}</p>

      <h2>{t("cgv.s7Title")}</h2>
      <h3>{t("cgv.s7_1Title")}</h3>
      <ul>
        <li>{t.rich("cgv.s7_1Li1", { strong })}</li>
        <li>{t.rich("cgv.s7_1Li2", { strong })}</li>
      </ul>

      <h3>{t("cgv.s7_2Title")}</h3>
      <ul>
        <li>{t.rich("cgv.s7_2Li1", { strong })}</li>
        <li>{t.rich("cgv.s7_2Li2", { strong })}</li>
        <li>{t.rich("cgv.s7_2Li3", { strong })}</li>
        <li>{t.rich("cgv.s7_2Li4", { strong })}</li>
      </ul>
      <p>{t("cgv.s7_2Exclusions")}</p>

      <h2>{t("cgv.s8Title")}</h2>
      <p>{t("cgv.s8P1")}</p>
      <p>{t("cgv.s8P2")}</p>

      <h2>{t("cgv.s9Title")}</h2>
      <p>{t("cgv.s9P1")}</p>

      <h2>{t("cgv.s10Title")}</h2>
      <p>{t("cgv.s10P1")}</p>

      <h2>{t("cgv.s11Title")}</h2>
      <p>{t("cgv.s11P1")}</p>

      <h2>{t("cgv.s12Title")}</h2>
      <p>{t("cgv.s12P1")}</p>
    </PolicyPage>
  );
}
