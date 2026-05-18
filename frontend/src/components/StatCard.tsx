import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  index: number;
}

const StatCard = ({ title, value, icon, color, index }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
    className="bg-white dark:bg-[#111625] p-6 rounded-2xl shadow-sm border dark:border-[#1E2638] flex items-center justify-between transition-all duration-500 cursor-pointer"
  >
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      {icon}
    </div>
  </motion.div>
);

export default StatCard;
