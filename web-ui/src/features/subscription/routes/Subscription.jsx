import  ManageSubscription  from '../components/ManageSubscription'
import { Layout } from '../components/Layout';
import { useParams } from 'react-router-dom';
import { Typography } from '../../../components/Elements';
export const Subscription = () => {
  const { subscriptionId } = useParams();
  return (
    <Layout title="Subscriptions">
      <div className='flex w-full items-center justify-center'>
        <div className='flex flex-col justify-center items-center w-full'>

          <div className='bg-gray-100 w-full flex flex-col p-4 md:p-8 items-center shadow-md'>
            <div className='max-w-5xl w-full'>
              <Typography variant="h2" className="text-2xl mb-4 text-gray-900 leading-none">Edit Subscription</Typography>
              <p className='text-lg md:text-2xl leading-9 text-gray-700'>Changes will be applied on the next scheduled email</p>
            </div>
          </div>


     
          <div className='w-full flex flex-col items-center p-4 md:p-8'>
            <div className='max-w-5xl w-full'>
              <ManageSubscription subscriptionId={subscriptionId}/>
            </div>
          </div>
        </div>
      </div>
  </Layout>
  );
};
