import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@/components/Elements';
import { useEmailValidation } from '../hooks/useEmailValidation';

const EmailInput = ({ value, onChange, onValidation, enableValidation = true, ...rest }) => {
  const {
    email,
    emailError,
    isEmailVerified,
    isValidating,
    handleEmailChange,
    handleEmailBlur,
  } = useEmailValidation(value);

  useEffect(() => {
    if (onChange) {
      onChange(email);
    }
  }, [email, onChange]);

  useEffect(() => {
    if (onValidation) {
      onValidation(isEmailVerified);
    }
  }, [isEmailVerified, onValidation]);

  const handleChange = (e) => {
    if (enableValidation) {
      handleEmailChange(e);
    } else {
      const emailValue = e.currentTarget.value;
      handleEmailChange({ currentTarget: { value: emailValue } });
    }
  };

  const handleBlur = () => {
    if (enableValidation) {
      handleEmailBlur();
    }
  };

  return (
    <div className="relative h-11">
      <Input
      className="h-11"
        {...rest}
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          const validCharacters = /^[a-zA-Z0-9@._-]*$/;
          if (!validCharacters.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
            e.preventDefault();
          }
        }}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 h-11 py-6">
        {isValidating && (
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sky-500 h-6" />
        )}
        {!isValidating && isEmailVerified && (
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 h-6" />
        )}
        {!isValidating && emailError && email.trim() !== '' && (
          <>
            <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 h-6" />
            <div className="absolute  text-red-500 text-right text-xs rounded pb-2 mt-2 w-64 right-0 bottom-11">
              {emailError}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailInput;