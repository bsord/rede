const { OpenAI } = require('openai');
const openai = new OpenAI()

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
}

// CREATE
module.exports.content_from_template = async (event) => {
  console.log(event)
  // get event body
  var body = JSON.parse(event.body)

  // insert subscription to database
  const niche = body?.niche || 'technology'
  const role = body?.role || 'Educator'
  const template = body?.template || 'TEMPLATE'
  const supportingData = body?.supportingData || 'no supporting data'
  //TODO make this unique for each job role
  const interests = body?.interests || 'Key developments in AI, technology trends, competitive landscape, Delivering valuable products that meet customer needs, Staying ahead of industry trends and innovations, Making data-driven decisions to drive product strategy'

  const html_input = `
  Industry:
  ${niche}
  
  Job Title:
  ${role}

  Key Interests: 
  ${interests}

  Context:
  ${supportingData}

  Template Type:
  ${template.name}

  Template:
  ${template.content}

  Example output for each news article:
  <news item>
  [RELEVANT EMOJI]**[Bolded Title - with no semi-colons]**

  - [First takeaway - written in 1-3 sentences total]
  - [Second takeaway - written in 1-3 sentences total]
  - [Third takeaway - written in 1-3 sentences total]
  - **Why this matters for [JOB TITLE]**: [Explain why this news is relevant to the job role in 1-2 sentences total]
  [URL Link to article with unique brief title]
  </news item>

    Ask:
    1. Using a scratch space, turn the provided context into a summary written for a person with the given role.
    2. Use the summary as context to come up with key ideas that would best fit the provided template.
    3. Think creatively about how the key ideas relate to the given role and be used to generate the type of content desired in the template.
    4. Write the content from the perspective of an expert on the topic that explains things in such a way that the given role would be able to easily understand it.
    5. Use a hook early in the content to capture the reader's attention.
    6. Ensure the content encourages engagement without directly asking for it.
    7. Populate the provided HTML template with the best ideas.

    Guidelines:
    - Write the content for the specified role.
    - The content should not read like an advertisement or sales pitch, but like a story.
    - Placeholders can contain email-compatible HTML formatted content.
    - Output must only include the content for the <body> tag without the <body> tag itself.
    - Do not include <html>, <head>, or <body> tags.
    - Do not wrap the entire response in any other tags or characters.
    - Emojis are never inside img tags. They are always inserted directly into the body of an html tag as raw unicode
  `;

  const html_content_response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "user", content: html_input },
      { role: "system", content: "You are an API that generates HTML content based on a given template and niche using the context provided. Your output must only contain the HTML content that belongs within the <body> tag, without including the <body> tag itself. Do not include <html>, <head>, or <body> tags, and avoid wrapping the entire response in any other tags, characters, or unnecessary formatting. The content should follow the provided guidelines and focus on generating engaging, story-like content as described. Do not wrap responses in backticks" }
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

// CREATE
module.exports.summarize = async (event) => {
  // get event body
  var body = JSON.parse(event.body)

  // insert subscription to database
  const text = body?.text || 'testing'

  const user_prompt = `
    Text:
    ${text}

    Ask:
    Summarize the text content of the webpage and identify the key takeaways
  `;

  const html_content_response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: user_prompt },
      { role: "system", content: "You are an API that summarizes content from webpages and makes a list of key takeaways" }
    ]
  });

  const content = html_content_response.choices[0].message.content

  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify({
      message: 'Generated summary',
      summary: content
    }),
  }
}