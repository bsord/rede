const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SubscriptionSchema = new Schema({
  email: { type: String, required: true, maxLength: 100 },
  niche: { type: String, required: true, maxLength: 100 },
  template: {
    id: {
      type: String, required: true
    },
    name: {
      type: String, required: true
    },
    content: {
      type: String, required: true
    } 
  },
  nextRunTime: {
    type: Date,
    required: true,
    index: true
  },
  intervalMinutes: {
    type: Number,
    required: true,
    min: 1  // Minimum interval time in minutes
  },
  lastProcessedTime: {
    type: Date
  },
},
{
  timestamps: true
})

SubscriptionSchema.index({ nextRunTime: 1 });

// Export model
module.exports = mongoose.model('subscription', SubscriptionSchema)
