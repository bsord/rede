
import { connectDB } from './db.js';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export async function fetch_reddit_posts(event) {
  // get event body
  const body = JSON.parse(event.body);
  let { subreddit } = body;

  // connect to database
  await connectDB();

  try {
    console.log(event);
    subreddit = subreddit || 'politics';
    const redditUrl = `https://oauth.reddit.com/r/${subreddit}/top?t=hour&limit=10`;
    console.log(redditUrl);

    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    // reddit api auth
    const username = process.env.REDDIT_USERNAME;
    const password = process.env.REDDIT_PASSWORD;
    const client_id = process.env.REDDIT_CLIENT_ID;
    const client_secret = process.env.REDDIT_SECRET_KEY;

    const details = {
      username: username,
      password: password,
      grant_type: 'password',
    };
    let formBody = [];
    for (const property in details) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    const access_token = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: formBody,
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('json', json);
        return json.access_token;
      });

    const posts = await fetch(redditUrl, {
      method: 'GET',
      headers: {
        Authorization: 'bearer ' + access_token,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })
      .then((response) => response.json())
      .then((json) => json.data.children)
      .then((posts) => {
        console.log(posts);
        const returnedPosts = posts.map((post) => ({
          title: post.data.title,
          url: post.data.url,
        }));
        return returnedPosts;
      });

    // return posts
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(posts),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
