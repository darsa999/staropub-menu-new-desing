import { mockCategories, mockProducts } from "../data/mockData.js";

// Resolve API Base URL and Origin safely in both browser (Vite) and Node
const env = typeof import.meta !== "undefined" && import.meta?.env ? import.meta.env : {};

// Primary API URL: Uses environment variable if defined, otherwise falls back to Vercel API path
export const BASE_URL = (env.VITE_API_URL || "https://staropub-menu.vercel.app/api").replace(/\/+$/, "");

// Live production database backend (onrender): Used automatically if the primary endpoint returns 404 or fails
export const SECONDARY_BACKEND_URL = "https://staropub-menu.onrender.com/api";

// Backward-compatible alias
export const API_BASE_URL = BASE_URL;

// Base origin for resolving relative media files (e.g. /Images/...)
export const API_ORIGIN = BASE_URL.replace(/\/api\/?$/, "");

export const USE_REAL_BACKEND = env.VITE_USE_REAL_BACKEND !== "false";

const SIMULATE_LATENCY_MS = 120;
const CACHE_KEY = "staropub_prod_menu_cache_v3";

/**
 * Resilient multi-backend fetcher.
 * 1. Attempts the primary BASE_URL (import.meta.env.VITE_API_URL || 'https://staropub-menu.vercel.app/api')
 * 2. If the primary endpoint returns 404 or fails, seamlessly falls back to the live Render production backend.
 * 3. Clearly logs diagnostic info / errors to the browser console without failing silently.
 */
export async function fetchFromLiveBackend(endpointPath, options = {}) {
  const cleanPath = endpointPath.startsWith("/") ? endpointPath : `/${endpointPath}`;

  // 1. Try primary endpoint
  const primaryUrl = `${BASE_URL}${cleanPath}`;
  try {
    const primaryRes = await fetch(primaryUrl, options);
    if (primaryRes.ok) {
      return {
        ok: true,
        response: primaryRes,
        origin: BASE_URL.replace(/\/api\/?$/, ""),
      };
    }
    console.warn(
      `[StaroPub API] Primary endpoint ${primaryUrl} returned HTTP ${primaryRes.status}. Attempting secondary backend (${SECONDARY_BACKEND_URL})...`
    );
  } catch (primaryErr) {
    console.warn(
      `[StaroPub API] Primary endpoint ${primaryUrl} failed (${primaryErr.message}). Attempting secondary backend (${SECONDARY_BACKEND_URL})...`
    );
  }

  // 2. Try secondary production backend
  const secondaryUrl = `${SECONDARY_BACKEND_URL}${cleanPath}`;
  try {
    const secondaryRes = await fetch(secondaryUrl, options);
    if (secondaryRes.ok) {
      return {
        ok: true,
        response: secondaryRes,
        origin: SECONDARY_BACKEND_URL.replace(/\/api\/?$/, ""),
      };
    }
    console.error(
      `[StaroPub API Error] Secondary backend ${secondaryUrl} returned HTTP ${secondaryRes.status}.`
    );
    return {
      ok: false,
      status: secondaryRes.status,
      origin: SECONDARY_BACKEND_URL.replace(/\/api\/?$/, ""),
    };
  } catch (secErr) {
    console.error(
      `[StaroPub API Error] Secondary backend ${secondaryUrl} network failure: ${secErr.message}`
    );
    return {
      ok: false,
      error: secErr,
      origin: SECONDARY_BACKEND_URL.replace(/\/api\/?$/, ""),
    };
  }
}

/**
 * Extracts a clean numeric price from a dish object.
 * Handles:
 * - multi-tier prices array: [{ size: "0.4 ლ", price: 9.2 }, ...] -> 9.2
 * - currency formatted strings: "3.5 ₾", "11.9 ₾", "89 ₾" -> 3.5, 11.9, 89
 * - range / portion strings: "0.4ლ - 9.2₾ | 1.0ლ - 18.9₾" -> 9.2
 * - numeric floats / ints: 14.5 -> 14.5
 */
export function extractNumericPrice(dish) {
  if (!dish) return 0;

  // 1. Check prices array (multi-size options)
  if (Array.isArray(dish.prices) && dish.prices.length > 0) {
    for (const p of dish.prices) {
      const val = typeof p?.price === "number" ? p.price : parseFloat(String(p?.price || ""));
      if (!isNaN(val) && val > 0) return val;
    }
  }

  // 2. Check if price is directly a valid number
  if (typeof dish.price === "number" && !isNaN(dish.price)) {
    return dish.price;
  }

  // 3. If price is a string
  if (typeof dish.price === "string") {
    // Look for Georgian lari currency symbol (e.g., "3.5 ₾", "11.9 ₾", "89₾")
    const gelMatch = dish.price.match(/(\d+(?:\.\d+)?)\s*₾/);
    if (gelMatch) {
      const parsed = parseFloat(gelMatch[1]);
      if (!isNaN(parsed)) return parsed;
    }

    // Look for delimiter format like "0.4ლ - 9.2"
    const dashMatch = dish.price.match(/[-:]\s*(\d+(?:\.\d+)?)/);
    if (dashMatch) {
      const parsed = parseFloat(dashMatch[1]);
      if (!isNaN(parsed)) return parsed;
    }

    // Direct parseFloat
    const parsed = parseFloat(dish.price);
    if (!isNaN(parsed)) return parsed;
  }

  return 0;
}

