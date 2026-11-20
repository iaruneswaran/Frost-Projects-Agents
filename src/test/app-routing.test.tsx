import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, act } from "@testing-library/react";

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

    // Verify main navigation has Home, Packs, and Settings
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Home" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Packs" })).toBeDefined();
    expect(screen.queryByRole("link", { name: "Profile" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Add Tokens" })).toBeNull();
    expect(screen.getByRole("link", { name: "Settings" })).toBeDefined();
    expect(screen.queryByRole("link", { name: "Advantages" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Career" })).toBeNull();

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    expect(projectCardBtn).toBeDefined();

    // Click project to enter Workspace UI
    fireEvent.click(projectCardBtn);

    // Verify Project Workspace UI elements (shows greeting start screen on project click)
    expect(screen.getByText("CEO Workspace")).toBeDefined();
    expect(screen.getAllByText(/Personal care brand enters South Asia’s smaller cities/i).length).toBeGreaterThan(0);
    expect(screen.getByText("What would you like to work on next?")).toBeDefined();
    expect(screen.getByText("Your project details are ready. We can review the score or explore a decision.")).toBeDefined();
    expect(screen.getByText("Reply below, or choose where to pick up.")).toBeDefined();

    // Verify menu items on details page: New chat, Saved insights, Library, Knowledge packs, Data sources
    expect(screen.getByRole("button", { name: "New chat" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Saved insights" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Library" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Knowledge packs" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Data sources" })).toBeDefined();

    // Verify clicking New chat reveals the project starter prompts
    const newChatBtn = screen.getByRole("button", { name: /new chat/i });
    fireEvent.click(newChatBtn);
    expect(screen.getByText("What would you like to work on next?")).toBeDefined();
    expect(screen.getByText("Your project details are ready. We can review the score or explore a decision.")).toBeDefined();
    expect(screen.getByText("Reply below, or choose where to pick up.")).toBeDefined();
    expect(screen.queryByText("Good to see you, Arun.")).toBeNull();
    // Verify prompt action buttons
    expect(screen.queryByText("Make Diwali your own")).toBeNull();
    expect(screen.getByText("Help me define the idea")).toBeDefined();
    expect(screen.getByText("Attach a plan")).toBeDefined();
    expect(screen.getByText("Define Your Vision")).toBeDefined();
    expect(screen.getByText("ARUN PE")).toBeDefined();
    expect(screen.getByRole("button", { name: "Settings" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Theme toggle" })).toBeDefined();
    expect(screen.queryByText(/^Go$/)).toBeNull();
    expect(screen.getByText("What I know")).toBeDefined();
    expect(screen.getByPlaceholderText("Reply, attach a file, or tap the mic to talk")).toBeDefined();
    // Verify Claim offer, Back to Home, and Dashboard buttons are removed
    expect(screen.queryByText("Claim offer")).toBeNull();
    expect(screen.queryByText("Back to Home")).toBeNull();
    expect(screen.queryByText("Dashboard")).toBeNull();

    // Click CEO Workspace return button in sidebar to return to the home page
    const backBtn = screen.getByRole("button", { name: "Return to Dashboard" });
    fireEvent.click(backBtn);

    // Verify back on home page
    expect(screen.getByText("Autonomous Collaborative Projects")).toBeDefined();

    // Re-enter workspace and test Return to Dashboard navigation
    fireEvent.click(screen.getByText("Personal care brand enters South Asia’s smaller cities"));
    expect(screen.getByText("CEO Workspace")).toBeDefined();
    const returnDashboardBtn = screen.getByRole("button", { name: "Return to Dashboard" });
    fireEvent.click(returnDashboardBtn);
    expect(screen.getByText("Autonomous Collaborative Projects")).toBeDefined();
  }, 25000);

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
    expect(screen.queryByText("Define agent identity, domain role persona, and primary mission goals")).toBeNull();
    expect(screen.getByRole("button", { name: "Back" })).toBeDefined();
    expect(screen.getByText("Agent Name")).toBeDefined();
    expect(screen.getByText("Agent Role")).toBeDefined();
    // Verify Invite Members and Members section has been removed
    expect(screen.queryByText("Invite Members")).toBeNull();
    expect(screen.queryByPlaceholderText("Member mail")).toBeNull();
    expect(screen.queryByRole("button", { name: "Add Users" })).toBeNull();
    expect(screen.queryByText("Guy Hawkins")).toBeNull();
    expect(screen.queryByText("Theresa Webb")).toBeNull();
    expect(screen.queryByText("Darrell Steward")).toBeNull();
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
    expect(screen.queryByText("Customer Persona & Demographic Intelligence Agent")).toBeNull();

    // Click Agents tab
    fireEvent.click(agentsTab);

    // Verify all 6 exact agents are rendered
    expect(screen.getByText("Customer Persona & Demographic Intelligence Agent")).toBeDefined();
    expect(
      screen.getByText(
        "Analyzes customer demographic cohorts, regional purchasing patterns, and buyer persona profiles across secondary urban corridors."
      )
    ).toBeDefined();

    expect(screen.getByText("Market Sizing & Growth Opportunity Forecasting Agent")).toBeDefined();
    expect(
      screen.getByText(
        "Evaluates regional total addressable market (TAM), category CAGR, and market expansion opportunities across secondary urban hubs."
      )
    ).toBeDefined();

    expect(screen.getByText("Competitive Pricing & Channel Intelligence Agent")).toBeDefined();
    expect(
      screen.getByText(
        "Monitors competitive pricing dynamics, trade margin structures, and distributor channel velocity across regional markets."
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
    expect(screen.getByDisplayValue("Customer Persona & Demographic Intelligence Agent")).toBeDefined();

    // Return to dashboard
    const backBtn = screen.getByRole("button", { name: "Back" });
    fireEvent.click(backBtn);
    expect(screen.getByText("Autonomous Collaborative Projects")).toBeDefined();

    // Click agent title link to open initial KYC document upload step
    const agentLink = screen.getByRole("button", { name: "Customer Persona & Demographic Intelligence Agent" });
    fireEvent.click(agentLink);
    expect(screen.getByText("SBI Customer KYC & Document Verification")).toBeDefined();
    expect(screen.getByText("Customer Identification Documents")).toBeDefined();
    expect(screen.getByRole("button", { name: /verify document/i })).toBeDefined();

    // Click Verify Document
    fireEvent.click(screen.getByRole("button", { name: /verify document/i }));

    // Return to dashboard
    const backToAgentsBtn = screen.getByRole("button", { name: /^back$/i });
    fireEvent.click(backToAgentsBtn);
    expect(screen.getByText("Autonomous Collaborative Projects")).toBeDefined();

    // Switch back to Projects tab and verify original projects show
    const returnProjectsTab = screen.getByRole("tab", { name: "Projects" });
    fireEvent.click(returnProjectsTab);
    expect(screen.getByText("Personal care brand enters South Asia’s smaller cities")).toBeDefined();
  });

  it("expands only the clicked project in the sidebar to show its inside chats list", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    // Click project to enter Workspace UI
    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    expect(screen.getByText("CEO Workspace")).toBeDefined();

    // Initially, Personal care brand is the active project and expanded
    expect(screen.getByText("Tier-2 Market Penetration Strategy")).toBeDefined();
    expect(screen.queryByText("Wedding")).toBeNull();

    // Click Customer Dynamics in the sidebar
    const customerDynamicsBtn = screen.getByRole("button", { name: /^Customer Dynamics: who is buying, and why$/i });
    fireEvent.click(customerDynamicsBtn);

    // Customer Dynamics is now expanded with its subchats
    expect(screen.getByText("Buyer Segments & Purchase Drivers")).toBeDefined();
    // Personal care brand subchats are now collapsed
    expect(screen.queryByText("Tier-2 Market Penetration Strategy")).toBeNull();

    // Click Tech-Enabled Go-to-Market Roadmap in the sidebar
    const gtmBtn = screen.getByRole("button", { name: /^Tech-Enabled Go-to-Market Roadmap$/i });
    fireEvent.click(gtmBtn);

    // GTM subchats are now expanded
    expect(screen.getByText("Sales Technology Integration")).toBeDefined();
    // Customer Dynamics subchats are now collapsed
    expect(screen.queryByText("Buyer Segments & Purchase Drivers")).toBeNull();
  });

  it("renders the 6 projects on the home page and ensures Wedding project is removed", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    // Verify all 6 projects are present on the home page
    expect(screen.queryByRole("heading", { name: "Wedding" })).toBeNull();
    expect(screen.queryByText("Wedding")).toBeNull();
    expect(screen.queryByText("South Indian Wedding Design")).toBeNull();
    expect(screen.queryByText("South Indian Background Redesign")).toBeNull();

    expect(screen.getByText("Personal care brand enters South Asia’s smaller cities")).toBeDefined();
    expect(screen.getByText("Customer Dynamics: who is buying, and why")).toBeDefined();
    expect(screen.getByText("Competitive Benchmark & Positioning")).toBeDefined();
    expect(screen.getByText("Tech-Enabled Go-to-Market Roadmap")).toBeDefined();
    expect(screen.getByText("Untitled project")).toBeDefined();
    expect(screen.getByText(/Expand Enterprise Account/i)).toBeDefined();

    // Click project card to open CEO Workspace
    const projectCard = screen.getByRole("button", { name: "Personal care brand enters South Asia’s smaller cities" });
    fireEvent.click(projectCard);

    // Verify workspace is opened
    expect(screen.getByText("CEO Workspace")).toBeDefined();
    expect(screen.getAllByText("Personal care brand enters South Asia’s smaller cities").length).toBeGreaterThan(0);
  });

  it("renders Attach button on left side of typing field and keeps send button only on right, with voice mode moved to action button", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    // Click project to enter Workspace UI
    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Verify Attach button is present on the left of dock with 18px icon
    const attachBtn = screen.getByRole("button", { name: "Attach file" });
    expect(attachBtn).toBeDefined();
    const attachSvg = attachBtn.querySelector("svg");
    expect(attachSvg?.getAttribute("style") || "").toContain("18px");

    // Verify Think button and Mic button are removed
    expect(screen.queryByRole("button", { name: /deep thinking/i })).toBeNull();
    expect(screen.queryByRole("button", { name: "Voice input" })).toBeNull();

    // Verify typing field right actions has ONLY the send button
    expect(screen.getByRole("button", { name: "Send message" })).toBeDefined();
    const rightActions = document.querySelector(".chatgpt-dock-right-actions");
    expect(rightActions?.querySelectorAll("button").length).toBe(1);

    // Verify Voice Mode round action button is rendered in workspace-actions instead of Attach a plan
    const voiceBtn = screen.getByRole("button", { name: /voice mode/i });
    expect(voiceBtn).toBeDefined();
    expect(voiceBtn.classList.contains("workspace-voice-btn")).toBe(true);

    // Click voice button: toggles wave animation and opens vision modal
    fireEvent.click(voiceBtn);
    expect(document.querySelector(".voice-wave-anim")).not.toBeNull();
    expect(screen.getByText("Talk About Your Vision")).toBeDefined();

    // Click again: toggles off wave animation and closes vision modal
    const stopVoiceBtn = screen.getByRole("button", { name: /stop voice mode/i });
    fireEvent.click(stopVoiceBtn);
    expect(document.querySelector(".voice-wave-anim")).toBeNull();
    expect(screen.queryByText("Talk About Your Vision")).toBeNull();
  }, 15000);

  it("renders back navigation first in the collapsed rail followed by collapse icon without circle", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    // Click project to enter Workspace UI
    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Collapse sidebar
    const closeSidebarBtn = screen.getByRole("button", { name: "Close sidebar" });
    fireEvent.click(closeSidebarBtn);

    // In collapsed rail, back navigation and open sidebar exist
    expect(screen.getAllByRole("button", { name: "Return to Dashboard" }).length).toBe(2);
    expect(screen.getByRole("button", { name: "Open sidebar" })).toBeDefined();

    // Re-open sidebar
    const openSidebarBtn = screen.getByRole("button", { name: "Open sidebar" });
    fireEvent.click(openSidebarBtn);

    // Expanded sidebar is back
    expect(screen.getByText("CEO Workspace")).toBeDefined();
  });

  it("renders messages matching the conversation screenshot with user bubble and verifies AI action bar is removed", async () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    // Click project to enter Workspace UI
    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Send a message
    const input = screen.getByPlaceholderText("Reply, attach a file, or tap the mic to talk");
    fireEvent.change(input, { target: { value: "hi how are you" } });
    const sendBtn = screen.getByRole("button", { name: "Send message" });
    fireEvent.click(sendBtn);

    // User message is in the document
    expect(screen.getByText("hi how are you")).toBeDefined();

    // Fast-forward / wait for AI reply
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
    });

    // Verify AI response action bar icons are removed everywhere
    expect(screen.queryByRole("button", { name: "Copy" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Good response" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Bad response" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Read aloud" })).toBeNull();
  });

  it("triggers actions when clicking Help me define the idea", async () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Click New chat to reveal starter prompt
    const newChatBtn = screen.getByRole("button", { name: /new chat/i });
    fireEvent.click(newChatBtn);

    const defineIdeaBtn = screen.getByRole("button", { name: /help me define the idea/i });
    expect(defineIdeaBtn).toBeDefined();

    fireEvent.click(defineIdeaBtn);

    expect(screen.getAllByText("Help me define the idea").length).toBeGreaterThan(0);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
    });

    expect(
      screen.getByText(/Let's define the core objective of this project to start building the business case/i)
    ).toBeDefined();

    // Verify answer is wrapped inside stroke box with 4 outcome options
    const strokeBox = document.querySelector(".ai-stroke-box");
    expect(strokeBox).not.toBeNull();
    expect(strokeBox?.textContent).toContain("What primary outcome do you want to achieve with this project?");
    expect(screen.getByText("Accelerate enterprise revenue growth")).toBeDefined();
    expect(screen.getByText("Automate key operational processes")).toBeDefined();
    expect(screen.getByText("Launch a new AI product or platform")).toBeDefined();
    expect(screen.getByText("Expand into a new target market")).toBeDefined();
    expect(screen.getByText("Or in your own words")).toBeDefined();
    expect(screen.getByPlaceholderText("Type your answer and press Enter")).toBeDefined();

    // Verify after conversation start, greeting and starter actions are hidden
    expect(screen.queryByText("What would you like to work on next?")).toBeNull();
    expect(screen.queryByText("Your project details are ready. We can review the score or explore a decision.")).toBeNull();
    expect(screen.queryByText("Reply below, or choose where to pick up.")).toBeNull();
    expect(screen.queryByRole("button", { name: "Attach a plan" })).toBeNull();
  });

  it("slides in the right-side What I know so far panel on click without popup", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Customer Dynamics: who is buying, and why");
    fireEvent.click(projectCardBtn);

    const whatIKnowBtn = screen.getByRole("button", { name: "What I know" });
    expect(whatIKnowBtn).toBeDefined();

    // Click to open right-side slide panel
    fireEvent.click(whatIKnowBtn);

    expect(screen.getByText("What I know so far")).toBeDefined();
    expect(screen.getByText("Waiting on you")).toBeDefined();
    expect(screen.getByText(/not scored yet/i)).toBeDefined();
    expect(screen.getByText("Core facts known")).toBeDefined();
    expect(screen.getByText("0 of 6 core facts")).toBeDefined();
    expect(screen.getByText("Goal")).toBeDefined();
    expect(screen.getAllByText("Not yet").length).toBe(6);
    expect(screen.queryByRole("button", { name: "Edit project score" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Edit core facts" })).toBeNull();
    expect(document.querySelectorAll(".knowledge-item-edit-btn").length).toBe(6);
    expect(screen.getByText("Still to learn")).toBeDefined();
    expect(screen.getByText("Who it's for")).toBeDefined();
    expect(screen.getByText("Investment")).toBeDefined();
    expect(screen.getByText("Expected annual impact")).toBeDefined();
    expect(screen.getByText("Target date")).toBeDefined();
    expect(screen.getByText("Delivery owner")).toBeDefined();

    // Verify outer one is removed while panel is open to avoid repetition
    expect(screen.queryByRole("button", { name: "What I know" })).toBeNull();

    // Click close button
    const closeBtn = screen.getByRole("button", { name: "Close panel" });
    fireEvent.click(closeBtn);

    // Verify panel closed and outer button restored
    expect(screen.queryByLabelText("What I know so far")).toBeNull();
    expect(screen.getByRole("button", { name: "What I know" })).toBeDefined();
  });

  it("navigates directly to AI chat page with 'what's on your mind' copy when clicking Create Project on hero tile without popup", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const createProjectBtn = screen.getByRole("button", { name: /create project/i });
    expect(createProjectBtn).toBeDefined();

    // Click Create Project on hero tile
    fireEvent.click(createProjectBtn);

    // Verify navigates directly into AI chat page
    expect(screen.getByText("CEO Workspace")).toBeDefined();

    // Verify conversational prompt asking what project is on their mind
    expect(screen.getByText("Hey Arun, what project is on your mind?")).toBeDefined();
    expect(
      screen.getByText(/Tell me what you'd like to build, and we'll assemble the right agents/i)
    ).toBeDefined();

    // Verify action buttons
    expect(screen.getByText("Help me define the idea")).toBeDefined();
    expect(screen.getByText("Attach a plan")).toBeDefined();
    expect(screen.getByText("Define Your Vision")).toBeDefined();

    // Verify right-side agents drawer is NOT open on Create Project
    expect(document.querySelector(".workspace-agents-drawer")).toBeNull();
  });

  it("renders folder icon only for all projects in the sidebar list", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Verify all specified projects are present in the sidebar
    expect(screen.queryByText("Wedding")).toBeNull();
    expect(screen.getAllByText("Personal care brand enters South Asia’s smaller cities").length).toBeGreaterThan(0);
    expect(screen.getByText("Customer Dynamics: who is buying, and why")).toBeDefined();
    expect(screen.getByText("Competitive Benchmark & Positioning")).toBeDefined();
    expect(screen.getByText("Tech-Enabled Go-to-Market Roadmap")).toBeDefined();
    expect(screen.getByText("Untitled project")).toBeDefined();
    expect(screen.getByText("Expand Enterprise Account")).toBeDefined();

    // Verify all 5 other project folder rows render lucide-folder
    const folderButtons = document.querySelectorAll(".chatgpt-folder-row");
    expect(folderButtons.length).toBe(5);
    folderButtons.forEach((btn) => {
      const svg = btn.querySelector("svg");
      expect(svg).not.toBeNull();
      expect(svg?.classList.contains("lucide-folder")).toBe(true);
    });
  });

  it("renders unwrapped outer What I know button with 24px above padding and #1e4b8d blue color on outer button only", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Verify outer What I know button
    const whatIKnowBtn = screen.getByRole("button", { name: "What I know" });
    expect(whatIKnowBtn).toBeDefined();
    expect(whatIKnowBtn.classList.contains("chatgpt-what-i-know-btn")).toBe(true);

    // Open knowledge panel to check inner header
    fireEvent.click(whatIKnowBtn);
    const innerTitle = screen.getByText("What I know so far");
    expect(innerTitle).toBeDefined();
    expect(innerTitle.classList.contains("knowledge-panel-title")).toBe(true);
  });

  it("shows project main conversation when selecting in menu, keeps project active, and starts new chat under that project", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Customer Dynamics: who is buying, and why");
    fireEvent.click(projectCardBtn);

    // Verify current project's chats are listed under Chats
    expect(screen.getByText("Buyer Segments & Purchase Drivers")).toBeDefined();

    // Verify canned bot monologues ("workspace active...") are removed
    expect(screen.queryByText(/Customer Dynamics workspace active/i)).toBeNull();
    expect(screen.queryByText(/Collaborative agents \(Customer Segmentation, Purchase Drivers, Channel Behaviour\)/i)).toBeNull();

    // Verify clean conversation starter is displayed
    expect(screen.getByText("What would you like to work on next?")).toBeDefined();
    expect(screen.getByText("Your project details are ready. We can review the score or explore a decision.")).toBeDefined();
    expect(screen.getByText("Reply below, or choose where to pick up.")).toBeDefined();
    expect(screen.getByText("Help me define the idea")).toBeDefined();
    expect(screen.getByText("Attach a plan")).toBeDefined();
    expect(screen.getByText("Define Your Vision")).toBeDefined();

    // Click New chat in sidebar
    const newChatBtn = screen.getByRole("button", { name: /new chat/i });
    fireEvent.click(newChatBtn);

    // Verify new chat content under project
    expect(screen.getByText("What would you like to work on next?")).toBeDefined();
    expect(screen.getByText("Your project details are ready. We can review the score or explore a decision.")).toBeDefined();
    expect(screen.getByText("Reply below, or choose where to pick up.")).toBeDefined();
    expect(screen.getByText("Help me define the idea")).toBeDefined();
    expect(screen.getByText("Attach a plan")).toBeDefined();
    expect(screen.getByText("Define Your Vision")).toBeDefined();
  });

  it("shows already done mock conversation with primary outcome options in stroke box for Personal care brand", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Click subchat under Chats to view main conversation
    const chatBtn = screen.getByText("Tier-2 Market Penetration Strategy");
    fireEvent.click(chatBtn);

    // Verify mock conversation messages are rendered
    expect(screen.getAllByText(/Personal care brand enters South Asia’s smaller cities/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/What primary outcome do you want to achieve with this project\?/i)).toBeDefined();

    // Verify menu items on details page: New chat, Saved insights, Library, Knowledge packs, Data sources
    expect(screen.getByRole("button", { name: "New chat" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Saved insights" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Library" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Knowledge packs" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Data sources" })).toBeDefined();
    expect(screen.getByText(/Launch a new AI product or service/i)).toBeDefined();
    expect(screen.getByText(/Automate internal operations & reduce costs/i)).toBeDefined();
    expect(screen.getAllByText(/Expand into a new customer segment or region/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Accelerate enterprise sales & revenue growth/i)).toBeDefined();
    expect(screen.getByText(/Or in your own words/i)).toBeDefined();
    expect(screen.getByText(/Type your answer and press Enter/i)).toBeDefined();

    // Verify AI options response is wrapped in a stroke box with interactive outcome buttons
    const strokeBoxes = document.querySelectorAll(".ai-stroke-box");
    expect(strokeBoxes.length).toBeGreaterThan(0);
    const optionBtns = document.querySelectorAll(".ai-outcome-option-btn");
    expect(optionBtns.length).toBe(4);

    // Select an outcome option to give input
    const expandOption = screen.getAllByText("Expand into a new customer segment or region")[0].closest("button");
    if (expandOption) fireEvent.click(expandOption);

    // Verify selection feel and selected state
    const selectedBtn = document.querySelector(".ai-outcome-option-btn--selected");
    expect(selectedBtn).not.toBeNull();
    expect(selectedBtn?.textContent).toContain("Expand into a new customer segment or region");
    expect(document.querySelectorAll(".ai-outcome-radio").length).toBe(4);

    // Verify clicking another outcome switches the selection
    const launchOption = screen.getByText("Launch a new AI product or service").closest("button");
    if (launchOption) fireEvent.click(launchOption);
    expect(launchOption?.classList.contains("ai-outcome-option-btn--selected")).toBe(true);
  });

  it("creates a new chat under the selected project when clicking New chat and updates title on message send", async () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Click New chat
    const newChatBtn = screen.getByRole("button", { name: /new chat/i });
    fireEvent.click(newChatBtn);

    // Verify a new chat item is created under the selected project
    const subchatItems = document.querySelectorAll(".chatgpt-subchat-item");
    expect(subchatItems.length).toBeGreaterThan(3);
    const activeSubchat = document.querySelector(".chatgpt-subchat-item.active");
    expect(activeSubchat).not.toBeNull();
    expect(activeSubchat?.textContent).toContain("New chat");

    // Click Help me define the idea
    const defineIdeaBtn = screen.getByRole("button", { name: /help me define the idea/i });
    fireEvent.click(defineIdeaBtn);

    // Verify subchat item title updates to Help me define the idea
    expect(activeSubchat?.textContent).toContain("Help me define the idea");
  });

  it("renders header bar with project name on the left and What I know on the right with blue text and icon", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Verify topbar header
    const topbar = document.querySelector(".chatgpt-topbar");
    expect(topbar).not.toBeNull();

    // Verify project name on the left and edit icon button right side of the heading
    const projectTitleInHeader = document.querySelector(".chatgpt-topbar-project-title");
    expect(projectTitleInHeader).not.toBeNull();
    expect(projectTitleInHeader?.textContent).toBe("Personal care brand enters South Asia’s smaller cities");

    const editHeadingBtn = screen.getByRole("button", { name: "Edit project heading" });
    expect(editHeadingBtn).toBeDefined();
    expect(editHeadingBtn.querySelector("svg")).not.toBeNull();

    // Verify What I know button on the right
    const whatIKnowBtn = screen.getByRole("button", { name: "What I know" });
    expect(whatIKnowBtn).toBeDefined();
    expect(whatIKnowBtn.classList.contains("chatgpt-what-i-know-btn")).toBe(true);

    const svgIcon = whatIKnowBtn.querySelector("svg");
    expect(svgIcon).not.toBeNull();
    expect(svgIcon?.classList.contains("lucide-book-open")).toBe(true);
  });

  it("applies 1100px max-width to workspace-conversation while keeping the chat input dock at 760px", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    const chatBtn = screen.getByText("Tier-2 Market Penetration Strategy");
    fireEvent.click(chatBtn);

    const conversationContainer = document.querySelector(".workspace-conversation");
    expect(conversationContainer).not.toBeNull();

    const inputDock = document.querySelector(".chatgpt-input-dock");
    expect(inputDock).not.toBeNull();

    const bottomDock = document.querySelector(".workspace-dock-wrapper.bottom-dock-wrapper");
    expect(bottomDock).not.toBeNull();
    expect(bottomDock?.contains(inputDock!)).toBe(true);
  });

  it("renders the in-card typing field with home page pill styling and handles submission", async () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    const chatBtn = screen.getByText("Tier-2 Market Penetration Strategy");
    fireEvent.click(chatBtn);

    // Verify 4 outcome option cards in 2-column grid with ArrowUpRight
    const optionCards = document.querySelectorAll(".ai-outcome-option-btn");
    expect(optionCards.length).toBe(4);
    expect(document.querySelector(".ai-outcome-options-grid")).not.toBeNull();

    // Verify in-card typing field
    const inCardInput = screen.getByRole("textbox", { name: /type your answer and press enter/i });
    expect(inCardInput).toBeDefined();
    expect(inCardInput.getAttribute("placeholder")).toBe("Type your answer and press Enter");

    const submitBtn = screen.getByRole("button", { name: "Submit answer" });
    expect(submitBtn).toBeDefined();

    // Type a custom answer in the card field
    fireEvent.change(inCardInput, { target: { value: "Build a regional franchise network" } });
    fireEvent.click(submitBtn);

    // Verify user message is added
    expect(screen.getAllByText("Build a regional franchise network").length).toBeGreaterThanOrEqual(1);
  });

  it("renders a Project Intake message card above the outcome choices with better card design", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    const chatBtn = screen.getByText("Tier-2 Market Penetration Strategy");
    fireEvent.click(chatBtn);

    // Verify Project Intake card exists above the outcome stroke box
    const intakeCard = document.querySelector(".ai-intake-card");
    expect(intakeCard).not.toBeNull();
    const outcomeBox = document.querySelector(".ai-outcome-container")?.closest(".ai-stroke-box");
    expect(outcomeBox).not.toBeNull();
    expect(outcomeBox?.contains(intakeCard)).toBe(false);

    // Verify tags "Project Intake" and "Brief registered" are removed
    expect(screen.queryByText("Project Intake")).toBeNull();
    expect(screen.queryByText("Brief registered")).toBeNull();
    expect(
      screen.getByText(/We've received your project brief for "Personal care brand enters South Asia’s smaller cities"/i)
    ).toBeDefined();
    expect(
      screen.getByText(/Autonomous collaborative agents are ready to coordinate market dynamics/i)
    ).toBeDefined();
  });

  it("renders curated Knowledge Packs with Adobe Acrobat PDF icons, GET buttons, and report metadata", async () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    const chatBtn = screen.getByText("Tier-2 Market Penetration Strategy");
    fireEvent.click(chatBtn);

    // Give input by selecting outcome option
    const outcomeOption = screen.getAllByText("Expand into a new customer segment or region")[0].closest("button");
    if (outcomeOption) fireEvent.click(outcomeOption);

    // Verify selected item is rendered as a user message bubble below the outcome card
    const userMessages = document.querySelectorAll(".workspace-message.user-message");
    expect(userMessages.length).toBeGreaterThanOrEqual(2);
    expect(userMessages[userMessages.length - 1].textContent).toContain("Expand into a new customer segment or region");

    // Verify Thinking... loader with animation spinner is rendered
    expect(screen.getByText("Thinking...")).toBeDefined();
    expect(document.querySelector(".ai-thinking-row")).not.toBeNull();
    expect(document.querySelector(".ai-thinking-spinner")).not.toBeNull();

    // Fast-forward thinking duration to reveal answers
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    // Verify loader is hidden after 3 seconds thinking
    expect(screen.queryByText("Thinking...")).toBeNull();
    expect(document.querySelector(".ai-thinking-row")).toBeNull();

    // Verify Matching Knowledge Packs section is rendered without count subtitle
    expect(screen.getByText("Matching Knowledge Packs")).toBeDefined();
    expect(screen.queryByText(/packs recommended for this project/i)).toBeNull();

    // Verify Pack 1 heading, subtitle, and tag
    expect(screen.getByText("South Asia Tier-2 & Tier-3 City Market Penetration")).toBeDefined();
    expect(
      screen.getByText(/City selection, price points and channels for smaller-city growth/i)
    ).toBeDefined();
    // Verify tag line "Personal care brand enters South Asia’s smaller cities · 3 files" is removed
    expect(screen.queryByText(/Personal care brand enters South Asia’s smaller cities · 3 files/i)).toBeNull();

    // Verify Pack 2 heading and subtitle
    expect(screen.getByText("Personal Care Ingredients & Formulation Dynamics")).toBeDefined();
    expect(
      screen.getByText(/Active, functional and strategic ingredient research/i)
    ).toBeDefined();

    // Verify Adobe Acrobat PDF icons are rendered
    const acrobatIcons = document.querySelectorAll(".ai-pack-pdf-icon");
    expect(acrobatIcons.length).toBeGreaterThan(0);

    // Verify specific reports with publication dates
    expect(
      screen.getAllByText(/Growth Opportunities in Personal Care for Tier-2 and Tier-3 Cities/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/- June 2026/i)).toBeDefined();
    expect(
      screen.getAllByText("Price-Point & Pack-Size Strategy for Mass-Premium Skincare in Emerging South Asian Markets").length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/- December 2025/i)).toBeDefined();
    expect(
      screen.getAllByText(/Distribution Channel Optimisation: Modern Trade, Quick Commerce and Kirana Networks/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/- December 2026/i)).toBeDefined();

    // Verify pack cards have credits required (4,000), available credits, and Get Bundle button at the bottom
    expect(document.querySelector(".ai-pack-card-top-row .ai-pack-get-btn")).toBeNull();
    const creditsLabels = screen.getAllByText(/Credits required/i);
    expect(creditsLabels.length).toBe(2);
    expect(screen.getAllByText(/4,?000/).length).toBeGreaterThanOrEqual(2);
    const availableCreditsLabels = screen.getAllByText(/Available credits/i);
    expect(availableCreditsLabels.length).toBe(2);
    expect(screen.getAllByText(/12,?000/).length).toBeGreaterThanOrEqual(2);
    const getPackBtns = document.querySelectorAll(".ai-knowledge-pack-card .ai-pack-get-btn");
    expect(getPackBtns.length).toBe(2);
    expect(getPackBtns[0].textContent).toContain("Get Pack");

    // Verify "Understood! Expanding..." line is removed
    expect(
      screen.queryByText(/Understood! Expanding into a new customer segment or region is the primary focus/i)
    ).toBeNull();

    // Verify summary box heading (How this knowledge supports your project)
    expect(screen.getByText("How this knowledge supports your project")).toBeDefined();
    expect(
      screen.getByText(/I found market intelligence reports from 2025–2026 covering tier-2 & tier-3 city retail/i)
    ).toBeDefined();

    // Verify Save insight button
    const saveInsightBtn = screen.getByRole("button", { name: /save insight/i });
    expect(saveInsightBtn).toBeDefined();
    fireEvent.click(saveInsightBtn);
    expect(screen.getByText("Saved to insights")).toBeDefined();

    // Verify Matching reports, Recommended Agents, and Generate report button are removed
    expect(screen.queryByText("Matching reports")).toBeNull();
    expect(screen.queryByText("Recommended Agents")).toBeNull();
    expect(screen.queryByRole("button", { name: /^Generate report$/i })).toBeNull();

    // Verify Download Report (PDF), Export CSV, and tab buttons are replaced with Save insight
    expect(screen.queryByText("Download Report (PDF)")).toBeNull();
    expect(screen.queryByText("Export CSV")).toBeNull();
    expect(screen.queryByText("Home Loan Report")).toBeNull();
    expect(screen.queryByText("South Asia Market Report")).toBeNull();

    // Verify Related actions is NOT shown before Pack Added
    expect(screen.queryByText("Related actions")).toBeNull();

    // Click Get Pack on the first knowledge pack
    const getPackBtn = screen.getAllByRole("button", { name: /Get .* pack/i })[0];
    expect(getPackBtn).toBeDefined();
    fireEvent.click(getPackBtn);

    // Verify button updates to Added (single left checkmark, title-cased)
    expect(screen.getAllByText(/^Added$/i).length).toBeGreaterThan(0);

    // Verify Downloading... loader is rendered
    expect(screen.getByText("Downloading...")).toBeDefined();

    // Fast-forward downloading duration
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    // Verify loader is hidden
    expect(screen.queryByText("Downloading...")).toBeNull();

    // Verify confirmation message is posted to chat with heading and subline
    expect(screen.getByRole("heading", { name: "Pack Added to Your Project" })).toBeDefined();
    expect(
      screen.getByText("South Asia Tier-2 & Tier-3 City Market Penetration is now integrated")
    ).toBeDefined();
    expect(screen.queryByText(/4,000 Credits Applied/i)).toBeNull();
    expect(screen.queryByText(/Knowledge Status:/i)).toBeNull();
    expect(screen.queryByText(/Available Balance:/i)).toBeNull();

    // Verify Related actions section is rendered ONLY after Pack Added to Your Project is shown
    expect(screen.getByText("Related actions")).toBeDefined();
    const packAddedActionCards = document.querySelectorAll(".ai-pack-added-container .ai-related-action-card");
    expect(packAddedActionCards.length).toBe(5);

    // Verify the 5 specific actions requested
    expect(screen.getByText(/Start a Market research/i)).toBeDefined();
    expect(screen.getByText(/Policy And Regulations Check/i)).toBeDefined();
    expect(screen.getByText(/Plan a Business model/i)).toBeDefined();
    expect(screen.getByText(/Competitor Landscape/i)).toBeDefined();
    expect(screen.getByText(/Geographical market deep drive/i)).toBeDefined();

    // Clicking an action card directly sends it as a user message
    fireEvent.click(packAddedActionCards[0]);
    const latestUserMsgs = document.querySelectorAll(".workspace-message.user-message");
    expect(latestUserMsgs[latestUserMsgs.length - 1].textContent).toContain("Start a Market research");


  });

  it("opens right-side slide panel with 3 project related agents and other agents below on clicking New chat under a project", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Click New chat
    const newChatBtn = screen.getByRole("button", { name: /new chat/i });
    fireEvent.click(newChatBtn);

    // Verify right-side slide-in drawer is open with single Agents heading
    const agentsDrawer = document.querySelector(".workspace-agents-drawer");
    expect(agentsDrawer).not.toBeNull();
    expect(screen.getByRole("complementary", { name: "Agents" })).toBeDefined();

    // Verify single heading "Agents" and 3 project agents listdown
    expect(screen.getByRole("heading", { level: 2, name: "Agents" })).toBeDefined();
    expect(screen.getAllByText("Emerging Markets Specialist Agent").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Customer Dynamics & Segmentation Agent").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Geographic Expansion Strategy Agent")).toBeDefined();

    const projectAgentCards = document.querySelectorAll(".agent-drawer-card--project");
    expect(projectAgentCards.length).toBe(3);

    // Verify "Other Agents" title is removed - all unified under Agents
    expect(screen.queryByText("Other Agents")).toBeNull();
    expect(screen.queryByText("6 Available")).toBeNull();
    expect(screen.queryByText(/Workspace agents for regulatory compliance/i)).toBeNull();
    expect(document.querySelector(".agent-drawer-card-badge")).toBeNull();
    const otherAgentCards = document.querySelectorAll(".agent-drawer-card--other");
    expect(otherAgentCards.length).toBe(6);
    expect(screen.getByText("Customer Persona & Demographic Intelligence Agent")).toBeDefined();
    expect(screen.getByText("AIIMS ICU Occupancy Report")).toBeDefined();

    // Verify right-side close button and Run agent buttons are removed from drawer
    expect(screen.queryByRole("button", { name: "Close agents panel" })).toBeNull();
    expect(document.querySelector(".workspace-agents-drawer .agent-drawer-run-btn")).toBeNull();

    // Verify Project Agents badge is removed from header
    expect(screen.queryByRole("button", { name: "Project Agents" })).toBeNull();
  });

  it("slides What I know so far panel above agents panel without closing agents panel, and closing What I know leaves agents panel open", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Open Agents drawer by clicking New chat
    const newChatBtn = screen.getByRole("button", { name: /new chat/i });
    fireEvent.click(newChatBtn);

    expect(document.querySelector(".workspace-agents-drawer")).not.toBeNull();

    // Click What I know button
    const whatIKnowBtn = screen.getByRole("button", { name: "What I know" });
    fireEvent.click(whatIKnowBtn);

    // Both drawers are present in the DOM (What I know layered above Agents)
    expect(document.querySelector(".workspace-knowledge-drawer")).not.toBeNull();
    expect(document.querySelector(".workspace-agents-drawer")).not.toBeNull();

    // Close What I know panel
    const closeBtn = screen.getByRole("button", { name: "Close panel" });
    fireEvent.click(closeBtn);

    // Only What I know panel closes; Agents drawer remains open!
    expect(document.querySelector(".workspace-knowledge-drawer")).toBeNull();
    expect(document.querySelector(".workspace-agents-drawer")).not.toBeNull();
  });

  it("suggests two agents on report task in new chat, collects field questions, activates second agent collaboratively, and generates full executive report on continue", async () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Open a New chat
    const newChatBtn = screen.getByRole("button", { name: /new chat/i });
    fireEvent.click(newChatBtn);

    // Verify right sidebar is open and before AI suggests agents, "Will be Invoked" badges are not shown
    expect(screen.queryByText(/Will be Invoked/i)).toBeNull();

    // Type and send report inquiry in input dock
    const inputField = screen.getByPlaceholderText(/Reply, attach a file, or tap the mic to talk/i);
    fireEvent.change(inputField, { target: { value: "Can you prepare a market penetration report for tier-2 cities?" } });
    fireEvent.submit(inputField.closest("form")!);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
    });

    // Verify AI response suggests 2 agents matching home page design
    expect(screen.getByText(/assembled two specialized agents/i)).toBeDefined();
    expect(screen.getByText("Suggested Agents")).toBeDefined();
    const suggestedAgentCards = document.querySelectorAll(".report-flow-agent-card");
    expect(suggestedAgentCards.length).toBe(2);
    expect(screen.getAllByText("Emerging Markets Specialist Agent").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Customer Dynamics & Segmentation Agent").length).toBeGreaterThanOrEqual(1);

    // Verify only after chat AI suggests agents do the "Will be Invoked" badges appear
    const invokedBadges = screen.getAllByText(/Will be Invoked/i);
    expect(invokedBadges.length).toBe(2);

    // Verify no cheesy AI sparkles/badges exist
    expect(document.querySelector(".report-flow-container .sparkles")).toBeNull();

    // Select both agents to begin collaborative configuration
    fireEvent.click(suggestedAgentCards[0]);
    fireEvent.click(suggestedAgentCards[1]);
    const continueBtn = screen.getByRole("button", { name: /^Continue$/i });
    fireEvent.click(continueBtn);

    // Verify agents are active and ask 2 fields each (Reporting Period with calendar dropdown, Geographic Tier Focus, Target Consumer Cohort, Channel Velocity)
    expect(screen.getByText("Reporting Period")).toBeDefined();
    expect(screen.getByText("Geographic Tier Focus")).toBeDefined();

    // Verify second agent is also working and asks 2 collaborative fields (Target Consumer Cohort, Channel Distribution Velocity)
    // exactly 4 fields in total
    expect(screen.getByText("Target Consumer Cohort")).toBeDefined();
    expect(screen.getByText("Channel Distribution Velocity")).toBeDefined();

    // Open calendar dropdown and select a month/year
    const calTrigger = screen.getByRole("button", { name: /Select reporting month and year/i });
    fireEvent.click(calTrigger);
    expect(screen.getByText("Select Month")).toBeDefined();

    // Select October 2026 from the month grid
    const octBtn = screen.getByRole("button", { name: "October 2026" });
    fireEvent.click(octBtn);
    expect(screen.getAllByText(/October 2026/i).length).toBeGreaterThanOrEqual(1);

    const tier3Pill = screen.getByRole("button", { name: "Tier-3 Regional Urban Clusters" });
    fireEvent.click(tier3Pill);
    expect(tier3Pill.className).toContain("report-flow-pill--active");

    // Open Channel Distribution Velocity dropdown (app theme) and select an option
    const channelDropdownTrigger = screen.getByRole("button", { name: /Select Channel Distribution Velocity/i });
    fireEvent.click(channelDropdownTrigger);
    const kiranaOption = screen.getByRole("option", { name: /Traditional Kirana & Wholesale Networks/i });
    fireEvent.click(kiranaOption);
    expect(screen.getAllByText(/Traditional Kirana & Wholesale Networks/i).length).toBeGreaterThanOrEqual(1);

    // Write in the custom focus text input field
    const writeInput = screen.getByLabelText(/Write custom strategic focus/i);
    fireEvent.change(writeInput, { target: { value: "Focus on Jaipur & Surat tier-2 corridors" } });

    // Click Continue button to generate report
    const continueToGenBtn = screen.getByRole("button", { name: /Continue to Generate Report/i });
    fireEvent.click(continueToGenBtn);

    // Verify thinking animation is shown when clicking Continue to Generate Report
    expect(document.querySelector(".report-flow-container .ai-agent-generating-loader-wrap")).not.toBeNull();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
    });

    // Verify generated report is displayed with synthesized insights and full visual report
    expect(screen.getByText(/Personal Care Brand: South Asia Tier-2 & Tier-3 Market Entry Report/i)).toBeDefined();
    expect(screen.getAllByText(/142,850/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Target consumer households/i)).toBeDefined();
    expect(screen.getAllByText(/98.6%/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Retail placement velocity/i)).toBeDefined();
    expect(screen.getByText(/Monthly Trial Kit Distribution & Conversion Velocity/i)).toBeDefined();
    expect(screen.getByText(/Consumer Cohort & Market Segmentation Breakdown/i)).toBeDefined();
    expect(screen.getByText(/Channel Distribution Velocity & Retail Network Breakdown/i)).toBeDefined();

    // Verify Related actions with 3 AI-suggested questions are shown after report generation
    const relatedActionsEl = document.querySelector(".agent-report-related-actions");
    expect(relatedActionsEl).not.toBeNull();
    const relatedActionBtns = document.querySelectorAll(".agent-report-related-actions .message-related-action-btn");
    expect(relatedActionBtns.length).toBe(3);
    expect(screen.getByText("Which 5 Tier-2 cities have the highest trial pack conversion velocity?")).toBeDefined();
    expect(screen.getByText("What are the distributor trade margin structures across secondary cities?")).toBeDefined();
    expect(screen.getByText("How do quick-commerce dark stores compare with regional kirana networks?")).toBeDefined();

    // Click the first related action: "Which 5 Tier-2 cities have the highest trial pack conversion velocity?"
    fireEvent.click(relatedActionBtns[0]);

    // Fast-forward 300ms thinking loader
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    // Verify visual City Velocity Report is rendered with sparklines and ranked cities
    expect(screen.getByText("Top 5 Tier-2 Cities: Trial Pack Conversion Velocity & Regional Adoption")).toBeDefined();
    expect(screen.getByText("Jaipur")).toBeDefined();
    expect(screen.getByText("Lucknow")).toBeDefined();
    expect(screen.getByText("Indore")).toBeDefined();
    expect(screen.getByText("Chandigarh")).toBeDefined();
    expect(screen.getByText("Surat")).toBeDefined();
    expect(document.querySelectorAll(".openui-sparkline-svg").length).toBe(5);

    // Verify long paragraphs, bulky audit cards, and unwanted badges are removed to provide clean breathing spaces
    expect(screen.queryByText(/Leading regional trial adoption with strong salon-led/i)).toBeNull();
    expect(screen.queryByText(/Regional Trial Conversion Playbook & Channel Insights/i)).toBeNull();
    expect(document.querySelector(".openui-ranked-row .openui-ranked-desc")).toBeNull();
    expect(screen.queryByText("PRIORITY URBAN HUB")).toBeNull();
    expect(screen.queryByText("QUICK-COMMERCE 42%")).toBeNull();
    expect(screen.queryByText("CLIMATE-ADAPTIVE GEL")).toBeNull();
  }, 25000);

  it("navigates to the Packages page on clicking Packages in header menu with overlapping card and project-wise sections", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    // Click Packs link in main navigation
    const packsLink = screen.getByRole("link", { name: "Packs" });
    fireEvent.click(packsLink);

    // Verify Packs page is rendered with preserved header
    expect(screen.getByRole("heading", { level: 1, name: /Research & Knowledge Packs/i })).toBeDefined();
    expect(
      screen.getByText(/Curated research packs and verified market intelligence/i)
    ).toBeDefined();

    // Verify overlapping stylish single UI card
    const overviewCard = document.querySelector(".packages-overview-card");
    expect(overviewCard).not.toBeNull();
    expect(screen.getByText("Acquired Research Packs")).toBeDefined();
    expect(screen.getByText("Last acquired: June 2026")).toBeDefined();
    expect(document.querySelector(".packages-last-update-pill")).toBeNull();
    expect(document.querySelector(".packages-last-update-text")).not.toBeNull();
    expect(screen.getByText("4")).toBeDefined();
    expect(screen.getByText("Packs Acquired")).toBeDefined();
    expect(screen.queryByText("Last Date Mentioned")).toBeNull();
    expect(screen.getByText("10")).toBeDefined();
    expect(screen.getByText("Validated Reports")).toBeDefined();

    // Verify project-wise sections below and removal of Project Knowledge Packages heading
    expect(screen.queryByText("Project Knowledge Packages")).toBeNull();
    const projectGroups = document.querySelectorAll(".packages-project-group-card");
    expect(projectGroups.length).toBe(3);

    // Verify first project group without folder icon and absence of unwanted tags and badges
    expect(screen.getByText("Personal care brand enters South Asia’s smaller cities")).toBeDefined();
    expect(document.querySelector(".packages-project-title-row svg")).toBeNull();
    expect(screen.queryByText("2 Packages")).toBeNull();
    expect(screen.queryByText(/Acquired · June 2026/i)).toBeNull();
    expect(screen.queryByText(/validated reports included/i)).toBeNull();
    expect(screen.queryByText("Open in Workspace")).toBeNull();
    expect(screen.queryByText("View in Project")).toBeNull();
    expect(screen.getAllByRole("button", { name: /Download all/i }).length).toBeGreaterThan(0);
    expect(screen.getByText("South Asia Tier-2 & Tier-3 City Market Penetration")).toBeDefined();
    expect(screen.getByText("Personal Care Ingredients & Formulation Dynamics")).toBeDefined();

    // Verify return to dashboard by clicking Home in the header
    const homeLink = screen.getByRole("link", { name: "Home" });
    fireEvent.click(homeLink);

    // Verify back on main dashboard
    expect(screen.getByText("Autonomous Collaborative Projects")).toBeDefined();
    expect(document.querySelector(".packages-overview-card")).toBeNull();
  });

  it("provides search on Saved Insights page and allows saving general assistant chat responses as insights", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Click Saved insights in menu
    const savedInsightsBtn = screen.getByRole("button", { name: "Saved insights" });
    fireEvent.click(savedInsightsBtn);

    // Verify search input exists on Saved Insights view
    const searchInput = screen.getByPlaceholderText("Search saved insights...");
    expect(searchInput).toBeDefined();

    // Verify initial insights are displayed
    expect(screen.getByText("Mass-Premium Conversion Sweet Spot")).toBeDefined();

    // Search for non-existent text
    fireEvent.change(searchInput, { target: { value: "NonexistentKeyword123" } });
    expect(screen.getByText(/No saved insights found matching/i)).toBeDefined();

    // Search for existing text
    fireEvent.change(searchInput, { target: { value: "Kirana" } });
    expect(screen.getByText("Kirana & Quick Commerce Distribution Velocity")).toBeDefined();
    expect(screen.queryByText("Mass-Premium Conversion Sweet Spot")).toBeNull();

    // Clear search filter
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(screen.getByText("Mass-Premium Conversion Sweet Spot")).toBeDefined();

    // Go back to chat
    const chatBtn = screen.getByText("Tier-2 Market Penetration Strategy");
    fireEvent.click(chatBtn);

    // Find Save insight button on general assistant response
    const saveInsightBtn = screen.getAllByRole("button", { name: /Save insight/i })[0];
    expect(saveInsightBtn).toBeDefined();

    // Click Save insight
    fireEvent.click(saveInsightBtn);

    // Button updates to Saved to insights
    expect(screen.getAllByRole("button", { name: /Saved to insights/i }).length).toBeGreaterThan(0);

    // Return to Saved insights view and verify new insight is listed
    fireEvent.click(savedInsightsBtn);
    expect(screen.getAllByText(/Assistant Chat/i).length).toBeGreaterThan(0);
  }, 25000);

  it("shows only one agent parameters when one agent is selected, and both when two agents are selected", async () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    const newChatBtn = screen.getByRole("button", { name: /new chat/i });
    fireEvent.click(newChatBtn);

    const inputField = screen.getByPlaceholderText(/Reply, attach a file, or tap the mic to talk/i);
    fireEvent.change(inputField, { target: { value: "Can you prepare a market penetration report for tier-2 cities?" } });
    fireEvent.submit(inputField.closest("form")!);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
    });

    const suggestedCards = document.querySelectorAll(".report-flow-agent-card");
    expect(suggestedCards.length).toBe(2);

    // Select only ONE agent: Customer Dynamics & Segmentation Agent, then click Continue
    fireEvent.click(suggestedCards[1]);
    const continueBtn = screen.getByRole("button", { name: /^Continue$/i });
    fireEvent.click(continueBtn);

    // Verify only that one agent's parameters appear, NOT two
    expect(screen.getAllByText("Customer Dynamics & Segmentation Agent").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Reporting Period")).toBeDefined();
    expect(screen.getByText("Geographic Tier Focus")).toBeDefined();
    expect(screen.queryByText("Collaborative segmentation inputs")).toBeNull();
    expect(screen.queryByText("Channel Distribution Velocity")).toBeNull();

    // Now select the SECOND agent as well (so two are selected)
    fireEvent.click(suggestedCards[0]);

    // Verify both agents' parameters appear
    expect(screen.getByText("Collaborative segmentation inputs")).toBeDefined();
    expect(screen.getByText("Channel Distribution Velocity")).toBeDefined();
  }, 25000);

  it("renames button to Continue, clicking it shows the parameters for the agents, and Continue to Generate Report reveals the report after animation", async () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    const newChatBtn = screen.getByRole("button", { name: /new chat/i });
    fireEvent.click(newChatBtn);

    const inputField = screen.getByPlaceholderText(/Reply, attach a file, or tap the mic to talk/i);
    fireEvent.change(inputField, { target: { value: "Can you prepare a market penetration report for tier-2 cities?" } });
    fireEvent.submit(inputField.closest("form")!);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
    });

    const continueBtn = screen.getByRole("button", { name: /^Continue$/i });
    expect(continueBtn).toBeDefined();

    // Click Continue
    fireEvent.click(continueBtn);

    // Button should be disabled immediately
    expect(continueBtn.hasAttribute("disabled") || continueBtn.className.includes("project-action-btn--completed")).toBe(true);

    // After click show Emerging Markets Specialist Agent and Customer Dynamics & Segmentation Agent parameters
    expect(screen.getAllByText("Emerging Markets Specialist Agent").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Reporting parameters")).toBeDefined();
    expect(screen.getByText("Reporting Period")).toBeDefined();
    expect(screen.getByText("June 2026")).toBeDefined();
    expect(screen.getByText("Geographic Tier Focus")).toBeDefined();
    expect(screen.getByText("Tier-2 Priority Growth Cities")).toBeDefined();
    expect(screen.getByText("Tier-3 Regional Urban Clusters")).toBeDefined();
    expect(screen.getByText("Comprehensive Secondary Network")).toBeDefined();

    expect(screen.getAllByText("Customer Dynamics & Segmentation Agent").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Collaborative segmentation inputs")).toBeDefined();
    expect(screen.getByText("Target Consumer Cohort")).toBeDefined();
    expect(screen.getByText("Channel Distribution Velocity")).toBeDefined();
    expect(screen.getByText("Custom Strategic Focus & Priority Cities")).toBeDefined();

    // Report is not shown yet
    expect(screen.queryByText(/Personal Care Brand: South Asia Tier-2 & Tier-3 Market Entry Report/i)).toBeNull();

    // Click Continue to Generate Report
    const genReportBtn = screen.getByRole("button", { name: /Continue to Generate Report/i });
    fireEvent.click(genReportBtn);

    // The parameters section and button must NOT hide after click
    expect(screen.getByText("Reporting parameters")).toBeDefined();
    expect(screen.getByText("Geographic Tier Focus")).toBeDefined();
    expect(screen.getByRole("button", { name: /Continue to Generate Report/i })).toBeDefined();

    // Dot-matrix wave thinking animation is shown (single loader)
    expect(document.querySelector(".report-flow-container .ai-agent-generating-loader-wrap")).not.toBeNull();

    // Wait for animation to finish
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
    });

    // Loader is now gone
    expect(document.querySelector(".report-flow-container .ai-agent-generating-loader-wrap")).toBeNull();

    // Parameters section and Continue to Generate Report button still stay visible!
    expect(screen.getByText("Reporting parameters")).toBeDefined();
    expect(screen.getByText("Geographic Tier Focus")).toBeDefined();
    expect(screen.getByRole("button", { name: /Continue to Generate Report/i })).toBeDefined();

    // The Market Entry Report is shown below
    expect(screen.getByText(/Personal Care Brand: South Asia Tier-2 & Tier-3 Market Entry Report/i)).toBeDefined();
    expect(screen.getAllByText(/142,850/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Target consumer households/i)).toBeDefined();
    expect(screen.getAllByText(/98.6%/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Retail placement velocity/i)).toBeDefined();
    expect(screen.getByText(/Monthly Trial Kit Distribution & Conversion Velocity/i)).toBeDefined();
  }, 25000);

  it("starts conversation with greeting screen and shows loader before revealing project brief confirmed on asking project query", async () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Initial conversation starts with greeting screen only (not project brief)
    expect(screen.getByText("What would you like to work on next?")).toBeDefined();
    expect(screen.getByText("Your project details are ready. We can review the score or explore a decision.")).toBeDefined();
    expect(screen.getByText("Reply below, or choose where to pick up.")).toBeDefined();
    expect(screen.queryByText("Project brief confirmed, Arun")).toBeNull();
    expect(screen.queryByText("What primary outcome do you want to achieve with this project?")).toBeNull();

    // Ask: Personal care brand enters South Asia’s smaller cities
    const input = screen.getByPlaceholderText("Reply, attach a file, or tap the mic to talk");
    fireEvent.change(input, { target: { value: "Personal care brand enters South Asia’s smaller cities" } });
    const sendBtn = screen.getByRole("button", { name: "Send message" });
    fireEvent.click(sendBtn);

    // User message is rendered
    expect(screen.getAllByText("Personal care brand enters South Asia’s smaller cities").length).toBeGreaterThan(0);

    // Loader is shown
    expect(screen.getByText("Thinking...")).toBeDefined();
    expect(document.querySelector(".ai-thinking-row")).not.toBeNull();
    expect(document.querySelector(".ai-gradient-ring")).not.toBeNull();

    // Fast-forward loader duration
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    // Loader is gone
    expect(screen.queryByText("Thinking...")).toBeNull();

    // Project brief confirmed and primary outcome options are now shown
    expect(screen.getByText("Project brief confirmed, Arun")).toBeDefined();
    expect(screen.getByText(/We've received your project brief for "Personal care brand enters South Asia’s smaller cities"/i)).toBeDefined();
    expect(screen.getByText("What primary outcome do you want to achieve with this project?")).toBeDefined();
    expect(screen.getByText("Launch a new AI product or service")).toBeDefined();
    expect(screen.getByText("Automate internal operations & reduce costs")).toBeDefined();
    expect(screen.getByText("Expand into a new customer segment or region")).toBeDefined();
    expect(screen.getByText("Accelerate enterprise sales & revenue growth")).toBeDefined();
  });

  it("allows selecting an agent from the drawer, triggers thinking loader, renders executive report without pinned bar, and supports follow-up queries", async () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    // Click project
    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Click New chat to open agents drawer
    const newChatBtn = screen.getByRole("button", { name: /New chat/i });
    fireEvent.click(newChatBtn);

    // Verify agents drawer is open and contains Emerging Markets Specialist Agent
    expect(screen.getByRole("heading", { name: "Agents" })).toBeDefined();
    const emergingAgentCard = screen.getByText("Emerging Markets Specialist Agent");
    expect(emergingAgentCard).toBeDefined();

    // Select Emerging Markets Specialist Agent card
    const selectCard = screen.getByRole("button", { name: "Select Emerging Markets Specialist Agent" });
    fireEvent.click(selectCard);

    // Verify card is marked selected with box stroke (no circular radio)
    expect(selectCard.classList.contains("agent-drawer-card--selected")).toBe(true);
    expect(selectCard.querySelector(".ai-outcome-radio")).toBeNull();

    // Verify pinned agent bar is NOT shown ("dont show this")
    expect(document.querySelector(".chat-pinned-agent-bar")).toBeNull();

    // Verify Thinking... loader is shown
    expect(screen.getByText("Thinking...")).toBeDefined();

    // Fast-forward thinking response
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    // Verify loader is hidden and report is rendered
    expect(screen.queryByText("Thinking...")).toBeNull();
    expect(document.querySelector("#agent-report-section")).not.toBeNull();
    expect(screen.getByRole("heading", { name: /South Asia Tier-2 & Tier-3 Market Entry Report/i })).toBeDefined();

    // Free typing field allows typing any custom query
    const inputField = screen.getByPlaceholderText(/Reply, attach a file, or tap the mic to talk/i);
    fireEvent.change(inputField, { target: { value: "What should be our priority retail corridors and price points?" } });

    // Send the message
    const sendBtn = screen.getByTitle("Send message");
    fireEvent.click(sendBtn);

    // Fast-forward response
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    // Verify detailed paragraph answer from Emerging Markets Specialist Agent
    expect(screen.getByText(/Strategic Intelligence Briefing: Emerging Markets/i)).toBeDefined();
    expect(screen.getByText(/Prepared by Emerging Markets Specialist Agent for Personal care brand enters South Asia’s smaller cities/i)).toBeDefined();
    expect(screen.getAllByText(/What should be our priority retail corridors and price points\?/i).length).toBe(2);

    // Verify Related actions section is rendered with search icons below the answer
    expect(screen.getAllByText("Related actions").length).toBeGreaterThan(0);
    const relatedBtns = screen.getAllByText("What are the distributor trade margin structures across secondary cities?");
    const relatedBtn = relatedBtns[relatedBtns.length - 1];
    expect(relatedBtn).toBeDefined();

    // Clicking a related action question sends it to continue the conversation
    fireEvent.click(relatedBtn);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    expect(screen.getAllByText(/What are the distributor trade margin structures across secondary cities\?/i).length).toBeGreaterThanOrEqual(1);

    // Verify Agent header is not mentioned on the conversation
    expect(document.querySelectorAll(".ai-agent-message-header").length).toBe(0);
  }, 25000);

  it("interactively guides user through 3 diagnostic questions with 4 options each when asking Customer Dynamics query without selecting agent card", async () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    // Click project
    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Open a New chat under the project
    const newChatBtn = screen.getByRole("button", { name: "New chat" });
    fireEvent.click(newChatBtn);

    // Type and send "Customer Dynamics & Segmentation Agent" without selecting the right-side agent card
    const input = screen.getByPlaceholderText(/Reply, attach a file, or tap the mic to talk/i);
    fireEvent.change(input, { target: { value: "Customer Dynamics & Segmentation Agent" } });
    const form = input.closest("form");
    if (form) fireEvent.submit(form);

    // Fast-forward thinking
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    // Verify right-side agent card is NOT selected
    const custDynamicsCard = screen.getByRole("button", { name: "Select Customer Dynamics & Segmentation Agent" });
    expect(custDynamicsCard.classList.contains("agent-drawer-card--selected")).toBe(false);

    // Verify Question 1 is shown directly with 4 options (no step badges or intro text)
    expect(screen.queryByText(/Step 1 of 3/i)).toBeNull();
    expect(screen.queryByText(/To evaluate demographic buying patterns/i)).toBeNull();
    expect(screen.getByText("Which consumer demographic cohort should we prioritize for initial regional adoption?")).toBeDefined();
    const opt1 = screen.getByText("Aspirational Gen-Z & Young Professionals (Ages 18–28, SEC A/B)");
    expect(opt1).toBeDefined();
    expect(screen.getByText("Working Women & Household Decision Makers (Ages 28–42, SEC A/B)")).toBeDefined();

    // Select option 1 directly (advances without Continue button)
    expect(screen.queryByRole("button", { name: "Continue" })).toBeNull();
    fireEvent.click(opt1);

    // Fast-forward
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    // Verify Question 2 is shown with 4 options (no step badge)
    expect(screen.queryByText(/Step 2 of 3/i)).toBeNull();
    expect(screen.getByText("What is your target introductory price corridor for regional trial packs?")).toBeDefined();
    const opt2 = screen.getByText("Mass-premium sweet spot at ₹249 – ₹349 (Optimal margin & volume balance)");
    expect(opt2).toBeDefined();

    // Select option 2 directly (advances without Continue button)
    expect(screen.queryByRole("button", { name: "Continue" })).toBeNull();
    fireEvent.click(opt2);

    // Fast-forward
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    // Verify Question 3 is shown with 4 options (no step badge)
    expect(screen.queryByText(/Step 3 of 3/i)).toBeNull();
    expect(screen.getByText("Which primary skincare ritual or benefit territory should lead regional marketing?")).toBeDefined();
    const opt3 = screen.getByText("Skin Barrier Repair & Deep Hydration (Cica, Ceramides & Hyaluronic acid)");
    expect(opt3).toBeDefined();

    // Select option 3 directly (advances without Continue button)
    expect(screen.queryByRole("button", { name: "Continue" })).toBeNull();
    fireEvent.click(opt3);

    // Fast-forward
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    // Verify final synthesized strategic intelligence report is generated
    expect(screen.getByText(/Customer Dynamics & Segmentation Intelligence Briefing/i)).toBeDefined();
    expect(screen.getAllByText(/Aspirational Gen-Z & Young Professionals/i).length).toBeGreaterThanOrEqual(1);

    // Verify no agent header badge is rendered without agent selection
    expect(document.querySelectorAll(".ai-agent-message-header").length).toBe(0);
  }, 25000);

  it("expands the typing field above and renders attached PDF and image preview inside while keeping the typing area free below", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Initial input dock is not expanded
    const dockForm = document.querySelector(".chatgpt-input-dock");
    expect(dockForm).not.toBeNull();
    expect(dockForm?.classList.contains("chatgpt-input-dock--expanded")).toBe(false);

    // Attach a PDF file
    const fileInput = document.querySelector('input[type="file"][aria-label="Upload file"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();

    const pdfFile = new File(["dummy pdf content"], "market-expansion-guide.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [pdfFile] } });

    // Verify typing field expands above with .chatgpt-input-dock--expanded
    expect(dockForm?.classList.contains("chatgpt-input-dock--expanded")).toBe(true);
    expect(screen.getByText("market-expansion-guide.pdf")).toBeDefined();
    expect(screen.getByText(/PDF Document/i)).toBeDefined();

    // Verify typing area below is free and allows typing
    const textInput = screen.getByPlaceholderText(/Reply, attach a file, or tap the mic to talk/i) as HTMLInputElement;
    expect(textInput).toBeDefined();
    fireEvent.change(textInput, { target: { value: "Review this market guide" } });
    expect(textInput.value).toBe("Review this market guide");

    // Remove the attachment using the remove button
    const removeBtn = screen.getByRole("button", { name: "Remove market-expansion-guide.pdf" });
    fireEvent.click(removeBtn);

    // Verify attachment is removed and dock collapses back
    expect(screen.queryByText("market-expansion-guide.pdf")).toBeNull();
    expect(dockForm?.classList.contains("chatgpt-input-dock--expanded")).toBe(false);
  });

  it("renders the 6-field intake block (Goal writable, others clickable) and syncs selections with What I know so far panel", async () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    const chatBtn = screen.getByText("Tier-2 Market Penetration Strategy");
    fireEvent.click(chatBtn);

    // Verify stroke box has all 6 scope fields
    const strokeBox = document.querySelector(".ai-stroke-box");
    expect(strokeBox).not.toBeNull();
    expect(screen.getAllByText("Goal").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Who it's for").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Investment").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Expected annual impact").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Target date").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Delivery owner").length).toBeGreaterThan(0);

    // Goal is writable field
    const goalInput = screen.getByRole("textbox", { name: /type your answer and press enter/i });
    expect(goalInput).toBeDefined();

    // Select non-typing chips
    const whoChip = screen.getByRole("button", { name: /Tier-2 & Tier-3 Regional Consumers/i });
    fireEvent.click(whoChip);
    expect(whoChip.classList.contains("ai-scope-chip-btn--selected")).toBe(true);

    // Click Next button to slide to Step 2
    const nextBtn = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn);
    expect(screen.getByRole("button", { name: /back/i })).toBeDefined();
    expect(screen.queryByText(/Step 1 of 2/i)).toBeNull();
    expect(screen.queryByText(/Step 2 of 2/i)).toBeNull();

    // Enter investment amount manually in the amount field
    const invInput = screen.getByRole("textbox", { name: /enter investment amount/i });
    fireEvent.change(invInput, { target: { value: "₹50L – ₹1.5 Cr" } });
    expect(invInput).toHaveProperty("value", "₹50L – ₹1.5 Cr");

    // Verify Market field exists beside Target date and can select South Asia
    const marketDropdownTrigger = screen.getByRole("button", { name: /market region dropdown/i });
    expect(marketDropdownTrigger).toBeDefined();
    fireEvent.click(marketDropdownTrigger);
    const southAsiaOption = screen.getByRole("option", { name: /south asia/i });
    expect(southAsiaOption).toBeDefined();
    fireEvent.click(southAsiaOption);
    expect(screen.getAllByText("South Asia").length).toBeGreaterThan(0);

    // Verify Delivery owner input is rendered below full width
    const deliveryOwnerInput = screen.getByRole("textbox", { name: /enter delivery owner/i });
    expect(deliveryOwnerInput).toBeDefined();

    // Verify selected items are NOT shown on the right side of the field header
    expect(document.querySelector(".ai-scope-item-status--filled")).toBeNull();

    // Open What I know so far slide panel
    const whatIKnowBtn = screen.getByRole("button", { name: "What I know" });
    fireEvent.click(whatIKnowBtn);

    // Verify slide panel displays the updated core facts
    expect(screen.getByText("What I know so far")).toBeDefined();
    expect(screen.getByText("2 of 6 core facts")).toBeDefined();
    expect(screen.getByText("4")).toBeDefined(); // 4 still to learn
    expect(screen.getAllByText("Tier-2 & Tier-3 Regional Consumers").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("₹50L – ₹1.5 Cr").length).toBeGreaterThanOrEqual(1);

    // Close panel
    const closeBtn = screen.getByRole("button", { name: "Close panel" });
    fireEvent.click(closeBtn);

    // Confirm project scope button
    const confirmBtn = screen.getByRole("button", { name: /confirm project scope/i });
    expect(confirmBtn).toBeDefined();
    fireEvent.click(confirmBtn);

    // Loader is shown and thinking starts
    expect(screen.getByText("Thinking...")).toBeDefined();
  }, 25000);

  it("hides greeting, help idea, typing field when voice mode clicked, moves voice button below, asks all form questions with user answers, shows loader and reveals packages", async () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const createProjectBtn = screen.getByRole("button", { name: /create project/i });
    fireEvent.click(createProjectBtn);

    // Initial greeting card is visible before clicking Voice Mode
    expect(screen.getByText("Hey Arun, what project is on your mind?")).toBeDefined();
    expect(screen.getByText(/Tell me what you'd like to build, and we'll assemble the right agents/i)).toBeDefined();
    expect(screen.getByText("Help me define the idea")).toBeDefined();
    expect(screen.getByText("Attach a plan")).toBeDefined();
    expect(screen.getByText("Define Your Vision")).toBeDefined();
    expect(screen.getByPlaceholderText("Reply, attach a file, or tap the mic to talk")).toBeDefined();

    // Click Voice Mode button
    const voiceBtn = screen.getByRole("button", { name: /define your vision|voice mode/i });
    fireEvent.click(voiceBtn);

    // Initial greeting, Help me define idea, Attach a plan are hidden, and home page typing field is kept below inside the stroke box
    expect(screen.queryByText("Tell me what you'd like to build, and we'll assemble the right agents.")).toBeNull();
    expect(screen.queryByText("Help me define the idea")).toBeNull();
    expect(screen.queryByText("Attach a plan")).toBeNull();
    expect(screen.getByPlaceholderText("Reply, attach a file, or tap the mic to talk")).toBeDefined();

    // Talk About Your Vision modal card is displayed with badges
    expect(screen.getByText("Talk About Your Vision")).toBeDefined();
    expect(screen.getByText("Goal")).toBeDefined();
    expect(screen.getByText("Industry")).toBeDefined();
    expect(screen.getByText("Market")).toBeDefined();
    expect(screen.getByText("Audience")).toBeDefined();
    expect(screen.getByText("Challenges")).toBeDefined();
    expect(screen.getByText("Outcomes")).toBeDefined();

    // Intermediate clutter like Save insight and Related actions are NOT present in conversation
    expect(screen.queryByText("Save insight")).toBeNull();
    expect(screen.queryByText("Related actions")).toBeNull();

    // Click End Session
    const endConvBtn = screen.getByRole("button", { name: /end session|end conversation/i });
    fireEvent.click(endConvBtn);

    // Thinking loader runs, then confirmed scope and matching packages appear directly (brief / outcome form is hidden)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });

    expect(screen.queryByText(/What primary outcome do you want to achieve/i)).toBeNull();
    expect(screen.queryByText(/Confirm Project Scope/i)).toBeNull();
    expect(screen.getAllByText(/Expand into a new customer segment or region/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Voice input:")).toBeDefined();
    expect(screen.getByText(/Expand into a new target market/i)).toBeDefined();
    expect(screen.getByText("Project Scope Is Ready")).toBeDefined();
    expect(screen.getByText("Matching Knowledge Packs")).toBeDefined();
  }, 25000);
});
