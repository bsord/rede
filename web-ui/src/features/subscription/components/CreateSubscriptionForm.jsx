import { useEffect, useState } from 'react';
import { Input, Typography, Button, LinearProgress } from '../../../components/Elements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useCreateSubscription } from '../api/createSubscription';
import { useCreateAiContentPreview } from '../api/createAiContentPreview';
import { useNavigate } from 'react-router-dom';
import ContentPreview from './ContentPreview';
import { templates, niches } from './data';
import ReactGA from 'react-ga4';

const intervals = [
  { label: '30 minutes', value: 30 },
  { label: 'day', value: 1440 }, // 1 day in minutes
  { label: '7 days', value: 10080 }, // 7 days in minutes
  { label: '30 days', value: 43200 }, // 30 days in minutes
  { label: '60 days', value: 86400 }, // 60 days in minutes
  { label: '90 days', value: 129600 }, // 90 days in minutes
];
import { useAuthenticatedUser } from '../../auth';
const CreateSubscriptionForm = () => {
  const { data: user } = useAuthenticatedUser()
  const navigate = useNavigate();
  const { mutate: createSubscription, isPending: subscriptionIsPending, error: subscriptionError } = useCreateSubscription();
  const { mutate: createAiContentPreview, isPending: contentPreviewIsPending, error: contentPreviewError } = useCreateAiContentPreview();

  const [email, setEmail] = useState(user?.email || '');
  const [niche, setNiche] = useState(niches[0] || '');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [contentPreview, setContentPreview] = useState();
  const [intervalMinutes, setIntervalMinutes] = useState(intervals[0].value); // Default to the first interval value in minutes

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
    }
  };

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

    if(user){
      ReactGA.event({
        category: "subscription",
        action: "create_subscription",
        label: "Created Subscription",
      });
      createSubscription(subscriptionData, {
        onSuccess: (response) => {
          console.log(response);
          navigate(`/subscriptions`);
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

  useEffect(()=>{
    //handlePreview()
  },[niche, selectedTemplate])
  

  return (
    <div>
      Fill out the form to create a subscription
      <form>
        <div className="flex flex-col gap-2 my-4 text-left mx-4">
          
          
          <Typography variant="h6">I would like</Typography>
          <select
            id="template"
            name="template"
            value={selectedTemplate?.name || ''}
            onChange={handleTemplateChange}
          >
            {templates.map((template) => (
              <option key={template.name} value={template.name}>
                {template.name}
              </option>
            ))}
          </select>
          <Typography variant="h6">about</Typography>
          <select id="niche" name="niche" value={niche} onChange={handleNicheChange}>
            {niches.map((niche, index) => (
              <option key={index} value={niche}>
                {niche}
              </option>
            ))}
          </select>

          <Typography variant="h6">every</Typography>
          <select id="interval" name="interval" value={intervalMinutes} onChange={handleIntervalChange}>
            {intervals.map((interval) => (
              <option key={interval.value} value={interval.value}>
                {interval.label}
              </option>
            ))}
          </select>

          


          
          <Typography variant="h6">sent to</Typography>
          <Input
            id="email"
            label="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleChange}
            placeholder="Email address"
            disabled={user}
          />
          <Button type="button" disabled={subscriptionIsPending || !email} onClick={handleSubmit}>
            Send the emails! {subscriptionIsPending && <FontAwesomeIcon icon={faSpinner} className="ml-2 animate-spin" />}
          </Button>
          {subscriptionIsPending && <LinearProgress />}
          {subscriptionError && <span>There was an error</span>}
          
          {contentPreviewIsPending && <LinearProgress />}
          {contentPreview && <><Typography variant="h5">Preview:</Typography><ContentPreview htmlContent={contentPreview} /></>}
          
        </div>
        
      </form>
    </div>
  );
};

export default CreateSubscriptionForm;