import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Button, Typography, LinearProgress } from '@/components/Elements';
import { useMagicLink } from '../api/magicLink';
import { useMagic } from '../api/magic';
import { useNavigate } from 'react-router-dom';
import EmailInput from '../components/EmailInput';
import { Input } from '../../../components/Elements';

export const MagicLinkRequest = ({ initialEmail, codeSecret }) => {
  const navigate = useNavigate();
  const magicLink = useMagicLink();
  const magic = useMagic();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState(initialEmail || '');
  const [numericCode, setNumericCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleSendLink = () => {
    setSent(false);
    magicLink.mutate({ email, codeSecret }, {
      onSuccess: () => {
        setSent(true);
      },
    });
  };

  const handleLogin = () => {
    magic.mutate({ email, numericCode, codeSecret }, {
      onSuccess: () => navigate('/subscriptions')
    });
  };

  const handleEmailChange = (emailValue) => {
    setEmail(emailValue);
  };

  const handleEmailValidation = (isValid) => {
    setIsEmailVerified(isValid);
  };

  useEffect(() => {
    if (initialEmail && codeSecret) {
      magicLink.mutate({ email: initialEmail, codeSecret }, {
        onSuccess: () => {
          setSent(true);
        },
      });
    }
  }, [initialEmail, codeSecret]);

  useEffect(() => {
    if (numericCode.length === 6) {
      handleLogin();
    }
  }, [numericCode]);

  if (!sent && !initialEmail) {
    return (
      <div className="w-full p-4">
        <div className="text-center">
          <Typography variant="h2" className="mb-4">
            Sign In
          </Typography>
          <Typography className="mb-3 font-normal" variant="lead">
            Enter your email address to sign in
          </Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-100 max-w-screen-lg">
          <div className="flex flex-col gap-2 mb-4">
            <EmailInput
              value={email}
              onChange={handleEmailChange}
              onValidation={handleEmailValidation}
              required
              id="email"
              placeholder="Email Address"
              name="email"
              autoComplete="email"
              className="px-3 py-2 rounded-md pr-10"
              autoFocus
            />
          </div>
          <Button type="button" disabled={magicLink.isPending || !isEmailVerified} onClick={handleSendLink}>
            {magicLink.isPending ? <>Sending Login code <FontAwesomeIcon icon={faSpinner} className="ml-2 animate-spin" /></> : "Send Login code"}
          </Button>
          {magicLink.error && (
            <Typography variant="paragraph" className="text-red-500 my-4">
              {magicLink?.error?.response?.data?.message ?? 'Request failed, please try again later..'}
            </Typography>
          )}
        </form>
      </div>
    );
  } else {
    return (
      <div className="w-full p-4">
        <div className="text-center">
          <div className='mb-4'>
            <Typography variant="h3">Check your email</Typography>
            Please enter your one-time login code:
          </div>
          <Input
            required
            id="numericCode"
            placeholder="Code"
            name="numericCode"
            autoComplete="numericCode"
            autoFocus
            value={numericCode}
            onChange={(e) => { if (!isNaN(e.currentTarget.value)) { setNumericCode(e.currentTarget.value); } }}
            inputMode="numeric"
            pattern="[0-9]*"
            disabled={magic.isPending }
          />
          <Button type="button" onClick={handleLogin} className='my-2' disabled={ numericCode.length < 6}>
            {magic.isPending ? <>Logging in <FontAwesomeIcon icon={faSpinner} className="ml-2 animate-spin" /></> : "Login"}
          </Button>
          <div className='my-2'>
            {magic.error && <div className='text-red-400'>Invalid or expired code.<Button onClick={() => { navigate(0); }}>Send a new code</Button></div>}
          </div>
        </div>
      </div>
    );
  }
};