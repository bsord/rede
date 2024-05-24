const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs-then')
const axios = require('axios');
const connectToDatabase = require('./db')
const User = require('./models/user')

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json',
}

/*
 * Functions
 */

module.exports.login = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  return connectToDatabase()
    .then(() => login(JSON.parse(event.body)))
    .then((session) => ({
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(session),
    }))
    .catch((err) => {
      console.log(err)
      return {
        statusCode: err.statusCode || 500,
        headers: headers,
        body: JSON.stringify({ stack: err.stack, message: err.message }),
      }
    })
}

module.exports.register = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  return connectToDatabase()
    .then(() => register(JSON.parse(event.body)))
    .then((session) => ({
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(session),
    }))
    .catch((err) => {
      console.log(err)
      return {
        statusCode: err.statusCode || 500,
        headers: headers,
        body: JSON.stringify({ stack: err.stack, message: err.message }),
      }
    })
}

module.exports.me = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  console.log(event)
  return connectToDatabase()
    .then(() => me(event.requestContext.authorizer.principalId))
    .then((session) => {
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(session),
      }
    })
    .catch((err) => {
      console.log(err)
      return {
        statusCode: err.statusCode || 500,
        headers: headers,
        body: JSON.stringify({ stack: err.stack, message: err.message }),
      }
    })
}

// AWS AUTHORIZER FUNCTION THAT RETURNS AN ACCESS POLICY FOR THE API
module.exports.verify_token = (event, context, callback) => {
  console.log(event)
  // check header or url parameters or post parameters for token
  const token = event.authorizationToken
  console.log('token', token)
  if (!token) callback('Unauthorized')

  // verifies secret and checks exp
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('decoded', decoded)
    const policy = generatePolicy(decoded.id, 'Allow', event.methodArn)
    console.log('policy', JSON.stringify(policy))
    callback(null, policy)
  } catch (error) {
    console.log('error', error)
    callback('Unauthorized')
  }
}

/**
 * Helpers
 */

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {}
  authResponse.principalId = principalId
  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }
  return authResponse
}

function signToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: 86400, // expires in 24 hours
  })
}

function checkIfInputIsValid(eventBody) {
  if (!(eventBody.password && eventBody.password.length >= 7)) {
    return Promise.reject(
      new Error('Password error. Password needs to be longer than 8 characters.')
    )
  }

  if (!(eventBody.name && eventBody.name.length > 5 && typeof eventBody.name === 'string'))
    return Promise.reject(
      new Error('Username error. Username needs to be longer than 5 characters')
    )

  if (!(eventBody.email && validateEmail(eventBody.email)))
    return Promise.reject(new Error('Email error. Email must have valid characters.'))

  return Promise.resolve()
}

function register(eventBody) {
  return checkIfInputIsValid(eventBody) // validate input
    .then(
      () => User.findOne({ email: eventBody.email }) // check if user exists
    )
    .then((user) =>
      user ? Promise.reject(new Error('User with that email exists.')) : eventBody.password
    )
    .then(
      (password) =>
        User.create({ name: eventBody.name, email: eventBody.email, password: password }) // create the new user
    )
    .then((user) => ({ auth: true, token: signToken(user._id) })) // sign the token and send it back
}

function login(eventBody) {
  return User.findOne({ email: eventBody.email })
    .select('+password')
    .then((user) =>
      !user
        ? Promise.reject(new Error('User with that email does not exits.'))
        : comparePassword(eventBody.password, user.password, user._id)
    )
    .then((token) => ({ auth: true, token: token }))
}

function comparePassword(eventPassword, userPassword, userId) {
  console.log(eventPassword, userPassword)
  return bcrypt
    .compare(eventPassword, userPassword)
    .then((passwordIsValid) =>
      !passwordIsValid ? Promise.reject(new Error('Invalid email or password')) : signToken(userId)
    )
}

function me(userId) {
  console.log(userId)
  return User.findById(userId)
    .then((user) => (!user ? Promise.reject('No user found.') : user))
    .catch((err) => {
      console.log(err)
      return Promise.reject(new Error(err))
    })
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}
function generateNumericCode() {
  return Math.floor(100000 + Math.random() * 900000);  // Generates a 6-digit code
}

function generateMagicLinkToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: 300,  // Expires in 5 minutes
  });
}
module.exports.requestMagicLink = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { email, codeSecret } = JSON.parse(event.body);  // Assume codeSecret is generated on the frontend and sent here

  await connectToDatabase();

  try {
    let user = await User.findOne({ email }).select('+numericCode +numericCodeExpiry +codeSecret');

    if (!user) {
      user = new User({ email });  // Create a new user if not existent
    }

    const token = generateMagicLinkToken(user._id);
    const numericCode = generateNumericCode();

    // Store the numeric code, code secret, and their expiry
    user.numericCode = numericCode;
    user.codeSecret = codeSecret;
    user.numericCodeExpiry = new Date(Date.now() + 300000);  // Numeric code expires in 5 minutes
    await user.save();

    const magicLink = `https://${process.env.DOMAIN}/auth/magic?token=${token}`;
    const emailData = {
      emailBody: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'; color: #333; background-color: #f5f5f5; padding: 20px; text-align: center;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: auto; max-width: 600px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h1 style="font-size: 20px; margin-bottom: 20px; color: #333;">Welcome to Rede!</h1>
              <p style="font-size: 16px; margin-bottom: 20px; color: #666;">Here is your one-time login code:</p>
              <div style="font-size: 24px; color: #333; background-color: #ebebeb; padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin: 20px;">
                  ${numericCode}
              </div>
              <p style="font-size: 14px; color: #777; margin-top: 20px;">If you did not request this, please ignore this email.</p>
          </div>
        </div>
      `,  // Do not include codeSecret in the email
      recipients: [email],
      subject: 'Your Login Code',
      fromAddress: `Rede <noreply@${process.env.DOMAIN}>`,
    };

    await axios.post(`https://${process.env.API_DOMAIN}/email/send`, emailData);

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ message: 'Magic link requested successfully. Use your numeric code to log in.' }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.statusCode || 500,
      headers: headers,
      body: JSON.stringify({ stack: err.stack, message: err.message }),
    };
  }
};
module.exports.magicLinkLogin = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { token, numericCode, email, codeSecret } = JSON.parse(event.body);

  await connectToDatabase();

  try {
    if (numericCode && email && codeSecret) {
      const user = await User.findOne({ email }).select('+numericCode +numericCodeExpiry +codeSecret');

      if (!user || user.numericCode !== parseInt(numericCode, 10) || user.codeSecret !== codeSecret || new Date() > user.numericCodeExpiry) {
        return {
          statusCode: 401,
          headers: headers,
          body: JSON.stringify({ message: 'Invalid or expired numeric code or code secret.' }),
        };
      }

      const newToken = signToken(user._id);

      // Clear the numeric code and code secret after use
      user.numericCode = null;
      user.codeSecret = null;
      user.numericCodeExpiry = null;
      await user.save();

      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ auth: true, token: newToken }),
      };
    } else if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const newToken = signToken(decoded.id);

      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ auth: true, token: newToken }),
      };
    }

    return {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({ message: 'No valid authentication method provided.' }),
    };
  } catch (error) {
    console.error('Error logging in:', error);
    return {
      statusCode: 401,
      headers: headers,
      body: JSON.stringify({ message: 'Authentication failed.' }),
    };
  }
};