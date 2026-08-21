const fs = require('fs');
let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

// Add HardDrive
content = content.replace(
  'import { Send, User, Sparkles, Loader2, Trash2, Paperclip, Bookmark, FileText, ChevronDown, MessageSquare, Plus, Clock, Search, X, PanelLeftClose, PanelLeftOpen } from \'lucide-react\';',
  'import { Send, User, Sparkles, Loader2, Trash2, Paperclip, Bookmark, FileText, ChevronDown, MessageSquare, Plus, Clock, Search, X, PanelLeftClose, PanelLeftOpen, HardDrive } from \'lucide-react\';\nimport { useGooglePicker } from \'../hooks/useGooglePicker\';'
);

// Destructure oauthToken, signInWithGoogle
content = content.replace(
  'const { user } = useAuth();',
  'const { user, oauthToken, signInWithGoogle } = useAuth();'
);

// Initialize hook
content = content.replace(
  '  const [dragActive, setDragActive] = useState(false);',
  `  const [dragActive, setDragActive] = useState(false);
  
  const handlePickerSelect = (file: any) => {
    // Treat the picked file as an attachment? We don't have the file object directly, we have a URL and name.
    // The user wants to attach a Google Drive file. For now, we can append it as a link to the message input.
    setInput((prev) => prev + (prev.trim() ? '\\n' : '') + \`[\${file.name}](\${file.url})\`);
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
  };`
);

// Add button
content = content.replace(
  '<button onClick={() => fileInputRef.current?.click()} className="w-[44px] h-[44px] flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors hover:text-blue-500" title="Attach file">\n                  <Paperclip size={18} />\n                </button>',
  `<button onClick={() => fileInputRef.current?.click()} className="w-[44px] h-[44px] flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors hover:text-blue-500" title="Attach file">
                  <Paperclip size={18} />
                </button>
                <button onClick={handleDriveClick} className="w-[44px] h-[44px] flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors hover:text-blue-500" title="Attach from Google Drive">
                  <HardDrive size={18} />
                </button>`
);

fs.writeFileSync('src/components/Tutor.tsx', content);
console.log('patched Tutor');
