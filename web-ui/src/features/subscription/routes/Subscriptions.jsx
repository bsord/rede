import  SubscriptionList  from '../components/SubscriptionList'
import { Layout } from '../components/Layout';

export const Subscriptions = () => {
  return (
    <Layout title="Subscriptions">
      <div className='flex justify-center items-center h-full'>
        <div className='bg-white p-4 rounded-xl w-1/2'>
          <SubscriptionList/>
        </div>
      </div>
    </Layout>
  );
};
