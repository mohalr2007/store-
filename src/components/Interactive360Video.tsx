"use client";

import React, { useRef, useState, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function Interactive360Video({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startVideoTime, setStartVideoTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoaded(true);
      setHasError(false);
      video.currentTime = 0.001; // Force first frame rendering
    };

    const handleError = () => {
      setHasError(true);
      console.error("Erreur de chargement de la vidéo 360:", video.error);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("error", handleError);
    
    // In case it's already loaded (cached)
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.load(); // Force the browser to start loading
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
    };
  }, [src]);

  // Manage Play/Pause based on interaction
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isLoaded) return;

    if (isHovered || isDragging) {
      video.pause();
    } else {
      video.play().catch(() => {
        // Autoplay might be blocked by browser policies
      });
    }
  }, [isHovered, isDragging, isLoaded]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!videoRef.current) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setStartVideoTime(videoRef.current.currentTime);
    
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const rafRef = useRef<number | null>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !videoRef.current || !duration) return;

    const deltaX = e.clientX - startX;
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    
    // Increased sensitivity for faster rotation without needing long drags
    const scrubSensitivity = 4.0; 
    let timeDelta = (deltaX / containerWidth) * duration * scrubSensitivity;

    // We want right drag to rotate one way, left drag to rotate the other way.
    let newTime = startVideoTime + timeDelta;

    // Loop the time
    if (newTime < 0) {
      newTime = duration + (newTime % duration);
    } else if (newTime > duration) {
      newTime = newTime % duration;
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
      }
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative group cursor-ew-resize select-none overflow-hidden touch-none", className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <video 
        ref={videoRef}
        src={src} 
        playsInline
        autoPlay
        loop
        muted
        preload="auto"
        poster={poster}
        crossOrigin="anonymous"
        className="w-full h-full object-cover pointer-events-none"
      />
      
      {/* Overlay hint */}
      {isLoaded && !hasError && !isDragging && (
        <div className={cn(
          "absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 text-[var(--ink)] px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.1em] flex items-center gap-2 shadow-xl backdrop-blur pointer-events-none transition-all duration-300",
          isHovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"
        )}>
          <MoveHorizontal className="w-4 h-4" />
          Glissez pour tourner
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/10 text-red-600 text-xs font-bold text-center p-4">
          <p>⚠️ Erreur de chargement de la vidéo.</p>
          <p className="font-normal opacity-80">Le bucket Supabase "product-videos" est-il public ?</p>
        </div>
      )}
    </div>
  );
}
