import type { Meta, StoryObj } from '@storybook/react';
import { FormLabel } from './FormLabel';

const meta: Meta<typeof FormLabel> = {
  title: 'UI/FormLabel',
  component: FormLabel,
  tags: ['autodocs'],
  argTypes: {
    isRequired: {
      control: 'boolean',
    },
    className: {
      control: 'text',
    },
    children: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormLabel>;

export const Default: Story = {
  args: {
    children: 'Email Address',
  },
};

export const Required: Story = {
  args: {
    children: 'Password',
    isRequired: true,
  },
};

export const WithCustomClass: Story = {
  args: {
    children: 'Username',
    className: 'text-lg font-bold',
  },
}; 