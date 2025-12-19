'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ProductionTrend } from '@/types/database';
import { format } from 'date-fns';

interface ProductionChartProps {
  data: ProductionTrend[];
}

export default function ProductionChart({ data }: ProductionChartProps) {
  // Group data by date and machine
  const groupedData: Record<string, Record<string, number>> = {};
  
  data.forEach((item) => {
    const dateKey = format(item.full_date, 'yyyy-MM-dd');
    if (!groupedData[dateKey]) {
      groupedData[dateKey] = { date: dateKey };
    }
    // Convert to number in case PostgreSQL returns string
    groupedData[dateKey][item.machine_code] = 
      typeof item.daily_production === 'string' 
        ? parseFloat(item.daily_production) 
        : (item.daily_production || 0);
  });

  const chartData = Object.values(groupedData).sort(
    (a, b) => (a.date as string).localeCompare(b.date as string)
  );

  // Get unique machine codes for lines
  const machines = Array.from(
    new Set(data.map((item) => item.machine_code))
  );

  const colors = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Production Trend
        </h3>
        <p className="text-xs text-gray-500 mt-1 font-medium">Daily production by machine</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(new Date(value), 'MMM dd')}
            className="text-xs"
          />
          <YAxis className="text-xs" />
          <Tooltip
            labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
          />
          <Legend />
          {machines.map((machine, index) => (
            <Line
              key={machine}
              type="monotone"
              dataKey={machine}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              name={`Machine ${machine}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

