"use client";

import { useState, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { getProfile, updateProfile } from "@/lib/api/profile";
import type { UpdateProfilePayload } from "@/types/profile";

interface ProfileFormData {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  country: string;
}

const EMPTY_FORM: ProfileFormData = {
  first_name: "",
  last_name: "",
  phone: "",
  address: "",
  postal_code: "",
  city: "",
  country: "FR",
};

export function useProfile() {
  const { getAccessToken } = useAuthStore();

  const [form, setForm] = useState<ProfileFormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;

    setLoading(true);
    const { data } = await getProfile(token);
    if (data) {
      setForm({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone: data.phone || "",
        address: data.address || "",
        postal_code: data.postal_code || "",
        city: data.city || "",
        country: data.country || "FR",
      });
    }
    setLoading(false);
  }, [getAccessToken]);

  const updateField = useCallback(
    (name: string, value: string) => {
      setForm((prev) => ({ ...prev, [name]: value }));
      setSaved(false);
      setError(null);
    },
    []
  );

  const save = useCallback(async (): Promise<boolean> => {
    const token = getAccessToken();
    if (!token) return false;

    setSaving(true);
    setError(null);
    setSaved(false);

    const payload: UpdateProfilePayload = form;
    const { error: apiError } = await updateProfile(token, payload);

    if (apiError) {
      setError(apiError.error);
      setSaving(false);
      return false;
    }

    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
    return true;
  }, [getAccessToken, form]);

  return { form, loading, saving, saved, error, fetch, updateField, save };
}
