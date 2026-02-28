"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { RadioOption } from "@/components/products/configurator/RadioOption";
import type { TradeInAnswers } from "@/lib/api/trade-in";

interface ConditionStepProps {
  onSubmit: (answers: TradeInAnswers) => void;
}

type AnswerKey = keyof TradeInAnswers;

interface QuestionConfig {
  key: AnswerKey;
  options: string[];
}

const QUESTIONS: QuestionConfig[] = [
  {
    key: "screen",
    options: ["perfect", "minor_scratches", "cracked"],
  },
  {
    key: "chassis",
    options: ["perfect", "minor_wear", "dents"],
  },
  {
    key: "battery",
    options: ["above_85", "80_to_85", "below_80"],
  },
  {
    key: "functionality",
    options: ["all_works", "minor_issues"],
  },
];

export function ConditionStep({ onSubmit }: ConditionStepProps) {
  const t = useTranslations("tradeIn.conditionStep");
  const tBase = useTranslations("tradeIn");
  const [answers, setAnswers] = useState<Partial<TradeInAnswers>>({});

  const handleSelect = (key: AnswerKey, value: string) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);

    // Auto-submit when all 4 questions are answered
    if (Object.keys(updated).length === QUESTIONS.length) {
      onSubmit(updated as TradeInAnswers);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        {t("title")}
      </h2>
      <div className="flex flex-col gap-8">
        {QUESTIONS.map((question) => (
          <div key={question.key}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              {t(`${question.key}.title`)}
            </h3>
            <div className="flex flex-col gap-2">
              {question.options.map((option) => (
                <RadioOption
                  key={option}
                  selected={answers[question.key] === option}
                  onClick={() => handleSelect(question.key, option)}
                  label={t(`${question.key}.${option}`)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
