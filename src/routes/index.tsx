import { useState, useRef, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  AtSign,
  AudioLines,
  BookOpen,
  Bookmark,
  Brain,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Clock3,
  Database,
  Download,
  FileSpreadsheet,
  Folder,
  Library,
  Menu,
  Mic,
  Minus,
  Moon,
  PanelLeft,
  Paperclip,
  Pause,
  Pencil,
  Pin,
  Play,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Square,
  SquarePen,
  Store,
  Sun,
  Trash2,
  TrendingUp,
  UploadCloud,
  Users,
  X,
} from "lucide-react";

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

export interface InteractiveQuestionData {
  step: number;
  totalSteps: number;
  title: string;
  question: string;
  options: string[];
  answeredOption?: string;
}

export interface AttachedFileItem {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "image" | "file";
  previewUrl?: string;
  file?: File;
}

interface MessageItem {
  id: string;
  sender: "user" | "assistant";
  text: string;
  agentTitle?: string;
  relatedQuestions?: string[];
  interactiveQuestion?: InteractiveQuestionData;
  attachments?: AttachedFileItem[];
}

export interface ReportFlowState {
  activeAgentId: string | null;
  selectedAgentId: string | null;
  selectedAgentIds?: string[];
  hasRunAgents?: boolean;
  isGenerating?: boolean;
  agent1Fields: {
    period: string;
    geography: string;
    metric: string;
  };
  agent2Fields: {
    cohort: string;
    baseline: string;
    channel: string;
    customNotes?: string;
  };
  isAgent2Active: boolean;
  isReportGenerated: boolean;
}

export const defaultReportFlowState: ReportFlowState = {
  activeAgentId: null,
  selectedAgentId: null,
  selectedAgentIds: [],
  hasRunAgents: false,
  isGenerating: false,
  agent1Fields: {
    period: "June 2026",
    geography: "Tier-2 Priority Growth Cities",
    metric: "Retail Price Elasticity & Pack Sizing",
  },
  agent2Fields: {
    cohort: "Aspirational Mass-Premium Buyers",
    baseline: "Domestic Legacy Skincare Brands",
    channel: "Modern Trade & Quick Commerce",
    customNotes: "",
  },
  isAgent2Active: false,
  isReportGenerated: false,
};

