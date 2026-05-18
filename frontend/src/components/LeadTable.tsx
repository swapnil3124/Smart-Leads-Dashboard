import { motion } from 'framer-motion';
import { 
  Search, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
}

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  error: string;
  search: string;
  setSearch: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  source: string;
  setSource: (val: string) => void;
  sort: string;
  setSort: (val: string) => void;
  page: number;
  setPage: (val: number | ((p: number) => number)) => void;
  totalPages: number;
  openModal: (lead?: Partial<Lead>, viewOnly?: boolean) => void;
  handleDelete: (id: string) => void;
  handleExport: () => void;
}

const LeadTable = ({
  leads,
  loading,
  error,
  search,
  setSearch,
  status,
  setStatus,
  source,
  setSource,
  sort,
  setSort,
  page,
  setPage,
  totalPages,
  openModal,
  handleDelete,
  handleExport
}: LeadTableProps) => {
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-[#111625] rounded-2xl shadow-sm border dark:border-[#1E2638] overflow-hidden">
      {/* Controls */}
      <div className="p-6 border-b dark:border-[#1E2638] flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:max-w-xs min-w-[200px]">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search leads..."
              className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1E2638] border-0 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="border-0 bg-gray-50 dark:bg-[#1E2638] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>

          {/* Source Filter */}
          <select
            className="border-0 bg-gray-50 dark:bg-[#1E2638] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>

          {/* Sort */}
          <select
            className="border-0 bg-gray-50 dark:bg-[#1E2638] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full md:w-auto justify-end">
          {user?.role === 'Admin' && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-[#1E2638] text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1E2638]/80 transition-colors text-sm font-medium"
            >
              <Download size={16} /> Export
            </button>
          )}
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm shadow-indigo-200 dark:shadow-none"
          >
            <Plus size={16} /> Add Lead
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="space-y-3 p-6">
            <div className="h-10 bg-gray-100 dark:bg-[#1E2638] rounded-xl animate-pulse" />
            <div className="h-16 bg-gray-50 dark:bg-[#1E2638]/50 rounded-xl animate-pulse" />
            <div className="h-16 bg-gray-50 dark:bg-[#1E2638]/50 rounded-xl animate-pulse" />
            <div className="h-16 bg-gray-50 dark:bg-[#1E2638]/50 rounded-xl animate-pulse" />
            <div className="h-16 bg-gray-50 dark:bg-[#1E2638]/50 rounded-xl animate-pulse" />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">{error}</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-medium mb-1">No leads found</p>
            <p className="text-sm">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-50 dark:divide-gray-800">
              {leads.map((lead, index) => (
                <motion.tr 
                  key={lead._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => openModal(lead, true)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{lead.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal(lead)}
                        className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      {user?.role === 'Admin' && (
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t dark:border-gray-800 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border-0 bg-gray-50 dark:bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border-0 bg-gray-50 dark:bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'New':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'Contacted':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Qualified':
      return 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'Lost':
      return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

export default LeadTable;
