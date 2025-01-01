import type { Meta, StoryObj } from '@storybook/react'
import { Layout } from './Layout'

const meta = {
  title: 'Layout/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Layout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className="min-h-[600px] flex items-center justify-center">
        <h1 className="text-2xl font-bold">Main Content</h1>
      </div>
    ),
  },
}

export const WithoutHeader: Story = {
  args: {
    showHeader: false,
    children: (
      <div className="min-h-[600px] flex items-center justify-center">
        <h1 className="text-2xl font-bold">Content Without Header</h1>
      </div>
    ),
  },
}

export const WithoutFooter: Story = {
  args: {
    showFooter: false,
    children: (
      <div className="min-h-[600px] flex items-center justify-center">
        <h1 className="text-2xl font-bold">Content Without Footer</h1>
      </div>
    ),
  },
}

export const HeaderOnly: Story = {
  args: {
    showFooter: false,
    children: (
      <div className="min-h-[200px] flex items-center justify-center">
        <h1 className="text-2xl font-bold">Header Only Layout</h1>
      </div>
    ),
  },
}

export const FooterOnly: Story = {
  args: {
    showHeader: false,
    children: (
      <div className="min-h-[200px] flex items-center justify-center">
        <h1 className="text-2xl font-bold">Footer Only Layout</h1>
      </div>
    ),
  },
} 