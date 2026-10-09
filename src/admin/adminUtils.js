import { API_ORIGIN } from "../services/api";

export function resolveAdminImage(img) {
  if (!img || typeof img !== "string") return "";
  const trimmed = img.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/")) {
    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${API_ORIGIN}${cleanPath}`;
  }
  if (trimmed.startsWith("Images/")) {
    return `${API_ORIGIN}/${trimmed}`;
  }
  return `${API_ORIGIN}/Images/${trimmed}`;
}

export function parseMultiPrice(rawOrItem) {
  if (!rawOrItem) return null;

  let pricesArray = null;
  if (typeof rawOrItem === "object") {
    if (Array.isArray(rawOrItem.prices) && rawOrItem.prices.length > 0) {
      pricesArray = rawOrItem.prices;
    } else if (typeof rawOrItem.price === "string") {
      return parseMultiPrice(rawOrItem.price);
    }
  }

  if (pricesArray) {
    const valid = pricesArray.filter(
      p => p && p.size && p.price !== undefined && p.price !== null && String(p.price).trim() !== ""
    );
    const nonZero = valid.filter(p => {
      const n = typeof p.price === "number" ? p.price : parseFloat(String(p.price).replace("₾", "").replace(",", ".").trim());
      return !isNaN(n) && n > 0;
    });
    if (nonZero.length > 0) {
      return nonZero.map(p => {
        const num = typeof p.price === "number" ? p.price : parseFloat(String(p.price).replace("₾", "").replace(",", ".").trim());
        const priceStr = isNaN(num) ? String(p.price) : `₾${num.toFixed(2)}`;
        return { size: p.size, price: priceStr, priceNum: isNaN(num) ? 0 : num };
      });
    }
  }

  if (typeof rawOrItem !== "string") return null;
  const lines = rawOrItem.split(/\\n|\n|\|/).map(l => l.trim()).filter(Boolean);
  const parsed = [];
  for (const line of lines) {
    const sizeMatch = line.match(/^([\d.,]+\s*[ლმლმL][\w]*)/u);
    if (sizeMatch) {
      const size = sizeMatch[1].trim();
      const rest = line.slice(sizeMatch[0].length).replace(/^[-:–—\s]+/, "").trim();
      const numMatch = rest.match(/([\d.,]+)/);
      const num = numMatch ? parseFloat(numMatch[1].replace(",", ".")) : NaN;
      if (!isNaN(num) && num > 0) {
        const priceStr = `₾${num.toFixed(2)}`;
        parsed.push({ size, price: priceStr, priceNum: num });
      }
    }
  }
  return parsed.length > 0 ? parsed : null;
}

export function getVolumeSizesForDish(categoryKey, dishName = "", categories = []) {
  const catKey = (categoryKey || "").toLowerCase();
  const catObj = categories.find(c => (c.id || c._id || "").toLowerCase() === catKey) || {};
  const catLabel = (catObj.name_ka || catObj.name?.ka || catObj.name || categoryKey || "").toLowerCase();
  const nameKa = (dishName || "").toLowerCase();

  const isBeer =
    catKey === "beer" ||
    catLabel.includes("ლუდი") ||
    catLabel.includes("beer") ||
    catLabel.includes("пиво");

  const isSpirits =
    catKey === "alcohol" ||
    catKey === "spirits" ||
    catLabel.includes("სპირტიანი") ||
    catLabel.includes("spirits") ||
    catLabel.includes("крепкие") ||
    catLabel.includes("alcohol");

  const isChacha = nameKa.includes("სოფლის ჭაჭა") || nameKa.includes("ჭაჭა");

  if (isBeer) {
    return ["0.4 ლ", "1.0 ლ"];
  }
  if (isSpirits || isChacha) {
    return ["0.25 ლ", "0.5 ლ"];
  }
  return null;
}
