import React from "react";
import { Search, LayoutGrid, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onViewAllProducts,
  onSearchSubmit,
  isAllProductsActive = false,
}) {
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
        {/* Left: Button "ყველა პროდუქტი" */}
        <button
          onClick={onViewAllProducts}
          type="button"
          className={`shrink-0 flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl text-sm font-semibold transition-all shadow-sm ${
            isAllProductsActive
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md ring-2 ring-zinc-900/10"
              : "bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 border border-gray-200/90 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-gray-50/50"
          }`}
        >
          <LayoutGrid className="w-4 h-4 stroke-[2.2]" />
          <span>{t("allProducts")}</span>
        </button>

        {/* Center/Right: Search input with placeholder "ძებნა" and search icon button on the right */}
        <form onSubmit={handleSubmit} className="relative flex-1 flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-5 pr-14 py-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/90 dark:border-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/80 focus:border-transparent transition-all shadow-sm text-sm"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-12 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search icon button on the right */}
          <button
            type="submit"
            className="absolute right-2 p-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-xs"
            aria-label="Search"
          >
            <Search className="w-4 h-4 stroke-[2.2]" />
          </button>
        </form>
      </div>
    </div>
  );
}
