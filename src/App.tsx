import { useState, type CSSProperties, type ReactNode } from "react";
import { Button, Heading, TextInput } from "./ui";

type IconName =
  | "dashboard"
  | "sales"
  | "projects"
  | "resources"
  | "service"
  | "settings"
  | "search"
  | "plus"
  | "arrow"
  | "menu"
  | "close"
  | "bell"
  | "trend"
  | "clock"
  | "check"
  | "calendar"
  | "building"
  | "contact"
  | "lead"
  | "mail"
  | "phone";

type Page =
  | "dashboard"
  | "time"
  | "weekly"
  | "approvals"
  | "sales"
  | "projects"
  | "utilization"
  | "resources"
  | "budgets"
  | "service"
  | "accounts"
  | "contacts"
  | "leads"
  | "activities"
  | "settings";

const iconPaths: Record<IconName, ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  sales: (
    <>
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19H2" />
    </>
  ),
  projects: (
    <>
      <rect x="3" y="5" width="18" height="15" rx="2" />
      <path d="M8 5V3h8v2M3 10h18" />
    </>
  ),
  resources: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  service: (
    <>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      <path d="M8 9h8M8 13h5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 9 19.37a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15a1.7 1.7 0 0 0-1.55-1.03H3v-4h.08A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63a1.7 1.7 0 0 0 1.03-1.55V3h4v.08A1.7 1.7 0 0 0 15 4.63a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9a1.7 1.7 0 0 0 1.55 1.03H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z" />
    </>
  ),
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  trend: <><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  building: <><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M2 21h20M8 7h4M8 11h4M8 15h4" /></>,
  contact: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="11" r="2.5" /><path d="M5.5 17a3.5 3.5 0 0 1 7 0M15 9h3M15 13h3" /></>,
  lead: <><path d="M3 5h18l-7 8v6l-4 2v-8z" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  phone: <><path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.8 2 2 0 0 1 3.1 1.6h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L7 9.4a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.9 2.1z" /></>,
};

// Official Sirocco logo (icon + wordmark). The wordmark is white, for use on the navy sidebar.
function SiroccoLogo({ height = 26 }: { height?: number }) {
  return (
    <svg aria-label="Sirocco" className="brand-logo" height={height} role="img" viewBox="0 0 607.69 126.2" width={(height * 607.69) / 126.2}>
      <path fill="#cfc3a8" d="M20.57,98.68l48.67-29.15c2.03-1.21,4.73-3.4,4.73-7.28,0,0,0,24.93,0,26.71,0,5.29-2.4,6.71-4.73,8.09l-48.67,29.16v-27.52Z" />
      <path fill="#b2a792" d="M.01,75.99c0,3.83,2.11,5.86,4.72,7.45,2.63,1.6,11.02,6.56,11.02,6.56l23.62-14.02-23.48-13.9-11.16,6.63C2.72,69.9.01,72.09.01,75.99Z" />
      <path fill="#cfc3a8" d="M74.11,0v27.51L4.73,68.7c-2.03,1.21-4.73,3.4-4.73,7.28v-26.7c0-5.29,2.4-6.7,4.73-8.09L74.11,0Z" />
      <path fill="#b2a792" d="M74.13,62.23c0-3.83-2.11-5.86-4.72-7.45-2.63-1.6-11.02-6.56-11.02-6.56l-23.62,14.02,23.48,13.9,11.16-6.63c2.01-1.19,4.72-3.39,4.72-7.28Z" />
      <g fill="#fff">
        <path d="M125.26,93.18c-1.24-1.1-1.34-2.31-.31-3.61l1.24-1.55c.96-1.17,2.17-1.27,3.61-.31,2.27,2,4.91,3.55,7.91,4.65,2.99,1.1,5.94,1.65,8.83,1.65,4.41,0,7.97-1.14,10.69-3.41,2.72-2.27,4.08-5.27,4.08-8.99,0-3.03-.9-5.53-2.69-7.49-1.79-1.96-4.03-3.67-6.72-5.11-2.69-1.45-5.58-2.79-8.68-4.03s-5.99-2.7-8.68-4.39c-2.69-1.69-4.93-3.73-6.72-6.15-1.79-2.41-2.69-5.51-2.69-9.3,0-2.82.55-5.42,1.65-7.8,1.1-2.38,2.67-4.42,4.7-6.15,2.03-1.72,4.44-3.06,7.23-4.03,2.79-.96,5.84-1.44,9.14-1.44,3.1.07,6.25.6,9.45,1.6,3.2,1,5.94,2.36,8.21,4.08,1.24.96,1.45,2.1.62,3.41l-.93,1.65c-.89,1.44-2.1,1.69-3.61.72-4.69-3.1-9.33-4.65-13.95-4.65-2.27,0-4.34.29-6.2.88-1.86.59-3.46,1.43-4.8,2.53-1.34,1.1-2.37,2.39-3.1,3.87-.72,1.48-1.08,3.12-1.08,4.91,0,2.89.89,5.27,2.69,7.13,1.79,1.86,4.03,3.48,6.72,4.86,2.68,1.38,5.58,2.69,8.68,3.93,3.1,1.24,5.99,2.7,8.68,4.39,2.69,1.69,4.92,3.79,6.72,6.3,1.79,2.51,2.68,5.7,2.68,9.55,0,2.96-.53,5.67-1.6,8.11-1.07,2.45-2.58,4.55-4.55,6.3-1.96,1.75-4.31,3.12-7.03,4.08-2.72.96-5.7,1.45-8.93,1.45-3.72-.07-7.51-.77-11.36-2.12-3.86-1.34-7.16-3.19-9.92-5.53Z" />
        <path d="M191.31,29.54c0-1.72.82-2.58,2.48-2.58h2.17c1.65,0,2.48.86,2.48,2.58v67.46c0,1.72-.83,2.58-2.48,2.58h-2.17c-1.65,0-2.48-.86-2.48-2.58V29.54Z" />
        <path d="M228.08,29.54c0-1.72.82-2.58,2.48-2.58h19.63c3.1,0,5.68.15,7.75.46,2.06.31,3.89.84,5.47,1.6,3.44,1.65,6.1,4.07,7.95,7.23,1.86,3.17,2.79,6.82,2.79,10.95,0,4.96-1.26,9.25-3.77,12.86-2.51,3.62-5.84,6.01-9.97,7.18v.21c.13.21.36.57.67,1.08.31.52.71,1.12,1.19,1.81l14.15,26.24c.48.96.55,1.7.21,2.22s-1,.77-1.96.77h-2.69c-1.45,0-2.44-.58-3-1.76l-15.49-28.82h-18.28v28c0,1.72-.83,2.58-2.48,2.58h-2.17c-1.65,0-2.48-.86-2.48-2.58V29.54ZM252.46,62.6c4.34,0,7.81-1.38,10.43-4.13,2.62-2.75,3.92-6.44,3.92-11.05,0-2.89-.67-5.46-2.01-7.69-1.34-2.24-3.22-3.91-5.63-5.01-1.17-.48-2.45-.83-3.82-1.03-1.38-.2-3.27-.31-5.68-.31h-14.46v29.23h17.25Z" />
        <path d="M293.92,62.81c0-5.23.93-10.11,2.79-14.62,1.86-4.51,4.44-8.43,7.75-11.78,3.31-3.34,7.21-5.96,11.72-7.85,4.51-1.89,9.42-2.84,14.72-2.84s10.1.95,14.61,2.84c4.51,1.9,8.42,4.49,11.73,7.8,3.31,3.31,5.9,7.23,7.8,11.78,1.89,4.55,2.84,9.44,2.84,14.67s-.95,10.38-2.84,15.03c-1.9,4.65-4.49,8.68-7.8,12.09s-7.22,6.08-11.73,8.01c-4.51,1.93-9.38,2.89-14.61,2.89s-10.11-.96-14.62-2.89c-4.51-1.93-8.42-4.6-11.73-8.01s-5.91-7.44-7.8-12.09-2.84-9.66-2.84-15.03ZM301.36,62.81c0,4.48.76,8.62,2.27,12.45,1.51,3.82,3.58,7.13,6.2,9.92,2.62,2.79,5.73,4.98,9.35,6.56,3.62,1.58,7.52,2.37,11.73,2.37s8.11-.79,11.72-2.37c3.62-1.58,6.73-3.77,9.35-6.56,2.62-2.79,4.68-6.1,6.2-9.92,1.51-3.82,2.27-7.97,2.27-12.45s-.76-8.37-2.27-12.09c-1.52-3.72-3.58-6.92-6.2-9.61-2.62-2.69-5.73-4.8-9.35-6.36-3.62-1.55-7.53-2.32-11.72-2.32s-8.2.77-11.78,2.32c-3.58,1.55-6.7,3.69-9.35,6.41-2.65,2.72-4.72,5.92-6.2,9.61-1.48,3.69-2.22,7.7-2.22,12.04Z" />
        <path d="M382.16,62.81c0-5.37.91-10.31,2.74-14.82,1.82-4.51,4.36-8.42,7.6-11.72,3.24-3.31,7.07-5.89,11.52-7.75,4.44-1.86,9.31-2.79,14.62-2.79,4.41,0,8.8.71,13.17,2.12,4.37,1.41,8.11,3.29,11.21,5.63,1.1,1.03,1.24,2.24.42,3.62l-.93,1.34c-.97,1.31-2.14,1.45-3.51.41-2.89-2-6.11-3.56-9.66-4.7-3.55-1.13-7.04-1.7-10.48-1.7-4.27,0-8.2.74-11.78,2.22-3.58,1.48-6.66,3.56-9.25,6.25-2.58,2.69-4.6,5.89-6.04,9.61-1.44,3.72-2.17,7.78-2.17,12.19s.74,8.74,2.22,12.6c1.48,3.86,3.53,7.18,6.15,9.97,2.62,2.79,5.73,4.96,9.35,6.51,3.62,1.55,7.56,2.32,11.83,2.32,3.72,0,7.47-.69,11.26-2.06,3.79-1.38,7.23-3.31,10.33-5.79,1.31-1.03,2.48-.93,3.51.31l.93,1.14c.96,1.31.89,2.51-.2,3.61-3.51,2.96-7.6,5.29-12.24,6.97-4.65,1.69-9.24,2.53-13.79,2.53-5.37,0-10.3-.95-14.77-2.84-4.48-1.89-8.35-4.53-11.62-7.9-3.27-3.37-5.82-7.38-7.64-12.03-1.82-4.65-2.74-9.73-2.74-15.24Z" />
        <path d="M458,62.81c0-5.37.91-10.31,2.74-14.82,1.82-4.51,4.36-8.42,7.6-11.72,3.24-3.31,7.07-5.89,11.52-7.75,4.44-1.86,9.31-2.79,14.62-2.79,4.41,0,8.8.71,13.17,2.12,4.37,1.41,8.11,3.29,11.21,5.63,1.1,1.03,1.24,2.24.42,3.62l-.93,1.34c-.97,1.31-2.14,1.45-3.51.41-2.89-2-6.11-3.56-9.66-4.7-3.55-1.13-7.04-1.7-10.48-1.7-4.27,0-8.2.74-11.78,2.22-3.58,1.48-6.66,3.56-9.25,6.25-2.58,2.69-4.6,5.89-6.04,9.61-1.44,3.72-2.17,7.78-2.17,12.19s.74,8.74,2.22,12.6c1.48,3.86,3.53,7.18,6.15,9.97,2.62,2.79,5.73,4.96,9.35,6.51,3.62,1.55,7.56,2.32,11.83,2.32,3.72,0,7.47-.69,11.26-2.06,3.79-1.38,7.23-3.31,10.33-5.79,1.31-1.03,2.48-.93,3.51.31l.93,1.14c.96,1.31.89,2.51-.2,3.61-3.51,2.96-7.6,5.29-12.24,6.97-4.65,1.69-9.24,2.53-13.79,2.53-5.37,0-10.3-.95-14.77-2.84-4.48-1.89-8.35-4.53-11.62-7.9-3.27-3.37-5.82-7.38-7.64-12.03-1.82-4.65-2.74-9.73-2.74-15.24Z" />
        <path d="M533.73,62.81c0-5.23.93-10.11,2.79-14.62,1.86-4.51,4.44-8.43,7.75-11.78,3.31-3.34,7.21-5.96,11.72-7.85,4.51-1.89,9.42-2.84,14.72-2.84s10.1.95,14.61,2.84c4.51,1.9,8.42,4.49,11.73,7.8s5.9,7.23,7.8,11.78c1.89,4.55,2.84,9.44,2.84,14.67s-.95,10.38-2.84,15.03c-1.9,4.65-4.49,8.68-7.8,12.09-3.31,3.41-7.22,6.08-11.73,8.01-4.51,1.93-9.38,2.89-14.61,2.89s-10.11-.96-14.62-2.89c-4.51-1.93-8.42-4.6-11.73-8.01-3.31-3.41-5.91-7.44-7.8-12.09-1.89-4.65-2.84-9.66-2.84-15.03ZM541.17,62.81c0,4.48.76,8.62,2.27,12.45,1.51,3.82,3.58,7.13,6.2,9.92,2.62,2.79,5.73,4.98,9.35,6.56,3.62,1.58,7.52,2.37,11.73,2.37s8.11-.79,11.72-2.37c3.62-1.58,6.73-3.77,9.35-6.56,2.62-2.79,4.68-6.1,6.2-9.92,1.51-3.82,2.27-7.97,2.27-12.45s-.76-8.37-2.27-12.09c-1.52-3.72-3.58-6.92-6.2-9.61-2.62-2.69-5.73-4.8-9.35-6.36-3.62-1.55-7.53-2.32-11.72-2.32s-8.2.77-11.78,2.32c-3.58,1.55-6.7,3.69-9.35,6.41-2.65,2.72-4.72,5.92-6.2,9.61-1.48,3.69-2.22,7.7-2.22,12.04Z" />
      </g>
    </svg>
  );
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {iconPaths[name]}
    </svg>
  );
}

