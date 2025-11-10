"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface FileUploadProps {
  onTranscribe: (text: string) => void
  isLoading?: boolean
}

export function FileUpload({ onTranscribe, isLoading = false }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a file")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Transcription failed")
      }

      const data = await response.json()
      onTranscribe(data.text)
      setFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">Upload Audio File</label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          disabled={uploading || isLoading}
          className="block w-full text-sm text-foreground
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-primary-foreground
            hover:file:bg-primary/90
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive rounded-md text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" disabled={!file || uploading || isLoading} className="w-full gap-2">
        {uploading || isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Transcribing...
          </>
        ) : (
          <>Transcribe File</>
        )}
      </Button>
    </form>
  )
}
