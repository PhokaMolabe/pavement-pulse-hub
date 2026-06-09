import s1 from "@/assets/sneaker-1.jpg";
import s2 from "@/assets/sneaker-2.jpg";
import s3 from "@/assets/sneaker-3.jpg";
import s4 from "@/assets/sneaker-4.jpg";
import s5 from "@/assets/sneaker-5.jpg";
import s6 from "@/assets/sneaker-6.jpg";
import hero from "@/assets/hero-sneaker.jpg";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  colorway: string;
  price: number;
  retail: number;
  image: string;
  tag?: "New" | "Drop" | "Limited" | "Restock";
  category: "Lifestyle" | "Running" | "Basketball" | "Skate" | "Retro";
  sizes: number[];
  description: string;
};

const sizes = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12];

export const PRODUCTS: Product[] = [
  {
    slug: "pulse-runner-og",
    name: "Pulse Runner OG",
    brand: "Pavement Pulse",
    colorway: "Core White / Volt",
    price: 2899,
    retail: 2899,
    image: hero,
    tag: "Drop",
    category: "Running",
    sizes,
    description:
      "The signature silhouette. A featherweight knit upper sits on a sculpted carbon-infused midsole with a volt-glow outsole. Built for the city, designed for the culture.",
  },
  {
    slug: "concrete-low-01",
    name: "Concrete Low 01",
    brand: "Pavement Pulse",
    colorway: "Atelier White",
    price: 2199,
    retail: 2499,
    image: s1,
    tag: "New",
    category: "Lifestyle",
    sizes,
    description: "A study in restraint. Engineered mesh, full-grain leather overlays, and a stripped-back tooling.",
  },
  {
    slug: "midnight-cut-hi",
    name: "Midnight Cut Hi",
    brand: "Atelier 23",
    colorway: "Triple Black",
    price: 3499,
    retail: 3499,
    image: s2,
    tag: "Limited",
    category: "Basketball",
    sizes,
    description: "Tumbled leather, padded collar, court-ready cupsole. Built in collaboration with Atelier 23.",
  },
  {
    slug: "fieldwork-trail",
    name: "Fieldwork Trail",
    brand: "Borough",
    colorway: "Bone / Moss",
    price: 2599,
    retail: 2799,
    image: s3,
    tag: "Restock",
    category: "Retro",
    sizes,
    description: "Heritage trail aesthetics rebuilt with modern cushioning. A tribute to the early 2000s archive.",
  },
  {
    slug: "monolith-92",
    name: "Monolith 92",
    brand: "Pavement Pulse",
    colorway: "Salt",
    price: 2999,
    retail: 2999,
    image: s4,
    category: "Lifestyle",
    sizes,
    description: "Sculpted, oversized, all-white. A blank canvas for the streets.",
  },
  {
    slug: "deck-pro-canvas",
    name: "Deck Pro Canvas",
    brand: "Roster",
    colorway: "Inkwell",
    price: 1599,
    retail: 1699,
    image: s5,
    category: "Skate",
    sizes,
    description: "Vulcanised construction, padded tongue, double-stitched toebox. Built to break in, built to last.",
  },
  {
    slug: "velocity-flux",
    name: "Velocity Flux",
    brand: "Atelier 23",
    colorway: "Obsidian / Volt",
    price: 3299,
    retail: 3299,
    image: s6,
    tag: "Drop",
    category: "Running",
    sizes,
    description: "Plate-assisted propulsion in a daily-trainer chassis. Volt-glow midsole signature.",
  },
];

export const BRANDS = ["Pavement Pulse", "Atelier 23", "Borough", "Roster", "North Cell", "Format", "Outpost"];

export const DROPS = [
  { date: "FRI 14 JUN", name: "Pulse Runner — Volt Wave", brand: "Pavement Pulse", time: "09:00 SAST" },
  { date: "SAT 22 JUN", name: "Atelier 23 × Borough Capsule", brand: "Collab", time: "10:00 SAST" },
  { date: "FRI 28 JUN", name: "Monolith 92 — Onyx", brand: "Pavement Pulse", time: "09:00 SAST" },
  { date: "FRI 05 JUL", name: "Fieldwork Trail — Riverbed", brand: "Borough", time: "09:00 SAST" },
];

export const JOURNAL = [
  {
    slug: "the-soul-of-the-city",
    category: "Editorial",
    title: "The Soul of the City",
    excerpt: "On pavement, footwork, and the quiet language of a well-worn pair.",
    read: "6 min read",
  },
  {
    slug: "field-guide-volt",
    category: "Field Guide",
    title: "A Field Guide to Volt",
    excerpt: "The single color that defined a decade of performance design.",
    read: "4 min read",
  },
  {
    slug: "atelier-23-interview",
    category: "Interview",
    title: "Inside Atelier 23",
    excerpt: "A conversation with the studio rebuilding court silhouettes from the sole up.",
    read: "9 min read",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
