"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import ProgressBar from "@/components/ProgressBar"
import { saveSectionData } from "@/lib/googleSheets"
import { motion } from "framer-motion"

export default function GamingLifestyle() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    otherInterests: [] as string[],
    customPeripherals: "",
    guiltyGamingFood: "",
    gamingContentTime: "",
    favoriteCreator: "",
    esportsTournament: "",
    createContent: "",
    streamingPlatforms: [] as string[],
    inGamePurchases: "",
    merchandisePurchases: "",
    collectGamingItems: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Gaming Lifestyle form submitted", formData)
    setIsSubmitting(true)
    setError(null)
    try {
      const email = localStorage.getItem("email") || ""
      await saveSectionData(email, "Gaming Lifestyle", formData)
      router.push("/gaming-family")
    } catch (error) {
      console.error("Error saving gaming lifestyle data:", error)
      setError("There was an error saving your data. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const interestOptions = [
    "Anime",
    "Esports",
    "Streaming",
    "Fitness",
    "Technology",
    "Music",
    "Cosplay",
    "Collectibles",
    "Board Games",
    "Fantasy Sports",
    "Coding",
    "Movies",
    "TV Shows",
    "Fashion",
    "Travel",
    "Photography",
  ]

  const handleInterestChange = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      otherInterests: prev.otherInterests.includes(interest)
        ? prev.otherInterests.filter((i) => i !== interest)
        : [...prev.otherInterests, interest],
    }))
  }

  const handleStreamingPlatformChange = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      streamingPlatforms: prev.streamingPlatforms.includes(platform)
        ? prev.streamingPlatforms.filter((p) => p !== platform)
        : [...prev.streamingPlatforms, platform],
    }))
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-gray-900">
      <ProgressBar currentStep={5} totalSteps={7} />
      <h1 className="text-3xl font-bold mb-6 text-primary">Gaming Lifestyle & Habits</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <Label>What other interests do you have besides gaming?</Label>
          <div className="grid grid-cols-2 gap-2">
            {interestOptions.map((interest) => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox
                  id={interest}
                  checked={formData.otherInterests.includes(interest)}
                  onCheckedChange={() => handleInterestChange(interest)}
                />
                <Label htmlFor={interest}>{interest}</Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="customPeripherals">Do you use any custom peripherals?</Label>
          <Input
            id="customPeripherals"
            value={formData.customPeripherals}
            onChange={(e) => setFormData({ ...formData, customPeripherals: e.target.value })}
            placeholder="e.g., custom keyboard, mouse, controller"
          />
        </div>
        <div>
          <Label htmlFor="guiltyGamingFood">What's your guilty pleasure gaming food?</Label>
          <Input
            id="guiltyGamingFood"
            value={formData.guiltyGamingFood}
            onChange={(e) => setFormData({ ...formData, guiltyGamingFood: e.target.value })}
            placeholder="e.g., chips, energy drinks, pizza"
          />
        </div>
        <div>
          <Label>How much time do you spend watching gaming content?</Label>
          <Select
            value={formData.gamingContentTime}
            onValueChange={(value) => setFormData({ ...formData, gamingContentTime: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time spent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1">0-1 hour per day</SelectItem>
              <SelectItem value="1-3">1-3 hours per day</SelectItem>
              <SelectItem value="3-5">3-5 hours per day</SelectItem>
              <SelectItem value="5+">5+ hours per day</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="favoriteCreator">Who's your favorite gaming content creator?</Label>
          <Input
            id="favoriteCreator"
            value={formData.favoriteCreator}
            onChange={(e) => setFormData({ ...formData, favoriteCreator: e.target.value })}
            placeholder="e.g., PewDiePie, Ninja, Pokimane"
          />
        </div>
        <div>
          <Label htmlFor="esportsTournament">What's your favorite esports tournament?</Label>
          <Input
            id="esportsTournament"
            value={formData.esportsTournament}
            onChange={(e) => setFormData({ ...formData, esportsTournament: e.target.value })}
            placeholder="e.g., The International, League of Legends World Championship"
          />
        </div>
        <div>
          <Label>Do you create gaming content?</Label>
          <RadioGroup
            value={formData.createContent}
            onValueChange={(value) => setFormData({ ...formData, createContent: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="create-yes" />
              <Label htmlFor="create-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="create-no" />
              <Label htmlFor="create-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="interested" id="create-interested" />
              <Label htmlFor="create-interested">No, but I'm interested</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label>Which streaming platforms do you use?</Label>
          {["Twitch", "YouTube", "Facebook Gaming", "TikTok"].map((platform) => (
            <div key={platform} className="flex items-center space-x-2">
              <Checkbox
                id={platform}
                checked={formData.streamingPlatforms.includes(platform)}
                onCheckedChange={() => handleStreamingPlatformChange(platform)}
              />
              <Label htmlFor={platform}>{platform}</Label>
            </div>
          ))}
        </div>
        <div>
          <Label>How often do you make in-game purchases?</Label>
          <Select
            value={formData.inGamePurchases}
            onValueChange={(value) => setFormData({ ...formData, inGamePurchases: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="rarely">Rarely</SelectItem>
              <SelectItem value="sometimes">Sometimes</SelectItem>
              <SelectItem value="often">Often</SelectItem>
              <SelectItem value="veryOften">Very Often</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Do you buy gaming merchandise?</Label>
          <RadioGroup
            value={formData.merchandisePurchases}
            onValueChange={(value) => setFormData({ ...formData, merchandisePurchases: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="merch-yes" />
              <Label htmlFor="merch-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="merch-no" />
              <Label htmlFor="merch-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sometimes" id="merch-sometimes" />
              <Label htmlFor="merch-sometimes">Sometimes</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label>Do you collect gaming-related items?</Label>
          <RadioGroup
            value={formData.collectGamingItems}
            onValueChange={(value) => setFormData({ ...formData, collectGamingItems: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="collect-yes" />
              <Label htmlFor="collect-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="collect-no" />
              <Label htmlFor="collect-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="interested" id="collect-interested" />
              <Label htmlFor="collect-interested">No, but I'm interested</Label>
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

