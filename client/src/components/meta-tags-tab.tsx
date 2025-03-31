import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import type { SeoTag } from "@shared/schema";

interface MetaTagsTabProps {
  tags: SeoTag[];
}

export function MetaTagsTab({ tags }: MetaTagsTabProps) {
  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState<{
    essential: boolean;
    opengraph: boolean;
    twitter: boolean;
  }>({
    essential: true,
    opengraph: true,
    twitter: true,
  });

  // Filter tags by category
  const essentialTags = tags.filter(tag => tag.category === 'essential');
  const ogTags = tags.filter(tag => tag.category === 'opengraph');
  const twitterTags = tags.filter(tag => tag.category === 'twitter');

  // Helper to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success text-white">Present</span>;
      case 'missing':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error text-white">Missing</span>;
      case 'needs_improvement':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning text-white">Needs Improvement</span>;
      default:
        return null;
    }
  };

  // Helper to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <span className="text-success mr-2">✓</span>;
      case 'missing':
        return <span className="text-error mr-2">✗</span>;
      case 'needs_improvement':
        return <span className="text-warning mr-2">⚠</span>;
      default:
        return null;
    }
  };

  // Helper function to render a tag section
  const renderTagSection = (tag: SeoTag, index: number, isLast: boolean) => (
    <div key={index} className={`py-4 ${isLast ? '' : 'border-b border-gray-200'}`}>
      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
        <div>
          <h4 className="font-medium text-gray-900">{tag.name}</h4>
          <p className="text-sm text-gray-500">{tag.recommendation || "No description available"}</p>
        </div>
        {getStatusBadge(tag.status)}
      </div>
      <div className="bg-gray-50 rounded p-3 text-sm">
        <code className={`${tag.value ? 'text-gray-800' : 'text-gray-500 italic'}`}>
          {tag.value || "Not found"}
        </code>
      </div>
      {tag.recommendation && (
        <div className="mt-2 text-sm flex items-start">
          {getStatusIcon(tag.status)}
          <span>{tag.recommendation}</span>
        </div>
      )}
    </div>
  );

  // Toggle expansion of a section
  const toggleSection = (section: 'essential' | 'opengraph' | 'twitter') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Meta Tags Analysis</h2>
        
        {/* Essential Meta Tags */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Essential Meta Tags</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => toggleSection('essential')}
              className="text-primary hover:text-blue-700 p-0 h-auto"
            >
              {expandedSections.essential ? 'Hide' : 'Show all'} essential tags
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${expandedSections.essential ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          {expandedSections.essential && essentialTags.map((tag, idx) => 
            renderTagSection(tag, idx, idx === essentialTags.length - 1)
          )}
        </div>
        
        {/* Open Graph Tags */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Open Graph (Facebook) Tags</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => toggleSection('opengraph')}
              className="text-primary hover:text-blue-700 p-0 h-auto"
            >
              {expandedSections.opengraph ? 'Hide' : 'Show all'} Open Graph tags
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${expandedSections.opengraph ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          {expandedSections.opengraph && ogTags.map((tag, idx) => 
            renderTagSection(tag, idx, idx === ogTags.length - 1)
          )}
        </div>
        
        {/* Twitter Card Tags */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Twitter Card Tags</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => toggleSection('twitter')}
              className="text-primary hover:text-blue-700 p-0 h-auto"
            >
              {expandedSections.twitter ? 'Hide' : 'Show all'} Twitter Card tags
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${expandedSections.twitter ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          {expandedSections.twitter && twitterTags.map((tag, idx) => 
            renderTagSection(tag, idx, idx === twitterTags.length - 1)
          )}
        </div>
      </CardContent>
    </Card>
  );
}
