import express from 'express';
import axios from 'axios';
import cors from 'cors';  // Import the CORS middleware
const app = express();

app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // For parsing JSON request bodies


const apiKey = process.env.API_KEY;
// Define the proxy route
app.post('http://localhost:3000/proxy-gemini', (req, res) => {
  const { prompt, max_tokens, temperature } = req.body;

  

  // Make the request to the Gemini API
  axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', {
    model: 'gemini-1.5-flash',
    prompt: prompt,
    max_tokens: max_tokens,
    temperature: temperature,
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,  // Replace with your actual API key
      'Content-Type': 'application/json',
    }
  })
    .then(response => {
      // Send the result back to the client (your extension)
      res.json({ summary: response.data.candidates[0].output });
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error forwarding request to Gemini API' });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
