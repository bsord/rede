import { useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMagic } from '../api/magic';
import { Layout } from '../components/Layout';
import { Button } from '@/components/Elements'

export const Magic = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { mutate: magic, isPending, error } = useMagic();

    // Correctly memoize the token extracted from searchParams
    const token = useMemo(() => searchParams.get('token'), []);

    useEffect(() => {
        console.log('token', token);
        if (token) {
            console.log('token found, attempting login');
            magic({ token }, {
                onSuccess: () => navigate('/subscriptions/new'),
            });
        }
    }, [token, navigate]);

    return (
        <Layout title="Login with magic link">
            {token ? (
                <>
                    {isPending && <div>Signing you in...</div>}
                    {error && <div>There was a problem signing you in. <Button>Send another magic link</Button></div>}
                </>
            ) : (
                <>
                    Login here
                    {isPending && <div>Signing you in...</div>}
                    {error && <div>There was a problem signing you in. Try again by entering your email here:</div>}
                </>
            )}
        </Layout>
    );
};