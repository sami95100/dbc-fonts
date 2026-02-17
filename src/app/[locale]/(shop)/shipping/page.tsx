import { getTranslations } from "next-intl/server";
import { PolicyPage } from "@/components/layout/PolicyPage";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ShippingPolicyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  return (
    <PolicyPage locale={locale} title={t("shippingPolicy")} backLabel={t("backToHome")}>
      <h2>1. Acceptation des conditions</h2>
      <p>
        En utilisant ce site, vous acceptez les presentes conditions d&apos;utilisation
        dans leur integralite. Nous nous reservons le droit de modifier ces conditions
        a tout moment, et ces modifications prendront effet immediatement apres leur
        publication sur le site. Il est de votre responsabilite de consulter regulierement
        ces conditions pour etre informe de toute modification.
      </p>

      <h2>2. Utilisation du site</h2>
      <p>
        Vous vous engagez a utiliser ce site uniquement a des fins legales et conformement
        aux presentes conditions. Il vous est interdit de :
      </p>
      <ul>
        <li>Utiliser le site de maniere a enfreindre toute loi ou reglementation locale, nationale ou internationale applicable.</li>
        <li>Utiliser le site a des fins commerciales sans notre autorisation ecrite prealable.</li>
        <li>Tenter d&apos;acceder de maniere non autorisee a toute partie de notre site, a d&apos;autres comptes, systemes informatiques ou reseaux connectes a notre site.</li>
        <li>Transmettre tout materiel publicitaire ou promotionnel non sollicite ou non autorise.</li>
      </ul>

      <h2>3. Compte utilisateur</h2>
      <p>
        Pour acceder a certaines fonctionnalites de notre site, vous devrez creer un compte
        utilisateur. Vous vous engagez a fournir des informations exactes et completes lors
        de votre inscription et a mettre a jour ces informations si necessaire. Vous etes
        responsable de la confidentialite de votre mot de passe et de toutes les activites
        effectuees sous votre compte.
      </p>

      <h2>4. Contenu utilisateur</h2>
      <p>
        Vous conservez tous les droits de propriete sur le contenu que vous soumettez,
        affichez ou publiez sur notre site. En publiant du contenu sur notre site, vous
        nous accordez une licence mondiale, non exclusive, sans redevance, transferable
        et pouvant donner lieu a une sous-licence pour utiliser, reproduire, distribuer,
        preparer des oeuvres derivees, afficher et executer ce contenu dans le cadre
        de la fourniture de nos services.
      </p>

      <h2>5. Propriete intellectuelle</h2>
      <p>
        Tout le contenu et les materiaux disponibles sur notre site, y compris, mais sans
        s&apos;y limiter, les textes, graphiques, logos, images, clips audio, videos et
        logiciels, sont la propriete de DBC Electronics ou de ses concedants de licence
        et sont proteges par les lois sur les droits d&apos;auteur et autres lois sur la
        propriete intellectuelle.
      </p>

      <h2>6. Limitation de responsabilite</h2>
      <p>
        Notre site est fourni &laquo; tel quel &raquo; et &laquo; tel que disponible &raquo;
        sans aucune garantie d&apos;aucune sorte, expresse ou implicite. Nous ne garantissons
        pas que l&apos;utilisation de notre site sera ininterrompue ou exempte d&apos;erreurs.
      </p>

      <h2>7. Indemnisation</h2>
      <p>
        Vous acceptez d&apos;indemniser et de degager de toute responsabilite DBC Electronics,
        ses dirigeants, directeurs, employes et agents, de toute reclamation, perte,
        responsabilite, depense, y compris les honoraires d&apos;avocat, decoulant de votre
        utilisation de notre site ou de votre violation de ces conditions.
      </p>

      <h2>8. Resiliation</h2>
      <p>
        Nous nous reservons le droit de suspendre ou de resilier votre acces a notre site
        a tout moment, sans preavis, pour quelque raison que ce soit, y compris, sans s&apos;y
        limiter, en cas de violation de ces conditions.
      </p>

      <h2>9. Droit applicable</h2>
      <p>
        Ces conditions d&apos;utilisation sont regies et interpretees conformement aux lois
        de la France. Vous acceptez de vous soumettre a la juridiction exclusive des
        tribunaux situes a Paris, France pour resoudre tout litige decoulant de ou lie
        a ces conditions ou a votre utilisation de notre site.
      </p>
    </PolicyPage>
  );
}
