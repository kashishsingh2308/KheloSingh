/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronDown, ChevronUp, CheckCircle, Shield, AlertCircle, HelpCircle } from 'lucide-react';
import { PlayerId, PLAYERS, Round, PlayerRoundState } from '../types';
import { calculateRoundScore } from '../utils/scoring';

interface RoundCardProps {
  key?: any;
  round: Round;
  isOpen: boolean;
  onToggle: () => void;
  onUpdateEntry: (playerId: PlayerId, field: keyof PlayerRoundState, value: any) => void;
}

export default function RoundCard({
  round,
  isOpen,
  onToggle,
  onUpdateEntry,
}: RoundCardProps) {
  const isCompleted = PLAYERS.every(
    (p) => round.entries[p.id].actual !== null
  );

  // Helper helper to get visual total bids / actuals for this round
  const totalBids = PLAYERS.reduce((sum, p) => sum + round.entries[p.id].bid, 0);
  const totalActual = PLAYERS.reduce(
    (sum, p) => sum + (round.entries[p.id].actual ?? 0),
    0
  );

  // Increment/Decrement state managers
  const handleBidChange = (pId: PlayerId, currentBid: number, delta: number) => {
    const nextBid = Math.max(2, currentBid + delta);
    onUpdateEntry(pId, 'bid', nextBid);

    // If bid drops below 5, automatically disable and turn off blind bid
    if (nextBid < 5) {
      onUpdateEntry(pId, 'isBlind', false);
    }
  };

  const handleActualChange = (pId: PlayerId, currentActual: number | null, delta: number) => {
    if (currentActual === null) {
      // Initialize to bid or 0 on first tap to be user-friendly
      const initialValue = delta >= 0 ? Math.max(0, round.entries[pId].bid) : 0;
      onUpdateEntry(pId, 'actual', initialValue);
    } else {
      const nextActual = Math.max(0, currentActual + delta);
      onUpdateEntry(pId, 'actual', nextActual);
    }
  };

  const handleClearActual = (pId: PlayerId) => {
    onUpdateEntry(pId, 'actual', null);
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'border-indigo-200 dark:border-indigo-900 shadow-lg shadow-indigo-500/5 bg-white dark:bg-slate-900'
          : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
      }`}
    >
      {/* CARD HEADER (Always visible / Collapsible Toggle button) */}
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3.5 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-800/30 transition-colors focus:outline-none"
      >
        <div className="flex items-center space-x-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-bold transition-all ${
              isCompleted
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400'
                : 'bg-indigo-55/65 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400'
            }`}
          >
            {round.roundNumber}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">
                Round {round.roundNumber}
              </span>
              {isCompleted && (
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              )}
            </div>
            
            {/* Quick summary of current bids vs actuals */}
            <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">
              Sum Bids: <span className="font-mono text-gray-700 dark:text-slate-300">{totalBids}</span>
              {isCompleted && (
                <>
                  {' '}| Sum Wins:{' '}
                  <span className={`font-mono ${totalActual === 13 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                    {totalActual}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Collapsed ledger overview info */}
        <div className="flex items-center space-x-3">
          {!isOpen && (
            <div className="hidden min-[480px]:flex items-center space-x-2 font-mono text-[11px]">
              {PLAYERS.map((p) => {
                const entry = round.entries[p.id];
                const actText = entry.actual !== null ? entry.actual : '-';
                const score = entry.actual !== null ? calculateRoundScore(entry) : null;
                
                // Colorize score if computed
                let scoreColor = 'text-gray-400 dark:text-slate-500';
                if (score !== null) {
                  scoreColor = score > 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400';
                }

                return (
                  <span
                    key={p.id}
                    className="bg-gray-50 dark:bg-slate-800/40 px-2 py-0.5 rounded border border-gray-100 dark:border-slate-800/20"
                  >
                    {p.name[0]}:<span className="text-gray-700 dark:text-slate-300 font-semibold">{entry.bid}➔{actText}</span>
                    {score !== null && (
                      <span className={`ml-1 text-[10px] ${scoreColor}`}>
                        ({score})
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          )}
          
          <div className="text-gray-400 dark:text-slate-500 shrink-0">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </button>

      {/* EXPANDED ENTRY SECTION */}
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-slate-800 content-fade-in bg-gray-50/30 dark:bg-slate-900/10">
          <div className="space-y-4 pt-4">
            {PLAYERS.map((p) => {
              const entry = round.entries[p.id];
              const scoreForRound = entry.actual !== null ? calculateRoundScore(entry) : 0;
              const hasBlindWarning = entry.bid < 5 && entry.isBlind;

              return (
                <div
                  key={p.id}
                  className="rounded-xl border border-gray-150 dark:border-slate-800/60 bg-white dark:bg-slate-850/60 p-3.5 shadow-xs transition-all hover:shadow-md hover:border-gray-200 dark:hover:border-slate-700"
                >
                  {/* Row 1: Player Name & Immediate Score Feedback */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                        {p.name[0]}
                      </div>
                      <span className="font-bold text-slate-850 dark:text-white text-sm sm:text-base">
                        {p.name}
                      </span>
                    </div>

                    {/* Real-Time Score Feedback Indicator */}
                    {entry.actual !== null ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mr-1">
                          Score:
                        </span>
                        <span
                          className={`font-mono text-sm font-bold px-2 py-0.5 rounded-md ${
                            scoreForRound > 0
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30'
                          }`}
                        >
                          {scoreForRound > 0 ? `+${scoreForRound}` : scoreForRound}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-sans text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-md border border-amber-100/40">
                        Pending Actual
                      </span>
                    )}
                  </div>

                  {/* Row 2: Incremental Input Steppers */}
                  <div className="grid grid-cols-1 select-none min-[380px]:grid-cols-2 gap-3.5">
                    {/* Bids Column */}
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-slate-500 mb-1.5 font-mono">
                        Bid (Min 2)
                      </label>
                      <div className="flex items-center justify-between h-11 bg-gray-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200/60 dark:border-slate-700/60">
                        <button
                          type="button"
                          disabled={entry.bid <= 2}
                          onClick={() => handleBidChange(p.id, entry.bid, -1)}
                          className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-700 dark:active:bg-slate-600 disabled:opacity-25 transition-colors font-bold text-lg"
                        >
                          −
                        </button>
                        <span className="font-mono text-base font-bold text-gray-800 dark:text-slate-100">
                          {entry.bid}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleBidChange(p.id, entry.bid, 1)}
                          className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-700 dark:active:bg-slate-600 transition-colors font-bold text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Actual Hands Won Column */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5 font-mono">
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-slate-500">
                          Actual Hands Won
                        </label>
                        {entry.actual !== null && (
                          <button
                            type="button"
                            onClick={() => handleClearActual(p.id)}
                            className="text-[9px] font-bold text-red-500 hover:text-red-600 hover:underline uppercase tracking-wider"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      
                      {entry.actual === null ? (
                        <button
                          type="button"
                          onClick={() => handleActualChange(p.id, null, 0)}
                          className="w-full h-11 text-xs font-bold text-indigo-650 bg-indigo-50/50 hover:bg-indigo-50 active:scale-98 border border-dashed border-indigo-200 dark:text-indigo-400 dark:bg-indigo-950/20 dark:border-indigo-900/60 rounded-xl transition-all"
                        >
                          + Record Hands Won
                        </button>
                      ) : (
                        <div className="flex items-center justify-between h-11 bg-gray-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200/60 dark:border-slate-700/60 animate-fade-in-shorter">
                          <button
                            type="button"
                            disabled={entry.actual <= 0}
                            onClick={() => handleActualChange(p.id, entry.actual, -1)}
                            className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-700 dark:active:bg-slate-600 disabled:opacity-25 transition-colors font-bold text-lg"
                          >
                            −
                          </button>
                          <span className="font-mono text-base font-bold text-gray-800 dark:text-slate-100">
                            {entry.actual}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleActualChange(p.id, entry.actual, 1)}
                            className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 active:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-700 dark:active:bg-slate-600 transition-colors font-bold text-lg"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Blind Bid Toggle Option */}
                  <div className="mt-3.5 flex items-center justify-between border-t border-gray-100/70 dark:border-slate-800/50 pt-3">
                    <div className="flex items-center space-x-2">
                      <Shield className={`h-4 w-4 ${entry.bid >= 5 ? 'text-amber-500' : 'text-gray-300 dark:text-slate-600'}`} />
                      <div>
                        <span className={`text-xs font-semibold ${entry.bid >= 5 ? 'text-gray-700 dark:text-slate-300' : 'text-gray-400 dark:text-slate-500'}`}>
                          Optional "Blind Bid"
                        </span>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500">
                          {entry.bid >= 5 ? 'Exact win provides 20x Bid' : 'Disabled (Requires Bid ≥ 5)'}
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={entry.isBlind && entry.bid >= 5}
                        disabled={entry.bid < 5}
                        onChange={(e) => onUpdateEntry(p.id, 'isBlind', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500 disabled:opacity-40"></div>
                    </label>
                  </div>

                  {/* Realtime scoring details card helper */}
                  {entry.actual !== null && (
                    <div className="mt-2 text-[10px] text-gray-400 dark:text-slate-500 flex items-center space-x-1 font-sans">
                      <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {entry.isBlind && entry.bid >= 5 ? (
                          entry.actual === entry.bid ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Matched blind! Earned {entry.bid} × 20 = +{scoreForRound} pts.</span>
                          ) : (
                            <span className="text-rose-500">Missed blind. Charged - ({entry.bid} × 10) = {scoreForRound} pts.</span>
                          )
                        ) : (
                          entry.actual === entry.bid ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Matched bid genau! Earned {entry.bid} × 10 = +{scoreForRound} pts.</span>
                          ) : entry.actual < entry.bid ? (
                            <span className="text-rose-500">Under bid by {entry.bid - entry.actual}. Charged - ({entry.bid} × 10) = {scoreForRound} pts.</span>
                          ) : (
                            <span className="text-indigo-600 dark:text-indigo-400">Over bid with {entry.actual} wins. Earned ({entry.bid} × 10) + 1 = +{scoreForRound} pts.</span>
                          )
                        )}
                      </span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
