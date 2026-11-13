# Amir Admin — Admin Dashboard

A modern, responsive admin dashboard built with **React 18 + Bootstrap 5 + Chart.js**, created as a portfolio project for junior frontend roles.

## Quick start

```bash
npm install
npm run dev      # development server → http://localhost:3000
npm run build    # production build
npm run preview  # serve the production build
```

**Demo login:** `admin@novin.dev` / `admin123`

## Features

- **Login page** — validation, show/hide password, remember me, error alerts, protected routes
- **Dashboard** — 4 KPI cards, line chart (sales / users toggle), doughnut chart, recent activity, latest orders
- **Users** — data table with search, role & status filters, pagination, edit / delete (confirmation modal)
- **Orders** — data table with search & status filter, inline status change, detail modal
- **Add / Edit form** — shared create & edit page with full validation and success / error messages
- **Dark mode** — toggle in the top navbar, choice is remembered
- **Responsive** — collapsible sidebar drawer on mobile, fixed sidebar on desktop

## Project structure

```
src/
├── components/
│   ├── common/      # ProtectedRoute (auth guard)
│   ├── layout/      # DashboardLayout, Sidebar, Topbar
│   └── ui/          # StatCard, Pagination, AppModal, StatusBadge, …
├── context/         # AuthContext, ThemeContext, DataContext (global state)
├── data/            # dummyData.js  ← replace with real API responses
├── pages/           # Login, Dashboard, Users, UserForm, Orders, NotFound
├── services/        # api.js        ← swap simulated calls for real fetch()
└── styles/          # app.css       # layout + branding overrides
```

## Connecting a real backend

All network calls are isolated in **`src/services/api.js`**. Replace each simulated
function body with `fetch` / axios — the rest of the app keeps working unchanged:

```js
export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
};
```

Dummy datasets live in `src/data/dummyData.js` and can be deleted once the API is connected.

## Tech stack

React 18 · React Router 6 · Context API · Bootstrap 5 · Chart.js + react-chartjs-2 · Vite
