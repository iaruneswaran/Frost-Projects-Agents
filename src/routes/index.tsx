import { useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Clock,
  FileText,
  LayoutGrid,
  Menu,
  MessageSquare,
  Mic,
  Moon,
  PanelLeft,
  PanelLeftClose,
  Paperclip,
  Pencil,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import frostAtlasLogo from "@/assets/frost-atlas-Dmpxp6zQ.svg";
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
        content: "Deploy intelligent agents and coordinate collaborative.",
      },
      { property: "og:title", content: "Frost Projects — Autonomous Collaborative Projects" },
      {
        property: "og:description",
        content: "Deploy intelligent agents and coordinate collaborative.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap",
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

interface AgentItem {
  id: string;
  title: string;
  description: string;
  lastUsed?: string;
}

const initialAgents: AgentItem[] = [
  {
    id: "agent-sbi-kyc",
    title: "SBI Customer KYC & Document Verification Agent",
    description:
      "Inspects and verifies uploaded customer documents (Aadhaar, PAN, Passport, DL) for authenticity, data extraction, and regulatory KYC compliance.",
    lastUsed: "12m ago",
  },
  {
    id: "agent-sbi-home-loan",
    title: "SBI Home Loan Monthly Report",
    description:
      "Prepares monthly home-loan counts and disbursement totals for compliance review. Home loans only; excludes auto and land loans.",
    lastUsed: "45m ago",
  },
  {
    id: "agent-sbi-auto-loan",
    title: "SBI Auto Loan Monthly Report",
    description:
      "Compiles monthly auto-loan issuance totals for compliance review. Vehicle finance only; excludes home and land loans.",
    lastUsed: "2h ago",
  },
  {
    id: "agent-apollo-discharge",
    title: "Apollo Hospital  Discharge Summary",
    description:
      "Prepares weekly inpatient discharge summaries for authorized hospital reviewers. Inpatient episodes only.",
    lastUsed: "Yesterday",
  },
  {
    id: "agent-sbi-land-loan",
    title: "SBI Land Loan Quarterly Report",
    description:
      "Prepares a quarterly land-loan portfolio summary for compliance review. Agricultural and commercial land loans only.",
    lastUsed: "2 days ago",
  },
  {
    id: "agent-aiims-icu",
    title: "AIIMS ICU Occupancy Report",
    description:
      "Prepares daily ICU occupancy and critical-care summaries for authorized hospital reviewers. ICU ward data only.",
    lastUsed: "3 days ago",
  },
];

const navItems = ["Home", "Profile", "Add Tokens", "Settings"];

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
            title="Return to Home"
          >
            <div className="workspace-brand-avatar">
              <span className="w-2.5 h-2.5 rounded-sm bg-black inline-block" />
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
              <Sun className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="workspace-main">
        {/* Topbar */}
        <header className="workspace-topbar">
          <div className="workspace-topbar-left">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="workspace-back-btn"
              title="Back to Home"
              aria-label="Back to Home"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Back to Home</span>
            </button>
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
            <span className="workspace-topbar-divider" aria-hidden="true" />
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
              <DialogContent className="sm:max-w-md workspace-knowledge-dialog">
                <DialogHeader>
                  <DialogTitle className="text-zinc-900 font-bold">Project Knowledge Base</DialogTitle>
                  <DialogDescription className="text-zinc-500">
                    Context and active collaborative agents for {project.title}.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-1 text-sm">Executive Summary</h4>
                    <p className="text-zinc-600 leading-relaxed text-sm">{project.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-2 text-sm">Assigned Autonomous Agents</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.agents.map((agent) => (
                        <span key={agent} className="px-3 py-1 bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-full font-medium text-sm">
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
            <h1 className="workspace-heading">What is this project about?</h1>
            <h3 className="workspace-subheading">What outcome would make this project worthwhile?</h3>
            <p className="workspace-prompt">
              Reply below in a sentence or two, and I'll build the picture with you.
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

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface KycVerificationPageProps {
  onBack: () => void;
  onProceedToWorkspace?: (notes?: string, docs?: string[]) => void;
}

function KycVerificationPage({ onBack, onProceedToWorkspace }: KycVerificationPageProps) {
  const [documents, setDocuments] = useState<AttachedFile[]>([
    {
      id: "doc-1",
      name: "Customer_Aadhaar_Card_Front_Back.pdf",
      size: "1.8 MB",
      type: "application/pdf",
    },
    {
      id: "doc-2",
      name: "Customer_PAN_Card.jpg",
      size: "820 KB",
      type: "image/jpeg",
    },
  ]);
  const [notes, setNotes] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: "verified" | "idle";
    extractedData: {
      fullName: string;
      aadhaarNumber: string;
      panNumber: string;
      dob: string;
      complianceStatus: string;
      authenticityScore: string;
    };
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: AttachedFile[] = Array.from(files).map((file, idx) => ({
      id: `upload-${Date.now()}-${idx}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || "document",
    }));

    setDocuments((prev) => [...prev, ...newDocs]);
    toast.success(`Attached ${newDocs.length} document${newDocs.length > 1 ? "s" : ""}`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    toast.info("Document removed");
  };

  const handleVerify = () => {
    if (documents.length === 0) {
      toast.error("Please attach at least one customer document to verify");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult({
        status: "verified",
        extractedData: {
          fullName: "ARUN ESWARAN",
          aadhaarNumber: "XXXX XXXX 4829",
          panNumber: "ABCDE1234F",
          dob: "14-08-1992",
          complianceStatus: "Approved (RBI & KYC Master Direction Compliant)",
          authenticityScore: "99.8% Match",
        },
      });
      toast.success("Document verification completed successfully!");
    }, 1000);
  };

  return (
    <main className="aircond-page min-h-screen bg-background text-foreground">
      {/* Black header matching home page with heading, shortened subline, and back nav inside */}
      <header className="aircond-header mx-auto flex flex-col">
        <div className="aircond-header-top flex items-center justify-between">
          <a
            href="#top"
            className="aircond-wordmark"
            aria-label="Frost Atlas home"
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
          >
            <img
              src={frostAtlasLogo}
              alt="Frost Atlas"
              className="aircond-logo-img"
            />
          </a>
          <nav className="aircond-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item}
                href={
                  item === "Home"
                    ? "#top"
                    : item === "Profile"
                      ? "#profile"
                      : item === "Add Tokens"
                        ? "#tokens"
                        : "#settings"
                }
                onClick={(e) => {
                  if (item === "Home") {
                    e.preventDefault();
                    onBack();
                  } else {
                    e.preventDefault();
                    toast.info(item);
                  }
                }}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="aircond-login inline-flex items-center"
              onClick={() => toast.info("Log in modal")}
            >
              Log in
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Heading, shortened subline and back navigation inside the header */}
        <div className="aircond-header-bottom text-center">
          <div className="kyc-header-back-wrapper">
            <button
              type="button"
              className="kyc-header-back-btn"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" aria-hidden="true" />
              Back
            </button>
          </div>
          <h1 className="aircond-header-heading">
            SBI Customer KYC & Document Verification
          </h1>
          <p className="aircond-header-subline">
            Verifies uploaded customer documents for authenticity and KYC compliance.
          </p>
        </div>
      </header>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        id="kyc-file-input"
      />

      {/* Attachment Bar overlaid on the menu/header (820px width) */}
      <div className="kyc-attachment-bar-wrapper">
        <div
          className="kyc-upload-dropzone"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              const files = Array.from(e.dataTransfer.files);
              const newDocs: AttachedFile[] = files.map((file, idx) => ({
                id: `drop-${Date.now()}-${idx}`,
                name: file.name,
                size: `${(file.size / 1024).toFixed(1)} KB`,
                type: file.type || "document",
              }));
              setDocuments((prev) => [...prev, ...newDocs]);
              toast.success(`Attached ${newDocs.length} document${newDocs.length > 1 ? "s" : ""}`);
            }
          }}
        >
          <UploadCloud className="kyc-upload-icon" aria-hidden="true" />
          <div className="kyc-upload-text">
            <span className="kyc-upload-prompt">Click to attach documents</span> or drag and drop files here
          </div>
          <span className="kyc-upload-formats">Supported: PDF, PNG, JPG, JPEG (Max 25 MB per file)</span>
        </div>
      </div>

      {/* Unwrapped content flow below the attachment bar */}
      <div className="kyc-content-flow">
        {/* Customer Identification Documents Heading & Description below the attachment bar */}
        <div className="kyc-docs-header">
          <h3 className="kyc-section-title">Customer Identification Documents</h3>
          <p className="kyc-section-desc">
            Upload official proof of identity (Aadhaar Card, PAN Card, Passport, or Driving Licence) in PDF, PNG, or JPEG format.
          </p>

          {/* Attached Documents List */}
          {documents.length > 0 && (
            <div className="kyc-docs-list">
              {documents.map((doc) => (
                <div key={doc.id} className="kyc-doc-item">
                  <div className="kyc-doc-info">
                    <FileText className="kyc-doc-icon" aria-hidden="true" />
                    <div className="kyc-doc-text">
                      <span className="kyc-doc-name">{doc.name}</span>
                      <span className="kyc-doc-size">{doc.size}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="kyc-doc-remove-btn"
                    aria-label={`Remove ${doc.name}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Notes Field */}
        <div className="kyc-section">
          <label htmlFor="kyc-notes" className="kyc-section-title">
            Verification Instructions & Notes <span className="kyc-optional-label">(Optional)</span>
          </label>
          <textarea
            id="kyc-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add specific customer reference number, branch instructions, or address verification notes..."
            rows={3}
            className="kyc-notes-input"
          />
        </div>

        {/* Verification Result Banner (if verified) */}
        {verificationResult && (
          <div className="kyc-result-card">
            <div className="kyc-result-header">
              <ShieldCheck className="kyc-result-icon" aria-hidden="true" />
              <div>
                <h3 className="kyc-result-title">Documents Verified Successfully</h3>
                <p className="kyc-result-subtitle">Government ID format authenticated with 99.8% confidence match</p>
              </div>
            </div>
            <div className="kyc-result-grid">
              <div className="kyc-result-item">
                <span className="kyc-result-key">Customer Name</span>
                <span className="kyc-result-val">{verificationResult.extractedData.fullName}</span>
              </div>
              <div className="kyc-result-item">
                <span className="kyc-result-key">Aadhaar (Masked)</span>
                <span className="kyc-result-val">{verificationResult.extractedData.aadhaarNumber}</span>
              </div>
              <div className="kyc-result-item">
                <span className="kyc-result-key">PAN Number</span>
                <span className="kyc-result-val">{verificationResult.extractedData.panNumber}</span>
              </div>
              <div className="kyc-result-item">
                <span className="kyc-result-key">Date of Birth</span>
                <span className="kyc-result-val">{verificationResult.extractedData.dob}</span>
              </div>
              <div className="kyc-result-item kyc-result-full">
                <span className="kyc-result-key">Compliance Status</span>
                <span className="kyc-result-val">{verificationResult.extractedData.complianceStatus}</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Action Footer */}
        <div className="kyc-actions-footer">
          <Button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying}
            className="kyc-verify-btn"
          >
            {isVerifying ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                Verifying Documents...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 mr-2" aria-hidden="true" />
                Verify Document
              </>
            )}
          </Button>

          {verificationResult && onProceedToWorkspace && (
            <button
              type="button"
              className="kyc-proceed-btn"
              onClick={() => onProceedToWorkspace(notes, documents.map((d) => d.name))}
            >
              Open in Project Workspace
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

interface CreateAgentPageProps {
  onBack: () => void;
  onCreateAgent: (data: { name: string; role: string }) => void;
  initialData?: { name?: string; role?: string; goal?: string; context?: string };
  isEdit?: boolean;
}

interface TeamMember {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: string;
}

function CreateAgentPage({ onBack, onCreateAgent, initialData, isEdit }: CreateAgentPageProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(initialData?.name || "");
  const [role, setRole] = useState(initialData?.role || "");
  const [primaryGoal, setPrimaryGoal] = useState(initialData?.goal || "");
  const [projectContext, setProjectContext] = useState(initialData?.context || "");
  const [inviteEmail, setInviteEmail] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([
    { id: "1", initials: "EA", name: "Guy Hawkins", email: "hello@deserve.studio", role: "Analyst" },
    { id: "2", initials: "TW", name: "Theresa Webb", email: "manhhachkt08@gmail.com", role: "Owner" },
    { id: "3", initials: "DS", name: "Darrell Steward", email: "bill.sanders@example.com", role: "Analyst" },
  ]);
  const [responsibilities, setResponsibilities] = useState<string[]>([
    "Synthesize market dynamics and prioritize expansion milestones",
  ]);
  const [researchVariables, setResearchVariables] = useState<string[]>([
    "Customer demand elasticity across Tier-2/3 cities",
  ]);
  const [expectedDeliverables, setExpectedDeliverables] = useState("");
  const [workingInstructions, setWorkingInstructions] = useState("");
  const [constraints, setConstraints] = useState("");
  const [knowledgeSources, setKnowledgeSources] = useState("");
  const [collaboration, setCollaboration] = useState("");
  const [testPrompt, setTestPrompt] = useState("");

  const handleAddMember = () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter a member email address");
      return;
    }
    const cleanEmail = inviteEmail.trim();
    const namePart = cleanEmail.split("@")[0] || "User";
    const initials = (namePart.slice(0, 2) || "MB").toUpperCase();
    setMembers((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        initials,
        name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
        email: cleanEmail,
        role: "Analyst",
      },
    ]);
    setInviteEmail("");
    toast.success("Member added");
  };

  const handleUpdateMemberRole = (id: string, newRole: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role: newRole } : m)));
  };

  const handleAddResponsibility = () => {
    setResponsibilities((prev) => [...prev, ""]);
  };

  const handleUpdateResponsibility = (index: number, val: string) => {
    setResponsibilities((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleRemoveResponsibility = (index: number) => {
    setResponsibilities((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const handleAddVariable = () => {
    setResearchVariables((prev) => [...prev, ""]);
  };

  const handleUpdateVariable = (index: number, val: string) => {
    setResearchVariables((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleRemoveVariable = (index: number) => {
    setResearchVariables((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const handleNextFromStep1 = () => {
    if (!name.trim()) {
      toast.error("Please enter an Agent Name");
      return;
    }
    if (!role.trim()) {
      toast.error("Please enter an Agent Role");
      return;
    }
    setCurrentStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter an Agent Name");
      setCurrentStep(1);
      return;
    }
    if (!role.trim()) {
      toast.error("Please enter an Agent Role");
      setCurrentStep(1);
      return;
    }
    onCreateAgent({ name: name.trim(), role: role.trim() });
  };

  return (
    <div className="dark-agent-page">
      <div className="dark-agent-container">
        {/* Top Stepper Capsule matching reference design */}
        <nav className="dark-agent-stepper" aria-label="Creation Steps">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`dark-step-pill ${currentStep === 1 ? "active" : currentStep > 1 ? "completed" : ""}`}
          >
            <span className="dark-step-circle">1</span>
            <span className="dark-step-title">Agent Identity</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!name.trim() || !role.trim()) {
                toast.error("Please complete Agent Name and Role in Step 1 first");
              } else {
                setCurrentStep(2);
              }
            }}
            className={`dark-step-pill ${currentStep === 2 ? "active" : currentStep > 2 ? "completed" : ""}`}
          >
            <span className="dark-step-circle">2</span>
            <span className="dark-step-title">Scope & Variables</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!name.trim() || !role.trim()) {
                toast.error("Please complete Agent Name and Role in Step 1 first");
              } else {
                setCurrentStep(3);
              }
            }}
            className={`dark-step-pill ${currentStep === 3 ? "active" : ""}`}
          >
            <span className="dark-step-circle">3</span>
            <span className="dark-step-title">Review & Submit</span>
          </button>
        </nav>

        {/* Hero Icon Badge */}
        <div className="dark-agent-icon-badge" aria-hidden="true">
          <Plus className="h-5 w-5" />
        </div>

        {/* Main Title & Subtitle */}
        <div className="dark-agent-header-text">
          <h1 className="dark-agent-heading">
            {currentStep === 1 && (isEdit ? "Edit your agent" : "Create your agent")}
            {currentStep === 2 && "Configure capabilities"}
            {currentStep === 3 && (isEdit ? "Review & save instructions" : "Review & launch instructions")}
          </h1>
          <p className="dark-agent-subheading">
            {currentStep === 1 && "You can create more agents later or coordinate collaborative workflows with a single agent"}
            {currentStep === 2 && "Configure operational responsibilities, research variables, and knowledge sources"}
            {currentStep === 3 && "Verify agent parameters and launch instructions before saving"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="dark-agent-form">
          {currentStep === 1 && (
            <div className="dark-step-content">
              {/* Agent Name */}
              <div className="dark-agent-field">
                <label htmlFor="agent-name-input" className="dark-agent-label">
                  Agent Name
                </label>
                <input
                  id="agent-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Emerging Markets Strategist"
                  className="dark-agent-input"
                  required
                />
                <span className="dark-agent-hint">
                  Associate the seed scope with a specific agent persona or group
                </span>
              </div>

              {/* Agent Role */}
              <div className="dark-agent-field">
                <label htmlFor="agent-role-input" className="dark-agent-label">
                  Agent Role
                </label>
                <input
                  id="agent-role-input"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead Market Research & Geographic Expansion Specialist"
                  className="dark-agent-input"
                  required
                />
                <span className="dark-agent-hint">
                  Core domain authority, persona, and functional specialization
                </span>
              </div>

              {/* Invite Members */}
              <div className="dark-agent-field">
                <label htmlFor="agent-member-input" className="dark-agent-label">
                  Invite Members
                </label>
                <div className="dark-agent-invite-row">
                  <input
                    id="agent-member-input"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddMember();
                      }
                    }}
                    placeholder="Member mail"
                    className="dark-agent-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="dark-agent-invite-btn"
                  >
                    Add Users
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="dark-agent-field">
                <label className="dark-agent-label">Members</label>
                <div className="dark-agent-members-list">
                  {members.map((member) => (
                    <div key={member.id} className="dark-agent-member-row">
                      <div className="dark-agent-member-left">
                        <div className="dark-agent-member-avatar">{member.initials}</div>
                        <div className="dark-agent-member-info">
                          <span className="dark-agent-member-name">{member.name}</span>
                          <span className="dark-agent-member-email">{member.email}</span>
                        </div>
                      </div>
                      <div className="dark-agent-member-role-select">
                        <select
                          value={member.role}
                          onChange={(e) => handleUpdateMemberRole(member.id, e.target.value)}
                          className="dark-agent-select"
                          aria-label={`Role for ${member.name}`}
                        >
                          <option value="Analyst">Analyst</option>
                          <option value="Owner">Owner</option>
                          <option value="Strategist">Strategist</option>
                          <option value="Specialist">Specialist</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Goal */}
              <div className="dark-agent-field">
                <label htmlFor="agent-goal-input" className="dark-agent-label">
                  Primary Goal
                </label>
                <textarea
                  id="agent-goal-input"
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  placeholder="Define the primary business outcome or mission objective this agent must accomplish..."
                  className="dark-agent-textarea"
                  rows={2}
                />
                <span className="dark-agent-hint">
                  Primary strategic milestone or analytical deliverable this agent strives to accomplish
                </span>
              </div>

              {/* Project Context */}
              <div className="dark-agent-field">
                <label htmlFor="agent-context-input" className="dark-agent-label">
                  Project Context
                </label>
                <textarea
                  id="agent-context-input"
                  value={projectContext}
                  onChange={(e) => setProjectContext(e.target.value)}
                  placeholder="Workspace domain, target audience, market dynamics, or operational backdrop..."
                  className="dark-agent-textarea"
                  rows={2}
                />
                <span className="dark-agent-hint">
                  Strategic environment and operational parameters the agent should ground its reasoning in
                </span>
              </div>

              {/* Footer Buttons for Step 1 */}
              <div className="dark-agent-footer">
                <button
                  type="button"
                  onClick={onBack}
                  className="dark-agent-secondary-btn"
                  title="Back"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep1}
                  className="dark-agent-primary-btn"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="dark-step-content">
              {/* Responsibilities */}
              <div className="dark-agent-field">
                <div className="dark-agent-field-header">
                  <label className="dark-agent-label">
                    Responsibilities
                  </label>
                  <button
                    type="button"
                    onClick={handleAddResponsibility}
                    className="dark-agent-pill-add-btn"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
                <span className="dark-agent-hint">
                  Concrete tasks, operational duties, and procedural workflows owned by this agent
                </span>
                <div className="dark-agent-list">
                  {responsibilities.map((resp, idx) => (
                    <div key={idx} className="dark-agent-list-row">
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) => handleUpdateResponsibility(idx, e.target.value)}
                        placeholder={`Responsibility #${idx + 1}`}
                        className="dark-agent-input"
                      />
                      {responsibilities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveResponsibility(idx)}
                          className="dark-agent-delete-btn"
                          title="Remove responsibility"
                          aria-label="Remove responsibility"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Variables */}
              <div className="dark-agent-field">
                <div className="dark-agent-field-header">
                  <label className="dark-agent-label">
                    Research Variables
                  </label>
                  <button
                    type="button"
                    onClick={handleAddVariable}
                    className="dark-agent-pill-add-btn"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Variable</span>
                  </button>
                </div>
                <span className="dark-agent-hint">
                  Key data vectors, market factors, customer segments, or elasticity parameters to evaluate
                </span>
                <div className="dark-agent-list">
                  {researchVariables.map((variable, idx) => (
                    <div key={idx} className="dark-agent-list-row">
                      <input
                        type="text"
                        value={variable}
                        onChange={(e) => handleUpdateVariable(idx, e.target.value)}
                        placeholder={`Variable #${idx + 1}`}
                        className="dark-agent-input"
                      />
                      {researchVariables.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariable(idx)}
                          className="dark-agent-delete-btn"
                          title="Remove variable"
                          aria-label="Remove variable"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Deliverables */}
              <div className="dark-agent-field">
                <label htmlFor="agent-deliverables-input" className="dark-agent-label">
                  Expected Deliverables
                </label>
                <textarea
                  id="agent-deliverables-input"
                  value={expectedDeliverables}
                  onChange={(e) => setExpectedDeliverables(e.target.value)}
                  placeholder="Specify the tangible outputs, reports, data schemas, or decision briefs produced..."
                  className="dark-agent-textarea"
                  rows={3}
                />
                <span className="dark-agent-hint">
                  Standard format and key components of final synthesis deliverables
                </span>
              </div>

              {/* Knowledge Sources */}
              <div className="dark-agent-field">
                <label htmlFor="agent-sources-input" className="dark-agent-label">
                  Knowledge Sources
                </label>
                <textarea
                  id="agent-sources-input"
                  value={knowledgeSources}
                  onChange={(e) => setKnowledgeSources(e.target.value)}
                  placeholder="Documentation, proprietary data sets, URLs, APIs, or literature repositories..."
                  className="dark-agent-textarea"
                  rows={3}
                />
                <span className="dark-agent-hint">
                  Primary data stores, knowledge bases, and verified references accessible to the agent
                </span>
              </div>

              {/* Footer Buttons for Step 2 */}
              <div className="dark-agent-footer">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="dark-agent-secondary-btn"
                  title="Back"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="dark-agent-primary-btn"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="dark-step-content">
              {/* Working Instructions */}
              <div className="dark-agent-field">
                <label htmlFor="agent-instructions-input" className="dark-agent-label">
                  Working Instructions
                </label>
                <textarea
                  id="agent-instructions-input"
                  value={workingInstructions}
                  onChange={(e) => setWorkingInstructions(e.target.value)}
                  placeholder="Step-by-step reasoning protocol, analytical methodology, and operational procedures..."
                  className="dark-agent-textarea"
                  rows={3}
                />
                <span className="dark-agent-hint">
                  Strict operational guidelines, triage steps, and problem-solving methodology
                </span>
              </div>

              {/* Constraints */}
              <div className="dark-agent-field">
                <label htmlFor="agent-constraints-input" className="dark-agent-label">
                  Constraints
                </label>
                <textarea
                  id="agent-constraints-input"
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  placeholder="Explicit boundaries, compliance restrictions, budget limits, or out-of-scope actions..."
                  className="dark-agent-textarea"
                  rows={3}
                />
                <span className="dark-agent-hint">
                  Hard restrictions, compliance guardrails, and prohibited operations
                </span>
              </div>

              {/* Collaboration */}
              <div className="dark-agent-field">
                <label htmlFor="agent-collab-input" className="dark-agent-label">
                  Collaboration
                </label>
                <textarea
                  id="agent-collab-input"
                  value={collaboration}
                  onChange={(e) => setCollaboration(e.target.value)}
                  placeholder="Cooperating agents, escalation protocols, and human checkpoint requirements..."
                  className="dark-agent-textarea"
                  rows={3}
                />
                <span className="dark-agent-hint">
                  Multi-agent handshake rules, delegation protocols, and human approvals
                </span>
              </div>

              {/* Test Prompt */}
              <div className="dark-agent-field">
                <label htmlFor="agent-test-input" className="dark-agent-label">
                  Test Prompt
                </label>
                <textarea
                  id="agent-test-input"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="Provide a benchmark scenario or sample question to validate agent capability before deployment..."
                  className="dark-agent-textarea"
                  rows={3}
                />
                <span className="dark-agent-hint">
                  Verification probe to evaluate the agent before saving into active swarms
                </span>
              </div>

              {/* Agent Summary Card */}
              <div className="dark-agent-summary-card">
                <div className="dark-agent-summary-header">
                  <div className="dark-agent-summary-avatar">
                    {name ? name.slice(0, 2).toUpperCase() : "AG"}
                  </div>
                  <div>
                    <h4 className="dark-agent-summary-name">{name || "Untitled Agent"}</h4>
                    <p className="dark-agent-summary-role">{role || "Specialist Agent"}</p>
                  </div>
                </div>
                {primaryGoal && (
                  <p className="dark-agent-summary-goal">
                    <strong>Goal:</strong> {primaryGoal}
                  </p>
                )}
                <div className="dark-agent-summary-stats">
                  <span>{members.length} Members</span>
                  <span>•</span>
                  <span>{responsibilities.filter(Boolean).length} Responsibilities</span>
                  <span>•</span>
                  <span>{researchVariables.filter(Boolean).length} Variables</span>
                </div>
              </div>

              {/* Footer Buttons for Step 3 */}
              <div className="dark-agent-footer">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="dark-agent-secondary-btn"
                  title="Back"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="dark-agent-primary-btn"
                >
                  {isEdit ? "Save Changes" : "Create Agent"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function Index() {
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectGoal, setProjectGoal] = useState("");
  const [agentsCount, setAgentsCount] = useState(3);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [projectsCount, setProjectsCount] = useState(initialProjects.length);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "agents">("projects");
  const [agents, setAgents] = useState<AgentItem[]>(initialAgents);
  const [editingAgent, setEditingAgent] = useState<AgentItem | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isCreateAgentView, setIsCreateAgentView] = useState(false);
  const [isKycVerificationView, setIsKycVerificationView] = useState(false);
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

  const filteredAgents = agents.filter((agent) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      agent.title.toLowerCase().includes(q) ||
      agent.description.toLowerCase().includes(q)
    );
  });

  if (isCreateAgentView) {
    return (
      <>
        <CreateAgentPage
          initialData={
            editingAgent
              ? {
                  name: editingAgent.title,
                  role: "Domain Specialist",
                  goal: editingAgent.description,
                  context: "Automated Enterprise Workspace",
                }
              : undefined
          }
          isEdit={!!editingAgent}
          onBack={() => {
            setIsCreateAgentView(false);
            setEditingAgent(null);
          }}
          onCreateAgent={(data) => {
            if (editingAgent) {
              setAgents((prev) =>
                prev.map((a) =>
                  a.id === editingAgent.id
                    ? { ...a, title: data.name }
                    : a
                )
              );
              toast.success(`Agent "${data.name}" updated successfully!`);
            } else {
              setAgentsCount((prev) => prev + 1);
              toast.success(`Agent "${data.name}" created successfully!`);
            }
            setIsCreateAgentView(false);
            setEditingAgent(null);
          }}
        />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  if (isKycVerificationView) {
    return (
      <>
        <KycVerificationPage
          onBack={() => setIsKycVerificationView(false)}
          onProceedToWorkspace={() => {
            setIsKycVerificationView(false);
            const kycProj = projects.find((p) => p.title.includes("KYC"));
            if (kycProj) {
              setActiveProjectId(kycProj.id);
            } else {
              const newKycProject: ProjectItem = {
                id: "agent-sbi-kyc",
                title: "SBI Customer KYC & Document Verification Agent",
                description:
                  "Inspects and verifies uploaded customer documents (Aadhaar, PAN, Passport, DL) for authenticity, data extraction, and regulatory KYC compliance.",
                agents: ["SBI KYC Specialist", "Document Authenticator"],
                url: "#agent-sbi-kyc",
              };
              setProjects((prev) => [newKycProject, ...prev]);
              setActiveProjectId("agent-sbi-kyc");
            }
          }}
        />
        <Toaster position="top-center" richColors />
      </>
    );
  }

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
    <main className="aircond-page min-h-screen bg-background text-foreground">
      <header className="aircond-header mx-auto flex flex-col">
        <div className="aircond-header-top flex items-center justify-between">
          <a href="#top" className="aircond-wordmark" aria-label="Frost Atlas home">
            <img
              src={frostAtlasLogo}
              alt="Frost Atlas"
              className="aircond-logo-img"
            />
          </a>
          <nav className="aircond-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item}
                href={
                  item === "Home"
                    ? "#top"
                    : item === "Profile"
                      ? "#profile"
                      : item === "Add Tokens"
                        ? "#tokens"
                        : "#settings"
                }
                onClick={(e) => {
                  if (item !== "Home") {
                    e.preventDefault();
                    toast.info(item);
                  }
                }}
              >
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
            Deploy intelligent agents and coordinate collaborative.
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

            <Button
              className="tile-action-btn"
              onClick={() => setIsCreateAgentView(true)}
            >
              Create Agent
              <ArrowUpRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Button>
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
                    <Button type="submit" className="rounded-full bg-foreground text-background">
                      Create Project
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <section id="projects" className="aircond-mission mx-auto">
        <span id="mission" aria-hidden="true" className="sr-only" />
        <div className="projects-header">
          <h2 className="projects-title">
            {activeTab === "projects" ? "Active Projects & Agent Teams" : "Autonomous Collaborative Agents"}
          </h2>

          <div className="projects-header-toolbar">
            <div className="projects-search-bar">
              <Search className="search-icon" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === "projects" ? "Search projects..." : "Search agents..."}
                className="projects-search-input"
                aria-label={activeTab === "projects" ? "Search projects" : "Search agents"}
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

            <div className="projects-tabs" role="tablist" aria-label="Projects and Agents selection">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "projects"}
                onClick={() => {
                  setActiveTab("projects");
                  setSearchQuery("");
                }}
                className={`projects-tab-btn ${activeTab === "projects" ? "active" : ""}`}
              >
                Projects
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "agents"}
                onClick={() => {
                  setActiveTab("agents");
                  setSearchQuery("");
                }}
                className={`projects-tab-btn ${activeTab === "agents" ? "active" : ""}`}
              >
                Agents
              </button>
            </div>
          </div>
        </div>

        {activeTab === "projects" ? (
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
                  <span className="project-card-agents-label">Agents</span>
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
        ) : (
          <div className="projects-grid">
            {filteredAgents.map((agent) => (
              <article
                key={agent.id}
                className="project-card agent-card"
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) {
                    return;
                  }
                  if (agent.id === "agent-sbi-kyc" || agent.title.includes("KYC")) {
                    setIsKycVerificationView(true);
                    return;
                  }
                  const existing = projects.find((p) => p.title === agent.title);
                  if (existing) {
                    setActiveProjectId(existing.id);
                  } else {
                    const agentP: ProjectItem = {
                      id: agent.id,
                      title: agent.title,
                      description: agent.description,
                      agents: [agent.title],
                      url: `#${agent.id}`,
                    };
                    setProjects((prev) => [agentP, ...prev]);
                    setActiveProjectId(agent.id);
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
                          if (agent.id === "agent-sbi-kyc" || agent.title.includes("KYC")) {
                            setIsKycVerificationView(true);
                            return;
                          }
                          const existing = projects.find((p) => p.title === agent.title);
                          if (existing) {
                            setActiveProjectId(existing.id);
                          } else {
                            const agentP: ProjectItem = {
                              id: agent.id,
                              title: agent.title,
                              description: agent.description,
                              agents: [agent.title],
                              url: `#${agent.id}`,
                            };
                            setProjects((prev) => [agentP, ...prev]);
                            setActiveProjectId(agent.id);
                          }
                        }}
                      >
                        {agent.title}
                      </button>
                    </h3>
                    <button
                      type="button"
                      className="project-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (agent.id === "agent-sbi-kyc" || agent.title.includes("KYC")) {
                          setIsKycVerificationView(true);
                          return;
                        }
                        const existing = projects.find((p) => p.title === agent.title);
                        if (existing) {
                          setActiveProjectId(existing.id);
                        } else {
                          const agentP: ProjectItem = {
                            id: agent.id,
                            title: agent.title,
                            description: agent.description,
                            agents: [agent.title],
                            url: `#${agent.id}`,
                          };
                          setProjects((prev) => [agentP, ...prev]);
                          setActiveProjectId(agent.id);
                        }
                      }}
                      aria-label={`Open agent: ${agent.title}`}
                    >
                      <ArrowUpRight aria-hidden="true" />
                    </button>
                  </div>
                  <p className="project-card-description">{agent.description}</p>
                </div>

                <div className="agent-card-footer">
                  <span className="agent-last-used">
                    <Clock className="agent-clock-icon" aria-hidden="true" />
                    <span>Last used {agent.lastUsed || "recently"}</span>
                  </span>

                  <button
                    type="button"
                    className="agent-edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProjectId(null);
                      setEditingAgent(agent);
                      setIsCreateAgentView(true);
                    }}
                    aria-label={`Edit ${agent.title}`}
                  >
                    <Pencil className="agent-pencil-icon" aria-hidden="true" />
                    <span>Edit</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab === "projects" && filteredProjects.length === 0 && (
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

        {activeTab === "agents" && filteredAgents.length === 0 && (
          <div className="projects-empty-state">
            <p>No agents found matching "{searchQuery}"</p>
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