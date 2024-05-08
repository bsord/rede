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
  // get event body
  var body = JSON.parse(event.body)

  // connect to database
  await mongoose.connect()

  // insert subscription to database
  const subscription = await Subscription.create({
    email: body.email, 
    niche: body.niche,
    template: body.template,
    nextRunTime: body?.nextRunTime || Date.now(),
    intervalMinutes: body?.intervalMinutes || 1440,
    lastProcessedTime: null,
    status: 'active'
  })


  //send first email
  await SubscriptionProcessor.process_subscription(subscription)

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: 'Got subscription!',
      subscription: subscription,
      input: event,
    }),
  }
}

// READ
module.exports.get_subscriptions = async (event) => {
  // get event body
  var body = JSON.parse(event.body)

  // connect to database
  await mongoose.connect()

  // get all subscriptions
  const subscriptions = await Subscription.find()

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: 'Here are your subscriptions!!',
      subscriptions: subscriptions,
      input: event,
    }),
  }
}

module.exports.get_subscription_by_id = async (event) => {
  // get subscription id from url path
  const subscription_id = event.pathParameters.subscription_id
  await mongoose.connect()
  const subscription = await Subscription.findById(subscription_id)

  // find subscription in database

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: `here is your subscription: ${subscription_id}`,
      subscription: subscription,
      input: event,
    }),
  }
}

module.exports.get_subscription_events_by_subscription_id = async (event) => {
  // get subscription id from url path
  const subscription_id = event.pathParameters.subscription_id
  await mongoose.connect()
  const subscriptionEvents = await SubscriptionEvent.find({subscriptionId: subscription_id}).sort({createdAt: -1})

  // find subscription in database

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: `events for subscription: ${subscription_id}`,
      events: subscriptionEvents,
    }),
  }
}

// UPDATE
module.exports.update_subscription = async (event) => {
  // get subscription id from url path
  const subscription_id = event.pathParameters.subscription_id

  // get event body
  var body = JSON.parse(event.body)

  // connect to database
  await mongoose.connect()

  // update subscription in database
  const subscription = await Subscription.findByIdAndUpdate(
    subscription_id,
    {
      text: body?.text,
    },
    { new: true }
  )

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: `Subscription with id ${subscription_id} has been updated`,
      subscription: subscription,
      input: event,
    }),
  }
}

// DESTROY
module.exports.delete_subscription = async (event) => {
  // get subscription id from url path
  const subscription_id = event.pathParameters.subscription_id

  // connect to database
  await mongoose.connect()

  // update subscription in database
  const subscription = await Subscription.findByIdAndDelete(subscription_id)

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: `subscription ${subscription_id} has been deleted`,
      subscription: subscription,
      input: event,
    }),
  }
}


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