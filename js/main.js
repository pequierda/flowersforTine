
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
  }, 4000); // Change slide every 4 seconds
}

// Reset auto-slide timer
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// Album data configuration
const MAX_PHOTOS_PER_ALBUM = 10; // Limit each album to 10 photos

const albums = {
  album1: {
    name: 'Album 1',
    icon: '📸',
    start: 1,
    count: 0  // 0 = auto-detect (max 10)
  },
  album2: {
    name: 'Album 2',
    icon: '🌸',
    start: 1,
    count: 0  // 0 = auto-detect (max 10)
  },
  album3: {
    name: 'Album 3',
    icon: '💕',
    start: 1,
    count: 0  // 0 = auto-detect (max 10)
  },
   album4: {
    name: 'Album 4',
    icon: '💕',
    start: 1,
    count: 0  // 0 = auto-detect (max 10)
  }
};

// Scan album to detect available photos (max 10) - supports both .jpg and .gif
async function scanAlbumPhotos(albumName) {
  const album = albums[albumName];
  const startNum = album.start;
  
  // Create an array to track which photos exist with their extension
  const existingPhotos = [];
  
  // Check up to MAX_PHOTOS_PER_ALBUM photos
  for (let i = 0; i < MAX_PHOTOS_PER_ALBUM; i++) {
    const photoNum = startNum + i;
    let found = false;
    
    // Check for .jpg first, then .gif
    const extensions = ['.jpg', '.gif'];
    for (const ext of extensions) {
      const photoUrl = `images/${albumName}/${photoNum}${ext}`;
      
      try {
        // Try to fetch the image header (don't load full image)
        const response = await fetch(photoUrl, { method: 'HEAD' });
        if (response.ok) {
          existingPhotos.push({ num: photoNum, ext: ext });
          found = true;
          break; // Found this photo, move to next number
        }
      } catch (error) {
        // Try next extension
        continue;
      }
    }
    
    // If neither extension found, assume no more sequential photos
    if (!found) {
      break;
    }
  }
  
  return existingPhotos;
}

let currentAlbum = 'album1';
let autoAdvanceInterval = null;
const AUTO_ADVANCE_DELAY = 3000; // 3 seconds

// Start auto-advance
function startAutoAdvance() {
  stopAutoAdvance(); // Clear any existing interval
  autoAdvanceInterval = setInterval(() => {
    // Only advance if no photo is enlarged
    const isEnlarged = document.querySelector('.photo-item.enlarged');
    if (!isEnlarged) {
      scrollAlbum('right');
    }
  }, AUTO_ADVANCE_DELAY);
}

// Stop auto-advance
function stopAutoAdvance() {
  if (autoAdvanceInterval) {
    clearInterval(autoAdvanceInterval);
    autoAdvanceInterval = null;
  }
}

