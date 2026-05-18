import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  BarChart2, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  currentView: string;
  setCurrentView: (val: string) => void;
}

const Sidebar = ({ 
  darkMode, 
  toggleDarkMode, 
  isCollapsed, 
  setIsCollapsed, 
  currentView, 
  setCurrentView 
}: SidebarProps) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { icon: <Users size={20} />, label: 'Leads' },
    { icon: <BarChart2 size={20} />, label: 'Analytics' },
  ];

  return (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="h-screen bg-[#3F3D9E] dark:bg-[#0B0F19] border-r border-[#4A47A3] dark:border-[#1E2638] flex flex-col justify-between p-4 fixed left-0 top-0 z-50 shadow-sm"
    >
      <div>
        {/* Logo / Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-white dark:bg-gradient-to-r dark:from-indigo-600 dark:to-violet-600 dark:bg-clip-text dark:text-transparent"
            >
              SmartLeads
            </motion.h1>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white dark:bg-[#111625] dark:hover:bg-[#1E2638] dark:text-gray-400"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ x: 4 }}
              onClick={() => setCurrentView(item.label)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${
                currentView === item.label 
                  ? 'bg-white text-[#3F3D9E] dark:bg-indigo-900/30 dark:text-indigo-400' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white dark:text-gray-400 dark:hover:bg-[#111625]/50 dark:hover:text-white'
              }`}
            >
              {item.icon}
              {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{item.label}</motion.span>}
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Footer / Profile */}
      <div className="space-y-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white dark:text-gray-400 dark:hover:bg-[#111625]/50 dark:hover:text-white"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          {!isCollapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-2 py-3 border-t border-[#4A47A3] dark:border-[#1E2638]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/70 dark:text-gray-400 truncate">{user?.role}</p>
            </div>
          )}
          {!isCollapsed && (
            <button 
              onClick={logout}
              className="text-white/70 hover:text-red-300 dark:text-gray-400 dark:hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
