import GlassCard from '../UI/GlassCard'
import Display from './Display'
import ButtonGrid from './ButtonGrid'

export default function Calculator({
  currentValue,
  previousValue,
  operator,
  error,
  onButtonPress,
}) {
  return (
    <GlassCard className="w-full max-w-[380px] p-5 sm:p-6">
      <Display
        currentValue={currentValue}
        previousValue={previousValue}
        operator={operator}
        error={error}
      />
      <ButtonGrid onButtonPress={onButtonPress} />
    </GlassCard>
  )
}
