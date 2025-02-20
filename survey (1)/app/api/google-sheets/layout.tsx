import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { logComponentTree } from "@/lib/debugUtils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kreo Ultimate Gamer Survey",
  description: "Are You Ready to Respawn?",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log("Rendering RootLayout")
  logComponentTree(children)
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'