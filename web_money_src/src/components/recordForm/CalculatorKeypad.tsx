import React from 'react';
import { Delete, Check, CornerDownLeft } from 'lucide-react';
import { evaluateExpression } from '../../utils/calculator';

interface CalculatorKeypadProps {
  expression: string;
  onChangeExpression: (val: string) => void;
  onDone: (evaluatedValue: number) => void;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  expression,
  onChangeExpression,
  onDone,
}) => {
  const handleDigitOrOp = (char: string) => {
    // If expression is "0" and input is a number, replace "0"
    if (expression === '0' && /\d/.test(char)) {
      onChangeExpression(char);
    } else {
      onChangeExpression(expression + char);
    }
  };

  const handleClear = () => {
    onChangeExpression('');
  };

  const handleBackspace = () => {
    onChangeExpression(expression.slice(0, -1));
  };

  const handleEvaluate = () => {
    const res = evaluateExpression(expression);
    if (res !== null) {
      onChangeExpression(res.toString());
      return res;
    }
    return null;
  };

  const handleDoneClick = () => {
    let finalVal = evaluateExpression(expression);
    if (finalVal === null) {
      finalVal = parseFloat(expression) || 0;
    }
    onDone(finalVal);
  };

  return (
    <div className="w-full bg-[#0c121e] border-t border-slate-800 p-3 select-none">
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <button
          type="button"
          onClick={handleClear}
          className="h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-amber-400 font-bold text-sm transition-all"
        >
          C
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('÷')}
          className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-blue-400 font-bold text-lg transition-all"
        >
          ÷
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('×')}
          className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-blue-400 font-bold text-lg transition-all"
        >
          ×
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          className="h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center transition-all"
          aria-label="Backspace"
        >
          <Delete className="w-5 h-5" />
        </button>

        {/* Row 2 */}
        <button
          type="button"
          onClick={() => handleDigitOrOp('7')}
          className="h-12 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-800 active:scale-95 text-white font-semibold text-lg transition-all"
        >
          7
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('8')}
          className="h-12 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-800 active:scale-95 text-white font-semibold text-lg transition-all"
        >
          8
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('9')}
          className="h-12 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-800 active:scale-95 text-white font-semibold text-lg transition-all"
        >
          9
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('-')}
          className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-blue-400 font-bold text-xl transition-all"
        >
          -
        </button>

        {/* Row 3 */}
        <button
          type="button"
          onClick={() => handleDigitOrOp('4')}
          className="h-12 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-800 active:scale-95 text-white font-semibold text-lg transition-all"
        >
          4
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('5')}
          className="h-12 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-800 active:scale-95 text-white font-semibold text-lg transition-all"
        >
          5
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('6')}
          className="h-12 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-800 active:scale-95 text-white font-semibold text-lg transition-all"
        >
          6
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('+')}
          className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-blue-400 font-bold text-xl transition-all"
        >
          +
        </button>

        {/* Row 4 */}
        <button
          type="button"
          onClick={() => handleDigitOrOp('1')}
          className="h-12 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-800 active:scale-95 text-white font-semibold text-lg transition-all"
        >
          1
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('2')}
          className="h-12 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-800 active:scale-95 text-white font-semibold text-lg transition-all"
        >
          2
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('3')}
          className="h-12 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-800 active:scale-95 text-white font-semibold text-lg transition-all"
        >
          3
        </button>
        <button
          type="button"
          onClick={handleEvaluate}
          className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 font-bold text-xl transition-all"
        >
          =
        </button>

        {/* Row 5 */}
        <button
          type="button"
          onClick={() => handleDigitOrOp('.')}
          className="h-12 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-800 active:scale-95 text-white font-semibold text-lg transition-all"
        >
          .
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('0')}
          className="h-12 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-800 active:scale-95 text-white font-semibold text-lg transition-all"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('00')}
          className="h-12 rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-800 active:scale-95 text-slate-300 font-semibold text-base transition-all"
        >
          00
        </button>
        <button
          type="button"
          onClick={handleDoneClick}
          className="h-12 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-1 shadow-glow-blue transition-all"
        >
          <Check className="w-4 h-4" />
          <span>Done</span>
        </button>
      </div>
    </div>
  );
};
