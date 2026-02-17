import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function TermsOfSalePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  return (
    <PolicyPage
      locale={locale}
      title={t("termsOfSale")}
      backLabel={t("backToHome")}
      lastUpdated={t("lastUpdated", { date: t("lastUpdatedDateJuly2025") })}
    >
      <p className="text-lg font-medium">
        Chez DBC, chaque ligne de ces CGV est pensee pour vous simplifier la vie :
        des tarifs transparents, un service client humain et des interventions eclair
        sur vos appareils reconditionnes.
      </p>

      <h2>0. Identite du vendeur</h2>
      <p>
        <strong>DBC PARIS 17 BIS</strong>, SAS immatriculee au RCS Paris 922 178 488,
        TVA FR28922178488, siege social 110 avenue de Villiers, 75017 Paris.
      </p>
      <p>
        Service client : WhatsApp (icone sur le site) &mdash; reponse &lt; 4 h ouvrees |
        Tel. 07 43 39 66 69 &mdash; reponse &lt; 1 h ouvree |
        E-mail : contact@dbcstore.fr &mdash; reponse &lt; 24 h ouvrees
      </p>

      <h2>1. Champ d&apos;application et acceptation</h2>
      <p>
        Les presentes Conditions Generales de Vente (CGV) s&apos;appliquent a toute commande
        passee sur dbcstore.fr. En confirmant votre achat, vous acceptez sans reserve ces CGV.
      </p>

      <h2>2. Definitions</h2>
      <ul>
        <li><strong>Acheteur</strong> : toute personne (consommateur ou pro) achetant un Produit pour un usage non commercial.</li>
        <li><strong>Produits</strong> : appareils electroniques reconditionnes ou neufs, accessoires et services associes.</li>
        <li><strong>Plateforme</strong> : site dbcstore.fr</li>
      </ul>

      <h2>3. Creation de compte et commande</h2>
      <p>
        Creer un compte est recommande mais jamais obligatoire : vous pouvez passer commande
        en mode &laquo; invite &raquo;.
      </p>
      <p>
        Parcours express : selection &bull; panier &bull; livraison/paiement &bull; validation.
        Le paiement vaut engagement de payer.
      </p>
      <p>
        Nous confirmons la disponibilite en moins de 24 h. Si un Produit est finalement
        indisponible, nous annulons et remboursons immediatement.
      </p>

      <h2>4. Prix et modalites de paiement</h2>
      <ul>
        <li>Prix en euros TTC, affiches hors frais de livraison eventuels.</li>
        <li>Moyens acceptes : CB (Visa, MasterCard), virement SEPA.</li>
        <li>Le debit intervient a l&apos;expedition ou au retrait, jamais avant que votre colis ne bouge.</li>
      </ul>

      <h2>5. Livraison et retrait</h2>
      <table>
        <caption className="sr-only">Options de livraison et retrait</caption>
        <thead>
          <tr>
            <th>Option</th>
            <th>Delai indicatif</th>
            <th>Tarif</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Retrait atelier DBC</td>
            <td>2 h max apres notification</td>
            <td>Gratuit</td>
          </tr>
          <tr>
            <td>Colissimo domicile</td>
            <td>48-72 h</td>
            <td>Affiche avant paiement</td>
          </tr>
          <tr>
            <td>Mondial Relay</td>
            <td>48-72 h</td>
            <td>Affiche avant paiement</td>
          </tr>
        </tbody>
      </table>
      <p>
        La propriete et les risques vous sont transferes a la remise physique du colis,
        une fois le paiement integral recu.
      </p>

      <h2>6. Droit de retractation &mdash; 30 jours</h2>
      <p>
        Vous disposez de <strong>30 jours</strong> pour changer d&apos;avis. Un WhatsApp,
        un appel ou un e-mail suffit et nous vous expedions une etiquette pre-payee dans
        les 4 h ouvrees. Vous avez ensuite 14 jours pour expedier le Produit dans son
        etat d&apos;origine.
      </p>
      <p>
        Nous remboursons sous 14 jours maximum apres reception, frais de port initiaux inclus.
      </p>
      <p>
        Exceptions : articles personnalises, ecouteurs intra-auriculaires ouverts,
        accessoires scelles descelles.
      </p>

      <h2>7. Garanties</h2>
      <h3>7.1 Garanties legales</h3>
      <ul>
        <li><strong>Conformite</strong> : 2 ans (1 an pour les biens d&apos;occasion).</li>
        <li><strong>Vices caches</strong> : 2 ans a compter de la decouverte.</li>
      </ul>

      <h3>7.2 Garantie commerciale DBC &mdash; 24 mois</h3>
      <ul>
        <li><strong>Interventions instantanees</strong> : 90 % des reparations ou echanges se font sur-le-champ en atelier.</li>
        <li><strong>Engagement maximum</strong> : jamais plus de 3 jours ouvres pour solutionner un probleme, pieces d&apos;origine incluses.</li>
        <li><strong>Zero frais</strong> : transport, diagnostics et main-d&apos;oeuvre pris en charge par DBC.</li>
        <li><strong>Plan B</strong> : si la reparation est impossible ou depasse 3 jours, vous choisissez entre remplacement equivalent, avoir 12 mois ou remboursement integral.</li>
      </ul>
      <p>Exclusions : oxydation, casse, usure normale batterie, utilisation non conforme.</p>

      <h2>8. Service apres-vente et reclamations</h2>
      <p>
        Un souci ? Contactez-nous via WhatsApp, telephone ou e-mail.
        Reponse garantie &lt; 24 h ouvrees.
      </p>
      <p>
        En cas de desaccord persistant, vous pouvez saisir le Mediateur du e-commerce FEVAD
        ou la plateforme RLL de la Commission europeenne.
      </p>

      <h2>9. Responsabilite</h2>
      <p>
        DBC repond de la bonne execution du contrat, sauf force majeure ou mauvaise
        utilisation manifeste du Produit.
      </p>

      <h2>10. Donnees personnelles</h2>
      <p>
        Nous protegeeons vos donnees : traitements limites, chiffres et respectueux du RGPD.
        Vos droits s&apos;exercent a privacy@dbcstore.fr.
      </p>

      <h2>11. Propriete intellectuelle</h2>
      <p>
        Tout le contenu (logos, textes, photos) appartient a DBC ou ses partenaires.
      </p>

      <h2>12. Droit applicable &amp; reglement des litiges</h2>
      <p>
        Le droit francais s&apos;applique. Les tribunaux competents seront ceux designes
        par le Code de procedure civile si aucune solution amiable n&apos;aboutit.
      </p>
    </PolicyPage>
  );
}
