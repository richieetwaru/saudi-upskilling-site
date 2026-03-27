'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useVoiceSessionStore } from '@/lib/stores/voice-session-store';
import { assets } from '@/assets';

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

  // Wake on mouse move (start dimmed, brighten on interaction)
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

  // Graceful video reveal
  const [videoRevealed, setVideoRevealed] = useState(false);
  useEffect(() => {
    if (hasVideoTrack && !videoRevealed) {
      const timer = setTimeout(() => setVideoRevealed(true), 300);
      return () => clearTimeout(timer);
    }
    if (!hasVideoTrack) setVideoRevealed(false);
  }, [hasVideoTrack, videoRevealed]);

  // When avatar is toggled off: show empty bg
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
      {/* Base hero background — always present */}
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

      {/* Grayscale hero overlay — when connected with avatar off */}
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

      {/* Avatar video — crossfades in over the hero background */}
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

      {/* Pulsing overlay — visible while connecting or thinking */}
      {showPulse && !hasVideoTrack && (
        <div
          className="hero-pulse-overlay"
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
            filter: `brightness(var(--theme-video-brightness)) saturate(var(--theme-video-saturate))`,
          }}
        />
      )}
    </>
  );
}
