import type { Meta, StoryObj } from '@storybook/react'
import { UserMenu } from './UserMenu'

const meta = {
  title: 'Layout/UserMenu',
  component: UserMenu,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof UserMenu>

export default meta
type Story = StoryObj<typeof meta>

export const WithName: Story = {
  args: {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
}

export const WithEmail: Story = {
  args: {
    user: {
      email: 'john@example.com',
    },
  },
}

export const WithImage: Story = {
  args: {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      image: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
  },
} 