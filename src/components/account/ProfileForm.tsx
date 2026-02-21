"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddressEditSheet from "./AddressEditSheet";
import type { useProfile } from "@/hooks/useProfile";

type ProfileHook = ReturnType<typeof useProfile>;

interface ProfileFormProps {
  profile: ProfileHook;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const t = useTranslations("account.profile");
  const tCountries = useTranslations("checkout.countries");
  const [open, setOpen] = useState(false);

  const { form, loading } = profile;
  const hasAddress = form.address || form.first_name || form.last_name;

  const fullName = [form.first_name, form.last_name]
    .filter(Boolean)
    .join(" ");
  const cityLine = [form.postal_code, form.city].filter(Boolean).join(" ");
  const countryLabel = form.country ? tCountries(form.country) : "";

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t("addressTitle")}
            </h2>
          </div>
          {!loading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(true)}
              className="gap-1.5 text-sm text-green-700 hover:text-green-800"
            >
              <Pencil className="h-3.5 w-3.5" />
              {t("edit")}
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : hasAddress ? (
          <div className="space-y-1 text-sm text-gray-700">
            {fullName && <p className="font-medium text-gray-900">{fullName}</p>}
            {form.address && <p>{form.address}</p>}
            {cityLine && <p>{cityLine}</p>}
            {countryLabel && <p>{countryLabel}</p>}
            {form.phone && (
              <p className="pt-1 text-gray-500">{form.phone}</p>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setOpen(true)}
            className="w-full rounded-lg border-2 border-dashed border-gray-200 py-6 text-center text-sm text-gray-500 transition hover:border-gray-300 hover:text-gray-700"
          >
            {t("addAddress")}
          </Button>
        )}
      </div>

      <AddressEditSheet
        open={open}
        onOpenChange={setOpen}
        profile={profile}
      />
    </>
  );
}
