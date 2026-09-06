import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Sparkles, Loader2, Trash2, Paperclip, Bookmark, FileText, ChevronDown, MessageSquare, Plus, Clock, Search, X, PanelLeftClose, PanelLeftOpen, HardDrive } from 'lucide-react';
import { useGooglePicker } from '../hooks/useGooglePicker';
import { ChatMessage, TutorConversation } from '../types';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, query, where, orderBy, updateDoc } from 'firebase/firestore';

const formatAIResponse = (text: string) => {
  if (!text) return '';
  let formatted = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 / $2');
  formatted = formatted.replace(/\\theta/g, 'θ').replace(/\\times/g, '×').replace(/\\sin/g, 'sin').replace(/\\cos/g, 'cos').replace(/\\tan/g, 'tan').replace(/\\pi/g, 'π').replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\Delta/g, 'Δ').replace(/\\delta/g, 'δ').replace(/\\infty/g, '∞').replace(/\\pm/g, '±').replace(/\\approx/g, '≈').replace(/\\neq/g, '≠').replace(/\\leq/g, '≤').replace(/\\geq/g, '≥');
  formatted = formatted.replace(/\\text\{([^}]+)\}/g, '$1');
  formatted = formatted.replace(/_([0-9])/g, (match, p1) => {
    const subs: Record<string, string> = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
    return subs[p1] || `_${p1}`;
  });
  formatted = formatted.replace(/\^([0-9])/g, (match, p1) => {
    const sups: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    return sups[p1] || `^${p1}`;
  });
  formatted = formatted.replace(/_\{([^}]+)\}/g, '_$1');
  formatted = formatted.replace(/\^\{([^}]+)\}/g, '^$1');
  formatted = formatted.replace(/\$\$/g, '').replace(/\$/g, '').replace(/\\\(/g, '').replace(/\\\)/g, '').replace(/\\\[/g, '').replace(/\\\]/g, '').replace(/\\/g, '');
  return formatted;
};

import { ArrowLeft } from 'lucide-react';

interface TutorProps {
  setCurrentView?: (view: any) => void;
}

