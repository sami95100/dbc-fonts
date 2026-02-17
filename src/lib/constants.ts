export const COUNTRY_CODES = ["FR", "BE", "CH", "LU"] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];
