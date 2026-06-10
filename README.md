# 📊 Productivity Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

A modern, responsive analytics dashboard for team performance monitoring. Upload your Excel or CSV workforce reports and instantly get KPI cards, leaderboards, supervisor comparisons, shift analysis, and interactive charts — all without a backend.

---

## ✨ Features

### 🏠 Dashboard Overview
Real-time KPI cards and trend charts computed automatically from your uploaded data:
- **Total Tasks Completed** — aggregate closed tasks across the team
- **Active Staff Count** — unique employees present in the dataset
- **Average Working Days** — mean days worked per staff member
- **Overall Productivity Average** — tasks-per-day across the entire team
- **Top Performer** — highest productivity scorer with their average
- **Daily Task Trend** — line chart showing task volume over time
- **Roaster / Shift Performance** — bar chart comparing shift productivity

### 📈 Performance Reports
Four analysis tabs with drill-down views:

| Tab | What it shows |
|-----|--------------|
| **Leaderboard** | Top 3 & Bottom 3 performers, Best Supervisor card with team size and task totals |
| **Staff** | Per-employee productivity chart, consistency tracker, above/below average filter |
| **Team** | Team leaderboard ranked by total tasks, Sub-Skill breakdown pie chart |
| **Supervisors** | Average productivity per supervisor (bar), team distribution (donut chart) |

### 📂 File Management
- Drag-and-drop or click-to-browse upload (`.xlsx`, `.xls`, `.csv`)
- Password-protected upload gate (environment variable controlled)
- Multi-sheet Excel support — first sheet used by default
- Upload history — last 5 sessions stored locally, one-click restore
- Live source indicator showing active file vs. default demo data

### 🎛️ Filtering & Sorting
- **Month filter** — multi-select to narrow data to specific periods
- **Supervisor filter** — view metrics for one or more supervisors in isolation
- **Performance filter** — show only above-average or below-average staff
- **Sort control** — sort staff by name, total tasks, or productivity (asc/desc)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 + Vite 5 |
| Routing | React Router v6 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| State | React Context API |
| File Parsing | SheetJS (xlsx) |
| Persistence | Browser Local Storage |
| Deployment | Vercel (with serverless API route for password verification) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- npm ≥ 9

### Clone & Install

```bash
git clone <repository-url>
cd productivity-dashboard
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
UPLOAD_PASSWORD=your_secure_password
```

> The password is verified via a Vercel serverless function (`/api/verify-password`). For local development, you can add a simple local API handler or temporarily stub out the password check.

### Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Building for Production

```bash
npm run build       # compile and bundle
npm run preview     # preview the production build locally
```

---

## 🗂️ Project Structure

```
productivity-dashboard/
├── public/
│   ├── Company_LOGO.png
│   └── dashboard_dummy_data_2026.xlsx   # default demo dataset
├── api/
│   └── verify-password.js               # Vercel serverless function
├── src/
│   ├── App.jsx                          # root layout, routing, theme init
│   ├── App.css                          # CSS custom properties (dark/light themes)
│   ├── index.css                        # Tailwind base imports
│   ├── context/
│   │   └── DataContext.jsx              # global state: data, filters, active tab
│   ├── pages/
│   │   ├── Dashboard.jsx                # KPI cards + trend charts page
│   │   └── Performance.jsx              # tabbed analytics page
│   ├── components/
│   │   ├── Header.jsx                   # title bar, theme toggle, upload button, filters
│   │   ├── Navbar.jsx                   # sidebar + mobile bottom nav
│   │   ├── Card.jsx                     # KPI metric card
│   │   ├── Filters.jsx                  # month / supervisor / performance dropdowns
│   │   ├── Dropdown.jsx                 # reusable select component
│   │   ├── LeaderboardTable.jsx         # top/bottom performers + best supervisor card
│   │   ├── FileUploadModal.jsx          # password gate + drop zone + history list
│   │   ├── Spinner.jsx
│   │   ├── CustomTooltip.jsx            # shared Recharts tooltip
│   │   └── charts/
│   │       ├── DailyTasksTrend.jsx      # line chart — tasks over time
│   │       ├── RoasterPerformance.jsx   # bar chart — shift comparison
│   │       ├── StaffProductivityChart.jsx
│   │       ├── StaffConsistencyChart.jsx
│   │       ├── SupervisorAvgChart.jsx
│   │       ├── DonutChart.jsx
│   │       ├── TeamLeaderboard.jsx
│   │       └── SubSkillBreakdown.jsx    # pie chart — task share by sub-skill
│   ├── utils/
│   │   ├── dataService.js               # file parsing (Excel + CSV via SheetJS)
│   │   ├── dashboardStats.js            # KPI computation logic
│   │   ├── performanceStats.js          # leaderboard + staff ranking logic
│   │   └── uploadHistory.js             # localStorage read/write helpers
│   └── constants/
│       ├── CardHeadings.jsx             # KPI card config with icons
│       └── TabHeadings.jsx              # performance tab config
├── .env                                 # UPLOAD_PASSWORD (not committed)
├── vercel.json
└── vite.config.js
```

