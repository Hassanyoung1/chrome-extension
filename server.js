const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// Replace with your project ID and service account key
const projectId = 157002040916;
const keyFilename = './gen-lang-client-0947300022-01ef8a12e5d2.json'
app.use(bodyParser.json());

app.post('/summarize', async (req, res) => {
  const { text } = req.body;
  text = `summarize not more than the word highlighted: ${text}`;

  const genAI = new GoogleGenerativeAI({
    projectId: projectId,
    keyFilename: keyFilename
  });

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    res.json({ summary });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Error summarizing text' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});