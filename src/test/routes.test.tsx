import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AppRoutes } from "@/App";
import ProjectDetail from "@/pages/ProjectDetail";
import ProjectsIndex from "@/pages/ProjectsIndex";
import { projects } from "@/data/projects";

/**
 * Route smoke tests: every public URL must render without throwing, even with
 * no WebGL, no Supabase env and no external asset host.
 */
describe("routes", () => {
  it("renders the landing page", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: /A collection of/i })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: /landmarks/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: /Alpine Astonia\./i })).toBeInTheDocument();
  });

  it("renders the projects index with every project", () => {
    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <ProjectsIndex />
      </MemoryRouter>,
    );
    projects.forEach((p) => {
      expect(screen.getAllByText(p.name).length).toBeGreaterThan(0);
    });
  });

  it("renders a project detail page for every slug", () => {
    projects.forEach((project) => {
      const { unmount } = render(
        <MemoryRouter initialEntries={[`/projects/${project.slug}`]}>
          <Routes>
            <Route path="/projects/:slug" element={<ProjectDetail />} />
          </Routes>
        </MemoryRouter>,
      );
      expect(screen.getAllByText(project.name).length).toBeGreaterThan(0);
      unmount();
    });
  });

  it("shows a branded fallback for an unknown project slug", () => {
    render(
      <MemoryRouter initialEntries={["/projects/does-not-exist"]}>
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText(/isn't ours/i)).toBeInTheDocument();
  });

  it("renders the 404 page for unknown routes", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <MemoryRouter initialEntries={["/nope"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(await screen.findByText(/Off the plan/i)).toBeInTheDocument();
    warn.mockRestore();
  });
});
