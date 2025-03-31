import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import type { SeoAnalysisResult } from "@shared/schema";

interface RecommendationsTabProps {
  recommendations: SeoAnalysisResult['recommendations'];
}

export function RecommendationsTab({ recommendations }: RecommendationsTabProps) {
  return (
    <Card className="shadow-md border-0">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-5 flex items-center">
          <span className="text-gradient">SEO Recommendations</span>
        </h2>
        
        <div className="space-y-8">
          {/* Critical Issues */}
          {recommendations.critical.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-error mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Critical Issues
              </h3>
              
              <div className="space-y-4">
                {recommendations.critical.map((issue, idx) => (
                  <div key={idx} className="border-l-4 border-error bg-red-50 p-4 rounded-r-md shadow-sm">
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 mb-2 sm:mb-0">
                        <AlertCircle className="h-5 w-5 text-error" />
                      </div>
                      <div className="sm:ml-3">
                        <h4 className="text-sm font-medium text-red-800">{issue.title}</h4>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{issue.description}</p>
                          {issue.solution && (
                            <>
                              <p className="mt-1">Add the following tag to your page head:</p>
                              <div className="mt-1 bg-red-100 p-2 rounded text-xs overflow-x-auto">
                                <pre className="whitespace-pre-wrap break-words">
                                  <code>{issue.solution}</code>
                                </pre>
                              </div>
                            </>
                          )}
                        </div>
                        {issue.additionalInfo && (
                          <div className="mt-2">
                            <p className="text-xs text-red-700">{issue.additionalInfo}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Improvements */}
          {recommendations.improvements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-warning mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Suggested Improvements
              </h3>
              
              <div className="space-y-4">
                {recommendations.improvements.map((improvement, idx) => (
                  <div key={idx} className="border-l-4 border-warning bg-yellow-50 p-4 rounded-r-md shadow-sm">
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 mb-2 sm:mb-0">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                      </div>
                      <div className="sm:ml-3">
                        <h4 className="text-sm font-medium text-yellow-800">{improvement.title}</h4>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>{improvement.description}</p>
                          {improvement.solution && (
                            <>
                              <p className="mt-1">Add the following tags:</p>
                              <div className="mt-1 bg-yellow-100 p-2 rounded text-xs overflow-x-auto">
                                <pre className="whitespace-pre-wrap break-words">
                                  <code>{improvement.solution}</code>
                                </pre>
                              </div>
                            </>
                          )}
                        </div>
                        {improvement.additionalInfo && (
                          <div className="mt-2">
                            <p className="text-xs text-yellow-700">{improvement.additionalInfo}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Best Practices */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              SEO Best Practices
            </h3>
            
            <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-md shadow-sm">
              <div className="flex items-start">
                <span className="text-success mr-2 flex-shrink-0">✓</span>
                <span className="flex-grow">Keep your title tag under 60 characters to ensure it displays fully in search results.</span>
              </div>
              <div className="flex items-start">
                <span className="text-success mr-2 flex-shrink-0">✓</span>
                <span className="flex-grow">Include your main keyword in both the title and meta description.</span>
              </div>
              <div className="flex items-start">
                <span className="text-success mr-2 flex-shrink-0">✓</span>
                <span className="flex-grow">Use unique meta descriptions for each page (don't duplicate).</span>
              </div>
              <div className="flex items-start">
                <span className="text-success mr-2 flex-shrink-0">✓</span>
                <span className="flex-grow">Make sure Open Graph images are at least 1200×630 pixels for optimal display on Facebook.</span>
              </div>
              <div className="flex items-start">
                <span className="text-success mr-2 flex-shrink-0">✓</span>
                <span className="flex-grow">Twitter Card images should be at least 800×418 pixels for summary_large_image card type.</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
