
type AgeUnit = "months" | "years";
type PetType = "dog" | "cat";

interface Region {
  name: string;
  communes: string[];
}

interface ContactMethod {
  method: "whatsapp" | "telegram" | "x" | "instagram" | "tiktok" | "other" | "";
  value?: string;
}

interface Notice {
  id: string;
  publishedAt: string; // "YYYY-MM-DDTHH:mm"
  deliveryAt: string;  // "YYYY-MM-DDTHH:mm"
  region: string;
  commune: string;
  sector: string;
  type: PetType;
  amount: number;
  age: number;
  ageUnit: AgeUnit;
  contactName: string;
  contactEmail: string;
  phone: string; // +NNN.NNNNNNNN
  contactMethod?: ContactMethod;
  description?: string;
  photos: { kind: PetType; count: number };
}


// ==== Regions & communes (subset per region for the prototype) ====
const REGIONS: Region[] = [
  { name: "Arica y Parinacota", communes: ["Arica", "Camarones", "Putre", "General Lagos"] },
  { name: "Tarapacá", communes: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica"] },
  { name: "Antofagasta", communes: ["Antofagasta", "Mejillones", "Taltal", "Calama"] },
  { name: "Atacama", communes: ["Copiapó", "Caldera", "Vallenar", "Chañaral"] },
  { name: "Coquimbo", communes: ["La Serena", "Coquimbo", "Ovalle", "Vicuña"] },
  { name: "Valparaíso", communes: ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio"] },
  { name: "Metropolitana de Santiago", communes: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto"] },
  { name: "Libertador Gral. Bernardo O'Higgins", communes: ["Rancagua", "San Fernando", "Santa Cruz", "Rengo"] },
  { name: "Maule", communes: ["Talca", "Curicó", "Linares", "Cauquenes"] },
  { name: "Ñuble", communes: ["Chillán", "Chillán Viejo", "San Carlos", "Coihueco"] },
  { name: "Biobío", communes: ["Concepción", "Talcahuano", "Los Ángeles", "Coronel"] },
  { name: "La Araucanía", communes: ["Temuco", "Padre Las Casas", "Villarrica", "Angol"] },
  { name: "Los Ríos", communes: ["Valdivia", "La Unión", "Río Bueno", "Panguipulli"] },
  { name: "Los Lagos", communes: ["Puerto Montt", "Osorno", "Castro", "Puerto Varas"] },
  { name: "Aysén del Gral. C. Ibáñez del Campo", communes: ["Coyhaique", "Puerto Aysén", "Chile Chico", "Cochrane"] },
  { name: "Magallanes y de la Antártica Chilena", communes: ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos"] }
];

// ==== Helpers ====
function pad2(n: number): string { return String(n).padStart(2, "0"); }

function toLocalDatetimeValue(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function fmtHuman(dtLocal: string): string {
  return dtLocal.replace("T", " ");
}

function svgDataUrl(label: string, w: number, h: number, fill: string): string {
  const esc = (s: string) => encodeURIComponent(s);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
  <rect width='100%' height='100%' fill='${fill}'/>
  <text x='50%' y='50%' font-size='${Math.floor(Math.min(w,h)/10)}' text-anchor='middle' dominant-baseline='middle' fill='black' font-family='Arial, sans-serif'>${label}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${esc(svg)}`;
}

function photoSmall(kind: PetType): string {
  return svgDataUrl(`${kind.toUpperCase()} 320x240`, 320, 240, kind === "cat" ? "moccasin" : "lightblue");
}

function photoLarge(kind: PetType): string {
  return svgDataUrl(`${kind.toUpperCase()} 800x600`, 800, 600, kind === "cat" ? "peachpuff" : "powderblue");
}

// ==== Demo dataset (5 notices) ====
const NOTICES: Notice[] = [
  {
    id: "n1",
    publishedAt: "2025-08-18T12:00",
    deliveryAt: "2025-08-18T15:00",
    region: "Metropolitana de Santiago",
    commune: "Santiago",
    sector: "Beauchef 850, terraza",
    type: "cat",
    amount: 1,
    age: 2,
    ageUnit: "months",
    contactName: "Ana Pérez",
    contactEmail: "ana.perez@example.com",
    phone: "+569.12345678",
    contactMethod: { method: "whatsapp", value: "+56 9 1234 5678" },
    description: "Friendly 2-month-old kitten found near Beauchef.",
    photos: { kind: "cat", count: 2 }
  },
  {
    id: "n2",
    publishedAt: "2025-08-19T09:30",
    deliveryAt: "2025-08-21T10:00",
    region: "Valparaíso",
    commune: "Viña del Mar",
    sector: "Avenida Perú 1000",
    type: "dog",
    amount: 2,
    age: 1,
    ageUnit: "years",
    contactName: "Luis Soto",
    contactEmail: "luis.soto@example.com",
    phone: "+569.87654321",
    contactMethod: { method: "telegram", value: "@luis_soto" },
    description: "Two small mixed-breed dogs, vaccinated.",
    photos: { kind: "dog", count: 3 }
  },
  {
    id: "n3",
    publishedAt: "2025-08-20T14:10",
    deliveryAt: "2025-08-23T16:00",
    region: "Biobío",
    commune: "Concepción",
    sector: "Plaza de la Independencia",
    type: "cat",
    amount: 3,
    age: 5,
    ageUnit: "months",
    contactName: "María López",
    contactEmail: "maria.lopez@example.com",
    phone: "+569.33334444",
    contactMethod: { method: "instagram", value: "instagram.com/maria_l" },
    description: "Litter of playful kittens.",
    photos: { kind: "cat", count: 1 }
  },
  {
    id: "n4",
    publishedAt: "2025-08-22T08:05",
    deliveryAt: "2025-08-25T11:30",
    region: "Coquimbo",
    commune: "La Serena",
    sector: "Av. Francisco de Aguirre 250",
    type: "dog",
    amount: 1,
    age: 8,
    ageUnit: "months",
    contactName: "Pedro González",
    contactEmail: "pgonzalez@example.com",
    phone: "+569.22223333",
    contactMethod: { method: "x", value: "x.com/pedrog" },
    description: "Loyal, medium-sized dog, great with kids.",
    photos: { kind: "dog", count: 2 }
  },
  {
    id: "n5",
    publishedAt: "2025-08-24T18:40",
    deliveryAt: "2025-08-27T09:00",
    region: "Los Lagos",
    commune: "Puerto Montt",
    sector: "Costanera, muelle",
    type: "cat",
    amount: 1,
    age: 2,
    ageUnit: "years",
    contactName: "Sofía Reyes",
    contactEmail: "sofia.reyes@example.com",
    phone: "+569.55556666",
    contactMethod: { method: "other", value: "t.me/sofia_r" },
    description: "Calm adult cat, sterilized, indoor friendly.",
    photos: { kind: "cat", count: 2 }
  }
];

// ==== shared helpers ====
function getNoticeById(id: string): Notice | undefined {
  return NOTICES.find(n => n.id === id);
}

function lastNNotices(n: number): Notice[] {
  return [...NOTICES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, n);
}

