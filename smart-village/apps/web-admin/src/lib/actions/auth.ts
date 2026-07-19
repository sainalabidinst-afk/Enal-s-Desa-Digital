'use server';

import { apiClient } from '@/lib/api-client';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const response = await apiClient.post('/auth/login', {
      emailOrPhone: email,
      password,
    });

    if (response.data.success) {
      // Note: In client component, use localStorage
      // For server actions, you might need cookies
    }
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
  }

  redirect('/dashboard');
}