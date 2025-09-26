import Player, { SkillLevel } from '@/models/player';

/**
 * Generate an array of player test data.
 * @param count Number of players to generate
 * @returns Array of Player objects
 */
export function getPlayerTestData(count: number): Player[] {
  const firstNames = [
    'John', 'Jane', 'Mike', 'Emily', 'Chris', 'Katie', 'David', 'Sarah', 'James', 'Laura',
    'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Drew', 'Quinn', 'Skyler',
    'Cameron', 'Avery', 'Peyton', 'Reese', 'Rowan', 'Sawyer', 'Emerson', 'Finley', 'Harper', 'Dakota',
    'Blake', 'Charlie', 'Devon', 'Elliot', 'Frankie', 'Hayden', 'Jesse', 'Kendall', 'Logan', 'Mackenzie',
    'Nico', 'Oakley', 'Parker', 'Reagan', 'Sage', 'Tatum', 'Val', 'Wren', 'Zion', 'Sydney'
  ];
  const lastNames = [
    'Smith', 'Johnson', 'Brown', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
    'Clark', 'Lewis', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Green',
    'Adams', 'Baker', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell',
    'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook',
    'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward'
  ];

  const getRandomSkill8 = () => Math.floor(Math.random() * 6) + 2;
  const getRandomSkill9 = () => Math.floor(Math.random() * 9) + 1;

  const players: Player[] = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const skill8 = getRandomSkill8();
    const skill9 = getRandomSkill9();
    players.push( new Player(
      `${firstName} ${lastName}`,
      skill8 as SkillLevel,
      skill9 as SkillLevel
    ));
  }
  return players;
}
