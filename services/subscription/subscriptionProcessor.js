const axios = require('axios');
const Subscription = require('./models/subscription');
const SubscriptionEvent = require('./models/subscription_event');
const jwt = require('jsonwebtoken');

const API_DOMAIN = process.env.API_DOMAIN;
const JWT_SECRET = process.env.JWT_SECRET;

if (!API_DOMAIN || !JWT_SECRET) {
    throw new Error('API_DOMAIN or JWT_SECRET environment variable is not set');
}

module.exports.process_subscription = async (subscription) => {
    console.log(subscription._id);
    const now = new Date();
    try {
        const { email, template, niche, intervalMinutes, _id: subscriptionId } = subscription;

        if (!email || !template || !niche) {
            throw new Error('Missing required attributes in the subscription object');
        }

        // Create the JWT token with relevant information
        const unsubscribeToken = jwt.sign(
            {
                sub: subscriptionId, // Subscription ID
                type: 'subscription', // Subscription type for specific handling
            },
            JWT_SECRET
        );

        const contentUrl = `https://${API_DOMAIN}/ai/content-from-template`;
        const emailUrl = `https://${API_DOMAIN}/email/send`;

        // Make a request to retrieve content from the template
        const contentResponse = await axios.post(contentUrl, {
            template: template.content,
            niche,
        });

        // Ensure that the response is successful
        if (contentResponse.status !== 200) {
            throw new Error(`Failed to get content from template: ${contentResponse.statusText}`);
        }

        // Extract email content and subject
        let emailBody = contentResponse.data.content;
        let emailSubject = contentResponse.data.subject;

        // Create the unsubscribe link
        const unsubscribeLink = `https://rede.io/unsubscribe?token=${unsubscribeToken}`;

        // Add the unsubscribe link to the email body
        emailBody = `
            <div>
                ${emailBody}
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #666;">
                    <tr>
                        <td style="padding: 10px 20px; text-align: center; font-size: 12px;">
                            <p>If you would like to unsubscribe, please <a href="${unsubscribeLink}" style="color: #337ab7; text-decoration: none;">click here</a>.</p>
                            <p>Rede | 1 Daily Email, Insightful, AI, 50924</p>
                        </td>
                    </tr>
                </table>
            </div>
        `;

        console.log(`Email Body (Preview): ${emailBody}`);

        // Prepare the email data
        const emailData = {
            emailBody,
            recipients: [email],
            subject: emailSubject,
            fromAddress: 'Friends at Rede <yourfriends@rede.io>',
        };

        // Send the email using the email API
        const emailResponse = await axios.post(emailUrl, emailData);

        // Ensure that the email was sent successfully
        if (emailResponse.status !== 200) {
            throw new Error(`Failed to send email: ${emailResponse.statusText}`);
        }

        console.log('Subscription processing and email sending completed successfully');

        // Log the event as successful
        await SubscriptionEvent.create({
            subscriptionId: subscription._id,
            type: 'email',
            detail: emailResponse.data,
            status: 'success',
        });

        // Update subscription's last processed time and next run time
        const nextRunTime = new Date(now.getTime() + intervalMinutes * 60000);
        await Subscription.findByIdAndUpdate(subscription._id, {
            lastProcessedTime: now,
            nextRunTime,
        });

    } catch (error) {
        // Log the event as a failure using subscription._id directly
        await SubscriptionEvent.create({
            subscriptionId: subscription._id,
            type: 'email',
            detail: error.message,
            status: 'failure',
        });
        console.error('Error processing subscription:', error);
    }
};