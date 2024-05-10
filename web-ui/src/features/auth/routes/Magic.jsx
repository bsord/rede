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
        <CenteredLayout title="Login with magic link">
            <div className="text-center gap-x-4 max-w-lg w-full mt-4">
                
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
        </CenteredLayout>
    );
};