import astoniaDay from "@/assets/astonia-day.jpg";
import astoniaDusk from "@/assets/astonia-dusk.jpg";
import saiCapital from "@/assets/sai-capital.jpg";
import saiCapitalFront from "@/assets/sai-capital-front.jpg";
import uptown32 from "@/assets/uptown-32.jpg";
import alpineGarden from "@/assets/alpine-garden.jpg";
import alpinePlaza from "@/assets/alpine-plaza.jpg";
import gokulam from "@/assets/gokulam.jpg";

import alpineAura from "@/assets/alpine-aura.jpg";
import twinTowers from "@/assets/twin-towers.jpg";
import plan2bhk from "@/assets/astonia-2bhk-plan.png.asset.json";
import plan3bhk from "@/assets/astonia-3bhk-plan.png.asset.json";
import am1 from "@/assets/astonia-amenity-1.jpg.asset.json";
import am2 from "@/assets/astonia-amenity-2.jpg.asset.json";
import am3 from "@/assets/astonia-amenity-3.jpg.asset.json";
import am4 from "@/assets/astonia-amenity-4.jpg.asset.json";
import am5 from "@/assets/astonia-amenity-5.jpg.asset.json";
import am6 from "@/assets/astonia-amenity-6.jpg.asset.json";
import am7 from "@/assets/astonia-amenity-7.jpg.asset.json";
import am8 from "@/assets/astonia-amenity-8.jpg.asset.json";
import am9 from "@/assets/astonia-amenity-9.jpg.asset.json";
import am10 from "@/assets/astonia-amenity-10.jpg.asset.json";
import astoniaBrochure from "@/assets/alpine-astonia-brochure.pdf.asset.json";


