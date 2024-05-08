import { useSubscriptionEventsBySubscriptionId } from '../api/getSubscriptionEvents';

import { Typography } from '@/components/Elements'

const SubscriptionEvents = ({subscriptionId}) => {
  const { data: subscriptionEvents, isLoading, error } = useSubscriptionEventsBySubscriptionId(subscriptionId);

  if (isLoading) {
    return <span>Loading</span>;
  }

  if (error) {
    console.log(error)
    return <span>There was an error</span>;
  }

  return (
    <div>
        <Typography variant="h3" className="m-2">
            Events
        </Typography>
        <div className='p-2 flex flex-col space-y-4'>
            {subscriptionEvents?.map((event, key) => {
                return (
                    <ul key={key} className='p-2 rounded-xl bg-gray-100'>
                        <li>type: {event.type}</li>
                        <li>status: {event.status}</li>
                        <li>timestamp: {event.createdAt} </li>
                    </ul>
                )
            })}
        </div>

    </div>
  );
}

export default SubscriptionEvents