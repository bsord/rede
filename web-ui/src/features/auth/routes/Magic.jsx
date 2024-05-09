import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMagic } from '../api/magic';
import { Layout } from '../components/Layout';
import { Button } from '@/components/Elements';
import { MagicLinkRequest } from '../components/MagicLinkRequest';

export const Magic = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { mutate: magic, isPending, error } = useMagic();
    const [codeSecret, setCodeSecret] = useState('');

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
    useEffect(() => {
        const generateSecret = () => Math.floor(100000 + Math.random() * 900000);
        setCodeSecret(generateSecret().toString());
    }, []);

    return (
        <Layout title="Login with magic link">
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
        </Layout>
    );
};