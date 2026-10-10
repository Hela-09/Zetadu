import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Layers,
  CheckSquare,
  Square,
  Check,
  Search,
  FileText,
  Sparkles,
  BrainCircuit,
  PenTool,
  ArrowRight,
  Plus,
  Trash2,
  Copy,
  Clock,
  Bookmark,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  BookOpen,
  Eye,
  ChevronRight,
  ExternalLink,
  Upload,
  File
} from 'lucide-react';
import { StudyNote, NoteAttachment, NoteFlashcard, NotePracticeQuestion } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { saveUserNote, saveNoteFlashcardsToDeck, SAMPLE_NOTES } from '../../utils/notesService';
import { useNavigate } from 'react-router-dom';

export interface CombineFileItem {
  id: string;
  name: string;
  subject: string;
  topic?: string;
  content: string;
  attachments?: NoteAttachment[];
  size?: number;
  uploadedAt: number;
  sourceType: 'uploaded' | 'saved_note' | 'sample';
}

interface CombineNotesProps {
  savedNotes: StudyNote[];
  currentEditorAttachments?: NoteAttachment[];
  currentEditorContent?: string;
  currentEditorTitle?: string;
  currentEditorSubject?: string;
  onOpenInEditor: (note: StudyNote) => void;
  onRefreshHistory: () => void;
}

