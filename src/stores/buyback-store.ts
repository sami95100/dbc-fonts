import { create } from "zustand";
import type {
  BuybackStep,
  BuybackCategory,
  BuybackModel,
  ScreenCondition,
  BodyCondition,
  FunctionalityChecklist,
  BuybackEstimate,
  DeliveryMethod,
  ShippingOption,
  BuybackPersonalInfo,
  BuybackBankInfo,
  AppointmentSlot,
} from "@/types/buyback";

interface BuybackState {
  step: BuybackStep;
  category: BuybackCategory | null;
  brand: string | null;
  model: BuybackModel | null;
  storage: string | null;
  screenCondition: ScreenCondition | null;
  bodyCondition: BodyCondition | null;
  checklist: FunctionalityChecklist | null;
  estimate: BuybackEstimate | null;
  deliveryMethod: DeliveryMethod | null;
  shippingOption: ShippingOption | null;
  selectedStoreKey: string | null;
  appointment: AppointmentSlot | null;
  bankInfo: BuybackBankInfo | null;
  personalInfo: BuybackPersonalInfo | null;
  confirmationId: string | null;

  // Actions
  setStep: (step: BuybackStep) => void;
  setCategory: (category: BuybackCategory) => void;
  setBrand: (brand: string) => void;
  setModel: (model: BuybackModel) => void;
  setStorage: (storage: string) => void;
  setScreenCondition: (condition: ScreenCondition) => void;
  setBodyCondition: (condition: BodyCondition) => void;
  setChecklist: (checklist: FunctionalityChecklist) => void;
  setEstimate: (estimate: BuybackEstimate) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setShippingOption: (option: ShippingOption) => void;
  setSelectedStoreKey: (key: string) => void;
  setAppointment: (slot: AppointmentSlot) => void;
  setBankInfo: (info: BuybackBankInfo) => void;
  setPersonalInfo: (info: BuybackPersonalInfo) => void;
  setConfirmationId: (id: string) => void;
  goBack: () => void;
  reset: () => void;
}

const STEP_ORDER: BuybackStep[] = [
  "category",
  "brand",
  "model",
  "storage",
  "screen",
  "body",
  "checklist",
  "offer",
];

function getPreviousStep(current: BuybackStep, deliveryMethod: DeliveryMethod | null): BuybackStep | null {
  // Post-offer flow
  if (current === "confirmation") {
    return deliveryMethod === "store" ? "appointment" : "shipping-method";
  }
  if (current === "shipping-method") return "personal-info";
  if (current === "personal-info") return "bank-info";
  if (current === "bank-info") return "offer";
  if (current === "appointment") return "store-select";
  if (current === "store-select") return "offer";

  // Funnel flow
  const idx = STEP_ORDER.indexOf(current);
  if (idx <= 0) return null;
  return STEP_ORDER[idx - 1];
}

const INITIAL: Omit<BuybackState, 'setStep' | 'setCategory' | 'setBrand' | 'setModel' | 'setStorage' | 'setScreenCondition' | 'setBodyCondition' | 'setChecklist' | 'setEstimate' | 'setDeliveryMethod' | 'setShippingOption' | 'setSelectedStoreKey' | 'setAppointment' | 'setBankInfo' | 'setPersonalInfo' | 'setConfirmationId' | 'goBack' | 'reset'> = {
  step: "category",
  category: null,
  brand: null,
  model: null,
  storage: null,
  screenCondition: null,
  bodyCondition: null,
  checklist: null,
  estimate: null,
  deliveryMethod: null,
  shippingOption: null,
  selectedStoreKey: null,
  appointment: null,
  bankInfo: null,
  personalInfo: null,
  confirmationId: null,
};

export const useBuybackStore = create<BuybackState>((set, get) => ({
  ...INITIAL,

  setStep: (step) => set({ step }),

  setCategory: (category) => set({ category, step: "brand" }),

  setBrand: (brand) => set({ brand, step: "model" }),

  setModel: (model) => set({ model, step: "storage" }),

  setStorage: (storage) => set({ storage, step: "screen" }),

  setScreenCondition: (screenCondition) => set({ screenCondition, step: "body" }),

  setBodyCondition: (bodyCondition) => set({ bodyCondition, step: "checklist" }),

  setChecklist: (checklist) => set({ checklist }),

  setEstimate: (estimate) => set({ estimate, step: "offer" }),

  setDeliveryMethod: (deliveryMethod) => {
    if (deliveryMethod === "store") {
      set({ deliveryMethod, step: "store-select" });
    } else {
      set({ deliveryMethod, step: "bank-info" });
    }
  },

  setShippingOption: (shippingOption) => set({ shippingOption }),

  setSelectedStoreKey: (selectedStoreKey) => set({ selectedStoreKey, step: "appointment" }),

  setAppointment: (appointment) => set({ appointment }),

  setBankInfo: (bankInfo) => set({ bankInfo, step: "personal-info" }),

  setPersonalInfo: (personalInfo) => set({ personalInfo, step: "shipping-method" }),

  setConfirmationId: (confirmationId) => set({ confirmationId, step: "confirmation" }),

  goBack: () => {
    const { step, deliveryMethod } = get();
    const prev = getPreviousStep(step, deliveryMethod);
    if (prev) set({ step: prev });
  },

  reset: () => set(INITIAL),
}));
