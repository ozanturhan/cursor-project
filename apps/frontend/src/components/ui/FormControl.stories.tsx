import type { Meta, StoryObj } from '@storybook/react';
import { FormControl } from './FormControl';
import { Input } from './Input';

const meta: Meta<typeof FormControl> = {
  title: 'UI/FormControl',
  component: FormControl,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    error: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
    isRequired: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormControl>;

export const Default: Story = {
  args: {
    label: 'Email',
    children: <Input placeholder="Enter your email" type="email" />,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    helperText: 'Must be at least 8 characters',
    children: <Input type="password" placeholder="Enter your password" />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    error: 'Invalid email address',
    children: <Input type="email" placeholder="Enter your email" />,
  },
};

export const Required: Story = {
  args: {
    label: 'Username',
    isRequired: true,
    children: <Input placeholder="Enter your username" />,
  },
}; 