import * as migration_20250420_222120 from './20250420_222120';
import * as migration_20250424_121249 from './20250424_121249';

export const migrations = [
  {
    up: migration_20250420_222120.up,
    down: migration_20250420_222120.down,
    name: '20250420_222120',
  },
  {
    up: migration_20250424_121249.up,
    down: migration_20250424_121249.down,
    name: '20250424_121249'
  },
];
