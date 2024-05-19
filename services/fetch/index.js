const mongoose = require('./db');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

// CREATE
module.exports.fetch_reddit_posts = async (event) => {
  // get event body
  var body = JSON.parse(event.body);
  let {subreddit} = body;

  // connect to database
  await mongoose.connect();

  try {
    console.log(event);
    subreddit = subreddit || "politics";
    const redditUrl = `https://oauth.reddit.com/r/${subreddit}/top?t=hour&limit=10`;
    console.log(redditUrl);

    var headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };

    // reddit api auth
    var username = process.env["REDDIT_USERNAME"];
    var password = process.env["REDDIT_PASSWORD"];
    var client_id = process.env["REDDIT_CLIENT_ID"];
    var client_secret = process.env["REDDIT_SECRET_KEY"];

    var details = {
      username: username,
      password: password,
      grant_type: "password",
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const access_token = await fetch(
      "https://www.reddit.com/api/v1/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Authorization: "Basic " + btoa(client_id + ":" + client_secret),
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        body: formBody,
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log("json", json);
        return json.access_token;
      });

    const posts = await fetch(redditUrl, {
      method: "GET",
      headers: {
        Authorization: "bearer " + access_token,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 f5",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return json.data.children;
      })
      .then((posts) => {
        
        let returnedPosts = []

        for (const post of posts){
          returnedPosts.push({
            title: post.data.title
          })
        }
        return returnedPosts;


      })

    // return posts
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(posts),
    };

  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      headers: headers,
      body: error,
    };
  }
};
