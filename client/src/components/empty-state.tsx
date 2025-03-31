import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export function EmptyState() {
  return (
    <Card className="text-center py-12">
      <div className="flex flex-col items-center justify-center">
        <Lightbulb className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Enter a URL to Analyze SEO Tags</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          See how your website appears in search results and social media. 
          Get recommendations to improve your SEO implementation.
        </p>
      </div>
    </Card>
  );
}
