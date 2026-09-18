import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minimize2, Maximize2, Calculator as CalcIcon, ArrowUpToLine, ArrowDownToLine, Delete } from 'lucide-react';

interface JambCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'basic' | 'scientific';
}

export default function JambCalculator({ isOpen, onClose, initialMode = 'scientific' }: JambCalculatorProps) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isScientific, setIsScientific] = useState(initialMode === 'scientific');
  const [hasError, setHasError] = useState(false);
  const [dockPosition, setDockPosition] = useState<'top' | 'bottom'>('top');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleInput = (val: string) => {
    setHasError(false);
    setExpression(prev => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
    setHasError(false);
  };

  const handleBackspace = () => {
    setHasError(false);
    setExpression(prev => prev.slice(0, -1));
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= Math.min(n, 100); i++) res *= i;
    return res;
  };

  const evaluateExpression = () => {
    if (!expression.trim()) return;
    try {
      let parsed = expression;
      
      // Replace display symbols with JavaScript Math equivalents
      parsed = parsed.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
      parsed = parsed.replace(/π/g, `${Math.PI}`);
      parsed = parsed.replace(/\be\b/g, `${Math.E}`);
      parsed = parsed.replace(/(\d+)%/g, '($1/100)');

      // Handle square roots: √(x) -> Math.sqrt(x)
      parsed = parsed.replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)');
      parsed = parsed.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');

      // Handle powers: x^y -> Math.pow(x, y)
      parsed = parsed.replace(/(\d+(\.\d+)?|\([^)]+\))\^(\d+(\.\d+)?|\([^)]+\))/g, 'Math.pow($1,$3)');

      // Handle trigonometry with DEG / RAD awareness
      const isDeg = angleMode === 'DEG';

      // Functions: sin, cos, tan
      parsed = parsed.replace(/sin\(([^)]+)\)/g, (_, arg) => 
        isDeg ? `Math.sin((${arg}) * Math.PI / 180)` : `Math.sin(${arg})`
      );
      parsed = parsed.replace(/cos\(([^)]+)\)/g, (_, arg) => 
        isDeg ? `Math.cos((${arg}) * Math.PI / 180)` : `Math.cos(${arg})`
      );
      parsed = parsed.replace(/tan\(([^)]+)\)/g, (_, arg) => 
        isDeg ? `Math.tan((${arg}) * Math.PI / 180)` : `Math.tan(${arg})`
      );

      // Inverse trigonometry: asin, acos, atan
      parsed = parsed.replace(/sin⁻¹\(([^)]+)\)/g, (_, arg) => 
        isDeg ? `(Math.asin(${arg}) * 180 / Math.PI)` : `Math.asin(${arg})`
      );
      parsed = parsed.replace(/cos⁻¹\(([^)]+)\)/g, (_, arg) => 
        isDeg ? `(Math.acos(${arg}) * 180 / Math.PI)` : `Math.acos(${arg})`
      );
      parsed = parsed.replace(/tan⁻¹\(([^)]+)\)/g, (_, arg) => 
        isDeg ? `(Math.atan(${arg}) * 180 / Math.PI)` : `Math.atan(${arg})`
      );

      // Logarithms
      parsed = parsed.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
      parsed = parsed.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');

      // Factorial: n!
      parsed = parsed.replace(/(\d+)!/g, (_, num) => `${factorial(parseInt(num, 10))}`);

      // Safe evaluation using Function
      // eslint-disable-next-line no-new-func
      const evalFn = new Function(`return (${parsed})`);
      const val = evalFn();

      if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
        // Round to reasonable precision (up to 8 decimals)
        const formatted = Number(val.toFixed(8)).toString();
        setResult(formatted);
        setHasError(false);
      } else {
        setResult('Error');
        setHasError(true);
      }
    } catch {
      setResult('Syntax Error');
      setHasError(true);
    }
  };

  const handleApplyResult = () => {
    if (result && !hasError && result !== 'Error' && result !== 'Syntax Error') {
      setExpression(result);
      setResult('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className={`fixed inset-0 z-50 pointer-events-none flex p-2 sm:p-4 ${
          dockPosition === 'top' 
            ? 'items-start justify-end pt-12 sm:pt-16 sm:pr-6' 
            : 'items-end justify-end pb-16 sm:pb-20 sm:pr-6'
        }`}
      >
        {isMinimized ? (
          <motion.button
            key="minimized-calc"
            initial={{ scale: 0.8, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            type="button"
            onClick={() => setIsMinimized(false)}
            className="pointer-events-auto flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xl cursor-pointer border border-white/20 transition-all hover:scale-105 active:scale-95"
            title="Expand JAMB Calculator"
          >
            <CalcIcon size={16} />
            <span>JAMB Calc</span>
            {result ? (
              <span className="bg-blue-800/80 px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold border border-blue-400/30">
                {result}
              </span>
            ) : (
              <Maximize2 size={13} className="opacity-80" />
            )}
          </motion.button>
        ) : (
          <motion.div
            key="expanded-calc"
            initial={{ opacity: 0, scale: 0.95, y: dockPosition === 'top' ? -15 : 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: dockPosition === 'top' ? -15 : 15 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-full sm:w-[350px] md:w-[370px] max-w-[calc(100vw-1rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[84vh] sm:max-h-[86vh]"
          >
            {/* Header Bar */}
            <div className="bg-slate-900 dark:bg-slate-950 text-white px-3.5 py-2.5 flex items-center justify-between select-none shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0">
                  <CalcIcon size={15} />
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-bold tracking-tight">JAMB Calculator</h4>
                  <p className="text-[10px] text-slate-400">Exam Mode</p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setAngleMode(m => m === 'DEG' ? 'RAD' : 'DEG')}
                  className="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-md bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors cursor-pointer border border-slate-700"
                  title="Toggle Angle Units (Degrees / Radians)"
                >
                  {angleMode}
                </button>

                <button
                  type="button"
                  onClick={() => setIsScientific(prev => !prev)}
                  className="px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
                  title="Toggle Scientific Keypad"
                >
                  {isScientific ? 'Sci' : 'Basic'}
                </button>

                <button
                  type="button"
                  onClick={() => setDockPosition(p => p === 'top' ? 'bottom' : 'top')}
                  className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={dockPosition === 'top' ? 'Dock to bottom' : 'Dock to top'}
                >
                  {dockPosition === 'top' ? <ArrowDownToLine size={14} /> : <ArrowUpToLine size={14} />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Minimize (Keep calculator open in background)"
                >
                  <Minimize2 size={14} />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-md hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Close Calculator"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-2.5 sm:p-3 flex flex-col gap-2 sm:gap-2.5 overscroll-contain">
              {/* Screen / Display */}
              <div 
                onClick={handleApplyResult}
                className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 sm:p-3 flex flex-col justify-end min-h-[56px] sm:min-h-[64px] cursor-pointer group shrink-0"
                title="Click result to use in next calculation"
              >
                <div className="text-right text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono overflow-x-auto whitespace-nowrap scrollbar-none">
                  {expression || '0'}
                </div>
                <div className={`text-right text-lg sm:text-xl md:text-2xl font-bold font-mono tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none ${
                  hasError ? 'text-rose-500 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {result || (expression ? '=' : '0')}
                </div>
              </div>

              {/* Scientific Top Functions (when scientific is enabled) */}
              {isScientific && (
                <div className="grid grid-cols-5 gap-1 text-[11px] sm:text-xs font-semibold shrink-0">
                  <button
                    type="button"
                    onClick={() => handleInput('sin(')}
                    className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center min-h-[30px] sm:min-h-[32px] flex items-center justify-center text-[10px] sm:text-[11px]"
                  >
                    sin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('cos(')}
                    className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center min-h-[30px] sm:min-h-[32px] flex items-center justify-center text-[10px] sm:text-[11px]"
                  >
                    cos
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('tan(')}
                    className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center min-h-[30px] sm:min-h-[32px] flex items-center justify-center text-[10px] sm:text-[11px]"
                  >
                    tan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('√(')}
                    className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center min-h-[30px] sm:min-h-[32px] flex items-center justify-center text-[10px] sm:text-[11px]"
                  >
                    √x
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('^')}
                    className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center min-h-[30px] sm:min-h-[32px] flex items-center justify-center text-[10px] sm:text-[11px]"
                  >
                    xʸ
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInput('sin⁻¹(')}
                    className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center text-[9px] sm:text-[10px] min-h-[30px] sm:min-h-[32px] flex items-center justify-center"
                  >
                    sin⁻¹
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('cos⁻¹(')}
                    className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center text-[9px] sm:text-[10px] min-h-[30px] sm:min-h-[32px] flex items-center justify-center"
                  >
                    cos⁻¹
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('tan⁻¹(')}
                    className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center text-[9px] sm:text-[10px] min-h-[30px] sm:min-h-[32px] flex items-center justify-center"
                  >
                    tan⁻¹
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('log(')}
                    className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center min-h-[30px] sm:min-h-[32px] flex items-center justify-center text-[10px] sm:text-[11px]"
                  >
                    log
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('ln(')}
                    className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center min-h-[30px] sm:min-h-[32px] flex items-center justify-center text-[10px] sm:text-[11px]"
                  >
                    ln
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInput('π')}
                    className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center min-h-[30px] sm:min-h-[32px] flex items-center justify-center text-[10px] sm:text-[11px]"
                  >
                    π
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('e')}
                    className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center min-h-[30px] sm:min-h-[32px] flex items-center justify-center text-[10px] sm:text-[11px]"
                  >
                    e
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('(')}
                    className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center min-h-[30px] sm:min-h-[32px] flex items-center justify-center text-[10px] sm:text-[11px]"
                  >
                    (
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput(')')}
                    className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center min-h-[30px] sm:min-h-[32px] flex items-center justify-center text-[10px] sm:text-[11px]"
                  >
                    )
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('%')}
                    className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center min-h-[30px] sm:min-h-[32px] flex items-center justify-center text-[10px] sm:text-[11px]"
                  >
                    %
                  </button>
                </div>
              )}

              {/* Standard Keypad */}
              <div className="grid grid-cols-4 gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold shrink-0">
                {/* Row 1 */}
                <button
                  type="button"
                  onClick={handleClear}
                  className="py-2 px-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer font-bold min-h-[36px] sm:min-h-[38px] flex items-center justify-center text-xs"
                >
                  AC
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="py-2 px-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center justify-center min-h-[36px] sm:min-h-[38px]"
                >
                  <Delete size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('(')}
                  className="py-2 px-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[36px] sm:min-h-[38px] flex items-center justify-center text-xs"
                >
                  (
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('÷')}
                  className="py-2 px-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer font-bold min-h-[36px] sm:min-h-[38px] flex items-center justify-center text-sm"
                >
                  ÷
                </button>

                {/* Row 2 */}
                <button
                  type="button"
                  onClick={() => handleInput('7')}
                  className="py-2 px-1 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[36px] sm:min-h-[38px] flex items-center justify-center"
                >
                  7
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('8')}
                  className="py-2 px-1 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[36px] sm:min-h-[38px] flex items-center justify-center"
                >
                  8
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('9')}
                  className="py-2 px-1 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[36px] sm:min-h-[38px] flex items-center justify-center"
                >
                  9
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('×')}
                  className="py-2 px-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer font-bold min-h-[36px] sm:min-h-[38px] flex items-center justify-center text-sm"
                >
                  ×
                </button>

                {/* Row 3 */}
                <button
                  type="button"
                  onClick={() => handleInput('4')}
                  className="py-2 px-1 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[36px] sm:min-h-[38px] flex items-center justify-center"
                >
                  4
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('5')}
                  className="py-2 px-1 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[36px] sm:min-h-[38px] flex items-center justify-center"
                >
                  5
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('6')}
                  className="py-2 px-1 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[36px] sm:min-h-[38px] flex items-center justify-center"
                >
                  6
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('−')}
                  className="py-2 px-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer font-bold min-h-[36px] sm:min-h-[38px] flex items-center justify-center text-sm"
                >
                  −
                </button>

                {/* Row 4 */}
                <button
                  type="button"
                  onClick={() => handleInput('1')}
                  className="py-2 px-1 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[36px] sm:min-h-[38px] flex items-center justify-center"
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('2')}
                  className="py-2 px-1 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[36px] sm:min-h-[38px] flex items-center justify-center"
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('3')}
                  className="py-2 px-1 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[36px] sm:min-h-[38px] flex items-center justify-center"
                >
                  3
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('+')}
                  className="py-2 px-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer font-bold min-h-[36px] sm:min-h-[38px] flex items-center justify-center text-sm"
                >
                  +
                </button>

                {/* Row 5 */}
                <button
                  type="button"
                  onClick={() => handleInput('0')}
                  className="py-2 px-1 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[36px] sm:min-h-[38px] flex items-center justify-center"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('.')}
                  className="py-2 px-1 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer font-bold min-h-[36px] sm:min-h-[38px] flex items-center justify-center"
                >
                  .
                </button>
                <button
                  type="button"
                  onClick={() => handleInput(')')}
                  className="py-2 px-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer min-h-[36px] sm:min-h-[38px] flex items-center justify-center text-xs"
                >
                  )
                </button>
                <button
                  type="button"
                  onClick={evaluateExpression}
                  className="py-2 px-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer font-bold shadow-sm min-h-[36px] sm:min-h-[38px] flex items-center justify-center text-sm"
                >
                  =
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
