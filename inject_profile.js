import fs from 'fs';

let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const tutorHistoryViewCode = `
  const TutorHistoryView = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    
    useEffect(() => {
       const load = async () => {
          if (!user) return;
          const q = query(collection(db, 'tutor_conversations'), where('uid', '==', user.uid));
          const snap = await getDocs(q);
          const items: any[] = [];
          snap.forEach(d => items.push({ id: d.id, ...d.data() }));
          items.sort((a, b) => b.updatedAt - a.updatedAt);
          setHistory(items);
       };
       load();
    }, []);
    
    const handleDelete = async (id: string) => {
       if (window.confirm('Delete this conversation?')) {
          await import('firebase/firestore').then(async (firestore) => {
             await firestore.deleteDoc(firestore.doc(db, 'tutor_conversations', id));
          });
          setHistory(prev => prev.filter(h => h.id !== id));
       }
    };
    
    const filtered = history.filter(h => h.title?.toLowerCase().includes(search.toLowerCase()) || h.subject?.toLowerCase().includes(search.toLowerCase()));

    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setActiveSection(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Tutor History</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 mb-6">
           <div className="relative mb-6">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search conversations..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 transition-colors dark:text-white"
             />
           </div>
           <div className="space-y-3">
             {filtered.length > 0 ? filtered.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                   <div className="flex-1 min-w-0 mb-3 sm:mb-0 text-left w-full">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.subject} • {new Date(item.updatedAt).toLocaleDateString()}</p>
                   </div>
                   <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button onClick={() => { localStorage.setItem('tutor_active_conv', item.id); setView('tutor'); }} className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">Open</button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={18} /></button>
                   </div>
                </div>
             )) : (
                <div className="text-center p-6 text-slate-500">No conversations found.</div>
             )}
           </div>
        </div>
      </div>
    );
  };

  const SubjectHistoryView = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    
    useEffect(() => {
       const load = async () => {
          if (!user) return;
          const q = query(collection(db, 'subject_history'), where('uid', '==', user.uid));
          const snap = await getDocs(q);
          const items: any[] = [];
          snap.forEach(d => items.push({ id: d.id, ...d.data() }));
          items.sort((a, b) => b.lastOpened - a.lastOpened);
          setHistory(items);
       };
       load();
    }, []);
    
    const handleDelete = async (id: string) => {
       if (window.confirm('Delete this history record?')) {
          await import('firebase/firestore').then(async (firestore) => {
             await firestore.deleteDoc(firestore.doc(db, 'subject_history', id));
          });
          setHistory(prev => prev.filter(h => h.id !== id));
       }
    };
    
    const filtered = history.filter(h => h.name?.toLowerCase().includes(search.toLowerCase()) || h.category?.toLowerCase().includes(search.toLowerCase()));

    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setActiveSection(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recently Studied Subjects</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 mb-6">
           <div className="relative mb-6">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search subjects..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 transition-colors dark:text-white"
             />
           </div>
           <div className="space-y-3">
             {filtered.length > 0 ? filtered.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                   <div className="flex-1 min-w-0 mb-3 sm:mb-0 text-left w-full">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                      <p className="text-sm text-slate-500">{item.category} • Last studied: {new Date(item.lastOpened).toLocaleDateString()}</p>
                   </div>
                   <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button onClick={() => { setView('subjects'); }} className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">Open</button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={18} /></button>
                   </div>
                </div>
             )) : (
                <div className="text-center p-6 text-slate-500">No subjects found.</div>
             )}
           </div>
        </div>
      </div>
    );
  };
`;

content = content.replace('// --- Main View ---', tutorHistoryViewCode + '\n// --- Main View ---');

content = content.replace(
  `  if (activeSection === 'support') return <SupportView />;\n`,
  `  if (activeSection === 'support') return <SupportView />;\n  if (activeSection === 'tutor_history') return <TutorHistoryView />;\n  if (activeSection === 'subject_history') return <SubjectHistoryView />;\n`
);

content = content.replace(
  `<ActionRow icon={MessageSquare} title="AI Tutor History" onClick={() => { window.scrollTo(0, 0); setView('tutor'); }} />`,
  `<ActionRow icon={MessageSquare} title="AI Tutor History" onClick={() => handleAction('tutor_history')} />`
);

content = content.replace(
  `<ActionRow icon={BookOpen} title="Subjects & Curriculum" onClick={() => { window.scrollTo(0, 0); setView('subjects'); }} />`,
  `<ActionRow icon={BookOpen} title="Subjects & Curriculum" onClick={() => { window.scrollTo(0, 0); setView('subjects'); }} />\n        <ActionRow icon={Clock} title="Recently Studied Subjects" onClick={() => handleAction('subject_history')} />`
);

fs.writeFileSync('src/components/Profile.tsx', content);

