import { AnimatePresence, motion } from 'framer-motion'
import { OPERATOR_SYMBOLS } from '../../logic/calculatorEngine'

export default function Display({ currentValue, previousValue, operator, error }) {
  const operatorLabel = operator ? OPERATOR_SYMBOLS[operator] : null
  const expressionPreview =
    previousValue && operatorLabel ? `${previousValue} ${operatorLabel}` : ''

  return (
    <div
      className="mb-5 rounded-2xl px-5 py-5 sm:px-6 sm:py-6"
      style={{ background: 'var(--display-bg)' }}
    >
      <AnimatePresence mode="wait">
        {expressionPreview && (
          <motion.p
            key={expressionPreview}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mb-1 truncate text-right text-sm font-medium tracking-wide sm:text-base"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {expressionPreview}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        animate={error ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="popLayout">
          <motion.p
            key={currentValue}
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="truncate text-right font-display text-4xl font-semibold tracking-tight sm:text-5xl"
            style={{ color: error ? 'var(--error)' : 'var(--text-primary)' }}
            aria-live="polite"
            aria-atomic="true"
          >
            {currentValue}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 truncate text-right text-xs font-medium"
            style={{ color: 'var(--error)' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
