import { CenteredLayout } from '../../../components/Layouts'
import { Typography } from '../../../components/Elements'
import { Link } from 'react-router-dom'
import CreateSubscriptionForm from '../../subscription/components/CreateSubscriptionForm'

export const Landing = () => {
  return (
    <CenteredLayout title="Welcome">
      <div className="text-center gap-x-4 max-w-lg w-full mt-4">
        <Typography variant="h3">Welcome to Rede.io!</Typography>
        <CreateSubscriptionForm/>
        <div  className='mt-12'>
          <Link to={'/privacy'}>Privacy</Link>
        </div>
        
      </div>
    </CenteredLayout>
  )
}
