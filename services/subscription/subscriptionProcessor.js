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

        // Create JWT
        const unsubscribeToken = jwt.sign(
            {
                sub: subscriptionId, 
                type: 'subscription', 
            },
            JWT_SECRET
        );

        const dataUrl = `https://${API_DOMAIN}/fetch/reddit/posts`;
        const searchResultSummaryUrl = `https://${API_DOMAIN}/fetch/search/result`;
        const contentUrl = `https://${API_DOMAIN}/ai/content-from-template`;
        const emailUrl = `https://${API_DOMAIN}/email/send`;

        // Fetch useful data
        const dataResponse = await axios.post(dataUrl, {
            subreddit: niche
        });

        let posts = [];
        for(const redditPost of dataResponse.data) {
            if (posts.length >= 5) {
                break; // Limit to 5 posts
            }

            try {
                const searchResponse = await axios.post(searchResultSummaryUrl, {
                    query: redditPost.title
                });

                if (searchResponse.status === 200) {
                    redditPost.summary = searchResponse.data.summary;
                    posts.push(redditPost);
                } else {
                    const errorMessage = searchResponse.data.message || `Non-200 status: ${searchResponse.status}`;
                    console.log(`Skipping post: ${errorMessage}`);
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message;
                console.log('Error fetching search result summary:', errorMessage);
            }
        }

        console.log('posts', posts);
        const stringifiedData = JSON.stringify(posts);

        // Get email content body made from template + AI generated content
        const contentResponse = await axios.post(contentUrl, {
            template: template,
            niche,
            supportingData: stringifiedData
        });

        if (contentResponse.status !== 200) {
            const errorMessage = contentResponse.data.message || `Failed to get content from template: ${contentResponse.statusText}`;
            throw new Error(errorMessage);
        }

        // Define email params
        let emailBody = contentResponse.data.content;
        let emailSubject = contentResponse.data.subject;

        // Create unsubscribe link
        const unsubscribeLink = `https://${process.env.DOMAIN}/unsubscribe?token=${unsubscribeToken}`;

        // Add footer HTML to all messages
        emailBody = `
            <div>
                ${emailBody}
                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 10px 0px; max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #666;">
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

        const emailData = {
            emailBody,
            recipients: [email],
            subject: emailSubject,
            fromAddress: `Friends at Rede <yourfriends@${process.env.DOMAIN}>`,
        };

        // Send the email using the email API
        const emailResponse = await axios.post(emailUrl, emailData);

        if (emailResponse.status !== 200) {
            const errorMessage = emailResponse.data.message || `Failed to send email: ${emailResponse.statusText}`;
            throw new Error(errorMessage);
        }

        console.log('Subscription processing and email sending completed successfully');

        await SubscriptionEvent.create({
            subscriptionId: subscription._id,
            type: 'email',
            detail: emailResponse.data,
            status: 'success',
        });

        // Set last processed time
        const nextRunTime = new Date(now.getTime() + intervalMinutes * 60000);
        await Subscription.findByIdAndUpdate(subscription._id, {
            lastProcessedTime: now,
            nextRunTime,
        });

    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        // Log the event as a failure
        await SubscriptionEvent.create({
            subscriptionId: subscription._id,
            type: 'email',
            detail: errorMessage,
            status: 'failure',
        });
        console.error('Error processing subscription:', errorMessage);
    }
};
