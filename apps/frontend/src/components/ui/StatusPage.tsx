import { Button } from './Button';
import Link from 'next/link';

interface Action {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

interface StatusPageProps {
  title: string;
  message: string;
  type: 'success' | 'error';
  actions?: Action[];
  showSupport?: boolean;
}

export function StatusPage({ title, message, type, actions = [], showSupport = false }: StatusPageProps) {
  const bgColor = type === 'success' ? 'bg-success-50' : 'bg-error-50';
  const iconColor = type === 'success' ? 'text-success-500' : 'text-error-500';
  const icon = type === 'success' ? (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full ${bgColor} ${iconColor}`}>
          {icon}
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
          <p className="text-neutral-600">{message}</p>
        </div>

        {actions.length > 0 && (
          <div className="space-y-3">
            {actions.map((action, index) => (
              <Link key={index} href={action.href} className="block">
                <Button
                  variant={action.variant || (index === 0 ? 'primary' : 'secondary')}
                  size="lg"
                  fullWidth
                >
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        )}

        {showSupport && (
          <div className="text-center text-sm text-neutral-600">
            <p>Need help? <Link href="/support" className="text-primary-600 hover:text-primary-500">Contact support</Link></p>
          </div>
        )}
      </div>
    </div>
  );
} 