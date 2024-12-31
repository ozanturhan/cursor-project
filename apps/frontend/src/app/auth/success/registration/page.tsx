import { StatusPage } from '@/components/ui/StatusPage';

export default function RegistrationSuccessPage() {
  return (
    <StatusPage
      type="success"
      title="Registration Successful!"
      message="Please check your email to verify your account. We've sent you a verification link."
      actions={[
        {
          label: "Go to Login",
          href: "/auth/login",
          variant: "primary"
        },
        {
          label: "Resend Verification Email",
          href: "/auth/resend-verification",
          variant: "secondary"
        }
      ]}
    />
  );
} 