import React from "react";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import ProductGrid from "../components/ProductGrid";
import { useLanguage } from "../context/LanguageContext";

export default function ProductsPage({
  categories,
  products,
  isLoadingProducts,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onBackToHome,
}) {
  const { t, getLocalizedField } = useLanguage();

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);
  const activeCategoryName = activeCategoryObj
    ? getLocalizedField(activeCategoryObj.title || activeCategoryObj.name)
    : t("allProducts");

  return (
    <div className="w-full">
      {/* Top Navigation & Back Action */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBackToHome}
          type="button"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors py-1.5 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
          <span>მთავარი / {t("categoriesTitle")}</span>
        </button>

        <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200/60 dark:border-amber-900/60">
          {products.length} {t("itemsCount")}
        </span>
      </div>

      {/* Search and Action Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onViewAllProducts={() => onSelectCategory("all")}
        isAllProductsActive={selectedCategory === "all"}
      />

      {/* Sticky Horizontal Category Tabs */}
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      {/* Strict 4-Column Product Grid */}
      <ProductGrid products={products} isLoading={isLoadingProducts} />
    </div>
  );
}
