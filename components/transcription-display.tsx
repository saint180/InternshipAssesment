"use client"

import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface TranscriptionDisplayProps {
  text: string
  onClear: () => void
}

export function TranscriptionDisplay({ text, onClear }: TranscriptionDisplayProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-2xl space-y-3">
      <div className="p-4 bg-card border border-border rounded-lg">
        <p className="text-sm font-medium text-foreground mb-3">Transcription Result</p>
        <div className="bg-background rounded p-3 min-h-24 max-h-64 overflow-y-auto">
          <p className="text-sm text-foreground whitespace-pre-wrap">{text}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={copyToClipboard} variant="outline" className="gap-2 bg-transparent">
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </Button>
        <Button onClick={onClear} variant="outline">
          Clear
        </Button>
      </div>
    </div>
  )
}
