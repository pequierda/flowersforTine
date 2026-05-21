// ========================================
// Enhanced Interactive Garden Experience
// ========================================

// Configuration
const GARDEN_CONFIG = {
    fireflyCount: 15,
    petalCount: 20,
    hiddenMessages: [
        "You make my heart skip a beat 💓",
        "Every day with you is a blessing 🌟",
        "Your smile is my favorite sight 😊",
        "I fall for you more each day 💕",
        "You are my everything ❤️"
    ],
    finalLetter: `My Dearest Adii,

From the moment you came into my life, everything changed. The world became brighter, more beautiful, and full of endless possibilities. 

Your laughter is my favorite song, your smile is my greatest joy, and your love is my most treasured gift. 

I created this garden of flowers for you - each bloom representing a moment we've shared, each petal a memory I hold dear. Just like these flowers, my love for you continues to grow and bloom, forever and always.

Thank you for being you. Thank you for being mine.

With all my love,
Forever and Always ❤️`
};

// State
let collectedMessages = 0;
let totalMessages = GARDEN_CONFIG.hiddenMessages.length;
let audioPlayer = null;
let isPlaying = false;

// DOM Elements
const interactiveContainer = document.getElementById('interactiveContainer');
const collectionCounter = document.getElementById('collectionCounter');
const collectionCount = document.getElementById('collectionCount');
const modalBackdrop = document.getElementById('modalBackdrop');
const loveLetterModal = document.getElementById('loveLetterModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

// ========================================
// Firefly System
// ========================================

function createFireflies() {
    for (let i = 0; i < GARDEN_CONFIG.fireflyCount; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.top = Math.random() * 100 + '%';
        firefly.style.animationDuration = (Math.random() * 5 + 5) + 's';
        firefly.style.animationDelay = Math.random() * 5 + 's';
        
        // Random size
        const size = Math.random() * 3 + 2;
        firefly.style.width = size + 'px';
        firefly.style.height = size + 'px';
        
        // Click handler
        firefly.addEventListener('click', () => collectFirefly(firefly));
        
        interactiveContainer.appendChild(firefly);
    }
}

function collectFirefly(firefly) {
    firefly.classList.add('clicked');
    playCollectSound();
    
    // Show a hidden message
    setTimeout(() => {
        firefly.remove();
        showHiddenMessage();
    }, 500);
}

// ========================================
// Falling Petals System
// ========================================

function createFallingPetals() {
    for (let i = 0; i < GARDEN_CONFIG.petalCount; i++) {
        setTimeout(() => {
            const petal = document.createElement('div');
            petal.className = 'falling-petal';
            petal.style.left = Math.random() * 100 + '%';
            petal.style.animationDuration = (Math.random() * 10 + 10) + 's';
            petal.style.animationDelay = '0s';
            
            // Random size
            const size = Math.random() * 10 + 10;
            petal.style.width = size + 'px';
            petal.style.height = size + 'px';
            
            // Random rotation
            petal.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            interactiveContainer.appendChild(petal);
            
            // Remove after animation
            setTimeout(() => {
                petal.remove();
            }, 20000);
        }, i * 500);
    }
    
    // Continuously create new petals
    setInterval(() => {
        const petal = document.createElement('div');
        petal.className = 'falling-petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 10 + 10) + 's';
        
        const size = Math.random() * 10 + 10;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        
        interactiveContainer.appendChild(petal);
        
        setTimeout(() => {
            petal.remove();
        }, 20000);
    }, 2000);
}

// ========================================
// Hidden Messages System
// ========================================

function showHiddenMessage() {
    if (collectedMessages >= totalMessages) return;
    
    const message = document.createElement('div');
    message.className = 'hidden-message';
    message.textContent = GARDEN_CONFIG.hiddenMessages[collectedMessages];
    
    // Mobile-responsive positioning
    const isMobile = window.innerWidth <= 480;
    let x, y;
    
    if (isMobile) {
        // On mobile, use wider margins and avoid bottom area
        x = Math.random() * 60 + 20; // 20% to 80% of screen width
        y = Math.random() * 40 + 15; // 15% to 55% of screen height (avoid bottom)
    } else {
        // On desktop, use original positioning
        x = Math.random() * 70 + 15;
        y = Math.random() * 60 + 20;
    }
    
    message.style.left = x + '%';
    message.style.top = y + '%';
    
    // Click handler
    message.addEventListener('click', () => collectMessage(message));
    
    interactiveContainer.appendChild(message);
    
    // Animate in
    setTimeout(() => {
        message.classList.add('visible');
    }, 100);
    
    collectedMessages++;
    updateCollectionCounter();
    
    // Check if all messages collected
    if (collectedMessages >= totalMessages) {
        setTimeout(() => {
            showFinalLetter();
        }, 1500);
    }
}

function collectMessage(message) {
    message.classList.add('clicked');
    playCollectSound();
    
    setTimeout(() => {
        message.remove();
        
        // Show next message after a delay
        if (collectedMessages < totalMessages) {
            setTimeout(() => showHiddenMessage(), 2000);
        }
    }, 500);
}

function updateCollectionCounter() {
    collectionCount.textContent = collectedMessages;
    
    if (collectedMessages === 1) {
        collectionCounter.classList.add('visible');
    }
}

// ========================================
// Final Love Letter
// ========================================

function showFinalLetter() {
    // Show backdrop
    modalBackdrop.classList.add('visible');
    
    // Type out the letter content
    modalContent.innerHTML = '';
    typeWriter(GARDEN_CONFIG.finalLetter, modalContent, 30);
    
    // Show modal
    setTimeout(() => {
        loveLetterModal.classList.add('visible');
        playMagicSound();
    }, 500);
}

function typeWriter(text, element, speed) {
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '|';
    cursor.style.animation = 'blink 0.5s step-end infinite';
    
    element.appendChild(cursor);
    
    function type() {
        if (i < text.length) {
            const char = text.charAt(i);
            if (char === '\n') {
                element.insertBefore(document.createElement('br'), cursor);
            } else {
                element.insertBefore(document.createTextNode(char), cursor);
            }
            i++;
            setTimeout(type, speed);
        } else {
            cursor.remove();
        }
    }
    
    type();
}

function closeModal() {
    loveLetterModal.classList.remove('visible');
    modalBackdrop.classList.remove('visible');
}

// ========================================
// Cursor Trail Effect
// ========================================

function initCursorTrail() {
    let lastX = 0, lastY = 0;
    let trailInterval;
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Only create trail on significant movement
        const distance = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
        
        if (distance > 10) {
            createCursorTrail(x, y);
            lastX = x;
            lastY = y;
        }
    });
}

function createCursorTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    
    // Random color from palette
    const colors = ['rgba(255, 107, 157, 0.6)', 'rgba(255, 154, 158, 0.6)', 'rgba(254, 207, 239, 0.6)', 'rgba(255, 255, 255, 0.6)'];
    trail.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]} 0%, transparent 70%)`;
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 500);
}

// ========================================
// Sound Effects
// ========================================

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
}

function playCollectSound() {
    initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 880;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
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

// ========================================
// Music Beat Synchronization
// ========================================

function syncFlowersToMusic() {
    // Request audio time from parent
    window.parent.postMessage('getAudioTime', '*');
    
    // Listen for audio time updates
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'audioTime') {
            const time = event.data.time;
            
            // Pulse flowers on beat (assuming ~120 BPM = 0.5s per beat)
            const beat = Math.floor(time * 2) % 2;
            
            if (beat === 0) {
                document.querySelectorAll('.flower').forEach(flower => {
                    flower.style.filter = 'brightness(1.1)';
                    setTimeout(() => {
                        flower.style.filter = '';
                    }, 100);
                });
            }
        }
    });
}

// ========================================
// Photo Album Enhancements
// ========================================

// Enhanced photo captions
const photoCaptions = {
    album1: [
        "Our first adventure together 🌟",
        "That beautiful smile of yours 😊",
        "Memories that last forever 💕"
    ],
    album2: [
        "Dancing under the stars ✨",
        "Your laughter is contagious 😄",
        "Every moment is precious 💝"
    ],
    album3: [
        "Lost in your eyes 👀",
        "My heart belongs to you ❤️",
        "Together forever 🌹"
    ],
    album4: [
        "You are my sunshine ☀️",
        "My everything 💖",
        "Love you always 💕"
    ]
};

// Override the openPhoto function to add captions
const originalOpenPhoto = window.openPhoto;
window.openPhoto = function(albumName, photoNum, ext) {
    if (originalOpenPhoto) {
        originalOpenPhoto(albumName, photoNum, ext);
    }
    
    // Add caption to modal if exists
    const captions = photoCaptions[albumName];
    if (captions) {
        const captionIndex = (photoNum - 1) % captions.length;
        const caption = captions[captionIndex];
        
        // You could enhance the modal to show captions
        console.log('Photo caption:', caption);
    }
};

// ========================================
// Initialization
// ========================================

onload = () => {
    // Original initialization
    initLyricsSystem();
    
    // Play music when arriving from heart click (index.html)
    if (sessionStorage.getItem('playFlowerMusic') === 'true') {
        sessionStorage.removeItem('playFlowerMusic');
        const flowerMusic = new Audio('music/sound.mp3');
        flowerMusic.play().catch(() => {});
    }
    
    const c = setTimeout(() => {
        document.body.classList.remove("not-loaded");
        
        const titles = ('❤️❤️❤️').split('')
        const titleElement = document.getElementById('title');
        let index = 0;
        
        function appendTitle() {
            if (index < titles.length) {
                titleElement.innerHTML += titles[index];
                index++;
                setTimeout(appendTitle, 300);
            }
        }
        
        appendTitle();
        
        clearTimeout(c);
    }, 1000);
    
    // Show album menu after delay
    setTimeout(() => {
        const albumContainer = document.querySelector('.album-menu-container');
        if (albumContainer) {
            albumContainer.classList.add('visible');
            loadAlbumPhotos('album1').then(() => {
                startAutoAdvance();
            });
        }
    }, 3000);
    
    // Enhanced features initialization
    setTimeout(() => {
        // Create fireflies
        createFireflies();
        
        // Create falling petals
        createFallingPetals();
        
        // Initialize cursor trail
        initCursorTrail();
        
        // Start music synchronization
        syncFlowersToMusic();
        
        // Show first hidden message after a delay
        setTimeout(() => {
            showHiddenMessage();
        }, 8000);
        
    }, 5000);
    
    // Modal close handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
};

// ========================================
// Original Carousel and Album Code
// ========================================

// Carousel state
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
let autoSlideInterval;

// Initialize carousel
function initCarousel() {
    if (slides.length === 0) return;
    showSlide(currentSlideIndex);
    startAutoSlide();
}

// Show specific slide
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
    });
    
    currentSlideIndex = index;
    if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.add('active');
    }
    if (dots[currentSlideIndex]) {
        dots[currentSlideIndex].classList.add('active');
    }
}

// Next slide
function nextSlide() {
    let nextIndex = currentSlideIndex + 1;
    if (nextIndex >= slides.length) {
        nextIndex = 0;
    }
    showSlide(nextIndex);
    resetAutoSlide();
}

// Previous slide
function prevSlide() {
    let prevIndex = currentSlideIndex - 1;
    if (prevIndex < 0) {
        prevIndex = slides.length - 1;
    }
    showSlide(prevIndex);
    resetAutoSlide();
}

// Go to specific slide
function currentSlide(index) {
    showSlide(index - 1);
    resetAutoSlide();
}

// Auto-advance slides
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 4000);
}

// Reset auto-slide timer
function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Album data configuration
const MAX_PHOTOS_PER_ALBUM = 10;

const albums = {
    album1: {
        name: 'Album 1',
        icon: '📸',
        start: 1,
        count: 0
    },
    album2: {
        name: 'Album 2',
        icon: '🌸',
        start: 1,
        count: 0
    },
    album3: {
        name: 'Album 3',
        icon: '💕',
        start: 1,
        count: 0
    },
    album4: {
        name: 'Album 4',
        icon: '💕',
        start: 1,
        count: 0
    }
};

// Scan album to detect available photos
async function scanAlbumPhotos(albumName) {
    const album = albums[albumName];
    const startNum = album.start;
    
    const existingPhotos = [];
    
    for (let i = 0; i < MAX_PHOTOS_PER_ALBUM; i++) {
        const photoNum = startNum + i;
        let found = false;
        
        const extensions = ['.jpg', '.gif'];
        for (const ext of extensions) {
            const photoUrl = `images/${albumName}/${photoNum}${ext}`;
            
            try {
                const response = await fetch(photoUrl, { method: 'HEAD' });
                if (response.ok) {
                    existingPhotos.push({ num: photoNum, ext: ext });
                    found = true;
                    break;
                }
            } catch (error) {
                continue;
            }
        }
        
        if (!found) {
            break;
        }
    }
    
    return existingPhotos;
}

let currentAlbum = 'album1';
let autoAdvanceInterval = null;
const AUTO_ADVANCE_DELAY = 3000;

function startAutoAdvance() {
    stopAutoAdvance();
    autoAdvanceInterval = setInterval(() => {
        const isEnlarged = document.querySelector('.photo-item.enlarged');
        if (!isEnlarged) {
            scrollAlbum('right');
        }
    }, AUTO_ADVANCE_DELAY);
}

function stopAutoAdvance() {
    if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = null;
    }
}

function showAlbum(albumName) {
    currentAlbum = albumName;
    
    document.querySelectorAll('.album-category').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    loadAlbumPhotos(albumName);
    
    startAutoAdvance();
}

async function loadAlbumPhotos(albumName) {
    const albumContentWrapper = document.getElementById('album-content-wrapper');
    const thumbnailStrip = document.getElementById('thumbnail-strip');
    const album = albums[albumName];
    
    albumContentWrapper.innerHTML = '';
    thumbnailStrip.innerHTML = '';
    
    let availablePhotos;
    if (album.count > 0) {
        availablePhotos = [];
        for (let i = 0; i < album.count; i++) {
            availablePhotos.push(album.start + i);
        }
    } else {
        availablePhotos = await scanAlbumPhotos(albumName);
    }
    
    if (availablePhotos.length === 0) {
        albumContentWrapper.innerHTML = '<div style="color: white; padding: 20px; text-align: center;">🚧⏳🔄🔜</div>';
        return;
    }
    
    availablePhotos.forEach((photoInfo, index) => {
        const photoNum = photoInfo.num;
        const ext = photoInfo.ext;
        const isFirst = index === 0;
        const photoSrc = `images/${albumName}/${photoNum}${ext}`;
        
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item' + (isFirst ? ' active' : '');
        photoItem.innerHTML = `<img src="${photoSrc}" alt="Photo ${photoNum}">`;
        photoItem.onclick = () => openPhoto(albumName, photoNum, ext);
        albumContentWrapper.appendChild(photoItem);
        
        const thumb = document.createElement('div');
        thumb.className = 'thumb' + (isFirst ? ' active' : '');
        thumb.innerHTML = `<img src="${photoSrc}" alt="Thumb ${photoNum}">`;
        thumb.onclick = () => {
            document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            const allPhotos = document.querySelectorAll('.album-content .photo-item');
            allPhotos.forEach(p => p.classList.remove('active'));
            const targetPhoto = Array.from(allPhotos).find(p => 
                p.querySelector('img').src.includes(`${photoNum}${ext}`)
            );
            if (targetPhoto) {
                targetPhoto.classList.add('active');
                updateCarouselPositions();
            }
        };
        thumbnailStrip.appendChild(thumb);
    });
    
    setTimeout(updateCarouselPositions, 50);
}

function scrollToPhoto(index) {
    const albumContent = document.getElementById('album-content');
    const photoItems = albumContent.querySelectorAll('.photo-item');
    if (photoItems[index - 1]) {
        photoItems[index - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

function updateCarouselPositions() {
    const photoItems = document.querySelectorAll('.album-content .photo-item');
    const totalPhotos = photoItems.length;
    
    if (totalPhotos === 0) return;
    
    let currentIndex = 0;
    photoItems.forEach((item, index) => {
        if (item.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    photoItems.forEach((item, index) => {
        item.classList.remove('active', 'prev', 'next', 'hidden');
        
        const offset = (index - currentIndex + totalPhotos) % totalPhotos;
        
        if (offset === 0) {
            item.classList.add('active');
        } else if (offset === 1) {
            item.classList.add('next');
        } else if (offset === totalPhotos - 1) {
            item.classList.add('prev');
        } else {
            item.classList.add('hidden');
        }
    });
}

function scrollAlbum(direction) {
    const photoItems = document.querySelectorAll('.album-content .photo-item');
    const totalPhotos = photoItems.length;
    
    if (totalPhotos === 0) return;
    
    let currentIndex = 0;
    photoItems.forEach((item, index) => {
        if (item.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    let newIndex;
    if (direction === 'right') {
        newIndex = (currentIndex + 1) % totalPhotos;
    } else {
        newIndex = (currentIndex - 1 + totalPhotos) % totalPhotos;
    }
    
    photoItems.forEach((item, index) => {
        item.classList.toggle('active', index === newIndex);
    });
    
    const thumbs = document.querySelectorAll('.thumbnail-strip .thumb');
    thumbs.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === newIndex);
    });
    
    updateCarouselPositions();
}

function showPhotoModal(imageSrc) {
    closePhotoModal();
    
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.id = 'photo-modal';
    
    const backdrop = document.createElement('div');
    backdrop.className = 'photo-modal-backdrop';
    backdrop.onclick = closePhotoModal;
    
    const content = document.createElement('div');
    content.className = 'photo-modal-content';
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = 'Enlarged photo';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'photo-modal-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = closePhotoModal;
    
    content.appendChild(img);
    content.appendChild(closeBtn);
    modal.appendChild(backdrop);
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
    
    const navButtons = document.querySelectorAll('.album-nav');
    navButtons.forEach(btn => btn.classList.add('disabled'));
    
    stopAutoAdvance();
}

function closePhotoModal() {
    const modal = document.getElementById('photo-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    const navButtons = document.querySelectorAll('.album-nav');
    navButtons.forEach(btn => btn.classList.remove('disabled'));
    
    startAutoAdvance();
}

function openPhoto(albumName, photoNum, ext = '.jpg') {
    const imageSrc = `images/${albumName}/${photoNum}${ext}`;
    showPhotoModal(imageSrc);
}

// ========================================
// Synchronized Lyrics System
// ========================================

const lyricsData = [
    { time: 0, text: " " }
];

let currentLyricIndex = -1;
let lyricsVisible = true;
let lyricsEnabled = true;
let syncInterval = null;
let currentTime = 0;

function initLyricsSystem() {
    audioPlayer = document.getElementById('audioPlayer');
    
    renderLyrics();
    
    setTimeout(() => {
        const container = document.getElementById('lyricsContainer');
        if (container) container.classList.add('visible');
    }, 500);
    
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'audioTime') {
            currentTime = event.data.time;
            isPlaying = true;
            syncLyrics(currentTime);
        }
    });
    
    if (audioPlayer) {
        audioPlayer.addEventListener('play', startLyricsSync);
        audioPlayer.addEventListener('pause', stopLyricsSync);
        audioPlayer.addEventListener('ended', () => {
            stopLyricsSync();
            resetLyrics();
        });
        audioPlayer.addEventListener('seeked', updateLyricsPosition);
    }
}

function renderLyrics() {
    const lyricsContent = document.getElementById('lyricsContent');
    if (!lyricsContent) return;
    
    lyricsContent.innerHTML = '';
    
    lyricsData.forEach((lyric, index) => {
        const line = document.createElement('div');
        line.className = 'lyric-line hidden';
        line.id = `lyric-${index}`;
        line.textContent = lyric.text;
        lyricsContent.appendChild(line);
    });
}

function startLyricsSync() {
    if (syncInterval) clearInterval(syncInterval);
    
    syncInterval = setInterval(() => {
        if (!audioPlayer || audioPlayer.paused) return;
        
        const currentTime = audioPlayer.currentTime;
        syncLyrics(currentTime);
    }, 100);
}

function stopLyricsSync() {
    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
    }
}

function syncLyrics(currentTime) {
    let newIndex = -1;
    
    for (let i = lyricsData.length - 1; i >= 0; i--) {
        if (currentTime >= lyricsData[i].time) {
            newIndex = i;
            break;
        }
    }
    
    if (newIndex !== currentLyricIndex && newIndex >= 0) {
        if (currentLyricIndex >= 0) {
            const prevLine = document.getElementById(`lyric-${currentLyricIndex}`);
            if (prevLine) {
                prevLine.classList.remove('active');
                prevLine.classList.add('fading');
            }
        }
        
        currentLyricIndex = newIndex;
        
        const newLine = document.getElementById(`lyric-${newIndex}`);
        if (newLine) {
            newLine.classList.remove('hidden', 'fading');
            newLine.classList.add('active');
        }
    }
}

function updateLyricsPosition() {
    if (audioPlayer) {
        syncLyrics(audioPlayer.currentTime);
    }
}

function resetLyrics() {
    lyricsData.forEach((_, index) => {
        const line = document.getElementById(`lyric-${index}`);
        if (line) {
            line.classList.remove('active', 'fading');
            line.classList.add('hidden');
        }
    });
    
    currentLyricIndex = -1;
}