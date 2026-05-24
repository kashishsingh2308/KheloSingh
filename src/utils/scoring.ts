/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayerRoundState, Round, PLAYERS, PlayerId } from '../types';

/**
 * Calculates a player's score for a single round according to the rules:
 * - If actual is null (round not completed for this player), returns 0.
 * - Non-blind:
 *   - Exact match -> bid * 10
 *   - Under (actual < bid) -> - (bid * 10)
 *   - Over (actual > bid) -> (bid * 10) + 1
 * - Blind (only if bid >= 5):
 *   - Exact match -> bid * 20
 *   - Fail (actual != bid) -> - (bid * 10)
 */
export function calculateRoundScore(state: PlayerRoundState): number {
  const { bid, actual, isBlind } = state;
  if (actual === null) return 0;

  // Enforce bid constraint
  const effectiveBid = Math.max(2, bid);

  if (isBlind && effectiveBid >= 5) {
    if (actual === effectiveBid) {
      return effectiveBid * 20;
    } else {
      return -(effectiveBid * 10);
    }
  } else {
    if (actual === effectiveBid) {
      return effectiveBid * 10;
    } else if (actual < effectiveBid) {
      return -(effectiveBid * 10);
    } else {
      return (effectiveBid * 10) + 1;
    }
  }
}

/**
 * Creates the initial empty structure for the 13 rounds.
 */
export function createInitialRounds(): Round[] {
  const rounds: Round[] = [];
  for (let r = 1; r <= 13; r++) {
    const entries = {} as Record<PlayerId, PlayerRoundState>;
    PLAYERS.forEach((p) => {
      entries[p.id] = {
        bid: 2,
        actual: null,
        isBlind: false,
      };
    });
    rounds.push({
      roundNumber: r,
      entries,
      isCompleted: false,
    });
  }
  return rounds;
}

/**
 * Calculates current running total scores for all players in the game.
 */
export function calculateTotalScores(rounds: Round[]): Record<PlayerId, number> {
  const totals: Record<PlayerId, number> = {
    kashish: 0,
    mayank: 0,
    dilip: 0,
    mamta: 0,
  };

  rounds.forEach((round) => {
    PLAYERS.forEach((player) => {
      const entry = round.entries[player.id];
      totals[player.id] += calculateRoundScore(entry);
    });
  });

  return totals;
}

/**
 * Retrieves positions (1st, 2nd, 3rd, 4th) based on scores, handling ties elegantly.
 */
export function calculateRankings(totals: Record<PlayerId, number>): { playerId: PlayerId; score: number; rank: number }[] {
  const list = PLAYERS.map((p) => ({
    playerId: p.id,
    score: totals[p.id],
  }));

  // Sort descending by score
  list.sort((a, b) => b.score - a.score);

  // Design rank with support for ties
  let currentRank = 1;
  return list.map((item, idx) => {
    if (idx > 0 && item.score < list[idx - 1].score) {
      currentRank = idx + 1;
    }
    return {
      ...item,
      rank: currentRank,
    };
  });
}

/**
 * Safely runs a check of whether a specific round is completely filled out.
 */
export function checkRoundCompleted(round: Round): boolean {
  return PLAYERS.every((p) => round.entries[p.id].actual !== null);
}

/**
 * Safely checks if the entire game is completed (all 13 rounds completed).
 */
export function checkGameCompleted(rounds: Round[]): boolean {
  return rounds.every((r) => checkRoundCompleted(r));
}
