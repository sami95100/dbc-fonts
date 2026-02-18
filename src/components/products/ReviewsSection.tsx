"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Star, Loader2, CheckCircle } from "lucide-react";
import { getModelReviews, type ReviewData, type ReviewStats } from "@/lib/api/products";
import { cn } from "@/lib/utils";

interface ReviewsSectionProps {
  modelId: string;
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            star <= rating ? "fill-highlight text-highlight" : "fill-gray-200 text-gray-200"
          )}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

function RatingBar({ count, total }: { count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full bg-highlight transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewData }) {
  const t = useTranslations("reviews");
  return (
    <div className="border-b border-gray-100 py-5 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} size={14} />
            {review.verified_purchase && (
              <span className="flex items-center gap-1 text-xs text-green-700">
                <CheckCircle className="h-3 w-3" />
                {t("verified")}
              </span>
            )}
          </div>
          {review.title && (
            <p className="mt-1.5 font-medium text-gray-900">{review.title}</p>
          )}
        </div>
        {review.source_date && (
          <span className="shrink-0 text-xs text-gray-400">
            {new Date(review.source_date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>

      {review.content && (
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{review.content}</p>
      )}

      {review.image_url && (
        <div className="mt-3">
          <Image
            src={review.image_url}
            alt={review.title || t("reviewImage")}
            width={120}
            height={120}
            className="rounded-lg object-cover"
          />
        </div>
      )}

      <p className="mt-2 text-xs text-gray-400">{review.author_name}</p>
    </div>
  );
}

export default function ReviewsSection({ modelId }: ReviewsSectionProps) {
  const t = useTranslations("reviews");
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchReviews = useCallback(async (pageNum: number) => {
    const isFirst = pageNum === 1;
    if (isFirst) setLoading(true);
    else setLoadingMore(true);

    const { data } = await getModelReviews(modelId, pageNum, 5);

    if (data) {
      setStats(data.stats);
      setTotalPages(data.pages);
      setReviews((prev) => (isFirst ? data.reviews : [...prev, ...data.reviews]));
    }

    if (isFirst) setLoading(false);
    else setLoadingMore(false);
  }, [modelId]);

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && page < totalPages) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchReviews(nextPage);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [page, totalPages, loadingMore, fetchReviews]);

  if (loading) {
    return (
      <div className="mt-12 flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return null;
  }

  return (
    <section id="reviews-section" className="mt-12 scroll-mt-24">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        {t("title")} ({stats.total})
      </h2>

      {/* Stats summary */}
      <div className="mb-8 flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6 sm:flex-row sm:items-center sm:gap-10">
        {/* Average */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl font-bold text-gray-900">{stats.average}</span>
          <StarRating rating={Math.round(stats.average)} size={18} />
          <span className="text-sm text-gray-500">
            {stats.total} {t("reviewCount")}
          </span>
        </div>

        {/* Distribution bars */}
        <div className="flex flex-1 flex-col gap-1.5">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="w-3 text-right text-xs text-gray-500">{star}</span>
              <Star className="h-3 w-3 fill-highlight text-highlight" />
              <RatingBar count={stats.distribution[star] || 0} total={stats.total} />
              <span className="w-5 text-right text-xs text-gray-400">
                {stats.distribution[star] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review list */}
      <div className="rounded-lg border border-gray-200 bg-white px-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-10" />
      {loadingMore && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      )}
    </section>
  );
}
