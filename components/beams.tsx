"use client"

import { useEffect, useRef } from "react"

const Beams = ({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = "#0099ff",
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationFrameId: number
    let time = 0

    const drawBeams = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)

      const beamSpacing = (Math.PI * 2) / beamNumber

      for (let i = 0; i < beamNumber; i++) {
        const angle = i * beamSpacing + time * speed * 0.001
        const x1 = Math.cos(angle) * 50
        const y1 = Math.sin(angle) * 50
        const x2 = Math.cos(angle) * 400
        const y2 = Math.sin(angle) * 400

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
        gradient.addColorStop(0, lightColor + "00")
        gradient.addColorStop(0.5, lightColor + "aa")
        gradient.addColorStop(1, lightColor + "00")

        ctx.strokeStyle = gradient
        ctx.lineWidth = beamWidth
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      ctx.restore()
      time += 1
      animationFrameId = requestAnimationFrame(drawBeams)
    }

    drawBeams()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [beamWidth, beamNumber, lightColor, speed, rotation])

  return <canvas ref={canvasRef} className="beams-container fixed inset-0 w-full h-full" />
}

export default Beams
