import * as migration_20250420_222120 from "./20250420_222120"
import * as migration_20250424_121249 from "./20250424_121249"
import * as migration_20251227_123817 from "./20251227_123817"

export const migrations = [
  {
    up: migration_20250420_222120.up,
    down: migration_20250420_222120.down,
    name: "20250420_222120",
  },
  {
    up: migration_20250424_121249.up,
    down: migration_20250424_121249.down,
    name: "20250424_121249",
  },
  {
    up: migration_20251227_123817.up,
    down: migration_20251227_123817.down,
    name: "20251227_123817",
  },
]
