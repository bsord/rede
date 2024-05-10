import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRegister } from '../api/register'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import { Button, Input, Typography} from '@/components/Elements'
import { useMagicLink } from '../api/magicLink'
import { useMagic } from '../api/magic'
import { useEffect, useState } from 'react'
import { LinearProgress } from '../../../components/Elements'
import { useNavigate } from 'react-router-dom'

export const MagicLinkRequest = ({initialEmail, codeSecret}) => {
  const navigate = useNavigate()
  const magicLink = useMagicLink()
  const magic = useMagic()
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState(initialEmail || '')
  const [numericCode, setNumericCode] = useState('')

  const handleSendLink = () => {
    magicLink.mutate({email, codeSecret}, {
      onSuccess: () => {
        setSent(true)
      },
    })
  }

  const handleLogin = () =>{
    magic.mutate({ email,numericCode,codeSecret }, {
        onSuccess: () => navigate('/subscriptions')
    });
  }

  const handleEmailChange = (e) =>{
    setEmail(e.currentTarget.value)
  }

  useEffect(()=>{
    if(initialEmail && codeSecret){
      magicLink.mutate({email: initialEmail, codeSecret}, {
        onSuccess: () => {
          setSent(true)
        },
      })
    }
  },[])

  if(!sent && !initialEmail){
    return (
        <div className="w-full p-4">
          
          <div className="text-center">
            <Typography variant="h2" className="mb-4">
              Login
            </Typography>
            <Typography className="mb-3 font-normal" variant="lead">
              Sign in via email code or link.
            </Typography>
          </div>
          <form className="mt-8 mb-2 mx-auto w-100 max-w-screen-lg">
            <div className="flex flex-col gap-2 mb-4">
              <Typography variant="h6">Email Address</Typography>
              <Input
                required
                id="email"
                placeholder="Email@domain.com"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e)=>{handleEmailChange(e)}}
              />
            </div>


            <Button type="button" disabled={magicLink.isPending} onClick={()=>{handleSendLink()}}>
              Send Magic Link
              {magicLink.isPending && <FontAwesomeIcon icon={faSpinner} className="ml-2 animate-spin" />}
            </Button>

            {magicLink.error && (
              <Typography variant="paragraph" className="text-red-500  my-4">
                {magicLink?.error?.response?.data?.message ?? 'Request failed, please try again later..'}
              </Typography>
            )}

            {magicLink.isPending && <LinearProgress />}
            
          </form>
        </div>
      )
  } else {
    return (
      <div className="w-full p-4">
        <div className="text-center">
          <div className='mb-4'>
            <Typography variant="h3">Check your email!</Typography>
            We sent a verification code. Check your email.
          </div>
          
          <Input
            required
            id="numericCode"
            placeholder="Code"
            name="numericCode"
            autoComplete="numericCode"
            autoFocus
            value={numericCode}
            onChange={(e)=>{setNumericCode(e.currentTarget.value)}}
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <Button type="button" onClick={()=>{handleLogin()}}>
            Login
          </Button>
          {magic.isPending && <LinearProgress />}
          {magic.error && <div>Invalid or expired code.</div>}
        </div>
      </div>
    )
  }
}
