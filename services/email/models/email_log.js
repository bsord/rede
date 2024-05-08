const mongoose = require('mongoose')

const Schema = mongoose.Schema

const EmailLogSchema = new Schema({
  success: { type: Boolean, required: true},
  detail: { type: Object, required: true},
  recipients: [{ type: String, required: true}],
  subject: { type: String, required: true},
  fromAddress: { type: String, required: true},
  emailBody: { type: String, required: true}
},
{
  timestamps: true
})

// Export model
module.exports = mongoose.model('email_log', EmailLogSchema)
