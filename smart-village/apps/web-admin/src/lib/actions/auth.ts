'use server';

import { apiClient } from '@/lib/api-client';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const response = await apiClient.post('/auth/login', {
      emailOrPhone: email,
      password,
    });

    if (response.data.success) {
      const accessToken = response.data.data.accessToken;
      const refreshToken = response.data.data.refreshToken;
      
      cookies().set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 15,
        path: '/',
      });
      cookies().set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    }
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
  }

  redirect('/dashboard');
}

export async function logout() {
  cookies().delete('accessToken');
  cookies().delete('refreshToken');
  redirect('/login');
}