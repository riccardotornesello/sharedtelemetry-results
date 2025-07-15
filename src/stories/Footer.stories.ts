import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Footer } from "@/components/footer"

const meta = {
  title: "UI/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Footer>

export default meta

type Story = StoryObj<typeof meta>

export const Example: Story = {}
