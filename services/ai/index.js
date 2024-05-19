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
  const supportingData = body?.supportingData || 'no supporting data'

  const html_input = `
    

    Niche:
    ${niche}

    Context:
    ${supportingData}

    Template Type:
    ${template.name}

    Template:
    ${template.content}

    Ask:
    Using a scratch space, turn the provided context into a summary.
    Then use the summary you came up with as context
    From that concept come up with key ideas that would best fit the provided template.
    Think creatively about how the key ideas can be used to generate the type of content desired in the template.
    Write the content from the perspective of a soloprenuer who is an expert on the topic.
    Using a hook early in the content is a great way to capture the readers attention.
    Content should be cleverly written in such a way, that it encourages engagement without directly asking for it.
    Then popuplate the provided html template with the best ideas.
    it should not read like an advertisement or sales pitch, but like a story.

    placeholders can contain email compatible html formatted content

    Really try and create the type of content being asked in the template.
      Eg: do not include news headlines when the template expects tips

    Do not include body or html wrapper elements.
    
  `

  const html_content_response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "user", content: html_input },
      { role: "system", content: "You are an API that generates html components based on a given template and niche using the context provided. Your output is limited to only the body of the html document. You do not include the body tag. You never return components higher than the <body></body> of an html document." }
    ]
  });

  const content = html_content_response.choices[0].message.content

  const subject_input = `
    email:
    ${content}

    Create a short catchy title for the given html email without directly copying verbiage from the email. 
  `

  const subject_response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      { role: "user", content: subject_input },
      { role: "system", content: "You are an API that generates personalized, short, catchy subject lines (7 words or less) for emails based on the provided html email. You respond in raw text. You never wrap responses in quotation marks." }
    ]
  });

  let subject = subject_response.choices[0].message.content
  subject = subject.replace(/^"(.*)"$/, '$1');
  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: 'Generated preview',
      content: content,
      subject: subject
    }),
  }
}