import { AnimatePresence, motion } from 'framer-motion'
import HistoryItem from './HistoryItem'

export default function HistoryPanel({
  isOpen,
  history,
  onRestore,
  onClear,
  onClose,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col border-l backdrop-blur-2xl lg:static lg:z-auto lg:h-auto lg:max-h-[560px] lg:w-72 lg:max-w-none lg:rounded-3xl lg:border"
            style={{
              background: 'var(--history-bg)',
              borderColor: 'var(--card-border)',
              boxShadow: 'var(--glass-shadow)',
            }}
            role="complementary"
            aria-label="Calculation history"
          >
            <div
              className="flex items-center justify-between border-b px-5 py-4"
              style={{ borderColor: 'var(--card-border)' }}
            >
              <div>
                <h2
                  className="text-sm font-semibold tracking-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  History
                </h2>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Tap to restore result
                </p>
              </div>

              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <motion.button
                    type="button"
                    onClick={onClear}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
                    style={{
                      color: 'var(--text-tertiary)',
                      background: 'var(--btn-number)',
                    }}
                  >
                    Clear
                  </motion.button>
                )}

                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg lg:hidden"
                  style={{
                    background: 'var(--btn-number)',
                    color: 'var(--text-secondary)',
                  }}
                  aria-label="Close history"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>

            <div className="history-scroll flex-1 overflow-y-auto px-3 py-3">
              {history.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex h-full min-h-48 flex-col items-center justify-center px-4 text-center"
                >
                  <div
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: 'var(--btn-number)' }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      <path d="M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                    </svg>
                  </div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    No calculations yet
                  </p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Your history will appear here
                  </p>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-1">
                  <AnimatePresence initial={false}>
                    {history.map((entry) => (
                      <HistoryItem
                        key={entry.id}
                        entry={entry}
                        onSelect={onRestore}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
