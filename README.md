# Sirocco CRM – UI prototype

A clickable UI prototype for Sirocco's CRM: sales, customers, projects, time tracking and service in one app. It was started in Figma Make and continued in VS Code.

> **This is a UI demo only.** All data is made up and nothing is connected to Dynamics or any other system. Buttons like "Create new", "Export" and "Invite user" are placeholders. Reloading the page resets everything.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 22 or newer
- [Git](https://git-scm.com/)

You don't need to install pnpm yourself. The commands below run it through `npx`.

### Install and run

```bash
git clone <repo-url>
cd <repo-folder>
npx --yes pnpm@10 install
npx --yes pnpm@10 dev
```

Then open **http://localhost:8443** in your browser. Changes to files in `src/` show up in the browser immediately.

### Stop the server

Type `q` and press **Enter** in the terminal.

On Windows, **Ctrl+C** also works, but Windows asks "Terminate batch job (Y/N)?". The server has already stopped at that point, so you can answer either Y or N.

### Show it to someone on the same network

When the server starts, it also prints a `Network:` address, such as `http://192.168.x.x:8443`. Others on the same Wi-Fi or office network can open that address while your computer is running the server. It isn't reachable from the internet, and some guest or corporate networks block it.

## What's in the app

| Area | Pages |
|---|---|
| My work | Dashboard, Activities (calendar and tasks), Time entries, Weekly time summary, Approvals |
| Customers | Accounts (list and customer page), Contacts |
| Sales | Leads (kanban board), Pipeline with MEDDPICC scorecard |
| Projects | Projects, Resource utilization, Resources, Budgets |
| Customer success | Service cases |
| Settings | Profile, Users & roles, Integrations |

These parts are interactive in the demo: MEDDPICC scores (the health ring updates), "Edit scorecard", filters and search, approve/reject, task checkboxes, settings toggles and integration connect/disconnect.

## Project structure

```
src/
  App.tsx      All pages, demo data and navigation
  index.css    All styling (Tailwind v4 import + custom CSS and colour tokens)
  ui.tsx       Small shared building blocks (Button, TextInput, Heading)
  main.tsx     React entry point
public/
  sirocco-logo.svg   Official Sirocco logo (icon + wordmark)
  favicon.svg        Browser tab icon
.figma/make/   Figma Make config. Keep it: vite.config.ts reads site.json from here.
```

### Brand colours

The colours are defined as CSS variables at the top of `src/index.css`. The main ones are:

| Token | Colour | Used for |
|---|---|---|
| `--navy` | `#282b33` | Sidebar, primary buttons |
| `--sand` | `#c9c0a4` | Accents, active menu item |
| `--canvas` | `#f3f3ef` | Page background |
| `--surface` | `#fdfdfb` | Cards and panels |

## Tech stack

React 19, TypeScript, Vite 8, Tailwind CSS v4, pnpm.

## Other commands

```bash
npx --yes pnpm@10 build     # production build into dist/
npx --yes pnpm@10 preview   # serve the production build locally
```
