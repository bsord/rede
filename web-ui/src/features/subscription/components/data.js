export const templates = [
    {
        "id":"linked_in_post_idea",
        "name":"LinkedIn Post Idea - Industry Insight",
        "content": `
            <div style="max-width: 600px; width: 100%; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <div style="padding: 20px; background-color: #f3f2ef; display: flex; align-items: center; justify-content: space-between;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #0073b1; margin-right: 15px;"></div>
                    <div style="flex-grow: 1;">
                        <p style="color: #0073b1; font-size: 16px; margin: 0;">[poster_name]</p>
                        <p style="color: #666; font-size: 14px; margin: 0;">[poster_title]</p>
                        <p style="color: #999; font-size: 12px; margin: 0;">[post_date] • <span style="width: 12px; height: 12px; background-color: #999; display: inline-block; border-radius: 50%;"></span></p>
                    </div>
                </div>
                <div style="padding: 20px; background-color: #fff;">
                    <p style="color: #333; font-size: 16px; line-height: 1.5;">[post_content]</p>
                </div>
                <div style="padding: 0 20px; color: #0073b1; font-size: 14px; margin-bottom: 10px;">#[hashtag_1] #[hashtag_2] #[hashtag_3]</div>
                <div style="padding: 10px 20px; background-color: #f3f2ef; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center;">
                        <span style="color: #666; font-size: 14px; margin-right: 10px; display: flex; align-items: center;"><div style="width: 14px; height: 14px; background-color: #666; margin-right: 5px; border-radius: 2px;"></div>[like_count]</span>
                        <span style="color: #666; font-size: 14px; margin-right: 10px; display: flex; align-items: center;"><div style="width: 14px; height: 14px; background-color: #666; margin-right: 5px; border-radius: 2px;"></div>[comment_count]</span>
                        <span style="color: #666; font-size: 14px; display: flex; align-items: center;"><div style="width: 14px; height: 14px; background-color: #666; margin-right: 5px; border-radius: 2px;"></div>[share_count]</span>
                    </div>
                    <div>
                        <a href="[post_url]" style="color: #0073b1; text-decoration: none; font-size: 14px;">Read more on LinkedIn</a>
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

export const intervals = [
    { label: 'Hour', value: 60 },
    { label: 'Day', value: 1440 },
    { label: '7 days', value: 10080 }, // 7 days in minutes
    { label: '30 days', value: 43200 }, // 30 days in minutes
    { label: '60 days', value: 86400 }, // 60 days in minutes
    { label: '90 days', value: 129600 }, // 90 days in minutes
];
