"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface MicrophoneRecorderProps {
  onTranscribe: (text: string) => void
  isLoading?: boolean
}

export function MicrophoneRecorder({ onTranscribe, isLoading = false }: MicrophoneRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        await transcribeAudio(audioBlob)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Microphone access denied")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsProcessing(true)
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData()
      formData.append("file", audioBlob, "recording.wav")

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Transcription failed")
      }

      const data = await response.json()
      onTranscribe(data.text)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transcription error")
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">Record Audio</label>
        <div
          className={`p-6 border-2 rounded-lg transition-all ${
            isRecording ? "border-destructive bg-destructive/5 animate-pulse" : "border-border bg-card"
          }`}
        >
          <div className="text-center">
            {isRecording && (
              <div className="mb-3 flex justify-center">
                <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
              </div>
            )}
            <p className="text-sm text-muted-foreground mb-4">{isRecording ? "Recording..." : "Ready to record"}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive rounded-md text-sm text-destructive">
          {error}
        </div>
      )}

      {isRecording ? (
        <Button
          onClick={stopRecording}
          disabled={isProcessing || isLoading}
          variant="destructive"
          className="w-full gap-2"
        >
          ⏹️ Stop Recording
        </Button>
      ) : (
        <Button onClick={startRecording} disabled={isProcessing || isLoading} className="w-full gap-2">
          {isProcessing || isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>🎤 Start Recording</>
          )}
        </Button>
      )}
    </div>
  )
}
