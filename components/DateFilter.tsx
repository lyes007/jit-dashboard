'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

type PeriodType = 'month' | 'week' | 'day';

interface WeekOption {
  year: number;
  week: number;
  start_date: Date;
  end_date: Date;
}

interface DayOption {
  full_date: Date;
  year: number;
  month: number;
  day: number;
}

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current filter from URL
  const periodType = (searchParams.get('periodType') || 'month') as PeriodType;
  const periodValue = searchParams.get('period') || '2025-08';
  
  const [weeks, setWeeks] = useState<WeekOption[]>([]);
  const [days, setDays] = useState<DayOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate available months (August 2025 to October 2025 based on data)
  const availableMonths = [
    { value: '2025-08', label: 'August 2025' },
    { value: '2025-09', label: 'September 2025' },
    { value: '2025-10', label: 'October 2025' },
  ];

  // Fetch weeks and days from API
  useEffect(() => {
    async function fetchPeriods() {
      setLoading(true);
      try {
        const [weeksRes, daysRes] = await Promise.all([
          fetch('/api/weeks'),
          fetch('/api/days'),
        ]);
        
        if (weeksRes.ok) {
          const weeksData = await weeksRes.json();
          setWeeks(weeksData.map((w: any) => ({
            ...w,
            start_date: new Date(w.start_date),
            end_date: new Date(w.end_date),
          })));
        }
        
        if (daysRes.ok) {
          const daysData = await daysRes.json();
          setDays(daysData.map((d: any) => ({
            ...d,
            full_date: new Date(d.full_date),
          })));
        }
      } catch (error) {
        console.error('Failed to fetch periods:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (periodType === 'week' || periodType === 'day') {
      fetchPeriods();
    }
  }, [periodType]);

  const handlePeriodTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value as PeriodType;
    const machine = searchParams.get('machine') || 'all';
    
    // Set default value based on type
    let defaultPeriod = '2025-08';
    if (newType === 'week' && weeks.length > 0) {
      const latestWeek = weeks[0];
      defaultPeriod = `${latestWeek.year}-W${latestWeek.week.toString().padStart(2, '0')}`;
    } else if (newType === 'day' && days.length > 0) {
      defaultPeriod = format(days[0].full_date, 'yyyy-MM-dd');
    }
    
    const params = new URLSearchParams();
    params.set('periodType', newType);
    params.set('period', defaultPeriod);
    if (machine !== 'all') {
      params.set('machine', machine);
    }
    router.push(`/?${params.toString()}`);
  };

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPeriod = event.target.value;
    const machine = searchParams.get('machine') || 'all';
    
    const params = new URLSearchParams();
    params.set('periodType', periodType);
    params.set('period', newPeriod);
    if (machine !== 'all') {
      params.set('machine', machine);
    }
    router.push(`/?${params.toString()}`);
  };

  const getPeriodLabel = () => {
    if (periodType === 'month') {
      const month = availableMonths.find(m => m.value === periodValue);
      return month?.label || periodValue;
    } else if (periodType === 'week') {
      // Parse the periodValue to extract year and week
      const match = periodValue.match(/^(\d{4})-W(\d{1,2})$/);
      if (match) {
        const year = parseInt(match[1]);
        const week = parseInt(match[2]);
        const weekData = weeks.find(w => w.year === year && w.week === week);
        if (weekData) {
          return `Week ${weekData.week}, ${weekData.year} (${format(weekData.start_date, 'MMM d')} - ${format(weekData.end_date, 'MMM d')})`;
        }
      }
      return periodValue;
    } else if (periodType === 'day') {
      try {
        const date = new Date(periodValue);
        return format(date, 'MMMM d, yyyy');
      } catch {
        return periodValue;
      }
    }
    return periodValue;
  };

  const getPeriodOptions = () => {
    if (periodType === 'month') {
      return availableMonths;
    } else if (periodType === 'week') {
      return weeks.map(w => ({
        value: `${w.year}-W${w.week.toString().padStart(2, '0')}`,
        label: `Week ${w.week}, ${w.year} (${format(w.start_date, 'MMM d')} - ${format(w.end_date, 'MMM d')})`,
      }));
    } else if (periodType === 'day') {
      return days.map(d => ({
        value: format(d.full_date, 'yyyy-MM-dd'),
        label: format(d.full_date, 'MMMM d, yyyy'),
      }));
    }
    return [];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <label htmlFor="period-type-filter" className="text-sm font-medium text-gray-700">
            Filter by period
          </label>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Period Type Selector */}
          <div className="relative">
            <select
              id="period-type-filter"
              value={periodType}
              onChange={handlePeriodTypeChange}
              className="appearance-none w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-150 cursor-pointer hover:border-gray-400 hover:bg-gray-50/50 shadow-sm"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>

          {/* Period Value Selector */}
          <div className="relative">
            <select
              id="period-filter"
              value={periodValue}
              onChange={handlePeriodChange}
              disabled={loading || (periodType === 'week' && weeks.length === 0) || (periodType === 'day' && days.length === 0)}
              className="appearance-none w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-150 cursor-pointer hover:border-gray-400 hover:bg-gray-50/50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <option>Loading...</option>
              ) : (
                getPeriodOptions().map((option) => (
                  <option key={option.value} value={option.value} className="py-2">
                    {option.label}
                  </option>
                ))
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
