import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Image } from "lucide-react";
import type { SeoAnalysisResult } from "@shared/schema";

interface SocialPreviewTabProps {
  socialPreviews: SeoAnalysisResult['socialPreviews'];
  url: string;
}

export function SocialPreviewTab({ socialPreviews, url }: SocialPreviewTabProps) {
  // Helper to extract domain from URL
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const domain = getDomain(url);
  
  return (
    <Card className="shadow-md border-0">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-5">
          <span className="text-gradient">Social Media Previews</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Facebook Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Facebook Preview</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {socialPreviews.facebook.image ? (
                  <img 
                    src={socialPreviews.facebook.image}
                    alt="Preview for Facebook sharing" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center p-4">
                    <Image className="h-12 w-12 mx-auto mb-2" />
                    <p>No Open Graph image found</p>
                  </div>
                )}
              </div>
              <div className="p-3 bg-white">
                <div className="text-xs text-gray-500 mb-1 break-words">{domain}</div>
                <div className="font-medium text-gray-900 mb-1 line-clamp-2 break-words">
                  {socialPreviews.facebook.title || "No title available"}
                </div>
                <div className="text-sm text-gray-600 line-clamp-3 break-words">
                  {socialPreviews.facebook.description || "No description available"}
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              {!socialPreviews.facebook.image && (
                <div className="flex items-start">
                  <span className="text-error mr-2 mt-0.5">✗</span>
                  <span className="text-sm">Missing og:image tag</span>
                </div>
              )}
              {!socialPreviews.facebook.title && (
                <div className="flex items-start">
                  <span className="text-error mr-2 mt-0.5">✗</span>
                  <span className="text-sm">Missing og:title tag</span>
                </div>
              )}
              {!socialPreviews.facebook.description && (
                <div className="flex items-start">
                  <span className="text-warning mr-2 mt-0.5">⚠</span>
                  <span className="text-sm">Missing og:description tag</span>
                </div>
              )}
              {(socialPreviews.facebook.title && socialPreviews.facebook.description) && (
                <div className="flex items-start">
                  <span className="text-success mr-2 mt-0.5">✓</span>
                  <span className="text-sm">og:title and og:description present</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Twitter Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Twitter Preview</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {socialPreviews.twitter.image ? (
                  <img 
                    src={socialPreviews.twitter.image} 
                    alt="Preview for Twitter sharing" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center p-4">
                    <Image className="h-12 w-12 mx-auto mb-2" />
                    <p>No Twitter Card image found</p>
                  </div>
                )}
              </div>
              <div className="p-3 bg-white">
                <div className="text-xs text-gray-500 mb-1 break-words">{domain}</div>
                <div className="font-medium text-gray-900 mb-1 line-clamp-2 break-words">
                  {socialPreviews.twitter.title || "No title available"}
                </div>
                <div className="text-sm text-gray-600 line-clamp-2 break-words">
                  {socialPreviews.twitter.description || "No description available"}
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              {!socialPreviews.twitter.cardType && (
                <div className="flex items-start">
                  <span className="text-error mr-2 mt-0.5">✗</span>
                  <span className="text-sm">Missing twitter:card tag</span>
                </div>
              )}
              {!socialPreviews.twitter.image && (
                <div className="flex items-start">
                  <span className="text-error mr-2 mt-0.5">✗</span>
                  <span className="text-sm">Missing twitter:image tag</span>
                </div>
              )}
              {(!socialPreviews.twitter.title || !socialPreviews.twitter.description) && (
                <div className="flex items-start text-sm">
                  <span className="mr-2">ℹ️</span>
                  <span>Falling back to standard meta title/description</span>
                </div>
              )}
              {(socialPreviews.twitter.cardType && socialPreviews.twitter.image) && (
                <div className="flex items-start">
                  <span className="text-success mr-2 mt-0.5">✓</span>
                  <span className="text-sm">Twitter card and image tags present</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