const pageMeta: Record<Page, { title: string; eyebrow: string }> = {
  dashboard: { title: "Dashboard", eyebrow: "Good morning, Philip" },
  time: { title: "Time entries", eyebrow: "My work" },
  weekly: { title: "Weekly time summary", eyebrow: "My work" },
  approvals: { title: "Approvals", eyebrow: "Team" },
  sales: { title: "Pipeline", eyebrow: "Opportunities · MEDDPICC qualification" },
  projects: { title: "Projects", eyebrow: "Delivery & financials" },
  utilization: { title: "Resource utilization", eyebrow: "Capacity planning" },
  resources: { title: "Resources", eyebrow: "People & skills" },
  budgets: { title: "Budgets", eyebrow: "Project financials" },
  service: { title: "Service", eyebrow: "Cases & customer support" },
  accounts: { title: "Accounts", eyebrow: "Customers" },
  contacts: { title: "Contacts", eyebrow: "Customers" },
  leads: { title: "Leads", eyebrow: "Sales · inbound interest" },
  activities: { title: "Activities", eyebrow: "My work · week 24" },
  settings: { title: "Settings", eyebrow: "Workspace administration" },
};

const navGroups: { label: string; items: { id: Page; label: string; icon?: IconName }[] }[] = [
  {
    label: "My Work",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "dashboard" },
      { id: "activities", label: "Activities", icon: "calendar" },
      { id: "time", label: "Time entries", icon: "clock" },
      { id: "weekly", label: "Weekly time summary" },
      { id: "approvals", label: "Approvals" },
    ],
  },
  {
    label: "Customers",
    items: [
      { id: "accounts", label: "Accounts", icon: "building" },
      { id: "contacts", label: "Contacts", icon: "contact" },
    ],
  },
  {
    label: "Sales",
    items: [
      { id: "leads", label: "Leads", icon: "lead" },
      { id: "sales", label: "Pipeline", icon: "sales" },
    ],
  },
  {
    label: "Projects",
    items: [
      { id: "projects", label: "Projects", icon: "projects" },
      { id: "utilization", label: "Resource utilization" },
      { id: "resources", label: "Resources", icon: "resources" },
      { id: "budgets", label: "Budgets" },
    ],
  },
  {
    label: "Customer Success",
    items: [{ id: "service", label: "Service cases", icon: "service" }],
  },
];

type Score = 0 | 1 | 2 | 3;
type CriterionKey = "M" | "EB" | "DC" | "DP" | "P" | "I" | "CH" | "C";
type Criterion = { status: Score; evidence: string; next: string; owner: string; date: string; contact?: string };
type Deal = {
  id: string;
  account: string;
  name: string;
  value: string;
  close: string;
  contact: string;
  criteria: Record<CriterionKey, Criterion>;
};

const meddpicc: { key: CriterionKey; label: string; question: string }[] = [
  { key: "M", label: "Metrics", question: "Which measurable outcome does the customer expect?" },
  { key: "EB", label: "Economic Buyer", question: "Who owns the budget and can sign?" },
  { key: "DC", label: "Decision Criteria", question: "How will they compare and choose?" },
  { key: "DP", label: "Decision Process", question: "Which steps, people and dates lead to a decision?" },
  { key: "P", label: "Paper Process", question: "What do legal, procurement and signing require?" },
  { key: "I", label: "Identify Pain", question: "Which business problem forces them to act?" },
  { key: "CH", label: "Champion", question: "Who sells for us internally, and has influence?" },
  { key: "C", label: "Competition", question: "Who else could they choose, including doing nothing?" },
];

const scores: Score[] = [0, 1, 2, 3];
const scoreLabels = ["Unknown", "Assumed", "Confirmed", "Verified"];
const scoreHints = [
  "0 · Unknown: we do not know yet",
  "1 · Assumed: our belief, not confirmed",
  "2 · Confirmed: the customer has said so",
  "3 · Verified: confirmed with evidence from the customer",
];
const scoreTones = ["red", "amber", "sand", "green"];

const c = (status: Score, evidence: string, next: string, owner: string, date: string, contact?: string): Criterion => ({
  status,
  evidence,
  next,
  owner,
  date,
  contact,
});

const initialDeals: Deal[] = [
  {
    id: "nordic",
    account: "Nordic Solutions",
    name: "CRM transformation",
    value: "SEK 1,240,000",
    close: "Jun 18",
    contact: "Sofia Lind",
    criteria: {
      M: c(3, "COO validated a 14% reduction in service cost, worth SEK 1.8m annually.", "Add baseline to business case", "Philip O.", "Jun 14"),
      EB: c(2, "CFO Anna Lind confirmed a SEK 2m transformation budget in meeting 3/6.", "Book final value review with Anna", "Philip O.", "Jun 18", "Anna Lind · CFO"),
      DC: c(3, "Security, Nordic hosting and time-to-value are documented and ranked.", "Confirm final security score", "Oliver N.", "Jun 13"),
      DP: c(2, "IT steering group recommends; CFO signs after procurement review.", "Map steering group attendees", "Philip O.", "Jun 17"),
      P: c(1, "Standard MSA expected. Legal review time has not been confirmed.", "Introduce legal teams", "Maja K.", "Jun 12"),
      I: c(3, "Manual reporting consumes 160 hours monthly and delays invoicing.", "Attach pain to executive summary", "Philip O.", "Jun 14"),
      CH: c(2, "Sofia shares internal context and is building consensus across operations.", "Validate influence with CFO", "Philip O.", "Jun 18", "Sofia Lind · VP Operations"),
      C: c(0, "Incumbent vendor identified; internal build option remains unclear.", "Ask champion about build option", "Oliver N.", "Jun 11"),
    },
  },
  {
    id: "techvision",
    account: "TechVision AB",
    name: "Service platform renewal",
    value: "SEK 850,000",
    close: "Jun 24",
    contact: "Marcus Holm",
    criteria: {
      M: c(2, "IT director expects 30% faster case handling; baseline not shared yet.", "Get current case volume baseline", "Oliver N.", "Jun 20"),
      EB: c(1, "Believed to be CIO Peter Ek. We have not met him.", "Ask Marcus for an intro to Peter", "Philip O.", "Jun 19", "Peter Ek · CIO (assumed)"),
      DC: c(2, "RFP requires SAP integration and Swedish-language support.", "Score our answer against the RFP", "Oliver N.", "Jun 21"),
      DP: c(2, "Evaluation ends Jun 21; board approval on Jun 24.", "Confirm board agenda slot", "Philip O.", "Jun 18"),
      P: c(1, "Purchase likely via framework agreement; not confirmed.", "Ask procurement for framework terms", "Maja K.", "Jun 17"),
      I: c(3, "Support backlog grew 40% in Q1; CEO named it a top-3 risk.", "Quote backlog figures in proposal", "Philip O.", "Jun 20"),
      CH: c(3, "Marcus arranged the CIO meeting and shared the RFP scoring model.", "Prepare Marcus for steering group", "Philip O.", "Jun 18", "Marcus Holm · IT Director"),
      C: c(2, "Two vendors in the RFP; the Salesforce partner is strongest.", "Prepare time-to-value comparison", "Oliver N.", "Jun 19"),
    },
  },
  {
    id: "bright",
    account: "Bright Digital",
    name: "Digital platform expansion",
    value: "SEK 450,000",
    close: "Jul 2",
    contact: "Anna Berg",
    criteria: {
      M: c(1, "Expected growth in online orders; no figure agreed.", "Workshop to quantify order uplift", "Philip O.", "Jun 20"),
      EB: c(0, "Budget owner unknown; marketing and IT both claim it.", "Ask Anna who signs above SEK 300k", "Philip O.", "Jun 14"),
      DC: c(2, "Must integrate with Shopify and go live before Black Friday.", "Send integration reference case", "Viktor L.", "Jun 18"),
      DP: c(1, "Anna believes the management team decides in July.", "Map decision steps with Anna", "Philip O.", "Jun 19"),
      P: c(0, "No information on contract or procurement.", "Request standard contract terms", "Maja K.", "Jun 21"),
      I: c(2, "Manual campaign setup takes 3 days per launch.", "Quantify cost of delayed launches", "Philip O.", "Jun 20"),
      CH: c(2, "Anna is positive and shares information; influence still unclear.", "Test Anna's access to management", "Philip O.", "Jun 19", "Anna Berg · Head of Digital"),
      C: c(1, "Probably compared with building it in-house.", "Ask about in-house capacity", "Viktor L.", "Jun 24"),
    },
  },
  {
    id: "forma",
    account: "Forma Studio",
    name: "Service portal",
    value: "SEK 320,000",
    close: "Jul 11",
    contact: "Erik Sand",
    criteria: {
      M: c(0, "", "Define success metrics with Erik", "Philip O.", "Jun 21"),
      EB: c(1, "Probably the CEO, given company size.", "Confirm signing authority", "Philip O.", "Jun 25"),
      DC: c(1, "Price and ease of use mentioned in first call.", "Get written requirements", "Oliver N.", "Jun 24"),
      DP: c(0, "", "Ask how they bought their last system", "Philip O.", "Jun 21"),
      P: c(0, "", "Clarify contract owner", "Maja K.", "Jun 28"),
      I: c(2, "Customers email support because they cannot find order status.", "Measure email volume per week", "Oliver N.", "Jun 24"),
      CH: c(1, "Erik Sand is interested but has not shared internal information.", "Ask Erik to arrange a team demo", "Philip O.", "Jun 26", "Erik Sand · Operations Lead"),
      C: c(1, "Likely evaluating a low-cost SaaS tool.", "Ask which tools they have seen", "Oliver N.", "Jun 26"),
    },
  },
];

function dealPoints(deal: Deal) {
  return meddpicc.reduce((sum, item) => sum + deal.criteria[item.key].status, 0);
}

