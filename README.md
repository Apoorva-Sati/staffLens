# Productivity Dashboard

A modern React-based Productivity Dashboard for analyzing team performance, staff productivity, and operational metrics from Excel or CSV reports.

## Features

### Dashboard Overview
- Total Tasks Completed
- Active Staff Count
- Average Working Days
- Overall Productivity Average
- Top Performer Identification
- Daily Task Trend Analysis
- Roaster/Shift Performance Tracking

### Performance Reports
- Staff Productivity Analysis
- Team Leaderboards
- Top & Bottom Performers
- Supervisor Performance Comparison
- Staff Consistency Tracking
- Skill Breakdown Analysis
- Team Performance Insights

### File Management
- Upload Excel (.xlsx, .xls) files
- Upload CSV files
- Multi-sheet Excel support
- Upload History Tracking
- Local Storage Persistence

### Data Analysis
- Automatic KPI Calculation
- Productivity Scoring
- Supervisor Performance Metrics
- Shift Performance Analysis
- Daily Trend Visualization
- Staff Ranking System

## Tech Stack

- React
- Vite
- React Router
- Tailwind CSS
- XLSX (Excel Parsing)
- Local Storage API
- Vercel Deployment

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd productivity-dashboard
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Application will run at:

```text
http://localhost:5173
```

## Build for Production

```bash
npm run build
```

Preview Production Build:

```bash
npm run preview
```

## Project Structure

```text
src/
├── components/
│   ├── charts/
│   ├── Dashboard Components
│   └── Shared UI Components
├── pages/
│   ├── Dashboard.jsx
│   └── Performance.jsx
├── services/
│   └── dataService.js
├── utils/
│   ├── dashboardStats.js
│   ├── performanceStats.js
│   └── uploadHistory.js
├── context/
├── constants/
└── App.jsx
```

## Supported File Formats

| Format | Supported |
|----------|----------|
| XLSX | ✅ |
| XLS | ✅ |
| CSV | ✅ |

## Dashboard Metrics

The dashboard automatically calculates:

- Total Tasks Closed
- Active Staff Count
- Average Working Days
- Overall Productivity Average
- Top Performer
- Roaster Performance
- Daily Task Trends

## Performance Analytics

The performance module provides:

- Top 3 Performers
- Bottom 3 Performers
- Best Supervisor
- Staff Rankings
- Productivity Comparisons
- Team Analysis
- Supervisor Insights

## Security

The application includes password-protected upload functionality using environment variables.

Create a `.env` file:

```env
UPLOAD_PASSWORD=your_secure_password
```

## Deployment

This project is configured for deployment on Vercel.

Deploy:

```bash
vercel
```

or connect your GitHub repository directly to Vercel.

## Future Enhancements

- PDF Report Export
- User Authentication
- Database Integration
- Real-time Analytics
- Advanced Filtering
- Role-based Access Control
- Cloud Storage Support

## License

This project is intended for internal productivity monitoring and reporting purposes.

---

Built with React + Vite for productivity analytics and performance tracking.