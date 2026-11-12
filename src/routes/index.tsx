import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  LayoutGrid,
  Menu,
  Mic,
  Moon,
  PanelLeft,
  PanelLeftClose,
  Paperclip,
  Plus,
  Search,
  Settings,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Frost Projects — Autonomous Collaborative Projects" },
      {
        name: "description",
        content: "Deploy intelligent autonomous agents and coordinate collaborative projects with ease.",
      },
      { property: "og:title", content: "Frost Projects — Autonomous Collaborative Projects" },
      {
        property: "og:description",
        content: "Deploy intelligent autonomous agents and coordinate collaborative projects with ease.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  agents: string[];
  url: string;
}

interface MessageItem {
  id: string;
  sender: "user" | "assistant";
  text: string;
}

const initialProjects: ProjectItem[] = [
  {
    id: "personal-care-south-asia",
    title: "Personal care brand enters South Asia’s smaller cities",
    description:
      "A mid-sized European skincare company has stalled in metro markets. It wants to grow in Tier-2 and Tier-3 cities across South Asia but doesn’t know which cities, price points or channels to prioritize.",
    agents: [
      "Emerging Markets",
      "Customer Dynamics",
      "Geographic Expansion",
      "Distribution Channel Optimisation",
    ],
    url: "https://frost-ai.vizru-aix.workers.dev/projects/personal-care-south-asia",
  },
  {
    id: "customer-dynamics",
    title: "Customer Dynamics: who is buying, and why",
    description:
      "Buyer segments, purchase drivers and channel behaviour behind current demand.",
    agents: ["Customer Segmentation", "Purchase Drivers", "Channel Behaviour"],
    url: "https://frost-ai.vizru-aix.workers.dev/projects/customer-dynamics",
  },
  {
    id: "competitive-benchmark-positioning",
    title: "Competitive Benchmark & Positioning",
    description:
      "Comparing rivals on share, price, capability and brand position.",
    agents: ["Competitive Intelligence", "Brand Positioning", "Benchmarking"],
    url: "https://frost-ai.vizru-aix.workers.dev/projects/competitive-benchmark-positioning",
  },
  {
    id: "tech-enabled-gtm-roadmap",
    title: "Tech-Enabled Go-to-Market Roadmap",
    description:
      "Tools, data and automation needed to run go-to-market at scale.",
    agents: ["Go-to-Market", "Sales Technology", "Marketing Automation"],
    url: "https://frost-ai.vizru-aix.workers.dev/projects/tech-enabled-gtm-roadmap",
  },
  {
    id: "untitled-project-1",
    title: "Untitled project",
    description: "Collaborative multi-agent execution pipeline configured for workspace goals.",
    agents: ["Autonomous Agent"],
    url: "#projects",
  },
  {
    id: "expand-enterprise-accounts",
    title: "Expand Enterprise Accounts across LATAM",
    description: "Enterprise tier client expansion pipeline and partner distribution network.",
    agents: ["Enterprise Sales", "Regional Expansion", "Account Management"],
    url: "#projects",
  },
];

const navItems = ["Projects", "Advantages", "Career", "News", "Team"];

