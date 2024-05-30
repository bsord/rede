import axios from 'axios';
import xml2js from 'xml2js';
import { JSDOM } from 'jsdom';
import base64 from 'base64-url';
import { Readability, isProbablyReaderable } from '@mozilla/readability';
import { gotScraping } from 'got-scraping';
import { connectDB } from './db.js';
import Content from './models/content.js';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

// Define the blacklist array
const blacklist = [
  'nytimes.com',
  'anotherdomain.com'
];

export async function fetch_rss_data(event) {
  // Parse the event body
  const body = JSON.parse(event.body);
  let { topic } = body;

  // Connect to the database
  await connectDB();

  return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({message:"Thanks forcing me to address this hole :P you know who you are."}),
  };

  try {
    topic = topic || 'artificial intelligence';
    const time = '1d';
    const maxArticles = 5;
    const rssUrl = `https://news.google.com/rss/search?q=${topic}+when:${time}+&hl=en-US&gl=US&ceid=US:en`;

    // Fetch the RSS feed
    const rssResponse = await gotScraping.get(rssUrl);
    const rssData = rssResponse.body;

    // Convert the RSS feed to JSON
    const parsedRss = await xml2js.parseStringPromise(rssData);
    const items = parsedRss.rss.channel[0].item;

    // Initialize an empty array to store content data
    const contentData = [];
    let processedCount = 0;

    for (let i = 0; i < items.length && processedCount < maxArticles; i++) {
      const item = items[i];
      const title = item.title[0];
      const link = item.link[0];
      const pubDate = item.pubDate ? new Date(item.pubDate[0]) : new Date();

      // Extract and decode the URL
      console.log('link', link);
      const decodedUrl = base64DecodeAndExtractUrl(extractAfterArticles(link));

      if (decodedUrl) {
        // Check if the decoded URL is from a blacklisted domain
        if (isBlacklisted(decodedUrl)) {
          console.log(`URL ${decodedUrl} is blacklisted, skipping...`);
          continue;
        }

        try {
          // Fetch the content attributes
          const contentAttributes = await fetchContent(decodedUrl);

          // Summarize the content
          const summary = await summarizeContent(contentAttributes.textContent);

          // Create content object
          const content = new Content({
            title: contentAttributes.ogTitle || contentAttributes.metaTitle,
            link: decodedUrl,
            summary: summary,
            pubDate: pubDate,
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

          // Add simplified content to the contentData array
          contentData.push({
            url: decodedUrl,
            title: contentAttributes.ogTitle || contentAttributes.metaTitle,
            description: contentAttributes.ogDescription || contentAttributes.metaDescription,
            image: contentAttributes.ogImage,
            summary: summary,
          });
          processedCount++;
        } catch (fetchError) {
          console.error(`Error fetching or summarizing content for URL ${decodedUrl}: ${fetchError.message}`);
        }
      }
    }

    // Return the response
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(contentData),
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

function extractAfterArticles(link) {
  const parts = link.split('/articles/');
  if (parts.length > 1) {
    return parts[1].split('?')[0]; // Get the base64 part before any query parameters
  }
  return '';
}

function base64DecodeAndExtractUrl(encodedString) {
  try {
    // Ensure proper padding for base64 decoding
    const missingPadding = encodedString.length % 4;
    if (missingPadding) {
      encodedString += '='.repeat(4 - missingPadding);
    }

    // URL-safe base64 decoding
    const decodedString = base64.decode(encodedString);
    console.log('decoded url', decodedString);

    // Split the decoded string by 'http' to separate the URLs
    const parts = decodedString.split(/(http)/).filter(Boolean);
    const urls = [];

    for (let i = 1; i < parts.length; i += 2) {
      urls.push(parts[i] + parts[i + 1]);
    }

    // Clean the URLs to remove any trailing non-URL characters
    const cleanedUrls = urls.map(url => url.replace(/[^\x20-\x7E]/g, '').trim());
    console.log('cleaned urls', cleanedUrls);

    // Return the last valid URL found
    const url = cleanedUrls[cleanedUrls.length - 1] || '';
    console.log('url', url);
    return url;
  } catch (error) {
    console.error(`Decoding error: ${error}`);
    return '';
  }
}

function isBlacklisted(url) {
  const domain = new URL(url).hostname;
  return blacklist.includes(domain);
}

async function fetchContent(url) {
  try {
    // Fetch the web page content
    const pageResponse = await gotScraping.get(url);

    // Check if the response status is not successful
    if (pageResponse.statusCode < 200 || pageResponse.statusCode >= 300) {
      throw new Error(`Failed to fetch content from URL ${url}, status code: ${pageResponse.statusCode}`);
    }

    // workaround to prevent css from getting dumped to console
    const originalConsoleError = console.error;
    const jsDomCssError = 'Error: Could not parse CSS stylesheet';
    console.error = (...params) => {
      if (!params.find(p => p.toString().includes(jsDomCssError))) {
        originalConsoleError(...params);
      }
    };

    const dom = new JSDOM(pageResponse.body, {
      url: url,
      runScripts: "dangerously",
      pretendToBeVisual: true,
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
      // Add more attributes here as needed
    };

    console.log('contentAttributes', contentAttributes);
    return contentAttributes;
  } catch (error) {
    console.error(`Error fetching content: ${error.message}`);
    throw new Error('Content fetch failed');
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
