import type { Meta, StoryObj } from '@storybook/react'
import { Navigation } from './Navigation'

const meta = {
  title: 'Layout/Navigation',
  component: Navigation,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Navigation>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {} 