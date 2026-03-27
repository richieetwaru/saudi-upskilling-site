import React from 'react';

interface Step {
  label: string;
  done?: boolean;
}

interface OnboardingCardProps {
  title?: string;
  subtitle?: string;
  steps?: Step[];
  currentStep?: number;
  message?: string;
  onAction?: (phrase: string) => void;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  title = 'Welcome',
  subtitle,
  steps = [],
  currentStep = 0,
  message,
  onAction,
}) => {
  const totalSteps = steps.length;
  const completedSteps = steps.filter(s => s.done).length;

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl" style={{ background: 'rgba(255,255,255,0.95)', color: '#1A3A4B' }}>
      <div className="p-5 flex flex-col h-full">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#C8962E' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="font-hero text-xl font-bold" style={{ color: '#1A3A4B' }}>{title}</h3>
        {subtitle && <p className="font-voice text-sm mt-1" style={{ color: '#5A6B75' }}>{subtitle}</p>}

        {/* Steps */}
        {totalSteps > 0 && (
          <div className="mt-4 space-y-3 flex-1">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-data font-bold"
                  style={{
                    background: step.done ? '#C8962E' : i === currentStep ? 'rgba(200,150,46,0.15)' : '#F0F0F0',
                    color: step.done ? '#fff' : i === currentStep ? '#C8962E' : '#5A6B75',
                    border: i === currentStep && !step.done ? '2px solid #C8962E' : 'none',
                  }}
                >
                  {step.done ? '✓' : i + 1}
                </div>
                <span
                  className="font-voice text-sm"
                  style={{ color: step.done ? '#5A6B75' : '#1A3A4B', textDecoration: step.done ? 'line-through' : 'none' }}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Message */}
        {message && <p className="font-voice text-sm mt-3" style={{ color: '#5A6B75' }}>{message}</p>}

        {/* Progress + Button */}
        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid #E0E0E0' }}>
          {totalSteps > 0 && (
            <span className="font-data text-xs" style={{ color: '#5A6B75' }}>{completedSteps}/{totalSteps} complete</span>
          )}
          <button
            onClick={() => onAction?.('Continue onboarding')}
            className="rounded-full px-5 py-2 text-xs font-data font-bold uppercase tracking-wider"
            style={{ background: '#C8962E', color: '#fff' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
