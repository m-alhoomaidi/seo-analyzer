import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export function EmptyState() {
  return (
    <Card className="text-center py-16 shadow-lg border-0 bg-gradient-to-b from-white to-gray-50">
      <div className="flex flex-col items-center justify-center">
        <div className="bg-blue-50 p-4 rounded-full mb-6">
          <Lightbulb className="h-16 w-16 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Enter a URL to Analyze SEO Tags</h3>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          See how your website appears in search results and social media platforms. 
          Get actionable recommendations to improve your SEO implementation and increase visibility.
        </p>
      </div>
    </Card>
  );
}
