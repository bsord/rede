export const templates = [
    {
        "id":"newsletter",
        "name":"Newsletter - Industry Insight",
        "content": `
            <div style="max-width: 600px; width: 100%; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <div style="padding: 20px; background-color: #0073b1; color: #fff; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">{{newsletter_title}}</h1>
                </div>
                <div style="padding: 20px; background-color: #f3f2ef;">
                    <p style="margin: 0; color: #333; font-size: 16px;">
                        Hello {{fun_name}},
                    </p>
                    <p style="color: #333; font-size: 16px;">
                        {{newsletter_greeting
                            <!-- Newsletter greeting -->
                        }}
                    </p>
                </div>
                <div style="padding: 20px; background-color: #fff;">
                    <p style="color: #333; font-size: 16px; line-height: 1.5;">
                        {{content_intro
                             <!-- Introductory content -->
                        }}
                    </p>
                    <p style="color: #333; font-size: 16px; line-height: 1.5;">
                        {{main_content

                            <!-- guidelines:
                            - Start with a Hook: Begin the post with a question, interesting fact, or bold statement to grab attention.
                            - Break down the content to organize the information using p tags.
                            - Include Lists: Lists use arrows, hyphens,•, or other unicode characters for markers. Lists use the 'br' html tag at the end of each item
                            - Incorporate Quotes: Add relevant quotes from industry experts or notable figures.
                            - Conclude with a clear CTA, encouraging readers to engage, comment, or share.
                            - Font: Do not customize the font. All text should be the same style and 16px
                            - Remember: You are an industry expert who gives industry insights on the given topic, not a sales person.
                            - You never say, 'As an ...' when giving an opinion.

                        }}
                    </p>
                    <p style="color: #333; font-size: 16px; line-height: 1.5;">
                        {{content_details
                            <!-- Additional details or stories -->
                        }}
                    </p>
                    <p style="color: #333; font-size: 16px; line-height: 1.5;">
                        {{closing_remarks
                             <!-- Closing remarks and sign-off -->
                        }}
                    </p>
                </div>
                <div style="padding: 20px; background-color: #f3f2ef;">
                    <p style="color: #333; font-size: 16px; text-align: center;">
                        Thank you for being a valued subscriber. We look forward to sharing more exciting news with you soon!
                    </p>
                </div>
            </div>
        `
    },
    {
        "id":"linked_in_post_idea",
        "name":"LinkedIn Post Idea - Industry Insight",
        "content": `
            <div style="max-width: 600px; width: 100%; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <div style="padding: 20px; background-color: #f3f2ef; display: flex; align-items: center; justify-content: space-between;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #0073b1; margin-right: 15px;"></div>
                    <div style="flex-grow: 1;">
                        <p style="color: #0073b1; font-size: 16px; margin: 0;">
                            {{poster_name}} <!-- name of poster -->
                        </p>
                        <p style="color: #999; font-size: 12px; margin: 0;">
                            {{post_date}} <!-- post date -->
                            • <span style="width: 12px; height: 12px; background-color: #999; display: inline-block; border-radius: 50%;"></span>
                        </p>
                    </div>
                </div>
                <div style="padding: 20px; background-color: #fff;">
                    <p style="color: #333; font-size: 16px; line-height: 1.5;">
                        {{post_content
                            
                            <!-- guidelines:
                            - Start with a Hook: Begin the post with a question, interesting fact, or bold statement to grab attention.
                            - Break down the content to organize the information using p tags.
                            - Include Lists: Lists use arrows, hyphens,•, or other unicode characters for markers. Lists use the 'br' html tag at the end of each item
                            - Incorporate Quotes: Add relevant quotes from industry experts or notable figures.
                            - Conclude with a clear CTA, encouraging readers to engage, comment, or share.
                            - Font: Do not customize the font. All text should be the same style and 16px
                            - Remember: You are an industry expert who gives industry insights on the given topic, not a sales person.
                            - You never say, 'As an ...' when giving an opinion.
                        }}
                    </p>
                </div>
                <div style="padding: 0 20px; color: #0073b1; font-size: 14px; margin-bottom: 10px;">
                    #{{hashtags}} <!-- hashtags -->
                </div>
                <div>
                    {{embed_media
                        <!-- embed an image using unsplash random url with query param with relevant terms -->
                    }}
                </div>
                <div style="padding: 10px 20px; background-color: #f3f2ef; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center;">
                        <span style="color: #666; font-size: 14px; margin-right: 10px; display: flex; align-items: center;">
                            <div style="width: 14px; height: 14px; background-color: #666; margin-right: 5px; border-radius: 2px;"></div>
                            {{like_count}} <!-- like count -->
                        </span>
                        <span style="color: #666; font-size: 14px; margin-right: 10px; display: flex; align-items: center;">
                            <div style="width: 14px; height: 14px; background-color: #666; margin-right: 5px; border-radius: 2px;"></div>
                            {{comment_count}} <!-- comment count -->
                        </span>
                        <span style="color: #666; font-size: 14px; display: flex; align-items: center;">
                            <div style="width: 14px; height: 14px; background-color: #666; margin-right: 5px; border-radius: 2px;"></div>
                            {{share_count}} <!-- share count -->
                        </span>
                    </div>
                    <div>
                        <a href="{{post_url}}" style="color: #0073b1; text-decoration: none; font-size: 14px;">
                            Read more on LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: "tips",
        name: "Tips",
        content: `
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #f5f5f5; background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
                <tr>
                    <td style="padding: 20px; text-align: center; background-color: #333;">
                        <h1 style="color: #f5f5f5;">[title]</h1>
                        <h2 style="color: #bbbbbb;">[subtext]</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px; background-color: #2c2c2c;">
                        <p style="color: #f5f5f5;">[importance_of_topic]</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px; background-color: #1a1a1a;">
                        <ul style="list-style-type: none; padding: 0;">
                            <li style="margin-bottom: 20px;">
                                <h3 style="color: #f5f5f5;">[tip_1]</h3>
                                <p style="color: #bbbbbb;">[tip_1_explanation]</p>
                            </li>
                            <li style="margin-bottom: 20px;">
                                <h3 style="color: #f5f5f5;">[tip_2]</h3>
                                <p style="color: #bbbbbb;">[tip_2_explanation]</p>
                            </li>
                            <li>
                                <h3 style="color: #f5f5f5;">[tip_3]</h3>
                                <p style="color: #bbbbbb;">[tip_3_explanation]</p>
                            </li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px; background-color: #2c2c2c;">
                        <p style="color: #f5f5f5;">[closing thought]</p>
                    </td>
                </tr>
            </table>
        `
    },
    {
        "id":"quotes",
        "name": "Quotes",
        "content": "<h1>[title]</h1><h3>[subtext]</h3><blockquote>[Quote of the day]</blockquote><p>[closing thought]</p>"
    }
];

export const niches = [
    { name: "Technology", value: "technology" },
    { name: "Fitness", value: "fitness" },
    { name: "Politics", value: "politics" },
    { name: "Health and Fitness", value: "healthandfitness" },
    { name: "Personal Finance", value: "personalfinance" },
    { name: "Self-Improvement", value: "selfimprovement" },
    { name: "Travel", value: "travel" },
    { name: "Beauty and Fashion", value: "fashion" },
    { name: "Food and Recipes", value: "food" },
    { name: "Parenting", value: "parenting" },
    { name: "Home Decor", value: "decor" },
    { name: "Tech Gadgets", value: "tech" },
    { name: "Pets", value: "pets" },
    { name: "Outdoor and Adventure", value: "outdoors" },
    { name: "Mental Health", value: "mentalhealth" },
    { name: "DIY Projects", value: "diy" },
    { name: "Sustainable Living", value: "sustainableliving" },
    { name: "Automotive", value: "automotive" },
    { name: "Gaming", value: "gaming" },
    { name: "Business and Entrepreneurship", value: "entrepreneur" },
    { name: "Digital Marketing", value: "digitalmarketing" },
    { name: "Relationships", value: "relationships" },
    { name: "Spirituality and Mindfulness", value: "mindfulness" }
];

export const roles = [
    { name: "Educators", value: "educator" },
    { name: "Marketers", value: "marketer" },
    { name: "Software Developers", value: "software_developer" },
    { name: "Product Managers", value: "product_manager" },
    { name: "Sales Professionals", value: "sales_professional" },
    { name: "Entrepreneurs", value: "entrepreneur" },
    { name: "Human Resources Managers", value: "human_resources_manager" },
    { name: "Financial Analysts", value: "financial_analyst" },
    { name: "Healthcare Professionals", value: "healthcare_professional" },
    { name: "Designers", value: "designer" },
    { name: "Research Scientists", value: "research_scientist" }
];


export const intervals = [
    { label: 'Hour', value: 60 },
    { label: 'Day', value: 1440 },
    { label: '7 days', value: 10080 }, // 7 days in minutes
    { label: '30 days', value: 43200 }, // 30 days in minutes
    { label: '60 days', value: 86400 }, // 60 days in minutes
    { label: '90 days', value: 129600 }, // 90 days in minutes
];
