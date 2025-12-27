import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Footer } from "../../components/footer"

/**
 * Footer component displays site attribution and links.
 *
 * This component is typically placed at the bottom of pages and includes:
 * - Attribution to the project creator
 * - Link to the GitHub repository
 */
const meta = {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default footer as it appears on the site
 */
export const Default: Story = {}

/**
 * Footer shown in a dark theme context (default for the app)
 */
export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <div className="bg-gray-900 min-h-screen flex items-end">
        <Story />
      </div>
    ),
  ],
}

/**
 * Footer in a page context
 */
export const InPageContext: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow p-8">
          <h1 className="text-2xl font-bold mb-4">Page Content</h1>
          <p className="mb-4">
            This is some example page content to show how the footer appears at
            the bottom of a page.
          </p>
          <p className="mb-4">
            The footer will be pushed to the bottom of the viewport or page,
            whichever is lower.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
}
