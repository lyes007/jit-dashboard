'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MachinePerformance } from '@/types/database';

interface MachineComparisonProps {
  data: MachinePerformance[];
}

export default function MachineComparison({ data }: MachineComparisonProps) {
  const chartData = data.map((machine) => ({
    name: machine.machine_code,
    'Good Pieces': typeof machine.total_good === 'string' 
      ? parseFloat(machine.total_good) 
      : (machine.total_good || 0),
    'Rejected Pieces': typeof machine.total_rejected === 'string'
      ? parseFloat(machine.total_rejected)
      : (machine.total_rejected || 0),
    'Quality Rate': typeof machine.avg_good_rate === 'string'
      ? parseFloat(machine.avg_good_rate)
      : (machine.avg_good_rate || 0),
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Machine Comparison
        </h3>
        <p className="text-xs text-gray-500 mt-1 font-medium">Good vs rejected pieces by machine</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis dataKey="name" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
          />
          <Legend />
          <Bar dataKey="Good Pieces" fill="#10b981" name="Good Pieces" />
          <Bar dataKey="Rejected Pieces" fill="#ef4444" name="Rejected Pieces" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

