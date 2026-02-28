"use client";

import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COUNTRY_CODES } from "@/lib/constants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { useProfile } from "@/hooks/useProfile";

type ProfileHook = ReturnType<typeof useProfile>;

interface AddressEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: ProfileHook;
}

export default function AddressEditSheet({
  open,
  onOpenChange,
  profile,
}: AddressEditSheetProps) {
  const t = useTranslations("account.profile");
  const tCountries = useTranslations("checkout.countries");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    profile.updateField(e.target.name, e.target.value);
  };

  const handleSave = async () => {
    const success = await profile.save();
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[90dvh] max-w-lg overflow-y-auto rounded-t-2xl"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">
            {t("editAddress")}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {t("subtitle")}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3 px-4">
          {/* Country */}
          <FieldWrapper label={t("country")}>
            <select
              id="country"
              name="country"
              value={profile.form.country}
              onChange={handleChange}
              className="w-full appearance-none bg-transparent text-sm text-gray-900 outline-none"
            >
              {COUNTRY_CODES.map((code) => (
                <option key={code} value={code}>
                  {tCountries(code)}
                </option>
              ))}
            </select>
          </FieldWrapper>

          {/* First name + Last name */}
          <div className="grid grid-cols-2 gap-3">
            <Field
              id="first_name"
              label={t("firstName")}
              value={profile.form.first_name}
              onChange={handleChange}
            />
            <Field
              id="last_name"
              label={t("lastName")}
              value={profile.form.last_name}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <Field
            id="address"
            label={t("address")}
            value={profile.form.address}
            onChange={handleChange}
          />

          {/* Postal code + City */}
          <div className="grid grid-cols-2 gap-3">
            <Field
              id="postal_code"
              label={t("postalCode")}
              value={profile.form.postal_code}
              onChange={handleChange}
            />
            <Field
              id="city"
              label={t("city")}
              value={profile.form.city}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <Field
            id="phone"
            type="tel"
            label={t("phone")}
            value={profile.form.phone}
            onChange={handleChange}
          />

          {profile.error && (
            <p className="text-sm text-red-600">{profile.error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-4 pb-2 pt-5">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-full px-5 text-sm font-semibold"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={profile.saving}
            className="rounded-full bg-green-700 px-6 text-sm font-semibold text-white hover:bg-green-800"
          >
            {profile.saving && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("save")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function FieldWrapper({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-full border border-gray-200 bg-gray-50 px-4 pb-2.5 pt-1.5">
      <span className="block text-[11px] leading-tight text-gray-400">
        {label}
      </span>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <FieldWrapper label={label}>
      <Input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="h-auto border-0 bg-transparent p-0 text-sm text-gray-900 shadow-none focus-visible:ring-0"
      />
    </FieldWrapper>
  );
}
