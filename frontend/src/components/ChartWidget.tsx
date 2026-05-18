import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const ChartWidget = () => {
  const [data, setData] = useState<{ name: string; leads: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/leads/growth');
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch growth data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="bg-white dark:bg-[#111625] p-6 rounded-2xl shadow-sm border dark:border-[#1E2638]"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Leads Growth</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly acquisition overview</p>
        </div>
        <select className="text-sm border-0 bg-gray-50 dark:bg-[#1E2638] rounded-lg px-3 py-1.5 focus:outline-none dark:text-white">
          <option>Last 7 months</option>
          <option>Last 12 months</option>
        </select>
      </div>

      <div className="h-72">
        {loading ? (
          <div className="h-full w-full bg-gray-50 dark:bg-[#0B0F19]/30 rounded-xl animate-pulse flex items-end justify-between p-4 gap-3">
            <div className="w-1/6 h-[30%] bg-gray-200 dark:bg-[#1E2638] rounded-lg" />
            <div className="w-1/6 h-[50%] bg-gray-200 dark:bg-[#1E2638] rounded-lg" />
            <div className="w-1/6 h-[70%] bg-gray-200 dark:bg-[#1E2638] rounded-lg" />
            <div className="w-1/6 h-[40%] bg-gray-200 dark:bg-[#1E2638] rounded-lg" />
            <div className="w-1/6 h-[85%] bg-gray-200 dark:bg-[#1E2638] rounded-lg" />
            <div className="w-1/6 h-[60%] bg-gray-200 dark:bg-[#1E2638] rounded-lg" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '0', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'white'
                }} 
              />
              <Area type="monotone" dataKey="leads" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default ChartWidget;
