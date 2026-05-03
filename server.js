require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

// Initialize Gemini with your API key from environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use a stable, widely available model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Role-based system prompts
const rolePrompts = {
  voter: "You are an election assistant for VOTERS. Focus on: voter registration, polling day process, ID requirements, how to vote, absentee voting, and common voter FAQs. Keep answers short (max 150 words) and helpful.",
  candidate: "You are an election assistant for CANDIDATES. Focus on: nomination filing, required documents, election expenses, campaigning rules, model code of conduct, and deadlines.",
  official: "You are an election assistant for ELECTION OFFICIALS. Focus on: polling station management, voter list verification, EVM handling, counting procedures, and enforcement of the model code of conduct."
};

// Validate incoming message
function validateMessage(msg) {
  if (!msg || typeof msg !== 'string') {
    throw new Error('Message must be a non-empty string');
  }
  if (msg.length > 2000) {
    throw new Error('Message too long (max 2000 characters)');
  }
  return msg.trim();
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, role = 'voter' } = req.body;
    const cleanMessage = validateMessage(message);
    const systemPrompt = rolePrompts[role] || rolePrompts.voter;

    // Combine system prompt and user message
    const fullPrompt = `${systemPrompt}\n\nUser question: ${cleanMessage}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (err) {
    console.error('Gemini API error:', err);
    // Send a user-friendly error message
    res.status(500).json({ error: 'AI service error: ' + err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend (catch-all)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} with Gemini 1.5 Flash`);
});