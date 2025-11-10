"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { MicrophoneRecorder } from "@/components/microphone-recorder"
import { TranscriptionDisplay } from "@/components/transcription-display"

export default function Home() {
  const [transcriptionText, setTranscriptionText] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTranscribe = (text: string) => {
    setTranscriptionText(text)
  }

  const handleClear = () => {
    setTranscriptionText(null)
  }

  return (
    <main className="w-full min-h-screen overflow-hidden bg-black">
      {/* Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 text-balance">Voice to Text</h1>
            <p className="text-lg text-blue-200 text-balance">
              Upload audio files or record directly to transcribe using AI
            </p>
          </div>

          {transcriptionText ? (
            <div className="flex justify-center">
              <TranscriptionDisplay text={transcriptionText} onClear={handleClear} />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 items-start justify-center">
              <div className="flex justify-center">
                <FileUpload onTranscribe={handleTranscribe} isLoading={isLoading} />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
