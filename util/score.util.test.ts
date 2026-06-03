import { getEightBallMatchPoints, getNineBallMatchPoints } from './score.util';

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
  describe('getNineBallMatchPoints', () => {
    test('20-0 winner score', () => {
      const expectedResult = 20;
      const actualResult = getNineBallMatchPoints(25, 3, 1, 2);
      expect(actualResult).toBe(expectedResult);
    });
    test('20-0 loser score', () => {
      const expectedResult = 0;
      const actualResult = getNineBallMatchPoints(0, 2, 25, 3);
      expect(actualResult).toBe(expectedResult);
    });
    test('19-1 winner score', () => {
      const expectedResult = 19;
      const actualResult = getNineBallMatchPoints(14, 1, 8, 5);
      expect(actualResult).toBe(expectedResult);
    });
    test('19-1 loser score', () => {
      const expectedResult = 1;
      const actualResult = getNineBallMatchPoints(12, 7, 19, 2);
      expect(actualResult).toBe(expectedResult);
    });
    test('18-2 winner score', () => {
      const expectedResult = 18;
      const actualResult = getNineBallMatchPoints(25, 3, 4, 1);
      expect(actualResult).toBe(expectedResult);
    });
    test('18-2 loser score', () => {
      const expectedResult = 2;
      const actualResult = getNineBallMatchPoints(7, 3, 31, 4);
      expect(actualResult).toBe(expectedResult);
    });
    test('17-3 winner score', () => {
      const expectedResult = 17;
      const actualResult = getNineBallMatchPoints(38, 5, 15, 5);
      expect(actualResult).toBe(expectedResult);
    });
    test('17-3 loser score', () => {
      const expectedResult = 3;
      const actualResult = getNineBallMatchPoints(33, 9, 46, 6);
      expect(actualResult).toBe(expectedResult);
    });
    test('16-4 winner score', () => {
      const expectedResult = 16;
      const actualResult = getNineBallMatchPoints(55, 7, 10, 2);
      expect(actualResult).toBe(expectedResult);
    });
    test('16-4 loser score', () => {
      const expectedResult = 4;
      const actualResult = getNineBallMatchPoints(17, 4, 65, 8);
      expect(actualResult).toBe(expectedResult);
    });
    test('15-5 winner score', () => {
      const expectedResult = 15;
      const actualResult = getNineBallMatchPoints(75, 9, 30, 6);
      expect(actualResult).toBe(expectedResult);
    });
    test('15-5 loser score', () => {
      const expectedResult = 5;
      const actualResult = getNineBallMatchPoints(36, 7, 31, 4);
      expect(actualResult).toBe(expectedResult);
    });
    test('14-6 winner score', () => {
      const expectedResult = 14;
      const actualResult = getNineBallMatchPoints(14, 1, 9, 1);
      expect(actualResult).toBe(expectedResult);
    });
    test('14-6 loser score', () => {
      const expectedResult = 6;
      const actualResult = getNineBallMatchPoints(59, 9, 19, 2);
      expect(actualResult).toBe(expectedResult);
    });
    test('13-7 winner score', () => {
      const expectedResult = 13;
      const actualResult = getNineBallMatchPoints(25, 3, 54, 8);
      expect(actualResult).toBe(expectedResult);
    });
    test('13-7 loser score', () => {
      const expectedResult = 7;
      const actualResult = getNineBallMatchPoints(20, 3, 38, 5);
      expect(actualResult).toBe(expectedResult);
    });
    test('12-8 winner score', () => {
      const expectedResult = 12;
      const actualResult = getNineBallMatchPoints(46, 6, 18, 2);
      expect(actualResult).toBe(expectedResult);
    });
    test('12-8 loser score', () => {
      const expectedResult = 8;
      const actualResult = getNineBallMatchPoints(23, 3, 55, 7);
      expect(actualResult).toBe(expectedResult);
    });
  });
});
