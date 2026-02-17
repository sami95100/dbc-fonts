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
      <h2>Identite du vendeur</h2>
      <table>
        <tbody>
          <tr>
            <td><strong>Nom de l&apos;entreprise</strong></td>
            <td>DBC Paris 17 bis</td>
          </tr>
          <tr>
            <td><strong>Forme juridique</strong></td>
            <td>SAS (Societe par Actions Simplifiee)</td>
          </tr>
          <tr>
            <td><strong>Capital social</strong></td>
            <td>100 &euro;</td>
          </tr>
          <tr>
            <td><strong>Siege social</strong></td>
            <td>110 avenue de Villiers, 75017 Paris, France</td>
          </tr>
          <tr>
            <td><strong>RCS</strong></td>
            <td>922 178 488</td>
          </tr>
          <tr>
            <td><strong>TVA intracommunautaire</strong></td>
            <td>FR28922178488</td>
          </tr>
          <tr>
            <td><strong>Directeur de la publication</strong></td>
            <td>Amarir</td>
          </tr>
          <tr>
            <td><strong>Contact</strong></td>
            <td>contact@dbcstore.fr / +33 6 95 06 48 67</td>
          </tr>
        </tbody>
      </table>

      <h2>Propriete intellectuelle</h2>
      <p>
        Le contenu du site, incluant les textes, images, graphismes, logos, icones, sons,
        logiciels, et autres elements sont la propriete exclusive de DBC Electronics, sauf
        mention contraire. Toute reproduction, distribution, modification, adaptation,
        retransmission ou publication de ces elements est strictement interdite sans
        l&apos;accord ecrit prealable de DBC Electronics.
      </p>

      <h2>Protection des donnees personnelles</h2>
      <p>
        DBC Electronics s&apos;engage a proteger la vie privee de ses utilisateurs
        conformement aux lois en vigueur sur la protection des donnees personnelles,
        notamment le RGPD. Vos droits s&apos;exercent a privacy@dbcstore.fr.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site utilise des cookies pour ameliorer l&apos;experience utilisateur, analyser le
        trafic du site et personnaliser le contenu. En utilisant notre site, vous consentez
        a l&apos;utilisation de cookies conformement a notre politique de cookies.
      </p>

      <h2>Liens hypertextes</h2>
      <p>
        Le site peut contenir des liens hypertextes vers d&apos;autres sites. DBC Electronics
        decline toute responsabilite quant au contenu de ces sites externes. Les utilisateurs
        accedent a ces liens sous leur propre responsabilite.
      </p>

      <h2>Responsabilite</h2>
      <p>
        DBC Electronics met tout en oeuvre pour fournir des informations precises et a jour
        sur son site. Toutefois, nous ne garantissons pas l&apos;exactitude, la completude ou
        l&apos;actualite des informations disponibles sur le site. DBC Electronics ne peut
        etre tenu responsable des dommages directs ou indirects resultant de l&apos;utilisation
        du site.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Les presentes mentions legales sont regies par le droit francais. En cas de litige,
        les tribunaux competents de Paris seront seuls habilites a en connaitre.
      </p>
    </PolicyPage>
  );
}
