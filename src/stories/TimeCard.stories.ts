import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { TimeCard } from "../../components/time-card"

/**
 * TimeCard component displays lap times with visual indicators for best times.
 *
 * The card uses color coding to highlight special times:
 * - Purple background: Overall best time (fastest across all drivers)
 * - Green background: Personal best time (fastest for this specific driver)
 * - Default gray: Regular time
 */
const meta = {
  title: "Components/TimeCard",
  component: TimeCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    time: {
      control: "number",
      description: "The lap time in milliseconds",
    },
    isOverallBest: {
      control: "boolean",
      description: "Whether this is the overall best time across all drivers",
    },
    isPersonalBest: {
      control: "boolean",
      description: "Whether this is the driver's personal best time",
    },
  },
} satisfies Meta<typeof TimeCard>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default time card with a regular lap time
 */
export const Default: Story = {
  args: {
    time: 125450,
    isOverallBest: false,
    isPersonalBest: false,
  },
}

/**
 * Overall best time - displayed with purple background
 */
export const OverallBest: Story = {
  args: {
    time: 123890,
    isOverallBest: true,
    isPersonalBest: false,
  },
}

/**
 * Personal best time - displayed with green background
 */
export const PersonalBest: Story = {
  args: {
    time: 124567,
    isOverallBest: false,
    isPersonalBest: true,
  },
}

/**
 * When a time is both overall and personal best, overall best takes precedence
 */
export const BothBests: Story = {
  args: {
    time: 123456,
    isOverallBest: true,
    isPersonalBest: true,
  },
}

/**
 * No time recorded - displays a dash
 */
export const NoTime: Story = {
  args: {
    time: undefined,
    isOverallBest: false,
    isPersonalBest: false,
  },
}

/**
 * Fast lap time under 2 minutes
 */
export const FastLap: Story = {
  args: {
    time: 118234,
    isOverallBest: false,
    isPersonalBest: false,
  },
}

/**
 * Slow lap time over 2 minutes
 */
export const SlowLap: Story = {
  args: {
    time: 145678,
    isOverallBest: false,
    isPersonalBest: false,
  },
}
