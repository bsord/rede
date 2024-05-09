export const templates = [
    {
        id: "tips",
        name: "name",
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
    },
    {
        "id":"linked_in_post_idea",
        "name":"LinkedIn Post Ideas",
        "content": "<h1>[title]</h1><p>[LinkedIn Post Idea]<p>[closing thought]</p>"
    }
];

export const niches = [
    "Health and Fitness",
    "Personal Finance",
    "Self-Improvement",
    "Travel",
    "Beauty and Fashion",
    "Food and Recipes",
    "Parenting",
    "Home Decor",
    "Tech Gadgets",
    "Pets",
    "Outdoor and Adventure",
    "Mental Health",
    "DIY Projects",
    "Sustainable Living",
    "Automotive",
    "Gaming",
    "Business and Entrepreneurship",
    "Digital Marketing",
    "Relationships",
    "Spirituality and Mindfulness"
  ]

