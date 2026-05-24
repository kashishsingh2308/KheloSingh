/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Award, RefreshCcw, Star, Calendar, Sparkles } from 'lucide-react';
import { PlayerId, PLAYERS, Round, PlayerRoundState } from './types';
import {
  createInitialRounds,
  calculateTotalScores,
  calculateRankings,
  checkGameCompleted
} from './utils/scoring';
import Header from './components/Header';
import StickyFooter from './components/StickyFooter';
import RoundCard from './components/RoundCard';
import DesktopTable from './components/DesktopTable';
import WinnerRankings from './components/WinnerRankings';

export default function App() {
  // Theme state synced with local storage (defaults to system preference or light)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('card-tracker-dark-mode');
    if (saved) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Game state representation synced with local storage
  const [rounds, setRounds] = useState<Round[]>(() => {
    const saved = localStorage.getItem('card-tracker-rounds');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved rounds', e);
      }
    }
    return createInitialRounds();
  });

  // Keeps track of the index of the expanded card on mobile (0-12)
  const [activeRoundIndex, setActiveRoundIndex] = useState<number>(0);

  // Sync dark mode class with root markup
  useEffect(() => {
    localStorage.setItem('card-tracker-dark-mode', String(isDarkMode));
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      document.getElementById('meta-theme-color')?.setAttribute('content', '#0f172a');
    } else {
      html.classList.remove('dark');
      document.getElementById('meta-theme-color')?.setAttribute('content', '#ffffff');
    }
  }, [isDarkMode]);

  // Sync game ledger changes to local storage
  useEffect(() => {
    localStorage.setItem('card-tracker-rounds', JSON.stringify(rounds));
  }, [rounds]);

  // Handle single-round edit updates from steppers inside RoundCard
  const handleUpdateEntry = (
    roundNumber: number,
    playerId: PlayerId,
    field: keyof PlayerRoundState,
    value: any
  ) => {
    setRounds((prevRounds) =>
      prevRounds.map((round) => {
        if (round.roundNumber === roundNumber) {
          const updatedEntries = {
            ...round.entries,
            [playerId]: {
              ...round.entries[playerId],
              [field]: value,
            },
          };
          return {
            ...round,
            entries: updatedEntries,
          };
        }
        return round;
      })
    );
  };

  // Reset/Clears all rounds scored to default values with confirmation
  const handleResetGame = () => {
    setRounds(createInitialRounds());
    setActiveRoundIndex(0);
  };

  // State math derivations
  const totals = calculateTotalScores(rounds);
  const rankings = calculateRankings(totals);
  const isGameCompleted = checkGameCompleted(rounds);

  // Calculate current top leading player name and points for HUD header
  const topPlayerMeta = rankings.length > 0 ? {
    name: PLAYERS.find((p) => p.id === rankings[0].playerId)?.name || '',
    score: rankings[0].score,
  } : null;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* 4-Player Sticky Header HUD */}
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        onResetGame={handleResetGame}
        leader={topPlayerMeta}
      />

      {/* PRIMARY VIEWER GRID AND COLLAPSE INTERFACES */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {isGameCompleted ? (
          /* WINNER OVERLAY PORTAL */
          <div className="flex items-center justify-center py-6">
            <WinnerRankings totals={totals} onNewGame={handleResetGame} />
          </div>
        ) : (
          /* DUAL DISPLAY - RESPONSIVE MOBILE & DESKTOP INTERSECTION */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ROUNDS LEDGER DIRECTORY (Always rendered: Collapsible columns on mobile, single rail on desktop) */}
            <section className="lg:col-span-5 xl:col-span-4 space-y-4">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h2 className="text-base font-extrabold tracking-tight text-slate-800 dark:text-white">
                    Rounds Scorecards
                  </h2>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium font-sans">
                    Tap to expand a round and enter scores
                  </p>
                </div>
                <div className="flex items-center space-x-1 font-mono text-[10px] bg-indigo-100/50 dark:bg-indigo-950/40 text-indigo-850 dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-200/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                  <span>13 rounds total</span>
                </div>
              </div>

              <div className="space-y-3">
                {rounds.map((round, rIdx) => (
                  <RoundCard
                    key={round.roundNumber}
                    round={round}
                    isOpen={activeRoundIndex === rIdx}
                    onToggle={() => setActiveRoundIndex(activeRoundIndex === rIdx ? -1 : rIdx)}
                    onUpdateEntry={(pId, field, val) =>
                      handleUpdateEntry(round.roundNumber, pId, field, val)
                    }
                  />
                ))}
              </div>
            </section>

            {/* DESKTOP HIGHER RESOLUTION SPREADSHEET (Hidden on Mobile screens, sticky/prominent on Desktop) */}
            <section className="hidden lg:block lg:col-span-7 xl:col-span-8 lg:sticky lg:top-[74px]">
              <DesktopTable
                rounds={rounds}
                activeRoundIndex={activeRoundIndex}
                onSetActiveRound={(idx) => setActiveRoundIndex(idx)}
              />
            </section>

          </div>
        )}
      </main>

      {/* FOOTER LIVE SCOPING SCOREBOARD */}
      <StickyFooter totals={totals} />
    </div>
  );
}
