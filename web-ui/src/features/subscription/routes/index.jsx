import { Navigate, Route, Routes } from 'react-router-dom';

import { Subscriptions } from './Subscriptions';
import { Subscription } from './Subscription';
import { CreateSubscription } from './CreateSubscription';
import { Unsubscribe } from './Unsubscribe';

export const SubscriptionRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Subscriptions />} />
      <Route path="/new" element={<CreateSubscription />} />
      <Route path="/:subscriptionId/unsubscribe" element={<Unsubscribe />} />
      <Route path="/:subscriptionId/*" element={<Subscription />} />
      <Route path="*" element={<Navigate to="." />} />
    </Routes>
  );
};
