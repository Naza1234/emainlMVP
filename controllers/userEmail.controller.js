const UserEmail = require('../models/userEmail.model');
require('dotenv').config()


function generateTitle(description) {
    // Your ChatGPT API endpoint
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    
    const apiKey = process.env.CHATGPT_API_KEY;
    // Your API key for authorization
  

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
              {"role": "system", "content": "You are a helpful assistant that generates podcast titles."},
              {"role": "user", "content": `Generate a two word title for my podcast episode ${description} write the tile as : this is the tile. mote i want the title to be only two words at maximum three remove the generated tile`}
            ],
            "temperature": 0.7,
            "max_tokens": 20
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
            // Extract the title from the response
            const title = data;
            return title;
        })
        .catch(error => {
            console.error('Error:', error);
            return null; // Return null in case of an error
        });
}



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
              {"role": "system", "content": "You are a helpful assistant."},
              {"role": "user", "content": `Generate an explanation based on the following text:

              ${description}.
              
              Explanation:
              `}
            ],
            "temperature": 0.7,
            "max_tokens": 500
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



// Create user email
exports.createUserEmail = async (req, res) => {
    try {
        const { emailid } = req.body;
        const existingUserEmail = await UserEmail.findOne({ emailid });
        if (existingUserEmail) {
            return res.status(400).json({ message: 'Email ID already exists' });
        }

        // Generate Title and Summary
        const [title, summary] = await Promise.all([
            generateTitle(req.body.snippet),
            generateSummary(req.body.snippet)
        ]);

        const params = {
            userid: req.body.userid,
            emailid: req.body.emailid,
            title: title.choices[0].message.content.replace(/"/g, ''),
            message: summary.choices[0].message.content.replace(/"/g, ''),
            Date: req.body.date
        };

        const userEmail = new UserEmail(params);
        await userEmail.save();
        res.status(201).json({ message: 'User email created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};


// Find all user emails by user id
exports.findAllUserEmailsByUserId = async (req, res) => {
    try {
        const useremails = await UserEmail.find({ userid: req.params.userid });
        res.json(useremails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Find one user email by id
exports.findOneUserEmailById = async (req, res) => {
    try {
        const userEmail = await UserEmail.findById(req.params.id);
        if (!userEmail) {
            return res.status(404).json({ message: 'User email not found' });
        }
        res.json(userEmail);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update one user email by id
exports.updateOneUserEmailById = async (req, res) => {
    try {
        const userEmail = await UserEmail.findById(req.params.id);
        if (!userEmail) {
            return res.status(404).json({ message: 'User email not found' });
        }
        userEmail.userid = req.body.userid || userEmail.userid;
        userEmail.emailid = req.body.emailid || userEmail.emailid;
        userEmail.title = req.body.title || userEmail.title;
        userEmail.message = req.body.message || userEmail.message;
        await userEmail.save();
        res.json({ message: 'User email updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete one user email by id
exports.deleteOneUserEmailById = async (req, res) => {
    try {
        const userEmail = await UserEmail.findById(req.params.id);
        if (!userEmail) {
            return res.status(404).json({ message: 'User email not found' });
        }
        await userEmail.remove();
        res.json({ message: 'User email deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
