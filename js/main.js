
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

    // Initialize carousel after page loads
  setTimeout(initCarousel, 1500);

  // Show carousel after 5 second delay
  setTimeout(() => {
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
      carouselContainer.classList.add('visible');
    }
  }, 5000);
};
