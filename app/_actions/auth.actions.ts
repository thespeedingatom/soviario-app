'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { saleorLogin, saleorRegister, saleorRequestPasswordReset, saleorSetNewPassword, SaleorError } from '@/domains/saleor/services/saleorApi'; // Assuming src alias is configured

// Define cookie names and options
const ACCESS_TOKEN_COOKIE = 'saleor-access-token';
const REFRESH_TOKEN_COOKIE = 'saleor-refresh-token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  sameSite: 'lax', // Or 'strict'
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // Example: 30 days expiry for refresh token
} as const;
const ACCESS_TOKEN_MAX_AGE = 60 * 15; // Example: 15 minutes for access token

// Define Zod schemas for form validation
const SignInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const SignUpSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});

const RequestPasswordResetSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
});

const SetNewPasswordSchema = z.object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
    token: z.string().min(1, { message: 'Reset token is missing.' }), // Token usually comes from URL param
});


export interface AuthActionState {
  message: string | null;
  success: boolean;
  errors?: {
    email?: string[];
    password?: string[];
    token?: string[];
    _form?: string[]; // General form error
  };
}

// --- Sign In Action ---
export async function signInAction(
  prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validatedFields = SignInSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  // Return validation errors
  if (!validatedFields.success) {
    return {
      message: 'Invalid credentials.',
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const result = await saleorLogin(email, password);

    if (result.errors || !result.data?.tokenCreate?.token || !result.data?.tokenCreate?.refreshToken) {
      const apiError = result.errors?.[0];
      console.error('Saleor Login Error:', apiError);
      return { message: apiError?.message || 'Sign in failed. Please check your credentials.', success: false, errors: { _form: [apiError?.message || 'Sign in failed.'] } };
    }

    const { token, refreshToken } = result.data.tokenCreate;

    // Set cookies
    const cookieStore = await cookies(); // Try awaiting
    // @ts-ignore - Suppressing potential type inference issue
    cookieStore.set(ACCESS_TOKEN_COOKIE, token, { ...COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE });
    // @ts-ignore - Suppressing potential type inference issue
    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_OPTIONS);

    // Redirect on success (handled by client usually, but can force here if needed)
    // redirect('/dashboard'); // Or use client-side navigation based on success state

    return { message: 'Sign in successful!', success: true };

  } catch (error) {
    console.error('Sign In Action Error:', error);
    if (error instanceof SaleorError) {
        return { message: error.message, success: false, errors: { _form: [error.message] } };
    }
    return { message: 'An unexpected error occurred.', success: false, errors: { _form: ['An unexpected error occurred.'] } };
  }
}

// --- Sign Out Action ---
export async function signOutAction(): Promise<void> {
    try {
        // Clear cookies
        const cookieStore = await cookies(); // Try awaiting
        // @ts-ignore - Suppressing potential type inference issue
        cookieStore.delete(ACCESS_TOKEN_COOKIE);
        // @ts-ignore - Suppressing potential type inference issue
        cookieStore.delete(REFRESH_TOKEN_COOKIE);

        // Optional: Call Saleor endpoint if server-side token invalidation exists
        // await saleorLogout();

    } catch (error) {
        console.error('Sign Out Action Error:', error);
        // Don't typically throw here, just log, as sign out should usually succeed locally
    }

    // Redirect to home or sign-in page after sign out
    redirect('/');
}

