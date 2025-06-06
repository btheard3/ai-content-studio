import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Brain, BarChart2, Workflow, Settings, BellRing } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Brain className="w-5 h-5" /> },
    { path: '/workflow', label: 'Workflow', icon: <Workflow className="w-5 h-5" /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary-600" />
            <h1 className="text-xl font-semibold text-gray-900">ADK Content</h1>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {location.pathname === item.path && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-medium">AA</span>
              </div>
              <div className="text-sm">
                <p className="font-medium">Admin User</p>
                <p className="text-gray-500">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary-600" />
            <h1 className="text-lg font-semibold">ADK Content</h1>
          </div>
          <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <BellRing className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 pt-0 md:pt-0">
          {children}
        </main>

        {/* Mobile navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <nav className="flex justify-around">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-3 ${
                  location.pathname === item.path
                    ? 'text-primary-600'
                    : 'text-gray-600'
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Layout;