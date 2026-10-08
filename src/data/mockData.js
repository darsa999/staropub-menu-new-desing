export const mockCategories = [
  {
    id: "cold-dishes",
    slug: "civi-kerdzebi",
    title: {
      ka: "ცივი კერძები",
      en: "Cold Dishes",
      ru: "Холодные блюда",
    },
    name: {
      ka: "ცივი კერძები",
      en: "Cold Dishes",
      ru: "Холодные блюда",
    },
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: "salads",
    slug: "salatebi",
    title: {
      ka: "სალათები",
      en: "Salads",
      ru: "Салаты",
    },
    name: {
      ka: "სალათები",
      en: "Salads",
      ru: "Салаты",
    },
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: "mkhaleuli",
    slug: "mkhaleuli",
    title: {
      ka: "მხალეული",
      en: "Pkhali & Greens",
      ru: "Пхали",
    },
    name: {
      ka: "მხალეული",
      en: "Pkhali & Greens",
      ru: "Пхали",
    },
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: "pastry",
    slug: "tsomeuli",
    title: {
      ka: "ცომეული",
      en: "Pastry",
      ru: "Выпечка",
    },
    name: {
      ka: "ცომეული",
      en: "Pastry",
      ru: "Выпечка",
    },
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: "soups",
    slug: "tsvniani-kerdzebi",
    title: {
      ka: "წვნიანი კერძები",
      en: "Soups",
      ru: "Супы",
    },
    name: {
      ka: "წვნიანი კერძები",
      en: "Soups",
      ru: "Супы",
    },
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: "hot-dishes",
    slug: "tskheli-kerdzebi",
    title: {
      ka: "ცხელი კერძები",
      en: "Hot Dishes",
      ru: "Горячие блюда",
    },
    name: {
      ka: "ცხელი კერძები",
      en: "Hot Dishes",
      ru: "Горячие блюда",
    },
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: "khinkali",
    slug: "khinkali",
    title: {
      ka: "ხინკალი",
      en: "Khinkali",
      ru: "Хинкали",
    },
    name: {
      ka: "ხინკალი",
      en: "Khinkali",
      ru: "Хинкали",
    },
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: "fish",
    slug: "tevzeuli",
    title: {
      ka: "თევზეული",
      en: "Fish Dishes",
      ru: "Рыбные блюда",
    },
    name: {
      ka: "თევზეული",
      en: "Fish Dishes",
      ru: "Рыбные блюда",
    },
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: "sauces",
    slug: "sousebi",
    title: {
      ka: "სოუსები",
      en: "Sauces",
      ru: "Соусы",
    },
    name: {
      ka: "სოუსები",
      en: "Sauces",
      ru: "Соусы",
    },
    image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=700&auto=format&fit=crop&q=80",
  },
];

