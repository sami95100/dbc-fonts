import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function RefundPolicyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  return (
    <PolicyPage
      locale={locale}
      title={t("refundPolicy")}
      backLabel={t("backToHome")}
      lastUpdated={t("lastUpdated", { date: t("lastUpdatedDateJuly2025") })}
    >
      <p className="text-lg font-medium">
        Chez DBC, nous voulons offrir une experience plus simple et plus flexible
        que ce que proposent la plupart des places de marche du reconditionne.
        Si un appareil ne vous convient pas, nous mettons tout en oeuvre pour que
        le retour, l&apos;echange ou le remboursement se fasse sans friction.
      </p>

      <h2>1. Droit de retractation &mdash; 30 jours pour changer d&apos;avis</h2>
      <p>
        Vous disposez de <strong>30 jours calendaires</strong> a compter de la reception
        de votre produit pour exercer votre droit de retractation, sans avoir a motiver
        votre decision.
      </p>
      <ul>
        <li>Le jour de livraison n&apos;est pas compte.</li>
        <li>Si l&apos;echeance tombe un samedi, dimanche ou jour ferie, elle est reportee au jour ouvre suivant.</li>
        <li>Aucun frais ne vous sera facture : l&apos;etiquette de transport retour et l&apos;assurance sont integralement prises en charge par DBC Store.</li>
      </ul>

      <h2>2. Comment declencher un retour ?</h2>
      <p>Inutile de remplir un long formulaire &mdash; deux solutions rapides :</p>
      <ul>
        <li><strong>WhatsApp</strong> : cliquez sur l&apos;icone verte presente dans le coin inferieur droit de chaque page, puis envoyez simplement votre numero de commande.</li>
        <li><strong>Appel</strong> : appelez-nous au 07 43 39 66 69.</li>
        <li><strong>E-mail</strong> : ecrivez-nous a contact@dbcstore.fr avec en objet &laquo; Retour &ndash; N&deg; de commande XXXX &raquo;.</li>
      </ul>
      <p>
        Nous repondons sous <strong>4 heures ouvrees</strong> avec : votre etiquette
        pre-payee (Colissimo ou Mondial Relay, selon votre preference), le guide de
        preparation colis, et la date d&apos;enlevement proposee.
      </p>

      <h2>3. Preparation de l&apos;appareil avant expedition</h2>
      <ul>
        <li><strong>Sauvegardez</strong> vos donnees et <strong>reinitialisez</strong> l&apos;appareil.</li>
        <li><strong>Dissociez</strong> tout compte (iCloud, Google, Samsung) et <strong>supprimez l&apos;eSIM</strong>.</li>
        <li>Glissez dans le colis : numero de commande, date, nom, prenom (ou la facture imprimee).</li>
        <li>Utilisez un carton rigide, du papier bulle ou de la mousse. Les enveloppes a bulles sont refusees.</li>
        <li>Photographiez l&apos;appareil et le colis ferme ; conservez les cliches jusqu&apos;a la cloture du dossier.</li>
      </ul>

      <h2>4. Remboursements : modalites et delais</h2>
      <table>
        <caption className="sr-only">Modalites et delais de remboursement</caption>
        <thead>
          <tr>
            <th>Mode de paiement</th>
            <th>Declenchement DBC</th>
            <th>Delai bancaire</th>
            <th>Support</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Carte bancaire</td>
            <td>&le; 2 jours ouvres</td>
            <td>~5 jours ouvres</td>
            <td>Meme carte</td>
          </tr>
          <tr>
            <td>PayPal</td>
            <td>&le; 2 jours ouvres</td>
            <td>~5 jours ouvres</td>
            <td>Meme compte</td>
          </tr>
          <tr>
            <td>Virement SEPA</td>
            <td>&le; 2 jours ouvres</td>
            <td>~3 jours ouvres</td>
            <td>IBAN fourni</td>
          </tr>
        </tbody>
      </table>
      <p>
        Le delai commence des la confirmation de reception dans notre entrepot.
        Vous recevrez un e-mail de confirmation et la mise a jour dans &laquo; Mon compte &raquo;.
      </p>

      <h2>5. Garantie commerciale &mdash; 24 mois</h2>
      <p>
        Tous les produits reconditionnes vendus par DBC Store sont couverts par une
        <strong> garantie commerciale de 24 mois</strong>, soit 12 mois de plus que
        la majorite des acteurs du secteur.
      </p>
      <h3>Sont couverts</h3>
      <ul>
        <li>Defauts techniques internes</li>
        <li>Dysfonctionnements soudains et imprevisibles</li>
        <li>Pieces et main-d&apos;oeuvre</li>
      </ul>
      <h3>Exclusions</h3>
      <ul>
        <li>Usure normale (batterie)</li>
        <li>Oxydation ou dommages liquides</li>
        <li>Casse ou choc physique</li>
      </ul>
      <p>
        Nous privilegions la reparation rapide (&le; 3 jours ouvres pour smartphones/tablettes,
        &le; 5 jours ouvres pour ordinateurs). Si la reparation est impossible ou depasse
        10 jours ouvres, vous pouvez choisir entre un remplacement equivalent, un avoir
        valable 12 mois, ou un remboursement integral.
      </p>
      <p>
        Les frais de transport lies aux interventions sous garantie sont entierement
        pris en charge par DBC.
      </p>

      <h2>6. Exceptions &amp; ajustements de remboursement</h2>
      <ul>
        <li><strong>Accessoires manquants</strong> : retenue du montant catalogue.</li>
        <li><strong>Depreciation suite a mauvaise manipulation</strong> : devis de remise en etat envoye avant deduction.</li>
        <li><strong>Produits personnalises</strong> (gravure, configuration logicielle specifique) : droit de retractation limite a la valeur du materiel brut.</li>
      </ul>

      <h2>7. Colis perdu ou retarde</h2>
      <p>
        Si le transporteur n&apos;a pas scanne votre retour dans les 10 jours ouvres,
        contactez-nous ; nous lancerons soit un nouvel envoi, soit votre remboursement
        integral apres enquete.
      </p>

      <h2>8. Service client</h2>
      <ul>
        <li><strong>WhatsApp</strong> : icone verte sur le site (reponse &lt; 4 h ouvrees)</li>
        <li><strong>Appel</strong> : 07 43 39 66 69 (reponse &lt; 1 h ouvrees)</li>
        <li><strong>E-mail</strong> : contact@dbcstore.fr (reponse &lt; 24 h ouvrees)</li>
      </ul>
      <p>Notre equipe est disponible du lundi au vendredi, 9 h &ndash; 19 h (heure de Paris).</p>
    </PolicyPage>
  );
}
