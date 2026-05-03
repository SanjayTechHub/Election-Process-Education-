require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use gemini-pro model (stable, widely available)
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.post('/api/chat', async (req, res) => {
  try {
    const { message, role = 'voter' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    // Simple, clear prompt
    const prompt = `You are an election assistant. Keep answers short. Question: ${message}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI service error: ' + err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});