const mongoose = require('./db')
const Subscription = require('./models/subscription')
const SubscriptionEvent = require('./models/subscription_event')
const SubscriptionProcessor = require("./subscriptionProcessor");

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
}

// CREATE
module.exports.add_subscription = async (event) => {
  // Get user ID from authorizer
  const userId = event.requestContext.authorizer.principalId;
  
  // Parse the event body
  var body = JSON.parse(event.body);

  // Connect to the database
  await mongoose.connect();

  // Create the new subscription with the owner ID
  const subscription = await Subscription.create({
    email: body.email,
    niche: body.niche,
    template: body.template,
    nextRunTime: body.nextRunTime || Date.now(),
    intervalMinutes: body.intervalMinutes || 1440,
    lastProcessedTime: null,
    status: 'active',
    ownerId: userId // Set the ownerId here
  });

  // Send the first email
  await SubscriptionProcessor.process_subscription(subscription);

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
  // Get user ID from authorizer
  const userId = event.requestContext.authorizer.principalId;
  
  // Connect to the database
  await mongoose.connect();

  // Retrieve subscriptions only for this user
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
  // Extract user ID and subscription ID
  const userId = event.requestContext.authorizer.principalId;
  const subscription_id = event.pathParameters.subscription_id;

  // Connect to the database
  await mongoose.connect();

  // Retrieve the subscription, ensuring it belongs to the requesting user
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

  // If the subscription is valid, retrieve the events
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
  // Extract user ID and subscription ID
  const userId = event.requestContext.authorizer.principalId;
  const subscription_id = event.pathParameters.subscription_id;

  // Parse the request body
  const body = JSON.parse(event.body);

  // Connect to the database
  await mongoose.connect();

  // Update subscription only if owned by the user
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
    { new: true } // Return the updated document
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

// DESTROY
module.exports.delete_subscription = async (event) => {
  // Extract user ID and subscription ID
  const userId = event.requestContext.authorizer.principalId;
  const subscription_id = event.pathParameters.subscription_id;

  // Connect to the database
  await mongoose.connect();

  // Delete subscription only if owned by the user
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
  // connect to database
  await mongoose.connect()

  // get all subscriptions that are due
  const now = new Date();
  const subscriptions = await Subscription.find({
    nextRunTime: { $lte: now },
    status: 'active'
  });

  // Process the due subscriptions
  console.log('subscriptions to process:', subscriptions.length);
  for (const subscription of subscriptions) {
    await SubscriptionProcessor.process_subscription(subscription);
  }
}
