import { BallStatus } from '@app/models/ball-status.enum';

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
    BallStatus.FREE,
  ]
}
