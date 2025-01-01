import type { Meta, StoryObj } from '@storybook/react'
import { Footer } from './Footer'

const meta = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-[600px] flex flex-col">
        <div className="flex-1" />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {} 