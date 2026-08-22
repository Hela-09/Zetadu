const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

// The outer wrapper is:
// <div className="w-full sm:w-[calc(100%-32px)] xl:w-[min(1200px,calc(100%-48px))] h-full sm:min-h-[400px] xl:min-h-[700px] sm:my-[8px] xl:my-[12px] sm:mx-auto flex gap-0 lg:gap-4 bg-white dark:bg-slate-900 sm:rounded-[18px] lg:rounded-[20px] shadow-none sm:shadow-xl sm:border border-slate-200 dark:border-slate-800 overflow-hidden relative">

const oldOuterWrapper = `      <div className="w-full sm:w-[calc(100%-32px)] xl:w-[min(1200px,calc(100%-48px))] h-full sm:min-h-[400px] xl:min-h-[700px] sm:my-[8px] xl:my-[12px] sm:mx-auto flex gap-0 lg:gap-4 bg-white dark:bg-slate-900 sm:rounded-[18px] lg:rounded-[20px] shadow-none sm:shadow-xl sm:border border-slate-200 dark:border-slate-800 overflow-hidden relative">`;

const newOuterWrapper = `      <div className="w-full sm:w-[calc(100%-32px)] xl:w-[min(1200px,calc(100%-48px))] h-full sm:min-h-[400px] xl:min-h-[700px] sm:my-[8px] xl:my-[12px] sm:mx-auto flex flex-col bg-white dark:bg-slate-900 sm:rounded-[18px] lg:rounded-[20px] shadow-none sm:shadow-xl sm:border border-slate-200 dark:border-slate-800 overflow-hidden relative">
      
      {/* GLOBAL HEADER */}
      <div className="shrink-0 flex items-center justify-between px-3 md:px-5 h-[60px] md:h-[72px] border-b border-slate-200 dark:border-slate-800 w-full bg-white dark:bg-slate-900 z-20">
        <div className="flex items-center gap-2 md:gap-4">
          {setCurrentView && (
            <button 
              onClick={() => {
                const prev = localStorage.getItem('educore_previous_view');
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
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white hidden sm:block">EduCore AI Tutor</h2>
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
      <div className="flex-1 flex gap-0 lg:gap-0 relative min-h-0 bg-slate-50 dark:bg-slate-900/50">`;

if(code.includes(oldOuterWrapper)){
  code = code.replace(oldOuterWrapper, newOuterWrapper);
} else {
  console.error("Failed to find oldOuterWrapper");
}

// Now we need to remove the internal headers.
// 1. History sidebar header
const oldHistoryHeader = `         <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
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
         </div>`;

const newHistoryHeader = `         {/* Mobile close button only */}
         <div className="lg:hidden p-2 flex justify-end border-b border-slate-100 dark:border-slate-700">
             <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" title="Close sidebar">
               <X size={20} />
             </button>
         </div>`;

if(code.includes(oldHistoryHeader)){
  code = code.replace(oldHistoryHeader, newHistoryHeader);
} else {
  console.error("Failed to find oldHistoryHeader");
}

// 2. Main Chat Area Header
const oldChatHeader = `        <div className="shrink-0 flex items-center gap-2 md:gap-3 px-[12px] md:px-[24px] h-[56px] md:h-[72px] border-b border-slate-200 dark:border-slate-800 w-full">
          {setCurrentView && (
            <button 
              onClick={() => {
                const prev = localStorage.getItem('educore_previous_view');
                if (prev && prev !== 'tutor') {
                  setCurrentView(prev);
                } else {
                  setCurrentView('home');
                }
              }}
              className="flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium text-sm"
              title="Back"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
              <span className="hidden md:inline">Back</span>
            </button>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors lg:hidden"
          >
            {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
          
          <div className="flex-1">
              <h2 className="text-[17px] md:text-[20px] font-semibold text-slate-900 dark:text-white overflow-hidden text-ellipsis whitespace-nowrap">
                {activeConversationId ? conversations.find(c => c.id === activeConversationId)?.title || 'Conversation' : 'New Conversation'}
              </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors items-center gap-2 text-sm font-medium border border-transparent">
              <span className="hidden sm:inline">Subject:</span> {activeConversationId ? conversations.find(c => c.id === activeConversationId)?.subject : targetSubject || 'General'}
            </button>
            <button 
              onClick={() => setShowClearPrompt(true)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              title="Delete conversation"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>`;

const newChatHeader = `        <div className="shrink-0 flex items-center justify-between gap-2 px-3 md:px-6 h-[48px] md:h-[56px] border-b border-slate-200 dark:border-slate-800 w-full bg-white dark:bg-slate-900/80">
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
        </div>`;

if(code.includes(oldChatHeader)){
  code = code.replace(oldChatHeader, newChatHeader);
} else {
  console.error("Failed to find oldChatHeader");
}

// Add a closing div before the end of the outer container because we added an extra wrapper
// Look for:
//       </div>
//     </div>
//   );
// }

const endPattern = `      </div>
    </div>
  );
}`;
const newEndPattern = `        </div>
      </div>
    </div>
  );
}`;
if (code.includes(endPattern)) {
  code = code.replace(endPattern, newEndPattern);
}

// Need to remove rounded corners from the sidebar since it's flush now
code = code.replace(
  `className={\`flex flex-col bg-slate-50 dark:bg-slate-900 lg:dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 shadow-xl lg:shadow-sm overflow-hidden h-full z-50 absolute inset-y-0 left-0 lg:relative lg:inset-auto shrink-0 lg:w-[260px] lg:min-w-[260px] lg:max-w-[260px] w-[300px] max-w-[85vw] transition-transform duration-300 ease-in-out \${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}\`}`,
  `className={\`flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl lg:shadow-none overflow-hidden h-full z-50 absolute inset-y-0 left-0 lg:relative lg:inset-auto shrink-0 lg:w-[280px] lg:min-w-[280px] lg:max-w-[280px] w-[300px] max-w-[85vw] transition-transform duration-300 ease-in-out \${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}\`}`
);

// We need to fix the main chat border since we have no gap
code = code.replace(
  `<div className="flex-1 flex flex-col h-full min-w-0 min-h-0" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>`,
  `<div className="flex-1 flex flex-col h-full min-w-0 min-h-0 bg-white dark:bg-slate-900" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>`
);

fs.writeFileSync('src/components/Tutor.tsx', code);
console.log("Patched Tutor.tsx");
