export const BRAND = {
  name: "Apex Global Tours & Travels",
  short: "Apex Tours & Travels",
  legal: "Apex Global Tours & Travels (Pvt) Ltd",
  tagline: "Travel. Mobility. Pilgrimage.",
  promise: "Your Journey. Our Responsibility.",
  support: "Trust. Comfort. Transparency. Reliability. Convenience.",
  whatsapp: "923001234567", // placeholder — admin to set real number
  whatsappDisplay: "+92 300 123 4567",
  phone: "+92 300 123 4567",
  email: "hello@apexglobaltravel.example",
  hqCity: "Karachi, Lahore & Riyadh",
  address: "Pakistan · Saudi Arabia · offices in Karachi, Lahore, and Riyadh",
};

export const NAV = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Car Rentals",
    href: "/pakistan-car-rental",
    children: [
      { label: "Pakistan Car Rental", href: "/pakistan-car-rental" },
      { label: "With Driver", href: "/car-rental-with-driver" },
      { label: "Self-Drive", href: "/self-drive-car-rental" },
      { label: "Saudi Arabia", href: "/saudi-car-rental" },
      { label: "Vehicle Fleet", href: "/vehicles" },
    ],
  },
  {
    label: "Hajj & Umrah",
    href: "/hajj-umrah",
    children: [
      { label: "Overview", href: "/hajj-umrah" },
      { label: "Umrah Packages", href: "/umrah-packages" },
      { label: "Hajj Packages", href: "/hajj-packages" },
      { label: "Custom Package", href: "/custom-package" },
      { label: "Group Packages", href: "/group-package" },
    ],
  },
  {
    label: "Destinations",
    href: "/destinations",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export const WHATSAPP_LINK = (msg: string) =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`;
