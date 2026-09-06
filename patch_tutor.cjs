const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

// 1. Add chatError state
if (!code.includes('const [chatError, setChatError]')) {
  code = code.replace(
    /const \[isLoading, setIsLoading\] = useState\(false\);/,
    "const [isLoading, setIsLoading] = useState(false);\n  const [chatError, setChatError] = useState<string | null>(null);"
  );
}

// 2. Add retry logic
const sendImpl = `
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
          ...(token ? { 'Authorization': \`Bearer \${token}\` } : {})
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
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\\n');
        
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
            ...(token ? { 'Authorization': \`Bearer \${token}\` } : {})
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
`;

const handleSendRegex = /const handleSend = async \(\) => \{[\s\S]*?\} finally \{\s*setIsLoading\(false\);\s*\}\s*\};/m;

code = code.replace(handleSendRegex, sendImpl);

// 3. Add Retry button UI
const retryUI = `
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
`;

code = code.replace(/<div ref=\{messagesEndRef\} \/>/, retryUI);

fs.writeFileSync('src/components/Tutor.tsx', code);
