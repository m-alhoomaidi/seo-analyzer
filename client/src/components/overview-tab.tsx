import { Card, CardContent } from "@/components/ui/card";
import type { SeoAnalysisResult } from "@shared/schema";

interface OverviewTabProps {
  result: SeoAnalysisResult;
}

export function OverviewTab({ result }: OverviewTabProps) {
  // Helper to determine background color class based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-success/20";
    if (score >= 60) return "bg-warning/20";
    return "bg-error/20";
  };

  // Helper to determine text color class based on score
  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-error";
  };

  // Helper to determine badge color
  const getBadgeColor = (ratio: number) => {
    if (ratio >= 0.8) return "bg-success";
    if (ratio >= 0.6) return "bg-warning";
    return "bg-error";
  };

  return (
    <>
      {/* Overview Summary Section */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Analysis Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Score Card */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className={`inline-block rounded-full ${getScoreColor(result.score)} p-3 mb-2`}>
                <span className={`${getScoreTextColor(result.score)} text-3xl font-bold`}>{result.score}%</span>
              </div>
              <h3 className="text-lg font-medium">Overall Score</h3>
              <p className="text-sm text-gray-600 mt-1">
                {result.score >= 80 ? "Good SEO implementation" : 
                 result.score >= 60 ? "Average SEO implementation" : 
                 "Poor SEO implementation"}
              </p>
            </div>
            
            {/* Tags Status Card */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">SEO Tags Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Essential Tags</span>
                  <span className={`${getBadgeColor(result.statusSummary.essential.present / result.statusSummary.essential.total)} text-white text-xs px-2 py-1 rounded-full`}>
                    {result.statusSummary.essential.present}/{result.statusSummary.essential.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Social Tags</span>
                  <span className={`${getBadgeColor(result.statusSummary.social.present / result.statusSummary.social.total)} text-white text-xs px-2 py-1 rounded-full`}>
                    {result.statusSummary.social.present}/{result.statusSummary.social.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Technical Tags</span>
                  <span className={`${getBadgeColor(result.statusSummary.technical.present / result.statusSummary.technical.total)} text-white text-xs px-2 py-1 rounded-full`}>
                    {result.statusSummary.technical.present}/{result.statusSummary.technical.total}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Critical Issues Card */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Critical Issues</h3>
              {result.recommendations.critical.length > 0 ? (
                <ul className="text-sm space-y-2">
                  {result.recommendations.critical.slice(0, 3).map((issue, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-error mr-2 mt-0.5">•</span>
                      <span>{issue.title}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No critical issues found!</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google Preview Section */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Google Search Preview</h2>
          <div className="border border-gray-200 rounded-lg p-4 max-w-2xl">
            <div className="mb-1">
              <span className="text-xs text-gray-500">{result.googlePreview.url}</span>
            </div>
            <div className="text-primary text-xl hover:underline cursor-pointer mb-1">
              {result.googlePreview.title}
            </div>
            <div className="text-sm text-gray-800">
              {result.googlePreview.description || "No description available"}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
