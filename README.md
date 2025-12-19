# JIT Production Dashboard

A modern, responsive Next.js dashboard for Just-In-Time manufacturing analytics.

## Features

- Real-time production metrics and KPIs
- Machine performance comparison
- Operator productivity analytics
- Quality metrics visualization
- Mobile-responsive design
- Server-side data fetching for optimal performance

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database connection

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```
DATABASE_URL=postgresql://jit_dw_user:HxLjsar6vrIQ2badFIPnkjexs79gHybI@dpg-d4s6t13uibrs73crhl9g-a.frankfurt-postgres.render.com/jit_dw
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
dashboard/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with sidebar
│   ├── page.tsx           # Main production dashboard
│   ├── machines/          # Machines dashboard (placeholder)
│   ├── operators/         # Operators dashboard (placeholder)
│   ├── quality/           # Quality dashboard (placeholder)
│   └── materials/         # Materials dashboard (placeholder)
├── components/            # React components
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── MetricCard.tsx    # KPI metric card
│   ├── ProductionChart.tsx
│   └── MachineComparison.tsx
├── lib/                  # Utilities
│   ├── db.ts            # Database connection
│   └── queries.ts       # SQL query functions
└── types/               # TypeScript types
    └── database.ts      # Database type definitions
```

## Technologies

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **PostgreSQL** - Database (via `pg` package)
- **Lucide React** - Icons

## Dashboard Pages

### Production Dashboard (Main)

The main dashboard displays:
- KPI cards (Total Production, Quality Rate, Material Efficiency, Active Machines)
- Daily production trend chart
- Machine performance comparison
- Machine performance table
- Top operators table
- Quality metrics summary

### Future Dashboards

Placeholder pages are created for:
- **Machines Dashboard** - Detailed machine analytics
- **Operators Dashboard** - Operator performance metrics
- **Quality Dashboard** - Quality metrics and defect analysis
- **Materials Dashboard** - Material consumption and efficiency

## Building for Production

```bash
npm run build
npm start
```

## License

Private project for JIT Manufacturing Data Warehouse.

