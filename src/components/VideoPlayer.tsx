"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface VideoPlayerProps {
  videoUrl: string
  title: string
  duration?: number
  fileSize?: number
  description?: string
  thumbnail?: string
}

// Detect and extract video source type
function getVideoSource(url: string): { type: "youtube" | "vimeo" | "web"; embedUrl?: string; id?: string } {
  // YouTube patterns
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const youtubeIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (youtubeIdMatch?.[1]) {
      return {
        type: "youtube",
        id: youtubeIdMatch[1],
        embedUrl: `https://www.youtube.com/embed/${youtubeIdMatch[1]}`,
      }
    }
  }
  // Vimeo patterns
  if (url.includes("vimeo.com")) {
    const vimeoIdMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoIdMatch?.[1]) {
      return {
        type: "vimeo",
        id: vimeoIdMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoIdMatch[1]}`,
      }
    }
  }
  // Web video (mp4, webm, etc.)
  return { type: "web" }
}

export default function VideoPlayer({
  videoUrl,
  title,
  duration,
  fileSize,
  description,
  thumbnail,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const videoSource = getVideoSource(videoUrl)
  const isExternalVideo = videoSource.type !== "web"

  // Format time display
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (!bytes) return ""
    const mb = bytes / (1024 * 1024)
    return mb > 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(2)} KB`
  }

  // Play/Pause handler
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Volume handler
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen()
          setIsFullscreen(true)
        }
      } else {
        if (document.fullscreenElement) {
          document.exitFullscreen()
          setIsFullscreen(false)
        }
      }
    }
  }

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(totalTime, currentTime + seconds))
    }
  }

  // Progress bar handler
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  // Update current time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  // Update total time when metadata loads
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setTotalTime(videoRef.current.duration)
      setIsLoading(false)
    }
  }

  // Handle video end
  const handleVideoEnd = () => {
    setIsPlaying(false)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      setCurrentTime(0)
    }
  }

  // Handle errors
  const handleError = () => {
    setError("Failed to load video. Please check the URL or try again later.")
    setIsLoading(false)
  }

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  return (
    <Card className={isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""}>
      <CardHeader className={isFullscreen ? "hidden" : ""}>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className={isFullscreen ? "p-0 h-screen flex flex-col justify-center" : "p-0"}>
        <div
          ref={containerRef}
          className={`relative bg-black group ${isFullscreen ? "w-full h-full" : "w-full aspect-video"}`}
        >
          {/* External Video Embed (YouTube/Vimeo) */}
          {isExternalVideo && videoSource.embedUrl ? (
            <iframe
              src={videoSource.embedUrl}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : null}

          {/* Web Video Element */}
          {!isExternalVideo && !error ? (
            <video
              ref={videoRef}
              src={videoUrl}
              poster={thumbnail}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleVideoEnd}
              onError={handleError}
              className="w-full h-full object-contain"
            />
          ) : null}

          {/* Error Message */}
          {error && !isExternalVideo ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <Button variant="outline" onClick={() => setError(null)}>
                  Sorry, Try Again
                </Button>
              </div>
            </div>
          ) : null}

          {/* Loading Spinner */}
          {isLoading && !error && !isExternalVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
            </div>
          )}

          {/* Play Button Overlay */}
          {!isPlaying && !isLoading && !error && !isExternalVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all cursor-pointer group">
              <button
                onClick={togglePlay}
                title="Play video"
                className="bg-white rounded-full p-4 hover:bg-gray-200 transition-colors"
              >
                <Play className="text-black" size={32} fill="currentColor" />
              </button>
            </div>
          )}

          {/* Controls (only for web videos) */}
          {!isExternalVideo && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Progress Bar */}
            <div className="mb-3">
              <input
                type="range"
                title="Video progress"
                min="0"
                max={totalTime}
                value={currentTime}
                onChange={handleProgressChange}
                className="w-full h-1 bg-gray-600 rounded cursor-pointer accent-red-600"
              />
            </div>

            {/* Control Buttons and Time */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                {/* Play/Pause Button */}
                <Button
                  onClick={togglePlay}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                </Button>

                {/* Skip Buttons */}
                <Button
                  onClick={() => skip(-10)}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-white/20"
                >
                  <SkipBack size={20} />
                </Button>

                <Button
                  onClick={() => skip(10)}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-white/20"
                >
                  <SkipForward size={20} />
                </Button>

                {/* Time Display */}
                <div className="text-sm font-medium ml-2">
                  {formatTime(currentTime)} / {formatTime(totalTime)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Volume Control */}
                <div className="flex items-center gap-1">
                  <Button
                    onClick={toggleMute}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </Button>
                  <input
                    type="range"
                    title="Volume control"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-gray-600 rounded cursor-pointer accent-white"
                  />
                </div>

                {/* Fullscreen Button */}
                <Button
                  onClick={toggleFullscreen}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-white/20"
                >
                  <Maximize size={20} />
                </Button>
              </div>
            </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Video Info */}
      {!isFullscreen && (
        <CardContent className="pt-4 border-t space-y-4">
          {(duration || fileSize) && !isExternalVideo && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              {duration && (
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-semibold">{formatTime(duration)}</p>
                </div>
              )}
              {fileSize && (
                <div>
                  <p className="text-gray-500">File Size</p>
                  <p className="font-semibold">{formatFileSize(fileSize)}</p>
                </div>
              )}
            </div>
          )}
          {isExternalVideo && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <ExternalLink size={16} />
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Open in {videoSource.type === "youtube" ? "YouTube" : "Vimeo"}
              </a>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
