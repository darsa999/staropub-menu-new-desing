import React, { createContext, useContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export const translations = {
  ka: {
    restaurantName: "StaroPub - სტარო პაბი",
    welcomeText: "StaroPub-სტარო პაბი",
    allProducts: "ყველა პროდუქტი",
    searchPlaceholder: "ძებნა...",
    categoriesTitle: "კატეგორიები",
    addToCart: "+ დამატება",
    added: "დაემატა ✓",
    cartTitle: "შეკვეთის კალათა",
    emptyCart: "თქვენი კალათა ცარიელია",
    subtotal: "ჯამური ღირებულება",
    total: "სულ გადასახდელი",
    checkout: "შეკვეთის გაფორმება",
    clearCart: "კალათის გასუფთავება",
    currency: "₾",
    phone: "ტელეფონი",
    email: "ელ. ფოსტა",
    navHome: "მთავარი",
    navAbout: "ჩვენ შესახებ",
    navTerms: "წესები და პირობები",
    navPrivacy: "კონფიდენციალურობის პოლიტიკა",
    copyright: "Powered by OFOODO 2026©",
    selectLanguage: "ენის არჩევა",
    noProductsFound: "პროდუქტი ვერ მოიძებნა",
    itemsCount: "პროდუქტი",
  },
  en: {
    restaurantName: "StaroPub - სტარო პაბი",
    welcomeText: "StaroPub-სტარო პაბი",
    allProducts: "All Products",
    searchPlaceholder: "Search dishes...",
    categoriesTitle: "Categories",
    addToCart: "+ Add",
    added: "Added ✓",
    cartTitle: "Your Order Cart",
    emptyCart: "Your cart is currently empty",
    subtotal: "Subtotal",
    total: "Total Amount",
    checkout: "Proceed to Checkout",
    clearCart: "Clear Cart",
    currency: "₾",
    phone: "Phone",
    email: "Email",
    navHome: "Home",
    navAbout: "About Us",
    navTerms: "Terms & Conditions",
    navPrivacy: "Privacy Policy",
    copyright: "Powered by OFOODO 2026©",
    selectLanguage: "Select Language",
    noProductsFound: "No products found",
    itemsCount: "items",
  },
  ru: {
    restaurantName: "StaroPub - სტარო პაბი",
    welcomeText: "StaroPub-სტარო პაბი",
    allProducts: "Все блюда",
    searchPlaceholder: "Поиск блюд...",
    categoriesTitle: "Категории",
    addToCart: "+ Добавить",
    added: "Добавлено ✓",
    cartTitle: "Ваш заказ",
    emptyCart: "Ваша корзина пуста",
    subtotal: "Сумма",
    total: "Итого к оплате",
    checkout: "Оформить заказ",
    clearCart: "Очистить корзину",
    currency: "₾",
    phone: "Телефон",
    email: "Эл. почта",
    navHome: "Главная",
    navAbout: "О нас",
    navTerms: "Правила и условия",
    navPrivacy: "Политика конфиденциальности",
    copyright: "Powered by OFOODO 2026©",
    selectLanguage: "Выберите язык",
    noProductsFound: "Блюда не найдены",
    itemsCount: "блюд",
  },
};

export const LANGUAGES = [
  {
    code: "ka",
    label: "ქართული",
    subLabel: "KA",
    flag: "🇬🇪",
  },
  {
    code: "en",
    label: "ENGLISH (US)",
    subLabel: "EN",
    flag: "🇺🇸",
  },
  {
    code: "ru",
    label: "РУССКИЙ",
    subLabel: "RU",
    flag: "🇷🇺",
  },
];

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app_lang") || "ka";
  });

  useEffect(() => {
    localStorage.setItem("app_lang", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.ka[key] || key;
  };

  const getLocalizedField = (fieldObj) => {
    if (!fieldObj) return "";
    return fieldObj[language] || fieldObj.ka || fieldObj.en || "";
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getLocalizedField,
        languages: LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
