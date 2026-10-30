import { Fragment, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
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
  | "summary"
  | "approvals"
  | "hours"
  | "finance"
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
  summary: { title: "Time summary", eyebrow: "My work · your own time" },
  approvals: { title: "Approvals", eyebrow: "Team" },
  hours: { title: "Hours overview", eyebrow: "Finance · who has reported their time" },
  finance: { title: "Finance dashboard", eyebrow: "Finance · the month at a glance" },
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
      { id: "summary", label: "Time summary" },
      { id: "approvals", label: "Approvals" },
    ],
  },
  {
    label: "Finance",
    items: [
      { id: "finance", label: "Finance dashboard", icon: "sales" },
      { id: "hours", label: "Hours overview", icon: "trend" },
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

// A simulated Teams or email message, shown under the bell so the demo can show what people actually receive.
type Notice = { channel: "Teams" | "Email"; at: string; text: string; page?: Page };

function Topbar({ page, onMenu, notices = [], onOpen }: { page: Page; onMenu: () => void; notices?: Notice[]; onOpen?: (page: Page) => void }) {
  const [open, setOpen] = useState(false);
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
        <span className="notice-wrap">
          <Button aria-expanded={open} aria-label="Notifications" className="icon-button notification" onClick={() => setOpen(!open)}>
            <Icon name="bell" size={19} />
            {notices.length > 0 && <span />}
          </Button>
          {open && (
            <div className="notice-list" role="dialog" aria-label="Notifications">
              <strong>Sent to you</strong>
              {notices.length ? (
                notices.map((notice) => (
                  <button
                    key={notice.at + notice.text}
                    onClick={() => {
                      if (notice.page) onOpen?.(notice.page);
                      setOpen(false);
                    }}
                    type="button"
                  >
                    <small>{notice.channel} · {fmtWhen(notice.at)}</small>
                    <span>{notice.text}</span>
                  </button>
                ))
              ) : (
                <p>Nothing new.</p>
              )}
            </div>
          )}
        </span>
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
              <div className="project-footer"><span className="mini-person"><Avatar initials={project.manager} name={team.find((person) => person.initials === project.manager)?.name ?? project.manager} size="tiny" />Project manager</span><strong>Due {project.due}</strong></div>
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
              <div className="team-head"><Avatar initials={person.initials} name={person.name} size="large" /><span className="availability-dot" /></div>
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
                    <td><span className="company-cell"><Avatar initials={person.initials} name={person.name} size="small" /><span className="case-cell"><strong>{person.name}</strong><small>{person.role}</small></span></span></td>
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

// Time entries: the consultant's own week (F12-S04 to S07).
// The demo is pinned to Fri 30 Oct 2026 (the review day) so the seeded weeks line up with "today".
// Time types and billable defaults follow ADR-004 (Zephyr repo, docs/data/time_types.seed.json).
// Design rule: the common case needs no choices. 96–97% of hours are Client Work and most people log on one project a
// month, so customer rows have no type to pick. Rare things (task, customer text, overtime) only show up where they apply,
// in a small popover on the cell, and one banner at a time nudges the next step.

type TimeTypeCode =
  | "client_work"
  | "overtime"
  | "internal_project"
  | "internal_development"
  | "presales_support"
  | "support"
  | "customer_outreach"
  | "resource_assignment_sales"
  | "travel"
  | "vacation"
  | "absence";
type TimeType = { code: TimeTypeCode; name: string; billable: boolean; needsProject: boolean; futureOk: boolean };
type ProjectKind = "client" | "internal";
// support: a support contract, so its time is Support without anyone choosing it (Dynamics has the project types
// Standard, Support and Migration). tasks: only a few projects use tasks (3 of 52 in Dynamics, Jul–Sep 2026).
// customerText: the customer wants a text on every entry. overtimeRate: the customer pays for ordered overtime.
// home: where internal types land when there's no specific internal project.
type TimeProject = {
  id: string;
  name: string;
  account: string;
  kind: ProjectKind;
  pm: string;
  closed?: boolean;
  home?: boolean;
  support?: boolean;
  tasks?: string[];
  customerText?: boolean;
  overtimeRate?: number;
};
type EntryStatus = "draft" | "submitted" | "approved" | "rejected";
type TimeEntry = {
  id: number;
  date: string;
  project: string | null;
  type: TimeTypeCode;
  minutes: number;
  comment: string;
  status: EntryStatus;
  pmComment?: string;
  task?: string;
  customerText?: string;
  outsideHours?: boolean;
  preApprovedBy?: string;
  history?: EntryEvent[];
};
// Who did what to an entry, and when. "You" is the signed-in consultant.
type EntryEvent = { at: string; by: string; text: string; kind: string };
type TimeRow = { key: string; project: string | null; type: TimeTypeCode; assigned?: boolean; preApprovedBy?: string };
type TimeModal = "copy" | "absence" | "submit" | "addRow" | "guide" | "request" | "overtime" | "change" | "actions" | null;
type ChangeRequest = { month: string; reason: string; at: string };
// The consultant's time lives in the app, so Time entries and Time summary show the same entries.
type TimeData = {
  entries: TimeEntry[];
  setEntries: (entries: TimeEntry[]) => void;
  weekStart: string;
  setWeekStart: (monday: string) => void;
  requests: ChangeRequest[];
  onRequest: (request: ChangeRequest) => void;
};
type TimeSheet = { row: TimeRow; date: string; hours: string; comment: string; customerText: string; task: string; outsideHours: boolean; error: string };
type TimePopover = { row: string; date: string; left: number; top?: number; bottom?: number };

const TODAY = "2026-10-30";
const standardDay = 8 * 60;
const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The 11 types from ADR-004. Only Client Work and Overtime are billable by default.
// Vacation and Absence need no project and can be submitted ahead of the day. Other types can be planned ahead as drafts
// (34 of 69 people did that in Dynamics, Aug–Oct 2026), but are only submitted once the day has come.
// Travel stays in the data (1 entry ever in Dynamics) but isn't offered anywhere.
const timeTypes: TimeType[] = [
  { code: "client_work", name: "Client Work", billable: true, needsProject: true, futureOk: false },
  { code: "overtime", name: "Overtime", billable: true, needsProject: true, futureOk: false },
  { code: "internal_project", name: "Internal Project", billable: false, needsProject: true, futureOk: false },
  { code: "internal_development", name: "Internal Development", billable: false, needsProject: true, futureOk: false },
  { code: "presales_support", name: "Presales Support", billable: false, needsProject: true, futureOk: false },
  { code: "support", name: "Support", billable: false, needsProject: true, futureOk: false },
  { code: "customer_outreach", name: "Customer Outreach", billable: false, needsProject: true, futureOk: false },
  { code: "resource_assignment_sales", name: "Resource Assignment Sales", billable: false, needsProject: true, futureOk: false },
  { code: "travel", name: "Travel", billable: false, needsProject: true, futureOk: false },
  { code: "vacation", name: "Vacation", billable: false, needsProject: false, futureOk: true },
  { code: "absence", name: "Absence", billable: false, needsProject: false, futureOk: true },
];
const internalTypes: TimeTypeCode[] = ["internal_development", "presales_support", "customer_outreach", "internal_project", "resource_assignment_sales"];
// One line per type, shown where the type is picked, so nobody needs the policy text to choose.
const typeHelp: Partial<Record<TimeTypeCode, string>> = {
  internal_development: "Courses and certifications",
  presales_support: "Helping sales with an offer or a pitch",
  customer_outreach: "Contacting customers to find new work",
  internal_project: "Work on an internal project",
  resource_assignment_sales: "Between assignments, helping sales place you",
  vacation: "Approved vacation",
  absence: "Sick, care of a child, a doctor's visit",
};

const timeProjects: TimeProject[] = [
  { id: "nova", name: "Nova implementation", account: "Nordic Solutions", kind: "client", pm: "Johanna S.", overtimeRate: 2400 },
  { id: "crm", name: "CRM migration", account: "TechVision AB", kind: "client", pm: "Mikael K.", tasks: ["Discovery", "Build", "Test", "Go-live"], customerText: true },
  { id: "digital", name: "Digital platform 2.0", account: "Bright Digital", kind: "client", pm: "Sofia L." },
  { id: "portal", name: "Service portal", account: "Forma Studio", kind: "client", pm: "Sofia L.", closed: true },
  { id: "desk", name: "Service desk", account: "Nordic Solutions", kind: "client", pm: "Mikael K.", support: true },
  { id: "dataplatform", name: "Data platform", account: "Klinte Logistik AB", kind: "client", pm: "Sofia L." },
  { id: "internal", name: "Internal hours", account: "Sirocco", kind: "internal", pm: "Mikael K.", home: true },
];

// The consultant's team assignments (F11). People only log time on projects they've been added to (Henry, 29 Oct).
// A closed project or an ended assignment gives no row.
const myAssignments: { project: string; type: TimeTypeCode; ends: string | null }[] = [
  { project: "nova", type: "client_work", ends: null },
  { project: "crm", type: "client_work", ends: null },
  { project: "portal", type: "client_work", ends: null },
  { project: "digital", type: "client_work", ends: "2026-09-30" },
];

const overtimeApprovers = ["Johanna S.", "Mikael K.", "Sofia L.", "BO"];

const seed = (date: string, project: string | null, type: TimeTypeCode, hours: number, status: EntryStatus, extra: Partial<TimeEntry> = {}) => ({
  date,
  project,
  type,
  minutes: hours * 60,
  status,
  comment: "",
  ...extra,
});

const initialTimeEntries: TimeEntry[] = [
  // Weeks 40–42: approved (week 40 spans the locked September and October)
  ...["2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02", "2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09"].map((date) =>
    seed(date, "nova", "client_work", 8, "approved"),
  ),
  ...["2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15", "2026-10-16"].map((date) => seed(date, "nova", "client_work", 8, "approved")),
  // Week 43: Monday off, Wednesday rejected by the PM, Saturday overtime for a go-live, the rest waiting for approval
  seed("2026-10-19", null, "vacation", 8, "approved"),
  seed("2026-10-20", "nova", "client_work", 8, "approved"),
  seed("2026-10-21", "nova", "client_work", 8, "rejected", { pmComment: "Wrong project. Wednesday was the CRM migration workshop. /Johanna, PM" }),
  seed("2026-10-22", "crm", "client_work", 8, "submitted", { task: "Build", customerText: "Integration tests with SAP" }),
  seed("2026-10-23", "crm", "client_work", 6, "submitted", { task: "Build", customerText: "Fixed field mapping defects" }),
  seed("2026-10-23", "internal", "internal_development", 2, "submitted", { comment: "Azure certification, module 3" }),
  seed("2026-10-24", "nova", "overtime", 3, "submitted", { comment: "Go-live cutover", preApprovedBy: "Johanna S." }),
  // Week 44, this week: drafts up to Wednesday, today still empty. The CRM entry still lacks its customer text.
  seed("2026-10-26", "nova", "client_work", 8, "draft"),
  seed("2026-10-27", "nova", "client_work", 4, "draft", { comment: "Workshop prep" }),
  seed("2026-10-27", "crm", "client_work", 4, "draft", { task: "Test", customerText: "Test planning with the customer's admins" }),
  seed("2026-10-28", "nova", "client_work", 7.5, "draft"),
  seed("2026-10-28", "crm", "internal_development", 0.5, "draft", { comment: "Salesforce admin course the customer asked for" }),
].map((entry, index) => ({ ...entry, id: index + 1 }));

const statusLabel: Record<EntryStatus, string> = { draft: "Draft", submitted: "Submitted", approved: "Approved", rejected: "Rejected" };

const typeOf = (code: TimeTypeCode) => timeTypes.find((item) => item.code === code) ?? timeTypes[0];
const projectOf = (id: string | null) => timeProjects.find((item) => item.id === id);
const defaultType = (project: TimeProject): TimeTypeCode => (project.kind === "internal" ? "internal_project" : project.support ? "support" : "client_work");
const rowKey = (project: string | null, type: TimeTypeCode) => `${project ?? "none"}|${type}`;
const rowName = (row: TimeRow) => {
  const project = projectOf(row.project);
  return !project || project.home ? typeOf(row.type).name : project.name;
};
const rowSub = (row: TimeRow) => {
  const project = projectOf(row.project);
  if (!project) return "Time away";
  if (project.home) return "Internal";
  if (row.type === "overtime") return `Overtime · pre-approved by ${row.preApprovedBy ?? "?"}`;
  if (project.kind === "internal") return typeOf(row.type).name;
  return row.type === "client_work" ? project.account : `${project.account} · ${typeOf(row.type).name}`;
};
const cellId = (row: string, date: string) => `${row}@${date}`;
const isEditable = (entry?: TimeEntry) => !entry || entry.status === "draft" || entry.status === "rejected";
const sumMinutes = (list: TimeEntry[]) => list.reduce((sum, entry) => sum + entry.minutes, 0);
const nextId = (list: TimeEntry[]) => Math.max(0, ...list.map((entry) => entry.id)) + 1;
const fmtH = (minutes: number) => String(Math.round((minutes / 60) * 100) / 100);
const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;
const lastTask = (list: TimeEntry[], project: string | null) =>
  [...list].filter((entry) => entry.project === project && entry.task).sort((a, b) => b.date.localeCompare(a.date))[0]?.task;

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
function addDays(iso: string, days: number) {
  const date = toDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
const dayIndex = (iso: string) => (toDate(iso).getUTCDay() + 6) % 7;
const mondayOf = (iso: string) => addDays(iso, -dayIndex(iso));
const isWeekend = (iso: string) => dayIndex(iso) > 4;
const weekDates = (monday: string) => Array.from({ length: 7 }, (_, index) => addDays(monday, index));
function isoWeek(iso: string) {
  const thursday = toDate(addDays(mondayOf(iso), 3));
  return Math.floor((thursday.getTime() - Date.UTC(thursday.getUTCFullYear(), 0, 1)) / 86400000 / 7) + 1;
}
const shortDate = (iso: string) => `${toDate(iso).getUTCDate()} ${monthNames[toDate(iso).getUTCMonth()]}`;
const fmtDay = (iso: string) => `${dayNames[dayIndex(iso)].slice(0, 3)} ${shortDate(iso)}`;
const fmtLongDay = (iso: string) => `${dayNames[dayIndex(iso)]} ${shortDate(iso)}`;

// Swedish public holidays on weekdays, plus the eves that are days off (Dynamics' hour summaries use a list like this).
// Other countries need their own list before go-live (ADR-004).
const holidays = new Set([
  "2025-12-24", "2025-12-25", "2025-12-26", "2025-12-31",
  "2026-01-01", "2026-01-06", "2026-04-03", "2026-04-06", "2026-05-01", "2026-05-14", "2026-06-19", "2026-12-24", "2026-12-25", "2026-12-31",
  "2027-01-01", "2027-01-06",
]);
const isHoliday = (date: string) => holidays.has(date);
// The signed-in consultant's working pattern. A part-timer has fewer days, or fewer minutes a day, and is never nudged for the rest.
const workPattern = { days: [0, 1, 2, 3, 4], minutesPerDay: 8 * 60 };
const expectedOn = (date: string) => (workPattern.days.includes(dayIndex(date)) && !isHoliday(date) ? workPattern.minutesPerDay : 0);
const longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthOf = (date: string) => date.slice(0, 7);
const monthTitle = (month: string) => `${longMonths[Number(month.slice(5, 7)) - 1]} ${month.slice(0, 4)}`;
const monthName = (month: string) => longMonths[Number(month.slice(5, 7)) - 1];
const nextMonth = (month: string) => monthOf(addDays(`${month}-28`, 7));
// Month close: hours are due by the 2nd of the next month (ADR-004), so the month locks automatically when that day ends,
// or when the next working day ends if the 2nd is a weekend or a public holiday. Changes after that go through Finance.
function monthDeadline(month: string) {
  let date = `${nextMonth(month)}-02`;
  while (isWeekend(date) || isHoliday(date)) date = addDays(date, 1);
  return date;
}
const isMonthLocked = (month: string) => TODAY > monthDeadline(month);

function omit<T>(record: Record<string, T>, key: string) {
  const next = { ...record };
  delete next[key];
  return next;
}

// Accepts 7.5 and 7,5. Same rules as TimeEntryRules in the Zephyr repo: 15-minute steps, at most 24 h.
function parseHours(text: string): { minutes: number } | { error: string } {
  const clean = text.trim().replace(",", ".");
  if (!clean) return { minutes: 0 };
  const value = Number(clean);
  if (!Number.isFinite(value) || value < 0) return { error: "Enter hours as a number, e.g. 7.5 or 7,5." };
  const minutes = Math.round(value * 60);
  if (minutes % 15) return { error: "Use 15-minute steps, e.g. 7.25 or 7.5." };
  if (minutes > 24 * 60) return { error: "One entry can't be more than 24 h." };
  return { minutes };
}

function cellLock(entry: TimeEntry | undefined, type: TimeTypeCode, date: string) {
  if (entry?.status === "submitted") return "Submitted, waiting for approval";
  if (entry?.status === "approved") return "Approved and locked";
  if (isMonthLocked(monthOf(date))) return `${monthName(monthOf(date))} is locked`;
  return "";
}

// What an entry still needs before it can be submitted. Saving is never blocked, only submitting.
function entryIssues(entry: TimeEntry) {
  const project = projectOf(entry.project);
  const issues: string[] = [];
  // Task and customer text belong to billable time; a course on a customer project needs neither.
  const billable = typeOf(entry.type).billable;
  if (billable && project?.tasks && !entry.task) issues.push("a task");
  if (billable && project?.customerText && !entry.customerText?.trim()) issues.push(`a text for ${project.account}`);
  // Sirocco's overtime policy: only work outside ordinary hours counts. Weekends always are; weekdays must be confirmed.
  if (entry.type === "overtime" && !isWeekend(entry.date) && !entry.outsideHours) issues.push("confirmation that it was outside ordinary hours");
  return issues;
}

// The button says what to do, not just "fix it".
const fixLabel = (issue: string) => (issue === "a task" ? "Pick a task" : issue.startsWith("a text") ? "Add the text" : "Confirm it");

function weekStatus(list: TimeEntry[]) {
  if (!list.length) return { label: "Nothing logged", tone: "slate" };
  if (list.some((entry) => entry.status === "rejected")) return { label: "Needs changes", tone: "red" };
  if (list.some((entry) => entry.status === "draft")) {
    const rest = list.some((entry) => entry.status === "approved") ? " · partly approved" : list.some((entry) => entry.status === "submitted") ? " · partly submitted" : "";
    return { label: `Draft${rest}`, tone: "sand" };
  }
  if (list.every((entry) => entry.status === "approved")) return { label: "Approved", tone: "green" };
  if (list.some((entry) => entry.status === "approved")) return { label: "Partly approved", tone: "violet" };
  return { label: "Submitted", tone: "blue" };
}

function activeAssignments(monday: string) {
  return myAssignments.filter((item) => !projectOf(item.project)?.closed && (!item.ends || item.ends >= monday));
}

// Rows: active assignments first, then rows that already have time this week, then rows added by hand.
function rowsForWeek(monday: string, weekEntries: TimeEntry[], added: TimeRow[]) {
  const rows = new Map<string, TimeRow>();
  for (const item of activeAssignments(monday)) {
    const key = rowKey(item.project, item.type);
    rows.set(key, { key, project: item.project, type: item.type, assigned: true });
  }
  const order = (code: TimeTypeCode) => timeTypes.findIndex((item) => item.code === code);
  for (const entry of [...weekEntries].sort((a, b) => order(a.type) - order(b.type))) {
    const key = rowKey(entry.project, entry.type);
    if (!rows.has(key)) rows.set(key, { key, project: entry.project, type: entry.type, preApprovedBy: entry.preApprovedBy });
  }
  for (const row of added) if (!rows.has(row.key)) rows.set(row.key, row);
  return [...rows.values()];
}

function useNarrow(query = "(max-width: 767px)") {
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setNarrow(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return narrow;
}

// History for seeded entries, derived from their status: logged on the day, submitted on the Friday, and approved or sent
// back by the project's PM the Monday after. Entries changed in the demo keep a real history from then on.
function entryHistory(entry: TimeEntry): EntryEvent[] {
  if (entry.history) return entry.history;
  const friday = addDays(mondayOf(entry.date), 4);
  const pm = projectOf(entry.project)?.pm ?? "Your manager";
  const events: EntryEvent[] = [{ at: entry.date, by: "You", text: `Logged ${fmtH(entry.minutes)} h`, kind: "logged" }];
  if (entry.status !== "draft") events.push({ at: friday < entry.date ? entry.date : friday, by: "You", text: "Submitted", kind: "status" });
  if (entry.status === "approved") events.push({ at: addDays(friday, 3), by: pm, text: "Approved", kind: "status" });
  if (entry.status === "rejected") events.push({ at: addDays(friday, 3), by: pm, text: `Sent back: ${entry.pmComment ?? "see comment"}`, kind: "status" });
  return events;
}

const statusChange: Record<string, string> = {
  "draft>submitted": "Submitted",
  "rejected>submitted": "Submitted again",
  "submitted>draft": "Recalled",
  "rejected>draft": "Recalled",
};

// Compares the entries before and after a change and adds what happened to each entry's history. Typing in a text
// field updates the last event of the same kind in the same minute instead of adding one per keystroke.
function withHistory(before: TimeEntry[], after: TimeEntry[]): TimeEntry[] {
  const old = new Map(before.map((entry) => [entry.id, entry]));
  const now = new Date();
  const at = `${TODAY}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return after.map((entry) => {
    const was = old.get(entry.id);
    const events: Omit<EntryEvent, "at" | "by">[] = [];
    if (!was) events.push({ text: `Logged ${fmtH(entry.minutes)} h`, kind: "logged" });
    else {
      if (was.minutes !== entry.minutes) events.push({ text: `Changed ${fmtH(was.minutes)} → ${fmtH(entry.minutes)} h`, kind: "hours" });
      if (was.status !== entry.status) events.push({ text: statusChange[`${was.status}>${entry.status}`] ?? `Status: ${entry.status}`, kind: "status" });
      if ((was.customerText ?? "") !== (entry.customerText ?? "")) events.push({ text: entry.customerText ? `Customer text: "${entry.customerText}"` : "Customer text removed", kind: "customerText" });
      if ((was.task ?? "") !== (entry.task ?? "")) events.push({ text: entry.task ? `Task: ${entry.task}` : "Task removed", kind: "task" });
      if (was.comment !== entry.comment) events.push({ text: entry.comment ? `Comment: "${entry.comment}"` : "Comment removed", kind: "comment" });
      if (!!was.outsideHours !== !!entry.outsideHours) events.push({ text: entry.outsideHours ? "Confirmed outside ordinary hours" : "Outside ordinary hours unticked", kind: "outsideHours" });
    }
    if (!events.length) return entry;
    const history = [...(was ? entryHistory(was) : [])];
    for (const event of events) {
      const last = history[history.length - 1];
      if (last && last.kind === event.kind && last.at === at && event.kind !== "status") history[history.length - 1] = { ...event, at, by: "You" };
      else history.push({ ...event, at, by: "You" });
    }
    return { ...entry, history };
  });
}

const fmtWhen = (at: string) => `${fmtDay(at.slice(0, 10))}${at.length > 10 ? ` ${at.slice(11)}` : ""}`;

function TimeEntries({ entries, setEntries: saveEntries, weekStart, setWeekStart, requests, onRequest }: TimeData) {
  // Every change to the entries goes through here, so each entry keeps its own history.
  const setEntries = (next: TimeEntry[]) => saveEntries(withHistory(entries, next));
  const narrow = useNarrow();
  const [addedRows, setAddedRows] = useState<Record<string, TimeRow[]>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modal, setModal] = useState<TimeModal>(null);
  const [sheet, setSheet] = useState<TimeSheet | null>(null);
  const [pop, setPop] = useState<TimePopover | null>(null);
  const [toast, setToast] = useState("");
  const [saved, setSaved] = useState(false);
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const [focusRow, setFocusRow] = useState("");
  const [copyHours, setCopyHours] = useState(false);
  const [absence, setAbsence] = useState({ type: "vacation" as TimeTypeCode, from: TODAY, to: TODAY, hours: "8", error: "" });
  const [request, setRequest] = useState({ query: "", project: "" });
  const [overtime, setOvertime] = useState({ project: "", approver: "", ordered: false });
  const [change, setChange] = useState({ month: "", reason: "", error: "" });
  const [mobileDay, setMobileDay] = useState(TODAY);
  const tableRef = useRef<HTMLTableElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  const dates = weekDates(weekStart);
  const inWeek = entries.filter((entry) => entry.date >= dates[0] && entry.date <= dates[6]);
  const rows = rowsForWeek(weekStart, inWeek, addedRows[weekStart] ?? []);
  const total = sumMinutes(inWeek);
  const status = weekStatus(inWeek);
  // Drafts in a locked month stay as they are; Finance sees them, nobody submits them late by accident.
  const open = inWeek.filter((entry) => (entry.status === "draft" || entry.status === "rejected") && !isMonthLocked(monthOf(entry.date)));
  // Days ahead can be planned, but only time that has happened is submitted (vacation and absence excepted).
  const isPlanned = (entry: TimeEntry) => entry.date > TODAY && !typeOf(entry.type).futureOk;
  const toSubmit = open.filter((entry) => !isPlanned(entry));
  const planned = open.filter(isPlanned);
  const weekExpected = dates.reduce((sum, date) => sum + expectedOn(date), 0);
  const lockedMonths = [...new Set(dates.map(monthOf))].filter(isMonthLocked);
  const openMonth = [...new Set(dates.map(monthOf))].find((month) => !isMonthLocked(month));
  const closesSoon = openMonth && monthDeadline(openMonth) <= addDays(TODAY, 7) ? ` ${monthName(openMonth)} closes ${fmtDay(monthDeadline(openMonth))}.` : "";
  const canRecall = inWeek.some((entry) => entry.status === "submitted");
  const weekLabel = `Week ${isoWeek(weekStart)}`;
  const rangeLabel = `${shortDate(dates[0])} – ${shortDate(dates[6])}`;
  const day = dates.includes(mobileDay) ? mobileDay : dates[0];
  const myProjects = activeAssignments(weekStart)
    .map((item) => projectOf(item.project))
    .filter((item): item is TimeProject => !!item && !item.home);
  const homeProject = timeProjects.find((item) => item.home);

  const entryAt = (row: TimeRow, date: string) => inWeek.find((entry) => entry.date === date && rowKey(entry.project, entry.type) === row.key);
  const rowOf = (entry: TimeEntry) => rows.find((row) => row.key === rowKey(entry.project, entry.type));
  const dayMinutes = (date: string) => sumMinutes(inWeek.filter((entry) => entry.date === date));
  const dayTone = (minutes: number) => (minutes > 24 * 60 ? "is-error" : minutes > 10 * 60 ? "is-warn" : minutes >= standardDay ? "is-met" : "");
  const recentTexts = (project: string | null, except?: number) =>
    [...new Set(entries.filter((entry) => entry.project === project && entry.customerText && entry.id !== except).sort((a, b) => b.date.localeCompare(a.date)).map((entry) => entry.customerText as string))].slice(0, 3);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!modal && !sheet && !pop) return;
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setModal(null);
      setSheet(null);
      setPop(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [modal, sheet, pop]);

  // The popover closes on a click outside it or when the page scrolls, like any menu.
  useEffect(() => {
    if (!pop) return;
    const outside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!popRef.current?.contains(target) && !target.closest(".tw-cell-more")) setPop(null);
    };
    const scrolled = (event: Event) => {
      if (!popRef.current?.contains(event.target as Node)) setPop(null);
    };
    document.addEventListener("mousedown", outside);
    window.addEventListener("scroll", scrolled, true);
    return () => {
      document.removeEventListener("mousedown", outside);
      window.removeEventListener("scroll", scrolled, true);
    };
  }, [pop]);

  useEffect(() => {
    if (!focusRow) return;
    tableRef.current?.querySelector<HTMLInputElement>(`input[data-row="${focusRow}"]:not([tabindex="-1"])`)?.focus();
    setFocusRow("");
  }, [focusRow]);

  // New entries take the task used last on the project and the row's overtime pre-approval, so nobody types them twice.
  function writeCell(row: TimeRow, date: string, minutes: number, extra: Partial<TimeEntry> = {}) {
    const existing = entryAt(row, date);
    if (!isEditable(existing)) return;
    if (!minutes) setEntries(existing ? entries.filter((entry) => entry.id !== existing.id) : entries);
    else if (existing) setEntries(entries.map((entry) => (entry.id === existing.id ? { ...entry, ...extra, minutes, status: "draft" as EntryStatus } : entry)));
    else
      setEntries([
        ...entries,
        { id: nextId(entries), date, project: row.project, type: row.type, minutes, comment: "", status: "draft", task: lastTask(entries, row.project), preApprovedBy: row.preApprovedBy, ...extra },
      ]);
    setSaved(true);
  }

  function commitCell(row: TimeRow, date: string) {
    const id = cellId(row.key, date);
    const text = drafts[id];
    if (text === undefined) return;
    const parsed = parseHours(text);
    if ("error" in parsed) return setErrors({ ...errors, [id]: parsed.error });
    setDrafts(omit(drafts, id));
    setErrors(omit(errors, id));
    if ((entryAt(row, date)?.minutes ?? 0) !== parsed.minutes) writeCell(row, date, parsed.minutes);
  }

  function updateEntry(id: number, patch: Partial<TimeEntry>) {
    setEntries(entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
    setSaved(true);
  }

  function moveFocus(row: number, col: number, dRow: number, dCol: number) {
    for (let r = row + dRow, c = col + dCol; r >= 0 && r < rows.length && c >= 0 && c < 7; r += dRow, c += dCol) {
      const input = tableRef.current?.querySelector<HTMLInputElement>(`input[data-cell="${r}:${c}"]`);
      if (input && input.tabIndex !== -1) {
        input.focus();
        return true;
      }
    }
    return false;
  }

  // Tab and Shift+Tab work as usual; arrows move between cells and Enter moves down, like a spreadsheet.
  function onCellKey(event: ReactKeyboardEvent<HTMLInputElement>, row: number, col: number, id: string) {
    const input = event.currentTarget;
    if (event.key === "Escape") {
      setDrafts(omit(drafts, id));
      setErrors(omit(errors, id));
      return;
    }
    const moves: Record<string, [number, number] | undefined> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      Enter: [1, 0],
      ArrowLeft: input.selectionStart === 0 ? [0, -1] : undefined,
      ArrowRight: input.selectionEnd === input.value.length ? [0, 1] : undefined,
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    if (!moveFocus(row, col, ...move) && event.key === "Enter") {
      input.blur();
      input.focus();
    }
  }

  // Anchors the details popover under (or above) the cell, inside the window.
  function openPopover(row: string, date: string) {
    const cell = tableRef.current?.querySelector<HTMLElement>(`td[data-cell-id="${cellId(row, date)}"]`);
    if (!cell) return;
    const rect = cell.getBoundingClientRect();
    const left = Math.min(Math.max(8, rect.left + rect.width / 2 - 150), window.innerWidth - 308);
    const below = window.innerHeight - rect.bottom > 300;
    setPop(below ? { row, date, left, top: rect.bottom + 6 } : { row, date, left, bottom: window.innerHeight - rect.top + 6 });
  }

  // Takes you to an entry that needs something: the popover on a computer, the day sheet on a phone.
  function fixEntry(entry: TimeEntry) {
    setModal(null);
    const row = rowOf(entry);
    if (!row) return;
    if (narrow) {
      setMobileDay(entry.date);
      openSheet(row, entry.date);
      return;
    }
    const cell = tableRef.current?.querySelector<HTMLElement>(`td[data-cell-id="${cellId(row.key, entry.date)}"]`);
    cell?.scrollIntoView({ block: "center", behavior: "instant" as ScrollBehavior });
    window.setTimeout(() => openPopover(row.key, entry.date), 50);
  }

  // Most consultants bill whole days to one customer, so the banner fills the open weekdays on their usual project.
  function fillDays(row: TimeRow, days: string[]) {
    let next = entries;
    let filled = 0;
    for (const date of days) {
      const left = expectedOn(date) - sumMinutes(next.filter((entry) => entry.date === date));
      if (left <= 0) continue;
      const existing = next.find((entry) => entry.date === date && rowKey(entry.project, entry.type) === row.key);
      if (existing && !isEditable(existing)) continue;
      next = existing
        ? next.map((entry) => (entry.id === existing.id ? { ...entry, minutes: entry.minutes + left, status: "draft" as EntryStatus } : entry))
        : [...next, { id: nextId(next), date, project: row.project, type: row.type, minutes: left, comment: "", status: "draft", task: lastTask(entries, row.project) }];
      filled += left;
    }
    setEntries(next);
    setSaved(true);
    setToast(`Filled ${fmtH(filled)} h on ${rowName(row)}.`);
  }

  function copyLastWeek() {
    const lastStart = addDays(weekStart, -7);
    const last = entries.filter((entry) => entry.date >= lastStart && entry.date < weekStart);
    setModal(null);
    if (!last.length) return setToast(`Week ${isoWeek(lastStart)} is empty, so there was nothing to copy.`);
    // Vacation, absence and overtime are one-off: overtime needs its own pre-approval every time.
    const copyable = last.filter((entry) => typeOf(entry.type).needsProject && entry.type !== "overtime");
    const newRows: TimeRow[] = [];
    for (const entry of copyable) {
      const key = rowKey(entry.project, entry.type);
      if (!rows.some((row) => row.key === key) && !newRows.some((row) => row.key === key)) newRows.push({ key, project: entry.project, type: entry.type });
    }
    setAddedRows({ ...addedRows, [weekStart]: [...(addedRows[weekStart] ?? []), ...newRows] });
    let next = entries;
    let created = 0;
    let kept = 0;
    let ahead = 0;
    if (copyHours) {
      for (const entry of copyable) {
        const date = addDays(entry.date, 7);
        const key = rowKey(entry.project, entry.type);
        if (next.some((item) => item.date === date && rowKey(item.project, item.type) === key)) kept++;
        else if (cellLock(undefined, entry.type, date)) ahead++;
        else {
          next = [...next, { id: nextId(next), date, project: entry.project, type: entry.type, minutes: entry.minutes, comment: "", status: "draft", task: entry.task }];
          created++;
        }
      }
    }
    setEntries(next);
    if (created) setSaved(true);
    const rowCount = new Set(copyable.map((entry) => rowKey(entry.project, entry.type))).size;
    const parts = [`Copied ${plural(rowCount, "row", "rows")} from week ${isoWeek(lastStart)}${copyHours ? ` with ${plural(created, "entry", "entries")}` : ""}.`];
    if (copyable.length < last.length) parts.push("Vacation, absence and overtime aren't copied.");
    if (kept) parts.push(`${plural(kept, "cell you'd filled was", "cells you'd filled were")} kept.`);
    if (ahead) parts.push(`${plural(ahead, "day was", "days were")} left empty (in a locked month).`);
    setToast(parts.join(" "));
  }

  function openAbsence() {
    const start = dates.includes(TODAY) ? TODAY : weekStart;
    setAbsence({ type: "vacation", from: start, to: start, hours: "8", error: "" });
    setModal("absence");
  }

  function absenceDays() {
    const days: string[] = [];
    if (!absence.from || !absence.to || absence.from > absence.to) return days;
    for (let date = absence.from, guard = 0; date <= absence.to && guard < 400; date = addDays(date, 1), guard++)
      if (!isWeekend(date) && !isHoliday(date) && !isMonthLocked(monthOf(date))) days.push(date);
    return days;
  }

  function addAbsence() {
    const parsed = parseHours(absence.hours);
    const days = absenceDays();
    if (!absence.from || !absence.to || absence.from > absence.to) return setAbsence({ ...absence, error: "Pick a from date on or before the to date." });
    if ("error" in parsed || !parsed.minutes) return setAbsence({ ...absence, error: "error" in parsed ? parsed.error : "Enter the hours per day, e.g. 8, or 4 for half a day." });
    if (!days.length) return setAbsence({ ...absence, error: "Those dates are weekends, public holidays or in a locked month." });
    let next = entries;
    let created = 0;
    for (const date of days) {
      if (next.some((entry) => entry.date === date && entry.type === absence.type && entry.project === null)) continue;
      next = [...next, { id: nextId(next), date, project: null, type: absence.type, minutes: parsed.minutes, comment: "", status: "draft" }];
      created++;
    }
    setEntries(next);
    setModal(null);
    setSaved(true);
    const weeks = new Set(days.map(mondayOf)).size;
    setToast(
      `Added ${plural(created, "day", "days")} of ${typeOf(absence.type).name.toLowerCase()} (${fmtH(created * parsed.minutes)} h) as Draft${weeks > 1 ? ` across ${weeks} weeks` : ""}.` +
        (created < days.length ? " Days that already had it were kept." : ""),
    );
  }

  function openChange(month: string) {
    setChange({ month, reason: "", error: "" });
    setModal("change");
  }

  function sendChange() {
    if (change.reason.trim().length < 5) return setChange({ ...change, error: "Write what you need to change and why. Finance reads it before opening the month." });
    onRequest({ month: change.month, reason: change.reason.trim(), at: TODAY });
    setModal(null);
    setToast(`Finance has your request. You'll hear when ${monthName(change.month)} is open for you.`);
  }

  function submitWeek() {
    const ids = new Set(toSubmit.map((entry) => entry.id));
    setEntries(entries.map((entry) => (ids.has(entry.id) ? { ...entry, status: "submitted" as EntryStatus } : entry)));
    setModal(null);
    setToast(`${weekLabel} is submitted. Your project managers can now approve it.`);
  }

  function recallWeek() {
    const recalled = inWeek.filter((entry) => entry.status === "submitted");
    const ids = new Set(recalled.map((entry) => entry.id));
    setEntries(entries.map((entry) => (ids.has(entry.id) ? { ...entry, status: "draft" as EntryStatus } : entry)));
    setModal(null);
    setToast(`${plural(recalled.length, "entry is", "entries are")} back in Draft.${inWeek.some((entry) => entry.status === "approved") ? " Approved entries stay locked." : ""}`);
  }

  function addRow(row: TimeRow) {
    setAddedRows({ ...addedRows, [weekStart]: [...(addedRows[weekStart] ?? []), row] });
    setModal(null);
    if (!narrow) setFocusRow(row.key);
    else if (!cellLock(undefined, row.type, day)) openSheet(row, day);
  }

  function removeRow(row: TimeRow) {
    setAddedRows({ ...addedRows, [weekStart]: (addedRows[weekStart] ?? []).filter((item) => item.key !== row.key) });
  }

  function openOvertime() {
    const project = myProjects.find((item) => item.overtimeRate);
    setOvertime({ project: project?.id ?? "", approver: project?.pm ?? overtimeApprovers[0], ordered: false });
    setModal("overtime");
  }

  function openSheet(row: TimeRow, date: string) {
    const entry = entryAt(row, date);
    setSheet({
      row,
      date,
      hours: entry ? fmtH(entry.minutes) : "",
      comment: entry?.comment ?? "",
      customerText: entry?.customerText ?? "",
      task: entry?.task ?? lastTask(entries, row.project) ?? "",
      outsideHours: entry?.outsideHours ?? false,
      error: "",
    });
  }

  function saveSheet() {
    if (!sheet) return;
    const parsed = parseHours(sheet.hours);
    if ("error" in parsed) return setSheet({ ...sheet, error: parsed.error });
    writeCell(sheet.row, sheet.date, parsed.minutes, {
      comment: sheet.comment.trim(),
      customerText: sheet.customerText.trim() || undefined,
      task: sheet.task || undefined,
      outsideHours: sheet.outsideHours || undefined,
    });
    setSheet(null);
  }

  function goWeek(step: number) {
    setWeekStart(addDays(weekStart, step * 7));
    setMobileDay(addDays(day, step * 7));
    setPop(null);
  }

  function goDay(step: number) {
    const next = addDays(day, step);
    setMobileDay(next);
    setWeekStart(mondayOf(next));
  }

  function goToday() {
    setWeekStart(mondayOf(TODAY));
    setMobileDay(TODAY);
    setPop(null);
  }

  // Everything that stops the week from being submitted, one line per row and problem, each with the entry to fix.
  const needsWork = Object.values(
    toSubmit.reduce<Record<string, { text: string; count: number; entry: TimeEntry; issue: string }>>((groups, entry) => {
      for (const issue of entryIssues(entry)) {
        const project = projectOf(entry.project);
        const name = `${rowName({ key: "", project: entry.project, type: entry.type })}${project && !project.home && entry.type !== "client_work" ? ` (${typeOf(entry.type).name})` : ""}`;
        const key = `${name}|${issue}`;
        const group = groups[key] ?? { text: `${name} needs ${issue}`, count: 0, entry, issue };
        groups[key] = { ...group, count: group.count + 1 };
      }
      return groups;
    }, {}),
  );
  const blockers = [
    ...dates.filter((date) => dayMinutes(date) > 24 * 60).map((date) => `${fmtDay(date)} has ${fmtH(dayMinutes(date))} h. A day can't have more than 24 h.`),
    ...(Object.keys(errors).some((id) => dates.some((date) => id.endsWith(`@${date}`))) ? ["Some cells have a value that isn't saved. Fix the red cells first."] : []),
  ];
  const warnings = [
    ...dates.filter((date) => dayMinutes(date) > 10 * 60 && dayMinutes(date) <= 24 * 60).map((date) => `${fmtDay(date)} has ${fmtH(dayMinutes(date))} h, more than 10 h.`),
    ...(total < weekExpected ? [`${fmtH(total)} h is below the ${fmtH(weekExpected)} h expected this week.`] : []),
  ];

  // One nudge at a time, in this order: a rejection, missing details, open days to fill, ready to submit, up to date, done.
  const rejected = inWeek.find((entry) => entry.status === "rejected");
  const since = addDays(TODAY, -28);
  const usualRow = rows
    .filter((row) => projectOf(row.project)?.kind === "client" && row.type !== "overtime")
    .map((row) => ({ row, minutes: sumMinutes(entries.filter((entry) => rowKey(entry.project, entry.type) === row.key && entry.date >= since)) }))
    .sort((a, b) => b.minutes - a.minutes)[0]?.row;
  const openDays = dates.filter(
    (date) => expectedOn(date) > 0 && date <= TODAY && dayMinutes(date) < expectedOn(date) && !isMonthLocked(monthOf(date)) && !inWeek.some((entry) => entry.date === date && !isEditable(entry)),
  );
  const weekOver = addDays(weekStart, 4) <= TODAY;
  const banner: { tone: string; text: string; action?: string; run?: () => void; dismiss?: boolean } | null = (() => {
    if (dates.every((date) => isMonthLocked(monthOf(date)))) {
      const month = lockedMonths[lockedMonths.length - 1];
      const asked = requests.some((item) => item.month === month);
      return asked
        ? { tone: "slate", text: `${monthName(month)} is locked. Finance has your request to change it.` }
        : { tone: "slate", text: `${monthName(month)} is locked. Need to change something? Finance can open it for you.`, action: "Request a change", run: () => openChange(month) };
    }
    if (rejected) {
      const who = projectOf(rejected.project)?.pm ?? "Your PM";
      return { tone: "red", text: `${who} sent back ${fmtDay(rejected.date)}: “${rejected.pmComment ?? "see the comment"}”`, action: "Fix it", run: () => fixEntry(rejected) };
    }
    if (needsWork.length) {
      const first = needsWork[0];
      return { tone: "amber", text: `${first.text}${first.count > 1 ? ` on ${plural(first.count, "entry", "entries")}` : ` for ${fmtDay(first.entry.date)}`}.`, action: fixLabel(first.issue), run: () => fixEntry(first.entry) };
    }
    if (openDays.length && usualRow && !dismissed[weekStart]) {
      const when = openDays.length === 1 ? dayNames[dayIndex(openDays[0])] : `${openDays.length} days`;
      return { tone: "sand", text: `Your usual day is ${fmtH(workPattern.minutesPerDay)} h on ${rowName(usualRow)}.${closesSoon}`, action: `Fill ${when}`, run: () => fillDays(usualRow, openDays), dismiss: true };
    }
    if (!openDays.length && toSubmit.length && weekOver)
      return { tone: "sand", text: `Your week is complete. Submitting it lets your project managers approve it, so invoicing goes out on time.${closesSoon}`, action: "Submit week", run: () => setModal("submit") };
    if (!openDays.length && toSubmit.length) return { tone: "green", text: `You're up to date. The rest of the week is still open.${closesSoon}` };
    if (!toSubmit.length && planned.length)
      return { tone: "green", text: `Submitted up to today. ${fmtH(sumMinutes(planned))} h planned for later days stays a draft until the day has come.` };
    if (inWeek.length && !toSubmit.length)
      return { tone: "green", text: inWeek.every((entry) => entry.status === "approved") ? "Approved. Nothing left to do this week." : "Submitted. Your project managers approve it next." };
    if (usualRow && openDays.length) return null;
    // No customer assignment this week: everyone still logs their time, on Internal hours (the policy from the monthly mingle).
    if (openDays.length && !rows.some((row) => projectOf(row.project)?.kind === "client"))
      return { tone: "sand", text: "No customer assignment this week. Log your time on Internal hours and pick what you did.", action: "What do I log?", run: () => setModal("guide") };
    return { tone: "sand", text: inWeek.length ? `${plural(openDays.length, "day is", "days are")} still open.` : "Nothing logged this week yet.", action: "Add a row", run: () => setModal("addRow") };
  })();

  const absenceList = absenceDays();
  const absenceMinutes = parseHours(absence.hours);
  const assignedIds = new Set(activeAssignments(weekStart).map((item) => item.project));
  const requestQuery = request.query.trim().toLowerCase();
  const requestable = timeProjects
    .filter((item) => !item.closed && !item.home && !assignedIds.has(item.id))
    .filter((item) => !requestQuery || `${item.name} ${item.account}`.toLowerCase().includes(requestQuery));
  const overtimeProjects = myProjects.filter((item) => item.overtimeRate);

  const modalHead = (title: string, text: string, onClose = () => setModal(null)) => (
    <div className="panel-heading">
      <div><Heading level={2}>{title}</Heading>{text && <p>{text}</p>}</div>
      <Button aria-label="Close" className="icon-button small" onClick={onClose}><Icon name="close" size={15} /></Button>
    </div>
  );

  const modalBody = () => {
    if (modal === "addRow") {
      const projectsLeft = myProjects.filter((project) => !rows.some((row) => row.project === project.id));
      const customerProjects = myProjects.filter((project) => project.kind === "client");
      const internalLeft = homeProject ? internalTypes.filter((type) => !rows.some((row) => row.key === rowKey(homeProject.id, type))) : [];
      const awayLeft = (["vacation", "absence"] as TimeTypeCode[]).filter((type) => !rows.some((row) => row.key === rowKey(null, type)));
      const option = (key: string, title: string, sub: string, row: TimeRow) => (
        <button className="ar-item" key={key} onClick={() => addRow(row)} type="button">
          <strong>{title}</strong>
          {sub && <small>{sub}</small>}
        </button>
      );
      return (
        <>
          {modalHead("Add a row", "")}
          {projectsLeft.length > 0 && (
            <div className="ar-group">
              <h3>Your projects</h3>
              {projectsLeft.map((project) => {
                const type = myAssignments.find((item) => item.project === project.id)?.type ?? defaultType(project);
                return option(project.id, project.name, project.account, { key: rowKey(project.id, type), project: project.id, type });
              })}
            </div>
          )}
          {homeProject && internalLeft.length > 0 && (
            <div className="ar-group">
              <h3>Internal</h3>
              {internalLeft.map((type) =>
                type === "internal_development" && customerProjects.length ? (
                  <div className="ar-dev" key={type}>
                    {option(type, typeOf(type).name, typeHelp[type] ?? "", { key: rowKey(homeProject.id, type), project: homeProject.id, type })}
                    <span className="ar-dev-for">
                      Needed for an assignment?
                      {customerProjects
                        .filter((project) => !rows.some((row) => row.key === rowKey(project.id, type)))
                        .map((project) => (
                          <Button className="tw-link" key={project.id} onClick={() => addRow({ key: rowKey(project.id, type), project: project.id, type })}>{project.name}</Button>
                        ))}
                    </span>
                  </div>
                ) : (
                  option(type, typeOf(type).name, typeHelp[type] ?? "", { key: rowKey(homeProject.id, type), project: homeProject.id, type })
                ),
              )}
            </div>
          )}
          {awayLeft.length > 0 && (
            <div className="ar-group">
              <h3>Time away</h3>
              {awayLeft.map((type) => option(type, typeOf(type).name, typeHelp[type] ?? "", { key: rowKey(null, type), project: null, type }))}
            </div>
          )}
          <div className="ar-links">
            <Button className="text-button" onClick={() => setModal("guide")}>Not sure what to log?</Button>
            <Button className="text-button" onClick={() => { setRequest({ query: "", project: "" }); setModal("request"); }}>Can't find your project? Ask to be added</Button>
            {overtimeProjects.length > 0 && <Button className="text-button" onClick={openOvertime}>Customer-ordered overtime</Button>}
          </div>
        </>
      );
    }
    if (modal === "change")
      return (
        <>
          {modalHead(`Request a change to ${monthName(change.month)}`, "The month is locked. Finance opens it for you for a few days if they agree.")}
          <label className="field tw-search">
            <span>What do you need to change, and why?</span>
            <TextInput autoFocus maxLength={300} onChange={(event) => setChange({ ...change, reason: event.target.value, error: "" })} placeholder="e.g. Forgot 4 h on CRM migration on 28 Sep" value={change.reason} />
          </label>
          {change.error && <p className="form-message form-message--error" role="alert">{change.error}</p>}
          <Button className="primary-button compact full tw-confirm" onClick={sendChange}>Send to Finance</Button>
        </>
      );
    if (modal === "request") {
      const picked = projectOf(request.project);
      return (
        <>
          {modalHead("Ask to be added", "You can only log time on projects you're on. The project manager gets your request.", () => setModal("addRow"))}
          <label className="field tw-search">
            <span>Project or customer</span>
            <TextInput autoFocus onChange={(event) => setRequest({ query: event.target.value, project: "" })} placeholder="Type a few letters" value={request.query} />
          </label>
          <div className="tw-options">
            {requestable.length ? (
              requestable.slice(0, 8).map((project) => (
                <button className={`tw-option ${request.project === project.id ? "is-active" : ""}`} key={project.id} onClick={() => setRequest({ ...request, project: project.id })} type="button">
                  <strong>{project.name}</strong>
                  <small>{project.account} · PM {project.pm}</small>
                </button>
              ))
            ) : (
              <p className="tw-hint">No active project matches.</p>
            )}
          </div>
          <Button
            className="primary-button compact full tw-confirm"
            disabled={!picked}
            onClick={() => {
              setModal(null);
              setToast(`${picked?.pm} has your request. ${picked?.name} shows up in your week once you're added.`);
            }}
          >
            {picked ? `Send request to ${picked.pm}` : "Pick a project"}
          </Button>
        </>
      );
    }
    // "What do I log when…?": situations people ask about, each leading to the right row. Wording to be confirmed
    // with Finance once the purpose of each type is decided.
    if (modal === "guide") {
      const home = (type: TimeTypeCode): TimeRow | null => (homeProject ? { key: rowKey(homeProject.id, type), project: homeProject.id, type } : null);
      const situations: { title: string; answer: string; row?: TimeRow | null; run?: () => void }[] = [
        { title: "I worked for a customer I'm assigned to", answer: "Use the customer's row. It's already in your week.", run: () => setModal(null) },
        { title: "A course or a certification", answer: "Internal Development on Internal hours. If the customer needs it for the assignment, log it on their project.", row: home("internal_development") },
        { title: "I helped sales with an offer or a pitch", answer: "Presales Support on Internal hours.", row: home("presales_support") },
        { title: "Between assignments, helping sales place me", answer: "Resource Assignment Sales on Internal hours.", row: home("resource_assignment_sales") },
        { title: "Work on an internal project", answer: "Internal Project on Internal hours.", row: home("internal_project") },
        ...(overtimeProjects.length ? [{ title: "Evening or weekend work the customer ordered", answer: "Overtime, approved in advance by your PM.", run: openOvertime }] : []),
        { title: "I was sick or at the doctor's", answer: "Absence. No project needed.", row: { key: rowKey(null, "absence"), project: null, type: "absence" as TimeTypeCode } },
        { title: "I was on vacation", answer: "Vacation. You can log several days at once.", run: openAbsence },
      ];
      return (
        <>
          {modalHead("What do I log when…?", "Pick what you did and we add the right row.")}
          <div className="ar-group tw-guide">
            {situations.map((item) => (
              <button
                className="ar-item"
                key={item.title}
                onClick={() => {
                  if (item.run) item.run();
                  else if (item.row) rows.some((row) => row.key === item.row!.key) ? (setModal(null), setFocusRow(item.row.key)) : addRow(item.row);
                }}
                type="button"
              >
                <strong>{item.title}</strong>
                <small>{item.answer}</small>
              </button>
            ))}
          </div>
          <p className="tw-hint">Something else? Ask your project manager or Finance, and we'll add it here.</p>
        </>
      );
    }
    if (modal === "overtime") {
      const project = projectOf(overtime.project);
      return (
        <>
          {modalHead("Customer-ordered overtime", "", () => setModal("addRow"))}
          <p className="tw-lead">Only overtime the customer ordered and pays for, approved before the work, outside ordinary hours. Extra hours you even out with time off aren't overtime.</p>
          <div className="form-grid">
            {overtimeProjects.length > 1 && (
              <label className="field field--wide">
                <span>Project</span>
                <select onChange={(event) => setOvertime({ ...overtime, project: event.target.value })} value={overtime.project}>
                  {overtimeProjects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
            )}
            <label className="field field--wide">
              <span>{overtimeProjects.length > 1 ? "Approved in advance by" : `${project?.name} · approved in advance by`}</span>
              <select onChange={(event) => setOvertime({ ...overtime, approver: event.target.value })} value={overtime.approver}>
                {overtimeApprovers.map((name) => <option key={name} value={name}>{name}{name === project?.pm ? " (project manager)" : ""}</option>)}
              </select>
            </label>
          </div>
          <button aria-checked={overtime.ordered} className="toggle toggle-button" onClick={() => setOvertime({ ...overtime, ordered: !overtime.ordered })} role="switch" type="button">
            <span className={`toggle-switch ${overtime.ordered ? "is-on" : ""}`}><i /></span>The customer ordered it
          </button>
          <Button
            className="primary-button compact full tw-confirm"
            disabled={!overtime.ordered || !project}
            onClick={() => project && addRow({ key: rowKey(project.id, "overtime"), project: project.id, type: "overtime", preApprovedBy: overtime.approver })}
          >
            Add overtime row
          </Button>
        </>
      );
    }
    if (modal === "copy")
      return (
        <>
          {modalHead("Copy last week", `Rows from week ${isoWeek(addDays(weekStart, -7))} come in as Draft.`)}
          <p className="tw-lead">Vacation, absence and overtime are never copied, and cells you've already filled are never changed.</p>
          <button aria-checked={copyHours} className="toggle toggle-button" onClick={() => setCopyHours(!copyHours)} role="switch" type="button">
            <span className={`toggle-switch ${copyHours ? "is-on" : ""}`}><i /></span>Include hours
          </button>
          <Button className="primary-button compact full tw-confirm" onClick={copyLastWeek}>{copyHours ? "Copy rows and hours" : "Copy rows"}</Button>
        </>
      );
    if (modal === "absence")
      return (
        <>
          {modalHead("Vacation or absence", "One entry per weekday, as Draft. The range can span several weeks.")}
          <div className="tw-segment" role="radiogroup">
            {timeTypes.filter((type) => !type.needsProject).map((type) => (
              <button aria-checked={absence.type === type.code} className={absence.type === type.code ? "is-active" : ""} key={type.code} onClick={() => setAbsence({ ...absence, type: type.code, error: "" })} role="radio" type="button">
                {type.name}
              </button>
            ))}
          </div>
          <div className="form-grid">
            <label className="field">
              <span>From</span>
              <TextInput onChange={(event) => setAbsence({ ...absence, from: event.target.value, to: absence.to < event.target.value ? event.target.value : absence.to, error: "" })} type="date" value={absence.from} />
            </label>
            <label className="field">
              <span>To</span>
              <TextInput min={absence.from} onChange={(event) => setAbsence({ ...absence, to: event.target.value, error: "" })} type="date" value={absence.to} />
            </label>
            <label className="field field--wide">
              <span>Hours per day</span>
              <TextInput inputMode="decimal" onChange={(event) => setAbsence({ ...absence, hours: event.target.value, error: "" })} value={absence.hours} />
              <small className="field-hint">Your standard day is 8 h. Use 4 for half a day. Weekends are skipped.</small>
            </label>
          </div>
          {absence.error ? (
            <p className="form-message form-message--error" role="alert">{absence.error}</p>
          ) : (
            <p className="tw-preview">
              {absenceList.length && "minutes" in absenceMinutes
                ? `${plural(absenceList.length, "weekday", "weekdays")} · ${fmtH(absenceList.length * absenceMinutes.minutes)} h${new Set(absenceList.map(mondayOf)).size > 1 ? ` across ${new Set(absenceList.map(mondayOf)).size} weeks` : ""}`
                : "No weekdays in this range yet."}
            </p>
          )}
          <Button className="primary-button compact full" onClick={addAbsence}>Add {typeOf(absence.type).name.toLowerCase()}</Button>
        </>
      );
    if (modal === "submit") {
      const sending = sumMinutes(toSubmit);
      const billable = sumMinutes(toSubmit.filter((entry) => typeOf(entry.type).billable));
      return (
        <>
          {modalHead(`Submit ${weekLabel.toLowerCase()}`, rangeLabel)}
          {!inWeek.length ? (
            <>
              <p className="tw-msg tw-msg--info">There's nothing to submit this week. Were you away? Log vacation or absence instead, so nobody chases you for hours.</p>
              <Button className="primary-button compact full" onClick={openAbsence}><Icon name="calendar" size={15} /> Add vacation or absence</Button>
            </>
          ) : !toSubmit.length ? (
            <p className="tw-msg tw-msg--info">{planned.length ? "Everything up to today is submitted. The planned days are submitted once they've come." : "Everything this week is already submitted."}</p>
          ) : (
            <>
              <div className="tw-summary">
                <div><span>{planned.length ? "Up to today" : "Week total"}</span><strong>{fmtH(sending)} h</strong></div>
                <div><span>Billable</span><strong>{fmtH(billable)} h</strong></div>
                <div><span>Not billable</span><strong>{fmtH(sending - billable)} h</strong></div>
              </div>
              {planned.length > 0 && <p className="tw-msg tw-msg--info">{fmtH(sumMinutes(planned))} h planned for later days stays a draft. Submit it once the days have come.</p>}
              {blockers.map((text) => <p className="tw-msg tw-msg--error" key={text}>{text}</p>)}
              {needsWork.map((item) => (
                <p className="tw-msg tw-msg--error tw-fix" key={item.text}>
                  <span>{item.text}{item.count > 1 ? ` on ${plural(item.count, "entry", "entries")}` : ""}.</span>
                  <Button className="text-button" onClick={() => fixEntry(item.entry)}>{fixLabel(item.issue)}</Button>
                </p>
              ))}
              {warnings.map((text) => <p className="tw-msg tw-msg--warn" key={text}>{text}</p>)}
              {!(blockers.length + needsWork.length) && (
                <p className="tw-confirm-note">By submitting, you confirm that your hours for {weekLabel.toLowerCase()} are correct. You can recall them until your project manager approves them.</p>
              )}
              <Button className="primary-button compact full tw-confirm" disabled={blockers.length + needsWork.length > 0} onClick={submitWeek}>
                {blockers.length + needsWork.length ? "Fix the points above to submit" : "Confirm and submit"}
              </Button>
            </>
          )}
        </>
      );
    }
    return (
      <>
        {modalHead("Week actions", `${weekLabel} · ${rangeLabel}`)}
        <div className="td-actions">
          <Button className="secondary-button" onClick={() => setModal("copy")}>Copy last week</Button>
          <Button className="secondary-button" onClick={openAbsence}><Icon name="calendar" size={15} /> Vacation or absence</Button>
          <Button className="secondary-button" onClick={() => setModal("submit")}><Icon name="check" size={15} /> Submit week</Button>
          <Button className="secondary-button" disabled={!canRecall} onClick={recallWeek}>Recall submitted entries</Button>
        </div>
      </>
    );
  };

  // The few extra fields an entry can have. Shared by the popover (computer) and the day sheet (phone).
  const extraFields = (project: TimeProject | undefined, row: TimeRow, date: string, values: { customerText: string; task: string; outsideHours: boolean }, set: (patch: Partial<TimeEntry>) => void, disabled: boolean, except?: number) => (
    <>
      {project?.customerText && typeOf(row.type).billable && (
        <label className="field">
          <span>Text for {project.account}</span>
          <TextInput autoFocus={!values.customerText} disabled={disabled} maxLength={200} onChange={(event) => set({ customerText: event.target.value })} placeholder="What you did, in a few words" value={values.customerText} />
          {!disabled && !values.customerText && recentTexts(row.project, except).length > 0 && (
            <span className="tw-suggest">
              {recentTexts(row.project, except).map((text) => (
                <button key={text} onClick={() => set({ customerText: text })} type="button">{text}</button>
              ))}
            </span>
          )}
        </label>
      )}
      {project?.tasks && typeOf(row.type).billable && (
        <label className="tw-inline-field">
          <span>Task</span>
          <select disabled={disabled} onChange={(event) => set({ task: event.target.value || undefined })} value={values.task}>
            <option value="">Choose</option>
            {project.tasks.map((task) => <option key={task} value={task}>{task}</option>)}
          </select>
        </label>
      )}
      {row.type === "overtime" && !isWeekend(date) && (
        <button aria-checked={values.outsideHours} className="toggle toggle-button tw-pop-toggle" disabled={disabled} onClick={() => set({ outsideHours: !values.outsideHours })} role="switch" type="button">
          <span className={`toggle-switch ${values.outsideHours ? "is-on" : ""}`}><i /></span>Outside ordinary hours (evening or morning)
        </button>
      )}
    </>
  );

  const popover = () => {
    if (!pop) return null;
    const row = rows.find((item) => item.key === pop.row);
    if (!row) return null;
    const entry = entryAt(row, pop.date);
    const project = projectOf(row.project);
    const editable = !!entry && isEditable(entry);
    const lock = cellLock(entry, row.type, pop.date);
    return (
      <div aria-label="Entry details" className="tw-pop" ref={popRef} role="dialog" style={{ left: pop.left, top: pop.top, bottom: pop.bottom }}>
        <div className="tw-pop-head">
          <strong>{fmtDay(pop.date)} · {rowName(row)}</strong>
          <Button aria-label="Close" className="icon-button small" onClick={() => setPop(null)}><Icon name="close" size={13} /></Button>
        </div>
        {!entry ? (
          <p className="tw-hint">{lock || "Enter the hours in the cell first."}</p>
        ) : (
          <>
            {entry.pmComment && entry.status === "rejected" && <p className="tw-msg tw-msg--error">{entry.pmComment} Change the hours or move them to the right row, then submit again.</p>}
            {extraFields(project, row, pop.date, { customerText: entry.customerText ?? "", task: entry.task ?? "", outsideHours: !!entry.outsideHours }, (patch) => updateEntry(entry.id, patch), !editable, entry.id)}
            <label className="field">
              <span>Comment (only your team sees it)</span>
              <TextInput disabled={!editable} maxLength={500} onChange={(event) => updateEntry(entry.id, { comment: event.target.value })} placeholder="Optional" value={entry.comment} />
            </label>
            {lock && <p className="tw-hint">{lock}.</p>}
            <div className="tw-history">
              <span>History</span>
              {[...entryHistory(entry)].reverse().slice(0, 5).map((event, index) => (
                <small key={index}>
                  <b>{event.text}</b> · {event.by} · {fmtWhen(event.at)}
                </small>
              ))}
            </div>
            <Button className="primary-button compact full tw-pop-done" onClick={() => setPop(null)}>Done</Button>
          </>
        )}
      </div>
    );
  };

  const sheetBody = (current: TimeSheet) => {
    const entry = entryAt(current.row, current.date);
    const lock = cellLock(entry, current.row.type, current.date);
    const project = projectOf(current.row.project);
    const left = expectedOn(current.date) - (dayMinutes(current.date) - (entry?.minutes ?? 0));
    const chips = [8 * 60, 4 * 60, ...(left > 0 && left !== 8 * 60 && left !== 4 * 60 ? [left] : [])];
    return (
      <>
        {modalHead(rowName(current.row), `${rowSub(current.row)} · ${fmtLongDay(current.date)}`, () => setSheet(null))}
        {entry?.pmComment && entry.status === "rejected" && <p className="tw-msg tw-msg--error">{entry.pmComment}</p>}
        {lock ? (
          <p className="tw-msg tw-msg--info">{entry ? `${fmtH(entry.minutes)} h · ${lock}.` : `${lock}.`}</p>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              saveSheet();
            }}
          >
            <label className="field">
              <span>Hours</span>
              <TextInput autoFocus enterKeyHint="done" inputMode="decimal" onChange={(event) => setSheet({ ...current, hours: event.target.value, error: "" })} placeholder="0" value={current.hours} />
            </label>
            <div className="td-chips">
              {chips.map((minutes, index) => (
                <button key={minutes} onClick={() => setSheet({ ...current, hours: fmtH(minutes), error: "" })} type="button">
                  {index === 2 ? `Rest of day · ${fmtH(minutes)} h` : `${fmtH(minutes)} h`}
                </button>
              ))}
            </div>
            {extraFields(
              project,
              current.row,
              current.date,
              current,
              (patch) => setSheet({ ...current, customerText: patch.customerText ?? current.customerText, task: "task" in patch ? patch.task ?? "" : current.task, outsideHours: patch.outsideHours ?? current.outsideHours }),
              false,
              entry?.id,
            )}
            <label className="field">
              <span>Comment</span>
              <TextInput maxLength={500} onChange={(event) => setSheet({ ...current, comment: event.target.value })} placeholder="Optional" value={current.comment} />
            </label>
            {current.error && <p className="form-message form-message--error" role="alert">{current.error}</p>}
            <Button className="primary-button full tw-done" type="submit">Done</Button>
            {entry && (
              <Button
                className="text-button tw-remove-entry"
                onClick={() => {
                  writeCell(current.row, current.date, 0);
                  setSheet(null);
                }}
                type="button"
              >
                Remove this entry
              </Button>
            )}
          </form>
        )}
      </>
    );
  };

  // The next step: one sentence and at most one button, so there is always exactly one obvious thing to do.
  const nudge = banner && (
    <div className={`tw-next tw-next--${banner.tone}`} role="status">
      <span className="tw-next-text"><i className="tw-dot" />{banner.text}</span>
      {banner.action && <Button className="primary-button compact" onClick={banner.run}>{banner.action}</Button>}
      {banner.dismiss && <Button className="tw-link" onClick={() => setDismissed({ ...dismissed, [weekStart]: true })}>Not now</Button>}
    </div>
  );

  const overlays = (
    <>
      {modal && (
        <div className="modal-backdrop tw-sheet" onClick={() => setModal(null)}>
          <div aria-modal="true" className="modal-card" onClick={(event) => event.stopPropagation()} role="dialog">{modalBody()}</div>
        </div>
      )}
      {sheet && (
        <div className="modal-backdrop tw-sheet" onClick={() => setSheet(null)}>
          <div aria-modal="true" className="modal-card" onClick={(event) => event.stopPropagation()} role="dialog">{sheetBody(sheet)}</div>
        </div>
      )}
      {toast && <div className="tw-toast" role="status">{toast}</div>}
    </>
  );

  if (narrow)
    return (
      <div className="calm">
        <section className="td-head">
          <div className="td-week">
            <Button aria-label="Previous week" className="icon-button small" onClick={() => goWeek(-1)}><Icon name="arrow" size={15} /></Button>
            <div><strong className="tw-display">{weekLabel}</strong><small>{rangeLabel}</small></div>
            <Button aria-label="Next week" className="icon-button small" onClick={() => goWeek(1)}><Icon name="arrow" size={15} /></Button>
          </div>
          <div className="td-sum"><Badge tone={status.tone}>{status.label}</Badge><span>{fmtH(total)} / {fmtH(weekExpected)} h</span></div>
        </section>
        {nudge}
        <div className="td-days">
          {dates.map((date) => (
            <button
              aria-pressed={date === day}
              className={["td-day", date === day && "is-active", isWeekend(date) && "is-weekend", date === TODAY && "is-today"].filter(Boolean).join(" ")}
              key={date}
              onClick={() => setMobileDay(date)}
              type="button"
            >
              <span>{dayNames[dayIndex(date)].slice(0, 2)} {toDate(date).getUTCDate()}</span>
              <b className={dayTone(dayMinutes(date))}>{dayMinutes(date) ? fmtH(dayMinutes(date)) : "–"}</b>
            </button>
          ))}
        </div>
        <section className="panel td-card">
          <div className="td-card-head">
            <Button aria-label="Previous day" className="icon-button td-prev" onClick={() => goDay(-1)}><Icon name="arrow" size={16} /></Button>
            <div>
              <strong>{fmtLongDay(day)}{day === TODAY ? " · today" : ""}</strong>
              <small className={dayTone(dayMinutes(day))}>{dayMinutes(day) ? `${fmtH(dayMinutes(day))} h logged` : "Nothing logged yet"}</small>
            </div>
            <Button aria-label="Next day" className="icon-button" onClick={() => goDay(1)}><Icon name="arrow" size={16} /></Button>
          </div>
          {rows.map((row) => {
            const entry = entryAt(row, day);
            const lock = cellLock(entry, row.type, day);
            const issues = entry && isEditable(entry) ? entryIssues(entry) : [];
            const note = entry?.status === "rejected" ? "Sent back, tap to fix" : issues.length ? `Needs ${issues[0]}` : rowSub(row);
            return (
              <button className={`td-row ${entry ? `is-${entry.status}` : ""} ${issues.length ? "is-incomplete" : ""}`} disabled={!!lock && !entry} key={row.key} onClick={() => openSheet(row, day)} type="button">
                <span className="td-row-copy">
                  <strong>{rowName(row)}</strong>
                  <small>{note}</small>
                </span>
                <span className="td-hours">{entry ? `${fmtH(entry.minutes)} h` : lock ? "–" : <Icon name="plus" size={16} />}</span>
              </button>
            );
          })}
          <Button className="td-add" onClick={() => setModal("addRow")}><Icon name="plus" size={15} /> Add row</Button>
        </section>
        <div className="td-bar">
          <Button className="secondary-button" onClick={() => setModal("actions")}>Actions</Button>
          {banner?.action !== "Submit week" && (
            <Button className="secondary-button" disabled={!toSubmit.length && inWeek.length > 0} onClick={() => setModal("submit")}><Icon name="check" size={16} /> Submit week</Button>
          )}
        </div>
        {overlays}
      </div>
    );

  return (
    <div className="calm">
      <section className="tw-hero">
        <div className="tw-hero-top">
          <div className="tw-title">
            <div className="tw-arrows">
              <Button aria-label="Previous week" className="tw-arrow tw-arrow--back" onClick={() => goWeek(-1)}><Icon name="arrow" size={14} /></Button>
              <Button aria-label="Next week" className="tw-arrow" onClick={() => goWeek(1)}><Icon name="arrow" size={14} /></Button>
            </div>
            <div>
              <h2 className="tw-display">{weekLabel}</h2>
              <p className="tw-subtle">
                {rangeLabel}
                <span className={`tw-state tw-state--${status.tone}`}>{status.label}</span>
                {lockedMonths.map((month) => (
                  <span className="tw-locked" key={month}>
                    {monthName(month)} locked
                    {requests.some((item) => item.month === month) ? " · change requested" : <Button className="tw-link" onClick={() => openChange(month)}>Request a change</Button>}
                  </span>
                ))}
                {saved && <span className="tw-saved">Saved</span>}
                {weekStart !== mondayOf(TODAY) && <Button className="tw-link" onClick={goToday}>Back to this week</Button>}
              </p>
            </div>
          </div>
          <div className="tw-figure">
            <strong className="tw-display">{fmtH(total)}<small>h</small></strong>
            <span className="tw-subtle">of {fmtH(weekExpected)}</span>
          </div>
        </div>
        <div className="tw-line"><span style={{ width: `${weekExpected ? Math.min(100, (total / weekExpected) * 100) : 0}%` }} /></div>
        {nudge}
      </section>

      <section className="panel table-panel tw-panel">
        <div className="table-scroll">
          <table className="tw-grid" ref={tableRef}>
            <thead>
              <tr>
                <th>Project</th>
                {dates.map((date) => (
                  <th className={[(isWeekend(date) || isHoliday(date)) && "is-weekend", date === TODAY && "is-today", isMonthLocked(monthOf(date)) && "is-locked"].filter(Boolean).join(" ")} key={date}>
                    <span>{dayNames[dayIndex(date)].slice(0, 3)}</span>
                    <small>{isHoliday(date) ? "Holiday" : shortDate(date)}</small>
                  </th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {!rows.length && (
                <tr><td className="tw-empty" colSpan={9}>No rows this week. Add a row, or copy last week.</td></tr>
              )}
              {rows.map((row, r) => {
                const type = typeOf(row.type);
                const rowTotal = sumMinutes(inWeek.filter((entry) => rowKey(entry.project, entry.type) === row.key));
                return (
                  <tr key={row.key}>
                    <td className="tw-rowhead">
                      <div className="tw-rowcopy">
                        <strong>{rowName(row)}</strong>
                        <small>{rowSub(row)}</small>
                      </div>
                      {!row.assigned && !rowTotal && <Button className="text-button tw-remove" onClick={() => removeRow(row)}>Remove</Button>}
                    </td>
                    {dates.map((date, c) => {
                      const entry = entryAt(row, date);
                      const lock = cellLock(entry, row.type, date);
                      const id = cellId(row.key, date);
                      const error = errors[id];
                      const issues = entry && isEditable(entry) ? entryIssues(entry) : [];
                      const tip =
                        error ||
                        (entry?.pmComment && entry.status === "rejected" ? `Sent back: ${entry.pmComment}` : "") ||
                        (issues.length ? `Needs ${issues.join(" and ")}` : "") ||
                        entry?.customerText ||
                        entry?.comment ||
                        lock ||
                        undefined;
                      const classes = [
                        "tw-cell",
                        isWeekend(date) && "is-weekend",
                        date === TODAY && "is-today",
                        entry && `is-${entry.status}`,
                        entry?.status === "draft" && entry.date > TODAY && "is-planned",
                        lock && !entry && "is-closed",
                        error && "is-invalid",
                        pop?.row === row.key && pop.date === date && "is-open",
                      ];
                      const mark = issues.length ? "is-flag" : entry?.comment || entry?.customerText ? "is-note" : "";
                      return (
                        <td className={classes.filter(Boolean).join(" ")} data-cell-id={id} key={date} title={tip}>
                          <input
                            aria-label={`${rowName(row)}, ${type.name}, ${fmtDay(date)}`}
                            data-cell={`${r}:${c}`}
                            data-row={row.key}
                            inputMode="decimal"
                            onBlur={() => commitCell(row, date)}
                            onChange={(event) => setDrafts({ ...drafts, [id]: event.target.value })}
                            onFocus={(event) => event.target.select()}
                            onKeyDown={(event) => onCellKey(event, r, c, id)}
                            readOnly={!!lock}
                            placeholder={lock ? "" : "–"}
                            tabIndex={lock && !entry ? -1 : 0}
                            value={drafts[id] ?? (entry ? fmtH(entry.minutes) : "")}
                          />
                          {entry && (
                            <button aria-label={`Details for ${fmtDay(date)}`} className={`tw-cell-more ${mark}`} onClick={() => (pop?.row === row.key && pop.date === date ? setPop(null) : openPopover(row.key, date))} tabIndex={-1} type="button" />
                          )}
                        </td>
                      );
                    })}
                    <td className="tw-total">{rowTotal ? fmtH(rowTotal) : "–"}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                {dates.map((date) => {
                  const minutes = dayMinutes(date);
                  const expected = expectedOn(date);
                  const tone = dayTone(minutes);
                  // Each day says whether it adds up: done, short by how much, or too much. Days ahead stay quiet.
                  const check =
                    tone === "is-error" ? "over 24 h"
                    : tone === "is-warn" ? "over 10 h"
                    : !expected || date > TODAY ? ""
                    : minutes >= expected ? "done"
                    : `${fmtH(expected - minutes)} h short`;
                  const state = tone === "is-error" || tone === "is-warn" ? tone : check === "done" ? "is-done" : check ? "is-short" : "is-quiet";
                  return (
                    <td className={`tw-day-total ${state}`} key={date}>
                      <strong>{minutes ? fmtH(minutes) : "–"}</strong>
                      {check && <small>{check}</small>}
                    </td>
                  );
                })}
                <td className={`tw-day-total ${total >= weekExpected ? "is-done" : "is-quiet"}`}>
                  <strong>{fmtH(total)}</strong>
                  <small>of {fmtH(weekExpected)}</small>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="tw-tools">
          <Button className="tw-link" onClick={() => setModal("addRow")}><Icon name="plus" size={13} /> Add row</Button>
          <Button className="tw-link" onClick={() => setModal("copy")}>Copy last week</Button>
          <Button className="tw-link" onClick={openAbsence}>Vacation or absence</Button>
          {toSubmit.length > 0 && banner?.action !== "Submit week" && <Button className="tw-link" onClick={() => setModal("submit")}>Submit week</Button>}
          {canRecall && <Button className="tw-link" onClick={recallWeek}>Recall</Button>}
          {toSubmit.length > 0 && (
            <Button
              className="tw-link tw-demo"
              onClick={() => {
                const ids = new Set(open.map((entry) => entry.id));
                setEntries(entries.filter((entry) => !ids.has(entry.id)));
                setDismissed({ ...dismissed, [weekStart]: false });
                setToast(`Cleared ${plural(ids.size, "draft entry", "draft entries")} in ${weekLabel.toLowerCase()}.`);
              }}
              title="For demos: removes this week's drafts. Submitted and approved time stays."
            >
              Clear this week's drafts
            </Button>
          )}
        </div>
      </section>
      {popover()}
      {overlays}
    </div>
  );
}

// Hours overview for finance (F15-S03) with the month lock and audited unlock (F13-S07).
// Made-up people whose patterns mirror Dynamics on 29 Oct 2026: most hours arrive in a batch,
// vacation is often not logged, part-timers look short against 40 h, some hours wait weeks
// for PM approval, and a few people add time after the month is closed.
// October on the 30th is tuned to an average month in Dynamics (Nov 2025–Sep 2026): about 92% of the hours in,
// most people done, a couple missing the last week, one with an unlogged week, one who hasn't reported at all yet.

type HoursKind = "client" | "internal" | "absence";
type HoursStatus = "draft" | "submitted" | "approved";
type HoursEntry = { person: string; date: string; hours: number; kind: HoursKind; status: HoursStatus; created: string };
type HoursPerson = {
  id: string;
  name: string;
  role: string;
  unit: string;
  pm: string;
  days: number[];
  perDay: number;
  habit: "daily" | "weekly" | "monthly";
  internal?: number;
  short?: number;
  vacation?: [string, string][];
  sick?: [string, string][];
  gaps?: [string, string][];
  inactiveFrom?: string;
  pending?: boolean;
  drafts?: boolean;
  late?: { from: string; to: string; created: string }[];
};
type HoursPeriod = { key: string; kind: "month" | "week"; label: string; start: string; end: string };
type DayState = "full" | "partial" | "none" | "absence" | "off" | "future";
type HoursSort = "name" | "submitted" | "last";
type HoursFilter = "all" | "behind" | "consultant" | "pm" | "done" | "inactive" | "afterLock" | "empty";
type MonthLock = { at: string; by: string };
type Unlock = { person: string; month: string; until: string; reason: string; at: string; by: string };

const fullWeek = [0, 1, 2, 3, 4];

const hoursPeople: HoursPerson[] = [
  { id: "on", name: "Oliver Nyström", role: "Consultant", unit: "SE", pm: "Johanna S.", days: fullWeek, perDay: 8, habit: "daily" },
  { id: "vl", name: "Viktor Larsson", role: "Consultant", unit: "SE", pm: "Johanna S.", days: fullWeek, perDay: 8, habit: "weekly" },
  { id: "sa", name: "Sara Ahmed", role: "Consultant", unit: "SE", pm: "Mikael K.", days: [0, 1, 2, 3], perDay: 8, habit: "daily" },
  { id: "mk", name: "Maja Karlsson", role: "Senior consultant", unit: "SE", pm: "Mikael K.", days: fullWeek, perDay: 8, habit: "weekly" },
  { id: "nb", name: "Noah Berg", role: "Consultant", unit: "SE", pm: "Sofia L.", days: fullWeek, perDay: 8, habit: "weekly", vacation: [["2026-10-12", "2026-10-16"]] },
  { id: "eh", name: "Elias Holm", role: "Consultant", unit: "SE", pm: "Johanna S.", days: fullWeek, perDay: 8, habit: "daily", gaps: [["2026-09-28", "2026-09-30"]], late: [{ from: "2026-09-28", to: "2026-09-30", created: "2026-10-06" }] },
  { id: "al", name: "Alva Lindqvist", role: "Consultant", unit: "SE", pm: "Sofia L.", days: fullWeek, perDay: 8, habit: "weekly", gaps: [["2026-10-05", "2026-10-09"]] },
  { id: "hs", name: "Hugo Sandberg", role: "Architect", unit: "SE", pm: "Mikael K.", days: fullWeek, perDay: 8, habit: "daily", pending: true },
  { id: "eb", name: "Ella Bergström", role: "Consultant", unit: "SE", pm: "Johanna S.", days: fullWeek, perDay: 4, habit: "daily" },
  { id: "le", name: "Liam Ekström", role: "Consultant", unit: "IT", pm: "Sofia L.", days: fullWeek, perDay: 8, habit: "weekly", drafts: true },
  { id: "ws", name: "Wilma Sjöberg", role: "Business developer", unit: "SE", pm: "Johanna S.", days: fullWeek, perDay: 8, habit: "daily", internal: 8 },
  { id: "lf", name: "Lucas Forsberg", role: "Consultant", unit: "SE", pm: "Mikael K.", days: fullWeek, perDay: 8, habit: "weekly", inactiveFrom: "2026-10-26" },
  { id: "se", name: "Saga Engström", role: "Consultant", unit: "SE", pm: "Sofia L.", days: fullWeek, perDay: 8, habit: "daily", internal: 1 },
  { id: "ad", name: "Adam Lund", role: "Senior consultant", unit: "US", pm: "Mikael K.", days: fullWeek, perDay: 8, habit: "monthly" },
  { id: "fn", name: "Freja Nordin", role: "Consultant", unit: "SE", pm: "Johanna S.", days: fullWeek, perDay: 8, habit: "weekly" },
  { id: "lh", name: "Leo Hedlund", role: "Consultant", unit: "SE", pm: "Sofia L.", days: fullWeek, perDay: 8, habit: "daily", sick: [["2026-10-20", "2026-10-21"]] },
  { id: "aw", name: "Alice Wikström", role: "Consultant", unit: "AE", pm: "Sofia L.", days: fullWeek, perDay: 8, habit: "weekly", pending: true },
  { id: "od", name: "Oscar Dahl", role: "Consultant", unit: "SE", pm: "Mikael K.", days: fullWeek, perDay: 8, habit: "daily" },
  { id: "eg", name: "Ebba Holmgren", role: "Consultant", unit: "SE", pm: "Johanna S.", days: fullWeek, perDay: 8, habit: "weekly", gaps: [["2026-09-21", "2026-09-25"]] },
  { id: "is", name: "Isak Söderberg", role: "Consultant", unit: "IT", pm: "Sofia L.", days: fullWeek, perDay: 8, habit: "daily" },
  { id: "nf", name: "Nora Fransson", role: "Project manager", unit: "SE", pm: "Mikael K.", days: fullWeek, perDay: 8, habit: "weekly", internal: 2 },
  { id: "as", name: "Albin Strand", role: "Consultant", unit: "SE", pm: "Johanna S.", days: fullWeek, perDay: 8, habit: "weekly", gaps: [["2026-09-14", "2026-09-18"]], late: [{ from: "2026-09-14", to: "2026-09-18", created: "2026-10-14" }] },
  { id: "ta", name: "Tilde Axelsson", role: "Consultant", unit: "SE", pm: "Sofia L.", days: [0, 1, 2, 3], perDay: 8, habit: "daily" },
  { id: "me", name: "Melvin Ek", role: "Senior consultant", unit: "SE", pm: "Mikael K.", days: fullWeek, perDay: 8, habit: "weekly", vacation: [["2026-09-07", "2026-09-11"]], late: [{ from: "2026-10-26", to: "2026-10-30", created: "2026-11-02" }] },
];

const inRanges = (date: string, ranges: [string, string][] = []) => ranges.some(([from, to]) => date >= from && date <= to);
const fmtHours = (hours: number) => String(Math.round(hours * 10) / 10);

function buildHours() {
  const entries: HoursEntry[] = [];
  for (const person of hoursPeople) {
    for (let date = "2026-09-01"; date <= TODAY; date = addDays(date, 1)) {
      if (isWeekend(date) || !person.days.includes(dayIndex(date))) continue;
      const late = person.late?.find((item) => date >= item.from && date <= item.to);
      if (!late && (inRanges(date, person.gaps) || (person.inactiveFrom && date >= person.inactiveFrom))) continue;
      const created = late?.created ?? (person.habit === "daily" ? date : person.habit === "weekly" ? addDays(mondayOf(date), 4) : date < "2026-10-01" ? "2026-10-02" : "2026-11-02");
      if (created > TODAY) continue;
      const week = isoWeek(date);
      // A weekly rhythm (what Henry wants): last week is approved, this week was submitted today (Friday). Mikael K. is a
      // week behind on approvals, and a few people's hours have waited for weeks, as in Dynamics today.
      const behind = person.pm === "Mikael K." && week === 43;
      let status: HoursStatus = person.pending || late || behind ? "submitted" : week <= 43 ? "approved" : "submitted";
      if (person.drafts && date >= "2026-10-01") status = "draft";
      const base = { person: person.id, date, status, created };
      if (inRanges(date, person.vacation) || inRanges(date, person.sick)) {
        entries.push({ ...base, hours: person.perDay, kind: "absence" });
        continue;
      }
      const worked = person.perDay - (person.short ?? 0);
      const internal = Math.min(worked, person.internal ?? 0);
      if (worked > internal) entries.push({ ...base, hours: worked - internal, kind: "client" });
      if (internal) entries.push({ ...base, hours: internal, kind: "internal" });
    }
  }
  return entries;
}

const hoursEntries = buildHours();

const hoursPeriods: HoursPeriod[] = [
  { key: "2026-09", kind: "month", label: "September 2026", start: "2026-09-01", end: "2026-09-30" },
  { key: "2026-10", kind: "month", label: "October 2026", start: "2026-10-01", end: "2026-10-31" },
  ...Array.from({ length: 8 }, (_, index) => {
    const start = addDays("2026-09-07", index * 7);
    return { key: start, kind: "week" as const, label: `Week ${isoWeek(start)} · ${shortDate(start)} – ${shortDate(addDays(start, 6))}`, start, end: addDays(start, 6) };
  }),
];

const initialUnlocks: Unlock[] = [
  { person: "eh", month: "2026-09", until: "2026-10-07", reason: "Forgot the client workshop on 28–30 Sep.", at: "2026-10-06", by: "Finance" },
  { person: "as", month: "2026-09", until: "2026-10-15", reason: "Week 38 was in a draft that was never saved.", at: "2026-10-14", by: "Finance" },
];

const monthLabel = (month: string) => hoursPeriods.find((period) => period.key === month)?.label ?? month;

function workdaysBetween(from: string, to: string) {
  let count = 0;
  for (let date = addDays(from, 1); date <= to; date = addDays(date, 1)) if (!isWeekend(date)) count++;
  return count;
}

// Working days up to the cutoff are expected. A month always expects the whole month; a week expects the days so far.
// Days that haven't come yet show as "not yet" but still count in a month.
function personHours(person: HoursPerson, period: HoursPeriod, locks: Record<string, MonthLock>, cutoff: string) {
  const list = hoursEntries.filter((entry) => entry.person === person.id && entry.date >= period.start && entry.date <= period.end);
  const counted = list.filter((entry) => entry.date <= cutoff);
  const sum = (items: HoursEntry[]) => items.reduce((total, entry) => total + entry.hours, 0);
  const days: { date: string; state: DayState; hours: number; status?: HoursStatus }[] = [];
  // A day is only as far along as its least finished entry.
  const dayStatus = (items: HoursEntry[]): HoursStatus | undefined =>
    !items.length ? undefined : items.some((entry) => entry.status === "draft") ? "draft" : items.some((entry) => entry.status === "submitted") ? "submitted" : "approved";
  let expected = 0;
  let run = 0;
  let longestGap = 0;
  for (let date = period.start; date <= period.end; date = addDays(date, 1)) {
    if (isWeekend(date)) continue;
    const works = person.days.includes(dayIndex(date)) && !isHoliday(date);
    const onDay = list.filter((entry) => entry.date === date);
    const hours = sum(onDay);
    if (date > cutoff || date > TODAY) {
      if (works && date <= cutoff) expected += person.perDay;
      days.push({ date, state: works ? "future" : "off", hours });
      continue;
    }
    if (!works) {
      days.push({ date, state: "off", hours });
      continue;
    }
    expected += person.perDay;
    const state: DayState = onDay.some((entry) => entry.kind === "absence") ? "absence" : hours >= person.perDay ? "full" : hours > 0 ? "partial" : "none";
    // A gap is empty days between reported days. Empty days at the end are just not reported yet.
    if (state === "none") run++;
    else {
      longestGap = Math.max(longestGap, run);
      run = 0;
    }
    days.push({ date, state, hours, status: dayStatus(onDay) });
  }
  const reported = sum(counted);
  const weeksOf = (status: HoursStatus) => [...new Set(counted.filter((entry) => entry.status === status).map((entry) => entry.date).sort().map((date) => mondayOf(date)))];
  const all = hoursEntries.filter((entry) => entry.person === person.id);
  const last = all.reduce((latest, entry) => (entry.date > latest ? entry.date : latest), "");
  return {
    days,
    expected,
    reported,
    missing: Math.max(0, expected - reported),
    client: sum(counted.filter((entry) => entry.kind === "client")),
    internal: sum(counted.filter((entry) => entry.kind === "internal")),
    absence: sum(counted.filter((entry) => entry.kind === "absence")),
    approved: sum(counted.filter((entry) => entry.status === "approved")),
    waiting: sum(counted.filter((entry) => entry.status === "submitted")),
    draft: sum(counted.filter((entry) => entry.status === "draft")),
    submitted: sum(counted.filter((entry) => entry.status !== "draft")),
    // Mondays of the weeks still in draft or still with the PM, for the next step.
    draftWeeks: weeksOf("draft"),
    waitingWeeks: weeksOf("submitted"),
    afterLock: sum(list.filter((entry) => locks[monthOf(entry.date)] && entry.created > locks[monthOf(entry.date)].at)),
    // A run of empty working days between reported ones usually means vacation that wasn't logged.
    gap: reported > 0 ? longestGap : 0,
    last,
    idle: last ? workdaysBetween(last, TODAY) : 99,
  };
}

type HoursStats = ReturnType<typeof personHours>;
// text is what the row shows; action is the bare verb phrase for a reminder ("submit week 44").
type NextStep = { who: "consultant" | "pm"; text: string; action: string; late: boolean; hours: number; due: string };

// Whose turn it is. Invoicing uses approved hours only (Henry, 30 Oct), so a period is done when every working day is
// submitted and approved. In a weekly rhythm consultants submit a week by the Monday after and PMs approve it by the
// Wednesday after. Anything not due yet is shown, but quietly; only overdue steps put someone behind.
const period0 = (stats: HoursStats) => addDays(mondayOf(stats.days[0]?.date ?? TODAY), 7);

// How far a week (or a day) has come for one person, as one word. Missing hours win, then drafts, then the PM.
function unitStatus(days: HoursStats["days"], perDay: number): { label: string; tone: string; title: string } {
  const working = days.filter((day) => day.state !== "off");
  const title = days.map((day) => `${fmtDay(day.date)}: ${day.state === "off" ? "not a working day" : day.state === "future" ? "not yet" : day.state === "absence" ? "away" : `${fmtHours(day.hours)} h${day.status === "draft" ? ", not submitted" : day.status === "submitted" ? ", with the PM" : day.status === "approved" ? ", approved" : ""}`}`).join("\n");
  if (!working.length) return { label: "", tone: "off", title };
  if (working.every((day) => day.state === "future")) return { label: "–", tone: "future", title };
  if (working.every((day) => day.state === "absence")) return { label: "Away", tone: "away", title };
  const missing = working.filter((day) => day.state === "none" || day.state === "partial").reduce((sum, day) => sum + perDay - day.hours, 0);
  if (missing > 0) return { label: `−${fmtHours(missing)} h`, tone: "missing", title };
  if (working.some((day) => day.status === "draft")) return { label: "Draft", tone: "draft", title };
  if (working.some((day) => day.status === "submitted")) return { label: "With PM", tone: "pm", title };
  return { label: "✓", tone: "done", title };
}

// Weekdays grouped by week (Monday to Friday), for the week columns.
function weekGroups<T extends { date: string }>(days: T[]): [string, T[]][] {
  const groups = new Map<string, T[]>();
  for (const day of days) groups.set(mondayOf(day.date), [...(groups.get(mondayOf(day.date)) ?? []), day]);
  return [...groups.entries()];
}

const stepAction = (step?: NextStep) => step?.action ?? "";
const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// The row is the person, so their own steps don't repeat their name ("Submit week 44"); the PM's steps do.
function nextSteps(person: HoursPerson, stats: HoursStats): NextStep[] {
  const submitDue = (monday: string) => addDays(monday, 7);
  const approveDue = (monday: string) => addDays(monday, 9);
  const when = (due: string) => (due < TODAY ? `${plural(Math.max(1, workdaysBetween(due, TODAY)), "day", "days")} late` : `due ${fmtDay(due)}`);
  // "week 43", or "weeks 40–43" for a run.
  const weeks = (mondays: string[]) => (mondays.length === 1 ? `week ${isoWeek(mondays[0])}` : `weeks ${isoWeek(mondays[0])}–${isoWeek(mondays[mondays.length - 1])}`);
  // Split weeks into overdue and not yet due, so each becomes its own step.
  const split = (mondays: string[], due: (monday: string) => string) => [mondays.filter((monday) => due(monday) < TODAY), mondays.filter((monday) => due(monday) >= TODAY)];
  const steps: NextStep[] = [];
  if (stats.expected && !stats.reported) return [{ who: "consultant", text: `Nothing logged ${stats.last ? `since ${shortDate(stats.last)}` : "yet"}`, action: "log your hours", late: true, hours: stats.expected, due: period0(stats) }];
  const emptyWeeks = [...new Set(stats.days.filter((day) => day.state === "none").map((day) => mondayOf(day.date)))];
  const hoursIn = (mondays: string[]) => stats.days.filter((day) => day.state === "none" && mondays.includes(mondayOf(day.date))).length * person.perDay;
  const hoursAt = (mondays: string[], status: HoursStatus) => stats.days.filter((day) => day.status === status && mondays.includes(mondayOf(day.date))).reduce((sum, day) => sum + day.hours, 0);
  for (const group of split(emptyWeeks, submitDue)) {
    if (!group.length) continue;
    const action = `log ${fmtHours(hoursIn(group))} h in ${weeks(group)}`;
    steps.push({ who: "consultant", text: `${capital(action)}${stats.gap >= 3 && stats.reported ? " (vacation?)" : ""} · ${when(submitDue(group[0]))}`, action, late: submitDue(group[0]) < TODAY, hours: hoursIn(group), due: submitDue(group[0]) });
  }
  for (const group of split(stats.draftWeeks.filter((monday) => !emptyWeeks.includes(monday)), submitDue)) {
    if (!group.length) continue;
    const action = `submit ${weeks(group)}`;
    steps.push({ who: "consultant", text: `${capital(action)} · ${when(submitDue(group[0]))}`, action, late: submitDue(group[0]) < TODAY, hours: hoursAt(group, "draft"), due: submitDue(group[0]) });
  }
  for (const group of split(stats.waitingWeeks, approveDue)) {
    if (!group.length) continue;
    const late = approveDue(group[0]) < TODAY;
    const action = `approve ${weeks(group)}`;
    steps.push({ who: "pm", text: `${person.pm} ${late ? "hasn't approved" : "approves"} ${weeks(group)} · ${when(approveDue(group[0]))}`, action, late, hours: hoursAt(group, "submitted"), due: approveDue(group[0]) });
  }
  return steps;
}

// Submitted hours per project manager, split into overdue and not due yet, from the same next steps the rows show.
function pmQueue(rows: { person: HoursPerson; steps: NextStep[] }[]) {
  const groups: Record<string, { overdue: number; upcoming: number; late: Set<string>; daysLate: number; nextDue: string }> = {};
  for (const { person, steps } of rows)
    for (const step of steps.filter((item) => item.who === "pm")) {
      const group = (groups[person.pm] ??= { overdue: 0, upcoming: 0, late: new Set(), daysLate: 0, nextDue: "9999" });
      if (step.late) {
        group.overdue += step.hours;
        group.late.add(person.id);
        group.daysLate = Math.max(group.daysLate, workdaysBetween(step.due, TODAY));
      } else {
        group.upcoming += step.hours;
        if (step.due < group.nextDue) group.nextDue = step.due;
      }
    }
  return Object.entries(groups).sort((a, b) => b[1].overdue - a[1].overdue || b[1].upcoming - a[1].upcoming);
}

// One row of the PM queue, used by Hours overview and the Finance dashboard.
function PmQueueRow({ pm, group, onNudge, className }: { pm: string; group: ReturnType<typeof pmQueue>[number][1]; onNudge: () => void; className: string }) {
  return (
    <div className={className}>
      <Avatar name={pm} size="small" />
      <span className="case-cell">
        <strong>{pm}</strong>
        <small>
          {group.overdue
            ? `${plural(group.late.size, "person", "people")} · ${plural(group.daysLate, "day", "days")} late`
            : `Nothing overdue · next due ${fmtDay(group.nextDue)}`}
        </small>
      </span>
      <span className="pm-hours">
        {group.overdue > 0 && <b className="is-late">{fmtHours(group.overdue)} h overdue</b>}
        {group.upcoming > 0 && <small>{fmtHours(group.upcoming)} h not due yet</small>}
      </span>
      {group.overdue > 0 ? <Button className="text-button" onClick={onNudge}>Nudge</Button> : <span />}
    </div>
  );
}

function HoursOverview() {
  const [periodKey, setPeriodKey] = useState("2026-10");
  const [filter, setFilter] = useState<HoursFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: HoursSort; dir: 1 | -1 }>({ key: "name", dir: 1 });
  const [locks, setLocks] = useState<Record<string, MonthLock>>({ "2026-09": { at: addDays(monthDeadline("2026-09"), 1), by: "Automatic" } });
  const [unlocks, setUnlocks] = useState(initialUnlocks);
  const [modal, setModal] = useState<"lock" | "unlock" | null>(null);
  const [unlockForm, setUnlockForm] = useState({ person: "", until: addDays(TODAY, 3), reason: "", error: "" });
  // The week columns are opt-in; the choice is remembered in this browser.
  const [showWeeks, setShowWeeks] = useState(() => {
    try {
      return localStorage.getItem("ho-show-weeks") === "1";
    } catch {
      return false;
    }
  });
  const [showOnTrack, setShowOnTrack] = useState(false);
  const [openRow, setOpenRow] = useState<string | null>(null);
  function toggleWeeks() {
    setShowWeeks(!showWeeks);
    try {
      localStorage.setItem("ho-show-weeks", showWeeks ? "0" : "1");
    } catch {
      // Private window or blocked storage: the toggle still works for this visit.
    }
  }
  const [showMessages, setShowMessages] = useState(false);
  const [toast, setToast] = useState("");

  const period = hoursPeriods.find((item) => item.key === periodKey) ?? hoursPeriods[0];
  const sameKind = hoursPeriods.filter((item) => item.kind === period.kind);
  const position = sameKind.indexOf(period);
  const month = period.kind === "month" ? period.key : null;
  const lock = month ? locks[month] : undefined;
  const current = period.end >= TODAY;
  const cutoff = current && period.kind === "week" ? TODAY : period.end;
  const rows = hoursPeople
    .map((person) => {
      const stats = personHours(person, period, locks, cutoff);
      return { person, stats, steps: nextSteps(person, stats), unlock: unlocks.find((item) => item.person === person.id && item.month === month && item.until >= TODAY) };
    })
    .sort((a, b) => {
      const value = (row: typeof a) => (sort.key === "name" ? 0 : sort.key === "last" ? row.stats.last : row.stats[sort.key]);
      const by = sort.key === "name" ? 0 : value(a) < value(b) ? -1 : value(a) > value(b) ? 1 : 0;
      return by * sort.dir || a.person.name.localeCompare(b.person.name) * (sort.key === "name" ? sort.dir : 1);
    });
  // Columns: the weeks of a month, or the days of a week. [key, dates, label]
  const allDays = rows[0]?.stats.days ?? [];
  const units: [string, string[], string][] =
    period.kind === "week"
      ? allDays.map((day) => [day.date, [day.date], `${dayNames[dayIndex(day.date)].slice(0, 3)} ${Number(day.date.slice(8))}`])
      : weekGroups(allDays).map(([monday, days]) => [monday, days.map((day) => day.date), `W${isoWeek(monday)}`]);
  const tableCols = 4 + (showWeeks ? units.length : 0);
  const sortBy = (key: HoursSort) => setSort(sort.key === key ? { key, dir: sort.dir === 1 ? -1 : 1 } : { key, dir: key === "name" ? 1 : -1 });
  const sortHead = (key: HoursSort, label: string, className = "") => (
    <th aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none"} className={className}>
      <button className={`ho-sort ${sort.key === key ? "is-active" : ""}`} onClick={() => sortBy(key)} type="button">
        {label}
        <span>{sort.key === key ? (sort.dir === 1 ? "↑" : "↓") : "↕"}</span>
      </button>
    </th>
  );

  const total = (pick: (row: (typeof rows)[number]) => number) => rows.reduce((sum, row) => sum + pick(row), 0);
  const expected = total((row) => row.stats.expected);
  const submitted = total((row) => row.stats.submitted);
  const approved = total((row) => row.stats.approved);
  const missing = total((row) => row.stats.missing);
  const waiting = total((row) => row.stats.waiting);
  const draft = total((row) => row.stats.draft);
  const afterLock = total((row) => row.stats.afterLock);
  const behind = (row: (typeof rows)[number], who: NextStep["who"]) => row.steps.some((step) => step.who === who && step.late);
  const consultantTurn = rows.filter((row) => behind(row, "consultant"));
  const pmTurn = rows.filter((row) => behind(row, "pm"));
  const pmsWaiting = new Set(pmTurn.map((row) => row.person.pm));
  // Hours per owner, split into overdue and not due yet, so the tiles add up to what the rows say.
  const stepHours = (who: NextStep["who"], late: boolean) => total((row) => row.steps.filter((step) => step.who === who && step.late === late).reduce((sum, step) => sum + step.hours, 0));
  const allPms = new Set(rows.map((row) => row.person.pm));
  const missingPeople = rows.filter((row) => row.stats.missing > 0);

  const tests: Record<HoursFilter, (row: (typeof rows)[number]) => boolean> = {
    all: () => true,
    behind: (row) => row.steps.some((step) => step.late),
    consultant: (row) => behind(row, "consultant"),
    pm: (row) => behind(row, "pm"),
    done: (row) => !row.steps.some((step) => step.late),
    inactive: (row) => row.stats.idle > 5,
    empty: (row) => row.stats.gap >= 3,
    afterLock: (row) => row.stats.afterLock > 0,
  };
  const filters: { key: HoursFilter; label: string }[] = [
    { key: "all", label: "Everyone" },
    { key: "behind", label: "Behind" },
    ...(month && lock ? [{ key: "afterLock" as HoursFilter, label: "Added after lock" }] : []),
  ];
  const search = query.trim().toLowerCase();
  const visible = rows.filter(tests[filter]).filter((row) => !search || `${row.person.name} ${row.person.role} ${row.person.pm}`.toLowerCase().includes(search));

  const byPm = pmQueue(rows);

  const log = [
    ...Object.entries(locks).map(([key, item]) => ({
      at: item.at,
      text: item.by === "Automatic" ? `${monthLabel(key)} locked automatically after the deadline (${fmtDay(monthDeadline(key))}).` : `${item.by} locked ${monthLabel(key)} early.`,
    })),
    ...unlocks.map((item) => ({
      at: item.at,
      text: `${item.by} unlocked ${monthLabel(item.month)} for ${hoursPeople.find((person) => person.id === item.person)?.name} until ${shortDate(item.until)}: “${item.reason}”`,
    })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!modal) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setModal(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [modal]);

  function switchKind(kind: "month" | "week") {
    if (kind === period.kind) return;
    // Both open on the running period: the week to follow up this week, the month to see the whole month.
    const next = hoursPeriods.filter((item) => item.kind === kind);
    const pick = next.find((item) => item.start <= TODAY && item.end >= TODAY);
    setPeriodKey((pick ?? next[next.length - 1]).key);
  }

  function lockMonth() {
    if (!month) return;
    setLocks({ ...locks, [month]: { at: TODAY, by: "Finance" } });
    setModal(null);
    setToast(`${period.label} is locked. Anyone who still needs to add time asks finance to unlock it.`);
  }

  function openUnlock(person = "") {
    setUnlockForm({ person, until: addDays(TODAY, 3), reason: "", error: "" });
    setModal("unlock");
  }

  function saveUnlock() {
    if (!month) return;
    if (!unlockForm.person) return setUnlockForm({ ...unlockForm, error: "Choose who the period is unlocked for." });
    if (unlockForm.reason.trim().length < 5) return setUnlockForm({ ...unlockForm, error: "Write why it's unlocked. The reason is saved in the lock log." });
    if (unlockForm.until < TODAY) return setUnlockForm({ ...unlockForm, error: "The unlock must last until today or later." });
    setUnlocks([{ person: unlockForm.person, month, until: unlockForm.until, reason: unlockForm.reason.trim(), at: TODAY, by: "Finance" }, ...unlocks]);
    setModal(null);
    setToast(`${period.label} is unlocked for ${hoursPeople.find((person) => person.id === unlockForm.person)?.name} until ${shortDate(unlockForm.until)}.`);
  }

  function exportCsv() {
    const header = ["Person", "Role", "Unit", "Project manager", "Expected h", "Logged h", "Submitted h", "Missing h", "Client h", "Internal h", "Absence h", "Approved h", "Waiting h", "Draft h", "Added after lock h", "Last time", "Next step"];
    const lines = rows.map(({ person, stats }) =>
      [person.name, person.role, person.unit, person.pm, stats.expected, stats.reported, stats.submitted, stats.missing, stats.client, stats.internal, stats.absence, stats.approved, stats.waiting, stats.draft, stats.afterLock, stats.last, nextSteps(person, stats).map((step) => step.text).join("; ") || "Done"]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" }));
    link.download = `hours-${period.key}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const pctOf = (hours: number) => (expected ? Math.round((hours / expected) * 100) : 0);

  const behindRows = visible.filter((row) => row.steps.some((step) => step.late));
  const okRows = visible.filter((row) => !row.steps.some((step) => step.late));

  const remind = (person: HoursPerson, step: NextStep) =>
    setToast(
      step.who === "consultant"
        ? `Sent in Teams to ${person.name}: "Reminder: ${stepAction(step)}."`
        : `Sent in Teams to ${person.pm}: "Please ${stepAction(step)} for ${person.name}. It's overdue."`,
    );

  const renderRow = ({ person, stats, steps, unlock }: (typeof rows)[number]) => {
    const late = steps.filter((step) => step.late);
    const open = openRow === person.id;
    const partTime = person.days.length * person.perDay < 40 ? Math.round((person.days.length * person.perDay) / 0.4) : 0;
    const unitsFor = units.map(([key, dates, label]) => {
      const days = stats.days.filter((day) => dates.includes(day.date));
      return { key, head: label, hours: days.reduce((sum, day) => sum + day.hours, 0), ...unitStatus(days, person.perDay) };
    });
    return (
      <Fragment key={person.id}>
        <tr aria-expanded={open} className={`ho-row ${open ? "is-open" : ""}`} onClick={() => setOpenRow(open ? null : person.id)}>
          <td>
            <span className="company-cell">
              <Avatar name={person.name} size="small" />
              <span className="case-cell">
                <strong>{person.name}</strong>
                <small>PM {person.pm}</small>
              </span>
            </span>
          </td>
          {showWeeks &&
            unitsFor.map((unit) => (
              <td className="ho-unit" key={unit.key} title={unit.title}>
                <span className={`ho-unit-chip is-${unit.tone}`}>{unit.label}</span>
              </td>
            ))}
          <td title={`${fmtHours(stats.submitted)} of ${fmtHours(stats.expected)} h expected submitted · ${fmtHours(stats.approved)} h approved · ${fmtHours(stats.waiting)} h with the PM · ${fmtHours(stats.draft)} h not submitted`}>
            {/* Drafts haven't left the consultant's desk, so only submitted time counts. */}
            <div className="ho-progress-head">
              <strong>{fmtHours(stats.submitted)} h</strong>
              {partTime > 0 && <span>· {partTime}% time</span>}
            </div>
            <div className="ho-progress">
              {(["approved", "waiting", "draft"] as const).map((part) => (
                <span className={`ho-progress--${part}`} key={part} style={{ width: `${stats.expected ? Math.min(100, (stats[part] / stats.expected) * 100) : 0}%` }} />
              ))}
            </div>
            {(stats.afterLock > 0 || unlock) && (
              <div className="ho-badges">
                {stats.afterLock > 0 && <Badge tone="red">{fmtHours(stats.afterLock)} h after lock</Badge>}
                {unlock && <Badge tone="violet">Unlocked to {shortDate(unlock.until)}</Badge>}
              </div>
            )}
          </td>
          <td className="ho-steps" onClick={(event) => (event.target as HTMLElement).closest("button") && event.stopPropagation()}>
            {/* Only what's overdue, each with its action right next to it; the rest sits in the details. */}
            {late.length ? (
              late.map((step) => (
                <span className={`ho-step ho-step--${step.who} is-late`} key={step.text}>
                  {step.text}
                  <Button className="text-button ho-step-action" onClick={() => remind(person, step)}>{step.who === "pm" ? "Nudge PM" : "Remind"}</Button>
                </span>
              ))
            ) : (
              <span className="ho-step is-done">✓ {steps.length ? "On track" : "Done"}</span>
            )}
          </td>
          <td className="ho-actions" onClick={(event) => event.stopPropagation()}>
            {month && lock && !unlock && <Button className="text-button" onClick={() => openUnlock(person.id)}>Unlock</Button>}
            <button aria-label={open ? "Hide details" : "Show details"} className="ho-chevron-button" onClick={() => setOpenRow(open ? null : person.id)} type="button">
              <i className={`ho-chevron ${open ? "is-open" : ""}`} aria-hidden="true">›</i>
            </button>
          </td>
        </tr>
        {open && (
          <tr className="ho-detail-row">
            <td colSpan={tableCols}>
              <div className="ho-detail">
                <p className="ho-detail-meta">
                  {person.role} · {person.unit} · PM {person.pm} · last time {stats.last ? fmtDay(stats.last) : "never"} · {fmtHours(stats.submitted)} of {fmtHours(stats.expected)} h submitted · {fmtHours(stats.approved)} h approved · {fmtHours(stats.waiting)} h with the PM · {fmtHours(stats.draft)} h not submitted
                </p>
                <div className="ho-detail-weeks">
                  {unitsFor.map((unit) => (
                    <div className="ho-detail-week" key={unit.key} title={unit.title}>
                      <small>{unit.head}</small>
                      <span className={`ho-unit-chip is-${unit.tone}`}>{unit.label}</span>
                      <b>{fmtHours(unit.hours)} h</b>
                    </div>
                  ))}
                </div>
                <div className="ho-detail-steps">
                  {steps.length ? (
                    steps.map((step) => <span className={`ho-step ho-step--${step.who} ${step.late ? "is-late" : "is-upcoming"}`} key={step.text}>{step.text}</span>)
                  ) : (
                    <span className="ho-step is-done">✓ Everything submitted and approved</span>
                  )}
                </div>
              </div>
            </td>
          </tr>
        )}
      </Fragment>
    );
  };

  return (
    <div className="calm">
      <section className="tw-head ho-head">
        <div className="week-nav">
          <Button aria-label="Previous period" className="icon-button small" disabled={position <= 0} onClick={() => setPeriodKey(sameKind[position - 1].key)}><Icon name="arrow" size={15} /></Button>
          <div>
            <h2 className="tw-display">{period.label}</h2>
            <p>
              {month ? (
                lock ? <Badge tone="slate">Locked {shortDate(lock.at)}</Badge> : <Badge tone="sand">Open · locks automatically after {fmtDay(monthDeadline(month))}</Badge>
              ) : (
                <Badge tone="slate">Week view · locks are set per month</Badge>
              )}
              {current && period.kind === "week" && <span className="ho-sofar">Counts up to {fmtDay(cutoff)}, this week so far</span>}
            </p>
          </div>
          <Button aria-label="Next period" className="icon-button small" disabled={position >= sameKind.length - 1} onClick={() => setPeriodKey(sameKind[position + 1].key)}><Icon name="arrow" size={15} /></Button>
        </div>
        <div className="tw-segment ho-kind" role="radiogroup">
          {(["month", "week"] as const).map((kind) => (
            <button aria-checked={period.kind === kind} className={period.kind === kind ? "is-active" : ""} key={kind} onClick={() => switchKind(kind)} role="radio" type="button">
              {kind === "month" ? "Month" : "Week"}
            </button>
          ))}
        </div>
        <div className="tw-actions">
          <Button className="secondary-button" onClick={exportCsv}>Export CSV</Button>
          {month && lock && <Button className="secondary-button" onClick={() => openUnlock()}>Unlock for a person</Button>}
          {month && !lock && <Button className="secondary-button" onClick={() => setModal("lock")}>Lock now</Button>}
        </div>
      </section>

      <section className="ho-tiles">
        <article className="ho-tile">
          <span>Submitted</span>
          <strong className="tw-display">{pctOf(submitted)}%</strong>
          <small>{fmtHours(submitted)} of {fmtHours(expected)} h expected</small>
          <div className="progress"><span style={{ width: `${Math.min(100, pctOf(submitted))}%` }} /></div>
        </article>
        <article className="ho-tile">
          <span>Approved</span>
          <strong className="tw-display">{pctOf(approved)}%</strong>
          <small>{fmtHours(approved)} h ready to invoice</small>
          <div className="progress"><span style={{ width: `${Math.min(100, pctOf(approved))}%` }} /></div>
        </article>
        <article className={`ho-tile ${consultantTurn.length ? "is-alert" : ""}`}>
          <span>Consultants behind</span>
          <strong className="tw-display">{consultantTurn.length} of {rows.length}</strong>
          <small>{fmtHours(stepHours("consultant", true))} h overdue{stepHours("consultant", false) ? ` · ${fmtHours(stepHours("consultant", false))} h not due yet` : ""}</small>
        </article>
        <article className={`ho-tile ${pmsWaiting.size ? "is-alert" : ""}`}>
          <span>PMs behind</span>
          <strong className="tw-display">{pmsWaiting.size} of {allPms.size}</strong>
          <small>{fmtHours(stepHours("pm", true))} h overdue{stepHours("pm", false) ? ` · ${fmtHours(stepHours("pm", false))} h not due yet` : ""}</small>
        </article>
        {month && lock && (
          <article className={`ho-tile ${afterLock ? "is-alert" : ""}`}>
            <span>Added after lock</span>
            <strong className="tw-display">{fmtHours(afterLock)} h</strong>
            <small>needs a new invoice run</small>
          </article>
        )}
      </section>

      <section className="panel table-panel">
        <div className="panel-heading">
          <div className="ho-title">
            <Heading level={2}>People</Heading>
            <span
              aria-label="How this works"
              className="ho-info"
              tabIndex={0}
              title="Only approved hours are invoiced. Each week consultants submit by the Monday after and PMs approve by the Wednesday after. On track = nothing overdue; done = everything approved. Click a person for the details."
            >
              ⓘ
            </span>
          </div>
          <label className="search-field">
            <Icon name="search" size={15} />
            <TextInput aria-label="Search people" onChange={(event) => setQuery(event.target.value)} placeholder="Search person or PM" value={query} />
          </label>
        </div>
        <div className="ho-filters">
          {filters.map((item) => (
            <button aria-pressed={filter === item.key} className={`ho-chip ${filter === item.key ? "is-active" : ""}`} key={item.key} onClick={() => setFilter(item.key)} type="button">
              {item.label} <b>{rows.filter(tests[item.key]).length}</b>
            </button>
          ))}
          <span className="ho-remind-all">
            {filter === "behind" && (consultantTurn.length > 0 || pmsWaiting.size > 0) && (
              <Button className="text-button" onClick={() => setToast(`Sent in Teams to ${plural(consultantTurn.length, "consultant", "consultants")} and ${plural(pmsWaiting.size, "PM", "PMs")} who are behind.`)}>
                Remind all
              </Button>
            )}
            <span className="tw-segment ho-view" role="radiogroup" aria-label="View">
              {[false, true].map((weeks) => (
                <button aria-checked={showWeeks === weeks} className={showWeeks === weeks ? "is-active" : ""} key={String(weeks)} onClick={() => showWeeks !== weeks && toggleWeeks()} role="radio" type="button">
                  {weeks ? (period.kind === "week" ? "Days" : "Weeks") : "Summary"}
                </button>
              ))}
            </span>
          </span>
        </div>
        <div className="table-scroll">
          <table className="ho-table">
            <thead>
              <tr>
                {sortHead("name", "Person")}
                {/* One column per week (a month) or per day (a week), only when asked for. */}
                {showWeeks && units.map(([key, , label]) => <th className="ho-unit-head" key={key}>{label}</th>)}
                {sortHead("submitted", "Submitted")}
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {!visible.length && <tr><td className="tw-empty" colSpan={tableCols}>Nobody matches this filter.</td></tr>}
              {filter === "all" ? (
                <>
                  {/* Everyone: the people behind first, the rest folded away until asked for. */}
                  {behindRows.length > 0 && <tr className="ho-group"><td colSpan={tableCols}>Behind · {behindRows.length}</td></tr>}
                  {behindRows.map(renderRow)}
                  {okRows.length > 0 && (
                    <tr aria-expanded={showOnTrack || !!query} className="ho-group is-toggle" onClick={() => setShowOnTrack(!showOnTrack)}>
                      <td colSpan={tableCols}><i className={`ho-chevron ${showOnTrack || query ? "is-open" : ""}`} aria-hidden="true">›</i> On track · {okRows.length}</td>
                    </tr>
                  )}
                  {(showOnTrack || !!query) && okRows.map(renderRow)}
                </>
              ) : (
                visible.map(renderRow)
              )}
            </tbody>
          </table>
        </div>
        <div className="ho-legend">
          {showWeeks ? (
            <>
              <span><b className="ho-unit-chip is-done">✓</b>Approved</span>
              <span><b className="ho-unit-chip is-pm">With PM</b>Waiting for approval</span>
              <span><b className="ho-unit-chip is-draft">Draft</b>Not submitted</span>
              <span><b className="ho-unit-chip is-missing">−8 h</b>Hours missing</span>
              <span><b className="ho-unit-chip is-away">Away</b>Vacation or absence</span>
              <span><b className="ho-unit-chip is-future">–</b>Not yet</span>
            </>
          ) : (
            <>
              <span><i className="ho-bar-key ho-progress--approved" />Approved</span>
              <span><i className="ho-bar-key ho-progress--waiting" />With the PM</span>
              <span><i className="ho-bar-key ho-progress--draft" />Not submitted</span>
            </>
          )}
        </div>
      </section>

      {/* What goes out automatically, and to whom, so nobody has to chase people by hand (Henry, 30 Oct). */}
      {(() => {
        const consultantsOpen = rows.filter((row) => row.steps.some((step) => step.who === "consultant"));
        const pmsDue = new Set(rows.filter((row) => row.steps.some((step) => step.who === "pm" && !step.late)).map((row) => row.person.pm));
        const pmsLate = new Set(rows.filter((row) => row.steps.some((step) => step.who === "pm" && step.late)).map((row) => row.person.pm));
        const reminders = [
          { when: "Fri 14:00", channel: "Teams", to: `${plural(consultantsOpen.length, "consultant", "consultants")} with time to log or submit`, text: `Week ${isoWeek(TODAY)} isn't submitted yet. Submit it by ${fmtDay(addDays(mondayOf(TODAY), 7))} so your project manager can approve it.` },
          { when: "Tue 09:00", channel: "Teams", to: pmsDue.size ? [...pmsDue].join(", ") : "No PM", text: `Hours are waiting for your approval, due ${fmtDay(addDays(mondayOf(TODAY), 9))}. Approve normal weeks in one click and send back what's wrong.` },
          { when: "Thu 09:00", channel: "Email", to: pmsLate.size ? `${[...pmsLate].join(", ")}, Finance in copy` : "Nobody is late", text: "Some approvals are overdue, so these hours can't be invoiced yet. Please approve today, or name someone who can." },
        ];
        const short = [`${plural(consultantsOpen.length, "consultant", "consultants")}`, `${plural(pmsDue.size, "PM", "PMs")}`, pmsLate.size ? `${plural(pmsLate.size, "late PM", "late PMs")} + Finance` : "nobody late"];
        return (
          <section className="ho-reminders">
            <div className="ho-reminders-head">
              <strong>Automatic reminders</strong>
              <Button className="text-button" onClick={() => setShowMessages(!showMessages)}>{showMessages ? "Hide messages" : "See messages"}</Button>
            </div>
            <div className="ho-reminders-row">
              {reminders.map((item, index) => (
                <div className="ho-reminder" key={item.when} title={`To ${item.to}`}>
                  <small>{item.when} · {item.channel}</small>
                  <strong>To {short[index]}</strong>
                  {showMessages && <p className="ho-bubble">{item.text}</p>}
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      <section className="two-col ho-bottom">
        <article className="panel list-panel ho-panel">
          <div className="panel-heading">
            <div><Heading level={2}>Waiting for approval</Heading><p>Submitted hours in this period, per project manager</p></div>
          </div>
          {byPm.length ? (
            byPm.map(([pm, group]) => (
              <PmQueueRow className="ho-pm" group={group} key={pm} onNudge={() => setToast(`Asked ${pm} to approve ${fmtHours(group.overdue)} overdue h.`)} pm={pm} />
            ))
          ) : (
            <p className="tw-hint">Nothing is waiting for approval in this period.</p>
          )}
        </article>
        <article className="panel list-panel ho-panel">
          <div className="panel-heading">
            <div><Heading level={2}>Lock log</Heading><p>Every lock and unlock, with who and why</p></div>
          </div>
          {log.map((item) => (
            <div className="ho-log" key={`${item.at}${item.text}`}>
              <small>{fmtDay(item.at)}</small>
              <span>{item.text}</span>
            </div>
          ))}
        </article>
      </section>

      {modal && (
        <div className="modal-backdrop tw-sheet" onClick={() => setModal(null)}>
          <div aria-modal="true" className="modal-card" onClick={(event) => event.stopPropagation()} role="dialog">
            {modal === "lock" ? (
              <>
                <div className="panel-heading">
                  <div><Heading level={2}>Lock {period.label}</Heading><p>Nobody can add or change time in a locked month without an unlock.</p></div>
                  <Button aria-label="Close" className="icon-button small" onClick={() => setModal(null)}><Icon name="close" size={15} /></Button>
                </div>
                {month && TODAY <= monthDeadline(month) && <p className="tw-msg tw-msg--warn">It locks automatically after {fmtDay(monthDeadline(month))}. Locking now also stops people who are on time.</p>}
                {missingPeople.length > 0 && (
                  <p className="tw-msg tw-msg--error">
                    {plural(missingPeople.length, "person is", "people are")} still missing {fmtHours(missing)} h: {missingPeople.slice(0, 4).map((row) => row.person.name).join(", ")}
                    {missingPeople.length > 4 ? ` and ${missingPeople.length - 4} more` : ""}.
                  </p>
                )}
                {waiting + draft > 0 && <p className="tw-msg tw-msg--info">{fmtHours(waiting + draft)} h are not approved yet. Locking stops new time; approval can still go on.</p>}
                <Button className="primary-button compact full tw-confirm" onClick={lockMonth}>Lock {period.label}</Button>
              </>
            ) : (
              <>
                <div className="panel-heading">
                  <div><Heading level={2}>Unlock {period.label}</Heading><p>For one person, for a few days. The reason is saved in the lock log.</p></div>
                  <Button aria-label="Close" className="icon-button small" onClick={() => setModal(null)}><Icon name="close" size={15} /></Button>
                </div>
                <div className="form-grid">
                  <label className="field field--wide">
                    <span>Person</span>
                    <select onChange={(event) => setUnlockForm({ ...unlockForm, person: event.target.value, error: "" })} value={unlockForm.person}>
                      <option value="">Choose a person</option>
                      {hoursPeople.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
                    </select>
                  </label>
                  <label className="field">
                    <span>Unlocked until</span>
                    <TextInput min={TODAY} onChange={(event) => setUnlockForm({ ...unlockForm, until: event.target.value, error: "" })} type="date" value={unlockForm.until} />
                  </label>
                  <label className="field field--wide">
                    <span>Reason</span>
                    <TextInput maxLength={300} onChange={(event) => setUnlockForm({ ...unlockForm, reason: event.target.value, error: "" })} placeholder="e.g. Forgot the workshop on 28 Sep" value={unlockForm.reason} />
                  </label>
                </div>
                {unlockForm.error && <p className="form-message form-message--error" role="alert">{unlockForm.error}</p>}
                <Button className="primary-button compact full" onClick={saveUnlock}>Unlock</Button>
              </>
            )}
          </div>
        </div>
      )}
      {toast && <div className="tw-toast" role="status">{toast}</div>}
    </div>
  );
}

// Finance dashboard: can we invoice, and when? Month close, ready to invoice, the approval queue, hours added after the
// lock, and overtime for payroll. Who is missing hours is in Hours overview; this page is the month at a glance.
const invoiceProjects = [
  { name: "Nova implementation", account: "Nordic Solutions", rate: 1250 },
  { name: "CRM migration", account: "TechVision AB", rate: 1300 },
  { name: "Digital platform 2.0", account: "Bright Digital", rate: 1200 },
  { name: "Service desk", account: "Nordic Solutions", rate: 1100 },
  { name: "Data platform", account: "Klinte Logistik AB", rate: 1350 },
];
const projectFor = (person: string) => invoiceProjects[[...person].reduce((sum, char) => sum + char.charCodeAt(0), 0) % invoiceProjects.length];
// Measured in Dynamics on 29 Oct 2026 (aggregate, no names): hours created after the 2nd of the next month.
const lateHoursBefore: [string, number][] = [["Nov", 114], ["Dec", 144], ["Jan", 237], ["Feb", 218], ["Mar", 263], ["Apr", 235], ["May", 155], ["Jun", 112], ["Jul", 84], ["Aug", 269], ["Sep", 35]];
const overtimeForPayroll = [
  { person: "Hugo Sandberg", project: "CRM migration", hours: 4, approvedBy: "Mikael K.", month: "2026-09", status: "Approved" },
  { person: "Oliver Nyström", project: "Nova implementation", hours: 3, approvedBy: "Johanna S.", month: "2026-10", status: "Approved" },
  { person: "Isak Söderberg", project: "Data platform", hours: 6, approvedBy: "Sofia L.", month: "2026-10", status: "Waiting for PM" },
];
const kr = (value: number) => `${Math.round(value).toLocaleString("sv-SE")} kr`;

function FinanceDashboard({ onOpen }: { onOpen: (page: Page) => void }) {
  const [month, setMonth] = useState("2026-10");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const months = ["2026-09", "2026-10"];
  const period = hoursPeriods.find((item) => item.key === month) ?? hoursPeriods[0];
  const locked = isMonthLocked(month);
  const deadline = monthDeadline(month);
  const cutoff = period.end;
  const locks: Record<string, MonthLock> = { "2026-09": { at: addDays(monthDeadline("2026-09"), 1), by: "Automatic" } };
  const people = hoursPeople.map((person) => {
    const stats = personHours(person, period, locks, cutoff);
    return { person, stats, steps: nextSteps(person, stats) };
  });
  const total = (pick: (row: (typeof people)[number]) => number) => people.reduce((sum, row) => sum + pick(row), 0);
  const expected = total((row) => row.stats.expected);
  const missing = total((row) => row.stats.missing);
  const afterLock = total((row) => row.stats.afterLock);
  const short = people.filter((row) => row.stats.missing > 0).length;
  // Drafts haven't left the consultant's desk, so "in" means submitted, as in Hours overview.
  const submitted = total((row) => row.stats.submitted);
  const pct = expected ? Math.round((submitted / expected) * 100) : 0;
  const daysLeft = Math.max(0, Math.round((toDate(deadline).getTime() - toDate(TODAY).getTime()) / 86400000));

  const clientHours = hoursEntries.filter((entry) => monthOf(entry.date) === month && entry.kind === "client");
  const customers = Object.values(
    clientHours.reduce<Record<string, { account: string; approved: number; waiting: number; value: number }>>((groups, entry) => {
      const project = projectFor(entry.person);
      const group = groups[project.account] ?? { account: project.account, approved: 0, waiting: 0, value: 0 };
      if (entry.status === "approved") groups[project.account] = { ...group, approved: group.approved + entry.hours, value: group.value + entry.hours * project.rate };
      else groups[project.account] = { ...group, waiting: group.waiting + entry.hours };
      return groups;
    }, {}),
  ).sort((a, b) => b.value - a.value);
  const ready = customers.reduce((sum, item) => sum + item.value, 0);
  const readyHours = customers.reduce((sum, item) => sum + item.approved, 0);
  const notApproved = customers.reduce((sum, item) => sum + item.waiting, 0);
  // Drafts haven't reached a project manager yet; only submitted time waits for one.
  const withPm = clientHours.filter((entry) => entry.status === "submitted").reduce((sum, entry) => sum + entry.hours, 0);

  const queue = pmQueue(people);
  const overdueWithPms = queue.reduce((sum, [, group]) => sum + group.overdue, 0);

  const overtime = overtimeForPayroll.filter((item) => item.month === month);
  const maxLate = Math.max(...lateHoursBefore.map(([, hours]) => hours));

  function exportPayroll() {
    const lines = [["Person", "Project", "Overtime h", "Pre-approved by", "Status"].join(","), ...overtime.map((item) => [item.person, item.project, item.hours, item.approvedBy, item.status].map((value) => `"${value}"`).join(","))];
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    link.download = `overtime-${month}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="calm">
      <section className="tw-hero">
        <div className="tw-hero-top">
          <div className="tw-title">
            <div className="tw-arrows">
              <Button aria-label="Previous month" className="tw-arrow tw-arrow--back" disabled={month === months[0]} onClick={() => setMonth(months[months.indexOf(month) - 1])}><Icon name="arrow" size={14} /></Button>
              <Button aria-label="Next month" className="tw-arrow" disabled={month === months[months.length - 1]} onClick={() => setMonth(months[months.indexOf(month) + 1])}><Icon name="arrow" size={14} /></Button>
            </div>
            <div>
              <h2 className="tw-display">Month close · {monthTitle(month)}</h2>
              <p className="tw-subtle">{locked ? `Locked since ${fmtDay(addDays(deadline, 1))}` : `Locks automatically after ${fmtDay(deadline)} · ${plural(daysLeft, "day", "days")} left`}</p>
            </div>
          </div>
          <div className="tw-figure">
            <strong className="tw-display">{pct}<small>%</small></strong>
            <span className="tw-subtle">of hours submitted</span>
          </div>
        </div>
        <div className="tw-line"><span style={{ width: `${Math.min(100, pct)}%` }} /></div>
        <div className={`tw-next tw-next--${locked ? "green" : short ? "amber" : "green"}`} role="status">
          <span className="tw-next-text">
            <i className="tw-dot" />
            {locked
              ? `${monthName(month)} is closed. ${fmtHours(afterLock)} h came in after the lock, through unlocks with a reason.`
              : `${plural(short, "person is", "people are")} still short ${fmtHours(missing)} h, and ${fmtHours(overdueWithPms)} h are overdue for approval with project managers.`}
          </span>
          <Button className="primary-button compact" onClick={() => onOpen("hours")}>{locked ? "See the lock log" : "See who"}</Button>
        </div>
      </section>

      <section className="ho-tiles">
        <article className="ho-tile">
          <span>Ready to invoice</span>
          <strong className="tw-display">{kr(ready)}</strong>
          <small>{fmtHours(readyHours)} approved billable h</small>
        </article>
        <article className="ho-tile">
          <span>Waiting for approval</span>
          <strong className="tw-display">{fmtHours(withPm)} h</strong>
          <small>client time submitted, not approved yet</small>
        </article>
        <article className={`ho-tile ${missing ? "is-alert" : ""}`}>
          <span>Not reported</span>
          <strong className="tw-display">{fmtHours(missing)} h</strong>
          <small>{plural(short, "person", "people")} below expected</small>
        </article>
        <article className="ho-tile">
          <span>Overtime for payroll</span>
          <strong className="tw-display">{fmtHours(overtime.reduce((sum, item) => sum + item.hours, 0))} h</strong>
          <small>{plural(overtime.length, "person", "people")} this month</small>
        </article>
      </section>

      <section className="ts-grid">
        <article className="tw-panel ts-card">
          <h3>Ready to invoice, by customer</h3>
          <table className="fd-table">
            <thead><tr><th>Customer</th><th className="r">Approved</th><th className="r">Value</th><th className="r">Not approved</th></tr></thead>
            <tbody>
              {customers.map((item) => (
                <tr key={item.account}>
                  <td><strong>{item.account}</strong></td>
                  <td className="r">{fmtHours(item.approved)} h</td>
                  <td className="r">{kr(item.value)}</td>
                  <td className={`r ${item.waiting ? "fd-wait" : ""}`}>{item.waiting ? `${fmtHours(item.waiting)} h` : "–"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td>Total</td><td className="r">{fmtHours(readyHours)} h</td><td className="r">{kr(ready)}</td><td className="r">{fmtHours(notApproved)} h</td></tr></tfoot>
          </table>
          <p className="tw-hint">Value = approved billable hours × the project's hourly rate. Made-up rates in the demo.</p>
        </article>
        <aside className="ts-side">
          <article className="tw-panel ts-card">
            <h3>Waiting for a project manager</h3>
            {queue.length ? (
              queue.map(([pm, group]) => (
                <PmQueueRow className="fd-pm" group={group} key={pm} onNudge={() => setToast(`Asked ${pm} to approve ${fmtHours(group.overdue)} overdue h.`)} pm={pm} />
              ))
            ) : (
              <p className="tw-hint">Nothing waits for approval.</p>
            )}
          </article>
          <article className="tw-panel ts-card">
            <h3>Overtime for payroll</h3>
            {overtime.length ? (
              <>
                {overtime.map((item) => (
                  <div className="fd-pm" key={item.person}>
                    <Avatar name={item.person} size="small" />
                    <span><strong>{item.person}</strong><small>{item.project} · pre-approved by {item.approvedBy}</small></span>
                    <b>{item.hours} h</b>
                    <span className={`tw-state tw-state--${item.status === "Approved" ? "green" : "sand"}`}>{item.status}</span>
                  </div>
                ))}
                <Button className="tw-link fd-export" onClick={exportPayroll}>Export for payroll (CSV)</Button>
              </>
            ) : (
              <p className="tw-hint">No overtime this month.</p>
            )}
          </article>
        </aside>
      </section>

      <section className="tw-panel ts-card fd-late">
        <h3>Hours added after the deadline, before Zephyr</h3>
        <div className="fd-bars">
          {lateHoursBefore.map(([label, hours]) => (
            <div className="fd-bar" key={label} title={`${label}: ${hours} h added after the 2nd`}>
              <span>{hours}</span>
              <i style={{ height: `${(hours / maxLate) * 100}%` }} />
              <small>{label}</small>
            </div>
          ))}
          <div className="fd-bar fd-bar--goal" title="With the automatic lock, only unlocked changes with a reason">
            <span>{fmtHours(afterLock)}</span>
            <i style={{ height: `${Math.max(2, (afterLock / maxLate) * 100)}%` }} />
            <small>Zephyr</small>
          </div>
        </div>
        <p className="tw-hint">Measured in Dynamics on 29 Oct 2026: 35–269 h a month came in after the 2nd, 95% of it client time. With the lock, late hours only come in through an unlock with a reason.</p>
      </section>
      {toast && <div className="tw-toast" role="status">{toast}</div>}
    </div>
  );
}

// Time summary: the consultant's own time, read-only. Monthly answers "am I done before the month closes?";
// weekly shows the last weeks and what a week went to. Entering time happens in Time entries.
type DayMark = "full" | "partial" | "none" | "away" | "off" | "future" | "outside";

function TimeSummary({ entries, weekStart, setWeekStart, requests, onRequest, onOpenWeek }: TimeData & { onOpenWeek: (monday: string) => void }) {
  const [view, setView] = useState<"month" | "week">("month");
  const [month, setMonth] = useState(monthOf(TODAY));
  const [change, setChange] = useState({ open: false, reason: "", error: "" });
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const minutesIn = (from: string, to: string) => sumMinutes(entries.filter((entry) => entry.date >= from && entry.date <= to));
  const minutesOn = (date: string) => minutesIn(date, date);
  const expectedIn = (from: string, to: string) => {
    let sum = 0;
    for (let date = from; date <= to; date = addDays(date, 1)) sum += expectedOn(date);
    return sum;
  };
  const split = (from: string, to: string) => {
    const list = entries.filter((entry) => entry.date >= from && entry.date <= to);
    const of = (test: (entry: TimeEntry) => boolean) => sumMinutes(list.filter(test));
    return [
      { label: "Client, billable", minutes: of((entry) => typeOf(entry.type).billable), tone: "client" },
      { label: "Client, not billable", minutes: of((entry) => !typeOf(entry.type).billable && projectOf(entry.project)?.kind === "client"), tone: "support" },
      { label: "Internal", minutes: of((entry) => projectOf(entry.project)?.kind === "internal"), tone: "internal" },
      { label: "Time away", minutes: of((entry) => !entry.project), tone: "away" },
    ].filter((item) => item.minutes > 0);
  };

  const first = `${month}-01`;
  const last = addDays(`${nextMonth(month)}-01`, -1);
  const locked = isMonthLocked(month);
  const deadline = monthDeadline(month);
  const asked = requests.some((item) => item.month === month);
  const soFar = TODAY < last ? (TODAY < first ? addDays(first, -1) : TODAY) : last;
  const monthMinutes = minutesIn(first, last);
  // A month always expects the whole month, also while it's running.
  const monthExpected = expectedIn(first, last);
  const monthWeeks: string[] = [];
  for (let monday = mondayOf(first); monday <= last; monday = addDays(monday, 7)) monthWeeks.push(monday);
  const openDays = monthWeeks.flatMap(weekDates).filter((date) => date >= first && date <= soFar && expectedOn(date) > 0 && minutesOn(date) < expectedOn(date));
  const weekInfo = (monday: string) => {
    const list = entries.filter((entry) => entry.date >= monday && entry.date <= addDays(monday, 6));
    return { list, status: weekStatus(list), minutes: sumMinutes(list), drafts: list.some((entry) => entry.status === "draft" || entry.status === "rejected") };
  };
  const unsent = monthWeeks.filter((monday) => monday <= TODAY && weekInfo(monday).drafts);

  const mark = (date: string): DayMark => {
    if (date < first || date > last) return "outside";
    const minutes = minutesOn(date);
    if (entries.some((entry) => entry.date === date && !entry.project)) return "away";
    if (!expectedOn(date)) return minutes ? "full" : "off";
    if (date > TODAY) return minutes ? "partial" : "future";
    return minutes >= expectedOn(date) ? "full" : minutes ? "partial" : "none";
  };

  // The next step for the month, the same calm sentence as in Time entries.
  const monthNext: { tone: string; text: string; action?: string; run?: () => void } = (() => {
    if (locked)
      return asked
        ? { tone: "slate", text: `${monthName(month)} closed ${fmtDay(deadline)} and is locked. Finance has your request to change it.` }
        : { tone: "slate", text: `${monthName(month)} closed ${fmtDay(deadline)} and is locked. Need to change something? Finance can open it for you.`, action: "Request a change", run: () => setChange({ open: true, reason: "", error: "" }) };
    if (first > TODAY) return { tone: "slate", text: `${monthName(month)} hasn't started. Plan vacation or absence in Time entries.` };
    if (openDays.length || unsent.length) {
      const parts = [openDays.length ? plural(openDays.length, "day is", "days are") + " still open" : "", unsent.length ? plural(unsent.length, "week isn't", "weeks aren't") + " submitted" : ""].filter(Boolean);
      const target = openDays.length ? mondayOf(openDays[0]) : unsent[0];
      return { tone: "amber", text: `${parts.join(" and ")}. ${monthName(month)} closes ${fmtDay(deadline)}.`, action: `Open week ${isoWeek(target)}`, run: () => onOpenWeek(target) };
    }
    return { tone: "green", text: `Everything is in. ${monthName(month)} closes ${fmtDay(deadline)}.` };
  })();

  const weekEnd = addDays(weekStart, 6);
  const history = Array.from({ length: 8 }, (_, index) => addDays(weekStart, (index - 7) * 7));
  const selected = weekInfo(weekStart);
  const weekExpected = expectedIn(weekStart, weekEnd);
  const byRow = Object.values(
    selected.list.reduce<Record<string, { name: string; sub: string; minutes: number }>>((groups, entry) => {
      const row = { key: rowKey(entry.project, entry.type), project: entry.project, type: entry.type };
      const group = groups[row.key] ?? { name: rowName(row), sub: rowSub(row), minutes: 0 };
      groups[row.key] = { ...group, minutes: group.minutes + entry.minutes };
      return groups;
    }, {}),
  ).sort((a, b) => b.minutes - a.minutes);
  // The deadline that matters for a week is the month its open entries belong to (a week can span two months).
  const draftMonth = monthOf(selected.list.filter((entry) => entry.status === "draft" || entry.status === "rejected").sort((a, b) => a.date.localeCompare(b.date))[0]?.date ?? weekStart);
  const weekNext: { tone: string; text: string } = selected.list.some((entry) => entry.status === "rejected")
    ? { tone: "red", text: "A project manager sent something back this week." }
    : selected.drafts
      ? { tone: "amber", text: `Not submitted yet. ${monthName(draftMonth)} closes ${fmtDay(monthDeadline(draftMonth))}.` }
      : selected.list.length
        ? { tone: "green", text: selected.status.label === "Approved" ? "Approved." : "Submitted. Waiting for approval." }
        : { tone: "slate", text: "Nothing logged this week." };

  const step = (amount: number) => (view === "month" ? setMonth(monthOf(addDays(`${month}-15`, amount * 30))) : setWeekStart(addDays(weekStart, amount * 7)));
  const figure = view === "month" ? { minutes: monthMinutes, expected: monthExpected } : { minutes: selected.minutes, expected: weekExpected };
  const next: { tone: string; text: string; action?: string; run?: () => void } = view === "month" ? monthNext : weekNext;
  const maxWeek = Math.max(...history.map((monday) => Math.max(weekInfo(monday).minutes, expectedIn(monday, addDays(monday, 6)))), 1);

  function sendChange() {
    if (change.reason.trim().length < 5) return setChange({ ...change, error: "Write what you need to change and why. Finance reads it before opening the month." });
    onRequest({ month, reason: change.reason.trim(), at: TODAY });
    setChange({ open: false, reason: "", error: "" });
    setToast(`Finance has your request. You'll hear when ${monthName(month)} is open for you.`);
  }

  return (
    <div className="calm">
      <section className="tw-hero">
        <div className="tw-hero-top">
          <div className="tw-title">
            <div className="tw-arrows">
              <Button aria-label={view === "month" ? "Previous month" : "Previous week"} className="tw-arrow tw-arrow--back" onClick={() => step(-1)}><Icon name="arrow" size={14} /></Button>
              <Button aria-label={view === "month" ? "Next month" : "Next week"} className="tw-arrow" onClick={() => step(1)}><Icon name="arrow" size={14} /></Button>
            </div>
            <div>
              <h2 className="tw-display">{view === "month" ? monthTitle(month) : `Week ${isoWeek(weekStart)}`}</h2>
              <p className="tw-subtle">
                {view === "month" ? (locked ? `Locked since ${fmtDay(addDays(deadline, 1))}` : `Closes ${fmtDay(deadline)}`) : `${shortDate(weekStart)} – ${shortDate(weekEnd)}`}
                <span className="ts-views" role="radiogroup">
                  {(["month", "week"] as const).map((item) => (
                    <button aria-checked={view === item} className={view === item ? "is-active" : ""} key={item} onClick={() => setView(item)} role="radio" type="button">
                      {item === "month" ? "Monthly" : "Weekly"}
                    </button>
                  ))}
                </span>
              </p>
            </div>
          </div>
          <div className="tw-figure">
            <strong className="tw-display">{fmtH(figure.minutes)}<small>h</small></strong>
            <span className="tw-subtle">of {fmtH(figure.expected)}</span>
          </div>
        </div>
        <div className="tw-line"><span style={{ width: `${figure.expected ? Math.min(100, (figure.minutes / figure.expected) * 100) : 0}%` }} /></div>
        <div className={`tw-next tw-next--${next.tone}`} role="status">
          <span className="tw-next-text"><i className="tw-dot" />{next.text}</span>
          {next.action && <Button className="primary-button compact" onClick={next.run}>{next.action}</Button>}
          {view === "week" && <Button className="tw-link" onClick={() => onOpenWeek(weekStart)}>Open in Time entries</Button>}
        </div>
      </section>

      {view === "month" ? (
        <section className="ts-grid">
          <article className="tw-panel ts-calendar">
            <div className="ts-cal-head">
              {dayNames.map((name) => <span key={name}>{name.slice(0, 3)}</span>)}
            </div>
            {monthWeeks.map((monday) => (
              <div className="ts-cal-week" key={monday}>
                {weekDates(monday).map((date) => {
                  const kind = mark(date);
                  const minutes = minutesOn(date);
                  return (
                    <button
                      className={["ts-day", `ts-day--${kind}`, date === TODAY && "is-today"].filter(Boolean).join(" ")}
                      disabled={kind === "outside"}
                      key={date}
                      onClick={() => onOpenWeek(monday)}
                      title={isHoliday(date) ? `${fmtDay(date)}: public holiday` : `${fmtDay(date)}: ${minutes ? `${fmtH(minutes)} h` : "no time"}`}
                      type="button"
                    >
                      <span>{toDate(date).getUTCDate()}</span>
                      <b>{kind === "outside" ? "" : minutes ? fmtH(minutes) : kind === "none" ? "–" : ""}</b>
                    </button>
                  );
                })}
              </div>
            ))}
            <div className="ts-legend">
              <span><i className="ts-key ts-day--full" />Full day</span>
              <span><i className="ts-key ts-day--partial" />Part of the day</span>
              <span><i className="ts-key ts-day--none" />Nothing logged</span>
              <span><i className="ts-key ts-day--away" />Time away</span>
            </div>
          </article>
          <aside className="ts-side">
            <article className="tw-panel ts-card">
              <h3>Where the time went</h3>
              {split(first, last).length ? (
                split(first, last).map((item) => (
                  <div className="ts-split" key={item.label}>
                    <span>{item.label}</span>
                    <b>{fmtH(item.minutes)} h</b>
                    <i className={`ts-bar ts-bar--${item.tone}`} style={{ width: `${monthMinutes ? (item.minutes / monthMinutes) * 100 : 0}%` }} />
                  </div>
                ))
              ) : (
                <p className="tw-hint">Nothing logged this month yet.</p>
              )}
            </article>
            <article className="tw-panel ts-card">
              <h3>Weeks</h3>
              {monthWeeks.map((monday) => {
                const info = weekInfo(monday);
                return (
                  <button className="ts-week" key={monday} onClick={() => onOpenWeek(monday)} type="button">
                    <span>
                      <strong>Week {isoWeek(monday)}</strong>
                      <small>{shortDate(monday)} – {shortDate(addDays(monday, 6))}</small>
                    </span>
                    <span className={`tw-state tw-state--${info.status.tone}`}>{monday > TODAY ? "Not started" : info.status.label}</span>
                    <b>{info.minutes ? `${fmtH(info.minutes)} h` : "–"}</b>
                  </button>
                );
              })}
            </article>
          </aside>
        </section>
      ) : (
        <section className="ts-grid">
          <article className="tw-panel ts-history">
            <h3>Last 8 weeks</h3>
            <div className="ts-bars">
              {history.map((monday) => {
                const info = weekInfo(monday);
                const expected = expectedIn(monday, addDays(monday, 6));
                return (
                  <button aria-pressed={monday === weekStart} className={`ts-col ${monday === weekStart ? "is-active" : ""}`} key={monday} onClick={() => setWeekStart(monday)} type="button">
                    <span className="ts-col-value">{info.minutes ? fmtH(info.minutes) : "–"}</span>
                    <span className="ts-col-track">
                      <i className="ts-col-expected" style={{ bottom: `${(expected / maxWeek) * 100}%` }} />
                      <i className={`ts-col-fill ts-col-fill--${info.status.tone}`} style={{ height: `${(info.minutes / maxWeek) * 100}%` }} />
                    </span>
                    <span className="ts-col-label">W{isoWeek(monday)}</span>
                  </button>
                );
              })}
            </div>
            <p className="tw-hint">The line on each bar is what was expected that week. Grey bars are approved, light ones still open.</p>
          </article>
          <aside className="ts-side">
            <article className="tw-panel ts-card">
              <h3>Week {isoWeek(weekStart)}</h3>
              {byRow.length ? (
                byRow.map((item) => (
                  <div className="ts-split" key={item.name + item.sub}>
                    <span>{item.name}<small>{item.sub}</small></span>
                    <b>{fmtH(item.minutes)} h</b>
                    <i className="ts-bar ts-bar--client" style={{ width: `${selected.minutes ? (item.minutes / selected.minutes) * 100 : 0}%` }} />
                  </div>
                ))
              ) : (
                <p className="tw-hint">Nothing logged this week.</p>
              )}
            </article>
          </aside>
        </section>
      )}

      {change.open && (
        <div className="modal-backdrop tw-sheet" onClick={() => setChange({ ...change, open: false })}>
          <div aria-modal="true" className="modal-card" onClick={(event) => event.stopPropagation()} role="dialog">
            <div className="panel-heading">
              <div><Heading level={2}>Request a change to {monthName(month)}</Heading><p>The month is locked. Finance opens it for you for a few days if they agree.</p></div>
              <Button aria-label="Close" className="icon-button small" onClick={() => setChange({ ...change, open: false })}><Icon name="close" size={15} /></Button>
            </div>
            <label className="field tw-search">
              <span>What do you need to change, and why?</span>
              <TextInput autoFocus maxLength={300} onChange={(event) => setChange({ ...change, reason: event.target.value, error: "" })} placeholder="e.g. Forgot 4 h on CRM migration on 28 Sep" value={change.reason} />
            </label>
            {change.error && <p className="form-message form-message--error" role="alert">{change.error}</p>}
            <Button className="primary-button compact full tw-confirm" onClick={sendChange}>Send to Finance</Button>
          </div>
        </div>
      )}
      {toast && <div className="tw-toast" role="status">{toast}</div>}
    </div>
  );
}

// Approvals (F12). Flow: draft → submitted → approved, or submitted → sent back → consultant fixes → submitted again.
// The PM approves a whole week in one click, or sends back single lines with a required comment; the rest of the week stays
// submitted. An approved line can be recalled while its month is open. Once the month is locked the PM asks Finance instead
// (the rules on main say only Finance reopens an approved entry; Henry wants PMs to be able to, before the lock).
type LineStatus = "submitted" | "approved" | "sent_back";
type ApprovalLine = {
  id: number;
  date: string;
  what: string;
  hours: number;
  billable: boolean;
  note?: string;
  status: LineStatus;
  comment?: string;
  recalled?: boolean;
  financeRequest?: string;
};
type Decision = { status: "Approved" | "Rejected" | "Changes requested"; note?: string };
type ApprovalItem = {
  id: number;
  type: string;
  name: string;
  initials: string;
  title: string;
  detail: string;
  project: string;
  age: string;
  week: string;
  flag?: string;
  lines?: ApprovalLine[];
  facts?: [string, string][];
  decision?: Decision;
};

let approvalLineId = 100;
const ln = (date: string, what: string, hours: number, billable: boolean, note?: string, status: LineStatus = "submitted", extra: Partial<ApprovalLine> = {}): ApprovalLine => ({
  id: ++approvalLineId,
  date,
  what,
  hours,
  billable,
  note,
  status,
  ...extra,
});
const NOVA = "Nova implementation · Client work";
const DIGITAL = "Digital platform 2.0 · Client work";
const PORTAL = "Service portal · Client work";

const initialApprovals: ApprovalItem[] = [
  {
    id: 1, type: "Timesheets", name: "Oliver Nyström", initials: "ON", title: "Week 43 timesheet", detail: "", project: "Nova implementation", age: "5 d ago", week: "2026-10-19",
    lines: [
      ln("2026-10-19", NOVA, 8, true, "Data mapping workshop"),
      ln("2026-10-20", NOVA, 8, true, "Integration build"),
      ln("2026-10-21", NOVA, 8, true, "Integration build"),
      ln("2026-10-22", NOVA, 8, true, "UAT preparation"),
      ln("2026-10-23", NOVA, 4, true, "UAT with the customer"),
      ln("2026-10-23", "Internal development", 2.5, false, "Azure certification, module 3"),
    ],
  },
  {
    id: 2, type: "Timesheets", name: "Viktor Larsson", initials: "VL", title: "Week 43 timesheet", detail: "", project: "Digital platform 2.0", age: "5 d ago", week: "2026-10-19",
    lines: [
      ln("2026-10-19", DIGITAL, 8, true, "Checkout redesign"),
      ln("2026-10-20", DIGITAL, 8, true, "Checkout redesign"),
      ln("2026-10-21", DIGITAL, 8, true, "Payment provider integration"),
      ln("2026-10-22", DIGITAL, 8, true, "Payment provider integration"),
      ln("2026-10-23", DIGITAL, 2, true, "Release notes"),
      ln("2026-10-23", "Internal development", 6, false, "Sprint planning and retro"),
    ],
  },
  {
    id: 3, type: "Timesheets", name: "Sara Ahmed", initials: "SA", title: "Week 43 timesheet", detail: "", project: "Service portal", age: "6 d ago", week: "2026-10-19", flag: "Below 40 h target",
    lines: [
      ln("2026-10-19", PORTAL, 8, true, "Accessibility fixes"),
      ln("2026-10-20", PORTAL, 8, true, "Accessibility fixes"),
      ln("2026-10-21", PORTAL, 6, true, "Handover documentation", "sent_back", { comment: "Customer text missing. Add what was delivered." }),
      ln("2026-10-22", "Presales support", 4, false, "Proposal for Forma Studio"),
      ln("2026-10-22", "Internal development", 1.5, false),
      ln("2026-10-23", "Internal development", 4, false, "Component library cleanup"),
    ],
  },
  {
    id: 4, type: "Timesheets", name: "Viktor Larsson", initials: "VL", title: "Week 44 timesheet", detail: "", project: "Digital platform 2.0", age: "1 h ago", week: "2026-10-26",
    lines: [
      ln("2026-10-26", DIGITAL, 8, true, "Order history"),
      ln("2026-10-27", DIGITAL, 8, true, "Order history"),
      ln("2026-10-28", DIGITAL, 8, true, "Refund flow"),
      ln("2026-10-29", DIGITAL, 8, true, "Refund flow"),
    ],
  },
  {
    id: 5, type: "Timesheets", name: "Oliver Nyström", initials: "ON", title: "Week 42 timesheet", detail: "", project: "Nova implementation", age: "12 d ago", week: "2026-10-12",
    lines: [
      ln("2026-10-12", NOVA, 8, true, "Environment setup", "approved"),
      ln("2026-10-13", NOVA, 8, true, "Environment setup", "approved"),
      ln("2026-10-14", NOVA, 8, true, "Data migration", "approved"),
      ln("2026-10-15", NOVA, 8, true, "Data migration", "approved"),
      ln("2026-10-16", NOVA, 6, true, "Test data", "approved"),
      ln("2026-10-16", "Internal development", 2, false, "Code review", "approved"),
    ],
  },
  {
    id: 6, type: "Timesheets", name: "Sara Ahmed", initials: "SA", title: "Week 40 timesheet", detail: "", project: "Service portal", age: "4 w ago", week: "2026-09-28",
    lines: [
      ln("2026-09-28", PORTAL, 8, true, "Design review", "approved"),
      ln("2026-09-29", PORTAL, 8, true, "Design review", "approved"),
      ln("2026-09-30", PORTAL, 8, true, "Search page", "approved"),
      ln("2026-10-01", PORTAL, 8, true, "Search page", "approved"),
      ln("2026-10-02", PORTAL, 8, true, "Bug fixing", "approved"),
    ],
  },
  {
    id: 7, type: "Expenses", name: "Maja Karlsson", initials: "MK", title: "Train Stockholm–Gothenburg", detail: "SEK 1,240 · receipt attached", project: "CRM migration", age: "3 h ago", week: "2026-10-19",
    facts: [["Amount", "SEK 1,240"], ["Date", "Tue 20 Oct"], ["Category", "Travel, train"], ["Receipt", "Attached"], ["Project", "CRM migration"]],
  },
  {
    id: 8, type: "Expenses", name: "Oliver Nyström", initials: "ON", title: "Client dinner, Nordic Solutions", detail: "SEK 3,860 · receipt attached", project: "Nordic Solutions pursuit", age: "1 d ago", week: "2026-10-19", flag: "Above SEK 3,000 policy",
    facts: [["Amount", "SEK 3,860"], ["Date", "Wed 21 Oct"], ["Category", "Client entertainment"], ["Receipt", "Attached"], ["Project", "Nordic Solutions pursuit"]],
  },
  {
    id: 9, type: "Absence", name: "Noah Berg", initials: "NB", title: "Vacation, 9 – 20 Nov", detail: "10 working days", project: "Service desk", age: "2 d ago", week: "2026-10-26",
    facts: [["From", "Mon 9 Nov"], ["To", "Fri 20 Nov"], ["Working days", "10"], ["Project", "Service desk"]],
  },
];

const fmt1 = (hours: number) => hours.toFixed(1);
const weekLabel = (monday: string) => `Week ${isoWeek(monday)} · ${toDate(monday).getUTCDate()}–${shortDate(addDays(monday, 6))}`;
// PMs approve a week by the Wednesday after it (same rule as Hours overview).
const approveDueOf = (monday: string) => addDays(monday, 9);
const sumHours = (list: ApprovalLine[]) => list.reduce((total, line) => total + line.hours, 0);
const isWaiting = (item: ApprovalItem) => (item.lines ? item.lines.some((line) => line.status === "submitted") : !item.decision);

// What the manager needs at a glance: totals, billable share, and which days are filled or short.
function sheetSummary(item: ApprovalItem) {
  const lines = item.lines ?? [];
  const days = weekDates(item.week).slice(0, 5).map((date) => ({ date, hours: sumHours(lines.filter((line) => line.date === date)) }));
  return {
    total: sumHours(lines),
    billable: sumHours(lines.filter((line) => line.billable)),
    days,
    empty: days.filter((day) => day.hours === 0).length,
    short: days.filter((day) => day.hours > 0 && day.hours < 8).length,
    sentBack: lines.filter((line) => line.status === "sent_back").length,
    approved: lines.filter((line) => line.status === "approved").length,
  };
}

const decisionTone: Record<Decision["status"], string> = { Approved: "green", Rejected: "red", "Changes requested": "amber" };
const lineTone: Record<LineStatus, string> = { submitted: "sand", approved: "green", sent_back: "amber" };
const lineLabel: Record<LineStatus, string> = { submitted: "Submitted", approved: "Approved", sent_back: "Sent back" };

// The badge on a row that has nothing left to decide.
function doneStatus(item: ApprovalItem): { label: string; tone: string } {
  if (!item.lines) return item.decision ? { label: item.decision.status, tone: decisionTone[item.decision.status] } : { label: "Waiting", tone: "sand" };
  return item.lines.some((line) => line.status === "sent_back") ? { label: "Changes requested", tone: "amber" } : { label: "Approved", tone: "green" };
}

function Approvals() {
  const [items, setItems] = useState<ApprovalItem[]>(initialApprovals);
  const [tab, setTab] = useState("All");
  const [week, setWeek] = useState("all");
  const [status, setStatus] = useState("all");
  const [review, setReview] = useState<{ id: number; mode: "view" | "reject" | "changes" } | null>(null);
  // Comments typed on single lines; a line is "open for a comment" while it has an entry here.
  const [open, setOpen] = useState<Record<number, string>>({});
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState("");
  const tabs = ["All", "Timesheets", "Expenses", "Absence"];

  const weeks = [...new Set(items.map((item) => item.week))].sort().reverse();
  const inWeek = items.filter((item) => week === "all" || item.week === week);
  const visible = inWeek
    .filter((item) => tab === "All" || item.type === tab)
    .filter((item) => status === "all" || (status === "waiting" ? isWaiting(item) : !isWaiting(item) && doneStatus(item).label === (status === "approved" ? "Approved" : "Changes requested")))
    .sort((a, b) => b.week.localeCompare(a.week));
  const waiting = items.filter(isWaiting);
  const waitingSheets = waiting.filter((item) => item.lines);
  const lateSheets = waitingSheets.filter((item) => approveDueOf(item.week) < TODAY);
  const submittedLines = waitingSheets.flatMap((item) => item.lines!.filter((line) => line.status === "submitted"));
  const current = review ? items.find((item) => item.id === review.id) : undefined;

  const patch = (id: number, change: (item: ApprovalItem) => ApprovalItem) => setItems((list) => list.map((item) => (item.id === id ? change(item) : item)));
  const patchLine = (item: ApprovalItem, lineId: number, change: (line: ApprovalLine) => ApprovalLine): ApprovalItem => ({
    ...item,
    lines: item.lines?.map((line) => (line.id === lineId ? change(line) : line)),
  });
  const closeReview = () => {
    setReview(null);
    setOpen({});
  };
  const openReview = (id: number, mode: "view" | "reject" | "changes" = "view") => {
    const item = items.find((entry) => entry.id === id);
    setNote("");
    setNoteError("");
    // On a timesheet, "request changes" opens a comment box on every line still waiting; the PM fills in the ones that are wrong.
    setOpen(item?.lines && mode === "changes" ? Object.fromEntries(item.lines.filter((line) => line.status === "submitted").map((line) => [line.id, ""])) : {});
    setReview({ id, mode: item?.lines && mode === "changes" ? "view" : mode });
  };

  const approve = (id: number) => {
    patch(id, (item) => (item.lines ? { ...item, lines: item.lines.map((line) => (line.status === "submitted" ? { ...line, status: "approved" } : line)) } : { ...item, decision: { status: "Approved" } }));
    closeReview();
  };
  // Approving everything that is waiting is only for timesheets with nothing to look at.
  const approveClean = () =>
    setItems((list) =>
      list.map((item) =>
        item.lines && !item.flag && visible.includes(item) && !item.lines.some((line) => line.status === "sent_back")
          ? { ...item, lines: item.lines.map((line) => (line.status === "submitted" ? { ...line, status: "approved" } : line)) }
          : item,
      ),
    );
  const sendNote = () => {
    if (!review || !current || review.mode === "view") return;
    if (note.trim().length < 5) {
      setNoteError(review.mode === "reject" ? "Say why you're rejecting it, so they know what went wrong." : "Say what needs to change.");
      return;
    }
    const text = note.trim();
    patch(current.id, (item) =>
      item.lines
        ? { ...item, lines: item.lines.map((line) => (line.status === "submitted" ? { ...line, status: "sent_back", comment: text } : line)) }
        : { ...item, decision: { status: review.mode === "reject" ? "Rejected" : "Changes requested", note: text } },
    );
    closeReview();
  };
  // Sends back every open line (submitted ones), or recalls approved ones. In a locked month the recall becomes a request to Finance.
  const sendLines = () => {
    if (!current) return;
    const ids = Object.keys(open).map(Number);
    if (ids.some((id) => open[id].trim().length < 5)) {
      setNoteError("Write a comment on every line you send back. The consultant sees it.");
      return;
    }
    patch(current.id, (item) => ({
      ...item,
      lines: item.lines?.map((line) => {
        if (open[line.id] === undefined) return line;
        const text = open[line.id].trim();
        if (line.status === "approved" && isMonthLocked(monthOf(line.date))) return { ...line, financeRequest: text };
        return { ...line, status: "sent_back", comment: text, recalled: line.status === "approved" };
      }),
    }));
    setOpen({});
    setNoteError("");
  };
  const undoSendBack = (item: ApprovalItem, line: ApprovalLine) => patch(item.id, () => patchLine(item, line.id, ({ comment, recalled, ...rest }) => ({ ...rest, status: recalled ? "approved" : "submitted" })));
  // Accidental approval: put approved lines back to submitted (no comment, the consultant is not involved). Locked months need Finance.
  const canUndo = (item: ApprovalItem) => (item.lines ? item.lines.some((line) => line.status === "approved" && !line.financeRequest && !isMonthLocked(monthOf(line.date))) : !!item.decision);
  const undoApproval = (id: number) =>
    patch(id, (item) =>
      item.lines
        ? { ...item, lines: item.lines.map((line) => (line.status === "approved" && !isMonthLocked(monthOf(line.date)) ? { ...line, status: "submitted" } : line)) }
        : { ...item, decision: undefined },
    );
  const undoLineApproval = (item: ApprovalItem, line: ApprovalLine) => patch(item.id, () => patchLine(item, line.id, (entry) => ({ ...entry, status: "submitted" })));
  const undoAllSendBacks = (id: number) =>
    patch(id, (item) => ({
      ...item,
      lines: item.lines?.map(({ comment, ...line }) => (line.status === "sent_back" ? { ...line, status: line.recalled ? "approved" : "submitted", recalled: undefined } : { ...line, comment })),
    }));
  const reopenDecision = (id: number) => patch(id, (item) => ({ ...item, decision: undefined }));

  useEffect(() => {
    if (!review) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeReview();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [review]);

  const summaryText = (item: ApprovalItem) => {
    if (!item.lines) return item.detail;
    const sheet = sheetSummary(item);
    return `${fmt1(sheet.total)} h · ${fmt1(sheet.billable)} h billable · ${5 - sheet.empty} of 5 days filled`;
  };
  const dueText = (item: ApprovalItem) => {
    const due = approveDueOf(item.week);
    return due < TODAY ? `${plural(Math.max(1, workdaysBetween(due, TODAY)), "day", "days")} late` : `due ${fmtDay(due)}`;
  };

  return (
    <>
      <section className="stat-grid stat-grid--three">
        <StatCard accent="amber" change={lateSheets.length ? `${lateSheets.length} overdue` : "none overdue"} icon="bell" label="Waiting for you" note="timesheets, expenses and absence" value={String(waiting.length)} />
        <StatCard accent="sand" change={`${fmt1(sumHours(submittedLines.filter((line) => line.billable)))} h billable`} icon="clock" label="Hours to approve" note="submitted, not approved" value={`${fmt1(sumHours(submittedLines))} h`} />
        <StatCard accent="navy" change="2 receipts" icon="sales" label="Expenses to approve" note="attached" value="SEK 5,100" />
      </section>
      <section className="panel list-panel">
        <div className="panel-heading">
          <div className="tabs" role="tablist">
            {tabs.map((name) => (
              <Button aria-selected={tab === name} className={`tab ${tab === name ? "is-active" : ""}`} key={name} onClick={() => setTab(name)} role="tab">
                {name}<span>{name === "All" ? inWeek.length : inWeek.filter((item) => item.type === name).length}</span>
              </Button>
            ))}
          </div>
          <Button className="secondary-button" onClick={approveClean} title="Approves the visible waiting timesheets, except flagged ones and ones with a line sent back">Approve all timesheets</Button>
        </div>
        <div className="approval-filters">
          <label>
            <span>Week</span>
            <select onChange={(event) => setWeek(event.target.value)} value={week}>
              <option value="all">All weeks</option>
              {weeks.map((monday) => (
                <option key={monday} value={monday}>{weekLabel(monday)} ({items.filter((item) => item.week === monday && isWaiting(item)).length} waiting)</option>
              ))}
            </select>
          </label>
          <label>
            <span>Status</span>
            <select onChange={(event) => setStatus(event.target.value)} value={status}>
              <option value="all">All</option>
              <option value="waiting">Waiting for approval</option>
              <option value="approved">Approved</option>
              <option value="changes">Changes requested</option>
            </select>
          </label>
        </div>
        <div className="approval-list">
          {visible.length === 0 && <p className="approval-empty">Nothing here{week !== "all" ? ` for ${weekLabel(week).toLowerCase()}` : ""}{status !== "all" ? " with that status" : ""}.</p>}
          {visible.map((item) => {
            const sheet = item.lines ? sheetSummary(item) : null;
            const pending = isWaiting(item);
            const done = doneStatus(item);
            const late = item.lines && pending && approveDueOf(item.week) < TODAY;
            return (
              <article
                aria-label={`Open ${item.name}, ${item.title}`}
                className={`approval is-clickable ${!pending ? "is-decided" : ""}`}
                key={item.id}
                onClick={() => openReview(item.id)}
                onKeyDown={(event) => event.key === "Enter" && event.target === event.currentTarget && openReview(item.id)}
                role="button"
                tabIndex={0}
              >
                <Avatar initials={item.initials} name={item.name} />
                <span className="approval-copy">
                  <strong>{item.name} <span>· {item.title}</span></strong>
                  <small>
                    {summaryText(item)} · {item.project} · {item.age}
                    {item.lines && pending && ` · ${dueText(item)}`}
                    {sheet && sheet.sentBack > 0 && ` · ${plural(sheet.sentBack, "line", "lines")} sent back`}
                  </small>
                  {sheet && (
                    <span className="approval-days" aria-hidden="true">
                      {sheet.days.map((day) => (
                        <span className={`approval-day ${day.hours === 0 ? "is-empty" : day.hours < 8 ? "is-short" : ""}`} key={day.date}>
                          {dayNames[dayIndex(day.date)].slice(0, 1)} {day.hours === 0 ? "–" : fmt1(day.hours)}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
                {late && <Badge tone="red">{dueText(item)}</Badge>}
                {item.flag && <Badge tone="amber">{item.flag}</Badge>}
                <Badge tone={item.type === "Timesheets" ? "sand" : item.type === "Expenses" ? "violet" : "slate"}>{item.type.replace(/s$/, "")}</Badge>
                {pending ? (
                  <span className="approval-actions" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
                    <Button className="secondary-button" onClick={() => openReview(item.id, "reject")}>Reject</Button>
                    <Button className="secondary-button" onClick={() => openReview(item.id, "changes")}>Request changes</Button>
                    <Button className="primary-button compact" onClick={() => approve(item.id)}><Icon name="check" size={15} /> Approve</Button>
                  </span>
                ) : (
                  <span className="approval-actions" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
                    <Badge tone={done.tone}>{done.label}</Badge>
                    {canUndo(item) && <Button className="text-button" onClick={() => undoApproval(item.id)}>Undo</Button>}
                  </span>
                )}
              </article>
            );
          })}
        </div>
      </section>
      {review && current && (
        <div className="modal-backdrop" onClick={closeReview}>
          <div aria-modal="true" className="modal-card approval-modal" onClick={(event) => event.stopPropagation()} role="dialog">
            <div className="panel-heading">
              <div>
                <Heading level={2}>{current.name} · {current.title}</Heading>
                <p>{current.lines ? `${weekLabel(current.week)} · ` : ""}{current.project} · sent {current.age}</p>
              </div>
              <Button aria-label="Close" className="icon-button small" onClick={closeReview}><Icon name="close" size={15} /></Button>
            </div>
            {current.flag && <Badge tone="amber">{current.flag}</Badge>}

            {current.lines ? (
              (() => {
                const sheet = sheetSummary(current);
                const lines = current.lines;
                return (
                  <>
                    <div className="approval-totals">
                      <div><span>Total</span><strong>{fmt1(sheet.total)} h</strong></div>
                      <div><span>Billable</span><strong>{fmt1(sheet.billable)} h</strong></div>
                      <div><span>Not billable</span><strong>{fmt1(sheet.total - sheet.billable)} h</strong></div>
                      <div><span>Days filled</span><strong>{5 - sheet.empty} of 5</strong></div>
                    </div>
                    {(sheet.empty > 0 || sheet.short > 0) && (
                      <p className="approval-warning">
                        {[sheet.empty > 0 && plural(sheet.empty, "empty day", "empty days"), sheet.short > 0 && `${plural(sheet.short, "day", "days")} under 8 h`].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <div className="approval-detail">
                      {sheet.days.map((day) => (
                        <div className="approval-day-group" key={day.date}>
                          <div className={`approval-day-head ${day.hours === 0 ? "is-empty" : day.hours < 8 ? "is-short" : ""}`}>
                            <strong>{fmtLongDay(day.date)}</strong>
                            <span>{day.hours === 0 ? "Nothing logged" : `${fmt1(day.hours)} h`}</span>
                          </div>
                          {lines.filter((line) => line.date === day.date).map((line) => {
                            const locked = isMonthLocked(monthOf(line.date));
                            return (
                              <div className="approval-line-block" key={line.id}>
                                <div className="approval-line">
                                  <span>
                                    <strong>{line.what}</strong>
                                    {line.note && <small>{line.note}</small>}
                                  </span>
                                  <Badge tone={lineTone[line.status]}>{lineLabel[line.status]}</Badge>
                                  <b>{fmt1(line.hours)} h</b>
                                  {line.status === "submitted" && open[line.id] === undefined && (
                                    <Button className="text-button" onClick={() => setOpen({ ...open, [line.id]: "" })}>Send back</Button>
                                  )}
                                  {line.status === "approved" && !locked && !line.financeRequest && open[line.id] === undefined && (
                                    <Button className="text-button" onClick={() => undoLineApproval(current, line)}>Undo approval</Button>
                                  )}
                                  {line.status === "approved" && open[line.id] === undefined && !line.financeRequest && (
                                    <Button className="text-button" onClick={() => setOpen({ ...open, [line.id]: "" })}>{locked ? "Ask Finance" : "Recall"}</Button>
                                  )}
                                  {line.status === "sent_back" && (
                                    <Button className="text-button" onClick={() => undoSendBack(current, line)}>Undo</Button>
                                  )}
                                </div>
                                {line.comment && <p className="approval-line-note">{line.recalled ? "Recalled" : "Sent back"}: “{line.comment}”</p>}
                                {line.financeRequest && <p className="approval-line-note">Asked Finance to reopen {monthName(monthOf(line.date))}: “{line.financeRequest}”</p>}
                                {open[line.id] !== undefined && (
                                  <label className="approval-line-input">
                                    <span>
                                      {line.status === "approved"
                                        ? locked ? `${monthName(monthOf(line.date))} is locked. Why should Finance reopen this line?` : "Why are you recalling this line? The consultant sees it."
                                        : "What is wrong with this line? The consultant sees it."}
                                    </span>
                                    <textarea
                                      autoFocus
                                      maxLength={300}
                                      onChange={(event) => { setOpen({ ...open, [line.id]: event.target.value }); setNoteError(""); }}
                                      placeholder="e.g. Wrong project, customer text missing"
                                      rows={2}
                                      value={open[line.id]}
                                    />
                                  </label>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()
            ) : (
              <dl className="approval-facts">
                {current.facts?.map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>
            )}

            {noteError && <p className="form-message form-message--error" role="alert">{noteError}</p>}
            {current.lines && Object.keys(open).length > 0 ? (
              <div className="approval-footer">
                <Button className="secondary-button" onClick={() => { setOpen({}); setNoteError(""); }}>Cancel</Button>
                <Button className="primary-button compact" onClick={sendLines}>
                  {Object.keys(open).every((id) => current.lines!.find((line) => line.id === Number(id))?.status === "submitted")
                    ? `Send back ${plural(Object.keys(open).length, "line", "lines")}`
                    : `Confirm ${plural(Object.keys(open).length, "line", "lines")}`}
                </Button>
              </div>
            ) : !isWaiting(current) ? (
              <div className="approval-result">
                {!current.lines && (
                  <>
                    <Badge tone={doneStatus(current).tone}>{doneStatus(current).label}</Badge>
                    {current.decision?.note && <p>“{current.decision.note}”</p>}
                  </>
                )}
                <div className="approval-footer">
                  {!current.lines && <Button className="secondary-button" onClick={() => reopenDecision(current.id)}>Change decision</Button>}
                  {current.lines && current.lines.some((line) => line.status === "sent_back") && <Button className="secondary-button" onClick={() => undoAllSendBacks(current.id)}>Undo send-backs</Button>}
                  {current.lines && canUndo(current) && <Button className="secondary-button" onClick={() => undoApproval(current.id)}>Undo approval</Button>}
                  <Button className="secondary-button" onClick={closeReview}>Close</Button>
                </div>
              </div>
            ) : review.mode === "view" ? (
              <div className="approval-footer">
                <Button className="secondary-button" onClick={() => openReview(current.id, "reject")}>Reject</Button>
                <Button className="secondary-button" onClick={() => openReview(current.id, "changes")}>Request changes</Button>
                <Button className="primary-button compact" onClick={() => approve(current.id)}><Icon name="check" size={15} /> {current.lines ? "Approve week" : "Approve"}</Button>
              </div>
            ) : (
              <div className="approval-note">
                <label className="field">
                  <span>{review.mode === "reject" ? "Why are you rejecting this?" : "What needs to change?"}</span>
                  <textarea
                    autoFocus
                    maxLength={500}
                    onChange={(event) => { setNote(event.target.value); setNoteError(""); }}
                    placeholder={review.mode === "reject" ? "e.g. Wrong project. Wednesday was the CRM workshop." : "e.g. Add the receipt for the second night."}
                    rows={3}
                    value={note}
                  />
                </label>
                <p className="approval-hint">
                  {current.name.split(" ")[0]} sees this note and can fix it and send it again.
                  {current.lines && " It goes on every line still waiting; to send back a single line, use Send back on that line."}
                </p>
                <div className="approval-footer">
                  <Button className="secondary-button" onClick={() => openReview(current.id)}>Back</Button>
                  <Button className="primary-button compact" onClick={sendNote}>{review.mode === "reject" ? "Reject with note" : "Send change request"}</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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

// Made-up people get an AI-generated face from thispersondoesnotexist.com (none of them is a real person),
// stored in public/avatars. Anyone without a picture, such as real colleagues, keeps their initials.
const avatarPhotos = new Set([
  "adam-lund",
  "albin-strand",
  "alice-wikstrom",
  "alva-lindqvist",
  "anna-berg",
  "anna-lind",
  "david-nilsson",
  "ebba-holmgren",
  "elias-holm",
  "ella-bergstrom",
  "erik-sand",
  "freja-nordin",
  "hugo-sandberg",
  "isak-soderberg",
  "johan-ek",
  "johanna-s",
  "karin-dahl",
  "leo-hedlund",
  "liam-ekstrom",
  "lina-persson",
  "lisa-ek",
  "lucas-forsberg",
  "maja-karlsson",
  "marcus-holm",
  "melvin-ek",
  "mikael-k",
  "noah-berg",
  "nora-fransson",
  "oliver-nystrom",
  "oscar-dahl",
  "peter-ek",
  "saga-engstrom",
  "sara-ahmed",
  "sofia-l",
  "sofia-lind",
  "tilde-axelsson",
  "viktor-larsson",
  "wilma-sjoberg",
]);
const slugOf = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Avatar({ name, initials, size }: { name: string; initials?: string; size?: "tiny" | "small" | "large" | "xl" }) {
  const className = `avatar${size ? ` avatar--${size}` : ""}`;
  const slug = slugOf(name);
  if (avatarPhotos.has(slug)) return <img alt="" className={`${className} avatar--photo`} src={`${import.meta.env.BASE_URL}avatars/${slug}.jpg`} title={name} />;
  return <span className={className}>{initials ?? initialsOf(name)}</span>;
}

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
                  <Avatar name={contact.name} size="small" />
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
                <td><span className="company-cell"><Avatar name={item.name} size="small" /><span className="case-cell"><strong>{item.name}</strong><small>{item.title}</small></span></span></td>
                <td>{item.account}</td>
                <td><Badge tone={roleTone(item.role)}>{item.role}</Badge></td>
                <td className={item.last === "Not met" ? "is-warning" : ""}>{item.last}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </article>
      <article className="panel contact-card">
        <Avatar name={contact.name} size="xl" />
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
                    <td><span className="company-cell"><Avatar name={user.name} size="small" /><span className="case-cell"><strong>{user.name}</strong><small>{user.email}</small></span></span></td>
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
  const [timeEntries, setTimeEntries] = useState(initialTimeEntries);
  const [timeWeek, setTimeWeek] = useState(mondayOf(TODAY));
  // What the automatic reminders would have sent the signed-in consultant, newest first.
  const thisWeek = timeEntries.filter((entry) => mondayOf(entry.date) === mondayOf(TODAY));
  const weekDue = addDays(mondayOf(TODAY), 7);
  const notices: Notice[] = [
    ...(thisWeek.some((entry) => entry.status === "draft") || !thisWeek.length
      ? [{ channel: "Teams" as const, at: `${TODAY}T14:00`, text: `Week ${isoWeek(TODAY)} isn't submitted yet. Submit it by ${fmtDay(weekDue)} so your project manager can approve it.`, page: "time" as Page }]
      : []),
    ...timeEntries
      .filter((entry) => entry.status === "rejected")
      .map((entry) => {
        const sentBack = entryHistory(entry).find((event) => event.text.startsWith("Sent back"));
        return { channel: "Teams" as const, at: sentBack?.at ?? entry.date, text: `${sentBack?.by ?? "Your PM"} sent back ${fmtDay(entry.date)}: ${entry.pmComment ?? ""}`, page: "time" as Page };
      }),
    { channel: "Email" as const, at: `${addDays(monthDeadline(monthOf(TODAY)), -4)}T08:00`, text: `${monthName(monthOf(TODAY))} closes ${fmtDay(monthDeadline(monthOf(TODAY)))}. After that, changes go through Finance.`, page: "summary" as Page },
  ].sort((a, b) => b.at.localeCompare(a.at));
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const timeData: TimeData = {
    entries: timeEntries,
    setEntries: setTimeEntries,
    weekStart: timeWeek,
    setWeekStart: setTimeWeek,
    requests: changeRequests,
    onRequest: (request) => setChangeRequests([...changeRequests, request]),
  };

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
  else if (page === "time") content = <TimeEntries {...timeData} />;
  else if (page === "summary")
    content = (
      <TimeSummary
        {...timeData}
        onOpenWeek={(monday) => {
          setTimeWeek(monday);
          setPage("time");
          window.scrollTo(0, 0);
        }}
      />
    );
  else if (page === "approvals") content = <Approvals />;
  else if (page === "hours") content = <HoursOverview />;
  else if (page === "finance") content = <FinanceDashboard onOpen={setPage} />;
  else if (page === "accounts") content = <Accounts deals={deals} onOpenDeal={openDeal} />;
  else if (page === "contacts") content = <Contacts />;
  else if (page === "leads") content = <Leads />;
  else if (page === "activities") content = <Activities />;
  else if (page === "settings") content = <Settings />;

  return (
    <div className="app-shell">
      <Sidebar onChange={setPage} onClose={() => setMenuOpen(false)} open={menuOpen} page={page} />
      <main className="main">
        <Topbar notices={notices} onMenu={() => setMenuOpen(true)} onOpen={setPage} page={page} />
        <div className="content">{content}</div>
      </main>
    </div>
  );
}
