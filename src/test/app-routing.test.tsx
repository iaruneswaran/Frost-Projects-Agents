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
    expect(screen.getByAltText("Frost Atlas")).toBeDefined();
    expect(screen.getByText("Autonomous Collaborative Projects")).toBeDefined();

    // Verify main navigation has Home, Profile, Add Tokens, and Settings
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Home" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Profile" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Add Tokens" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Settings" })).toBeDefined();
    expect(screen.queryByRole("link", { name: "Advantages" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Career" })).toBeNull();

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
    expect(screen.getByRole("button", { name: "Back to Home" })).toBeDefined();

    // Click "Back to Home" in topbar to return to the home page
    const backBtn = screen.getByRole("button", { name: "Back to Home" });
    fireEvent.click(backBtn);

    // Verify back on home page
    expect(screen.getByText("Autonomous Collaborative Projects")).toBeDefined();

    // Re-enter workspace and test sidebar "Dashboard" navigation
    fireEvent.click(screen.getByText("Personal care brand enters South Asia’s smaller cities"));
    expect(screen.getByText("CEO Workspace")).toBeDefined();
    const dashboardBtn = screen.getByRole("button", { name: /^dashboard$/i });
    fireEvent.click(dashboardBtn);
    expect(screen.getByText("Autonomous Collaborative Projects")).toBeDefined();
  });

  it("renders badges in a single line with +1 round badge and expands on click", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    // Mentions "Agents" label above the badges
    expect(screen.getAllByText("Agents").length).toBeGreaterThan(0);

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
    expect(screen.getByText("Less")).toBeDefined();

    // Click Less to collapse
    fireEvent.click(screen.getByText("Less"));
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
    expect(screen.queryByText("Define agent identity, domain role persona, and primary mission goals")).toBeNull();
    expect(screen.getByRole("button", { name: "Back" })).toBeDefined();
    expect(screen.getByText("Agent Name")).toBeDefined();
    expect(screen.getByText("Agent Role")).toBeDefined();
    expect(screen.getByText("Invite Members")).toBeDefined();
    expect(screen.getByPlaceholderText("Member mail")).toBeDefined();
    expect(screen.getByRole("button", { name: "Add Users" })).toBeDefined();
    expect(screen.getByText("Members")).toBeDefined();
    expect(screen.getByText("Guy Hawkins")).toBeDefined();
    expect(screen.getByText("hello@deserve.studio")).toBeDefined();
    expect(screen.getByText("Theresa Webb")).toBeDefined();
    expect(screen.getByText("Darrell Steward")).toBeDefined();
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

  it("switches between Projects and Agents tabs and renders the 6 specified agents with Start chat", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    // Verify tabs exist
    const projectsTab = screen.getByRole("tab", { name: "Projects" });
    const agentsTab = screen.getByRole("tab", { name: "Agents" });
    expect(projectsTab).toBeDefined();
    expect(agentsTab).toBeDefined();

    // Default tab is Projects: projects are visible
    expect(screen.getByText("Personal care brand enters South Asia’s smaller cities")).toBeDefined();
    expect(screen.queryByText("SBI Customer KYC & Document Verification Agent")).toBeNull();

    // Click Agents tab
    fireEvent.click(agentsTab);

    // Verify all 6 exact agents are rendered
    expect(screen.getByText("SBI Customer KYC & Document Verification Agent")).toBeDefined();
    expect(
      screen.getByText(
        "Inspects and verifies uploaded customer documents (Aadhaar, PAN, Passport, DL) for authenticity, data extraction, and regulatory KYC compliance."
      )
    ).toBeDefined();

    expect(screen.getByText("SBI Home Loan Monthly Report")).toBeDefined();
    expect(
      screen.getByText(
        "Prepares monthly home-loan counts and disbursement totals for compliance review. Home loans only; excludes auto and land loans."
      )
    ).toBeDefined();

    expect(screen.getByText("SBI Auto Loan Monthly Report")).toBeDefined();
    expect(
      screen.getByText(
        "Compiles monthly auto-loan issuance totals for compliance review. Vehicle finance only; excludes home and land loans."
      )
    ).toBeDefined();

    expect(screen.getByText(/Apollo Hospital\s+Discharge Summary/i)).toBeDefined();
    expect(
      screen.getByText(
        "Prepares weekly inpatient discharge summaries for authorized hospital reviewers. Inpatient episodes only."
      )
    ).toBeDefined();

    expect(screen.getByText("SBI Land Loan Quarterly Report")).toBeDefined();
    expect(
      screen.getByText(
        "Prepares a quarterly land-loan portfolio summary for compliance review. Agricultural and commercial land loans only."
      )
    ).toBeDefined();

    expect(screen.getByText("AIIMS ICU Occupancy Report")).toBeDefined();
    expect(
      screen.getByText(
        "Prepares daily ICU occupancy and critical-care summaries for authorized hospital reviewers. ICU ward data only."
      )
    ).toBeDefined();

    // Verify Start chat buttons are removed and Edit actions are present with Last used info
    expect(screen.queryByRole("button", { name: /start chat/i })).toBeNull();
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    expect(editButtons.length).toBeGreaterThanOrEqual(6);
    expect(screen.getAllByText(/last used/i).length).toBeGreaterThanOrEqual(6);

    // Click Edit on the first agent to open agent editor
    fireEvent.click(editButtons[0]);
    expect(screen.getByText("Edit your agent")).toBeDefined();
    expect(screen.getByDisplayValue("SBI Customer KYC & Document Verification Agent")).toBeDefined();

    // Return to dashboard
    const backBtn = screen.getByRole("button", { name: "Back" });
    fireEvent.click(backBtn);
    expect(screen.getByText("Autonomous Collaborative Projects")).toBeDefined();

    // Click agent title link to open workspace
    const agentLink = screen.getByRole("button", { name: "SBI Customer KYC & Document Verification Agent" });
    fireEvent.click(agentLink);
    expect(screen.getByText("CEO Workspace")).toBeDefined();
    expect(screen.getAllByText("SBI Customer KYC & Document Verification Agent").length).toBeGreaterThan(0);

    // Return to dashboard
    const homeBtn = screen.getByRole("button", { name: "Back to Home" });
    fireEvent.click(homeBtn);
    expect(screen.getByText("Autonomous Collaborative Projects")).toBeDefined();

    // Switch back to Projects tab and verify original projects show
    const returnProjectsTab = screen.getByRole("tab", { name: "Projects" });
    fireEvent.click(returnProjectsTab);
    expect(screen.getByText("Personal care brand enters South Asia’s smaller cities")).toBeDefined();
  });
});
