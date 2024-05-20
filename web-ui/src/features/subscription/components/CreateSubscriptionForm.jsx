import { useEffect, useState } from 'react';
import { Input, Typography, Button, LinearProgress } from '../../../components/Elements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useCreateSubscription } from '../api/createSubscription';
import { useCreateAiContentPreview } from '../api/createAiContentPreview';
import { useNavigate } from 'react-router-dom';
import ContentPreview from './ContentPreview';
import { templates, niches, intervals } from './data';
import ReactGA from 'react-ga4';
import { Select } from '../../../components/Elements/Select';
import EmailInput from '../../auth/components/EmailInput';
import { useAuthenticatedUser } from '../../auth';

const CreateSubscriptionForm = () => {
  const { data: user } = useAuthenticatedUser();
  const navigate = useNavigate();
  const { mutate: createSubscription, isPending: subscriptionIsPending, error: subscriptionError } = useCreateSubscription();
  const { mutate: createAiContentPreview, isPending: contentPreviewIsPending, error: contentPreviewError } = useCreateAiContentPreview();

  const [email, setEmail] = useState(user?.email || '');
  const [niche, setNiche] = useState(niches[0].value || '');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [contentPreview, setContentPreview] = useState();
  const [intervalMinutes, setIntervalMinutes] = useState(intervals[0].value); // Default to the first interval value in minutes
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleNicheChange = (event) => {
    setNiche(event.target.value);
  };

  const handleTemplateChange = (event) => {
    const selectedTemplate = templates.find((template) => template.name === event.target.value);
    if (selectedTemplate) {
      setSelectedTemplate(selectedTemplate);
    }
  };

  const handleIntervalChange = (event) => {
    const selectedMinutes = parseInt(event.target.value, 10);
    setIntervalMinutes(selectedMinutes);
  };

  const handleSubmit = () => {
    const subscriptionData = {
      email,
      niche,
      template: selectedTemplate,
      intervalMinutes, // Include the interval value in minutes
    };

    if (user) {
      ReactGA.event({
        category: "subscription",
        action: "create_subscription",
        label: "Created Subscription",
      });
      createSubscription(subscriptionData, {
        onSuccess: (response) => {
          console.log(response);
          navigate(`/subscriptions/${response._id}/manage`);
        },
      });
    } else {
      navigate(`/auth/magic?email=${email}`);
    }
  };

  const handlePreview = () => {
    const subscriptionData = {
      email,
      niche,
      template: selectedTemplate.content,
    };

    createAiContentPreview(subscriptionData, {
      onSuccess: (response) => {
        setContentPreview(response);
        console.log(response);
      },
    });
  };

  const handleEmailChange = (emailValue) => {
    setEmail(emailValue);
  };

  const handleEmailValidation = (isValid) => {
    if (user) {
      setIsEmailVerified(true);
    } else {
      setIsEmailVerified(isValid);
    }
  };

  useEffect(() => {
    //handlePreview()
  }, [niche, selectedTemplate]);

  return (
    <div className='border border-gray-300 rounded-lg shadow-md bg-white grow'>
      <div className='p-4'>
        <form>
          <div className="flex flex-col gap-2 text-left">
            <Typography variant="h6">I would like</Typography>
            <Select
              id="template"
              name="template"
              value={selectedTemplate?.name || ''}
              onChange={handleTemplateChange}
              placeholder="I would like"
              className={"font-semibold text-xl"}
            >
              {templates.map((template) => (
                <option key={template.name} value={template.name}>
                  {template.name}
                </option>
              ))}
            </Select>
            <Typography variant="h6">about</Typography>
            <Select id="niche" name="niche" value={niche} onChange={handleNicheChange} className={"font-semibold text-xl"}>
              {niches.map((niche) => (
                <option key={niche.value} value={niche.value}>
                  {niche.name}
                </option>
              ))}
            </Select>
            <Typography variant="h6">every</Typography>
            <Select id="interval" name="interval" value={intervalMinutes} onChange={handleIntervalChange} className={"font-semibold text-xl"}>
              {intervals.map((interval) => (
                <option key={interval.value} value={interval.value}>
                  {interval.label}
                </option>
              ))}
            </Select>
            <Typography variant="h6">sent to</Typography>
            <EmailInput
              id="email"
              label="email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              onValidation={handleEmailValidation}
              enableValidation={!user}
              placeholder="Email address"
              disabled={user}
              className={"font-semibold text-xl"}
            />
            <Button type="button" disabled={subscriptionIsPending || !email || !isEmailVerified} onClick={handleSubmit} className={""}>
              {subscriptionIsPending ? <>Creating subscription <FontAwesomeIcon icon={faSpinner} className="ml-2 animate-spin" /></> : <>Send It!</>}
            </Button>
            {subscriptionError && <span>There was an error</span>}
            {contentPreview && <><Typography variant="h5">Preview:</Typography>{contentPreview.subject}<ContentPreview htmlContent={contentPreview.content} /></>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubscriptionForm;