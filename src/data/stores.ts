export interface DayHours {
  open: string;
  close: string;
  open2?: string;
  close2?: string;
  closed?: boolean;
}

export interface Store {
  key: string;
  city: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  image: string;
  weeklyHours: DayHours[];
}

export const STORES: Store[] = [
  {
    key: "rosny2",
    city: "Rosny-sous-Bois",
    address: "CC Westfield Rosny 2, 1er etage Porte 1, 93110 Rosny-sous-Bois",
    phone: "07 43 63 83 46",
    lat: 48.8836,
    lng: 2.4776,
    image: "/rosny2.svg",
    weeklyHours: [
      { open: "10:00", close: "20:00" },
      { open: "10:00", close: "20:30" },
      { open: "10:00", close: "20:30" },
      { open: "10:00", close: "20:30" },
      { open: "10:00", close: "20:30" },
      { open: "10:00", close: "20:30" },
      { open: "10:00", close: "20:30" },
    ],
  },
  {
    key: "paris17",
    city: "Paris 17e",
    address: "110 Avenue de Villiers, 75017 Paris",
    phone: "06 95 06 48 67",
    lat: 48.88482,
    lng: 2.29858,
    image: "/paris 17 .svg",
    weeklyHours: [
      { open: "11:00", close: "19:30" },
      { open: "11:00", close: "19:30" },
      { open: "11:00", close: "19:30" },
      { open: "11:00", close: "19:30" },
      { open: "11:00", close: "19:30" },
      { open: "15:30", close: "19:30" },
      { open: "11:00", close: "19:30" },
    ],
  },
  {
    key: "paris12",
    city: "Paris 12e",
    address: "30 Avenue Daumesnil, 75012 Paris",
    phone: "07 43 39 55 26",
    lat: 48.84739,
    lng: 2.37481,
    image: "/paris 12.svg",
    weeklyHours: [
      { open: "11:00", close: "19:30" },
      { open: "11:00", close: "19:30" },
      { open: "11:00", close: "19:30" },
      { open: "11:00", close: "19:30" },
      { open: "11:00", close: "19:30" },
      { open: "15:00", close: "19:30" },
      { open: "11:00", close: "19:30" },
    ],
  },
  {
    key: "lille",
    city: "Lille",
    address: "23 Rue Leon Gambetta, 59000 Lille",
    phone: "07 60 55 60 39",
    lat: 50.63127,
    lng: 3.05939,
    image: "/dbc lille.svg",
    weeklyHours: [
      { open: "11:00", close: "20:30" },
      { open: "11:00", close: "20:30" },
      { open: "11:00", close: "20:30" },
      { open: "11:00", close: "20:30" },
      { open: "11:00", close: "20:30" },
      { open: "15:00", close: "20:30" },
      { open: "11:00", close: "20:30" },
    ],
  },
  {
    key: "bruxelles",
    city: "Bruxelles",
    address: "Boulevard Anspach 123, 1000 Bruxelles",
    phone: "+32 2 520 61 00",
    lat: 50.84664,
    lng: 4.34752,
    image: "/bruxelle.svg",
    weeklyHours: [
      { open: "", close: "", closed: true },
      { open: "11:00", close: "19:30" },
      { open: "11:00", close: "19:30" },
      { open: "11:00", close: "19:30" },
      { open: "11:00", close: "19:30" },
      { open: "15:00", close: "19:30" },
      { open: "11:00", close: "19:30" },
    ],
  },
  {
    key: "marseille",
    city: "Marseille",
    address: "Centre-ville, Marseille",
    phone: "04 86 68 32 30",
    lat: 43.2965,
    lng: 5.3698,
    image: "/marseille.svg",
    weeklyHours: [
      { open: "", close: "", closed: true },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
    ],
  },
  {
    key: "laValentine",
    city: "Marseille",
    address: "CC Grand V, 117 Traverse de la Montre, 13011 Marseille",
    phone: "04 86 68 32 30",
    lat: 43.29584,
    lng: 5.47916,
    image: "/marseille.svg",
    weeklyHours: [
      { open: "", close: "", closed: true },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
    ],
  },
  {
    key: "toulouse",
    city: "Toulouse",
    address: "88 Avenue de Grande Bretagne, 31300 Toulouse",
    phone: "07 66 12 42 62",
    lat: 43.59892,
    lng: 1.41783,
    image: "/toulouse.svg",
    weeklyHours: [
      { open: "15:00", close: "20:00" },
      { open: "10:00", close: "20:00" },
      { open: "10:00", close: "20:00" },
      { open: "10:00", close: "20:00" },
      { open: "10:00", close: "20:00" },
      { open: "15:00", close: "20:00" },
      { open: "10:00", close: "20:00" },
    ],
  },
  {
    key: "bordeaux",
    city: "Bordeaux",
    address: "189 Cours de la Marne, 33800 Bordeaux",
    phone: "06 15 44 47 84",
    lat: 44.82816,
    lng: -0.56121,
    image: "/bordeaux.svg",
    weeklyHours: [
      { open: "", close: "", closed: true },
      { open: "11:00", close: "13:00", open2: "14:00", close2: "19:00" },
      { open: "11:00", close: "13:00", open2: "14:00", close2: "19:00" },
      { open: "11:00", close: "13:00", open2: "14:00", close2: "19:00" },
      { open: "11:00", close: "13:00", open2: "14:00", close2: "19:00" },
      { open: "15:00", close: "19:00" },
      { open: "11:00", close: "13:00", open2: "14:00", close2: "19:00" },
    ],
  },
];

export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getStoreStatus(store: Store): { label: string; isOpen: boolean } {
  const now = new Date();
  const day = now.getDay();
  const h = store.weeklyHours[day];

  if (h.closed) {
    return { label: "", isOpen: false };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const toMin = (t: string) => {
    const [hh, mm] = t.split(":").map(Number);
    return hh * 60 + mm;
  };

  if (h.open2 && h.close2) {
    const open1 = toMin(h.open);
    const close1 = toMin(h.close);
    const open2 = toMin(h.open2);
    const close2 = toMin(h.close2);

    if (currentMinutes < open1) return { label: h.open, isOpen: false };
    if (currentMinutes >= open1 && currentMinutes < close1) return { label: h.close, isOpen: true };
    if (currentMinutes >= close1 && currentMinutes < open2) return { label: h.open2, isOpen: false };
    if (currentMinutes >= open2 && currentMinutes < close2) return { label: h.close2, isOpen: true };
    return { label: "", isOpen: false };
  }

  const openMin = toMin(h.open);
  const closeMin = toMin(h.close);

  if (currentMinutes < openMin) return { label: h.open, isOpen: false };
  if (currentMinutes >= closeMin) return { label: "", isOpen: false };
  return { label: h.close, isOpen: true };
}
