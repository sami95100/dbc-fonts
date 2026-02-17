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
    <div className="border-b border-gray-100 bg-gray-50 py-4">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((item) => (
            <div key={item.key} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-600">
                {item.icon}
              </div>
              <span className="text-sm font-medium text-gray-900">
                {t(item.key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
