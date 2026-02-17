import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";
import { ClipboardCheck, Eye, Battery, ShieldCheck } from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function QualityPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  return (
    <PolicyPage locale={locale} title={t("qualityTitle")} backLabel={t("backToHome")}>
      {/* Quality pillars */}
      <div className="not-prose mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <ClipboardCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("quality.checkpointsTitle")}</h3>
          <p className="text-sm text-gray-600">{t("quality.checkpointsDesc")}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <Eye className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("quality.gradesTitle")}</h3>
          <p className="text-sm text-gray-600">{t("quality.gradesDesc")}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <Battery className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("quality.batteryTitle")}</h3>
          <p className="text-sm text-gray-600">{t("quality.batteryDesc")}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-highlight/10">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mb-1 font-display font-semibold text-gray-900">{t("quality.warrantyTitle")}</h3>
          <p className="text-sm text-gray-600">{t("quality.warrantyDesc")}</p>
        </div>
      </div>

      <h2>Notre processus de controle</h2>
      <p>
        Chaque appareil qui entre dans notre atelier passe par un processus
        rigoureux de <strong>24 points de controle</strong>. Ce n&apos;est pas un
        simple test d&apos;allumage : nous verifions chaque composant, chaque
        fonctionnalite, chaque detail.
      </p>
      <ul>
        <li>Test complet de l&apos;ecran (tactile, affichage, pixels)</li>
        <li>Verification des capteurs (Face ID, Touch ID, accelerometre, gyroscope)</li>
        <li>Test audio (haut-parleur, micro, ecouteur)</li>
        <li>Verification camera (avant, arriere, autofocus, stabilisation)</li>
        <li>Test de connectivite (Wi-Fi, Bluetooth, reseau cellulaire, GPS)</li>
        <li>Verification de la batterie (capacite, cycles de charge)</li>
        <li>Test des boutons physiques et du vibreur</li>
        <li>Verification du chassis et de l&apos;etancheite</li>
        <li>Reinitialisation complete et mise a jour logicielle</li>
        <li>Controle final et mise en boite</li>
      </ul>

      <h2>Nos grades cosmetiques</h2>
      <p>
        Chez DBC, pas de surprise. Chaque appareil est classe selon son etat
        cosmetique reel, avec des photos du produit que vous recevrez.
      </p>

      <h3>Parfait</h3>
      <p>
        Aucune trace visible a l&apos;oeil nu. L&apos;appareil est dans un etat
        quasi neuf. Ideal si l&apos;esthetique est votre priorite.
      </p>

      <h3>Tres bon</h3>
      <p>
        De legeres micro-rayures visibles uniquement sous un certain angle de
        lumiere. L&apos;appareil reste en excellent etat general.
      </p>

      <h3>Correct</h3>
      <p>
        Des traces d&apos;utilisation visibles (rayures legeres sur l&apos;ecran
        ou le chassis). Le meilleur rapport qualite-prix, avec un fonctionnement
        parfait.
      </p>

      <h3>Imparfait</h3>
      <p>
        Des marques d&apos;usure plus prononcees (rayures, petits impacts). Le
        prix le plus bas pour un appareil 100 % fonctionnel.
      </p>

      <h2>La batterie</h2>
      <p>
        La batterie est un element cle de l&apos;experience utilisateur. C&apos;est
        pourquoi nous vous donnons le choix :
      </p>
      <ul>
        <li>
          <strong>Batterie d&apos;origine</strong> &mdash; Testee et certifiee avec
          une capacite minimale de 80 %.
        </li>
        <li>
          <strong>Batterie neuve</strong> &mdash; Remplacement par une batterie
          neuve pour une autonomie maximale (option disponible sur chaque produit).
        </li>
      </ul>

      <h2>Garantie 24 mois</h2>
      <p>
        Tous nos produits beneficient d&apos;une <strong>garantie commerciale de
        24 mois</strong>, soit 12 mois de plus que la majorite du marche. Cette
        garantie couvre les defauts techniques internes, les dysfonctionnements
        soudains et imprevisibles, pieces et main-d&apos;oeuvre incluses.
      </p>
      <p>
        En cas de probleme, notre SAV repond sous 4 h ouvrees et prend en charge
        l&apos;integralite de la reparation ou du remplacement.
      </p>
    </PolicyPage>
  );
}
