import  CreateSubscriptionForm  from '../components/CreateSubscriptionForm'
import { Layout } from '../components/Layout';

export const CreateSubscription = () => {
  return (
    <Layout title="Create New Subscription">
      <div className='flex justify-center items-center h-full'>
        <div className='bg-white p-4 rounded-xl w-1/2'>
          <CreateSubscriptionForm/>
        </div>
      </div>
    </Layout>
  );
};
