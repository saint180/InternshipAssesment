import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      console.error("[v0] GROQ_API_KEY is not set in environment variables")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const groqFormData = new FormData()
    groqFormData.append("file", file)
    groqFormData.append("model", "whisper-large-v3-turbo")

    const groqResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: groqFormData,
    })

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text()
      console.error("[v0] Groq API error:", groqResponse.status, errorData)
      return NextResponse.json({ error: `Transcription failed: ${groqResponse.status}` }, { status: 500 })
    }

    const result = await groqResponse.json()

    return NextResponse.json({
      text: result.text || "",
    })
  } catch (error) {
    console.error("[v0] Transcription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
