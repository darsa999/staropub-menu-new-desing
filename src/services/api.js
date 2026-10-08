import { mockCategories, mockProducts } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const SIMULATE_LATENCY_MS = 120;

/**
 * Fetch full grouped menu data (categories with nested products)
 * Ready for backend endpoint: GET /api/menu
 */
export async function getMenuData() {
  if (import.meta.env.VITE_USE_REAL_BACKEND === "true") {
    const res = await fetch(`${API_BASE_URL}/menu`);
    if (!res.ok) throw new Error("Failed to fetch menu data");
    return await res.json();
  }

  // Simulated Async API Call
  return new Promise((resolve) => {
    setTimeout(() => {
      const grouped = mockCategories.map((cat) => {
        const catProducts = mockProducts.filter(
          (p) => p.categoryId === cat.id || p.categoryId === cat.id.replace("-", "_")
        );
        return {
          ...cat,
          products: catProducts,
        };
      });
      resolve(grouped);
    }, SIMULATE_LATENCY_MS);
  });
}

/**
 * Fetch restaurant categories
 * Returns array of category objects: [ { id, slug, title, image } ]
 */
export async function getCategories() {
  if (import.meta.env.VITE_USE_REAL_BACKEND === "true") {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockCategories]);
    }, SIMULATE_LATENCY_MS);
  });
}

/**
 * Fetch products with optional filtering by categoryId and search query
 */
export async function getProducts(categoryIdOrOptions = null, searchQueryParam = "") {
  let categoryId = null;
  let search = "";

  if (typeof categoryIdOrOptions === "object" && categoryIdOrOptions !== null) {
    categoryId = categoryIdOrOptions.categoryId || null;
    search = categoryIdOrOptions.search || "";
  } else {
    categoryId = categoryIdOrOptions;
    search = searchQueryParam || "";
  }

  if (import.meta.env.VITE_USE_REAL_BACKEND === "true") {
    const params = new URLSearchParams();
    if (categoryId && categoryId !== "all") params.append("categoryId", categoryId);
    if (search.trim()) params.append("search", search.trim());

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${API_BASE_URL}/products${query}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      let results = [...mockProducts];

      if (categoryId && categoryId !== "all") {
        results = results.filter(
          (p) => p.categoryId === categoryId || p.categoryId === categoryId.replace("-", "_")
        );
      }

      if (search && search.trim()) {
        const query = search.trim().toLowerCase();
        results = results.filter((p) => {
          const nameKa = (p.name?.ka || p.title?.ka || "").toLowerCase();
          const nameEn = (p.name?.en || p.title?.en || "").toLowerCase();
          const nameRu = (p.name?.ru || p.title?.ru || "").toLowerCase();
          return (
            nameKa.includes(query) ||
            nameEn.includes(query) ||
            nameRu.includes(query)
          );
        });
      }

      resolve(results);
    }, SIMULATE_LATENCY_MS);
  });
}
