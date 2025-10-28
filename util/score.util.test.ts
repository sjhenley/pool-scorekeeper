import { getEightBallMatchPoints } from './score.util';

describe('Score Utilities', () => {
  describe('getEightBallMatchPoints', () => {
    describe('Target player won the game', () => {
      test('Opponent did not score any points', () => {
        const expectedResult = 3;
        const actualResult = getEightBallMatchPoints(2, 2, 0);
        expect(actualResult).toBe(expectedResult);
      });
      test('Opponent was one point away from winning the match', () => {
        const expectedResult = 2;
        const actualResult = getEightBallMatchPoints(2, 2, 1);
        expect(actualResult).toBe(expectedResult);
      });
    });
    describe('Opponent won the game', () => {
      test('Target player did not score any points', () => {
        const expectedResult = 0;
        const actualResult = getEightBallMatchPoints(0, 2, 2);
        expect(actualResult).toBe(expectedResult);
      });
      test('Target player was one point away from winning the match', () => {
        const expectedResult = 1;
        const actualResult = getEightBallMatchPoints(1, 2, 2);
        expect(actualResult).toBe(expectedResult);
      });
      test('Target player scored at least one point but was two or more points away from winning the match', () => {
        const expectedResult = 0;
        const actualResult = getEightBallMatchPoints(1, 3, 2);
        expect(actualResult).toBe(expectedResult);
      });
    });
  });
});
