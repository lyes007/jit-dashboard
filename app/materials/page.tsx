import { Package } from 'lucide-react';

export default function MaterialsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary-100 rounded-full">
            <Package className="h-12 w-12 text-primary-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Materials Dashboard
        </h1>
        <p className="text-gray-600 mb-8">
          This dashboard will provide material consumption analytics, efficiency
          metrics, and waste analysis.
        </p>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