/**
 * Normalizes and resolves an image URL to a full accessible URL.
 * Supports Cloudinary URLs, absolute URLs, and relative paths.
 */
export function resolveMediaUrl(imagePath, apiOrigin = API_ORIGIN) {
  if (!imagePath || typeof imagePath !== "string") return "";
  const trimmed = imagePath.trim();
  if (!trimmed) return "";

  // Permanent absolute remote URLs (Cloudinary, AWS, Vercel Blob) or inline data/blob URLs
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  const origin = (apiOrigin || "").replace(/\/+$/, "");

  // Starts with leading slash (e.g. /Images/... or /uploads/...)
  if (trimmed.startsWith("/")) {
    return `${origin}${trimmed}`;
  }

  // Starts with Images/ or uploads/
  if (
    trimmed.startsWith("Images/") ||
    trimmed.startsWith("images/") ||
    trimmed.startsWith("uploads/")
  ) {
    return `${origin}/${trimmed}`;
  }

  // Standalone filename
  return `${origin}/Images/${trimmed}`;
}

/**
 * Transforms a raw staropub dish object into the product interface
 * expected by restaurant-menu-app components (ProductCard, CartContext).
 */
export function adaptDishToProduct(dish, apiOrigin = API_ORIGIN, unavailableSet = null) {
  const id = String(dish.id || dish._id || `dish_${Math.random()}`);
  const categoryId = String(dish.category || dish.categoryId || "");

  const name = {
    ka: dish.name_ka || dish.name || "",
    en: dish.name_en || dish.name || "",
    ru: dish.name_ru || dish.name || "",
  };

  const description = {
    ka: dish.desc_ka || dish.description || "",
    en: dish.desc_en || dish.description || "",
    ru: dish.desc_ru || dish.description || "",
  };

  const price = extractNumericPrice(dish);
  let image = resolveMediaUrl(dish.image, apiOrigin);
  if (!image) {
    image = `${apiOrigin}/Images/staropub_main.jpg`;
  }

  const isUnavailable =
    unavailableSet &&
    (unavailableSet.has(id) ||
      (dish.id && unavailableSet.has(String(dish.id))) ||
      (dish._id && unavailableSet.has(String(dish._id))));

  const available = isUnavailable
    ? false
    : dish.available !== undefined
      ? Boolean(dish.available)
      : dish.isAvailable !== undefined
        ? Boolean(dish.isAvailable)
        : true;

  return {
    id,
    categoryId,
    category: categoryId,
    name,
    title: name,
    description,
    price,
    rawPrice: dish.price,
    prices: Array.isArray(dish.prices) ? dish.prices : [],
    image,
    available,
  };
}

/**
 * Transforms raw categories and dishes into grouped categories with nested products.
 */
export function transformMenuData(rawCategories, rawDishes, apiOrigin = API_ORIGIN, unavailableSet = null) {
  const adaptedProducts = (rawDishes || []).map((dish) =>
    adaptDishToProduct(dish, apiOrigin, unavailableSet)
  );

  return (rawCategories || []).map((cat) => {
    const id = String(cat.id || cat._id || "");
    const catProducts = adaptedProducts.filter(
      (p) =>
        p.categoryId === id ||
        p.categoryId.toLowerCase() === id.toLowerCase() ||
        p.categoryId === id.replace("-", "_") ||
        p.categoryId === id.replace("_", "-")
    );

    const name = {
      ka: cat.name_ka || cat.name || cat.title?.ka || id,
      en: cat.name_en || cat.name || cat.title?.en || id,
      ru: cat.name_ru || cat.name || cat.title?.ru || id,
    };

    // Category image: prioritize category's own Cloudinary/remote image,
    // fallback to first dish image with valid photo, fallback to branded asset
    let image = cat.image ? resolveMediaUrl(cat.image, apiOrigin) : "";
    if (!image) {
      const firstWithImage = catProducts.find((p) => p.image && !p.image.includes("staropub_main.jpg"));
      if (firstWithImage) {
        image = firstWithImage.image;
      }
    }
    if (!image && catProducts.length > 0 && catProducts[0].image) {
      image = catProducts[0].image;
    }
    if (!image) {
      image = `${apiOrigin}/Images/staropub_main.jpg`;
    }

    return {
      id,
      slug: cat.slug || id,
      name,
      title: name,
      icon: cat.icon || "🍽️",
      image,
      isHot: Boolean(cat.isHot),
      order: typeof cat.order === "number" ? cat.order : 0,
      products: catProducts,
    };
  });
}

function getMockMenuData() {
  return mockCategories.map((cat) => {
    const catProducts = mockProducts.filter(
      (p) => p.categoryId === cat.id || p.categoryId === cat.id.replace("-", "_")
    );
    return {
      ...cat,
      products: catProducts,
    };
  });
}

