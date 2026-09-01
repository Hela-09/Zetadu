const fs = require('fs');

let code = fs.readFileSync('src/components/Practice.tsx', 'utf8');

// I am going to find 'const renderQuestionNavigator = () => ('
// and replace everything from there to the end of the file with the correct code.
const splitPoint = code.indexOf('const renderQuestionNavigator = () => (');
let topCode = code.substring(0, splitPoint);

const bottomCode = `const renderQuestionNavigator = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-bold text-slate-900 dark:text-white">Questions</h3>
        {showMobileNav && (
          <button onClick={() => setShowMobileNav(false)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <X size={20} />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto pr-1 min-h-0">
        <div className="grid grid-cols-4 lg:grid-cols-5 gap-2 pb-4 w-full min-w-0 box-border">
          {questions.map((_, i) => {
            const isAnswered = answers[i] !== undefined;
            const isMarked = markedForReview[i];
            const isCurrent = currentQIndex === i;
            
            let btnClass = "w-full h-12 sm:h-14 min-w-0 rounded-lg font-bold text-sm sm:text-base flex items-center justify-center border transition-colors relative shrink-0 ";
            
            if (isCurrent) {
              btnClass += "border-blue-600 ring-2 ring-blue-600/30 text-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/10 ";
            } else {
              btnClass += "border-slate-200 dark:border-slate-700 ";
            }

            if (isSubmitted) {
              const correct = isOptionCorrect(questions[i], answers[i]);
              if (correct) btnClass += "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400 ";
              else if (!isAnswered) btnClass += "bg-slate-100 text-slate-400 dark:bg-slate-800 ";
              else btnClass += "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400 ";
            } else {
              if (isAnswered) btnClass += "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ";
              else btnClass += "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 ";
            }

            return (
              <button
                key={i}
                onClick={() => {
                  setCurrentQIndex(i);
                  setShowMobileNav(false);
                }}
                className={btnClass}
              >
                {i + 1}
                {isMarked && !isSubmitted && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white dark:border-slate-800"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {!isSubmitted && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex flex-col gap-2 mb-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"></div> Answered: {answeredCount}</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"></div> Unanswered: {unansweredCount}</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Marked: {Object.values(markedForReview).filter(Boolean).length}</div>
          </div>
          <button 
            onClick={() => setShowSubmitPrompt(true)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
          >
            Submit Quiz
          </button>
        </div>
      )}
      {isSubmitted && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="text-center mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Final Score</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{score} / {questions.length}</p>
          </div>
          <button 
            onClick={handleExitAfterSubmit}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
          >
            Exit Session
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full h-full min-h-0 max-w-6xl mx-auto pb-8 flex flex-col relative">
      {/* Leave Prompt */}
      {showLeavePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl"
          >
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">Leave Session?</h3>
            <p className="text-slate-500 text-center mb-8">Your progress will be lost. Are you sure you want to exit?</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowLeavePrompt(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleExit}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors"
              >
                Leave
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Submit Prompt */}
      {showSubmitPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl"
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">Submit Quiz?</h3>
            <p className="text-slate-500 text-center mb-6">
              You have answered {answeredCount} out of {questions.length} questions.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowSubmitPrompt(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors"
              >
                Continue
              </button>
              <button 
                onClick={confirmSubmit}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => isSubmitted ? handleExitAfterSubmit() : setShowLeavePrompt(true)}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{subject}</h2>
            <p className="text-sm text-slate-500">{topic} • {difficulty}</p>
          </div>
        </div>
        {!isSubmitted && (
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 font-medium font-mono">
            <Clock size={18} className="text-blue-500" />
            {formatTime(timeElapsed)}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Main Question Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                {!isSubmitted && (
                  <button 
                    onClick={toggleMarkReview}
                    className={\`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors \${
                      markedForReview[currentQIndex] ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }\`}
                  >
                    <Flag size={16} className={markedForReview[currentQIndex] ? 'fill-current' : ''} />
                    <span className="hidden sm:inline">{markedForReview[currentQIndex] ? 'Marked for review' : 'Mark for review'}</span>
                  </button>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-8 leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] break-normal min-w-0">
                {question.question}
              </h3>

              <div className="space-y-4 mb-8">
                {question.options.map((option, index) => {
                  const isSelected = answers[currentQIndex] === index;
                  const isCorrect = isSubmitted && isOptionCorrect(question, index);
                  const isWrongSelection = isSubmitted && isSelected && !isOptionCorrect(question, index);
                  
                  let styleClass = "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-slate-900/50";
                  
                  if (isSelected && !isSubmitted) {
                    styleClass = "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 ring-2 ring-blue-600/20";
                  } else if (isCorrect) {
                    styleClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20";
                  } else if (isWrongSelection) {
                    styleClass = "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/20";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(index)}
                      disabled={isSubmitted}
                      className={\`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 \${styleClass}\`}
                    >
                      <div className={\`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-medium \${
                        isSelected && !isSubmitted ? 'border-blue-600 bg-blue-600 text-white' :
                        isCorrect ? 'border-emerald-500 bg-emerald-500 text-white' :
                        isWrongSelection ? 'border-rose-500 bg-rose-500 text-white' :
                        'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                      }\`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className={\`font-medium flex-1 text-lg [overflow-wrap:anywhere] break-normal min-w-0 \${isSubmitted ? '' : 'text-slate-700 dark:text-slate-200'}\`}>
                        {option}
                      </span>
                      {isCorrect && <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />}
                      {isWrongSelection && <XCircle className="text-rose-500 shrink-0" size={24} />}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className={\`p-6 rounded-3xl border-2 mb-8 shadow-sm \${
                  answers[currentQIndex] === undefined
                    ? 'bg-slate-50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800'
                    : isOptionCorrect(question, answers[currentQIndex]) 
                      ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/30' 
                      : 'bg-rose-50 border-rose-200 dark:bg-rose-900/10 dark:border-rose-800/30'
                }\`}>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
                      {answers[currentQIndex] === undefined ? (
                         <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                           <AlertCircle size={24} />
                         </div>
                      ) : isOptionCorrect(question, answers[currentQIndex]) ? (
                         <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                           <CheckCircle2 size={24} />
                         </div>
                      ) : (
                         <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600">
                           <XCircle size={24} />
                         </div>
                      )}
                      <div>
                        <h4 className={\`text-xl font-bold \${
                          answers[currentQIndex] === undefined
                            ? 'text-slate-700 dark:text-slate-300'
                            : isOptionCorrect(question, answers[currentQIndex]) ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'
                        }\`}>
                          {answers[currentQIndex] === undefined 
                            ? 'Not Answered' 
                            : isOptionCorrect(question, answers[currentQIndex]) ? '✓ Correct' : '✕ Incorrect'}
                        </h4>
                        {!isOptionCorrect(question, answers[currentQIndex]) && answers[currentQIndex] !== undefined && (
                           <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                             The correct answer was: <span className="font-bold text-slate-900 dark:text-white">{question.options[getNormalizedCorrectIndex(question)]}</span>
                           </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-3">
                         <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                           <BrainCircuit size={16} />
                         </div>
                         <h5 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider">AI Explanation</h5>
                      </div>
                      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed [overflow-wrap:anywhere] break-normal min-w-0" dangerouslySetInnerHTML={{ __html: question.explanation || 'No explanation provided.' }} />
                    </div>
                    
                    <div className="pt-4 mt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                       <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                         <ArrowRight size={16} /> Try a similar question
                       </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex flex-wrap gap-4 justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={handlePrev}
                disabled={currentQIndex === 0}
                className="flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-6 py-3 min-h-[44px] rounded-xl font-medium transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={20} /> <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={handleNext}
                disabled={currentQIndex === questions.length - 1}
                className="flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-6 py-3 min-h-[44px] rounded-xl font-medium transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span> <ArrowRight size={20} />
              </button>
            </div>
            
            <div className="flex gap-2 sm:gap-4">
              <button 
                onClick={() => setShowMobileNav(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl font-medium transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
              >
                <Menu size={20} /> <span className="hidden sm:inline">Questions</span>
              </button>
              
              {!isSubmitted && (
                <button
                  onClick={() => setShowSubmitPrompt(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl font-bold transition-colors bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Sidebar Navigator */}
        <div className="hidden lg:block w-80 shrink-0">
          <div className="h-full min-h-0">
             {renderQuestionNavigator()}
          </div>
        </div>

        {/* Mobile Drawer Navigator */}
        <AnimatePresence>
          {showMobileNav && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden flex justify-end bg-black/50"
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-4/5 max-w-sm bg-white dark:bg-slate-900 h-[100dvh] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] pl-0 sm:pl-[env(safe-area-inset-left)]"
              >
                {renderQuestionNavigator()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/Practice.tsx', topCode + bottomCode);
