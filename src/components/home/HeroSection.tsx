import Link from "next/link";

interface HeroSectionProps {
  locale?: string;
}

export function HeroSection({ locale = "fr" }: HeroSectionProps) {
  const isFr = locale === "fr";

  return (
    <section className="bg-gray-50 py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h1 className="mb-4 text-3xl font-bold italic text-gray-900 md:text-4xl lg:text-5xl">
          {isFr
            ? "Ici, on s'offre le meilleur du reconditionne."
            : "Here, we treat ourselves to the best refurbished."}
        </h1>
        <p className="mb-8 text-base text-gray-600 md:text-lg">
          {isFr
            ? "Moins cher et aussi performant que le neuf grace au "
            : "Cheaper and as powerful as new thanks to our "}
          <Link href="/quality" className="font-medium text-gray-900 underline">
            {isFr ? "Pacte Qualite DBC" : "DBC Quality Pact"}
          </Link>
          .
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-700 md:gap-8">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <span>{isFr ? "Reconditionneurs verifies" : "Verified refurbishers"}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <span>{isFr ? "Jusqu'a 100 points de controle" : "Up to 100 checkpoints"}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{isFr ? "Retour gratuit sous 30 jours" : "Free returns within 30 days"}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>{isFr ? "12 mois de garantie commerciale" : "12 months warranty"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
