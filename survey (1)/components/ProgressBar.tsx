import type React from "react"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  console.log(`Rendering ProgressBar: ${currentStep}/${totalSteps}`)
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  )
}

export default ProgressBar

