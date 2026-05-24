/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PlayerId = 'kashish' | 'mayank' | 'dilip' | 'mamta';

export interface Player {
  id: PlayerId;
  name: string;
  avatarUrl?: string; // We can generate soft avatar initials
}

export interface PlayerRoundState {
  bid: number; // Minimum is 2
  actual: number | null; // Empty or number of hands won
  isBlind: boolean; // Only if bid >= 5
}

export interface Round {
  roundNumber: number; // 1 to 13
  entries: Record<PlayerId, PlayerRoundState>;
  isCompleted: boolean; // True if all players have actual score filled
}

export interface GameState {
  rounds: Round[];
  isDarkMode: boolean;
}

export const PLAYERS: Player[] = [
  { id: 'kashish', name: 'Kashish' },
  { id: 'mayank', name: 'Mayank' },
  { id: 'dilip', name: 'Dilip' },
  { id: 'mamta', name: 'Mamta' },
];
