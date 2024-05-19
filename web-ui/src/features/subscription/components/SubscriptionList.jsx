import { List } from '../../../components/Elements';
import SubscriptionListItem from './SubscriptionListItem';
import { useSubscriptions } from '../api/getSubscription';

const SubscriptionList = () => {
    // todo: get subscriptions
  const { data: subscriptions, isLoading, error } = useSubscriptions();

  if (isLoading) {
    return <span>Loading</span>;
  }

  if (error) {
    return <span>There was an error</span>;
  }

  if (subscriptions.length < 1){
    return <span>No subscriptions yet</span>
  }

  return (
    <ul className='flex flex-col space-y-4 md:w-1/2 w-full'>
      {subscriptions?.map((subscription, key) => {
        return (
          <SubscriptionListItem key={key} subscription={subscription}/>
        )
      })}
    </ul>
  );
}

export default SubscriptionList
