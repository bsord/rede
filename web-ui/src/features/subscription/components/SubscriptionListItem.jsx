
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Elements';

const SubscriptionListItem = ({ subscription }) => {
  const navigate = useNavigate();

  return (
    <li className="border p-4 border-gray-400 rounded-lg shadow-md">
      <div className="mb-2">
        <strong>Type:</strong> {subscription.template.name}
      </div>
      <div className="mb-2">
        <strong>Niche:</strong> {subscription.niche}
      </div>
      <div className="mb-2">
        <strong>Status:</strong> {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
      </div>
      <div className="mb-2">
        <strong>Last Sent:</strong> {subscription.lastProcessedTime ? new Date(subscription.lastProcessedTime).toLocaleString() : 'N/A'}
      </div>
      <Button onClick={() => navigate(`/subscriptions/${subscription._id}/manage`)}>
        Manage
      </Button>
    </li>
  );
};

export default SubscriptionListItem;
