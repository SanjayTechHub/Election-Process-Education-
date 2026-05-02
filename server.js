require('dotenv').config();
const express = require('express');
const path = require('path');
const Groq = require('groq-sdk');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// ---------- ENV validation ----------
if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY environment variable is missing');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8080;

// ---------- Security middleware ----------
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "maps.google.com"],
      frameSrc: ["maps.google.com"]
    }
  }
}));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Rate limiting ----------
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: { error: 'Too many requests, please slow down' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// ---------- Groq client ----------
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ---------- Role‑based prompts (optimized for token efficiency) ----------
const PROMPTS = {
  voter: `You are an expert election assistant for VOTERS. Keep answers very concise (max 100 words). Focus on: voter registration, polling day process, required ID, absentee voting, and common voter concerns. Use simple, actionable language.`,
  candidate: `You are an election assistant for CANDIDATES. Be brief. Cover: nomination filing, required documents, election expenditure limits, campaigning rules, model code of conduct, and deadlines.`,
  official: `You are an election assistant for ELECTION OFFICIALS. Briefly explain: polling station management, voter list verification, EVM handling, counting procedures, and enforcement of the model code of conduct.`
};

// ---------- Logger (simple but structured) ----------
const log = (level, message, meta = {}) => {
  const entry = { timestamp: new Date().toISOString(), level, message, ...meta };
  console[level === 'error' ? 'error' : 'log'](JSON.stringify(entry));
};

// ---------- Input validation ----------
const validateMessage = (msg) => {
  if (!msg || typeof msg !== 'string') throw new Error('Invalid message');
  if (msg.length > 2000) throw new Error('Message too long');
  return msg.trim();
};

// ---------- Chat endpoint ----------
app.post('/api/chat', async (req, res, next) => {
  try {
    const { message, role = 'voter' } = req.body;
    const cleanMsg = validateMessage(message);
    const systemPrompt = PROMPTS[role] || PROMPTS.voter;
    
    log('info', 'Chat request', { role, msgLength: cleanMsg.length });
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: cleanMsg }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const reply = completion.choices[0]?.message?.content || 'No response from AI.';
    res.json({ reply });
  } catch (err) {
    log('error', 'Groq API error', { error: err.message });
    if (err.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try in a few seconds.' });
    } else {
      res.status(500).json({ error: 'AI service temporarily unavailable. Please retry.' });
    }
  }
});

// ---------- (Optional) Health check ----------
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ---------- Serve frontend ----------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  log('error', 'Unhandled exception', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// ---------- Start server ----------
app.listen(PORT, () => {
  log('info', `🚀 Server running on port ${PORT}`);
});