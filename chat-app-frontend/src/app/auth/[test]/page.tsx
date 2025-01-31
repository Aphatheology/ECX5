'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/global/apiClient';
import React from 'react';

const AuthPage = ({ params }: { params: Promise<{ test: string }> }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const router = useRouter();
    const resolvedParams = React.use(params);
    const isLogin = resolvedParams.test === 'login';
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            console.log(isLogin, endpoint);
            const body = isLogin
                ? { email, password }
                : { email, username, password };
            const { data } = await API.post(endpoint, body);
            console.log(data);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', data.user);
            localStorage.setItem('username', data.user.username);
            router.push('/');
        } catch (error) {
            console.error('Authentication failed', error);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen'>
            <form
                onSubmit={handleSubmit}
                className='p-6 bg-white shadow-md rounded-lg'
            >
                <h2 className='text-xl font-semibold mb-4'>
                    {isLogin ? 'Login' : 'Register'}
                </h2>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full p-2 mb-3 border rounded'
                />
                {isLogin ? null : (
                    <input
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='w-full p-2 mb-3 border rounded'
                    />
                )}
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full p-2 mb-3 border rounded'
                />
                <button
                    type='submit'
                    className='w-full bg-blue-500 text-white py-2 rounded'
                >
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default AuthPage;
