import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { CellWithPicture } from "@/components/ui/cell-with-picture"

const meta = {
  title: "UI/CellWithPicture",
  component: CellWithPicture,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof CellWithPicture>

export default meta

type Story = StoryObj<typeof meta>

export const NoPicture: Story = {
  args: {
    children: "No picture",
  },
}

export const WithPicture: Story = {
  args: {
    picture: "https://picsum.photos/200",
    alt: "Placeholder Image",
    children: "With picture",
  },
}
