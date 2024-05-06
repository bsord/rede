import { Navigate, Route, Routes } from 'react-router-dom';

import { Subscriptions } from './Subscriptions';
import { Subscription } from './Subscription';
import { CreateSubscription } from './CreateSubscription';

export const SubscriptionRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Subscriptions />} />
      <Route path="/new" element={<CreateSubscription />} />
      <Route path="*" element={<Navigate to="." />} />
    </Routes>
  );
};
