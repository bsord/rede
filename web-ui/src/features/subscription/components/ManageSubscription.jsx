import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionById } from '../api/getSubscription';
import { useUpdateSubscription } from '../api/updateSubscription';
import { useDeleteSubscription } from '../api/deleteSubscription';
import { Button, LinearProgress } from '../../../components/Elements';
import SubscriptionEvents from './SubscriptionEvents';
import { intervals } from './data';

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

  // Initialize state with subscription values once data is available
  useEffect(() => {
    if (!isLoading && subscription) {
      setIntervalMinutes(subscription.intervalMinutes);
      setStatus(subscription.status);
    }
  }, [subscription, isLoading]);

  // Update handler for interval and status change
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

  // Delete handler
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
    <div className="border p-4 border-gray-300 rounded-lg shadow-md bg-white">
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
        <select
          value={intervalMinutes}
          onChange={(e) => setIntervalMinutes(e.target.value)}
          className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {intervals.map((interval) => (
            <option key={interval.value} value={interval.value}>
              {interval.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {statuses.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={handleUpdate}
        disabled={isUpdating || updateSubscription.isLoading}
      >
        {isUpdating || updateSubscription.isLoading ? 'Updating...' : 'Update'}
      </Button>
      <Button
        onClick={handleDelete}
        disabled={isDeletePending}
      >
        {isDeletePending ? 'Deleting...' : 'Delete Subscription'}
      </Button>

      {(isUpdating || isDeletePending) && <LinearProgress />}
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