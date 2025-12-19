'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Cpu, ChevronDown } from 'lucide-react';

interface MachineFilterProps {
  machines: { machine_code: string; machine_name: string }[];
}

export default function MachineFilter({ machines }: MachineFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current filter from URL or default to 'all'
  const currentMachine = searchParams.get('machine') || 'all';

  const handleMachineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMachine = event.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newMachine === 'all') {
      params.delete('machine');
    } else {
      params.set('machine', newMachine);
    }
    
    // Preserve periodType and period if they exist
    if (!params.has('periodType')) {
      params.set('periodType', 'month');
    }
    if (!params.has('period')) {
      params.set('period', '2025-08');
    }
    
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cpu className="h-4 w-4 text-gray-400" />
          <label htmlFor="machine-filter" className="text-sm font-medium text-gray-700">
            Filter by machine
          </label>
        </div>
        <div className="relative w-full sm:w-auto sm:min-w-[200px]">
          <select
            id="machine-filter"
            value={currentMachine}
            onChange={handleMachineChange}
            className="appearance-none w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-150 cursor-pointer hover:border-gray-400 hover:bg-gray-50/50 shadow-sm"
          >
            <option value="all">All Machines</option>
            {machines.map((machine) => (
              <option key={machine.machine_code} value={machine.machine_code} className="py-2">
                {machine.machine_code} - {machine.machine_name}
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

