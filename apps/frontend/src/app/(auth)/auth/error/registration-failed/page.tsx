import { StatusPage } from '@/components/ui/StatusPage';

export default function RegistrationErrorPage() {
  return (
    <StatusPage
      type="error"
      title="Registration Failed"
      message="We couldn't complete your registration. This might be because the email is already registered or there was a technical issue."
      actions={[
        {
          label: "Try Again",
          href: "/auth/register",
          variant: "primary"
        },
        {
          label: "Go to Login",
          href: "/auth/login",
          variant: "secondary"
        }
      ]}
      showSupport={true}
    />
  );
} 