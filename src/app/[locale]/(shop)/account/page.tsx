"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { LogOut, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { getMyOrders, type MyOrdersResponse } from "@/lib/api/orders";
import { useProfile } from "@/hooks/useProfile";
import ProfileForm from "@/components/account/ProfileForm";
import OrderCard from "@/components/account/OrderCard";

export default function AccountPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("account");
  const { user, initialized, signOut, getAccessToken } = useAuthStore();

  const profile = useProfile();
  const [orders, setOrders] = useState<MyOrdersResponse | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchOrders = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    setLoadingOrders(true);
    const { data } = await getMyOrders(token);
    if (data) setOrders(data);
    setLoadingOrders(false);
  }, [getAccessToken]);

  useEffect(() => {
    if (initialized && !user) {
      router.replace(`/${locale}/account/login`);
    }
  }, [initialized, user, router, locale]);

  useEffect(() => {
    if (initialized && user) {
      profile.fetch();
      fetchOrders();
    }
  }, [initialized, user, profile.fetch, fetchOrders]);

  const handleSignOut = async () => {
    await signOut();
    router.replace(`/${locale}`);
  };

  if (!initialized || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("page.title")}
          </h1>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {t("page.logout")}
          </Button>
        </div>

        {/* Email */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">{t("page.email")}</p>
          <p className="font-medium text-gray-900">{user.email}</p>
        </div>

        {/* Profile */}
        <div className="mb-8">
          <ProfileForm profile={profile} />
        </div>

        {/* Orders */}
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t("page.ordersTitle")}
        </h2>

        {loadingOrders ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : !orders || orders.orders.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <p className="mb-4 text-gray-500">{t("page.noOrders")}</p>
            <Link
              href={`/${locale}/products/smartphones`}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              {t("page.browseProducts")}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
