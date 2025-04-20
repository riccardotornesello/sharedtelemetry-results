import * as migration_20250420_222120 from './20250420_222120';

export const migrations = [
  {
    up: migration_20250420_222120.up,
    down: migration_20250420_222120.down,
    name: '20250420_222120'
  },
];
