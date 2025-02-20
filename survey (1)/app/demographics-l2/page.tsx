"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProgressBar from "@/components/ProgressBar"
import { getDemographicsL2Questions, type DemographicsL2Questions } from "@/lib/surveyUtils"
import { saveSectionData } from "@/lib/googleSheets"
import { motion } from "framer-motion"

export default function DemographicsL2() {
  const router = useRouter()
  const [questions, setQuestions] = useState<DemographicsL2Questions | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const age = localStorage.getItem("age") || "under18"
    const gender = localStorage.getItem("gender") || "male"
    setQuestions(getDemographicsL2Questions(age, gender))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("DemographicsL2 form submitted", formData)
    setIsSubmitting(true)
    setError(null)
    try {
      const email = localStorage.getItem("email") || ""
      await saveSectionData(email, "Demographics L2", formData)
      router.push("/gaming-preferences")
    } catch (error) {
      console.error("Error saving demographics L2 data:", error)
      setError("There was an error saving your data. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!questions) {
    return <div>Loading...</div>
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-gray-900">
      <ProgressBar currentStep={2} totalSteps={7} />
      <h1 className="text-3xl font-bold mb-6 text-primary">{questions.title}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        {questions.questions.map((q) => (
          <div key={q.id}>
            <Label htmlFor={q.id}>{q.question}</Label>
            {q.type === "dropdown" ? (
              <Select
                value={formData[q.id] || ""}
                onValueChange={(value) => setFormData({ ...formData, [q.id]: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {q.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <RadioGroup
                value={formData[q.id] || ""}
                onValueChange={(value) => setFormData({ ...formData, [q.id]: value })}
              >
                {q.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                    <Label htmlFor={`${q.id}-${option}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        ))}
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Next"}
          </Button>
        </motion.div>
      </form>
    </main>
  )
}

