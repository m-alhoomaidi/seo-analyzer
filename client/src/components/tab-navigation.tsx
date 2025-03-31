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
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
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
      </nav>
    </div>
  );
}
