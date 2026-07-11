import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import Calculator from './components/Calculator/Calculator'
import HistoryPanel from './components/History/HistoryPanel'
import Logo from './components/UI/Logo'
import ThemeToggle from './components/UI/ThemeToggle'
import { useCalculator } from './hooks/useCalculator'
import { useKeyboard } from './hooks/useKeyboard'
import { useTheme } from './hooks/useTheme'

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: 'var(--bg-ambient-1)' }}
      />
      <div
        className="absolute top-1/3 -right-24 h-[400px] w-[400px] rounded-full blur-3xl"
        style={{ background: 'var(--bg-ambient-2)' }}
      />
      <div
        className="absolute -bottom-24 -left-24 h-[350px] w-[350px] rounded-full blur-3xl"
        style={{ background: 'var(--bg-ambient-3)' }}
      />
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  )
}

export default function App() {
  const { isDark, toggleTheme } = useTheme()
  const [historyOpen, setHistoryOpen] = useState(false)

  const {
    currentValue,
    previousValue,
    operator,
    error,
    history,
    inputDigit,
    inputDecimal,
    selectOperator,
    calculate,
    clear,
    backspace,
    applyPercentage,
    restoreResult,
    clearHistory,
  } = useCalculator()

  useKeyboard({
    inputDigit,
    inputDecimal,
    selectOperator,
    calculate,
    clear,
    backspace,
    applyPercentage,
  })

  const handleButtonPress = useCallback(
    (action, value) => {
      switch (action) {
        case 'digit':
          inputDigit(value)
          break
        case 'decimal':
          inputDecimal()
          break
        case 'operator':
          selectOperator(value)
          break
        case 'equals':
          calculate()
          break
        case 'clear':
          clear()
          break
        case 'backspace':
          backspace()
          break
        case 'percentage':
          applyPercentage()
          break
        default:
          break
      }
    },
    [
      inputDigit,
      inputDecimal,
      selectOperator,
      calculate,
      clear,
      backspace,
      applyPercentage,
    ],
  )

  const handleRestore = useCallback(
    (result) => {
      restoreResult(result)
      if (window.innerWidth < 1024) {
        setHistoryOpen(false)
      }
    },
    [restoreResult],
  )

  return (
    <div className="relative min-h-svh">
      <AmbientBackground />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col px-5 py-8 sm:px-8 sm:py-12"
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.05 }}
          className="mb-10 flex items-center justify-between sm:mb-14"
        >
          <div className="flex items-center gap-3.5 sm:gap-4">
            <Logo />
            <div className="text-left">
              <h1
                className="text-lg font-semibold tracking-tight sm:text-xl"
                style={{ color: 'var(--text-primary)' }}
              >
                Kevin Andy Calculator
              </h1>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Simple. Powerful. Beautiful.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <motion.button
              type="button"
              onClick={() => setHistoryOpen((open) => !open)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative flex h-10 items-center gap-2 rounded-xl border px-3.5 transition-colors duration-300 lg:hidden"
              style={{
                background: 'var(--btn-number)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-secondary)',
              }}
              aria-label="Toggle history"
              aria-expanded={historyOpen}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              >
                <path d="M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              {history.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: 'var(--accent)' }}
                >
                  {history.length > 9 ? '9+' : history.length}
                </span>
              )}
            </motion.button>

            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </motion.header>

        {/* Main content */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
          <Calculator
            currentValue={currentValue}
            previousValue={previousValue}
            operator={operator}
            error={error}
            onButtonPress={handleButtonPress}
          />

          {/* Desktop history toggle + panel */}
          <div className="hidden lg:flex lg:flex-col lg:gap-4">
            <motion.button
              type="button"
              onClick={() => setHistoryOpen((open) => !open)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex items-center gap-2 self-end rounded-xl border px-4 py-2 text-sm font-medium transition-colors duration-300"
              style={{
                background: 'var(--btn-number)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-secondary)',
              }}
              aria-expanded={historyOpen}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              >
                <path d="M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              {historyOpen ? 'Hide History' : 'Show History'}
            </motion.button>

            <HistoryPanel
              isOpen={historyOpen}
              history={history}
              onRestore={handleRestore}
              onClear={clearHistory}
              onClose={() => setHistoryOpen(false)}
            />
          </div>
        </div>

        {/* Mobile history panel */}
        <div className="lg:hidden">
          <HistoryPanel
            isOpen={historyOpen}
            history={history}
            onRestore={handleRestore}
            onClear={clearHistory}
            onClose={() => setHistoryOpen(false)}
          />
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 text-center sm:mt-14"
        >
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Built by{' '}
            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
              Kevin Andy
            </span>
          </p>
        </motion.footer>
      </motion.div>
    </div>
  )
}