// Show album photos
function showAlbum(albumName) {
  currentAlbum = albumName;
  
  // Update active category button
  document.querySelectorAll('.album-category').forEach(btn => {
    btn.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
  
  // Load photos for the selected album
  loadAlbumPhotos(albumName);
  
  // Restart auto-advance
  startAutoAdvance();
}

// Load album photos with auto-detection
async function loadAlbumPhotos(albumName) {
  const albumContentWrapper = document.getElementById('album-content-wrapper');
  const thumbnailStrip = document.getElementById('thumbnail-strip');
  const album = albums[albumName];
  
  // Clear existing content
  albumContentWrapper.innerHTML = '';
  thumbnailStrip.innerHTML = '';
  
  // Get available photos
  let availablePhotos;
  if (album.count > 0) {
    // Use manual count
    availablePhotos = [];
    for (let i = 0; i < album.count; i++) {
      availablePhotos.push(album.start + i);
    }
  } else {
    // Auto-detect photos
    availablePhotos = await scanAlbumPhotos(albumName);
  }
  
  // Check if album has photos
  if (availablePhotos.length === 0) {
    albumContentWrapper.innerHTML = '<div style="color: white; padding: 20px; text-align: center;">🚧⏳🔄🔜</div>';
    return;
  }
  
  availablePhotos.forEach((photoInfo, index) => {
    const photoNum = photoInfo.num;
    const ext = photoInfo.ext;
    const isFirst = index === 0;
    const photoSrc = `images/${albumName}/${photoNum}${ext}`;
    
    // Main photo display
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item' + (isFirst ? ' active' : '');
    photoItem.innerHTML = `<img src="${photoSrc}" alt="Photo ${photoNum}">`;
    photoItem.onclick = () => openPhoto(albumName, photoNum, ext);
    albumContentWrapper.appendChild(photoItem);
    
    // Thumbnail
    const thumb = document.createElement('div');
    thumb.className = 'thumb' + (isFirst ? ' active' : '');
    thumb.innerHTML = `<img src="${photoSrc}" alt="Thumb ${photoNum}">`;
    thumb.onclick = () => {
      document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      // Find and set this photo as active in carousel
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
  
  // Initialize 3D carousel positions
  setTimeout(updateCarouselPositions, 50);
}

// Scroll to specific photo
function scrollToPhoto(index) {
  const albumContent = document.getElementById('album-content');
  const photoItems = albumContent.querySelectorAll('.photo-item');
  if (photoItems[index - 1]) {
    photoItems[index - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

// Update photo positions for 3D carousel effect
function updateCarouselPositions() {
  const photoItems = document.querySelectorAll('.album-content .photo-item');
  const totalPhotos = photoItems.length;
  
  if (totalPhotos === 0) return;
  
  // Find current active index
  let currentIndex = 0;
  photoItems.forEach((item, index) => {
    if (item.classList.contains('active')) {
      currentIndex = index;
    }
  });
  
  // Update each photo's position class
  photoItems.forEach((item, index) => {
    // Remove all position classes
    item.classList.remove('active', 'prev', 'next', 'hidden');
    
    // Calculate relative position
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

// Scroll album left/right with looping
function scrollAlbum(direction) {
  const photoItems = document.querySelectorAll('.album-content .photo-item');
  const totalPhotos = photoItems.length;
  
  if (totalPhotos === 0) return;
  
  // Find current active index
  let currentIndex = 0;
  photoItems.forEach((item, index) => {
    if (item.classList.contains('active')) {
      currentIndex = index;
    }
  });
  
  // Calculate new index with looping
  let newIndex;
  if (direction === 'right') {
    newIndex = (currentIndex + 1) % totalPhotos;
  } else {
    newIndex = (currentIndex - 1 + totalPhotos) % totalPhotos;
  }
  
  // Update active states
  photoItems.forEach((item, index) => {
    item.classList.toggle('active', index === newIndex);
  });
  
  // Update thumbnail active states
  const thumbs = document.querySelectorAll('.thumbnail-strip .thumb');
  thumbs.forEach((thumb, index) => {
    thumb.classList.toggle('active', index === newIndex);
  });
  
  // Update carousel positions for 3D effect
  updateCarouselPositions();
}

// Create and show photo modal
function showPhotoModal(imageSrc) {
  // Close any existing modal first
  closePhotoModal();
  
  // Create modal elements
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
  
  // Trigger animation
  requestAnimationFrame(() => {
    modal.classList.add('active');
  });
  
  // Disable nav buttons
  const navButtons = document.querySelectorAll('.album-nav');
  navButtons.forEach(btn => btn.classList.add('disabled'));
  
  // Pause auto-advance
  stopAutoAdvance();
}

// Close photo modal
function closePhotoModal() {
  const modal = document.getElementById('photo-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
  
  // Enable nav buttons
  const navButtons = document.querySelectorAll('.album-nav');
  navButtons.forEach(btn => btn.classList.remove('disabled'));
  
  // Resume auto-advance
  startAutoAdvance();
}

// Open photo in modal view
function openPhoto(albumName, photoNum, ext = '.jpg') {
  const imageSrc = `images/${albumName}/${photoNum}${ext}`;
  showPhotoModal(imageSrc);
}

// ========================================
// Synchronized Lyrics System
// ========================================

// Lyrics data with timestamps (time in seconds)
// IMPORTANT: You need to customize these timestamps to match your song!
// Listen to your song and note when each line starts
const lyricsData = [
  // { time: 0, text: "Instrument Playing...." },
  { time: 21, text: "Your morning eyes," },
  { time: 24, text: "I could stare like watching stars" },
  { time: 29, text: "I could walk you by," },

  { time: 32, text: "and I'll tell without a thought" },

  { time: 36, text: "You'd be mine," },

  { time: 38, text: "would you mind " },

  { time: 40, text: "if I took your hand tonight?" },

  { time: 44, text: "Know you're all" },

  { time: 46, text: "that I want" },

  { time: 49, text: "this life" },

  { time: 53, text: "I'll imagine we fell in love" },

  { time: 56, text: "I'll nap under moonlight skies with you" },
  
  { time: 60, text: "I think I'll picture us," },

  { time: 63, text: "you with the waves" },

  { time: 65, text: "The ocean's colors on your face" },

  { time: 69, text: "I'll leave my heart with your air" },

  { time: 73, text: "So let me fly with you" },

  { time: 77, text: "Will you be forever with me?" },

  { time: 83, text: " " },

  { time: 118, text: "My love will always stay by you" },

  { time: 125, text: "I'll keep it safe," },

  { time: 128, text: "so don't you worry a thing" },

  { time: 131, text: "I'll tell you I love you more" },
    
  { time: 135, text: "It's stuck with you forever," },

  { time: 139, text: "so promise you won't let it go" },

  { time: 143, text: "I'll trust the universe" },

  { time: 146, text: "will always bring me to you" },

  { time: 152, text: "I'll imagine we fell in love" },

   { time: 155, text: "I'll nap under moonlight skies with you" },
  
  { time: 159, text: "I think I'll picture us," },

  { time: 161, text: "you with the waves" },

  { time: 163, text: "The ocean's colors on your face" },

  { time: 167, text: "I'll leave my heart with your air" },

  { time: 172, text: "So let me fly with you" },

  { time: 176, text: "Will you be forever with me?" },

 { time: 183, text: " " }





];

// Lyrics state
let currentLyricIndex = -1;
let lyricsVisible = true;
let lyricsEnabled = true;
let audioPlayer = null;
let syncInterval = null;
let currentTime = 0;
let isPlaying = false;

// Initialize lyrics system
function initLyricsSystem() {
  // Try to get audio from the page's audio element first
  audioPlayer = document.getElementById('audioPlayer');
  
  // Render initial lyrics
  renderLyrics();
  
  // Show lyrics container (always visible)
  setTimeout(() => {
    const container = document.getElementById('lyricsContainer');
    if (container) container.classList.add('visible');
  }, 500);

  // Listen for audio time updates from parent window
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'audioTime') {
      currentTime = event.data.time;
      isPlaying = true;
      syncLyrics(currentTime);
    }
  });

  // If audio element exists, set up event listeners
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

// Render all lyrics lines
function renderLyrics() {
  const lyricsContent = document.getElementById('lyricsContent');
  if (!lyricsContent) return;
  
  lyricsContent.innerHTML = '';
  
  lyricsData.forEach((lyric, index) => {
    const line = document.createElement('div');
    line.className = 'lyric-line hidden'; // Start hidden
    line.id = `lyric-${index}`;
    line.textContent = lyric.text;
    lyricsContent.appendChild(line);
  });
}

// Start lyrics synchronization
function startLyricsSync() {
  if (syncInterval) clearInterval(syncInterval);
  
  syncInterval = setInterval(() => {
    if (!audioPlayer || audioPlayer.paused) return;
    
    const currentTime = audioPlayer.currentTime;
    syncLyrics(currentTime);
  }, 100); // Check every 100ms for smooth updates
}

// Stop lyrics synchronization
function stopLyricsSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}

// Sync lyrics with current audio time
function syncLyrics(currentTime) {
  // Find the current lyric index
  let newIndex = -1;
  
  for (let i = lyricsData.length - 1; i >= 0; i--) {
    if (currentTime >= lyricsData[i].time) {
      newIndex = i;
      break;
    }
  }
  
  // Only update if index changed
  if (newIndex !== currentLyricIndex && newIndex >= 0) {
    // Fade out previous lyric
    if (currentLyricIndex >= 0) {
      const prevLine = document.getElementById(`lyric-${currentLyricIndex}`);
      if (prevLine) {
        prevLine.classList.remove('active');
        prevLine.classList.add('fading');
      }
    }
    
    currentLyricIndex = newIndex;
    
    // Fade in new lyric
    const newLine = document.getElementById(`lyric-${newIndex}`);
    if (newLine) {
      newLine.classList.remove('hidden', 'fading');
      newLine.classList.add('active');
    }
  }
}

// Update lyrics position on seek
function updateLyricsPosition() {
  if (audioPlayer) {
    syncLyrics(audioPlayer.currentTime);
  }
}

// Reset lyrics to beginning
function resetLyrics() {
  // Hide all lyrics
  lyricsData.forEach((_, index) => {
    const line = document.getElementById(`lyric-${index}`);
    if (line) {
      line.classList.remove('active', 'fading');
      line.classList.add('hidden');
    }
  });
  
  currentLyricIndex = -1;
}

// ========================================
// Original Code Continues Below
// ========================================

onload = () => {
  // Initialize lyrics system
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
        setTimeout(appendTitle, 300); // 1000ms delay
      }
    }

    appendTitle();

    clearTimeout(c);
  }, 1000);

  // Show album menu after 3 second delay
  setTimeout(() => {
    const albumContainer = document.querySelector('.album-menu-container');
    if (albumContainer) {
      albumContainer.classList.add('visible');
      // Load default album
      loadAlbumPhotos('album1').then(() => {
        // Start auto-advance after album loads
        startAutoAdvance();
      });
    }
  }, 3000);
};
