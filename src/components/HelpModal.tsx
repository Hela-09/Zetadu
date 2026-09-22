import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  BookOpen,
  FileUp,
  BrainCircuit,
  WifiOff,
  Layers,
  Mail,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@learndean.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const faqs = [
    {
      q: 'How do I upload study notes and generate quizzes?',
      a: 'Tap "Upload" in the bottom navigation or sidebar. You can drag and drop PDF documents, text files, or lecture notes. LearnDean will automatically extract the core concepts, generate revision flashcards, and create tailored practice quizzes.',
      icon: FileUp,
    },
    {
      q: 'How does the Socratic AI Tutor work?',
      a: 'The AI Tutor guides you step-by-step through tough problems rather than just giving a blunt answer. You can ask for analogies, real-world examples, or past UTME questions on any Nigerian secondary school subject.',
      icon: Sparkles,
    },
    {
      q: 'How do I study offline when I have no internet connection?',
      a: 'Go to the More (⋮) menu and select "Offline Learning" (or use the offline indicator). You can download complete JAMB subjects and official prescribed novels. Once downloaded, all chapters, flashcards, and quizzes are 100% available offline.',
      icon: WifiOff,
    },
    {
      q: 'Are the JAMB UTME questions authentic?',
      a: 'Yes. The questions are aligned with the official JAMB syllabi and past UTME examinations, covering English, Mathematics, Physics, Chemistry, Biology, Government, Economics, Literature, and more, complete with answer keys and explanations.',
      icon: BrainCircuit,
    },
    {
      q: 'Where do I find my past scores and weak areas?',
      a: 'Go to "Learn" and tap "History", or navigate to your Profile. You will see your past practice attempts, accuracy rates by topic, and specific areas where more revision is recommended.',
      icon: BookOpen,
    },
  ];

  return (
    <div
      id="help-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="help-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-scale-up"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-sm">
              <HelpCircle size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                Help & Support
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                LearnDean student guides & assistance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close help"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Support Email Card */}
          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Contact Support Team
                </p>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  support@learndean.com
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 hover:border-blue-400 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              {copiedEmail ? (
                <>
                  <Check size={13} className="text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>

          {/* Quick FAQs */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Frequently Asked Questions
            </h4>

            <div className="space-y-2">
              {faqs.map((faq, idx) => {
                const isExpanded = expandedFaq === idx;
                const Icon = faq.icon;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/40 dark:bg-slate-850/40 transition-colors"
                  >
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {faq.q}
                        </span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="p-3.5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
