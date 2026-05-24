/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Trophy, Award, Sparkles, RefreshCcw, Star, Medal } from 'lucide-react';
import { PlayerId, PLAYERS } from '../types';
import { calculateRankings } from '../utils/scoring';

interface WinnerRankingsProps {
  totals: Record<PlayerId, number>;
  onNewGame: () => void;
}

export default function WinnerRankings({ totals, onNewGame }: WinnerRankingsProps) {
  const rankings = calculateRankings(totals);

  // Get medals/prizes icons based on actual position
  const getRankDecoration = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
          badge: 'bg-amber-500 text-white shadow-md shadow-amber-500/25',
          icon: <Trophy className="h-6 w-6 text-amber-500 animate-bounce" />,
          label: 'Game Champion 👑',
        };
      case 2:
        return {
          bg: 'bg-slate-300/10 border-slate-300/30 text-slate-600 dark:text-slate-300',
          badge: 'bg-slate-400 text-white',
          icon: <Medal className="h-5 w-5 text-slate-400" />,
          label: 'Runner Up 🥈',
        };
      case 3:
        return {
          bg: 'bg-amber-700/10 border-amber-700/30 text-amber-850 dark:text-amber-600',
          badge: 'bg-amber-750 text-white',
          icon: <Medal className="h-5 w-5 text-amber-700" />,
          label: 'Third Place 🥉',
        };
      default:
        return {
          bg: 'bg-gray-100/50 dark:bg-slate-800/20 border-gray-100 dark:border-slate-800/40 text-gray-500 dark:text-slate-400',
          badge: 'bg-gray-400 dark:bg-slate-600 text-white',
          icon: <Award className="h-5 w-5 text-gray-400" />,
          label: 'Participant 🎗️',
        };
    }
  };

  const championName = PLAYERS.find((p) => p.id === rankings[0].playerId)?.name || 'Champion';

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-900 border border-indigo-150 dark:border-indigo-950/60 rounded-3xl shadow-xl overflow-hidden animate-fade-in p-6 sm:p-8">
      
      {/* Celebration Header */}
      <div className="text-center pb-6 border-b border-gray-100 dark:border-slate-800">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4 animate-pulse">
          <Trophy className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-3xl">
          Tournament Complete!
        </h2>
        <p className="mt-1.5 text-xs text-gray-500 dark:text-slate-400 font-medium">
          Congratulations to <span className="font-bold text-amber-600 dark:text-amber-400">{championName}</span> on a brilliant victory!
        </p>
      </div>

      {/* Visual Podiums and Lists */}
      <div className="mt-6 space-y-3.5">
        {rankings.map((entity) => {
          const player = PLAYERS.find((p) => p.id === entity.playerId)!;
          const deco = getRankDecoration(entity.rank);

          return (
            <div
              key={entity.playerId}
              className={`flex items-center justify-between rounded-2xl border p-4 transition-all duration-300 ${deco.bg}`}
            >
              <div className="flex items-center space-x-3.5">
                {/* Ranking Medals Badge */}
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-mono font-bold ${deco.badge}`}>
                  #{entity.rank}
                </div>
                
                {/* Player details */}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900 dark:text-white text-base">
                      {player.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                      • {deco.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500">
                    Calculated standard/blind scoring verified
                  </p>
                </div>
              </div>

              {/* Score output and medal icon */}
              <div className="flex items-center space-x-3 shrink-0 font-mono">
                <span className="text-lg font-bold">
                  {entity.score > 0 ? `+${entity.score}` : entity.score} pts
                </span>
                {deco.icon}
              </div>
            </div>
          );
        })}
      </div>

      {/* Podium illustrative visual representation */}
      <div className="mt-6 h-28 flex items-end justify-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
        {/* 2nd place */}
        {rankings[1] && (
          <div className="flex flex-col items-center w-20">
            <span className="text-[10px] font-bold truncate max-w-[70px] text-slate-500 mb-1">
              {PLAYERS.find((p) => p.id === rankings[1].playerId)?.name}
            </span>
            <div className="w-full h-12 bg-slate-200 dark:bg-slate-800/80 rounded-t-lg flex items-center justify-center font-mono font-bold text-slate-600 dark:text-slate-450 border-t border-slate-300 dark:border-slate-700">
              🥈
            </div>
          </div>
        )}
        
        {/* 1st place */}
        {rankings[0] && (
          <div className="flex flex-col items-center w-24">
            <span className="text-[10px] font-extrabold truncate max-w-[80px] text-amber-500 flex items-center mb-1">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-0.5 animate-spin-slow" />
              {PLAYERS.find((p) => p.id === rankings[0].playerId)?.name}
            </span>
            <div className="w-full h-20 bg-amber-400 dark:bg-amber-600 rounded-t-lg flex items-center justify-center font-mono font-black text-white text-lg border-t-2 border-amber-300 shadow-md shadow-amber-500/10">
              👑 1
            </div>
          </div>
        )}

        {/* 3rd place */}
        {rankings[2] && (
          <div className="flex flex-col items-center w-20">
            <span className="text-[10px] font-bold truncate max-w-[70px] text-amber-800 mb-1">
              {PLAYERS.find((p) => p.id === rankings[2].playerId)?.name}
            </span>
            <div className="w-full h-8 bg-amber-600/30 dark:bg-amber-950/20 rounded-t-lg flex items-center justify-center font-mono font-bold text-amber-800 dark:text-amber-500 border-t border-amber-800/40">
              🥉
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6">
        <button
          onClick={onNewGame}
          className="w-full py-3 px-5 flex items-center justify-center space-x-2 rounded-2xl bg-indigo-650 text-white font-bold text-sm shadow-lg shadow-indigo-500/15 hover:bg-indigo-600 active:scale-98 active:shadow-md transition-all duration-200"
        >
          <RefreshCcw className="h-4.5 w-4.5 animate-spin-slow" />
          <span>Start a Fresh Tournament</span>
        </button>
      </div>

    </div>
  );
}
