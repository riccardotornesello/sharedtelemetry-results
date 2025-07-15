import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { TimeCard } from "@/components/ui/time-card"

const meta = {
  title: "UI/TimeCard",
  component: TimeCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TimeCard>

export default meta

type Story = StoryObj<typeof meta>

export const Time: Story = {
  args: {
    time: 123456,
  },
}

export const OverallBest: Story = {
  args: {
    time: 123456,
    variant: "overallBest",
  },
}

export const PersonalBest: Story = {
  args: {
    time: 123456,
    variant: "personalBest",
  },
}

export const Empty: Story = {}

export const XS: Story = {
  args: {
    time: 123456,
    size: "xs",
  },
}
