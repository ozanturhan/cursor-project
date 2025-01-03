import type { Meta, StoryObj } from '@storybook/react';
import { FormControl, type FormControlProps } from './FormControl';
import { Input } from './Input';

const meta = {
  title: 'UI/FormControl',
  component: FormControl,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FormControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Label',
    children: <Input placeholder="Placeholder" />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Label',
    error: 'This field is required',
    children: <Input placeholder="Placeholder" />,
  },
};

export const Required: Story = {
  args: {
    label: 'Label',
    isRequired: true,
    children: <Input placeholder="Placeholder" />,
  },
}; 