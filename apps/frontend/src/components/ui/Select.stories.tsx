import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error'],
    },
    selectSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isDisabled: {
      control: 'boolean',
    },
    hasError: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

export const Default: Story = {
  args: {
    children: options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )),
  },
};

export const Small: Story = {
  args: {
    selectSize: 'sm',
    children: options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )),
  },
};

export const Large: Story = {
  args: {
    selectSize: 'lg',
    children: options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )),
  },
};

export const WithError: Story = {
  args: {
    hasError: true,
    children: options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )),
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    children: options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )),
  },
}; 