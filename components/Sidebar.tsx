'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Production Dashboard', href: '/', icon: LayoutDashboard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="h-5 w-5 text-gray-700" />
        ) : (
          <Menu className="h-5 w-5 text-gray-700" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-950 text-white transition-transform
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 px-4 border-b border-gray-800/50 bg-gray-900/50">
            <h1 className="text-xl font-bold text-white tracking-tight">JIT Dashboard</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                        : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-800/50 bg-gray-900/30">
            <p className="text-xs text-gray-500 text-center font-medium">
              Data Warehouse v1.0
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

