
require('dotenv').config()



// Define the function to generate summary
exports.summary = async (req, res) => {
    try {
        const { description } = req.body; // Extract description from request body
        // Call the generateSummary function
        const [ summary] = await Promise.all([
             generateSummary(description)
        ]);
        // Respond with the summary
        res.status(200).json({summary});
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
                {"role": "system", "content": "You are the host of a podcast."},
                {"role": "user", "content": `Please provide a detailed summary of the content in the following email newsletters: ${description}.
                 In your introduction, mention the number of newsletters your podcast is based on. Summarize the most interesting points, 
                 providing an engaging and comprehensive overview. Include additional context or research if available. Ensure that the summary is 
                 thorough and meets a minimum of 5000 characters. The transcript should only include what the host would say.`}
            ],
            "temperature": 0.7,
            "max_tokens": 5000
          }
          )
    };

    // Send the request to the ChatGPT API
    return fetch(apiUrl, requestOptions)
        .then(response => {
            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Failed to fetch data from ChatGPT API');
            }
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
            return null; // Return null in case of an error
        });
}

