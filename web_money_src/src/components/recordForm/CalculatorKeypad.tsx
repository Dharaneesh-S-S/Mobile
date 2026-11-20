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
    <div className="w-full bg-[#061817] border-t border-teal-500/20 p-3 select-none backdrop-blur-xl">
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <button
          type="button"
          onClick={handleClear}
          className="h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 active:scale-95 text-amber-400 font-bold text-sm transition-all cursor-pointer font-mono"
        >
          C
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('÷')}
          className="h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 active:scale-95 text-[#19E6C8] font-bold text-lg transition-all cursor-pointer font-mono"
        >
          ÷
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('×')}
          className="h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 active:scale-95 text-[#19E6C8] font-bold text-lg transition-all cursor-pointer font-mono"
        >
          ×
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          className="h-12 rounded-xl bg-[#030707] border border-teal-500/15 hover:bg-teal-950/40 hover:text-white active:scale-95 text-[#94B5B0] flex items-center justify-center transition-all cursor-pointer"
          aria-label="Backspace"
        >
          <Delete className="w-5 h-5" />
        </button>

        {/* Row 2 */}
        <button
          type="button"
          onClick={() => handleDigitOrOp('7')}
          className="h-12 rounded-xl bg-[#030707] border border-teal-500/15 hover:bg-teal-950/40 hover:border-teal-500/30 active:scale-95 text-white font-semibold text-lg transition-all cursor-pointer font-mono"
        >
          7
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('8')}
          className="h-12 rounded-xl bg-[#030707] border border-teal-500/15 hover:bg-teal-950/40 hover:border-teal-500/30 active:scale-95 text-white font-semibold text-lg transition-all cursor-pointer font-mono"
        >
          8
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('9')}
          className="h-12 rounded-xl bg-[#030707] border border-teal-500/15 hover:bg-teal-950/40 hover:border-teal-500/30 active:scale-95 text-white font-semibold text-lg transition-all cursor-pointer font-mono"
        >
          9
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('-')}
          className="h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 active:scale-95 text-[#19E6C8] font-bold text-xl transition-all cursor-pointer font-mono"
        >
          -
        </button>

        {/* Row 3 */}
        <button
          type="button"
          onClick={() => handleDigitOrOp('4')}
          className="h-12 rounded-xl bg-[#030707] border border-teal-500/15 hover:bg-teal-950/40 hover:border-teal-500/30 active:scale-95 text-white font-semibold text-lg transition-all cursor-pointer font-mono"
        >
          4
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('5')}
          className="h-12 rounded-xl bg-[#030707] border border-teal-500/15 hover:bg-teal-950/40 hover:border-teal-500/30 active:scale-95 text-white font-semibold text-lg transition-all cursor-pointer font-mono"
        >
          5
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('6')}
          className="h-12 rounded-xl bg-[#030707] border border-teal-500/15 hover:bg-teal-950/40 hover:border-teal-500/30 active:scale-95 text-white font-semibold text-lg transition-all cursor-pointer font-mono"
        >
          6
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('+')}
          className="h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 active:scale-95 text-[#19E6C8] font-bold text-xl transition-all cursor-pointer font-mono"
        >
          +
        </button>

        {/* Row 4 */}
        <button
          type="button"
          onClick={() => handleDigitOrOp('1')}
          className="h-12 rounded-xl bg-[#030707] border border-teal-500/15 hover:bg-teal-950/40 hover:border-teal-500/30 active:scale-95 text-white font-semibold text-lg transition-all cursor-pointer font-mono"
        >
          1
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('2')}
          className="h-12 rounded-xl bg-[#030707] border border-teal-500/15 hover:bg-teal-950/40 hover:border-teal-500/30 active:scale-95 text-white font-semibold text-lg transition-all cursor-pointer font-mono"
        >
          2
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('3')}
          className="h-12 rounded-xl bg-[#030707] border border-teal-500/15 hover:bg-teal-950/40 hover:border-teal-500/30 active:scale-95 text-white font-semibold text-lg transition-all cursor-pointer font-mono"
        >
          3
        </button>
        <button
          type="button"
          onClick={handleEvaluate}
          className="h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 active:scale-95 text-amber-400 font-bold text-xl transition-all cursor-pointer font-mono"
        >
          =
        </button>

        {/* Row 5 */}
        <button
          type="button"
          onClick={() => handleDigitOrOp('.')}
          className="h-12 rounded-xl bg-[#030707] border border-teal-500/15 hover:bg-teal-950/40 hover:border-teal-500/30 active:scale-95 text-white font-semibold text-lg transition-all cursor-pointer font-mono"
        >
          .
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('0')}
          className="h-12 rounded-xl bg-[#030707] border border-teal-500/15 hover:bg-teal-950/40 hover:border-teal-500/30 active:scale-95 text-white font-semibold text-lg transition-all cursor-pointer font-mono"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => handleDigitOrOp('00')}
          className="h-12 rounded-xl bg-[#030707] border border-teal-500/15 hover:bg-teal-950/40 hover:border-teal-500/30 active:scale-95 text-[#94B5B0] font-semibold text-base transition-all cursor-pointer font-mono"
        >
          00
        </button>
        <button
          type="button"
          onClick={handleDoneClick}
          className="h-12 rounded-xl bg-[#19E6C8] hover:bg-[#2DD4BF] active:scale-95 text-[#030807] font-bold text-sm flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(25,230,200,0.4)] transition-all cursor-pointer font-mono"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Done</span>
        </button>
      </div>
    </div>
  );
};
