
import { useDeleteSubscription } from '../api/deleteSubscription';
import { LinearProgress } from '../../../components/Elements';
import { Input, Button } from '../../../components/Elements';
import SubscriptionEvents from './SubscriptionEvents';

const SubscriptionListItem = ({subscription}) => {
  const { mutate: deleteSubscription, isPending: isDeletePending, error: deleteError } = useDeleteSubscription();
  const handleDelete = () => {
    deleteSubscription(subscription._id, {
      onSuccess: () => {
        console.log('created subscription');
        handleClose();
      },
    });
  };
  return (
    <li className='border p-2 border-gray-400 rounded-lg'>
      <div>email: {subscription.email}</div>
      <div>niche: {subscription.niche}</div>
      <div>id: {subscription._id}</div>
      <div>type: {subscription.template.name}</div>
      <div>Next Email: {subscription.nextRunTime}</div>
      <div>Last Email: {subscription.lastProcessedTime}</div>
      <div>intervalMinutes: {subscription.intervalMinutes}</div>
      <Button
        onClick={() => {
          handleDelete();
        }}
      >
        x
      </Button>
      {isDeletePending && <LinearProgress />}
      <SubscriptionEvents subscriptionId={subscription._id}/>
    </li>
  );
}

export default SubscriptionListItem
