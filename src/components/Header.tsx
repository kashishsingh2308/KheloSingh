/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sun, Moon, RotateCcw, Award, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { PlayerId, PLAYERS } from '../types';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onResetGame: () => void;
  leader: { name: string; score: number } | null;
}

export default function Header({
  isDarkMode,
  onToggleDarkMode,
  onResetGame,
  leader,
}: HeaderProps) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleConfirmReset = () => {
    onResetGame();
    setShowConfirmReset(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          {/* Brand/Title */}
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-800 dark:text-white sm:text-lg">
                Khelo Singh's
              </h1>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block leading-none mt-0.5">
                4-Player Game Tracker
              </span>
            </div>
          </div>

          {/* Quick Standings / Leader HUD */}
          {leader && leader.score !== 0 && (
            <div className="hidden min-[370px]:flex items-center space-x-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs border border-emerald-100 dark:border-emerald-900/30">
              <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
                <span className="font-semibold">{leader.name}</span> leads ({leader.score})
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            {/* Rules Quick Info */}
            <button
              onClick={() => setShowHelp(true)}
              id="help-btn"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
              title="View Scoring Rules"
            >
              <BookOpen className="h-4.5 w-4.5" />
            </button>

            {/* Dark Mode */}
            <button
              onClick={onToggleDarkMode}
              id="dark-mode-toggle"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
              title={isDarkMode ? 'Enable Light Mode' : 'Enable Dark Mode'}
            >
              {isDarkMode ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Reset / New Game CLI */}
            <button
              onClick={() => setShowConfirmReset(true)}
              id="reset-game-btn"
              className="flex h-9 px-3 items-center justify-center space-x-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-95 transition-all text-sm font-medium border border-red-100 dark:border-red-900/20"
              title="Reset Game"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">New Game</span>
            </button>
          </div>

        </div>
      </header>

      {/* CUSTOM INLINE GAME RESET CONFIRMATION MODAL */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-gray-100 dark:border-slate-800">
            <div className="flex items-start space-x-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Reset Current Game?
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-slate-400">
                  This action will delete all 13 rounds of bidding and actual scores. This cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end space-x-2.5">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="rounded-xl border border-gray-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
              >
                No, Keep it
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-500/20 hover:bg-red-500 active:scale-95 transition-all"
              >
                Reset Scores
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCORING RULES BOTTOM SHEET / DIALOG */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-gray-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-indigo-650 dark:text-indigo-400" />
              <span>Scoring Guide & Rules</span>
            </h3>

            <div className="mt-4 space-y-4 text-xs text-slate-600 dark:text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Standard Score Calculations</h4>
                <ul className="list-disc plist-inside space-y-1.5 pl-3">
                  <li><span className="font-semibold text-emerald-650 dark:text-emerald-400">Exact Match:</span> Hand wins match precisely with Bid.<br />👉 <span className="font-mono bg-slate-50 dark:bg-slate-800 px-1 py-0.5 rounded">Score = bid × 10</span></li>
                  <li><span className="font-semibold text-rose-600 dark:text-rose-400">Under-bid:</span> Hands won is strictly less than Bid.<br />👉 <span className="font-mono bg-slate-50 dark:bg-slate-800 px-1 py-0.5 rounded">Score = - (bid × 10)</span></li>
                  <li><span className="font-semibold text-indigo-600 dark:text-indigo-455">Over-bid:</span> Hands won is strictly greater than Bid.<br />👉 <span className="font-mono bg-slate-50 dark:bg-slate-800 px-1 py-0.5 rounded">Score = (bid × 10) + 1</span></li>
                </ul>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">🎲 Blind Bid Rule</h4>
                <ul className="list-disc pl-3 space-y-1">
                  <li>Can only be checked if player's <span className="font-semibold">Bid ≥ 5</span>.</li>
                  <li><span className="font-semibold text-emerald-650 dark:text-emerald-400">Blind Exact:</span> Match bid exactly.<br />👉 <span className="font-mono bg-slate-50 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600">Score = bid × 20</span></li>
                  <li><span className="font-semibold text-rose-650 dark:text-rose-400 font-medium">Blind Fail:</span> Any under or over results.<br />👉 <span className="font-mono bg-slate-50 dark:bg-slate-800 px-1 py-0.5 rounded text-rose-600">Score = - (bid × 10)</span></li>
                </ul>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Constraints</h4>
                <ul className="list-disc pl-3 space-y-1">
                  <li>Each round must have a minimum bid of <span className="font-semibold font-mono bg-slate-50 dark:bg-slate-800 px-1 rounded">2</span>.</li>
                  <li>Actual hands matches cannot be empty and are checked against actual gameplay.</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="w-full sm:w-auto rounded-xl bg-indigo-650 dark:bg-indigo-600 py-2.5 px-5 text-xs font-bold text-white shadow-lg shadow-indigo-550/10 hover:bg-indigo-600 active:scale-95 transition-all text-center"
              >
                Got It, Let's Play!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
