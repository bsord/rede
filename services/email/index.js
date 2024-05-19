const mongoose = require('./db');
var aws = require('aws-sdk');
var ses = new aws.SES({region: 'us-east-1'});
const EmailLog = require('./models/email_log');
const validateEmail = require('./validation');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

// CREATE
module.exports.send_email = async (event) => {
  // get event body
  var body = JSON.parse(event.body);
  const {recipients, emailBody, subject, fromAddress} = body;

  // connect to database
  await mongoose.connect();

  // define email based on body params
  var params = {
    Destination: {
      ToAddresses: recipients,
    },
    Message: {
      Body: {
        Html: { Data: emailBody, Charset: 'UTF-8'},
      },
      Subject: { Data: subject, Charset: 'UTF-8'},
    },
    Source: fromAddress,
  };

  try {
    // send email
    const emailResponse = await ses.sendEmail(params).promise();

    // insert log of email into database
    const email_log = await EmailLog.create({
      success: true,
      detail: emailResponse,
      recipients: recipients,
      subject: subject,
      fromAddress: fromAddress,
      emailBody: emailBody
    });

    // return success with email details
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(email_log),
    };
  } catch (error) {
    // insert log of email into database
    const email_log = await EmailLog.create({
      success: false,
      detail: error,
      recipients: recipients,
      subject: subject,
      fromAddress: fromAddress,
      emailBody: emailBody
    });

    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify(email_log),
    };
  }
};

module.exports.verify_email = async (event) => {
  // get event body
  var body = JSON.parse(event.body);
  const { email } = body;

  // validate email format
  const validationResult = await validateEmail(email);

  return {
    statusCode: validationResult.valid ? 200 : 400,
    headers: headers,
    body: JSON.stringify(validationResult),
  };
};
