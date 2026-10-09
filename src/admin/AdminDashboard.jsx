import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  UtensilsCrossed,
  FolderTree,
  Clock,
  Bell,
  Megaphone,
  MessageSquare,
  SlidersHorizontal,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  LogOut,
  ExternalLink,
  Search,
  Save,
  Eye,
  EyeOff,
  Menu
} from "lucide-react";

import {
  fetchAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  fetchAdminDishes,
  createDish,
  updateDish,
  deleteDish,
  reorderDishes,
  fetchAdminSettings,
  updateAdminSettings
} from "../services/adminApi";

import {
  resolveAdminImage,
  getVolumeSizesForDish,
  parseMultiPrice
} from "./adminUtils";

export default function AdminDashboard({ onLogout, onBackToSite }) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState("dishes");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data states
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Search & filter states
  const [dishSearch, setDishSearch] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("all");
  const [selectedSortCategory, setSelectedSortCategory] = useState("");

  // Waiter calls state
  const [waiterCalls, setWaiterCalls] = useState([
    { id: 1, table: "3", type: "მიმტანი 💁‍♂️", time: "14:15" },
    { id: 2, table: "5", type: "ანგარიში 🧾", time: "14:22" }
  ]);

  // Reviews state
  const [reviews, setReviews] = useState([
    { id: 1, name: "გიორგი", rating: 5, comment: "საუკეთესო ნეკნები და ლუდია!", date: "2026-08-12", table: "3" },
    { id: 2, name: "Elena", rating: 5, comment: "Atmosphere and service are top notch.", date: "2026-08-14", table: "7" }
  ]);

  // Working Hours & Status State
  const [pubIsOpen, setPubIsOpen] = useState(true);
  const [workingHoursText, setWorkingHoursText] = useState("10:00 – 23:00");
  const [workingDaysText, setWorkingDaysText] = useState("ყოველდღე");
  const [matchDayNoteText, setMatchDayNoteText] = useState("მატჩის დღეებში პაბი მუშაობს მატჩის ბოლომდე");
  const [contactPhone, setContactPhone] = useState("+995 595 93 11 19");

  // Banner State
  const [bannerSettings, setBannerSettings] = useState({
    enabled: true,
    text: "საფირმო ჩეხური ნეკნები - 15% ფასდაკლება!",
    badge: "დღის შეთავაზება",
    image: "sapirmo chexuri neknebi.jpg"
  });

  // Unavailable dishes state (Out of stock)
  const [unavailableDishIds, setUnavailableDishIds] = useState([]);

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  // Form states for Category
  const [catKey, setCatKey] = useState("");
  const [catNameKa, setCatNameKa] = useState("");
  const [catNameEn, setCatNameEn] = useState("");
  const [catNameRu, setCatNameRu] = useState("");
  const [catIcon, setCatIcon] = useState("");
  const [catIsHot, setCatIsHot] = useState(false);
  const [catImageFile, setCatImageFile] = useState(null);
  const [catImagePreview, setCatImagePreview] = useState("");

  // Form states for Dish
  const [dishNameKa, setDishNameKa] = useState("");
  const [dishNameEn, setDishNameEn] = useState("");
  const [dishNameRu, setDishNameRu] = useState("");
  const [dishDescKa, setDishDescKa] = useState("");
  const [dishDescEn, setDishDescEn] = useState("");
  const [dishDescRu, setDishDescRu] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [dishVolumePrices, setDishVolumePrices] = useState({});
  const [dishCategory, setDishCategory] = useState("");
  const [dishImageFile, setDishImageFile] = useState(null);
  const [dishImagePreview, setDishImagePreview] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Initial Data Fetch
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [catsRes, dishesRes, settingsRes] = await Promise.all([
        fetchAdminCategories().catch(() => []),
        fetchAdminDishes().catch(() => []),
        fetchAdminSettings().catch(() => ({}))
      ]);

      const sortedCats = Array.isArray(catsRes)
        ? [...catsRes].sort((a, b) => (a.order || 0) - (b.order || 0))
        : [];
      const sortedDishes = Array.isArray(dishesRes)
        ? [...dishesRes].sort((a, b) => (a.order || 0) - (b.order || 0))
        : [];

      setCategories(sortedCats);
      setDishes(sortedDishes);
      setSettings(settingsRes);

      if (sortedCats.length > 0 && !selectedSortCategory) {
        setSelectedSortCategory(sortedCats[0].id || sortedCats[0]._id);
      }

      // Settings parsing
      if (settingsRes) {
        if (typeof settingsRes.isOpen === "boolean") setPubIsOpen(settingsRes.isOpen);
        if (settingsRes.workingHours) setWorkingHoursText(settingsRes.workingHours);
        if (settingsRes.workingDays) setWorkingDaysText(settingsRes.workingDays);
        if (settingsRes.matchDayNote) setMatchDayNoteText(settingsRes.matchDayNote);
        if (settingsRes.contactPhone) setContactPhone(settingsRes.contactPhone);
        if (settingsRes.bannerSettings) setBannerSettings(settingsRes.bannerSettings);
        if (Array.isArray(settingsRes.unavailableDishIds)) setUnavailableDishIds(settingsRes.unavailableDishIds);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
      showToast("⚠️ მონაცემების ჩატვირთვა ვერ მოხერხდა");
    } finally {
      setIsLoading(false);
    }
  }, [selectedSortCategory]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // ─── Global Save Settings ────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await updateAdminSettings({
        isOpen: pubIsOpen,
        workingHours: workingHoursText,
        workingDays: workingDaysText,
        matchDayNote: matchDayNoteText,
        contactPhone: contactPhone,
        bannerSettings: bannerSettings,
        unavailableDishIds: unavailableDishIds
      });
      showToast("✓ პარამეტრები წარმატებით შეინახა!");
    } catch (err) {
      showToast(`⚠️ შეცდომა: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Category CRUD Handlers ──────────────────────────────────────────────
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatKey("");
    setCatNameKa("");
    setCatNameEn("");
    setCatNameRu("");
    setCatIcon("🍽️");
    setCatIsHot(false);
    setCatImageFile(null);
    setCatImagePreview("");
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    const key = cat.id || cat._id;
    setEditingCategory(cat);
    setCatKey(key);
    setCatNameKa(cat.name_ka || cat.name?.ka || cat.title || key);
    setCatNameEn(cat.name_en || cat.name?.en || key);
    setCatNameRu(cat.name_ru || cat.name?.ru || key);
    setCatIcon(cat.icon || "🍽️");
    setCatIsHot(!!cat.isHot);
    setCatImageFile(null);
    setCatImagePreview(cat.image || "");
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catKey.trim()) return alert("გთხოვთ მიუთითოთ კატეგორიის გასაღები (ID)");
    if (!catNameKa.trim()) return alert("გთხოვთ მიუთითოთ სახელი ქართულად");

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("id", catKey.trim().toLowerCase());
      formData.append("name_ka", catNameKa.trim());
      formData.append("name_en", catNameEn.trim() || catNameKa.trim());
      formData.append("name_ru", catNameRu.trim() || catNameKa.trim());
      formData.append("icon", catIcon.trim() || "🍽️");
      formData.append("isHot", catIsHot ? "true" : "false");
      if (catImageFile) {
        formData.append("image", catImageFile);
      }

      if (editingCategory) {
        const id = editingCategory.id || editingCategory._id;
        const updated = await updateCategory(id, formData);
        setCategories((prev) =>
          prev.map((c) => ((c.id || c._id) === id ? { ...c, ...updated } : c))
        );
        showToast("✓ კატეგორია წარმატებით განახლდა");
      } else {
        const created = await createCategory(formData);
        setCategories((prev) => [...prev, created]);
        showToast("✓ კატეგორია წარმატებით დაემატა");
      }
      setIsCategoryModalOpen(false);
    } catch (err) {
      alert(`შეცდომა: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    const key = cat.id || cat._id;
    const name = cat.name_ka || cat.name?.ka || key;
    const dishesCount = dishes.filter((d) => (d.category || d.categoryId) === key).length;
    let confirmMsg = `ნამდვილად გსურთ კატეგორიის "${name}" წაშლა?`;
    if (dishesCount > 0) {
      confirmMsg += `\n\nგაფრთხილება: კატეგორიაშია ${dishesCount} კერძი, რომლებიც ასევე წაიშლება!`;
    }

    if (!window.confirm(confirmMsg)) return;

    try {
      await deleteCategory(key);
      setCategories((prev) => prev.filter((c) => (c.id || c._id) !== key));
      if (dishesCount > 0) {
        setDishes((prev) => prev.filter((d) => (d.category || d.categoryId) !== key));
      }
      showToast(`✓ კატეგორია "${name}" წაიშალა`);
    } catch (err) {
      alert(`შეცდომა: ${err.message}`);
    }
  };

  // ─── Dish CRUD Handlers ──────────────────────────────────────────────────
  const handleOpenAddDish = () => {
    setEditingDish(null);
    setDishNameKa("");
    setDishNameEn("");
    setDishNameRu("");
    setDishDescKa("");
    setDishDescEn("");
    setDishDescRu("");
    setDishPrice("");
    setDishVolumePrices({});
    setDishCategory(categories[0]?.id || categories[0]?._id || "");
    setDishImageFile(null);
    setDishImagePreview("");
    setIsDishModalOpen(true);
  };

  const handleOpenEditDish = (dish) => {
    setEditingDish(dish);
    const cat = dish.category || dish.categoryId || categories[0]?.id || "";
    setDishNameKa(dish.name_ka || dish.name?.ka || dish.title?.ka || dish.name || "");
    setDishNameEn(dish.name_en || dish.name?.en || dish.title?.en || "");
    setDishNameRu(dish.name_ru || dish.name?.ru || dish.title?.ru || "");
    setDishDescKa(dish.desc_ka || dish.description?.ka || dish.desc || "");
    setDishDescEn(dish.desc_en || dish.description?.en || "");
    setDishDescRu(dish.desc_ru || dish.description?.ru || "");
    setDishCategory(cat);
    setDishImageFile(null);
    setDishImagePreview(dish.image || "");

    let rawPrice = "";
    if (dish.price) {
      if (String(dish.price).includes("|")) {
        if (Array.isArray(dish.prices) && dish.prices.length > 0 && dish.prices[0].price !== undefined) {
          rawPrice = String(dish.prices[0].price);
        } else {
          const match = String(dish.price).match(/[\d.]+/);
          rawPrice = match ? match[0] : "";
        }
      } else {
        rawPrice = String(dish.price).replace(/[^\d.]/g, "");
      }
    }
    setDishPrice(rawPrice);

    const volPrices = {};
    if (Array.isArray(dish.prices) && dish.prices.length > 0) {
      dish.prices.forEach((p) => {
        if (p && p.size) volPrices[p.size] = p.price !== undefined && p.price !== null ? String(p.price) : "";
      });
    } else {
      const parsed = parseMultiPrice(dish);
      if (parsed) {
        parsed.forEach((p) => {
          if (p && p.size) volPrices[p.size] = p.priceNum !== undefined ? String(p.priceNum) : "";
        });
      }
    }
    setDishVolumePrices(volPrices);
    setIsDishModalOpen(true);
  };

  const handleSaveDish = async (e) => {
    e.preventDefault();
    if (!dishNameKa.trim()) return alert("გთხოვთ მიუთითოთ კერძის დასახელება ქართულად");
    if (!dishCategory) return alert("გთხოვთ აირჩიოთ კატეგორია");

    const targetSizes = getVolumeSizesForDish(dishCategory, dishNameKa, categories);
    let priceVal = "";
    let pricesArray = null;

    if (targetSizes && targetSizes.length > 0) {
      const validPrices = targetSizes
        .map((size) => {
          const raw = dishVolumePrices[size];
          const val = raw !== undefined && raw !== null && String(raw).trim() !== "" ? parseFloat(raw) : NaN;
          return { size, price: val };
        })
        .filter((p) => !isNaN(p.price) && p.price > 0);

      if (validPrices.length > 0) {
        pricesArray = validPrices;
        priceVal = pricesArray.map((p) => `${p.size.replace(/\s+/g, "")} - ${p.price}₾`).join(" | ");
      } else {
        const num = parseFloat(dishPrice);
        if (isNaN(num) || num <= 0) return alert("გთხოვთ მიუთითოთ მოცულობის ან კერძის ფასი");
        priceVal = `${num} ₾`;
      }
    } else {
      const num = parseFloat(dishPrice);
      if (isNaN(num) || num <= 0) return alert("გთხოვთ მიუთითოთ კერძის ფასი");
      priceVal = `${num} ₾`;
    }

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("name_ka", dishNameKa.trim());
      formData.append("name_en", dishNameEn.trim() || dishNameKa.trim());
      formData.append("name_ru", dishNameRu.trim() || dishNameKa.trim());
      formData.append("desc_ka", dishDescKa.trim());
      formData.append("desc_en", dishDescEn.trim());
      formData.append("desc_ru", dishDescRu.trim());
      formData.append("price", priceVal);
      if (pricesArray && pricesArray.length > 0) {
        formData.append("prices", JSON.stringify(pricesArray));
      } else {
        formData.append("prices", JSON.stringify([]));
      }
      formData.append("category", dishCategory);
      formData.append("categoryId", dishCategory);
      if (dishImageFile) {
        formData.append("image", dishImageFile);
      }

      if (editingDish) {
        const id = editingDish.id || editingDish._id;
        const updated = await updateDish(id, formData);
        setDishes((prev) =>
          prev.map((d) =>
            (d.id || d._id) === id
              ? {
                  ...d,
                  ...updated,
                  prices: pricesArray || updated.prices || []
                }
              : d
          )
        );
        showToast("✓ კერძი წარმატებით განახლდა");
      } else {
        const created = await createDish(formData);
        const formatted = {
          ...created,
          id: created.id || created._id,
          prices: pricesArray || created.prices || []
        };
        setDishes((prev) => [...prev, formatted]);
        showToast("✓ ახალი კერძი წარმატებით დაემატა");
      }
      setIsDishModalOpen(false);
    } catch (err) {
      alert(`შეცდომა: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDish = async (dish) => {
    const id = dish.id || dish._id;
    const name = dish.name_ka || dish.name || "კერძი";
    if (!window.confirm(`ნამდვილად გსურთ "${name}"-ს წაშლა?`)) return;

    try {
      await deleteDish(id);
      setDishes((prev) => prev.filter((d) => (d.id || d._id) !== id));
      showToast(`✓ კერძი "${name}" წაიშალა`);
    } catch (err) {
      alert(`შეცდომა: ${err.message}`);
    }
  };

  // ─── Availability Toggling ───────────────────────────────────────────────
  const toggleDishAvailability = async (dishId) => {
    const nextList = unavailableDishIds.includes(dishId)
      ? unavailableDishIds.filter((id) => id !== dishId)
      : [...unavailableDishIds, dishId];

    setUnavailableDishIds(nextList);
    try {
      await updateAdminSettings({ unavailableDishIds: nextList });
      showToast("✓ ხელმისაწვდომობის სტატუსი განახლდა");
    } catch (err) {
      console.error("Failed to update availability setting:", err);
    }
  };

  // ─── Reordering Handlers ─────────────────────────────────────────────────
  const moveCategory = async (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= categories.length) return;

    const newOrder = [...categories];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIdx, 0, moved);
    setCategories(newOrder);

    try {
      const ids = newOrder.map((c) => c.id || c._id);
      await reorderCategories(ids);
      showToast("✓ კატეგორიების რიგითობა შენახულია");
    } catch (err) {
      console.error(err);
      loadInitialData();
    }
  };

  const categoryDishes = useMemo(() => {
    if (!selectedSortCategory) return [];
    return dishes.filter((d) => (d.category || d.categoryId) === selectedSortCategory);
  }, [dishes, selectedSortCategory]);

  const moveDish = async (dishId, direction) => {
    const currentIdx = categoryDishes.findIndex((d) => (d.id || d._id) === dishId);
    if (currentIdx === -1) return;
    const targetIdx = currentIdx + direction;
    if (targetIdx < 0 || targetIdx >= categoryDishes.length) return;

    const reorderedCategoryDishes = [...categoryDishes];
    const [moved] = reorderedCategoryDishes.splice(currentIdx, 1);
    reorderedCategoryDishes.splice(targetIdx, 0, moved);

    // Merge into global dishes
    const catDishIds = new Set(reorderedCategoryDishes.map((d) => d.id || d._id));
    const newGlobalDishes = [];
    let inserted = false;

    for (const d of dishes) {
      const id = d.id || d._id;
      if (catDishIds.has(id)) {
        if (!inserted) {
          reorderedCategoryDishes.forEach((item) => newGlobalDishes.push(item));
          inserted = true;
        }
      } else {
        newGlobalDishes.push(d);
      }
    }
    if (!inserted) {
      reorderedCategoryDishes.forEach((item) => newGlobalDishes.push(item));
    }

    setDishes(newGlobalDishes);

    try {
      const ids = newGlobalDishes.map((d) => d.id || d._id);
      await reorderDishes(ids);
      showToast("✓ კერძების რიგითობა შენახულია");
    } catch (err) {
      console.error(err);
      loadInitialData();
    }
  };

  // Filtered dishes for products tab
  const filteredDishes = useMemo(() => {
    return dishes.filter((d) => {
      const matchesCat =
        selectedFilterCategory === "all" ||
        (d.category || d.categoryId) === selectedFilterCategory;
      if (!matchesCat) return false;

      if (!dishSearch.trim()) return true;
      const q = dishSearch.trim().toLowerCase();
      const nameKa = (d.name_ka || d.name?.ka || d.title?.ka || d.name || "").toLowerCase();
      const nameEn = (d.name_en || d.name?.en || d.title?.en || "").toLowerCase();
      return nameKa.includes(q) || nameEn.includes(q);
    });
  }, [dishes, selectedFilterCategory, dishSearch]);

  const activeCategorySizes = useMemo(() => {
    return getVolumeSizesForDish(dishCategory, dishNameKa, categories);
  }, [dishCategory, dishNameKa, categories]);

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-black font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="h-16 bg-[#0f172a] border-b border-amber-900/20 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-amber-400 hover:bg-white/5"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🍺</span>
            <span className="font-serif font-bold text-amber-200 tracking-wide text-lg sm:text-xl">
              StaroPub Admin
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live DB Active
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">შენახვა</span>
          </button>

          <button
            type="button"
            onClick={onBackToSite}
            className="px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 text-amber-300 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-amber-900/30 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">მენიუზე გადასვლა</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="p-2 sm:px-3 sm:py-2 bg-red-950/40 hover:bg-red-900/50 text-red-300 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-red-900/30 transition-colors"
            title="გამოსვლა"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">გამოსვლა</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#0d1424] border-r border-amber-900/20 p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-200/40 px-3 py-2">
              მართვის მოდულები
            </div>

            {[
              { id: "dishes", label: "კერძები & პროდუქტები", icon: UtensilsCrossed, badge: dishes.length },
              { id: "categories", label: "კატეგორიები (CRUD)", icon: FolderTree, badge: categories.length },
              { id: "availability", label: "ხელმისაწვდომობა (მარაგი)", icon: SlidersHorizontal, badge: dishes.length },
              { id: "sorting", label: "რიგითობა & სორტირება", icon: ArrowUp, badge: null },
              { id: "hours", label: "სამუშაო საათები & სტატუსი", icon: Clock, badge: pubIsOpen ? "ღიაა" : "დაკეტილია" },
              { id: "calls", label: "გამოძახებები (მიმტანი)", icon: Bell, badge: waiterCalls.length },
              { id: "banner", label: "დღის შეთავაზების ბანერი", icon: Megaphone, badge: null },
              { id: "reviews", label: "შეფასებების ჟურნალი", icon: MessageSquare, badge: reviews.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-950/50"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-black/30 text-amber-200"
                          : "bg-white/5 text-gray-400"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-amber-900/20 text-[11px] text-gray-500 text-center">
            StaroPub Tbilisi v2.0 • Admin
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 md:hidden"
          />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#090d16]">
          {/* TAB 1: DISHES / PRODUCTS */}
          {activeTab === "dishes" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Header and Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] p-5 rounded-2xl border border-amber-900/20 shadow-md">
                <div>
                  <h2 className="text-xl font-bold font-serif text-amber-200">
                    კერძებისა და პროდუქტების მართვა
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    სულ კატალოგშია {dishes.length} კერძი.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddDish}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-950/50 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ახალი კერძის დამატება</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-amber-400/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={dishSearch}
                    onChange={(e) => setDishSearch(e.target.value)}
                    placeholder="კერძის ძებნა..."
                    className="w-full bg-[#111827] border border-amber-900/30 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <select
                    value={selectedFilterCategory}
                    onChange={(e) => setSelectedFilterCategory(e.target.value)}
                    className="w-full bg-[#111827] border border-amber-900/30 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-amber-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">ყველა კატეგორია ({dishes.length})</option>
                    {categories.map((c) => {
                      const count = dishes.filter(
                        (d) => (d.category || d.categoryId) === (c.id || c._id)
                      ).length;
                      return (
                        <option key={c.id || c._id} value={c.id || c._id}>
                          {c.icon || "🍽️"} {c.name_ka || c.name?.ka || c.title || c.id} ({count})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Dishes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDishes.map((dish) => {
                  const id = dish.id || dish._id;
                  const isAvailable = !unavailableDishIds.includes(id);
                  const catObj = categories.find(
                    (c) => (c.id || c._id) === (dish.category || dish.categoryId)
                  );
                  return (
                    <div
                      key={id}
                      className="bg-[#111827] border border-amber-900/20 hover:border-amber-500/30 rounded-2xl p-4 flex gap-4 transition-all shadow-md group relative overflow-hidden"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-20 h-20 rounded-xl bg-black/40 overflow-hidden shrink-0 border border-white/5 relative">
                        {dish.image ? (
                          <img
                            src={resolveAdminImage(dish.image)}
                            alt={dish.name_ka || ""}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl text-amber-400/40">
                            🍲
                          </div>
                        )}
                        {!isAvailable && (
                          <div className="absolute inset-0 bg-red-950/80 backdrop-blur-[1px] flex items-center justify-center text-[10px] font-bold text-red-200 text-center px-1">
                            გათიშულია
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="font-bold text-sm text-gray-100 truncate">
                              {dish.name_ka || dish.name?.ka || dish.name || "უსახელო"}
                            </h3>
                          </div>
                          <p className="text-[11px] text-amber-400 font-semibold mt-0.5">
                            {catObj?.icon || "🍽️"} {catObj?.name_ka || catObj?.name?.ka || dish.category}
                          </p>
                          <p className="text-xs font-bold text-amber-300 mt-1">
                            {dish.price || "—"}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 pt-2 border-t border-white/5 mt-2">
                          <button
                            type="button"
                            onClick={() => toggleDishAvailability(id)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                              isAvailable
                                ? "bg-emerald-950 text-emerald-400 hover:bg-emerald-900"
                                : "bg-red-950 text-red-400 hover:bg-red-900"
                            }`}
                            title={isAvailable ? "აქტიურია (დააჭირეთ გასათიშად)" : "გათიშულია (დააჭირეთ ჩასართავად)"}
                          >
                            {isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditDish(dish)}
                            className="p-1.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-bold"
                            title="რედაქტირება"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteDish(dish)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold"
                            title="წაშლა"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORIES (CRUD) */}
          {activeTab === "categories" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] p-5 rounded-2xl border border-amber-900/20 shadow-md">
                <div>
                  <h2 className="text-xl font-bold font-serif text-amber-200">
                    კატეგორიების მართვა
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    სულ სისტემაშია {categories.length} კატეგორია.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-950/50 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ახალი კატეგორიის დამატება</span>
                </button>
              </div>

              {/* Category List */}
              <div className="space-y-3">
                {categories.map((cat, idx) => {
                  const id = cat.id || cat._id;
                  const dishesCount = dishes.filter(
                    (d) => (d.category || d.categoryId) === id
                  ).length;
                  return (
                    <div
                      key={id}
                      className="bg-[#111827] border border-amber-900/20 hover:border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-black/40 overflow-hidden shrink-0 border border-white/5 flex items-center justify-center">
                          {cat.image ? (
                            <img
                              src={resolveAdminImage(cat.image)}
                              alt={cat.name_ka || ""}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-2xl">{cat.icon || "🍽️"}</span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{cat.icon || "🍽️"}</span>
                            <h3 className="font-bold text-sm sm:text-base text-gray-100">
                              {cat.name_ka || cat.name?.ka || cat.title || id}
                            </h3>
                            {cat.isHot && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-950 text-orange-400 border border-orange-800/40">
                                🔥 Hot
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                            <span>ID: <code className="text-amber-300 font-mono">{id}</code></span>
                            <span>•</span>
                            <span>{dishesCount} კერძი</span>
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditCategory(cat)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">რედაქტირება</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">წაშლა</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AVAILABILITY (STOCK MANAGEMENT) */}
          {activeTab === "availability" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-[#111827] p-5 rounded-2xl border border-amber-900/20">
                <h2 className="text-xl font-bold font-serif text-amber-200">
                  კერძების ხელმისაწვდომობის მენეჯერი (მარაგი)
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  გამორთეთ კერძები, როცა ინგრედიენტები ამოიწურება. გათიშული კერძები არ გამოჩნდება საჯარო მენიუში.
                </p>
              </div>

              <div className="space-y-2">
                {dishes.map((dish) => {
                  const id = dish.id || dish._id;
                  const isAvailable = !unavailableDishIds.includes(id);
                  const catObj = categories.find(
                    (c) => (c.id || c._id) === (dish.category || dish.categoryId)
                  );
                  return (
                    <div
                      key={id}
                      className="bg-[#111827] border border-amber-900/20 rounded-xl px-4 py-3 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{catObj?.icon || "🍽️"}</span>
                        <div>
                          <h4 className="font-bold text-sm text-gray-100">
                            {dish.name_ka || dish.name?.ka || dish.name}
                          </h4>
                          <span className="text-[11px] text-gray-400">
                            {catObj?.name_ka || dish.category} • {dish.price}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleDishAvailability(id)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isAvailable
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                            : "bg-red-950 text-red-300 border border-red-800"
                        }`}
                      >
                        {isAvailable ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>მარაგშია</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            <span>ამოიწურა</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SORTING & REORDERING */}
          {activeTab === "sorting" && (
            <div className="space-y-8 max-w-5xl mx-auto">
              {/* Category Sorting */}
              <div className="bg-[#111827] p-5 rounded-2xl border border-amber-900/20 space-y-4">
                <h3 className="text-lg font-bold font-serif text-amber-200">
                  📁 კატეგორიების რიგითობა მენიუში
                </h3>
                <div className="space-y-2">
                  {categories.map((cat, idx) => (
                    <div
                      key={cat.id || cat._id}
                      className="bg-[#0a0f1d] border border-amber-900/20 rounded-xl p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 font-mono text-xs w-6 text-center">
                          #{idx + 1}
                        </span>
                        <span className="text-lg">{cat.icon || "🍽️"}</span>
                        <span className="font-bold text-sm text-gray-100">
                          {cat.name_ka || cat.name?.ka || cat.title || cat.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveCategory(idx, -1)}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 disabled:opacity-30"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveCategory(idx, 1)}
                          disabled={idx === categories.length - 1}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 disabled:opacity-30"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dish Sorting within Category */}
              <div className="bg-[#111827] p-5 rounded-2xl border border-amber-900/20 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-lg font-bold font-serif text-amber-200">
                    🍽️ კერძების რიგითობა კატეგორიაში
                  </h3>
                  <select
                    value={selectedSortCategory}
                    onChange={(e) => setSelectedSortCategory(e.target.value)}
                    className="bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-3 py-1.5 text-xs text-amber-200 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c._id} value={c.id || c._id}>
                        {c.icon || "🍽️"} {c.name_ka || c.name?.ka || c.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  {categoryDishes.length === 0 ? (
                    <p className="text-xs text-gray-500 py-4 text-center">
                      ამ კატეგორიაში კერძები არ არის.
                    </p>
                  ) : (
                    categoryDishes.map((dish, idx) => {
                      const id = dish.id || dish._id;
                      return (
                        <div
                          key={id}
                          className="bg-[#0a0f1d] border border-amber-900/20 rounded-xl p-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 font-mono text-xs w-6 text-center">
                              #{idx + 1}
                            </span>
                            <span className="font-bold text-sm text-gray-100">
                              {dish.name_ka || dish.name}
                            </span>
                            <span className="text-xs text-amber-400 font-semibold">
                              ({dish.price})
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveDish(id, -1)}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 disabled:opacity-30"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveDish(id, 1)}
                              disabled={idx === categoryDishes.length - 1}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 disabled:opacity-30"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WORKING HOURS & STATUS */}
          {activeTab === "hours" && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-[#111827] p-6 rounded-2xl border border-amber-900/20 space-y-6">
                <div>
                  <h2 className="text-xl font-bold font-serif text-amber-200">
                    სამუშაო საათები & პაბის სტატუსი
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    ცვლილებები მყისიერად აისახება „ჩვენს შესახებ“ გვერდზე და საჯარო სტატუსის ბეიჯზე.
                  </p>
                </div>

                {/* Open / Closed Toggle */}
                <div className="flex items-center justify-between p-4 bg-[#0a0f1d] rounded-2xl border border-amber-900/20">
                  <div>
                    <h4 className="font-bold text-sm text-gray-100">პაბის სტატუსი</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      ამჟამად პაბი აღნიშნულია როგორც {pubIsOpen ? "„ღიაა“" : "„დაკეტილია“"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPubIsOpen(!pubIsOpen)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                      pubIsOpen
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950"
                        : "bg-red-600 text-white shadow-lg shadow-red-950"
                    }`}
                  >
                    {pubIsOpen ? "ღიაა ✓" : "დაკეტილია ✕"}
                  </button>
                </div>

                {/* Hours input */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                      სამუშაო საათები
                    </label>
                    <input
                      type="text"
                      value={workingHoursText}
                      onChange={(e) => setWorkingHoursText(e.target.value)}
                      placeholder="10:00 – 23:00"
                      className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                      სამუშაო დღეები
                    </label>
                    <input
                      type="text"
                      value={workingDaysText}
                      onChange={(e) => setWorkingDaysText(e.target.value)}
                      placeholder="ყოველდღე"
                      className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                      მატჩის დღეების შენიშვნა
                    </label>
                    <input
                      type="text"
                      value={matchDayNoteText}
                      onChange={(e) => setMatchDayNoteText(e.target.value)}
                      placeholder="მატჩის დღეებში პაბი მუშაობს მატჩის ბოლომდე"
                      className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                      საკონტაქტო ნომერი (დარეკვა)
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+995 595 93 11 19"
                      className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>პარამეტრების შენახვა</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: WAITER & BILL CALLS */}
          {activeTab === "calls" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] p-5 rounded-2xl border border-amber-900/20">
                <div>
                  <h2 className="text-xl font-bold font-serif text-amber-200">
                    🔔 მაგიდებიდან გამოძახებების ჟურნალი
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    ოფიციანტისა და ანგარიშის გამოძახების მოთხოვნები.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date().toLocaleTimeString();
                      setWaiterCalls((prev) => [
                        { id: Date.now(), table: "4", type: "მიმტანი 💁‍♂️", time: now },
                        ...prev
                      ]);
                    }}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30"
                  >
                    + მაგიდა 4 (სიმულაცია)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaiterCalls([])}
                    className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/40 text-red-300 font-bold text-xs rounded-xl border border-red-800/30"
                  >
                    გასუფთავება
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {waiterCalls.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-sm bg-[#111827] rounded-2xl border border-white/5">
                    აქტიური გამოძახებები არ არის.
                  </div>
                ) : (
                  waiterCalls.map((call) => (
                    <div
                      key={call.id}
                      className="bg-[#111827] border border-amber-900/20 rounded-2xl p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                          {call.table}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-gray-100">
                            მაგიდა #{call.table} • {call.type}
                          </div>
                          <span className="text-[11px] text-gray-400 font-mono">
                            დრო: {call.time}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setWaiterCalls((prev) => prev.filter((c) => c.id !== call.id))
                        }
                        className="px-3 py-1.5 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 rounded-xl text-xs font-bold border border-emerald-800/40"
                      >
                        დასრულება ✓
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 7: BANNER SETTINGS */}
          {activeTab === "banner" && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-[#111827] p-6 rounded-2xl border border-amber-900/20 space-y-6">
                <div>
                  <h2 className="text-xl font-bold font-serif text-amber-200">
                    📢 დღის შეთავაზების ბანერი
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    აქტიური აქციისა და დღის შეთავაზების მართვა.
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0a0f1d] rounded-2xl border border-amber-900/20">
                  <div>
                    <h4 className="font-bold text-sm text-gray-100">ბანერის ჩვენება</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      ბანერის ჩართვა ან დამალვა
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setBannerSettings((b) => ({ ...b, enabled: !b.enabled }))
                    }
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                      bannerSettings.enabled
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {bannerSettings.enabled ? "ჩართულია ✓" : "გათიშულია ✕"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                      ბეიჯის ტექსტი
                    </label>
                    <input
                      type="text"
                      value={bannerSettings.badge || ""}
                      onChange={(e) =>
                        setBannerSettings((b) => ({ ...b, badge: e.target.value }))
                      }
                      placeholder="დღის შეთავაზება"
                      className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                      სარეკლამო ტექსტი / შეთავაზება
                    </label>
                    <input
                      type="text"
                      value={bannerSettings.text || ""}
                      onChange={(e) =>
                        setBannerSettings((b) => ({ ...b, text: e.target.value }))
                      }
                      placeholder="საფირმო ჩეხური ნეკნები - 15% ფასდაკლება!"
                      className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>ბანერის შენახვა</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: REVIEWS */}
          {activeTab === "reviews" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-[#111827] p-5 rounded-2xl border border-amber-900/20">
                <h2 className="text-xl font-bold font-serif text-amber-200">
                  💬 სტუმრების შეფასებების ჟურნალი
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  სულ შემოსულია {reviews.length} შეფასება.
                </p>
              </div>

              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#111827] border border-amber-900/20 rounded-2xl p-5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-amber-200">{rev.name}</span>
                        <span className="text-xs text-gray-500">• მაგიდა #{rev.table}</span>
                      </div>
                      <div className="text-amber-400 text-xs">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">{rev.comment}</p>
                    <div className="text-[11px] text-gray-500 font-mono pt-1">
                      {rev.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─── MODAL: ADD / EDIT CATEGORY ─── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-amber-900/40 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/20 mb-5">
              <h3 className="text-lg font-bold font-serif text-amber-200">
                {editingCategory ? "✏️ კატეგორიის რედაქტირება" : "➕ ახალი კატეგორიის დამატება"}
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                    გასაღები (ID / Key)
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingCategory}
                    value={catKey}
                    onChange={(e) => setCatKey(e.target.value)}
                    placeholder="მაგ: desserts"
                    className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-100 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                    ემოჯი / იკონი
                  </label>
                  <input
                    type="text"
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    placeholder="🍰"
                    className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                  სახელი (ქართულად) *
                </label>
                <input
                  type="text"
                  required
                  value={catNameKa}
                  onChange={(e) => setCatNameKa(e.target.value)}
                  placeholder="დესერტები"
                  className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                    სახელი (ინგლისურად)
                  </label>
                  <input
                    type="text"
                    value={catNameEn}
                    onChange={(e) => setCatNameEn(e.target.value)}
                    placeholder="Desserts"
                    className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                    სახელი (რუსულად)
                  </label>
                  <input
                    type="text"
                    value={catNameRu}
                    onChange={(e) => setCatNameRu(e.target.value)}
                    placeholder="Десерты"
                    className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-[#0a0f1d] rounded-xl border border-amber-900/20">
                <input
                  type="checkbox"
                  id="cat-is-hot"
                  checked={catIsHot}
                  onChange={(e) => setCatIsHot(e.target.checked)}
                  className="rounded text-amber-600 w-4 h-4 accent-amber-600"
                />
                <label htmlFor="cat-is-hot" className="text-xs font-semibold text-amber-200 cursor-pointer">
                  🔥 მონიშნეთ როგორც პოპულარული / Hot კატეგორია
                </label>
              </div>

              {/* Image Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                  კატეგორიის სურათი (Cloudinary / File)
                </label>
                {catImagePreview && (
                  <div className="flex items-center gap-3">
                    <img
                      src={resolveAdminImage(catImagePreview)}
                      alt="Category Preview"
                      className="w-14 h-14 object-cover rounded-xl border border-amber-500/40"
                    />
                    <span className="text-xs text-emerald-400 font-semibold">
                      ✓ სურათი შერჩეულია
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCatImageFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => setCatImagePreview(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-600 file:text-white hover:file:bg-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "ინახება..." : "შენახვა"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD / EDIT DISH ─── */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-amber-900/40 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/20 mb-5">
              <h3 className="text-lg font-bold font-serif text-amber-200">
                {editingDish ? "✏️ კერძის რედაქტირება" : "➕ ახალი კერძის დამატება"}
              </h3>
              <button
                type="button"
                onClick={() => setIsDishModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                  კატეგორია *
                </label>
                <select
                  required
                  value={dishCategory}
                  onChange={(e) => setDishCategory(e.target.value)}
                  className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-amber-200 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id || c._id} value={c.id || c._id}>
                      {c.icon || "🍽️"} {c.name_ka || c.name?.ka || c.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                  დასახელება (ქართულად) *
                </label>
                <input
                  type="text"
                  required
                  value={dishNameKa}
                  onChange={(e) => setDishNameKa(e.target.value)}
                  placeholder="მაგ: საფირმო ჩეხური ნეკნები"
                  className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                    დასახელება (EN)
                  </label>
                  <input
                    type="text"
                    value={dishNameEn}
                    onChange={(e) => setDishNameEn(e.target.value)}
                    placeholder="Signature Czech Ribs"
                    className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                    დასახელება (RU)
                  </label>
                  <input
                    type="text"
                    value={dishNameRu}
                    onChange={(e) => setDishNameRu(e.target.value)}
                    placeholder="Фирменные чешские ребрышки"
                    className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                  აღწერა (ქართულად)
                </label>
                <textarea
                  rows={2}
                  value={dishDescKa}
                  onChange={(e) => setDishDescKa(e.target.value)}
                  placeholder="შემწვარი ნეკნები მექსიკური კარტოფილითა და სოუსით"
                  className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-100"
                />
              </div>

              {/* Multi-tier or Single Price */}
              {activeCategorySizes && activeCategorySizes.length > 0 ? (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
                  <label className="block text-xs font-bold text-amber-300">
                    🍺 / 🥃 მოცულობების მიხედვით ფასები (ლარი)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {activeCategorySizes.map((size) => (
                      <div key={size}>
                        <span className="text-[11px] text-gray-400 font-semibold">{size}</span>
                        <input
                          type="number"
                          step="0.1"
                          value={dishVolumePrices[size] || ""}
                          onChange={(e) =>
                            setDishVolumePrices((prev) => ({
                              ...prev,
                              [size]: e.target.value
                            }))
                          }
                          placeholder="8.50"
                          className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-lg px-2.5 py-1.5 text-xs text-gray-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                    ფასი (₾ / ლარი) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={dishPrice}
                    onChange={(e) => setDishPrice(e.target.value)}
                    placeholder="18.50"
                    className="w-full bg-[#0a0f1d] border border-amber-900/30 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-100"
                  />
                </div>
              )}

              {/* Dish Image */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                  კერძის ფოტო (Cloudinary / File)
                </label>
                {dishImagePreview && (
                  <div className="flex items-center gap-3">
                    <img
                      src={resolveAdminImage(dishImagePreview)}
                      alt="Dish Preview"
                      className="w-16 h-16 object-cover rounded-xl border border-amber-500/40"
                    />
                    <span className="text-xs text-emerald-400 font-semibold">
                      ✓ ფოტო შერჩეულია
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setDishImageFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => setDishImagePreview(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-600 file:text-white hover:file:bg-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "ინახება..." : "შენახვა"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
