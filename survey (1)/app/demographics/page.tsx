"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import ProgressBar from "@/components/ProgressBar"
import { saveSectionData } from "@/lib/googleSheets"
import { motion } from "framer-motion"

export default function Demographics() {
  console.log("Rendering Demographics page")
  const router = useRouter()
  const [formData, setFormData] = useState({
    ign: "",
    email: "",
    age: "",
    gender: "",
    city: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/google-sheets")
      .then((res) => res.json())
      .then((result) => setData(result.data))
      .catch((err) => console.error("Error fetching Google Sheets data:", err));
    
    console.log("Demographics page mounted")
    
    return () => {
      console.log("Demographics page unmounted")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted", formData)
    setIsSubmitting(true)
    setError(null)
    try {
      await saveSectionData(formData.email, "Demographics", formData)
      localStorage.setItem("email", formData.email)
      localStorage.setItem("age", formData.age)
      localStorage.setItem("gender", formData.gender)
      router.push("/demographics-l2")
    } catch (error) {
      console.error("Error saving demographics data:", error)
      if (error instanceof Error) {
        setError(`Error saving data: ${error.message}`)
      } else {
        setError("An unknown error occurred while saving data")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <ProgressBar currentStep={1} totalSteps={7} />
      <h1 className="text-3xl font-bold mb-6 text-primary">Basic Demographics</h1>
      <h2 className="text-xl mb-8">Who's the Player Behind the Screen?</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <Label htmlFor="ign">In-Game Name (IGN)</Label>
          <Input
            id="ign"
            value={formData.ign}
            onChange={(e) => setFormData({ ...formData, ign: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Age</Label>
          <RadioGroup value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })} required>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="under18" id="under18" />
              <Label htmlFor="under18">Under 18</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="18-24" id="18-24" />
              <Label htmlFor="18-24">18-24</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="25-34" id="25-34" />
              <Label htmlFor="25-34">25-34</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="35+" id="35+" />
              <Label htmlFor="35+">35+</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label>Gender</Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => setFormData({ ...formData, gender: value })}
            required
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>
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

