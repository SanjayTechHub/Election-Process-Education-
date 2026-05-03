require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Role-based prompts (optional but keeps your app smart)
const rolePrompts = {
  voter: "You are an election assistant for VOTERS. Focus on voter registration, polling day, ID requirements.",
  candidate: "You are an election assistant for CANDIDATES. Focus on nomination filing, campaign rules.",
  official: "You are an election assistant for ELECTION OFFICIALS. Focus on polling management, EVM, code of conduct."
};

app.post('/api/chat', async (req, res) => {
  try {
    const { message, role = 'voter' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const systemPrompt = rolePrompts[role] || rolePrompts.voter;
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'AI service temporarily unavailable' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with Google Gemini AI`);
});