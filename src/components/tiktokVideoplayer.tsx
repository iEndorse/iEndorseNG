
import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"

interface TikTokVideoPlayerProps {
  src: string
  className?: string
}

export default function TikTokVideoPlayer({ src, className = "" }: TikTokVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100
      setProgress(progress)
    }

    const updateDuration = () => {
      setDuration(video.duration)
    }

    video.addEventListener("timeupdate", updateProgress)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("ended", () => setIsPlaying(false))

    return () => {
      video.removeEventListener("timeupdate", updateProgress)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("ended", () => setIsPlaying(false))
    }
  }, [])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const newTime = (clickX / width) * video.duration

    video.currentTime = newTime
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div
      className={`relative group overflow-hidden bg-black ${className}`}
      style={{ borderRadius: "0.5rem" }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover cursor-pointer"
        muted={isMuted}
        playsInline
        loop
        onClick={togglePlayPause}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause Overlay */}
      <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={togglePlayPause}>
        <div className={`transition-opacity duration-300 ${!isPlaying || showControls ? "opacity-100" : "opacity-0"}`}>
          {!isPlaying && (
            <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
              <Play className="w-12 h-12 text-white fill-white" />
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div className="h-full bg-white transition-all duration-100" style={{ width: `${progress}%` }} />
        <div className="absolute top-0 left-0 right-0 h-full cursor-pointer" onClick={handleProgressClick} />
      </div>

      {/* Controls Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}>
        {/* Top Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleMute}
            className="bg-black/50 rounded-full p-2 backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="bg-black/50 rounded-full p-2 backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            <Maximize className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayPause}
              className="bg-black/50 rounded-full p-2 backdrop-blur-sm hover:bg-black/70 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white" />
              )}
            </button>
          </div>

          {/* Time Display */}
          <div className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
          </div>
        </div>
      </div>

      {/* Interactive Progress Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-3 cursor-pointer transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleProgressClick}
      >
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
          <div className="h-full bg-white transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
