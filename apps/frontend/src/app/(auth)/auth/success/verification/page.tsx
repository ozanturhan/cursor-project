import { StatusPage } from '@/components/ui/StatusPage';

export default function VerificationSuccessPage() {
  return (
    <StatusPage
      type="success"
      title="Email Verified!"
      message="Your email has been successfully verified. You can now log in to your account."
      actions={[
        {
          label: "Go to Login",
          href: "/auth/login",
          variant: "primary"
        }
      ]}
    />
  );
} 