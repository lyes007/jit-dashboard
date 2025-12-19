'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current filter from URL or default to August 2025
  const currentMonth = searchParams.get('month') || '2025-08';
  const [year, month] = currentMonth.split('-').map(Number);
  const selectedDate = new Date(year, month - 1, 1);

  // Generate available months (August 2025 to October 2025 based on data)
  const availableMonths = [
    { value: '2025-08', label: 'August 2025' },
    { value: '2025-09', label: 'September 2025' },
    { value: '2025-10', label: 'October 2025' },
  ];

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = event.target.value;
    const machine = searchParams.get('machine') || 'all';
    router.push(`/?month=${newMonth}&machine=${machine}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <label htmlFor="month-filter" className="text-sm font-medium text-gray-700">
            Filter by period
          </label>
        </div>
        <div className="relative w-full sm:w-auto sm:min-w-[200px]">
          <select
            id="month-filter"
            value={currentMonth}
            onChange={handleMonthChange}
            className="appearance-none w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-150 cursor-pointer hover:border-gray-400 hover:bg-gray-50/50 shadow-sm"
          >
            {availableMonths.map((month) => (
              <option key={month.value} value={month.value} className="py-2">
                {month.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

