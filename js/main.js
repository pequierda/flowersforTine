
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

// Scan album to detect available photos (max 10)
async function scanAlbumPhotos(albumName) {
  const album = albums[albumName];
  const startNum = album.start;
  
  // Create an array to track which photos exist
  const existingPhotos = [];
  
  // Check up to MAX_PHOTOS_PER_ALBUM photos
  for (let i = 0; i < MAX_PHOTOS_PER_ALBUM; i++) {
    const photoNum = startNum + i;
    const photoUrl = `images/${albumName}/${photoNum}.jpg`;
    
    try {
      // Try to fetch the image header (don't load full image)
      const response = await fetch(photoUrl, { method: 'HEAD' });
      if (response.ok) {
        existingPhotos.push(photoNum);
      } else {
        // If we get a 404, assume no more sequential photos
        break;
      }
    } catch (error) {
      // If fetch fails, assume photo doesn't exist
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
  
  availablePhotos.forEach((photoNum, index) => {
    const isFirst = index === 0;
    
    // Main photo display
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item' + (isFirst ? ' active' : '');
    photoItem.innerHTML = `<img src="images/${albumName}/${photoNum}.jpg" alt="Photo ${photoNum}">`;
    photoItem.onclick = () => openPhoto(albumName, photoNum);
    albumContentWrapper.appendChild(photoItem);
    
    // Thumbnail
    const thumb = document.createElement('div');
    thumb.className = 'thumb' + (isFirst ? ' active' : '');
    thumb.innerHTML = `<img src="images/${albumName}/${photoNum}.jpg" alt="Thumb ${photoNum}">`;
    thumb.onclick = () => {
      document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      // Find and set this photo as active in carousel
      const allPhotos = document.querySelectorAll('.album-content .photo-item');
      allPhotos.forEach(p => p.classList.remove('active'));
      const targetPhoto = Array.from(allPhotos).find(p => 
        p.querySelector('img').src.includes(`${photoNum}.jpg`)
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
function openPhoto(albumName, photoNum) {
  const imageSrc = `images/${albumName}/${photoNum}.jpg`;
  showPhotoModal(imageSrc);
}

onload = () => {
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
