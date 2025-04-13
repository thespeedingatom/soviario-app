import { RequestPasswordResetForm } from '@/components/auth/RequestPasswordResetForm'; // Adjust path if needed
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.20))] flex-col items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <RequestPasswordResetForm />
        </CardContent>
      </Card>
    </div>
  );
}
