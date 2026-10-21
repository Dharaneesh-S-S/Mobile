/**
 * Safe expression calculator for the built-in keypad.
 * Evaluates expressions like "120+45*2" -> 210, "1500 / 3" -> 500.
 * Does not use eval().
 */

export function evaluateExpression(expr: string): number | null {
  if (!expr || typeof expr !== 'string') return null;

  // Normalize operators: replace × with *, ÷ with /
  let sanitized = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/,/g, '')
    .trim();

  if (!sanitized) return null;

  // Basic check: must only contain digits, spaces, decimal point, +, -, *, /, (, )
  if (!/^[\d\s+\-*/.()]+$/.test(sanitized)) {
    return null;
  }

  try {
    const tokens = tokenize(sanitized);
    if (tokens.length === 0) return null;
    const rpn = shuntingYard(tokens);
    const result = evaluateRpn(rpn);
    return isFinite(result) ? result : null;
  } catch (err) {
    return null;
  }
}

type TokenType = 'NUMBER' | 'OP' | 'LPAREN' | 'RPAREN';

interface Token {
  type: TokenType;
  value: string;
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (/\d/.test(char) || char === '.') {
      let numStr = '';
      while (i < input.length && (/[\d.]/.test(input[i]))) {
        numStr += input[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    if (char === '+' || char === '-' || char === '*' || char === '/') {
      // Check for unary minus: e.g. at start or after another operator or '('
      const prev = tokens[tokens.length - 1];
      if (char === '-' && (!prev || prev.type === 'OP' || prev.type === 'LPAREN')) {
        // Unary minus: attach to subsequent number if possible or push 0 and -
        tokens.push({ type: 'NUMBER', value: '0' });
        tokens.push({ type: 'OP', value: '-' });
        i++;
        continue;
      }
      tokens.push({ type: 'OP', value: char });
      i++;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    i++;
  }

  return tokens;
}

const PRECEDENCE: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
};

function shuntingYard(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const ops: Token[] = [];

  for (const token of tokens) {
    if (token.type === 'NUMBER') {
      output.push(token);
    } else if (token.type === 'OP') {
      while (
        ops.length > 0 &&
        ops[ops.length - 1].type === 'OP' &&
        PRECEDENCE[ops[ops.length - 1].value] >= PRECEDENCE[token.value]
      ) {
        output.push(ops.pop()!);
      }
      ops.push(token);
    } else if (token.type === 'LPAREN') {
      ops.push(token);
    } else if (token.type === 'RPAREN') {
      while (ops.length > 0 && ops[ops.length - 1].type !== 'LPAREN') {
        output.push(ops.pop()!);
      }
      if (ops.length > 0 && ops[ops.length - 1].type === 'LPAREN') {
        ops.pop();
      }
    }
  }

  while (ops.length > 0) {
    output.push(ops.pop()!);
  }

  return output;
}

function evaluateRpn(rpn: Token[]): number {
  const stack: number[] = [];

  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      stack.push(parseFloat(token.value));
    } else if (token.type === 'OP') {
      if (stack.length < 2) throw new Error('Invalid expression');
      const b = stack.pop()!;
      const a = stack.pop()!;

      switch (token.value) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          if (b === 0) throw new Error('Division by zero');
          stack.push(a / b);
          break;
      }
    }
  }

  if (stack.length !== 1) throw new Error('Invalid expression');
  return stack[0];
}
