import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import { checkAdminSession, logoutAdmin } from "../services/adminApi";
import { Loader2 } from "lucide-react";

export default function AdminRouter({ onBackToSite }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function verifyAuth() {
      try {
        const user = await checkAdminSession();
        if (isMounted) {
          setIsAuthenticated(!!user);
        }
      } catch (err) {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    }

    verifyAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-amber-300">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-amber-500" />
        <span className="text-xs uppercase tracking-widest font-semibold text-gray-400">
          ავტორიზაციის შემოწმება...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => setIsAuthenticated(true)}
        onBackToSite={onBackToSite}
      />
    );
  }

  return (
    <AdminDashboard
      onLogout={handleLogout}
      onBackToSite={onBackToSite}
    />
  );
}
