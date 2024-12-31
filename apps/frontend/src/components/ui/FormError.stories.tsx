import type { Meta, StoryObj } from '@storybook/react';
import { FormError } from './FormError';

const meta: Meta<typeof FormError> = {
  title: 'UI/FormError',
  component: FormError,
  tags: ['autodocs'],
  argTypes: {
    error: {
      control: 'text',
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormError>;

export const Default: Story = {
  args: {
    error: 'This field is required',
  },
};

export const WithCustomClass: Story = {
  args: {
    error: 'Invalid input',
    className: 'mt-2 font-bold',
  },
}; 