import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the Content schema
const contentSchema = new Schema({
  metaTitle: String, // Updated field name
  link: String,
  summary: String,
  pubDate: Date, // Add the pubDate field
  textContent: String,
  metaDescription: String,
  metaKeywords: String,
  metaAuthor: String, // Updated field name
  ogTitle: String,
  ogDescription: String,
  ogImage: String,
  ogUrl: String
}, {
  timestamps: true
});

const Content = mongoose.model('Content', contentSchema);
export default Content;