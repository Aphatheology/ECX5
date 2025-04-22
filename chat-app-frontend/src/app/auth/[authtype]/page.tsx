'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import API from '@/global/apiClient';
import Link from 'next/link';
import { toast } from 'sonner';

const AuthPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const router = useRouter();

    const { authtype } = useParams<{ authtype: string }>();
    const isLogin = authtype === 'login';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            if (!email || !password) {
                toast.error('Email and Password are required for login.');
                return;
            }
        }

        if (!isLogin) {
            if (!email || !username || !password) {
                toast.error(
                    'Email, Username, and Password are required for registration.'
                );
                return;
            }
        }

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const body = isLogin
                ? { email, password }
                : { email, username, password };

            const { data } = await API.post(endpoint, body);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
            router.push('/');
        } catch (error) {
            console.error('Authentication failed', error);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen bg-gray-900 text-white'>
            <form
                onSubmit={handleSubmit}
                className='p-6 bg-gray-800 shadow-md rounded-lg w-96'
            >
                <h2 className='text-xl font-semibold mb-4 text-white'>
                    {isLogin ? 'Login' : 'Register'}
                </h2>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full p-2 mb-3 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-500'
                />
                {!isLogin && (
                    <input
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='w-full p-2 mb-3 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-500'
                    />
                )}
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full p-2 mb-3 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-500'
                />
                <button
                    type='submit'
                    className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'
                >
                    {isLogin ? 'Login' : 'Register'}
                </button>
                <p className='mt-3 text-center text-gray-400'>
                    {isLogin ? (
                        <>
                            Don&apos;t have an account?{' '}
                            <Link
                                href='/auth/register'
                                className='text-blue-500 hover:underline'
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            Have an account?{' '}
                            <Link
                                href='/auth/login'
                                className='text-blue-500 hover:underline'
                            >
                                Login
                            </Link>
                        </>
                    )}
                </p>
            </form>
        </div>
    );
};

export default AuthPage;
