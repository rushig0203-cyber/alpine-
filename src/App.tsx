import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";

const ProjectsIndex = lazy(() => import("./pages/ProjectsIndex.tsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.tsx"));
const AstoniaExperience = lazy(() => import("./pages/AstoniaExperience.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

/** Anchor-less navigations should always land at the top of the new page. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
      Loading
    </span>
  </div>
);

/** Routes without a router, so tests can mount them in a MemoryRouter. */
export const AppRoutes = () => (
  <>
    <ScrollToTop />
    <ErrorBoundary
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Something went wrong.
          </h1>
          <p className="text-muted-foreground">
            Please reload the page, or call us on +91 84213 37090.
          </p>
          <a
            href="/"
            className="rounded-full bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-primary-foreground"
          >
            Back to home
          </a>
        </div>
      }
    >
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<ProjectsIndex />} />
          <Route
            path="/projects/alpine-astonia/experience"
            element={<AstoniaExperience />}
          />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
