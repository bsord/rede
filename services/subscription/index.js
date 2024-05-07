const mongoose = require('./db')
const Subscription = require('./models/subscription')

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
    template: body.template
  })

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
