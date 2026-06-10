import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoadingSpinner from "./components/common/LoadingSpinner";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const SearchPage    = lazy(() => import("./pages/SearchPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const AuthPage      = lazy(() => import("./pages/AuthPage"));
const AuthCallback  = lazy(() => import("./pages/AuthCallback"));
const NotFound      = lazy(() => import("./pages/NotFound"));

export default function App() {
  const location = useLocation();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner text="Loading page…" />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/"               element={<SearchPage />} />
                <Route path="/dashboard"      element={<DashboardPage />} />
                <Route path="/favorites"      element={<FavoritesPage />} />
                <Route path="/auth"           element={<AuthPage />} />
                <Route path="/auth/callback"  element={<AuthCallback />} />
                <Route path="*"               element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
