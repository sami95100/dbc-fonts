/**
 * Product Configurator Components
 *
 * A modular, reusable component system for product configuration.
 * Designed to work with any product type: iPhone, Samsung, Mac, iPad, etc.
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  ProductConfigurator (main entry point)                     │
 * │  └── useProductConfigurator (state & logic)                 │
 * │      ├── HeroSection (image gallery + product info)         │
 * │      ├── ConditionSection (cosmetic grade)                  │
 * │      ├── BatterySection (optional)                          │
 * │      ├── StorageSection (optional)                          │
 * │      └── StickyBottomBar (mobile CTA)                       │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Atomic Components:
 * - RadioOption: Selection button with radio indicator
 * - ConfigSection: Layout for image + content sections
 * - ImageGallery: Product image display with thumbnails
 * - ColorSelector: Color swatch picker
 * - TrustBadges: Trust indicators (shipping, returns, warranty)
 *
 * Usage:
 * ```tsx
 * import { ProductConfigurator } from "@/components/products/ProductConfigurator";
 *
 * <ProductConfigurator
 *   product={product}
 *   showBattery={true}  // iPhone, Samsung
 *   showStorage={true}  // All devices
 * />
 * ```
 */

// Atomic components
export { RadioOption } from "./RadioOption";
export { ConfigSection } from "./ConfigSection";
export { ImageGallery } from "./ImageGallery";
export { ColorSelector } from "./ColorSelector";
export { TrustBadges, DeliveryIcon, ReturnIcon, ShieldIcon } from "./TrustBadges";
export { StickyBottomBar } from "./StickyBottomBar";
export { StickyHeader } from "./StickyHeader";

// Section components
export {
  HeroSection,
  ConditionSection,
  BatterySection,
  StorageSection,
  SimSection,
  ColorSection,
  OrderSummary,
  DescriptionSection,
} from "./sections";

// Hooks
export { useProductConfigurator } from "./hooks";

// Constants
export { GRADE_ID_TO_API, API_TO_GRADE_ID } from "./types";

// Types
export type {
  ConfigurableProduct,
  ProductSelection,
  VariantInfo,
  BatteryType,
  RadioOptionProps,
  ConfigSectionProps,
  ImageGalleryProps,
  ColorSelectorProps,
  TrustBadgesProps,
  StickyBottomBarProps,
  ConditionSectionProps,
  BatterySectionProps,
  StorageSectionProps,
  SimSectionProps,
  HeroSectionProps,
} from "./types";
