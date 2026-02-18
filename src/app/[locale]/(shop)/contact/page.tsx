import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";
import { MessageCircle, Phone, Mail, Clock } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

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

      <h2>{t("contact.storesTitle")}</h2>
      <p>{t.rich("contact.storesDesc", { strong })}</p>

      <h2>{t("contact.afterSalesTitle")}</h2>
      <p>{t.rich("contact.afterSalesP1", { strong })}</p>
      <p>{t.rich("contact.afterSalesP2", { strong })}</p>

      <h2>{t("contact.pressTitle")}</h2>
      <p>{t.rich("contact.pressDesc", { link: (chunks) => <a href="mailto:contact@dbcstore.fr">{chunks}</a> })}</p>
    </PolicyPage>
  );
}
