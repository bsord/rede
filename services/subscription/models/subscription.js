const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SubscriptionSchema = new Schema({
  email: { type: String, required: true, maxLength: 100 },
  niche: { type: String, required: true, maxLength: 100 },
})

// Export model
module.exports = mongoose.model('Subscription', SubscriptionSchema)
