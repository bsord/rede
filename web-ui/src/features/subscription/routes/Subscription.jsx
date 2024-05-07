import  ManageSubscription  from '../components/ManageSubscription'
import { Layout } from '../components/Layout';
import { useParams } from 'react-router-dom';
export const Subscription = () => {
  const { subscriptionId } = useParams();
  return (
    <Layout title="Subscriptions">
      <div className='flex justify-center items-center h-full'>
        <div className='bg-white p-4 rounded-xl w-1/2'>
          <ManageSubscription subscriptionId={subscriptionId}/>
        </div>
      </div>
    </Layout>
  );
};
