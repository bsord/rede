import  ManageSubscription  from '../components/ManageSubscription'
import { Layout } from '../components/Layout';
import { useParams } from 'react-router-dom';
import { useDeleteSubscription } from '../api/deleteSubscription';
import { Button, LinearProgress, Typography } from '../../../components/Elements';
import { useState } from 'react';
export const Unsubscribe = () => {
  const { subscriptionId } = useParams();
  const [unsubscribed, setUnsubscribed] = useState(false)

  const {mutate: deleteSubscription, isPending, error } = useDeleteSubscription()

  const handleDelete = () => {
    deleteSubscription(subscriptionId, {
      onSuccess: (response) => {
        console.log(response);
        setUnsubscribed(true)
      },
    })
  }

  if(error){
    console.log(error)
  }

  if (!unsubscribed) {
    return (
      
        <div className='flex justify-center items-center h-screen w-full'>
          <div className='bg-white p-4 rounded-xl w-1/2'>
            <Typography variant='h3'>Are you sure you want to unsubscribe?</Typography>
            <Button onClick={()=>{handleDelete()}}> Yes, Unsubscribe </Button>
            {isPending && <LinearProgress/>}
            {error && <div>There was an error while trying unsubscribe, you may have already been unsubscribed.</div>}
          </div>
        </div>

    );
  } else {
    return (

        <div className='flex justify-center items-center h-screen w-full'>
          <div className='bg-white p-4 rounded-xl w-1/2 text-center'>
            Succesfully unsubscribed!
          </div>
        </div>

    )
  }
  
};
