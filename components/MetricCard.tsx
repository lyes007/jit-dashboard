import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
}: MetricCardProps) {
  const formattedValue =
    typeof value === 'number'
      ? value.toLocaleString(undefined, { maximumFractionDigits: 1 })
      : value;

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent opacity-50 rounded-full -mr-16 -mt-16"></div>
      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight mb-1">{formattedValue}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-3">
              <span
                className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded ${
                  trend.isPositive 
                    ? 'text-emerald-700 bg-emerald-50' 
                    : 'text-red-700 bg-red-50'
                }`}
              >
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-400 ml-2">vs previous</span>
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <Icon className="h-6 w-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
        </div>
      </div>
    </div>
  );
}

