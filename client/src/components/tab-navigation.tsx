import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';

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
  
  const swiperRef = useRef<any>(null);
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
  
  // Update Swiper when active tab changes
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(activeIndex);
    }
  }, [activeTab, activeIndex]);

  return (
    <div className="border-b border-gray-200 relative">
      <div className="container mx-auto px-3 md:px-6">
        <Swiper
          ref={swiperRef}
          slidesPerView="auto"
          spaceBetween={0}
          initialSlide={activeIndex}
          className="tab-swiper"
          freeMode={{
            enabled: true,
            momentum: true
          }}
          grabCursor={true}
        >
          {tabs.map((tab) => (
            <SwiperSlide key={tab.id} className="w-auto">
              <button
                className={cn(
                  "whitespace-nowrap py-4 px-3 md:px-4 border-b-2 font-medium text-sm transition-all duration-200",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
                onClick={() => onTabChange(tab.id)}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
