'use client';

import { signIn } from 'next-auth/react';

export async function signInAction(data: { email: string; password: string }) {
  try {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    // Redirect to home page on success
    window.location.href = '/';
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signUpAction(data: { name: string; email: string; password: string }) {
  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, errors: result.details || { email: [result.error] } };
    }

    // After successful signup, sign in the user
    await signInAction({ email: data.email, password: data.password });
    return { success: true };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, errors: { email: ['An unexpected error occurred'] } };
  }
}