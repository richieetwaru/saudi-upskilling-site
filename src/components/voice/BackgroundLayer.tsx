'use client';

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useVoiceSessionStore } from '@/lib/stores/voice-session-store';
import { assets } from '@/assets';
import { playAvatarRevealSound } from '@/utils/soundGenerator';

function generateSparkles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 40 + Math.random() * 50,
    y: 10 + Math.random() * 70,
    size: 3 + Math.random() * 8,
    delay: Math.random() * 0.8,
    duration: 1.2 + Math.random() * 1.0,
  }));
}

export function BackgroundLayer() {
  const sessionState = useVoiceSessionStore((s) => s.sessionState);
  const agentState = useVoiceSessionStore((s) => s.agentState);
  const avatarVideoTrack = useVoiceSessionStore((s) => s.avatarVideoTrack);
  const avatarEnabled = useVoiceSessionStore((s) => s.avatarEnabled);
  const avatarVisible = useVoiceSessionStore((s) => s.avatarVisible);
  const avatarThumbnailUrl = useVoiceSessionStore((s) => s.avatarThumbnailUrl);

  const isConnected = sessionState === 'connected';
  const isConnecting = sessionState === 'connecting';
  const isThinking = isConnected && agentState === 'thinking';
  const showPulse = isConnecting || isThinking;
  const hasVideoTrack = avatarEnabled && avatarVisible && !!avatarVideoTrack;

  const [isAwake, setIsAwake] = useState(false);
  useEffect(() => {
    if (isConnected || isConnecting) {
      setIsAwake(true);
      return;
    }
    const handleMouseMove = () => setIsAwake(true);
    window.addEventListener('mousemove', handleMouseMove, { once: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isConnected, isConnecting]);

  const [videoRevealed, setVideoRevealed] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const revealPlayedRef = useRef(false);
  const sparkles = useMemo(() => generateSparkles(16), []);

  useEffect(() => {
    if (hasVideoTrack && !videoRevealed) {
      const timer = setTimeout(() => {
        setVideoRevealed(true);
        if (!revealPlayedRef.current) {
          revealPlayedRef.current = true;
          playAvatarRevealSound(0.7);
          setShowSparkles(true);
          setTimeout(() => setShowSparkles(false), 3000);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
    if (!hasVideoTrack) setVideoRevealed(false);
  }, [hasVideoTrack, videoRevealed]);

  const avatarOff = !avatarVisible && isConnected;
  const bgImage = avatarOff
    ? assets.backgroundEmpty
    : (avatarThumbnailUrl || assets.backgroundHero);

  const videoRef = useCallback(
    (el: HTMLVideoElement | null) => {
      if (el && avatarVideoTrack) {
        avatarVideoTrack.attach(el);
      }
    },
    [avatarVideoTrack]
  );

  return (
    <>
      {/* Base hero background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: 'right top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          minWidth: '100vw',
          minHeight: '100vh',
          opacity: videoRevealed ? 0 : isConnected ? 1 : isAwake ? 0.85 : 0.6,
          filter: isAwake
            ? `brightness(var(--theme-video-brightness)) saturate(var(--theme-video-saturate))`
            : `brightness(0.5) saturate(0.3)`,
          transition: 'opacity 1.5s ease, filter 1.2s ease',
        }}
      />

      {/* Grayscale overlay — when connected with avatar off */}
      {avatarOff && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -1,
            pointerEvents: 'none',
            backgroundImage: `url(${avatarThumbnailUrl || assets.backgroundHero})`,
            backgroundPosition: 'right top',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            minWidth: '100vw',
            minHeight: '100vh',
            opacity: 0.25,
            filter: 'saturate(0) brightness(0.6)',
            transition: 'opacity 1s ease, filter 1s ease',
          }}
        />
      )}

      {/* Gold reveal flash */}
      {hasVideoTrack && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -1,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 60% 40%, rgba(200, 150, 46, 0.5) 0%, rgba(200, 150, 46, 0.15) 50%, transparent 80%)',
            opacity: videoRevealed ? 0 : 1,
            transition: 'opacity 2s ease',
          }}
        />
      )}

      {/* Avatar video */}
      {hasVideoTrack && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -1,
            pointerEvents: 'none',
            opacity: videoRevealed ? 1 : 0,
            transition: 'opacity 1.5s ease',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'right center',
              filter: `brightness(var(--theme-video-brightness)) saturate(var(--theme-video-saturate))`,
              transition: 'filter 0.4s ease',
            }}
          />
        </div>
      )}

      {/* Sparkle particles on avatar reveal */}
      {showSparkles && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          {sparkles.map((s) => (
            <div
              key={s.id}
              style={{
                position: 'absolute',
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(200,150,46,0.6) 50%, transparent 100%)',
                boxShadow: `0 0 ${s.size * 2}px rgba(200,150,46,0.5), 0 0 ${s.size * 4}px rgba(255,255,255,0.2)`,
                animation: `sparkle-float ${s.duration}s cubic-bezier(0.22, 1, 0.36, 1) ${s.delay}s both`,
              }}
            />
          ))}
        </div>
      )}

      {/* Pulsing overlay — connecting or thinking */}
      {showPulse && !hasVideoTrack && (
        <div
          className="hero-pulse-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -1,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
}
