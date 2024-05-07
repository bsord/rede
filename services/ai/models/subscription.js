const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SubscriptionSchema = new Schema({
  email: { type: String, required: true, maxLength: 100 },
  niche: { type: String, required: true, maxLength: 100 },
  template: { type: String, required: true},
})

// Export model
module.exports = mongoose.model('Subscription', SubscriptionSchema)
