import { API_BASE_URL } from "./api";

const TOKEN_KEY = "staropub_admin_token";

export function getAdminToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setAdminToken(token, remember = true) {
  try {
    if (token) {
      if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        sessionStorage.setItem(TOKEN_KEY, token);
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
    }
  } catch {}
}

export function clearAdminToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {}
}

function getAuthHeaders(isJson = true) {
  const headers = {};
  const token = getAdminToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

// ─── Authentication Endpoints ───────────────────────────────────────────────

export async function loginAdmin({ email, password, rememberMe = true }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), password, rememberMe }),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "ავტორიზაცია ვერ მოხერხდა");
  }
  if (data.token) {
    setAdminToken(data.token, rememberMe);
  }
  return data;
}

export async function registerAdmin({ email, password }) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), password }),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "რეგისტრაცია ვერ მოხერხდა");
  }
  if (data.token) {
    setAdminToken(data.token, true);
  }
  return data;
}

export async function socialLoginAdmin(idToken) {
  const res = await fetch(`${API_BASE_URL}/auth/social-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: idToken }),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "სოციალური ავტორიზაცია ვერ მოხერხდა");
  }
  if (data.token) {
    setAdminToken(data.token, true);
  }
  return data;
}

export async function checkAdminSession() {
  const token = getAdminToken();
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers,
    credentials: "include"
  });

  if (!res.ok) {
    // If unauthorized, clear invalid local token
    clearAdminToken();
    return null;
  }
  return await res.json();
}

export async function logoutAdmin() {
  clearAdminToken();
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include"
    });
  } catch {}
  return true;
}

// ─── Categories Management (CRUD) ──────────────────────────────────────────

export async function fetchAdminCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("კატეგორიების ჩატვირთვა ვერ მოხერხდა");
  return await res.json();
}

export async function createCategory(formDataOrObject) {
  const isFormData = formDataOrObject instanceof FormData;
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: getAuthHeaders(!isFormData),
    body: isFormData ? formDataOrObject : JSON.stringify(formDataOrObject),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "კატეგორიის დამატება ვერ მოხერხდა");
  return data;
}

export async function updateCategory(id, formDataOrObject) {
  const isFormData = formDataOrObject instanceof FormData;
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(!isFormData),
    body: isFormData ? formDataOrObject : JSON.stringify(formDataOrObject),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "კატეგორიის განახლება ვერ მოხერხდა");
  return data;
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(true),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "კატეგორიის წაშლა ვერ მოხერხდა");
  return data;
}

export async function reorderCategories(ids) {
  const res = await fetch(`${API_BASE_URL}/categories/reorder`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ ids, order: ids }),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "კატეგორიების რიგითობის განახლება ვერ მოხერხდა");
  return data;
}

// ─── Dishes / Products Management (CRUD) ───────────────────────────────────

export async function fetchAdminDishes() {
  const res = await fetch(`${API_BASE_URL}/dishes`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("კერძების ჩატვირთვა ვერ მოხერხდა");
  return await res.json();
}

export async function createDish(formDataOrObject) {
  const isFormData = formDataOrObject instanceof FormData;
  const res = await fetch(`${API_BASE_URL}/dishes`, {
    method: "POST",
    headers: getAuthHeaders(!isFormData),
    body: isFormData ? formDataOrObject : JSON.stringify(formDataOrObject),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "კერძის დამატება ვერ მოხერხდა");
  return data;
}

export async function updateDish(id, formDataOrObject) {
  const isFormData = formDataOrObject instanceof FormData;
  const res = await fetch(`${API_BASE_URL}/dishes/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(!isFormData),
    body: isFormData ? formDataOrObject : JSON.stringify(formDataOrObject),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "კერძის განახლება ვერ მოხერხდა");
  return data;
}

export async function deleteDish(id) {
  const res = await fetch(`${API_BASE_URL}/dishes/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(true),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "კერძის წაშლა ვერ მოხერხდა");
  return data;
}

export async function reorderDishes(ids) {
  const res = await fetch(`${API_BASE_URL}/dishes/reorder`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ ids, order: ids }),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "კერძების რიგითობის განახლება ვერ მოხერხდა");
  return data;
}

// ─── Settings & Working Hours ──────────────────────────────────────────────

export async function fetchAdminSettings() {
  const res = await fetch(`${API_BASE_URL}/settings`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("პარამეტრების ჩატვირთვა ვერ მოხერხდა");
  return await res.json();
}

export async function updateAdminSettings(settingsObj) {
  const res = await fetch(`${API_BASE_URL}/settings`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(settingsObj),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "პარამეტრების განახლება ვერ მოხერხდა");
  return data;
}

// ─── Direct Image Upload (Cloudinary) ──────────────────────────────────────

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: getAuthHeaders(false),
    body: formData,
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "სურათის ატვირთვა ვერ მოხერხდა");
  return data.url;
}
