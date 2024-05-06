import  CreateSubscriptionForm  from '../components/CreateSubscriptionForm'
import { Layout } from '../components/Layout';

export const CreateSubscription = () => {
  return (
    <Layout title="Create New Subscription">
      <div className='flex justify-center items-center bg-gray-300 h-full'>
        <CreateSubscriptionForm/>
      </div>
    </Layout>
  );
};
