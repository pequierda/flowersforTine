const title = document.querySelector('.title')
// const text = `For ADI`.split('')

// Create container for better responsive layout
title.style.display = 'flex'
title.style.flexWrap = 'wrap'
title.style.justifyContent = 'center'
title.style.gap = '0.5rem'

// for (let index = 0; index < text.length; index++) {
//   if (text[index] !== ' ') {
//     title.innerHTML += `<span>${text[index]}</span>`
//   } else {
//     title.innerHTML += `<span style='width: 1rem'></span>`
//   }
// }

const textElements = document.querySelectorAll('.title span');
textElements.forEach((element) => {
  const randomDelay = Math.random() * 3;
  element.style.animationDelay = `${randomDelay}s`;
});

// Heart button: play music (user gesture) then show flower in iframe
// Using iframe avoids navigation - music keeps playing on mobile (autoplay blocks onload)
const openBtn = document.getElementById('openBtn');
const flowerOverlay = document.getElementById('flowerOverlay');
const flowerFrame = document.getElementById('flowerFrame');
const heartSound = new Audio('music/sound.mp3');

// Store the audio start time for lyrics sync
let audioStartTime = 0;
let audioStarted = false;

openBtn.addEventListener('click', (e) => {
  e.preventDefault();

  // Play music immediately (inside user gesture - required for mobile)
  heartSound.play().catch(() => {});
  audioStartTime = Date.now();
  audioStarted = true;

  // Show flower in iframe (no navigation = music continues)
  flowerOverlay.style.display = 'block';
  flowerFrame.src = 'flower.html';

  // Hide heart and title
  openBtn.closest('body').querySelector('.title').style.display = 'none';
  openBtn.closest('div').style.display = 'none';
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
