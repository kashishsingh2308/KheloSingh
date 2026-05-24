/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Play, Check, Shield } from 'lucide-react';
import { PlayerId, PLAYERS, Round } from '../types';
import { calculateRoundScore, checkRoundCompleted } from '../utils/scoring';

interface DesktopTableProps {
  rounds: Round[];
  activeRoundIndex: number;
  onSetActiveRound: (index: number) => void;
}

export default function DesktopTable({
  rounds,
  activeRoundIndex,
  onSetActiveRound,
}: DesktopTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      <div className="px-5 py-4 border-b border-gray-150 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Score Ledger Spreadsheet
          </h3>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">
            Overview of bids, wins, and scores across all 13 rounds
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-slate-400 font-mono">
          <span className="flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Matched Bid</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            <span>Unmatched Bid</span>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/40 dark:bg-slate-900/30 text-[10px] font-bold tracking-wider text-gray-400 dark:text-slate-500 uppercase font-mono">
              <th className="py-3 px-4 text-center w-12">Rnd</th>
              {PLAYERS.map((p) => (
                <th key={p.id} className="py-3 px-4 text-center">
                  {p.name}
                </th>
              ))}
              <th className="py-3 px-4 text-center w-28">Tricks Sum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150 dark:divide-slate-800 font-sans text-xs">
            {rounds.map((round, rIdx) => {
              const isActive = activeRoundIndex === rIdx;
              const isCompleted = checkRoundCompleted(round);

              const sumBids = PLAYERS.reduce((sum, p) => sum + round.entries[p.id].bid, 0);
              const sumActual = PLAYERS.reduce(
                (sum, p) => sum + (round.entries[p.id].actual ?? 0),
                0
              );

              return (
                <tr
                  key={round.roundNumber}
                  onClick={() => onSetActiveRound(rIdx)}
                  className={`group cursor-pointer transition-colors duration-150 ${
                    isActive
                      ? 'bg-indigo-50/40 dark:bg-indigo-950/20 font-medium'
                      : 'hover:bg-slate-50/60 dark:hover:bg-slate-850/20'
                  }`}
                >
                  {/* Round number */}
                  <td className="py-3 px-4 text-center font-mono font-bold">
                    <div className="flex items-center justify-center space-x-1.5">
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
                      )}
                      <span className={isActive ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}>
                        {round.roundNumber}
                      </span>
                    </div>
                  </td>

                  {/* Players bids and wins */}
                  {PLAYERS.map((p) => {
                    const entry = round.entries[p.id];
                    const rawScore = calculateRoundScore(entry);
                    const hasActual = entry.actual !== null;

                    let bgCellColor = '';
                    let badgeColor = 'text-gray-400 dark:text-slate-500';

                    if (hasActual) {
                      const matched = entry.actual === entry.bid;
                      bgCellColor = matched
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/3 dark:bg-emerald-950/5'
                        : 'text-rose-700 dark:text-rose-400 bg-rose-500/3 dark:bg-rose-950/5';
                      badgeColor = rawScore > 0
                        ? 'bg-emerald-100/60 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                        : 'bg-rose-100/60 text-rose-800 dark:bg-rose-950/50 dark:text-rose-450';
                    }

                    return (
                      <td
                        key={p.id}
                        className={`py-3 px-4 text-center transition-colors group-hover:bg-transparent ${bgCellColor}`}
                      >
                        <div className="flex flex-col items-center justify-center space-y-1">
                          {/* Bid -> Actual */}
                          <div className="font-mono text-[11px] text-gray-700 dark:text-slate-350">
                            Bid: <span className="font-bold">{entry.bid}</span>
                            {entry.isBlind && entry.bid >= 5 && (
                              <Shield className="inline h-3 w-3 text-amber-500 ml-0.5" title="Blind Bid" />
                            )}
                            {' '}➔ Wins:{' '}
                            <span className="font-bold">
                              {hasActual ? entry.actual : '—'}
                            </span>
                          </div>

                          {/* Round point */}
                          {hasActual && (
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm font-semibold tracking-tight ${badgeColor}`}>
                              {rawScore > 0 ? `+${rawScore}` : rawScore}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}

                  {/* Sum values */}
                  <td className="py-3 px-4 text-center font-mono font-medium text-[11px] text-gray-500 dark:text-slate-400">
                    <div className="flex flex-col items-center">
                      <span>Bids: {sumBids}</span>
                      {isCompleted ? (
                        <span className={sumActual === 13 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-500'}>
                          Wins: {sumActual}
                        </span>
                      ) : (
                        <span className="text-gray-350 dark:text-slate-600">Wins: —</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
