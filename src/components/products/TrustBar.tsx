import { ShieldCheck, ClipboardCheck, RotateCcw, LifeBuoy } from "lucide-react";
import { useTranslations } from "next-intl";

export function TrustBar() {
  const t = useTranslations("footer");

  const items = [
    {
      key: "warranty",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
    {
      key: "qualityCheck",
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      key: "freeReturn",
      icon: <RotateCcw className="h-5 w-5" />,
    },
    {
      key: "support",
      icon: <LifeBuoy className="h-5 w-5" />,
    },
  ];

  return (
    <div className="border-b border-gray-100 bg-gray-50 py-3">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
          {items.map((item) => (
            <div key={item.key} className="flex shrink-0 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-600">
                {item.icon}
              </div>
              <span className="whitespace-nowrap text-xs font-medium text-gray-900 md:text-sm md:whitespace-normal">
                {t(item.key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
