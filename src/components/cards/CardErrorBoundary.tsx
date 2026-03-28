'use client';

import React from 'react';

interface Props {
  cardType?: string;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class CardErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn(
      `[CardErrorBoundary] ${this.props.cardType ?? 'unknown'} card crashed:`,
      error.message,
      info.componentStack
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="h-full flex items-center justify-center rounded-xl"
          style={{
            background: 'var(--theme-card-bg, rgba(255,255,255,0.04))',
            border: '1px solid rgba(255,100,100,0.15)',
          }}
          role="alert"
        >
          <span className="text-xs text-white/30 font-data uppercase">
            {this.props.cardType ?? 'Card'} failed to render
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}
