import CalculatorButton from './CalculatorButton'

const BUTTONS = [
  { label: 'AC', action: 'clear', variant: 'function' },
  { label: '⌫', action: 'backspace', variant: 'function', ariaLabel: 'Delete' },
  { label: '%', action: 'percentage', variant: 'function' },
  { label: '÷', action: 'operator', value: '/', variant: 'operator' },
  { label: '7', action: 'digit', value: '7', variant: 'number' },
  { label: '8', action: 'digit', value: '8', variant: 'number' },
  { label: '9', action: 'digit', value: '9', variant: 'number' },
  { label: '×', action: 'operator', value: '*', variant: 'operator' },
  { label: '4', action: 'digit', value: '4', variant: 'number' },
  { label: '5', action: 'digit', value: '5', variant: 'number' },
  { label: '6', action: 'digit', value: '6', variant: 'number' },
  { label: '−', action: 'operator', value: '-', variant: 'operator' },
  { label: '1', action: 'digit', value: '1', variant: 'number' },
  { label: '2', action: 'digit', value: '2', variant: 'number' },
  { label: '3', action: 'digit', value: '3', variant: 'number' },
  { label: '+', action: 'operator', value: '+', variant: 'operator' },
  { label: '0', action: 'digit', value: '0', variant: 'number', className: 'col-span-2' },
  { label: '.', action: 'decimal', variant: 'number' },
  { label: '=', action: 'equals', variant: 'equals' },
]

export default function ButtonGrid({ onButtonPress }) {
  const handlePress = (button) => {
    switch (button.action) {
      case 'digit':
        onButtonPress('digit', button.value)
        break
      case 'decimal':
        onButtonPress('decimal')
        break
      case 'operator':
        onButtonPress('operator', button.value)
        break
      case 'equals':
        onButtonPress('equals')
        break
      case 'clear':
        onButtonPress('clear')
        break
      case 'backspace':
        onButtonPress('backspace')
        break
      case 'percentage':
        onButtonPress('percentage')
        break
      default:
        break
    }
  }

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
      {BUTTONS.map((button) => (
        <CalculatorButton
          key={button.label}
          label={button.label}
          variant={button.variant}
          className={button.className ?? ''}
          ariaLabel={button.ariaLabel}
          onClick={() => handlePress(button)}
        />
      ))}
    </div>
  )
}
