import { Navigate } from 'react-router-dom'
import { Error } from './components/Error'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Landing, NotFound, Privacy } from './features/misc'
import { AppProvider } from './providers/App'
import { useAuthenticatedUser } from './features/auth/api/getAuthenticatedUser'
import { AuthRoutes } from './features/auth'
import { SubscriptionRoutes } from './features/subscription'

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
      <ProtectedRoute>
        <SubscriptionRoutes />
      </ProtectedRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: '/',
    element: <Landing />,
    errorElement: <Error />,
  },
  {
    path: '/privacy',
    element: <Privacy />,
    errorElement: <Error />,
  },
  {
    path: '/auth/*',
    element: <AuthRoutes />,
    errorElement: <Error />,
  },
  {
    path: '*',
    element: <NotFound />,
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
