import { useEffect } from 'react'

const OPERATOR_KEYS = {
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/',
}

export function useKeyboard(handlers) {
  const {
    inputDigit,
    inputDecimal,
    selectOperator,
    calculate,
    clear,
    backspace,
    applyPercentage,
  } = handlers

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event
      const target = event.target

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return
      }

      if (key >= '0' && key <= '9') {
        event.preventDefault()
        inputDigit(key)
        return
      }

      if (key in OPERATOR_KEYS) {
        event.preventDefault()
        selectOperator(OPERATOR_KEYS[key])
        return
      }

      switch (key) {
        case 'Enter':
        case '=':
          event.preventDefault()
          calculate()
          break
        case 'Backspace':
          event.preventDefault()
          backspace()
          break
        case 'Escape':
        case 'Delete':
          event.preventDefault()
          clear()
          break
        case '.':
        case ',':
          event.preventDefault()
          inputDecimal()
          break
        case '%':
          event.preventDefault()
          applyPercentage()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    inputDigit,
    inputDecimal,
    selectOperator,
    calculate,
    clear,
    backspace,
    applyPercentage,
  ])
}
