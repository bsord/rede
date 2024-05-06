import { useSubscriptionById } from '../api/getSubscription';

const ManageSubscription = ({subscriptionId}) => {
  const { data: subscription, isLoading, error } = useSubscriptionById(subscriptionId);

  if (isLoading) {
    return <span>Loading</span>;
  }

  if (error) {
    console.log(error)
    return <span>There was an error</span>;
  }

  return (
    <div className='border p-2 border-gray-400 rounded-lg'>
      <div>email: {subscription.email}</div>
      <div>niche: {subscription.niche}</div>
      <div>id: {subscription._id}</div>
    </div>
  );
}

export default ManageSubscription
