import { Card, CardContent } from "@/components/ui/card";
import type { SeoAnalysisResult } from "@shared/schema";

interface OverviewTabProps {
  result: SeoAnalysisResult;
}

export function OverviewTab({ result }: OverviewTabProps) {
  // Helper to determine background color class based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-gradient-score";
    if (score >= 60) return "bg-gradient-to-br from-yellow-400 to-orange-400";
    return "bg-gradient-to-br from-red-400 to-pink-600";
  };

  // Helper to determine text color class based on score
  const getScoreTextColor = (score: number) => {
    // All gradient backgrounds will use white text
    return "text-white";
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
      <Card className="mb-8 shadow-md border-0">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-5 flex items-center">
            <span className="text-gradient">Analysis Summary</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Score Card */}
            <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100">
              <div className={`inline-flex items-center justify-center h-24 w-24 rounded-full ${getScoreColor(result.score)} shadow-lg mb-4`}>
                <span className={`${getScoreTextColor(result.score)} text-3xl font-extrabold`}>{result.score}%</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Overall Score</h3>
              <p className="text-sm text-gray-600">
                {result.score >= 80 ? "Good SEO implementation" : 
                 result.score >= 60 ? "Average SEO implementation" : 
                 "Poor SEO implementation"}
              </p>
            </div>
            
            {/* Tags Status Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">SEO Tags Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Essential Tags</span>
                  <span className={`${getBadgeColor(result.statusSummary.essential.present / result.statusSummary.essential.total)} text-white text-xs px-2.5 py-1 rounded-full shadow-sm font-medium`}>
                    {result.statusSummary.essential.present}/{result.statusSummary.essential.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Social Tags</span>
                  <span className={`${getBadgeColor(result.statusSummary.social.present / result.statusSummary.social.total)} text-white text-xs px-2.5 py-1 rounded-full shadow-sm font-medium`}>
                    {result.statusSummary.social.present}/{result.statusSummary.social.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Technical Tags</span>
                  <span className={`${getBadgeColor(result.statusSummary.technical.present / result.statusSummary.technical.total)} text-white text-xs px-2.5 py-1 rounded-full shadow-sm font-medium`}>
                    {result.statusSummary.technical.present}/{result.statusSummary.technical.total}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Critical Issues Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Critical Issues</h3>
              {result.recommendations.critical.length > 0 ? (
                <ul className="space-y-3">
                  {result.recommendations.critical.slice(0, 3).map((issue, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-error mr-2 mt-0.5 text-lg">•</span>
                      <span className="text-sm font-medium">{issue.title}</span>
                    </li>
                  ))}
                  {result.recommendations.critical.length > 3 && (
                    <li className="text-xs text-gray-500 italic mt-2">
                      + {result.recommendations.critical.length - 3} more issues
                    </li>
                  )}
                </ul>
              ) : (
                <div className="flex items-center py-2">
                  <span className="text-success mr-2">✓</span>
                  <p className="text-sm text-gray-600">No critical issues found!</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google Preview Section */}
      <Card className="mb-8 shadow-md border-0">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-5 flex items-center">
            <span className="text-gradient">Google Search Preview</span>
          </h2>
          <div className="border border-gray-200 rounded-lg p-5 max-w-2xl shadow-sm bg-white">
            <div className="mb-1.5">
              <span className="text-xs text-gray-500">{result.googlePreview.url}</span>
            </div>
            <div className="text-primary text-xl font-medium hover:underline cursor-pointer mb-1.5">
              {result.googlePreview.title}
            </div>
            <div className="text-sm text-gray-700 line-clamp-2">
              {result.googlePreview.description || "No description available"}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
