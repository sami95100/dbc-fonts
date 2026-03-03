"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ChevronDown } from "lucide-react";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function SnapchatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" />
    </svg>
  );
}

const SOCIALS = [
  { href: "https://www.instagram.com/dbcstore", icon: InstagramIcon, label: "Instagram" },
  { href: "https://www.tiktok.com/@dbcstore", icon: TikTokIcon, label: "TikTok" },
  { href: "https://www.snapchat.com/add/dbc_story", icon: SnapchatIcon, label: "Snapchat" },
];

export function Footer() {
  const locale = useLocale();
  const [showOptIn, setShowOptIn] = useState(false);

  return (
    <footer className="bg-white">
      {/* Newsletter */}
      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-5 py-8 md:flex-row md:items-start md:justify-between md:gap-16 md:py-10">
          <div className="shrink-0 md:max-w-[400px]">
            <p className="text-[20px] font-bold leading-tight text-gray-900">
              Les bons plans, c&apos;est par ici.
            </p>
            <p className="mt-1 text-[14px] leading-relaxed text-gray-500">
              Offres exclu, restocks, nouveaux modèles — on vous prévient avant tout le monde.
            </p>
          </div>

          <div className="w-full md:max-w-[420px]">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Adresse e-mail"
                className="h-11 flex-1 rounded-lg border border-gray-300 px-3 text-[14px] text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
              />
              <button className="h-11 shrink-0 rounded-lg bg-gray-900 px-4 text-[14px] font-semibold text-white hover:bg-gray-800">
                S&apos;inscrire
              </button>
            </div>

            {/* Opt-in */}
            <button
              onClick={() => setShowOptIn(!showOptIn)}
              className="mt-3 flex items-center gap-1 text-[12px] text-gray-900 underline underline-offset-2"
            >
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showOptIn ? "rotate-180" : ""}`} />
              En savoir plus
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${showOptIn ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <div className="rounded-lg bg-gray-50 p-3 text-[12px] leading-relaxed text-gray-500">
                  <p>
                    Vous pouvez vous désabonner quand vous voulez. On n&apos;est pas vexés.
                  </p>
                  <Link href={`/${locale}/privacy`} className="mt-1 block text-gray-900 underline">
                    Politique de confidentialité
                  </Link>
                  <p className="mt-1">
                    🎁 -10% sur votre première commande après inscription.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-[1120px] px-5 py-8">
          <ul className="flex flex-col gap-8 md:flex-row md:gap-0">
            {/* À propos */}
            <li className="md:flex-1">
              <h2 className="mb-3 text-[15px] font-bold text-gray-900">À propos</h2>
              <ul className="flex flex-col gap-2">
                <li><Link href={`/${locale}/about`} className="text-[14px] text-gray-600 no-underline hover:text-gray-900 hover:underline">Notre histoire</Link></li>
                <li><Link href={`/${locale}/stores`} className="text-[14px] text-gray-600 no-underline hover:text-gray-900 hover:underline">Nos 11 magasins</Link></li>
                <li><Link href={`/${locale}/standard-dbc-labs`} className="text-[14px] text-gray-600 no-underline hover:text-gray-900 hover:underline">Standard DBC Labs</Link></li>
                <li><Link href={`/${locale}/careers`} className="text-[14px] text-gray-600 no-underline hover:text-gray-900 hover:underline">On recrute !</Link></li>
              </ul>
              <div className="mt-4 flex items-center gap-4">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-gray-400 transition-colors hover:text-gray-900">
                    <s.icon />
                  </a>
                ))}
              </div>
            </li>

            {/* Besoin d'aide */}
            <li className="border-t border-gray-200 pt-6 md:flex-1 md:border-0 md:pt-0">
              <h2 className="mb-3 text-[15px] font-bold text-gray-900">On vous aide</h2>
              <ul className="flex flex-col gap-2">
                <li><Link href={`/${locale}/contact`} className="text-[14px] text-gray-600 no-underline hover:text-gray-900 hover:underline">Nous contacter</Link></li>
                <li><Link href={`/${locale}/help`} className="text-[14px] text-gray-600 no-underline hover:text-gray-900 hover:underline">Centre d&apos;aide</Link></li>
                <li><Link href={`/${locale}/shipping`} className="text-[14px] text-gray-600 no-underline hover:text-gray-900 hover:underline">Livraison et délais</Link></li>
                <li><Link href={`/${locale}/returns`} className="text-[14px] text-gray-600 no-underline hover:text-gray-900 hover:underline">Retours gratuits</Link></li>
              </ul>
            </li>

            {/* Services */}
            <li className="border-t border-gray-200 pt-6 md:flex-1 md:border-0 md:pt-0">
              <h2 className="mb-3 text-[15px] font-bold text-gray-900">Nos services</h2>
              <ul className="flex flex-col gap-2">
                <li><Link href={`/${locale}/standard-dbc-labs`} className="text-[14px] text-gray-600 no-underline hover:text-gray-900 hover:underline">Standard DBC Labs</Link></li>
                <li><Link href={`/${locale}/repair`} className="text-[14px] text-gray-600 no-underline hover:text-gray-900 hover:underline">Réparation express</Link></li>
                <li><Link href={`/${locale}/trade-in`} className="text-[14px] text-gray-600 no-underline hover:text-gray-900 hover:underline">Reprendre mon appareil</Link></li>
                <li><Link href={`/${locale}/products/accessories`} className="text-[14px] text-gray-600 no-underline hover:text-gray-900 hover:underline">Accessoires</Link></li>
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {[
                  { src: "/assets/icons/payment/cb.svg", alt: "CB" },
                  { src: "/assets/icons/payment/visa.svg", alt: "Visa" },
                  { src: "/assets/icons/payment/mastercard.svg", alt: "Mastercard" },
                  { src: "/assets/icons/payment/paypal.svg", alt: "PayPal" },
                  { src: "/assets/icons/payment/apple-pay.svg", alt: "Apple Pay" },
                  { src: "/assets/icons/payment/google-pay.svg", alt: "Google Pay" },
                ].map((p) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img key={p.alt} src={p.src} alt={p.alt} className="h-6" />
                ))}
              </div>
            </li>

            {/* La loi et l'ordre */}
            <li className="border-t border-gray-200 pt-6 md:flex-1 md:border-0 md:pt-0">
              <h2 className="mb-3 text-[15px] font-bold text-gray-900">La loi et l&apos;ordre</h2>
              <ul className="flex flex-col gap-2">
                <li><Link href={`/${locale}/cgv`} className="text-[14px] text-gray-600 no-underline hover:text-gray-900 hover:underline">Conditions générales</Link></li>
                <li><Link href={`/${locale}/privacy`} className="text-[14px] text-gray-600 no-underline hover:text-gray-900 hover:underline">Confidentialité</Link></li>
                <li><Link href={`/${locale}/legal`} className="text-[14px] text-gray-600 no-underline hover:text-gray-900 hover:underline">Mentions légales</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 py-4 text-center">
        <p className="text-[12px] text-gray-400">© {new Date().getFullYear()} DBC</p>
      </div>
    </footer>
  );
}
