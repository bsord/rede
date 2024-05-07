import { useState } from 'react';
import { Input, Typography, Button, LinearProgress } from '../../../components/Elements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useCreateSubscription } from '../api/createSubscription';
import { useCreateAiContentPreview } from '../api/createAiContentPreview';
import { useNavigate } from 'react-router-dom';
import ContentPreview from './ContentPreview';
import { templates, niches } from './data';

const CreateSubscriptionForm = () => {
  const navigate = useNavigate();
  const { mutate: createSubscription, isPending: subscriptionIsPending, error: subscriptionError } = useCreateSubscription();
  const { mutate: createAiContentPreview, isPending: contentPreviewIsPending, error: contentPreviewError } = useCreateAiContentPreview();

  const [email, setEmail] = useState('');
  const [niche, setNiche] = useState(niches[0] || '');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [contentPreview, setContentPreview] = useState();

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
      setSelectedTemplate(selectedTemplate); // Store the entire template object
    }
  };

  const handleSubmit = () => {
    const subscriptionData = {
      email,
      niche,
      template: selectedTemplate, // Pass the whole template object here
    };

    createSubscription(subscriptionData, {
      onSuccess: (response) => {
        console.log(response);
        navigate(`/subscriptions`);
      },
    });
  };

  const handlePreview = () => {
    const subscriptionData = {
      email,
      niche,
      template: selectedTemplate.content, // Use only the content property for preview
    };

    createAiContentPreview(subscriptionData, {
      onSuccess: (response) => {
        setContentPreview(response);
        console.log(response);
      },
    });
  };

  return (
    <div>
      Fill out the form to create a subscription
      <form>
        <div className="flex flex-col gap-2 mb-4">
          <Typography variant="h6">Email Address</Typography>
          <Input
            id="email"
            label="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleChange}
          />
          <Typography variant="h6">Niche</Typography>
          <select id="niche" name="niche" value={niche} onChange={handleNicheChange}>
            {niches.map((niche, index) => (
              <option key={index} value={niche}>
                {niche}
              </option>
            ))}
          </select>
          <Typography variant="h6">Template</Typography>
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
          <Button type="button" onClick={handlePreview}>
            preview
          </Button>
          {contentPreviewIsPending && <LinearProgress />}
          {contentPreview && <ContentPreview htmlContent={contentPreview} />}

          <Button type="button" disabled={subscriptionIsPending || !contentPreview} onClick={handleSubmit}>
            Create Subscription! {subscriptionIsPending && <FontAwesomeIcon icon={faSpinner} className="ml-2 animate-spin" />}
          </Button>
        </div>
        {subscriptionIsPending && <LinearProgress />}
        {subscriptionError && <span>There was an error</span>}
      </form>
    </div>
  );
};

export default CreateSubscriptionForm;