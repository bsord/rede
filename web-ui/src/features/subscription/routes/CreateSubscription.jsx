import  CreateSubscriptionForm  from '../components/CreateSubscriptionForm'
import { Layout } from '../components/Layout';
import { Typography } from '../../../components/Elements';

export const CreateSubscription = () => {
  return (
    <Layout title="Create New Subscription">
      <div className='flex w-full items-center justify-center'>
        <div className='flex flex-col justify-center items-center w-full'>

          <div className='bg-gray-100 w-full flex flex-col p-4 md:p-8 items-center shadow-md'>
            <div className='max-w-5xl w-full'>
              <Typography variant="h2" className="text-2xl mb-4 text-gray-900 leading-none">Create subscription</Typography>
              <p className='text-lg md:text-2xl leading-9 text-gray-700'>Pick the type of email you'd like to receive, the niche, and frequency. </p>
            </div>
          </div>
          
          <div className='w-full flex flex-col items-center p-4 md:p-8'>
            <div className='max-w-5xl w-full'>
              <CreateSubscriptionForm/>
            </div>
          </div>
          
        </div>
      </div>
    </Layout>
  );
};
