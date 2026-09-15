import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minimize2, Maximize2, RotateCcw, Delete, Calculator as CalcIcon } from 'lucide-react';

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

  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const toDegrees = (rad: number) => (rad * 180) / Math.PI;

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
      <div className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-center justify-end sm:justify-end p-2 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-auto w-full sm:w-[380px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="bg-slate-900 dark:bg-slate-950 text-white px-4 py-3 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                <CalcIcon size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-tight">JAMB Calculator</h4>
                <p className="text-[10px] text-slate-400">Exam timer running</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setAngleMode(m => m === 'DEG' ? 'RAD' : 'DEG')}
                className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors cursor-pointer border border-slate-700"
                title="Toggle Angle Units (Degrees / Radians)"
              >
                {angleMode}
              </button>

              <button
                type="button"
                onClick={() => setIsScientific(prev => !prev)}
                className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
                title="Toggle Scientific Keypad"
              >
                {isScientific ? 'Sci' : 'Basic'}
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(prev => !prev)}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Close Calculator"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="p-4 flex flex-col gap-3">
              {/* Screen / Display */}
              <div 
                onClick={handleApplyResult}
                className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col justify-end min-h-[76px] cursor-pointer group"
                title="Click result to use in next calculation"
              >
                <div className="text-right text-xs text-slate-500 dark:text-slate-400 font-mono overflow-x-auto whitespace-nowrap scrollbar-none">
                  {expression || '0'}
                </div>
                <div className={`text-right text-2xl font-bold font-mono tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none ${
                  hasError ? 'text-red-500 dark:text-red-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {result || (expression ? '=' : '0')}
                </div>
              </div>

              {/* Scientific Top Functions (when scientific is enabled) */}
              {isScientific && (
                <div className="grid grid-cols-5 gap-1.5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => handleInput('sin(')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center"
                  >
                    sin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('cos(')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center"
                  >
                    cos
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('tan(')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center"
                  >
                    tan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('√(')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center"
                  >
                    √x
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('^')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center"
                  >
                    xʸ
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInput('sin⁻¹(')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center text-[11px]"
                  >
                    sin⁻¹
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('cos⁻¹(')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center text-[11px]"
                  >
                    cos⁻¹
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('tan⁻¹(')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center text-[11px]"
                  >
                    tan⁻¹
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('log(')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center"
                  >
                    log
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('ln(')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center"
                  >
                    ln
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInput('π')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center"
                  >
                    π
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('e')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center"
                  >
                    e
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('^2')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center"
                  >
                    x²
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('!')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center"
                  >
                    n!
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInput('%')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-center"
                  >
                    %
                  </button>
                </div>
              )}

              {/* Standard Keypad */}
              <div className="grid grid-cols-4 gap-1.5 text-sm font-semibold">
                {/* Row 1 */}
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer font-bold"
                >
                  AC
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center justify-center"
                >
                  <Delete size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('(')}
                  className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  (
                </button>
                <button
                  type="button"
                  onClick={() => handleInput(')')}
                  className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  )
                </button>

                {/* Row 2 */}
                <button
                  type="button"
                  onClick={() => handleInput('7')}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer text-base"
                >
                  7
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('8')}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer text-base"
                >
                  8
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('9')}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer text-base"
                >
                  9
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('÷')}
                  className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer text-lg font-bold"
                >
                  ÷
                </button>

                {/* Row 3 */}
                <button
                  type="button"
                  onClick={() => handleInput('4')}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer text-base"
                >
                  4
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('5')}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer text-base"
                >
                  5
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('6')}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer text-base"
                >
                  6
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('×')}
                  className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer text-lg font-bold"
                >
                  ×
                </button>

                {/* Row 4 */}
                <button
                  type="button"
                  onClick={() => handleInput('1')}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer text-base"
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('2')}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer text-base"
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('3')}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer text-base"
                >
                  3
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('−')}
                  className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer text-lg font-bold"
                >
                  −
                </button>

                {/* Row 5 */}
                <button
                  type="button"
                  onClick={() => handleInput('0')}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer text-base"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('.')}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer text-base font-bold"
                >
                  .
                </button>
                <button
                  type="button"
                  onClick={evaluateExpression}
                  className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer text-xl font-bold shadow-md shadow-blue-500/20"
                >
                  =
                </button>
                <button
                  type="button"
                  onClick={() => handleInput('+')}
                  className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
