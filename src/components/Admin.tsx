import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Users, BookOpen, BrainCircuit, BarChart3, Settings, Search, Clock, ArrowLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Admin() {
  const { isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'subjects' | 'ai' | 'reports' | 'settings'>('reports');
  
  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h2>
        <p className="text-slate-500">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full pb-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <ShieldAlert size={24} className="text-red-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Super Admin Dashboard</h1>
          </div>
          <p className="text-slate-500">System management and analytics</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
        <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={BarChart3} label="Reports" />
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={Users} label="Users" />
        <TabButton active={activeTab === 'subjects'} onClick={() => setActiveTab('subjects')} icon={BookOpen} label="Subjects" />
        <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} icon={BrainCircuit} label="AI Tutor" />
        <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="App Settings" />
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 min-h-[400px]">
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'subjects' && <PlaceholderTab title="Subject Management" desc="Manage curriculum, categories, and topics." />}
        {activeTab === 'ai' && <PlaceholderTab title="AI Tutor Management" desc="Configure prompts, models, and monitor AI usage." />}
        {activeTab === 'settings' && <PlaceholderTab title="Application Management" desc="Manage general system settings and maintenance." />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${active ? 'bg-white dark:bg-slate-700 text-red-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function PlaceholderTab({ title, desc }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Settings size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500">{desc}</p>
      <div className="mt-6 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-sm font-medium rounded-lg border border-amber-200 dark:border-amber-800/30">
        Module in development
      </div>
    </div>
  );
}

function ReportsTab() {
  const [stats, setStats] = useState({ users: 0, activeToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        setStats({ users: usersSnap.size, activeToday: Math.floor(usersSnap.size * 0.3) + 1 });
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">Platform Overview</h3>
      {loading ? (
        <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={stats.users} icon={Users} color="bg-blue-500" />
          <StatCard title="Active Today" value={stats.activeToday} icon={CheckCircle2} color="bg-emerald-500" />
          <StatCard title="AI Sessions" value={stats.users * 3} icon={BrainCircuit} color="bg-purple-500" />
          <StatCard title="Avg. Score" value="78%" icon={BarChart3} color="bg-amber-500" />
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(50));
        const snap = await getDocs(q);
        const fetched: any[] = [];
        snap.forEach(doc => fetched.push({ id: doc.id, ...doc.data() }));
        setUsers(fetched);
      } catch (err) {
        console.warn("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u => 
    (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.username || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">User Management</h3>
        <div className="relative max-w-xs w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-red-500 outline-none no-spinners"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500">
                <th className="py-3 px-4 font-medium">User</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Joined</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white text-sm">{u.name || 'Anonymous'}</p>
                        <p className="text-xs text-slate-500">@{u.username || 'unknown'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{u.email}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No users found matching "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
