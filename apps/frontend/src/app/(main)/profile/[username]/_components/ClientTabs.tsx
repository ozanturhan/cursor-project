'use client';

import { Tab } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface ClientTabsProps {
  tabs: Array<{
    label: string;
    content: ReactNode;
  }>;
}

const tabClassName = ({ selected }: { selected: boolean }) =>
  cn(
    'px-4 py-2.5 text-sm font-medium leading-5',
    'text-muted dark:text-muted-dark',
    'focus:outline-none',
    selected
      ? 'border-b-2 border-primary-500 text-foreground dark:text-foreground-dark'
      : 'hover:text-foreground dark:hover:text-foreground-dark hover:border-b-2 hover:border-border dark:hover:border-border-dark'
  );

export function ClientTabs({ tabs }: ClientTabsProps) {
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 border-b border-border dark:border-border-dark overflow-x-auto">
        {tabs.map((tab) => (
          <Tab key={tab.label} className={tabClassName}>
            {tab.label}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="p-4 sm:p-6">
        {tabs.map((tab) => (
          <Tab.Panel key={tab.label}>{tab.content}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
} 