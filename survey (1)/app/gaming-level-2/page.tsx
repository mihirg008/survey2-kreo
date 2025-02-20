"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProgressBar from "@/components/ProgressBar"
import { saveSectionData } from "@/lib/googleSheets"
import { motion } from "framer-motion"

export default function GamingLevel2() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    startedGaming: "",
    playFrequency: "",
    gamePreference: "",
    gamePurchase: "",
    modifiedControllers: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Gaming Level 2 form submitted", formData)
    setIsSubmitting(true)
    setError(null)
    try {
      const email = localStorage.getItem("email") || ""
      await saveSectionData(email, "Gaming Level 2", formData)
      router.push("/gaming-lifestyle")
    } catch (error) {
      console.error("Error saving gaming level 2 data:", error)
      setError("There was an error saving your data. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-gray-900">
      <ProgressBar currentStep={4} totalSteps={7} />
      <h1 className="text-3xl font-bold mb-6 text-primary">Gaming Level 2</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <Label>When did you start gaming?</Label>
          <Select
            value={formData.startedGaming}
            onValueChange={(value) => setFormData({ ...formData, startedGaming: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select when you started gaming" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="childhood">Childhood (Before 13)</SelectItem>
              <SelectItem value="teenage">Teenage Years (13-19)</SelectItem>
              <SelectItem value="youngAdult">Young Adult (20-25)</SelectItem>
              <SelectItem value="adult">Adult (26+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>How often do you play games?</Label>
          <RadioGroup
            value={formData.playFrequency}
            onValueChange={(value) => setFormData({ ...formData, playFrequency: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="play-daily" />
              <Label htmlFor="play-daily">Daily</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="play-weekly" />
              <Label htmlFor="play-weekly">A few times a week</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="play-monthly" />
              <Label htmlFor="play-monthly">A few times a month</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rarely" id="play-rarely" />
              <Label htmlFor="play-rarely">Rarely</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label>Do you prefer single-player or multiplayer games?</Label>
          <RadioGroup
            value={formData.gamePreference}
            onValueChange={(value) => setFormData({ ...formData, gamePreference: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="singleplayer" id="pref-singleplayer" />
              <Label htmlFor="pref-singleplayer">Single-player</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multiplayer" id="pref-multiplayer" />
              <Label htmlFor="pref-multiplayer">Multiplayer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="pref-both" />
              <Label htmlFor="pref-both">Both equally</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label>How do you usually purchase games?</Label>
          <Select
            value={formData.gamePurchase}
            onValueChange={(value) => setFormData({ ...formData, gamePurchase: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select purchase method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="digital">Digital Download</SelectItem>
              <SelectItem value="physical">Physical Copy</SelectItem>
              <SelectItem value="subscription">Game Subscription Service</SelectItem>
              <SelectItem value="mix">Mix of Methods</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Have you ever used modified controllers or keyboards?</Label>
          <RadioGroup
            value={formData.modifiedControllers}
            onValueChange={(value) => setFormData({ ...formData, modifiedControllers: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="modified-yes" />
              <Label htmlFor="modified-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="modified-no" />
              <Label htmlFor="modified-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="interested" id="modified-interested" />
              <Label htmlFor="modified-interested">No, but I'm interested</Label>
            </div>
          </RadioGroup>
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

