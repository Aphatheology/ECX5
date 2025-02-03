'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import API from '@/global/apiClient';
import Link from 'next/link';

const AuthPage : React.FC = () => { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const router = useRouter();

    const { authtype } = useParams<{ authtype: string }>();
    const isLogin = authtype === 'login';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const body = isLogin
                ? { email, password }
                : { email, username, password };

            const { data } = await API.post(endpoint, body);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/');
        } catch (error) {
            console.error('Authentication failed', error);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen bg-gray-100'>
            <form
                onSubmit={handleSubmit}
                className='p-6 bg-white shadow-md rounded-lg w-96'
            >
                <h2 className='text-xl font-semibold mb-4 text-gray-900'>
                    {isLogin ? 'Login' : 'Register'}
                </h2>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full p-2 mb-3 border rounded text-gray-900 placeholder-gray-700'
                />
                {!isLogin && (
                    <input
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='w-full p-2 mb-3 border rounded text-gray-900 placeholder-gray-700'
                    />
                )}
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full p-2 mb-3 border rounded text-gray-900 placeholder-gray-700'
                />
                <button
                    type='submit'
                    className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition'
                >
                    {isLogin ? 'Login' : 'Register'}
                </button>
                <p className='mt-3 text-center text-gray-700'>
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
