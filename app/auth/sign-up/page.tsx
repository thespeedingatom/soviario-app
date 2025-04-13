import { SignUpForm } from '@/components/auth/SignUpForm'; // Adjust path if needed
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.20))] flex-col items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Enter your details to create a new account.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