export const mockProducts = [
  // ცივი კერძები (cold-dishes)
  {
    id: "p1",
    categoryId: "cold-dishes",
    name: {
      ka: "ყველის ნაირსახეობა",
      en: "Cheese Assortment",
      ru: "Сырное ассорти",
    },
    price: 31.0,
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p2",
    categoryId: "cold-dishes",
    name: {
      ka: "იმერული ყველი",
      en: "Imeretian Cheese",
      ru: "Имеретинский сыр",
    },
    price: 14.5,
    image: "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p3",
    categoryId: "cold-dishes",
    name: {
      ka: "სულგუნი",
      en: "Sulguni Cheese",
      ru: "Сулугуни",
    },
    price: 16.0,
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p4",
    categoryId: "cold-dishes",
    name: {
      ka: "შებოლილი სულგუნი",
      en: "Smoked Sulguni",
      ru: "Копченый сулугуни",
    },
    price: 17.5,
    image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p5",
    categoryId: "cold-dishes",
    name: {
      ka: "მჟავის ასორტი",
      en: "Pickles Assortment",
      ru: "Ассорти солений",
    },
    price: 12.0,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p6",
    categoryId: "cold-dishes",
    name: {
      ka: "ზეთისხილი",
      en: "Olives Plate",
      ru: "Оливки и маслины",
    },
    price: 9.5,
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    available: true,
  },

  // სალათები (salads)
  {
    id: "p7",
    categoryId: "salads",
    name: {
      ka: "ცეზარი ქათმით",
      en: "Caesar with Chicken",
      ru: "Цезарь с курицей",
    },
    price: 18.0,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p8",
    categoryId: "salads",
    name: {
      ka: "კიტრისა და პომიდვრის სალათი",
      en: "Cucumber & Tomato Salad",
      ru: "Салат из огурцов и помидоров",
    },
    price: 11.5,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p9",
    categoryId: "salads",
    name: {
      ka: "კიტრისა და პომიდვრის სალათი ნიგვზით",
      en: "Cucumber & Tomato with Walnuts",
      ru: "Салат с ореховой заправкой",
    },
    price: 14.0,
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p10",
    categoryId: "salads",
    name: {
      ka: "ბერძნული სალათი",
      en: "Greek Salad",
      ru: "Греческий салат",
    },
    price: 16.5,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop&q=80",
    available: true,
  },

  // მხალეული (mkhaleuli)
  {
    id: "p11",
    categoryId: "mkhaleuli",
    name: {
      ka: "ფხალის ასორტი",
      en: "Pkhali Assortment",
      ru: "Ассорти пхали",
    },
    price: 24.0,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p12",
    categoryId: "mkhaleuli",
    name: {
      ka: "ისპანახის ფხალი",
      en: "Spinach Pkhali",
      ru: "Пхали из шпината",
    },
    price: 12.0,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p13",
    categoryId: "mkhaleuli",
    name: {
      ka: "ბადრიჯანი ნიგვზით",
      en: "Eggplant with Walnut",
      ru: "Баклажаны с орехами",
    },
    price: 15.0,
    image: "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p14",
    categoryId: "mkhaleuli",
    name: {
      ka: "ჭარხლის ფხალი",
      en: "Beetroot Pkhali",
      ru: "Пхали из свеклы",
    },
    price: 11.0,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
    available: true,
  },

  // ცომეული (pastry)
  {
    id: "p15",
    categoryId: "pastry",
    name: {
      ka: "იმერული ხაჭაპური",
      en: "Imeretian Khachapuri",
      ru: "Имеретинский хачапури",
    },
    price: 16.0,
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p16",
    categoryId: "pastry",
    name: {
      ka: "მეგრული ხაჭაპური",
      en: "Megrelian Khachapuri",
      ru: "Мегрельский хачапури",
    },
    price: 19.5,
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p17",
    categoryId: "pastry",
    name: {
      ka: "აჭარული ხაჭაპური",
      en: "Adjaruli Khachapuri",
      ru: "Аджарский хачапури",
    },
    price: 18.0,
    image: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p18",
    categoryId: "pastry",
    name: {
      ka: "ლობიანი",
      en: "Lobiani",
      ru: "Лобиани",
    },
    price: 13.0,
    image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p19",
    categoryId: "pastry",
    name: {
      ka: "მჭადი (1 ცალი)",
      en: "Mchadi (Cornbread)",
      ru: "Мчади",
    },
    price: 3.0,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p20",
    categoryId: "pastry",
    name: {
      ka: "ჭვიშტარი (1 ცალი)",
      en: "Chvishtari (Cheese Cornbread)",
      ru: "Чвиштари",
    },
    price: 5.5,
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&auto=format&fit=crop&q=80",
    available: true,
  },

  // წვნიანი კერძები (soups)
  {
    id: "p21",
    categoryId: "soups",
    name: {
      ka: "ხარჩო საქონლის ხორცით",
      en: "Beef Kharcho Soup",
      ru: "Харчо из говядины",
    },
    price: 16.5,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p22",
    categoryId: "soups",
    name: {
      ka: "ჩიხირთმა",
      en: "Chikhirtma (Chicken Soup)",
      ru: "Чихиртма",
    },
    price: 14.0,
    image: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p23",
    categoryId: "soups",
    name: {
      ka: "სოკოს სუპი",
      en: "Mushroom Soup",
      ru: "Грибной суп",
    },
    price: 12.5,
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    available: true,
  },

  // ცხელი კერძები (hot-dishes)
  {
    id: "p24",
    categoryId: "hot-dishes",
    name: {
      ka: "ოჯახური ღორის ხორცით",
      en: "Ojakhuri with Pork",
      ru: "Оджахури со свининой",
    },
    price: 21.0,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p25",
    categoryId: "hot-dishes",
    name: {
      ka: "შქმერული",
      en: "Shkmeruli Garlic Chicken",
      ru: "Шкмерули",
    },
    price: 26.0,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p26",
    categoryId: "hot-dishes",
    name: {
      ka: "ჩაშუშული საქონლის",
      en: "Beef Chashushuli",
      ru: "Чашушули из телятины",
    },
    price: 23.5,
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p27",
    categoryId: "hot-dishes",
    name: {
      ka: "ქაბაბი შერეული",
      en: "Mixed Meat Kebab",
      ru: "Кебаб смешанный",
    },
    price: 15.0,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80",
    available: true,
  },

  // ხინკალი (khinkali)
  {
    id: "p28",
    categoryId: "khinkali",
    name: {
      ka: "ხინკალი ქალაქური (5 ცალი)",
      en: "Kalakuri Khinkali (5 pcs)",
      ru: "Хинкали городские (5 шт)",
    },
    price: 10.0,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p29",
    categoryId: "khinkali",
    name: {
      ka: "ხინკალი მთიულური (5 ცალი)",
      en: "Mtiuluri Khinkali (5 pcs)",
      ru: "Хинкали мтиулури (5 шт)",
    },
    price: 10.0,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p30",
    categoryId: "khinkali",
    name: {
      ka: "ხინკალი ყველით (5 ცალი)",
      en: "Cheese Khinkali (5 pcs)",
      ru: "Хинкали с сыром (5 шт)",
    },
    price: 11.5,
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p31",
    categoryId: "khinkali",
    name: {
      ka: "ხინკალი სოკოთი (5 ცალი)",
      en: "Mushroom Khinkali (5 pcs)",
      ru: "Хинкали с грибами (5 шт)",
    },
    price: 10.5,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    available: true,
  },

  // თევზეული (fish)
  {
    id: "p32",
    categoryId: "fish",
    name: {
      ka: "კალმახი შემწვარი",
      en: "Fried Trout",
      ru: "Форель жареная",
    },
    price: 22.0,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p33",
    categoryId: "fish",
    name: {
      ka: "ორაგულის სტეიკი",
      en: "Salmon Steak",
      ru: "Стейк из лосося",
    },
    price: 32.0,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80",
    available: true,
  },

  // სოუსები (sauces)
  {
    id: "p34",
    categoryId: "sauces",
    name: {
      ka: "ტყემალი წითელი",
      en: "Red Tkemali",
      ru: "Ткемали красный",
    },
    price: 4.0,
    image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p35",
    categoryId: "sauces",
    name: {
      ka: "საწებელი",
      en: "Satsebeli Sauce",
      ru: "Сацебели",
    },
    price: 4.0,
    image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
  {
    id: "p36",
    categoryId: "sauces",
    name: {
      ka: "აფხაზური აჯიკა",
      en: "Spicy Ajika",
      ru: "Абхазская аджика",
    },
    price: 3.5,
    image: "https://images.unsplash.com/photo-1514944298352-78d123a633ba?w=600&auto=format&fit=crop&q=80",
    available: true,
  },
];
