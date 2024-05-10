import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, LinearProgress, Typography } from '../../../components/Elements';
import useUnsubscribe from '../../subscription/api/useUnsubscribe';  // Adjust the path as needed
import { CenteredLayout } from '../../../components/Layouts';

export const Unsubscribe = () => {
  const location = useLocation();
  const [unsubscribed, setUnsubscribed] = useState(false);
  const { mutate: unsubscribe, isLoading, error } = useUnsubscribe();

  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  const handleUnsubscribe = () => {
    if (token) {
      unsubscribe(token, {
        onSuccess: () => {
          setUnsubscribed(true);
        },
        onError: (error) => {
          console.error('Error during unsubscription:', error);
        }
      });
    } else {
      console.error('No token provided for unsubscribe.');
    }
  };

  return (
    <CenteredLayout title="Unsubscribe">
      {!unsubscribed?(
        <div className='flex justify-center items-center h-screen w-full'>
          <div className='bg-white p-4 rounded-xl w-1/2'>
            <Typography variant='h3'>Are you sure you want to unsubscribe?</Typography>
            <Button onClick={handleUnsubscribe}>Yes, Unsubscribe</Button>
            {isLoading && <LinearProgress />}
            {error && <div>There was an error while trying to unsubscribe, you may have already been unsubscribed or the link is invalid.</div>}
          </div>
        </div>
      ):(
  <     div className='flex justify-center items-center h-screen w-full'>
          <div className='bg-white p-4 rounded-xl w-1/2 text-center'>
            Successfully unsubscribed!
          </div>
        </div>
      )}
    </CenteredLayout>
  )
};