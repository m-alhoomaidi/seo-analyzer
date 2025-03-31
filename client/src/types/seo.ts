// This file contains additional types that might be needed beyond what's in schema.ts

import type { SeoTag, SeoAnalysisResult } from "@shared/schema";

// Type for tag categories
export type TagCategory = 'essential' | 'opengraph' | 'twitter' | 'technical';

// Type for tag status
export type TagStatus = 'present' | 'missing' | 'needs_improvement';

// Interface for recommendations
export interface Recommendation {
  title: string;
  description: string;
  solution?: string;
  additionalInfo?: string;
}

// Interface for SEO checks
export interface SeoCheck {
  name: string;
  description: string;
  check: (meta: Record<string, string>) => {
    status: TagStatus;
    value?: string;
    recommendation?: string;
  };
  category: TagCategory;
}
