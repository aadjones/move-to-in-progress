/**
 * Game State Machine
 *
 * Manages phase transitions and game state for "Move to In Progress"
 * Separates business logic from UI rendering
 */

import type { Phase } from '../types';

export type GameEndingType = 'burn' | 'delegate' | 'assimilate';
export type EndingVariant = 'complete' | 'leave';

/**
 * Complete game state
 */
export interface GameState {
  phase: Phase;
  scrollPosition: number;
  showManagerMessage: boolean;

  // Falling phase state
  dropPosition: { x: number; y: number };
  cardWidth: number;

  // Ending phase state
  endingVariant: EndingVariant;
  gameEndingType: GameEndingType | null;
  tasksUnlocked: number;
  nightmareStage: number;
}

/**
 * Events that can trigger state transitions
 */
export type GameEvent =
  | { type: 'DISMISS_MANAGER_MESSAGE' }
  | { type: 'TASK_MOVED_TO_IN_PROGRESS'; payload: { position: { x: number; y: number }; width: number } }
  | { type: 'SCROLL'; payload: { position: number } }
  | { type: 'REACHED_GROUND' }
  | { type: 'GROUND_TIMER_COMPLETE' }
  | { type: 'NIGHTMARE_COMPLETE' }
  | { type: 'NIGHTMARE_LEAVE' }
  | { type: 'GAME_ENDING'; payload: { endingType: GameEndingType; tasksUnlocked: number; nightmareStage: number } }
  | { type: 'RESTART' };

/**
 * State change listener
 */
export type StateChangeListener = (state: GameState, previousState: GameState) => void;

/**
 * Game State Machine
 * Handles phase transitions and maintains game state
 */
export class GameStateMachine {
  private state: GameState;
  private listeners: Set<StateChangeListener> = new Set();

  constructor(initialState?: Partial<GameState>) {
    this.state = {
      phase: 'board',
      scrollPosition: 0,
      showManagerMessage: true,
      dropPosition: { x: 0, y: 0 },
      cardWidth: 320,
      endingVariant: 'complete',
      gameEndingType: null,
      tasksUnlocked: 0,
      nightmareStage: 0,
      ...initialState,
    };
  }

  /**
   * Get current state (immutable)
   */
  getState(): Readonly<GameState> {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Dispatch an event to trigger state transitions
   */
  dispatch(event: GameEvent): void {
    const previousState = { ...this.state };

    switch (event.type) {
      case 'DISMISS_MANAGER_MESSAGE':
        this.state.showManagerMessage = false;
        break;

      case 'TASK_MOVED_TO_IN_PROGRESS':
        this.state.phase = 'falling';
        this.state.dropPosition = event.payload.position;
        this.state.cardWidth = event.payload.width;
        break;

      case 'SCROLL':
        this.state.scrollPosition = event.payload.position;
        break;

      case 'REACHED_GROUND':
        this.state.phase = 'ground';
        break;

      case 'GROUND_TIMER_COMPLETE':
        this.state.phase = 'nightmare';
        break;

      case 'NIGHTMARE_COMPLETE':
        this.state.phase = 'ending';
        this.state.endingVariant = 'complete';
        this.state.gameEndingType = null;
        break;

      case 'NIGHTMARE_LEAVE':
        this.state.phase = 'ending';
        this.state.endingVariant = 'leave';
        this.state.gameEndingType = null;
        break;

      case 'GAME_ENDING':
        this.state.phase = 'ending';
        this.state.gameEndingType = event.payload.endingType;
        this.state.tasksUnlocked = event.payload.tasksUnlocked;
        this.state.nightmareStage = event.payload.nightmareStage;
        break;

      case 'RESTART':
        this.state = {
          phase: 'board',
          scrollPosition: 0,
          showManagerMessage: true,
          dropPosition: { x: 0, y: 0 },
          cardWidth: 320,
          endingVariant: 'complete',
          gameEndingType: null,
          tasksUnlocked: 0,
          nightmareStage: 0,
        };
        break;

      default:
        // TypeScript exhaustiveness check
        const _exhaustive: never = event;
        return _exhaustive;
    }

    // Notify listeners
    this.notifyListeners(previousState);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(previousState: GameState): void {
    const currentState = this.getState();
    this.listeners.forEach(listener => listener(currentState, previousState));
  }

  /**
   * Check if we should transition from falling to ground based on scroll position
   */
  shouldTransitionToGround(scrollThreshold: number): boolean {
    return (
      this.state.phase === 'falling' &&
      this.state.scrollPosition >= scrollThreshold
    );
  }
}
