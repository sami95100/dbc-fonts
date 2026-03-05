"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Power, Hand, CircleDot, Camera, Volume2, ScanFace, BatteryFull } from "lucide-react";
import type { FunctionalityChecklist } from "@/types/buyback";

interface CheckItem {
  key: keyof FunctionalityChecklist;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CHECKS: CheckItem[] = [
  { key: "powers_on", label: "Le telephone s'allume", icon: Power },
  { key: "touchscreen_works", label: "L'ecran tactile fonctionne", icon: Hand },
  { key: "buttons_work", label: "Les boutons fonctionnent", icon: CircleDot },
  { key: "cameras_work", label: "Les cameras fonctionnent", icon: Camera },
  { key: "sound_works", label: "Le son fonctionne", icon: Volume2 },
  { key: "biometrics_works", label: "Face ID / Touch ID fonctionne", icon: ScanFace },
  { key: "battery_healthy", label: "Batterie en bonne sante (> 80%)", icon: BatteryFull },
];

interface ChecklistStepProps {
  onSubmit: (checklist: FunctionalityChecklist) => void;
}

export function ChecklistStep({ onSubmit }: ChecklistStepProps) {
  const [answers, setAnswers] = useState<Partial<FunctionalityChecklist>>({});

  const toggle = (key: keyof FunctionalityChecklist) => {
    setAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allAnswered = CHECKS.every((c) => answers[c.key] !== undefined);

  const handleSubmit = () => {
    // Default unanswered to true
    const checklist: FunctionalityChecklist = {
      powers_on: answers.powers_on ?? true,
      touchscreen_works: answers.touchscreen_works ?? true,
      buttons_work: answers.buttons_work ?? true,
      cameras_work: answers.cameras_work ?? true,
      sound_works: answers.sound_works ?? true,
      biometrics_works: answers.biometrics_works ?? true,
      battery_healthy: answers.battery_healthy ?? true,
    };
    onSubmit(checklist);
  };

  return (
    <div>
      <p className="mb-6 text-sm text-gray-500">
        Cochez les fonctionnalites qui marchent sur votre appareil.
      </p>

      <div className="flex flex-col gap-2">
        {CHECKS.map((check) => {
          const Icon = check.icon;
          const checked = answers[check.key] ?? false;

          return (
            <button
              key={check.key}
              type="button"
              onClick={() => toggle(check.key)}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200",
                checked
                  ? "border-green-700 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-400"
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors",
                  checked
                    ? "border-green-700 bg-green-700"
                    : "border-gray-300"
                )}
              >
                {checked && <Check className="h-4 w-4 text-white" />}
              </div>
              <Icon className={cn("h-5 w-5 shrink-0", checked ? "text-green-700" : "text-gray-400")} />
              <span className={cn("text-sm font-medium", checked ? "text-gray-900" : "text-gray-600")}>
                {check.label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className={cn(
          "mt-8 w-full rounded-full py-4 text-base font-semibold transition-all duration-200",
          "bg-primary text-white hover:bg-primary/90"
        )}
      >
        Obtenir mon estimation
      </button>
    </div>
  );
}