export type Project = {
  slug: string;
  name: string;
  location: string;
  status: "Ongoing" | "Completed" | "Coming Soon";
  type: string;
  cover: string;
  banner: string;
  overview: string;
  highlights: string[];
  amenities: string[];
  gallery: string[];
  /** Captioned amenity renders shown as a visual amenity gallery */
  amenityGallery?: { label: string; image: string }[];
  floorPlans?: { label: string; image: string }[];
  /** Quick-glance stats shown on the project detail page */
  quickFacts?: { label: string; value: string }[];
  /** Available unit configurations, e.g. ["2 BHK", "3 BHK"] */
  configurations?: string[];
  /** YouTube video ID for project walkthrough */
  walkthroughVideoId?: string;
  /** YouTube video IDs for resident testimonial videos */
  testimonialVideoIds?: string[];
  /** Google Maps share URL for the project location */
  mapUrl?: string;
  /** Google Maps place ID for precise embedded map positioning */
  mapPlaceId?: string;
  /** Latitude,Longitude fallback when no place ID is available */
  mapCoords?: string;
  /** Precise address query fallback for the embedded map */
  mapQuery?: string;
  /** Downloadable brochure PDF URL */
  brochureUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "alpine-astonia",
    name: "Alpine Astonia",
    location: "Kiwale, PCMC",
    status: "Ongoing",
    type: "Finely Crafted 2 & 3 BHK Homes",
    cover: astoniaDay,
    banner: astoniaDusk,
    overview:
      "Alpine Astonia is a near-possession residential development in Kiwale, Pune, offering finely crafted 2 and 3 BHK homes. Thoughtfully designed residences, lifestyle amenities and strong road connectivity come together for an uplifting everyday experience.",
    highlights: [
      "2 BHK from ₹67.32L, all inclusive",
      "3 BHK from ₹87.95L, all inclusive",
      "Nearing possession homes in Kiwale",
      "Swimming pool with deck and landscaped garden",
      "Yoga deck, party lounge and indoor games",
      "NH 48, Aundh-Ravet BRTS Road and Expressway connectivity",
    ],
    amenities: [
      "Swimming Pool with Deck",
      "Gym",
      "Yoga Deck",
      "Party Lounge",
      "Indoor Games",
      "Children Play Park",
      "Open Badminton Court",
      "Landscaped Garden",
      "Cycle/Jogging Tracks",
      "CCTV Camera Security",
      "Video Door Security",
      "Rain Water Harvesting",
    ],
    gallery: [astoniaDusk, astoniaDay],
    amenityGallery: [
      { label: "Swimming Pool", image: am5.url },
      { label: "Gymnasium", image: am6.url },
      { label: "Indoor Games Room", image: am2.url },
      { label: "Rooftop Yoga Deck", image: am1.url },
      { label: "Rooftop Yoga & Lounge Terrace", image: am8.url },
      { label: "Rooftop Pergola Lounge", image: am3.url },
      { label: "Central Lawn & Water Feature", image: am9.url },
      { label: "Landscaped Entrance Garden", image: am4.url },
      { label: "Kids' Play Area & Badminton Court", image: am7.url },
      { label: "Site Master Layout", image: am10.url },
    ],
    floorPlans: [
      { label: "2 BHK", image: plan2bhk.url },
      { label: "3 BHK", image: plan3bhk.url },
    ],
    configurations: ["2 BHK", "3 BHK"],
    quickFacts: [
      { label: "2 BHK", value: "From ₹67.32L" },
      { label: "3 BHK", value: "From ₹87.95L" },
      { label: "Status", value: "Nearing Possession" },
      { label: "Location", value: "Kiwale, Pune" },
    ],
    walkthroughVideoId: "atjMVCuL2KE",
    testimonialVideoIds: [
      "ClVGXWw7oa8",
      "uvV8GZtHKl8",
      "R9BwBPirLsQ",
      "J15VK3pWQLs",
      "OWIRzKyMtP4",
    ],
    mapUrl: "https://maps.app.goo.gl/mptT3GdbT3Z76uZ68?g_st=iw",
    mapPlaceId: "0x3bc2b1001148a3ef:0xe25f337d756f7505",
    brochureUrl: astoniaBrochure.url,
  },
  {
    slug: "alpine-aura",
    name: "Alpine Aura",
    location: "Moshi, PCMC",
    status: "Completed",
    type: "Large-Format Residential Community",
    cover: alpineAura,
    banner: alpineAura,
    overview:
      "Alpine Aura is a large-format residential community in Moshi — 248 thoughtfully planned apartments set across 65,000 sqft of land with 2,60,000 sqft of built-up area. Designed around generous open spaces and lifestyle amenities for modern families.",
    highlights: [
      "Plot area: 65,000 sqft",
      "Built-up area: 2,60,000 sqft",
      "248 apartments",
      "Multiple residential towers",
      "Landscaped community spaces",
      "Family-first amenity planning",
    ],
    amenities: ["Clubhouse", "Children's Play Area", "Landscaped Lawns", "Jogging Track", "Covered Parking", "24/7 Security"],
    gallery: [alpineAura],
    configurations: ["1 BHK", "2 BHK"],
    quickFacts: [
      { label: "Units", value: "248 Apartments" },
      { label: "Plot Area", value: "65,000 sqft" },
      { label: "Built-Up", value: "2,60,000 sqft" },
      { label: "Status", value: "Completed" },
    ],
    mapUrl: "https://maps.app.goo.gl/w1jcPmJQFYC3ZwDA6?g_st=iw",
    mapPlaceId: "0x3bc2c8015259da33:0x46b8d8d9faba93d7",
  },
  {
    slug: "twin-towers",
    name: "Twin Towers",
    location: "Ravet, PCMC",
    status: "Completed",
    type: "Mixed-Use Residences with Retail",
    cover: twinTowers,
    banner: twinTowers,
    overview:
      "Twin Towers is a defining mixed-use development in Ravet — 162 apartments across two towers, paired with a 52-shop retail base. Built on 75,000 sqft of land with 2,50,000 sqft of built-up area, it brings premium residential living and a vibrant high street together at one address.",
    highlights: [
      "Plot area: 75,000 sqft",
      "Built-up area: 2,50,000 sqft",
      "162 apartments across two towers",
      "52-shop retail boulevard",
      "Premium clubhouse & amenities",
      "Strategic Ravet location",
    ],
    amenities: ["Retail Boulevard", "Clubhouse", "Landscaped Podium", "Covered Parking", "24/7 Security", "Power Backup"],
    gallery: [twinTowers],
    configurations: ["2 BHK", "3 BHK"],
    quickFacts: [
      { label: "Units", value: "162 Apartments" },
      { label: "Retail", value: "52 Shops" },
      { label: "Plot Area", value: "75,000 sqft" },
      { label: "Built-Up", value: "2,50,000 sqft" },
    ],
    mapUrl: "https://maps.app.goo.gl/FEhcYczCLhxUfjES6?g_st=iw",
    mapPlaceId: "0x3bc2ba1cb39de117:0xc0fe7d1fd3c9ebeb",
  },
  {
    slug: "sai-capital",
    name: "Sai Capital",
    location: "Moshi, PCMC",
    status: "Completed",
    type: "Premium Residences with Retail Plaza",
    cover: saiCapitalFront,
    banner: saiCapital,
    overview:
      "Sai Capital is a vibrant mixed-use landmark in Moshi — 110 apartments rising above a 26-shop retail plaza. With slender residential towers crowned by intricate jaali screens above a double-height boutique high street, it blends contemporary living with everyday convenience.",
    highlights: [
      "Plot area: 24,000 sqft",
      "Built-up area: 1,50,000 sqft",
      "110 apartments",
      "26 ground-level retail shops",
      "Decorative jaali-screen sky terraces",
      "Double-height retail plaza",
    ],
    amenities: ["Retail Plaza", "Landscaped Frontage", "24/7 Security", "Power Backup", "Covered Parking", "Elevator Lobbies"],
    gallery: [saiCapitalFront, saiCapital],
    configurations: ["2 BHK", "3 BHK"],
    quickFacts: [
      { label: "Units", value: "110 Apartments" },
      { label: "Retail", value: "26 Shops" },
      { label: "Plot Area", value: "24,000 sqft" },
      { label: "Built-Up", value: "1,50,000 sqft" },
    ],
    mapUrl: "https://maps.app.goo.gl/qBXK21Mzvc9B8unQA?g_st=iw",
    mapPlaceId: "0x3bc2c949c442c30d:0x8be5b02321589e6b",
    mapQuery: "MVG5 CPM sai capital moshi",
  },
  {
    slug: "32-uptown",
    name: "32 Uptown",
    location: "Ravet, PCMC",
    status: "Completed",
    type: "Commercial & Retail Hub",
    cover: uptown32,
    banner: uptown32,
    overview:
      "32 Uptown is a thriving multi-storey commercial address in Ravet — 46 shops and offices set across 7,000 sqft of land and 23,000 sqft of built-up area. With its stepped balcony profile and high-visibility frontage, it has become a go-to neighbourhood landmark for daily life and business.",
    highlights: [
      "Plot area: 7,000 sqft",
      "Built-up area: 23,000 sqft",
      "46 shops & office units",
      "Stepped facade with shaded balconies",
      "Mix of clinics, F&B and offices",
      "Delivered & fully operational",
    ],
    amenities: ["Retail Plaza", "Café & F&B", "Clinic Floors", "Office Suites", "ATM & Banking", "24/7 Security"],
    gallery: [uptown32],
    configurations: ["Retail Shop", "Office Suite"],
    quickFacts: [
      { label: "Units", value: "46 Shops & Offices" },
      { label: "Plot Area", value: "7,000 sqft" },
      { label: "Built-Up", value: "23,000 sqft" },
      { label: "Status", value: "Delivered" },
    ],
    mapUrl: "https://maps.app.goo.gl/dSvmssJfJLFtf3W87?g_st=iw",
    mapCoords: "18.6432964,73.7584067",
  },
  {
    slug: "gokulam",
    name: "Gokulam",
    location: "Chikhali, PCMC",
    status: "Completed",
    type: "Mid-Rise Residences with Street Retail",
    cover: gokulam,
    banner: gokulam,
    overview:
      "Gokulam is a mid-rise residential community in Chikhali wrapped in greenery, with a vibrant street-facing retail base. 70 apartments and 20 shops are set across 30,000 sqft of land with 1,00,000 sqft of built-up area — designed for everyday family living with shopping at your doorstep.",
    highlights: [
      "Plot area: 30,000 sqft",
      "Built-up area: 1,00,000 sqft",
      "70 apartments",
      "20 ground-level retail shops",
      "Internal landscaped courtyard",
      "Wide-frontage road access",
    ],
    amenities: ["Internal Courtyard", "Retail Street", "Children's Play Area", "Covered Parking", "24/7 Security", "Power Backup"],
    gallery: [gokulam],
    configurations: ["1 BHK", "2 BHK"],
    quickFacts: [
      { label: "Units", value: "70 Apartments" },
      { label: "Retail", value: "20 Shops" },
      { label: "Plot Area", value: "30,000 sqft" },
      { label: "Built-Up", value: "1,00,000 sqft" },
    ],
    mapUrl: "https://maps.app.goo.gl/zFMQaRvKJu3KuyuYA?g_st=iw",
    mapPlaceId: "0x3bc2b795d42a05d1:0xd4260f0f155671f2",
    mapQuery: "Gokulam Apartment, Ramdas Nagar, Chikhali, Pimpri-Chinchwad, Maharashtra 411062",
  },
  {
    slug: "alpine-garden",
    name: "Alpine Garden",
    location: "Chinchwad, PCMC",
    status: "Completed",
    type: "Residential Community",
    cover: alpineGarden,
    banner: alpineGarden,
    overview:
      "Alpine Garden is a serene residential community in Chinchwad — 72 family residences spread across 40,000 sqft of land and 70,000 sqft of built-up area. With its signature pitched-roof silhouette, warm earthen palette and tree-lined frontage, it offers a calm, grounded way of living.",
    highlights: [
      "Plot area: 40,000 sqft",
      "Built-up area: 70,000 sqft",
      "72 apartments",
      "Distinctive pitched-roof architecture",
      "Landscaped gardens & tree-lined approach",
      "Spacious balconies on every home",
    ],
    amenities: ["Landscaped Gardens", "Children's Play Area", "Community Lawn", "Covered Parking", "24/7 Security", "Power Backup"],
    gallery: [alpineGarden],
    configurations: ["2 BHK", "3 BHK"],
    quickFacts: [
      { label: "Units", value: "72 Apartments" },
      { label: "Plot Area", value: "40,000 sqft" },
      { label: "Built-Up", value: "70,000 sqft" },
      { label: "Status", value: "Delivered" },
    ],
    mapUrl: "https://maps.app.goo.gl/FnDQYNZrqWc5pJRC9?g_st=iw",
    mapPlaceId: "0x3bc2b77972e9c1bd:0xaee0e4f33bbe677b",
  },
  {
    slug: "alpine-plaza",
    name: "Alpine Plaza",
    location: "Chinchwad, PCMC",
    status: "Completed",
    type: "Boutique Residential Apartments",
    cover: alpinePlaza,
    banner: alpinePlaza,
    overview:
      "Alpine Plaza is a refined boutique residential building in Chinchwad — 28 apartments set across 14,500 sqft of land and 20,000 sqft of built-up area. Its warm ochre-and-ivory facade, generous windows and rooftop terrace gardens make it a calm, family-first address.",
    highlights: [
      "Plot area: 14,500 sqft",
      "Built-up area: 20,000 sqft",
      "28 apartments",
      "Warm ochre & ivory facade",
      "Rooftop terrace gardens",
      "Gated entry with landscaped frontage",
    ],
    amenities: ["Rooftop Terrace", "Landscaped Compound", "Covered Parking", "24/7 Security", "Power Backup", "Visitor Parking"],
    gallery: [alpinePlaza],
    configurations: ["2 BHK", "3 BHK"],
    quickFacts: [
      { label: "Units", value: "28 Apartments" },
      { label: "Plot Area", value: "14,500 sqft" },
      { label: "Built-Up", value: "20,000 sqft" },
      { label: "Status", value: "Delivered" },
    ],
    mapUrl: "https://maps.app.goo.gl/hDsRvdrmP6Nn6TtS9?g_st=iw",
    mapPlaceId: "0x3bc2b9e3a11467b7:0x322d3b1252c8933b",
  },
];

export const findProject = (slug: string) => projects.find((p) => p.slug === slug);
