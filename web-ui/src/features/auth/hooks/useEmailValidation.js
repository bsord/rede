import { useState, useEffect } from 'react';
import { useVerifyEmail } from '../api/verifyEmail';

export const useEmailValidation = (initialValue = '') => {
  const [email, setEmail] = useState(initialValue);
  const [emailError, setEmailError] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [timer, setTimer] = useState(null);
  const verifyEmail = useVerifyEmail();

  const MIN_EMAIL_LENGTH = 5;

  const validateEmail = (emailValue) => {
    if (emailValue.trim() === '') {
      setEmailError('');
      setIsEmailVerified(false);
      setIsValidating(false);
      return;
    }

    if (emailValue.length < MIN_EMAIL_LENGTH) {
      setEmailError('Email must be at least 5 characters long.');
      setIsEmailVerified(false);
      setIsValidating(false);
      return;
    }

    setIsValidating(true);

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      verifyEmail.mutate({ email: emailValue }, {
        onSuccess: (data) => {
          setIsValidating(false);
          if (!data.valid) {
            setEmailError(data.message);
            setIsEmailVerified(false);
          } else {
            setEmailError('');
            setIsEmailVerified(true);
          }
        },
        onError: (error) => {
          setIsValidating(false);
          if (error?.response?.data?.code) {
            switch (error.response.data.code) {
              case 'INVALID_FORMAT':
                setEmailError('Invalid email format.');
                break;
              case 'DISPOSABLE_EMAIL':
                setEmailError('Disposable email addresses are not allowed.');
                break;
              case 'DOMAIN_NO_MX':
                setEmailError('Invalid domain.');
                break;
              default:
                setEmailError('An unknown error occurred. Please try again.');
                break;
            }
          } else {
            setEmailError(error.message || 'An error occurred while verifying the email.');
          }
          setIsEmailVerified(false);
        }
      });
    }, 1000);

    setTimer(newTimer);
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  const handleEmailChange = (e) => {
    const emailValue = e.currentTarget.value;
    setEmail(emailValue);
    setEmailError('');
    setIsEmailVerified(false);
    validateEmail(emailValue);
  };

  const handleEmailBlur = () => {
    if (timer) {
      clearTimeout(timer);
    }
    if (email.trim() !== '' && !isEmailVerified) {
      validateEmail(email);
    }
  };

  return {
    email,
    emailError,
    isEmailVerified,
    isValidating,
    handleEmailChange,
    handleEmailBlur,
  };
};