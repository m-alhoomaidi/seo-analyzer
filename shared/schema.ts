import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Main User table - retained from original schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// SEO Analysis schemas
export const seoAnalysisSchema = z.object({
  url: z.string().url().or(z.string().min(1)),
});

export type SeoAnalysisInput = z.infer<typeof seoAnalysisSchema>;

// SEO Tag schema
export const seoTagSchema = z.object({
  name: z.string(),
  value: z.string().optional(),
  category: z.enum(['essential', 'opengraph', 'twitter', 'technical']),
  status: z.enum(['present', 'missing', 'needs_improvement']),
  recommendation: z.string().optional(),
});

export type SeoTag = z.infer<typeof seoTagSchema>;

// SEO Analysis result schema
export const seoAnalysisResultSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  favicon: z.string().optional(),
  tags: z.array(seoTagSchema),
  score: z.number().min(0).max(100),
  googlePreview: z.object({
    title: z.string(),
    url: z.string(),
    description: z.string().optional(),
  }),
  socialPreviews: z.object({
    facebook: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
    }),
    twitter: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      cardType: z.string().optional(),
    }),
  }),
  recommendations: z.object({
    critical: z.array(z.object({
      title: z.string(),
      description: z.string(),
      solution: z.string().optional(),
      additionalInfo: z.string().optional(),
    })),
    improvements: z.array(z.object({
      title: z.string(),
      description: z.string(),
      solution: z.string().optional(),
      additionalInfo: z.string().optional(),
    })),
  }),
  statusSummary: z.object({
    essential: z.object({
      present: z.number(),
      total: z.number(),
    }),
    social: z.object({
      present: z.number(),
      total: z.number(),
    }),
    technical: z.object({
      present: z.number(),
      total: z.number(),
    }),
  }),
});

export type SeoAnalysisResult = z.infer<typeof seoAnalysisResultSchema>;
