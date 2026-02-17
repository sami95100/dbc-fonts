import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";
import { MapPin, Users, Leaf, ShieldCheck } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  return (
    <PolicyPage locale={locale} title={t("aboutTitle")} backLabel={t("backToHome")}>
      {/* Mission cards */}
      <div className="not-prose mb-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("about.storesTitle")}</h3>
          <p className="text-sm text-gray-600">{t("about.storesDesc")}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <Users className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("about.teamTitle")}</h3>
          <p className="text-sm text-gray-600">{t("about.teamDesc")}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <Leaf className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("about.planetTitle")}</h3>
          <p className="text-sm text-gray-600">{t("about.planetDesc")}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("about.warrantyTitle")}</h3>
          <p className="text-sm text-gray-600">{t("about.warrantyDesc")}</p>
        </div>
      </div>

      <h2>Notre histoire</h2>
      <p>
        DBC est ne d&apos;un constat simple : acheter un smartphone reconditionne
        de qualite ne devrait pas etre complique. Trop souvent, les clients font
        face a des descriptions vagues, des etats cosmetiques trompeurs et un SAV
        inexistant.
      </p>
      <p>
        C&apos;est pourquoi nous avons cree DBC : une marque qui place la
        transparence et la qualite au centre de tout. Chaque appareil passe par
        notre processus de controle en 24 points avant d&apos;arriver entre vos
        mains.
      </p>

      <h2>Notre mission</h2>
      <p>
        <strong>On fait bouger l&apos;industrie.</strong> Notre objectif est de
        rendre le reconditionne accessible a tous, sans compromis sur la qualite.
        Nous croyons qu&apos;il est possible de proposer des smartphones premium a
        des prix justes, tout en ayant un impact positif sur l&apos;environnement.
      </p>

      <h2>Nos valeurs</h2>
      <ul>
        <li>
          <strong>Simple</strong> &mdash; Pas de jargon, pas de surprise. On vous
          dit exactement ce que vous achetez.
        </li>
        <li>
          <strong>Inspirant</strong> &mdash; Le futur, entre vos mains. Choisir le
          reconditionne, c&apos;est choisir un mode de consommation plus
          intelligent.
        </li>
        <li>
          <strong>Fort</strong> &mdash; 24 mois de garantie, 30 jours pour
          changer d&apos;avis, et un SAV qui repond vraiment.
        </li>
      </ul>

      <h2>Nos magasins</h2>
      <p>
        DBC, c&apos;est 11 magasins physiques en France. Vous pouvez venir
        decouvrir nos produits, les tester sur place et repartir avec votre
        nouveau telephone le jour meme. Nos equipes en boutique sont la pour vous
        conseiller et repondre a toutes vos questions.
      </p>
    </PolicyPage>
  );
}
