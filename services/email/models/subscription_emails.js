const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SubscriptionEmailSchema = new Schema({
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, required: true, maxLength: 100 },
  content: { type: String, required: true},
},
{
  timestamps: true
})

// Export model
module.exports = mongoose.model('email_log', SubscriptionEmailSchema)
