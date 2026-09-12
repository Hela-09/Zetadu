import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs, doc, updateDoc } from 'firebase/firestore';
import { 
  Users, BookOpen, BrainCircuit, Settings, ShieldAlert, 
  BarChart3, Search, CheckCircle2, ChevronRight, X, Clock, CreditCard, ExternalLink, Activity,
  Ban, FileText, Filter, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AiUsageAdminTab from './AiUsageAdminTab';
import UserReportModal from './UserReportModal';

export default function Admin() {
  const { isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');

  if (!isSuperAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center h-full">
        <div className="max-w-md w-full">
          <ShieldAlert size={64} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400">
            You do not have the required administrative privileges to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 px-6 h-[72px] border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <ShieldAlert className="text-red-600 dark:text-red-500" size={24} />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Super Admin Dashboard</h2>
      </div>
      
      {/* Navigation */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto no-scrollbar shrink-0 bg-slate-100 dark:bg-slate-800/50">
        <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} icon={Clock} label="Pending Payments" />
        <TabButton active={activeTab === 'approved'} onClick={() => setActiveTab('approved')} icon={CheckCircle2} label="Approved Users" />
        <TabButton active={activeTab === 'expired'} onClick={() => setActiveTab('expired')} icon={Settings} label="Expired Users" />
        <TabButton active={activeTab === 'new'} onClick={() => setActiveTab('new')} icon={Users} label="New Users" />
        <TabButton active={activeTab === 'disabled'} onClick={() => setActiveTab('disabled')} icon={Ban} label="Disabled Accounts" />
        <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} icon={Users} label="All Accounts" />
        <TabButton active={activeTab === 'ai_usage'} onClick={() => setActiveTab('ai_usage')} icon={BrainCircuit} label="AI Usage & Analytics" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 pb-32 sm:pb-36">
        {activeTab === 'ai_usage' ? (
          <AiUsageAdminTab />
        ) : (
          <UsersTab activeTab={activeTab} />
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${active ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function UsersTab({ activeTab }: { activeTab: string }) {
  const { user, getToken } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  
  // User Report Modal
  const [reportUser, setReportUser] = useState<any | null>(null);

  // Status Action Modal (Disable / Enable)
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    user: any | null;
    action: 'disable' | 'enable';
    reason: string;
    loading: boolean;
    error: string | null;
  }>({
    isOpen: false,
    user: null,
    action: 'disable',
    reason: '',
    loading: false,
    error: null
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(150));
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      const now = Date.now();
      const expires = now + (90 * 24 * 60 * 60 * 1000); // 3 months
      await updateDoc(doc(db, 'users', userId), {
        paymentStatus: 'approved',
        subscriptionStatus: 'active',
        subscriptionStart: now,
        subscriptionExpires: expires,
        approvedAt: now,
        approvedBy: user?.uid
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to approve user");
    }
  };

  const handleReject = async (userId: string) => {
    if (!window.confirm("Are you sure you want to reject this payment?")) return;
    try {
      await updateDoc(doc(db, 'users', userId), {
        paymentStatus: 'rejected',
        receiptUrl: null
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to reject user");
    }
  };

  const handleApproveAll = async () => {
    if (!window.confirm("Approve all pending payments?")) return;
    const pending = users.filter(u => u.paymentStatus === 'pending');
    if (pending.length === 0) return;

    try {
      const now = Date.now();
      const expires = now + (90 * 24 * 60 * 60 * 1000); // 3 months
      await Promise.all(pending.map(u => 
        updateDoc(doc(db, 'users', u.id), {
          paymentStatus: 'approved',
          subscriptionStatus: 'active',
          subscriptionStart: now,
          subscriptionExpires: expires,
          approvedAt: now,
          approvedBy: user?.uid
        })
      ));
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to approve all");
    }
  };

  const openStatusModal = (targetUser: any, action: 'disable' | 'enable') => {
    setStatusModal({
      isOpen: true,
      user: targetUser,
      action,
      reason: action === 'disable' ? 'Disabled by Super Admin' : '',
      loading: false,
      error: null
    });
  };

  const executeStatusChange = async () => {
    if (!statusModal.user) return;
    setStatusModal(prev => ({ ...prev, loading: true, error: null }));

    try {
      const token = await getToken();
      const endpoint = statusModal.action === 'disable' ? '/api/admin/users/disable' : '/api/admin/users/enable';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          uid: statusModal.user.id,
          email: statusModal.user.email,
          reason: statusModal.reason || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to ${statusModal.action} user`);
      }

      // Update local state immediately
      setUsers(prev => prev.map(u => {
        if (u.id === statusModal.user.id) {
          return {
            ...u,
            disabled: statusModal.action === 'disable',
            status: statusModal.action === 'disable' ? 'disabled' : 'active',
            disabledAt: statusModal.action === 'disable' ? Date.now() : null,
            statusReason: statusModal.reason || null
          };
        }
        return u;
      }));

      // Close modal
      setStatusModal(prev => ({ ...prev, isOpen: false, loading: false }));
    } catch (err: any) {
      console.error(`Error during user ${statusModal.action}:`, err);
      setStatusModal(prev => ({ ...prev, loading: false, error: err?.message || `Failed to ${statusModal.action} account.` }));
    }
  };

  const getFilteredUsers = () => {
    let filtered = users.filter(u => {
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const s = search.toLowerCase();
      return name.includes(s) || email.includes(s) || (u.disabled ? 'disabled' : 'active').includes(s);
    });

    // 1. Filter by Active Tab
    switch (activeTab) {
      case 'new':
        filtered = filtered.filter(u => !u.paymentStatus || u.paymentStatus === 'none' || u.paymentStatus === 'rejected');
        break;
      case 'pending':
        filtered = filtered.filter(u => u.paymentStatus === 'pending');
        break;
      case 'approved':
        filtered = filtered.filter(u => u.subscriptionStatus === 'active');
        break;
      case 'expired':
        filtered = filtered.filter(u => u.subscriptionStatus === 'expired');
        break;
      case 'disabled':
        filtered = filtered.filter(u => u.disabled === true || u.status === 'disabled');
        break;
      case 'all':
      default:
        break;
    }

    // 2. Filter by Status filter pill (All / Active / Disabled)
    if (statusFilter === 'active') {
      filtered = filtered.filter(u => !u.disabled && u.status !== 'disabled');
    } else if (statusFilter === 'disabled') {
      filtered = filtered.filter(u => u.disabled === true || u.status === 'disabled');
    }

    return filtered;
  };

  const currentUsers = getFilteredUsers();

  return (
    <div className="space-y-6 bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
      
      {/* Top Filter & Search Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white capitalize">
            {activeTab === 'all' ? 'All User Accounts' : activeTab === 'disabled' ? 'Disabled User Accounts' : `${activeTab} Users`} ({currentUsers.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage account status, investigate activity reports, and control system access.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${statusFilter === 'all' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              All Statuses
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${statusFilter === 'active' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <CheckCircle2 size={12} /> Active
            </button>
            <button
              onClick={() => setStatusFilter('disabled')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${statusFilter === 'disabled' ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <Ban size={12} /> Disabled
            </button>
          </div>

          {/* Search Input */}
          <div className="relative max-w-xs w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by name, email, status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {activeTab === 'pending' && currentUsers.length > 0 && (
            <button 
              onClick={handleApproveAll}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shadow-sm"
            >
              Approve All
            </button>
          )}

          <button
            onClick={fetchUsers}
            title="Reload user records"
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-xs">Loading user directory...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Subscription</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(u => {
                const isUserDisabled = u.disabled === true || u.status === 'disabled';
                return (
                  <tr key={u.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-xs">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 text-white shadow-xs ${
                          isUserDisabled ? 'bg-red-600' : 'bg-blue-600'
                        }`}>
                          {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white">{u.name || 'Anonymous'}</p>
                          <p className="text-[11px] text-slate-400">
                            {u.createdAt ? `Joined: ${new Date(u.createdAt).toLocaleDateString()}` : 'Registered User'}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      {u.email || 'No email provided'}
                    </td>

                    {/* Account Status Badge */}
                    <td className="py-3 px-4">
                      {isUserDisabled ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                          <Ban size={11} /> Disabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 size={11} /> Active
                        </span>
                      )}
                    </td>

                    {/* Subscription / Plan Status */}
                    <td className="py-3 px-4">
                      <div>
                        <span className={`capitalize font-semibold ${
                          u.subscriptionStatus === 'active' 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : u.subscriptionStatus === 'expired' 
                            ? 'text-amber-600 dark:text-amber-400' 
                            : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {u.subscriptionStatus || 'Free'}
                        </span>
                        {u.subscriptionExpires && (
                          <p className="text-[10px] text-slate-400">
                            Exp: {new Date(u.subscriptionExpires).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Action Controls */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* 1. View Report Action */}
                        <button
                          onClick={() => setReportUser(u)}
                          title="View Comprehensive User Report"
                          className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <FileText size={13} /> View Report
                        </button>

                        {/* 2. Disable / Enable Action */}
                        {isUserDisabled ? (
                          <button
                            onClick={() => openStatusModal(u, 'enable')}
                            title="Re-enable this user account"
                            className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <CheckCircle2 size={13} /> Enable
                          </button>
                        ) : (
                          <button
                            onClick={() => openStatusModal(u, 'disable')}
                            title="Disable this user account"
                            className="px-2.5 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <Ban size={13} /> Disable
                          </button>
                        )}

                        {/* Receipt Button */}
                        {u.receiptUrl && (
                          <button 
                            onClick={() => setSelectedReceipt(u.receiptUrl)}
                            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <ExternalLink size={13} /> Receipt
                          </button>
                        )}

                        {/* Payment Approval */}
                        {activeTab === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(u.id)}
                              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleReject(u.id)}
                              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Users size={36} className="mx-auto mb-2 opacity-40" />
                    <p className="font-medium text-sm">No accounts found matching the current filters.</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting the status filter or clearing your search query.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal for Disable / Enable */}
      {statusModal.isOpen && statusModal.user && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className={`p-5 border-b flex items-center gap-3 ${
              statusModal.action === 'disable' 
                ? 'bg-red-50/60 dark:bg-red-950/30 border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400' 
                : 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400'
            }`}>
              {statusModal.action === 'disable' ? <Ban size={24} /> : <CheckCircle2 size={24} />}
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {statusModal.action === 'disable' ? 'Disable User Account' : 'Re-Enable User Account'}
                </h3>
                <p className="text-xs opacity-80 font-mono">
                  {statusModal.user.email || statusModal.user.id}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                {statusModal.action === 'disable' ? (
                  <>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      Disabling will take immediate effect:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                      <li>The user will immediately lose access to Zetadu.</li>
                      <li>Active sessions and refresh tokens will be revoked immediately.</li>
                      <li>Google Sign-In and email logins will be blocked.</li>
                      <li>New account creation with this email will be prohibited.</li>
                      <li><strong>All user data, progress, and flashcards remain preserved safely.</strong></li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      Restoring user access:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                      <li>The user will be permitted to sign in again immediately.</li>
                      <li>All their previously saved flashcards, practice history, and progress will be available.</li>
                      <li>Email registration restrictions for this account will be cleared.</li>
                    </ul>
                  </>
                )}
              </div>

              {statusModal.action === 'disable' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Administrative Reason (Optional)
                  </label>
                  <input
                    type="text"
                    value={statusModal.reason}
                    onChange={(e) => setStatusModal(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="e.g. Terms violation, requested deactivation..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}

              {statusModal.error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg text-xs text-red-600 dark:text-red-300 flex items-center gap-2">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{statusModal.error}</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-2">
              <button
                onClick={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
                disabled={statusModal.loading}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeStatusChange}
                disabled={statusModal.loading}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5 ${
                  statusModal.action === 'disable' 
                    ? 'bg-red-600 hover:bg-red-700 disabled:opacity-50' 
                    : 'bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50'
                }`}
              >
                {statusModal.loading && <RefreshCw size={14} className="animate-spin" />}
                {statusModal.action === 'disable' ? 'Confirm Disable' : 'Confirm Enable'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Report Modal */}
      {reportUser && (
        <UserReportModal
          userId={reportUser.id}
          userInitialData={reportUser}
          onClose={() => setReportUser(null)}
          onStatusChange={(uid, newStatus) => {
            setUsers(prev => prev.map(u => {
              if (u.id === uid) {
                return {
                  ...u,
                  disabled: newStatus === 'disabled',
                  status: newStatus,
                  disabledAt: newStatus === 'disabled' ? Date.now() : null
                };
              }
              return u;
            }));
          }}
        />
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white">Payment Receipt</h3>
              <button onClick={() => setSelectedReceipt(null)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 flex justify-center items-center">
              {selectedReceipt.startsWith('data:image') || selectedReceipt.match(/\.(jpeg|jpg|gif|png)/i) || selectedReceipt.includes('firebasestorage') ? (
                 <img src={selectedReceipt} alt="Receipt" className="max-w-full max-h-full object-contain rounded" />
              ) : (
                 <a href={selectedReceipt} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline flex items-center gap-2">
                    <ExternalLink size={20} /> Open Receipt Document
                 </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

