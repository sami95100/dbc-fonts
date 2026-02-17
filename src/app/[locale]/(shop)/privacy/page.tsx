import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  return (
    <PolicyPage
      locale={locale}
      title={t("privacyTitle")}
      backLabel={t("backToHome")}
      lastUpdated={t("lastUpdated", { date: t("lastUpdatedDateJuly2025") })}
    >
      <h2>Responsable du traitement</h2>
      <p>
        Le responsable du traitement des donnees personnelles est la societe
        DBC (Don&apos;t Be Classic), SAS au capital de 1 000 euros, immatriculee
        au RCS de Lille sous le numero 932 888 003, dont le siege social est
        situe au 73 rue Nationale, 59800 Lille.
      </p>
      <p>
        Email : <a href="mailto:contact@dbcstore.fr">contact@dbcstore.fr</a>
      </p>

      <h2>Donnees collectees</h2>
      <p>
        Dans le cadre de notre activite, nous collectons les donnees personnelles
        suivantes :
      </p>
      <ul>
        <li>
          <strong>Donnees d&apos;identification</strong> : nom, prenom, adresse
          email, numero de telephone, adresse postale.
        </li>
        <li>
          <strong>Donnees de commande</strong> : historique des commandes,
          adresses de livraison, mode de paiement utilise (sans les numeros de
          carte).
        </li>
        <li>
          <strong>Donnees de navigation</strong> : adresse IP, type de
          navigateur, pages visitees, duree des visites.
        </li>
      </ul>

      <h2>Finalites du traitement</h2>
      <p>Vos donnees personnelles sont traitees pour les finalites suivantes :</p>
      <ul>
        <li>Gestion de votre compte client et de vos commandes</li>
        <li>Livraison de vos produits</li>
        <li>Service apres-vente et gestion des retours</li>
        <li>Envoi de communications commerciales (avec votre consentement)</li>
        <li>Amelioration de nos services et de notre site web</li>
        <li>Respect de nos obligations legales et reglementaires</li>
      </ul>

      <h2>Base legale</h2>
      <p>
        Le traitement de vos donnees repose sur les bases legales suivantes :
        l&apos;execution du contrat de vente, votre consentement (pour les
        communications commerciales et les cookies non essentiels), notre interet
        legitime (amelioration des services, prevention de la fraude) et le
        respect de nos obligations legales.
      </p>

      <h2>Duree de conservation</h2>
      <ul>
        <li>
          <strong>Donnees clients</strong> : 3 ans apres la derniere commande
          ou le dernier contact.
        </li>
        <li>
          <strong>Donnees de commande</strong> : 10 ans (obligation comptable).
        </li>
        <li>
          <strong>Cookies</strong> : 13 mois maximum.
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        Notre site utilise des cookies pour assurer son bon fonctionnement et
        ameliorer votre experience. Les cookies essentiels (session, panier) sont
        necessaires au fonctionnement du site. Les cookies analytiques nous
        permettent de comprendre comment vous utilisez notre site et ne sont
        deposes qu&apos;avec votre consentement.
      </p>

      <h2>Partage des donnees</h2>
      <p>
        Vos donnees personnelles peuvent etre partagees avec les prestataires
        suivants, dans le strict cadre de l&apos;execution de nos services :
      </p>
      <ul>
        <li>Prestataires de paiement (traitement securise des transactions)</li>
        <li>Transporteurs (livraison des commandes)</li>
        <li>Hebergeur du site (Vercel)</li>
        <li>Service de base de donnees (Supabase)</li>
      </ul>
      <p>
        Nous ne vendons jamais vos donnees personnelles a des tiers.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformement au Reglement General sur la Protection des Donnees (RGPD),
        vous disposez des droits suivants :
      </p>
      <ul>
        <li><strong>Droit d&apos;acces</strong> : obtenir une copie de vos donnees personnelles.</li>
        <li><strong>Droit de rectification</strong> : corriger des donnees inexactes.</li>
        <li><strong>Droit a l&apos;effacement</strong> : demander la suppression de vos donnees.</li>
        <li><strong>Droit a la portabilite</strong> : recevoir vos donnees dans un format structure.</li>
        <li><strong>Droit d&apos;opposition</strong> : vous opposer au traitement de vos donnees.</li>
        <li><strong>Droit a la limitation</strong> : limiter le traitement de vos donnees.</li>
      </ul>
      <p>
        Pour exercer vos droits, contactez-nous par email a
        l&apos;adresse <a href="mailto:contact@dbcstore.fr">contact@dbcstore.fr</a>.
        Nous nous engageons a repondre dans un delai de 30 jours.
      </p>

      <h2>Reclamation</h2>
      <p>
        Si vous estimez que le traitement de vos donnees personnelles constitue
        une violation du RGPD, vous pouvez introduire une reclamation aupres de
        la CNIL (Commission Nationale de l&apos;Informatique et des Libertes) sur
        le site <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>.
      </p>
    </PolicyPage>
  );
}
