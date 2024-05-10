import { Navigate } from 'react-router-dom'
import { Error } from './components/Error'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Landing, NotFound, Privacy } from './features/misc'
import { AppProvider } from './providers/App'
import { useAuthenticatedUser } from './features/auth/api/getAuthenticatedUser'
import { AuthRoutes } from './features/auth'
import { SubscriptionRoutes } from './features/subscription'
import ReactGA from 'react-ga4';
import { Analytics } from './providers/Analytics'
import { Unsubscribe } from './features/misc/routes/Unsubscribe';

ReactGA.initialize('G-E4SFXQ77R7');

const ProtectedRoute = ({ children }) => {
  const { data: user } = useAuthenticatedUser()
  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

const router = createBrowserRouter([
  {
    path: '/subscriptions/*',
    element: (
      <Analytics>
        <ProtectedRoute>
          <SubscriptionRoutes />
        </ProtectedRoute>
      </Analytics>
    ),
    errorElement: <Error />,
  },
  {
    path: '/unsubscribe',
    element: (
      <Analytics>
        <Unsubscribe/>
      </Analytics>
    ),
    errorElement: <Error />,
  },
  {
    path: '/',
    element: <Analytics><Landing /></Analytics>,
    errorElement: <Error />,
  },
  {
    path: '/privacy',
    element: <Analytics><Privacy /></Analytics>,
    errorElement: <Error />,
  },
  {
    path: '/auth/*',
    element: <Analytics><AuthRoutes /></Analytics>,
    errorElement: <Error />,
  },
  {
    path: '*',
    element: <Analytics><NotFound /></Analytics>,
    errorElement: <Error />,
  },
])

const App = () => {
  console.log('app')
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}

export default App
