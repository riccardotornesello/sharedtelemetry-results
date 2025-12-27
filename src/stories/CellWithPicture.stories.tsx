import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { CellWithPicture } from "../../components/cell-with-picture"

/**
 * CellWithPicture component displays content with an optional circular picture/avatar on the left.
 *
 * This component is commonly used in table cells to show team logos, driver avatars,
 * or other identifying images alongside text content.
 */
const meta = {
  title: "Components/CellWithPicture",
  component: CellWithPicture,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    picture: {
      control: "text",
      description: "Optional URL of the picture to display",
    },
    alt: {
      control: "text",
      description: "Alt text for the picture for accessibility",
    },
  },
} satisfies Meta<typeof CellWithPicture>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Cell with a picture and text
 */
export const WithPicture: Story = {
  args: {
    picture: "https://via.placeholder.com/48",
    alt: "Team Logo",
    children: "Team Racing Squad",
  },
}

/**
 * Cell with only text, no picture
 */
export const WithoutPicture: Story = {
  args: {
    picture: undefined,
    alt: undefined,
    children: "Driver Name",
  },
}

/**
 * Cell with a driver avatar
 */
export const DriverAvatar: Story = {
  args: {
    picture: "https://via.placeholder.com/48/4CAF50/FFFFFF?text=JD",
    alt: "John Doe",
    children: "John Doe",
  },
}

/**
 * Cell with a team logo
 */
export const TeamLogo: Story = {
  args: {
    picture: "https://via.placeholder.com/48/FF5722/FFFFFF?text=TR",
    alt: "Thunder Racing",
    children: "Thunder Racing",
  },
}

/**
 * Cell with multiple lines of content
 */
export const MultilineContent: Story = {
  args: {
    picture: "https://via.placeholder.com/48/2196F3/FFFFFF?text=AS",
    alt: "Apex Speed",
    children: (
      <div>
        <div className="font-bold">Apex Speed</div>
        <div className="text-xs text-gray-400">Pro Division</div>
      </div>
    ),
  },
}

/**
 * Cell with long text that might wrap
 */
export const LongText: Story = {
  args: {
    picture: "https://via.placeholder.com/48",
    alt: "Team Logo",
    children: "Very Long Team Name That Might Need To Wrap",
  },
}
