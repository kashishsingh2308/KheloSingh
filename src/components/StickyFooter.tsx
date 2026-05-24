/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayerId, PLAYERS } from '../types';

interface StickyFooterProps {
  totals: Record<PlayerId, number>;
}

export default function StickyFooter({ totals }: StickyFooterProps) {
  // Extract max and min scores for visual highlights
  const scoreValues = Object.values(totals);
  const allZeros = scoreValues.every((s) => s === 0);

  const maxScore = Math.max(...scoreValues);
  const minScore = Math.min(...scoreValues);

  return (
    <footer className="sticky bottom-0 z-40 w-full border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.03)] px-3 py-2 sm:py-3.5">
      <div className="mx-auto max-w-7xl">
        <div className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase text-center mb-1 font-mono">
          LIVE STANDINGS
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {PLAYERS.map((p) => {
            const score = totals[p.id];
            const isHighest = !allZeros && score === maxScore;
            const isLowest = !allZeros && score === minScore;

            // Define responsive themes for score containers
            let borderClasses = 'border-slate-100 dark:border-slate-800/80';
            let bgClasses = 'bg-slate-50/50 dark:bg-slate-800/25';
            let textClasses = 'text-slate-800 dark:text-slate-100';
            let labelClasses = 'text-slate-500 dark:text-slate-400';
            let statusBadge = null;

            if (isHighest) {
              borderClasses = 'border-emerald-200 dark:border-emerald-850';
              bgClasses = 'bg-emerald-500/8 dark:bg-emerald-950/20';
              textClasses = 'text-emerald-600 dark:text-emerald-400 font-extrabold';
              labelClasses = 'text-emerald-600 dark:text-emerald-500 font-bold';
              statusBadge = (
                <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
              );
            } else if (isLowest) {
              borderClasses = 'border-rose-250 dark:border-rose-850';
              bgClasses = 'bg-rose-500/8 dark:bg-rose-950/20';
              textClasses = 'text-rose-650 dark:text-rose-400 font-extrabold';
              labelClasses = 'text-rose-600 dark:text-rose-500 font-bold';
            }

            return (
              <div
                key={p.id}
                className={`relative flex flex-col items-center justify-center rounded-xl border p-1.5 sm:p-2.5 transition-all duration-300 ${bgClasses} ${borderClasses}`}
              >
                {statusBadge}
                
                {/* Player Short Name */}
                <span className={`text-[11px] sm:text-xs tracking-tight truncate w-full text-center ${labelClasses}`}>
                  {p.name}
                </span>

                {/* Score numeric */}
                <span className={`text-base sm:text-xl font-bold font-mono tracking-tight mt-0.5 ${textClasses}`}>
                  {score > 0 ? `+${score}` : score}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
