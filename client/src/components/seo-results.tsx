import { useState } from "react";
import type { SeoAnalysisResult } from "@shared/schema";
import { TabNavigation } from "@/components/tab-navigation";
import { OverviewTab } from "@/components/overview-tab";
import { MetaTagsTab } from "@/components/meta-tags-tab";
import { SocialPreviewTab } from "@/components/social-preview-tab";
import { RecommendationsTab } from "@/components/recommendations-tab";

type Tab = "overview" | "meta-tags" | "social-preview" | "recommendations";

interface SeoResultsProps {
  result: SeoAnalysisResult;
}

export function SeoResults({ result }: SeoResultsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-8">
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      {activeTab === "overview" && <OverviewTab result={result} />}
      {activeTab === "meta-tags" && <MetaTagsTab tags={result.tags} />}
      {activeTab === "social-preview" && <SocialPreviewTab socialPreviews={result.socialPreviews} url={result.url} />}
      {activeTab === "recommendations" && <RecommendationsTab recommendations={result.recommendations} />}
    </div>
  );
}
