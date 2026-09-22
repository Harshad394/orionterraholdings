export const siteConfig = {
  name: "Orion Terra",
  tagline: "Discover Land. Unlock Opportunities.",
  description:
    "Explore strategically located land opportunities for acquisition, redevelopment, joint ventures and investment across key growth corridors.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://orionterra.com",
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@orionterra.com",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+91 98765 43210",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210",
    addressPlaceholder: "Orion Terra Business Towers, Financial District, Maharashtra, India",
  },
  links: {
    whatsapp: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}`,
  },
};

export type SiteConfig = typeof siteConfig;
