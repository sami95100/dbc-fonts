"use client";

import { useState, useCallback } from "react";
import {
  getTradeInBrands,
  getTradeInModels,
  getTradeInStorages,
  getTradeInEstimate,
} from "@/lib/api/trade-in";
import type {
  TradeInModel,
  TradeInAnswers,
  TradeInEstimate,
} from "@/lib/api/trade-in";

export type TradeInStep =
  | "brand"
  | "model"
  | "storage"
  | "condition"
  | "result";

const STEPS: TradeInStep[] = [
  "brand",
  "model",
  "storage",
  "condition",
  "result",
];

interface TradeInState {
  step: TradeInStep;
  brands: string[];
  models: TradeInModel[];
  storages: string[];
  selectedBrand: string | null;
  selectedModel: TradeInModel | null;
  selectedStorage: string | null;
  answers: Partial<TradeInAnswers>;
  estimate: TradeInEstimate | null;
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: TradeInState = {
  step: "brand",
  brands: [],
  models: [],
  storages: [],
  selectedBrand: null,
  selectedModel: null,
  selectedStorage: null,
  answers: {},
  estimate: null,
  loading: false,
  error: null,
};

export function useTradeIn() {
  const [state, setState] = useState<TradeInState>(INITIAL_STATE);

  const updateState = (patch: Partial<TradeInState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  // Load brands on mount
  const loadBrands = useCallback(async () => {
    updateState({ loading: true, error: null });
    const { data, error } = await getTradeInBrands();
    if (error) {
      updateState({ loading: false, error: error.error });
      return;
    }
    updateState({ brands: data ?? [], loading: false });
  }, []);

  // Select brand → load models
  const selectBrand = useCallback(async (brand: string) => {
    updateState({
      selectedBrand: brand,
      loading: true,
      error: null,
    });
    const { data, error } = await getTradeInModels(brand);
    if (error) {
      updateState({ loading: false, error: error.error });
      return;
    }
    updateState({ models: data ?? [], step: "model", loading: false });
  }, []);

  // Select model → load storages
  const selectModel = useCallback(async (model: TradeInModel) => {
    updateState({
      selectedModel: model,
      loading: true,
      error: null,
    });
    const { data, error } = await getTradeInStorages(model.id);
    if (error) {
      updateState({ loading: false, error: error.error });
      return;
    }
    updateState({ storages: data ?? [], step: "storage", loading: false });
  }, []);

  // Select storage → go to condition
  const selectStorage = useCallback((storage: string) => {
    updateState({ selectedStorage: storage, step: "condition" });
  }, []);

  // Submit answers → get estimate
  const submitAnswers = useCallback(
    async (answers: TradeInAnswers) => {
      if (!state.selectedModel || !state.selectedStorage) return;

      updateState({ answers, loading: true, error: null });
      const { data, error } = await getTradeInEstimate({
        model_id: state.selectedModel.id,
        storage: state.selectedStorage,
        answers,
      });
      if (error) {
        updateState({ loading: false, error: error.error });
        return;
      }
      updateState({ estimate: data, step: "result", loading: false });
    },
    [state.selectedModel, state.selectedStorage]
  );

  // Go back one step
  const goBack = useCallback(() => {
    const currentIndex = STEPS.indexOf(state.step);
    if (currentIndex <= 0) return;

    const prevStep = STEPS[currentIndex - 1];
    updateState({ step: prevStep, error: null });
  }, [state.step]);

  // Restart wizard
  const restart = useCallback(() => {
    setState({ ...INITIAL_STATE, brands: state.brands });
  }, [state.brands]);

  const stepIndex = STEPS.indexOf(state.step);

  return {
    ...state,
    stepIndex,
    totalSteps: STEPS.length,
    loadBrands,
    selectBrand,
    selectModel,
    selectStorage,
    submitAnswers,
    goBack,
    restart,
  };
}
