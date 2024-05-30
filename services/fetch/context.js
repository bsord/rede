import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Readability, isProbablyReaderable } from '@mozilla/readability';
import { gotScraping } from 'got-scraping';
import { connectDB } from './db.js';
import Content from './models/content.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { matchMedia, setMedia } = require("mock-match-media");


export async function fetch_search_result(event) {
  // Parse the event body
  const body = JSON.parse(event.body);
  const { query } = body;

  // Connect to the database
  await connectDB();

  try {
    // Fetch multiple search results from Google
    const googlePageResults = await fetchGoogleSearchResults(query);

    let contentAttributes;
    let resultUrl;

    // Attempt to fetch content from up to 3 search results
    for (let i = 0; i < Math.min(googlePageResults.length, 3); i++) {
      resultUrl = googlePageResults[i].url;
      try {
        contentAttributes = await fetchContent(resultUrl);
        break; // If successful, break out of the loop
      } catch (error) {
        console.warn(`Failed to fetch content from ${resultUrl}: ${error.message}`);
        if (i === googlePageResults.length - 1 || i === 2) {
          throw new Error('Failed to fetch content from all search results');
        }
      }
    }

    // Summarize the content
    const summary = await summarizeContent(contentAttributes.textContent);

    // Create content object
    const content = new Content({
      title: contentAttributes.ogTitle || contentAttributes.metaTitle,
      link: resultUrl,
      summary: summary,
      pubDate: new Date(), // Ensure pubDate is set to current date
      textContent: contentAttributes.textContent,
      metaDescription: contentAttributes.metaDescription,
      metaKeywords: contentAttributes.metaKeywords,
      metaAuthor: contentAttributes.metaAuthor,
      ogTitle: contentAttributes.ogTitle,
      ogDescription: contentAttributes.ogDescription,
      ogImage: contentAttributes.ogImage,
      ogUrl: contentAttributes.ogUrl,
    });

    // Save content to the database
    await content.save();

    // Prepare simplified content data for response
    const contentData = {
      url: resultUrl,
      title: contentAttributes.ogTitle || contentAttributes.metaTitle,
      description: contentAttributes.ogDescription || contentAttributes.metaDescription,
      image: contentAttributes.ogImage,
      summary: summary,
    };

    // Return the response
    return {
      statusCode: 200,
      body: JSON.stringify(contentData),
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function fetchContent(url) {
  try {
    // Fetch the web page content
    const pageResponse = await gotScraping.get(url);

    // Check if the response status is not successful
    if (pageResponse.statusCode < 200 || pageResponse.statusCode >= 300) {
      throw new Error(`Failed to fetch content from URL ${url}, status code: ${pageResponse.statusCode}`);
    }

    // Workaround to prevent CSS from getting dumped to console
    const originalConsoleError = console.error;
    const jsDomCssError = 'Error: Could not parse CSS stylesheet';
    console.error = (...params) => {
      if (!params.find(p => p.toString().includes(jsDomCssError))) {
        originalConsoleError(...params);
      }
    };

    setMedia({
      width: "375px",
      type: "screen",
      orientation: "portrait",
      "prefers-color-scheme": "dark",
    });
    const dom = new JSDOM(pageResponse.body, {
      url: url,
      runScripts: 'dangerously',
      pretendToBeVisual: true,
      beforeParse(window) {
        window.matchMedia = matchMedia
      }
    });
    const document = dom.window.document;

    // Extract the title
    const metaTitle = document.querySelector('title')?.textContent || '';

    // Check if the document is probably readerable
    let textContent = document.body.textContent;
    if (isProbablyReaderable(document)) {
      const reader = new Readability(document);
      const page = reader.parse();
      textContent = page.textContent;
    }

    // Extract other attributes as needed
    const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
    const metaKeywords = document.querySelector('meta[name="keywords"]')?.content || '';
    const metaAuthor = document.querySelector('meta[name="author"]')?.content || '';

    // Extract Open Graph metadata
    const ogTitle = document.querySelector('meta[property="og:title"]')?.content || '';
    const ogDescription = document.querySelector('meta[property="og:description"]')?.content || '';
    const ogImage = document.querySelector('meta[property="og:image"]')?.content || '';
    const ogUrl = document.querySelector('meta[property="og:url"]')?.content || url;

    // Create an object to hold the extracted attributes
    const contentAttributes = {
      metaTitle,
      textContent,
      metaDescription,
      metaKeywords,
      metaAuthor,
      ogTitle,
      ogDescription,
      ogImage,
      ogUrl,
    };

    console.log('contentAttributes', contentAttributes);
    return contentAttributes;
  } catch (error) {
    console.error(`Error fetching content: ${error.message}`);
    throw new Error('Content fetch failed');
  }
}

async function fetchGoogleSearchResults(query) {
  try {
    // Construct the Google search URL
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    // Fetch the search result page
    const response = await gotScraping(searchUrl);

    // Parse the response body with JSDOM
    const dom = new JSDOM(response.body);
    const document = dom.window.document;

    // Extract multiple search results
    const results = [];
    const resultElements = document.querySelectorAll('.g');

    resultElements.forEach((result) => {
      const title = result.querySelector('h3') ? result.querySelector('h3').textContent : '';
      const url = result.querySelector('a') ? result.querySelector('a').href : '';
      const description = result.querySelector('.IsZvec') ? result.querySelector('.IsZvec').textContent : '';
      
      if (title && url) {
        results.push({ title, url, description });
      }
    });

    if (results.length === 0) {
      throw new Error('No search results found');
    }

    return results;

  } catch (error) {
    console.error('Error fetching Google search results:', error.message);
    throw new Error('Failed to fetch Google search results');
  }
}

async function summarizeContent(textContent) {
  try {
    // Call the AI summarize endpoint
    const aiResponse = await axios.post(`https://${process.env.API_DOMAIN}/ai/summarize`, {
      text: textContent,
    });
    console.log('ai response', aiResponse.data);
    return aiResponse.data.summary;
  } catch (error) {
    console.error(`Error summarizing content: ${error.message}`);
    throw new Error('Content summarization failed');
  }
}