export default function CombineNotes({
  savedNotes,
  currentEditorAttachments = [],
  currentEditorContent = '',
  currentEditorTitle = '',
  currentEditorSubject = 'General',
  onOpenInEditor,
  onRefreshHistory,
}: CombineNotesProps) {
  const { user, getToken, userProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');

  // Selected file IDs (Set for fast toggling)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Direct uploaded files within Combine Notes workspace
  const [directUploadedFiles, setDirectUploadedFiles] = useState<CombineFileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Combined Study Set Metadata
  const [studySetName, setStudySetName] = useState('');
  const [studySetSubject, setStudySetSubject] = useState('General');
  const [studySetTopic, setStudySetTopic] = useState('');

  // Combining State & Progress
  const [isCombining, setIsCombining] = useState(false);
  const [combineProgress, setCombineProgress] = useState(0);
  const [combineStatusText, setCombineStatusText] = useState('');
  const combineCancelledRef = useRef(false);

  // Combined Result Study Set
  const [combinedResult, setCombinedResult] = useState<StudyNote | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'content' | 'summary' | 'flashcards' | 'practice'>('content');

  // AI Generation on Combined Result
  const [aiGenerating, setAiGenerating] = useState<'summary' | 'flashcards' | 'practice' | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [combineNotice, setCombineNotice] = useState<string | null>(null);
  const [deckSaveSuccess, setDeckSaveSuccess] = useState(false);
  const aiAbortControllerRef = useRef<AbortController | null>(null);

  const handleStopCombining = () => {
    combineCancelledRef.current = true;
    setIsCombining(false);
    setCombineProgress(0);
    setCombineNotice('Combining process stopped by user. Your source files and inputs are safely preserved.');
  };

  const handleStopAiGenerating = () => {
    if (aiAbortControllerRef.current) {
      aiAbortControllerRef.current.abort();
      aiAbortControllerRef.current = null;
    }
    setAiGenerating(null);
    setCombineNotice('AI generation stopped by user. Your combined study set is safely preserved.');
  };

  // Practice Quiz State for Combined Set
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  // 1. Gather all available files from savedNotes, current editor, and direct uploads
  const allAvailableFiles = useMemo<CombineFileItem[]>(() => {
    const list: CombineFileItem[] = [];
    const seenNamesAndIds = new Set<string>();

    const addUnique = (item: CombineFileItem) => {
      const key = `${item.name.toLowerCase().trim()}_${item.content.length}`;
      if (!seenNamesAndIds.has(item.id) && !seenNamesAndIds.has(key)) {
        seenNamesAndIds.add(item.id);
        seenNamesAndIds.add(key);
        list.push(item);
      }
    };

    // A. Current direct uploads
    directUploadedFiles.forEach(addUnique);

    // B. Uploaded attachments in the current editor
    if (currentEditorAttachments && currentEditorAttachments.length > 0) {
      currentEditorAttachments.forEach((att, attIdx) => {
        addUnique({
          id: `editor_att_${att.name}_${attIdx}`,
          name: att.name,
          subject: currentEditorSubject || 'General',
          topic: currentEditorTitle || 'Current Upload',
          content: (att as any).extractedText || currentEditorContent || `Study notes extracted from uploaded ${att.name}`,
          attachments: [att],
          size: att.size,
          uploadedAt: Date.now(),
          sourceType: 'uploaded'
        });
      });
    }

    // C. Current editor document if it has written notes content
    if (currentEditorContent.trim()) {
      addUnique({
        id: 'editor_current_draft',
        name: currentEditorTitle.trim() || 'Current Notes in Editor',
        subject: currentEditorSubject || 'General',
        topic: 'Active Draft',
        content: currentEditorContent,
        attachments: currentEditorAttachments,
        uploadedAt: Date.now(),
        sourceType: 'uploaded'
      });
    }

    // D. User's saved notes in library
    savedNotes.forEach((n) => {
      addUnique({
        id: n.id,
        name: n.title,
        subject: n.subject || 'General',
        topic: n.topic || '',
        content: n.content,
        attachments: n.attachments,
        uploadedAt: n.updatedAt || n.createdAt || Date.now(),
        sourceType: 'saved_note'
      });

      // Also list individual attachments within saved notes as selectable items if unique
      if (n.attachments && n.attachments.length > 0) {
        n.attachments.forEach((att, attIdx) => {
          addUnique({
            id: `${n.id}_att_${attIdx}`,
            name: att.name,
            subject: n.subject || 'General',
            topic: n.title,
            content: (att as any).extractedText || n.content || `Document notes from ${n.title} (${att.name})`,
            attachments: [att],
            size: att.size,
            uploadedAt: n.updatedAt || Date.now(),
            sourceType: 'uploaded'
          });
        });
      }
    });

    // E. If no notes exist yet, add sample curriculum study notes so user can immediately combine
    if (list.length === 0) {
      SAMPLE_NOTES.forEach((s, idx) => {
        addUnique({
          id: `sample_note_${idx}`,
          name: s.title,
          subject: s.subject,
          topic: s.topic,
          content: s.content,
          uploadedAt: Date.now() - (idx + 1) * 86400000,
          sourceType: 'sample'
        });
      });
    }

    return list;
  }, [savedNotes, currentEditorAttachments, currentEditorContent, currentEditorTitle, currentEditorSubject, directUploadedFiles]);

  // Filtered files according to search and subject dropdown
  const filteredFiles = useMemo(() => {
    return allAvailableFiles.filter((f) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.subject.toLowerCase().includes(q) ||
        (f.topic && f.topic.toLowerCase().includes(q)) ||
        f.content.toLowerCase().includes(q);

      const matchesSubject = subjectFilter === 'All' || f.subject.toLowerCase() === subjectFilter.toLowerCase();

      return matchesSearch && matchesSubject;
    });
  }, [allAvailableFiles, searchQuery, subjectFilter]);

  // Available subjects for filtering
  const availableSubjects = useMemo(() => {
    const subs = new Set<string>();
    allAvailableFiles.forEach(f => {
      if (f.subject) subs.add(f.subject);
    });
    return ['All', ...Array.from(subs).sort()];
  }, [allAvailableFiles]);

  // Update study set name suggestion when selections change
  useEffect(() => {
    if (!studySetName || studySetName.startsWith('Combined:')) {
      const selected = allAvailableFiles.filter((f) => selectedIds.has(f.id));
      if (selected.length === 0) {
        setStudySetName('');
      } else if (selected.length === 1) {
        setStudySetName(`Combined: ${selected[0].name}`);
        setStudySetSubject(selected[0].subject || 'General');
      } else {
        const names = selected.map((s) => s.name).slice(0, 2).join(' + ');
        const extra = selected.length > 2 ? ` (+${selected.length - 2} more)` : '';
        setStudySetName(`Combined: ${names}${extra}`);
        // Pick majority subject
        const subjects = selected.map(s => s.subject).filter(Boolean);
        if (subjects.length > 0) {
          setStudySetSubject(subjects[0]);
        }
      }
    }
  }, [selectedIds, allAvailableFiles, studySetName]);

  // Selection handlers
  const handleToggleSelect = (fileId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredFiles.map((f) => f.id);
    setSelectedIds(new Set(allFilteredIds));
  };

  const handleClearAll = () => {
    setSelectedIds(new Set());
  };

  // Direct file uploader inside Combine Notes
  const handleDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const token = await getToken();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check for duplicate in current available list
      const isDuplicate = allAvailableFiles.some(
        (existing) => existing.name.toLowerCase().trim() === file.name.toLowerCase().trim()
      );
      if (isDuplicate) {
        setUploadError(`"${file.name}" is already in your files list.`);
        continue;
      }

      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const formData = new FormData();
        formData.append('files', file);
        try {
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: formData,
          });

          if (!uploadRes.ok) {
            const errData = await uploadRes.json().catch(() => null);
            throw new Error(errData?.error || `Upload failed (${uploadRes.status})`);
          }

          const data = await uploadRes.json();
          const uploadedAtt = data.attachments?.[0];
          const newAtt = uploadedAtt || {
            name: file.name,
            url: URL.createObjectURL(file),
            mimeType: file.type,
            size: file.size,
          };

          const extractedText = uploadedAtt?.extractedText || data.extractedText || `Transcribed notes from ${file.name}`;

          const newFileItem: CombineFileItem = {
            id: `direct_upload_${Date.now()}_${i}`,
            name: file.name,
            subject: studySetSubject || 'General',
            topic: 'Uploaded Material',
            content: extractedText,
            attachments: [newAtt],
            size: file.size,
            uploadedAt: Date.now(),
            sourceType: 'uploaded',
          };

          setDirectUploadedFiles((prev) => [newFileItem, ...prev]);
          // Automatically select newly uploaded file
          setSelectedIds((prev) => new Set(prev).add(newFileItem.id));
        } catch (err: any) {
          setUploadError(`Failed to process ${file.name}: ${err.message}`);
        }
      } else {
        // Plain text reading
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            const newFileItem: CombineFileItem = {
              id: `direct_upload_${Date.now()}_${i}`,
              name: file.name,
              subject: studySetSubject || 'General',
              topic: 'Uploaded Material',
              content: content,
              size: file.size,
              uploadedAt: Date.now(),
              sourceType: 'uploaded',
            };
            setDirectUploadedFiles((prev) => [newFileItem, ...prev]);
            setSelectedIds((prev) => new Set(prev).add(newFileItem.id));
          }
        };
        reader.readAsText(file);
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Perform Combining Process
  const handleCombineSelected = async () => {
    const selectedFiles = allAvailableFiles.filter((f) => selectedIds.has(f.id));
    if (selectedFiles.length === 0) return;

    combineCancelledRef.current = false;
    setCombineNotice(null);
    setIsCombining(true);
    setCombineProgress(10);
    setCombineStatusText(`Extracting notes from ${selectedFiles.length} selected files...`);

    // Step 1: Progress simulation & text aggregation
    await new Promise((r) => setTimeout(r, 300));
    if (combineCancelledRef.current) return;
    setCombineProgress(35);
    setCombineStatusText('Deduplicating shared concepts and standardizing topics...');

    await new Promise((r) => setTimeout(r, 350));
    if (combineCancelledRef.current) return;
    setCombineProgress(65);
    setCombineStatusText('Compiling unified study sections, derivations & cross-topic notes...');

    // Build unified content with clean structural dividers
    const mergedSections = selectedFiles.map((file, idx) => {
      const header = `## Section ${idx + 1}: ${file.name} (${file.subject}${file.topic ? ` - ${file.topic}` : ''})`;
      return `${header}\n\n${file.content.trim()}`;
    });

    const unifiedContent = `# ${studySetName.trim() || 'Comprehensive Combined Study Set'}\n\n` +
      `> **Combined Study Set** created from ${selectedFiles.length} source documents: ${selectedFiles.map(f => f.name).join(', ')}.\n` +
      `> Compiled on ${new Date().toLocaleDateString()}.\n\n` +
      mergedSections.join('\n\n---\n\n');

    // Collect all attachments from selected files
    const unifiedAttachments: NoteAttachment[] = [];
    const seenUrls = new Set<string>();
    selectedFiles.forEach((file) => {
      if (file.attachments) {
        file.attachments.forEach((att) => {
          if (!seenUrls.has(att.url)) {
            seenUrls.add(att.url);
            unifiedAttachments.push(att);
          }
        });
      }
    });

    await new Promise((r) => setTimeout(r, 300));
    if (combineCancelledRef.current) return;
    setCombineProgress(90);
    setCombineStatusText('Finalizing combined master study set...');

    const newNoteId = `combined_${Date.now()}`;
    const newCombinedNote: StudyNote = {
      id: newNoteId,
      uid: user?.uid || 'guest',
      title: studySetName.trim() || `Combined Study Set (${selectedFiles.length} files)`,
      subject: studySetSubject || 'General',
      topic: studySetTopic.trim() || selectedFiles.map(f => f.topic || f.name).slice(0, 3).join(', '),
      content: unifiedContent,
      attachments: unifiedAttachments,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (combineCancelledRef.current) return;

    // Save to user storage (keeping all original files completely unchanged)
    if (user?.uid) {
      await saveUserNote(user.uid, newCombinedNote);
      onRefreshHistory();
    }

    setCombineProgress(100);
    await new Promise((r) => setTimeout(r, 150));
    if (combineCancelledRef.current) return;

    setIsCombining(false);
    setCombinedResult(newCombinedNote);
    setActiveResultTab('content');
  };

  // AI processing on the combined set
  const runAiOnCombined = async (action: 'summary' | 'flashcards' | 'practice' | 'questions', customCount?: number) => {
    if (!combinedResult || !combinedResult.content.trim()) return;

    setAiGenerating(action === 'questions' ? 'practice' : action);
    setAiError(null);
    setCombineNotice(null);

    const controller = new AbortController();
    aiAbortControllerRef.current = controller;

    try {
      const token = await getToken();
      const count = customCount || (action === 'flashcards' ? 12 : action === 'practice' || action === 'questions' ? 8 : 5);
      const response = await fetch('/api/process-notes', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          action: action === 'practice' || action === 'questions' ? 'questions' : action,
          notesContent: combinedResult.content,
          subject: combinedResult.subject || 'General',
          topic: combinedResult.topic || combinedResult.title,
          educationLevel: userProfile?.educationLevel || 'Secondary',
          count: count,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || `AI processing failed (${response.status})`);
      }

      const updatedNote = { ...combinedResult };

      if (action === 'summary') {
        updatedNote.summary = data.summary || 'Summary synthesized.';
        setActiveResultTab('summary');
      } else if (action === 'flashcards') {
        updatedNote.flashcards = data.flashcards || [];
        setActiveResultTab('flashcards');
      } else if (action === 'practice' || action === 'questions') {
        updatedNote.practiceQuestions = data.questions || [];
        setSelectedAnswers({});
        setRevealedAnswers({});
        setActiveResultTab('practice');
      }

      setCombinedResult(updatedNote);

      // Save updated outputs to user's notes history
      if (user?.uid) {
        await saveUserNote(user.uid, updatedNote);
        onRefreshHistory();
      }
    } catch (err: any) {
      if (err?.name === 'AbortError' || controller.signal.aborted) {
        setCombineNotice('AI generation stopped by user. Your combined study set is safely preserved.');
        return;
      }
      setAiError(err.message || 'AI processing encountered an error. Please try again.');
    } finally {
      aiAbortControllerRef.current = null;
      setAiGenerating(null);
    }
  };

  // Launch AI Tutor with the combined study set
  const handleLaunchAITutor = () => {
    if (!combinedResult) return;

    try {
      const prompt = `Hello AI Tutor! I have combined ${selectedIds.size || 2} study files into a master set titled "${combinedResult.title}" covering ${combinedResult.subject}.\n\n` +
        `Here is the combined material outline:\n${combinedResult.content.slice(0, 1500)}...\n\n` +
        `Can you quiz me, answer my conceptual questions, and guide me through the key takeaways?`;

      localStorage.setItem('zetadu_target_subject', combinedResult.subject || 'General');
      localStorage.setItem('zetadu_target_topic', combinedResult.title);
      localStorage.setItem('zetadu_tutor_prompt', prompt);
    } catch (_) {}

    navigate('/ai-tutor');
  };

  // Save generated flashcards to deck
  const handleSaveFlashcards = async () => {
    if (!user?.uid || !combinedResult?.flashcards || combinedResult.flashcards.length === 0) return;
    try {
      const res = await saveNoteFlashcardsToDeck(
        user.uid,
        combinedResult.title,
        combinedResult.subject || 'General',
        combinedResult.topic || 'Combined Study Notes',
        combinedResult.flashcards
      );
      if (res.count > 0) {
        setDeckSaveSuccess(true);
        setTimeout(() => setDeckSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.warn('Flashcard deck save error:', e);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white border border-indigo-800/60 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide">
            <Layers size={14} className="text-indigo-400" />
            <span>FLEXIBLE MULTI-FILE COMBINER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Combine Notes & Study Files
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Select any number of uploaded files, handouts, or notes to merge them into one comprehensive master study set.
            Original files remain completely unchanged. Work with AI Tutor, generate exam practice, flashcard decks, and summaries.
          </p>
        </div>

        {/* Decorative Background Blob */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      </div>

      {/* COMBINING IN PROGRESS OVERLAY */}
      {isCombining && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-indigo-500 shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Loader2 size={24} className="animate-spin text-indigo-600 shrink-0" />
              <div className="min-w-0">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Creating Combined Study Set...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {combineStatusText}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {combineProgress}%
              </span>
              <button
                type="button"
                onClick={handleStopCombining}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shrink-0"
                title="Stop combining and preserve source files"
              >
                <Square size={13} className="fill-current" />
                <span>Stop / Cancel</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${combineProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* COMBINE NOTICE BANNER */}
      {combineNotice && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{combineNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setCombineNotice(null)}
            className="p-1 rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 cursor-pointer shrink-0"
            title="Dismiss notice"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      )}

      {/* SUCCESSFUL COMBINED RESULT VIEW */}
      {combinedResult && !isCombining && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-emerald-500/80 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/80 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
                <CheckCircle2 size={14} />
                <span>Combined Study Set Created Successfully</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {combinedResult.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Subject: <span className="font-bold text-slate-700 dark:text-slate-200">{combinedResult.subject}</span> &bull; {selectedIds.size} files combined &bull; Saved to your notes
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => onOpenInEditor(combinedResult)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText size={15} />
                <span>Open in Notes Editor</span>
              </button>

              <button
                type="button"
                onClick={() => setCombinedResult(null)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Combine Other Files
              </button>
            </div>
          </div>

          {/* AI Action Buttons for the Combined Set */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              type="button"
              id="combined-ai-tutor-btn"
              onClick={handleLaunchAITutor}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all flex flex-col items-start gap-1 cursor-pointer group text-left"
            >
              <div className="p-2 rounded-xl bg-white/20 text-white">
                <BrainCircuit size={18} />
              </div>
              <span className="font-extrabold text-xs sm:text-sm mt-1">Study AI Tutor</span>
              <span className="text-[11px] text-blue-100 leading-tight">Interactive chat</span>
            </button>

            <button
              type="button"
              id="combined-practice-btn"
              onClick={() => runAiOnCombined('practice')}
              disabled={aiGenerating !== null}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-rose-400 text-slate-800 dark:text-white transition-all flex flex-col items-start gap-1 cursor-pointer group text-left shadow-2xs"
            >
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600">
                <PenTool size={18} />
              </div>
              <span className="font-extrabold text-xs sm:text-sm mt-1">
                {aiGenerating === 'practice' ? 'Drafting...' : 'Practice Quiz'}
              </span>
              <span className="text-[11px] text-slate-400 leading-tight">Exam practice test</span>
            </button>

            <button
              type="button"
              id="combined-questions-btn"
              onClick={() => runAiOnCombined('questions', 10)}
              disabled={aiGenerating !== null}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-800 dark:text-white transition-all flex flex-col items-start gap-1 cursor-pointer group text-left shadow-2xs"
            >
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                <CheckCircle2 size={18} />
              </div>
              <span className="font-extrabold text-xs sm:text-sm mt-1">
                {aiGenerating === 'practice' ? 'Generating...' : 'Questions (10)'}
              </span>
              <span className="text-[11px] text-slate-400 leading-tight">Question generator</span>
            </button>

            <button
              type="button"
              id="combined-flashcards-btn"
              onClick={() => runAiOnCombined('flashcards')}
              disabled={aiGenerating !== null}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-white transition-all flex flex-col items-start gap-1 cursor-pointer group text-left shadow-2xs"
            >
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
                <Layers size={18} />
              </div>
              <span className="font-extrabold text-xs sm:text-sm mt-1">
                {aiGenerating === 'flashcards' ? 'Generating...' : 'Flashcards'}
              </span>
              <span className="text-[11px] text-slate-400 leading-tight">Active recall drills</span>
            </button>

            <button
              type="button"
              id="combined-summary-btn"
              onClick={() => runAiOnCombined('summary')}
              disabled={aiGenerating !== null}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-800 dark:text-white transition-all flex flex-col items-start gap-1 cursor-pointer group text-left shadow-2xs col-span-2 sm:col-span-1"
            >
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
                <Sparkles size={18} />
              </div>
              <span className="font-extrabold text-xs sm:text-sm mt-1">
                {aiGenerating === 'summary' ? 'Synthesizing...' : 'Key Summary'}
              </span>
              <span className="text-[11px] text-slate-400 leading-tight">High-yield takeaways</span>
            </button>
          </div>

          {/* AI In-Progress Bar with Stop Button */}
          {aiGenerating && (
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-2.5 min-w-0">
                <Loader2 size={18} className="animate-spin text-indigo-600 shrink-0" />
                <span className="truncate">
                  {aiGenerating === 'summary' && 'Synthesizing master summary from combined study set...'}
                  {aiGenerating === 'flashcards' && 'Drafting active recall flashcards from combined set...'}
                  {aiGenerating === 'practice' && 'Drafting exam practice questions from combined set...'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleStopAiGenerating}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="Stop AI generation and preserve study set"
              >
                <Square size={12} className="fill-current" />
                <span>Stop / Cancel</span>
              </button>
            </div>
          )}

          {/* AI Status or Error */}
          {aiError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{aiError}</span>
            </div>
          )}

          {deckSaveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 size={15} />
              <span>Flashcard deck saved to your LearnDean Flashcards library!</span>
            </div>
          )}

          {/* Sub-Tabs for Result Outputs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveResultTab('content')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeResultTab === 'content'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Combined Notes Text
            </button>

            {combinedResult.summary && (
              <button
                type="button"
                onClick={() => setActiveResultTab('summary')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeResultTab === 'summary'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                Summary
              </button>
            )}

            {combinedResult.flashcards && combinedResult.flashcards.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveResultTab('flashcards')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeResultTab === 'flashcards'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                Flashcards ({combinedResult.flashcards.length})
              </button>
            )}

            {combinedResult.practiceQuestions && combinedResult.practiceQuestions.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveResultTab('practice')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeResultTab === 'practice'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                Practice Questions ({combinedResult.practiceQuestions.length})
              </button>
            )}
          </div>

          {/* Result Tab: Combined Content */}
          {activeResultTab === 'content' && (
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-text">
              {combinedResult.content}
            </div>
          )}

          {/* Result Tab: Summary */}
          {activeResultTab === 'summary' && combinedResult.summary && (
            <div className="bg-amber-50/50 dark:bg-amber-950/20 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-slate-800 dark:text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
              {combinedResult.summary}
            </div>
          )}

          {/* Result Tab: Flashcards */}
          {activeResultTab === 'flashcards' && combinedResult.flashcards && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {combinedResult.flashcards.length} Cards Generated from Combined Files
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveFlashcards}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Save Deck to Library
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/flashcards')}
                    className="px-3.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Open Flashcards
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {combinedResult.flashcards.map((card, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/80 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      <span>Card {i + 1}</span>
                      <span className="uppercase">{combinedResult.subject}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      Q: {card.front}
                    </p>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Answer: </span>
                      {card.back}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Result Tab: Practice Questions */}
          {activeResultTab === 'practice' && combinedResult.practiceQuestions && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {combinedResult.practiceQuestions.length} Questions Compiled Across Selected Files
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        localStorage.setItem('zetadu_target_subject', combinedResult.subject || 'General');
                        localStorage.setItem('zetadu_target_topic', combinedResult.title);
                      } catch (_) {}
                      navigate('/practice');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <BookOpen size={14} />
                    <span>Full Practice Mode</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {combinedResult.practiceQuestions.map((q, qIdx) => {
                  const userAns = selectedAnswers[qIdx];
                  const isRevealed = revealedAnswers[qIdx];
                  return (
                    <div
                      key={qIdx}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/80 shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {qIdx + 1}. {q.question}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAns === oIdx;
                          const isCorrect = oIdx === q.correctAnswer;
                          let btnStyle = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200';

                          if (isRevealed) {
                            if (isCorrect) {
                              btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold';
                            } else if (isSelected) {
                              btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold';
                            }
                          } else if (isSelected) {
                            btnStyle = 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold';
                          }

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                              className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${btnStyle}`}
                            >
                              <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {!isRevealed ? (
                        <button
                          type="button"
                          onClick={() => setRevealedAnswers(prev => ({ ...prev, [qIdx]: true }))}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Check Answer & Explanation
                        </button>
                      ) : (
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                          <span className="font-bold text-slate-900 dark:text-white block">Explanation:</span>
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* COMBINE SETUP & FILE SELECTION CARD */}
      <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
        {/* Name the Combined Study Set */}
        <div className="space-y-3 border-b border-slate-100 dark:border-slate-700/80 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Name Your Combined Study Set
              </label>
              <p className="text-xs text-slate-400">
                Give your unified master notes a recognizable name for study sessions.
              </p>
            </div>

            {/* Selected Files Count Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold self-start sm:self-auto">
              <CheckSquare size={15} />
              <span>{selectedIds.size} {selectedIds.size === 1 ? 'file' : 'files'} selected</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                id="combined-title-input"
                value={studySetName}
                onChange={(e) => setStudySetName(e.target.value)}
                placeholder="e.g. WAEC Comprehensive Physics Mechanics Review, Bio Unit 1+2 Master..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <input
                type="text"
                id="combined-subject-input"
                value={studySetSubject}
                onChange={(e) => setStudySetSubject(e.target.value)}
                placeholder="Subject (e.g. Physics)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH, FILTER, SELECT ALL, CLEAR ALL, UPLOAD MORE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            {/* Search Files */}
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search study files & notes..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Subject Filter */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              {availableSubjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* SELECT ALL BUTTON */}
            <button
              type="button"
              id="combine-select-all-btn"
              onClick={handleSelectAll}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Select all listed files"
            >
              <CheckSquare size={14} />
              <span>Select All</span>
            </button>

            {/* CLEAR ALL BUTTON */}
            <button
              type="button"
              id="combine-clear-all-btn"
              onClick={handleClearAll}
              disabled={selectedIds.size === 0}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                selectedIds.size === 0
                  ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 cursor-pointer'
              }`}
              title="Clear selection"
            >
              <Square size={14} />
              <span>Clear All</span>
            </button>

            {/* Direct Upload More Files */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add More Files</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.txt,.md,.jpg,.jpeg,.png,application/pdf,text/plain,text/markdown,image/jpeg,image/png"
              onChange={handleDirectFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {uploadError && (
          <p className="text-xs text-rose-500 flex items-center gap-1.5">
            <AlertCircle size={14} />
            <span>{uploadError}</span>
          </p>
        )}

        {/* FILES LIST WITH CHECKBOXES */}
        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {filteredFiles.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
              <FileText size={28} className="mx-auto text-slate-400" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No matching study files found</p>
              <p className="text-xs text-slate-400">Click &ldquo;Add More Files&rdquo; above to upload documents or notes to combine.</p>
            </div>
          ) : (
            filteredFiles.map((file) => {
              const isSelected = selectedIds.has(file.id);

              return (
                <div
                  key={file.id}
                  onClick={() => handleToggleSelect(file.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 group select-none ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-2xs'
                      : 'border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* CHECKBOX */}
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs scale-105'
                          : 'border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-transparent group-hover:border-indigo-400'
                      }`}
                    >
                      <Check size={14} strokeWidth={3} />
                    </div>

                    {/* File Icon */}
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                      <FileText size={18} />
                    </div>

                    {/* File Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold truncate ${isSelected ? 'text-indigo-950 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                          {file.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {file.subject}
                        </span>
                        {file.topic && (
                          <span className="text-[11px] text-slate-400 truncate hidden sm:inline">
                            &bull; {file.topic}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {file.content.slice(0, 100).replace(/\n/g, ' ')}...
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-slate-400 block font-medium">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                      {isSelected ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* COMBINE ACTION BOTTOM BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {selectedIds.size === 0 ? (
              <span>Select 1 or more files above to enable combining.</span>
            ) : (
              <span>
                Ready to combine <strong className="text-slate-800 dark:text-white">{selectedIds.size} files</strong> into &ldquo;{studySetName || 'New Study Set'}&rdquo;.
              </span>
            )}
          </div>

          <button
            type="button"
            id="execute-combine-btn"
            onClick={handleCombineSelected}
            disabled={selectedIds.size === 0 || isCombining}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              selectedIds.size === 0 || isCombining
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <Layers size={18} />
            <span>Combine {selectedIds.size > 0 ? `${selectedIds.size} Files` : 'Selected Files'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
