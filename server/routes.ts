import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { seoAnalyzeUrl } from "./seo-analyzer";
import { seoAnalysisSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for SEO analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      // Validate request body
      const { url } = seoAnalysisSchema.parse(req.body);
      
      try {
        // Perform SEO analysis
        const result = await seoAnalyzeUrl(url);
        res.json(result);
      } catch (error) {
        console.error("Error analyzing URL:", error);
        res.status(500).json({ 
          message: error instanceof Error 
            ? error.message 
            : "Failed to analyze the website. Please try again later."
        });
      }
    } catch (error) {
      // Handle validation errors
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(400).json({ 
          message: error instanceof Error 
            ? error.message 
            : "Invalid request"
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
