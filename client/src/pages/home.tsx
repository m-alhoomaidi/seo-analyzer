import { useState } from "react";
import { UrlInputForm } from "@/components/url-input-form";
import { SeoResults } from "@/components/seo-results";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";
import { type SeoAnalysisResult } from "@shared/schema";
import { analyzeUrl } from "@/utils/seo-analyzer";

export default function Home() {
  const [seoResult, setSeoResult] = useState<SeoAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async (url: string) => {
    try {
      setIsAnalyzing(true);
      const result = await analyzeUrl(url);
      setSeoResult(result);
    } catch (error) {
      toast({
        title: "Error analyzing website",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-5xl mb-3 tracking-tight">
            <span className="text-gradient">SEO Tag Analyzer</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Analyze and validate SEO meta tags for any website to improve your search engine visibility
          </p>
        </header>

        <UrlInputForm onSubmit={handleAnalyze} isLoading={isAnalyzing} />

        {isAnalyzing ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary"></div>
          </div>
        ) : seoResult ? (
          <SeoResults result={seoResult} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
