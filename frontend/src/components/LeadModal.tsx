import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
}

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLead: Partial<Lead>;
  setCurrentLead: (lead: Partial<Lead>) => void;
  isViewOnly: boolean;
  modalLoading: boolean;
  handleCreateOrUpdate: (e: React.FormEvent) => void;
}

const LeadModal = ({
  isOpen,
  onClose,
  currentLead,
  setCurrentLead,
  isViewOnly,
  modalLoading,
  handleCreateOrUpdate
}: LeadModalProps) => {
  const { user } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-[#111625] w-full max-w-md rounded-2xl p-6 shadow-xl border dark:border-[#1E2638] relative z-10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isViewOnly ? 'Lead Details' : currentLead._id ? 'Edit Lead' : 'Add New Lead'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            </div>

            {isViewOnly ? (
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Name</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{currentLead.name || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Email</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{currentLead.email || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Status</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{currentLead.status || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Source</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{currentLead.source || 'N/A'}</p>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 bg-gray-50 dark:bg-[#1E2638] text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1E2638]/80 transition-colors text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                  <input
                    type="text"
                    className="w-full border-0 bg-gray-50 dark:bg-[#1E2638] rounded-xl px-4 py-2.5 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-60"
                    value={currentLead.name || ''}
                    onChange={(e) => setCurrentLead({ ...currentLead, name: e.target.value })}
                    required
                    disabled={user?.role === 'Sales User' && !!currentLead._id}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <input
                    type="email"
                    className="w-full border-0 bg-gray-50 dark:bg-[#1E2638] rounded-xl px-4 py-2.5 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-60"
                    value={currentLead.email || ''}
                    onChange={(e) => setCurrentLead({ ...currentLead, email: e.target.value })}
                    required
                    disabled={user?.role === 'Sales User' && !!currentLead._id}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                  <select
                    className="w-full border-0 bg-gray-50 dark:bg-[#1E2638] rounded-xl px-4 py-2.5 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-60"
                    value={currentLead.status || 'New'}
                    onChange={(e) => setCurrentLead({ ...currentLead, status: e.target.value })}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Source</label>
                  <select
                    className="w-full border-0 bg-gray-50 dark:bg-[#1E2638] rounded-xl px-4 py-2.5 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-60"
                    value={currentLead.source || 'Website'}
                    onChange={(e) => setCurrentLead({ ...currentLead, source: e.target.value })}
                    disabled={user?.role === 'Sales User' && !!currentLead._id}
                  >
                    <option value="Website">Website</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 bg-gray-50 dark:bg-[#1E2638] text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1E2638]/80 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50 shadow-sm shadow-indigo-200 dark:shadow-none flex items-center justify-center min-w-[80px]"
                  >
                    {modalLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeadModal;
