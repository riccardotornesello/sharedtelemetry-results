import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { RankingRow } from "@/features/ranking/components/ranking-row"
import { driver, rankingItem, team } from "./example-data"

const meta = {
  title: "Ranking/RankingRow",
  component: RankingRow,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof RankingRow>

export default meta

type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {
    rankingItem: rankingItem,
    driver: driver,
    team: team,
    eventGroups: [],
    overallBestTimesPerEventGroup: {},
  },
}