function dealHealth(deal: Deal) {
  return Math.round((dealPoints(deal) / (meddpicc.length * 3)) * 100);
}

function healthTone(health: number) {
  return health >= 70 ? "green" : health >= 45 ? "amber" : "red";
}

function weakestCriterion(deal: Deal) {
  return meddpicc.reduce((weakest, item) => (deal.criteria[item.key].status < deal.criteria[weakest.key].status ? item : weakest));
}

const projects = [
  { name: "Nova implementation", account: "Nordic Solutions", progress: 74, status: "On track", tone: "green", phase: "Build", manager: "MK", due: "Aug 30", budget: 1800000, spent: 1330000, forecast: 1760000 },
  { name: "Digital platform 2.0", account: "Bright Digital", progress: 48, status: "On track", tone: "green", phase: "Design", manager: "ON", due: "Oct 15", budget: 940000, spent: 410000, forecast: 900000 },
  { name: "CRM migration", account: "TechVision AB", progress: 92, status: "At risk", tone: "amber", phase: "Testing", manager: "MK", due: "Jun 28", budget: 620000, spent: 550000, forecast: 670000 },
  { name: "Service portal", account: "Forma Studio", progress: 18, status: "Planned", tone: "sand", phase: "Discovery", manager: "SA", due: "Nov 20", budget: 380000, spent: 0, forecast: 380000 },
];

function formatSek(value: number) {
  return value >= 1000000 ? `SEK ${(value / 1000000).toFixed(2)}m` : `SEK ${Math.round(value / 1000)}k`;
}

const cases = [
  { id: "SC-1048", title: "Unable to export monthly report", account: "Nordic Solutions", priority: "High", tone: "red", owner: "Oliver N.", age: "2 h" },
  { id: "SC-1047", title: "Access for new project manager", account: "Bright Digital", priority: "Normal", tone: "sand", owner: "Philip O.", age: "5 h" },
  { id: "SC-1043", title: "Invoice data is missing a reference", account: "TechVision AB", priority: "Normal", tone: "sand", owner: "Maja K.", age: "1 d" },
  { id: "SC-1039", title: "Finance system synchronization", account: "Forma Studio", priority: "Low", tone: "slate", owner: "Oliver N.", age: "2 d" },
];

function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: string }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

