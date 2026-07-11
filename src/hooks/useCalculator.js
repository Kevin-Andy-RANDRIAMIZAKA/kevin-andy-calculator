import { useCallback, useEffect, useReducer } from 'react'
import {
  evaluate,
  formatDisplayValue,
  OPERATOR_SYMBOLS,
  percentage,
} from '../logic/calculatorEngine'

const HISTORY_KEY = 'premium-calculator-history'
const MAX_HISTORY = 50

export const ACTION_TYPES = {
  INPUT_DIGIT: 'INPUT_DIGIT',
  INPUT_DECIMAL: 'INPUT_DECIMAL',
  SELECT_OPERATOR: 'SELECT_OPERATOR',
  EQUALS: 'EQUALS',
  CLEAR: 'CLEAR',
  BACKSPACE: 'BACKSPACE',
  PERCENTAGE: 'PERCENTAGE',
  RESTORE_RESULT: 'RESTORE_RESULT',
  CLEAR_HISTORY: 'CLEAR_HISTORY',
}

function createHistoryId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function normalizeHistoryEntry(entry) {
  if (typeof entry === 'object' && entry?.result) {
    return {
      id: entry.id ?? createHistoryId(),
      expression: entry.expression,
      result: entry.result,
    }
  }

  if (typeof entry === 'string') {
    const match = entry.match(/^(.+?)\s*=\s*(.+)$/)
    if (match) {
      return {
        id: createHistoryId(),
        expression: match[1].trim(),
        result: match[2].trim(),
      }
    }
  }

  return null
}

function loadHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (!stored) return []

    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map(normalizeHistoryEntry)
      .filter(Boolean)
      .slice(0, MAX_HISTORY)
  } catch {
    return []
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    // Storage unavailable or quota exceeded
  }
}

const initialState = {
  currentValue: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  error: null,
  history: loadHistory(),
}

function resolvePendingOperation(state) {
  if (state.operator === null || state.previousValue === null) {
    return {
      value: state.currentValue,
      error: null,
    }
  }

  const result = evaluate(state.operator, state.previousValue, state.currentValue)

  if (typeof result === 'object' && result.error) {
    return { value: null, error: result.error }
  }

  return {
    value: formatDisplayValue(result),
    error: null,
  }
}

function calculatorReducer(state, action) {
  if (action.type === ACTION_TYPES.CLEAR) {
    return {
      ...initialState,
      history: state.history,
    }
  }

  if (state.error && action.type !== ACTION_TYPES.CLEAR) {
    return state
  }

  switch (action.type) {
    case ACTION_TYPES.INPUT_DIGIT: {
      const { digit } = action.payload

      if (state.waitingForOperand) {
        return {
          ...state,
          currentValue: digit,
          waitingForOperand: false,
        }
      }

      if (state.currentValue === '0') {
        return { ...state, currentValue: digit }
      }

      if (state.currentValue.replace('.', '').length >= 12) {
        return state
      }

      return {
        ...state,
        currentValue: state.currentValue + digit,
      }
    }

    case ACTION_TYPES.INPUT_DECIMAL: {
      if (state.waitingForOperand) {
        return {
          ...state,
          currentValue: '0.',
          waitingForOperand: false,
        }
      }

      if (state.currentValue.includes('.')) {
        return state
      }

      return {
        ...state,
        currentValue: `${state.currentValue}.`,
      }
    }

    case ACTION_TYPES.SELECT_OPERATOR: {
      const { operator } = action.payload

      if (state.operator !== null && state.previousValue !== null && !state.waitingForOperand) {
        const { value, error } = resolvePendingOperation(state)

        if (error) {
          return {
            ...state,
            error,
            currentValue: 'Error',
            previousValue: null,
            operator: null,
            waitingForOperand: true,
          }
        }

        return {
          ...state,
          currentValue: value,
          previousValue: value,
          operator,
          waitingForOperand: true,
        }
      }

      return {
        ...state,
        previousValue: state.currentValue,
        operator,
        waitingForOperand: true,
      }
    }

    case ACTION_TYPES.EQUALS: {
      if (state.operator === null || state.previousValue === null) {
        return state
      }

      const result = evaluate(state.operator, state.previousValue, state.currentValue)

      if (typeof result === 'object' && result.error) {
        return {
          ...state,
          error: result.error,
          currentValue: 'Error',
          previousValue: null,
          operator: null,
          waitingForOperand: true,
        }
      }

      const formatted = formatDisplayValue(result)
      const symbol = OPERATOR_SYMBOLS[state.operator] ?? state.operator
      const expression = `${state.previousValue} ${symbol} ${state.currentValue}`
      const entry = {
        id: createHistoryId(),
        expression,
        result: formatted,
      }

      return {
        ...state,
        currentValue: formatted,
        previousValue: null,
        operator: null,
        waitingForOperand: true,
        history: [entry, ...state.history].slice(0, MAX_HISTORY),
      }
    }

    case ACTION_TYPES.BACKSPACE: {
      if (state.waitingForOperand) {
        return state
      }

      if (state.currentValue.length <= 1 || state.currentValue === '-0') {
        return { ...state, currentValue: '0' }
      }

      const nextValue = state.currentValue.slice(0, -1)

      return {
        ...state,
        currentValue: nextValue === '-' || nextValue === '' ? '0' : nextValue,
      }
    }

    case ACTION_TYPES.PERCENTAGE: {
      const value = parseFloat(state.currentValue)

      if (Number.isNaN(value)) {
        return state
      }

      return {
        ...state,
        currentValue: formatDisplayValue(percentage(value)),
        waitingForOperand: false,
      }
    }

    case ACTION_TYPES.RESTORE_RESULT: {
      const { result } = action.payload

      return {
        ...state,
        currentValue: result,
        previousValue: null,
        operator: null,
        waitingForOperand: true,
        error: null,
      }
    }

    case ACTION_TYPES.CLEAR_HISTORY: {
      return {
        ...state,
        history: [],
      }
    }

    default:
      return state
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState)

  useEffect(() => {
    saveHistory(state.history)
  }, [state.history])

  const inputDigit = useCallback(
    (digit) => dispatch({ type: ACTION_TYPES.INPUT_DIGIT, payload: { digit } }),
    [],
  )

  const inputDecimal = useCallback(
    () => dispatch({ type: ACTION_TYPES.INPUT_DECIMAL }),
    [],
  )

  const selectOperator = useCallback(
    (operator) =>
      dispatch({ type: ACTION_TYPES.SELECT_OPERATOR, payload: { operator } }),
    [],
  )

  const calculate = useCallback(() => dispatch({ type: ACTION_TYPES.EQUALS }), [])

  const clear = useCallback(() => dispatch({ type: ACTION_TYPES.CLEAR }), [])

  const backspace = useCallback(() => dispatch({ type: ACTION_TYPES.BACKSPACE }), [])

  const applyPercentage = useCallback(
    () => dispatch({ type: ACTION_TYPES.PERCENTAGE }),
    [],
  )

  const restoreResult = useCallback(
    (result) =>
      dispatch({ type: ACTION_TYPES.RESTORE_RESULT, payload: { result } }),
    [],
  )

  const clearHistory = useCallback(
    () => dispatch({ type: ACTION_TYPES.CLEAR_HISTORY }),
    [],
  )

  return {
    currentValue: state.currentValue,
    previousValue: state.previousValue,
    operator: state.operator,
    error: state.error,
    history: state.history,
    inputDigit,
    inputDecimal,
    selectOperator,
    calculate,
    clear,
    backspace,
    applyPercentage,
    restoreResult,
    clearHistory,
  }
}
