/** Single source of truth for company details used across the site. */
export const SITE = {
  name: "Alpine Landmarks LLP",
  shortName: "Alpine Landmarks",
  tagline: "We build your dreams",
  founded: 2006,
  founder: "Mr. Rajesh Patni",
  phone: "+91 84213 37090",
  phoneRaw: "+918421337090",
  whatsapp: "918421337090",
  email: "alpinelandmarks26@gmail.com",
  address: "Jai Ganesh Vision, Office No. 160/161, B-Wing, Akurdi, Pune - 411035",
  region: "Pimpri-Chinchwad (PCMC), Pune",
  rera: {
    astonia: "P52100047595",
    authority: "MahaRERA",
    url: "https://maharera.maharashtra.gov.in",
  },
  social: {
    instagram: "https://www.instagram.com/alpineastonia/",
    facebook: "https://www.facebook.com/share/1DQubrufqL/",
  },
  stats: [
    { value: "12+", label: "Projects delivered" },
    { value: "1.3M+", label: "Sq. ft. built" },
    { value: "1100+", label: "Happy families" },
    { value: "20", label: "Years of legacy" },
  ],
} as const;

export const waLink = (text: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
