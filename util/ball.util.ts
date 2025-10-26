import { BallStatus } from '@/models/ball-status.enum';

export function getBallList(): BallStatus[] {
  return [
    BallStatus.FREE,
    BallStatus.FREE,
    BallStatus.FREE,
    BallStatus.FREE,
    BallStatus.FREE,
    BallStatus.FREE,
    BallStatus.FREE,
    BallStatus.FREE,
    BallStatus.FREE
  ];
}

/**
 * Returns the indexes of balls in a specific state.
 * @param balls - The list of ball statuses.
 * @param status - The status to filter by.
 * @returns An array of indexes where the ball status matches the given status.
 */
export function getBallsInState(balls: BallStatus[], status: BallStatus): number[] {
  const ballIndexes: number[] = [];
  balls.forEach((ballStatus, index) => {
    if (ballStatus === status) {
      ballIndexes.push(index);
    }
  });
  return ballIndexes;
}
