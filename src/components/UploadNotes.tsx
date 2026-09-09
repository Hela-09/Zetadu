import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import {
  Upload, FileText, Sparkles, BrainCircuit, Layers, PenTool, CheckCircle2,
  XCircle, ArrowLeft, Copy, Check, Volume2, VolumeX, RotateCcw, Trash2,
  Save, BookOpen, ChevronLeft, ChevronRight, AlertCircle, Loader2,
  ExternalLink, File, Image as ImageIcon, Plus, Clock, Bookmark
} from 'lucide-react';
import { ViewType, StudyNote, NoteFlashcard, NotePracticeQuestion, NoteAttachment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getUserNotes, saveUserNote, deleteUserNote, saveNoteFlashcardsToDeck, SAMPLE_NOTES } from '../utils/notesService';

interface UploadNotesProps {
  setView: (view: ViewType) => void;
}

type ProcessingAction = 'summarize' | 'explain' | 'flashcards' | 'questions';

const SUBJECT_OPTIONS = [
  'General', 'Mathematics', 'English Language', 'Physics', 'Chemistry',
  'Biology', 'Economics', 'Government', 'Literature in English',
  'Financial Accounting', 'Civic Education', 'Computer Studies',
  'Agricultural Science', 'Geography', 'Commerce'
];

