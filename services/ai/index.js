const mongoose = require('./db')
const { OpenAI } = require('openai');
const openai = new OpenAI()

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
}

// CREATE
module.exports.content_from_template = async (event) => {
  // get event body
  var body = JSON.parse(event.body)

  // connect to database
  await mongoose.connect()

  // insert subscription to database
  const niche = body?.niche || 'testing'
  const template = body?.template || 'TEMPLATE'

  const input = `
    Template:
    ${template}

    Niche:
    ${niche}
    Ask: Based on the users niche, popuplate the provided html template. 
  `

  const openai_response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      { role: "user", content: input },
      { role: "system", content: "You are an API that generates html components based on a given template and niche. Your output is limited to only the body of the html document. You do not include the body tag. You never return components higher than the <body></body> of an html document" }
    ]
  });

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: 'Generated preview',
      preview: openai_response.choices[0].message.content
    }),
  }
}