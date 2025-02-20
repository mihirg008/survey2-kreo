import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  console.log("Rendering Home page")
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6 text-primary">Kreo Ultimate Gamer Survey</h1>
      <h2 className="text-2xl mb-8">Are You Ready to Respawn?</h2>
      <p className="text-center max-w-2xl mb-8">
        Hey there, legend! Before we drop into this survey, a quick heads-up: this isn't some boring questionnaire—it's
        a fun, interactive deep dive into your gaming soul. Answer honestly, and we promise no lag, just pure insights.
        Let's roll!
      </p>
      <Link href="/demographics">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Start Survey</Button>
      </Link>
    </main>
  )
}

