import { useState } from "react";
import { UrlInputForm } from "@/components/url-input-form";
import { SeoResults } from "@/components/seo-results";
import { EmptyState } from "@/components/empty-state";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type SeoAnalysisResult } from "@shared/schema";

export default function Home() {
  const [seoResult, setSeoResult] = useState<SeoAnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json() as Promise<SeoAnalysisResult>;
    },
    onSuccess: (data) => {
      setSeoResult(data);
    },
    onError: (error) => {
      toast({
        title: "Error analyzing website",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  });

  const handleAnalyze = (url: string) => {
    analyzeMutation.mutate(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">SEO Tag Analyzer</h1>
        <p className="text-lg text-gray-600">Analyze and validate SEO meta tags for any website</p>
      </header>

      <UrlInputForm onSubmit={handleAnalyze} isLoading={analyzeMutation.isPending} />

      {analyzeMutation.isPending ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : seoResult ? (
        <SeoResults result={seoResult} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
