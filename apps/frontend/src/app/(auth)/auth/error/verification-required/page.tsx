import { StatusPage } from '@/components/ui/StatusPage';

export default function VerificationRequiredPage() {
  return (
    <StatusPage
      type="error"
      title="Email Verification Required"
      message="Please verify your email before logging in. Check your inbox for the verification link."
      actions={[
        {
          label: "Resend Verification Email",
          href: "/auth/resend-verification",
          variant: "primary"
        },
        {
          label: "Back to Login",
          href: "/auth/login",
          variant: "secondary"
        }
      ]}
      showSupport={true}
    />
  );
} 