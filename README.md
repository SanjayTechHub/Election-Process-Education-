# 🗳️ Election Education Assistant – Google Gemini AI

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://election-assistant-xxxxx-uc.a.run.app)
[![GitHub repo](https://img.shields.io/badge/GitHub-Repo-green)](https://github.com/SanjayTechHub/Election-Process-Education-)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini-FFA500)](https://ai.google.dev/gemini-api)

> An intelligent, role‑based election assistant that helps voters, candidates, and election officials understand electoral processes – powered by **Google Gemini AI**, **Google Maps Embed**, and built with **Node.js + Express**.

---

## 📌 Table of Contents

- [Chosen Vertical](#chosen-vertical)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Google Services Integration](#google-services-integration)
- [Technical Architecture](#technical-architecture)
- [Security & Efficiency](#security--efficiency)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Local Setup](#local-setup)
- [Deployment on Cloud Run (Free Credits)](#deployment-on-cloud-run-free-credits)
- [Assumptions](#assumptions)
- [Live Demo](#live-demo)
- [Screenshots](#screenshots)

---

## 🧭 Chosen Vertical

**Election Process Education** – The assistant provides accurate, context‑aware answers about voter registration, polling day procedures, candidate nomination, model code of conduct, and election official duties.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Role‑based AI** | Voter / Candidate / Official – system prompts adapt to user context. |
| **Google Gemini API** | Natural language generation with factually grounded answers. |
| **Google Maps Embed** | Live polling place map – just enter an address. |
| **Speech‑to‑Text** | Voice input for questions (Web Speech API). |
| **PDF Voter Guide** | One‑click download of a ready‑to‑share election guide. |
| **Election Countdown** | Dynamic countdown to upcoming elections (General & State). |
| **Dark Mode & Multi‑language** | English / हिंदी toggle + persistent dark mode. |
| **Accessibility** | ARIA labels, skip‑navigation link, keyboard focus indicators. |
| **Security** | Helmet, rate limiting, CORS, input sanitisation. |
| **Testing** | Unit tests with Node.js native test runner. |

---

## ⚙️ How It Works

1. **Frontend** (`index.html`) captures user question, selected role, and optional voice input.
2. **Backend** (`server.js`) receives a POST request to `/api/chat` with `{ message, role }`.
3. **Gemini API** is called with a role‑specific system prompt (e.g., for voters → focus on registration and polling day).
4. **AI response** is returned to the frontend and displayed in the chat.
5. **Additional features** (maps, PDF, countdown, themes) run entirely client‑side for speed.

---

## 🔌 Google Services Integration

| Service | Usage | Why It Matters |
|---------|-------|----------------|
| **Google Gemini API** | Generates all AI answers using `gemini-1.5-flash`. | Core intelligence – demonstrates effective use of Google’s generative AI. |
| **Google Maps Embed** | Shows polling place map for any entered address (no API key required). | Practical real‑world utility – voters can visualise their polling booth. |

---

## 🏗️ Technical Architecture
