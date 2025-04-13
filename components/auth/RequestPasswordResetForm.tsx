'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { requestPasswordResetAction, AuthActionState } from '@/app/_actions/auth.actions'; // Adjust path if needed

// Define the schema based on the server action's schema
const RequestPasswordResetFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type RequestPasswordResetFormData = z.infer<typeof RequestPasswordResetFormSchema>;

export function RequestPasswordResetForm() {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<AuthActionState>({ message: null, success: false });

  const {
    register,
    handleSubmit,
    formState: { errors: clientErrors },
  } = useForm<RequestPasswordResetFormData>({
    resolver: zodResolver(RequestPasswordResetFormSchema),
  });

  const onSubmit = (data: RequestPasswordResetFormData) => {
    setFormState({ message: null, success: false }); // Clear previous messages
    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', data.email);

      const result = await requestPasswordResetAction({ message: null, success: false }, formData);
      setFormState(result); // Set the state returned from the server action
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
          placeholder="Enter your account email"
          {...register('email')}
          aria-invalid={clientErrors.email || formState.errors?.email ? 'true' : 'false'}
        />
        {clientErrors.email && <p className="text-sm text-red-500">{clientErrors.email.message}</p>}
        {formState.errors?.email && <p className="text-sm text-red-500">{formState.errors.email.join(', ')}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Password Reset Email'}
      </Button>

      {/* Add link back to sign in */}
       <div className="text-center text-sm">
        Remembered your password? <a href="/auth/sign-in" className="underline">Sign in</a>
      </div>
    </form>
  );
}
