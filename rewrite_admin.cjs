const fs = require('fs');

const code = `import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, limit, getDocs, doc, updateDoc } from 'firebase/firestore';
import { 
  Users, BookOpen, BrainCircuit, Settings, ShieldAlert, 
  BarChart3, Search, CheckCircle2, ChevronRight, X, Clock, CreditCard, ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto">
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
      </div>

      {/* Content */}
      <div className="p-6">
        <UsersTab activeTab={activeTab} />
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={\`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap \${active ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}\`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function UsersTab({ activeTab }: { activeTab: string }) {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(100));
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

  const getFilteredUsers = () => {
    let filtered = users.filter(u => 
      (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
      (u.email || '').toLowerCase().includes(search.toLowerCase())
    );

    switch (activeTab) {
      case 'new':
        return filtered.filter(u => !u.paymentStatus || u.paymentStatus === 'none' || u.paymentStatus === 'rejected');
      case 'pending':
        return filtered.filter(u => u.paymentStatus === 'pending');
      case 'approved':
        return filtered.filter(u => u.subscriptionStatus === 'active');
      case 'expired':
        return filtered.filter(u => u.subscriptionStatus === 'expired');
      default:
        return filtered;
    }
  };

  const currentUsers = getFilteredUsers();

  return (
    <div className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white capitalize">{activeTab} Users ({currentUsers.length})</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative max-w-xs w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          {activeTab === 'pending' && currentUsers.length > 0 && (
            <button 
              onClick={handleApproveAll}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              Approve All
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500">
                <th className="py-3 px-4 font-medium">User</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Payment Date</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(u => (
                <tr key={u.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white text-sm">{u.name || 'Anonymous'}</p>
                        <p className="text-xs text-slate-500">
                          {u.subscriptionStatus === 'active' 
                            ? \`Expires: \${new Date(u.subscriptionExpires).toLocaleDateString()}\`
                            : u.paymentStatus}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{u.email}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    {u.paymentSubmittedAt ? new Date(u.paymentSubmittedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {u.receiptUrl && (
                        <button 
                          onClick={() => setSelectedReceipt(u.receiptUrl)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors flex items-center gap-1"
                        >
                          <ExternalLink size={14} /> Receipt
                        </button>
                      )}
                      {activeTab === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(u.id)}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(u.id)}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {activeTab !== 'pending' && activeTab !== 'approved' && activeTab !== 'new' && u.subscriptionStatus === 'expired' && (
                        <span className="text-xs font-medium text-red-500">Expired</span>
                      )}
                      {activeTab === 'approved' && (
                        <span className="text-xs font-medium text-emerald-500">Active</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No users found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
              {selectedReceipt.startsWith('data:image') || selectedReceipt.match(/\\.(jpeg|jpg|gif|png)/i) || selectedReceipt.includes('firebasestorage') ? (
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
`;

fs.writeFileSync('src/components/Admin.tsx', code);
console.log("Admin.tsx rewritten");
