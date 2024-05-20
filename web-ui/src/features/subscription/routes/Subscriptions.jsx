import  SubscriptionList  from '../components/SubscriptionList'
import { Layout } from '../components/Layout';
import { Typography } from '../../../components/Elements';
export const Subscriptions = () => {
  return (
    <Layout title="Subscriptions">
      <div className='flex w-full items-center justify-center'>
        <div className='flex flex-col justify-center items-center w-full'>

          <div className='w-full flex flex-col p-4 md:p-8 items-center shadow-md bg-gray-100'>
            <div className='max-w-5xl w-full'>
              <Typography variant="h2" className="text-2xl mb-4 text-gray-900 leading-none">Subscription Management</Typography>
              <p className='text-lg md:text-2xl leading-9 text-gray-700'>You can manage your subscriptions below, if you don't already have one, you can create one now!</p>
            </div>
          </div>
          
          <div className='w-full flex flex-col items-center p-4 md:p-8'>
            <div className='max-w-5xl w-full'>
              <SubscriptionList />
            </div>
          </div>
          
        </div>
      </div>
    </Layout>
  );
};
