// DOM Elements
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const balloonsContainer = document.getElementById('balloons-container');
const particlesContainer = document.getElementById('particles-container');
const inputCard = document.getElementById('input-card');
const aiResponseCard = document.getElementById('ai-response-card');
const aiMessage = document.getElementById('ai-message');
const loadingSpinner = document.getElementById('loading-spinner');
const closeAiBtn = document.getElementById('close-ai-btn');

// State
let isProcessing = false;

// Event Listeners
sendBtn.addEventListener('click', handleSendMessage);
if (closeAiBtn) {
    closeAiBtn.addEventListener('click', hideAIResponse);
}
messageInput.addEventListener('keydown', (e) => {
    // Allow Ctrl/Cmd + Enter to send
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSendMessage();
    }
});

// Main function to handle message sending
async function handleSendMessage() {
    const message = messageInput.value.trim();

    // Validation
    if (!message) {
        shakeInput();
        return;
    }

    if (isProcessing) {
        return;
    }

    isProcessing = true;

    // Update UI
    sendBtn.disabled = true;
    sendBtn.classList.add('loading');
    const originalText = sendBtn.querySelector('.btn-text').textContent;
    sendBtn.querySelector('.btn-text').textContent = 'กำลังปลดปล่อย...';

    try {
        // Create and animate balloon
        createBalloon(message);

        // Create particles
        createParticles();

        // Hide input card with animation
        setTimeout(() => {
            inputCard.classList.add('hiding');
        }, 500);

        // Clear input with a slight delay for better UX
        setTimeout(() => {
            messageInput.value = '';
        }, 300);

        // Show loading spinner
        setTimeout(() => {
            loadingSpinner.classList.add('active');
        }, 800);

        // Get AI comfort message
        const comfortMessage = await getComfortMessage(message);

        // Hide loading spinner
        loadingSpinner.classList.remove('active');

        // Show AI response in center after input card hides
        setTimeout(() => {
            showAIResponse(comfortMessage);
        }, 300);

    } catch (error) {
        console.error('Error:', error);
        loadingSpinner.classList.remove('active');
        setTimeout(() => {
            showAIResponse('เรารับฟังคุณอยู่ คุณไม่ได้อยู่คนเดียว และความรู้สึกของคุณมีความหมาย 💙✨');
        }, 300);
    } finally {
        // Reset button state after animation
        setTimeout(() => {
            sendBtn.disabled = false;
            sendBtn.classList.remove('loading');
            sendBtn.querySelector('.btn-text').textContent = originalText;
            isProcessing = false;
        }, 1000);
    }
}

// Create floating balloon animation
function createBalloon(message) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.textContent = message;

    // Random horizontal position
    const randomX = Math.random() * (window.innerWidth - 300);
    balloon.style.left = `${randomX}px`;
    balloon.style.bottom = '0';

    // Add random horizontal drift
    const driftX = (Math.random() - 0.5) * 100;
    balloon.style.setProperty('--drift-x', `${driftX}px`);

    balloonsContainer.appendChild(balloon);

    // Remove balloon after animation completes
    setTimeout(() => {
        balloon.remove();
    }, 6000);
}

// Create particle effects
function createParticles() {
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random position around the button area
            const randomX = Math.random() * window.innerWidth;
            const randomY = window.innerHeight * 0.6 + (Math.random() * 100);

            particle.style.left = `${randomX}px`;
            particle.style.top = `${randomY}px`;

            // Random horizontal drift
            const driftX = (Math.random() - 0.5) * 100;
            particle.style.setProperty('--particle-x', `${driftX}px`);

            particlesContainer.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 3000);
        }, i * 50); // Stagger particle creation
    }
}

// Get comfort message from AI
async function getComfortMessage(userMessage) {
    try {
        const response = await fetch('/api/comfort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.comfortMessage;

    } catch (error) {
        console.error('Error getting comfort message:', error);
        // Fallback message in Thai
        return 'เรารับฟังคุณอยู่ คุณไม่ได้อยู่คนเดียว และความรู้สึกของคุณมีความหมาย 💙✨';
    }
}

// Show AI response card in center of screen
function showAIResponse(message) {
    aiMessage.textContent = message;
    aiResponseCard.classList.remove('hidden');
    aiResponseCard.classList.remove('fade-out');
}

// Hide AI response card with fade out animation
function hideAIResponse() {
    aiResponseCard.classList.add('fade-out');

    setTimeout(() => {
        aiResponseCard.classList.add('hidden');
        // Show input card again
        inputCard.classList.remove('hiding');
    }, 800);
}

// Shake input animation for validation feedback
function shakeInput() {
    messageInput.style.animation = 'none';
    setTimeout(() => {
        messageInput.style.animation = 'shake 0.5s ease';
    }, 10);

    setTimeout(() => {
        messageInput.style.animation = '';
    }, 500);
}

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

// Create stars background
function createStars() {
    const starsContainer = document.getElementById('stars-container');
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starsContainer.appendChild(star);
    }
}

// Create falling stars
function createFallingStars() {
    const starsContainer = document.getElementById('stars-container');

    setInterval(() => {
        const fallingStar = document.createElement('div');
        fallingStar.className = 'falling-star';
        fallingStar.style.left = `${Math.random() * 100}%`;
        fallingStar.style.top = '0';
        fallingStar.style.animationDelay = `${Math.random() * 2}s`;
        starsContainer.appendChild(fallingStar);

        setTimeout(() => {
            fallingStar.remove();
        }, 3000);
    }, 4000);
}

// Focus input on load
window.addEventListener('load', () => {
    messageInput.focus();
    createStars();
    createFallingStars();
});
