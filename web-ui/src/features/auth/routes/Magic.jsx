import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMagic } from '../api/magic';
import { Layout } from '../components/Layout';
import { Button } from '@/components/Elements';
import { MagicLinkRequest } from '../components/MagicLinkRequest';
import { CenteredLayout } from '../../../components/Layouts';

export const Magic = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { mutate: magic, isPending, error } = useMagic();


    // Correctly memoize the token extracted from searchParams
    const token = useMemo(() => searchParams.get('token'), []);
    const email = useMemo(() => searchParams.get('email'), []);

    useEffect(() => {
        console.log('token', token);
        if (token) {
            console.log('token found, attempting login');
            magic({ token }, {
                onSuccess: () => navigate('/subscriptions'),
            });
        }
    }, [token, navigate, magic]);

    // Generate the secret when the component mounts
    const codeSecret = Math.floor(100000 + Math.random() * 900000).toString();

    return (
        <CenteredLayout title="Login">
            <div className="h-full items-center justify-center flex p-4">
                <div className='max-w-2xl w-full bg-white rounded-xl shadow-lg border border-gray-200'>
                    {token ? (
                        <>
                            {isPending && <div>Signing you in...</div>}
                            {error && <div>There was a problem signing you in.</div>}
                        </>
                    ) : (
                        <>
                            <MagicLinkRequest initialEmail={email} codeSecret={codeSecret} /> 
                        </>
                    )}
                </div>
                
            </div>
        </CenteredLayout>
    );
};