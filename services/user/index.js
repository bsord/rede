const mongoose = require('./db');
const User = require('./models/user');
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

// CREATE
module.exports.add_user = async (event) => {
  const body = JSON.parse(event.body);

  await mongoose.connect();

  // Check if user already exists
  const existingUser = await User.findOne({ email: body.email });
  if (existingUser) {
    return {
      statusCode: 409,
      headers: headers,
      body: JSON.stringify({
        message: 'User already exists!',
      }),
    };
  }

  // Create new user
  const user = await User.create({
    name: body.name,
    email: body.email,
    password: body.password,
    settings: body.settings || {},
  });

  return {
    statusCode: 201,
    headers: headers,
    body: JSON.stringify({
      message: 'User created!',
      user: user,
    }),
  };
};

// READ
module.exports.get_user_by_id = async (event) => {
  const userId = event.requestContext.authorizer.principalId;
  const user_id = event.pathParameters.user_id;

  if (userId !== user_id) {
    return {
      statusCode: 403,
      headers: headers,
      body: JSON.stringify({
        message: 'Forbidden: You are not allowed to access this user.',
      }),
    };
  }

  await mongoose.connect();
  const user = await User.findById(user_id).select('-password -numericCode -numericCodeExpiry -codeSecret');

  if (!user) {
    return {
      statusCode: 404,
      headers: headers,
      body: JSON.stringify({
        message: `User with ID: ${user_id} not found.`,
      }),
    };
  }

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: `User with ID: ${user_id}`,
      user: user,
    }),
  };
};

// UPDATE
module.exports.update_user = async (event) => {
  const userId = event.requestContext.authorizer.principalId;
  const user_id = event.pathParameters.user_id;
  const body = JSON.parse(event.body);

  if (userId !== user_id) {
    return {
      statusCode: 403,
      headers: headers,
      body: JSON.stringify({
        message: 'Forbidden: You are not allowed to update this user.',
      }),
    };
  }

  await mongoose.connect();

  // Update user details
  const user = await User.findByIdAndUpdate(
    user_id,
    {
      name: body?.name,
      email: body?.email,
      settings: body?.settings,
    },
    { new: true }
  ).select('-password -numericCode -numericCodeExpiry -codeSecret');

  if (!user) {
    return {
      statusCode: 404,
      headers: headers,
      body: JSON.stringify({
        message: `User with ID ${user_id} not found.`,
      }),
    };
  }

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: `User with ID ${user_id} has been updated`,
      user: user,
    }),
  };
};

// DELETE
module.exports.delete_user = async (event) => {
  const userId = event.requestContext.authorizer.principalId;
  const user_id = event.pathParameters.user_id;

  if (userId !== user_id) {
    return {
      statusCode: 403,
      headers: headers,
      body: JSON.stringify({
        message: 'Forbidden: You are not allowed to delete this user.',
      }),
    };
  }

  await mongoose.connect();

  const user = await User.findByIdAndDelete(user_id);

  if (!user) {
    return {
      statusCode: 404,
      headers: headers,
      body: JSON.stringify({
        message: `User with ID ${user_id} not found.`,
      }),
    };
  }

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: `User with ID ${user_id} has been deleted`,
      user: user,
    }),
  };
};