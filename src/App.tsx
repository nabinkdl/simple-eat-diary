import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { MealsProvider } from "./contexts/MealsContext";
import { RequireAuth } from "./components/RequireAuth";
import { lazy, Suspense } from "react";
import { PageLoader } from "./components/PageLoader";
import { PWAInstallBanner } from "./components/PWAInstallBanner";

// Lazy Load Pages
const TodayPage = lazy(() => import("./pages/TodayPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

const App = () => (
  <AuthProvider>
    <SettingsProvider>
      <MealsProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Sonner />
            <PWAInstallBanner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<Navigate to="/dashboard/history" replace />} />

                  <Route path="/dashboard" element={
                    <RequireAuth>
                      <Layout />
                    </RequireAuth>
                  }>
                    <Route index element={<CalendarPage />} />
                    <Route path="history" element={<TodayPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </MealsProvider>
    </SettingsProvider>
  </AuthProvider>
);

export default App;
