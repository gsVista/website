export interface Project {
  id: string;
  title: string;
  client: string;
  category:
    | "Climate & Flood"
    | "Precision Agriculture"
    | "Urban Planning"
    | "Remote Sensing"
    | "Renewable Energy"
    | "Infrastructure"
    | "GIS Mapping";
  summary: string;
  description: string;
  tags: string[];
  coverImage: string;
  date: string;
  featured: boolean;
  deliverables: string[];
  location?: string;
  toolsUsed?: string[];
}

export interface Review {
  id: string;
  author: string;
  role: string;
  organization: string;
  content: string;
  rating: number;
  date?: string;
  verified: boolean;
}

export interface Service {
  id: string;
  icon:
    | "Waves"
    | "Sprout"
    | "Building"
    | "Sun"
    | "Satellite"
    | "Database"
    | "Layers"
    | "Globe";
  title: string;
  category: string;
  description: string;
  tools: string[];
  deliverables: string[];
  methodology: string;
  order: number;
}

export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
}

export interface MapLayerItem {
  id: string;
  name: string;
  type: "geojson" | "cog" | "raster";
  description: string;
  color: string;
  colorField?: string; // property name to drive data-expression fill colouring
  url?: string;
  data?: any; // Inline GeoJSON object
  visible: boolean;
  opacity?: number;
  createdAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  inquiryType:
    | "Contract / Project Inquiry"
    | "Government / NGO"
    | "Consulting"
    | "General";
  message: string;
  budget?: string;
  createdAt: string;
  status: "new" | "reviewed" | "contracted";
}
