"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProgressBar from "@/components/ProgressBar"
import { saveSectionData } from "@/lib/googleSheets"
import { motion } from "framer-motion"
import { gamesList } from "@/lib/gamesList"

export default function GamingPreferences() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    platforms: [] as string[],
    favoriteGames: ["", "", ""],
    nextExcitedGame: "",
    spendMoney: "",
    upgradeFrequency: "",
    purchaseLocation: "",
    familiarWithKreo: "",
    setupSpending: "",
    gearFeatures: ["", "", "", "", ""],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Gaming Preferences form submitted", formData)
    setIsSubmitting(true)
    setError(null)
    try {
      const email = localStorage.getItem("email") || ""
      await saveSectionData(email, "Gaming Preferences", formData)
      router.push("/gaming-level-2")
    } catch (error) {
      console.error("Error saving gaming preferences data:", error)
      setError("There was an error saving your data. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePlatformChange = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }))
  }

  const gearFeatureOptions = ["Performance", "Aesthetics", "Durability", "Price", "Brand"]

  const getRemainingGearFeatures = (index: number) => {
    const selectedFeatures = formData.gearFeatures.slice(0, index)
    return gearFeatureOptions.filter((feature) => !selectedFeatures.includes(feature))
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-gray-900">
      <ProgressBar currentStep={3} totalSteps={7} />
      <h1 className="text-3xl font-bold mb-6 text-primary">Gaming Preferences & Setup</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <Label>What platforms do you game on?</Label>
          {["PC", "Mobile", "Console"].map((platform) => (
            <div key={platform} className="flex items-center space-x-2">
              <Checkbox
                id={platform}
                checked={formData.platforms.includes(platform)}
                onCheckedChange={() => handlePlatformChange(platform)}
              />
              <Label htmlFor={platform}>{platform}</Label>
            </div>
          ))}
        </div>
        <div>
          <Label>Top 3 Favorite Games</Label>
          {[0, 1, 2].map((index) => (
            <Select
              key={index}
              value={formData.favoriteGames[index]}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  favoriteGames: prev.favoriteGames.map((game, i) => (i === index ? value : game)),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select game #${index + 1}`} />
              </SelectTrigger>
              <SelectContent>
                {gamesList.map((game) => (
                  <SelectItem key={game} value={game}>
                    {game}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
        <div>
          <Label htmlFor="nextExcitedGame">Which upcoming game are you most excited about?</Label>
          <Input
            id="nextExcitedGame"
            value={formData.nextExcitedGame}
            onChange={(e) => setFormData({ ...formData, nextExcitedGame: e.target.value })}
          />
        </div>
        <div>
          <Label>How much money do you spend on gaming per month?</Label>
          <RadioGroup
            value={formData.spendMoney}
            onValueChange={(value) => setFormData({ ...formData, spendMoney: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0-50" id="spend-0-50" />
              <Label htmlFor="spend-0-50">$0 - $50</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="51-100" id="spend-51-100" />
              <Label htmlFor="spend-51-100">$51 - $100</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="101-200" id="spend-101-200" />
              <Label htmlFor="spend-101-200">$101 - $200</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="200+" id="spend-200+" />
              <Label htmlFor="spend-200+">$200+</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label>How often do you upgrade your gaming setup?</Label>
          <Select
            value={formData.upgradeFrequency}
            onValueChange={(value) => setFormData({ ...formData, upgradeFrequency: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="every6months">Every 6 months</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="every2years">Every 2 years</SelectItem>
              <SelectItem value="rarely">Rarely</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Where do you usually purchase gaming gear?</Label>
          <Select
            value={formData.purchaseLocation}
            onValueChange={(value) => setFormData({ ...formData, purchaseLocation: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="onlineRetailers">Online Retailers (Amazon, Newegg, etc.)</SelectItem>
              <SelectItem value="physicalStores">Physical Stores</SelectItem>
              <SelectItem value="brandWebsites">Brand Websites</SelectItem>
              <SelectItem value="gamingEvents">Gaming Events/Conventions</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Are you familiar with Kreo?</Label>
          <RadioGroup
            value={formData.familiarWithKreo}
            onValueChange={(value) => setFormData({ ...formData, familiarWithKreo: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="kreo-yes" />
              <Label htmlFor="kreo-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="kreo-no" />
              <Label htmlFor="kreo-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label>How much have you spent on your current gaming setup?</Label>
          <Select
            value={formData.setupSpending}
            onValueChange={(value) => setFormData({ ...formData, setupSpending: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select amount" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-500">$0 - $500</SelectItem>
              <SelectItem value="501-1000">$501 - $1000</SelectItem>
              <SelectItem value="1001-2000">$1001 - $2000</SelectItem>
              <SelectItem value="2000+">$2000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Rank these features in order of importance when buying gaming gear (1 being most important)</Label>
          {[0, 1, 2, 3, 4].map((index) => (
            <Select
              key={index}
              value={formData.gearFeatures[index]}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  gearFeatures: prev.gearFeatures.map((feature, i) => (i === index ? value : feature)),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select feature #${index + 1}`} />
              </SelectTrigger>
              <SelectContent>
                {getRemainingGearFeatures(index).map((feature) => (
                  <SelectItem key={feature} value={feature}>
                    {feature}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
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

