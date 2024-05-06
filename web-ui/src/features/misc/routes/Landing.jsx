import { CenteredLayout } from '../../../components/Layouts'
import { Typography, Button } from '../../../components/Elements'
import { useNavigate } from 'react-router-dom'
import CreateSubscriptionForm from '../../subscription/components/CreateSubscriptionForm'

export const Landing = () => {
  const navigate = useNavigate()
  return (
    <CenteredLayout title="Welcome">
      <div className="text-center gap-x-4">
        <Typography variant="h3">Welcome to Rede.io!</Typography>
        <CreateSubscriptionForm/>
        
      </div>
    </CenteredLayout>
  )
}
