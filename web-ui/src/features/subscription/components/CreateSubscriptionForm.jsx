
import { Input } from '../../../components/Elements'
import { Typography } from '../../../components/Elements'
import { Button } from '../../../components/Elements'
import { LinearProgress } from '../../../components/Elements'
import { useCreateSubscription } from '../api/createSubscription'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

const CreateSubscriptionForm = () => {
  const navigate = useNavigate()
  const { mutate: createSubscription, isPending, error } = useCreateSubscription()

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const credentials = {
      email: data.get('email'),
      niche: data.get('niche'),
    }
    createSubscription(credentials, {
      onSuccess: (response) => {
        console.log(response)
        navigate(`/subscriptions`)
      },
    })
  }

  return (
    <div>
      Fill out the form to create a subscription
      <form
        onSubmit={(event) => {
          handleSubmit(event)
        }}
      >
        <div className="flex flex-col gap-2 mb-4">
          <Typography variant="h6">Email Address</Typography>
          <Input
            id="email"
            label="email"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <Typography variant="h6">Niche</Typography>
          <Input
            id="niche"
            label="niche"
            name="niche"
            autoComplete="niche"
            autoFocus
          />
          <Button type="submit" disabled={isPending}>
            {isPending && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
            Subscribe
          </Button>
        </div>
        {isPending && <LinearProgress />}
        {error && <span>There was an error</span>}
      </form>
    </div>
  )
}

export default CreateSubscriptionForm
