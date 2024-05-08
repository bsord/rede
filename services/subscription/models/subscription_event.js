const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SubscriptionEventSchema = new Schema({
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, required: true},
  type: { type: String, required: true},
  detail: { type: Object, required: true},
  status: { type: String, required: true}
},
{
  timestamps: true
})

// Export model
module.exports = mongoose.model('subscription_event', SubscriptionEventSchema)
