import React, { useState } from 'react';
import { Novel } from '../../types';
import {
  X,
  BookOpen,
  Users,
  Feather,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
  ArrowRight,
  BookmarkCheck,
  CheckCircle2
} from 'lucide-react';

interface NovelStudyMaterialsModalProps {
  novel: Novel;
  onClose: () => void;
  onOpenReader: (chapterIndex?: number) => void;
  onOpenPractice: () => void;
}

type TabType = 'overview' | 'characters' | 'devices' | 'chapters' | 'notes';

export default function NovelStudyMaterialsModal({
  novel,
  onClose,
  onOpenReader,
  onOpenPractice
}: NovelStudyMaterialsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const characters = novel.characters || [];
  const devices = novel.literaryDevices || [];
  const notes = novel.studyNotes || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 to-slate-850 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 border border-white/20 bg-slate-800 hidden sm:block">
              <img
                src={novel.coverImage}
                alt={novel.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {novel.subject}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  {novel.category}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white line-clamp-1">
                {novel.title}
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                By {novel.author} • JAMB Syllabus Revision Companion
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>Overview & Themes</span>
          </button>

          {characters.length > 0 && (
            <button
              onClick={() => setActiveTab('characters')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'characters'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users size={14} />
              <span>Characters ({characters.length})</span>
            </button>
          )}

          {devices.length > 0 && (
            <button
              onClick={() => setActiveTab('devices')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'devices'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Feather size={14} />
              <span>Literary Devices ({devices.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('chapters')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'chapters'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers size={14} />
            <span>Chapter Summaries ({novel.chapters.length})</span>
          </button>

          {notes.length > 0 && (
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award size={14} />
              <span>UTME Exam Notes</span>
            </button>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* OVERVIEW & THEMES TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Syllabus Relevance Callout */}
              {novel.syllabusRelevance && (
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 flex items-start gap-3">
                  <BookmarkCheck size={20} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wide">
                      JAMB UTME Syllabus Alignment
                    </h4>
                    <p className="text-xs sm:text-sm font-medium mt-0.5">
                      {novel.syllabusRelevance}
                    </p>
                  </div>
                </div>
              )}

              {/* Synopsis / Description */}
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Material Synopsis
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {novel.description}
                </p>
              </div>

              {/* Central Themes */}
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  Core Themes Explored in UTME
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {novel.themes.map((theme, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 flex items-start gap-2.5"
                    >
                      <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {theme}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CHARACTERS TAB */}
          {activeTab === 'characters' && (
            <div className="space-y-4 animate-fade-in">
              {characters.map((char, i) => (
                <div
                  key={i}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {char.name}
                      </h4>
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {char.role}
                      </p>
                    </div>

                    {char.traits && (
                      <div className="flex flex-wrap gap-1">
                        {char.traits.map((tr, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-650"
                          >
                            {tr}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    {char.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* LITERARY DEVICES TAB */}
          {activeTab === 'devices' && (
            <div className="space-y-4 animate-fade-in">
              {devices.map((dev, i) => (
                <div
                  key={i}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Feather size={16} className="text-purple-500" />
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {dev.device}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {dev.explanation}
                  </p>
                  <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-850 text-xs italic text-purple-950 dark:text-purple-200">
                    <strong>Textual Example:</strong> "{dev.example}"
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CHAPTER SUMMARIES TAB */}
          {activeTab === 'chapters' && (
            <div className="space-y-4 animate-fade-in">
              {novel.chapters.map((ch, idx) => (
                <div
                  key={ch.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">
                        Chapter / Section {ch.chapterNumber}
                      </span>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                        {ch.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenReader(idx);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Read Text</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>

                  {ch.summary && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ch.summary}
                    </p>
                  )}

                  {ch.keyPoints && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Key UTME Highlights:</p>
                      <ul className="space-y-1">
                        {ch.keyPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* UTME EXAM NOTES TAB */}
          {activeTab === 'notes' && (
            <div className="space-y-4 animate-fade-in">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 space-y-2"
                >
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Award size={16} className="text-amber-500" />
                    <span>{note.title}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenPractice();
            }}
            className="px-5 py-2.5 rounded-xl border-2 border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <HelpCircle size={15} />
            <span>Practice Questions ({novel.practiceQuestions?.length || 0})</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenReader(0);
            }}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <BookOpen size={15} />
            <span>Open Full Study Reader</span>
          </button>
        </div>
      </div>
    </div>
  );
}
