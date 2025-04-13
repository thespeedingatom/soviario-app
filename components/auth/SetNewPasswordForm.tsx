'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setNewPasswordAction, AuthActionState } from '@/app/_actions/auth.actions'; // Adjust path if needed

// Define the schema based on the server action's schema
// Note: Token is handled separately via props, not part of the form data itself for validation here
const SetNewPasswordFormSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
  confirmPassword: z.string().min(8, { message: 'Please confirm your new password.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

type SetNewPasswordFormData = z.infer<typeof SetNewPasswordFormSchema>;

interface SetNewPasswordFormProps {
  token: string | null; // Password reset token passed from the page component
}

export function SetNewPasswordForm({ token }: SetNewPasswordFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<AuthActionState>({ message: null, success: false });

  const {
    register,
    handleSubmit,
    formState: { errors: clientErrors },
  } = useForm<SetNewPasswordFormData>({
    resolver: zodResolver(SetNewPasswordFormSchema),
  });

  const onSubmit = (data: SetNewPasswordFormData) => {
    if (!token) {
      setFormState({ message: 'Password reset token is missing or invalid.', success: false, errors: { token: ['Token is required.'] } });
      return;
    }

    setFormState({ message: null, success: false }); // Clear previous server errors/messages
    startTransition(async () => {
      const formData = new FormData();
      formData.append('password', data.password);
      formData.append('token', token); // Add the token to the form data for the action

      const result = await setNewPasswordAction({ message: null, success: false }, formData);
      setFormState(result); // Set the state returned from the server action

      if (result.success) {
        // Password reset successful
        // Action might auto-sign-in and set cookies
        // Redirect to dashboard or sign-in page based on action result message
        alert(result.message); // Simple alert for now
        router.push(result.message?.includes('signed in') ? '/dashboard' : '/auth/sign-in');
      }
    });
  };

   if (!token) {
    return <div className="text-red-500 text-sm p-3 bg-red-100 border border-red-300 rounded">Invalid or missing password reset token. Please request a new password reset link.</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {formState.message && !formState.success && ( // Only show error messages here
        <div className='text-red-500 bg-red-100 border-red-300 text-sm p-3 border rounded'>
          {formState.message}
        </div>
      )}
       {/* Display general form error from server action if present */}
       {formState.errors?._form && (
         <div className="text-red-500 text-sm p-3 bg-red-100 border border-red-300 rounded">
          {formState.errors._form.join(', ')}
        </div>
      )}
       {formState.errors?.token && (
         <div className="text-red-500 text-sm p-3 bg-red-100 border border-red-300 rounded">
          {formState.errors.token.join(', ')}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={clientErrors.password || formState.errors?.password ? 'true' : 'false'}
        />
        {clientErrors.password && <p className="text-sm text-red-500">{clientErrors.password.message}</p>}
        {formState.errors?.password && <p className="text-sm text-red-500">{formState.errors.password.join(', ')}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          aria-invalid={clientErrors.confirmPassword ? 'true' : 'false'}
        />
        {clientErrors.confirmPassword && <p className="text-sm text-red-500">{clientErrors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Resetting Password...' : 'Set New Password'}
      </Button>
    </form>
  );
}
