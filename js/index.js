// ========================================
// Enhanced Entrance Experience
// ========================================

// Configuration
const CONFIG = {
    countdownDuration: 3, // seconds
    letterText: "Every moment with you feels like a beautiful dream I never want to wake up from. Your smile lights up my world brighter than a thousand stars. Your laughter is my favorite melody. Today, I've created something special just for you - a garden of flowers that will bloom forever, just like my love for you.",
    titleText: 'FLOWERS FOR ADII',
    floatingHeartsMessages: [
        'I Love You ❤️',
        'You\'re Beautiful 🌹',
        'My Everything 💕',
        'Forever Yours 💝',
        'My Love 🌸',
        'Adii 💖',
        'So Special 💗',
        'My Heart 💓'
    ]
};

// State
let audioStartTime = 0;
let audioStarted = false;

// DOM Elements
const countdownOverlay = document.getElementById('countdownOverlay');
const countdownNumber = document.getElementById('countdownNumber');
const heartbeat = document.getElementById('heartbeat');
const envelopeContainer = document.getElementById('envelopeContainer');
const loveLetter = document.getElementById('loveLetter');
const letterBody = document.getElementById('letterBody');
const mainTitle = document.getElementById('mainTitle');
const heartButtonContainer = document.getElementById('heartButtonContainer');
const openBtn = document.getElementById('openBtn');
const flowerOverlay = document.getElementById('flowerOverlay');
const flowerFrame = document.getElementById('flowerFrame');
const particlesContainer = document.getElementById('particlesContainer');
const floatingHearts = document.getElementById('floatingHearts');
const moonContainer = document.getElementById('moonContainer');
const moonVideo = document.getElementById('moonVideo');

// Sound effects (using Web Audio API for simple sounds)
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
}

function playHeartbeat() {
    initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 60;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function playClickSound() {
    initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playMagicSound() {
    initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 523.25; // C5
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Create floating particles
function createParticles() {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.width = (Math.random() * 3 + 2) + 'px';
        particle.style.height = particle.style.width;
        
        // Random colors for particles
        const colors = ['#f1c40f', '#ff6b9d', '#ffb3c6', '#fff', '#ff9a9e'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particlesContainer.appendChild(particle);
    }
}

// Create floating hearts with messages
function createFloatingHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = CONFIG.floatingHeartsMessages[Math.floor(Math.random() * CONFIG.floatingHeartsMessages.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 10 + 15) + 's';
        heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        
        floatingHearts.appendChild(heart);
        
        // Remove after animation
        setTimeout(() => {
            heart.remove();
        }, 25000);
    }, 2000);
}

// Countdown sequence
function startCountdown() {
    let count = CONFIG.countdownDuration;
    
    const countInterval = setInterval(() => {
        countdownNumber.textContent = count;
        playHeartbeat();
        
        // Animate the number
        countdownNumber.style.animation = 'none';
        void countdownNumber.offsetWidth; // Trigger reflow
        countdownNumber.style.animation = 'heartbeat 1s ease-in-out';
        
        count--;
        
        if (count < 0) {
            clearInterval(countInterval);
            countdownNumber.textContent = '❤️';
            
            // Show moon video after the heart appears
            setTimeout(() => {
                showMoon();
            }, 500);
            
            setTimeout(() => {
                countdownOverlay.style.transition = 'opacity 1s ease';
                countdownOverlay.style.opacity = '0';
                
                setTimeout(() => {
                    countdownOverlay.style.display = 'none';
                    showEnvelope();
                }, 1000);
            }, 1000);
        }
    }, 1000);
}

// Show moon video
function showMoon() {
    if (moonContainer) {
        moonContainer.classList.add('visible');
        if (moonVideo) {
            moonVideo.play().catch(() => {});
        }
    }
}

// Show envelope
function showEnvelope() {
    envelopeContainer.style.display = 'block';
    envelopeContainer.style.animation = 'envelope-float 3s ease-in-out infinite';
}

// Typewriter effect for letter
function typeWriter(text, element, speed = 50) {
    let i = 0;
    element.innerHTML = '<span class="typing-text"></span>';
    const typingElement = element.querySelector('.typing-text');
    
    function type() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Remove cursor effect
            typingElement.classList.remove('typing-text');
        }
    }
    
    type();
}

// Show love letter
function showLoveLetter() {
    envelopeContainer.classList.add('opening');
    playMagicSound();
    
    setTimeout(() => {
        envelopeContainer.style.display = 'none';
        loveLetter.style.display = 'block';
        typeWriter(CONFIG.letterText, letterBody, 40);
    }, 1000);
}

// Show title
function showTitle() {
    loveLetter.style.display = 'none';
    mainTitle.style.display = 'flex';
    
    // Create letter spans with delays
    const text = CONFIG.titleText.split('');
    mainTitle.innerHTML = '';
    
    text.forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = (index * 0.1) + 's';
        mainTitle.appendChild(span);
    });
    
    // Show heart button after title
    setTimeout(() => {
        heartButtonContainer.style.display = 'flex';
    }, 2000);
}

// Initialize everything
function init() {
    createParticles();
    createFloatingHearts();
    
    // Start countdown after a brief delay
    setTimeout(() => {
        startCountdown();
    }, 500);
    
    // Envelope click handler
    envelopeContainer.addEventListener('click', () => {
        playClickSound();
        showLoveLetter();
    });
    
    // Continue button handler
    document.getElementById('continueBtn').addEventListener('click', () => {
        playClickSound();
        showTitle();
    });
    
    // Heart button handler - open flower garden
    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Play music (user gesture required)
        const heartSound = new Audio('music/sound.mp3');
        heartSound.play().catch(() => {});
        audioStartTime = Date.now();
        audioStarted = true;
        
        playMagicSound();
        
        // Show flower in iframe
        flowerOverlay.style.display = 'block';
        flowerFrame.src = 'flower.html';
        
        // Hide heart button and title
        heartButtonContainer.style.display = 'none';
        mainTitle.style.display = 'none';
    });
    
    // Listen for messages from iframe and send audio time
    window.addEventListener('message', (event) => {
        if (event.data === 'getAudioTime' && audioStarted) {
            const currentTime = (Date.now() - audioStartTime) / 1000;
            flowerFrame.contentWindow.postMessage({ type: 'audioTime', time: currentTime }, '*');
        }
    });
    
    // Send audio time updates to iframe periodically
    setInterval(() => {
        if (audioStarted && flowerFrame.contentWindow) {
            const currentTime = (Date.now() - audioStartTime) / 1000;
            flowerFrame.contentWindow.postMessage({ type: 'audioTime', time: currentTime }, '*');
        }
    }, 100);
}

// Start when page loads
window.addEventListener('load', init);