'use client'; // This page needs client-side hooks to read search params

import { useSearchParams } from 'next/navigation';
import { SetNewPasswordForm } from '@/components/auth/SetNewPasswordForm'; // Adjust path if needed
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import React from 'react'; // Import React for Suspense

export default function ResetPasswordPage() {
  // Use Suspense to handle the case where searchParams are not immediately available
  return (
    <React.Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </React.Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Assuming the token is passed as a 'token' query parameter

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.20))] flex-col items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <SetNewPasswordForm token={token} />
        </CardContent>
      </Card>
    </div>
  );
}

function ResetPasswordLoading() {
    // Optional: Add a loading skeleton or spinner
    return (
        <div className="flex min-h-[calc(100vh-theme(spacing.20))] flex-col items-center justify-center py-10">
            <Card className="w-full max-w-md animate-pulse">
                <CardHeader className="text-center">
                    <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-muted rounded w-full mx-auto mt-2"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-10 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-10 bg-muted rounded w-full"></div>
                    <div className="h-10 bg-muted rounded w-full mt-2"></div>
                </CardContent>
            </Card>
        </div>
    );
}
