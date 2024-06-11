//TODO UPDATE EMAIL/PROMPT TEMPLATE
export const templates = [
    {
        "id": "newsletter",
        "name": "Newsletter - Industry Insight",
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
    }
];

export const niches = [
    { name: "Technology", value: "technology" }
];

export const roles = [
    { name: "Educators", value: "educator" },
    { name: "Marketers", value: "marketer" },
    { name: "Software Developers", value: "software_developer" },
    { name: "Product Managers", value: "product_manager" },
    { name: "Sales Professionals", value: "sales_professional" },
    { name: "Entrepreneurs", value: "entrepreneur" },
    { name: "Designers", value: "designer" }
];


export const intervals = [
    { label: 'Day', value: 1440 }
];
