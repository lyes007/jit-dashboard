'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Production Dashboard', href: '/', icon: LayoutDashboard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage on mount and set CSS variable
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    const collapsed = savedState === 'true';
    setIsCollapsed(collapsed);
    // Set CSS variable immediately to prevent flash
    document.documentElement.style.setProperty('--sidebar-width', collapsed ? '64px' : '256px');
  }, []);

  // Save collapsed state to localStorage and update CSS variable
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
    // Update CSS variable for layout adjustment
    document.documentElement.style.setProperty('--sidebar-width', newState ? '64px' : '256px');
  };

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
          fixed top-0 left-0 z-40 h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white transition-all duration-300
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Toggle Button */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} h-20 px-4 border-b border-gray-800/50 bg-gray-900/50 relative`}>
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-white tracking-tight">JIT Dashboard</h1>
            )}
            {isCollapsed && (
              <div className="text-xl font-bold text-white">J</div>
            )}
            {/* Desktop Toggle Button */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-800/80 transition-colors text-gray-300 hover:text-white absolute right-2"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative
                    ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                        : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                    }
                  `}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && <span>{item.name}</span>}
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={`px-4 py-4 border-t border-gray-800/50 bg-gray-900/30 ${isCollapsed ? 'px-2' : ''}`}>
            {!isCollapsed && (
              <p className="text-xs text-gray-500 text-center font-medium">
                Data Warehouse v1.0
              </p>
            )}
            {isCollapsed && (
              <p className="text-xs text-gray-500 text-center font-medium">
                v1.0
              </p>
            )}
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

