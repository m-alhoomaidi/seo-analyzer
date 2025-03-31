import { cn } from "@/lib/utils";

type Tab = "overview" | "meta-tags" | "social-preview" | "recommendations";

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

interface TabItem {
  id: Tab;
  label: string;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs: TabItem[] = [
    { id: "overview", label: "Overview" },
    { id: "meta-tags", label: "Meta Tags" },
    { id: "social-preview", label: "Social Preview" },
    { id: "recommendations", label: "Recommendations" }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex overflow-x-auto scrollbar-hide" aria-label="Tabs">
        <div className="flex min-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm flex-shrink-0 transition-all duration-200",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => onTabChange(tab.id)}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
