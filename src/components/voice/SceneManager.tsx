'use client';

import { useVoiceSessionStore } from '@/lib/stores/voice-session-store';
import GridView from '@/components/cards/GridView';
import { LAYOUT_MAP } from '@/components/layouts';
import { Suspense, useCallback, useMemo } from 'react';

/**
 * SceneManager — Renders the current scene as the main page content.
 */
export function SceneManager() {
  const currentScene = useVoiceSessionStore((s) => s.currentScene);
  const sceneActive = useVoiceSessionStore((s) => s.sceneActive);
  const navigateSceneBack = useVoiceSessionStore((s) => s.navigateSceneBack);
  const sceneHistory = useVoiceSessionStore((s) => s.sceneHistory);
  const tellAgent = useVoiceSessionStore((s) => s.tellAgent);
  const skeletonLayout = useVoiceSessionStore((s) => s.skeletonLayout);

  const handleAction = useCallback(
    (phrase: string) => {
      tellAgent(phrase);
    },
    [tellAgent],
  );

  const customLayout = useMemo(() => {
    const raw = currentScene?.layout;
    if (!raw) return null;
    const match = raw.match(/^layout:(.+)$/i);
    if (!match) return null;
    const name = match[1].toLowerCase().trim();
    return LAYOUT_MAP[name] || null;
  }, [currentScene?.layout]);

  if (!sceneActive && !currentScene) return null;
  if (!currentScene && !skeletonLayout) return null;

  const hasHistory = sceneHistory.length > 1;

  return (
    <div id="scene-root" className="relative flex flex-col w-full h-full min-h-0 text-white">

      {/* Header — badge + optional back button */}
      <header className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 shrink-0">
        <div className="flex items-center gap-3">
          {hasHistory && (
            <button
              onClick={navigateSceneBack}
              className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back
            </button>
          )}
        </div>
        {currentScene?.badge && (
          <span className="text-xs font-medium text-white/50 tracking-wider uppercase font-data">
            {currentScene.badge}
          </span>
        )}
      </header>

      {/* Title area */}
      {(currentScene?.title || currentScene?.subtitle) && (
        <div className="relative z-10 px-4 md:px-6 pb-2 shrink-0">
          {currentScene?.title && (
            <h1 className="text-xl md:text-2xl font-bold tracking-tight font-hero">
              {currentScene.title}
            </h1>
          )}
          {currentScene?.subtitle && (
            <p className="text-sm text-white/60 mt-1 font-voice">
              {currentScene.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Main content */}
      <main className="relative z-10 flex-1 px-0 md:px-6 pb-4 overflow-auto min-h-0">
        {skeletonLayout ? (
          <MobileSkeleton />
        ) : customLayout && currentScene ? (
          <Suspense
            fallback={<div className="animate-pulse h-full bg-white/5 rounded-xl" />}
          >
            {(() => {
              const LayoutComponent = customLayout;
              return (
                <LayoutComponent
                  cards={currentScene.cards || []}
                  badge={currentScene.badge}
                  layout={currentScene.layout}
                  maxRows={currentScene.maxRows}
                />
              );
            })()}
          </Suspense>
        ) : currentScene?.cards && currentScene.cards.length > 0 ? (
          <Suspense
            fallback={<div className="animate-pulse h-full bg-white/5 rounded-xl" />}
          >
            <GridView
              badge={currentScene.badge}
              layout={currentScene.layout}
              cards={currentScene.cards}
              maxRows={currentScene.maxRows}
            />
          </Suspense>
        ) : (
          <div className="flex items-center justify-center h-full text-white/40 font-data">
            Awaiting data...
          </div>
        )}
      </main>

      {/* Footer */}
      {(currentScene?.footerLeft || currentScene?.footerRight) && (
        <footer className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 text-xs text-white/40 shrink-0 font-data">
          <span>{currentScene.footerLeft || ''}</span>
          <span>{currentScene.footerRight || ''}</span>
        </footer>
      )}
    </div>
  );
}

/** Simple mobile-friendly skeleton — single column shimmer cards */
function MobileSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-4 md:px-0 pt-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-xl skeleton-shimmer-bg animate-skeleton-bounce"
          style={{
            height: '120px',
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </div>
  );
}
