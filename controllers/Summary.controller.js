
require('dotenv').config()


// Define the function to generate summary
exports.summary = async (req, res) => {
    try {
        const { description } = req.body; // Extract description from request body
        
        // Call the generateSummary function
        const summary = await generateSummary(description); // Await the result of generateSummary
      
        // Respond with the summary and API key
        res.status(200).json(summary); 
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};

function generateSummary(description) {
    // Your ChatGPT API endpoint
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    // Your API key for authorization
    const apiKey = process.env.CHATGPT_API_KEY;

    // Define the request parameters
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }, 
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [ 
                {"role": "system", "content": "As the host of a captivating podcast, your episodes bring to life the most interesting findings from email newsletters in a natural, conversational manner. Each episode is crafted to entertain and inform, lasting between 5-10 minutes."},
                 {"role": "user", "content": `With the email newsletters described as:
                  ${description}, 
                  select and focus on the most fascinating topics, dedicating approximately 40 seconds to 2 minutes per topic. Not all topics need to be covered;
                   prioritize those that will contribute to an amazing podcast experience. Begin with a brief, captivating introduction that sparks vuriosity. 
                   Then deep dive into the topics and use illustrative anecdotes, dotes, or comparisons to make the content tangible and relatable. Incorporate creative segments (if applicable) 
                   to add depth and interest. Structure the narrative to fit within a 5-10 minute episode, ensuring a dynamic and informative listener experience.`} ],
            "temperature": 0.7,
            "max_tokens": 500
          }
          )
    };

    // Send the request to the ChatGPT API
    return fetch(apiUrl, requestOptions)
        .then(response => {
            // Parse the JSON response and return the generated title
            return response.json();
        })
        .then((data) => {
           // Extract the summary from the response
           const summary = data;
           return summary;
        })
        .catch(error => {
            console.error('Error:', error);
            return error.message; // Return null in case of an error
        });
}