/**
 * Fetch full grouped menu data (categories with nested products).
 * Seamlessly pulls from live production API with intelligent dual backend fallback.
 */
export async function getMenuData() {
  if (USE_REAL_BACKEND) {
    try {
      // 1. Fetch categories, dishes, and settings concurrently
      const [catResult, dishesResult, settingsResult] = await Promise.all([
        fetchFromLiveBackend("/categories"),
        fetchFromLiveBackend("/dishes"),
        fetchFromLiveBackend("/settings"),
      ]);

      if (catResult.ok && dishesResult.ok) {
        const rawCategories = await catResult.response.json();
        const rawDishes = await dishesResult.response.json();
        const settingsData = settingsResult.ok ? await settingsResult.response.json() : {};
        const unavailableSet = new Set(
          Array.isArray(settingsData?.unavailableDishIds) ? settingsData.unavailableDishIds : []
        );

        const transformed = transformMenuData(
          rawCategories,
          rawDishes,
          catResult.origin || API_ORIGIN,
          unavailableSet
        );

        try {
          if (typeof localStorage !== "undefined") {
            localStorage.setItem(CACHE_KEY, JSON.stringify(transformed));
          }
        } catch {}

        console.log("Fetched live categories:", transformed);
        console.info(
          `[StaroPub API] Loaded ${transformed.length} categories and ${rawDishes.length} dishes from live backend (${catResult.origin}).`
        );
        return transformed;
      }

      // 2. Alternative route: GET /menu
      const menuResult = await fetchFromLiveBackend("/menu");
      if (menuResult.ok) {
        const data = await menuResult.response.json();
        if (Array.isArray(data)) {
          return data;
        }
        if (data.categories && data.dishes) {
          const transformed = transformMenuData(
            data.categories,
            data.dishes,
            menuResult.origin || API_ORIGIN
          );
          try {
            if (typeof localStorage !== "undefined") {
              localStorage.setItem(CACHE_KEY, JSON.stringify(transformed));
            }
          } catch {}
          return transformed;
        }
      }
    } catch (err) {
      console.error("[StaroPub API Error] Failed to fetch live menu data:", err);
    }

    // 3. Fallback to cached production menu in localStorage
    try {
      if (typeof localStorage !== "undefined") {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          console.warn("[StaroPub API] Using cached live production menu from localStorage.");
          return JSON.parse(cached);
        }
      }
    } catch {}
  }

  // 4. Log visible error before falling back to local static mock data
  console.error(
    "[StaroPub API Error] Live production API is unreachable and no cache exists. Falling back to static mockData.js."
  );

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockMenuData());
    }, SIMULATE_LATENCY_MS);
  });
}

/**
 * Fetch restaurant categories
 * Returns array of category objects: [ { id, slug, title, image, products } ]
 */
export async function getCategories() {
  if (USE_REAL_BACKEND) {
    try {
      const [catResult, dishResult] = await Promise.all([
        fetchFromLiveBackend("/categories"),
        fetchFromLiveBackend("/dishes"),
      ]);

      if (catResult.ok) {
        const rawCategories = await catResult.response.json();
        const rawDishes = dishResult.ok ? await dishResult.response.json() : [];
        return transformMenuData(rawCategories, rawDishes, catResult.origin || API_ORIGIN);
      }
    } catch (err) {
      console.error("[StaroPub API Error] Categories fetch failed:", err);
    }
  }

  console.error("[StaroPub API Error] Returning static mock categories as fallback.");
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

  if (USE_REAL_BACKEND) {
    try {
      const params = new URLSearchParams();
      if (categoryId && categoryId !== "all") params.append("categoryId", categoryId);
      if (search.trim()) params.append("search", search.trim());

      const query = params.toString() ? `?${params.toString()}` : "";
      let resResult = await fetchFromLiveBackend(`/products${query}`);
      if (!resResult.ok) {
        resResult = await fetchFromLiveBackend("/dishes");
      }

      if (resResult.ok) {
        const rawDishes = await resResult.response.json();
        let products = rawDishes.map((d) => adaptDishToProduct(d, resResult.origin || API_ORIGIN));

        if (categoryId && categoryId !== "all") {
          products = products.filter(
            (p) =>
              p.categoryId === categoryId ||
              p.categoryId.toLowerCase() === categoryId.toLowerCase()
          );
        }

        if (search && search.trim()) {
          const q = search.trim().toLowerCase();
          products = products.filter((p) => {
            const nameKa = (p.name?.ka || p.title?.ka || "").toLowerCase();
            const nameEn = (p.name?.en || p.title?.en || "").toLowerCase();
            const nameRu = (p.name?.ru || p.title?.ru || "").toLowerCase();
            return nameKa.includes(q) || nameEn.includes(q) || nameRu.includes(q);
          });
        }

        return products;
      }
    } catch (err) {
      console.error("[StaroPub API Error] Products fetch failed:", err);
    }
  }

  console.error("[StaroPub API Error] Returning static mock products as fallback.");
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
