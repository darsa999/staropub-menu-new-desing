import React, { useRef } from "react";
import { LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  const { t, getLocalizedField } = useLanguage();
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full mb-8">
      {/* Section Header: Title: "კატეგორიები" with grid/categories icon on the left */}
      {/* Omit "ყველას ნახვა" and slider arrows per specification */}
      <div className="flex items-center space-x-2.5 mb-4">
        <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
          <LayoutGrid className="w-5 h-5" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t("categoriesTitle")}
        </h2>
      </div>

      {/* Sticky / horizontal scrollable navigation for categories */}
      <div className="relative sticky top-20 z-30 bg-gray-50/95 dark:bg-zinc-950/95 backdrop-blur-md py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-gray-200/70 dark:border-zinc-800/80">
        <div
          ref={scrollContainerRef}
          className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`relative px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center space-x-2 shrink-0 ${
                  isSelected
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md font-semibold ring-2 ring-zinc-900/10 dark:ring-white/10"
                    : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
                }`}
              >
                <span>{getLocalizedField(cat.name)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
