"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Mail, MailCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("account.login");
  const { user, initialized, loading, sendOtp } = useAuthStore();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialized && user) {
      router.replace(`/${locale}/account`);
    }
  }, [initialized, user, router, locale]);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("errors.invalidEmail"));
      return;
    }

    const result = await sendOtp(email);
    if (result.error) {
      setError(t("errors.sendFailed"));
    } else {
      setSent(true);
    }
  };

  if (initialized && user) return null;

  return (
    <div className="bg-gray-50 py-12">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-lg border border-gray-200 bg-white p-8">
          {!sent ? (
            <>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  {t("title")}
                </h1>
                <p className="mt-2 text-sm text-gray-500">{t("subtitle")}</p>
              </div>

              <form onSubmit={handleSendLink} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    {t("emailLabel")}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    autoFocus
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("sending")}
                    </>
                  ) : (
                    t("sendLink")
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <MailCheck className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                {t("checkEmail")}
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                {t("checkEmailSubtitle", { email })}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setError(null);
                }}
                className="mt-6 text-sm text-primary hover:underline"
              >
                {t("changeEmail")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
