import { motion } from 'framer-motion'

export default function Logo({ className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.05 }}
      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${className}`}
      style={{
        background: 'var(--btn-equals)',
        boxShadow: 'var(--btn-equals-shadow)',
      }}
      aria-hidden="true"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="4" y="3" width="16" height="18" rx="3" stroke="white" strokeWidth="1.5" />
        <line x1="8" y1="8" x2="16" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="12" r="1.25" fill="white" />
        <circle cx="12" cy="12" r="1.25" fill="white" />
        <circle cx="16" cy="12" r="1.25" fill="white" />
        <circle cx="8" cy="16" r="1.25" fill="white" />
        <circle cx="12" cy="16" r="1.25" fill="white" />
        <circle cx="16" cy="16" r="1.25" fill="white" />
      </svg>
    </motion.div>
  )
}
