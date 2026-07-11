/**
 * Pure calculator operations — no React or DOM dependencies.
 */

export function add(a, b) {
  return a + b
}

export function subtract(a, b) {
  return a - b
}

export function multiply(a, b) {
  return a * b
}

export function divide(a, b) {
  if (b === 0) {
    return { error: 'Cannot divide by zero' }
  }
  return a / b
}

export function percentage(value) {
  return value / 100
}

/**
 * Evaluate an expression from two operands and an operator symbol.
 * Returns a number on success, or { error: string } on failure.
 */
export function evaluate(operator, previousValue, currentValue) {
  const prev = parseFloat(previousValue)
  const current = parseFloat(currentValue)

  if (Number.isNaN(prev) || Number.isNaN(current)) {
    return { error: 'Invalid input' }
  }

  switch (operator) {
    case '+':
      return add(prev, current)
    case '-':
      return subtract(prev, current)
    case '*':
      return multiply(prev, current)
    case '/': {
      const result = divide(prev, current)
      if (typeof result === 'object' && result.error) {
        return result
      }
      return result
    }
    default:
      return current
  }
}

/**
 * Format a numeric result for display, avoiding long floating-point artifacts.
 */
export function formatDisplayValue(value) {
  if (typeof value === 'object' && value?.error) {
    return 'Error'
  }

  const num = typeof value === 'number' ? value : parseFloat(value)

  if (Number.isNaN(num)) {
    return '0'
  }

  const rounded = Math.round((num + Number.EPSILON) * 1e10) / 1e10
  const str = String(rounded)

  if (str.length > 12) {
    return rounded.toPrecision(10).replace(/\.?0+$/, '')
  }

  return str
}

export const OPERATOR_SYMBOLS = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
}
