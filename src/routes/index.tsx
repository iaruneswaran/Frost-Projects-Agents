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
  Brain,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Clock3,
  Download,
  FileSpreadsheet,
  Folder,
  Library,
  Menu,
  Mic,
  Moon,
  PanelLeft,
  Paperclip,
  Pencil,
  Pin,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  SquarePen,
  Sun,
  Trash2,
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

interface MessageItem {
  id: string;
  sender: "user" | "assistant";
  text: string;
}

export interface ReportFlowState {
  activeAgentId: string | null;
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
  files: KnowledgePackFile[];
}

export const defaultKnowledgePacks: KnowledgePack[] = [
  {
    id: "pack-south-asia-entry",
    title: "South Asia Tier-2 & Tier-3 City Market Penetration",
    subtitle: "City selection, price points and channels for smaller-city growth.",
    tag: "Personal care brand enters South Asia’s smaller cities · 3 files",
    filesCount: 3,
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
    tags: ["tier-2 retail", "consumer growth", "market penetration", "regional strategy"],
  },
  {
    id: "rep-price-point",
    title: "Price-Point & Pack-Size Strategy for Mass-Premium Skincare in Emerging South Asian Markets",
    author: "Anika Rao",
    year: "2025",
    summary: "Price elasticity analysis, sachet trial economics, and mass-premium threshold benchmarks across emerging city retail channels.",
    quote: "“Finds ₹299–₹449 discovery packs and trial kits generate 2.8x higher repeat adoption than standard full-size SKUs in smaller cities.”",
    tags: ["pricing strategy", "unit economics", "pack sizes", "price elasticity"],
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

const navItems = ["Home", "Packages", "Settings"];

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

const initialProjectConversations: Record<string, MessageItem[]> = {
  "personal-care-south-asia": [
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
  ],
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

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"];
  const distributedData = [8200,10400,12600,15800,18200,20100,22400,24100,25800,26900,28500];
  const repeatData =       [1200, 2100, 3600, 5200, 7400, 9800,12200,14600,17100,19800,22600];
  const maxBar = 32000;
  const barW = 18;
  const gap = 8;
  const svgW = months.length * (barW * 2 + gap + 6) + 48;
  const svgH = 180;
  const plotH = 130;
  const plotTop = 16;

  const areaYears = [2021,2022,2023,2024,2025,2026];
  const repeatSeries = [22000,38000,54000,78000,105000,142850];
  const initSeries =   [45000,70000,95000,118000,133000,150000];
  const maxArea = 160000;
  const areaSvgW = 440;
  const areaSvgH = 170;
  const areaPlotH = 120;
  const areaPlotTop = 16;
  const areaPlotLeft = 56;
  const areaPlotW = areaSvgW - areaPlotLeft - 16;

  function areaX(i: number) { return areaPlotLeft + (i / (areaYears.length - 1)) * areaPlotW; }
  function areaY(v: number) { return areaPlotTop + areaPlotH - (v / maxArea) * areaPlotH; }
  function polyline(series: number[]) { return series.map((v,i)=>`${areaX(i)},${areaY(v)}`).join(" "); }

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

      <div className="lib-report-metrics-row">
        {report.metrics.map((m, i) => (
          <div key={i} className="lib-report-metric">
            <span className="lib-report-metric-value">{m.value}</span>
            <span className="lib-report-metric-label">{m.label}</span>
            {m.delta && <span className="lib-report-metric-delta">{m.delta}</span>}
          </div>
        ))}
      </div>

      {expanded && (
        <div className="lib-report-expanded">
          <div className="lib-report-expanded-inner">
            {/* Expanded Action Buttons */}
            <div className="lib-report-expanded-actions">
              <button
                type="button"
                className="lib-btn-primary"
                onClick={() => {}}
              >
                <Download className="h-4 w-4 mr-1.5" />
                <span>Download Report (PDF)</span>
              </button>
              <button
                type="button"
                className="lib-btn-secondary"
                onClick={() => {}}
              >
                <span>Export CSV</span>
              </button>
            </div>

            {/* Bar Chart */}
            <div className="lib-expanded-panel">
              <div className="lib-panel-header">
                <span className="lib-panel-title">Monthly Trial Kit Distribution & Conversion Velocity</span>
                <div className="lib-legend-row">
                  <span className="lib-legend-dot" style={{background:"#111827"}} />
                  <span className="lib-legend-text">Distributed Samples</span>
                  <span className="lib-legend-dot" style={{background:"#d1d5db"}} />
                  <span className="lib-legend-text">Repeat Purchases</span>
                </div>
              </div>
              <div className="lib-svg-scroll">
                <svg width={svgW} height={svgH} aria-label="Monthly distribution bar chart">
                  {[0,10000,20000,30000].map((v) => {
                    const y = plotTop + plotH - (v / maxBar) * plotH;
                    return (
                      <g key={v}>
                        <line x1={40} x2={svgW - 4} y1={y} y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
                        <text x={36} y={y + 4} textAnchor="end" fontSize={14} fill="#9ca3af">{v === 0 ? "0" : `${v/1000}k`}</text>
                      </g>
                    );
                  })}
                  {months.map((mo, i) => {
                    const x = 44 + i * (barW * 2 + gap + 6);
                    const hD = (distributedData[i] / maxBar) * plotH;
                    const hR = (repeatData[i] / maxBar) * plotH;
                    return (
                      <g key={mo}>
                        <rect x={x} y={plotTop + plotH - hD} width={barW} height={hD} rx={3} fill="#111827" />
                        <rect x={x + barW + 2} y={plotTop + plotH - hR} width={barW} height={hR} rx={3} fill="#d1d5db" />
                        <text x={x + barW} y={plotTop + plotH + 14} textAnchor="middle" fontSize={14} fill="#9ca3af">{mo}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Bottom two panels */}
            <div className="lib-bottom-grid">
              {/* Donut */}
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
                    <text x={70} y={82} textAnchor="middle" fontSize={14} fill="#6b7280">Total</text>
                  </svg>
                  <div className="lib-donut-legend">
                    {[
                      {label:"Mass-Premium",pct:"58%",color:"#111827"},
                      {label:"Young Urban",pct:"28%",color:"#374151"},
                      {label:"Value-Conscious",pct:"9%",color:"#9ca3af"},
                      {label:"Tier-3 Adopters",pct:"5%",color:"#d1d5db"},
                    ].map((s) => (
                      <div key={s.label} className="lib-donut-legend-row">
                        <span className="lib-donut-swatch" style={{background:s.color}} />
                        <span className="lib-donut-label">{s.label}</span>
                        <span className="lib-donut-pct">{s.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Area chart */}
              <div className="lib-expanded-panel">
                <div className="lib-panel-header">
                  <span className="lib-panel-title">Regional sales velocity & market penetration over time</span>
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
                  {[0,50000,100000,150000].map((v)=>{
                    const y = areaY(v);
                    return (
                      <g key={v}>
                        <line x1={areaPlotLeft} x2={areaSvgW-8} y1={y} y2={y} stroke="rgba(0,0,0,0.06)" strokeWidth={1}/>
                        <text x={areaPlotLeft-4} y={y+4} textAnchor="end" fontSize={14} fill="#9ca3af">{v===0?"0":`${v/1000}k`}</text>
                      </g>
                    );
                  })}
                  {areaYears.map((yr,i)=>(
                    <text key={yr} x={areaX(i)} y={areaSvgH-4} textAnchor="middle" fontSize={14} fill="#9ca3af">{yr}</text>
                  ))}
                  <polygon points={`${areaPlotLeft},${areaY(0)} ${polyline(initSeries)} ${areaX(areaYears.length-1)},${areaY(0)}`} fill="url(#libAreaGrad2)" />
                  <polyline points={polyline(initSeries)} fill="none" stroke="#9ca3af" strokeWidth={2} />
                  <polygon points={`${areaPlotLeft},${areaY(0)} ${polyline(repeatSeries)} ${areaX(areaYears.length-1)},${areaY(0)}`} fill="url(#libAreaGrad1)" />
                  <polyline points={polyline(repeatSeries)} fill="none" stroke="#111827" strokeWidth={2.5} />
                </svg>
                <div className="lib-area-legend">
                  <span className="lib-legend-dot" style={{background:"#111827"}}/>
                  <span className="lib-legend-text">Repeat Retail Purchases</span>
                  <span className="lib-legend-dot" style={{background:"#9ca3af"}}/>
                  <span className="lib-legend-text">Initial Sampling Inflow</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="lib-expanded-panel">
              <div className="lib-panel-header">
                <span className="lib-panel-title">Channel Distribution Velocity & Retail Network Breakdown</span>
              </div>
              <div className="lib-table-wrap">
                <table className="lib-table">
                  <thead>
                    <tr>
                      {["Distribution Channel","Network Infrastructure","Target Cohort","Velocity Confidence","Strategic Viability"].map(h=>(
                        <th key={h} className="lib-th">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Traditional Kirana & General Trade","Secondary City FMCG Wholesale Distributors","Value-Conscious Households","99.8%","Priority Expansion"],
                      ["Quick Commerce & Modern Trade","Blinkit / Zepto / Regional Fulfillment Hubs","Young Urban Skincare Adopters","99.9%","High Velocity"],
                      ["Pharmacy & Dermatologist Corridors","Apollo / MedPlus Regional Outlets","Aspirational Mass-Premium","99.6%","High Margin Anchor"],
                      ["Omnichannel Trial Kits & D2C","Direct Logistics & Regional Pop-Up Sampling","Digital-First Skincare Switchers","99.4%","Validated Driver"],
                      ["Total Market Synthesis","4 Strategic Retail Channels","Pan-South Asia Secondary Urban","99.8% Overall","100% Market Alignment"],
                    ].map((row,ri)=>(
                      <tr key={ri} className={ri===4?"lib-tr-total":""}>
                        {row.map((cell,ci)=><td key={ci} className="lib-td">{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
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

  const [selectedChat, setSelectedChat] = useState<string>(
    isNewProject ? "New chat" : project.title
  );
  const [selectedChatKey, setSelectedChatKey] = useState<string>(
    isNewProject ? "new-chat" : project.id
  );
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(project.id || null);
  const [searchFilter, setSearchFilter] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [customOutcome, setCustomOutcome] = useState("");
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const [isAgentsDrawerOpen, setIsAgentsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryTab, setLibraryTab] = useState<"reports" | "packages">("reports");
  const [obtainedPacks, setObtainedPacks] = useState<Record<string, boolean>>({});
  const [obtainedReports, setObtainedReports] = useState<Record<string, boolean>>({});
  const [generatingAgentId, setGeneratingAgentId] = useState<string | null>(null);
  const [generatedAgents, setGeneratedAgents] = useState<Record<string, boolean>>({});
  const [activeReportAgentId, setActiveReportAgentId] = useState<string | null>(null);
  const [downloadedReportId, setDownloadedReportId] = useState<string | null>(null);
  const [reportFlows, setReportFlows] = useState<Record<string, ReportFlowState>>({});
  const dockFileInputRef = useRef<HTMLInputElement>(null);

  const projectRelatedAgents = useMemo(() => getProjectRelatedAgents(project), [project]);
  const otherWorkspaceAgents = useMemo(
    () =>
      (agents && agents.length > 0 ? agents : initialAgents).filter(
        (a) => !a.id.startsWith("proj-agent-")
      ),
    [agents]
  );

  const handleTogglePack = (packId: string) => {
    setObtainedPacks((prev) => ({
      ...prev,
      [packId]: !prev[packId],
    }));
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
      return {
        ...prev,
        [msgId]: {
          ...current,
          activeAgentId: agentId,
          isAgent2Active: true,
        },
      };
    });
  };

  const handleRunBothAgents = (msgId: string) => {
    setReportFlows((prev) => {
      const current = prev[msgId] || { ...defaultReportFlowState };
      const suggested = projectRelatedAgents.slice(0, 2);
      return {
        ...prev,
        [msgId]: {
          ...current,
          activeAgentId: suggested[0]?.id || "agent-1",
          isAgent2Active: true,
        },
      };
    });
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

  const handleGenerateReport = (msgId: string) => {
    setReportFlows((prev) => {
      const current = prev[msgId] || { ...defaultReportFlowState };
      return {
        ...prev,
        [msgId]: {
          ...current,
          isReportGenerated: true,
        },
      };
    });
  };

  const handleGenerateWithAgent = (agent: AgentItem) => {
    setGeneratingAgentId(agent.id);

    setTimeout(() => {
      setGeneratingAgentId(null);
      setGeneratedAgents((prev) => ({ ...prev, [agent.id]: true }));
      setActiveReportAgentId(agent.id);

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
    }, 400);
  };

  const renderAgentReport = (agentId: string) => {
    const isHomeLoan = agentId === "agent-sbi-home-loan" || agentId.includes("home-loan") || agentId.includes("Home Loan");
    const hasMultipleGenerated = !!(generatedAgents["agent-sbi-home-loan"] && generatedAgents["agent-sbi-kyc"]);

    if (isHomeLoan) {
      return (
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
              {hasMultipleGenerated && (
                <div className="agent-report-tab-switch" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeReportAgentId === "agent-sbi-home-loan"}
                    className={`agent-report-tab-btn ${activeReportAgentId === "agent-sbi-home-loan" ? "active" : ""}`}
                    onClick={() => setActiveReportAgentId("agent-sbi-home-loan")}
                  >
                    Home Loan Report
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeReportAgentId === "agent-sbi-kyc"}
                    className={`agent-report-tab-btn ${activeReportAgentId === "agent-sbi-kyc" ? "active" : ""}`}
                    onClick={() => setActiveReportAgentId("agent-sbi-kyc")}
                  >
                    South Asia Market Report
                  </button>
                </div>
              )}
              <button
                type="button"
                className="agent-report-download-btn"
                onClick={() => setDownloadedReportId("home-loan")}
                title="Download complete compliance report in PDF"
              >
                <Download className="h-4 w-4" />
                <span>{downloadedReportId === "home-loan" ? "Downloaded" : "Download Report (PDF)"}</span>
              </button>
              <button
                type="button"
                className="agent-report-export-btn"
                onClick={() => setDownloadedReportId("home-loan-csv")}
                title="Export raw disbursement dataset as CSV"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export CSV</span>
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
      );
    }

    // Otherwise Market Intelligence Report for Personal Care Brand
    return (
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
            {hasMultipleGenerated && (
              <div className="agent-report-tab-switch" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeReportAgentId === "agent-sbi-home-loan"}
                  className={`agent-report-tab-btn ${activeReportAgentId === "agent-sbi-home-loan" ? "active" : ""}`}
                  onClick={() => setActiveReportAgentId("agent-sbi-home-loan")}
                >
                  Home Loan Report
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeReportAgentId === "agent-sbi-kyc"}
                  className={`agent-report-tab-btn ${activeReportAgentId === "agent-sbi-kyc" ? "active" : ""}`}
                  onClick={() => setActiveReportAgentId("agent-sbi-kyc")}
                >
                  South Asia Market Report
                </button>
              </div>
            )}
            <button
              type="button"
              className="agent-report-download-btn"
              onClick={() => setDownloadedReportId("kyc")}
              title="Download market entry report in PDF"
            >
              <Download className="h-4 w-4" />
              <span>{downloadedReportId === "kyc" ? "Downloaded" : "Download Report (PDF)"}</span>
            </button>
            <button
              type="button"
              className="agent-report-export-btn"
              onClick={() => setDownloadedReportId("kyc-csv")}
              title="Export secondary market entry dataset as CSV"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export CSV</span>
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

        {/* Regulatory Governance Box */}
        <div className="agent-report-audit-card openui-audit-card">
          <h4 className="openui-audit-heading">Regional Market Entry & Product Formulation Governance</h4>
          <div className="agent-audit-grid">
            <div className="agent-audit-item">
              <span className="agent-audit-label">Climate-Adaptive Skincare & Regional Formulation Fit</span>
              <p className="agent-audit-desc">
                Formulations engineered specifically for South Asian seasonal heat, monsoon humidity, and UV exposure. Prioritizes lightweight gel-creams and skin barrier ceramides over heavy occlusives to match regional cleansing rituals.
              </p>
            </div>
            <div className="agent-audit-item">
              <span className="agent-audit-label">Retail Price Elasticity & Pack Sizing Governance</span>
              <p className="agent-audit-desc">
                Dual-tier pack architecture implemented: entry-level 30ml trial formats at ₹199–₹249 and 100ml core SKUs at ₹399–₹449. Mitigates trial friction while protecting distributor margins across Tier-2 and Tier-3 Kirana corridors.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const currentChatKey = selectedChatKey === "new-chat" ? `new-chat-${project.id}` : selectedChatKey;
  const messages = conversations[currentChatKey] || [];

  const handleDockFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileNames = Array.from(files).map((f) => f.name).join(", ");
    handleSend(`Attached file: ${fileNames}`);
    if (dockFileInputRef.current) dockFileInputRef.current.value = "";
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

  const handleNewChat = () => {
    setIsLibraryOpen(false);
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

  const handleSend = (presetText?: string) => {
    const text = (presetText || inputValue).trim();
    if (!text) return;

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
    };
    setConversations((prev) => ({
      ...prev,
      [currentChatKey]: [...(prev[currentChatKey] || []), userMessage],
    }));
    setInputValue("");

    setTimeout(() => {
      const isReportQuery =
        text.toLowerCase().includes("report") ||
        (selectedChat === "New chat" &&
          !text.toLowerCase().includes("define the idea") &&
          !text.toLowerCase().includes("attach a plan") &&
          !text.toLowerCase().includes("diwali") &&
          !text.includes("Expand into") &&
          !text.includes("Launch a new AI product") &&
          !text.includes("Automate") &&
          !text.includes("Accelerate enterprise"));

      if (isReportQuery) {
        const flowId = `ai-flow-${Date.now()}`;
        const aiMessage: MessageItem = {
          id: flowId,
          sender: "assistant",
          text: `To complete this report for **${project.title}**, I've assembled two specialized agents to synthesize the market intelligence. Select an agent to begin configuration:`,
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
      if (
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
    }, 500);
  };

  const renderInputDock = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      className="chatgpt-input-dock"
    >
      <button
        type="button"
        onClick={() => handleSend("Attach a plan")}
        className="chatgpt-dock-add-btn"
        title="Add file or actions"
        aria-label="Add file or actions"
      >
        <Plus className="h-5 w-5" />
      </button>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Reply, attach a file, or tap the mic to talk"
        className="chatgpt-dock-input"
      />

      <div className="chatgpt-dock-right-actions">
        <input
          type="file"
          ref={dockFileInputRef}
          onChange={handleDockFileUpload}
          className="hidden"
          aria-label="Upload file"
        />
        <button
          type="button"
          onClick={() => dockFileInputRef.current?.click()}
          className="chatgpt-dock-attach-btn"
          title="Attach file"
          aria-label="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        {inputValue.trim() ? (
          <button
            type="submit"
            className="chatgpt-dock-send-btn"
            title="Send message"
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSend("Voice mode started")}
            className="chatgpt-dock-voice-btn"
            title="Start voice mode"
            aria-label="Start voice mode"
          >
            <AudioLines className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
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
            className={`chatgpt-new-chat-btn ${selectedChat === "New chat" ? "active" : ""}`}
          >
            <SquarePen className="h-4 w-4 shrink-0 text-zinc-800" />
            <span>New chat</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsLibraryOpen(true); setIsKnowledgeOpen(false); setIsAgentsDrawerOpen(false); }}
            className={`chatgpt-sidebar-nav-btn ${isLibraryOpen ? "active" : ""}`}
          >
            <Library className="h-4 w-4 shrink-0 text-zinc-600" />
            <span>Library</span>
          </button>
        </div>

        {/* Scrollable Chats List */}
        <div className="chatgpt-sidebar-scroll">
          {/* Projects Section */}
          <div className="chatgpt-section-label">Projects</div>
          <div className="chatgpt-chats-list">
            {sidebarProjects
              .filter((p) => {
                if (!searchFilter.trim()) return true;
                const query = searchFilter.toLowerCase();
                const titleMatch = p.title.toLowerCase().includes(query);
                const subchats = projectChats[p.id] || [];
                return titleMatch || subchats.some((sc) => sc.title.toLowerCase().includes(query));
              })
              .map((p) => {
                const isCurrentProject = p.id === project.id;
                const isExpanded = expandedProjectId === p.id;
                const subchats = projectChats[p.id] || [];
                const isFolderActive = isCurrentProject;

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
                      }}
                      className={`chatgpt-folder-row ${isFolderActive ? "active" : ""}`}
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
                                setSelectedChat(subchat.title);
                                setSelectedChatKey(subchat.id);
                                if (subchat.title === "New chat") {
                                  setIsAgentsDrawerOpen(true);
                                  setIsKnowledgeOpen(false);
                                } else {
                                  setIsAgentsDrawerOpen(false);
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
            <span className="chatgpt-topbar-project-title">
              {isLibraryOpen ? "Library" : isNewProject && (project.title === "New project" || !project.title) ? "Untitled project" : (project.title || "Untitled project")}
            </span>
          </div>

          <div className="chatgpt-topbar-right">
            {!isKnowledgeOpen && !isLibraryOpen && (
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
          </div>
        </header>

        {/* Center Canvas */}
        <div className={`workspace-canvas ${isLibraryOpen ? "is-library-canvas" : messages.length > 0 ? "has-messages" : "is-empty-canvas"}`}>
          {isLibraryOpen ? (
            <div className="workspace-library-container">
              {/* Top switcher row */}
              <div className="workspace-library-header">
                <div className="workspace-library-tabs" role="tablist" aria-label="Library tabs">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={libraryTab === "reports"}
                    className={`workspace-library-tab-btn ${libraryTab === "reports" ? "active" : ""}`}
                    onClick={() => setLibraryTab("reports")}
                  >
                    Reports
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={libraryTab === "packages"}
                    className={`workspace-library-tab-btn ${libraryTab === "packages" ? "active" : ""}`}
                    onClick={() => setLibraryTab("packages")}
                  >
                    Packages
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="workspace-library-body">
                {libraryTab === "reports" && (
                  <div className="lib-projects-list">
                    {Object.entries(reportsByProject).map(([pId, reports]) => (
                      <div key={pId} className="lib-project-group">
                        <div className="lib-project-group-header">
                          <h3 className="lib-project-group-title">{reports[0].projectTitle}</h3>
                        </div>
                        <div className="lib-reports-grid">
                          {reports.map((report) => (
                            <LibraryReportCard key={report.id} report={report} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {libraryTab === "packages" && (
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
                                <button type="button" className="packages-download-all-btn">
                                  Download all
                                </button>
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
          {messages.length === 0 && (
            <div className="chatgpt-center-card">
              {isNewProject ? (
                <>
                  <h1 className="chatgpt-greeting">Hey Arun, what project is on your mind?</h1>
                  <p className="chatgpt-context-sub">
                    Tell me what you'd like to build, and we'll assemble the right agents.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="chatgpt-greeting">Hey Arun, What is this project about?</h1>
                  <p className="chatgpt-context-sub">What outcome would make this project worthwhile?</p>
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
                  onClick={() => handleSend("Attach a plan")}
                  className="workspace-btn-secondary"
                >
                  <Paperclip className="h-4 w-4" />
                  <span>Attach a plan</span>
                </button>
              </div>

              {/* Center Input Dock */}
              <div className="workspace-dock-wrapper center-dock-wrapper">
                {renderInputDock()}
              </div>
            </div>
          )}

          {/* Messages Thread if Any */}
          {messages.length > 0 && (
            <div className="workspace-conversation">
              {messages.map((m) => {
                const isOutcomeMessage =
                  m.sender === "assistant" &&
                  m.text.includes("What primary outcome do you want to achieve");

                const isReportFlowMsg =
                  m.sender === "assistant" &&
                  (m.id.startsWith("ai-flow-") ||
                    m.text.includes("assembled two specialized agents") ||
                    m.text.includes("Select an agent to begin configuration"));

                const isKnowledgePackMsg =
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
                  m.sender === "assistant" &&
                  (m.text.includes("Let's define the scope") ||
                    m.text.includes("Target Market & Audience") ||
                    m.text.includes("Success Criteria") ||
                    m.text.includes("primary goal"));

                return (
                  <div
                    key={m.id}
                    className={`workspace-message ${m.sender === "user" ? "user-message" : "ai-message"}`}
                  >
                    {isOutcomeMessage ? (
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
                            <div className="ai-intake-card">
                              {isDefineObjective ? (
                                <p
                                  className="ai-intake-text"
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: 500,
                                    color: "var(--aircond-ink, #111c1d)",
                                    margin: 0,
                                    lineHeight: 1.6,
                                  }}
                                >
                                  Let's define the core objective of this project to start building the business case.
                                </p>
                              ) : (
                                <>
                                  <h4 className="ai-intake-title">
                                    Project brief confirmed, Arun
                                  </h4>
                                  <p className="ai-intake-text">
                                    We've received your project brief for "{project.title}". Autonomous collaborative agents are ready to coordinate market dynamics, unit economics, and execution milestones. To configure the optimal agent workflow, let's establish your direction:
                                  </p>
                                </>
                              )}
                            </div>

                            {/* Outcome Choice Box */}
                            <div className="ai-stroke-box">
                              <div className="ai-outcome-container">
                                <h3 className="ai-outcome-question">
                                  What primary outcome do you want to achieve with this project?
                                </h3>

                                <div className="ai-outcome-options-grid">
                                  {outcomeOptions.map((opt) => (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() => handleSend(opt)}
                                      className="ai-outcome-option-btn"
                                    >
                                      <span className="ai-outcome-option-text">{opt}</span>
                                      <ArrowUpRight className="ai-outcome-option-arrow" />
                                    </button>
                                  ))}
                                </div>

                                <div className="ai-outcome-divider-row">
                                  <div className="ai-outcome-divider-line" />
                                  <span className="ai-outcome-footer-label">Or in your own words</span>
                                  <div className="ai-outcome-divider-line" />
                                </div>

                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    if (customOutcome.trim()) {
                                      handleSend(customOutcome.trim());
                                      setCustomOutcome("");
                                    }
                                  }}
                                  className="ai-outcome-input-form"
                                >
                                  <input
                                    type="text"
                                    value={customOutcome}
                                    onChange={(e) => setCustomOutcome(e.target.value)}
                                    placeholder="Type your answer and press Enter"
                                    className="ai-outcome-input-field"
                                    aria-label="Type your answer and press Enter"
                                  />
                                  <span className="sr-only">Type your answer and press Enter</span>
                                  <button
                                    type="submit"
                                    disabled={!customOutcome.trim()}
                                    className="ai-outcome-submit-btn"
                                    aria-label="Submit answer"
                                    title="Send"
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </button>
                                </form>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    ) : isReportFlowMsg ? (
                      <div className="report-flow-container">
                        {/* Unified Card Box wrapping intro prompt and the 2 agents */}
                        <div className="report-flow-box">
                          <p className="report-flow-box-prompt">
                            To complete this report for <strong>{project.title}</strong>, I've assembled two specialized agents to synthesize the market intelligence. Select an agent to begin configuration:
                          </p>

                          <h3 className="report-flow-box-heading">Suggested Agents</h3>

                          <div className="report-flow-box-agents-grid">
                            {projectRelatedAgents.slice(0, 2).map((agent) => {
                              const currentFlow = reportFlows[m.id] || { ...defaultReportFlowState };
                              const isRunning = Boolean(currentFlow.activeAgentId);

                              return (
                                <div
                                  key={agent.id}
                                  className={`report-flow-box-agent-item report-flow-agent-card ${isRunning ? "report-flow-box-agent-item--active report-flow-agent-card--active" : ""}`}
                                  onClick={() => handleRunBothAgents(m.id)}
                                >
                                  <div className="report-flow-box-agent-top">
                                    <h4 className="report-flow-box-agent-title">
                                      {agent.title}
                                    </h4>
                                  </div>

                                  <p className="report-flow-box-agent-desc">{agent.description}</p>

                                  <div className="report-flow-box-agent-footer">
                                    <span className="report-flow-box-agent-time">
                                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                                      <span>{agent.lastUsed || "Active now"}</span>
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Single Run agents button for both, right side bottom */}
                          <div className="report-flow-box-footer">
                            <button
                              type="button"
                              className="report-flow-run-agents-btn"
                              onClick={() => handleRunBothAgents(m.id)}
                            >
                              <span>Run agents</span>
                              <ArrowRight className="h-4 w-4 ml-1.5" />
                            </button>
                          </div>
                        </div>

                        {/* Configuration section when an agent is active */}
                        {(() => {
                          const currentFlow = reportFlows[m.id];
                          if (!currentFlow || !currentFlow.activeAgentId) return null;

                          const suggested = projectRelatedAgents.slice(0, 2);
                          const leadAgent = suggested.find((a) => a.id === currentFlow.activeAgentId) || suggested[0];
                          const secondAgent = suggested.find((a) => a.id !== leadAgent.id) || suggested[1];

                          // When report is not yet generated, show field questions & continue button
                          if (!currentFlow.isReportGenerated) {
                            return (
                              <div className="report-flow-configuration-container">
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

                                {/* Agent 2 Fields */}
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

                                {/* Continue Button */}
                                <div className="report-flow-footer-row">
                                  <button
                                    type="button"
                                    className="report-flow-continue-btn"
                                    onClick={() => handleGenerateReport(m.id)}
                                  >
                                    <span>Continue to Generate Report</span>
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          // Generated Executive Report
                          return (
                            <div className="report-flow-generated-card">
                              <div className="report-generated-header">
                                <div className="report-generated-title-wrap">
                                  <h4 className="report-generated-title">Executive Strategic Report: South Asia Secondary Cities Penetration</h4>
                                  <p className="report-generated-meta">
                                    Synthesized by {leadAgent.title} & {secondAgent.title}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  className="packages-download-all-btn"
                                  title="Download full executive report"
                                >
                                  Download report (PDF)
                                </button>
                              </div>

                              <div className="report-generated-params-row">
                                <span className="report-param-pill">{currentFlow.agent1Fields.period}</span>
                                <span className="report-param-pill">{currentFlow.agent1Fields.geography}</span>
                                <span className="report-param-pill">{currentFlow.agent2Fields.cohort}</span>
                                <span className="report-param-pill">{currentFlow.agent2Fields.channel}</span>
                                {currentFlow.agent2Fields.customNotes && (
                                  <span className="report-param-pill">Focus: {currentFlow.agent2Fields.customNotes}</span>
                                )}
                              </div>

                              <div className="report-generated-body">
                                <div className="report-section-block">
                                  <h5 className="report-section-heading">Executive Summary</h5>
                                  <p className="report-section-paragraph">
                                    Based on cross-analysis across {currentFlow.agent1Fields.geography.toLowerCase()} for the {currentFlow.agent1Fields.period.toLowerCase()} timeline, aspirational personal care adoption is outperforming metropolitan benchmarks by 2.4×. Targeted entry requires tailored pack sizes and localized channel margins to win market share for {currentFlow.agent2Fields.cohort.toLowerCase()}.
                                    {currentFlow.agent2Fields.customNotes && (
                                      <> Custom priority applied: <strong>{currentFlow.agent2Fields.customNotes}</strong>.</>
                                    )}
                                  </p>
                                </div>

                                <div className="report-section-block">
                                  <h5 className="report-section-heading">Key Analytical Findings</h5>
                                  <ul className="report-findings-list">
                                    <li>
                                      <strong>Price-Point & Pack Strategy:</strong> Optimal conversion occurs at the ₹199–₹249 price band using 15ml–30ml discovery formats, enabling trial without margin compression.
                                    </li>
                                    <li>
                                      <strong>Channel Velocity & Margins:</strong> {currentFlow.agent2Fields.channel} yields 3.8× inventory turnover velocity. Kirana distributor economics require an 18–21% wholesale trade discount structure.
                                    </li>
                                    <li>
                                      <strong>Formulation Dynamics:</strong> Climate-adaptive, lightweight gel formulations engineered for high humidity clusters increase 60-day repeat purchase velocity by 38%.
                                    </li>
                                  </ul>
                                </div>

                                <div className="report-section-block">
                                  <h5 className="report-section-heading">Strategic Next Steps</h5>
                                  <p className="report-section-paragraph">
                                    1. Initiate 60-day regional distributor onboarding across the priority city corridor.<br />
                                    2. Deploy localized discovery trial kits through quick commerce and targeted modern trade shelves.<br />
                                    3. Scale regional brand advocacy campaigns aligned with seasonal skincare rituals.
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : isKnowledgePackMsg ? (
                      <div className="ai-knowledge-flow-container">
                        {/* Matching Knowledge Packages */}
                        <div className="ai-knowledge-packs-wrapper">
                          <div className="ai-knowledge-packs-header">
                            <h3 className="ai-knowledge-packs-title">Matching Knowledge Packages</h3>
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
                                    <button
                                      type="button"
                                      onClick={() => handleTogglePack(pack.id)}
                                      className="packages-download-all-btn"
                                      title={`Download all reports in ${pack.title}`}
                                      aria-label={`Download all reports in ${pack.title}`}
                                    >
                                      Download all
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
                          </div>
                        </div>

                        {/* Why these reports are relevant Section */}
                        <div className="ai-matching-reports-wrapper">
                          <div className="ai-matching-reports-header">
                            <h3 className="ai-matching-reports-title">Why these reports are relevant</h3>
                          </div>

                          <div className="ai-matching-reports-grid">
                            {defaultMatchingReports.slice(0, 2).map((report) => {
                              const isAdded = !!obtainedReports[report.id];
                              return (
                                <div key={report.id} className="ai-matching-report-card">
                                  <div className="ai-matching-report-top">
                                    <div className="ai-matching-report-header-info">
                                      <h4 className="ai-matching-report-title">{report.title}</h4>
                                      <p className="ai-matching-report-meta">
                                        {report.author} · {report.year}
                                      </p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleToggleReport(report.id)}
                                      className={`ai-pack-get-btn ${isAdded ? "ai-pack-get-btn--added" : ""}`}
                                      aria-label={isAdded ? `${report.title} added` : `Get ${report.title}`}
                                      title={isAdded ? "Report added to project context" : "Add report to project context"}
                                    >
                                      {isAdded ? (
                                        <>
                                          <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                                          <span>ADDED ✓</span>
                                        </>
                                      ) : (
                                        <span>GET</span>
                                      )}
                                    </button>
                                  </div>

                                  <p className="ai-matching-report-summary">{report.summary}</p>

                                  <div className="ai-matching-report-tags">
                                    {report.tags.map((tag) => (
                                      <span key={tag} className="ai-matching-report-tag">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Recommended Agents Section */}
                        <div className="ai-recommended-agents-wrapper">
                          <div className="ai-recommended-agents-header">
                            <h3 className="ai-recommended-agents-title">Recommended Agents</h3>
                          </div>

                          <div className="ai-recommended-agents-grid">
                            {(agents && agents.length > 0 ? agents : initialAgents).slice(0, 2).map((agent) => {
                              const isGenerated = !!generatedAgents[agent.id];
                              const isGenerating = generatingAgentId === agent.id;
                              return (
                                <article
                                  key={agent.id}
                                  className="project-card agent-card ai-agent-recommend-card"
                                  onClick={(e) => {
                                    if ((e.target as HTMLElement).closest("button")) {
                                      return;
                                    }
                                    if (agent.id === "agent-sbi-kyc" || agent.title.includes("KYC")) {
                                      if (onOpenKyc) {
                                        onOpenKyc();
                                        return;
                                      }
                                    }
                                    handleGenerateWithAgent(agent);
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
                                              if (onOpenKyc) {
                                                onOpenKyc();
                                                return;
                                              }
                                            }
                                            handleGenerateWithAgent(agent);
                                          }}
                                        >
                                          {agent.title}
                                        </button>
                                      </h3>
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
                                      className={`project-action-btn project-action-btn--run ${isGenerated ? "project-action-btn--completed" : ""}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleGenerateWithAgent(agent);
                                      }}
                                      disabled={isGenerating}
                                      aria-label={
                                        isGenerated
                                          ? `Report completed with ${agent.title}`
                                          : isGenerating
                                            ? `Generating report with ${agent.title}...`
                                            : `Run agent with ${agent.title}`
                                      }
                                      title={isGenerated ? "Agent completed" : "Run agent"}
                                    >
                                      {isGenerating ? (
                                        <span>Running...</span>
                                      ) : isGenerated ? (
                                        <span>Completed</span>
                                      ) : (
                                        <>
                                          <span>Run agent</span>
                                          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 ml-1" />
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        </div>

                        {/* Below Recommended Agents: Generated Report Section */}
                        {activeReportAgentId && (
                          <div className="ai-agent-report-container" id="agent-report-section">
                            {renderAgentReport(activeReportAgentId)}
                          </div>
                        )}
                      </div>
                    ) : isStrokeBox ? (
                      <div className="ai-stroke-box">
                        <div
                          className="workspace-message-body whitespace-pre-line"
                          style={m.text.includes("I found market intelligence reports from 2025") ? { color: "#64748b" } : undefined}
                        >
                          {m.text}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="workspace-message-body whitespace-pre-line"
                        style={m.text.includes("I found market intelligence reports from 2025") ? { color: "#64748b" } : undefined}
                      >
                        {m.text}
                      </div>
                    )}


                </div>
              );
            })}
          </div>
          )}
            </>
          )}
        </div>

        {/* Bottom Dock (Only when conversation is active) */}
        {messages.length > 0 && !isLibraryOpen && (
          <div className="workspace-dock-wrapper bottom-dock-wrapper">
            {renderInputDock()}
          </div>
        )}
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

            {/* Project Agents (3 agents listdown) */}
            <div className="agents-drawer-section">
              <div className="agents-cards-stack">
                {projectRelatedAgents.map((agent) => {
                  const isGenerating = generatingAgentId === agent.id;
                  const isGenerated = !!generatedAgents[agent.id];

                  return (
                    <article
                      key={agent.id}
                      className="agent-drawer-card agent-drawer-card--project"
                      onClick={() => handleGenerateWithAgent(agent)}
                    >
                      <div className="agent-drawer-card-top">
                        <h4 className="agent-drawer-card-title">{agent.title}</h4>
                        <p className="agent-drawer-card-desc">{agent.description}</p>
                      </div>

                      <div className="agent-drawer-card-footer">
                        <span className="agent-drawer-last-used">
                          <Clock className="h-3.5 w-3.5 text-zinc-400" />
                          <span>{agent.lastUsed || "Active now"}</span>
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="agents-drawer-divider" />

            {/* Section 2: Other Agents */}
            <div className="agents-drawer-section">
              <div className="agents-section-header">
                <h3 className="agents-section-title">Other Agents</h3>
              </div>

              <div className="agents-cards-stack">
                {otherWorkspaceAgents.map((agent) => {
                  const isGenerating = generatingAgentId === agent.id;
                  const isGenerated = !!generatedAgents[agent.id];
                  const isKyc = agent.id === "agent-sbi-kyc" || agent.title.includes("KYC");

                  return (
                    <article
                      key={agent.id}
                      className="agent-drawer-card agent-drawer-card--other"
                      onClick={() => {
                        if (isKyc && onOpenKyc) {
                          onOpenKyc();
                          return;
                        }
                        handleGenerateWithAgent(agent);
                      }}
                    >
                      <div className="agent-drawer-card-top">
                        <h4 className="agent-drawer-card-title">{agent.title}</h4>
                        <p className="agent-drawer-card-desc">{agent.description}</p>
                      </div>

                      <div className="agent-drawer-card-footer">
                        <span className="agent-drawer-last-used">
                          <Clock className="h-3.5 w-3.5 text-zinc-400" />
                          <span>{agent.lastUsed || "Available"}</span>
                        </span>
                      </div>
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
              <div className="knowledge-panel-title-wrap">
                <BookOpen className="h-4 w-4 text-zinc-800 shrink-0" />
                <h2 className="knowledge-panel-title">What I know so far</h2>
              </div>
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

            {/* Project score (No dash line) */}
            <div className="knowledge-panel-section">
              <div className="knowledge-section-title">Project score</div>
              <div className="knowledge-score-value">not scored yet</div>
              <p className="knowledge-score-hint">
                Still need: goal, who it's for, investment, expected annual impact, target date, delivery owner.
              </p>
            </div>

            {/* Core facts known */}
            <div className="knowledge-panel-section">
              <div className="knowledge-section-title">Core facts known</div>
              <div className="knowledge-facts-progress">
                <div className="knowledge-facts-bar" style={{ width: "0%" }} />
              </div>
              <div className="knowledge-facts-sub">0 of 6 core facts</div>
            </div>

            {/* Still to learn */}
            <div className="knowledge-still-to-learn">
              <span className="knowledge-still-left">
                <span className="knowledge-plus">+</span>
                <span>Still to learn</span>
              </span>
              <span className="knowledge-still-count">6</span>
            </div>

            {/* Project Knowledge Base / Context */}
            <div className="knowledge-panel-section">
              <div className="knowledge-section-title">Project Knowledge Base</div>
              <p className="knowledge-context-desc">
                Context and active collaborative agents for {project.title}.
              </p>
            </div>

            {/* Executive Summary */}
            <div className="knowledge-panel-section">
              <div className="knowledge-section-title">Executive Summary</div>
              <p className="knowledge-summary-text">{project.description}</p>
            </div>

            {/* Assigned Autonomous Agents */}
            <div className="knowledge-panel-section">
              <div className="knowledge-section-title">Assigned Autonomous Agents</div>
              <div className="knowledge-agents-list">
                {project.agents.map((agent) => (
                  <span key={agent} className="knowledge-agent-pill">
                    {agent}
                  </span>
                ))}
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
                    : item === "Packages"
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

interface TeamMember {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: string;
}

function MemberRoleDropdown({
  role,
  onChange,
  memberName,
}: {
  role: string;
  onChange: (newRole: string) => void;
  memberName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const roles = ["Analyst", "Owner", "Strategist", "Specialist"];

  return (
    <div className="dark-agent-member-role-select" ref={containerRef}>
      <button
        type="button"
        className="dark-agent-select"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Role for ${memberName}`}
        aria-expanded={isOpen}
      >
        <span>{role}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="dark-agent-dropdown-menu" role="listbox">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              className={`dark-agent-dropdown-item ${r === role ? "selected" : ""}`}
              onClick={() => {
                onChange(r);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={r === role}
            >
              <span>{r}</span>
              {r === role && <Check className="h-3.5 w-3.5 text-white" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
                      <MemberRoleDropdown
                        role={member.role}
                        onChange={(newRole) => handleUpdateMemberRole(member.id, newRole)}
                        memberName={member.name}
                      />
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
                    : item === "Packages"
                      ? "#packages"
                      : "#settings"
                }
                className={`aircond-nav-link ${item === "Packages" ? "active" : ""}`}
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
            Research &amp; Knowledge Packages
          </h1>
          <p className="aircond-header-subline">
            Curated research packages and verified market intelligence.
          </p>
        </div>
      </header>

      {/* Overlapping Stylish Single UI Card for Packages */}
      <section className="packages-overview-section">
        <div className="packages-overview-card">
          <div className="packages-overview-top-row">
            <div className="packages-overview-meta-left">
              <h2 className="packages-overview-headline">Acquired Research Packages</h2>
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
              <div className="packages-metric-label">Packages Acquired</div>
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
                    : item === "Packages"
                      ? "#packages"
                      : "#settings"
                }
                onClick={(e) => {
                  if (item === "Packages") {
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