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

  it("renders badges in a single line with +1 round badge and expands on click", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    // Initial 3 badges are visible
    expect(screen.getByText("Emerging Markets")).toBeDefined();
    expect(screen.getByText("Customer Dynamics")).toBeDefined();
    expect(screen.getByText("Geographic Expansion")).toBeDefined();

    // Round badge +1 is rendered for the 4th badge
    const plusOneBtn = screen.getByText("+1");
    expect(plusOneBtn).toBeDefined();

    // 4th badge is initially not visible
    expect(screen.queryByText("Distribution Channel Optimisation")).toBeNull();

    // Click +1 round badge to expand bottom
    fireEvent.click(plusOneBtn);

    // 4th badge is now visible below
    expect(screen.getByText("Distribution Channel Optimisation")).toBeDefined();
    expect(screen.getByText("−")).toBeDefined();

    // Click minus to collapse
    fireEvent.click(screen.getByText("−"));
    expect(screen.queryByText("Distribution Channel Optimisation")).toBeNull();
    expect(screen.getByText("+1")).toBeDefined();
  });

  it("navigates through the 3-step dark Create Agent wizard and returns to dashboard", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    // Click "Create Agent" on the hero tile
    const createAgentTileBtn = screen.getByRole("button", { name: /create agent/i });
    fireEvent.click(createAgentTileBtn);

    // Verify Stepper navigation capsule exists
    expect(screen.getByRole("navigation", { name: "Creation Steps" })).toBeDefined();
    expect(screen.getByRole("button", { name: "1 Agent Identity" })).toBeDefined();
    expect(screen.getByRole("button", { name: "2 Scope & Variables" })).toBeDefined();
    expect(screen.getByRole("button", { name: "3 Review & Submit" })).toBeDefined();

    // Verify Step 1: Agent Identity
    expect(screen.getByRole("heading", { level: 1, name: "Create your agent" })).toBeDefined();
    expect(screen.getByText("Agent Name")).toBeDefined();
    expect(screen.getByText("Agent Role")).toBeDefined();
    expect(screen.getByText("Primary Goal")).toBeDefined();
    expect(screen.getByText("Project Context")).toBeDefined();

    // Fill required fields in Step 1
    const nameInput = screen.getByPlaceholderText("e.g. Emerging Markets Strategist");
    const roleInput = screen.getByPlaceholderText("e.g. Lead Market Research & Geographic Expansion Specialist");
    fireEvent.change(nameInput, { target: { value: "Consumer Intelligence Specialist" } });
    fireEvent.change(roleInput, { target: { value: "Qualitative Data Lead" } });

    // Click Continue to go to Step 2
    const step1ContinueBtn = screen.getByRole("button", { name: "Continue" });
    fireEvent.click(step1ContinueBtn);

    // Verify Step 2: Scope & Variables
    expect(screen.getByRole("heading", { level: 1, name: "Configure capabilities" })).toBeDefined();
    expect(screen.getByText("Responsibilities")).toBeDefined();
    expect(screen.getByText("Research Variables")).toBeDefined();
    expect(screen.getByText("Expected Deliverables")).toBeDefined();
    expect(screen.getByText("Knowledge Sources")).toBeDefined();
    expect(screen.getByRole("button", { name: "Add" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Add Variable" })).toBeDefined();

    // Click Continue to go to Step 3
    const step2ContinueBtn = screen.getByRole("button", { name: "Continue" });
    fireEvent.click(step2ContinueBtn);

    // Verify Step 3: Review & Submit
    expect(screen.getByRole("heading", { level: 1, name: "Review & launch instructions" })).toBeDefined();
    expect(screen.getByText("Working Instructions")).toBeDefined();
    expect(screen.getByText("Constraints")).toBeDefined();
    expect(screen.getByText("Collaboration")).toBeDefined();
    expect(screen.getByText("Test Prompt")).toBeDefined();

    // Verify summary card contains agent name
    expect(screen.getByText("Consumer Intelligence Specialist")).toBeDefined();
    expect(screen.getByText("Qualitative Data Lead")).toBeDefined();

    // Submit Create Agent form
    const submitBtn = screen.getByRole("button", { name: "Create Agent" });
    fireEvent.click(submitBtn);

    // Returns back to dashboard
    expect(screen.getByText("Autonomous Collaborative Projects")).toBeDefined();
    expect(screen.getByText("4")).toBeDefined();
  });
});
