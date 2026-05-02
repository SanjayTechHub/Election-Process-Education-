// Timeline generator
function buildTimeline() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    
    const steps = [
        { name: "🗞️ Election Announcement", days: 0 },
        { name: "📄 Nomination Filing", days: 7 },
        { name: "🔍 Scrutiny", days: 10 },
        { name: "🗳️ Polling Day", days: 31 },
        { name: "📈 Counting & Results", days: 34 }
    ];
    
    container.innerHTML = '';
    steps.forEach(step => {
        const div = document.createElement('div');
        div.className = 'timeline-step';
        div.innerHTML = `<strong>${step.name}</strong><br>~ ${step.days} days after announcement`;
        container.appendChild(div);
    });
}

// Send message to backend
async function sendMessage(text) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data.reply;
    } catch (err) {
        return "⚠️ Sorry, I'm having trouble connecting. Please try again.";
    }
}

// Add message to chat
function addMessage(text, isUser) {
    const container = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerText = text;
    msgDiv.appendChild(bubble);
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

// Handle user question
async function handleUserQuery(query) {
    if (!query.trim()) return;
    addMessage(query, true);
    const reply = await sendMessage(query);
    addMessage(reply, false);
}

// Quick buttons
function initQuickButtons() {
    const questions = [
        "How to register to vote?",
        "What happens on polling day?",
        "Explain candidate nomination",
        "How are votes counted?"
    ];
    const container = document.getElementById('quickButtons');
    if (!container) return;
    container.innerHTML = '';
    questions.forEach(q => {
        const btn = document.createElement('button');
        btn.className = 'quick-btn';
        btn.innerText = q;
        btn.addEventListener('click', () => handleUserQuery(q));
        container.appendChild(btn);
    });
}

// Event listeners
function init() {
    buildTimeline();
    initQuickButtons();
    
    document.getElementById('sendBtn').addEventListener('click', () => {
        const input = document.getElementById('userInput');
        handleUserQuery(input.value);
        input.value = '';
    });
    
    document.getElementById('userInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('sendBtn').click();
        }
    });
}

// Start when page loads
window.addEventListener('DOMContentLoaded', init);