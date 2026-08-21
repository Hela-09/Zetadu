import fs from 'fs';

let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

// 1. Add new state variables
content = content.replace(
  "const [isLoading, setIsLoading] = useState(false);",
  "const [isLoading, setIsLoading] = useState(false);\n  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);\n  const [isUploading, setIsUploading] = useState(false);\n  const [dragActive, setDragActive] = useState(false);\n  const fileInputRef = useRef<HTMLInputElement>(null);"
);

// 2. Add File Handlers
const fileHandlers = `
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
`;

content = content.replace(
  "const autoSaveConversation = async (newMessages: ChatMessage[]) => {",
  fileHandlers + "\n  const autoSaveConversation = async (newMessages: ChatMessage[]) => {"
);

// 3. Modify handleSend
content = content.replace(
  "const handleSend = async () => {",
  `const handleSend = async () => {
    if ((!input.trim() && selectedFiles.length === 0) || isLoading || isUploading) return;`
);

content = content.replace(
  `    const userMsg: ChatMessage = { role: 'user', text: input };
    const currentHistory = [...messages];
    const newMessages = [...currentHistory, userMsg];
    
    const messagesWithUser = [...currentHistory, userMsg];
    setMessages(messagesWithUser);
    setInput('');
    setIsLoading(true);`,
  `
    setIsUploading(true);
    let uploadedAttachments: any[] = [];
    
    try {
      const token = await getToken();
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('files', file));
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            ...(token ? { 'Authorization': \`Bearer \${token}\` } : {})
          },
          body: formData
        });
        
        if (!uploadRes.ok) throw new Error('Failed to upload files');
        const uploadData = await uploadRes.json();
        uploadedAttachments = uploadData.attachments || [];
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
    const messagesWithUser = [...currentHistory, userMsg];
    setMessages(messagesWithUser);
    setInput('');
    setSelectedFiles([]);
    setIsLoading(true);`
);

content = content.replace(
  `        body: JSON.stringify({
          message: userMsg.text,
          history: currentHistory,
          context: {`,
  `        body: JSON.stringify({
          message: userMsg.text,
          attachments: userMsg.attachments,
          history: currentHistory,
          context: {`
);

// 4. Modify JSX to wrap in drag/drop and display previews
content = content.replace(
  `<div className="flex-1 flex flex-col h-full min-w-0">`,
  `<div className="flex-1 flex flex-col h-full min-w-0" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>`
);

// Inside the user message map, render attachments
const attachmentRenderer = `
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {msg.attachments.map((att, i) => (
                            <div key={i} className="flex items-center gap-2 bg-blue-700/50 rounded-lg p-2 max-w-[200px]">
                               {att.mimeType?.startsWith('image/') ? (
                                  <img src={att.url} alt={att.name} className="w-10 h-10 object-cover rounded-md" />
                               ) : (
                                  <FileText size={20} className="shrink-0 text-blue-200" />
                               )}
                               <a href={att.url} target="_blank" rel="noreferrer" className="text-xs truncate text-blue-100 hover:underline">{att.name}</a>
                            </div>
                          ))}
                        </div>
                      )}
`;

content = content.replace(
  `<div className="whitespace-pre-wrap">{msg.text}</div>`,
  `<div className="whitespace-pre-wrap">{msg.text}</div>` + attachmentRenderer
);

// Show isUploading state
content = content.replace(
  `{isLoading && (`,
  `{(isLoading || isUploading) && (`
);

content = content.replace(
  `<Loader2 className="w-5 h-5 text-blue-500 animate-spin" />`,
  `<Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> {isUploading && <span className="ml-2 text-sm text-slate-500">Uploading files...</span>}`
);

// Preview selected files above the input
const filePreview = `
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
`;

content = content.replace(
  `<div className="relative flex flex-col sm:flex-row items-end`,
  filePreview + `\n            <div className="relative flex flex-col sm:flex-row items-end`
);

// Connect paperclip to file input
content = content.replace(
  `<button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors hover:text-blue-500" title="Attach file">`,
  `<input type="file" multiple className="hidden" ref={fileInputRef} onChange={(e) => { if(e.target.files) setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]); e.target.value = ''; }} />
                <button onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors hover:text-blue-500" title="Attach file">`
);

// Modify the button disabled state
content = content.replace(
  `disabled={!input.trim() || isLoading}`,
  `disabled={(!input.trim() && selectedFiles.length === 0) || isLoading || isUploading}`
);

content = content.replace(
  `className={input.trim() && !isLoading ? '' : 'opacity-50'}`,
  `className={(input.trim() || selectedFiles.length > 0) && !isLoading && !isUploading ? '' : 'opacity-50'}`
);

// Drag overlay
const dragOverlay = `
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
`;

content = content.replace(
  `<div className="flex-1 bento-card p-0 dark:bg-slate-800 dark:border-slate-700/50 flex flex-col overflow-hidden relative">`,
  `<div className="flex-1 bento-card p-0 dark:bg-slate-800 dark:border-slate-700/50 flex flex-col overflow-hidden relative">` + dragOverlay
);

fs.writeFileSync('src/components/Tutor.tsx', content);

