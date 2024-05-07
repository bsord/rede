const mongoose = require('./db')
var aws = require('aws-sdk');
var ses = new aws.SES({region: 'us-east-1'});
const SubscriptionEmails = require('./models/subscription_emails')

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
}

// CREATE
module.exports.send_emails = async (event) => {
  // get event body
  var body = JSON.parse(event.body)
// connect to database
  await mongoose.connect()

  // insert log of email into database
  const email_log = await SubscriptionEmails.create({
    subscriptionId: '6639a9963004350b43bebf28',
    content: '<div>testpayload</div>'
  })

  var params = {
    Destination: {
      ToAddresses: ["brandon.sorgdrager@gmail.com"],
    },
    Message: {
      Body: {
        Text: { Data: "Test" },
      },

      Subject: { Data: "Test Email" },
    },
    Source: "brandon@rede.io",
  };
 
  const emailResponse = await ses.sendEmail(params).promise()

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: 'sent emails successfully',
      response: emailResponse
    }),
  }
}