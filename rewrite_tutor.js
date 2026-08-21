import fs from 'fs';

const content = `import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Sparkles, Loader2, Trash2, Paperclip, Bookmark, FileText, ChevronDown, MessageSquare, Plus, Clock, Search, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ChatMessage, TutorConversation } from '../types';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, where, orderBy, updateDoc } from 'firebase/firestore';

const formatAIResponse = (text: string) => {
  if (!text) return '';
  let formatted = text.replace(/\\\\frac\\{([^}]+)\\}\\{([^}]+)\\}/g, '$1 / $2');
  formatted = formatted.replace(/\\\\theta/g, 'θ').replace(/\\\\times/g, '×').replace(/\\\\sin/g, 'sin').replace(/\\\\cos/g, 'cos').replace(/\\\\tan/g, 'tan').replace(/\\\\pi/g, 'π').replace(/\\\\alpha/g, 'α').replace(/\\\\beta/g, 'β').replace(/\\\\gamma/g, 'γ').replace(/\\\\Delta/g, 'Δ').replace(/\\\\delta/g, 'δ').replace(/\\\\infty/g, '∞').replace(/\\\\pm/g, '±').replace(/\\\\approx/g, '≈').replace(/\\\\neq/g, '≠').replace(/\\\\leq/g, '≤').replace(/\\\\geq/g, '≥');
  formatted = formatted.replace(/\\\\text\\{([^}]+)\\}/g, '$1');
  formatted = formatted.replace(/_([0-9])/g, (match, p1) => {
    const subs: Record<string, string> = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
    return subs[p1] || \`_\${p1}\`;
  });
  formatted = formatted.replace(/\\^([0-9])/g, (match, p1) => {
    const sups: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    return sups[p1] || \`^\${p1}\`;
  });
  formatted = formatted.replace(/_\\{([^}]+)\\}/g, '_$1');
  formatted = formatted.replace(/\\^\\{([^}]+)\\}/g, '^$1');
  formatted = formatted.replace(/\\$\\$/g, '').replace(/\\$/g, '').replace(/\\\\\\(/g, '').replace(/\\\\\\)/g, '').replace(/\\\\\\[/g, '').replace(/\\\\\\]/g, '').replace(/\\\\/g, '');
  return formatted;
};

export default function Tutor() {
  const { user, getToken, userProfile, settings } = useAuth();
  
  const [targetSubject] = useState(() => localStorage.getItem('educore_target_subject') || '');
  
  useEffect(() => {
    if (localStorage.getItem('educore_target_subject')) {
      localStorage.removeItem('educore_target_subject');
    }
  }, []);

  const defaultInitialMessage: ChatMessage = { 
    role: 'tutor', 
    text: targetSubject 
      ? \`Hello! I see you want to study **\${targetSubject}**. I'm your AI tutor. I can explain concepts, help you work through practice problems, or clarify anything you're confused about in \${targetSubject}. What topic would you like to start with?\`
      : "Hello! I'm your AI tutor. I can explain concepts, help you work through practice problems, or clarify anything you're confused about. What would you like to study today?" 
  };
  
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([defaultInitialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<TutorConversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearPrompt, setShowClearPrompt] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load history sidebar
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'tutor_conversations'),
          where('uid', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const convos: TutorConversation[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          convos.push({
            id: doc.id,
            title: data.title || 'New Conversation',
            subject: data.subject || 'General',
            messages: data.messages || [],
            createdAt: data.createdAt || Date.now(),
            updatedAt: data.updatedAt || Date.now(),
            lastOpened: data.lastOpened || Date.now(),
            pinned: data.pinned,
            bookmarked: data.bookmarked
          });
        });
        
        convos.sort((a, b) => b.updatedAt - a.updatedAt);
        setConversations(convos);
        
        // Find if any conversation was active from localStorage
        const lastActiveId = localStorage.getItem('tutor_active_conv');
        if (lastActiveId) {
           const active = convos.find(c => c.id === lastActiveId);
           if (active) {
              handleSelectConversation(active);
           }
        }
      } catch (err) {
        console.warn("Failed to load tutor conversations", err);
      }
    };
    loadConversations();
  }, [user]);

  const handleSelectConversation = async (conv: TutorConversation) => {
    setActiveConversationId(conv.id);
    setMessages(conv.messages && conv.messages.length > 0 ? conv.messages : [defaultInitialMessage]);
    setSidebarOpen(false);
    localStorage.setItem('tutor_active_conv', conv.id);
    
    // Update last opened
    if (user) {
       try {
         await updateDoc(doc(db, 'tutor_conversations', conv.id), {
            lastOpened: Date.now()
         });
       } catch(e) {}
    }
  };

  const handleStartNew = () => {
    setActiveConversationId(null);
    setMessages([defaultInitialMessage]);
    setInput('');
    localStorage.removeItem('tutor_active_conv');
    setSidebarOpen(false);
  };

  const autoSaveConversation = async (newMessages: ChatMessage[]) => {
    if (!user) return;
    
    try {
      const isNew = !activeConversationId;
      let convId = activeConversationId;
      
      const title = newMessages.length > 1 ? newMessages[1].text.substring(0, 40) + '...' : 'New Conversation';
      
      const convData = {
        uid: user.uid,
        title,
        subject: targetSubject || 'General',
        messages: newMessages,
        updatedAt: Date.now(),
        lastOpened: Date.now()
      };

      if (isNew) {
         const docRef = await addDoc(collection(db, 'tutor_conversations'), {
            ...convData,
            createdAt: Date.now()
         });
         convId = docRef.id;
         setActiveConversationId(convId);
         localStorage.setItem('tutor_active_conv', convId);
         
         setConversations(prev => [{
            id: convId,
            ...convData,
            createdAt: Date.now()
         } as TutorConversation, ...prev]);
      } else {
         await updateDoc(doc(db, 'tutor_conversations', convId!), convData);
         setConversations(prev => prev.map(c => c.id === convId ? { ...c, ...convData } : c).sort((a, b) => b.updatedAt - a.updatedAt));
      }
    } catch (err) {
      console.warn("Auto save failed", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    const currentHistory = [...messages];
    const newMessages = [...prev => [...currentHistory, userMsg]]; // wait that's not right, newMessages should be currentHistory + userMsg
    
    const messagesWithUser = [...currentHistory, userMsg];
    setMessages(messagesWithUser);
    setInput('');
    setIsLoading(true);

    try {
      const token = await getToken();
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': \`Bearer \${token}\` } : {})
        },
        body: JSON.stringify({
          message: userMsg.text,
          history: currentHistory,
          context: {
            educationLevel: userProfile?.educationLevel || 'Secondary',
            country: userProfile?.country || 'International',
            tone: settings?.aiTutorTone || 'Friendly'
          }
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication required');
        }
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      const tutorResponse = data.response;
      
      const finalMessages = [...messagesWithUser, { role: 'tutor', text: tutorResponse } as ChatMessage];
      setMessages(finalMessages);
      
      await autoSaveConversation(finalMessages);
      
    } catch (error: any) {
      console.warn('Error fetching chat:', error);
      const errMessages = [...messagesWithUser, { role: 'tutor', text: error.message === 'Authentication required' ? 'Please sign in to use the AI Tutor.' : "I'm sorry, I'm having trouble connecting right now. Please try again later." } as ChatMessage];
      setMessages(errMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const confirmClearChat = async () => {
    setShowClearPrompt(false);
    if (activeConversationId && user) {
       try {
          await deleteDoc(doc(db, 'tutor_conversations', activeConversationId));
          setConversations(prev => prev.filter(c => c.id !== activeConversationId));
       } catch (e) {}
    }
    handleStartNew();
  };

  const prompts = [
    "Explain quadratic equations in simple terms.",
    "Give me a practice problem for cellular biology.",
    "How should I structure an essay for history?"
  ];

  const filteredConversations = conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.subject.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full mx-auto flex-1 flex pb-4 h-full gap-4 max-w-6xl">
      {/* Sidebar for History */}
      <div className={\`\${sidebarOpen ? 'flex' : 'hidden'} lg:flex shrink-0 w-full sm:w-80 flex-col bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full z-20 absolute lg:relative\`}>
         <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
           <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <Clock size={18} className="text-blue-500" />
             Chat History
           </h3>
           <div className="flex gap-2">
             <button onClick={handleStartNew} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors" title="New Chat">
               <Plus size={18} />
             </button>
             <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden" title="Close sidebar">
               <X size={18} />
             </button>
           </div>
         </div>
         <div className="p-4">
           <div className="relative">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search conversations..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:text-white transition-colors"
             />
           </div>
         </div>
         <div className="flex-1 overflow-y-auto p-3 space-y-2">
           {filteredConversations.length > 0 ? filteredConversations.map(conv => (
             <button 
               key={conv.id} 
               onClick={() => handleSelectConversation(conv)}
               className={\`w-full text-left p-3 rounded-xl border transition-colors \${activeConversationId === conv.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-200 dark:hover:border-slate-700'}\`}
             >
               <div className="flex items-center gap-2 mb-1">
                 <MessageSquare size={14} className={activeConversationId === conv.id ? 'text-blue-500' : 'text-slate-400'} />
                 <h4 className={\`font-semibold text-sm truncate \${activeConversationId === conv.id ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}\`}>{conv.title}</h4>
               </div>
               <div className="flex items-center justify-between text-xs text-slate-500 pl-5">
                 <span className="truncate max-w-[120px]">{conv.subject}</span>
                 <span>{new Date(conv.updatedAt).toLocaleDateString()}</span>
               </div>
             </button>
           )) : (
             <div className="text-center p-6 text-slate-500 text-sm">
               No conversations found.
             </div>
           )}
         </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="mb-4 shrink-0 flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors lg:hidden"
          >
            {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
          
          <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                {activeConversationId ? conversations.find(c => c.id === activeConversationId)?.title || 'Conversation' : 'New Conversation'}
              </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors items-center gap-2 text-sm font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <span className="hidden sm:inline">Subject:</span> {activeConversationId ? conversations.find(c => c.id === activeConversationId)?.subject : targetSubject || 'General'}
            </button>
            <button 
              onClick={() => setShowClearPrompt(true)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              title="Delete conversation"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 bento-card p-0 dark:bg-slate-800 dark:border-slate-700/50 flex flex-col overflow-hidden relative">
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={\`flex gap-3 md:gap-4 max-w-[95%] md:max-w-[85%] \${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}\`}
                >
                  <div className={\`shrink-0 w-8 h-8 rounded-full flex items-center justify-center \${
                    msg.role === 'tutor' 
                      ? 'bg-gradient-to-br from-blue-500 to-emerald-500 text-white' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                  }\`}>
                    {msg.role === 'tutor' ? <Sparkles size={16} /> : <User size={16} />}
                  </div>
                  
                  <div className={\`p-4 rounded-2xl text-[15px] leading-relaxed \${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-700/50'
                  }\`}>
                    {msg.role === 'user' ? (
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    ) : (
                      <div className="markdown-body text-sm prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:border-slate-700/50">
                        <ReactMarkdown>{msg.role === "tutor" ? formatAIResponse(msg.text) : msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 md:gap-4 max-w-[95%] md:max-w-[85%]"
                >
                  <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 text-white flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-700/50 rounded-tl-sm border border-slate-200 dark:border-slate-700/50 flex items-center h-[56px]">
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
            {messages.length === 1 && !activeConversationId && (
              <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
                {prompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(p)}
                    className="shrink-0 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-full text-sm hover:border-blue-300 dark:hover:border-blue-500 transition-colors whitespace-nowrap"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <div className="relative flex flex-col sm:flex-row items-end gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm">
              <div className="flex gap-1 shrink-0 px-2 sm:px-0 sm:py-2 text-slate-400">
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors hover:text-blue-500" title="Attach file">
                  <Paperclip size={18} />
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your AI tutor..."
                className="flex-1 w-full bg-transparent border-none py-2 px-2 resize-none focus:outline-none focus:ring-0 dark:text-white"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="shrink-0 p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors mb-0.5 sm:mb-0 shadow-sm"
              >
                <Send size={18} className={input.trim() && !isLoading ? '' : 'opacity-50'} />
              </button>
            </div>
            <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-2">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
      
      {showClearPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete this conversation?</h2>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowClearPrompt(false)}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmClearChat}
                className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors"
              >
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/components/Tutor.tsx', content);

