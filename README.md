# 🗳️ Election Education Assistant – with Google Gemini AI

## Chosen Vertical
**Election Process Education** – an interactive assistant that helps citizens understand voting steps, timelines, and roles.

## Approach & Logic
- **Backend**: Node.js + Express, integrates **Google Gemini API** for intelligent Q&A.
- **Frontend**: Responsive HTML/CSS/JS with chat interface and quick question buttons.
- **Google Service**: Gemini AI provides natural language answers.

## How It Works
1. User asks a question (type or click quick button)
2. Request sent to `/api/chat` → Gemini processes with system prompt
3. AI returns a helpful answer about elections

## Setup & Deployment

### Local Setup
```bash
npm install
echo "GEMINI_API_KEY=your_api_key" > .env
npm start