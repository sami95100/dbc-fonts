"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";
import { STORES } from "@/data/stores";
import type { AppointmentSlot } from "@/types/buyback";

interface AppointmentStepProps {
  storeKey: string;
  onSelect: (slot: AppointmentSlot) => void;
}

function generateSlots(storeKey: string): { date: string; dateLabel: string; slots: string[] }[] {
  const store = STORES.find((s) => s.key === storeKey);
  if (!store) return [];

  const days: { date: string; dateLabel: string; slots: string[] }[] = [];
  const now = new Date();

  for (let i = 1; i <= 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dayOfWeek = d.getDay();
    const hours = store.weeklyHours[dayOfWeek];

    if (hours.closed) continue;

    const dateStr = d.toISOString().split("T")[0];
    const dateLabel = d.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    const toMin = (t: string) => {
      const [hh, mm] = t.split(":").map(Number);
      return hh * 60 + mm;
    };

    const timeSlots: string[] = [];

    const addSlots = (openStr: string, closeStr: string) => {
      let current = toMin(openStr);
      const end = toMin(closeStr) - 30; // Last slot 30min before close
      while (current <= end) {
        const h = Math.floor(current / 60);
        const m = current % 60;
        timeSlots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
        current += 30;
      }
    };

    addSlots(hours.open, hours.close);
    if (hours.open2 && hours.close2) {
      addSlots(hours.open2, hours.close2);
    }

    if (timeSlots.length > 0) {
      days.push({ date: dateStr, dateLabel, slots: timeSlots });
    }
  }

  return days;
}

export function AppointmentStep({ storeKey, onSelect }: AppointmentStepProps) {
  const store = STORES.find((s) => s.key === storeKey);
  const availableDays = useMemo(() => generateSlots(storeKey), [storeKey]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const currentDaySlots = availableDays.find((d) => d.date === selectedDate)?.slots ?? [];

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    onSelect({ date: selectedDate, time: selectedTime, storeKey });
  };

  return (
    <div>
      <p className="mb-6 text-sm text-gray-500">
        DBC {store?.city} - {store?.address}
      </p>

      {/* Date selection */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Calendar className="h-4 w-4" />
          Choisissez un jour
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {availableDays.map((day) => (
            <button
              key={day.date}
              type="button"
              onClick={() => {
                setSelectedDate(day.date);
                setSelectedTime(null);
              }}
              className={cn(
                "shrink-0 rounded-xl border px-4 py-3 text-center text-sm transition-all duration-200",
                selectedDate === day.date
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              )}
            >
              {day.dateLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Time selection */}
      {selectedDate && (
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Clock className="h-4 w-4" />
            Choisissez un creneau
          </div>
          <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
            {currentDaySlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  selectedTime === time
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirm */}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={!selectedDate || !selectedTime}
        className={cn(
          "w-full rounded-full py-4 text-base font-semibold transition-all duration-200",
          selectedDate && selectedTime
            ? "bg-primary text-white hover:bg-primary/90"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        )}
      >
        Confirmer le rendez-vous
      </button>
    </div>
  );
}