export default function Tutor({ setCurrentView }: TutorProps = {}) {
  const { user, getToken, userProfile, settings, oauthToken, signInWithGoogle } = useAuth();
  
  const [targetSubject] = useState(() => localStorage.getItem('zetadu_target_subject') || '');
  
  useEffect(() => {
    if (localStorage.getItem('zetadu_target_subject')) {
      localStorage.removeItem('zetadu_target_subject');
    }
  }, []);

  const defaultInitialMessage: ChatMessage = { 
    role: 'tutor', 
    text: targetSubject 
      ? `Hello! I see you want to study **${targetSubject}**. I'm your AI tutor. I can explain concepts, help you work through practice problems, or clarify anything you're confused about in ${targetSubject}. What topic would you like to start with?`
      : "Hello! I'm your AI tutor. I can explain concepts, help you work through practice problems, or clarify anything you're confused about. What would you like to study today?" 
  };
  
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([defaultInitialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  useEffect(() => {
    if (textareaRef.current) {
      if (input === '') {
        textareaRef.current.style.height = '24px';
      } else {
        textareaRef.current.style.height = 'auto';
        const maxHeight = window.innerWidth >= 768 ? 160 : 140;
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, maxHeight) + 'px';
      }
    }
  }, [input]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const handlePickerSelect = (file: any) => {
    // Treat the picked file as an attachment? We don't have the file object directly, we have a URL and name.
    // The user wants to attach a Google Drive file. For now, we can append it as a link to the message input.
    setInput((prev) => prev + (prev.trim() ? '\n' : '') + `[${file.name}](${file.url})`);
  };
  const { openPicker, isReady } = useGooglePicker(oauthToken, handlePickerSelect);
  
  const handleDriveClick = async () => {
    if (!oauthToken) {
      if (confirm('You need to sign in again to access Google Drive. Sign in now?')) {
        await signInWithGoogle();
      }
      return;
    }
    openPicker();
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [conversations, setConversations] = useState<TutorConversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearPrompt, setShowClearPrompt] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollButton(isScrolledUp);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!showScrollButton) {
      scrollToBottom();
    }
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
    setSidebarOpen(false);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    localStorage.removeItem('tutor_active_conv');
    setSidebarOpen(false);
  };

  

  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles: File[] = [];
    const newFiles = Array.from(files);
    
    for (const file of newFiles) {
      let maxSize = 25 * 1024 * 1024; // 25 MB default
      let typeName = "Document";
      
      if (file.type.startsWith('image/')) {
        maxSize = 20 * 1024 * 1024;
        typeName = "Image";
      } else if (file.type === 'application/pdf') {
        maxSize = 50 * 1024 * 1024;
        typeName = "PDF";
      } else if (file.type.startsWith('audio/')) {
        maxSize = 20 * 1024 * 1024;
        typeName = "Audio";
      }
      
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum size for ${typeName} is ${maxSize / (1024 * 1024)}MB.`);
        continue;
      }
      validFiles.push(file);
    }
    
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelection(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };


  const compressImage = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file;
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type, lastModified: Date.now() }));
            } else {
              resolve(file);
            }
          }, file.type, 0.8);
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
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

  
  const handleRetry = async () => {
    setChatError(null);
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
       const userMsg = messages[messages.length - 1];
       const previousHistory = messages.slice(0, -1);
       await processChat(userMsg, previousHistory);
    }
  };

  const processChat = async (userMsg: ChatMessage, currentHistory: ChatMessage[]) => {
    setIsLoading(true);
    setChatError(null);
    try {
      const token = await getToken();
      
      // Limit history to last 10 messages for performance and token saving
      const truncatedHistory = currentHistory.slice(-10);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: userMsg.text,
          attachments: userMsg.attachments,
          history: truncatedHistory,
          stream: true,
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
        if (response.status === 503) {
            throw new Error('The AI model is currently overloaded. Please try again.');
        }
        throw new Error('Chat failed (' + response.status + ')');
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      // Initialize the tutor message with empty text
      setMessages([...currentHistory, userMsg, { role: 'tutor', text: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        setIsLoading(false);
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.error) {
                 throw new Error(data.error);
              }
              if (data.text) {
                fullResponse += data.text;
                // Update the last message
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].text = fullResponse;
                  return newMsgs;
                });
                
                // Keep scrolling down gently as content arrives
                if (!showScrollButton && scrollAreaRef.current) {
                  const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
                  if (scrollHeight - scrollTop - clientHeight < 150) {
                     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }
            } catch (e) {
              console.warn("Error parsing chunk", e);
            }
          }
        }
      }

      const finalMessages = [...currentHistory, userMsg, { role: 'tutor', text: fullResponse } as ChatMessage];
      setMessages(finalMessages);
      await autoSaveConversation(finalMessages);
      
    } catch (error: any) {
      console.error('Chat error:', error);
      setChatError(error.message === 'Authentication required' ? 'Please sign in to use the AI Tutor.' : "I'm having trouble connecting right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && selectedFiles.length === 0) || isLoading || isUploading) return;

    setIsUploading(true);
    let uploadedAttachments: any[] = [];
    
    try {
      const token = await getToken();
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        for (const file of selectedFiles) {
          const compressedFile = await compressImage(file);
          formData.append('files', compressedFile);
        }
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: formData
        });
        
        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          throw new Error('Upload failed (' + uploadRes.status + '): ' + errText.substring(0, 100));
        }
        
        const contentType = uploadRes.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const uploadData = await uploadRes.json();
          uploadedAttachments = uploadData.attachments || [];
        } else {
          const errText = await uploadRes.text();
          throw new Error('Upload returned HTML: ' + errText.substring(0, 100));
        }
      }
    } catch(err) {
       console.error("Upload error", err);
       alert("Failed to upload files. Please try again.");
       setIsUploading(false);
       return;
    }
    
    setIsUploading(false);

    const userMsg: ChatMessage = { role: 'user', text: input, attachments: uploadedAttachments };
    const currentHistory = [...messages];
    
    // Add user message immediately
    setMessages([...currentHistory, userMsg]);
    setInput('');
    setSelectedFiles([]);
    setChatError(null);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await processChat(userMsg, currentHistory);
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
    <div className="w-full h-full flex items-center justify-center absolute inset-0 bg-white dark:bg-slate-900 sm:bg-slate-100 dark:sm:bg-slate-950">
      <div className="w-full sm:w-[calc(100%-32px)] xl:w-[min(1200px,calc(100%-48px))] h-full sm:h-[calc(100%-16px)] xl:h-[calc(100%-24px)] sm:min-h-[400px] xl:min-h-[700px] sm:my-[8px] xl:my-[12px] sm:mx-auto flex flex-col bg-white dark:bg-slate-900 sm:rounded-[18px] lg:rounded-[20px] shadow-none sm:shadow-xl sm:border border-slate-200 dark:border-slate-800 overflow-hidden relative">
      
      {/* GLOBAL HEADER */}
      <div className="shrink-0 flex items-center justify-between px-3 md:px-5 h-[60px] md:h-[72px] border-b border-slate-200 dark:border-slate-800 w-full bg-white dark:bg-slate-900 z-20">
        <div className="flex items-center gap-2 md:gap-4">
          {setCurrentView && (
            <button 
              onClick={() => {
                const prev = localStorage.getItem('zetadu_previous_view');
                if (prev && prev !== 'tutor') {
                  setCurrentView(prev);
                } else {
                  setCurrentView('home');
                }
              }}
              className="flex items-center justify-center gap-1.5 px-3 md:px-4 py-2 min-h-[44px] min-w-[44px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-bold text-[15px]"
              title="Back"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="shrink-0" />
              <span>Back</span>
            </button>
          )}
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white hidden sm:block">Zetadu AI Tutor</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Conversation Title (Mobile only) */}
          <div className="sm:hidden text-[14px] font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px] mr-1">
            {activeConversationId ? conversations.find(c => c.id === activeConversationId)?.title || 'Chat' : 'New Chat'}
          </div>
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="flex items-center justify-center gap-2 px-3 py-2 min-h-[44px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium text-sm"
          >
            <Clock size={18} />
            <span className="hidden md:inline">History</span>
          </button>
          <button 
            onClick={handleStartNew} 
            className="flex items-center justify-center w-[44px] h-[44px] text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shrink-0 shadow-sm" 
            title="New Chat"
            aria-label="New Chat"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      
      {/* CONTENT AREA */}
      <div className="flex-1 flex gap-0 lg:gap-0 relative min-h-0 bg-slate-50 dark:bg-slate-900/50">
            {/* Mobile/Tablet Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="absolute inset-0 bg-slate-900/20 dark:bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar for History */}
      <div className={`flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl lg:shadow-none overflow-hidden h-full z-50 absolute inset-y-0 left-0 lg:relative lg:inset-auto shrink-0 lg:w-[280px] lg:min-w-[280px] lg:max-w-[280px] w-[300px] max-w-[85vw] transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
         {/* Mobile close button only */}
         <div className="lg:hidden p-2 flex justify-end border-b border-slate-100 dark:border-slate-700">
             <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" title="Close sidebar">
               <X size={20} />
             </button>
         </div>
         <div className="p-4">
           <div className="relative">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search conversations..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full min-w-0 pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:text-white transition-colors no-spinners"
             />
           </div>
         </div>
         <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0 [scrollbar-gutter:stable]">
           {filteredConversations.length > 0 ? filteredConversations.map(conv => (
             <button 
               key={conv.id} 
               onClick={() => handleSelectConversation(conv)}
               className={`w-full text-left p-3 rounded-xl border transition-colors ${activeConversationId === conv.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-200 dark:hover:border-slate-700'}`}
             >
               <div className="flex items-center gap-2 mb-1">
                 <MessageSquare size={14} className={activeConversationId === conv.id ? 'text-blue-500' : 'text-slate-400'} />
                 <h4 className={`font-semibold text-sm truncate ${activeConversationId === conv.id ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>{conv.title}</h4>
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
      <div className="flex-1 flex flex-col h-full min-w-0 min-h-0 bg-white dark:bg-slate-900" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
        <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
        
        <div className="shrink-0 flex items-center justify-between gap-2 px-3 md:px-6 h-[48px] md:h-[56px] border-b border-slate-200 dark:border-slate-800 w-full bg-white dark:bg-slate-900/80">
          <div className="flex-1 overflow-hidden">
              <h2 className="text-[15px] md:text-[16px] font-semibold text-slate-800 dark:text-slate-200 overflow-hidden text-ellipsis whitespace-nowrap hidden sm:block">
                {activeConversationId ? conversations.find(c => c.id === activeConversationId)?.title || 'Conversation' : 'New Conversation'}
              </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex px-3 py-1 text-slate-500 dark:text-slate-400 items-center gap-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 rounded-lg">
              <span>Subject:</span> <span className="text-slate-700 dark:text-slate-200">{activeConversationId ? conversations.find(c => c.id === activeConversationId)?.subject : targetSubject || 'General'}</span>
            </div>
            <button 
              onClick={() => setShowClearPrompt(true)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              title="Delete conversation"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        {dragActive && (
          <div className="absolute inset-0 z-50 bg-blue-500/10 backdrop-blur-sm border-2 border-dashed border-blue-500 rounded-3xl flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Drop files to attach</h3>
              <p className="text-slate-500">Supports images, PDFs, Word, Excel, PowerPoint, etc.</p>
            </div>
          </div>
        )}

          
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0" ref={scrollAreaRef} onScroll={handleScroll}>
            <div className="mx-auto px-3 sm:px-0 w-full md:w-[calc(100%-48px)] max-w-[950px] py-6 space-y-7 pb-32 md:pb-40" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word', minWidth: 0 }}>
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 md:gap-5 w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'tutor' 
                      ? 'bg-gradient-to-br from-blue-500 to-emerald-500 text-white' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                  }`}>
                    {msg.role === 'tutor' ? <Sparkles size={16} /> : <User size={16} />}
                  </div>
                  
                  <div className={`text-[15px] leading-relaxed max-w-[calc(100%-48px)] sm:max-w-[85%] md:max-w-[900px] min-w-0 ${msg.role === 'tutor' ? 'flex-1' : ''} ${
                    msg.role === 'user'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-slate-800 dark:text-slate-200 p-4 rounded-2xl rounded-tr-sm'
                      : 'text-slate-800 dark:text-slate-200 py-2'
                  }`}>
                    {msg.role === 'user' ? (
                      <>
<div className="whitespace-pre-wrap">{msg.text}</div>
{msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {msg.attachments.map((att, i) => (
                            <div key={i} className="flex items-center gap-2 bg-blue-700/50 rounded-lg p-2 max-w-[200px]">
                               {att.mimeType?.startsWith('image/') ? (
                                  <img src={att.url} alt={att.name} loading="lazy" className="w-10 h-10 object-cover rounded-md" />
                               ) : (
                                  <FileText size={20} className="shrink-0 text-blue-200" />
                               )}
                               <a href={att.url} target="_blank" rel="noreferrer" className="text-xs truncate text-blue-100 hover:underline">{att.name}</a>
                            </div>
                          ))}
                        </div>
)}
</>
) : (
                      <div className="markdown-body prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-semibold prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:border-slate-700/50 overflow-x-hidden">
                        <style>{`
                          .markdown-body pre { overflow-x: auto; max-width: 100%; }
                          .markdown-body table { display: block; overflow-x: auto; max-width: 100%; }
                          .markdown-body img { max-width: 100%; height: auto; }
                          .markdown-body .math, .markdown-body .katex-display { overflow-x: auto; max-width: 100%; }
                        `}</style>
                        <ReactMarkdown>{msg.role === "tutor" ? formatAIResponse(msg.text) : msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {(isLoading || isUploading) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 md:gap-6 w-full"
                >
                  <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 text-white flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <div className="flex-1 py-2 flex items-center h-[56px] text-slate-800 dark:text-slate-200">
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> {isUploading && <span className="ml-2 text-sm text-slate-500">Uploading files...</span>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
              {chatError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between w-full p-4 mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Oops!</span>
                    <span>{chatError}</span>
                  </div>
                  <button
                    onClick={handleRetry}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 rounded-xl transition-colors font-medium whitespace-nowrap"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
              <div ref={messagesEndRef} />

            </div>
          </div>
          <AnimatePresence>
            {showScrollButton && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={scrollToBottom}
                className="absolute bottom-[100px] left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-[22px] px-[20px] h-[44px] justify-center text-[15px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-10 flex items-center gap-2"
              >
                <ChevronDown size={16} />
                New response
              </motion.button>
            )}
          </AnimatePresence>

          <div className="bg-white dark:bg-slate-900 shrink-0 flex flex-col items-center w-full pb-[env(safe-area-inset-bottom)]">
            <div className="w-[calc(100%-24px)] md:w-[calc(100%-48px)] max-w-[900px] mx-auto">
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

            
            {selectedFiles.length > 0 && (
              <div className="flex gap-2 p-2 mb-2 overflow-x-auto hide-scrollbar">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative shrink-0 flex items-center gap-2 bg-slate-200 dark:bg-slate-700 p-2 rounded-lg pr-8">
                     {file.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(file)} className="w-8 h-8 object-cover rounded" />
                     ) : (
                        <FileText size={20} className="text-slate-500 dark:text-slate-300" />
                     )}
                     <span className="text-xs truncate max-w-[100px] text-slate-700 dark:text-slate-200">{file.name}</span>
                     <button onClick={() => removeFile(idx)} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-full">
                       <X size={12} />
                     </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative w-full flex flex-row items-end gap-1 md:gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[18px] md:rounded-[20px] p-[10px_12px] md:p-[12px_16px] min-h-[68px] md:min-h-[78px] focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-colors shadow-sm mb-[16px]">
              <div className="flex gap-1 shrink-0 text-slate-400 items-center justify-center">
                <input type="file" multiple accept="image/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv" className="hidden" ref={fileInputRef} onChange={(e) => { handleFileSelection(e.target.files); e.target.value = ''; }} />
                <button onClick={() => fileInputRef.current?.click()} className="w-[44px] h-[44px] flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors hover:text-blue-500" title="Attach file">
                  <Paperclip size={18} />
                </button>
                <button onClick={handleDriveClick} className="w-[44px] h-[44px] flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors hover:text-blue-500" title="Attach from Google Drive">
                  <HardDrive size={18} />
                </button>
              </div>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  const maxHeight = window.innerWidth >= 768 ? 160 : 140;
                  e.target.style.height = Math.min(e.target.scrollHeight, maxHeight) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask your AI tutor..."
                className="flex-1 min-w-0 w-full bg-transparent border-none py-[12px] px-2 text-[16px] md:text-[17px] leading-[24px] resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500 self-center max-h-[160px] overflow-y-auto no-scrollbar"
                rows={1}
                style={{ minHeight: '24px' }}
              />
              <button
                onClick={handleSend}
                disabled={(!input.trim() && selectedFiles.length === 0) || isLoading || isUploading}
                className="shrink-0 w-[48px] h-[48px] flex items-center justify-center rounded-[14px] bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md"
              >
                <Send size={18} className={(input.trim() || selectedFiles.length > 0) && !isLoading && !isUploading ? '' : 'opacity-50'} />
              </button>
            </div>
            <p className="text-center text-[14px] text-slate-400 mt-[10px] mb-[12px]">
              AI can make mistakes. Verify important information.
            </p>
            </div>
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
      </div>
    </div>
  );
}