export const REPORT_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ReportCalendarDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedYear = useMemo(() => {
    const match = value.match(/\b(20\d\d)\b/);
    return match ? parseInt(match[1], 10) : 2026;
  }, [value]);

  const parsedMonth = useMemo(() => {
    const idx = REPORT_MONTHS.findIndex((m) =>
      value.toLowerCase().includes(m.toLowerCase().slice(0, 3))
    );
    return idx >= 0 ? idx : 5; // Default June
  }, [value]);

  const [selectedYear, setSelectedYear] = useState(parsedYear);
  const [selectedMonth, setSelectedMonth] = useState(parsedMonth);

  useEffect(() => {
    setSelectedYear(parsedYear);
    setSelectedMonth(parsedMonth);
  }, [parsedYear, parsedMonth]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  const handleSelectMonth = (mIdx: number) => {
    setSelectedMonth(mIdx);
    const updated = `${REPORT_MONTHS[mIdx]} ${selectedYear}`;
    onChange(updated);
  };

  const handleSelectYear = (yr: number) => {
    setSelectedYear(yr);
    const updated = `${REPORT_MONTHS[selectedMonth]} ${yr}`;
    onChange(updated);
  };

  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const firstDayOfWeek = useMemo(() => {
    return new Date(selectedYear, selectedMonth, 1).getDay();
  }, [selectedYear, selectedMonth]);

  const availableYears = [2024, 2025, 2026, 2027, 2028, 2030];

  return (
    <div className="report-flow-calendar-container" ref={containerRef}>
      <button
        type="button"
        className={`report-flow-calendar-trigger ${isOpen ? "report-flow-calendar-trigger--open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Select reporting month and year"
      >
        <Calendar className="report-flow-cal-icon" />
        <span className="report-flow-cal-trigger-text">
          {REPORT_MONTHS[selectedMonth]} {selectedYear}
        </span>
        <ChevronDown className={`report-flow-cal-chevron ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="report-flow-calendar-dropdown" role="dialog" aria-label="Month and Year Calendar Selector">
          {/* Header with year selection & chevrons */}
          <div className="report-cal-header">
            <div className="report-cal-nav-row">
              <button
                type="button"
                className="report-cal-nav-btn"
                onClick={() => handleSelectYear(selectedYear - 1)}
                aria-label="Previous Year"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="report-cal-year-display">
                <span className="report-cal-year-label">{selectedYear}</span>
              </div>
              <button
                type="button"
                className="report-cal-nav-btn"
                onClick={() => handleSelectYear(selectedYear + 1)}
                aria-label="Next Year"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Year selector pills */}
            <div className="report-cal-years-pills">
              {availableYears.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  className={`report-cal-year-pill ${yr === selectedYear ? "report-cal-year-pill--active" : ""}`}
                  onClick={() => handleSelectYear(yr)}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Month selector grid */}
          <div className="report-cal-months-section">
            <span className="report-cal-section-subtitle">Select Month</span>
            <div className="report-cal-months-grid">
              {REPORT_MONTHS.map((mName, idx) => {
                const isSelected = idx === selectedMonth;
                return (
                  <button
                    key={mName}
                    type="button"
                    className={`report-cal-month-btn ${isSelected ? "report-cal-month-btn--active" : ""}`}
                    onClick={() => handleSelectMonth(idx)}
                    aria-label={`${mName} ${selectedYear}`}
                  >
                    {mName.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calendar days view preview */}
          <div className="report-cal-days-section">
            <div className="report-cal-days-header">
              <span>{REPORT_MONTHS[selectedMonth]} {selectedYear} Calendar</span>
            </div>
            <div className="report-cal-weekdays-row">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <span key={day} className="report-cal-weekday-label">
                  {day}
                </span>
              ))}
            </div>
            <div className="report-cal-days-grid">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <span key={`empty-${i}`} className="report-cal-day-empty" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    className="report-cal-day-cell"
                    onClick={() => {
                      const updated = `${REPORT_MONTHS[selectedMonth]} ${selectedYear}`;
                      onChange(updated);
                      setIsOpen(false);
                    }}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dropdown footer with presets & Done */}
          <div className="report-cal-footer">
            <div className="report-cal-presets">
              {[
                "June 2026",
                "December 2025",
                "April 2026",
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="report-cal-preset-btn"
                  onClick={() => {
                    onChange(preset);
                    setIsOpen(false);
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="report-cal-done-btn"
              onClick={() => setIsOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export const CHANNEL_OPTIONS = [
  {
    label: "Modern Trade & Quick Commerce",
    description: "Blinkit, Zepto, Instamart & Nykaa quick fulfillment for high inventory turnover",
  },
  {
    label: "Traditional Kirana & Wholesale Networks",
    description: "Deep tier-2/3 physical presence with 18–21% trade distributor margins",
  },
  {
    label: "Omnichannel Trial Kit Sampling",
    description: "Low-cost discovery sachets (₹49–₹99) driving trial without margin drag",
  },
  {
    label: "Regional Pharmacy & Health Counters",
    description: "Dermatologist-recommended wellness positioning in regional retail chains",
  },
  {
    label: "Direct-to-Consumer (D2C) Digital Corridors",
    description: "Targeted regional social commerce & localized language storefronts",
  },
];

export function ReportSelectDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; description?: string }[];
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find((o) => o.label === value) || options[0];

  return (
    <div className="report-flow-select-container" ref={containerRef}>
      <button
        type="button"
        className={`report-flow-select-trigger ${isOpen ? "report-flow-select-trigger--open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Select ${label}`}
      >
        <span className="report-flow-select-trigger-text">{selectedOption ? selectedOption.label : value}</span>
        <ChevronDown className={`report-flow-select-chevron ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="report-flow-select-dropdown" role="listbox" aria-label={label}>
          {options.map((opt) => {
            const isSelected = opt.label === value;
            return (
              <button
                key={opt.label}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`report-flow-select-option ${isSelected ? "report-flow-select-option--active" : ""}`}
                onClick={() => {
                  onChange(opt.label);
                  setIsOpen(false);
                }}
              >
                <div className="report-flow-select-option-content">
                  <span className="report-flow-select-option-title">{opt.label}</span>
                  {opt.description && (
                    <span className="report-flow-select-option-desc">{opt.description}</span>
                  )}
                </div>
                {isSelected && <Check className="h-4 w-4 ml-2 flex-shrink-0 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AdobeAcrobatPdfIcon({ className = "kyc-doc-acrobat-icon" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="6" fill="#E5252A" />
      <path
        d="M25.525 18.4375C24.025 16.8375 19.9375 17.5375 18.95 17.6375C17.55 16.2375 16.5625 14.65 16.1625 14.05C16.6625 12.55 17.0625 10.8625 17.0625 9.26246C17.0625 7.76246 16.4625 6.27496 14.875 6.27496C14.275 6.27496 13.775 6.57496 13.475 7.07496C12.775 8.27496 13.075 10.6625 14.175 13.15C13.575 14.95 12.575 17.6375 11.3875 19.725C9.7875 20.325 6.3 21.9125 6 23.7125C5.9 24.2125 6.1 24.8125 6.5 25.1125C6.9 25.5125 7.4 25.6125 7.9 25.6125C9.9875 25.6125 12.0875 22.725 13.5875 20.125C14.7875 19.725 16.675 19.125 18.575 18.825C20.7625 20.825 22.7625 21.1125 23.7625 21.1125C25.1625 21.1125 25.6625 20.5125 25.85 20.0125C26.1125 19.5375 25.925 18.8375 25.525 18.4375ZM24.125 19.4375C24.025 19.8375 23.525 20.2375 22.625 20.0375C21.525 19.7375 20.5375 19.2375 19.7375 18.5375C20.4375 18.4375 22.125 18.2375 23.325 18.4375C23.725 18.5375 24.225 18.8375 24.125 19.4375ZM14.45 7.47496C14.55 7.27496 14.75 7.17496 14.95 7.17496C15.45 7.17496 15.55 7.77496 15.55 8.27496C15.45 9.47496 15.25 10.7625 14.85 11.8625C14.05 9.67496 14.15 8.07496 14.45 7.47496ZM14.35 18.7375C14.85 17.8375 15.45 16.15 15.65 15.55C16.15 16.45 17.05 17.45 17.45 17.9375C17.55 17.85 15.75 18.2375 14.35 18.7375ZM10.9625 21.0375C9.575 23.225 8.275 24.625 7.475 24.625C7.375 24.625 7.175 24.625 7.075 24.525C6.975 24.325 6.875 24.125 6.975 23.925C7.075 23.125 8.675 22.025 10.9625 21.0375Z"
        fill="white"
      />
    </svg>
  );
}

export function GradientRingSpinner({ className = "ai-gradient-ring" }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true" role="presentation">
      <svg
        viewBox="0 0 50 50"
        className="ai-gradient-ring-svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="ai-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="35%" stopColor="#818cf8" />
            <stop offset="70%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e4b8d" />
          </linearGradient>
        </defs>
        <circle
          cx="25"
          cy="25"
          r="19"
          fill="none"
          stroke="url(#ai-ring-gradient)"
          strokeWidth="4.5"
        />
      </svg>
    </div>
  );
}

export const PixelMandalaSpinner = GradientRingSpinner;

export interface KnowledgePackFile {
  title: string;
  date: string;
  meta: string;
}

export interface KnowledgePack {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  filesCount: number;
  creditsRequired?: string | number;
  availableCredits?: string | number;
  price?: string;
  bundlePrice?: string;
  files: KnowledgePackFile[];
}

export const defaultKnowledgePacks: KnowledgePack[] = [
  {
    id: "pack-south-asia-entry",
    title: "South Asia Tier-2 & Tier-3 City Market Penetration",
    subtitle: "City selection, price points and channels for smaller-city growth.",
    tag: "Personal care brand enters South Asia’s smaller cities · 3 files",
    filesCount: 3,
    creditsRequired: "4,000",
    availableCredits: "12,000",
    price: "4,000",
    bundlePrice: "4,000",
    files: [
      {
        title: "Growth Opportunities in Personal Care for Tier-2 and Tier-3 Cities, South Asia, 2025–2030",
        date: "June 2026",
      },
      {
        title: "Price-Point & Pack-Size Strategy for Mass-Premium Skincare in Emerging South Asian Markets",
        date: "December 2025",
      },
      {
        title: "Distribution Channel Optimisation: Modern Trade, Quick Commerce and Kirana Networks",
        date: "December 2026",
      },
    ],
  },
  {
    id: "pack-active-ingredients",
    title: "Personal Care Ingredients & Formulation Dynamics",
    subtitle: "Active, functional and strategic ingredient research.",
    tag: "Personal care brand enters South Asia’s smaller cities · 3 files",
    filesCount: 3,
    creditsRequired: "4,000",
    availableCredits: "12,000",
    price: "4,000",
    bundlePrice: "4,000",
    files: [
      {
        title: "Top 10 Strategic Imperatives in Personal Care Ingredients, 2026",
        date: "April 2026",
      },
      {
        title: "Personal Care Active Ingredients Market, South Asia Outlook, 2024–2031",
        date: "April 2025",
      },
      {
        title: "Frost Radar™: Personal Care Functional Ingredients, 2025",
        date: "June 2025",
      },
    ],
  },
];

export interface MatchingReport {
  id: string;
  title: string;
  author: string;
  year: string;
  summary: string;
  quote: string;
  tags: string[];
}

export const defaultMatchingReports: MatchingReport[] = [
  {
    id: "rep-growth-opps",
    title: "Growth Opportunities in Personal Care for Tier-2 and Tier-3 Cities, South Asia",
    author: "Robert D. Boss",
    year: "2026",
    summary: "Strategic evaluation of consumer spending shifts, purchasing power, and regional brand adoption across 24 secondary urban clusters.",
    quote: "“Identifies aspirational skincare adoption expanding at 18.4% CAGR in non-metro corridors, with consumers migrating rapidly toward premium formulations.”",
    tags: [],
  },
  {
    id: "rep-price-point",
    title: "Price-Point & Pack-Size Strategy for Mass-Premium Skincare in Emerging South Asian Markets",
    author: "Anika Rao",
    year: "2025",
    summary: "Price elasticity analysis, sachet trial economics, and mass-premium threshold benchmarks across emerging city retail channels.",
    quote: "“Finds ₹299–₹449 discovery packs and trial kits generate 2.8x higher repeat adoption than standard full-size SKUs in smaller cities.”",
    tags: [],
  },
  {
    id: "rep-dist-channel",
    title: "Distribution Channel Optimisation: Modern Trade, Quick Commerce and Kirana Networks",
    author: "Tomás Ferreira",
    year: "2026",
    summary: "Retail logistics architecture, regional stockist margin tiers, and dark store quick-commerce penetration across non-metro trade hubs.",
    quote: "“Compares neighborhood chemist networks with 30-minute quick commerce, demonstrating a 64% increase in regional retail velocity.”",
    tags: ["quick commerce", "kirana networks", "modern trade", "channel logistics"],
  },
  {
    id: "rep-active-ingredients",
    title: "Personal Care Active & Functional Ingredients: South Asia Regional Outlook",
    author: "Marcus Lee",
    year: "2025",
    summary: "Climate-adaptive formulation dynamics, barrier-repair efficacy, and tropical skin phototype dermatological requirements.",
    quote: "“Projects lightweight barrier-repair actives and niacinamide sun-defense hybrids to capture 42% of tier-2 anti-pollution skincare demand.”",
    tags: ["active ingredients", "formulation", "dermatology", "climate-adaptive"],
  },
  {
    id: "rep-distributor-margins",
    title: "Wholesale FMCG & General-Trade Distributor Margin Benchmarks across Secondary Hubs",
    author: "Priya Sundaram",
    year: "2025",
    summary: "Distributor trade economics, payment cycles, and shelf-space acquisition dynamics against established domestic FMCG incumbents.",
    quote: "“Establishes a 14–16% trade margin tier with performance rebates as the critical incentive for distributor shelf-space conversion.”",
    tags: ["trade margins", "distributor economics", "shelf space", "wholesale FMCG"],
  },
  {
    id: "rep-consumer-habits",
    title: "Consumer Purchasing Habits & Dermatological Priorities Across 24 Priority Urban Hubs",
    author: "David Vance",
    year: "2026",
    summary: "Demographic survey of skincare ritual adoption, regional influencer impact, and dermatological brand credibility among 4,800 shoppers.",
    quote: "“Reveals 71% of secondary-city skincare buyers consult verified dermatologist content and peer reviews prior to first-time purchase.”",
    tags: ["consumer research", "demographics", "brand credibility", "skincare rituals"],
  },
];

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
    title: "Expand Enterprise Account",
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
    title: "Customer Persona & Demographic Intelligence Agent",
    description:
      "Analyzes customer demographic cohorts, regional purchasing patterns, and buyer persona profiles across secondary urban corridors.",
    lastUsed: "12m ago",
  },
  {
    id: "agent-sbi-home-loan",
    title: "Market Sizing & Growth Opportunity Forecasting Agent",
    description:
      "Evaluates regional total addressable market (TAM), category CAGR, and market expansion opportunities across secondary urban hubs.",
    lastUsed: "45m ago",
  },
  {
    id: "agent-sbi-auto-loan",
    title: "Competitive Pricing & Channel Intelligence Agent",
    description:
      "Monitors competitive pricing dynamics, trade margin structures, and distributor channel velocity across regional markets.",
    lastUsed: "2h ago",
  },
  {
    id: "agent-apollo-discharge",
    title: "Apollo Hospital Discharge Summary",
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

const navItems = ["Home", "Packs", "Settings"];

const projectChatsMap: Record<string, string[]> = {
  "personal-care-south-asia": [
    "Tier-2 Market Penetration Strategy",
    "Regional Distribution Channel Analysis",
    "Consumer Demographics & Pricing",
  ],
  "customer-dynamics": [
    "Buyer Segments & Purchase Drivers",
    "Channel Behaviour Analysis",
    "Customer Journey & Retention",
  ],
  "competitive-benchmark-positioning": [
    "Competitor Market Share Matrix",
    "Brand Positioning Strategy",
    "Rival Capabilities & Benchmarks",
  ],
  "tech-enabled-gtm-roadmap": [
    "Sales Technology Integration",
    "Marketing Automation Pipeline",
    "GTM Execution Milestones",
  ],
  "untitled-project-1": [
    "Autonomous Agent Execution",
    "Collaborative Workflow Setup",
  ],
  "expand-enterprise-accounts": [
    "Enterprise Partner Distribution",
    "Regional Sales Pipeline",
    "LATAM Account Strategy",
  ],
};

const personalCareInitialMessages: MessageItem[] = [
  {
    id: "msg-pc-1",
    sender: "user",
    text: "Personal care brand enters South Asia’s smaller cities",
  },
  {
    id: "msg-pc-2",
    sender: "assistant",
    text: `Project brief confirmed, Arun! We've received your project brief for Personal care brand enters South Asia’s smaller cities.

What primary outcome do you want to achieve with this project?

Launch a new AI product or service

Automate internal operations & reduce costs

Expand into a new customer segment or region

Accelerate enterprise sales & revenue growth

Or in your own words
Type your answer and press Enter`,
  },
];

const personalCareDoneMessages: MessageItem[] = [
  ...personalCareInitialMessages,
  {
    id: "msg-pc-3",
    sender: "user",
    text: "Expand into a new customer segment or region",
  },
  {
    id: "msg-pc-4",
    sender: "assistant",
    text: `I found market intelligence reports from 2025–2026 covering tier-2 & tier-3 city retail, price elasticity, active ingredients, and channel distribution. The most relevant are “Growth Opportunities in Personal Care for Tier-2 and Tier-3 Cities, South Asia” and “Price-Point & Pack-Size Strategy for Mass-Premium Skincare”. Together they discuss how these themes connect, from consumer price sensitivity and local retailer margins to climate-adaptive formulations for regional market penetration.`,
  },
];

const initialProjectConversations: Record<string, MessageItem[]> = {
  "personal-care-south-asia": [],
  "personal-care-south-asia-0": personalCareDoneMessages,
};

interface SubChatItem {
  id: string;
  title: string;
}

const buildInitialProjectChats = (): Record<string, SubChatItem[]> => {
  const result: Record<string, SubChatItem[]> = {};
  Object.entries(projectChatsMap).forEach(([projId, list]) => {
    result[projId] = list.map((title, idx) => ({
      id: `${projId}-${idx}`,
      title,
    }));
  });
  return result;
};

const getProjectRelatedAgents = (proj: ProjectItem): AgentItem[] => {
  if (proj.id === "personal-care-south-asia") {
    return [
      {
        id: "proj-agent-emerging-markets",
        title: "Emerging Markets Specialist Agent",
        description:
          "Strategic analysis of Tier-2 and Tier-3 city retail corridors, consumer purchasing shifts, and aspirational brand adoption.",
        lastUsed: "Active now",
      },
      {
        id: "proj-agent-customer-dynamics",
        title: "Customer Dynamics & Segmentation Agent",
        description:
          "Evaluates demographic buying patterns, price sensitivity, and regional skincare ritual adoption across secondary urban clusters.",
        lastUsed: "15m ago",
      },
      {
        id: "proj-agent-geographic-expansion",
        title: "Geographic Expansion Strategy Agent",
        description:
          "Models localized channel economics, distributor trade margins, and physical retail distribution velocity across priority hubs.",
        lastUsed: "1h ago",
      },
    ];
  }

  const tags =
    proj.agents && proj.agents.length > 0
      ? proj.agents.slice(0, 3)
      : ["Strategic Intelligence", "Customer Dynamics", "Operational Roadmap"];

  return tags.slice(0, 3).map((tag, idx) => ({
    id: `proj-agent-${proj.id}-${idx}`,
    title: `${tag} Specialist Agent`,
    description: `Coordinates ${tag.toLowerCase()} workflows, synthesized market datasets, and execution milestones for ${proj.title}.`,
    lastUsed: idx === 0 ? "Active now" : `${(idx + 1) * 20}m ago`,
  }));
};

const generateAgentResponse = (agent: AgentItem, query: string, proj: ProjectItem): string => {
  const cleanQuery = query.trim().replace(/[#*]/g, "") || `Strategic priority analysis for ${proj.title}`;
  const title = agent.title;

  let raw = "";
  if (title.includes("Emerging Markets")) {
    raw = `Strategic Intelligence Briefing: Emerging Markets
Prepared by Emerging Markets Specialist Agent for ${proj.title}

Our comprehensive analysis of non-metro retail corridors in South Asia reveals that Tier-2 and Tier-3 urban clusters represent the single largest growth horizon for ${proj.title}. While metro markets face hyper-competitive discounting and surging customer acquisition costs, secondary cities like Jaipur, Lucknow, Indore, Chandigarh, and Surat demonstrate an unprecedented 3.4x faster velocity in mass-premium skincare adoption. Regional consumers are actively migrating from unbranded or commodity formulations to derm-active formulations with clear efficacy claims.

In evaluating "${cleanQuery}", retail distribution dynamics demand an agile omnichannel strategy. While modern trade supermarket corridors capture high-street visibility, over 70% of non-metro beauty volume flows through regional high-frequency kirana networks and rapidly expanding quick-commerce dark stores. Structuring distributor trade margins at 12–14% and local retail margins at 18–22% guarantees prime counter placement and active counter-recommendation against legacy multinational incumbents.

Furthermore, aspirational brand adoption in secondary cities is tightly linked to trial packaging and localized pricing corridors. High-conversion market entry hinges on deploying ₹199–₹299 introductory trial packs (30ml/50g) highlighting proven active ingredients like Niacinamide, Hyaluronic Acid, and Cica. This removes trial friction, drives rapid initial volume, and establishes a loyal customer base that seamlessly transitions into complete daily skincare routines within 60 to 90 days.`;
  } else if (title.includes("Customer Dynamics")) {
    raw = `Demographic Buying Patterns & Ritual Adoption Report
Prepared by Customer Dynamics & Segmentation Agent for ${proj.title}

A granular examination of demographic buying cohorts across secondary urban centers indicates an emergent, highly aspirational buyer segment. SEC A and B households in Tier-2 hubs (such as Indore, Coimbatore, and Vadodara) exhibit rising disposable incomes and high digital connectivity. Rather than copying metro beauty trends, these regional consumers prioritize demonstrable skin barrier health and climate-adaptive formulations suited to local environmental conditions.

Regarding "${cleanQuery}", price sensitivity analysis identifies a decisive conversion threshold at ₹399. Below this threshold, particularly within the ₹229–₹279 band, conversion rates increase by 3.2x compared to full-sized ₹500+ SKUs. Younger consumers (aged 18–34) actively seek non-comedogenic hydration and broad-spectrum daily sun protection, routinely vetting active ingredient percentages through vernacular creator reviews before purchasing.

Skincare ritual adoption across secondary clusters favors intuitive, simplified 3-step daily regimens—Cleanse, Treat, and Protect—over complex multi-step routines. Positioning your European skincare heritage around effortless daily protection, combined with climate-specific claims (anti-pollution, humidity-resistant barrier defense), builds immediate trust and sustains high repurchase retention across priority regional clusters.`;
  } else if (title.includes("Geographic Expansion")) {
    raw = `Localized Channel Economics & Distribution Model
Prepared by Geographic Expansion Strategy Agent for ${proj.title}

Expanding into South Asia's secondary cities requires a phased cluster-based deployment rather than a fragmented multi-state rollout. By grouping high-potential cities into regional logistics clusters—the Western Cluster (Ahmedabad, Surat, Vadodara), the Northern Corridor (Jaipur, Lucknow, Chandigarh), and the Southern Hubs (Coimbatore, Kochi, Visakhapatnam)—your operational supply chain achieves maximum freight efficiency while reinforcing regional marketing resonance.

In addressing "${cleanQuery}", channel economics must be calibrated for mutual profitability across the value chain. Traditional carrying and forwarding (C&F) agents operate on 10–12% margins with 21-day credit terms, while regional retail stockists require 18–22% margins to prioritize shelf space against entrenched FMCG conglomerates. Offering specialized merchandising display stands, complimentary trial sachets, and clear inventory exchange policies will accelerate retail onboarding.

Physical retail penetration must be synchronized with high-velocity quick-commerce availability. Quick-commerce dark stores in Tier-2 hubs are experiencing over 40% month-on-month throughput growth, capturing instant-need and impulse personal care purchases. Establishing regional distribution hubs within a 4-hour replenishment radius guarantees 98%+ stock availability, preventing stock-outs from interrupting consumer momentum.`;
  } else if (title.includes("Customer Persona")) {
    raw = `Customer Persona & Demographic Intelligence Briefing
Prepared by Customer Persona & Demographic Intelligence Agent for ${proj.title}

Our demographic research identifies two core buyer personas spearheading personal care adoption in secondary urban corridors: "The Aspirational Professional" (women aged 22–32 in banking, education, and tech seeking clinical skincare results) and "The Pragmatic Homemaker" (women aged 30–45 seeking reliable, gentle barrier care for the household). Both cohorts exhibit strong brand loyalty once product reliability and gentle skin tolerance are proven.

Evaluating "${cleanQuery}", purchasing behavior reveals an average initial transaction value of ₹420, frequently combining a targeted treatment serum with an essential daily sunscreen or cleanser. Discovery is heavily driven by vernacular regional beauty creators and micro-influencer communities, whose peer reviews carry 4.5x more credibility than traditional celebrity endorsements.

To convert these demographic cohorts into sustained brand advocates for "${proj.title}", your packaging and communication should highlight concrete clinical validations: dermatologically tested stamps, percentage concentrations of active botanicals, and hypoallergenic certifications. Adding QR codes linking to localized vernacular usage tutorials creates a friction-free onboarding experience.`;
  } else if (title.includes("Market Sizing")) {
    raw = `Regional TAM & Growth Opportunity Forecast
Prepared by Market Sizing & Growth Opportunity Forecasting Agent for ${proj.title}

The total addressable market (TAM) for mass-premium personal care across South Asia's Tier-2 and Tier-3 urban centers is estimated at $3.82 billion, expanding at a robust 16.4% CAGR through 2028. This significantly outpaces metro market growth (8.1% CAGR), driven by rising disposable incomes, rapid retail modernization, and consumer awareness of specialized dermatological skincare.

In terms of "${cleanQuery}", our segment forecasts project that daily photoprotection (SPF 50+), brightening facial serums, and lightweight barrier moisturizers will account for 62% of incremental revenue expansion. Securing a modest 2.5% market share across the top 24 non-metro urban clusters translates to an annualized net revenue opportunity of $95.5 million within 24 months of full commercial activation.

To maximize capital efficiency, we recommend a 3-phase rollout: Phase 1 activates the top 6 commercial clusters with dense quick-commerce coverage; Phase 2 expands into 18 secondary wholesale distribution hubs; Phase 3 scales into tier-3 general trade retail networks. This phased approach maintains positive cash flow and healthy unit economics from month 6 onward.`;
  } else if (title.includes("Competitive Pricing")) {
    raw = `Competitive Pricing Dynamics & Channel Velocity Report
Prepared by Competitive Pricing & Channel Intelligence Agent for ${proj.title}

A competitive pricing audit across secondary urban hubs reveals that mass FMCG brands dominate the sub-₹150 price band, while luxury international labels remain confined to metro department stores at ₹800+. The strategic white space for ${proj.title} is the mass-premium sweet spot between ₹199 and ₹349—where consumers actively seek premium European efficacy without feeling price resistance.

Regarding "${cleanQuery}", trade promotional structures must be engineered to disrupt established regional players. Offering distributors an attractive 12% baseline margin plus a 3% quarterly volume rebate, coupled with 20% retailer trade margins, secures prominent shelf positioning and enthusiastic shopkeeper recommendations over incumbent brands.

Channel velocity benchmarks confirm that introductory cross-category bundles (such as "Buy Serum at ₹299, get Hydrating Cleanser trial for ₹99") yield 42% higher basket sizes and reduce purchase hesitancy by over 60%. Enforcing strict minimum advertised price (MAP) policies across digital platforms and physical outlets prevents regional price disparities and maintains distributor trust.`;
  } else if (title.includes("Apollo Hospital")) {
    raw = `Clinical Discharge Workflow & Care Transition Summary
Prepared by Apollo Hospital Discharge Summary Agent

Our clinical review of inpatient discharge workflows demonstrates that standardized electronic discharge documentation and timely medication reconciliation reduce 30-day readmission rates by 18.4%. Case summaries for authorized clinical reviewers prioritize primary diagnoses, surgical interventions, and post-discharge recovery monitoring protocols.

Addressing "${cleanQuery}", clinical transition tracking monitors post-acute recovery milestones, lab biomarker trends, and physician follow-up schedules. Standardizing inpatient discharge dossiers guarantees comprehensive regulatory compliance with hospital accreditation guidelines and medical review boards.`;
  } else if (title.includes("SBI Land Loan")) {
    raw = `Quarterly Land Loan Compliance & Portfolio Analysis
Prepared by SBI Land Loan Quarterly Report Agent

The quarterly portfolio compliance audit for agricultural and commercial land-loan accounts confirms stable asset quality metrics, with gross non-performing assets (GNPA) maintained at 1.42% across regional banking circles. Loan-to-value (LTV) ratios average 64%, safely within statutory lending limits against verified collateral valuations.

In terms of "${cleanQuery}", compliance protocols verify land title clearance, non-encumbrance certifications, and cadastral survey records across zonal branches. Standardized documentation workflows ensure full regulatory alignment for upcoming periodic internal and statutory audits.`;
  } else if (title.includes("AIIMS ICU")) {
    raw = `Critical Care Ward Utilization & Capacity Analytics
Prepared by AIIMS ICU Occupancy Report Agent

Daily critical care unit analytics reflect an operational bed occupancy rate of 91.2%, with ventilator support utilization standing at 74.5%. Triage assessment protocols continue to prioritize emergency trauma admissions and post-operative intensive monitoring requirements.

Regarding "${cleanQuery}", clinical resource allocation models project evening bed turnover and discharge velocity to ensure standby capacity for emergency triage transfers. Medical staffing rosters and life-support consumable inventories remain fully synchronized with critical care standards.`;
  } else {
    raw = `Strategic Intelligence Briefing
Prepared by ${agent.title} for ${proj.title}

In evaluating "${cleanQuery}", our strategic intelligence workflows indicate significant operational and market opportunities for ${proj.title}. The convergence of consumer demand, channel economics, and regional execution models supports rapid, sustainable scale.

Key priorities include establishing localized distributor networks, tailoring product offerings to regional purchasing power, and deploying targeted trial initiatives to drive customer adoption. Continued monitoring of channel velocity and consumer retention will ensure robust performance against defined milestones.`;
  }

  // Ensure no # or * characters are present in the response
  return raw.replace(/[#*]/g, "").trim();
};

export const getRelatedQuestions = (m: MessageItem, proj: ProjectItem): string[] => {
  if (m.relatedQuestions && m.relatedQuestions.length > 0) {
    return m.relatedQuestions;
  }
  const title = (m.agentTitle || "").toLowerCase();
  const text = m.text.toLowerCase();

  if (title.includes("emerging") || text.includes("emerging markets") || text.includes("non-metro")) {
    return [
      "What are the distributor trade margin structures across secondary cities?",
      "Which 5 Tier-2 cities have the highest trial pack conversion velocity?",
      "How do quick-commerce dark stores compare with regional kirana networks?",
    ];
  }

  if (title.includes("customer dynamics") || title.includes("segmentation") || text.includes("demographic buying")) {
    return [
      "What price threshold triggers the highest repeat skincare purchase?",
      "How do 18–34 demographic cohorts discover mass-premium formulations?",
      "What regional climate-adaptive claims drive immediate consumer trust?",
    ];
  }

  if (title.includes("geographic expansion") || text.includes("channel economics") || text.includes("logistics cluster")) {
    return [
      "What are the freight cost efficiencies across the Northern Corridor?",
      "How should we phase distributor onboarding across the 24 urban clusters?",
      "What credit terms do regional stockists expect for new brand placement?",
    ];
  }

  if (title.includes("customer persona") || text.includes("buyer personas") || text.includes("aspirational professional")) {
    return [
      "What messaging resonates most with pragmatic homemaker cohorts?",
      "How can we integrate regional vernacular tutorials into product packaging?",
      "What dermatological certifications generate the strongest purchase intent?",
    ];
  }

  if (title.includes("market sizing") || text.includes("tam") || text.includes("growth opportunity")) {
    return [
      "What is the projected 3-year category TAM expansion for non-metro hubs?",
      "Which product categories deliver the highest gross margin velocity?",
      "What capital allocation is required to reach 2.5% regional market share?",
    ];
  }

  if (title.includes("competitive pricing") || text.includes("pricing dynamics") || text.includes("mass-premium sweet spot")) {
    return [
      "What promotional bundle discounts drive the highest basket size?",
      "How do we prevent regional price disparities across wholesale channels?",
      "What is the optimal price elasticity corridor for trial sachets?",
    ];
  }

  if (title.includes("apollo") || text.includes("clinical discharge")) {
    return [
      "What are the primary factors reducing 30-day inpatient readmissions?",
      "How is electronic discharge medication reconciliation audited?",
      "What clinical documentation standards apply to weekly patient episodes?",
    ];
  }

  if (title.includes("sbi") || text.includes("land loan")) {
    return [
      "What is the zonal breakdown of agricultural vs commercial loan performance?",
      "How are non-encumbrance certifications verified across zonal circles?",
      "What risk mitigation policies apply to loan-to-value ratios above 65%?",
    ];
  }

  if (title.includes("aiims") || text.includes("critical care ward") || text.includes("icu")) {
    return [
      "What is the peak utilization schedule for emergency ventilator beds?",
      "How are triage turnover rates managed during high-admission shifts?",
      "What consumable supply thresholds trigger automatic restock orders?",
    ];
  }

  return [
    `What are the priority retail corridors for ${proj.title}?`,
    "What distributor trade margins accelerate initial shelf placement?",
    "How do consumer trial packs reduce market entry acquisition costs?",
  ];
};

interface ProjectPackageGroup {
  projectId: string;
  projectTitle: string;
  projectDescription: string;
  packages: {
    id: string;
    title: string;
    subtitle: string;
    dateAcquired: string;
    files: { title: string; date: string }[];
  }[];
}

const defaultProjectPackages: ProjectPackageGroup[] = [
  {
    projectId: "personal-care-south-asia",
    projectTitle: "Personal care brand enters South Asia’s smaller cities",
    projectDescription:
      "A mid-sized European skincare company expanding across Tier-2 and Tier-3 urban clusters in South Asia.",
    packages: [
      {
        id: "pkg-1",
        title: "South Asia Tier-2 & Tier-3 City Market Penetration",
        subtitle:
          "Strategic city prioritization, price elasticity benchmarks, and retail channel access for non-metro market penetration.",
        dateAcquired: "June 2026",
        files: [
          {
            title: "Growth Opportunities in Personal Care for Tier-2 & Tier-3 Cities",
            date: "June 2026",
          },
          {
            title: "Price-Point & Pack-Size Strategy for Mass Skincare",
            date: "December 2025",
          },
          {
            title: "Distribution Channel Optimisation: Modern Trade & Kirana",
            date: "December 2026",
          },
        ],
      },
      {
        id: "pkg-2",
        title: "Personal Care Ingredients & Formulation Dynamics",
        subtitle:
          "Active, functional, and strategic ingredient research tailored to climate-adaptive skincare formulations.",
        dateAcquired: "April 2026",
        files: [
          {
            title: "Top 10 Strategic Imperatives in Personal Care Ingredients",
            date: "April 2026",
          },
          {
            title: "Personal Care Active Ingredients, South Asia Outlook",
            date: "March 2026",
          },
          {
            title: "Climate-Adaptive Formulations for Regional Urban Clusters",
            date: "February 2026",
          },
        ],
      },
    ],
  },
  {
    projectId: "customer-dynamics",
    projectTitle: "Customer Dynamics: who is buying, and why",
    projectDescription:
      "Buyer segments, purchase drivers and channel behaviour behind current demand across priority secondary urban markets.",
    packages: [
      {
        id: "pkg-3",
        title: "Consumer Purchasing Habits & Demographic Intelligence Hub",
        subtitle:
          "Demographic survey of skincare ritual adoption, regional influencer impact, and dermatological brand credibility.",
        dateAcquired: "May 2026",
        files: [
          {
            title: "Consumer Purchasing Habits Across 24 Urban Hubs",
            date: "May 2026",
          },
          {
            title: "Price Elasticity Analysis & Trial Kit Economics",
            date: "March 2026",
          },
        ],
      },
    ],
  },
  {
    projectId: "competitive-benchmark-positioning",
    projectTitle: "Competitive Benchmark & Positioning",
    projectDescription:
      "Comparing rivals on market share, trade pricing architecture, distributor margins, and physical retail shelf space.",
    packages: [
      {
        id: "pkg-4",
        title: "Tier-2 Trade Margins & Wholesale Distributor Economics",
        subtitle:
          "Wholesale FMCG distribution structures, distributor performance rebates, and shelf-space conversion economics.",
        dateAcquired: "April 2026",
        files: [
          {
            title: "Wholesale Trade Margin Benchmark for Secondary Cities",
            date: "April 2026",
          },
          {
            title: "Competitive Share & Channel Pricing Matrices",
            date: "January 2026",
          },
        ],
      },
    ],
  },
];

// ─── Library Page Data ──────────────────────────────────────────────────────

interface LibraryReport {
  id: string;
  projectId: string;
  projectTitle: string;
  title: string;
  subtitle: string;
  date: string;
  metrics: { value: string; label: string; delta?: string }[];
  expandedContent: React.ReactNode;
}

const libraryReportsData: Omit<LibraryReport, "expandedContent">[] = [
  {
    id: "report-south-asia-market",
    projectId: "personal-care-south-asia",
    projectTitle: "Personal care brand enters South Asia's smaller cities",
    title: "South Asia Tier-2 & Tier-3 Market Entry Report",
    subtitle: "Across all secondary urban retail corridors in 2026, 142,850 households surveyed with 98.6% channel velocity confidence.",
    date: "November 2026",
    metrics: [
      { value: "142,850", label: "Target consumer households", delta: "+8.6% MoM" },
      { value: "98.6%", label: "Retail placement velocity", delta: "+2.4% vs Category" },
      { value: "₹380–₹450", label: "Mass-premium sweet spot", delta: "< ₹500 Threshold" },
    ],
  },
  {
    id: "report-channel-distribution",
    projectId: "personal-care-south-asia",
    projectTitle: "Personal care brand enters South Asia's smaller cities",
    title: "Channel Distribution Velocity & Retail Network Report",
    subtitle: "Four strategic retail channels mapped across 24 secondary urban clusters with 99.8% overall market alignment.",
    date: "October 2026",
    metrics: [
      { value: "4", label: "Strategic retail channels", delta: "Pan South Asia" },
      { value: "24", label: "Urban clusters covered", delta: "+6 YoY" },
      { value: "99.8%", label: "Market alignment score", delta: "Validated" },
    ],
  },
  {
    id: "report-consumer-dynamics",
    projectId: "customer-dynamics",
    projectTitle: "Customer Dynamics: who is buying, and why",
    title: "Consumer Cohort & Purchase Behaviour Report",
    subtitle: "Buyer segment analysis across 24 urban hubs — mass-premium, young urban, and value-conscious cohorts profiled.",
    date: "September 2026",
    metrics: [
      { value: "58%", label: "Mass-premium cohort share", delta: "+4% YoY" },
      { value: "28%", label: "Young urban adopters", delta: "High velocity" },
      { value: "₹199–₹449", label: "Optimal trial price band", delta: "2-tier pack" },
    ],
  },
  {
    id: "report-competitive-benchmark",
    projectId: "competitive-benchmark-positioning",
    projectTitle: "Competitive Benchmark & Positioning",
    title: "Trade Margins & Competitive Positioning Report",
    subtitle: "Wholesale FMCG distribution economics and shelf-space conversion benchmarks across Tier-2 trade corridors.",
    date: "August 2026",
    metrics: [
      { value: "3", label: "Major rivals benchmarked", delta: "Full market scan" },
      { value: "18–22%", label: "Distributor margin range", delta: "Kirana corridors" },
      { value: "2.4×", label: "Shelf conversion uplift", delta: "vs Category avg" },
    ],
  },
];

function LibraryReportCard({ report }: { report: Omit<LibraryReport, "expandedContent"> }) {
  const [expanded, setExpanded] = useState(false);
  const isChannelReport = report.id === "report-channel-distribution";

  // Data for Report 1: South Asia Tier-2 & Tier-3 Market Entry Report
  const areaYears = [2021, 2022, 2023, 2024, 2025, 2026];
  const repeatSeries = [22000, 38000, 54000, 78000, 105000, 142850];
  const initSeries = [45000, 70000, 95000, 118000, 133000, 150000];
  const maxArea = 160000;
  const areaSvgW = 440;
  const areaSvgH = 170;
  const areaPlotH = 120;
  const areaPlotTop = 16;
  const areaPlotLeft = 56;
  const areaPlotW = areaSvgW - areaPlotLeft - 16;

  function areaX(i: number) { return areaPlotLeft + (i / (areaYears.length - 1)) * areaPlotW; }
  function areaY(v: number) { return areaPlotTop + areaPlotH - (v / maxArea) * areaPlotH; }
  function polyline(series: number[]) { return series.map((v, i) => `${areaX(i)},${areaY(v)}`).join(" "); }

  // Price Elasticity Curve for Report 1
  const pricePoints = [
    { price: 149, conv: 72 },
    { price: 199, conv: 94 },
    { price: 249, conv: 98.6 },
    { price: 349, conv: 91 },
    { price: 399, conv: 84 },
    { price: 449, conv: 78 },
    { price: 499, conv: 48 },
    { price: 599, conv: 22 },
  ];
  const priceSvgW = 680;
  const priceSvgH = 180;
  const pricePlotH = 130;
  const pricePlotTop = 20;
  const pricePlotLeft = 50;
  const pricePlotW = priceSvgW - pricePlotLeft - 30;

  function priceX(i: number) { return pricePlotLeft + (i / (pricePoints.length - 1)) * pricePlotW; }
  function priceY(conv: number) { return pricePlotTop + pricePlotH - (conv / 100) * pricePlotH; }
  const pricePolyline = pricePoints.map((p, i) => `${priceX(i)},${priceY(p.conv)}`).join(" ");

  // Data for Report 2: Channel Distribution Velocity & Retail Network Report
  const quarterLabels = ["Q1 '25", "Q2 '25", "Q3 '25", "Q4 '25", "Q1 '26", "Q2 '26", "Q3 '26", "Q4 '26"];
  const restockVelocityIndices = [100, 128, 155, 182, 210, 238, 262, 285];
  const transitLeadTimesHours = [48, 42, 35, 30, 24, 19, 16, 14];
  const maxVelocityIndex = 300;
  const channelSvgW = 680;
  const channelSvgH = 180;
  const channelPlotH = 130;
  const channelPlotTop = 20;
  const channelPlotLeft = 50;
  const channelBarW = 28;

  return (
    <article className="lib-report-card">
      <div className="lib-report-card-top">
        <div className="lib-report-card-info">
          <h4 className="lib-report-title">{report.title}</h4>
          <p className="lib-report-subtitle">{report.subtitle}</p>
        </div>
        <div className="lib-report-card-actions">
          <span className="lib-report-date">{report.date}</span>
          <button
            type="button"
            className="lib-report-expand-btn"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse report" : "Expand report"}
          >
            {expanded ? "Collapse" : "View report"}
            <ChevronDown
              className={`lib-report-chevron ${expanded ? "rotated" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Expanded view: Only rendered after user clicks 'View report' */}
      {expanded && (
        <div className="lib-report-expanded">
          <div className="lib-report-expanded-inner">
            {/* Specific Metrics Row for this report */}
            <div className="lib-report-metrics-row">
              {report.metrics.map((m, i) => (
                <div key={i} className="lib-report-metric">
                  <span className="lib-report-metric-value">{m.value}</span>
                  <span className="lib-report-metric-label">{m.label}</span>
                  {m.delta && <span className="lib-report-metric-delta">{m.delta}</span>}
                </div>
              ))}
            </div>

            {isChannelReport ? (
              /* ================= REPORT 2 VISUALIZATIONS ================= */
              <>
                {/* Visual 1: 4 Strategic Retail Channels Velocity & Performance Matrix */}
                <div className="lib-expanded-panel">
                  <div className="lib-panel-header">
                    <div>
                      <span className="lib-panel-title">Strategic Channel Turnover Velocity & Network Efficiency</span>
                      <p className="text-xs text-zinc-500 mt-1">Multi-tier distribution network performance across 24 secondary urban clusters</p>
                    </div>
                    <div className="lib-legend-row">
                      <span className="lib-legend-dot" style={{ background: "#059669" }} />
                      <span className="lib-legend-text">Validated Alignment</span>
                      <span className="lib-legend-dot" style={{ background: "#0f172a" }} />
                      <span className="lib-legend-text">Velocity Multiplier</span>
                    </div>
                  </div>

                  <div className="lib-channel-grid">
                    {[
                      {
                        name: "Traditional Kirana FMCG Wholesale",
                        badge: "Core Volume Driver",
                        doors: "12,400 Outlets",
                        turnover: "3.8×",
                        terms: "18–21% Trade Discount",
                        pct: 76,
                        status: "99.8% Alignment",
                      },
                      {
                        name: "Quick Commerce (Blinkit / Zepto / Instamart)",
                        badge: "Peak Velocity Driver",
                        doors: "48 Dark Stores",
                        turnover: "6.4×",
                        terms: "11-min Avg SLA",
                        pct: 98,
                        status: "99.9% Alignment",
                      },
                      {
                        name: "Pharmacy & Specialty Beauty (Apollo / MedPlus)",
                        badge: "High-Margin Anchor",
                        doors: "4,200 Outlets",
                        turnover: "2.9×",
                        terms: "24% Gross Margin",
                        pct: 64,
                        status: "99.6% Alignment",
                      },
                      {
                        name: "Regional Modern Trade (Reliance / D-Mart)",
                        badge: "Scalable Modern Reach",
                        doors: "1,850 Hypermarkets",
                        turnover: "4.6×",
                        terms: "16% Volume Rebate",
                        pct: 85,
                        status: "99.4% Alignment",
                      },
                    ].map((ch) => (
                      <div key={ch.name} className="lib-channel-card">
                        <div className="lib-channel-card-top">
                          <span className="lib-channel-name">{ch.name}</span>
                          <span className="lib-channel-badge">{ch.badge}</span>
                        </div>
                        <div className="lib-channel-stats-row">
                          <div className="lib-channel-stat-item">
                            <span className="lib-channel-stat-val">{ch.turnover}</span>
                            <span className="lib-channel-stat-lbl">Inventory Turn</span>
                          </div>
                          <div className="lib-channel-stat-item">
                            <span className="lib-channel-stat-val" style={{ fontSize: "16px" }}>{ch.doors}</span>
                            <span className="lib-channel-stat-lbl">Active Doors</span>
                          </div>
                          <div className="lib-channel-stat-item" style={{ marginLeft: "auto", textAlign: "right" }}>
                            <span className="text-xs font-semibold text-emerald-600">{ch.status}</span>
                            <span className="lib-channel-stat-lbl">{ch.terms}</span>
                          </div>
                        </div>
                        <div className="lib-progress-track">
                          <div className="lib-progress-fill" style={{ width: `${ch.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual 2: Quarterly Restock Velocity Index vs Transit Lead Time (Dual-Axis SVG) */}
                <div className="lib-expanded-panel">
                  <div className="lib-panel-header">
                    <div>
                      <span className="lib-panel-title">Quarterly Restock Velocity Index vs Transit Lead Time (Hours)</span>
                      <p className="text-xs text-zinc-500 mt-1">Secondary corridor logistics turnaround acceleration from Q1 2025 to Q4 2026</p>
                    </div>
                    <span className="lib-area-badge">Turnaround: 48h → 14h</span>
                  </div>

                  <div className="lib-svg-scroll">
                    <svg width={channelSvgW} height={channelSvgH} aria-label="Quarterly restock and lead time dual-axis chart">
                      {/* Grid lines */}
                      {[0, 100, 200, 300].map((v) => {
                        const y = channelPlotTop + channelPlotH - (v / maxVelocityIndex) * channelPlotH;
                        return (
                          <g key={v}>
                            <line x1={channelPlotLeft} x2={channelSvgW - 10} y1={y} y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
                            <text x={channelPlotLeft - 6} y={y + 4} textAnchor="end" fontSize={13} fill="#9ca3af">{v}</text>
                          </g>
                        );
                      })}

                      {/* Velocity Bars */}
                      {quarterLabels.map((q, i) => {
                        const x = channelPlotLeft + 20 + i * ((channelSvgW - channelPlotLeft - 40) / quarterLabels.length);
                        const barHeight = (restockVelocityIndices[i] / maxVelocityIndex) * channelPlotH;
                        const yBar = channelPlotTop + channelPlotH - barHeight;
                        return (
                          <g key={q}>
                            <rect x={x} y={yBar} width={channelBarW} height={barHeight} rx={4} fill="#0f172a" />
                            <text x={x + channelBarW / 2} y={channelPlotTop + channelPlotH + 16} textAnchor="middle" fontSize={13} fill="#64748b">{q}</text>
                          </g>
                        );
                      })}

                      {/* Lead Time Stepped Line */}
                      {(() => {
                        const pts = quarterLabels.map((_, i) => {
                          const x = channelPlotLeft + 20 + i * ((channelSvgW - channelPlotLeft - 40) / quarterLabels.length) + channelBarW / 2;
                          const y = channelPlotTop + channelPlotH - (transitLeadTimesHours[i] / 50) * channelPlotH;
                          return { x, y, h: transitLeadTimesHours[i] };
                        });
                        const polylinePoints = pts.map(p => `${p.x},${p.y}`).join(" ");

                        return (
                          <g>
                            <polyline points={polylinePoints} fill="none" stroke="#059669" strokeWidth={2.5} strokeDasharray="4 2" />
                            {pts.map((p, idx) => (
                              <g key={idx}>
                                <circle cx={p.x} cy={p.y} r={4.5} fill="#059669" stroke="#ffffff" strokeWidth={2} />
                                <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="#059669">{p.h}h</text>
                              </g>
                            ))}
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  <div className="lib-legend-row" style={{ marginTop: "4px" }}>
                    <span className="lib-legend-dot" style={{ background: "#0f172a" }} />
                    <span className="lib-legend-text">Restock Velocity Index (Bars, Left Axis)</span>
                    <span className="lib-legend-dot" style={{ background: "#059669", borderRadius: "50%" }} />
                    <span className="lib-legend-text">Logistics Lead Time (Dashed Green, Hours)</span>
                  </div>
                </div>

                {/* Visual 3 & 4: Bottom 2-col grid */}
                <div className="lib-bottom-grid">
                  {/* Left: 24 Urban Clusters Regional Volume Share */}
                  <div className="lib-expanded-panel">
                    <div className="lib-panel-header">
                      <span className="lib-panel-title">24 Urban Clusters Regional Volume Share</span>
                    </div>
                    <div className="lib-zone-list">
                      {[
                        { zone: "West Zone (7 Hubs)", hubs: "Ahmedabad, Surat, Pune, Nagpur, Nashik, Rajkot", share: "36%", fill: "99.9%", w: 90 },
                        { zone: "South Zone (6 Hubs)", hubs: "Coimbatore, Kochi, Madurai, Mysore, Vizag, Vijayawada", share: "31%", fill: "99.8%", w: 78 },
                        { zone: "North Zone (6 Hubs)", hubs: "Jaipur, Lucknow, Chandigarh, Kanpur, Ludhiana, Agra", share: "22%", fill: "99.6%", w: 55 },
                        { zone: "East Zone (5 Hubs)", hubs: "Bhubaneswar, Patna, Ranchi, Guwahati, Jamshedpur", share: "11%", fill: "99.4%", w: 30 },
                      ].map((item) => (
                        <div key={item.zone} className="lib-zone-item">
                          <div className="lib-zone-header">
                            <div>
                              <span className="lib-zone-title">{item.zone}</span>
                              <div className="text-[11px] text-zinc-400 mt-0.5">{item.hubs}</div>
                            </div>
                            <div className="lib-zone-metric text-right">
                              <strong>{item.share}</strong> Volume · <span className="text-emerald-600 font-semibold">{item.fill} SLA</span>
                            </div>
                          </div>
                          <div className="lib-progress-track">
                            <div className="lib-progress-fill" style={{ width: `${item.w}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Channel Margin vs Replenishment Turn Cycle */}
                  <div className="lib-expanded-panel">
                    <div className="lib-panel-header">
                      <span className="lib-panel-title">Channel Margin vs Replenishment Cycle</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {[
                        { ch: "Quick Commerce", margin: "14%", cycle: "Daily (24h SLA)", vol: "High Flow", color: "#059669" },
                        { ch: "Traditional Kirana Wholesale", margin: "19%", cycle: "Bi-Weekly (5-day cycle)", vol: "Volume Anchor", color: "#0f172a" },
                        { ch: "Regional Modern Trade", margin: "16%", cycle: "Weekly (7-day cycle)", vol: "Bulk Orders", color: "#334155" },
                        { ch: "Pharmacy & Derma Corridors", margin: "24%", cycle: "Fortnightly (14-day cycle)", vol: "High Basket", color: "#64748b" },
                      ].map((row) => (
                        <div key={row.ch} className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center justify-between">
                          <div>
                            <div className="text-xs font-semibold text-zinc-900">{row.ch}</div>
                            <div className="text-[11px] text-zinc-500 mt-0.5">{row.cycle} · {row.vol}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-zinc-900">{row.margin}</span>
                            <div className="text-[10px] text-zinc-400">Trade Margin</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table: Full Channel Breakdown */}
                <div className="lib-expanded-panel">
                  <div className="lib-panel-header">
                    <span className="lib-panel-title">Channel Distribution Velocity & Retail Network Breakdown</span>
                  </div>
                  <div className="lib-table-wrap">
                    <table className="lib-table">
                      <thead>
                        <tr>
                          {["Distribution Channel", "Network Infrastructure", "Target Cohort", "Velocity Confidence", "Strategic Viability"].map((h) => (
                            <th key={h} className="lib-th">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Traditional Kirana & General Trade", "Secondary City FMCG Wholesale Distributors", "Value-Conscious Households", "99.8%", "Priority Expansion"],
                          ["Quick Commerce & Modern Trade", "Blinkit / Zepto / Regional Fulfillment Hubs", "Young Urban Skincare Adopters", "99.9%", "High Velocity"],
                          ["Pharmacy & Dermatologist Corridors", "Apollo / MedPlus Regional Outlets", "Aspirational Mass-Premium", "99.6%", "High Margin Anchor"],
                          ["Omnichannel Trial Kits & D2C", "Direct Logistics & Regional Pop-Up Sampling", "Digital-First Skincare Switchers", "99.4%", "Validated Driver"],
                          ["Total Market Synthesis", "4 Strategic Retail Channels", "Pan-South Asia Secondary Urban", "99.8% Overall", "100% Market Alignment"],
                        ].map((row, ri) => (
                          <tr key={ri} className={ri === 4 ? "lib-tr-total" : ""}>
                            {row.map((cell, ci) => <td key={ci} className="lib-td">{cell}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Governance Box */}
                <div className="lib-governance-box">
                  <div className="lib-governance-block">
                    <h5 className="lib-governance-heading">Cold-Chain & Monsoon Logistics Resilience</h5>
                    <p className="lib-governance-body">Temperature-stable protective packaging deployed for non-AC Tier-2 transit hubs. Real-time humidity sensors in regional 3PL fulfillment depots safeguard gel-cream active ingredient potency.</p>
                  </div>
                  <div className="lib-governance-block">
                    <h5 className="lib-governance-heading">Kirana Credit Terms & Distributor Cash-Flow Governance</h5>
                    <p className="lib-governance-body">14-day revolving credit cycles anchored to electronic proof-of-delivery (e-POD). 2% early settlement discount incentivizes distributor restocking velocity and prevents stock-outs during festival peak periods.</p>
                  </div>
                </div>
              </>
            ) : (
              /* ================= REPORT 1 VISUALIZATIONS ================= */
              <>
                {/* Visual 1: Secondary Urban Corridor Penetration & Household Velocity */}
                <div className="lib-expanded-panel">
                  <div className="lib-panel-header">
                    <div>
                      <span className="lib-panel-title">Secondary Urban Corridor Penetration & Household Velocity</span>
                      <p className="text-xs text-zinc-500 mt-1">142,850 households surveyed across high-growth Tier-2 and Tier-3 urban clusters</p>
                    </div>
                    <span className="lib-area-badge">Total Households: 142.8k</span>
                  </div>

                  <div className="lib-corridor-grid">
                    {[
                      {
                        name: "Indore – Bhopal Corridor",
                        pct: "88.4%",
                        cohorts: "42,100 Cohorts",
                        avgBasket: "₹420 Avg Basket",
                        fillPct: 88.4,
                        note: "High Trial Velocity",
                      },
                      {
                        name: "Coimbatore – Kochi Belt",
                        pct: "92.6%",
                        cohorts: "38,400 Cohorts",
                        avgBasket: "₹445 Avg Basket",
                        fillPct: 92.6,
                        note: "Top Regional Velocity",
                      },
                      {
                        name: "Jaipur – Udaipur Ring",
                        pct: "84.1%",
                        cohorts: "34,250 Cohorts",
                        avgBasket: "₹395 Avg Basket",
                        fillPct: 84.1,
                        note: "Rapid Modern Adoption",
                      },
                      {
                        name: "Lucknow – Kanpur Belt",
                        pct: "79.5%",
                        cohorts: "28,100 Cohorts",
                        avgBasket: "₹380 Avg Basket",
                        fillPct: 79.5,
                        note: "Kirana Anchor Corridor",
                      },
                    ].map((item) => (
                      <div key={item.name} className="lib-corridor-card">
                        <div className="lib-corridor-top">
                          <span className="lib-corridor-name">{item.name}</span>
                          <span className="lib-corridor-pct">{item.pct}</span>
                        </div>
                        <div className="lib-progress-track">
                          <div className="lib-progress-fill" style={{ width: `${item.fillPct}%` }} />
                        </div>
                        <div className="lib-corridor-meta">
                          <span>{item.cohorts} · {item.avgBasket}</span>
                          <span className="text-xs font-medium text-zinc-700">{item.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual 2: Price Elasticity & Trial Conversion Curve (Custom SVG) */}
                <div className="lib-expanded-panel">
                  <div className="lib-panel-header">
                    <div>
                      <span className="lib-panel-title">Mass-Premium Price Elasticity & Trial Conversion Curve</span>
                      <p className="text-xs text-zinc-500 mt-1">Consumer willingness-to-pay index vs price band across Tier-2 & Tier-3 retail corridors</p>
                    </div>
                    <div className="lib-legend-row">
                      <span className="lib-legend-dot" style={{ background: "#059669" }} />
                      <span className="lib-legend-text">Mass-Premium Sweet Spot (₹199–₹450)</span>
                      <span className="lib-legend-dot" style={{ background: "#ef4444" }} />
                      <span className="lib-legend-text">&lt; ₹500 Threshold</span>
                    </div>
                  </div>

                  <div className="lib-svg-scroll">
                    <svg width={priceSvgW} height={priceSvgH} aria-label="Price elasticity conversion curve">
                      <defs>
                        <linearGradient id="sweetSpotGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#059669" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#059669" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      {[0, 25, 50, 75, 100].map((v) => {
                        const y = pricePlotTop + pricePlotH - (v / 100) * pricePlotH;
                        return (
                          <g key={v}>
                            <line x1={pricePlotLeft} x2={priceSvgW - 10} y1={y} y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
                            <text x={pricePlotLeft - 6} y={y + 4} textAnchor="end" fontSize={13} fill="#9ca3af">{v}%</text>
                          </g>
                        );
                      })}

                      {/* Shaded Sweet Spot Area between index 1 (₹199) and index 5 (₹449) */}
                      {(() => {
                        const x1 = priceX(1);
                        const x2 = priceX(5);
                        const yBase = pricePlotTop + pricePlotH;
                        const subPoints = pricePoints.slice(1, 6).map((p, i) => `${priceX(i + 1)},${priceY(p.conv)}`).join(" ");
                        return (
                          <polygon
                            points={`${x1},${yBase} ${subPoints} ${x2},${yBase}`}
                            fill="url(#sweetSpotGrad)"
                          />
                        );
                      })()}

                      {/* Threshold Line at index 6 (₹499) */}
                      <line
                        x1={priceX(6)}
                        x2={priceX(6)}
                        y1={pricePlotTop}
                        y2={pricePlotTop + pricePlotH}
                        stroke="#ef4444"
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                      />
                      <text x={priceX(6)} y={pricePlotTop - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill="#ef4444">
                        &lt; ₹500 Threshold
                      </text>

                      {/* Main Conversion Curve */}
                      <polyline points={pricePolyline} fill="none" stroke="#0f172a" strokeWidth={2.5} />

                      {/* Data Dots and Ticks */}
                      {pricePoints.map((p, i) => {
                        const cx = priceX(i);
                        const cy = priceY(p.conv);
                        const isSweetSpot = i >= 1 && i <= 5;
                        return (
                          <g key={p.price}>
                            <circle cx={cx} cy={cy} r={isSweetSpot ? 4.5 : 3.5} fill={isSweetSpot ? "#059669" : "#0f172a"} stroke="#ffffff" strokeWidth={2} />
                            <text x={cx} y={pricePlotTop + pricePlotH + 16} textAnchor="middle" fontSize={12} fill="#64748b">₹{p.price}</text>
                            <text x={cx} y={cy - 8} textAnchor="middle" fontSize={11} fontWeight={isSweetSpot ? 700 : 500} fill={isSweetSpot ? "#059669" : "#475569"}>{p.conv}%</text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Visual 3 & 4: Bottom 2-col grid */}
                <div className="lib-bottom-grid">
                  {/* Donut: Consumer Cohort Breakdown */}
                  <div className="lib-expanded-panel">
                    <div className="lib-panel-header">
                      <span className="lib-panel-title">Consumer Cohort & Market Segmentation</span>
                    </div>
                    <div className="lib-donut-wrap">
                      <svg width={140} height={140} viewBox="0 0 140 140" aria-label="Consumer cohort donut chart">
                        <circle cx={70} cy={70} r={52} fill="none" stroke="#f3f4f6" strokeWidth={22} />
                        <circle cx={70} cy={70} r={52} fill="none" stroke="#111827" strokeWidth={22}
                          strokeDasharray={`${0.58 * 326.7} ${326.7}`} strokeDashoffset={81.7} />
                        <circle cx={70} cy={70} r={52} fill="none" stroke="#374151" strokeWidth={22}
                          strokeDasharray={`${0.28 * 326.7} ${326.7}`} strokeDashoffset={81.7 - 0.58 * 326.7} />
                        <circle cx={70} cy={70} r={52} fill="none" stroke="#9ca3af" strokeWidth={22}
                          strokeDasharray={`${0.09 * 326.7} ${326.7}`} strokeDashoffset={81.7 - 0.86 * 326.7} />
                        <circle cx={70} cy={70} r={52} fill="none" stroke="#d1d5db" strokeWidth={22}
                          strokeDasharray={`${0.05 * 326.7} ${326.7}`} strokeDashoffset={81.7 - 0.95 * 326.7} />
                        <text x={70} y={66} textAnchor="middle" fontSize={15} fontWeight={700} fill="#111827">142.8k</text>
                        <text x={70} y={82} textAnchor="middle" fontSize={13} fill="#6b7280">Cohorts</text>
                      </svg>
                      <div className="lib-donut-legend">
                        {[
                          { label: "Mass-Premium", pct: "58%", color: "#111827" },
                          { label: "Young Urban", pct: "28%", color: "#374151" },
                          { label: "Value-Conscious", pct: "9%", color: "#9ca3af" },
                          { label: "Tier-3 Adopters", pct: "5%", color: "#d1d5db" },
                        ].map((s) => (
                          <div key={s.label} className="lib-donut-legend-row">
                            <span className="lib-donut-swatch" style={{ background: s.color }} />
                            <span className="lib-donut-label">{s.label}</span>
                            <span className="lib-donut-pct">{s.pct}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Area Chart: Multi-Year Sales Velocity & Market Penetration */}
                  <div className="lib-expanded-panel">
                    <div className="lib-panel-header">
                      <span className="lib-panel-title">Regional Sales Velocity & Market Penetration Over Time</span>
                      <span className="lib-area-badge">4.2× since 2021</span>
                    </div>
                    <svg width="100%" height={areaSvgH} viewBox={`0 0 ${areaSvgW} ${areaSvgH}`} preserveAspectRatio="xMidYMid meet" aria-label="Area chart">
                      <defs>
                        <linearGradient id="libAreaGrad1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#111827" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#111827" stopOpacity="0.02" />
                        </linearGradient>
                        <linearGradient id="libAreaGrad2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      {[0, 50000, 100000, 150000].map((v) => {
                        const y = areaY(v);
                        return (
                          <g key={v}>
                            <line x1={areaPlotLeft} x2={areaSvgW - 8} y1={y} y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
                            <text x={areaPlotLeft - 4} y={y + 4} textAnchor="end" fontSize={13} fill="#9ca3af">{v === 0 ? "0" : `${v / 1000}k`}</text>
                          </g>
                        );
                      })}
                      {areaYears.map((yr, i) => (
                        <text key={yr} x={areaX(i)} y={areaSvgH - 4} textAnchor="middle" fontSize={13} fill="#9ca3af">{yr}</text>
                      ))}
                      <polygon points={`${areaPlotLeft},${areaY(0)} ${polyline(initSeries)} ${areaX(areaYears.length - 1)},${areaY(0)}`} fill="url(#libAreaGrad2)" />
                      <polyline points={polyline(initSeries)} fill="none" stroke="#9ca3af" strokeWidth={2} />
                      <polygon points={`${areaPlotLeft},${areaY(0)} ${polyline(repeatSeries)} ${areaX(areaYears.length - 1)},${areaY(0)}`} fill="url(#libAreaGrad1)" />
                      <polyline points={polyline(repeatSeries)} fill="none" stroke="#111827" strokeWidth={2.5} />
                    </svg>
                    <div className="lib-area-legend">
                      <span className="lib-legend-dot" style={{ background: "#111827" }} />
                      <span className="lib-legend-text">Repeat Retail Purchases</span>
                      <span className="lib-legend-dot" style={{ background: "#9ca3af" }} />
                      <span className="lib-legend-text">Initial Sampling Inflow</span>
                    </div>
                  </div>
                </div>

                {/* Governance box */}
                <div className="lib-governance-box">
                  <div className="lib-governance-block">
                    <h5 className="lib-governance-heading">Climate-Adaptive Skincare & Regional Formulation Fit</h5>
                    <p className="lib-governance-body">Formulations engineered for South Asian seasonal heat, monsoon humidity, and UV exposure. Prioritizes lightweight gel-creams and skin barrier ceramides over heavy occlusives to match regional cleansing rituals.</p>
                  </div>
                  <div className="lib-governance-block">
                    <h5 className="lib-governance-heading">Retail Price Elasticity & Pack Sizing Governance</h5>
                    <p className="lib-governance-body">Dual-tier pack architecture implemented: entry-level 30ml trial formats at ₹199–₹249 and 100ml core SKUs at ₹399–₹449. Mitigates trial friction while protecting distributor margins across Tier-2 and Tier-3 Kirana corridors.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

const reportsByProject = libraryReportsData.reduce<Record<string, typeof libraryReportsData>>((acc, r) => {
  if (!acc[r.projectId]) acc[r.projectId] = [];
  acc[r.projectId].push(r);
  return acc;
}, {});

interface SavedInsightItem {
  id: string;
  category: string;
  title: string;
  insight: string;
  source: string;
  date: string;
}

const savedInsightsData: SavedInsightItem[] = [
  {
    id: "insight-1",
    category: "Pricing & Elasticity",
    title: "Mass-Premium Conversion Sweet Spot",
    insight:
      "Conversion velocity peaks at the ₹199–₹249 price band using 15ml–30ml discovery trial formats, mitigating trial friction without margin compression across Tier-2/3 retail.",
    source: "Price-Point & Pack-Size Strategy Report",
    date: "November 2026",
  },
  {
    id: "insight-2",
    category: "Channel Distribution",
    title: "Kirana & Quick Commerce Distribution Velocity",
    insight:
      "Secondary urban corridors show 2.4× higher repeat adoption when quick-commerce discovery is paired with modern kirana wholesale stocking within a 5km radius.",
    source: "Distribution Channel Optimisation Report",
    date: "October 2026",
  },
  {
    id: "insight-3",
    category: "Active Ingredients",
    title: "Regional Climatology & Formulation Fit",
    insight:
      "High-humidity secondary clusters show 62% customer preference for sweat-resistant, lightweight gel formulations containing regional bio-actives over heavy cream bases.",
    source: "Personal Care Ingredients & Formulation Dynamics Pack",
    date: "June 2026",
  },
  {
    id: "insight-4",
    category: "Consumer Cohorts",
    title: "Young Urban Adopter Spend Concentration",
    insight:
      "The 22–34 age segment across Tier-2 urban hubs accounts for 58% of mass-premium skincare spend, driven by peer validation and digital discovery channels.",
    source: "Consumer Cohort & Purchase Behaviour Report",
    date: "September 2026",
  },
];

interface DataSourceItem {
  id: string;
  name: string;
  status: "Active" | "Connected" | "Live";
  description: string;
  coverage: string;
  sync: string;
}

const dataSourcesData: DataSourceItem[] = [
  {
    id: "ds-1",
    name: "Frost & Sullivan Market Intelligence Cloud",
    status: "Live",
    description: "Pan-South Asia macroeconomic, trade margin, and category TAM market models.",
    coverage: "Pan South Asia (142,850 households)",
    sync: "Real-time feed",
  },
  {
    id: "ds-2",
    name: "Secondary Cities Retail Velocity Scanner",
    status: "Active",
    description: "Modern trade, kirana networks, and quick-commerce throughput across secondary urban corridors.",
    coverage: "24 Urban Clusters (3,800+ outlets)",
    sync: "Daily at 08:30 AM",
  },
  {
    id: "ds-3",
    name: "Urban Consumer Demographics & Household Panel",
    status: "Connected",
    description: "Socioeconomic classification (SEC A/B) income cohorts, spending baskets, and trial frequencies.",
    coverage: "Tier-2 & Tier-3 City Hubs",
    sync: "Weekly batch sync",
  },
  {
    id: "ds-4",
    name: "Personal Care Regulatory & Ingredient Registry",
    status: "Connected",
    description: "Regional cosmetics safety standards, bio-active ingredient limits, and labeling regulations.",
    coverage: "Regulatory Compliance Framework",
    sync: "Monthly audit",
  },
];


function ProjectWorkspace({
  project,
  projects,
  onSelectProject,
  onBackToDashboard,
  onAddNewProject,
  agents = initialAgents,
  onEditAgent,
  onOpenKyc,
  onOpenLibrary,
}: {
  project: ProjectItem;
  projects: ProjectItem[];
  onSelectProject: (id: string) => void;
  onBackToDashboard: () => void;
  onAddNewProject: () => void;
  agents?: AgentItem[];
  onEditAgent?: (agent: AgentItem) => void;
  onOpenKyc?: () => void;
  onOpenKyc?: () => void;
}) {
  const [conversations, setConversations] = useState<Record<string, MessageItem[]>>(initialProjectConversations);
  const [projectChats, setProjectChats] = useState<Record<string, SubChatItem[]>>(buildInitialProjectChats);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isNewProject = project.id.startsWith("new-project");
  const isBrandNew = isNewProject || project.id.startsWith("untitled-");

  const [selectedChat, setSelectedChat] = useState<string>(
    isNewProject ? "New chat" : project.title
  );
  const [selectedChatKey, setSelectedChatKey] = useState<string>(
    isNewProject ? "new-chat" : project.id
  );
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(project.id || null);
  const [searchFilter, setSearchFilter] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [isVisionPaused, setIsVisionPaused] = useState(false);
  const [understoodFacts, setUnderstoodFacts] = useState<string[]>([]);
  const [visionInput, setVisionInput] = useState("");
  const [currentProjectTitle, setCurrentProjectTitle] = useState(
    isNewProject && (project.title === "New project" || !project.title)
      ? "Untitled project"
      : project.title || "Untitled project"
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(
    isNewProject && (project.title === "New project" || !project.title)
      ? "Untitled project"
      : project.title || "Untitled project"
  );
  const [customOutcome, setCustomOutcome] = useState("");
  const [projectScope, setProjectScope] = useState<{
    goal: string;
    whoItsFor: string;
    investment: string;
    annualImpact: string;
    targetDate: string;
    deliveryOwner: string;
    market: string;
  }>({
    goal: "",
    whoItsFor: "",
    investment: "",
    annualImpact: "",
    targetDate: "",
    deliveryOwner: "",
    market: "",
  });
  const [selectedOutcomes, setSelectedOutcomes] = useState<Record<string, string>>({});
  const [selectedRecommendedAgentId, setSelectedRecommendedAgentId] = useState<string | null>(null);
  const [pinnedAgent, setPinnedAgent] = useState<AgentItem | null>(null);
  const [selectedAgentOptions, setSelectedAgentOptions] = useState<Record<string, string>>({});
  const [interactiveFlowAnswers, setInteractiveFlowAnswers] = useState<Record<string, Record<string, string>>>({});
  const [scopeStep, setScopeStep] = useState<1 | 2>(1);
  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
  const marketDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMarketDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        isMarketDropdownOpen &&
        marketDropdownRef.current &&
        !marketDropdownRef.current.contains(target)
      ) {
        setIsMarketDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMarketDropdownOpen]);

  const knownFactsCount = [
    projectScope.goal,
    projectScope.whoItsFor,
    projectScope.investment,
    projectScope.annualImpact,
    projectScope.targetDate,
    projectScope.deliveryOwner,
  ].filter(Boolean).length;
  const stillToLearnCount = 6 - knownFactsCount;

  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState("Thinking...");
  const thinkingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voiceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelectAgentForChat = (agent: AgentItem) => {
    setPinnedAgent(agent);
    setThinkingText("Thinking...");
    setIsThinking(true);
    scrollToTarget(".workspace-conversation > *:last-child, .ai-thinking-row", "start");

    const isVitest = typeof process !== "undefined" && Boolean(process.env?.VITEST || process.env?.NODE_ENV === "test");
    const duration = isVitest ? 200 : 1200;

    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
    }

    thinkingTimeoutRef.current = setTimeout(() => {
      setIsThinking(false);

      let reportId = agent.id;
      if (project.id === "sbi-home-loan" || agent.id.includes("home-loan")) {
        reportId = "agent-sbi-home-loan";
      } else if (agent.id.includes("velocity") || agent.id.includes("city")) {
        reportId = "city-velocity";
      } else if (agent.id.includes("margin")) {
        reportId = "margin-structures";
      } else if (agent.id.includes("quick") || agent.id.includes("commerce")) {
        reportId = "quick-commerce-comparison";
      } else {
        reportId = "proj-agent-emerging-markets";
      }

      const reportMsg: MessageItem = {
        id: `ai-report-${agent.id}-${Date.now()}`,
        sender: "assistant",
        text: `__AGENT_REPORT__:${reportId}`,
        agentTitle: agent.title,
      };

      setConversations((prev) => {
        const existing = prev[currentChatKey] || [];
        return {
          ...prev,
          [currentChatKey]: [...existing, reportMsg],
        };
      });

      setTimeout(() => {
        scrollToTarget("#agent-report-section, .ai-agent-report-container, .openui-report-card", "start");
      }, 100);
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
      }
      if (voiceTimeoutRef.current) {
        clearTimeout(voiceTimeoutRef.current);
      }
    };
  }, []);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const [isAgentsDrawerOpen, setIsAgentsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeSidebarView, setActiveSidebarView] = useState<
    "saved-insights" | "data-sources" | "library" | "knowledge-packs" | null
  >(null);
  const [libraryTab, setLibraryTab] = useState<"reports" | "packages">("reports");
  const [obtainedPacks, setObtainedPacks] = useState<Record<string, boolean>>({});
  const [obtainedReports, setObtainedReports] = useState<Record<string, boolean>>({});
  const [generatingAgentId, setGeneratingAgentId] = useState<string | null>(null);
  const [generatedAgents, setGeneratedAgents] = useState<Record<string, boolean>>({});
  const [activeReportAgentId, setActiveReportAgentId] = useState<string | null>(null);
  const [downloadedReportId, setDownloadedReportId] = useState<string | null>(null);
  const [reportFlows, setReportFlows] = useState<Record<string, ReportFlowState>>({});
  const [savedInsightsList, setSavedInsightsList] = useState<SavedInsightItem[]>(savedInsightsData);
  const [savedMsgIds, setSavedMsgIds] = useState<Record<string, boolean>>({});
  const [insightsSearchQuery, setInsightsSearchQuery] = useState("");

  const handleSaveInsight = (msg: MessageItem) => {
    if (savedMsgIds[msg.id]) return;
    setSavedMsgIds((prev) => ({ ...prev, [msg.id]: true }));
    const snippet = msg.text.replace(/\n+/g, " ").trim();
    const title = snippet.length > 50 ? snippet.slice(0, 50).trim() + "..." : snippet;
    const newInsight: SavedInsightItem = {
      id: `insight-${msg.id}-${Date.now()}`,
      category: "General",
      title,
      insight: msg.text,
      source: `Assistant Chat · ${project.title}`,
      date: "Just now",
    };
    setSavedInsightsList((prev) => [newInsight, ...prev]);
  };
  const dockFileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFileItem[]>([]);

  const projectRelatedAgents = useMemo(() => getProjectRelatedAgents(project), [project]);
  const otherWorkspaceAgents = useMemo(
    () =>
      (agents && agents.length > 0 ? agents : initialAgents).filter(
        (a) => !a.id.startsWith("proj-agent-")
      ),
    [agents]
  );

  const handleTogglePack = (packId: string) => {
    const isCurrentlyObtained = !!obtainedPacks[packId];
    const willBeObtained = !isCurrentlyObtained;

    setObtainedPacks((prev) => ({
      ...prev,
      [packId]: willBeObtained,
    }));

    if (willBeObtained) {
      const pack = defaultKnowledgePacks.find((p) => p.id === packId);
      const packTitle = pack ? pack.title : "South Asia Tier-2 & Tier-3 City Market Penetration";
      const packMsgId = `pack-added-${packId}-${Date.now()}`;
      const packMessage: MessageItem = {
        id: packMsgId,
        sender: "assistant",
        text: `__PACK_ADDED__:${packTitle}`,
      };

      setThinkingText("Downloading...");
      setIsThinking(true);
      scrollToTarget(".workspace-conversation > *:last-child, .ai-thinking-row", "start");

      const downloadDuration = typeof process !== "undefined" && process.env.NODE_ENV === "test" ? 300 : 1500;
      setTimeout(() => {
        setIsThinking(false);
        setThinkingText("Thinking...");

        setConversations((prev) => {
          const existing = prev[currentChatKey] || [];
          const filtered = existing.filter(
            (msg) => !msg.id.startsWith("pack-added-") && !msg.text.startsWith("__PACK_ADDED__:")
          );
          return {
            ...prev,
            [currentChatKey]: [...filtered, packMessage],
          };
        });

        setTimeout(() => {
          scrollToTarget(".ai-pack-added-container", "start");
        }, 100);
      }, downloadDuration);
    } else {
      setConversations((prev) => {
        const existing = prev[currentChatKey] || [];
        return {
          ...prev,
          [currentChatKey]: existing.filter(
            (msg) => !msg.id.startsWith("pack-added-") && !msg.text.startsWith("__PACK_ADDED__:")
          ),
        };
      });
    }
  };

  const handleToggleReport = (reportId: string) => {
    setObtainedReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  const handleSelectFlowAgent = (msgId: string, agentId: string) => {
    setReportFlows((prev) => {
      const current = prev[msgId] || { ...defaultReportFlowState };
      const currentSelected = current.selectedAgentIds && current.selectedAgentIds.length > 0
        ? current.selectedAgentIds
        : current.selectedAgentId ? [current.selectedAgentId] : [];

      let nextSelected: string[];
      if (currentSelected.includes(agentId)) {
        nextSelected = currentSelected.filter((id) => id !== agentId);
      } else {
        nextSelected = [...currentSelected, agentId];
      }

      return {
        ...prev,
        [msgId]: {
          ...current,
          selectedAgentIds: nextSelected,
          selectedAgentId: nextSelected[0] || null,
          activeAgentId: current.hasRunAgents ? (nextSelected[0] || null) : null,
          isAgent2Active: nextSelected.length >= 2,
        },
      };
    });
  };

  const handleRunBothAgents = (msgId: string) => {
    setReportFlows((prev) => {
      const current = prev[msgId] || { ...defaultReportFlowState };
      const suggested = projectRelatedAgents.slice(0, 2);
      const currentSelected = current.selectedAgentIds && current.selectedAgentIds.length > 0
        ? current.selectedAgentIds
        : current.selectedAgentId ? [current.selectedAgentId] : [];

      const chosen = currentSelected.length > 0
        ? currentSelected
        : [suggested[0]?.id || "proj-agent-emerging-markets", suggested[1]?.id || "proj-agent-customer-dynamics"];

      return {
        ...prev,
        [msgId]: {
          ...current,
          selectedAgentIds: chosen,
          selectedAgentId: chosen[0],
          activeAgentId: chosen[0],
          isAgent2Active: chosen.length >= 2,
          hasRunAgents: true,
          isGenerating: false,
          isReportGenerated: false,
        },
      };
    });

    scrollToTarget(".report-flow-configuration-container", "start");
  };

  const isAgentInvokedForRequest = (agentId: string) => {
    if (project.id !== "personal-care-south-asia") {
      return false;
    }

    // Only after chat AI suggests agents in the conversation do these badges appear
    const hasAiSuggestedAgentsMsg = messages.some(
      (m) =>
        m.sender === "assistant" &&
        (m.id.startsWith("ai-flow-") ||
          m.text.includes("assembled two specialized agents") ||
          m.text.includes("Select an agent to begin configuration"))
    );

    if (!hasAiSuggestedAgentsMsg) {
      return false;
    }

    const activeFlowEntry = Object.values(reportFlows).reverse().find((f) => f.activeAgentId || f.selectedAgentId);
    if (activeFlowEntry) {
      const selectedList = activeFlowEntry.selectedAgentIds && activeFlowEntry.selectedAgentIds.length > 0
        ? activeFlowEntry.selectedAgentIds
        : activeFlowEntry.selectedAgentId ? [activeFlowEntry.selectedAgentId] : [];
      if (selectedList.length > 0) {
        return selectedList.includes(agentId);
      }
      if (activeFlowEntry.activeAgentId) {
        const suggested = projectRelatedAgents.slice(0, 2);
        return suggested.some((a) => a.id === agentId);
      }
    }

    return (
      agentId === "proj-agent-emerging-markets" ||
      agentId === "proj-agent-customer-dynamics"
    );
  };

  const handleUpdateFlowField = (
    msgId: string,
    section: "agent1Fields" | "agent2Fields",
    field: string,
    value: string
  ) => {
    setReportFlows((prev) => {
      const current = prev[msgId] || { ...defaultReportFlowState };
      return {
        ...prev,
        [msgId]: {
          ...current,
          [section]: {
            ...current[section],
            [field]: value,
          },
        },
      };
    });
  };

  const scrollToTarget = (selector: string, block: ScrollLogicalPosition = "start") => {
    if (typeof window === "undefined") return;
    setTimeout(() => {
      if (typeof window.scrollTo === "function") {
        window.scrollTo(0, 0);
      }
      const canvas = document.querySelector(".workspace-canvas") as HTMLElement | null;
      const el = document.querySelector(selector) as HTMLElement | null;
      if (canvas && el) {
        const canvasRect = canvas.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const targetScrollTop = canvas.scrollTop + (elRect.top - canvasRect.top) - 24;
        if (typeof canvas.scrollTo === "function") {
          canvas.scrollTo({ top: Math.max(0, targetScrollTop), behavior: "smooth" });
        } else {
          canvas.scrollTop = Math.max(0, targetScrollTop);
        }
      } else if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ behavior: "smooth", block });
      }
    }, 60);
  };

  const handleGenerateReport = (msgId: string) => {
    setReportFlows((prev) => {
      const current = prev[msgId] || { ...defaultReportFlowState };
      return {
        ...prev,
        [msgId]: {
          ...current,
          isGenerating: true,
          isReportGenerated: false,
        },
      };
    });

    const isVitest = typeof process !== "undefined" && Boolean(process.env?.VITEST);
    setTimeout(() => {
      setReportFlows((prev) => {
        const current = prev[msgId];
        if (!current) return prev;
        return {
          ...prev,
          [msgId]: {
            ...current,
            isGenerating: false,
            isReportGenerated: true,
          },
        };
      });
      scrollToTarget(".report-flow-generated-card, #agent-report-section", "start");
    }, isVitest ? 80 : 2200);
  };

  const handleGenerateWithAgent = (agent: AgentItem) => {
    setSelectedRecommendedAgentId(agent.id);
    setGeneratingAgentId(agent.id);
    setActiveReportAgentId(null);

    scrollToTarget(".ai-agent-generating-loader-wrap, .ai-recommended-agents-footer", "start");

    const duration = typeof process !== "undefined" && process.env.NODE_ENV === "test" ? 400 : 3000;
    setTimeout(() => {
      setGeneratingAgentId(null);
      setGeneratedAgents((prev) => ({ ...prev, [agent.id]: true }));
      setActiveReportAgentId(agent.id);

      scrollToTarget("#agent-report-section", "start");

      // If in New chat, update title to the agent
      if (selectedChat === "New chat") {
        const cleanTitle = agent.title.length > 28 ? agent.title.slice(0, 28) + "..." : agent.title;
        setProjectChats((prev) => ({
          ...prev,
          [project.id]: (prev[project.id] || []).map((c) =>
            c.id === currentChatKey ? { ...c, title: cleanTitle } : c
          ),
        }));
        setSelectedChat(cleanTitle);
      }
    }, duration);
  };

  const renderAgentReport = (agentId: string) => {
    const isHomeLoan = agentId === "agent-sbi-home-loan" || agentId.includes("home-loan") || agentId.includes("Home Loan");
    const hasMultipleGenerated = !!(generatedAgents["agent-sbi-home-loan"] && generatedAgents["agent-sbi-kyc"]);

    const reportAgent =
      (agents && agents.length > 0 ? agents : initialAgents).find(
        (a) =>
          a.id === agentId ||
          a.id === activeReportAgentId ||
          a.id === selectedRecommendedAgentId ||
          (isHomeLoan ? a.title.includes("Home Loan") : a.title.includes("Emerging Markets"))
      ) ||
      projectRelatedAgents.find((a) => a.id === agentId || (isHomeLoan ? a.title.includes("Home Loan") : a.title.includes("Emerging Markets"))) ||
      initialAgents[0];

    const getReportQuestions = () => {
      if (isHomeLoan) {
        return [
          "What is the zonal breakdown of agricultural vs commercial loan performance?",
          "How are non-encumbrance certifications verified across zonal circles?",
          "What risk mitigation policies apply to loan-to-value ratios above 65%?",
        ];
      }
      if (agentId.includes("customer-persona") || agentId.includes("Customer Persona")) {
        return [
          "What messaging resonates most with pragmatic homemaker cohorts?",
          "How can we integrate regional vernacular tutorials into product packaging?",
          "What dermatological certifications generate the strongest purchase intent?",
        ];
      }
      if (agentId.includes("market-sizing") || agentId.includes("Market Sizing")) {
        return [
          "What is the projected 3-year category TAM expansion for non-metro hubs?",
          "Which product categories deliver the highest gross margin velocity?",
          "What capital allocation is required to reach 2.5% regional market share?",
        ];
      }
      return [
        "Which 5 Tier-2 cities have the highest trial pack conversion velocity?",
        "What are the distributor trade margin structures across secondary cities?",
        "How do quick-commerce dark stores compare with regional kirana networks?",
      ];
    };

    const suggestedQuestions = getReportQuestions();

    const isCityVelocity = agentId === "city-velocity" || agentId.includes("city-velocity");
    const isMarginStructures = agentId === "margin-structures" || agentId.includes("margin-structures");
    const isQuickCommerce = agentId === "quick-commerce-comparison" || agentId.includes("quick-commerce");

    if (isCityVelocity) {
      const cityQuestions = [
        "What are the distributor trade margin structures across secondary cities?",
        "How do quick-commerce dark stores compare with regional kirana networks?",
        "What price threshold triggers the highest repeat skincare purchase?",
      ];

      return (
        <div className="agent-report-wrapper">
          <section className="agent-report-card openui-report-card" aria-label="Top 5 Tier-2 Cities Trial Pack Conversion Velocity Report">
            {/* Header */}
            <div className="openui-header">
              <div className="openui-header-info">
                <h3 className="openui-title">
                  Top 5 Tier-2 Cities: Trial Pack Conversion Velocity & Regional Adoption
                </h3>
                <p className="openui-subtitle">
                  Granular city-level velocity audit across 24 secondary urban clusters in South Asia (Q1–Q3 2026).
                </p>
              </div>

              <div className="openui-header-actions">
                <button
                  type="button"
                  onClick={() => {
                    const reportKey = "agent-report-city-velocity";
                    if (savedMsgIds[reportKey]) return;
                    setSavedMsgIds((prev) => ({ ...prev, [reportKey]: true }));
                    const newInsight: SavedInsightItem = {
                      id: `insight-${reportKey}-${Date.now()}`,
                      category: "Executive Reports",
                      title: "Top 5 Tier-2 Cities: Trial Pack Conversion Velocity & Regional Adoption",
                      insight: "Top 5 secondary clusters (Jaipur, Lucknow, Indore, Chandigarh, Surat) average 30.1% 60-day repeat conversion with ₹1.64 Cr monthly introductory pack GMV.",
                      source: `Report · ${project.title}`,
                      time: "Just now",
                      isBookmarked: true,
                    };
                    setSavedInsightsList((prev) => [newInsight, ...prev]);
                  }}
                  className={`save-insight-btn ${savedMsgIds["agent-report-city-velocity"] ? "saved" : ""}`}
                  title={savedMsgIds["agent-report-city-velocity"] ? "Saved to insights" : "Save insight"}
                  aria-label={savedMsgIds["agent-report-city-velocity"] ? "Saved to insights" : "Save insight"}
                >
                  {savedMsgIds["agent-report-city-velocity"] ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Saved to insights</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Save insight</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3 Large Stat Metrics Row */}
            <div className="openui-metrics-row">
              <div className="openui-metric-box">
                <div className="openui-metric-number">30.1%</div>
                <div className="openui-metric-subline">
                  <span className="openui-metric-name">Average 60-day repeat conversion</span>
                  <span className="openui-metric-delta positive">+12.4% MoM</span>
                </div>
              </div>

              <div className="openui-metric-box">
                <div className="openui-metric-number">₹1.64 Cr</div>
                <div className="openui-metric-subline">
                  <span className="openui-metric-name">Monthly trial pack GMV</span>
                  <span className="openui-metric-delta positive">+18.6% MoM</span>
                </div>
              </div>

              <div className="openui-metric-box">
                <div className="openui-metric-number">₹640</div>
                <div className="openui-metric-subline">
                  <span className="openui-metric-name">Post-trial regimen basket size</span>
                  <span className="openui-metric-delta positive">3.2× vs Entry Trial</span>
                </div>
              </div>
            </div>

            {/* Ranked City Cards (Clean Enterprise Layout: Title/Corridor + Stat Columns + Sparklines) */}
            <div className="openui-ranked-list">
              {[
                {
                  name: "Jaipur",
                  corridor: "Rajasthan Regional Hub",
                  monthlyVol: "₹42,80,000",
                  packsDisbursed: "32,400 packs",
                  repeatRate: "34.8%",
                  velocityDelta: "+14.2% MoM",
                  sparklineD: "M 8 42 Q 32 38, 56 34 T 88 22 T 106 16 T 116 12",
                  sparklineFill: "M 8 42 Q 32 38, 56 34 T 88 22 T 106 16 T 116 12 L 116 48 L 8 48 Z",
                },
                {
                  name: "Lucknow",
                  corridor: "Northern Growth Belt",
                  monthlyVol: "₹36,50,000",
                  packsDisbursed: "27,600 packs",
                  repeatRate: "31.2%",
                  velocityDelta: "+11.8% MoM",
                  sparklineD: "M 8 43 Q 32 39, 56 33 T 88 25 T 106 18 T 116 14",
                  sparklineFill: "M 8 43 Q 32 39, 56 33 T 88 25 T 106 18 T 116 14 L 116 48 L 8 48 Z",
                },
                {
                  name: "Indore",
                  corridor: "Central Commercial Corridor",
                  monthlyVol: "₹31,40,000",
                  packsDisbursed: "23,800 packs",
                  repeatRate: "29.6%",
                  velocityDelta: "+10.4% MoM",
                  sparklineD: "M 8 44 Q 32 40, 56 35 T 88 27 T 106 21 T 116 16",
                  sparklineFill: "M 8 44 Q 32 40, 56 35 T 88 27 T 106 21 T 116 16 L 116 48 L 8 48 Z",
                },
                {
                  name: "Chandigarh",
                  corridor: "Tri-City Affluent Cluster",
                  monthlyVol: "₹28,20,000",
                  packsDisbursed: "19,200 packs",
                  repeatRate: "28.1%",
                  velocityDelta: "+9.2% MoM",
                  sparklineD: "M 8 43 Q 32 39, 56 34 T 88 29 T 106 23 T 116 18",
                  sparklineFill: "M 8 43 Q 32 39, 56 34 T 88 29 T 106 23 T 116 18 L 116 48 L 8 48 Z",
                },
                {
                  name: "Surat",
                  corridor: "Western Industrial Corridor",
                  monthlyVol: "₹25,10,000",
                  packsDisbursed: "18,400 packs",
                  repeatRate: "26.4%",
                  velocityDelta: "+8.6% MoM",
                  sparklineD: "M 8 45 Q 32 42, 56 37 T 88 31 T 106 25 T 116 20",
                  sparklineFill: "M 8 45 Q 32 42, 56 37 T 88 31 T 106 25 T 116 20 L 116 48 L 8 48 Z",
                },
              ].map((c) => (
                <div key={c.name} className="openui-ranked-row">
                  <div className="openui-ranked-main">
                    <div className="openui-ranked-content">
                      <div className="openui-ranked-title-wrap">
                        <h4 className="openui-ranked-title">{c.name}</h4>
                        <span className="openui-ranked-corridor-tag">{c.corridor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="openui-ranked-stats-grid">
                    <div className="openui-ranked-stat-col">
                      <span className="openui-ranked-stat-label">Monthly Volume</span>
                      <span className="openui-ranked-stat-val">{c.monthlyVol}</span>
                    </div>

                    <div className="openui-ranked-stat-col">
                      <span className="openui-ranked-stat-label">Disbursed Packs</span>
                      <span className="openui-ranked-stat-val">{c.packsDisbursed}</span>
                    </div>

                    <div className="openui-ranked-stat-col">
                      <span className="openui-ranked-stat-label">60-Day Repeat</span>
                      <span className="openui-ranked-stat-val">{c.repeatRate}</span>
                    </div>

                    <div className="openui-ranked-stat-col">
                      <span className="openui-ranked-stat-label">Velocity Growth</span>
                      <span className="openui-ranked-stat-delta">{c.velocityDelta}</span>
                    </div>

                    <div className="openui-ranked-sparkline">
                      <svg viewBox="0 0 140 50" className="openui-sparkline-svg" aria-label={`${c.name} Velocity Trend Sparkline`}>
                        <defs>
                          <linearGradient id={`sparkline-grad-${c.name}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d={c.sparklineFill} fill={`url(#sparkline-grad-${c.name})`} />
                        <path d={c.sparklineD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Related actions below report */}
          <div className="message-related-actions agent-report-related-actions" aria-label="Related actions">
            <div className="message-related-actions-header">
              <span className="message-related-actions-title">Related actions</span>
            </div>
            <div className="message-related-actions-list">
              {cityQuestions.map((question, qIdx) => (
                <button
                  key={qIdx}
                  type="button"
                  onClick={() => handleSend(question, reportAgent)}
                  className="message-related-action-btn"
                  title={`Ask: ${question}`}
                >
                  <Search className="message-related-action-icon" aria-hidden="true" />
                  <span>{question}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (isMarginStructures) {
      const marginQuestions = [
        "Which 5 Tier-2 cities have the highest trial pack conversion velocity?",
        "How do quick-commerce dark stores compare with regional kirana networks?",
        "How should we phase distributor onboarding across the 24 urban clusters?",
      ];

      return (
        <div className="agent-report-wrapper">
          <section className="agent-report-card openui-report-card" aria-label="Secondary Cities Distributor Trade Margin Architecture Report">
            {/* Header */}
            <div className="openui-header">
              <div className="openui-header-info">
                <h3 className="openui-title">
                  Secondary Cities Distributor Trade Margin Architecture & Channel Economics
                </h3>
                <p className="openui-subtitle">
                  Calibrated trade discount, credit cycle, and incentive structure across Pan-South Asia regional distribution tiers.
                </p>
              </div>

              <div className="openui-header-actions">
                <button
                  type="button"
                  onClick={() => {
                    const reportKey = "agent-report-margin-structures";
                    if (savedMsgIds[reportKey]) return;
                    setSavedMsgIds((prev) => ({ ...prev, [reportKey]: true }));
                    const newInsight: SavedInsightItem = {
                      id: `insight-${reportKey}-${Date.now()}`,
                      category: "Executive Reports",
                      title: "Secondary Cities Distributor Trade Margin Architecture",
                      insight: "Trade margin architecture establishes 12.8% distributor base, 20.4% retailer counter placement, and 21-day credit terms across Pan-South Asia secondary networks.",
                      source: `Report · ${project.title}`,
                      time: "Just now",
                      isBookmarked: true,
                    };
                    setSavedInsightsList((prev) => [newInsight, ...prev]);
                  }}
                  className={`save-insight-btn ${savedMsgIds["agent-report-margin-structures"] ? "saved" : ""}`}
                  title={savedMsgIds["agent-report-margin-structures"] ? "Saved to insights" : "Save insight"}
                  aria-label={savedMsgIds["agent-report-margin-structures"] ? "Saved to insights" : "Save insight"}
                >
                  {savedMsgIds["agent-report-margin-structures"] ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Saved to insights</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Save insight</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3 Large Stat Metrics Row */}
            <div className="openui-metrics-row">
              <div className="openui-metric-box">
                <div className="openui-metric-number">12.8%</div>
                <div className="openui-metric-subline">
                  <span className="openui-metric-name">Weighted distributor base margin</span>
                  <span className="openui-metric-delta positive">Target 12%–14%</span>
                </div>
              </div>

              <div className="openui-metric-box">
                <div className="openui-metric-number">20.4%</div>
                <div className="openui-metric-subline">
                  <span className="openui-metric-name">Retailer counter placement margin</span>
                  <span className="openui-metric-delta positive">Target 18%–22%</span>
                </div>
              </div>

              <div className="openui-metric-box">
                <div className="openui-metric-number">21 Days</div>
                <div className="openui-metric-subline">
                  <span className="openui-metric-name">C&F working capital credit cycle</span>
                  <span className="openui-metric-delta positive">vs 30d benchmark</span>
                </div>
              </div>
            </div>

            {/* Unwrapped Multi-Tier Channel Economics Table with Left-Side Highlight */}
            <div className="openui-table-section">
              <div className="openui-table-section-header">
                <h4 className="openui-panel-title">Multi-Tier Channel Economics & Distributor Incentive Grid</h4>
              </div>

              <div className="openui-table-responsive openui-unwrapped-table-wrap">
                <table className="openui-table openui-highlight-table" role="table" aria-label="Distributor Margin Grid">
                  <thead className="agent-table-head">
                    <tr>
                      <th scope="col" className="openui-highlight-col">Distribution Channel & Entity</th>
                      <th scope="col">Network Infrastructure</th>
                      <th scope="col">Base Margin</th>
                      <th scope="col">Incentive Rebate</th>
                      <th scope="col">Credit Cycle</th>
                      <th scope="col">Min Order Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="agent-table-cell-bold openui-highlight-col">Carrying & Forwarding (C&F) Agents</td>
                      <td>Super C&F State Hubs (Jaipur, Lucknow, Ahmedabad)</td>
                      <td className="agent-table-cell-bold">10.5%</td>
                      <td>+1.5% On-Time Dispatch</td>
                      <td>21 Days Net</td>
                      <td>₹15,00,000</td>
                    </tr>
                    <tr>
                      <td className="agent-table-cell-bold openui-highlight-col">Regional FMCG Super-Stockists</td>
                      <td>City Redistribution Hubs (24 Urban Clusters)</td>
                      <td className="agent-table-cell-bold">12.5%</td>
                      <td>+2.0% Quarterly Rebate</td>
                      <td>14 Days Post-Delivery</td>
                      <td>₹5,00,000</td>
                    </tr>
                    <tr>
                      <td className="agent-table-cell-bold openui-highlight-col">High-Frequency Kirana Retailers</td>
                      <td>Neighborhood General Stores (50,000+ outlets)</td>
                      <td className="agent-table-cell-bold">19.5%</td>
                      <td>+2.5% COD Discount</td>
                      <td>7 Days / Weekly Cash</td>
                      <td>₹25,000</td>
                    </tr>

                    {/* Group 2 Header */}
                    <tr>
                      <td colSpan={6} className="openui-table-group-header">
                        Modern Trade, Quick-Commerce & Healthcare Networks
                      </td>
                    </tr>
                    <tr>
                      <td className="agent-table-cell-bold openui-highlight-col">Quick-Commerce Dark Stores</td>
                      <td>Micro-Fulfillment Dark Store Hubs (120+ pods)</td>
                      <td className="agent-table-cell-bold">16.5%</td>
                      <td>+1.5% Co-Funded Placement</td>
                      <td>15 Days Electronic Settle</td>
                      <td>₹2,00,000 / pod</td>
                    </tr>
                    <tr>
                      <td className="agent-table-cell-bold openui-highlight-col">Pharmacy & Dermatologist Corridors</td>
                      <td>Regional Clinical Drugstores (12,000+ points)</td>
                      <td className="agent-table-cell-bold">22.0%</td>
                      <td>+3.0% Sampling Display</td>
                      <td>30 Days Institutional</td>
                      <td>₹1,00,000</td>
                    </tr>
                    <tr>
                      <td className="agent-table-cell-bold openui-highlight-col">Omnichannel D2C & Regional Hubs</td>
                      <td>Regional Surface Logistics & Sampling Pop-ups</td>
                      <td className="agent-table-cell-bold">8.5% (Cost)</td>
                      <td>91.5% Net Retained</td>
                      <td>T+2 Gateway Settle</td>
                      <td>₹499 (Free Delivery)</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="agent-table-cell-bold openui-highlight-col">Total Network Synthesis</td>
                      <td className="agent-table-cell-bold">Pan-South Asia Integrated Network</td>
                      <td className="agent-table-cell-bold">13.8% Blended</td>
                      <td className="agent-table-cell-bold">Active Schemes</td>
                      <td className="agent-table-cell-bold">18.2 Days Avg</td>
                      <td className="agent-table-cell-bold">Multi-Tier MOV</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </section>

          {/* Related actions below report */}
          <div className="message-related-actions agent-report-related-actions" aria-label="Related actions">
            <div className="message-related-actions-header">
              <span className="message-related-actions-title">Related actions</span>
            </div>
            <div className="message-related-actions-list">
              {marginQuestions.map((question, qIdx) => (
                <button
                  key={qIdx}
                  type="button"
                  onClick={() => handleSend(question, reportAgent)}
                  className="message-related-action-btn"
                  title={`Ask: ${question}`}
                >
                  <Search className="message-related-action-icon" aria-hidden="true" />
                  <span>{question}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (isQuickCommerce) {
      const qCommerceQuestions = [
        "Which 5 Tier-2 cities have the highest trial pack conversion velocity?",
        "What are the distributor trade margin structures across secondary cities?",
        "What regional climate-adaptive claims drive immediate consumer trust?",
      ];

      return (
        <div className="agent-report-wrapper">
          <section className="agent-report-card openui-report-card" aria-label="Quick-Commerce Dark Stores vs Regional Kirana Networks Report">
            {/* Header */}
            <div className="openui-header">
              <div className="openui-header-info">
                <h3 className="openui-title">
                  Channel Economics: Quick-Commerce Dark Stores vs. Regional Kirana Networks
                </h3>
                <p className="openui-subtitle">
                  Comparative throughput, customer acquisition dynamics, and unit economics across secondary South Asian cities.
                </p>
              </div>

              <div className="openui-header-actions">
                <button
                  type="button"
                  onClick={() => {
                    const reportKey = "agent-report-quick-commerce";
                    if (savedMsgIds[reportKey]) return;
                    setSavedMsgIds((prev) => ({ ...prev, [reportKey]: true }));
                    const newInsight: SavedInsightItem = {
                      id: `insight-${reportKey}-${Date.now()}`,
                      category: "Executive Reports",
                      title: "Quick-Commerce Dark Stores vs. Regional Kirana Networks",
                      insight: "Comparative channel audit reveals Quick-Commerce drives rapid high-ticket serum trials (₹520 basket) while Kirana networks provide long-term daily replenishment anchor (₹210 basket).",
                      source: `Report · ${project.title}`,
                      time: "Just now",
                      isBookmarked: true,
                    };
                    setSavedInsightsList((prev) => [newInsight, ...prev]);
                  }}
                  className={`save-insight-btn ${savedMsgIds["agent-report-quick-commerce"] ? "saved" : ""}`}
                  title={savedMsgIds["agent-report-quick-commerce"] ? "Saved to insights" : "Save insight"}
                  aria-label={savedMsgIds["agent-report-quick-commerce"] ? "Saved to insights" : "Save insight"}
                >
                  {savedMsgIds["agent-report-quick-commerce"] ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Saved to insights</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Save insight</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Side-by-Side Channel Overview Cards */}
            <div className="openui-compare-cards-row">
              {/* Quick-Commerce Card */}
              <div className="openui-compare-card">
                <div className="openui-compare-card-header">
                  <h4 className="openui-compare-card-title">Quick-Commerce Dark Stores (Blinkit / Zepto / Instamart)</h4>
                  <span className="openui-ranked-corridor-tag">Digital Accelerator</span>
                </div>
                <div className="openui-compare-kpi-grid">
                  <div className="openui-compare-kpi">
                    <span className="openui-compare-kpi-val">10–25 Min</span>
                    <span className="openui-compare-kpi-label">Fulfillment Latency</span>
                  </div>
                  <div className="openui-compare-kpi">
                    <span className="openui-compare-kpi-val">₹520</span>
                    <span className="openui-compare-kpi-label">Average Basket Size</span>
                  </div>
                  <div className="openui-compare-kpi">
                    <span className="openui-compare-kpi-val">18–28 Yrs</span>
                    <span className="openui-compare-kpi-label">Primary Demographic</span>
                  </div>
                  <div className="openui-compare-kpi">
                    <span className="openui-compare-kpi-val">16.5%</span>
                    <span className="openui-compare-kpi-label">Gross Channel Margin</span>
                  </div>
                </div>
              </div>

              {/* Kirana Network Card */}
              <div className="openui-compare-card">
                <div className="openui-compare-card-header">
                  <h4 className="openui-compare-card-title">Regional Kirana & General Trade Networks</h4>
                  <span className="openui-ranked-corridor-tag" style={{ background: "#ecfdf5", color: "#059669" }}>
                    Volume Anchor
                  </span>
                </div>
                <div className="openui-compare-kpi-grid">
                  <div className="openui-compare-kpi">
                    <span className="openui-compare-kpi-val">Instant (0 Min)</span>
                    <span className="openui-compare-kpi-label">Walk-in Proximity</span>
                  </div>
                  <div className="openui-compare-kpi">
                    <span className="openui-compare-kpi-val">₹210</span>
                    <span className="openui-compare-kpi-label">Average Basket Size</span>
                  </div>
                  <div className="openui-compare-kpi">
                    <span className="openui-compare-kpi-val">28–45 Yrs</span>
                    <span className="openui-compare-kpi-label">Household Decision Makers</span>
                  </div>
                  <div className="openui-compare-kpi">
                    <span className="openui-compare-kpi-val">19.5%</span>
                    <span className="openui-compare-kpi-label">Retail Placement Margin</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Multi-Factor Scorecard Table */}
            <div className="agent-report-table-card openui-table-card">
              <div className="openui-panel-header">
                <h4 className="openui-panel-title">Strategic Multi-Factor Channel Evaluation Scorecard</h4>
              </div>

              <div className="openui-table-responsive">
                <table className="openui-table" role="table" aria-label="Quick-Commerce vs Kirana Scorecard">
                  <thead className="agent-table-head">
                    <tr>
                      <th scope="col">Operational Dimension</th>
                      <th scope="col">Quick-Commerce Dark Stores</th>
                      <th scope="col">Regional Kirana Networks</th>
                      <th scope="col">Strategic Advantage & Allocation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="agent-table-cell-bold">Purchase Motivation</td>
                      <td>Impulse discovery, emergency replenishment, trending serum trial</td>
                      <td>Routine weekly groceries, trusted counter recommendation</td>
                      <td className="agent-status-tag verified">Quick-Commerce for Trial; Kirana for Routine</td>
                    </tr>
                    <tr>
                      <td className="agent-table-cell-bold">Consumer Touch & Feel</td>
                      <td>Digital images, ingredient percentage breakdowns, peer video reviews</td>
                      <td>Physical in-hand product inspection, retailer personal endorsement</td>
                      <td className="agent-status-tag verified">Kirana drives higher initial brand trust</td>
                    </tr>
                    <tr>
                      <td className="agent-table-cell-bold">Order Re-Frequency</td>
                      <td>3.8 purchases / month (High digital engagement)</td>
                      <td>2.1 purchases / month (Bulk household replenishment)</td>
                      <td className="agent-status-tag verified">Quick-Commerce has 1.8x higher repeat frequency</td>
                    </tr>
                    <tr>
                      <td className="agent-table-cell-bold">Settlement & Cash Terms</td>
                      <td>15 Days electronic bank settlement</td>
                      <td>Weekly cash collection or 7-day credit cycle</td>
                      <td className="agent-status-tag verified">Quick-Commerce provides cleaner accounting</td>
                    </tr>
                    <tr>
                      <td className="agent-table-cell-bold">Geographic Reach</td>
                      <td>Concentrated in dense SEC A/B neighborhoods (24 top clusters)</td>
                      <td>Deep penetration across all Tier-2, Tier-3 and Tier-4 wards</td>
                      <td className="agent-status-tag verified">Kirana provides 6.2x wider physical reach</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Trajectory Chart */}
            <div className="openui-chart-panel">
              <div className="openui-panel-header">
                <h4 className="openui-panel-title">Quarterly GMV Throughput Expansion (₹ in Crores)</h4>
                <div className="openui-legend">
                  <div className="openui-legend-item">
                    <span className="openui-legend-swatch" style={{ background: "#2563eb" }} />
                    <span>Regional Kirana Network</span>
                  </div>
                  <div className="openui-legend-item">
                    <span className="openui-legend-swatch" style={{ background: "#93c5fd" }} />
                    <span>Quick-Commerce Dark Stores</span>
                  </div>
                </div>
              </div>

              <div className="openui-svg-container">
                <svg viewBox="0 0 800 240" className="openui-bar-svg" aria-label="Quarterly Channel GMV Bar Chart">
                  <line x1="50" y1="20" x2="780" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="70" x2="780" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="120" x2="780" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="170" x2="780" y2="170" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="210" x2="780" y2="210" stroke="#e2e8f0" strokeWidth="1.5" />

                  <text x="35" y="25" textAnchor="end" className="openui-axis-text">₹2.0 Cr</text>
                  <text x="35" y="75" textAnchor="end" className="openui-axis-text">₹1.5 Cr</text>
                  <text x="35" y="125" textAnchor="end" className="openui-axis-text">₹1.0 Cr</text>
                  <text x="35" y="175" textAnchor="end" className="openui-axis-text">₹0.5 Cr</text>

                  {/* Q1 2025 */}
                  <rect x="90" y="150" width="36" height="60" rx="4" fill="#2563eb" />
                  <rect x="132" y="185" width="36" height="25" rx="4" fill="#93c5fd" />
                  <text x="129" y="230" textAnchor="middle" className="openui-axis-month">Q1 2025</text>

                  {/* Q2 2025 */}
                  <rect x="200" y="130" width="36" height="80" rx="4" fill="#2563eb" />
                  <rect x="242" y="170" width="36" height="40" rx="4" fill="#93c5fd" />
                  <text x="239" y="230" textAnchor="middle" className="openui-axis-month">Q2 2025</text>

                  {/* Q3 2025 */}
                  <rect x="310" y="110" width="36" height="100" rx="4" fill="#2563eb" />
                  <rect x="352" y="150" width="36" height="60" rx="4" fill="#93c5fd" />
                  <text x="349" y="230" textAnchor="middle" className="openui-axis-month">Q3 2025</text>

                  {/* Q4 2025 */}
                  <rect x="420" y="90" width="36" height="120" rx="4" fill="#2563eb" />
                  <rect x="462" y="125" width="36" height="85" rx="4" fill="#93c5fd" />
                  <text x="459" y="230" textAnchor="middle" className="openui-axis-month">Q4 2025</text>

                  {/* Q1 2026 */}
                  <rect x="530" y="70" width="36" height="140" rx="4" fill="#2563eb" />
                  <rect x="572" y="100" width="36" height="110" rx="4" fill="#93c5fd" />
                  <text x="569" y="230" textAnchor="middle" className="openui-axis-month">Q1 2026</text>

                  {/* Q2 2026 (Peak) */}
                  <rect x="640" y="50" width="36" height="160" rx="4" fill="#2563eb" />
                  <rect x="682" y="75" width="36" height="135" rx="4" fill="#93c5fd" />
                  <text x="679" y="230" textAnchor="middle" className="openui-axis-month font-semibold">Q2 2026</text>
                </svg>
              </div>
            </div>
          </section>

          {/* Related actions below report */}
          <div className="message-related-actions agent-report-related-actions" aria-label="Related actions">
            <div className="message-related-actions-header">
              <span className="message-related-actions-title">Related actions</span>
            </div>
            <div className="message-related-actions-list">
              {qCommerceQuestions.map((question, qIdx) => (
                <button
                  key={qIdx}
                  type="button"
                  onClick={() => handleSend(question, reportAgent)}
                  className="message-related-action-btn"
                  title={`Ask: ${question}`}
                >
                  <Search className="message-related-action-icon" aria-hidden="true" />
                  <span>{question}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (isHomeLoan) {
      return (
        <div className="agent-report-wrapper">
          <section className="agent-report-card openui-report-card" aria-label="SBI Home Loan Monthly Report">
            {/* Header */}
            <div className="openui-header">
              <div className="openui-header-info">
                <h3 className="openui-title">
                  SBI Home Loan Monthly Performance & Disbursement Report
                </h3>
                <p className="openui-subtitle">
                  Across all regions in 2026, total home-loan disbursements reached ₹4,820.50 Cr with 18,460 accounts active.
                </p>
              </div>

              <div className="openui-header-actions">
                <button
                  type="button"
                  onClick={() => {
                    const reportKey = "agent-report-home-loan";
                    if (savedMsgIds[reportKey]) return;
                    setSavedMsgIds((prev) => ({ ...prev, [reportKey]: true }));
                    const newInsight: SavedInsightItem = {
                      id: `insight-${reportKey}-${Date.now()}`,
                      category: "Executive Reports",
                      title: "SBI Home Loan Monthly Performance & Disbursement Report",
                      insight: "Across all regions in 2026, total home-loan disbursements reached ₹4,820.50 Cr with 18,460 accounts active.",
                      source: `Report · ${project.title}`,
                      time: "Just now",
                      isBookmarked: true,
                    };
                    setSavedInsightsList((prev) => [newInsight, ...prev]);
                  }}
                  className={`save-insight-btn ${savedMsgIds["agent-report-home-loan"] ? "saved" : ""}`}
                  title={savedMsgIds["agent-report-home-loan"] ? "Saved to insights" : "Save insight"}
                  aria-label={savedMsgIds["agent-report-home-loan"] ? "Saved to insights" : "Save insight"}
                >
                  {savedMsgIds["agent-report-home-loan"] ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Saved to insights</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Save insight</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3 Large Stat Metrics Row */}
            <div className="openui-metrics-row">
              <div className="openui-metric-box">
                <div className="openui-metric-number">₹4,820.50 Cr</div>
                <div className="openui-metric-subline">
                  <span className="openui-metric-name">Total loan disbursements</span>
                  <span className="openui-metric-delta positive">+12.4%</span>
                </div>
              </div>

              <div className="openui-metric-box">
                <div className="openui-metric-number">18,460</div>
                <div className="openui-metric-subline">
                  <span className="openui-metric-name">Active loans disbursed</span>
                  <span className="openui-metric-delta positive">+9.1%</span>
                </div>
              </div>

              <div className="openui-metric-box">
                <div className="openui-metric-number">0.78%</div>
                <div className="openui-metric-subline">
                  <span className="openui-metric-name">Portfolio GNPL ratio</span>
                  <span className="openui-metric-delta positive">RBI &lt; 2.0%</span>
                </div>
              </div>
            </div>

            {/* Dual-Bar Grouped Chart: Jan to Nov */}
            <div className="openui-chart-panel">
              <div className="openui-panel-header">
                <h4 className="openui-panel-title">Monthly Disbursement Trends (₹ in Crores)</h4>
                <div className="openui-legend">
                  <span className="openui-legend-item">
                    <span className="openui-legend-swatch swatch-sanctioned" />
                    <span>Sanctioned</span>
                  </span>
                  <span className="openui-legend-item">
                    <span className="openui-legend-swatch swatch-disbursed" />
                    <span>Disbursed</span>
                  </span>
                </div>
              </div>

              <div className="openui-svg-container">
                <svg viewBox="0 0 880 280" className="openui-bar-svg" aria-label="Monthly disbursement grouped bar chart">
                  {/* Horizontal Gridlines & Y-Axis Labels */}
                  <line x1="60" y1="35" x2="850" y2="35" stroke="#f1f5f9" strokeWidth="1" />
                  <text x="52" y="39" textAnchor="end" className="openui-axis-text">5.0k</text>

                  <line x1="60" y1="78" x2="850" y2="78" stroke="#f1f5f9" strokeWidth="1" />
                  <text x="52" y="82" textAnchor="end" className="openui-axis-text">4.0k</text>

                  <line x1="60" y1="121" x2="850" y2="121" stroke="#f1f5f9" strokeWidth="1" />
                  <text x="52" y="125" textAnchor="end" className="openui-axis-text">3.0k</text>

                  <line x1="60" y1="164" x2="850" y2="164" stroke="#f1f5f9" strokeWidth="1" />
                  <text x="52" y="168" textAnchor="end" className="openui-axis-text">2.0k</text>

                  <line x1="60" y1="207" x2="850" y2="207" stroke="#f1f5f9" strokeWidth="1" />
                  <text x="52" y="211" textAnchor="end" className="openui-axis-text">1.0k</text>

                  <line x1="60" y1="230" x2="850" y2="230" stroke="#e2e8f0" strokeWidth="1.5" />
                  <text x="52" y="234" textAnchor="end" className="openui-axis-text">0</text>

                  {/* 11 Month Columns (Jan - Nov) with Dual Grouped Bars */}
                  {/* Jan */}
                  <rect x="80" y="145" width="16" height="85" rx="3" fill="#93c5fd" />
                  <rect x="99" y="125" width="16" height="105" rx="3" fill="#3b82f6" />
                  <text x="97" y="252" textAnchor="middle" className="openui-axis-month">Jan</text>

                  {/* Feb */}
                  <rect x="148" y="132" width="16" height="98" rx="3" fill="#93c5fd" />
                  <rect x="167" y="112" width="16" height="118" rx="3" fill="#3b82f6" />
                  <text x="165" y="252" textAnchor="middle" className="openui-axis-month">Feb</text>

                  {/* Mar */}
                  <rect x="216" y="120" width="16" height="110" rx="3" fill="#93c5fd" />
                  <rect x="235" y="98" width="16" height="132" rx="3" fill="#3b82f6" />
                  <text x="233" y="252" textAnchor="middle" className="openui-axis-month">Mar</text>

                  {/* Apr */}
                  <rect x="284" y="128" width="16" height="102" rx="3" fill="#93c5fd" />
                  <rect x="303" y="105" width="16" height="125" rx="3" fill="#3b82f6" />
                  <text x="301" y="252" textAnchor="middle" className="openui-axis-month">Apr</text>

                  {/* May */}
                  <rect x="352" y="118" width="16" height="112" rx="3" fill="#93c5fd" />
                  <rect x="371" y="94" width="16" height="136" rx="3" fill="#3b82f6" />
                  <text x="369" y="252" textAnchor="middle" className="openui-axis-month">May</text>

                  {/* Jun */}
                  <rect x="420" y="125" width="16" height="105" rx="3" fill="#93c5fd" />
                  <rect x="439" y="102" width="16" height="128" rx="3" fill="#3b82f6" />
                  <text x="437" y="252" textAnchor="middle" className="openui-axis-month">Jun</text>

                  {/* Jul */}
                  <rect x="488" y="114" width="16" height="116" rx="3" fill="#93c5fd" />
                  <rect x="507" y="90" width="16" height="140" rx="3" fill="#3b82f6" />
                  <text x="505" y="252" textAnchor="middle" className="openui-axis-month">Jul</text>

                  {/* Aug */}
                  <rect x="556" y="105" width="16" height="125" rx="3" fill="#93c5fd" />
                  <rect x="575" y="78" width="16" height="152" rx="3" fill="#3b82f6" />
                  <text x="573" y="252" textAnchor="middle" className="openui-axis-month">Aug</text>

                  {/* Sep */}
                  <rect x="624" y="95" width="16" height="135" rx="3" fill="#93c5fd" />
                  <rect x="643" y="65" width="16" height="165" rx="3" fill="#3b82f6" />
                  <text x="641" y="252" textAnchor="middle" className="openui-axis-month">Sep</text>

                  {/* Oct (Peak ₹4,820 Cr) */}
                  <rect x="692" y="82" width="16" height="148" rx="3" fill="#93c5fd" />
                  <rect x="711" y="46" width="16" height="184" rx="3" fill="#2563eb" />
                  <text x="709" y="252" textAnchor="middle" className="openui-axis-month font-semibold">Oct</text>

                  {/* Nov */}
                  <rect x="760" y="88" width="16" height="142" rx="3" fill="#93c5fd" />
                  <rect x="779" y="55" width="16" height="175" rx="3" fill="#3b82f6" />
                  <text x="777" y="252" textAnchor="middle" className="openui-axis-month">Nov</text>
                </svg>
              </div>
            </div>

            {/* Bottom 2-Column Grid */}
            <div className="openui-bottom-grid">
              {/* Left: Donut Chart */}
              <div className="openui-chart-panel">
                <div className="openui-panel-header">
                  <h4 className="openui-panel-title">Disbursement by City Tier & Category</h4>
                </div>
                <div className="openui-donut-wrap">
                  <svg viewBox="0 0 240 240" className="openui-donut-svg" aria-label="City Tier Disbursement Share Donut Chart">
                    <circle cx="120" cy="120" r="82" fill="none" stroke="#f1f5f9" strokeWidth="26" />
                    {/* Tier 1 (42%): 216 / 515 */}
                    <circle
                      cx="120"
                      cy="120"
                      r="82"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="26"
                      strokeDasharray="216 515"
                      strokeDashoffset="0"
                      transform="rotate(-90 120 120)"
                    />
                    {/* Tier 2 (36%): 185 / 515 */}
                    <circle
                      cx="120"
                      cy="120"
                      r="82"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="26"
                      strokeDasharray="185 515"
                      strokeDashoffset="-216"
                      transform="rotate(-90 120 120)"
                    />
                    {/* Tier 3 (22%): 114 / 515 */}
                    <circle
                      cx="120"
                      cy="120"
                      r="82"
                      fill="none"
                      stroke="#93c5fd"
                      strokeWidth="26"
                      strokeDasharray="114 515"
                      strokeDashoffset="-401"
                      transform="rotate(-90 120 120)"
                    />
                    <text x="120" y="115" textAnchor="middle" className="openui-donut-val-text">₹4,820M</text>
                    <text x="120" y="137" textAnchor="middle" className="openui-donut-sub-text">Total disbursed</text>
                  </svg>
                </div>
                <div className="openui-donut-legend">
                  <span className="openui-legend-item">
                    <span className="openui-legend-swatch" style={{ backgroundColor: "#2563eb" }} />
                    <span>Tier-1 Metro 42%</span>
                  </span>
                  <span className="openui-legend-item">
                    <span className="openui-legend-swatch" style={{ backgroundColor: "#6366f1" }} />
                    <span>Tier-2 Urban 36%</span>
                  </span>
                  <span className="openui-legend-item">
                    <span className="openui-legend-swatch" style={{ backgroundColor: "#93c5fd" }} />
                    <span>Tier-3 Emerging 22%</span>
                  </span>
                </div>
              </div>

              {/* Right: Area / Line Trend Chart */}
              <div className="openui-chart-panel">
                <div className="openui-panel-header">
                  <h4 className="openui-panel-title">Cumulative portfolio growth over time</h4>
                  <span className="openui-pill-badge">3.4× since 2020</span>
                </div>
                <div className="openui-svg-container">
                  <svg viewBox="0 0 460 220" className="openui-area-svg" aria-label="Portfolio growth area chart">
                    <defs>
                      <linearGradient id="openuiAreaGradHomeLoan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    {/* Gridlines & Y Axis */}
                    <line x1="55" y1="35" x2="435" y2="35" stroke="#f1f5f9" strokeWidth="1" />
                    <text x="47" y="39" textAnchor="end" className="openui-axis-text">20k</text>

                    <line x1="55" y1="75" x2="435" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                    <text x="47" y="79" textAnchor="end" className="openui-axis-text">15k</text>

                    <line x1="55" y1="115" x2="435" y2="115" stroke="#f1f5f9" strokeWidth="1" />
                    <text x="47" y="119" textAnchor="end" className="openui-axis-text">10k</text>

                    <line x1="55" y1="155" x2="435" y2="155" stroke="#f1f5f9" strokeWidth="1" />
                    <text x="47" y="159" textAnchor="end" className="openui-axis-text">5k</text>

                    <line x1="55" y1="180" x2="435" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
                    <text x="47" y="184" textAnchor="end" className="openui-axis-text">0</text>

                    {/* X Axis Years */}
                    <text x="60" y="202" textAnchor="middle" className="openui-axis-text">2020</text>
                    <text x="120" y="202" textAnchor="middle" className="openui-axis-text">2021</text>
                    <text x="180" y="202" textAnchor="middle" className="openui-axis-text">2022</text>
                    <text x="240" y="202" textAnchor="middle" className="openui-axis-text">2023</text>
                    <text x="300" y="202" textAnchor="middle" className="openui-axis-text">2024</text>
                    <text x="360" y="202" textAnchor="middle" className="openui-axis-text">2025</text>
                    <text x="420" y="202" textAnchor="middle" className="openui-axis-text font-semibold">2026</text>

                    {/* Area fill */}
                    <path
                      d="M 60 155 Q 120 148 180 136 T 300 95 T 360 62 T 420 34 L 420 180 L 60 180 Z"
                      fill="url(#openuiAreaGradHomeLoan)"
                    />
                    {/* Top curve (Disbursed) */}
                    <path
                      d="M 60 155 Q 120 148 180 136 T 300 95 T 360 62 T 420 34"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                    />
                    {/* Endpoint dot */}
                    <circle cx="420" cy="34" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                    {/* Lower curve (Sanctioned baseline) */}
                    <path
                      d="M 60 168 Q 120 162 180 154 T 300 130 T 360 112 T 420 102"
                      fill="none"
                      stroke="#93c5fd"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />
                  </svg>
                </div>
                <div className="openui-legend openui-legend-center">
                  <span className="openui-legend-item">
                    <span className="openui-legend-swatch swatch-disbursed" />
                    <span>Disbursed</span>
                  </span>
                  <span className="openui-legend-item">
                    <span className="openui-legend-swatch swatch-sanctioned" />
                    <span>Sanctioned</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Performance Table */}
            <div className="agent-report-table-card openui-table-card">
              <div className="openui-panel-header">
                <h4 className="openui-panel-title">Regional Zonal Breakdown & Compliance Review</h4>
              </div>

              <div className="agent-table-wrapper">
                <table className="agent-data-table">
                  <thead>
                    <tr>
                      <th>Zone / Operating Region</th>
                      <th>Applications</th>
                      <th>Sanctioned</th>
                      <th>Disbursed Amount</th>
                      <th>Avg Interest Rate</th>
                      <th>Compliance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="agent-table-cell-bold">North Zone (Delhi NCR, Punjab, Haryana)</td>
                      <td>4,920</td>
                      <td>4,610</td>
                      <td>₹1,248.20 Cr</td>
                      <td>8.45%</td>
                      <td className="agent-status-tag verified">Verified</td>
                    </tr>
                    <tr>
                      <td className="agent-table-cell-bold">West Zone (Mumbai, Pune, Ahmedabad)</td>
                      <td>5,680</td>
                      <td>5,340</td>
                      <td>₹1,496.50 Cr</td>
                      <td>8.40%</td>
                      <td className="agent-status-tag verified">Verified</td>
                    </tr>
                    <tr>
                      <td className="agent-table-cell-bold">South Zone (Bengaluru, Chennai, Hyderabad)</td>
                      <td>4,810</td>
                      <td>4,520</td>
                      <td>₹1,214.80 Cr</td>
                      <td>8.50%</td>
                      <td className="agent-status-tag verified">Verified</td>
                    </tr>
                    <tr>
                      <td className="agent-table-cell-bold">East & Central (Kolkata, Lucknow, Patna)</td>
                      <td>4,210</td>
                      <td>3,990</td>
                      <td>₹861.00 Cr</td>
                      <td>8.55%</td>
                      <td className="agent-status-tag verified">Verified</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="agent-table-cell-bold">Total Pan-India Summary</td>
                      <td className="agent-table-cell-bold">19,620</td>
                      <td className="agent-table-cell-bold">18,460</td>
                      <td className="agent-table-cell-bold">₹4,820.50 Cr</td>
                      <td className="agent-table-cell-bold">8.47%</td>
                      <td className="agent-table-cell-bold agent-status-tag verified">100% Compliant</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Regulatory Governance Box */}
            <div className="agent-report-audit-card openui-audit-card">
              <h4 className="openui-audit-heading">Regulatory Compliance & Scope Isolation</h4>
              <div className="agent-audit-grid">
                <div className="agent-audit-item">
                  <span className="agent-audit-label">Scope Isolation</span>
                  <p className="agent-audit-desc">
                    Strict residential home loan portfolio verification enforced. Auto loans, commercial vehicle finance, and vacant land loans are 100% excluded from this reporting cycle.
                  </p>
                </div>
                <div className="agent-audit-item">
                  <span className="agent-audit-label">Risk & Benchmark Governance</span>
                  <p className="agent-audit-desc">
                    Portfolio weighted average LTV is 68.4% against RBI benchmark limit of 75.00%. Floating interest rates are 100% pegged to the External Benchmark Lending Rate (EBLR).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Related actions below report */}
          <div className="message-related-actions agent-report-related-actions" aria-label="Related actions">
            <div className="message-related-actions-header">
              <span className="message-related-actions-title">Related actions</span>
            </div>
            <div className="message-related-actions-list">
              {suggestedQuestions.map((question, qIdx) => (
                <button
                  key={qIdx}
                  type="button"
                  onClick={() => handleSend(question, reportAgent)}
                  className="message-related-action-btn"
                  title={`Ask: ${question}`}
                >
                  <Search className="message-related-action-icon" aria-hidden="true" />
                  <span>{question}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Otherwise Market Intelligence Report for Personal Care Brand
    return (
      <div className="agent-report-wrapper">
        <section className="agent-report-card openui-report-card" aria-label="Personal Care South Asia Market Entry Report">
          {/* Header */}
          <div className="openui-header">
            <div className="openui-header-info">
              <h3 className="openui-title">
                Personal Care Brand: South Asia Tier-2 & Tier-3 Market Entry Report
              </h3>
              <p className="openui-subtitle">
                Across all secondary urban retail corridors in 2026, 142,850 households surveyed with 98.6% channel velocity confidence.
              </p>
            </div>

            <div className="openui-header-actions">
              <button
                type="button"
                onClick={() => {
                  const reportKey = "agent-report-south-asia";
                  if (savedMsgIds[reportKey]) return;
                  setSavedMsgIds((prev) => ({ ...prev, [reportKey]: true }));
                  const newInsight: SavedInsightItem = {
                    id: `insight-${reportKey}-${Date.now()}`,
                    category: "Executive Reports",
                    title: "Personal Care Brand: South Asia Tier-2 & Tier-3 Market Entry Report",
                    insight: "Across all secondary urban retail corridors in 2026, 142,850 households surveyed with 98.6% channel velocity confidence.",
                    source: `Report · ${project.title}`,
                    time: "Just now",
                    isBookmarked: true,
                  };
                  setSavedInsightsList((prev) => [newInsight, ...prev]);
                }}
                className={`save-insight-btn ${savedMsgIds["agent-report-south-asia"] ? "saved" : ""}`}
                title={savedMsgIds["agent-report-south-asia"] ? "Saved to insights" : "Save insight"}
                aria-label={savedMsgIds["agent-report-south-asia"] ? "Saved to insights" : "Save insight"}
              >
                {savedMsgIds["agent-report-south-asia"] ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Saved to insights</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Save insight</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3 Large Stat Metrics Row */}
          <div className="openui-metrics-row">
            <div className="openui-metric-box">
              <div className="openui-metric-number">142,850</div>
              <div className="openui-metric-subline">
                <span className="openui-metric-name">Target consumer households</span>
                <span className="openui-metric-delta positive">+8.6% MoM</span>
              </div>
            </div>

            <div className="openui-metric-box">
              <div className="openui-metric-number">98.6%</div>
              <div className="openui-metric-subline">
                <span className="openui-metric-name">Retail placement velocity</span>
                <span className="openui-metric-delta positive">+2.4% vs Category</span>
              </div>
            </div>

            <div className="openui-metric-box">
              <div className="openui-metric-number">₹380 – ₹450</div>
              <div className="openui-metric-subline">
                <span className="openui-metric-name">Mass-premium sweet spot</span>
                <span className="openui-metric-delta positive">&lt; ₹500 Threshold</span>
              </div>
            </div>
          </div>

          {/* Dual-Bar Grouped Chart: Jan to Nov */}
          <div className="openui-chart-panel">
            <div className="openui-panel-header">
              <h4 className="openui-panel-title">Monthly Trial Kit Distribution & Conversion Velocity</h4>
              <div className="openui-legend">
                <span className="openui-legend-item">
                  <span className="openui-legend-swatch swatch-sanctioned" />
                  <span>Distributed Samples</span>
                </span>
                <span className="openui-legend-item">
                  <span className="openui-legend-swatch swatch-disbursed" />
                  <span>Repeat Purchases</span>
                </span>
              </div>
            </div>

            <div className="openui-svg-container">
              <svg viewBox="0 0 880 280" className="openui-bar-svg" aria-label="Monthly trial kit distribution and repeat purchases grouped bar chart">
                {/* Horizontal Gridlines & Y-Axis Labels */}
                <line x1="60" y1="35" x2="850" y2="35" stroke="#f1f5f9" strokeWidth="1" />
                <text x="52" y="39" textAnchor="end" className="openui-axis-text">30k</text>

                <line x1="60" y1="78" x2="850" y2="78" stroke="#f1f5f9" strokeWidth="1" />
                <text x="52" y="82" textAnchor="end" className="openui-axis-text">25k</text>

                <line x1="60" y1="121" x2="850" y2="121" stroke="#f1f5f9" strokeWidth="1" />
                <text x="52" y="125" textAnchor="end" className="openui-axis-text">20k</text>

                <line x1="60" y1="164" x2="850" y2="164" stroke="#f1f5f9" strokeWidth="1" />
                <text x="52" y="168" textAnchor="end" className="openui-axis-text">15k</text>

                <line x1="60" y1="207" x2="850" y2="207" stroke="#f1f5f9" strokeWidth="1" />
                <text x="52" y="211" textAnchor="end" className="openui-axis-text">10k</text>

                <line x1="60" y1="230" x2="850" y2="230" stroke="#e2e8f0" strokeWidth="1.5" />
                <text x="52" y="234" textAnchor="end" className="openui-axis-text">0</text>

                {/* 11 Month Columns (Jan - Nov) with Dual Grouped Bars */}
                {/* Jan */}
                <rect x="80" y="130" width="16" height="100" rx="3" fill="#93c5fd" />
                <rect x="99" y="138" width="16" height="92" rx="3" fill="#3b82f6" />
                <text x="97" y="252" textAnchor="middle" className="openui-axis-month">Jan</text>

                {/* Feb */}
                <rect x="148" y="124" width="16" height="106" rx="3" fill="#93c5fd" />
                <rect x="167" y="130" width="16" height="100" rx="3" fill="#3b82f6" />
                <text x="165" y="252" textAnchor="middle" className="openui-axis-month">Feb</text>

                {/* Mar */}
                <rect x="216" y="115" width="16" height="115" rx="3" fill="#93c5fd" />
                <rect x="235" y="120" width="16" height="110" rx="3" fill="#3b82f6" />
                <text x="233" y="252" textAnchor="middle" className="openui-axis-month">Mar</text>

                {/* Apr */}
                <rect x="284" y="118" width="16" height="112" rx="3" fill="#93c5fd" />
                <rect x="303" y="122" width="16" height="108" rx="3" fill="#3b82f6" />
                <text x="301" y="252" textAnchor="middle" className="openui-axis-month">Apr</text>

                {/* May */}
                <rect x="352" y="105" width="16" height="125" rx="3" fill="#93c5fd" />
                <rect x="371" y="110" width="16" height="120" rx="3" fill="#3b82f6" />
                <text x="369" y="252" textAnchor="middle" className="openui-axis-month">May</text>

                {/* Jun */}
                <rect x="420" y="112" width="16" height="118" rx="3" fill="#93c5fd" />
                <rect x="439" y="116" width="16" height="114" rx="3" fill="#3b82f6" />
                <text x="437" y="252" textAnchor="middle" className="openui-axis-month">Jun</text>

                {/* Jul */}
                <rect x="488" y="98" width="16" height="132" rx="3" fill="#93c5fd" />
                <rect x="507" y="102" width="16" height="128" rx="3" fill="#3b82f6" />
                <text x="505" y="252" textAnchor="middle" className="openui-axis-month">Jul</text>

                {/* Aug */}
                <rect x="556" y="90" width="16" height="140" rx="3" fill="#93c5fd" />
                <rect x="575" y="94" width="16" height="136" rx="3" fill="#3b82f6" />
                <text x="573" y="252" textAnchor="middle" className="openui-axis-month">Aug</text>

                {/* Sep */}
                <rect x="624" y="80" width="16" height="150" rx="3" fill="#93c5fd" />
                <rect x="643" y="84" width="16" height="146" rx="3" fill="#3b82f6" />
                <text x="641" y="252" textAnchor="middle" className="openui-axis-month">Sep</text>

                {/* Oct (Peak) */}
                <rect x="692" y="68" width="16" height="162" rx="3" fill="#93c5fd" />
                <rect x="711" y="72" width="16" height="158" rx="3" fill="#2563eb" />
                <text x="709" y="252" textAnchor="middle" className="openui-axis-month font-semibold">Oct</text>

                {/* Nov */}
                <rect x="760" y="74" width="16" height="156" rx="3" fill="#93c5fd" />
                <rect x="779" y="78" width="16" height="152" rx="3" fill="#3b82f6" />
                <text x="777" y="252" textAnchor="middle" className="openui-axis-month">Nov</text>
              </svg>
            </div>
          </div>

          {/* Bottom 2-Column Grid */}
          <div className="openui-bottom-grid">
            {/* Left: Donut Chart */}
            <div className="openui-chart-panel">
              <div className="openui-panel-header">
                <h4 className="openui-panel-title">Consumer Cohort & Market Segmentation Breakdown</h4>
              </div>
              <div className="openui-donut-wrap">
                <svg viewBox="0 0 240 240" className="openui-donut-svg" aria-label="Consumer Cohort Segmentation Donut Chart">
                  <circle cx="120" cy="120" r="82" fill="none" stroke="#f1f5f9" strokeWidth="26" />
                  {/* Aspirational Mass-Premium (58%): 299 / 515 */}
                  <circle
                    cx="120"
                    cy="120"
                    r="82"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="26"
                    strokeDasharray="299 515"
                    strokeDashoffset="0"
                    transform="rotate(-90 120 120)"
                  />
                  {/* Young Urban Skincare Adopters (28%): 144 / 515 */}
                  <circle
                    cx="120"
                    cy="120"
                    r="82"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="26"
                    strokeDasharray="144 515"
                    strokeDashoffset="-299"
                    transform="rotate(-90 120 120)"
                  />
                  {/* Value-Conscious Households (9%): 46 / 515 */}
                  <circle
                    cx="120"
                    cy="120"
                    r="82"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="26"
                    strokeDasharray="46 515"
                    strokeDashoffset="-443"
                    transform="rotate(-90 120 120)"
                  />
                  {/* Tier-3 Trial Adopters (5%): 26 / 515 */}
                  <circle
                    cx="120"
                    cy="120"
                    r="82"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="26"
                    strokeDasharray="26 515"
                    strokeDashoffset="-489"
                    transform="rotate(-90 120 120)"
                  />
                  <text x="120" y="115" textAnchor="middle" className="openui-donut-val-text">142.8k</text>
                  <text x="120" y="137" textAnchor="middle" className="openui-donut-sub-text">Total surveyed</text>
                </svg>
              </div>
              <div className="openui-donut-legend">
                <span className="openui-legend-item">
                  <span className="openui-legend-swatch" style={{ backgroundColor: "#2563eb" }} />
                  <span>Mass-Premium 58%</span>
                </span>
                <span className="openui-legend-item">
                  <span className="openui-legend-swatch" style={{ backgroundColor: "#6366f1" }} />
                  <span>Young Urban 28%</span>
                </span>
                <span className="openui-legend-item">
                  <span className="openui-legend-swatch" style={{ backgroundColor: "#93c5fd" }} />
                  <span>Value-Conscious 9%</span>
                </span>
                <span className="openui-legend-item">
                  <span className="openui-legend-swatch" style={{ backgroundColor: "#cbd5e1" }} />
                  <span>Tier-3 Adopters 5%</span>
                </span>
              </div>
            </div>

            {/* Right: Area / Line Trend Chart */}
            <div className="openui-chart-panel">
              <div className="openui-panel-header">
                <h4 className="openui-panel-title">Regional sales velocity & market penetration over time</h4>
                <span className="openui-pill-badge">4.2× since 2021</span>
              </div>
              <div className="openui-svg-container">
                <svg viewBox="0 0 460 220" className="openui-area-svg" aria-label="Secondary market sales velocity area chart">
                  <defs>
                    <linearGradient id="openuiAreaGradKYC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {/* Gridlines & Y Axis */}
                  <line x1="55" y1="35" x2="435" y2="35" stroke="#f1f5f9" strokeWidth="1" />
                  <text x="47" y="39" textAnchor="end" className="openui-axis-text">150k</text>

                  <line x1="55" y1="75" x2="435" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                  <text x="47" y="79" textAnchor="end" className="openui-axis-text">100k</text>

                  <line x1="55" y1="115" x2="435" y2="115" stroke="#f1f5f9" strokeWidth="1" />
                  <text x="47" y="119" textAnchor="end" className="openui-axis-text">75k</text>

                  <line x1="55" y1="155" x2="435" y2="155" stroke="#f1f5f9" strokeWidth="1" />
                  <text x="47" y="159" textAnchor="end" className="openui-axis-text">25k</text>

                  <line x1="55" y1="180" x2="435" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
                  <text x="47" y="184" textAnchor="end" className="openui-axis-text">0</text>

                  {/* X Axis Years */}
                  <text x="60" y="202" textAnchor="middle" className="openui-axis-text">2021</text>
                  <text x="132" y="202" textAnchor="middle" className="openui-axis-text">2022</text>
                  <text x="204" y="202" textAnchor="middle" className="openui-axis-text">2023</text>
                  <text x="276" y="202" textAnchor="middle" className="openui-axis-text">2024</text>
                  <text x="348" y="202" textAnchor="middle" className="openui-axis-text">2025</text>
                  <text x="420" y="202" textAnchor="middle" className="openui-axis-text font-semibold">2026</text>

                  {/* Area fill */}
                  <path
                    d="M 60 162 Q 132 154 204 140 T 348 76 T 420 38 L 420 180 L 60 180 Z"
                    fill="url(#openuiAreaGradKYC)"
                  />
                  {/* Top curve (Repeat Purchases) */}
                  <path
                    d="M 60 162 Q 132 154 204 140 T 348 76 T 420 38"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                  />
                  {/* Endpoint dot */}
                  <circle cx="420" cy="38" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                  {/* Baseline curve (Initial Sampling Inflow) */}
                  <path
                    d="M 60 160 Q 132 150 204 135 T 348 72 T 420 34"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                </svg>
              </div>
              <div className="openui-legend openui-legend-center">
                <span className="openui-legend-item">
                  <span className="openui-legend-swatch swatch-disbursed" />
                  <span>Repeat Retail Purchases</span>
                </span>
                <span className="openui-legend-item">
                  <span className="openui-legend-swatch swatch-sanctioned" />
                  <span>Initial Sampling Inflow</span>
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Channel Velocity Table */}
          <div className="agent-report-table-card openui-table-card">
            <div className="openui-panel-header">
              <h4 className="openui-panel-title">Channel Distribution Velocity & Retail Network Breakdown</h4>
            </div>

            <div className="agent-table-wrapper">
              <table className="agent-data-table">
                <thead>
                  <tr>
                    <th>Distribution Channel</th>
                    <th>Network Infrastructure</th>
                    <th>Target Cohort Focus</th>
                    <th>Velocity Confidence</th>
                    <th>Strategic Viability</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="agent-table-cell-bold">Traditional Kirana & General Trade</td>
                    <td>Secondary City FMCG Wholesale Distributors</td>
                    <td>Value-Conscious Households (Sachet/Travel)</td>
                    <td>99.8%</td>
                    <td className="agent-status-tag verified">Priority Expansion</td>
                  </tr>
                  <tr>
                    <td className="agent-table-cell-bold">Quick Commerce & Modern Trade</td>
                    <td>Blinkit / Zepto / Regional Fulfillment Hubs</td>
                    <td>Young Urban Skincare Adopters</td>
                    <td>99.9%</td>
                    <td className="agent-status-tag verified">High Velocity</td>
                  </tr>
                  <tr>
                    <td className="agent-table-cell-bold">Pharmacy & Dermatologist Corridors</td>
                    <td>Apollo / MedPlus Regional Outlets</td>
                    <td>Aspirational Mass-Premium Buyers</td>
                    <td>99.6%</td>
                    <td className="agent-status-tag verified">High Margin Anchor</td>
                  </tr>
                  <tr>
                    <td className="agent-table-cell-bold">Omnichannel Trial Kits & D2C</td>
                    <td>Direct Logistics & Regional Pop-Up Sampling</td>
                    <td>Digital-First Skincare Switchers</td>
                    <td>99.4%</td>
                    <td className="agent-status-tag verified">Validated Driver</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td className="agent-table-cell-bold">Total Market Synthesis</td>
                    <td className="agent-table-cell-bold">4 Strategic Retail Channels</td>
                    <td className="agent-table-cell-bold">Pan-South Asia Secondary Urban Network</td>
                    <td className="agent-table-cell-bold">99.8% Overall</td>
                    <td className="agent-table-cell-bold agent-status-tag verified">100% Market Alignment</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* Related actions below report */}
        <div className="message-related-actions agent-report-related-actions" aria-label="Related actions">
          <div className="message-related-actions-header">
            <span className="message-related-actions-title">Related actions</span>
          </div>
          <div className="message-related-actions-list">
            {suggestedQuestions.map((question, qIdx) => (
              <button
                key={qIdx}
                type="button"
                onClick={() => handleSend(question, reportAgent)}
                className="message-related-action-btn"
                title={`Ask: ${question}`}
              >
                <Search className="message-related-action-icon" aria-hidden="true" />
                <span>{question}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const currentChatKey = selectedChatKey === "new-chat" ? `new-chat-${project.id}` : selectedChatKey;
  const messages =
    conversations[currentChatKey] ||
    (currentChatKey === `${project.id}-0` ? conversations[project.id] : undefined) ||
    [];

  const handleDockFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: AttachedFileItem[] = Array.from(files).map((f) => {
      const isPdf = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
      const isImg = f.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f.name);

      let previewUrl: string | undefined = undefined;
      if (isImg && typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
        try {
          previewUrl = URL.createObjectURL(f);
        } catch { }
      }

      const sizeStr =
        f.size < 1024 * 1024
          ? `${Math.round(f.size / 1024)} KB`
          : `${(f.size / (1024 * 1024)).toFixed(1)} MB`;

      return {
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: f.name,
        size: sizeStr,
        type: isPdf ? "pdf" : isImg ? "image" : "file",
        previewUrl,
        file: f,
      };
    });

    setAttachedFiles((prev) => [...prev, ...newAttachments]);
    if (dockFileInputRef.current) dockFileInputRef.current.value = "";
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachedFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item?.previewUrl && typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") {
        try {
          URL.revokeObjectURL(item.previewUrl);
        } catch { }
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const sidebarProjects = projects;

  useEffect(() => {
    if (project?.id) {
      setExpandedProjectId(project.id);
      if (!project.id.startsWith("new-project")) {
        setSelectedChat(project.title);
        setSelectedChatKey(project.id);
      } else {
        setSelectedChat("New chat");
        setSelectedChatKey("new-chat");
      }
      setIsAgentsDrawerOpen(false);
    }
  }, [project?.id, project?.title]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (typeof window.scrollTo === "function") window.scrollTo(0, 0);
      const canvas = document.querySelector(".workspace-canvas") as HTMLElement | null;
      if (canvas) {
        if (typeof canvas.scrollTo === "function") canvas.scrollTo({ top: 0 });
        else canvas.scrollTop = 0;
      }
    }
  }, [selectedChatKey]);

  const handleNewChat = () => {
    setIsLibraryOpen(false);
    setActiveSidebarView(null);
    const currentList = projectChats[project.id] || [];
    const existingEmpty = currentList.find(
      (c) => c.title === "New chat" && (!conversations[c.id] || conversations[c.id].length === 0)
    );

    if (existingEmpty) {
      setSelectedChat("New chat");
      setSelectedChatKey(existingEmpty.id);
      setExpandedProjectId(project.id);
      setIsAgentsDrawerOpen(true);
      setIsKnowledgeOpen(false);
      return;
    }

    const newChatId = `chat-${Date.now()}`;
    const newChatTitle = "New chat";

    setProjectChats((prev) => ({
      ...prev,
      [project.id]: [{ id: newChatId, title: newChatTitle }, ...(prev[project.id] || [])],
    }));

    setExpandedProjectId(project.id);
    setSelectedChat(newChatTitle);
    setSelectedChatKey(newChatId);
    setIsAgentsDrawerOpen(true);
    setIsKnowledgeOpen(false);
  };

  const handleAdvanceInteractiveQuestion = (msg: MessageItem, chosenOpt?: string) => {
    const selectedOpt = chosenOpt || selectedAgentOptions[msg.id];
    if (!selectedOpt || !msg.interactiveQuestion) return;

    const currentStep = msg.interactiveQuestion.step;
    const currentChat = currentChatKey;
    const existingAnswers = interactiveFlowAnswers[currentChat] || {};
    const updatedAnswers = {
      ...existingAnswers,
      [`q${currentStep}`]: selectedOpt,
    };
    setInteractiveFlowAnswers((prev) => ({
      ...prev,
      [currentChat]: updatedAnswers,
    }));

    // Mark current question as answered
    setConversations((prev) => ({
      ...prev,
      [currentChat]: (prev[currentChat] || []).map((m) =>
        m.id === msg.id && m.interactiveQuestion
          ? {
            ...m,
            interactiveQuestion: {
              ...m.interactiveQuestion,
              answeredOption: selectedOpt,
            },
          }
          : m
      ),
    }));

    // Add user message with selected choice
    const userMsg: MessageItem = {
      id: `user-interactive-${Date.now()}`,
      sender: "user",
      text: selectedOpt,
    };

    setConversations((prev) => ({
      ...prev,
      [currentChat]: [...(prev[currentChat] || []), userMsg],
    }));

    setIsThinking(true);
    scrollToTarget(".workspace-conversation > *:last-child, .ai-thinking-row", "start");

    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
    }

    const duration = typeof process !== "undefined" && process.env.NODE_ENV === "test" ? 300 : 3000;
    thinkingTimeoutRef.current = setTimeout(() => {
      setIsThinking(false);

      if (currentStep === 1) {
        const q2Msg: MessageItem = {
          id: `ai-cust-dyn-q2-${Date.now()}`,
          sender: "assistant",
          text: "",
          agentTitle: msg.agentTitle,
          interactiveQuestion: {
            step: 2,
            totalSteps: 3,
            title: "",
            question: "What is your target introductory price corridor for regional trial packs?",
            options: [
              "Entry trial packs at ₹149 – ₹199 (Max trial velocity & sachet volume)",
              "Mass-premium sweet spot at ₹249 – ₹349 (Optimal margin & volume balance)",
              "Premium clinical threshold at ₹399 – ₹499 (Derm-grade efficacy focus)",
              "Full regimen discovery bundles at ₹599 – ₹799 (Multi-step routine trial)",
            ],
          },
        };
        setConversations((prev) => ({
          ...prev,
          [currentChat]: [...(prev[currentChat] || []), q2Msg],
        }));
        scrollToTarget(".workspace-conversation > *:last-child", "start");
      } else if (currentStep === 2) {
        const q3Msg: MessageItem = {
          id: `ai-cust-dyn-q3-${Date.now()}`,
          sender: "assistant",
          text: "",
          agentTitle: msg.agentTitle,
          interactiveQuestion: {
            step: 3,
            totalSteps: 3,
            title: "",
            question: "Which primary skincare ritual or benefit territory should lead regional marketing?",
            options: [
              "Daily Sun Defense & Broad-Spectrum UV Protection (SPF 50+ lightweight gel)",
              "Skin Barrier Repair & Deep Hydration (Cica, Ceramides & Hyaluronic acid)",
              "Active Brightening & Pigmentation Defense (Niacinamide & Vitamin C)",
              "Climate-Adaptive Oil Control & Pollution Defense (Purifying botanicals)",
            ],
          },
        };
        setConversations((prev) => ({
          ...prev,
          [currentChat]: [...(prev[currentChat] || []), q3Msg],
        }));
        scrollToTarget(".workspace-conversation > *:last-child", "start");
      } else {
        const opt1 = updatedAnswers.q1 || "Aspirational Gen-Z & Young Professionals";
        const opt2 = updatedAnswers.q2 || "Mass-premium sweet spot at ₹249 – ₹349";
        const opt3 = selectedOpt;

        const reportText = `Customer Dynamics & Segmentation Intelligence Briefing
Prepared by Customer Dynamics & Segmentation Agent for ${project.title}

Based on your calibrated strategic parameters—prioritizing ${opt1.split(" (")[0]}, targeting ${opt2.split(" (")[0]}, and leading with ${opt3.split(" (")[0]}—our regional consumer intelligence models reveal clear commercial momentum across secondary urban clusters.

In non-metro hubs like Jaipur, Lucknow, Indore, and Coimbatore, ${opt1.split(" (")[0]} represents the fastest-growing consumer segment for mass-premium personal care. Rising disposable incomes and high smartphone penetration have accelerated awareness of active dermatological formulations. Consumers in these markets evaluate product efficacy through regional peer communities and vernacular creator reviews rather than traditional celebrity advertisements.

Calibrating introductory price points to ${opt2.split(" (")[0]} directly unlocks trial adoption while preserving 18–22% retail margins and 12–14% distributor margins. This price corridor eliminates purchase hesitancy, encouraging shoppers to add trial sachets and travel-sized packs to their routine baskets.

Positioning your product portfolio around ${opt3.split(" (")[0]} creates a clear distinction against legacy FMCG competitors. Communicating climate-adaptive protection and demonstrable skin barrier defense builds long-term consumer trust, driving sustained 60-day repurchase retention across priority regional retail corridors.`;

        const finalMsg: MessageItem = {
          id: `ai-cust-dyn-final-${Date.now()}`,
          sender: "assistant",
          text: reportText.replace(/[#*]/g, "").trim(),
          agentTitle: msg.agentTitle,
        };
        setConversations((prev) => ({
          ...prev,
          [currentChat]: [...(prev[currentChat] || []), finalMsg],
        }));
        scrollToTarget(".workspace-conversation > *:last-child", "start");
      }
    }, duration);
  };

  const handleSend = (presetText?: string, targetAgent?: AgentItem) => {
    const rawText = (presetText || inputValue).trim();
    if (!rawText && attachedFiles.length === 0) return;

    const currentAttached = [...attachedFiles];
    const text =
      rawText ||
      (currentAttached.length > 0
        ? `Attached file: ${currentAttached.map((f) => f.name).join(", ")}`
        : "");
    if (!text) return;

    setAttachedFiles([]);
    setInputValue("");

    if (isVisionModalOpen) {
      if (text.toLowerCase().startsWith("completed goal") || understoodFacts.length >= 6) {
        handleEndVisionConversation(text);
        return;
      }
      const allChips = ["Goal", "Industry", "Market", "Audience", "Challenges", "Outcomes"];
      const lower = text.toLowerCase();
      const matchedChip = allChips.find((c) => lower.includes(c.toLowerCase()));
      if (matchedChip) {
        setUnderstoodFacts((prev) => Array.from(new Set([...prev, matchedChip])));
      } else {
        const remaining = allChips.filter((c) => !understoodFacts.includes(c));
        if (remaining.length > 0) {
          setUnderstoodFacts((prev) => [...prev, remaining[0]]);
        }
      }
      return;
    }

    // If chat title is still "New chat", update it to the first message text
    if (selectedChat === "New chat") {
      const cleanTitle = text.length > 28 ? text.slice(0, 28) + "..." : text;
      setProjectChats((prev) => ({
        ...prev,
        [project.id]: (prev[project.id] || []).map((c) =>
          c.id === currentChatKey ? { ...c, title: cleanTitle } : c
        ),
      }));
      setSelectedChat(cleanTitle);
    }

    const userMessage: MessageItem = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      attachments: currentAttached.length > 0 ? currentAttached : undefined,
    };
    setConversations((prev) => ({
      ...prev,
      [currentChatKey]: [...(prev[currentChatKey] || []), userMessage],
    }));
    setThinkingText("Thinking...");
    setIsThinking(true);
    scrollToTarget(".workspace-conversation > *:last-child, .ai-thinking-row", "start");

    setTimeout(() => {
      setIsThinking(false);

      const effectiveAgent = targetAgent || pinnedAgent;
      const normalizedText = text.toLowerCase().replace(/['’]/g, "").trim();

      const isCustomerDynamicsQuery =
        normalizedText.includes("customer dynamics") ||
        normalizedText.includes("segmentation agent") ||
        Boolean(effectiveAgent && effectiveAgent.title.toLowerCase().includes("customer dynamics"));

      if (isCustomerDynamicsQuery) {
        const chatMsgs = conversations[currentChatKey] || [];
        const hasExistingCustDynMsg = chatMsgs.some(
          (m) =>
            m.interactiveQuestion ||
            (m.agentTitle?.includes("Customer Dynamics") &&
              m.text.includes("Customer Dynamics & Segmentation Intelligence Briefing")) ||
            m.text.includes("Customer Dynamics & Segmentation Intelligence Briefing")
        );

        if (!hasExistingCustDynMsg) {
          const q1Msg: MessageItem = {
            id: `ai-cust-dyn-q1-${Date.now()}`,
            sender: "assistant",
            text: "",
            agentTitle: effectiveAgent?.title,
            interactiveQuestion: {
              step: 1,
              totalSteps: 3,
              title: "",
              question: "Which consumer demographic cohort should we prioritize for initial regional adoption?",
              options: [
                "Aspirational Gen-Z & Young Professionals (Ages 18–28, SEC A/B)",
                "Working Women & Household Decision Makers (Ages 28–42, SEC A/B)",
                "Price-Conscious First-Time Adopters (Tier-2 & Tier-3 Students/Homemakers)",
                "Mass-Affluent Regional Consumers Seeking Derm-Active Formulations",
              ],
            },
          };
          setConversations((prev) => ({
            ...prev,
            [currentChatKey]: [...(prev[currentChatKey] || []), q1Msg],
          }));
          return;
        }

        const custAgent =
          effectiveAgent ||
          initialAgents.find((a) => a.title.includes("Customer Dynamics")) ||
          projectRelatedAgents.find((a) => a.title.includes("Customer Dynamics"));

        if (custAgent) {
          const agentReply = generateAgentResponse(custAgent, text, project);
          const aiMessage: MessageItem = {
            id: `ai-agent-${Date.now()}`,
            sender: "assistant",
            text: agentReply,
            agentTitle: effectiveAgent?.title,
          };
          setConversations((prev) => ({
            ...prev,
            [currentChatKey]: [...(prev[currentChatKey] || []), aiMessage],
          }));
          return;
        }
      }

      const isCityVelocityQuery =
        normalizedText.includes("conversion velocity") ||
        normalizedText.includes("5 tier-2 cities") ||
        normalizedText.includes("highest trial pack") ||
        (normalizedText.includes("tier-2 cities") && normalizedText.includes("trial pack"));

      const isMarginStructureQuery =
        normalizedText.includes("distributor trade margin") ||
        normalizedText.includes("trade margin structures") ||
        (normalizedText.includes("margin") && normalizedText.includes("secondary cities"));

      const isQuickCommerceQuery =
        (normalizedText.includes("quick-commerce") || normalizedText.includes("quick commerce")) &&
        (normalizedText.includes("kirana") || normalizedText.includes("dark stores"));

      if (isCityVelocityQuery || isMarginStructureQuery || isQuickCommerceQuery) {
        const reportType = isCityVelocityQuery
          ? "city-velocity"
          : isMarginStructureQuery
            ? "margin-structures"
            : "quick-commerce-comparison";

        const aiMessage: MessageItem = {
          id: `ai-report-${reportType}-${Date.now()}`,
          sender: "assistant",
          text: `__AGENT_REPORT__:${reportType}`,
          agentTitle: effectiveAgent?.title || "Emerging Markets Specialist Agent",
        };
        setConversations((prev) => ({
          ...prev,
          [currentChatKey]: [...(prev[currentChatKey] || []), aiMessage],
        }));
        scrollToTarget(".workspace-conversation > *:last-child", "start");
        return;
      }

      if (effectiveAgent) {
        const agentReply = generateAgentResponse(effectiveAgent, text, project);
        const aiMessage: MessageItem = {
          id: `ai-agent-${Date.now()}`,
          sender: "assistant",
          text: agentReply,
          agentTitle: effectiveAgent.title,
        };
        setConversations((prev) => ({
          ...prev,
          [currentChatKey]: [...(prev[currentChatKey] || []), aiMessage],
        }));
        return;
      }

      const normalizedProjectTitle = project.title.toLowerCase().replace(/['’]/g, "").trim();

      const isPersonalCareBrief =
        normalizedText.includes("personal care brand") ||
        normalizedText.includes("smaller cities") ||
        normalizedText === normalizedProjectTitle;

      const isReportQuery =
        !isPersonalCareBrief &&
        (text.toLowerCase().includes("report") ||
          (selectedChat === "New chat" &&
            !text.toLowerCase().includes("define the idea") &&
            !text.toLowerCase().includes("attach a plan") &&
            !text.toLowerCase().includes("diwali") &&
            !text.toLowerCase().includes("personal care") &&
            !text.toLowerCase().includes("smaller cities") &&
            !text.toLowerCase().includes("customer dynamics") &&
            !text.toLowerCase().includes("segmentation agent") &&
            !text.includes("Expand into") &&
            !text.includes("Launch a new AI product") &&
            !text.includes("Automate") &&
            !text.includes("Accelerate enterprise")));

      if (isReportQuery) {
        const flowId = `ai-flow-${Date.now()}`;
        const aiMessage: MessageItem = {
          id: flowId,
          sender: "assistant",
          text: `To complete this report for ${project.title}, I've assembled two specialized agents to synthesize the market intelligence. Select an agent to begin configuration:`,
        };

        setReportFlows((prev) => ({
          ...prev,
          [flowId]: {
            ...defaultReportFlowState,
          },
        }));

        setConversations((prev) => ({
          ...prev,
          [currentChatKey]: [...(prev[currentChatKey] || []), aiMessage],
        }));
        return;
      }

      let reply = `Understood. For "${project.title}", I have initialized the core context. I found market intelligence reports from 2025–2026 covering regional retail, price elasticity, active ingredients, and channel distribution. Together they detail how consumer price sensitivity, local retailer margins, and climate-adaptive formulations connect to drive sustainable regional market penetration:`;
      if (isPersonalCareBrief) {
        reply = `Project brief confirmed, Arun\nWe've received your project brief for "${project.title}". Autonomous collaborative agents are ready to coordinate market dynamics, unit economics, and execution milestones. To configure the optimal agent workflow, let's establish your direction:\n\nWhat primary outcome do you want to achieve with this project?\n\nLaunch a new AI product or service\n\nAutomate internal operations & reduce costs\n\nExpand into a new customer segment or region\n\nAccelerate enterprise sales & revenue growth\n\nOr in your own words\nType your answer and press Enter`;
      } else if (
        text.includes("Expand into a new customer segment or region") ||
        text.includes("Expand into a new target market") ||
        text.includes("Expand into")
      ) {
        reply = `I found market intelligence reports from 2025–2026 covering tier-2 & tier-3 city retail, price elasticity, active ingredients, and channel distribution. The most relevant are “Growth Opportunities in Personal Care for Tier-2 and Tier-3 Cities, South Asia” and “Price-Point & Pack-Size Strategy for Mass-Premium Skincare”. Together they discuss how these themes connect, from consumer price sensitivity and local retailer margins to climate-adaptive formulations for regional market penetration.`;
      } else if (
        text.includes("Launch a new AI product or service") ||
        text.includes("Launch a new AI product or platform") ||
        text.includes("Launch a new AI product")
      ) {
        reply = `Understood! For launching a new AI product or platform under "${project.title}", I found market intelligence reports evaluating product readiness, architecture, and commercialization models. Together they outline technical feasibility and deployment roadmaps:`;
      } else if (
        text.includes("Automate internal operations & reduce costs") ||
        text.includes("Automate key operational processes") ||
        text.includes("Automate")
      ) {
        reply = `Understood! For automating key operational processes under "${project.title}", I found market intelligence reports analyzing operational workflows, process automation, and unit economics:`;
      } else if (
        text.includes("Accelerate enterprise sales & revenue growth") ||
        text.includes("Accelerate enterprise revenue growth") ||
        text.includes("Accelerate enterprise")
      ) {
        reply = `Understood! To accelerate enterprise revenue growth for "${project.title}", I found market intelligence reports assessing enterprise sales cycles, pricing architecture, and customer lifetime value:`;
      } else if (text.toLowerCase().includes("define the idea")) {
        reply = `Let's define the core objective of this project to start building the business case.\n\nWhat primary outcome do you want to achieve with this project?\n\nAccelerate enterprise revenue growth\n\nAutomate key operational processes\n\nLaunch a new AI product or platform\n\nExpand into a new target market\n\nOr in your own words\nType your answer and press Enter`;
      } else if (text.toLowerCase().includes("attach a plan")) {
        reply = `I'm ready to review your plan for "${project.title}". You can upload documents, presentations, or data tables, and I'll extract key milestones, budget assumptions, and required agent capabilities.`;
      } else if (text.toLowerCase().includes("diwali")) {
        reply = `Here are creative strategies tailored for "${project.title}":\n• Festive promotional packaging design with traditional gold motifs\n• Limited-edition regional gift boxes for upcoming celebrations\n• Omnichannel visual merchandising campaign across tier-2 cities.`;
      } else if (
        normalizedText.includes("market research") ||
        normalizedText.includes("start a market research")
      ) {
        reply = `Market research initialized for "${project.title}": Observed consumer demand, price sensitivity thresholds, and distribution readiness mapped across primary and secondary growth hubs.`;
      } else if (
        normalizedText.includes("policy and regulations") ||
        normalizedText.includes("policy and regulations check")
      ) {
        reply = `Policy and regulations check for "${project.title}": Reviewing trade compliance, statutory distribution licenses, import duties, and regional regulatory frameworks.`;
      } else if (
        normalizedText.includes("business model") ||
        normalizedText.includes("plan a business model")
      ) {
        reply = `Business model architecture for "${project.title}": Modeling unit economics, distributor margin schedules, working capital cycles, and payback milestones.`;
      } else if (
        normalizedText.includes("competitor landscape") ||
        normalizedText.includes("competioter landscape")
      ) {
        reply = `Competitor landscape analysis for "${project.title}": Benchmarking incumbent market share, rival pricing architecture, product assortment, and channel density.`;
      } else if (
        normalizedText.includes("geographical market") ||
        normalizedText.includes("deep drive") ||
        normalizedText.includes("deep dive")
      ) {
        reply = `Geographical market deep drive for "${project.title}": Evaluating regional infrastructure density, localized retail cluster velocity, and logistics hub proximity.`;
      } else {
        reply = `Understood! I've registered your strategic outcome: "${text}" for "${project.title}".\n\nI found market intelligence reports covering regional distribution, price sensitivity, active ingredients, and channel logistics. Together they detail the strategic imperatives for this initiative:`;
      }

      const aiMessage: MessageItem = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: reply,
      };

      setConversations((prev) => ({
        ...prev,
        [currentChatKey]: [...(prev[currentChatKey] || []), aiMessage],
      }));
      scrollToTarget(".workspace-conversation > *:last-child", "start");
    }, typeof process !== "undefined" && process.env.NODE_ENV === "test" ? 300 : 3000);
  };

  const handleOutcomeSelect = (msgId: string, opt: string, customDisplayText?: string) => {
    setSelectedOutcomes((prev) => ({
      ...prev,
      [msgId]: opt,
    }));

    // Show the selected item as the user's question below the outcome card
    const userMsgId = `user-outcome-${msgId}`;
    const userMessage: MessageItem = {
      id: userMsgId,
      sender: "user",
      text: customDisplayText || opt,
    };

    setConversations((prev) => {
      const existing = prev[currentChatKey] || [];
      const filtered = existing.filter(
        (msg) => !msg.id.startsWith("user-outcome-") && !msg.id.startsWith("ai-ans-") && msg.id !== "msg-pc-3" && msg.id !== "msg-pc-4"
      );
      return {
        ...prev,
        [currentChatKey]: [...filtered, userMessage],
      };
    });

    setThinkingText("Thinking...");
    setIsThinking(true);
    // Past section automatically goes above and user's selection + loader shows
    scrollToTarget(".workspace-message.user-message:last-of-type, .ai-thinking-row", "start");

    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
    }

    const duration = typeof process !== "undefined" && process.env.NODE_ENV === "test" ? 300 : 3000;
    thinkingTimeoutRef.current = setTimeout(() => {
      setIsThinking(false);

      const answerMsgId = `ai-ans-${msgId}`;
      const answerMessage: MessageItem = {
        id: answerMsgId,
        sender: "assistant",
        text: `I found market intelligence reports from 2025–2026 covering tier-2 & tier-3 city retail, price elasticity, active ingredients, and channel distribution. The most relevant are “Growth Opportunities in Personal Care for Tier-2 and Tier-3 Cities, South Asia” and “Price-Point & Pack-Size Strategy for Mass-Premium Skincare”. Together they discuss how these themes connect, from consumer price sensitivity and local retailer margins to climate-adaptive formulations for regional market penetration.`,
      };

      setConversations((prev) => {
        const existing = prev[currentChatKey] || [];
        const filtered = existing.filter((msg) => !msg.id.startsWith("ai-ans-") && msg.id !== "msg-pc-4");
        return {
          ...prev,
          [currentChatKey]: [...filtered, answerMessage],
        };
      });

      // Past section automatically goes above and the new Matching Knowledge Packs section shows
      scrollToTarget(".ai-knowledge-flow-container", "start");
    }, duration);
  };

  const handleToggleVoiceMode = () => {
    if (isVoiceActive) {
      if (voiceTimeoutRef.current) {
        clearTimeout(voiceTimeoutRef.current);
        voiceTimeoutRef.current = null;
      }
      setInputValue("");
      setIsThinking(false);
      setIsVoiceActive(false);
      setIsVisionModalOpen(false);
      return;
    }

    setInputValue("");
    setIsVoiceActive(true);
    setIsVisionModalOpen(true);
    setIsVisionPaused(false);
    setUnderstoodFacts([]);
    startVoiceIntakeFlow(0);
  };

  const handleEndVisionConversation = (customSummary?: string) => {
    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current);
      voiceTimeoutRef.current = null;
    }
    setInputValue("");
    setIsVisionModalOpen(false);
    setIsVoiceActive(false);

    setIsThinking(true);
    setThinkingText("Thinking...");
    scrollToTarget(".workspace-conversation > *:last-child, .ai-thinking-row", "start");

    const isVitest = typeof process !== "undefined" && Boolean(process.env?.VITEST || process.env?.NODE_ENV === "test");
    const thinkDelay = isVitest ? 150 : 2500;

    setTimeout(() => {
      setIsThinking(false);

      setProjectScope((prev) => ({
        ...prev,
        goal: prev.goal || "expand into a new customer segment or region",
        industry: prev.industry || "Beauty & personal care",
        market: prev.market || "South Asia",
        audience: prev.audience || "Urban working women aged 22–35",
        challenges: prev.challenges || "Unclear which cities, price points and channels to prioritise",
        outcomes: prev.outcomes || "Prioritised city shortlist and go-to-market plan",
        investment: prev.investment || "$500,000",
        annualImpact: prev.annualImpact || "$1,200,000",
        targetDate: prev.targetDate || "Q2 2027",
        deliveryOwner: prev.deliveryOwner || "Arun Eswaran",
      }));

      const summaryText = customSummary
        ? `${customSummary}\n\nExpand into a new customer segment or region\n\nVoice input:\n• Goal: Expand into a new target market\n• Industry: Beauty & personal care\n• Market: India, Tier-2 & Tier-3 cities\n• Audience: Urban working women aged 22–35\n• Challenges: Unclear which cities, price points and channels to prioritise\n• Outcomes: Prioritised city shortlist and go-to-market plan`
        : `Expand into a new customer segment or region\n\nVoice input:\n• Goal: Expand into a new target market\n• Industry: Beauty & personal care\n• Market: India, Tier-2 & Tier-3 cities\n• Audience: Urban working women aged 22–35\n• Challenges: Unclear which cities, price points and channels to prioritise\n• Outcomes: Prioritised city shortlist and go-to-market plan`;

      const summaryMsg: MessageItem = {
        id: `voice-scope-summary-${Date.now()}`,
        sender: "user",
        text: summaryText,
      };

      const packagesMsg: MessageItem = {
        id: `voice-packages-${Date.now()}`,
        sender: "assistant",
        text: `I found market intelligence reports from 2025–2026 covering tier-2 & tier-3 city retail, price elasticity, active ingredients, and channel distribution. The most relevant are “Growth Opportunities in Personal Care for Tier-2 and Tier-3 Cities, South Asia” and “Price-Point & Pack-Size Strategy for Mass-Premium Skincare”. Together they discuss how these themes connect, from consumer price sensitivity and local retailer margins to climate-adaptive formulations for regional market penetration.`,
      };

      setConversations((prev) => ({
        ...prev,
        [currentChatKey]: [
          ...(prev[currentChatKey] || []).filter(
            (m) =>
              !m.id.startsWith("voice-") &&
              !m.text.includes("What primary outcome do you want to achieve") &&
              !m.text.includes("Project brief confirmed")
          ),
          summaryMsg,
          packagesMsg,
        ],
      }));

      scrollToTarget(".ai-knowledge-flow-container", "start");
    }, thinkDelay);
  };

  const handleToggleVisionPause = () => {
    setIsVisionPaused((prev) => {
      const next = !prev;
      if (next) {
        if (voiceTimeoutRef.current) {
          clearTimeout(voiceTimeoutRef.current);
          voiceTimeoutRef.current = null;
        }
      } else {
        if (isVoiceActive) {
          startVoiceIntakeFlow(understoodFacts.length);
        }
      }
      return next;
    });
  };

  const handleToggleChip = (chip: string) => {
    setUnderstoodFacts((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleVisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = visionInput.trim();
    if (!val) return;
    setVisionInput("");

    const allChips = ["Goal", "Industry", "Market", "Audience", "Challenges", "Outcomes"];
    const matchedChip = allChips.find((c) => val.toLowerCase().includes(c.toLowerCase()));
    if (matchedChip) {
      setUnderstoodFacts((prev) => Array.from(new Set([...prev, matchedChip])));
    } else {
      const remaining = allChips.filter((c) => !understoodFacts.includes(c));
      if (remaining.length > 0) {
        setUnderstoodFacts((prev) => [...prev, remaining[0]]);
      }
    }

    const userMsg: MessageItem = {
      id: `voice-user-${Date.now()}`,
      sender: "user",
      text: val,
    };
    setConversations((prev) => ({
      ...prev,
      [currentChatKey]: [...(prev[currentChatKey] || []), userMsg],
    }));
  };

  const startVoiceIntakeFlow = (initialStep = 0) => {
    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current);
      voiceTimeoutRef.current = null;
    }

    const isVitest = typeof process !== "undefined" && Boolean(process.env?.VITEST || process.env?.NODE_ENV === "test");
    const stepDelay = isVitest ? 40 : 900;

    let step = initialStep;

    const runNextStep = () => {
      step++;
      if (step === 1) {
        setUnderstoodFacts(["Goal"]);
        voiceTimeoutRef.current = setTimeout(runNextStep, stepDelay);
      } else if (step === 2) {
        setUnderstoodFacts(["Goal", "Industry"]);
        voiceTimeoutRef.current = setTimeout(runNextStep, stepDelay);
      } else if (step === 3) {
        setUnderstoodFacts(["Goal", "Industry", "Market"]);
        voiceTimeoutRef.current = setTimeout(runNextStep, stepDelay);
      } else if (step === 4) {
        setUnderstoodFacts(["Goal", "Industry", "Market", "Audience"]);
        voiceTimeoutRef.current = setTimeout(runNextStep, stepDelay);
      } else if (step === 5) {
        setUnderstoodFacts(["Goal", "Industry", "Market", "Audience", "Challenges"]);
        voiceTimeoutRef.current = setTimeout(runNextStep, stepDelay);
      } else if (step >= 6) {
        setUnderstoodFacts(["Goal", "Industry", "Market", "Audience", "Challenges", "Outcomes"]);
        
        const autoSummary = "Completed goals: Expand personal care brand into Tier-2 & Tier-3 cities targeting urban working women aged 22–35.";

        if (isVitest) {
          setInputValue(autoSummary);
          voiceTimeoutRef.current = setTimeout(() => {
            handleEndVisionConversation(autoSummary);
          }, 80);
        } else {
          // Animate writing into the typing field, then automatically submit
          let charIndex = 0;
          const typeNextChars = () => {
            charIndex = Math.min(charIndex + 3, autoSummary.length);
            setInputValue(autoSummary.slice(0, charIndex));
            if (charIndex < autoSummary.length) {
              voiceTimeoutRef.current = setTimeout(typeNextChars, 20);
            } else {
              voiceTimeoutRef.current = setTimeout(() => {
                handleEndVisionConversation(autoSummary);
              }, 700);
            }
          };
          voiceTimeoutRef.current = setTimeout(typeNextChars, 350);
        }
      }
    };

    voiceTimeoutRef.current = setTimeout(runNextStep, stepDelay);
  };

  const renderInputDock = () => (
    <div className="chat-input-dock-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isVisionModalOpen && inputValue.trim()) {
            handleEndVisionConversation(inputValue.trim());
          } else {
            handleSend();
          }
        }}
        className={`chatgpt-input-dock ${attachedFiles.length > 0 ? "chatgpt-input-dock--expanded" : ""} ${isVisionModalOpen ? "chatgpt-input-dock--voice" : ""}`}
      >
        {/* When Voice Mode is Active: Voice UI is inside the typing field dock expanding to the top */}
        {isVisionModalOpen && (
          <div className="chatgpt-dock-voice-inside" role="region" aria-label="Talk About Your Vision">
            {/* Header */}
            <div className="vision-modal-header">
              <h2 className="vision-modal-title">Talk About Your Vision</h2>
              <button
                type="button"
                onClick={() => {
                  if (voiceTimeoutRef.current) {
                    clearTimeout(voiceTimeoutRef.current);
                    voiceTimeoutRef.current = null;
                  }
                  setInputValue("");
                  setIsVisionModalOpen(false);
                  setIsVoiceActive(false);
                }}
                className="vision-modal-close-btn"
                aria-label="Stop voice mode"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Subtitle (comes below heading on a single line) */}
            <p className="vision-modal-subtitle">
              Tell me about your vision, your goal, industry, market, audience, challenges and expected outcomes.
            </p>

            {/* Actions Row: Listening Capsule on left + Pause and End conversation on right */}
            <div className="vision-modal-actions-row">
              <button
                type="button"
                onClick={handleToggleVisionPause}
                className={`vision-modal-main-action ${isVisionPaused ? "vision-modal-main-action--paused" : ""}`}
                title={isVisionPaused ? "Resume listening" : "Pause listening"}
                aria-label={isVisionPaused ? "Resume listening" : "Listening..."}
              >
                <span className="vision-modal-main-action-text">
                  {isVisionPaused ? "Paused" : "Listening.."}
                </span>
                <span className="voice-wave-anim" aria-hidden="true">
                  <span className="voice-wave-bar bar-1" />
                  <span className="voice-wave-bar bar-2" />
                  <span className="voice-wave-bar bar-3" />
                  <span className="voice-wave-bar bar-4" />
                  <span className="voice-wave-bar bar-5" />
                </span>
              </button>

              <button
                type="button"
                onClick={handleToggleVisionPause}
                className="vision-modal-pause-btn"
                title={isVisionPaused ? "Resume conversation" : "Pause conversation"}
                aria-label={isVisionPaused ? "Resume conversation" : "Pause conversation"}
              >
                {isVisionPaused ? (
                  <Play className="h-4 w-4 fill-current" />
                ) : (
                  <Pause className="h-4 w-4 fill-current" />
                )}
              </button>
              <button
                type="button"
                onClick={handleEndVisionConversation}
                className="vision-modal-end-btn"
                aria-label="End Session"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>End Session</span>
              </button>
            </div>

            {/* Progress Counter & 6 Chips */}
            <div className="vision-modal-progress-section">
              <div className="vision-modal-progress-label">
                <span>What we've understood so far</span>
              </div>
              <div className="vision-modal-chips-row">
                {["Goal", "Industry", "Market", "Audience", "Challenges", "Outcomes"].map((chip) => {
                  const isDone = understoodFacts.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleToggleChip(chip)}
                      className={`vision-modal-chip ${isDone ? "vision-modal-chip--done" : ""}`}
                      aria-pressed={isDone}
                    >
                      {isDone && (
                        <Check className="vision-modal-chip-check h-3.5 w-3.5 text-white" strokeWidth={2.2} />
                      )}
                      <span>{chip}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {attachedFiles.length > 0 && (
          <div className="chatgpt-dock-attachments-row" aria-label="Attached files">
            {attachedFiles.map((att) => (
              <div key={att.id} className="chatgpt-dock-attachment-chip">
                <div className="chatgpt-dock-attachment-icon-wrap">
                  {att.type === "pdf" ? (
                    <AdobeAcrobatPdfIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
                  ) : att.type === "image" && att.previewUrl ? (
                    <img src={att.previewUrl} alt={att.name} className="chatgpt-dock-attachment-thumb" />
                  ) : (
                    <Paperclip className="h-5 w-5 text-zinc-500 flex-shrink-0" />
                  )}
                </div>
                <div className="chatgpt-dock-attachment-meta">
                  <span className="chatgpt-dock-attachment-name" title={att.name}>
                    {att.name}
                  </span>
                  <span className="chatgpt-dock-attachment-size">
                    {att.type === "pdf" ? "PDF Document" : att.type === "image" ? "Image" : "File"} · {att.size}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(att.id)}
                  className="chatgpt-dock-attachment-remove"
                  title="Remove attachment"
                  aria-label={`Remove ${att.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="chatgpt-dock-main-row">
          <input
            type="file"
            ref={dockFileInputRef}
            onChange={handleDockFileUpload}
            className="hidden"
            aria-label="Upload file"
            accept=".pdf,image/*,.png,.jpg,.jpeg,.webp"
            multiple
          />
          <button
            type="button"
            onClick={() => dockFileInputRef.current?.click()}
            className="chatgpt-dock-attach-btn"
            title="Add attachment"
            aria-label="Attach file"
          >
            <Plus style={{ width: 18, height: 18 }} className="h-[18px] w-[18px]" />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Reply, attach a file, or tap the mic to talk"
            className="chatgpt-dock-input"
          />

          <div className="chatgpt-dock-right-actions">
            <button
              type="submit"
              className={`chatgpt-dock-send-btn ${isVisionModalOpen ? "chatgpt-dock-send-btn--voice" : ""}`}
              title="Send message"
              aria-label="Send message"
              disabled={!inputValue.trim() && attachedFiles.length === 0}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <div className="workspace-container">
      {/* Collapsed Sidebar Rail */}
      {isSidebarCollapsed && (
        <aside className="chatgpt-sidebar-rail" aria-label="Collapsed navigation">
          <div className="chatgpt-rail-top">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="chatgpt-rail-icon-btn chatgpt-rail-back-btn"
              title="Return to Dashboard"
              aria-label="Return to Dashboard"
            >
              <ChevronLeft className="h-4 w-4 text-zinc-800" />
            </button>

            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(false)}
              className="chatgpt-rail-icon-btn"
              title="Open sidebar"
              aria-label="Open sidebar"
            >
              <PanelLeft className="h-4 w-4 text-zinc-800" />
            </button>
          </div>

          <div className="chatgpt-rail-footer">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(false)}
              className="chatgpt-rail-avatar-btn"
              title="Arun Eswaran"
              aria-label="User profile"
            >
              <div className="chatgpt-profile-avatar-small">AE</div>
            </button>
          </div>
        </aside>
      )}

      {/* Expanded Sidebar */}
      <aside className={`workspace-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        {/* Top Header Row with Title, Search, and Collapse Buttons */}
        <div className="chatgpt-sidebar-header">
          <div className="chatgpt-brand-row">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="chatgpt-brand-title"
              title="Return to Dashboard"
              aria-label="Return to Dashboard"
            >
              <span className="chatgpt-brand-chevron-box">
                <ChevronLeft className="chatgpt-brand-chevron" />
              </span>
              <span>CEO Workspace</span>
            </button>
          </div>
          <div className="chatgpt-header-actions">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(true)}
              className="chatgpt-header-icon-btn"
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search Input Filter Always Below */}
        <div className="chatgpt-search-wrap">
          <div className="chatgpt-search-box">
            <Search className="h-4 w-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search projects..."
              className="chatgpt-search-input"
            />
          </div>
        </div>

        {/* Top Navigation List */}
        <div className="chatgpt-top-nav">
          <button
            type="button"
            onClick={handleNewChat}
            className={`chatgpt-new-chat-btn ${selectedChat === "New chat" && !isLibraryOpen && !activeSidebarView ? "active" : ""}`}
          >
            <SquarePen className="h-4 w-4 shrink-0 text-zinc-800" />
            <span>New chat</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSidebarView("saved-insights");
              setIsLibraryOpen(false);
              setIsKnowledgeOpen(false);
              setIsAgentsDrawerOpen(false);
            }}
            className={`chatgpt-sidebar-nav-btn ${activeSidebarView === "saved-insights" ? "active" : ""}`}
          >
            <Bookmark className="h-4 w-4 shrink-0 text-zinc-600" />
            <span>Saved insights</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSidebarView("library");
              setIsLibraryOpen(false);
              setIsKnowledgeOpen(false);
              setIsAgentsDrawerOpen(false);
            }}
            className={`chatgpt-sidebar-nav-btn ${activeSidebarView === "library" ? "active" : ""}`}
          >
            <Library className="h-4 w-4 shrink-0 text-zinc-600" />
            <span>Library</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSidebarView("knowledge-packs");
              setIsLibraryOpen(false);
              setIsKnowledgeOpen(false);
              setIsAgentsDrawerOpen(false);
            }}
            className={`chatgpt-sidebar-nav-btn ${activeSidebarView === "knowledge-packs" ? "active" : ""}`}
          >
            <Folder className="h-4 w-4 shrink-0 text-zinc-600" />
            <span>Knowledge packs</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSidebarView("data-sources");
              setIsLibraryOpen(false);
              setIsKnowledgeOpen(false);
              setIsAgentsDrawerOpen(false);
            }}
            className={`chatgpt-sidebar-nav-btn ${activeSidebarView === "data-sources" ? "active" : ""}`}
          >
            <Database className="h-4 w-4 shrink-0 text-zinc-600" />
            <span>Data sources</span>
          </button>
        </div>

        {/* Scrollable Chats List */}
        <div className="chatgpt-sidebar-scroll">
          {/* Chats Section for the current project */}
          <div className="chatgpt-section-label">Chats</div>
          <div className="chatgpt-chats-list">
            {(projectChats[project.id] || [])
              .filter((sc) => {
                if (!searchFilter.trim()) return true;
                return sc.title.toLowerCase().includes(searchFilter.toLowerCase());
              })
              .map((subchat, idx) => {
                const isSubchatActive =
                  !isLibraryOpen &&
                  !activeSidebarView &&
                  (selectedChatKey === subchat.id ||
                    (selectedChatKey === project.id && idx === 0) ||
                    (selectedChat === subchat.title &&
                      (selectedChatKey.startsWith(project.id) || selectedChatKey.startsWith("chat-"))));

                return (
                  <button
                    key={subchat.id}
                    type="button"
                    onClick={() => {
                      setSelectedChat(subchat.title);
                      setSelectedChatKey(subchat.id);
                      if (subchat.title === "New chat") {
                        setIsAgentsDrawerOpen(true);
                        setIsKnowledgeOpen(false);
                      } else {
                        setIsAgentsDrawerOpen(false);
                        setIsLibraryOpen(false);
                        setActiveSidebarView(null);
                      }
                    }}
                    className={`chatgpt-chat-item chatgpt-subchat-item ${isSubchatActive ? "active" : ""}`}
                  >
                    <span className="chatgpt-chat-item-text">{subchat.title}</span>
                  </button>
                );
              })}
          </div>

          {/* Other Projects Section */}
          <div className="chatgpt-section-label" style={{ marginTop: "16px" }}>Other projects</div>
          <div className="chatgpt-chats-list">
            {sidebarProjects
              .filter((p) => p.id !== project.id)
              .filter((p) => {
                if (!searchFilter.trim()) return true;
                const query = searchFilter.toLowerCase();
                const titleMatch = p.title.toLowerCase().includes(query);
                const subchats = projectChats[p.id] || [];
                return titleMatch || subchats.some((sc) => sc.title.toLowerCase().includes(query));
              })
              .map((p) => {
                const isExpanded = expandedProjectId === p.id;
                const subchats = projectChats[p.id] || [];

                return (
                  <div key={p.id} className="chatgpt-folder-group">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProject(p.id);
                        setSelectedChat(p.title);
                        setSelectedChatKey(p.id);
                        setExpandedProjectId((prev) => (prev === p.id ? null : p.id));
                        setIsAgentsDrawerOpen(false);
                        setIsLibraryOpen(false);
                        setActiveSidebarView(null);
                      }}
                      className="chatgpt-folder-row"
                    >
                      <Folder className="h-4 w-4 shrink-0 text-zinc-500" />
                      <span className="chatgpt-chat-item-text">{p.title}</span>
                      {subchats.length > 0 && (
                        <span className="chatgpt-folder-chevron-wrap ml-auto">
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          )}
                        </span>
                      )}
                    </button>

                    {isExpanded && subchats.length > 0 && (
                      <div className="chatgpt-folder-nested">
                        {subchats.map((subchat) => {
                          const isSubchatActive =
                            selectedChatKey === subchat.id ||
                            (selectedChat === subchat.title && (selectedChatKey.startsWith(p.id) || selectedChatKey.startsWith("chat-")));

                          return (
                            <button
                              key={subchat.id}
                              type="button"
                              onClick={() => {
                                onSelectProject(p.id);
                                setSelectedChat(subchat.title);
                                setSelectedChatKey(subchat.id);
                                if (subchat.title === "New chat") {
                                  setIsAgentsDrawerOpen(true);
                                  setIsKnowledgeOpen(false);
                                } else {
                                  setIsAgentsDrawerOpen(false);
                                  setIsLibraryOpen(false);
                                  setActiveSidebarView(null);
                                }
                              }}
                              className={`chatgpt-subchat-item ${isSubchatActive ? "active" : ""}`}
                            >
                              <span className="chatgpt-chat-item-text">{subchat.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Sidebar Footer with Settings and Arun Eswaran Profile */}
        <div className="chatgpt-sidebar-footer">
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="chatgpt-settings-btn"
                title="Settings"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>
                  Manage workspace preferences, agent autonomy, and model configurations.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <div>
                    <div className="font-medium text-sm text-zinc-900">Workspace Theme</div>
                    <div className="text-sm text-zinc-500">Light clean interface</div>
                  </div>
                  <span className="text-sm font-medium px-2.5 py-1 bg-zinc-100 rounded text-zinc-700">Light</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <div>
                    <div className="font-medium text-sm text-zinc-900">Voice & Audio Mode</div>
                    <div className="text-sm text-zinc-500">High-fidelity voice synthesis</div>
                  </div>
                  <span className="text-sm font-medium px-2.5 py-1 bg-zinc-100 rounded text-zinc-700">Enabled</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-sm text-zinc-900">Agent Collaboration</div>
                    <div className="text-sm text-zinc-500">Autonomous multi-agent orchestration</div>
                  </div>
                  <span className="text-sm font-medium px-2.5 py-1 bg-zinc-100 rounded text-zinc-700">Active</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="chatgpt-profile-row">
            <div className="chatgpt-profile-left">
              <div className="chatgpt-profile-avatar">
                <span>AE</span>
              </div>
              <div className="chatgpt-profile-info">
                <span className="chatgpt-profile-name">Arun Eswaran</span>
                <span className="sr-only">ARUN PE</span>
              </div>
            </div>

            <button
              type="button"
              className="chatgpt-theme-toggle-btn"
              title="Light mode"
              aria-label="Theme toggle"
            >
              <Sun className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area (Image 1 & Image 2) */}
      <div className={`workspace-main ${isKnowledgeOpen ? "workspace-main--knowledge-open" : ""}`}>
        {/* Topbar */}
        <header className="chatgpt-topbar">
          <div className="chatgpt-topbar-left">
            {isEditingTitle && !activeSidebarView ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editedTitle.trim()) {
                    setCurrentProjectTitle(editedTitle.trim());
                  }
                  setIsEditingTitle(false);
                }}
                className="chatgpt-topbar-title-edit-form"
              >
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={() => {
                    if (editedTitle.trim()) {
                      setCurrentProjectTitle(editedTitle.trim());
                    }
                    setIsEditingTitle(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setEditedTitle(currentProjectTitle);
                      setIsEditingTitle(false);
                    }
                  }}
                  autoFocus
                  className="chatgpt-topbar-title-input"
                  aria-label="Edit project heading input"
                />
              </form>
            ) : (
              <div className="chatgpt-topbar-title-wrap">
                <span className="chatgpt-topbar-project-title">
                  {activeSidebarView === "saved-insights"
                    ? "Saved insights"
                    : activeSidebarView === "data-sources"
                      ? "Data sources"
                      : activeSidebarView === "library"
                        ? "Library"
                        : activeSidebarView === "knowledge-packs"
                          ? "Knowledge packs"
                          : currentProjectTitle}
                </span>
                {!activeSidebarView && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditedTitle(currentProjectTitle);
                      setIsEditingTitle(true);
                    }}
                    className="chatgpt-topbar-edit-btn"
                    title="Edit project heading"
                    aria-label="Edit project heading"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="chatgpt-topbar-right">
            {!activeSidebarView && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsAgentsDrawerOpen((prev) => !prev);
                  }}
                  className={`chatgpt-what-i-know-btn chatgpt-topbar-agents-btn ${isAgentsDrawerOpen ? "active" : ""}`}
                  title="Agents"
                  aria-label="Agents"
                >
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  <span>Agents</span>
                </button>
                {!isKnowledgeOpen && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsKnowledgeOpen(true);
                    }}
                    className="chatgpt-what-i-know-btn"
                    title="What I know so far"
                    aria-label="What I know"
                  >
                    <BookOpen className="h-4 w-4 mr-1.5" />
                    <span>What I know</span>
                  </button>
                )}
              </>
            )}
          </div>
        </header>

        {/* Center Canvas */}
        <div className={`workspace-canvas ${activeSidebarView ? "is-library-canvas" : messages.length > 0 ? "has-messages" : "is-empty-canvas"}`}>
          {activeSidebarView === "saved-insights" ? (
            <div className="workspace-library-container">
              <div className="workspace-library-header">
                <div className="workspace-library-title-row">
                  <div className="saved-insights-header-bar">
                    <div>
                      <h2 className="workspace-library-title">Saved insights</h2>
                    </div>
                    <div className="saved-insights-search-box">
                      <Search className="h-4 w-4 text-zinc-400 shrink-0" />
                      <input
                        type="text"
                        value={insightsSearchQuery}
                        onChange={(e) => setInsightsSearchQuery(e.target.value)}
                        placeholder="Search saved insights..."
                        className="saved-insights-search-input"
                        aria-label="Search saved insights"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="saved-insights-grid">
                {(() => {
                  const filtered = savedInsightsList.filter((item) => {
                    if (!insightsSearchQuery.trim()) return true;
                    const q = insightsSearchQuery.toLowerCase();
                    return (
                      item.title.toLowerCase().includes(q) ||
                      item.insight.toLowerCase().includes(q) ||
                      item.source.toLowerCase().includes(q)
                    );
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="saved-insights-empty">
                        <p className="text-zinc-500 text-sm">No saved insights found matching "{insightsSearchQuery}".</p>
                      </div>
                    );
                  }

                  return filtered.map((item) => (
                    <article key={item.id} className="saved-insight-card">
                      <div className="saved-insight-top">
                        <span className="saved-insight-date">{item.date}</span>
                      </div>
                      <h3 className="saved-insight-title">{item.title}</h3>
                      <p className="saved-insight-body">{item.insight}</p>
                      <div className="saved-insight-footer">
                        <span className="saved-insight-source">Source: {item.source}</span>
                      </div>
                    </article>
                  ));
                })()}
              </div>
            </div>
          ) : activeSidebarView === "data-sources" ? (
            <div className="workspace-library-container">
              <div className="workspace-library-header">
                <div className="workspace-library-title-row">
                  <h2 className="workspace-library-title">Data sources</h2>
                </div>
              </div>

              <div className="data-sources-grid">
                {dataSourcesData.map((source) => (
                  <article key={source.id} className="data-source-card">
                    <div className="data-source-header">
                      <div className="data-source-title-wrap">
                        <Database className="h-4 w-4 text-zinc-600 shrink-0" />
                        <h3 className="data-source-title">{source.name}</h3>
                      </div>
                    </div>
                    <p className="data-source-desc">{source.description}</p>
                    <div className="data-source-divider" />
                    <div className="data-source-meta-row">
                      <span className="data-source-meta-item">
                        <span className="data-source-meta-label">Coverage:</span> {source.coverage}
                      </span>
                      <span className="data-source-meta-item">
                        <span className="data-source-meta-label">Sync:</span> {source.sync}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : activeSidebarView === "library" ? (
            <div className="workspace-library-container">
              <div className="workspace-library-header">
                <div className="workspace-library-title-row">
                  <h2 className="workspace-library-title">Library</h2>
                </div>
              </div>

              <div className="workspace-library-body">
                <div className="lib-reports-grid">
                  {(reportsByProject[project.id] || libraryReportsData.slice(0, 2)).map((report) => (
                    <LibraryReportCard key={report.id} report={report} />
                  ))}
                </div>
              </div>
            </div>
          ) : activeSidebarView === "knowledge-packs" ? (
            <div className="workspace-library-container">
              <div className="workspace-library-header">
                <div className="workspace-library-title-row">
                  <h2 className="workspace-library-title">Knowledge packs</h2>
                </div>
              </div>

              <div className="workspace-library-body">
                <div className="packages-cards-grid">
                  {((defaultProjectPackages.find((g) => g.projectId === project.id) || defaultProjectPackages[0]).packages).map((pack) => (
                    <article key={pack.id} className="packages-item-card">
                      <div className="packages-item-header">
                        <h5 className="packages-item-title">{pack.title}</h5>
                      </div>
                      <div className="packages-item-divider" />
                      <div className="packages-item-files-list">
                        {pack.files.map((file, fIdx) => (
                          <div key={fIdx} className="packages-file-row">
                            <AdobeAcrobatPdfIcon className="ai-pack-pdf-icon shrink-0" />
                            <div className="packages-file-info">
                              <span className="packages-file-title">
                                {file.title} <span className="packages-file-date">- {file.date}</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.length === 0 && !isThinking && (
                <div className={`chatgpt-center-card ${isVisionModalOpen ? "chatgpt-center-card--vision" : ""}`}>
                  {!isVisionModalOpen && !isVoiceActive ? (
                    <>
                      {isNewProject ? (
                        <>
                          <h1 className="chatgpt-greeting">Hey Arun, what project is on your mind?</h1>
                          <p className="chatgpt-context-sub">
                            Tell me what you'd like to build, and we'll assemble the right agents.
                          </p>
                        </>
                      ) : (
                        <>
                          <h1 className="chatgpt-greeting">What would you like to work on next?</h1>
                          <p className="chatgpt-context-detail">
                            Your project details are ready. We can review the score or explore a decision.
                          </p>
                          <p className="chatgpt-context-sub">
                            Reply below, or choose where to pick up.
                          </p>
                        </>
                      )}

                      {/* Action Buttons */}
                      <div className="workspace-actions">
                        <button
                          type="button"
                          onClick={() => handleSend("Help me define the idea")}
                          className="workspace-btn-primary"
                        >
                          <span>Help me define the idea</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (dockFileInputRef.current) {
                              dockFileInputRef.current.click();
                            } else {
                              handleSend("Attach a plan");
                            }
                          }}
                          className="workspace-btn-secondary"
                        >
                          <Paperclip className="h-4 w-4" />
                          <span>Attach a plan</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleToggleVoiceMode}
                          className={`workspace-vision-btn workspace-voice-btn chatgpt-dock-voice-btn ${isVoiceActive ? "chatgpt-dock-voice-btn--active" : ""}`}
                          title={isVoiceActive ? "Stop voice mode" : "Define Your Vision"}
                          aria-label={isVoiceActive ? "Stop voice mode" : "Define Your Vision (Voice Mode)"}
                          style={{
                            background: "linear-gradient(90deg, #d8e5ff 0%, #e8eeff 45%, #f6f9dd 80%, #fef4ad 100%)",
                            border: "none",
                            color: "#004c8c",
                          }}
                        >
                          <Mic className="vision-btn-mic-icon h-4 w-4" strokeWidth={2.2} style={{ color: "#003e73" }} />
                          <span className="vision-btn-text" style={{ color: "#004880" }}>Define Your Vision</span>
                          {isVoiceActive && (
                            <span className="voice-wave-anim" aria-hidden="true">
                              <span className="voice-wave-bar bar-1" />
                              <span className="voice-wave-bar bar-2" />
                              <span className="voice-wave-bar bar-3" />
                              <span className="voice-wave-bar bar-4" />
                              <span className="voice-wave-bar bar-5" />
                            </span>
                          )}
                        </button>
                      </div>

                    </>
                  ) : null}

                  {/* Center Input Dock (expands in-place to 1100px with voice UI inside) */}
                  <div className={`workspace-dock-wrapper center-dock-wrapper ${isVisionModalOpen ? "center-dock-wrapper--voice" : ""}`}>
                    {renderInputDock()}
                  </div>
                </div>
              )}

              {/* Messages Thread if Any */}
              {(messages.length > 0 || isThinking) && (
                <div className="workspace-conversation">
                  {messages.map((m, mIdx) => {
                    const isAgentReportMsg =
                      m.sender === "assistant" &&
                      (m.id.startsWith("ai-report-") || m.text.startsWith("__AGENT_REPORT__:"));

                    const isPackAddedMsg =
                      !isAgentReportMsg &&
                      m.sender === "assistant" &&
                      (m.id.startsWith("pack-added-") || m.text.startsWith("__PACK_ADDED__:"));

                    const isOutcomeMessage =
                      !isAgentReportMsg &&
                      !isPackAddedMsg &&
                      m.sender === "assistant" &&
                      m.text.includes("What primary outcome do you want to achieve");

                    const isReportFlowMsg =
                      !isAgentReportMsg &&
                      !isPackAddedMsg &&
                      m.sender === "assistant" &&
                      (m.id.startsWith("ai-flow-") ||
                        m.text.includes("assembled two specialized agents") ||
                        m.text.includes("Select an agent to begin configuration"));

                    const isKnowledgePackMsg =
                      !isAgentReportMsg &&
                      !isPackAddedMsg &&
                      !isReportFlowMsg &&
                      m.sender === "assistant" &&
                      (m.text.includes("Knowledge Packs") ||
                        m.text.includes("Knowledge Pack") ||
                        m.text.includes("Tier-2 & Tier-3 City Market Penetration") ||
                        m.text.includes("Frost & Sullivan Knowledge Packs") ||
                        m.text.includes("market intelligence reports") ||
                        m.text.includes("Matching reports") ||
                        m.text.includes("reports covering"));

                    const isStrokeBox =
                      !isAgentReportMsg &&
                      m.sender === "assistant" &&
                      (m.text.includes("Let's define the scope") ||
                        m.text.includes("Target Market & Audience") ||
                        m.text.includes("Success Criteria") ||
                        m.text.includes("primary goal"));

                    const isVoiceSummaryUserMsg =
                      m.sender === "user" &&
                      (m.id.startsWith("voice-scope-summary-") || m.text.includes("Voice input:"));

                    return (
                      <div
                        key={m.id}
                        className={`workspace-message ${m.sender === "user" ? "user-message" : "ai-message"} ${isVoiceSummaryUserMsg ? "user-message--voice-summary" : ""}`}
                        aria-label={isVoiceSummaryUserMsg ? "Voice input summary" : undefined}
                      >
                        {isAgentReportMsg ? (
                          <div className="ai-agent-report-container" id="agent-report-section">
                            {renderAgentReport(
                              m.text.startsWith("__AGENT_REPORT__:")
                                ? m.text.replace("__AGENT_REPORT__:", "")
                                : activeReportAgentId || selectedRecommendedAgentId || "agent-sbi-home-loan"
                            )}
                          </div>
                        ) : isPackAddedMsg ? (
                          (() => {
                            const packTitle =
                              m.text.replace("__PACK_ADDED__:", "").trim() ||
                              "South Asia Tier-2 & Tier-3 City Market Penetration";
                            return (
                              <div className="ai-pack-added-container">
                                <div className="ai-pack-added-card">
                                  <div className="ai-pack-added-body">
                                    <h3 className="ai-pack-added-heading">
                                      Pack Added to Your Project
                                    </h3>
                                    <p className="ai-pack-added-subline">
                                      {packTitle} is now integrated
                                    </p>
                                    <p className="ai-pack-added-description">
                                      All market intelligence reports, price elasticity benchmarks, and retail distribution datasets from this pack have been added to your project intelligence base. Autonomous agents can now utilize these sources for strategic modeling and execution.
                                    </p>
                                  </div>
                                </div>

                                {/* Related Actions Section */}
                                <div className="ai-related-actions-wrapper">
                                  <div className="ai-related-actions-header">
                                    <h4 className="ai-related-actions-title">Related actions</h4>
                                  </div>
                                  <div className="ai-related-actions-list">
                                    {[
                                      "Start a Market research",
                                      "Policy And Regulations Check",
                                      "Plan a Business model",
                                      "Competitor Landscape",
                                      "Geographical market deep drive",
                                    ].map((actionText, actionIdx) => (
                                      <button
                                        key={actionIdx}
                                        type="button"
                                        onClick={() => {
                                          handleSend(actionText);
                                        }}
                                        className="ai-related-action-card group"
                                        title={actionText}
                                      >
                                        <div className="ai-related-action-left">
                                          <ArrowRight className="h-4 w-4 text-primary shrink-0 ai-related-action-icon" />
                                          <span className="ai-related-action-text">{actionText}</span>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-primary shrink-0 transition-colors" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })()
                        ) : isOutcomeMessage ? (
                          (() => {
                            const isDefineObjective =
                              m.text.includes("core objective") ||
                              m.text.includes("start building the business case") ||
                              m.text.includes("Accelerate enterprise revenue growth");

                            const outcomeOptions = isDefineObjective
                              ? [
                                "Accelerate enterprise revenue growth",
                                "Automate key operational processes",
                                "Launch a new AI product or platform",
                                "Expand into a new target market",
                              ]
                              : [
                                "Launch a new AI product or service",
                                "Automate internal operations & reduce costs",
                                "Expand into a new customer segment or region",
                                "Accelerate enterprise sales & revenue growth",
                              ];

                            return (
                              <div className="ai-intake-and-outcome-container">
                                {/* Project brief message section above the box */}
                                {isDefineObjective ? (
                                  <div className="ai-scope-outside-header">
                                    <div className="ai-scope-title-row">
                                      <h3 className="ai-outcome-question ai-scope-card-title">
                                        Project goals
                                      </h3>
                                      <div className="ai-scope-step-dots" aria-hidden="true">
                                        <span
                                          className={`ai-scope-step-dot ${scopeStep === 1
                                              ? "ai-scope-step-dot--active"
                                              : "ai-scope-step-dot--done"
                                            }`}
                                        />
                                        <span
                                          className={`ai-scope-step-dot ${scopeStep === 2 ? "ai-scope-step-dot--active" : ""
                                            }`}
                                        />
                                      </div>
                                    </div>
                                    <p className="ai-unwrapped-objective-text">
                                      Let's define the core objective of this project to start building the business case.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="ai-intake-card">
                                    <div className="ai-scope-title-row">
                                      <h4 className="ai-intake-title">
                                        Project brief confirmed, Arun
                                      </h4>
                                      <div className="ai-scope-step-dots" aria-hidden="true">
                                        <span
                                          className={`ai-scope-step-dot ${scopeStep === 1
                                              ? "ai-scope-step-dot--active"
                                              : "ai-scope-step-dot--done"
                                            }`}
                                        />
                                        <span
                                          className={`ai-scope-step-dot ${scopeStep === 2 ? "ai-scope-step-dot--active" : ""
                                            }`}
                                        />
                                      </div>
                                    </div>
                                    <p className="ai-intake-text">
                                      We've received your project brief for "{project.title}". Autonomous collaborative agents are ready to coordinate market dynamics, unit economics, and execution milestones. To configure the optimal agent workflow, let's establish your direction:
                                    </p>
                                  </div>
                                )}

                                {/* Outcome / Project Scope Intake Box */}
                                <div className="ai-stroke-box">
                                  <div className="ai-outcome-container ai-scope-intake-container">
                                    <span className="sr-only">
                                      What primary outcome do you want to achieve with this project?
                                    </span>

                                    {/* Sliding Viewport for Multi-Step Intake Flow */}
                                    <div className="ai-scope-slider-viewport">
                                      <div
                                        className={`ai-scope-slider-track ai-scope-slider-track--step${scopeStep}`}
                                      >
                                        {/* Step 1: Goal & Who it's for */}
                                        <div
                                          className="ai-scope-step-slide ai-scope-step-slide--1"
                                          aria-hidden={scopeStep !== 1}
                                        >
                                          {/* 1. Goal (Quick clickable chips + Writable text field below) */}
                                          <div className="ai-scope-item ai-scope-item--unwrapped">
                                            <div className="ai-scope-item-header">
                                              <span className="ai-scope-field-label">Goal</span>
                                            </div>
                                            <div
                                              className="ai-scope-chips-group ai-outcome-options-grid ai-scope-goal-grid"
                                              role="radiogroup"
                                              aria-label="Primary project outcome"
                                            >
                                              {outcomeOptions.map((opt) => {
                                                const isSelected = isDefineObjective
                                                  ? projectScope.goal === opt || customOutcome === opt
                                                  : selectedOutcomes[m.id] === opt ||
                                                    projectScope.goal === opt ||
                                                    customOutcome === opt;

                                                return (
                                                  <button
                                                    key={opt}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={isSelected}
                                                    onClick={() => {
                                                      setCustomOutcome("");
                                                      setProjectScope((prev) => ({ ...prev, goal: opt }));
                                                      if (!isDefineObjective) {
                                                        handleOutcomeSelect(m.id, opt);
                                                      }
                                                    }}
                                                    className={`ai-scope-chip-btn ai-outcome-option-btn ${isSelected
                                                        ? "ai-scope-chip-btn--selected ai-outcome-option-btn--selected"
                                                        : ""
                                                      }`}
                                                  >
                                                    <div className="ai-outcome-option-content">
                                                      <span
                                                        className={`ai-outcome-radio ${isSelected ? "ai-outcome-radio--selected" : ""
                                                          }`}
                                                        aria-hidden="true"
                                                      >
                                                        {isSelected && (
                                                          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                                                        )}
                                                      </span>
                                                      <span className="ai-scope-chip-text ai-outcome-option-text">
                                                        {opt}
                                                      </span>
                                                    </div>
                                                  </button>
                                                );
                                              })}
                                            </div>
                                            <div className="ai-scope-writable-wrap">
                                              <form
                                                onSubmit={(e) => {
                                                  e.preventDefault();
                                                  const val = (customOutcome || projectScope.goal || "").trim();
                                                  if (val) {
                                                    setProjectScope((prev) => ({ ...prev, goal: val }));
                                                    if (!isDefineObjective) {
                                                      handleOutcomeSelect(m.id, val);
                                                      setCustomOutcome("");
                                                    }
                                                  }
                                                }}
                                                className="ai-scope-input-form ai-outcome-input-form"
                                              >
                                                <input
                                                  type="text"
                                                  value={customOutcome}
                                                  onChange={(e) => {
                                                    setCustomOutcome(e.target.value);
                                                    setProjectScope((prev) => ({ ...prev, goal: e.target.value }));
                                                  }}
                                                  placeholder="Type your answer and press Enter"
                                                  className="ai-scope-text-input ai-outcome-input-field"
                                                  aria-label="Type your answer and press Enter"
                                                />
                                                <span className="sr-only">Type your answer and press Enter</span>
                                                <span className="sr-only">Or in your own words</span>
                                                <button
                                                  type="submit"
                                                  disabled={!customOutcome.trim() && !projectScope.goal}
                                                  className="sr-only"
                                                  aria-label="Submit answer"
                                                >
                                                  Submit answer
                                                </button>
                                              </form>
                                            </div>
                                          </div>

                                          {/* 2. Who it's for (Interactive 2-Column Persona Segment Cards - matching Goal option style & height) */}
                                          <div className="ai-scope-item ai-scope-item--unwrapped">
                                            <div className="ai-scope-item-header">
                                              <span className="ai-scope-field-label">Who it's for</span>
                                            </div>
                                            <div
                                              className="ai-scope-who-grid ai-scope-chips-group"
                                              aria-label="Who it's for"
                                            >
                                              {[
                                                "Tier-2 & Tier-3 Regional Consumers",
                                                "Regional FMCG Super-Stockists",
                                                "High-Frequency Kirana Retailers",
                                                "Modern Trade & Quick-Commerce",
                                              ].map((label) => {
                                                const isSelected = projectScope.whoItsFor === label;
                                                return (
                                                  <button
                                                    key={label}
                                                    type="button"
                                                    aria-pressed={isSelected}
                                                    onClick={() =>
                                                      setProjectScope((prev) => ({
                                                        ...prev,
                                                        whoItsFor: isSelected ? "" : label,
                                                      }))
                                                    }
                                                    className={`ai-scope-chip-btn ai-scope-who-card ${isSelected
                                                        ? "ai-scope-chip-btn--selected ai-scope-who-card--selected"
                                                        : ""
                                                      }`}
                                                  >
                                                    <div className="ai-scope-who-content">
                                                      <span
                                                        className={`ai-scope-who-radio ${isSelected ? "ai-scope-who-radio--selected" : ""
                                                          }`}
                                                        aria-hidden="true"
                                                      >
                                                        {isSelected && (
                                                          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                                                        )}
                                                      </span>
                                                      <span className="ai-scope-chip-text ai-scope-who-text">
                                                        {label}
                                                      </span>
                                                    </div>
                                                  </button>
                                                );
                                              })}
                                            </div>
                                          </div>

                                          {/* Step 1 Footer: Next Button */}
                                          <div className="ai-scope-footer">
                                            <button
                                              type="button"
                                              onClick={() => setScopeStep(2)}
                                              className="ai-scope-submit-btn ai-scope-next-btn"
                                              aria-label="Next"
                                            >
                                              Next
                                              <ArrowRight className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </div>

                                        {/* Step 2: Investment, Expected annual impact, Target date, Delivery owner */}
                                        <div
                                          className="ai-scope-step-slide ai-scope-step-slide--2"
                                          aria-hidden={scopeStep !== 2}
                                        >
                                          {/* 3 & 4. Investment & Expected annual impact (Side-by-side Half Width Row - Unwrapped) */}
                                          <div className="ai-scope-split-row">
                                            {/* 3. Investment (Manually Enterable Amount Field - USD) */}
                                            <div className="ai-scope-item ai-scope-item--half ai-scope-item--unwrapped">
                                              <div className="ai-scope-item-header">
                                                <span className="ai-scope-field-label">Investment</span>
                                              </div>
                                              <div className="ai-scope-manual-amount-wrap">
                                                <div className="ai-scope-amount-input-box">
                                                  <span className="ai-scope-currency-symbol">$</span>
                                                  <input
                                                    type="text"
                                                    value={projectScope.investment}
                                                    onChange={(e) =>
                                                      setProjectScope((prev) => ({
                                                        ...prev,
                                                        investment: e.target.value,
                                                      }))
                                                    }
                                                    placeholder="Enter amount (e.g. $500K or $1.5M)"
                                                    className="ai-scope-amount-input"
                                                    aria-label="Enter investment amount"
                                                  />
                                                </div>
                                              </div>
                                            </div>

                                            {/* 4. Expected annual impact (Typing Field - Unwrapped) */}
                                            <div className="ai-scope-item ai-scope-item--half ai-scope-item--unwrapped">
                                              <div className="ai-scope-item-header">
                                                <span className="ai-scope-field-label">Expected annual impact</span>
                                              </div>
                                              <div className="ai-scope-impact-input-box">
                                                <input
                                                  type="text"
                                                  value={projectScope.annualImpact}
                                                  onChange={(e) =>
                                                    setProjectScope((prev) => ({
                                                      ...prev,
                                                      annualImpact: e.target.value,
                                                    }))
                                                  }
                                                  placeholder="Enter expected impact (e.g. $2.5M ARR or +25% growth)"
                                                  className="ai-scope-impact-input"
                                                  aria-label="Enter expected annual impact"
                                                />
                                              </div>
                                            </div>
                                          </div>

                                          {/* 5 & 6. Target date & Market (Side-by-side Half Width Row - Unwrapped) */}
                                          <div className="ai-scope-split-row">
                                            {/* 5. Target date (Left Side Half Width - Unwrapped) */}
                                            <div className="ai-scope-item ai-scope-item--half ai-scope-item--unwrapped">
                                              <div className="ai-scope-item-header">
                                                <span className="ai-scope-field-label">Target date</span>
                                              </div>
                                              {(() => {
                                                const parsedQuarterMatch = projectScope.targetDate.match(/Q[1-4]/i);
                                                const currentQuarter = parsedQuarterMatch ? parsedQuarterMatch[0].toUpperCase() : "Q1";
                                                const currentYear = projectScope.targetDate.replace(/Q[1-4]/i, "").trim();

                                                return (
                                                  <div className="ai-scope-year-quarter-box">
                                                    <div className="ai-scope-year-input-wrap">
                                                      <input
                                                        type="text"
                                                        value={currentYear}
                                                        onChange={(e) => {
                                                          const newYear = e.target.value;
                                                          const quarterToUse = currentQuarter || "Q1";
                                                          setProjectScope((prev) => ({
                                                            ...prev,
                                                            targetDate: newYear.trim() ? `${quarterToUse} ${newYear.trim()}` : "",
                                                          }));
                                                        }}
                                                        placeholder="YYYY"
                                                        className="ai-scope-year-input"
                                                        aria-label="Enter target year"
                                                      />
                                                    </div>
                                                    {currentYear.trim() && (
                                                      <div className="ai-scope-single-quarter-wrap">
                                                        <button
                                                          type="button"
                                                          onClick={() => {
                                                            const quarters = ["Q1", "Q2", "Q3", "Q4"];
                                                            const currentIdx = quarters.indexOf(currentQuarter || "Q1");
                                                            const nextQ = quarters[(currentIdx + 1) % quarters.length];
                                                            setProjectScope((prev) => ({
                                                              ...prev,
                                                              targetDate: `${nextQ} ${currentYear.trim()}`,
                                                            }));
                                                          }}
                                                          className="ai-scope-single-quarter-text"
                                                          title="Click to change quarter"
                                                          aria-label={`Target quarter: ${currentQuarter}. Click to change.`}
                                                        >
                                                          {currentQuarter}
                                                        </button>
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              })()}
                                            </div>

                                            {/* 6. Market (Right Side Half Width - Select Region Dropdown) */}
                                            <div className="ai-scope-item ai-scope-item--half ai-scope-item--unwrapped">
                                              <div className="ai-scope-item-header">
                                                <span className="ai-scope-field-label">Market</span>
                                              </div>
                                              <div className="ai-scope-dropdown-wrap" ref={marketDropdownRef}>
                                                <button
                                                  type="button"
                                                  onClick={() => setIsMarketDropdownOpen((prev) => !prev)}
                                                  className={`ai-scope-dropdown-trigger ${isMarketDropdownOpen ? "ai-scope-dropdown-trigger--open" : ""
                                                    }`}
                                                  aria-haspopup="listbox"
                                                  aria-expanded={isMarketDropdownOpen}
                                                  aria-label="Market region dropdown"
                                                >
                                                  <div className="ai-scope-dropdown-trigger-left">
                                                    <span
                                                      className={
                                                        projectScope.market
                                                          ? "ai-scope-dropdown-selected-val"
                                                          : "ai-scope-dropdown-placeholder"
                                                      }
                                                    >
                                                      {projectScope.market || "Select region"}
                                                    </span>
                                                  </div>
                                                  <ChevronDown
                                                    className={`h-4 w-4 text-zinc-500 shrink-0 transition-transform duration-200 ${isMarketDropdownOpen ? "rotate-180 text-primary" : ""
                                                      }`}
                                                  />
                                                </button>

                                                {isMarketDropdownOpen && (
                                                  <div
                                                    className="ai-scope-dropdown-menu"
                                                    role="listbox"
                                                    aria-label="Market region options"
                                                  >
                                                    {[
                                                      "South Asia",
                                                      "South India",
                                                      "North India",
                                                      "West & Central India",
                                                      "East India & Northeast",
                                                      "Southeast Asia",
                                                    ].map((region) => {
                                                      const isSelected = projectScope.market === region;
                                                      return (
                                                        <button
                                                          key={region}
                                                          type="button"
                                                          role="option"
                                                          aria-selected={isSelected}
                                                          onClick={() => {
                                                            setProjectScope((prev) => ({
                                                              ...prev,
                                                              market: region,
                                                            }));
                                                            setIsMarketDropdownOpen(false);
                                                          }}
                                                          className={`ai-scope-dropdown-option ${isSelected ? "ai-scope-dropdown-option--selected" : ""
                                                            }`}
                                                        >
                                                          <span className="ai-scope-dropdown-option-text">{region}</span>
                                                          {isSelected && (
                                                            <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={2.5} />
                                                          )}
                                                        </button>
                                                      );
                                                    })}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* 7. Delivery owner (Full Width - Below) */}
                                          <div className="ai-scope-item ai-scope-item--unwrapped">
                                            <div className="ai-scope-item-header">
                                              <span className="ai-scope-field-label">Delivery owner</span>
                                            </div>
                                            <div className="ai-scope-owner-input-box">
                                              <input
                                                type="text"
                                                value={projectScope.deliveryOwner}
                                                onChange={(e) =>
                                                  setProjectScope((prev) => ({
                                                    ...prev,
                                                    deliveryOwner: e.target.value,
                                                  }))
                                                }
                                                placeholder="Enter delivery owner (e.g. Arun Eswaran)"
                                                className="ai-scope-owner-input"
                                                aria-label="Enter delivery owner"
                                              />
                                            </div>
                                          </div>

                                          {/* Step 2 Footer: Back & Confirm Buttons */}
                                          <div className="ai-scope-footer ai-scope-footer--split">
                                            <button
                                              type="button"
                                              onClick={() => setScopeStep(1)}
                                              className="ai-scope-back-btn"
                                              aria-label="Back"
                                            >
                                              <ArrowLeft className="h-4 w-4" />
                                              Back
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const chosenGoal =
                                                  projectScope.goal ||
                                                  customOutcome ||
                                                  outcomeOptions[0];

                                                const scopeSentMessage = "Project scope confirmed and submitted";
                                                handleOutcomeSelect(m.id, chosenGoal, scopeSentMessage);
                                                setCustomOutcome("");
                                              }}
                                              className="ai-scope-submit-btn"
                                            >
                                              Confirm Project Scope
                                              <ArrowRight className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()
                        ) : isReportFlowMsg ? (
                          <div className="report-flow-container">
                            <div className="ai-recommended-agents-wrapper">
                              <p className="report-flow-box-prompt" style={{ marginBottom: "8px" }}>
                                To complete this report for <strong>{project.title}</strong>, I've assembled two specialized agents to synthesize the market intelligence. Select an agent to begin configuration:
                              </p>

                              <div className="ai-recommended-agents-header">
                                <h3 className="ai-recommended-agents-title">Suggested Agents</h3>
                              </div>

                              <div className="ai-recommended-agents-grid" role="radiogroup" aria-label="Suggested Agents">
                                {projectRelatedAgents.slice(0, 2).map((agent) => {
                                  const currentFlow = reportFlows[m.id] || { ...defaultReportFlowState };
                                  const selectedList = currentFlow.selectedAgentIds && currentFlow.selectedAgentIds.length > 0
                                    ? currentFlow.selectedAgentIds
                                    : currentFlow.selectedAgentId ? [currentFlow.selectedAgentId] : [];
                                  const isSelected = selectedList.includes(agent.id);

                                  return (
                                    <article
                                      key={agent.id}
                                      role="checkbox"
                                      aria-checked={isSelected}
                                      className={`project-card agent-card ai-agent-recommend-card report-flow-agent-card ${isSelected ? "ai-agent-recommend-card--selected" : ""}`}
                                      onClick={() => {
                                        handleSelectFlowAgent(m.id, agent.id);
                                      }}
                                    >
                                      <div className="project-card-main">
                                        <div className="project-card-header">
                                          <h3 className="project-card-title">
                                            <span className="project-title-link">
                                              {agent.title}
                                            </span>
                                          </h3>
                                        </div>

                                        <p className="project-card-description">{agent.description}</p>
                                      </div>

                                      <div className="agent-card-footer">
                                        <span className="agent-last-used">
                                          <Clock className="agent-clock-icon" aria-hidden="true" />
                                          <span>{agent.lastUsed || "Active now"}</span>
                                        </span>

                                        <span
                                          className={`ai-outcome-radio ${isSelected ? "ai-outcome-radio--selected" : ""}`}
                                          aria-hidden="true"
                                        >
                                          {isSelected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                                        </span>
                                      </div>
                                    </article>
                                  );
                                })}
                              </div>

                              {/* Single Continue button matching pill button */}
                              {(() => {
                                const currentFlow = reportFlows[m.id] || { ...defaultReportFlowState };
                                const isRunning = Boolean(currentFlow.activeAgentId) || Boolean(currentFlow.hasRunAgents) || Boolean(currentFlow.isGenerating);

                                return (
                                  <div className="ai-recommended-agents-footer">
                                    <button
                                      type="button"
                                      className={`ai-generate-report-btn project-action-btn--generate-report report-flow-run-agents-btn ${isRunning ? "project-action-btn--completed" : ""}`}
                                      onClick={() => handleRunBothAgents(m.id)}
                                      disabled={isRunning}
                                      aria-label="Continue"
                                    >
                                      <span>Continue</span>
                                      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 ml-1.5 flex-shrink-0" />
                                    </button>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Configuration section: shown ONLY when agents are selected or after Continue click; stays visible even during and after report generation */}
                            {(() => {
                              const currentFlow = reportFlows[m.id];
                              if (!currentFlow || !currentFlow.activeAgentId) return null;

                              const suggested = projectRelatedAgents.slice(0, 2);
                              const selectedList = currentFlow.selectedAgentIds && currentFlow.selectedAgentIds.length > 0
                                ? currentFlow.selectedAgentIds
                                : [currentFlow.activeAgentId];
                              const showSecondAgent = currentFlow.isAgent2Active && selectedList.length >= 2;

                              const leadAgent = suggested.find((a) => a.id === selectedList[0]) || suggested[0];
                              const secondAgent = suggested.find((a) => a.id === selectedList[1]) || suggested.find((a) => a.id !== leadAgent.id) || suggested[1];
                              const isGenDisabled = Boolean(currentFlow.isGenerating || currentFlow.isReportGenerated);

                              return (
                                <div className="report-flow-configuration-container" style={{ marginTop: "16px" }}>
                                  {/* Agent 1 Fields */}
                                  <div className="report-flow-agent-section">
                                    <div className="report-flow-section-header">
                                      <h4 className="report-flow-section-title">{leadAgent.title}</h4>
                                      <span className="report-flow-section-subtitle">Reporting parameters</span>
                                    </div>

                                    {/* Field 1: Period with Calendar Dropdown */}
                                    <div className="report-flow-field-group">
                                      <label className="report-flow-field-label">Reporting Period</label>
                                      <ReportCalendarDropdown
                                        value={currentFlow.agent1Fields.period}
                                        onChange={(val) => handleUpdateFlowField(m.id, "agent1Fields", "period", val)}
                                      />
                                    </div>

                                    {/* Field 2: Geography */}
                                    <div className="report-flow-field-group">
                                      <label className="report-flow-field-label">Geographic Tier Focus</label>
                                      <div className="report-flow-pills-row" role="radiogroup" aria-label="Geographic Tier Focus">
                                        {[
                                          "Tier-2 Priority Growth Cities",
                                          "Tier-3 Regional Urban Clusters",
                                          "Comprehensive Secondary Network",
                                        ].map((opt) => (
                                          <button
                                            key={opt}
                                            type="button"
                                            className={`report-flow-pill ${currentFlow.agent1Fields.geography === opt ? "report-flow-pill--active" : ""}`}
                                            onClick={() => handleUpdateFlowField(m.id, "agent1Fields", "geography", opt)}
                                          >
                                            {opt}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Agent 2 Fields - only show if 2 agents selected */}
                                  {showSecondAgent && (
                                    <div className="report-flow-agent-section">
                                      <div className="report-flow-section-header">
                                        <h4 className="report-flow-section-title">{secondAgent.title}</h4>
                                        <span className="report-flow-section-subtitle">Collaborative segmentation inputs</span>
                                      </div>

                                      {/* Field 3: Target Consumer Cohort */}
                                      <div className="report-flow-field-group">
                                        <label className="report-flow-field-label">Target Consumer Cohort</label>
                                        <div className="report-flow-pills-row" role="radiogroup" aria-label="Target Consumer Cohort">
                                          {[
                                            "Aspirational Mass-Premium Buyers",
                                            "Value-Conscious Middle-Class Households",
                                            "Young Urban Skincare Adopters",
                                          ].map((opt) => (
                                            <button
                                              key={opt}
                                              type="button"
                                              className={`report-flow-pill ${currentFlow.agent2Fields.cohort === opt ? "report-flow-pill--active" : ""}`}
                                              onClick={() => handleUpdateFlowField(m.id, "agent2Fields", "cohort", opt)}
                                            >
                                              {opt}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Field 4: Channel Distribution Velocity (Dropdown using app theme) */}
                                      <div className="report-flow-field-group">
                                        <label className="report-flow-field-label">Channel Distribution Velocity</label>
                                        <ReportSelectDropdown
                                          label="Channel Distribution Velocity"
                                          value={currentFlow.agent2Fields.channel}
                                          options={CHANNEL_OPTIONS}
                                          onChange={(val) => handleUpdateFlowField(m.id, "agent2Fields", "channel", val)}
                                        />
                                      </div>

                                      {/* Field 5: Custom Strategic Focus & Priority Notes (Write field) */}
                                      <div className="report-flow-field-group">
                                        <label className="report-flow-field-label">
                                          Custom Strategic Focus & Priority Cities
                                        </label>
                                        <div className="report-flow-write-wrap">
                                          <input
                                            type="text"
                                            className="report-flow-write-input"
                                            placeholder="Write custom strategic focus, target cities, or pack-size targets (e.g. Jaipur & Indore ₹199 trial packs)..."
                                            value={currentFlow.agent2Fields.customNotes || ""}
                                            onChange={(e) => handleUpdateFlowField(m.id, "agent2Fields", "customNotes", e.target.value)}
                                            aria-label="Write custom strategic focus and priority cities"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Continue Button */}
                                  <div className="report-flow-footer-row">
                                    <button
                                      type="button"
                                      className="report-flow-continue-btn"
                                      onClick={() => handleGenerateReport(m.id)}
                                      disabled={isGenDisabled}
                                      aria-label="Continue to Generate Report"
                                    >
                                      <span>Continue to Generate Report</span>
                                      <ArrowRight className="h-4 w-4 ml-2" />
                                    </button>
                                  </div>

                                  {/* Single Gradient Ring thinking animation while generating */}
                                  {currentFlow.isGenerating && (
                                    <div className="ai-agent-generating-loader-wrap" style={{ marginTop: "16px" }}>
                                      <div className="ai-thinking-row" role="status" aria-label="Thinking">
                                        <div className="ai-thinking-spinner" aria-hidden="true">
                                          <GradientRingSpinner />
                                        </div>
                                        <span className="ai-thinking-text">Thinking...</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}

                            {/* Visual Market Entry Report (shown after Continue to Generate Report) */}
                            {(() => {
                              const currentFlow = reportFlows[m.id];
                              if (!currentFlow || currentFlow.isGenerating) return null;
                              if (!currentFlow.isReportGenerated) return null;

                              return (
                                <div className="ai-agent-report-container" id="agent-report-section" style={{ marginTop: "16px" }}>
                                  {renderAgentReport("proj-agent-emerging-markets")}
                                </div>
                              );
                            })()}
                          </div>
                        ) : isKnowledgePackMsg ? (
                          <div className="ai-knowledge-flow-container">
                            {/* AI Scope Understood Executive Summary (Above Matching Knowledge Packs) */}
                            {(() => {
                              const hasCustomInputs =
                                projectScope.goal ||
                                projectScope.market ||
                                projectScope.investment ||
                                projectScope.annualImpact ||
                                projectScope.targetDate;

                              const summaryText = hasCustomInputs
                                ? (() => {
                                  const rawGoal =
                                    projectScope.goal ||
                                    selectedOutcomes[m.id] ||
                                    customOutcome ||
                                    "launch a passenger BEV distribution pilot";
                                  const goalText =
                                    rawGoal.toLowerCase().startsWith("launch") ||
                                      rawGoal.toLowerCase().startsWith("expand") ||
                                      rawGoal.toLowerCase().startsWith("accelerate") ||
                                      rawGoal.toLowerCase().startsWith("automate")
                                      ? rawGoal.toLowerCase()
                                      : `pursue ${rawGoal}`;
                                  const marketText = projectScope.market ? `in ${projectScope.market}` : "in the Philippines";
                                  const investText = projectScope.investment
                                    ? `with a ${projectScope.investment.toUpperCase().includes("USD") ||
                                      projectScope.investment.startsWith("$")
                                      ? projectScope.investment
                                      : `USD ${projectScope.investment}`
                                    } investment budget`
                                    : "with a USD 500,000 investment budget";
                                  const impactText = projectScope.annualImpact
                                    ? `targeting ${projectScope.annualImpact.toUpperCase().includes("USD") ||
                                      projectScope.annualImpact.startsWith("$")
                                      ? projectScope.annualImpact
                                      : `USD ${projectScope.annualImpact}`
                                    } in annual impact`
                                    : "targeting USD 1,200,000 in annual impact";
                                  const dateText = projectScope.targetDate ? `by ${projectScope.targetDate}` : "by mid-2027";

                                  return `Project Aurora evaluates whether to ${goalText} ${marketText} ${investText} ${impactText} ${dateText}.`;
                                })()
                                : "Project Aurora evaluates whether to launch a passenger BEV distribution pilot in the Philippines with a USD 500,000 investment budget targeting USD 1,200,000 in annual impact by mid-2027.";

                              return (
                                <div className="ai-scope-understood-card">
                                  <div className="ai-scope-understood-main">
                                    <div className="ai-scope-understood-badge">
                                      <span>Project Scope Is Ready</span>
                                    </div>
                                    <p className="ai-scope-understood-title">
                                      {summaryText}
                                    </p>
                                  </div>

                                  <div className="ai-scope-score-container" aria-label="Score: 75 out of 100">
                                    <div className="ai-scope-score-gauge">
                                      <svg width="76" height="76" viewBox="0 0 76 76" className="ai-scope-score-svg">
                                        <circle
                                          cx="38"
                                          cy="38"
                                          r="30"
                                          stroke="rgba(16, 185, 129, 0.15)"
                                          strokeWidth="6"
                                          fill="transparent"
                                        />
                                        <circle
                                          cx="38"
                                          cy="38"
                                          r="30"
                                          stroke="#10b981"
                                          strokeWidth="6"
                                          strokeDasharray="188.5"
                                          strokeDashoffset="47.12"
                                          strokeLinecap="round"
                                          fill="transparent"
                                          transform="rotate(-90 38 38)"
                                        />
                                      </svg>
                                      <div className="ai-scope-score-center-text">
                                        <span className="ai-scope-score-value">75</span>
                                        <span className="ai-scope-score-denom">/100</span>
                                      </div>
                                    </div>
                                    <span className="ai-scope-score-title">Score</span>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Matching Knowledge Packages */}
                            <div className="ai-knowledge-packs-wrapper">
                              <div className="ai-knowledge-packs-header">
                                <h3 className="ai-knowledge-packs-title">Matching Knowledge Packs</h3>
                              </div>

                              <div className="ai-knowledge-packs-grid">
                                {defaultKnowledgePacks.map((pack) => {
                                  const isAdded = !!obtainedPacks[pack.id];
                                  return (
                                    <div key={pack.id} className="ai-knowledge-pack-card">
                                      <div className="ai-pack-card-header">
                                        <div className="ai-pack-card-top-row">
                                          <h4 className="ai-pack-title">{pack.title}</h4>
                                        </div>

                                        <p className="ai-pack-subtitle" title={pack.subtitle}>
                                          <Folder className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                                          <span className="ai-pack-subtitle-text">{pack.subtitle}</span>
                                        </p>
                                      </div>

                                      <div className="ai-pack-divider" />

                                      <div className="ai-pack-files-list">
                                        {pack.files.map((file, fileIdx) => (
                                          <div key={fileIdx} className="ai-pack-file-row">
                                            <div className="ai-pack-file-left">
                                              <AdobeAcrobatPdfIcon className="ai-pack-pdf-icon" />
                                              <div className="ai-pack-file-info">
                                                <h5 className="ai-pack-file-title">
                                                  {file.title} <span className="ai-pack-file-date">- {file.date}</span>
                                                </h5>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                      <div className="ai-pack-footer">
                                        <div className="ai-pack-credits-col">
                                          <div className="ai-pack-price-wrap">
                                            <span className="ai-pack-price-label">Credits required:</span>
                                            <span className="ai-pack-price-val">{pack.creditsRequired || "4,000"}</span>
                                          </div>
                                          <div className="ai-pack-available-wrap">
                                            <span className="ai-pack-available-label">Available credits:</span>
                                            <span className="ai-pack-available-val">
                                              {isAdded ? "8,000" : (pack.availableCredits || "12,000")}
                                            </span>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleTogglePack(pack.id)}
                                          className={`ai-pack-get-btn ${isAdded ? "ai-pack-get-btn--added" : ""}`}
                                          title={isAdded ? `${pack.title} pack added` : `Get ${pack.title} pack`}
                                          aria-label={isAdded ? `${pack.title} pack added` : `Get ${pack.title} pack`}
                                        >
                                          {isAdded ? (
                                            <>
                                              <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                                              <span>Added</span>
                                            </>
                                          ) : (
                                            <span>Get Pack</span>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Summary Box: How this knowledge supports your project */}
                              <div className="ai-relevance-box ai-relevance-summary-wrapper">
                                <h4 className="ai-relevance-title">How this knowledge supports your project</h4>
                                <div
                                  className="ai-relevance-text whitespace-pre-line leading-relaxed"
                                  style={{ color: "#64748b" }}
                                >
                                  {m.text}
                                </div>
                                <div className="message-actions-row">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveInsight(m)}
                                    className={`save-insight-btn ${savedMsgIds[m.id] ? "saved" : ""}`}
                                    title={savedMsgIds[m.id] ? "Saved to insights" : "Save insight"}
                                    aria-label={savedMsgIds[m.id] ? "Saved to insights" : "Save insight"}
                                  >
                                    {savedMsgIds[m.id] ? (
                                      <>
                                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                                        <span>Saved to insights</span>
                                      </>
                                    ) : (
                                      <>
                                        <Bookmark className="h-3.5 w-3.5 text-zinc-500" />
                                        <span>Save insight</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>

                          </div>
                        ) : isStrokeBox ? (
                          <div className="ai-stroke-box">
                            <div
                              className="workspace-message-body whitespace-pre-line"
                              style={m.text.includes("I found market intelligence reports from 2025") ? { color: "#64748b" } : undefined}
                            >
                              {m.text}
                            </div>
                            {m.sender === "assistant" && (
                              <div className="message-actions-row">
                                <button
                                  type="button"
                                  onClick={() => handleSaveInsight(m)}
                                  className={`save-insight-btn ${savedMsgIds[m.id] ? "saved" : ""}`}
                                  title={savedMsgIds[m.id] ? "Saved to insights" : "Save insight"}
                                  aria-label={savedMsgIds[m.id] ? "Saved to insights" : "Save insight"}
                                >
                                  {savedMsgIds[m.id] ? (
                                    <>
                                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                                      <span>Saved to insights</span>
                                    </>
                                  ) : (
                                    <>
                                      <Bookmark className="h-3.5 w-3.5 text-zinc-500" />
                                      <span>Save insight</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="workspace-message-body whitespace-pre-line"
                            style={m.text.includes("I found market intelligence reports from 2025") ? { color: "#64748b" } : undefined}
                          >
                            {m.attachments && m.attachments.length > 0 && (
                              <div className="workspace-message-attachments" aria-label="Attachments">
                                {m.attachments.map((att) => (
                                  <div key={att.id} className="workspace-attachment-chip">
                                    <div className="chatgpt-dock-attachment-icon-wrap">
                                      {att.type === "pdf" ? (
                                        <AdobeAcrobatPdfIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
                                      ) : att.type === "image" && att.previewUrl ? (
                                        <img src={att.previewUrl} alt={att.name} className="workspace-attachment-thumb" />
                                      ) : (
                                        <Paperclip className="h-5 w-5 text-zinc-500 flex-shrink-0" />
                                      )}
                                    </div>
                                    <div className="workspace-attachment-info">
                                      <span className="workspace-attachment-name">{att.name}</span>
                                      <span className="workspace-attachment-size">
                                        {att.type === "pdf" ? "PDF Document" : att.type === "image" ? "Image" : "File"} · {att.size}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            {isVoiceSummaryUserMsg ? (
                              <div className="workspace-voice-summary-bubble" role="region" aria-label="Voice input summary">
                                <div className="voice-summary-title">Expand into a new customer segment or region</div>
                                <div className="voice-summary-subtitle">Voice input:</div>
                                <ul className="voice-summary-list">
                                  <li><span className="voice-summary-bullet">•</span> <strong className="voice-summary-key">Goal:</strong> Expand into a new target market</li>
                                  <li><span className="voice-summary-bullet">•</span> <strong className="voice-summary-key">Industry:</strong> Beauty & personal care</li>
                                  <li><span className="voice-summary-bullet">•</span> <strong className="voice-summary-key">Market:</strong> India, Tier-2 & Tier-3 cities</li>
                                  <li><span className="voice-summary-bullet">•</span> <strong className="voice-summary-key">Audience:</strong> Urban working women aged 22–35</li>
                                  <li><span className="voice-summary-bullet">•</span> <strong className="voice-summary-key">Challenges:</strong> Unclear which cities, price points and channels to prioritise</li>
                                  <li><span className="voice-summary-bullet">•</span> <strong className="voice-summary-key">Outcomes:</strong> Prioritised city shortlist and go-to-market plan</li>
                                </ul>
                              </div>
                            ) : m.text ? (
                              <div>{m.text}</div>
                            ) : null}
                            {m.interactiveQuestion && (
                              <div className="agent-question-box" role="region" aria-label={m.interactiveQuestion.question}>
                                <div className="agent-question-header">
                                  <h3 className="agent-question-title">{m.interactiveQuestion.question}</h3>
                                </div>

                                <div
                                  className="ai-outcome-options-grid"
                                  role="radiogroup"
                                  aria-label={m.interactiveQuestion.question}
                                >
                                  {m.interactiveQuestion.options.map((opt) => {
                                    const isSelected =
                                      (m.interactiveQuestion?.answeredOption || selectedAgentOptions[m.id]) === opt;
                                    const isLocked = Boolean(m.interactiveQuestion?.answeredOption) || isThinking;

                                    return (
                                      <button
                                        key={opt}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        disabled={isLocked}
                                        onClick={() => {
                                          if (isLocked) return;
                                          setSelectedAgentOptions((prev) => ({ ...prev, [m.id]: opt }));
                                          handleAdvanceInteractiveQuestion(m, opt);
                                        }}
                                        className={`ai-outcome-option-btn ${isSelected ? "ai-outcome-option-btn--selected" : ""}`}
                                      >
                                        <div className="ai-outcome-option-content">
                                          <span
                                            className={`ai-outcome-radio ${isSelected ? "ai-outcome-radio--selected" : ""}`}
                                            aria-hidden="true"
                                          >
                                            {isSelected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                                          </span>
                                          <span className="ai-outcome-option-text">{opt}</span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                            {m.sender === "assistant" && !m.interactiveQuestion && (
                              <>
                                <div className="message-actions-row">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveInsight(m)}
                                    className={`save-insight-btn ${savedMsgIds[m.id] ? "saved" : ""}`}
                                    title={savedMsgIds[m.id] ? "Saved to insights" : "Save insight"}
                                    aria-label={savedMsgIds[m.id] ? "Saved to insights" : "Save insight"}
                                  >
                                    {savedMsgIds[m.id] ? (
                                      <>
                                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                                        <span>Saved to insights</span>
                                      </>
                                    ) : (
                                      <>
                                        <Bookmark className="h-3.5 w-3.5 text-zinc-500" />
                                        <span>Save insight</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                {(() => {
                                  const questions = getRelatedQuestions(m, project);
                                  const msgAgent =
                                    pinnedAgent ||
                                    (m.agentTitle
                                      ? [...projectRelatedAgents, ...otherWorkspaceAgents].find(
                                        (a) => a.title === m.agentTitle
                                      )
                                      : undefined);
                                  if (!questions || questions.length === 0) return null;
                                  return (
                                    <div className="message-related-actions" aria-label="Related actions">
                                      <div className="message-related-actions-header">
                                        <span className="message-related-actions-title">Related actions</span>
                                      </div>
                                      <div className="message-related-actions-list">
                                        {questions.map((question, qIdx) => (
                                          <button
                                            key={qIdx}
                                            type="button"
                                            onClick={() => handleSend(question, msgAgent)}
                                            className="message-related-action-btn"
                                            title={`Ask: ${question}`}
                                          >
                                            <Search className="message-related-action-icon" aria-hidden="true" />
                                            <span>{question}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })()}
                              </>
                            )}
                          </div>
                        )}


                      </div>
                    );
                  })}

                  {/* Dynamic thinking indicator when processing a query */}
                  {isThinking && (
                    <div className="workspace-message ai-message">
                      <div className="ai-thinking-row" role="status" aria-label={thinkingText.replace("...", "")}>
                        <div className="ai-thinking-spinner" aria-hidden="true">
                          <GradientRingSpinner />
                        </div>
                        <span className="ai-thinking-text">{thinkingText}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Dock (Only when conversation is active and not in voice mode) */}
        {!isVoiceActive && !isVisionModalOpen && (messages.length > 0 || isThinking) && !isLibraryOpen && !activeSidebarView ? (
          <div className="workspace-dock-wrapper bottom-dock-wrapper">
            {renderInputDock()}
          </div>
        ) : null}
      </div>

      {/* Right Side Slide-In Panel (Project Agents) */}
      {isAgentsDrawerOpen && (
        <aside
          className="workspace-agents-drawer"
          aria-label="Agents"
        >
          <div className="workspace-agents-inner">
            {/* Single Heading: Agents */}
            <div className="agents-panel-header">
              <div className="agents-panel-title-wrap">
                <h2 className="agents-panel-title">Agents</h2>
              </div>
            </div>

            {/* All Agents Stack */}
            <div className="agents-drawer-section">
              <div className="agents-cards-stack">
                {[...projectRelatedAgents, ...otherWorkspaceAgents].map((agent) => {
                  const isProjectAgent = projectRelatedAgents.some((pa) => pa.id === agent.id);
                  const isKyc = agent.id === "agent-sbi-kyc" || agent.title.includes("KYC");
                  const isInvoked = isAgentInvokedForRequest(agent.id);
                  const isSelected = pinnedAgent?.id === agent.id;
                  const showInvokedStatus = isSelected || isInvoked;

                  return (
                    <article
                      key={agent.id}
                      className={`agent-drawer-card ${isProjectAgent ? "agent-drawer-card--project" : "agent-drawer-card--other"} ${isSelected ? "agent-drawer-card--selected" : ""}`}
                      onClick={() => {
                        handleSelectAgentForChat(agent);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${isSelected ? "Unselect" : "Select"} ${agent.title}`}
                    >
                      <div className="agent-drawer-card-top">
                        <h4 className="agent-drawer-card-title">{agent.title}</h4>
                        <p className="agent-drawer-card-desc">{agent.description}</p>
                      </div>

                      {showInvokedStatus && (
                        <div className="agent-drawer-card-footer">
                          <span className="agent-drawer-invoked-status">
                            {isSelected ? "Invoked" : "Will be Invoked"}
                          </span>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Right Side Slide-In Panel (What I know so far / Knowledge Base) */}
      {isKnowledgeOpen && (
        <aside
          className="workspace-knowledge-drawer"
          aria-label="What I know so far"
        >
          <div className="workspace-knowledge-inner">
            {/* Header */}
            <div className="knowledge-panel-header">
              <h2 className="knowledge-panel-title">What I know so far</h2>
              <button
                type="button"
                onClick={() => setIsKnowledgeOpen(false)}
                className="knowledge-panel-close-btn"
                title="Close panel"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="knowledge-panel-status">Waiting on you</div>

            {/* Project score */}
            <div className="knowledge-panel-section">
              <div className="knowledge-section-title">Project score</div>
              <div className="knowledge-score-value">not scored yet</div>
              <p className="knowledge-score-hint">
                Still need: target date, delivery owner.
              </p>
              <div className="knowledge-divider" />
            </div>

            {/* Core facts known */}
            <div className="knowledge-panel-section">
              <div className="knowledge-section-title">Core facts known</div>
              <div className="knowledge-facts-progress">
                <div
                  className="knowledge-facts-bar"
                  style={{ width: `${(knownFactsCount / 6) * 100}%` }}
                />
              </div>
              <div className="knowledge-facts-sub">{knownFactsCount} of 6 core facts</div>
              <div className="knowledge-divider" />
            </div>

            {/* Still to learn */}
            <div className="knowledge-panel-section knowledge-still-section">
              <div className="knowledge-still-to-learn">
                <span className="knowledge-still-left">
                  <span>Still to learn</span>
                </span>
                <span className="knowledge-still-count">{stillToLearnCount}</span>
              </div>

              <div className="knowledge-still-list">
                <div className="knowledge-still-row">
                  <div className="knowledge-field-header">
                    <span className="knowledge-field-label">Goal</span>
                    <button
                      type="button"
                      onClick={(e) => e.preventDefault()}
                      className="knowledge-item-edit-btn"
                      title="Edit Goal"
                      aria-label="Edit Goal"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="knowledge-field-value">{projectScope.goal || "Not yet"}</div>
                  <div className="knowledge-divider" />
                </div>
                <div className="knowledge-still-row">
                  <div className="knowledge-field-header">
                    <span className="knowledge-field-label">Who it's for</span>
                    <button
                      type="button"
                      onClick={(e) => e.preventDefault()}
                      className="knowledge-item-edit-btn"
                      title="Edit Who it's for"
                      aria-label="Edit Who it's for"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="knowledge-field-value">{projectScope.whoItsFor || "Not yet"}</div>
                  <div className="knowledge-divider" />
                </div>
                <div className="knowledge-still-row">
                  <div className="knowledge-field-header">
                    <span className="knowledge-field-label">Investment</span>
                    <button
                      type="button"
                      onClick={(e) => e.preventDefault()}
                      className="knowledge-item-edit-btn"
                      title="Edit Investment"
                      aria-label="Edit Investment"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="knowledge-field-value">{projectScope.investment || "Not yet"}</div>
                  <div className="knowledge-divider" />
                </div>
                <div className="knowledge-still-row">
                  <div className="knowledge-field-header">
                    <span className="knowledge-field-label">Expected annual impact</span>
                    <button
                      type="button"
                      onClick={(e) => e.preventDefault()}
                      className="knowledge-item-edit-btn"
                      title="Edit Expected annual impact"
                      aria-label="Edit Expected annual impact"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="knowledge-field-value">{projectScope.annualImpact || "Not yet"}</div>
                  <div className="knowledge-divider" />
                </div>
                <div className="knowledge-still-row">
                  <div className="knowledge-field-header">
                    <span className="knowledge-field-label">Target date</span>
                    <button
                      type="button"
                      onClick={(e) => e.preventDefault()}
                      className="knowledge-item-edit-btn"
                      title="Edit Target date"
                      aria-label="Edit Target date"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="knowledge-field-value">{projectScope.targetDate || "Not yet"}</div>
                  <div className="knowledge-divider" />
                </div>
                <div className="knowledge-still-row">
                  <div className="knowledge-field-header">
                    <span className="knowledge-field-label">Delivery owner</span>
                    <button
                      type="button"
                      onClick={(e) => e.preventDefault()}
                      className="knowledge-item-edit-btn"
                      title="Edit Delivery owner"
                      aria-label="Edit Delivery owner"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="knowledge-field-value">{projectScope.deliveryOwner || "Not yet"}</div>
                  <div className="knowledge-divider" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}
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
    {
      id: "doc-3",
      name: "Customer_Passport_Front_Back.pdf",
      size: "2.1 MB",
      type: "application/pdf",
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleVerify = () => {
    if (documents.length === 0) {
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
                    : item === "Packages" || item === "Packs"
                      ? "#packages"
                      : "#settings"
                }
                onClick={(e) => {
                  if (item === "Home") {
                    e.preventDefault();
                    onBack();
                  } else {
                    e.preventDefault();
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
            >
              Log in
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Heading, shortened subline and unwrapped back navigation inline inside header */}
        <div className="aircond-header-bottom text-center">
          <div className="kyc-heading-inline-row">
            <button
              type="button"
              className="kyc-header-back-inline-btn"
              onClick={onBack}
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              <span>Back</span>
            </button>
            <h1 className="aircond-header-heading kyc-header-heading-inline">
              SBI Customer KYC & Document Verification
            </h1>
          </div>
          <p className="aircond-header-subline text-center">
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
              {documents.map((doc, idx) => (
                <div
                  key={doc.id}
                  className={`kyc-doc-item ${idx === 2 ? "kyc-doc-item-bottom" : ""}`}
                >
                  <div className="kyc-doc-info">
                    <AdobeAcrobatPdfIcon className="kyc-doc-acrobat-icon" />
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

function CreateAgentPage({ onBack, onCreateAgent, initialData, isEdit }: CreateAgentPageProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(initialData?.name || "");
  const [role, setRole] = useState(initialData?.role || "");
  const [primaryGoal, setPrimaryGoal] = useState(initialData?.goal || "");
  const [projectContext, setProjectContext] = useState(initialData?.context || "");
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
    if (!name.trim() || !role.trim()) {
      return;
    }
    setCurrentStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
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
              if (name.trim() && role.trim()) {
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
              if (name.trim() && role.trim()) {
                setCurrentStep(3);
              }
            }}
            className={`dark-step-pill ${currentStep === 3 ? "active" : ""}`}
          >
            <span className="dark-step-circle">3</span>
            <span className="dark-step-title">Review & Submit</span>
          </button>
        </nav>

        {/* Main Title & Subtitle */}
        <div className="dark-agent-header-text">
          <h1 className="dark-agent-heading">
            {currentStep === 1 && (isEdit ? "Edit your agent" : "Create your agent")}
            {currentStep === 2 && "Configure capabilities"}
            {currentStep === 3 && (isEdit ? "Review & save instructions" : "Review & launch instructions")}
          </h1>
          <p className="dark-agent-subheading">
            {currentStep === 1 && "Create more agents or coordinate collaborative workflows."}
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

interface PackagesPageProps {
  projects: ProjectItem[];
  onBack: () => void;
  onSelectProject: (id: string) => void;
}

function PackagesPage({ projects, onBack, onSelectProject }: PackagesPageProps) {
  const totalPackages = 4;
  const lastDateAcquired = "June 2026";

  return (
    <main className="packages-page min-h-screen bg-background text-foreground">
      {/* Black header matching home page with logo and nav */}
      <header className="aircond-header mx-auto flex flex-col">
        <div className="aircond-header-top flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="aircond-wordmark bg-transparent border-0 p-0 cursor-pointer"
            aria-label="Return to Dashboard"
          >
            <img
              src={frostAtlasLogo}
              alt="Frost Atlas"
              className="aircond-logo-img"
            />
          </button>
          <nav className="aircond-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item}
                href={
                  item === "Home"
                    ? "#top"
                    : item === "Packages" || item === "Packs"
                      ? "#packages"
                      : "#settings"
                }
                className={`aircond-nav-link ${item === "Packages" || item === "Packs" ? "active" : ""}`}
                onClick={(e) => {
                  if (item === "Home") {
                    e.preventDefault();
                    onBack();
                  } else {
                    e.preventDefault();
                  }
                }}
              >
                {item}
              </a>
            ))}
          </nav>
          <Button className="aircond-login" asChild>
            <a href="#solutions">
              Log in <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
          <Button
            className="aircond-mobile-menu"
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            onClick={onBack}
          >
            <Menu aria-hidden="true" />
          </Button>
        </div>
        <div className="aircond-header-bottom text-center">
          <h1 className="aircond-header-heading">
            Research &amp; Knowledge Packs
          </h1>
          <p className="aircond-header-subline">
            Curated research packs and verified market intelligence.
          </p>
        </div>
      </header>

      {/* Overlapping Stylish Single UI Card for Packages */}
      <section className="packages-overview-section">
        <div className="packages-overview-card">
          <div className="packages-overview-top-row">
            <div className="packages-overview-meta-left">
              <h2 className="packages-overview-headline">Acquired Research Packs</h2>
            </div>
            <div className="packages-overview-meta-right">
              <span className="packages-last-update-text">
                Last acquired: {lastDateAcquired}
              </span>
            </div>
          </div>

          <div className="packages-metrics-grid">
            <div className="packages-metric-col">
              <div className="packages-metric-value">{totalPackages}</div>
              <div className="packages-metric-label">Packs Acquired</div>
            </div>
            <div className="packages-metric-col">
              <div className="packages-metric-value">10</div>
              <div className="packages-metric-label">Validated Reports</div>
            </div>
            <div className="packages-metric-col">
              <div className="packages-metric-value">{defaultProjectPackages.length}</div>
              <div className="packages-metric-label">Connected Projects</div>
            </div>
          </div>
        </div>
      </section>

      {/* Project-Wise Packages Sections Below */}
      <section className="packages-projects-flow">
        <div className="packages-projects-list">
          {defaultProjectPackages.map((group) => (
            <div key={group.projectId} className="packages-project-group-card">
              <div className="packages-project-group-header">
                <div className="packages-project-title-row">
                  <h4 className="packages-project-title">{group.projectTitle}</h4>
                </div>
              </div>

              <div className="packages-cards-grid">
                {group.packages.map((pack) => (
                  <article key={pack.id} className="packages-item-card">
                    <div className="packages-item-header">
                      <h5 className="packages-item-title">{pack.title}</h5>
                    </div>

                    <div className="packages-item-divider" />

                    <div className="packages-item-files-list">
                      {pack.files.map((file, fIdx) => (
                        <div key={fIdx} className="packages-file-row">
                          <AdobeAcrobatPdfIcon className="ai-pack-pdf-icon shrink-0" />
                          <div className="packages-file-info">
                            <span className="packages-file-title">
                              {file.title} <span className="packages-file-date">- {file.date}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="packages-item-footer">
                      <button
                        type="button"
                        className="packages-download-all-btn"
                        title={`Download all reports in ${pack.title}`}
                      >
                        Download all
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Index() {
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
  const [isPackagesView, setIsPackagesView] = useState(false);
  const [isLibraryView, setIsLibraryView] = useState(false);
  const [expandedBadges, setExpandedBadges] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.hash === "#packages") {
        setIsPackagesView(true);
      }
      const handleHashChange = () => {
        if (window.location.hash === "#packages") {
          setIsPackagesView(true);
        }
      };
      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, []);

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

  if (isLibraryView) {
    return (
      <LibraryPage
        onBack={() => setIsLibraryView(false)}
      />
    );
  }

  if (isPackagesView) {
    return (
      <PackagesPage
        projects={projects}
        onBack={() => {
          setIsPackagesView(false);
          if (typeof window !== "undefined" && window.location.hash === "#packages") {
            window.location.hash = "#top";
          }
        }}
        onSelectProject={(id) => {
          setIsPackagesView(false);
          setActiveProjectId(id);
        }}
      />
    );
  }

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
            } else {
              setAgentsCount((prev) => prev + 1);
            }
            setIsCreateAgentView(false);
            setEditingAgent(null);
          }}
        />
      </>
    );
  }

  if (isKycVerificationView) {
    return (
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
              title: "Customer Persona & Demographic Intelligence Agent",
              description:
                "Analyzes customer demographic cohorts, regional purchasing patterns, and buyer persona profiles across secondary urban corridors.",
              agents: ["Customer Persona Specialist", "Demographic Analyst"],
              url: "#agent-sbi-kyc",
            };
            setProjects((prev) => [newKycProject, ...prev]);
            setActiveProjectId("agent-sbi-kyc");
          }
        }}
      />
    );
  }

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0];

  if (activeProjectId && activeProject) {
    return (
      <ProjectWorkspace
        project={activeProject}
        projects={projects}
        agents={agents}
        onSelectProject={(id) => setActiveProjectId(id)}
        onBackToDashboard={() => setActiveProjectId(null)}
        onEditAgent={(agent) => {
          setActiveProjectId(null);
          setEditingAgent(agent);
          setIsCreateAgentView(true);
        }}
        onOpenKyc={() => {
          setIsKycVerificationView(true);
        }}
        onOpenLibrary={() => {
          setActiveProjectId(null);
          setIsLibraryView(true);
        }}
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
        }}
      />
    );
  }

  const handleCreateProject = () => {
    const newId = `new-project-${Date.now()}`;
    const newProject: ProjectItem = {
      id: newId,
      title: "Untitled project",
      description: "Define goals, collaborative agents, and milestones for your new initiative.",
      agents: ["Autonomous Agent"],
      url: `#${newId}`,
    };
    setProjects((prev) => [newProject, ...prev]);
    setProjectsCount((prev) => prev + 1);
    setActiveProjectId(newId);
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
                    : item === "Packages" || item === "Packs"
                      ? "#packages"
                      : "#settings"
                }
                onClick={(e) => {
                  if (item === "Packages" || item === "Packs") {
                    e.preventDefault();
                    setIsPackagesView(true);
                  } else if (item !== "Home") {
                    e.preventDefault();
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

            <Button
              type="button"
              onClick={handleCreateProject}
              className="tile-action-btn"
            >
              Create Project
              <ArrowUpRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Button>
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
    </main>
  );
}