export default function UploadNotes({ setView }: UploadNotesProps) {
  const { user, getToken, userProfile } = useAuth();

  // Core note input state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('General');
  const [noteTopic, setNoteTopic] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [attachments, setAttachments] = useState<NoteAttachment[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

  // File upload state
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Processing & Results state
  const [activeTab, setActiveTab] = useState<'editor' | 'summary' | 'explain' | 'flashcards' | 'questions' | 'history'>('editor');
  const [processingAction, setProcessingAction] = useState<ProcessingAction | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [aiError, setAiError] = useState<string | null>(null);

  // Processed outputs
  const [summaryText, setSummaryText] = useState<string>('');
  const [explanationText, setExplanationText] = useState<string>('');
  const [generatedFlashcards, setGeneratedFlashcards] = useState<NoteFlashcard[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<NotePracticeQuestion[]>([]);

  // Flashcards study mode state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isSavingDeck, setIsSavingDeck] = useState(false);
  const [deckSaveSuccess, setDeckSaveSuccess] = useState(false);

  // Practice quiz mode state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});

  // Saved Notes history
  const [savedNotes, setSavedNotes] = useState<StudyNote[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [saveNoteSuccess, setSaveNoteSuccess] = useState(false);

  // Audio speech synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Load saved notes on mount
  useEffect(() => {
    if (user?.uid) {
      loadHistory();
    }
  }, [user?.uid]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const loadHistory = async () => {
    if (!user?.uid) return;
    setLoadingNotes(true);
    try {
      const notes = await getUserNotes(user.uid);
      setSavedNotes(notes);
    } catch (e) {
      console.warn("Failed to load notes history:", e);
    } finally {
      setLoadingNotes(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    setUploadError(null);
    for (const file of files) {
      // If it's a plain text or markdown file, read text directly into editor
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            setNoteContent((prev) => (prev ? `${prev}\n\n${content}` : content));
            if (!noteTitle) {
              setNoteTitle(file.name.replace(/\.[^/.]+$/, ''));
            }
          }
        };
        reader.readAsText(file);
      } else if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        // Upload image or PDF to server
        setIsUploadingFile(true);
        try {
          const token = await getToken();
          const formData = new FormData();
          formData.append('files', file);

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: formData
          });

          if (!uploadRes.ok) {
            throw new Error(`Upload failed (${uploadRes.status})`);
          }

          const data = await uploadRes.json();
          if (data.attachments && data.attachments.length > 0) {
            const uploadedAtt = data.attachments[0];
            setAttachments((prev) => [...prev, {
              name: file.name,
              url: uploadedAtt.url,
              mimeType: uploadedAtt.mimeType || file.type,
              fileUri: uploadedAtt.fileUri,
              size: file.size
            }]);
            if (!noteTitle) {
              setNoteTitle(file.name.replace(/\.[^/.]+$/, ''));
            }
          }
        } catch (err: any) {
          console.error("File upload error:", err);
          setUploadError(`Failed to upload ${file.name}: ${err.message || 'Network error'}`);
        } finally {
          setIsUploadingFile(false);
        }
      } else {
        // Fallback for other file types: try text reading
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            setNoteContent((prev) => (prev ? `${prev}\n\n${content}` : content));
          }
        };
        reader.readAsText(file);
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const loadSampleNote = (sample: typeof SAMPLE_NOTES[0]) => {
    setNoteTitle(sample.title);
    setNoteSubject(sample.subject);
    setNoteTopic(sample.topic);
    setNoteContent(sample.content);
    setAttachments([]);
    setCurrentNoteId(null);
  };

  // AI Processing function
  const runAiProcessing = async (action: ProcessingAction) => {
    if (!noteContent.trim() && attachments.length === 0) {
      setAiError('Please enter notes or upload a file first.');
      return;
    }

    setAiError(null);
    setProcessingAction(action);

    if (action === 'summarize') setProcessingStatus('Synthesizing high-yield summary & key takeaways...');
    else if (action === 'explain') setProcessingStatus('Deconstructing concepts into step-by-step intuition...');
    else if (action === 'flashcards') setProcessingStatus('Generating active recall study flashcards...');
    else if (action === 'questions') setProcessingStatus('Drafting exam-standard practice questions...');

    try {
      const token = await getToken();
      const response = await fetch('/api/process-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          action,
          text: noteContent,
          attachments: attachments.map(a => ({
            name: a.name,
            url: a.url,
            mimeType: a.mimeType,
            fileUri: a.fileUri
          })),
          subject: noteSubject,
          topic: noteTopic || noteTitle,
          educationLevel: userProfile?.educationLevel || 'Secondary',
          count: action === 'flashcards' ? 8 : 5
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Processing failed with status ${response.status}`);
      }

      const result = await response.json();

      if (action === 'summarize') {
        setSummaryText(result.summary || 'Summary generated.');
        setActiveTab('summary');
      } else if (action === 'explain') {
        setExplanationText(result.explanation || 'Explanation generated.');
        setActiveTab('explain');
      } else if (action === 'flashcards') {
        if (result.flashcards && result.flashcards.length > 0) {
          setGeneratedFlashcards(result.flashcards);
          setCurrentCardIndex(0);
          setIsCardFlipped(false);
          setActiveTab('flashcards');
        } else {
          throw new Error('No flashcards were generated. Please try again.');
        }
      } else if (action === 'questions') {
        if (result.questions && result.questions.length > 0) {
          setGeneratedQuestions(result.questions);
          setSelectedAnswers({});
          setSubmittedQuestions({});
          setActiveTab('questions');
        } else {
          throw new Error('No questions were generated. Please try again.');
        }
      }

      // Auto-save the note with its processed outputs to history
      if (user?.uid) {
        handleSaveCurrentNote({
          summary: action === 'summarize' ? result.summary : summaryText,
          explanation: action === 'explain' ? result.explanation : explanationText,
          flashcards: action === 'flashcards' ? result.flashcards : generatedFlashcards,
          practiceQuestions: action === 'questions' ? result.questions : generatedQuestions
        });
      }
    } catch (err: any) {
      console.error(`AI processing error for ${action}:`, err);
      setAiError(err.message || 'Failed to process notes with AI. Please try again.');
    } finally {
      setProcessingAction(null);
      setProcessingStatus('');
    }
  };

  // Save current note to user storage
  const handleSaveCurrentNote = async (overrides?: Partial<StudyNote>) => {
    if (!user?.uid) return;
    setIsSavingNote(true);
    try {
      const id = currentNoteId || `note_${Date.now()}`;
      const now = Date.now();
      const noteToSave: StudyNote = {
        id,
        uid: user.uid,
        title: noteTitle.trim() || `${noteSubject} Notes - ${new Date().toLocaleDateString()}`,
        subject: noteSubject,
        topic: noteTopic.trim(),
        content: noteContent,
        attachments,
        createdAt: now,
        updatedAt: now,
        summary: overrides?.summary !== undefined ? overrides.summary : summaryText,
        explanation: overrides?.explanation !== undefined ? overrides.explanation : explanationText,
        flashcards: overrides?.flashcards !== undefined ? overrides.flashcards : generatedFlashcards,
        practiceQuestions: overrides?.practiceQuestions !== undefined ? overrides.practiceQuestions : generatedQuestions
      };

      await saveUserNote(user.uid, noteToSave);
      setCurrentNoteId(id);
      setSaveNoteSuccess(true);
      loadHistory();
      setTimeout(() => setSaveNoteSuccess(false), 2500);
    } catch (e) {
      console.warn("Error saving note:", e);
    } finally {
      setIsSavingNote(false);
    }
  };

  // Load an existing note from history
  const handleSelectNoteFromHistory = (note: StudyNote) => {
    setCurrentNoteId(note.id);
    setNoteTitle(note.title);
    setNoteSubject(note.subject || 'General');
    setNoteTopic(note.topic || '');
    setNoteContent(note.content || '');
    setAttachments(note.attachments || []);
    setSummaryText(note.summary || '');
    setExplanationText(note.explanation || '');
    setGeneratedFlashcards(note.flashcards || []);
    setGeneratedQuestions(note.practiceQuestions || []);
    setSelectedAnswers({});
    setSubmittedQuestions({});
    setActiveTab('editor');
  };

  // Delete note from history
  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.uid) return;
    if (confirm("Are you sure you want to delete this saved note?")) {
      await deleteUserNote(user.uid, noteId);
      if (currentNoteId === noteId) {
        setCurrentNoteId(null);
      }
      loadHistory();
    }
  };

  // Save generated flashcards directly to student's decks
  const handleSaveFlashcardsToDecks = async () => {
    if (!user?.uid || generatedFlashcards.length === 0) return;
    setIsSavingDeck(true);
    try {
      const deckName = noteTitle.trim() || `${noteSubject} Notes Deck`;
      const result = await saveNoteFlashcardsToDeck(
        user.uid,
        deckName,
        noteSubject,
        noteTopic || noteTitle,
        generatedFlashcards
      );
      if (result.count > 0) {
        setDeckSaveSuccess(true);
        setTimeout(() => setDeckSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.warn("Deck save error:", e);
    } finally {
      setIsSavingDeck(false);
    }
  };

  // Speech synthesis toggle
  const toggleSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const plainText = text.replace(/[#*`_~[\]()]/g, '');
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Copy text to clipboard
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Quiz submission & scoring
  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    if (submittedQuestions[qIndex]) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
    setSubmittedQuestions(prev => ({ ...prev, [qIndex]: true }));
  };

  const calculatedScore = generatedQuestions.reduce((score, q, idx) => {
    return selectedAnswers[idx] === q.correctAnswer ? score + 1 : score;
  }, 0);

  const answeredCount = Object.keys(submittedQuestions).length;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 pb-16 px-2 sm:px-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <button
            id="back-to-home-btn"
            onClick={() => setView('home')}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-sm cursor-pointer"
            title="Return to Home"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Upload Notes
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                AI Powered
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Upload or paste your notes to generate summaries, deep explanations, flashcards, and exam questions.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 self-start sm:self-auto max-w-full no-scrollbar">
          <button
            id="tab-editor-btn"
            onClick={() => setActiveTab('editor')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'editor'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <FileText size={15} />
            <span>Notes Editor</span>
          </button>

          {summaryText && (
            <button
              id="tab-summary-btn"
              onClick={() => setActiveTab('summary')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'summary'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Sparkles size={15} className="text-amber-500" />
              <span>Summary</span>
            </button>
          )}

          {explanationText && (
            <button
              id="tab-explain-btn"
              onClick={() => setActiveTab('explain')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'explain'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <BrainCircuit size={15} className="text-emerald-500" />
              <span>Explain</span>
            </button>
          )}

          {generatedFlashcards.length > 0 && (
            <button
              id="tab-flashcards-btn"
              onClick={() => setActiveTab('flashcards')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'flashcards'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Layers size={15} className="text-indigo-500" />
              <span>Flashcards ({generatedFlashcards.length})</span>
            </button>
          )}

          {generatedQuestions.length > 0 && (
            <button
              id="tab-questions-btn"
              onClick={() => setActiveTab('questions')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === 'questions'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <PenTool size={15} className="text-rose-500" />
              <span>Quiz ({generatedQuestions.length})</span>
            </button>
          )}

          <button
            id="tab-history-btn"
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Bookmark size={15} />
            <span>My Notes ({savedNotes.length})</span>
          </button>
        </div>
      </div>

      {/* AI Processing Banner Overlay */}
      {processingAction && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Loader2 size={24} className="animate-spin shrink-0 text-blue-200" />
            <div>
              <p className="font-bold text-sm sm:text-base">{processingStatus}</p>
              <p className="text-xs text-blue-100">Gemini AI is reading and extracting insights from your study notes...</p>
            </div>
          </div>
          <span className="text-xs font-mono uppercase bg-white/20 px-3 py-1 rounded-full shrink-0">
            {processingAction}
          </span>
        </div>
      )}

      {/* AI Error Alert */}
      {aiError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0 text-rose-600" />
            <span>{aiError}</span>
          </div>
          <button
            onClick={() => setAiError(null)}
            className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 cursor-pointer"
          >
            <XCircle size={16} />
          </button>
        </div>
      )}

      {/* MAIN VIEW CONTENTS */}

      {/* 1. NOTES EDITOR & UPLOAD TAB */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Upload & Content Input */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-5 sm:p-7 shadow-sm flex flex-col gap-5">
              {/* Note Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Note Title
                  </label>
                  <input
                    type="text"
                    id="note-title-input"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="e.g. Newton's Laws of Motion, Cellular Respiration..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Subject
                  </label>
                  <select
                    id="note-subject-select"
                    value={noteSubject}
                    onChange={(e) => setNoteSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    {SUBJECT_OPTIONS.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Upload Study Notes or Documents
                  </label>
                  <span className="text-[11px] text-slate-400">PDF, TXT, MD, Images (JPG, PNG)</span>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40'
                      : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50/70 dark:hover:bg-slate-900/30'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".txt,.md,.pdf,image/png,image/jpeg,image/webp,image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {isUploadingFile ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <Upload size={24} />
                    )}
                  </div>

                  <p className="font-bold text-sm text-slate-800 dark:text-white">
                    {isUploadingFile ? 'Uploading file...' : 'Drop notes here or click to browse'}
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Upload handwritten notes photos, scanned textbook pages, typed PDFs, or lecture notes.
                  </p>
                </div>

                {uploadError && (
                  <p className="text-xs text-rose-500 mt-2 flex items-center gap-1">
                    <AlertCircle size={14} /> {uploadError}
                  </p>
                )}
              </div>

              {/* Uploaded File Attachments Badges */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {attachments.map((att, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-200"
                    >
                      {att.mimeType?.startsWith('image/') ? (
                        <ImageIcon size={14} className="text-blue-500" />
                      ) : (
                        <File size={14} className="text-blue-500" />
                      )}
                      <span className="font-medium truncate max-w-[160px]">{att.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAttachment(index);
                        }}
                        className="text-slate-400 hover:text-rose-500 transition-colors ml-1"
                        title="Remove file"
                      >
                        <XCircle size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Text Notes Input Area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Or Paste / Type Notes Directly
                  </label>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{noteContent.split(/\s+/).filter(Boolean).length} words</span>
                    <span>•</span>
                    <span>{noteContent.length} characters</span>
                    {noteContent && (
                      <button
                        onClick={() => setNoteContent('')}
                        className="text-rose-500 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  id="note-content-textarea"
                  rows={11}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Paste lecture transcript, class notes, key definitions, formulas, or textbook sections here..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed resize-y"
                />
              </div>

              {/* Sample Notes Quick Loader */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <span className="text-xs text-slate-400 font-medium">Need a test note?</span>
                {SAMPLE_NOTES.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadSampleNote(sample)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
                  >
                    + {sample.subject}
                  </button>
                ))}
              </div>

              {/* Save Note Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  {currentNoteId ? 'Editing existing note' : 'New study note draft'}
                </span>
                <button
                  id="save-note-btn"
                  onClick={() => handleSaveCurrentNote()}
                  disabled={isSavingNote || (!noteContent.trim() && attachments.length === 0)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    saveNoteSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white'
                  }`}
                >
                  {saveNoteSuccess ? (
                    <>
                      <Check size={14} /> Saved to My Notes
                    </>
                  ) : isSavingNote ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} /> Save Note
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: The 4 AI Processing Options */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                  AI Study Studio
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Choose what Gemini AI should build from your uploaded study notes:
                </p>
              </div>

              {/* Option 1: Summarize */}
              <button
                id="ai-summarize-btn"
                onClick={() => runAiProcessing('summarize')}
                disabled={processingAction !== null || (!noteContent.trim() && attachments.length === 0)}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700/80 hover:border-blue-500 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Sparkles size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Summarize</h4>
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                        Run →
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      High-yield executive summary, core takeaways, and vital formulas.
                    </p>
                  </div>
                </div>
              </button>

              {/* Option 2: Explain */}
              <button
                id="ai-explain-btn"
                onClick={() => runAiProcessing('explain')}
                disabled={processingAction !== null || (!noteContent.trim() && attachments.length === 0)}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <BrainCircuit size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Explain</h4>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                        Run →
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Pedagogical breakdown, step-by-step intuition, analogies, and traps.
                    </p>
                  </div>
                </div>
              </button>

              {/* Option 3: Create Flashcards */}
              <button
                id="ai-flashcards-btn"
                onClick={() => runAiProcessing('flashcards')}
                disabled={processingAction !== null || (!noteContent.trim() && attachments.length === 0)}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700/80 hover:border-indigo-500 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-all group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Layers size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Create Flashcards</h4>
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                        Run →
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Active-recall study cards with questions, answers, and deck export.
                    </p>
                  </div>
                </div>
              </button>

              {/* Option 4: Generate Practice Questions */}
              <button
                id="ai-questions-btn"
                onClick={() => runAiProcessing('questions')}
                disabled={processingAction !== null || (!noteContent.trim() && attachments.length === 0)}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700/80 hover:border-rose-500 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition-all group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <PenTool size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Practice Questions</h4>
                      <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 group-hover:translate-x-0.5 transition-transform">
                        Run →
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Exam-grade multiple choice questions with instant grading and reasoning.
                    </p>
                  </div>
                </div>
              </button>

              <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 mt-2">
                <Sparkles size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Tip: You can generate all 4 options sequentially. Your results remain available in the tabs above!
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUMMARY VIEW TAB */}
      {activeTab === 'summary' && (
        <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-amber-500" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Executive Note Summary
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {noteTitle || 'Study Notes'} • {noteSubject}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSpeech(summaryText)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Read aloud"
              >
                {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
                <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
              </button>

              <button
                onClick={() => handleCopy(summaryText, 'summary')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Copy summary"
              >
                {copiedType === 'summary' ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                <span>{copiedType === 'summary' ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => runAiProcessing('summarize')}
                disabled={processingAction !== null}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
            <ReactMarkdown>{summaryText}</ReactMarkdown>
          </div>

          {/* Bottom Next Action Navigation */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setActiveTab('editor')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
            >
              ← Back to Notes Editor
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => runAiProcessing('explain')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <BrainCircuit size={14} /> Explain Concepts
              </button>
              <button
                onClick={() => runAiProcessing('flashcards')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Layers size={14} /> Create Flashcards
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. EXPLAIN VIEW TAB */}
      {activeTab === 'explain' && (
        <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <div className="flex items-center gap-2">
                <BrainCircuit size={20} className="text-emerald-500" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Pedagogical Concept Breakdown
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {noteTitle || 'Study Notes'} • {noteSubject}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSpeech(explanationText)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
                <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
              </button>

              <button
                onClick={() => handleCopy(explanationText, 'explain')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedType === 'explain' ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                <span>{copiedType === 'explain' ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => {
                  localStorage.setItem('zetadu_target_subject', noteSubject);
                  localStorage.setItem('zetadu_target_topic', noteTopic || noteTitle);
                  localStorage.setItem('zetadu_tutor_prompt', `Hello! I just uploaded notes on "${noteTitle || noteTopic}". Can you answer follow-up questions and test my understanding of these concepts?`);
                  setView('tutor');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Ask AI Tutor</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
            <ReactMarkdown>{explanationText}</ReactMarkdown>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('editor')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
            >
              ← Back to Notes Editor
            </button>
            <button
              onClick={() => runAiProcessing('questions')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PenTool size={14} /> Test with Practice Quiz →
            </button>
          </div>
        </div>
      )}

      {/* 4. FLASHCARDS VIEW TAB */}
      {activeTab === 'flashcards' && generatedFlashcards.length > 0 && (
        <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <div className="flex items-center gap-2">
                <Layers size={20} className="text-indigo-500" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Interactive Study Flashcards
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Generated from your notes • Card {currentCardIndex + 1} of {generatedFlashcards.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="save-deck-btn"
                onClick={handleSaveFlashcardsToDecks}
                disabled={isSavingDeck}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  deckSaveSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {deckSaveSuccess ? (
                  <>
                    <Check size={14} /> Saved to Flashcard Decks!
                  </>
                ) : isSavingDeck ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} /> Save to My Decks
                  </>
                )}
              </button>

              <button
                onClick={() => setView('flashcards')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen size={14} /> Open All Decks
              </button>
            </div>
          </div>

          {/* Interactive Flip Flashcard Box */}
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4 py-4">
            <div
              onClick={() => setIsCardFlipped(!isCardFlipped)}
              className="w-full min-h-[300px] sm:min-h-[340px] p-8 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-lg cursor-pointer flex flex-col justify-between transition-all hover:scale-[1.01] relative group select-none"
            >
              <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                <span>{isCardFlipped ? 'Answer & Explanation' : 'Question / Concept'}</span>
                <span className="text-slate-400 font-normal normal-case">Click to flip ↷</span>
              </div>

              <div className="my-auto py-4 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCardIndex + (isCardFlipped ? '-back' : '-front')}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {!isCardFlipped ? (
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                        {generatedFlashcards[currentCardIndex]?.front}
                      </p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <p className="text-lg sm:text-xl font-bold text-indigo-900 dark:text-indigo-200 leading-snug">
                          {generatedFlashcards[currentCardIndex]?.back}
                        </p>
                        {generatedFlashcards[currentCardIndex]?.explanation && (
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic pt-2 border-t border-indigo-100 dark:border-indigo-900/50">
                            {generatedFlashcards[currentCardIndex]?.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Card {currentCardIndex + 1} of {generatedFlashcards.length}</span>
                <span className="text-[11px] font-medium text-slate-500">
                  {isCardFlipped ? 'Click to show question' : 'Click to reveal answer'}
                </span>
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center gap-4">
              <button
                id="prev-card-btn"
                onClick={() => {
                  if (currentCardIndex > 0) {
                    setIsCardFlipped(false);
                    setCurrentCardIndex(prev => prev - 1);
                  }
                }}
                disabled={currentCardIndex === 0}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                title="Previous card"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                {isCardFlipped ? 'Show Question' : 'Reveal Answer'}
              </button>

              <button
                id="next-card-btn"
                onClick={() => {
                  if (currentCardIndex < generatedFlashcards.length - 1) {
                    setIsCardFlipped(false);
                    setCurrentCardIndex(prev => prev + 1);
                  }
                }}
                disabled={currentCardIndex === generatedFlashcards.length - 1}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                title="Next card"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. PRACTICE QUESTIONS QUIZ TAB */}
      {activeTab === 'questions' && generatedQuestions.length > 0 && (
        <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <div className="flex items-center gap-2">
                <PenTool size={20} className="text-rose-500" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Notes Practice Quiz
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {generatedQuestions.length} exam-style questions testing your comprehension
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
                Score: <span className="text-blue-600 dark:text-blue-400">{calculatedScore}</span> / {answeredCount}
              </div>

              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setSubmittedQuestions({});
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={14} /> Reset
              </button>

              <button
                onClick={() => {
                  localStorage.setItem('zetadu_target_subject', noteSubject);
                  localStorage.setItem('zetadu_target_topic', noteTopic || noteTitle);
                  setView('practice');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <BookOpen size={14} /> Full Practice Mode
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div className="flex flex-col gap-6">
            {generatedQuestions.map((q, qIndex) => {
              const isSubmitted = submittedQuestions[qIndex];
              const selectedOpt = selectedAnswers[qIndex];
              const isCorrect = selectedOpt === q.correctAnswer;

              return (
                <div
                  key={qIndex}
                  className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {qIndex + 1}
                      </span>
                      <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                        {q.question}
                      </p>
                    </div>

                    {isSubmitted && (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                      }`}>
                        {isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    )}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = selectedOpt === optIndex;
                      const isCorrectOption = optIndex === q.correctAnswer;

                      let optStyles = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-800 dark:text-slate-200';
                      if (isSubmitted) {
                        if (isCorrectOption) {
                          optStyles = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                        } else if (isSelected && !isCorrect) {
                          optStyles = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200';
                        } else {
                          optStyles = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60 text-slate-500';
                        }
                      } else if (isSelected) {
                        optStyles = 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 text-blue-900 dark:text-blue-100 font-bold';
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleSelectAnswer(qIndex, optIndex)}
                          disabled={isSubmitted}
                          className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center gap-3 cursor-pointer text-xs sm:text-sm ${optStyles}`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation feedback */}
                  {isSubmitted && q.explanation && (
                    <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <Sparkles size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-blue-900 dark:text-blue-200">Explanation: </span>
                        <span>{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. SAVED NOTES HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <div className="flex items-center gap-2">
                <Bookmark size={20} className="text-blue-500" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  My Study Notes Library
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Access your previously uploaded notes and saved AI study materials.
              </p>
            </div>

            <button
              onClick={() => {
                setNoteTitle('');
                setNoteContent('');
                setAttachments([]);
                setCurrentNoteId(null);
                setActiveTab('editor');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus size={16} /> New Note
            </button>
          </div>

          {loadingNotes ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <Loader2 size={24} className="animate-spin text-blue-600" />
              <p className="text-xs text-slate-400">Loading your notes...</p>
            </div>
          ) : savedNotes.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-700/60 text-slate-400 flex items-center justify-center">
                <FileText size={32} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base">No saved notes yet</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Upload or paste your notes in the editor, and click "Save Note" to store them here permanently.
              </p>
              <button
                onClick={() => setActiveTab('editor')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Create First Note
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleSelectNoteFromHistory(note)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 hover:shadow-md ${
                    currentNoteId === note.id
                      ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-blue-400'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {note.subject || 'General'}
                      </span>
                      <button
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-base truncate mb-1">
                      {note.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {note.content || 'Note document attachments'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      {note.summary && <span className="w-2 h-2 rounded-full bg-amber-500" title="Has summary" />}
                      {note.explanation && <span className="w-2 h-2 rounded-full bg-emerald-500" title="Has explanation" />}
                      {note.flashcards && note.flashcards.length > 0 && <span className="w-2 h-2 rounded-full bg-indigo-500" title="Has flashcards" />}
                      {note.practiceQuestions && note.practiceQuestions.length > 0 && <span className="w-2 h-2 rounded-full bg-rose-500" title="Has quiz" />}
                    </div>
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
