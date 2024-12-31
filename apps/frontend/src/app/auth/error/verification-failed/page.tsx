import { StatusPage } from '@/components/ui/StatusPage';

export default function VerificationErrorPage() {
  return (
    <StatusPage
      type="error"
      title="Verification Failed"
      message="We couldn't verify your email. The verification link may have expired or is invalid."
      actions={[
        {
          label: "Resend Verification Email",
          href: "/auth/resend-verification",
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