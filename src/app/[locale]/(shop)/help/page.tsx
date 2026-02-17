import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";
import { MessageCircle, Phone, Mail, Clock } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  return (
    <PolicyPage locale={locale} title={t("faq")} backLabel={t("backToHome")}>
      <div className="not-prose mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a href="https://wa.me/33743396669" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-gray-200 p-5 transition-colors hover:border-gray-300">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <MessageCircle className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-semibold text-gray-900">WhatsApp</h3>
          <p className="text-sm text-gray-600">+33 7 43 39 66 69</p>
          <p className="text-xs text-gray-500">Reponse &lt; 4 h ouvrees</p>
        </a>
        <a href="tel:+33743396669" className="rounded-xl border border-gray-200 p-5 transition-colors hover:border-gray-300">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-semibold text-gray-900">Telephone</h3>
          <p className="text-sm text-gray-600">07 43 39 66 69</p>
          <p className="text-xs text-gray-500">Reponse &lt; 1 h ouvree</p>
        </a>
        <a href="mailto:contact@dbcstore.fr" className="rounded-xl border border-gray-200 p-5 transition-colors hover:border-gray-300">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-semibold text-gray-900">Email</h3>
          <p className="text-sm text-gray-600">contact@dbcstore.fr</p>
          <p className="text-xs text-gray-500">Reponse &lt; 24 h ouvrees</p>
        </a>
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-semibold text-gray-900">Horaires</h3>
          <p className="text-sm text-gray-600">Lundi - Vendredi</p>
          <p className="text-xs text-gray-500">9 h &ndash; 19 h (heure de Paris)</p>
        </div>
      </div>

      <h2>Livraison</h2>
      <h3>Quels sont les delais de livraison ?</h3>
      <p>
        Nous expedions sous 24 h ouvrees. La livraison Colissimo ou Mondial Relay
        prend generalement 48 a 72 h. Vous pouvez aussi retirer votre commande
        en atelier sous 2 h apres notification.
      </p>

      <h3>La livraison est-elle gratuite ?</h3>
      <p>
        Les frais de livraison sont affiches avant le paiement. Le retrait en
        atelier DBC est toujours gratuit.
      </p>

      <h2>Retours &amp; remboursements</h2>
      <h3>Combien de temps ai-je pour retourner un produit ?</h3>
      <p>
        Vous disposez de <strong>30 jours calendaires</strong> a compter de la reception
        pour exercer votre droit de retractation. L&apos;etiquette de retour est gratuite
        et prise en charge par DBC.
      </p>

      <h3>Comment declencher un retour ?</h3>
      <p>
        Contactez-nous par WhatsApp, telephone ou email avec votre numero de commande.
        Nous vous envoyons une etiquette pre-payee sous 4 h ouvrees.
      </p>

      <h3>En combien de temps suis-je rembourse ?</h3>
      <p>
        Le remboursement est declenche sous 2 jours ouvres apres reception de votre
        retour. Le delai bancaire est d&apos;environ 3 a 5 jours ouvres supplementaires.
      </p>

      <h2>Garantie</h2>
      <h3>Quelle est la duree de la garantie ?</h3>
      <p>
        Tous nos produits reconditionnes beneficient d&apos;une <strong>garantie commerciale
        de 24 mois</strong>, soit 12 mois de plus que la majorite du marche.
      </p>

      <h3>Que couvre la garantie ?</h3>
      <p>
        La garantie couvre les defauts techniques internes, les dysfonctionnements
        soudains et imprevisibles, pieces et main-d&apos;oeuvre incluses.
        Elle ne couvre pas l&apos;usure normale, l&apos;oxydation ou la casse.
      </p>

      <h2>Paiement</h2>
      <h3>Quels moyens de paiement acceptez-vous ?</h3>
      <p>
        Nous acceptons les cartes bancaires (Visa, MasterCard), PayPal et le virement SEPA.
        Le debit n&apos;intervient qu&apos;a l&apos;expedition de votre commande.
      </p>
    </PolicyPage>
  );
}
