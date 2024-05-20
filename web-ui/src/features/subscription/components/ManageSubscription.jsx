import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionById } from '../api/getSubscription';
import { useUpdateSubscription } from '../api/updateSubscription';
import { useDeleteSubscription } from '../api/deleteSubscription';
import { Button, LinearProgress } from '../../../components/Elements';
import SubscriptionEvents from './SubscriptionEvents';
import { intervals } from './data';
import { Select } from '../../../components/Elements/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// Helper function to format dates nicely
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString(); // Adjust this format as needed
};

const statuses = ['active', 'inactive', 'paused'];

const ManageSubscription = ({ subscriptionId, onSubscriptionDeleted }) => {
  const navigate = useNavigate();
  const { data: subscription, isLoading, error } = useSubscriptionById(subscriptionId);
  const updateSubscription = useUpdateSubscription();
  const { mutate: deleteSubscription, isPending: isDeletePending, error: deleteError } = useDeleteSubscription();
  const [intervalMinutes, setIntervalMinutes] = useState('');
  const [status, setStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isLoading && subscription) {
      setIntervalMinutes(subscription.intervalMinutes);
      setStatus(subscription.status);
    }
    
  }, [subscription, isLoading]);

  const handleUpdate = () => {
    setIsUpdating(true);
    const updatedSubscription = {
      ...subscription,
      intervalMinutes: parseInt(intervalMinutes, 10),
      status,
    };
    updateSubscription.mutate(updatedSubscription, {
      onSuccess: () => {
        setIsUpdating(false);
      },
      onError: () => {
        setIsUpdating(false);
      },
    });
  };

  const handleDelete = () => {
    deleteSubscription(subscription._id, {
      onSuccess: () => {
        console.log('Deleted subscription');
        if (onSubscriptionDeleted) {
          onSubscriptionDeleted(subscriptionId);
        }
        navigate('/subscriptions');
      },
    });
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    console.log(error);
    return <span>There was an error</span>;
  }

  return (
    <div className="border p-4 border-gray-300 bg-white rounded-lg shadow-md md:w-1/2 w-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Type:</label>
        <span className="text-lg font-semibold">{subscription.template.name}</span>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Niche:</label>
        <span className="text-lg font-semibold">{subscription.niche}</span>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Last Email:</label>
        <span className="text-lg font-semibold">{formatDate(subscription.lastProcessedTime)}</span>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Next Email:</label>
        <span className="text-lg font-semibold">{formatDate(subscription.nextRunTime)}</span>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Interval:</label>
        <Select
          value={intervalMinutes}
          onChange={(e) => setIntervalMinutes(e.target.value)}
        >
          {intervals.map((interval) => (
            <option key={interval.value} value={interval.value}>
              {interval.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Status:</label>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statuses.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </Select>
      </div>

      <Button
        onClick={handleUpdate}
        disabled={isUpdating || updateSubscription.isLoading}
      >
        {isUpdating ? <>Updating <FontAwesomeIcon icon={faSpinner} className="ml-2 animate-spin" /></>:<>Update</>}
      </Button>
      <Button
        onClick={handleDelete}
        disabled={isDeletePending}
      >
        {isDeletePending ? <>Deleting <FontAwesomeIcon icon={faSpinner} className="ml-2 animate-spin" /></>:<>Delete</>}
      </Button>

      {deleteError && <span className="text-red-600">Delete failed: {deleteError.message}</span>}
      {updateSubscription.isError && (
        <span className="text-red-600">Update failed: {updateSubscription.error.message}</span>
      )}
      {updateSubscription.isSuccess && (
        <span className="text-green-600">Update successful!</span>
      )}
      <div className="mt-4">
        <SubscriptionEvents subscriptionId={subscription._id} />
      </div>
    </div>
  );
};

export default ManageSubscription;