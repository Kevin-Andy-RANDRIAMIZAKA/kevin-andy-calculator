import { motion } from 'framer-motion'

export default function HistoryItem({ entry, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(entry.result)}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="group flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors duration-200"
      style={{ background: 'transparent' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--history-hover)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
      }}
    >
      <span
        className="truncate text-xs font-medium"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {entry.expression}
      </span>
      <span
        className="truncate text-base font-semibold tracking-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        = {entry.result}
      </span>
    </motion.button>
  )
}