---

## 📋 Expected Data Format

The dashboard reads row-based tabular data. Each row represents one staff member's daily activity. Required columns:

| Column | Description |
|--------|-------------|
| `NAME` | Staff member's full name |
| `Supervisor` | Supervisor's name |
| `TEAM` | Team identifier |
| `SUB SKILL` | Task category / skill type |
| `TOTAL CLOSING` | Number of tasks closed (numeric) |
| `DATE` or month field | Used for time-series and month filtering |

> Column names are case-sensitive. Ensure your export matches the expected headers. Extra columns are ignored.

---

## 🎨 Theming

The app ships with **dark mode by default** and a fully implemented light mode, toggled via the header button. All colors are driven by CSS custom properties — no hardcoded values in components.

```
Dark:   #0d0d0d background · #ed1c24 primary accent · #ffffff text
Light:  #f5f5f5 background · #ed1c24 primary accent · #0d0d0d text
```

Theme preference is persisted in `localStorage` and applied before first paint (inline script in `index.html`) to prevent flash.

---

## 🔒 Security

File uploads are protected by a server-side password check. The password is **never** sent to or stored in the browser — it is verified exclusively in the Vercel serverless function using the `UPLOAD_PASSWORD` environment variable. Unauthenticated users can still browse the default demo dataset.

---

## ☁️ Deployment

The project is configured for one-command deployment on Vercel:

```bash
# Install Vercel CLI (once)
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository directly in the Vercel dashboard for automatic deployments on every push.

Set `UPLOAD_PASSWORD` as an environment variable in your Vercel project settings.

---

## 🌐 Internationalization Plan — Arabic (AR)

The Arabic localization effort will cover:

**Layout**
- `dir="rtl"` on the root element and all flex/grid containers mirrored
- Sidebar repositioned to the right; navigation icon order reversed
- Charts and tables with right-anchored axes and legends

**Content**
- All UI strings extracted into a `src/i18n/` translation layer (recommended: `react-i18next`)
- Arabic translations for every label, tooltip, tab name, button, and error message
- Locale-aware number formatting via `Intl.NumberFormat('ar-EG')` for KPI values
- Hijri calendar option for date display alongside Gregorian

**Typography**
- Arabic-compatible font (e.g., IBM Plex Arabic, Noto Sans Arabic) loaded alongside Inter
- Line-height and letter-spacing adjusted for Arabic glyph metrics

**Implementation steps (draft)**
1. Install `react-i18next` and `i18next`
2. Create `src/i18n/locales/en.json` and `src/i18n/locales/ar.json`
3. Wrap `<App>` in `<I18nextProvider>`
4. Add a language toggle in the header (EN / عربي)
5. Apply `dir` attribute dynamically via context
6. Audit all Tailwind directional utilities (`pl-`, `pr-`, `ml-`, `mr-`) and replace with logical equivalents (`ps-`, `pe-`, `ms-`, `me-`)

---

## 📄 License

This project is intended for internal productivity monitoring and reporting purposes.

---

<p align="center">Built with React + Vite · Deployed on Vercel</p>
