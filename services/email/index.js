const mongoose = require('./db');

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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

  // send email
  const msg = {
    to: recipients, // Change to your recipient
    from: fromAddress, // Change to your verified sender
    subject: subject,
    text: emailBody,
    html: emailBody,
  }
  

  try {

    const emailResponse = await sgMail.send(msg)
    
    // insert log of email into database
    const email_log = await EmailLog.create({
      success: true,
      detail: emailResponse,
      recipients: recipients,
      subject: subject,
      fromAddress: fromAddress,
      emailBody: emailBody
    });

    console.log('Email sent')

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(email_log),
    };

  } catch (error) {
      console.error(error)
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
