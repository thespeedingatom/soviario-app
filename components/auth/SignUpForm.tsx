'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpAction, AuthActionState } from '@/app/_actions/auth.actions'; // Adjust path if needed

// Define the schema based on the server action's schema
const SignUpFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
  // Add confirmPassword if needed for client-side validation
  // confirmPassword: z.string().min(8, { message: 'Please confirm your password.' }),
})
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"], // path of error
// });

type SignUpFormData = z.infer<typeof SignUpFormSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<AuthActionState>({ message: null, success: false });

  const {
    register,
    handleSubmit,
    formState: { errors: clientErrors }, // Renamed to avoid conflict with server state errors
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpFormSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    setFormState({ message: null, success: false }); // Clear previous server errors/messages
    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      const result = await signUpAction({ message: null, success: false }, formData);
      setFormState(result); // Set the state returned from the server action

      if (result.success) {
        // Registration successful
        // Optionally redirect to sign-in or show a success message
        // router.push('/auth/sign-in?message=Registration successful!');
        // For now, just display the success message from the action state
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {formState.message && (
        <div className={`${formState.success ? 'text-green-700 bg-green-100 border-green-300' : 'text-red-500 bg-red-100 border-red-300'} text-sm p-3 border rounded`}>
          {formState.message}
        </div>
      )}
      {/* Display general form error from server action if present */}
      {formState.errors?._form && (
         <div className="text-red-500 text-sm p-3 bg-red-100 border border-red-300 rounded">
          {formState.errors._form.join(', ')}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          {...register('email')}
          aria-invalid={clientErrors.email || formState.errors?.email ? 'true' : 'false'}
        />
        {clientErrors.email && <p className="text-sm text-red-500">{clientErrors.email.message}</p>}
        {formState.errors?.email && <p className="text-sm text-red-500">{formState.errors.email.join(', ')}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={clientErrors.password || formState.errors?.password ? 'true' : 'false'}
        />
        {clientErrors.password && <p className="text-sm text-red-500">{clientErrors.password.message}</p>}
         {formState.errors?.password && <p className="text-sm text-red-500">{formState.errors.password.join(', ')}</p>}
      </div>

      {/* Add Confirm Password field if using client-side check
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          aria-invalid={clientErrors.confirmPassword ? 'true' : 'false'}
        />
        {clientErrors.confirmPassword && <p className="text-sm text-red-500">{clientErrors.confirmPassword.message}</p>}
      </div>
      */}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Signing Up...' : 'Sign Up'}
      </Button>

       {/* Add link to sign in */}
       <div className="text-center text-sm">
        Already have an account? <a href="/auth/sign-in" className="underline">Sign in</a>
      </div>
    </form>
  );
}
