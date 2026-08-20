import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeRemaining(targetIso: string): TimeRemaining {
  const total = Date.parse(targetIso) - Date.now();
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, isPast: false };
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  className = '',
  size = 'md',
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => calculateTimeRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20 ${className}`}>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span>Event is Live or Concluded</span>
      </div>
    );
  }

  const boxSize = size === 'lg' ? 'p-3 min-w-[64px]' : size === 'sm' ? 'p-1.5 min-w-[40px]' : 'p-2.5 min-w-[52px]';
  const numSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-lg';
  const labelSize = size === 'sm' ? 'text-[9px]' : 'text-[10px]';

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 select-none ${className}`}>
      <div className="hidden sm:flex items-center mr-1 text-slate-400 dark:text-slate-500">
        <Clock className="w-4 h-4" />
      </div>

      {/* Days */}
      <div className={`flex flex-col items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 shadow-sm ${boxSize}`}>
        <span className={`font-mono font-bold leading-none ${numSize}`}>
          {String(timeLeft.days).padStart(2, '0')}
        </span>
        <span className={`uppercase font-medium text-slate-400 mt-1 tracking-wider ${labelSize}`}>
          Days
        </span>
      </div>

      <span className="text-slate-400 font-bold">:</span>

      {/* Hours */}
      <div className={`flex flex-col items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 shadow-sm ${boxSize}`}>
        <span className={`font-mono font-bold leading-none ${numSize}`}>
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className={`uppercase font-medium text-slate-400 mt-1 tracking-wider ${labelSize}`}>
          Hours
        </span>
      </div>

      <span className="text-slate-400 font-bold">:</span>

      {/* Minutes */}
      <div className={`flex flex-col items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 shadow-sm ${boxSize}`}>
        <span className={`font-mono font-bold leading-none ${numSize}`}>
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className={`uppercase font-medium text-slate-400 mt-1 tracking-wider ${labelSize}`}>
          Mins
        </span>
      </div>

      <span className="text-slate-400 font-bold">:</span>

      {/* Seconds */}
      <div className={`flex flex-col items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 shadow-sm ${boxSize}`}>
        <span className={`font-mono font-bold leading-none text-indigo-400 ${numSize}`}>
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className={`uppercase font-medium text-slate-400 mt-1 tracking-wider ${labelSize}`}>
          Secs
        </span>
      </div>
    </div>
  );
};
