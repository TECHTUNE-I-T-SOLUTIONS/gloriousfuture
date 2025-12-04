"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TutorialStep {
  title: string
  description: string
  code_snippet?: string
  explanation?: string
}

interface StepByStepTutorialProps {
  title: string
  steps: TutorialStep[]
  onComplete?: () => void
}

export default function StepByStepTutorial({ title, steps, onComplete }: StepByStepTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleMarkStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      const newCompleted = [...completedSteps, currentStep]
      setCompletedSteps(newCompleted)

      // Auto-advance to next step
      if (currentStep < steps.length - 1) {
        handleNextStep()
      } else if (newCompleted.length === steps.length && onComplete) {
        onComplete()
      }
    }
  }

  const step = steps[currentStep]
  const isStepCompleted = completedSteps.includes(currentStep)
  const allStepsCompleted = completedSteps.length === steps.length

  return (
    <div className="space-y-6">
      {/* Tutorial Header */}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {steps.length}
          </CardDescription>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{step.title}</CardTitle>
            </div>
            {isStepCompleted && <CheckCircle className="text-green-600" size={24} />}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">What you&apos;ll learn:</h4>
            <p className="text-gray-700 leading-relaxed">{step.description}</p>
          </div>

          {/* Code Snippet */}
          {step.code_snippet && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Code Example:</h4>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed">
                  <code>{step.code_snippet}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Explanation */}
          {step.explanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">💡Pro Tip:</h4>
                  <p className="text-blue-800">{step.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={handlePreviousStep}
          disabled={currentStep === 0}
          variant="outline"
          className="gap-2"
        >
          <ChevronLeft size={18} />
          Previous
        </Button>

        <div className="flex flex-wrap gap-1 justify-center flex-1">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                index === currentStep
                  ? "bg-blue-600 text-white"
                  : completedSteps.includes(index)
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {!isStepCompleted && (
            <Button onClick={handleMarkStepComplete} className="gap-2 bg-green-600 hover:bg-green-700">
              <CheckCircle size={18} />
              Mark Complete
            </Button>
          )}

          <Button
            onClick={handleNextStep}
            disabled={currentStep === steps.length - 1}
            className="gap-2"
          >
            Next
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      {/* Completion Status */}
      {allStepsCompleted && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={28} />
              <div>
                <h4 className="font-semibold text-green-900">Tutorial Complete!</h4>
                <p className="text-green-800">You&apos;ve completed all steps. Ready to practice?</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
