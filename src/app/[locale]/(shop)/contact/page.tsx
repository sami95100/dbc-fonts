import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";
import { MessageCircle, Phone, Mail, Clock } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  return (
    <PolicyPage locale={locale} title={t("contactTitle")} backLabel={t("backToHome")}>
      {/* Contact cards */}
      <div className="not-prose mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href="https://wa.me/33743396669"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-gray-200 p-5 transition-colors hover:border-gray-300"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <MessageCircle className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("contact.whatsappTitle")}</h3>
          <p className="text-sm text-gray-600">+33 7 43 39 66 69</p>
          <p className="text-xs text-gray-500">{t("contact.whatsappResponse")}</p>
        </a>
        <a
          href="tel:+33743396669"
          className="rounded-xl border border-gray-200 p-5 transition-colors hover:border-gray-300"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("contact.phoneTitle")}</h3>
          <p className="text-sm text-gray-600">07 43 39 66 69</p>
          <p className="text-xs text-gray-500">{t("contact.phoneResponse")}</p>
        </a>
        <a
          href="mailto:contact@dbcstore.fr"
          className="rounded-xl border border-gray-200 p-5 transition-colors hover:border-gray-300"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("contact.emailTitle")}</h3>
          <p className="text-sm text-gray-600">contact@dbcstore.fr</p>
          <p className="text-xs text-gray-500">{t("contact.emailResponse")}</p>
        </a>
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("contact.hoursTitle")}</h3>
          <p className="text-sm text-gray-600">{t("contact.hoursDays")}</p>
          <p className="text-xs text-gray-500">{t("contact.hoursTime")}</p>
        </div>
      </div>

      <h2>Nos magasins</h2>
      <p>
        Retrouvez-nous dans l&apos;un de nos <strong>11 magasins physiques</strong> en
        France. Nos equipes sont disponibles pour vous conseiller, vous faire
        tester les produits et repondre a toutes vos questions.
      </p>

      <h2>Service apres-vente</h2>
      <p>
        Un probleme avec votre commande ? Notre equipe SAV est disponible du
        lundi au vendredi, de 9 h a 19 h. Le moyen le plus rapide de nous
        joindre est par <strong>WhatsApp</strong> ou par <strong>telephone</strong>.
      </p>
      <p>
        Pour toute demande concernant une commande existante, merci de nous
        communiquer votre <strong>numero de commande</strong> afin que nous
        puissions traiter votre demande le plus rapidement possible.
      </p>

      <h2>Presse &amp; partenariats</h2>
      <p>
        Pour toute demande presse ou partenariat, contactez-nous par email a
        l&apos;adresse <a href="mailto:contact@dbcstore.fr">contact@dbcstore.fr</a>.
      </p>
    </PolicyPage>
  );
}