function ProjectWorkspace({
  project,
  projects,
  onSelectProject,
  onBackToDashboard,
  onAddNewProject,
}: {
  project: ProjectItem;
  projects: ProjectItem[];
  onSelectProject: (id: string) => void;
  onBackToDashboard: () => void;
  onAddNewProject: () => void;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);

  const handleSend = (presetText?: string) => {
    const text = (presetText || inputValue).trim();
    if (!text) return;

    const userMessage: MessageItem = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    setTimeout(() => {
      let reply = `Understood. For "${project.title}", I have initialized the core context. I'll coordinate the collaborative agents (${project.agents.join(", ")}) to formulate the exact plan. What target milestone or key outcome would make this project worthwhile?`;
      if (text.toLowerCase().includes("define the idea")) {
        reply = `Let's define the scope for "${project.title}":\n1. Target Market & Audience: Which region or customer segment drives maximum initial impact?\n2. Value Proposition: What key advantage differentiates this solution?\n3. Success Criteria: What primary metric determines a successful deployment?`;
      } else if (text.toLowerCase().includes("attach a plan")) {
        reply = `I'm ready to review your plan for "${project.title}". You can upload documents, presentations, or data tables, and I'll extract key milestones, budget assumptions, and required agent capabilities.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "assistant",
          text: reply,
        },
      ]);
    }, 500);
  };

  return (
    <div className="workspace-container">
      {/* Left Sidebar */}
      <aside className={`workspace-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        {/* Workspace Brand / Header */}
        <div className="workspace-header">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="workspace-brand"
            title="Return to Dashboard"
          >
            <div className="workspace-brand-avatar">
              <span className="w-2.5 h-2.5 rounded-sm bg-white inline-block" />
            </div>
            <span className="workspace-brand-name">CEO Workspace</span>
          </button>
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(true)}
            className="workspace-collapse-btn"
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        {/* New Project Button */}
        <div className="workspace-new-project-wrap">
          <button
            type="button"
            onClick={onAddNewProject}
            className="workspace-new-project-btn"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>New project</span>
          </button>
        </div>

        {/* Dashboard Navigation */}
        <button
          type="button"
          onClick={onBackToDashboard}
          className="workspace-dashboard-btn"
        >
          <LayoutGrid className="h-4 w-4 text-muted-foreground mr-2.5" />
          <span>Dashboard</span>
        </button>

        {/* Projects Section */}
        <div className="workspace-section-label">Projects</div>
        <div className="workspace-projects-list">
          {projects.map((p) => {
            const isActive = p.id === project.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectProject(p.id)}
                className={`workspace-project-item ${isActive ? "active" : ""}`}
              >
                <span className="workspace-project-item-title">{p.title}</span>
                <span className="workspace-project-item-dash">—</span>
              </button>
            );
          })}
        </div>

        {/* Chats in this project */}
        <div className="workspace-section-label">Chats in this project</div>
        <button
          type="button"
          onClick={() => {
            setMessages([]);
            toast.success("Started a new chat");
          }}
          className="workspace-chat-btn"
        >
          <Plus className="h-4 w-4 text-muted-foreground mr-2" />
          <span>New chat</span>
        </button>

        {/* Sidebar Footer */}
        <div className="workspace-sidebar-footer">
          <button
            type="button"
            onClick={() => toast.info("Settings")}
            className="workspace-settings-btn"
          >
            <Settings className="h-4 w-4 text-muted-foreground mr-2.5" />
            <span>Settings</span>
          </button>

          <div className="workspace-profile-row">
            <button
              type="button"
              className="workspace-profile-user"
              onClick={() => toast.info("User: ARUN PE (CEO)")}
            >
              <div className="workspace-profile-avatar">AP</div>
              <span className="workspace-profile-name">ARUN PE</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1" />
            </button>
            <button
              type="button"
              className="workspace-theme-toggle"
              title="Light theme active"
              onClick={() => toast.info("Brand Lite Theme active")}
            >
              <Moon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="workspace-main">
        {/* Topbar */}
        <header className="workspace-topbar">
          <div className="workspace-topbar-left">
            {isSidebarCollapsed && (
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="workspace-sidebar-open-btn"
                title="Open sidebar"
                aria-label="Open sidebar"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            )}
            <h2 className="workspace-topbar-title">{project.title}</h2>
          </div>

          <div className="workspace-topbar-right">
            <Dialog open={isKnowledgeOpen} onOpenChange={setIsKnowledgeOpen}>
              <DialogTrigger asChild>
                <button type="button" className="workspace-topbar-btn">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>What I know</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Project Knowledge Base</DialogTitle>
                  <DialogDescription>
                    Context and active collaborative agents for {project.title}.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm">Executive Summary</h4>
                    <p className="text-muted-foreground leading-relaxed text-sm">{project.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 text-sm">Assigned Autonomous Agents</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.agents.map((agent) => (
                        <span key={agent} className="px-3 py-1 bg-muted rounded-full font-medium text-sm">
                          {agent}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Canvas Body */}
        <div className="workspace-canvas">
          <div className="workspace-content-container">
            <div className="workspace-eyebrow">Let's start with the idea</div>
            <h1 className="workspace-heading">What is this project about?</h1>
            <h3 className="workspace-subheading">What outcome would make this project worthwhile?</h3>
            <p className="workspace-prompt">
              Reply below in a sentence or two. I'll ask the next question and build the picture with you.
            </p>

            {/* Action Buttons */}
            <div className="workspace-actions">
              <button
                type="button"
                onClick={() => handleSend("Help me define the idea")}
                className="workspace-btn-primary"
              >
                <span>Help me define the idea</span>
                <ArrowUpRight className="h-4 w-4 ml-1.5" />
              </button>
              <button
                type="button"
                onClick={() => handleSend("Attach a plan")}
                className="workspace-btn-secondary"
              >
                <Paperclip className="h-4 w-4 mr-2" />
                <span>Attach a plan</span>
              </button>
            </div>

            <p className="workspace-footnote">
              A rough idea is enough. Costs, benefits, timing and the owner can come later.
            </p>

            {/* Messages Thread */}
            {messages.length > 0 && (
              <div className="workspace-conversation">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`workspace-message ${m.sender === "user" ? "user-message" : "ai-message"}`}
                  >
                    <div className="whitespace-pre-line">{m.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Floating Input Dock */}
        <div className="workspace-dock-wrapper">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="workspace-dock"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Reply, attach a file, or tap the mic to talk"
              className="workspace-dock-input"
            />
            <div className="workspace-dock-actions">
              <button
                type="button"
                onClick={() => handleSend("Attach a plan")}
                className="workspace-dock-icon-btn"
                title="Attach file"
                aria-label="Attach file"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => toast.info("Microphone listening...")}
                className="workspace-dock-icon-btn"
                title="Voice input"
                aria-label="Voice input"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="workspace-dock-send-btn"
                title="Send reply"
                aria-label="Send reply"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Index() {
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentRole, setAgentRole] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectGoal, setProjectGoal] = useState("");
  const [agentsCount, setAgentsCount] = useState(3);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [projectsCount, setProjectsCount] = useState(initialProjects.length);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [expandedBadges, setExpandedBadges] = useState<Record<string, boolean>>({});

  const filteredProjects = projects.filter((project) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const inTitle = project.title.toLowerCase().includes(q);
    const inDesc = project.description.toLowerCase().includes(q);
    const inAgents = project.agents.some((agent) =>
      agent.toLowerCase().includes(q)
    );
    return inTitle || inDesc || inAgents;
  });

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  if (activeProjectId && activeProject) {
    return (
      <>
        <ProjectWorkspace
          project={activeProject}
          projects={projects}
          onSelectProject={(id) => setActiveProjectId(id)}
          onBackToDashboard={() => setActiveProjectId(null)}
          onAddNewProject={() => {
            const newId = `untitled-${Date.now()}`;
            const newP: ProjectItem = {
              id: newId,
              title: "Untitled project",
              description: "New autonomous collaborative initiative scoping.",
              agents: ["Autonomous Agent"],
              url: `#${newId}`,
            };
            setProjects((prev) => [newP, ...prev]);
            setProjectsCount((prev) => prev + 1);
            setActiveProjectId(newId);
            toast.success("Created new untitled project");
          }}
        />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName.trim()) {
      toast.error("Please enter an agent name");
      return;
    }
    setAgentsCount((prev) => prev + 1);
    toast.success(`Agent "${agentName}" created successfully!`);
    setAgentName("");
    setAgentRole("");
    setIsAgentOpen(false);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }
    const newProject: ProjectItem = {
      id: `project-${Date.now()}`,
      title: projectName.trim(),
      description:
        projectGoal.trim() ||
        "Collaborative multi-agent execution pipeline configured for workspace goals.",
      agents: ["Autonomous Agent"],
      url: "#projects",
    };
    setProjects((prev) => [newProject, ...prev]);
    setProjectsCount((prev) => prev + 1);
    toast.success(`Project "${projectName}" created successfully!`);
    setProjectName("");
    setProjectGoal("");
    setIsProjectOpen(false);
  };

  return (
    <main className="aircond-page min-h-screen overflow-hidden bg-background text-foreground">
      <header className="aircond-header mx-auto flex flex-col">
        <div className="aircond-header-top flex items-center justify-between">
          <a href="#top" className="aircond-wordmark" aria-label="Frost Projects home">
            Frost Projects
          </a>
          <nav className="aircond-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item} href={item === "Projects" ? "#projects" : "#solutions"}>
                {item}
              </a>
            ))}
          </nav>
          <Button className="aircond-login" asChild>
            <a href="#solutions">Log in <ArrowUpRight aria-hidden="true" /></a>
          </Button>
          <Button className="aircond-mobile-menu" variant="ghost" size="icon" aria-label="Open menu">
            <Menu aria-hidden="true" />
          </Button>
        </div>
        <div className="aircond-header-bottom text-center">
          <h1 className="aircond-header-heading">
            Autonomous Collaborative Projects
          </h1>
          <p className="aircond-header-subline">
            Deploy intelligent autonomous agents and coordinate collaborative with ease.
          </p>
        </div>
      </header>

      <section id="top" className="aircond-hero mx-auto">
        <div id="solutions" className="aircond-solutions" aria-label="Create agents and projects">
          <div className="aircond-tile tile-home">
            <div className="tile-content">
              <div className="tile-header">
                <span className="tile-title">Agents</span>
                <span className="tile-count">{agentsCount}</span>
              </div>
              <p className="tile-copy">Build, configure, and deploy AI agents.</p>
            </div>

            <Dialog open={isAgentOpen} onOpenChange={setIsAgentOpen}>
              <DialogTrigger asChild>
                <Button className="tile-action-btn">
                  Create Agent
                  <ArrowUpRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Agent</DialogTitle>
                  <DialogDescription>
                    Configure an autonomous agent with customized capabilities, personality, and instructions.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateAgent} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="agent-name">Agent Name</Label>
                    <Input
                      id="agent-name"
                      placeholder="e.g. Research Specialist, Code Reviewer"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="agent-role">Role & Expertise</Label>
                    <Input
                      id="agent-role"
                      placeholder="e.g. Data extraction, workflow automation"
                      value={agentRole}
                      onChange={(e) => setAgentRole(e.target.value)}
                    />
                  </div>
                  <DialogFooter className="pt-2">
                    <Button type="submit" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                      Create Agent
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <span className="tile-curve" aria-hidden="true" />
          </div>

          <div className="aircond-tile tile-system">
            <div className="tile-content">
              <div className="tile-header">
                <span className="tile-title">Projects</span>
                <span className="tile-count">{projectsCount}</span>
              </div>
              <p className="tile-copy">Coordinate multi-agent teams and workspace goals.</p>
            </div>

            <Dialog open={isProjectOpen} onOpenChange={setIsProjectOpen}>
              <DialogTrigger asChild>
                <Button className="tile-action-btn">
                  Create Project
                  <ArrowUpRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Group agents into a cohesive project with unified goals and shared resources.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      placeholder="e.g. Customer Support Swarm, Market Tracker"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="project-goal">Primary Objective</Label>
                    <Input
                      id="project-goal"
                      placeholder="e.g. Automate end-to-end customer triage"
                      value={projectGoal}
                      onChange={(e) => setProjectGoal(e.target.value)}
                    />
                  </div>
                  <DialogFooter className="pt-2">
                    <Button type="submit" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                      Create Project
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <span className="tile-curve" aria-hidden="true" />
          </div>
        </div>

        <span className="aircond-orbit orbit-one" aria-hidden="true" />
        <span className="aircond-orbit orbit-two" aria-hidden="true" />
      </section>

      <section id="projects" className="aircond-mission mx-auto">
        <span id="mission" aria-hidden="true" className="sr-only" />
        <div className="projects-header">
          <h2 className="projects-title">Active Projects & Agent Teams</h2>

          <div className="projects-search-bar">
            <Search className="search-icon" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="projects-search-input"
              aria-label="Search projects"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="search-clear-btn"
                aria-label="Clear search query"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className={`project-card ${expandedBadges[project.id] ? "expanded" : ""}`}
              onClick={() => setActiveProjectId(project.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveProjectId(project.id);
                }
              }}
            >
              <div className="project-card-main">
                <div className="project-card-header">
                  <h3 className="project-card-title">
                    <button
                      type="button"
                      className="project-title-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProjectId(project.id);
                      }}
                    >
                      {project.title}
                    </button>
                  </h3>
                  <button
                    type="button"
                    className="project-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProjectId(project.id);
                    }}
                    aria-label={`Open project: ${project.title}`}
                  >
                    <ArrowUpRight aria-hidden="true" />
                  </button>
                </div>
                <p className="project-card-description">{project.description}</p>
              </div>

              <div className={`project-card-agents ${expandedBadges[project.id] ? "expanded" : ""}`}>
                <div className="project-card-agents-row">
                  {(project.agents.length > 3 ? project.agents.slice(0, 3) : project.agents).map((agent) => (
                    <span key={agent} className="project-agent-badge">
                      {agent}
                    </span>
                  ))}
                  {project.agents.length > 3 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedBadges((prev) => ({
                          ...prev,
                          [project.id]: !prev[project.id],
                        }));
                      }}
                      className={`project-agent-round-badge ${expandedBadges[project.id] ? "active" : ""}`}
                      title={
                        expandedBadges[project.id]
                          ? "Hide extra agents"
                          : `+${project.agents.length - 3} more`
                      }
                      aria-label={
                        expandedBadges[project.id]
                          ? "Hide extra agents"
                          : `+${project.agents.length - 3} more agents`
                      }
                    >
                      {expandedBadges[project.id] ? "−" : `+${project.agents.length - 3}`}
                    </button>
                  )}
                </div>

                {expandedBadges[project.id] && project.agents.length > 3 && (
                  <div className="project-card-agents-extra">
                    {project.agents.slice(3).map((agent) => (
                      <span key={agent} className="project-agent-badge">
                        {agent}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="projects-empty-state">
            <p>No projects found matching "{searchQuery}"</p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="projects-empty-reset"
            >
              Clear search
            </button>
          </div>
        )}
      </section>
      <Toaster position="top-center" richColors />
    </main>
  );
}