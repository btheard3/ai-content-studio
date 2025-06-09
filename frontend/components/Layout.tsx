import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Workflow, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Sparkles,
  Bell,
  Search
} from "lucide-react";

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    {
      to: "/",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      description: "Overview & metrics"
    },
    {
      to: "/workflow",
      icon: <Workflow className="w-5 h-5" />,
      label: "Workflow",
      description: "Content pipeline"
    },
    {
      to: "/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Analytics",
      description: "Performance insights"
    },
    {
      to: "/settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      description: "System configuration"
    }
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <div className="layout-container">
      {/* Mobile Menu Button */}
      <motion.button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${sidebarOpen ? 'open' : ''} md:relative md:translate-x-0`}
        variants={sidebarVariants}
        initial="closed"
        animate={sidebarOpen ? "open" : "closed"}
      >
        <div>
          <motion.div 
            className="brand"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            ADK Content Studio
          </motion.div>
          
          <nav className="nav-links" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <NavLink 
                  to={item.to} 
                  className="nav-link group"
                  onClick={() => setSidebarOpen(false)}
                  aria-label={`${item.label} - ${item.description}`}
                >
                  <span className="transition-transform group-hover:scale-110">
                    {item.icon}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs opacity-70">{item.description}</span>
                  </div>
                </NavLink>
              </motion.div>
            ))}
          </nav>
        </div>
        
        <motion.div 
          className="sidebar-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="admin">
            <div className="avatar">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                AA
              </motion.span>
            </div>
            <div className="info">
              <span>Admin User</span>
              <span>admin@example.com</span>
            </div>
          </div>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="main-content">
        <motion.div 
          className="top-bar"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between w-full">
            <h1 className="top-title">ADK Content Studio</h1>
            
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <motion.div 
                className="hidden md:flex items-center bg-white bg-opacity-50 rounded-lg px-4 py-2 backdrop-blur-sm border border-white border-opacity-20"
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
              >
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search content..."
                  className="bg-transparent border-none outline-none text-sm placeholder-gray-500 w-48"
                  aria-label="Search content"
                />
              </motion.div>

              {/* Notifications */}
              <motion.button
                className="relative p-2 bg-white bg-opacity-50 rounded-lg backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-70 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <motion.span
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                />
              </motion.button>

              {/* New Content Button */}
              <motion.button 
                className="btn-primary flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Create new content"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">New Content</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="main-scroll-area"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {children ?? <Outlet />}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;