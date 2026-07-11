import { motion } from 'framer-motion'

const spring = { type: 'spring', stiffness: 400, damping: 28 }

const variantStyles = {
  number: {
    background: 'var(--btn-number)',
    hoverBackground: 'var(--btn-number-hover)',
    color: 'var(--text-primary)',
    shadow: 'none',
    hoverShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  function: {
    background: 'var(--btn-function)',
    hoverBackground: 'var(--btn-function-hover)',
    color: 'var(--text-secondary)',
    shadow: 'none',
    hoverShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  operator: {
    background: 'var(--btn-operator)',
    hoverBackground: 'var(--btn-operator-hover)',
    color: 'var(--btn-operator-text)',
    shadow: 'none',
    hoverShadow: '0 2px 12px rgba(99,102,241,0.15)',
  },
  equals: {
    background: 'var(--btn-equals)',
    hoverBackground: 'var(--btn-equals)',
    color: '#ffffff',
    shadow: 'var(--btn-equals-shadow)',
    hoverShadow: '0 6px 20px rgba(99,102,241,0.45)',
  },
}

export default function CalculatorButton({
  label,
  onClick,
  variant = 'number',
  className = '',
  ariaLabel,
}) {
  const styles = variantStyles[variant] ?? variantStyles.number

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      whileHover={{
        scale: 1.04,
        boxShadow: styles.hoverShadow,
        filter: 'brightness(1.05)',
      }}
      whileTap={{ scale: 0.94 }}
      transition={spring}
      className={`flex h-14 items-center justify-center rounded-2xl text-lg font-medium select-none sm:h-16 sm:text-xl ${className}`}
      style={{
        background: styles.background,
        color: styles.color,
        boxShadow: styles.shadow,
      }}
    >
      {label}
    </motion.button>
  )
}
