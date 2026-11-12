import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
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
      { title: "Frost Projects — Autonomous agents and collaborative projects" },
      {
        name: "description",
        content: "Deploy intelligent autonomous agents and coordinate collaborative projects with ease.",
      },
      { property: "og:title", content: "Frost Projects — Autonomous agents and collaborative projects" },
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
];

const navItems = ["Projects", "Advantages", "Career", "News", "Team"];

function Index() {
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentRole, setAgentRole] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectGoal, setProjectGoal] = useState("");
  const [agentsCount, setAgentsCount] = useState(3);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [projectsCount, setProjectsCount] = useState(4);
  const [searchQuery, setSearchQuery] = useState("");

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
            Autonomous agents and collaborative projects
          </h1>
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
              placeholder="Search projects by name, description, or agent tag..."
              className="projects-search-input"
              aria-label="Search projects by name, description, or agent"
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
            <article key={project.id} className="project-card">
              <div className="project-card-left">
                <div className="project-card-left-top">
                  <span className="project-card-eyebrow">Strategic Project</span>
                  <h3 className="project-card-title">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.title}
                    </a>
                  </h3>
                  <p className="project-card-description">{project.description}</p>
                </div>
                <div className="project-card-left-bottom">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-action-link"
                    aria-label={`Open project: ${project.title}`}
                  >
                    <span>Open Project</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="project-card-right">
                <div className="project-agents-list">
                  {project.agents.map((agent, index) => (
                    <div key={agent} className="project-agent-item">
                      <span className="project-agent-name">{agent}</span>
                      <span className="project-agent-role">
                        Specialized Agent • 0{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
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