// --- Sign Up Action ---
export async function signUpAction(
    prevState: AuthActionState,
    formData: FormData,
): Promise<AuthActionState> {
    const validatedFields = SignUpSchema.safeParse(
        Object.fromEntries(formData.entries()),
    );

    if (!validatedFields.success) {
        return {
            message: 'Invalid registration details.',
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { email, password } = validatedFields.data;

    try {
        const result = await saleorRegister(email, password);

        if (result.errors || !result.data?.accountRegister?.user) {
            const apiError = result.errors?.[0];
            console.error('Saleor Registration Error:', apiError);
            // Handle specific error codes if needed (e.g., email already exists)
            return { message: apiError?.message || 'Registration failed.', success: false, errors: { _form: [apiError?.message || 'Registration failed.'] } };
        }

        // Optional: Automatically sign in the user after successful registration
        // const signInResult = await signInAction({ message: null, success: false }, formData);
        // if (!signInResult.success) {
        //     return { message: 'Registration successful, but auto sign-in failed.', success: false, errors: signInResult.errors };
        // }

        return { message: 'Registration successful! Please sign in.', success: true };

    } catch (error) {
        console.error('Sign Up Action Error:', error);
        if (error instanceof SaleorError) {
            return { message: error.message, success: false, errors: { _form: [error.message] } };
        }
        return { message: 'An unexpected error occurred during registration.', success: false, errors: { _form: ['An unexpected error occurred.'] } };
    }
}

// --- Request Password Reset Action ---
export async function requestPasswordResetAction(
    prevState: AuthActionState,
    formData: FormData,
): Promise<AuthActionState> {
    const validatedFields = RequestPasswordResetSchema.safeParse(
        Object.fromEntries(formData.entries()),
    );

    if (!validatedFields.success) {
        return {
            message: 'Invalid email address.',
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { email } = validatedFields.data;
    // Construct the redirect URL for the password reset link
    // IMPORTANT: Ensure this matches a page in your app that handles the reset token
    const redirectUrl = new URL('/auth/reset-password', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').toString();

    try {
        const result = await saleorRequestPasswordReset(email, redirectUrl);

        if (result.errors) {
            const apiError = result.errors?.[0];
            console.error('Saleor Password Reset Request Error:', apiError);
            return { message: apiError?.message || 'Failed to send password reset email.', success: false, errors: { _form: [apiError?.message || 'Failed.'] } };
        }

        return { message: 'If an account exists for this email, a password reset link has been sent.', success: true };

    } catch (error) {
        console.error('Request Password Reset Action Error:', error);
        if (error instanceof SaleorError) {
            return { message: error.message, success: false, errors: { _form: [error.message] } };
        }
        return { message: 'An unexpected error occurred.', success: false, errors: { _form: ['An unexpected error occurred.'] } };
    }
}


// --- Set New Password Action ---
export async function setNewPasswordAction(
    prevState: AuthActionState,
    formData: FormData,
): Promise<AuthActionState> {
    // Note: The reset 'token' usually comes from a URL query parameter, not the form itself.
    // It needs to be passed into this action when called.
    // We validate the password from the form, but assume the token is passed correctly.
    const validatedFields = SetNewPasswordSchema.safeParse(
        Object.fromEntries(formData.entries()),
    );

     if (!validatedFields.success) {
        return {
            message: 'Invalid input.',
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { password, token } = validatedFields.data;

    if (!token) {
         return { message: 'Password reset token is missing or invalid.', success: false, errors: { token: ['Token is required.'] } };
    }

    try {
        const result = await saleorSetNewPassword(token, password);

        if (result.errors || !result.data?.setPassword?.token) {
             const apiError = result.errors?.[0];
            console.error('Saleor Set New Password Error:', apiError);
            return { message: apiError?.message || 'Failed to reset password.', success: false, errors: { _form: [apiError?.message || 'Failed.'] } };
        }

        // Password reset successful, potentially auto-sign-in
        const { token: newToken, refreshToken: newRefreshToken } = result.data.setPassword;
        if (newToken && newRefreshToken) {
            const cookieStore = await cookies(); // Try awaiting
            // @ts-ignore - Suppressing potential type inference issue
            cookieStore.set(ACCESS_TOKEN_COOKIE, newToken, { ...COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE });
            // @ts-ignore - Suppressing potential type inference issue
            cookieStore.set(REFRESH_TOKEN_COOKIE, newRefreshToken, COOKIE_OPTIONS);
            // Redirect to dashboard after successful reset and sign-in
            // redirect('/dashboard');
             return { message: 'Password reset successful! You are now signed in.', success: true };
        }

        return { message: 'Password reset successful! Please sign in with your new password.', success: true };


    } catch (error) {
        console.error('Set New Password Action Error:', error);
         if (error instanceof SaleorError) {
            return { message: error.message, success: false, errors: { _form: [error.message] } };
        }
        return { message: 'An unexpected error occurred while resetting password.', success: false, errors: { _form: ['An unexpected error occurred.'] } };
    }
}
