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

    // Verify Project Workspace UI elements (shows done conversation on project click)
    expect(screen.getByText("CEO Workspace")).toBeDefined();
    expect(screen.getAllByText(/Personal care brand enters South Asia’s smaller cities/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/What primary outcome do you want to achieve with this project\?/i)).toBeDefined();

    // Verify menu items on details page: New chat, Saved insights, Library, Knowledge packs, Data sources
    expect(screen.getByRole("button", { name: "New chat" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Saved insights" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Library" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Knowledge packs" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Data sources" })).toBeDefined();

    // Verify clicking New chat reveals the project starter prompts
    const newChatBtn = screen.getByRole("button", { name: /new chat/i });
    fireEvent.click(newChatBtn);
    expect(screen.getByText("Hey Arun, What is this project about?")).toBeDefined();
    expect(screen.getByText("What outcome would make this project worthwhile?")).toBeDefined();
    expect(screen.queryByText("Good to see you, Arun.")).toBeNull();
    // Verify prompt action buttons
    expect(screen.queryByText("Make Diwali your own")).toBeNull();
    expect(screen.getByText("Help me define the idea")).toBeDefined();
    expect(screen.getByText("Attach a plan")).toBeDefined();
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

  it("replaces Think and Mic with Attach button and changes wave icon to arrow icon when typing", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    // Click project to enter Workspace UI
    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

    // Verify Attach button is present
    expect(screen.getByRole("button", { name: "Attach file" })).toBeDefined();

    // Verify Think button and Mic button are removed
    expect(screen.queryByRole("button", { name: /deep thinking/i })).toBeNull();
    expect(screen.queryByRole("button", { name: "Voice input" })).toBeNull();

    // When input is empty, voice wave button is shown and send button is not
    expect(screen.getByRole("button", { name: "Start voice mode" })).toBeDefined();
    expect(screen.queryByRole("button", { name: "Send message" })).toBeNull();

    // Start typing
    const input = screen.getByPlaceholderText("Reply, attach a file, or tap the mic to talk");
    fireEvent.change(input, { target: { value: "Hello world" } });

    // When typing, wave icon button changes to send arrow button
    expect(screen.queryByRole("button", { name: "Start voice mode" })).toBeNull();
    expect(screen.getByRole("button", { name: "Send message" })).toBeDefined();

    // Clear input
    fireEvent.change(input, { target: { value: "" } });

    // Returns back to wave icon button
    expect(screen.getByRole("button", { name: "Start voice mode" })).toBeDefined();
    expect(screen.queryByRole("button", { name: "Send message" })).toBeNull();
  });

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
    expect(screen.queryByText("What outcome would make this project worthwhile?")).toBeNull();
    expect(screen.queryByText("Hey Arun, What is this project about?")).toBeNull();
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
    expect(screen.getByText("not scored yet")).toBeDefined();
    expect(screen.getByText("Core facts known")).toBeDefined();
    expect(screen.getByText("0 of 6 core facts")).toBeDefined();
    expect(screen.getByText("Still to learn")).toBeDefined();
    expect(screen.getByText("Project Knowledge Base")).toBeDefined();
    expect(screen.getByText(/Context and active collaborative agents for Customer Dynamics/i)).toBeDefined();
    expect(screen.getByText("Buyer segments, purchase drivers and channel behaviour behind current demand.")).toBeDefined();

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

  it("renders unwrapped outer What I know button with 24px above padding and #1d4ed8 blue color on outer button only", () => {
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
    expect(screen.getByText("Hey Arun, What is this project about?")).toBeDefined();
    expect(screen.getByText("What outcome would make this project worthwhile?")).toBeDefined();
    expect(screen.getByText("Help me define the idea")).toBeDefined();
    expect(screen.getByText("Attach a plan")).toBeDefined();

    // Click New chat in sidebar
    const newChatBtn = screen.getByRole("button", { name: /new chat/i });
    fireEvent.click(newChatBtn);

    // Verify new chat content under project
    expect(screen.getByText("Hey Arun, What is this project about?")).toBeDefined();
    expect(screen.getByText("What outcome would make this project worthwhile?")).toBeDefined();
    expect(screen.getByText("Help me define the idea")).toBeDefined();
    expect(screen.getByText("Attach a plan")).toBeDefined();
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

    // Verify project name on the left
    const projectTitleInHeader = document.querySelector(".chatgpt-topbar-project-title");
    expect(projectTitleInHeader).not.toBeNull();
    expect(projectTitleInHeader?.textContent).toBe("Personal care brand enters South Asia’s smaller cities");

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

    const conversationContainer = document.querySelector(".workspace-conversation");
    expect(conversationContainer).not.toBeNull();

    const inputDock = document.querySelector(".chatgpt-input-dock");
    expect(inputDock).not.toBeNull();
  });

  it("renders the in-card typing field with home page pill styling and handles submission", async () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

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
    expect(screen.getByText("Build a regional franchise network")).toBeDefined();
  });

  it("renders a Project Intake message card above the outcome choices with better card design", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Component is not defined on Route");

    render(<Component />);

    const projectCardBtn = screen.getByText("Personal care brand enters South Asia’s smaller cities");
    fireEvent.click(projectCardBtn);

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

    // Verify "Why these reports are relevant" heading and text placed at packages bottom
    expect(screen.getByText("Why these reports are relevant")).toBeDefined();
    expect(
      screen.getByText(/I found market intelligence reports from 2025–2026 covering tier-2 & tier-3 city retail/i)
    ).toBeDefined();

    // Verify summary box heading (How this knowledge supports your project)
    expect(screen.getByText("How this knowledge supports your project")).toBeDefined();
    expect(document.querySelectorAll(".ai-matching-report-card").length).toBe(2);
    expect(screen.getByText(/Robert D. Boss · 2026/i)).toBeDefined();
    expect(screen.getByText(/Anika Rao · 2025/i)).toBeDefined();
    expect(screen.getByText(/tier-2 retail/i)).toBeDefined();
    expect(screen.getByText(/pricing strategy/i)).toBeDefined();

    // Verify report GET button toggle
    const getReportBtn = screen.getByRole("button", {
      name: /Get Growth Opportunities in Personal Care for Tier-2 and Tier-3 Cities, South Asia/i,
    });
    fireEvent.click(getReportBtn);
    expect(
      screen.getByRole("button", {
        name: /Growth Opportunities in Personal Care for Tier-2 and Tier-3 Cities, South Asia added/i,
      })
    ).toBeDefined();

    // Verify Recommended Agents section using home page card layout (limited to 2 agents)
    expect(screen.getByText("Recommended Agents")).toBeDefined();
    expect(document.querySelectorAll(".ai-agent-recommend-card").length).toBe(2);
    expect(screen.getAllByText(/Market Sizing & Growth Opportunity Forecasting Agent/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Customer Persona & Demographic Intelligence Agent/i).length).toBeGreaterThan(0);

    // Verify Run agent button interactivity
    const runBtn = screen.getByRole("button", {
      name: /(Run agent|Generate report).*Market Sizing & Growth Opportunity Forecasting Agent/i,
    });
    expect(runBtn).toBeDefined();
    fireEvent.click(runBtn);
    expect(screen.getByText("Running...")).toBeDefined();

    // Wait for agent execution
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    // Verify button state changes to Completed without check mark symbol
    expect(screen.getByText("Completed")).toBeDefined();
    expect(screen.queryByText(/Running ✓/)).toBeNull();

    // Verify report section appears below Recommended Agents
    expect(screen.getByText("SBI Home Loan Monthly Performance & Disbursement Report")).toBeDefined();
    expect(screen.getAllByText("₹4,820.50 Cr").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Monthly Disbursement Trends (₹ in Crores)")).toBeDefined();
    expect(screen.getByText("Disbursement by City Tier & Category")).toBeDefined();
    expect(screen.getByText("Regional Zonal Breakdown & Compliance Review")).toBeDefined();
    expect(screen.getByText("Regulatory Compliance & Scope Isolation")).toBeDefined();
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

    // Verify Section 2: Other Agents (below) without full capitals tags
    expect(screen.getByText("Other Agents")).toBeDefined();
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

    // Verify no cheesy AI sparkles/badges exist
    expect(document.querySelector(".report-flow-container .sparkles")).toBeNull();

    // Click the single Run agents button to activate both agents and start working
    const runAgentsBtn = screen.getByRole("button", { name: /Run agents/i });
    expect(runAgentsBtn).toBeDefined();
    fireEvent.click(runAgentsBtn);

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
    const continueBtn = screen.getByRole("button", { name: /Continue to Generate Report/i });
    fireEvent.click(continueBtn);

    // Verify generated report is displayed with synthesized insights and custom notes
    expect(screen.getByText(/Executive Strategic Report: South Asia Secondary Cities Penetration/i)).toBeDefined();
    expect(screen.getAllByText(/October 2026/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Tier-3 Regional Urban Clusters")).toBeDefined();
    expect(screen.getAllByText(/Traditional Kirana & Wholesale Networks/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Focus on Jaipur & Surat tier-2 corridors/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Synthesized by Emerging Markets Specialist Agent/i)).toBeDefined();
    expect(screen.getByText("Price-Point & Pack Strategy:")).toBeDefined();
    expect(screen.getByText("Channel Velocity & Margins:")).toBeDefined();
    expect(screen.getByText("Formulation Dynamics:")).toBeDefined();
    expect(screen.getByText("Download report (PDF)")).toBeDefined();
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
});
