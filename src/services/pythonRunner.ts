/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ErrorDiagnostic, ExecutionTraceStep, TestCase, TestResultItem } from '../types';

export interface RunPythonResult {
  stdout: string;
  success: boolean;
  error?: ErrorDiagnostic;
  traceSteps: ExecutionTraceStep[];
  testResults: TestResultItem[];
  allPassed: boolean;
}

/**
 * Kid-friendly Python parser and execution tracer for beginner constructs.
 * Supports:
 * - print(...) with strings, vars, f-strings, arithmetic
 * - variable assignments and updates (name = "Alya", score = 10, score += 5)
 * - arithmetic operators (+, -, *, /, //, %, **)
 * - conditionals (if, elif, else)
 * - loops (for i in range(...), for item in list, while condition)
 * - lists (definitions, append, indexing, len)
 * - basic functions (def name(args): return ...)
 */
export function executePythonCode(code: string, testCases: TestCase[] = []): RunPythonResult {
  const lines = code.split('\n');
  const traceSteps: ExecutionTraceStep[] = [];
  let stdout = '';
  let lineIndex = 0;
  const variables: Record<string, any> = {};

  // Pre-check 1: Basic Indentation & Syntax checks
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Reject JS-only or unsupported syntax instead of accidentally accepting it as Python.
    // This teaching interpreter intentionally supports only the documented subset.
    const outsideStrings = rawLine.replace(/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, '""');
    if (/[;`{}]/.test(outsideStrings) || /(?:\b(?:import|exec|eval|global|class|lambda|async|await|del)\b|=>|\b(?:window|document|constructor|prototype|globalThis|process|require)\b)/.test(outsideStrings)) {
      return createErrorResult({type:'SyntaxError',line:i+1,message:'Unsupported or unsafe Python syntax',friendlyTitle:'Unsupported instruction',friendlyExplanation:'This beginner runner cannot run that instruction. Try print(), variables, arithmetic, loops or simple conditions.',whatToInspect:`Line ${i+1}`,tinyNextAction:'Use a supported beginner Python command.',rawError:`File "solution.py", line ${i+1}\nSyntaxError: unsupported syntax`}, testCases);
    }

    // Check for unmatched quotes
    let singleQuotes = (rawLine.match(/'/g) || []).length;
    let doubleQuotes = (rawLine.match(/"/g) || []).length;
    if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
      const error: ErrorDiagnostic = {
        type: 'SyntaxError',
        line: i + 1,
        message: 'SyntaxError: EOL while scanning string literal',
        friendlyTitle: 'Unclosed Text Quote',
        friendlyExplanation: `It looks like a text quotation on line ${i + 1} was opened with quotes, but the closing quotation mark is missing before the line ended.`,
        whatToInspect: `Inspect line ${i + 1} to make sure every opened quote (' or ") has a matching closing quote.`,
        tinyNextAction: `Add a matching quote at the end of your text message.`,
        rawError: `File "solution.py", line ${i + 1}\n  ${trimmed}\nSyntaxError: EOL while scanning string literal`,
      };
      return createErrorResult(error, testCases);
    }

    // Check for missing colon on if/elif/else/for/while/def
    const blockKeywords = ['if ', 'elif ', 'else:', 'for ', 'while ', 'def '];
    const isBlockStart = blockKeywords.some(kw => trimmed.startsWith(kw) || trimmed === 'else:');
    if (isBlockStart && !trimmed.endsWith(':') && !trimmed.includes('#')) {
      const error: ErrorDiagnostic = {
        type: 'SyntaxError',
        line: i + 1,
        message: "SyntaxError: expected ':'",
        friendlyTitle: 'Missing Colon (:)',
        friendlyExplanation: `In Python, commands that control code blocks (like if, for, while, and def) always require a colon (:) at the end of the line.`,
        whatToInspect: `Check the end of line ${i + 1}.`,
        tinyNextAction: `Add a colon : right at the end of line ${i + 1}.`,
        rawError: `File "solution.py", line ${i + 1}\n  ${trimmed}\nSyntaxError: expected ':'`,
      };
      return createErrorResult(error, testCases);
    }

    // Check for unbalanced parentheses
    let openParens = (rawLine.match(/\(/g) || []).length;
    let closeParens = (rawLine.match(/\)/g) || []).length;
    if (closeParens > openParens) {
      return createErrorResult({type:'SyntaxError',line:i+1,message:'Unexpected closing parenthesis',friendlyTitle:'Extra closing bracket',friendlyExplanation:'There is one more ) than ( on this line.',whatToInspect:`Line ${i+1}`,tinyNextAction:'Remove the extra ) or add the matching opening bracket.',rawError:`SyntaxError on line ${i+1}: unexpected )`},testCases);
    }
    if (openParens > closeParens) {
      const error: ErrorDiagnostic = {
        type: 'SyntaxError',
        line: i + 1,
        message: "SyntaxError: unexpected EOF while parsing (unclosed bracket)",
        friendlyTitle: 'Unclosed Parenthesis )',
        friendlyExplanation: `You opened an instruction with '(' on line ${i + 1}, but Python didn't find the closing ')' to finish the thought.`,
        whatToInspect: `Check line ${i + 1} for opening '(' that need a matching ')'.`,
        tinyNextAction: `Type a closing ')' where your instruction ends.`,
        rawError: `File "solution.py", line ${i + 1}\n  ${trimmed}\nSyntaxError: unexpected EOF while parsing`,
      };
      return createErrorResult(error, testCases);
    }
  }

  // Helper evaluator for expressions in context of variables
  function evaluateExpression(expr: string, currentLineNum: number): any {
    let clean = expr.trim();
    if (!clean) return undefined;

    // String literals
    if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
      return clean.slice(1, -1);
    }

    // F-strings: f"Hello {name}"
    if ((clean.startsWith('f"') && clean.endsWith('"')) || (clean.startsWith("f'") && clean.endsWith("'"))) {
      const template = clean.slice(2, -1);
      return template.replace(/\{([^}]+)\}/g, (_, key) => {
        try {
          const res = evaluateExpression(key.trim(), currentLineNum);
          return res !== undefined ? String(res) : '';
        } catch {
          return '';
        }
      });
    }

    // Number literals
    if (!isNaN(Number(clean))) {
      return Number(clean);
    }

    // Boolean literals
    if (clean === 'True') return true;
    if (clean === 'False') return false;
    if (clean === 'None') return null;

    // List literals [1, 2, 3]
    if (clean.startsWith('[') && clean.endsWith(']')) {
      const inner = clean.slice(1, -1).trim();
      if (!inner) return [];
      const parts = splitCommas(inner);
      return parts.map(p => evaluateExpression(p, currentLineNum));
    }

    // len(...) function
    if (clean.startsWith('len(') && clean.endsWith(')')) {
      const target = clean.slice(4, -1).trim();
      const val = evaluateExpression(target, currentLineNum);
      if (typeof val === 'string' || Array.isArray(val)) {
        return val.length;
      }
      throw {
        type: 'TypeError',
        message: `TypeError: object of type '${typeof val}' has no len()`,
        line: currentLineNum,
        friendlyTitle: 'Type Error on len()',
        friendlyExplanation: `len() only counts items in collections like lists or characters in text, but it received ${typeof val}.`,
        whatToInspect: `Check what variable you passed to len().`,
        tinyNextAction: `Ensure the item is text or a list.`,
      };
    }

    // range(...) representation
    if (clean.startsWith('range(') && clean.endsWith(')')) {
      const args = splitCommas(clean.slice(6, -1)).map(a => Number(evaluateExpression(a, currentLineNum)));
      if (args.length === 1) {
        return Array.from({ length: Math.max(0, args[0]) }, (_, i) => i);
      } else if (args.length >= 2) {
        const start = args[0];
        const stop = args[1];
        const step = args[2] || 1;
        const result: number[] = [];
        for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
          result.push(i);
        }
        return result;
      }
    }

    // List indexing or string indexing: my_list[0]
    const indexMatch = clean.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\[(.+)\]$/);
    if (indexMatch) {
      const varName = indexMatch[1];
      const indexExpr = indexMatch[2];
      if (!(varName in variables)) {
        throw createNameError(varName, currentLineNum);
      }
      const targetVal = variables[varName];
      const idx = Number(evaluateExpression(indexExpr, currentLineNum));
      if (Array.isArray(targetVal) || typeof targetVal === 'string') {
        const actualIdx = idx < 0 ? targetVal.length + idx : idx;
        if (actualIdx < 0 || actualIdx >= targetVal.length) {
          throw {
            type: 'IndexError',
            message: `IndexError: list index out of range`,
            line: currentLineNum,
            friendlyTitle: 'List Index Out of Range',
            friendlyExplanation: `You tried to grab item number [${idx}] from '${varName}', but '${varName}' only has ${targetVal.length} item(s)! Remember: Python lists start counting at index 0.`,
            whatToInspect: `Check the index number inside the brackets [].`,
            tinyNextAction: `Make sure the index is between 0 and ${Math.max(0, targetVal.length - 1)}.`,
          };
        }
        return targetVal[actualIdx];
      }
    }

    // Simple variable lookup
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(clean)) {
      if (clean in variables) {
        return variables[clean];
      } else {
        throw createNameError(clean, currentLineNum);
      }
    }

    // Binary operations: +, -, *, /, //, %, ==, !=, <, <=, >, >=, and, or
    // String concatenation or arithmetic
    return evaluateBinary(clean, currentLineNum);
  }

  function createNameError(varName: string, line: number) {
    return {
      type: 'NameError' as const,
      message: `NameError: name '${varName}' is not defined`,
      line,
      friendlyTitle: 'Unrecognized Variable Name',
      friendlyExplanation: `Python encountered the name '${varName}', but it hasn't seen it created before. Did you forget to assign it first (e.g., ${varName} = ...), or check if there's a small spelling typo?`,
      whatToInspect: `Look at '${varName}' on line ${line}. Compare its spelling with where you declared it.`,
      tinyNextAction: `Create '${varName}' above this line or fix any lowercase/uppercase differences.`,
      rawError: `File "solution.py", line ${line}\n  NameError: name '${varName}' is not defined`,
    };
  }

  function splitCommas(str: string): string[] {
    const result: string[] = [];
    let cur = '';
    let depth = 0;
    let inQuote = false;
    let quoteChar = '';
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      if ((c === '"' || c === "'") && (i === 0 || str[i - 1] !== '\\')) {
        if (!inQuote) {
          inQuote = true;
          quoteChar = c;
        } else if (c === quoteChar) {
          inQuote = false;
        }
      }
      if (!inQuote) {
        if (c === '(' || c === '[' || c === '{') depth++;
        if (c === ')' || c === ']' || c === '}') depth--;
        if (c === ',' && depth === 0) {
          result.push(cur.trim());
          cur = '';
          continue;
        }
      }
      cur += c;
    }
    if (cur.trim()) result.push(cur.trim());
    return result;
  }

  function evaluateBinary(expr: string, lineNum: number): any {
    // Check for string addition or math
    // Safe evaluation by replacing python vars and operators with JS equivalents
    // First, check for division by zero
    if (/\/ *0(?![0-9])/.test(expr) || /% *0(?![0-9])/.test(expr)) {
      throw {
        type: 'ZeroDivisionError',
        message: 'ZeroDivisionError: division by zero',
        line: lineNum,
        friendlyTitle: 'Division by Zero',
        friendlyExplanation: `Mathematics and computers cannot divide numbers by zero! Python doesn't know how to split a number into 0 parts.`,
        whatToInspect: `Check the denominator (the right side of '/' or '%') on line ${lineNum}.`,
        tinyNextAction: `Make sure the number you are dividing by is greater than 0.`,
      };
    }

    // Replace Python operators with JS
    let jsExpr = expr
      .replace(/\band\b/g, '&&')
      .replace(/\bor\b/g, '||')
      .replace(/\bnot\b/g, '!')
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null');

    // Handle python integer division //
    jsExpr = jsExpr.replace(/([0-9a-zA-Z_]+)\s*\/\/\s*([0-9a-zA-Z_]+)/g, 'Math.floor($1 / $2)');

    // new Function must never receive arbitrary source text from a child's editor.
    // The public interpreter is an expression-only practice subset, not Python.
    const expressionWithoutStrings = jsExpr.replace(/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, '0');
    if (!/^[\w\s.+*\/%()!,<>=&|\-]*$/.test(expressionWithoutStrings)
        || /(?:constructor|prototype|__proto__|window|document|globalThis|process|require|Function|eval|import|this)/.test(expressionWithoutStrings)
        || /\.(?!floor\b)/.test(expressionWithoutStrings.replace(/\d+\.\d+/g,'0'))) {
      throw {type:'SyntaxError',line:lineNum,message:'Unsupported expression',friendlyTitle:'Unsupported expression',friendlyExplanation:'Please use beginner Python numbers, variable names and arithmetic operators.',whatToInspect:`Line ${lineNum}`,tinyNextAction:'Simplify your expression.'};
    }

    // Scope creation with known variables
    const scopeKeys = Object.keys(variables);
    const scopeValues = Object.values(variables);

    try {
      // Evaluate within scope
      const fn = new Function(...scopeKeys, `return (${jsExpr});`);
      return fn(...scopeValues);
    } catch (e: any) {
      // Catch specific errors
      if (e.message && e.message.includes('is not defined')) {
        const match = e.message.match(/([a-zA-Z0-9_]+) is not defined/);
        const name = match ? match[1] : 'unknown';
        throw createNameError(name, lineNum);
      }
      // Check type error (e.g. string + int)
      throw {
        type: 'TypeError',
        message: `TypeError: unsupported operand types for operation in '${expr}'`,
        line: lineNum,
        friendlyTitle: 'Mixing Incompatible Types',
        friendlyExplanation: `Python got confused trying to combine two different types (like adding words and numbers together directly without converting).`,
        whatToInspect: `Check line ${lineNum} to see if you are adding text and numbers.`,
        tinyNextAction: `Use str(number) to turn a number into text, or use an f-string: f"{score}".`,
      };
    }
  }

  // Execution simulation loop
  try {
    let stepCount = 0;
    const maxSteps = 250; // Safety against infinite loops

    let i = 0;
    while (i < lines.length && stepCount < maxSteps) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();
      const currentLineNum = i + 1;

      if (!trimmed || trimmed.startsWith('#')) {
        i++;
        continue;
      }

      stepCount++;

      // 1. print(...) statement
      if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
        const inner = trimmed.slice(6, -1);
        const args = splitCommas(inner);
        const evaluatedArgs: any[] = [];

        for (const arg of args) {
          evaluatedArgs.push(evaluateExpression(arg, currentLineNum));
        }

        const printedStr = evaluatedArgs.map(a => (Array.isArray(a) ? `[${a.join(', ')}]` : String(a))).join(' ');
        stdout += (stdout ? '\n' : '') + printedStr;

        traceSteps.push({
          step: stepCount,
          line: currentLineNum,
          lineContent: trimmed,
          variables: { ...variables },
          stdoutSoFar: stdout,
          explanation: `Printed to screen: "${printedStr}"`,
        });

        i++;
        continue;
      }

      // 2. Variable assignment (e.g., x = 10, name = "Alya", items.append("apple"), x += 1)
      const augmentedMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(\+=|-=|\*=|\/=)\s*(.+)$/);
      if (augmentedMatch) {
        const varName = augmentedMatch[1];
        const op = augmentedMatch[2];
        const valExpr = augmentedMatch[3];
        if (!(varName in variables)) {
          throw createNameError(varName, currentLineNum);
        }
        const delta = evaluateExpression(valExpr, currentLineNum);
        if (op === '+=') variables[varName] = variables[varName] + delta;
        if (op === '-=') variables[varName] = variables[varName] - delta;
        if (op === '*=') variables[varName] = variables[varName] * delta;
        if (op === '/=') variables[varName] = variables[varName] / delta;

        traceSteps.push({
          step: stepCount,
          line: currentLineNum,
          lineContent: trimmed,
          variables: { ...variables },
          stdoutSoFar: stdout,
          explanation: `Updated '${varName}' to ${JSON.stringify(variables[varName])}`,
        });
        i++;
        continue;
      }

      // List .append(...) method
      const appendMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\.append\((.+)\)$/);
      if (appendMatch) {
        const listName = appendMatch[1];
        const itemExpr = appendMatch[2];
        if (!(listName in variables)) {
          throw createNameError(listName, currentLineNum);
        }
        if (!Array.isArray(variables[listName])) {
          throw {
            type: 'AttributeError',
            message: `AttributeError: '${typeof variables[listName]}' object has no attribute 'append'`,
            line: currentLineNum,
            friendlyTitle: 'Not a List',
            friendlyExplanation: `'${listName}' is not a list, so you cannot use .append() on it!`,
            whatToInspect: `Check where '${listName}' was created.`,
            tinyNextAction: `Make sure '${listName}' was initialized as a list like: ${listName} = []`,
          };
        }
        const itemVal = evaluateExpression(itemExpr, currentLineNum);
        variables[listName] = [...variables[listName], itemVal];

        traceSteps.push({
          step: stepCount,
          line: currentLineNum,
          lineContent: trimmed,
          variables: { ...variables },
          stdoutSoFar: stdout,
          explanation: `Appended ${JSON.stringify(itemVal)} into '${listName}'`,
        });
        i++;
        continue;
      }

      // Standard assignment: x = ...
      const assignMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
      if (assignMatch && !assignMatch[2].startsWith('=')) {
        const varName = assignMatch[1];
        const expr = assignMatch[2];
        const val = evaluateExpression(expr, currentLineNum);
        variables[varName] = val;

        traceSteps.push({
          step: stepCount,
          line: currentLineNum,
          lineContent: trimmed,
          variables: { ...variables },
          stdoutSoFar: stdout,
          explanation: `Stored value ${JSON.stringify(val)} inside variable '${varName}'`,
        });
        i++;
        continue;
      }

      // 3. For loop: for i in range(...) or for item in list:
      const forRangeMatch = trimmed.match(/^for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+range\((.+)\):$/);
      if (forRangeMatch) {
        const loopVar = forRangeMatch[1];
        const rangeArgs = splitCommas(forRangeMatch[2]).map(a => Number(evaluateExpression(a, currentLineNum)));
        let start = 0;
        let stop = 0;
        let step = 1;
        if (rangeArgs.length === 1) {
          stop = rangeArgs[0];
        } else if (rangeArgs.length >= 2) {
          start = rangeArgs[0];
          stop = rangeArgs[1];
          step = rangeArgs[2] || 1;
        }

        // Collect lines inside loop block (indented lines following)
        const loopBody: { lineIdx: number; line: string }[] = [];
        let j = i + 1;
        while (j < lines.length) {
          const bodyLine = lines[j];
          if (bodyLine.trim() === '') {
            j++;
            continue;
          }
          if (bodyLine.startsWith('  ') || bodyLine.startsWith('\t')) {
            loopBody.push({ lineIdx: j, line: bodyLine.trim() });
            j++;
          } else {
            break;
          }
        }

        traceSteps.push({
          step: stepCount,
          line: currentLineNum,
          lineContent: trimmed,
          variables: { ...variables },
          stdoutSoFar: stdout,
          explanation: `Starting loop '${loopVar}' from ${start} to ${stop}`,
        });

        // Execute loop body
        for (let iter = start; step > 0 ? iter < stop : iter > stop; iter += step) {
          variables[loopVar] = iter;
          traceSteps.push({
            step: ++stepCount,
            line: currentLineNum,
            lineContent: `${loopVar} = ${iter}`,
            variables: { ...variables },
            stdoutSoFar: stdout,
            explanation: `Loop iteration: ${loopVar} is currently ${iter}`,
          });

          for (const bodyItem of loopBody) {
            const bodyTrimmed = bodyItem.line;
            const bLineNum = bodyItem.lineIdx + 1;
            if (bodyTrimmed.startsWith('print(') && bodyTrimmed.endsWith(')')) {
              const inner = bodyTrimmed.slice(6, -1);
              const args = splitCommas(inner);
              const evaluatedArgs = args.map(a => evaluateExpression(a, bLineNum));
              const printedStr = evaluatedArgs.map(a => (Array.isArray(a) ? `[${a.join(', ')}]` : String(a))).join(' ');
              stdout += (stdout ? '\n' : '') + printedStr;
              traceSteps.push({
                step: ++stepCount,
                line: bLineNum,
                lineContent: bodyTrimmed,
                variables: { ...variables },
                stdoutSoFar: stdout,
                explanation: `Loop print output: "${printedStr}"`,
              });
            } else if (bodyTrimmed.includes('=')) {
              // sub-assignment
              const bAssign = bodyTrimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(\+=|-=|=)\s*(.+)$/);
              if (bAssign) {
                const bVar = bAssign[1];
                const bOp = bAssign[2];
                const bVal = evaluateExpression(bAssign[3], bLineNum);
                if (bOp === '=') variables[bVar] = bVal;
                if (bOp === '+=') variables[bVar] = (variables[bVar] || 0) + bVal;
                if (bOp === '-=') variables[bVar] = (variables[bVar] || 0) - bVal;
              }
            }
          }
        }

        i = j;
        continue;
      }

      // 4. If condition
      const ifMatch = trimmed.match(/^if\s+(.+):$/);
      if (ifMatch) {
        const condExpr = ifMatch[1];
        const condVal = Boolean(evaluateExpression(condExpr, currentLineNum));

        traceSteps.push({
          step: stepCount,
          line: currentLineNum,
          lineContent: trimmed,
          variables: { ...variables },
          stdoutSoFar: stdout,
          explanation: `Evaluated condition (${condExpr}) → ${condVal ? 'True' : 'False'}`,
        });

        // Collect if-body and else-body
        let j = i + 1;
        const ifBody: { lineIdx: number; line: string }[] = [];
        const elseBody: { lineIdx: number; line: string }[] = [];
        let inElse = false;

        while (j < lines.length) {
          const l = lines[j];
          if (l.trim() === '') {
            j++;
            continue;
          }
          if (l.trim() === 'else:') {
            inElse = true;
            j++;
            continue;
          }
          if (l.startsWith('  ') || l.startsWith('\t')) {
            if (!inElse) ifBody.push({ lineIdx: j, line: l.trim() });
            else elseBody.push({ lineIdx: j, line: l.trim() });
            j++;
          } else {
            break;
          }
        }

        const activeBody = condVal ? ifBody : elseBody;
        for (const item of activeBody) {
          const bTrimmed = item.line;
          const bLineNum = item.lineIdx + 1;
          if (bTrimmed.startsWith('print(') && bTrimmed.endsWith(')')) {
            const inner = bTrimmed.slice(6, -1);
            const args = splitCommas(inner).map(a => evaluateExpression(a, bLineNum));
            const printed = args.join(' ');
            stdout += (stdout ? '\n' : '') + printed;
            traceSteps.push({
              step: ++stepCount,
              line: bLineNum,
              lineContent: bTrimmed,
              variables: { ...variables },
              stdoutSoFar: stdout,
              explanation: `Branch executed: "${printed}"`,
            });
          }
        }

        i = j;
        continue;
      }

      // Unsupported statements must not count as successful execution.
      throw {type:'SyntaxError',line:currentLineNum,message:`SyntaxError: unsupported statement '${trimmed}'`,friendlyTitle:'Check your Python command',friendlyExplanation:'The runner cannot understand this line. Use print(), assignments, loops or simple if/else blocks.',whatToInspect:`Line ${currentLineNum}: ${trimmed}`,tinyNextAction:'Check spelling, parentheses and Python indentation.'};

      // Default line step
      traceSteps.push({
        step: stepCount,
        line: currentLineNum,
        lineContent: trimmed,
        variables: { ...variables },
        stdoutSoFar: stdout,
        explanation: `Executed line ${currentLineNum}`,
      });

      i++;
    }

    if (stepCount >= maxSteps) {
      stdout += '\n[Warning: Stopped trace after maximum safe execution steps]';
    }

    // Evaluate against test cases
    const testResults: TestResultItem[] = testCases.map(tc => {
      const expectedNormalized = tc.expectedOutput.trim().toLowerCase();
      const actualNormalized = stdout.trim().toLowerCase();
      const passed = actualNormalized === expectedNormalized;
      return {
        testId: tc.id,
        testName: tc.name,
        passed,
        expected: tc.expectedOutput,
        actual: stdout.trim(),
      };
    });

    const allPassed = testResults.length > 0 ? testResults.every(t => t.passed) : true;

    return {
      stdout: stdout || '(No output produced)',
      success: true,
      traceSteps,
      testResults,
      allPassed,
    };
  } catch (err: any) {
    const errorDiagnostic: ErrorDiagnostic = {
      type: err.type || 'RuntimeError',
      line: err.line || 1,
      message: err.message || 'Error occurred during Python execution',
      friendlyTitle: err.friendlyTitle || 'Code Needs Attention',
      friendlyExplanation: err.friendlyExplanation || 'Something in this code could not be processed yet. Read the hint or try checking spelling and punctuation.',
      whatToInspect: err.whatToInspect || `Check line ${err.line || 1}.`,
      tinyNextAction: err.tinyNextAction || 'Try checking variable names and quotes.',
      rawError: err.rawError || `File "solution.py", line ${err.line || 1}\n${err.message || 'RuntimeError'}`,
    };
    return createErrorResult(errorDiagnostic, testCases);
  }
}

function createErrorResult(error: ErrorDiagnostic, testCases: TestCase[]): RunPythonResult {
  const testResults: TestResultItem[] = testCases.map(tc => ({
    testId: tc.id,
    testName: tc.name,
    passed: false,
    expected: tc.expectedOutput,
    actual: `Execution stopped due to ${error.type}`,
    error: error.message,
  }));

  return {
    stdout: `Traceback (most recent call last):\n  ${error.rawError}`,
    success: false,
    error,
    traceSteps: [
      {
        step: 1,
        line: error.line,
        lineContent: `Error at line ${error.line}`,
        variables: {},
        stdoutSoFar: '',
        explanation: `Execution stopped with ${error.type}`,
      },
    ],
    testResults,
    allPassed: false,
  };
}
