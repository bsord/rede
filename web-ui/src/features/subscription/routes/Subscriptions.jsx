import  SubscriptionList  from '../components/SubscriptionList'
import { Layout } from '../components/Layout';

export const Subscriptions = () => {
  return (
    <Layout title="Subscriptions">
      <div className='flex justify-center items-center h-full'>
        <SubscriptionList/>
      </div>
    </Layout>
  );
};
