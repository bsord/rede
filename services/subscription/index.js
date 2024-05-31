const mongoose = require('./db')
const Subscription = require('./models/subscription')
const SubscriptionEvent = require('./models/subscription_event')
const SubscriptionProcessor = require("./subscriptionProcessor");
const jwt = require('jsonwebtoken')

const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const sqsClient = new SQSClient({ region: 'us-east-1' });
const sendMessageToSQS = async (queueUrl, event, type) => {
    const params = {
        QueueUrl: queueUrl,
        MessageAttributes: {
            "type": {
                DataType: 'String',
                StringValue: type
            }
        },
        MessageBody: JSON.stringify(event)
    };
    const command = new SendMessageCommand(params);
    return sqsClient.send(command);
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
}

const JWT_SECRET = process.env.JWT_SECRET;


module.exports.add_subscription = async (event) => {

  const userId = event.requestContext.authorizer.principalId;
  
  var body = JSON.parse(event.body);

  await mongoose.connect();

  // create new sub, with requestor as owner
  const subscription = await Subscription.create({
    email: body.email,
    niche: body.niche,
    template: body.template,
    nextRunTime: body.nextRunTime || Date.now(),
    intervalMinutes: body.intervalMinutes || 1440,
    lastProcessedTime: null,
    status: 'active',
    ownerId: userId,
    role: body.role
  });

  const sqs_response = await sendMessageToSQS(process.env.SUBSCRIPTION_PROCESSING_QUEUE_URL, subscription, 'subscription');
  console.log(sqs_response);
  //await SubscriptionProcessor.process_subscription(subscription);

  await SubscriptionEvent.create({
    subscriptionId: subscription._id,
    type: 'create',
    detail: subscription,
    status: 'success',
  });

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: 'Subscription created!',
      subscription: subscription,
      input: event,
    }),
  };
};

// READ
module.exports.get_subscriptions = async (event) => {

  const userId = event.requestContext.authorizer.principalId;
  
  await mongoose.connect();

  const subscriptions = await Subscription.find({ ownerId: userId });

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: 'Here are your subscriptions!',
      subscriptions: subscriptions,
      input: event,
    }),
  };
};

module.exports.get_subscription_by_id = async (event) => {
  const userId = event.requestContext.authorizer.principalId;
  const subscription_id = event.pathParameters.subscription_id;

  await mongoose.connect();
  const subscription = await Subscription.findOne({ _id: subscription_id, ownerId: userId });

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: `Subscription with ID: ${subscription_id}`,
      subscription: subscription,
      input: event,
    }),
  };
};

module.exports.get_subscription_events_by_subscription_id = async (event) => {

  const userId = event.requestContext.authorizer.principalId;
  const subscription_id = event.pathParameters.subscription_id;

  await mongoose.connect();

  // get subscription, if owned by user making requeste
  const subscription = await Subscription.findOne({
    _id: subscription_id,
    ownerId: userId,
  });

  if (!subscription) {
    return {
      statusCode: 404,
      headers: headers,
      body: JSON.stringify({
        message: `Subscription with ID ${subscription_id} not found or not owned by the user.`,
      }),
    };
  }

  // get events for subscription
  const subscriptionEvents = await SubscriptionEvent.find({
    subscriptionId: subscription_id,
  }).sort({ createdAt: -1 });

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: `Events for subscription: ${subscription_id}`,
      events: subscriptionEvents,
    }),
  };
};

module.exports.update_subscription = async (event) => {

  const userId = event.requestContext.authorizer.principalId;
  const subscription_id = event.pathParameters.subscription_id;

  const body = JSON.parse(event.body);

  await mongoose.connect();

  // only update if owned by user making request
  const subscription = await Subscription.findOneAndUpdate(
    { _id: subscription_id, ownerId: userId },
    {
      email: body?.email,
      niche: body?.niche,
      template: body?.template,
      nextRunTime: body?.nextRunTime,
      intervalMinutes: body?.intervalMinutes,
      status: body?.status,
    },
    { new: true } // make sure latest doc returned
  );

  if (!subscription) {
    return {
      statusCode: 404,
      headers: headers,
      body: JSON.stringify({
        message: `Subscription with ID ${subscription_id} not found or not owned by the user.`,
      }),
    };
  }

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: `Subscription with ID ${subscription_id} has been updated`,
      subscription: subscription,
    }),
  };
};


module.exports.delete_subscription = async (event) => {

  const userId = event.requestContext.authorizer.principalId;
  const subscription_id = event.pathParameters.subscription_id;

  await mongoose.connect();

  const subscription = await Subscription.findOneAndDelete({
    _id: subscription_id,
    ownerId: userId,
  });

  if (!subscription) {
    return {
      statusCode: 404,
      headers: headers,
      body: JSON.stringify({
        message: `Subscription with ID ${subscription_id} not found or not owned by the user.`,
      }),
    };
  }

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: `Subscription with ID ${subscription_id} has been deleted`,
      subscription: subscription,
    }),
  };
};


module.exports.send_subscription_emails = async (event) => {

  await mongoose.connect()

  // get the subscriptions ready for processing
  const now = new Date();
  const subscriptions = await Subscription.find({
    nextRunTime: { $lte: now },
    status: 'active'
  });

  // process subscriptions
  console.log('subscriptions to process:', subscriptions.length);
  for (const subscription of subscriptions) {
    const sqs_response = await sendMessageToSQS(process.env.SUBSCRIPTION_PROCESSING_QUEUE_URL, subscription, 'subscription');
    console.log(sqs_response);
    //await SubscriptionProcessor.process_subscription(subscription);
  }
}

module.exports.subscription_processor = async (event) => {

  await mongoose.connect()

  const records = event.Records;
  if (records && records.length > 0) {
    for (const record of records) {
      if (record.body) {
        // get event details
        const subscription = JSON.parse(record.body);
        console.log(subscription);
        await SubscriptionProcessor.process_subscription(subscription);
      }
    }
  }
}

module.exports.unsubscribe = async (event) => {
    await mongoose.connect();
    try {
        
        const { token } = JSON.parse(event.body);

        // verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded)
        const subscriptionId = decoded.sub;

        // set status to inactive
        const updatedSubscription = await Subscription.findByIdAndUpdate(subscriptionId, {
            status: 'inactive'
        }, { new: true });

        if (!updatedSubscription) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Subscription not found.' })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'You have successfully unsubscribed.' })
        };
    } catch (error) {
      console.log(error)
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'Invalid or expired token.' })
        };
    }
};