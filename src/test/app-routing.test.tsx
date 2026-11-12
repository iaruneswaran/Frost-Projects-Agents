import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { routeTree } from "@/routeTree.gen";
import { Route } from "@/routes/index";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("navigates to the Project Workspace on project click and returns to dashboard", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    // Verify initial home page state
    expect(screen.getByText("Autonomous Collaborative Projects")).toBeDefined();
    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    expect(projectCardBtn).toBeDefined();

    // Click project to enter Workspace UI
    fireEvent.click(projectCardBtn);

    // Verify Project Workspace UI elements (100% match with screenshot requirements)
    expect(screen.getByText("CEO Workspace")).toBeDefined();
    expect(screen.getByText("What is this project about?")).toBeDefined();
    expect(screen.getByText("What outcome would make this project worthwhile?")).toBeDefined();
    expect(screen.getByText("Help me define the idea")).toBeDefined();
    expect(screen.getByText("Attach a plan")).toBeDefined();
    expect(screen.getByText("ARUN PE")).toBeDefined();
    expect(screen.getByText("What I know")).toBeDefined();
    expect(screen.getByPlaceholderText("Reply, attach a file, or tap the mic to talk")).toBeDefined();

    // Click "Dashboard" in sidebar to return to the home page
    const dashboardBtn = screen.getByRole("button", { name: /dashboard/i });
    fireEvent.click(dashboardBtn);

    // Verify back on home page
    expect(screen.getByText("Autonomous Collaborative Projects")).toBeDefined();
  });
});