function Sidebar({
  page,
  onChange,
  open,
  onClose,
}: {
  page: Page;
  onChange: (page: Page) => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <div className={`mobile-overlay ${open ? "is-open" : ""}`} onClick={onClose} role="presentation" />
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <div className="brand">
          <SiroccoLogo />
          <Button aria-label="Close menu" className="icon-button sidebar-close" onClick={onClose}>
            <Icon name="close" />
          </Button>
        </div>
        <nav className="nav" aria-label="Main navigation">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p className="nav-label">{group.label}</p>
              {group.items.map((item) => (
                <Button
                  className={`nav-item ${!item.icon ? "nav-item--nested" : ""} ${page === item.id ? "is-active" : ""}`}
                  key={item.id}
                  onClick={() => {
                    onChange(item.id);
                    onClose();
                  }}
                >
                  {item.icon && <Icon name={item.icon} />}
                  <span>{item.label}</span>
                  {item.id === "service" && <span className="nav-count">8</span>}
                  {item.id === "approvals" && <span className="nav-count nav-count--sand">6</span>}
                  {item.id === "leads" && <span className="nav-count nav-count--sand">3</span>}
                </Button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Button
            className={`nav-item ${page === "settings" ? "is-active" : ""}`}
            onClick={() => {
              onChange("settings");
              onClose();
            }}
          >
            <Icon name="settings" />
            <span>Settings</span>
          </Button>
          <div className="profile">
            <span className="avatar">PO</span>
            <span className="profile-copy"><strong>Philip Oxelius</strong><small>Sales Director</small></span>
            <span className="online-dot" />
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ page, onMenu }: { page: Page; onMenu: () => void }) {
  return (
    <header className="topbar">
      <div className="title-wrap">
        <Button aria-label="Open menu" className="icon-button mobile-menu" onClick={onMenu}>
          <Icon name="menu" />
        </Button>
        <div>
          <p className="eyebrow">{pageMeta[page].eyebrow}</p>
          <Heading level={1}>{pageMeta[page].title}</Heading>
        </div>
      </div>
      <div className="top-actions">
        <label className="search">
          <Icon name="search" size={18} />
          <TextInput aria-label="Search" placeholder="Search clients, projects..." />
          <kbd>⌘ K</kbd>
        </label>
        <Button aria-label="Notifications" className="icon-button notification">
          <Icon name="bell" size={19} />
          <span />
        </Button>
        <Button className="primary-button"><Icon name="plus" size={18} /> Create new</Button>
      </div>
    </header>
  );
}

function StatCard({
  label,
  value,
  change,
  icon,
  accent,
  note = "vs. previous month",
}: {
  note?: string;
  label: string;
  value: string;
  change: string;
  icon: IconName;
  accent: string;
}) {
  return (
    <article className="stat-card">
      <div className={`stat-icon stat-icon--${accent}`}><Icon name={icon} size={19} /></div>
      <p>{label}</p>
      <strong>{value}</strong>
      <small><span><Icon name="trend" size={13} /> {change}</span> {note}</small>
    </article>
  );
}

function Dashboard({ deals, onOpenDeal }: { deals: Deal[]; onOpenDeal: (id: string) => void }) {
  const ranked = [...deals].sort((a, b) => dealHealth(b) - dealHealth(a));
  return (
    <>
      <section className="stat-grid">
        <StatCard accent="navy" change="+8.4%" icon="resources" label="Active accounts" value="128" />
        <StatCard accent="sand" change="+12.1%" icon="sales" label="Qualified pipeline" value="SEK 4.8m" />
        <StatCard accent="green" change="+5.2%" icon="projects" label="Active projects" value="12" />
        <StatCard accent="amber" change="-2 cases" icon="service" label="Open cases" value="8" />
      </section>

      <section className="dashboard-grid">
        <article className="panel pipeline-panel">
          <div className="panel-heading">
            <div><Heading level={2}>Qualified pipeline</Heading><p>Value by MEDDPICC progress</p></div>
            <Button className="text-button" onClick={() => onOpenDeal(ranked[0].id)}>View pipeline <Icon name="arrow" size={16} /></Button>
          </div>
          <div className="pipeline-total">
            <strong>SEK 4,860,000</strong>
            <Badge tone="green">+12.1%</Badge>
          </div>
          <div className="chart" aria-label="Pipeline value by MEDDPICC qualification area">
            {[35, 54, 83, 64, 47].map((height, index) => (
              <div className="bar-group" key={height}>
                <div className="bar-track"><span style={{ height: `${height}%` }} /></div>
                <small>{["Metrics", "Economic buyer", "Decision criteria", "Champion", "Paper process"][index]}</small>
              </div>
            ))}
          </div>
        </article>
        <article className="panel activity-panel">
          <div className="panel-heading">
            <div><Heading level={2}>Today’s focus</Heading><p>4 activities remaining</p></div>
            <Button aria-label="Add activity" className="small-add"><Icon name="plus" size={18} /></Button>
          </div>
          <div className="task-list">
            {[
              ["09:30", "Economic buyer call — Nordic Solutions", "Call", "blue"],
              ["11:00", "Decision criteria review — TechVision", "Meeting", "violet"],
              ["13:30", "Nova project check-in", "Meeting", "green"],
              ["15:00", "Renew Bright Digital agreement", "Task", "amber"],
            ].map(([time, title, type, tone]) => (
              <Button className="task" key={title}>
                <span className="task-time">{time}</span>
                <span className={`task-line task-line--${tone}`} />
                <span className="task-copy"><strong>{title}</strong><small>{type}</small></span>
                <span className="task-check"><Icon name="check" size={15} /></span>
              </Button>
            ))}
          </div>
        </article>
      </section>

      <section className="panel table-panel">
        <div className="panel-heading">
          <div><Heading level={2}>Priority opportunities</Heading><p>Active deals ranked by MEDDPICC confidence</p></div>
          <Button className="text-button" onClick={() => onOpenDeal(ranked[0].id)}>View all <Icon name="arrow" size={16} /></Button>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Account</th><th>Contact</th><th>Value</th><th>Weakest area</th><th>Health</th><th>Close</th></tr></thead>
            <tbody>
              {ranked.map((deal) => {
                const weakest = weakestCriterion(deal);
                const health = dealHealth(deal);
                return (
                  <tr className="is-clickable" key={deal.id} onClick={() => onOpenDeal(deal.id)}>
                    <td><span className="company-cell"><span className="company-logo">{deal.account.slice(0, 2).toUpperCase()}</span><strong>{deal.account}</strong></span></td>
                    <td>{deal.contact}</td><td><strong>{deal.value}</strong></td>
                    <td><Badge tone={scoreTones[deal.criteria[weakest.key].status]}>{weakest.label}</Badge></td>
                    <td><Badge tone={healthTone(health)}>{health}%</Badge></td><td>{deal.close}</td>
                  </tr>
                );
              })}
</tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function Sales({
  deals,
  dealId,
  onSelect,
  onUpdate,
}: {
  deals: Deal[];
  dealId: string;
  onSelect: (id: string) => void;
  onUpdate: (dealId: string, key: CriterionKey, patch: Partial<Criterion>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const deal = deals.find((item) => item.id === dealId) ?? deals[0];
  const health = dealHealth(deal);
  const counts = scores.map((score) => meddpicc.filter((item) => deal.criteria[item.key].status === score).length);
  const gaps = meddpicc.filter((item) => deal.criteria[item.key].status <= 1);
  const update = (key: CriterionKey, patch: Partial<Criterion>) => onUpdate(deal.id, key, patch);

  return (
    <>
      <div className="deal-tabs" role="tablist" aria-label="Opportunities">
        {deals.map((item) => {
          const itemHealth = dealHealth(item);
          return (
            <Button
              aria-selected={item.id === deal.id}
              className={`deal-tab ${item.id === deal.id ? "is-active" : ""}`}
              key={item.id}
              onClick={() => onSelect(item.id)}
              role="tab"
            >
              <span><strong>{item.account}</strong><small>{item.value}</small></span>
              <Badge tone={healthTone(itemHealth)}>{itemHealth}%</Badge>
            </Button>
          );
        })}
      </div>

      <section className="deal-health">
        <div className={`health-ring health-ring--${healthTone(health)}`} style={{ "--pct": `${health * 3.6}deg` } as CSSProperties}>
          <span><strong>{health}%</strong><small>Health</small></span>
        </div>
        <div className="deal-title">
          <span>OPPORTUNITY SCORECARD</span>
          <Heading level={2}>{deal.account} · {deal.name}</Heading>
          <p>{deal.value} · Expected close {deal.close} · {dealPoints(deal)} of {meddpicc.length * 3} points</p>
          <div className="score-counts">
            {counts.map((count, score) => (
              <span key={score}><i className={`dot dot--${score}`} />{count} {scoreLabels[score].toLowerCase()}</span>
            ))}
          </div>
        </div>
        <div className="deal-contacts">
          {(["EB", "CH"] as CriterionKey[]).map((key) => (
            <span className={!deal.criteria[key].contact ? "is-missing" : ""} key={key}>
              <small>{key === "EB" ? "Economic Buyer" : "Champion"}</small>
              <strong>{deal.criteria[key].contact || "Not identified"}</strong>
            </span>
          ))}
        </div>
        <Button className="primary-button compact" onClick={() => setEditing(!editing)}>
          {editing ? <><Icon name="check" size={16} /> Done</> : "Edit scorecard"}
        </Button>
      </section>

      {gaps.length > 0 && (
        <section className="gap-strip">
          <strong>{gaps.length} {gaps.length === 1 ? "gap" : "gaps"} to close</strong>
          <div>
            {gaps.map((item) => (
              <span className={`gap-chip gap-chip--${deal.criteria[item.key].status}`} key={item.key}>
                <b>{item.key}</b>{deal.criteria[item.key].next || item.label}<small>{deal.criteria[item.key].owner} · {deal.criteria[item.key].date}</small>
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="panel scorecard-panel">
        <div className="panel-heading">
          <div><Heading level={2}>MEDDPICC qualification</Heading><p>Only evidence verified with the customer receives the top score. Click a score to change it.</p></div>
          <div className="score-legend">
            {scoreLabels.map((label, score) => <span key={label}><i className={`dot dot--${score}`} />{score} {label}</span>)}
          </div>
        </div>
        <div className="scorecard">
          {meddpicc.map((item) => {
            const row = deal.criteria[item.key];
            const weak = row.status <= 1;
            const hasContact = item.key === "EB" || item.key === "CH";
            return (
              <article className={`score-row score-row--${row.status} ${weak ? "is-weak" : ""}`} key={item.key}>
                <div className="criterion">
                  <span>{item.key}</span>
                  <div><strong>{item.label}</strong><small>{item.question}</small></div>
                </div>
                <div className="score-picker">
                  <div role="radiogroup" aria-label={`${item.label} score`}>
                    {scores.map((score) => (
                      <Button
                        aria-checked={row.status === score}
                        className={row.status === score ? "is-active" : ""}
                        key={score}
                        onClick={() => update(item.key, { status: score })}
                        role="radio"
                        title={scoreHints[score]}
                      >
                        {score}
                      </Button>
                    ))}
                  </div>
                  <small>{scoreLabels[row.status]}</small>
                </div>
                <div className="evidence">
                  <small>Evidence</small>
                  {editing ? (
                    <textarea
                      aria-label={`${item.label} evidence`}
                      onChange={(event) => update(item.key, { evidence: event.target.value })}
                      placeholder="What do we actually know? Who said it, and when?"
                      rows={2}
                      value={row.evidence}
                    />
                  ) : (
                    <p className={!row.evidence ? "is-empty" : ""}>{row.evidence || "No evidence recorded yet."}</p>
                  )}
                  {hasContact && (editing ? (
                    <TextInput
                      aria-label={`${item.label} contact`}
                      onChange={(event) => update(item.key, { contact: event.target.value })}
                      placeholder="Name · Title"
                      value={row.contact ?? ""}
                    />
                  ) : (
                    row.contact && <b><Icon name="resources" size={13} /> {row.contact}</b>
                  ))}
                </div>
                <div className="next-action">
                  <small>{weak ? "Action required" : "Next step"}</small>
                  {editing ? (
                    <>
                      <TextInput aria-label={`${item.label} next step`} onChange={(event) => update(item.key, { next: event.target.value })} placeholder="Next step" value={row.next} />
                      <span className="next-fields">
                        <TextInput aria-label={`${item.label} owner`} onChange={(event) => update(item.key, { owner: event.target.value })} placeholder="Owner" value={row.owner} />
                        <TextInput aria-label={`${item.label} date`} onChange={(event) => update(item.key, { date: event.target.value })} placeholder="Date" value={row.date} />
                      </span>
                    </>
                  ) : (
                    <>
                      <strong>{row.next || "No next step"}</strong>
                      <span>{row.owner} · {row.date}</span>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

function Service() {
  return (
    <>
      <section className="stat-grid">
        <StatCard accent="amber" change="-4 cases" icon="service" label="Open cases" value="8" />
        <StatCard accent="red" change="-1 case" icon="trend" label="High priority" value="2" />
        <StatCard accent="sand" change="-18 min" icon="clock" label="First response time" value="42 min" />
        <StatCard accent="green" change="+1.4%" icon="check" label="Resolved within SLA" value="96%" />
      </section>
      <section className="panel table-panel">
        <div className="panel-heading"><div><Heading level={2}>Active service cases</Heading><p>Prioritized by SLA and latest activity</p></div><Button className="primary-button compact"><Icon name="plus" size={17} /> New case</Button></div>
        <div className="table-scroll"><table><thead><tr><th>Case</th><th>Account</th><th>Priority</th><th>Owner</th><th>Age</th></tr></thead>
          <tbody>{cases.map((item) => <tr key={item.id}><td><span className="case-cell"><small>{item.id}</small><strong>{item.title}</strong></span></td><td>{item.account}</td><td><Badge tone={item.tone}>{item.priority}</Badge></td><td>{item.owner}</td><td>{item.age}</td></tr>)}</tbody>
        </table></div>
      </section>
    </>
  );
}

const team = [
  { name: "Philip Oxelius", initials: "PO", role: "Sales Director", group: "Sales", location: "Stockholm", skills: ["Enterprise sales", "MEDDPICC"], project: "Nordic Solutions pursuit", weeks: [82, 80, 85, 78, 70, 60, 64, 72] },
  { name: "Oliver Nyström", initials: "ON", role: "Senior Consultant", group: "Consulting", location: "Stockholm", skills: ["Dynamics 365", "Integrations"], project: "Nova implementation", weeks: [96, 104, 110, 98, 92, 90, 75, 60] },
  { name: "Maja Karlsson", initials: "MK", role: "Project Manager", group: "Delivery", location: "Turin", skills: ["Agile", "Change management"], project: "CRM migration", weeks: [74, 78, 80, 82, 85, 70, 55, 50] },
  { name: "Viktor Larsson", initials: "VL", role: "Developer", group: "Consulting", location: "Barcelona", skills: ["React", "Power Platform"], project: "Digital platform 2.0", weeks: [88, 92, 95, 100, 100, 96, 90, 85] },
  { name: "Sara Ahmed", initials: "SA", role: "UX Designer", group: "Design", location: "Barcelona", skills: ["Research", "Design systems"], project: "Service portal", weeks: [61, 55, 48, 40, 52, 65, 70, 70] },
  { name: "Noah Berg", initials: "NB", role: "Support Specialist", group: "Support", location: "Dubai", skills: ["Service", "Onboarding"], project: "Service desk", weeks: [69, 72, 70, 74, 0, 0, 68, 70] },
];

function heatLevel(value: number) {
  if (value === 0) return "off";
  if (value > 100) return "over";
  if (value >= 85) return "full";
  if (value >= 60) return "good";
  return "low";
}

function Projects() {
  const milestones = [
    { date: "Jun 14", title: "Data migration sign-off", project: "Nova implementation", tone: "green", status: "On track" },
    { date: "Jun 18", title: "User acceptance testing", project: "CRM migration", tone: "amber", status: "At risk" },
    { date: "Jun 25", title: "Design system handover", project: "Digital platform 2.0", tone: "green", status: "On track" },
    { date: "Jul 3", title: "Kickoff workshop", project: "Service portal", tone: "sand", status: "Planned" },
  ];
  return (
    <>
      <section className="stat-grid stat-grid--three">
        <StatCard accent="green" change="+1 project" icon="projects" label="Active projects" value="12" />
        <StatCard accent="sand" change="+4.6%" icon="clock" label="Billable this month" value="SEK 1.2m" />
        <StatCard accent="amber" change="+2.1%" icon="trend" label="Average margin" value="32%" />
      </section>
      <section className="panel">
        <div className="panel-heading"><div><Heading level={2}>Project portfolio</Heading><p>Status, phase and delivery progress</p></div><Button className="primary-button compact"><Icon name="plus" size={17} /> New project</Button></div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.name}>
              <div className="project-top"><span className="company-logo">{project.account.slice(0, 2).toUpperCase()}</span><Badge tone={project.tone}>{project.status}</Badge></div>
              <Heading level={3}>{project.name}</Heading><p>{project.account}</p>
              <div className="project-phase"><span>Phase</span><strong>{project.phase}</strong></div>
              <div className="project-meta"><span>Delivery progress</span><strong>{project.progress}%</strong></div>
              <div className="progress"><span style={{ width: `${project.progress}%` }} /></div>
              <div className="project-footer"><span className="mini-person"><span className="avatar avatar--tiny">{project.manager}</span>Project manager</span><strong>Due {project.due}</strong></div>
            </article>
          ))}
        </div>
      </section>
      <section className="panel list-panel">
        <div className="panel-heading"><div><Heading level={2}>Upcoming milestones</Heading><p>Next 30 days across all projects</p></div><Button className="text-button">Open timeline <Icon name="arrow" size={16} /></Button></div>
        <div className="milestones">
          {milestones.map((item) => (
            <div className="milestone" key={item.title}>
              <span className="milestone-date"><b>{item.date.split(" ")[1]}</b>{item.date.split(" ")[0]}</span>
              <span className="milestone-copy"><strong>{item.title}</strong><small>{item.project}</small></span>
              <Badge tone={item.tone}>{item.status}</Badge>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Budgets() {
  const rows = projects.map((project) => {
    const remaining = project.budget - project.spent;
    const burn = Math.round((project.spent / project.budget) * 100);
    const forecastPct = Math.round((project.forecast / project.budget) * 100);
    return { ...project, remaining, burn, forecastPct };
  });
  const months = [["Jan", 42], ["Feb", 55], ["Mar", 61], ["Apr", 74], ["May", 88], ["Jun", 66]] as const;
  return (
    <>
      <section className="stat-grid">
        <StatCard accent="navy" change="+SEK 380k" icon="projects" label="Total budget" value="SEK 3.74m" />
        <StatCard accent="sand" change="+11.2%" icon="trend" label="Spent to date" value="SEK 2.29m" />
        <StatCard accent="amber" change="+3.1%" icon="sales" label="Forecast at completion" value="SEK 3.71m" />
        <StatCard accent="red" change="+1 project" icon="bell" label="Over budget" value="1" />
      </section>
      <section className="panel table-panel">
        <div className="panel-heading"><div><Heading level={2}>Budget vs. actuals</Heading><p>Spend to date and forecast at completion per project</p></div><Button className="secondary-button">Export</Button></div>
        <div className="table-scroll"><table>
          <thead><tr><th>Project</th><th>Budget</th><th>Spent</th><th>Remaining</th><th>Burn</th><th>Forecast</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td><span className="case-cell"><strong>{row.name}</strong><small>{row.account}</small></span></td>
                <td><strong>{formatSek(row.budget)}</strong></td>
                <td>{formatSek(row.spent)}</td>
                <td>{formatSek(row.remaining)}</td>
                <td>
                  <span className="burn">
                    <span className="burn-track"><span style={{ width: `${Math.min(row.burn, 100)}%` }} /><i style={{ left: `${Math.min(row.forecastPct, 100)}%` }} /></span>
                    <small>{row.burn}%</small>
                  </span>
                </td>
                <td><Badge tone={row.forecastPct > 100 ? "red" : row.forecastPct > 95 ? "amber" : "green"}>{row.forecastPct}% of budget</Badge></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </section>
      <section className="dashboard-grid">
        <article className="panel pipeline-panel">
          <div className="panel-heading"><div><Heading level={2}>Monthly spend</Heading><p>All projects, SEK thousands</p></div></div>
          <div className="chart">
            {months.map(([month, value]) => (
              <div className="bar-group" key={month}>
                <div className="bar-track"><span style={{ height: `${value}%` }} /></div>
                <small>{month}</small>
              </div>
            ))}
          </div>
        </article>
        <article className="panel activity-panel">
          <div className="panel-heading"><div><Heading level={2}>Budget alerts</Heading><p>Needs attention this week</p></div></div>
          <div className="alert-list">
            <div className="alert alert--red"><strong>CRM migration will exceed budget</strong><small>Forecast 108% · scope change for SAP sync not yet approved</small></div>
            <div className="alert alert--amber"><strong>Nova implementation at 74% burn</strong><small>Delivery 74% complete · on pace but no buffer left</small></div>
            <div className="alert alert--green"><strong>Service portal under plan</strong><small>Starts Jul 3 · budget fully available</small></div>
          </div>
        </article>
      </section>
    </>
  );
}

function Resources() {
  const [filter, setFilter] = useState("All");
  const groups = ["All", ...Array.from(new Set(team.map((person) => person.group)))];
  const visible = team.filter((person) => filter === "All" || person.group === filter);
  return (
    <>
      <section className="toolbar">
        <div className="chips">
          {groups.map((group) => (
            <Button className={`chip ${filter === group ? "is-active" : ""}`} key={group} onClick={() => setFilter(group)}>
              {group}<span>{group === "All" ? team.length : team.filter((person) => person.group === group).length}</span>
            </Button>
          ))}
        </div>
        <Button className="primary-button compact"><Icon name="plus" size={17} /> Add resource</Button>
      </section>
      <section className="team-grid">
        {visible.map((person) => (
          <article className="team-card" key={person.name}>
            <div className="team-card-top">
              <div className="team-head"><span className="avatar avatar--large">{person.initials}</span><span className="availability-dot" /></div>
              <span className="location">{person.location}</span>
            </div>
            <Heading level={3}>{person.name}</Heading><p>{person.role}</p>
            <div className="skill-tags">{person.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            <div className="assignment"><small>Current assignment</small><strong>{person.project}</strong></div>
            <div className="project-meta"><span>Utilization this week</span><strong>{person.weeks[0]}%</strong></div>
            <div className="progress"><span style={{ width: `${Math.min(person.weeks[0], 100)}%` }} /></div>
          </article>
        ))}
      </section>
    </>
  );
}

function Utilization() {
  const weeks = ["W24", "W25", "W26", "W27", "W28", "W29", "W30", "W31"];
  return (
    <>
      <section className="capacity-strip">
        <div><span className="stat-icon stat-icon--sand"><Icon name="resources" /></span><p><strong>78%</strong><small>Team utilization</small></p></div>
        <div className="capacity-bar"><span /></div>
        <p><strong>1</strong><small>Overbooked people</small></p>
        <p><strong>186 h</strong><small>Free capacity next 4 weeks</small></p>
      </section>
      <section className="panel table-panel">
        <div className="panel-heading">
          <div><Heading level={2}>Capacity planner</Heading><p>Booked hours as a share of capacity, per person and week</p></div>
          <div className="heat-legend">
            <span><i className="heat--low" />Under 60%</span><span><i className="heat--good" />60–84%</span><span><i className="heat--full" />85–100%</span><span><i className="heat--over" />Over 100%</span><span><i className="heat--off" />Absent</span>
          </div>
        </div>
        <div className="table-scroll">
          <table className="heatmap">
            <thead><tr><th>Person</th>{weeks.map((week) => <th key={week}>{week}</th>)}<th>Average</th></tr></thead>
            <tbody>
              {team.map((person) => {
                const working = person.weeks.filter((value) => value > 0);
                const average = Math.round(working.reduce((sum, value) => sum + value, 0) / working.length);
                return (
                  <tr key={person.name}>
                    <td><span className="company-cell"><span className="avatar avatar--small">{person.initials}</span><span className="case-cell"><strong>{person.name}</strong><small>{person.role}</small></span></span></td>
                    {person.weeks.map((value, index) => (
                      <td key={weeks[index]}><span className={`heat heat--${heatLevel(value)}`}>{value === 0 ? "Away" : `${value}%`}</span></td>
                    ))}
                    <td><strong>{average}%</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

const weekEntries = [
  { day: "Monday", date: "Jun 10", entries: [["Nova implementation", "Nordic Solutions", "Data migration workshop", 4.5, true], ["CRM migration", "TechVision AB", "Field mapping review", 3.5, true]] },
  { day: "Tuesday", date: "Jun 11", entries: [["CRM migration", "TechVision AB", "Integration testing with SAP", 6, true], ["Internal enablement", "Sirocco", "Team learning session", 1.5, false]] },
  { day: "Wednesday", date: "Jun 12", entries: [["Nova implementation", "Nordic Solutions", "Steering group preparation", 3, true], ["Digital platform 2.0", "Bright Digital", "Sprint planning", 4, true], ["Internal enablement", "Sirocco", "Bid review", 1, false]] },
  { day: "Thursday", date: "Jun 13", entries: [["Digital platform 2.0", "Bright Digital", "Checkout flow build", 8.5, true]] },
] as const;

function TimeEntries() {
  return (
    <>
      <section className="time-hero">
        <div><span>WEEK 24</span><strong>32.0 h</strong><small>of 40 scheduled hours</small></div>
        <div className="week-days">{["M", "T", "W", "T", "F"].map((day, index) => <span className={index < 4 ? "is-filled" : ""} key={`${day}-${index}`}>{day}<b>{[8, 7.5, 8, 8.5, 0][index]}h</b></span>)}</div>
        <Button className="primary-button"><Icon name="plus" size={17} /> Add time entry</Button>
      </section>
      <section className="two-col">
        <article className="panel list-panel">
          <div className="panel-heading"><div><Heading level={2}>This week</Heading><p>Your logged time, newest first</p></div><Badge tone="sand">80% complete</Badge></div>
          {[...weekEntries].reverse().map((group) => {
            const total = group.entries.reduce((sum, entry) => sum + entry[3], 0);
            return (
              <div className="day-group" key={group.day}>
                <div className="day-heading"><strong>{group.day}</strong><span>{group.date}</span><b>{total.toFixed(1)} h</b></div>
                {group.entries.map(([project, account, task, hours, billable]) => (
                  <div className="entry-row" key={`${project}-${task}`}>
                    <span className="company-logo">{account.slice(0, 2).toUpperCase()}</span>
                    <span className="entry-copy"><strong>{task}</strong><small>{project} · {account}</small></span>
                    <Badge tone={billable ? "green" : "slate"}>{billable ? "Billable" : "Internal"}</Badge>
                    <strong className="entry-hours">{hours.toFixed(1)} h</strong>
                  </div>
                ))}
              </div>
            );
          })}
        </article>
        <div className="side-stack">
          <article className="timer-card">
            <span className="timer-label"><i />Timer running</span>
            <strong>01:24:36</strong>
            <p>Nova implementation<small>Go-live checklist · Nordic Solutions</small></p>
            <Button className="primary-button compact">Stop &amp; save</Button>
          </article>
          <article className="panel form-panel">
            <div className="panel-heading"><div><Heading level={2}>Quick entry</Heading><p>Log time for today</p></div></div>
            <div className="form-grid">
              <label className="field field--wide"><span>Project</span><div className="fake-select">Nova implementation <Icon name="arrow" size={14} /></div></label>
              <label className="field"><span>Date</span><TextInput defaultValue="Fri, Jun 14" /></label>
              <label className="field"><span>Hours</span><TextInput defaultValue="2.0" /></label>
              <label className="field field--wide"><span>Description</span><TextInput placeholder="What did you work on?" /></label>
              <label className="toggle field--wide"><span className="toggle-switch is-on"><i /></span>Billable</label>
            </div>
            <Button className="primary-button compact full">Save entry</Button>
          </article>
        </div>
      </section>
    </>
  );
}

function WeeklySummary() {
  const rows = [
    { project: "Nova implementation", account: "Nordic Solutions", hours: [4.5, 0, 3, 0, 0], billable: true },
    { project: "CRM migration", account: "TechVision AB", hours: [3.5, 6, 0, 0, 0], billable: true },
    { project: "Digital platform 2.0", account: "Bright Digital", hours: [0, 0, 4, 8.5, 0], billable: true },
    { project: "Internal enablement", account: "Sirocco", hours: [0, 1.5, 1, 0, 0], billable: false },
  ];
  const days = ["Mon 10", "Tue 11", "Wed 12", "Thu 13", "Fri 14"];
  const dayTotals = days.map((_, index) => rows.reduce((sum, row) => sum + row.hours[index], 0));
  const total = dayTotals.reduce((sum, value) => sum + value, 0);
  const billable = rows.filter((row) => row.billable).reduce((sum, row) => sum + row.hours.reduce((a, b) => a + b, 0), 0);
  const billablePct = Math.round((billable / total) * 100);
  return (
    <>
      <section className="stat-grid">
        <StatCard accent="sand" change="+2.5 h" icon="clock" label="Logged this week" note="vs. last week" value={`${total.toFixed(1)} h`} />
        <StatCard accent="green" change="+4%" icon="trend" label="Billable share" note="vs. last week" value={`${billablePct}%`} />
        <StatCard accent="navy" change="4 projects" icon="projects" label="Projects worked on" note="this week" value="4" />
        <StatCard accent="amber" change="8.0 h" icon="bell" label="Left to log" note="due Friday 17:00" value="8.0 h" />
      </section>
      <section className="panel table-panel">
        <div className="panel-heading">
          <div className="week-nav">
            <Button aria-label="Previous week" className="icon-button small"><Icon name="arrow" size={15} /></Button>
            <div><Heading level={2}>Week 24 · Jun 10 – 14</Heading><p>Draft · not yet submitted</p></div>
            <Button aria-label="Next week" className="icon-button small"><Icon name="arrow" size={15} /></Button>
          </div>
          <Button className="primary-button compact"><Icon name="check" size={16} /> Submit week</Button>
        </div>
        <div className="table-scroll"><table className="timesheet">
          <thead><tr><th>Project</th>{days.map((day) => <th key={day}>{day}</th>)}<th>Total</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.project}>
                <td><span className="case-cell"><strong>{row.project}</strong><small>{row.account} · {row.billable ? "Billable" : "Internal"}</small></span></td>
                {row.hours.map((value, index) => <td className={value ? "" : "is-empty"} key={days[index]}>{value ? value.toFixed(1) : "–"}</td>)}
                <td><strong>{row.hours.reduce((a, b) => a + b, 0).toFixed(1)}</strong></td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><td>Daily total</td>{dayTotals.map((value, index) => <td className={value >= 8 ? "is-met" : "is-short"} key={days[index]}>{value.toFixed(1)}</td>)}<td>{total.toFixed(1)} / 40</td></tr></tfoot>
        </table></div>
        <div className="split">
          <div className="split-bar"><span style={{ width: `${billablePct}%` }} /></div>
          <div className="split-legend"><span><i className="dot dot--sand" />Billable {billable.toFixed(1)} h</span><span><i className="dot dot--muted" />Internal {(total - billable).toFixed(1)} h</span></div>
        </div>
      </section>
    </>
  );
}

const approvalItems = [
  { id: 1, type: "Timesheets", name: "Oliver Nyström", initials: "ON", title: "Week 24 timesheet", detail: "38.5 h · 36.0 h billable", project: "Nova implementation", age: "2 h ago" },
  { id: 2, type: "Timesheets", name: "Viktor Larsson", initials: "VL", title: "Week 24 timesheet", detail: "40.0 h · 34.0 h billable", project: "Digital platform 2.0", age: "5 h ago" },
  { id: 3, type: "Timesheets", name: "Sara Ahmed", initials: "SA", title: "Week 24 timesheet", detail: "31.5 h · 22.0 h billable", project: "Service portal", age: "1 d ago", flag: "Below 40 h target" },
  { id: 4, type: "Expenses", name: "Maja Karlsson", initials: "MK", title: "Train Stockholm–Gothenburg", detail: "SEK 1,240 · receipt attached", project: "CRM migration", age: "3 h ago" },
  { id: 5, type: "Expenses", name: "Oliver Nyström", initials: "ON", title: "Client dinner, Nordic Solutions", detail: "SEK 3,860 · receipt attached", project: "Nordic Solutions pursuit", age: "1 d ago", flag: "Above SEK 3,000 policy" },
  { id: 6, type: "Absence", name: "Noah Berg", initials: "NB", title: "Vacation, Jul 8 – 19", detail: "10 working days", project: "Service desk", age: "2 d ago" },
];

function Approvals() {
  const [tab, setTab] = useState("All");
  const [decided, setDecided] = useState<Record<number, "Approved" | "Rejected">>({});
  const tabs = ["All", "Timesheets", "Expenses", "Absence"];
  const visible = approvalItems.filter((item) => tab === "All" || item.type === tab);
  const pending = approvalItems.filter((item) => !decided[item.id]).length;
  return (
    <>
      <section className="stat-grid stat-grid--three">
        <StatCard accent="amber" change="+2" icon="bell" label="Waiting for you" note="since yesterday" value={String(pending)} />
        <StatCard accent="sand" change="92 h billable" icon="clock" label="Hours to approve" note="this week" value="110 h" />
        <StatCard accent="navy" change="2 receipts" icon="sales" label="Expenses to approve" note="attached" value="SEK 5,100" />
      </section>
      <section className="panel list-panel">
        <div className="panel-heading">
          <div className="tabs" role="tablist">
            {tabs.map((name) => (
              <Button aria-selected={tab === name} className={`tab ${tab === name ? "is-active" : ""}`} key={name} onClick={() => setTab(name)} role="tab">
                {name}<span>{name === "All" ? approvalItems.length : approvalItems.filter((item) => item.type === name).length}</span>
              </Button>
            ))}
          </div>
          <Button className="secondary-button">Approve all timesheets</Button>
        </div>
        <div className="approval-list">
          {visible.map((item) => (
            <article className={`approval ${decided[item.id] ? "is-decided" : ""}`} key={item.id}>
              <span className="avatar">{item.initials}</span>
              <span className="approval-copy">
                <strong>{item.name} <span>· {item.title}</span></strong>
                <small>{item.detail} · {item.project} · {item.age}</small>
              </span>
              {item.flag && <Badge tone="amber">{item.flag}</Badge>}
              <Badge tone={item.type === "Timesheets" ? "sand" : item.type === "Expenses" ? "violet" : "slate"}>{item.type.replace(/s$/, "")}</Badge>
              {decided[item.id] ? (
                <Badge tone={decided[item.id] === "Approved" ? "green" : "red"}>{decided[item.id]}</Badge>
              ) : (
                <span className="approval-actions">
                  <Button className="secondary-button" onClick={() => setDecided({ ...decided, [item.id]: "Rejected" })}>Reject</Button>
                  <Button className="primary-button compact" onClick={() => setDecided({ ...decided, [item.id]: "Approved" })}><Icon name="check" size={15} /> Approve</Button>
                </span>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

type Account = {
  id: string;
  name: string;
  industry: string;
  city: string;
  website: string;
  employees: string;
  owner: string;
  status: "Customer" | "Prospect" | "At risk";
  since: string;
  revenue: string;
  pipeline: string;
};

const accounts: Account[] = [
  { id: "nordic", name: "Nordic Solutions", industry: "IT services", city: "Stockholm", website: "nordicsolutions.se", employees: "450", owner: "Philip O.", status: "Customer", since: "2021", revenue: "SEK 3.2m", pipeline: "SEK 1.24m" },
  { id: "techvision", name: "TechVision AB", industry: "Software", city: "Gothenburg", website: "techvision.se", employees: "220", owner: "Philip O.", status: "Customer", since: "2022", revenue: "SEK 1.9m", pipeline: "SEK 850k" },
  { id: "bright", name: "Bright Digital", industry: "E-commerce", city: "Malmö", website: "brightdigital.se", employees: "85", owner: "Oliver N.", status: "Customer", since: "2023", revenue: "SEK 940k", pipeline: "SEK 450k" },
  { id: "forma", name: "Forma Studio", industry: "Architecture", city: "Stockholm", website: "formastudio.se", employees: "40", owner: "Philip O.", status: "Prospect", since: "–", revenue: "–", pipeline: "SEK 320k" },
  { id: "medica", name: "Medica Nord", industry: "Healthcare", city: "Uppsala", website: "medicanord.se", employees: "1,200", owner: "Philip O.", status: "Customer", since: "2020", revenue: "SEK 4.6m", pipeline: "–" },
  { id: "polar", name: "Polar Energy", industry: "Energy", city: "Luleå", website: "polarenergy.se", employees: "610", owner: "Oliver N.", status: "At risk", since: "2019", revenue: "SEK 2.1m", pipeline: "–" },
  { id: "atlas", name: "Atlas Logistics", industry: "Logistics", city: "Gothenburg", website: "atlaslogistics.se", employees: "380", owner: "Maja K.", status: "Prospect", since: "–", revenue: "–", pipeline: "–" },
];

const accountTone: Record<Account["status"], string> = { Customer: "green", Prospect: "sand", "At risk": "red" };

type Contact = { name: string; title: string; account: string; email: string; phone: string; role: string; last: string };

const contacts: Contact[] = [
  { name: "Anna Lind", title: "CFO", account: "Nordic Solutions", email: "anna.lind@nordicsolutions.se", phone: "+46 70 214 33 10", role: "Economic Buyer", last: "Jun 3" },
  { name: "Sofia Lind", title: "VP Operations", account: "Nordic Solutions", email: "sofia.lind@nordicsolutions.se", phone: "+46 70 552 18 04", role: "Champion", last: "Jun 12" },
  { name: "Johan Ek", title: "IT Manager", account: "Nordic Solutions", email: "johan.ek@nordicsolutions.se", phone: "+46 73 118 40 22", role: "Technical evaluator", last: "May 28" },
  { name: "Marcus Holm", title: "IT Director", account: "TechVision AB", email: "marcus.holm@techvision.se", phone: "+46 31 700 12 45", role: "Champion", last: "Jun 13" },
  { name: "Peter Ek", title: "CIO", account: "TechVision AB", email: "peter.ek@techvision.se", phone: "+46 31 700 12 00", role: "Economic Buyer", last: "Not met" },
  { name: "Anna Berg", title: "Head of Digital", account: "Bright Digital", email: "anna.berg@brightdigital.se", phone: "+46 40 612 77 30", role: "Champion", last: "Jun 11" },
  { name: "Erik Sand", title: "Operations Lead", account: "Forma Studio", email: "erik.sand@formastudio.se", phone: "+46 70 901 23 56", role: "Contact", last: "Jun 7" },
  { name: "Lina Persson", title: "CEO", account: "Forma Studio", email: "lina.persson@formastudio.se", phone: "+46 70 330 98 12", role: "Economic Buyer", last: "Not met" },
  { name: "David Nilsson", title: "CTO", account: "Medica Nord", email: "david.nilsson@medicanord.se", phone: "+46 18 450 66 01", role: "Decision maker", last: "Jun 12" },
  { name: "Karin Dahl", title: "Procurement Manager", account: "Atlas Logistics", email: "karin.dahl@atlaslogistics.se", phone: "+46 31 800 45 19", role: "Procurement", last: "Jun 10" },
];

const roleTone = (role: string) => (role === "Economic Buyer" ? "sand" : role === "Champion" ? "green" : "slate");
const initialsOf = (name: string) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

function SearchField({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="search-field">
      <Icon name="search" size={16} />
      <TextInput aria-label={placeholder} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} />
    </label>
  );
}

function Accounts({ deals, onOpenDeal }: { deals: Deal[]; onOpenDeal: (id: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const account = accounts.find((item) => item.id === selected);
  if (account) return <AccountDetail account={account} deals={deals} onBack={() => setSelected(null)} onOpenDeal={onOpenDeal} />;

  const filters = ["All", "Customer", "Prospect", "At risk"];
  const visible = accounts.filter(
    (item) => (filter === "All" || item.status === filter) && item.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <section className="stat-grid">
        <StatCard accent="navy" change="+3" icon="building" label="Accounts" value="128" />
        <StatCard accent="green" change="+2" icon="check" label="Active customers" value="94" />
        <StatCard accent="sand" change="+12.1%" icon="sales" label="Open pipeline" value="SEK 4.8m" />
        <StatCard accent="red" change="+1" icon="bell" label="At risk" value="3" />
      </section>
      <section className="panel table-panel">
        <div className="toolbar toolbar--inline">
          <div className="chips">
            {filters.map((name) => (
              <Button className={`chip ${filter === name ? "is-active" : ""}`} key={name} onClick={() => setFilter(name)}>
                {name === "All" ? "All accounts" : name}<span>{name === "All" ? accounts.length : accounts.filter((item) => item.status === name).length}</span>
              </Button>
            ))}
          </div>
          <div className="toolbar-actions">
            <SearchField onChange={setQuery} placeholder="Search accounts" value={query} />
            <Button className="primary-button compact"><Icon name="plus" size={17} /> New account</Button>
          </div>
        </div>
        <div className="table-scroll"><table>
          <thead><tr><th>Account</th><th>Industry</th><th>City</th><th>Owner</th><th>Status</th><th>Open pipeline</th><th>Revenue 12m</th></tr></thead>
          <tbody>
            {visible.map((item) => (
              <tr className="is-clickable" key={item.id} onClick={() => setSelected(item.id)}>
                <td><span className="company-cell"><span className="company-logo">{item.name.slice(0, 2).toUpperCase()}</span><span className="case-cell"><strong>{item.name}</strong><small>{item.website}</small></span></span></td>
                <td>{item.industry}</td><td>{item.city}</td><td>{item.owner}</td>
                <td><Badge tone={accountTone[item.status]}>{item.status}</Badge></td>
                <td><strong>{item.pipeline}</strong></td><td>{item.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </section>
    </>
  );
}

function AccountDetail({ account, deals, onBack, onOpenDeal }: { account: Account; deals: Deal[]; onBack: () => void; onOpenDeal: (id: string) => void }) {
  const accountDeals = deals.filter((deal) => deal.account === account.name);
  const accountProjects = projects.filter((project) => project.account === account.name);
  const accountCases = cases.filter((item) => item.account === account.name);
  const accountContacts = contacts.filter((contact) => contact.account === account.name);
  const timeline = [
    { icon: "phone" as IconName, title: "Call with " + (accountContacts[0]?.name ?? "main contact"), meta: "Philip O. · Jun 13", text: "Walked through next steps and timeline for the decision." },
    { icon: "mail" as IconName, title: "Proposal sent", meta: "Philip O. · Jun 10", text: "Updated proposal including business case and implementation plan." },
    { icon: "calendar" as IconName, title: "Workshop held", meta: "Oliver N. · Jun 5", text: "Requirements workshop with operations and IT, 6 participants." },
    { icon: "service" as IconName, title: "Service case resolved", meta: "Noah B. · May 30", text: "Export issue fixed and confirmed by the customer." },
  ];
  return (
    <>
      <Button className="back-link" onClick={onBack}><Icon name="arrow" size={15} /> All accounts</Button>
      <section className="account-hero">
        <span className="company-logo company-logo--large">{account.name.slice(0, 2).toUpperCase()}</span>
        <div className="account-hero-copy">
          <div className="account-hero-title"><Heading level={2}>{account.name}</Heading><Badge tone={accountTone[account.status]}>{account.status}</Badge></div>
          <p>{account.industry} · {account.city} · {account.employees} employees · {account.website}</p>
          <div className="account-hero-meta">
            <span><small>Account owner</small><strong>{account.owner}</strong></span>
            <span><small>Customer since</small><strong>{account.since}</strong></span>
            <span><small>Revenue 12m</small><strong>{account.revenue}</strong></span>
          </div>
        </div>
        <div className="account-hero-actions">
          <Button className="secondary-button"><Icon name="calendar" size={15} /> Log activity</Button>
          <Button className="primary-button compact"><Icon name="plus" size={16} /> New opportunity</Button>
        </div>
      </section>
      <section className="two-col detail-grid">
        <div className="side-stack">
          <article className="panel list-panel">
            <div className="panel-heading"><div><Heading level={2}>Opportunities</Heading><p>Open deals and MEDDPICC health</p></div></div>
            <div className="mini-list">
              {accountDeals.length === 0 && <p className="empty-note">No open opportunities.</p>}
              {accountDeals.map((deal) => {
                const health = dealHealth(deal);
                return (
                  <Button className="mini-row" key={deal.id} onClick={() => onOpenDeal(deal.id)}>
                    <span className="mini-copy"><strong>{deal.name}</strong><small>{deal.value} · close {deal.close}</small></span>
                    <Badge tone={healthTone(health)}>{health}% health</Badge>
                    <Icon name="arrow" size={15} />
                  </Button>
                );
              })}
            </div>
          </article>
          <article className="panel list-panel">
            <div className="panel-heading"><div><Heading level={2}>Projects</Heading><p>Delivery for this customer</p></div></div>
            <div className="mini-list">
              {accountProjects.length === 0 && <p className="empty-note">No projects yet.</p>}
              {accountProjects.map((project) => (
                <div className="mini-row" key={project.name}>
                  <span className="mini-copy"><strong>{project.name}</strong><small>{project.phase} · due {project.due}</small></span>
                  <span className="mini-progress"><span className="progress"><span style={{ width: `${project.progress}%` }} /></span><small>{project.progress}%</small></span>
                  <Badge tone={project.tone}>{project.status}</Badge>
                </div>
              ))}
            </div>
          </article>
          <article className="panel list-panel">
            <div className="panel-heading"><div><Heading level={2}>Service cases</Heading><p>Open support requests</p></div></div>
            <div className="mini-list">
              {accountCases.length === 0 && <p className="empty-note">No open cases.</p>}
              {accountCases.map((item) => (
                <div className="mini-row" key={item.id}>
                  <span className="mini-copy"><strong>{item.title}</strong><small>{item.id} · {item.owner} · {item.age}</small></span>
                  <Badge tone={item.tone}>{item.priority}</Badge>
                </div>
              ))}
            </div>
          </article>
        </div>
        <div className="side-stack">
          <article className="panel list-panel">
            <div className="panel-heading"><div><Heading level={2}>Contacts</Heading><p>{accountContacts.length} people</p></div><Button aria-label="Add contact" className="small-add"><Icon name="plus" size={16} /></Button></div>
            <div className="mini-list">
              {accountContacts.length === 0 && <p className="empty-note">No contacts yet.</p>}
              {accountContacts.map((contact) => (
                <div className="mini-row" key={contact.name}>
                  <span className="avatar avatar--small">{initialsOf(contact.name)}</span>
                  <span className="mini-copy"><strong>{contact.name}</strong><small>{contact.title}</small></span>
                  <Badge tone={roleTone(contact.role)}>{contact.role}</Badge>
                </div>
              ))}
            </div>
          </article>
          <article className="panel list-panel">
            <div className="panel-heading"><div><Heading level={2}>Activity</Heading><p>Latest interactions</p></div></div>
            <div className="timeline">
              {timeline.map((item) => (
                <div className="timeline-item" key={item.title}>
                  <span className="timeline-icon"><Icon name={item.icon} size={14} /></span>
                  <div><strong>{item.title}</strong><small>{item.meta}</small><p>{item.text}</p></div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

function Contacts() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(contacts[0].name);
  const visible = contacts.filter((contact) => `${contact.name} ${contact.account} ${contact.title}`.toLowerCase().includes(query.toLowerCase()));
  const contact = contacts.find((item) => item.name === selected) ?? contacts[0];
  return (
    <section className="two-col">
      <article className="panel table-panel table-panel--flush">
        <div className="toolbar toolbar--inline">
          <SearchField onChange={setQuery} placeholder="Search name, company or title" value={query} />
          <Button className="primary-button compact"><Icon name="plus" size={17} /> New contact</Button>
        </div>
        <div className="table-scroll"><table>
          <thead><tr><th>Name</th><th>Account</th><th>Buying role</th><th>Last contact</th></tr></thead>
          <tbody>
            {visible.map((item) => (
              <tr className={`is-clickable ${item.name === contact.name ? "is-selected" : ""}`} key={item.name} onClick={() => setSelected(item.name)}>
                <td><span className="company-cell"><span className="avatar avatar--small">{initialsOf(item.name)}</span><span className="case-cell"><strong>{item.name}</strong><small>{item.title}</small></span></span></td>
                <td>{item.account}</td>
                <td><Badge tone={roleTone(item.role)}>{item.role}</Badge></td>
                <td className={item.last === "Not met" ? "is-warning" : ""}>{item.last}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </article>
      <article className="panel contact-card">
        <span className="avatar avatar--xl">{initialsOf(contact.name)}</span>
        <Heading level={2}>{contact.name}</Heading>
        <p>{contact.title} · {contact.account}</p>
        <Badge tone={roleTone(contact.role)}>{contact.role}</Badge>
        <div className="contact-actions">
          <Button className="secondary-button"><Icon name="mail" size={15} /> Email</Button>
          <Button className="secondary-button"><Icon name="phone" size={15} /> Call</Button>
          <Button className="secondary-button"><Icon name="calendar" size={15} /> Meet</Button>
        </div>
        <div className="info-rows">
          <div><Icon name="mail" size={15} /><span><small>Email</small>{contact.email}</span></div>
          <div><Icon name="phone" size={15} /><span><small>Phone</small>{contact.phone}</span></div>
          <div><Icon name="building" size={15} /><span><small>Account</small>{contact.account}</span></div>
          <div><Icon name="clock" size={15} /><span><small>Last contact</small>{contact.last}</span></div>
        </div>
        <div className="contact-note">
          <small>Latest note</small>
          <p>{contact.last === "Not met" ? "Not met yet. Ask the champion for an introduction." : `Spoke ${contact.last}. Interested in the next workshop and wants a summary by email.`}</p>
        </div>
      </article>
    </section>
  );
}

const leads = [
  { company: "Vinga Retail", person: "Emma Sjö", title: "COO", source: "Website", value: "SEK 400k", score: 72, stage: "New", age: "2 h" },
  { company: "Kronan Bygg", person: "Ali Hassan", title: "IT Manager", source: "Event", value: "SEK 300k", score: 64, stage: "New", age: "1 d" },
  { company: "Fjord Analytics", person: "Nora Lund", title: "CEO", source: "LinkedIn", value: "SEK 250k", score: 51, stage: "New", age: "3 d" },
  { company: "Atlas Logistics", person: "Karin Dahl", title: "Procurement Manager", source: "Referral", value: "SEK 900k", score: 81, stage: "Contacted", age: "4 d" },
  { company: "Hav & Land", person: "Oskar Berg", title: "CFO", source: "Website", value: "SEK 180k", score: 43, stage: "Contacted", age: "1 w" },
  { company: "Medica Nord", person: "David Nilsson", title: "CTO", source: "Partner", value: "SEK 1.1m", score: 88, stage: "Qualified", age: "1 w" },
  { company: "Polar Energy", person: "Sara Holm", title: "Head of Customer Service", source: "Webinar", value: "SEK 520k", score: 76, stage: "Qualified", age: "2 w" },
  { company: "Forma Studio", person: "Erik Sand", title: "Operations Lead", source: "Website", value: "SEK 320k", score: 70, stage: "Converted", age: "3 w" },
];

function Leads() {
  const stages = [
    { name: "New", hint: "Respond within 24 h" },
    { name: "Contacted", hint: "First conversation held" },
    { name: "Qualified", hint: "Ready to become an opportunity" },
    { name: "Converted", hint: "Moved to the pipeline" },
  ];
  return (
    <>
      <section className="stat-grid">
        <StatCard accent="sand" change="+5" icon="lead" label="New leads this week" note="vs. last week" value="12" />
        <StatCard accent="green" change="+3.2%" icon="trend" label="Lead to opportunity" value="24%" />
        <StatCard accent="navy" change="-40 min" icon="clock" label="Avg. first response" value="3.1 h" />
        <StatCard accent="amber" change="41%" icon="dashboard" label="Top source" note="of all leads" value="Website" />
      </section>
      <section className="kanban">
        {stages.map((stage) => {
          const items = leads.filter((lead) => lead.stage === stage.name);
          return (
            <div className="kanban-col" key={stage.name}>
              <div className="kanban-head"><strong>{stage.name}</strong><span>{items.length}</span><small>{stage.hint}</small></div>
              {items.map((lead) => (
                <article className={`lead-card ${stage.name === "Converted" ? "is-converted" : ""}`} key={lead.company}>
                  <div className="lead-top"><span className="company-logo">{lead.company.slice(0, 2).toUpperCase()}</span><span className={`lead-score lead-score--${lead.score >= 75 ? "hot" : lead.score >= 55 ? "warm" : "cold"}`}>{lead.score}</span></div>
                  <strong>{lead.company}</strong>
                  <p>{lead.person} · {lead.title}</p>
                  <div className="lead-meta"><Badge tone="slate">{lead.source}</Badge><span>{lead.value}</span></div>
                  <div className="lead-foot">
                    <small>{lead.age} ago</small>
                    {stage.name === "Qualified" && <Button className="text-button">Convert <Icon name="arrow" size={14} /></Button>}
                    {stage.name === "Converted" && <Badge tone="green">In pipeline</Badge>}
                  </div>
                </article>
              ))}
            </div>
          );
        })}
      </section>
    </>
  );
}

type CalendarEvent = { day: number; start: number; end: number; title: string; account: string; type: "call" | "meeting" | "task" | "internal" };

const calendarEvents: CalendarEvent[] = [
  { day: 0, start: 9, end: 10, title: "Weekly sales meeting", account: "Sirocco", type: "internal" },
  { day: 0, start: 13, end: 14.5, title: "Data migration workshop", account: "Nordic Solutions", type: "meeting" },
  { day: 0, start: 15.5, end: 16, title: "Follow-up call", account: "Atlas Logistics", type: "call" },
  { day: 1, start: 10, end: 12, title: "SAP integration testing", account: "TechVision AB", type: "meeting" },
  { day: 1, start: 14, end: 14.5, title: "Lead call", account: "Vinga Retail", type: "call" },
  { day: 1, start: 16, end: 16.5, title: "Send proposal", account: "Bright Digital", type: "task" },
  { day: 2, start: 9, end: 10.5, title: "Steering group prep", account: "Nordic Solutions", type: "meeting" },
  { day: 2, start: 11, end: 12, title: "Sprint planning", account: "Bright Digital", type: "meeting" },
  { day: 2, start: 15, end: 16, title: "Product demo", account: "Medica Nord", type: "meeting" },
  { day: 3, start: 10, end: 10.5, title: "Call with Peter Ek, CIO", account: "TechVision AB", type: "call" },
  { day: 3, start: 13, end: 15, title: "Discovery workshop", account: "Forma Studio", type: "meeting" },
  { day: 3, start: 16, end: 16.5, title: "Pipeline review", account: "Sirocco", type: "internal" },
  { day: 4, start: 9.5, end: 10, title: "Economic buyer call", account: "Nordic Solutions", type: "call" },
  { day: 4, start: 11, end: 12, title: "Decision criteria review", account: "TechVision AB", type: "meeting" },
  { day: 4, start: 13.5, end: 14, title: "Nova project check-in", account: "Nordic Solutions", type: "meeting" },
  { day: 4, start: 15, end: 15.5, title: "Renew agreement", account: "Bright Digital", type: "task" },
];

const formatHour = (value: number) => `${String(Math.floor(value)).padStart(2, "0")}:${value % 1 ? "30" : "00"}`;

function Activities() {
  const [done, setDone] = useState<Record<string, boolean>>({ "Update CRM notes from workshop": true });
  const days = ["Mon 10", "Tue 11", "Wed 12", "Thu 13", "Fri 14"];
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16];
  const hourHeight = 64;
  const tasks = [
    ["Send business case to Anna Lind", "Nordic Solutions", "Today"],
    ["Book intro meeting with Peter Ek", "TechVision AB", "Today"],
    ["Update CRM notes from workshop", "Forma Studio", "Today"],
    ["Prepare renewal offer", "Bright Digital", "Tomorrow"],
    ["Reply to new website lead", "Vinga Retail", "Jun 17"],
  ];
  return (
    <section className="two-col activities-layout">
      <article className="panel calendar-panel">
        <div className="panel-heading">
          <div className="week-nav">
            <Button aria-label="Previous week" className="icon-button small"><Icon name="arrow" size={15} /></Button>
            <div><Heading level={2}>June 10 – 14</Heading><p>{calendarEvents.length} activities this week</p></div>
            <Button aria-label="Next week" className="icon-button small"><Icon name="arrow" size={15} /></Button>
          </div>
          <div className="cal-legend">
            {["call", "meeting", "task", "internal"].map((type) => <span key={type}><i className={`cal-dot cal-dot--${type}`} />{type[0].toUpperCase() + type.slice(1)}</span>)}
          </div>
        </div>
        <div className="calendar-scroll">
          <div className="calendar">
            <div className="cal-corner" />
            {days.map((day, index) => <div className={`cal-day-head ${index === 4 ? "is-today" : ""}`} key={day}>{day}</div>)}
            <div className="cal-hours">{hours.map((hour) => <span key={hour} style={{ height: hourHeight }}>{formatHour(hour)}</span>)}</div>
            {days.map((day, dayIndex) => (
              <div className={`cal-day ${dayIndex === 4 ? "is-today" : ""}`} key={day} style={{ height: hours.length * hourHeight }}>
                {calendarEvents.filter((event) => event.day === dayIndex).map((event) => (
                  <div
                    className={`cal-event cal-event--${event.type} ${event.end - event.start <= 0.5 ? "is-short" : ""}`}
                    key={event.title}
                    style={{ top: (event.start - 8) * hourHeight + 2, height: (event.end - event.start) * hourHeight - 4 }}
                    title={`${formatHour(event.start)} ${event.title} · ${event.account}`}
                  >
                    {event.end - event.start <= 0.5 ? (
                      <strong><span>{formatHour(event.start)}</span> {event.title}</strong>
                    ) : (
                      <>
                        <strong>{event.title}</strong>
                        <small>{formatHour(event.start)} · {event.account}</small>
                      </>
                    )}
                  </div>
                ))}
                {dayIndex === 4 && <span className="now-line" style={{ top: (10.4 - 8) * hourHeight }} />}
              </div>
            ))}
          </div>
        </div>
      </article>
      <div className="side-stack">
        <article className="panel list-panel">
          <div className="panel-heading"><div><Heading level={2}>Tasks</Heading><p>{tasks.filter(([title]) => !done[title]).length} open</p></div><Button aria-label="Add task" className="small-add"><Icon name="plus" size={16} /></Button></div>
          <div className="task-checklist">
            {tasks.map(([title, account, due]) => (
              <Button className={`check-row ${done[title] ? "is-done" : ""}`} key={title} onClick={() => setDone({ ...done, [title]: !done[title] })}>
                <span className="checkbox">{done[title] && <Icon name="check" size={12} />}</span>
                <span className="mini-copy"><strong>{title}</strong><small>{account}</small></span>
                <Badge tone={due === "Today" ? "amber" : "slate"}>{due}</Badge>
              </Button>
            ))}
          </div>
        </article>
        <article className="panel list-panel">
          <div className="panel-heading"><div><Heading level={2}>Synced from Outlook</Heading><p>Meetings logged to accounts automatically</p></div></div>
          <div className="sync-note"><Icon name="check" size={15} /><span><strong>14 meetings logged this week</strong><small>Last sync 4 min ago</small></span></div>
        </article>
      </div>
    </section>
  );
}

const users = [
  { name: "Philip Oxelius", email: "philip.oxelius@siroccogroup.com", role: "Admin", status: "Active", last: "Now" },
  { name: "Oliver Nyström", email: "oliver.nystrom@siroccogroup.com", role: "Manager", status: "Active", last: "12 min ago" },
  { name: "Maja Karlsson", email: "maja.karlsson@siroccogroup.com", role: "Manager", status: "Active", last: "1 h ago" },
  { name: "Viktor Larsson", email: "viktor.larsson@siroccogroup.com", role: "Consultant", status: "Active", last: "3 h ago" },
  { name: "Sara Ahmed", email: "sara.ahmed@siroccogroup.com", role: "Consultant", status: "Active", last: "Yesterday" },
  { name: "Noah Berg", email: "noah.berg@siroccogroup.com", role: "Support", status: "Active", last: "Yesterday" },
  { name: "Lisa Ek", email: "lisa.ek@siroccogroup.com", role: "Sales", status: "Invited", last: "–" },
];

const integrations = [
  { name: "Microsoft Dynamics 365", short: "D365", text: "Sync accounts, contacts and opportunities", connected: true, meta: "Last sync 4 min ago" },
  { name: "Outlook", short: "OL", text: "Log emails and calendar meetings to accounts", connected: true, meta: "14 meetings logged this week" },
  { name: "Microsoft Teams", short: "MT", text: "Notifications and meeting notes", connected: true, meta: "Posting to #sales" },
  { name: "SharePoint", short: "SP", text: "Documents per account and project", connected: false, meta: "Not connected" },
  { name: "Finance system", short: "FS", text: "Invoices and project costs", connected: false, meta: "Not connected" },
  { name: "Power BI", short: "BI", text: "Reporting dashboards", connected: false, meta: "Not connected" },
];

function Settings() {
  const [tab, setTab] = useState("Profile");
  const [connected, setConnected] = useState<Record<string, boolean>>(() => Object.fromEntries(integrations.map((item) => [item.name, item.connected])));
  const [notify, setNotify] = useState<Record<string, boolean>>({ Approvals: true, Mentions: true, "Daily digest": false, "Deal health drops": true });
  const roles = [
    { name: "Admin", count: 1, text: "Full access, users and integrations" },
    { name: "Manager", count: 2, text: "Approvals, budgets and capacity" },
    { name: "Sales", count: 1, text: "Accounts, leads and pipeline" },
    { name: "Consultant", count: 2, text: "Time, projects and own tasks" },
    { name: "Support", count: 1, text: "Service cases and contacts" },
  ];
  return (
    <>
      <div className="tabs tabs--page" role="tablist">
        {["Profile", "Users & roles", "Integrations"].map((name) => (
          <Button aria-selected={tab === name} className={`tab ${tab === name ? "is-active" : ""}`} key={name} onClick={() => setTab(name)} role="tab">{name}</Button>
        ))}
      </div>

      {tab === "Profile" && (
        <section className="two-col">
          <article className="panel form-panel">
            <div className="profile-hero">
              <span className="avatar avatar--xl">PO</span>
              <div><Heading level={2}>Philip Oxelius</Heading><p>Sales Director · Admin</p></div>
              <Button className="secondary-button">Change photo</Button>
            </div>
            <div className="form-grid">
              <label className="field"><span>First name</span><TextInput defaultValue="Philip" /></label>
              <label className="field"><span>Last name</span><TextInput defaultValue="Oxelius" /></label>
              <label className="field field--wide"><span>Email</span><TextInput defaultValue="philip.oxelius@siroccogroup.com" /></label>
              <label className="field"><span>Title</span><TextInput defaultValue="Sales Director" /></label>
              <label className="field"><span>Office</span><div className="fake-select">Stockholm <Icon name="arrow" size={14} /></div></label>
              <label className="field"><span>Language</span><div className="fake-select">English <Icon name="arrow" size={14} /></div></label>
              <label className="field"><span>Time zone</span><div className="fake-select">Europe/Stockholm <Icon name="arrow" size={14} /></div></label>
            </div>
            <Button className="primary-button compact">Save changes</Button>
          </article>
          <article className="panel form-panel">
            <div className="panel-heading"><div><Heading level={2}>Notifications</Heading><p>Choose what you hear about</p></div></div>
            <div className="toggle-list">
              {Object.keys(notify).map((name) => (
                <Button className="toggle-row" key={name} onClick={() => setNotify({ ...notify, [name]: !notify[name] })}>
                  <span>{name}</span>
                  <span className={`toggle-switch ${notify[name] ? "is-on" : ""}`}><i /></span>
                </Button>
              ))}
            </div>
          </article>
        </section>
      )}

      {tab === "Users & roles" && (
        <>
          <section className="role-grid">
            {roles.map((role) => (
              <article className="role-card" key={role.name}><strong>{role.name}</strong><span>{role.count} {role.count === 1 ? "user" : "users"}</span><small>{role.text}</small></article>
            ))}
          </section>
          <section className="panel table-panel">
            <div className="panel-heading"><div><Heading level={2}>Users</Heading><p>{users.length} people in this workspace</p></div><Button className="primary-button compact"><Icon name="plus" size={17} /> Invite user</Button></div>
            <div className="table-scroll"><table>
              <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Last active</th><th /></tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email}>
                    <td><span className="company-cell"><span className="avatar avatar--small">{initialsOf(user.name)}</span><span className="case-cell"><strong>{user.name}</strong><small>{user.email}</small></span></span></td>
                    <td><span className="role-select">{user.role} <Icon name="arrow" size={12} /></span></td>
                    <td><Badge tone={user.status === "Active" ? "green" : "amber"}>{user.status}</Badge></td>
                    <td>{user.last}</td>
                    <td><Button className="text-button">Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </section>
        </>
      )}

      {tab === "Integrations" && (
        <section className="integration-grid">
          {integrations.map((item) => (
            <article className={`integration-card ${connected[item.name] ? "is-connected" : ""}`} key={item.name}>
              <div className="integration-top">
                <span className="integration-logo">{item.short}</span>
                <Badge tone={connected[item.name] ? "green" : "slate"}>{connected[item.name] ? "Connected" : "Not connected"}</Badge>
              </div>
              <Heading level={3}>{item.name}</Heading>
              <p>{item.text}</p>
              <div className="integration-foot">
                <small>{connected[item.name] ? (item.connected ? item.meta : "Connected just now") : "Not connected"}</small>
                <Button className={connected[item.name] ? "secondary-button" : "primary-button compact"} onClick={() => setConnected({ ...connected, [item.name]: !connected[item.name] })}>
                  {connected[item.name] ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [deals, setDeals] = useState(initialDeals);
  const [dealId, setDealId] = useState(initialDeals[0].id);

  const openDeal = (id: string) => {
    setDealId(id);
    setPage("sales");
  };
  const updateCriterion = (id: string, key: CriterionKey, patch: Partial<Criterion>) =>
    setDeals((current) =>
      current.map((deal) => (deal.id === id ? { ...deal, criteria: { ...deal.criteria, [key]: { ...deal.criteria[key], ...patch } } } : deal)),
    );

  let content: ReactNode = <Dashboard deals={deals} onOpenDeal={openDeal} />;
  if (page === "sales") content = <Sales dealId={dealId} deals={deals} onSelect={setDealId} onUpdate={updateCriterion} />;
  else if (page === "projects") content = <Projects />;
  else if (page === "budgets") content = <Budgets />;
  else if (page === "resources") content = <Resources />;
  else if (page === "utilization") content = <Utilization />;
  else if (page === "service") content = <Service />;
  else if (page === "time") content = <TimeEntries />;
  else if (page === "weekly") content = <WeeklySummary />;
  else if (page === "approvals") content = <Approvals />;
  else if (page === "accounts") content = <Accounts deals={deals} onOpenDeal={openDeal} />;
  else if (page === "contacts") content = <Contacts />;
  else if (page === "leads") content = <Leads />;
  else if (page === "activities") content = <Activities />;
  else if (page === "settings") content = <Settings />;

  return (
    <div className="app-shell">
      <Sidebar onChange={setPage} onClose={() => setMenuOpen(false)} open={menuOpen} page={page} />
      <main className="main">
        <Topbar onMenu={() => setMenuOpen(true)} page={page} />
        <div className="content">{content}</div>
      </main>
    </div>
  );
}
