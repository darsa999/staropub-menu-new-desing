import React from "react";
import { LayoutGrid } from "lucide-react";
import SearchBar from "../components/SearchBar";
import CategoriesGrid from "../components/CategoriesGrid";
import { useLanguage } from "../context/LanguageContext";

export default function HomePage({
  categories,
  isLoading,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onViewAllProducts,
  onSearchSubmit,
}) {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      {/* Search and Action Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onViewAllProducts={onViewAllProducts}
        onSearchSubmit={onSearchSubmit}
        isAllProductsActive={false}
      />

      {/* Section Title: 4-square/grid icon followed by the title "კატეგორიები" */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
          <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t("categoriesTitle")}
        </h2>
      </div>

      {/* Strict 4-Column Categories Grid */}
      <CategoriesGrid
        categories={categories}
        onSelectCategory={onSelectCategory}
        isLoading={isLoading}
      />
    </div>
  );
}
