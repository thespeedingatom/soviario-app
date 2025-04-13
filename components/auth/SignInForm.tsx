'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInAction, AuthActionState } from '@/app/_actions/auth.actions'; // Adjust path if needed

// Define the schema based on the server action's schema
const SignInFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type SignInFormData = z.infer<typeof SignInFormSchema>;

export function SignInForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInFormSchema),
  });

  const onSubmit = (data: SignInFormData) => {
    setFormError(null); // Clear previous errors
    startTransition(async () => {
      // Create FormData to pass to the server action
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      const result: AuthActionState = await signInAction({ message: null, success: false }, formData); // Pass initial state

      if (result.success) {
        // Sign-in successful, redirect to dashboard or intended page
        // Consider using router.refresh() to update server-fetched data like user state in layout
        router.refresh();
        router.push('/dashboard'); // Or redirect based on query param if needed
      } else {
        // Handle server-side errors (validation or API errors)
        // Display general form error
        setFormError(result.message || 'Sign in failed.');
        // Note: Field-specific errors from the server action aren't directly mapped here,
        // but could be if the AuthActionState included more detailed error structures.
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {formError && (
        <div className="text-red-500 text-sm p-3 bg-red-100 border border-red-300 rounded">
          {formError}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Signing In...' : 'Sign In'}
      </Button>
      {/* Add link to forgot password */}
      <div className="text-center text-sm">
        <a href="/auth/forgot-password" className="underline">Forgot password?</a>
      </div>
       {/* Add link to sign up */}
       <div className="text-center text-sm">
        Don't have an account? <a href="/auth/sign-up" className="underline">Sign up</a>
      </div>
    </form>
  );
}
