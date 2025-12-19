import {
  getKPISummary,
  getProductionTrend,
  getMachinePerformance,
  getTopOperators,
  getQualityMetrics,
} from '@/lib/queries';
import MetricCard from '@/components/MetricCard';
import ProductionChart from '@/components/ProductionChart';
import MachineComparison from '@/components/MachineComparison';
import DateFilter from '@/components/DateFilter';
import { Suspense } from 'react';
import {
  Package,
  TrendingUp,
  Users,
  Cpu,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { capitalizeName } from '@/lib/utils';

interface PageProps {
  searchParams?: { month?: string };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  // Get month from search params or default to August 2025
  const monthParam = searchParams?.month || '2025-08';
  const [year, month] = monthParam.split('-').map(Number);
  const startDate = startOfMonth(new Date(year, month - 1, 1));
  const endDate = endOfMonth(new Date(year, month - 1, 1));
  
  const startDateStr = format(startDate, 'yyyy-MM-dd');
  const endDateStr = format(endDate, 'yyyy-MM-dd');

  // Fetch all data in parallel with date filtering
  const [
    kpiSummary,
    productionTrend,
    machinePerformance,
    topOperators,
    qualityMetrics,
  ] = await Promise.all([
    getKPISummary(startDateStr, endDateStr),
    getProductionTrend(startDateStr, endDateStr),
    getMachinePerformance(startDateStr, endDateStr),
    getTopOperators(10),
    getQualityMetrics(startDateStr, endDateStr),
  ]);

  // Calculate quality rate for display
  // PostgreSQL returns numeric values as strings, so we need to parse them
  const qualityRate =
    kpiSummary.overall_quality_rate !== null
      ? `${parseFloat(String(kpiSummary.overall_quality_rate)).toFixed(1)}%`
      : 'N/A';

  const materialEfficiency =
    kpiSummary.overall_material_efficiency !== null
      ? `${parseFloat(String(kpiSummary.overall_material_efficiency)).toFixed(1)}%`
      : 'N/A';

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Production Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Manufacturing performance metrics and analytics
          </p>
        </div>
        <div className="text-xs text-gray-400 font-medium">
          Updated {format(new Date(), 'MMM d, yyyy')} at {format(new Date(), 'h:mm a')}
        </div>
      </div>

      {/* Date Filter */}
      <Suspense fallback={<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">Loading filter...</div>}>
        <DateFilter />
      </Suspense>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Production"
          value={(typeof kpiSummary.total_production === 'string'
            ? parseFloat(kpiSummary.total_production)
            : (kpiSummary.total_production || 0)).toLocaleString()}
          icon={Package}
          subtitle="Good pieces produced"
        />
        <MetricCard
          title="Quality Rate"
          value={qualityRate}
          icon={CheckCircle}
          subtitle="Average quality percentage"
        />
        <MetricCard
          title="Material Efficiency"
          value={materialEfficiency}
          icon={TrendingUp}
          subtitle="Material utilization rate"
        />
        <MetricCard
          title="Active Machines"
          value={kpiSummary.total_machines || 0}
          icon={Cpu}
          subtitle={`${kpiSummary.total_operators || 0} operators`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionChart data={productionTrend} />
        <MachineComparison data={machinePerformance} />
      </div>

      {/* Machine Performance Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/80">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Machine Performance
          </h3>
          <p className="text-xs text-gray-500 mt-1 font-medium">Overview of machine productivity and efficiency</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Machine
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Good
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quality Rate
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Days Active
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Articles
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {machinePerformance.map((machine) => (
                <tr key={machine.machine_code} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {machine.machine_code}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {machine.machine_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                    {(typeof machine.total_good === 'string' 
                      ? parseFloat(machine.total_good) 
                      : (machine.total_good || 0)).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {machine.avg_good_rate ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700">
                        {parseFloat(String(machine.avg_good_rate)).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-medium">
                    {machine.days_active}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-medium">
                    {machine.unique_articles}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Operators Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/80">
          <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
              Top Operators
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">Highest performing operators by production volume</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                  #
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Operator
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Machine
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Good Pieces
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quality Rate
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Events
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {topOperators.map((operator, index) => (
                <tr key={`${operator.operator_name}-${operator.machine_code}`} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-xs font-bold text-gray-700">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {capitalizeName(operator.operator_name)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                      {operator.machine_code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                    {(typeof operator.total_good_pieces === 'string'
                      ? parseFloat(operator.total_good_pieces)
                      : (operator.total_good_pieces || 0)).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {operator.avg_good_rate ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700">
                        {parseFloat(String(operator.avg_good_rate)).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-medium">
                    {operator.total_events}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quality Metrics Summary */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Quality Overview</h3>
          <p className="text-sm text-gray-500 mt-0.5">{format(startDate, 'MMMM yyyy')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="border-l-4 border-emerald-500 pl-5">
            <div className="text-sm text-gray-600 mb-2">Total Good Pieces</div>
            <div className="text-2xl font-semibold text-gray-900">
              {qualityMetrics
                .reduce((sum, m) => {
                  const value = typeof m.total_good === 'string' 
                    ? parseFloat(m.total_good) 
                    : (m.total_good || 0);
                  return sum + value;
                }, 0)
                .toLocaleString()}
            </div>
          </div>
          <div className="border-l-4 border-red-500 pl-5">
            <div className="text-sm text-gray-600 mb-2">Total Rejected</div>
            <div className="text-2xl font-semibold text-gray-900">
              {qualityMetrics
                .reduce((sum, m) => {
                  const value = typeof m.total_rejected === 'string'
                    ? parseFloat(m.total_rejected)
                    : (m.total_rejected || 0);
                  return sum + value;
                }, 0)
                .toLocaleString()}
            </div>
          </div>
          <div className="border-l-4 border-gray-400 pl-5">
            <div className="text-sm text-gray-600 mb-2">Average Quality</div>
            <div className="text-2xl font-semibold text-gray-900">
              {qualityMetrics.length > 0
                ? (
                    qualityMetrics.reduce(
                      (sum, m) => sum + (m.avg_good_rate ? parseFloat(String(m.avg_good_rate)) : 0),
                      0
                    ) / qualityMetrics.length
                  ).toFixed(1)
                : '0.0'}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

