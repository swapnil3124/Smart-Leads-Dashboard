import { useState, useEffect } from 'react';
import api from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { toast } from 'sonner';
import { Search, Plus, Edit, Sun, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import ChartWidget from '../components/ChartWidget';
import LeadTable from '../components/LeadTable';
import LeadModal from '../components/LeadModal';
import SourceChartWidget from '../components/SourceChartWidget';

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: string;
}

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, New: 0, Contacted: 0, Qualified: 0, Lost: 0 });
  
  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const debouncedSearch = useDebounce(search, 500);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<Partial<Lead>>({});
  const [modalLoading, setModalLoading] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('Dashboard');

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [debouncedSearch, status, source, sort, page]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await api.get('/leads', {
        params: {
          search: debouncedSearch,
          status,
          source,
          sort,
          page,
          limit: 10,
        },
      });
      setLeads(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/leads/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      if (currentLead._id) {
        await api.put(`/leads/${currentLead._id}`, currentLead);
        toast.success('Lead updated successfully!');
      } else {
        await api.post('/leads', currentLead);
        toast.success('Lead created successfully!');
      }
      setIsModalOpen(false);
      setCurrentLead({});
      fetchLeads();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        toast.success('Lead deleted successfully!');
        fetchLeads();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete lead');
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/leads/export', {
        params: { status, source, search: debouncedSearch },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Leads exported successfully!');
    } catch (err) {
      toast.error('Failed to export CSV');
    }
  };

  const openModal = (lead: Partial<Lead> = {}, viewOnly = false) => {
    setCurrentLead(lead);
    setIsViewOnly(viewOnly);
    setIsModalOpen(true);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-[#090D16] ${darkMode ? 'dark' : ''} transition-colors duration-500`}>
      {/* Sidebar */}
      <Sidebar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main Content Wrapper */}
      <div className={`flex flex-col min-h-screen transition-all ${isSidebarCollapsed ? 'md:ml-[80px]' : 'md:ml-[260px]'}`}>

        {/* Page Content */}
        <main className="flex-1 p-6 space-y-6">
          {currentView === 'Dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard title="Total Leads" value={stats.total} icon={<Search size={20} />} color="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" index={0} />
                <StatCard title="New" value={stats.New} icon={<Plus size={20} />} color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" index={1} />
                <StatCard title="Contacted" value={stats.Contacted} icon={<Edit size={20} />} color="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" index={2} />
                <StatCard title="Qualified" value={stats.Qualified} icon={<Sun size={20} />} color="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" index={3} />
                <StatCard title="Lost" value={stats.Lost} icon={<Trash2 size={20} />} color="bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" index={4} />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ChartWidget />
                </div>
                <SourceChartWidget leads={leads} />
              </div>

              {/* Table Section */}
              <LeadTable 
                leads={leads}
                loading={loading}
                error={error}
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
                source={source}
                setSource={setSource}
                sort={sort}
                setSort={setSort}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                openModal={openModal}
                handleDelete={handleDelete}
                handleExport={handleExport}
              />
            </>
          )}

          {currentView === 'Leads' && (
            <LeadTable 
              leads={leads}
              loading={loading}
              error={error}
              search={search}
              setSearch={setSearch}
              status={status}
              setStatus={setStatus}
              source={source}
              setSource={setSource}
              sort={sort}
              setSort={setSort}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              openModal={openModal}
              handleDelete={handleDelete}
              handleExport={handleExport}
            />
          )}

          {currentView === 'Analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChartWidget />
              </div>
              <SourceChartWidget leads={leads} />
            </div>
          )}

          {currentView === 'Settings' && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Settings page coming soon...</p>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      <LeadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentLead={currentLead}
        setCurrentLead={setCurrentLead}
        isViewOnly={isViewOnly}
        modalLoading={modalLoading}
        handleCreateOrUpdate={handleCreateOrUpdate}
      />
    </div>
  );
}

export default Dashboard;
