const axios = require('axios');
const SubscriptionEvent = require('./models/subscription_event')
// Retrieve the API base URL from the environment variables
const API_DOMAIN = process.env.API_DOMAIN;

if (!API_DOMAIN) {
    throw new Error('API_DOMAIN environment variable is not set');
}

module.exports.process_subscriptions = async (subscriptions) => {
    console.log('subscriptions to process:', subscriptions.length);
    for (const subscription of subscriptions) {
        console.log(subscription._id);
        try {
            // Extract the necessary attributes from the subscription object
            const { email, template, niche } = subscription;

            if (!email || !template || !niche) {
                throw new Error('Missing required attributes in the subscription object');
            }

            // Build the URLs using API_DOMAIN
            const contentUrl = `https://${API_DOMAIN}/ai/content-from-template`;
            const emailUrl = `https://${API_DOMAIN}/email/send`;

            // Make the first request to the content-from-template endpoint
            const contentResponse = await axios.post(contentUrl, {
                template: template.content,
                niche,
            });

            // Ensure that the first request was successful
            if (contentResponse.status !== 200) {
                throw new Error(`Failed to get content from template: ${contentResponse.statusText}`);
            }

            // Extract the preview attribute as the email body content
            const emailBody = contentResponse.data.preview;
            console.log(`Email Body (Preview): ${emailBody}`);

            // Prepare the email data for the second request
            const emailData = {
                emailBody,
                recipients: [email], // Wrap the single email in an array
                subject: 'The content you requested',
                fromAddress: 'Rede <yoursubscription@rede.io>',
            };

            // Make the second request to the email/send endpoint
            const emailResponse = await axios.post(emailUrl, emailData);

            // Ensure that the second request was successful
            if (emailResponse.status !== 200) {
                throw new Error(`Failed to send email: ${emailResponse.statusText}`);
            }

            console.log('Subscription processing and email sending completed successfully');
            const subscription_event = await SubscriptionEvent.create({
                subscriptionId: subscription._id,
                type: "email",
                detail: emailResponse.data,
                status: 'success'
            })
        } catch (error) {
            const subscription_event = await SubscriptionEvent.create({
                subscriptionId: subscription._id,
                type: "email",
                detail: error,
                status: 'failure'
            })
            console.error('Error processing subscription:', error);
        }
    }
};