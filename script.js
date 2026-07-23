const projects = {
  attendance: {
    file: 'ATTENDANCE.EXE', tag: 'AI · COMPUTER VISION · FALL 2025', title: 'Face Recognition Attendance',
    text: 'An AI attendance system designed for reliable live, multi-face identity recognition and image-based registration.',
    points: ['Face detection, alignment, and FaceNet embedding generation', 'SVM identity classification with unknown-face rejection', 'Confidence thresholds, margin filtering, and cross-validation', 'Earned a 98.5% project grade'],
    links: [['View repository', 'https://github.com/RaghadElajab/Attendance']]
  },
  garden: {
    file: 'GARDEN.XR', tag: 'MIXED REALITY · SPRING 2025', title: 'MR Gardening Simulator',
    text: 'A Microsoft HoloLens experience that teaches gardening through interactive mixed reality.',
    points: ['Explore, Follow-Through, and Challenge gameplay modes', 'Built collaboratively with Unity XR and C#', 'Speech recognition and an AI assistant guide the learner'],
    links: [['Garden Tomato', 'https://github.com/RaghadElajab/GardenTomato'], ['WebAR experiment', 'https://github.com/RaghadElajab/webAR']]
  },
  ecoffe: {
    file: 'ECOFFE.VR', tag: 'VR · SUSTAINABILITY · UNITY', title: 'ECoffe!',
    text: 'ECoffe! is an immersive virtual-reality café simulation designed to promote sustainability through everyday decisions. Players step into the role of a barista, prepare food and drinks, serve orders, manage the café, and balance customer expectations with environmentally responsible choices.',
    points: ['First-person VR interactions with hand-tracked drink and food preparation', 'Dynamic customers with randomized orders, limited patience, and varied behavior', 'AI-powered customers who challenge sustainable utensils, creating opportunities for players to advocate for sustainable choices', 'Built with Unity and the XR Interaction Toolkit around practical VR interaction design and game systems', 'Awarded third place at Khalifa University’s 3rd Annual Sustainability E-Gaming Competition'],
    links: [['View LinkedIn', 'https://www.linkedin.com/in/raghad-elajab/']]
  },
  cars: {
    file: 'CAR_MODEL.PY', tag: 'MACHINE LEARNING · SPRING 2025', title: 'Car Price Prediction',
    text: 'A large-scale data analysis and prediction pipeline built from roughly 34,000 records and 148 initial features.',
    points: ['Extensive cleaning, feature selection, and preprocessing', 'Handled missing and inconsistent data while reducing dimensionality', 'Built and optimized multiple models, including a neural network', 'Reached approximately 87% accuracy and earned a 100% grade'],
    links: [['Browse GitHub profile', 'https://github.com/RaghadElajab']]
  }
};

const layer = document.querySelector('#modal-layer');
const modal = document.querySelector('#modal');
const closeButton = document.querySelector('#close-modal');
let lastTrigger;

function openWindow(key, trigger) {
  const item = projects[key];
  if (!item) return;
  lastTrigger = trigger;
  modal.classList.remove('has-video', 'has-image');
  document.querySelector('#modal-media').hidden = true;
  document.querySelector('#modal-file').textContent = item.file;
  document.querySelector('#modal-tag').textContent = item.tag;
  document.querySelector('#modal-title').textContent = item.title;
  document.querySelector('#modal-text').textContent = item.text;
  const list = document.querySelector('#modal-list');
  list.innerHTML = item.points.map(point => `<li>${point}</li>`).join('');
  list.hidden = item.points.length === 0;
  document.querySelector('#modal-links').innerHTML = item.links.map(([label, url]) => `<a class="button ${label.includes('repository') ? 'primary' : 'ghost'}" href="${url}" target="${url.startsWith('http') ? '_blank' : '_self'}" rel="noreferrer">${label} ↗</a>`).join('');
  modal.classList.remove('minimized');
  offsetX = 0;
  offsetY = 0;
  modal.style.transform = '';
  layer.hidden = false;
  closeButton.focus();
}

function closeWindow() {
  const video = document.querySelector('#demo-video');
  const embed = document.querySelector('#demo-embed');
  const image = document.querySelector('#demo-image');
  video.pause();
  embed.src = 'about:blank';
  image.src = '';
  image.hidden = true;
  layer.hidden = true;
  if (lastTrigger) lastTrigger.focus();
}

function openVideoWindow(button) {
  const video = document.querySelector('#demo-video');
  const embed = document.querySelector('#demo-embed');
  const image = document.querySelector('#demo-image');
  const card = button.closest('.project-card');
  const demoTitle = button.dataset.videoTitle || 'Project Demo';
  const projectTag = card?.querySelector('.project-copy .tag')?.textContent || 'PROJECT';
  const demoFile = `${demoTitle.normalize('NFKD').replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/[\s-]+/g, '_').toUpperCase()}.MP4`;
  lastTrigger = button;
  document.querySelector('#modal-file').textContent = demoFile;
  document.querySelector('#modal-tag').textContent = `${projectTag} · DEMO`;
  document.querySelector('#modal-title').textContent = demoTitle;
  document.querySelector('#modal-text').textContent = `Video playback for ${demoTitle}.`;
  document.querySelector('#modal-list').hidden = true;
  document.querySelector('#modal-links').innerHTML = '';
  document.querySelector('#modal-media').hidden = false;
  video.pause();
  video.hidden = true;
  embed.hidden = true;
  embed.src = 'about:blank';
  image.hidden = true;
  image.src = '';
  if (button.dataset.embed) {
    embed.src = button.dataset.embed;
    embed.hidden = false;
  } else {
    video.src = button.dataset.video;
    video.load();
    video.hidden = false;
  }
  modal.classList.remove('minimized');
  modal.classList.remove('has-image');
  modal.classList.add('has-video');
  offsetX = 0;
  offsetY = 0;
  modal.style.transform = '';
  layer.hidden = false;
  closeButton.focus();
}

function openImageWindow(button) {
  const video = document.querySelector('#demo-video');
  const embed = document.querySelector('#demo-embed');
  const image = document.querySelector('#demo-image');
  const card = button.closest('.project-card');
  const imageTitle = button.dataset.imageTitle || 'Project Results';
  const projectTag = card?.querySelector('.project-copy .tag')?.textContent || 'PROJECT';
  const imageFile = button.dataset.image.split('/').pop().toUpperCase();
  lastTrigger = button;
  document.querySelector('#modal-file').textContent = imageFile;
  document.querySelector('#modal-tag').textContent = `${projectTag} · RESULTS`;
  document.querySelector('#modal-title').textContent = imageTitle;
  document.querySelector('#modal-text').textContent = button.dataset.imageDescription || `Results visualization for ${imageTitle}.`;
  document.querySelector('#modal-list').hidden = true;
  document.querySelector('#modal-links').innerHTML = '';
  document.querySelector('#modal-media').hidden = false;
  video.pause();
  video.hidden = true;
  embed.hidden = true;
  embed.src = 'about:blank';
  image.src = button.dataset.image;
  image.alt = imageTitle;
  image.hidden = false;
  modal.classList.remove('minimized', 'has-video');
  modal.classList.add('has-image');
  offsetX = 0;
  offsetY = 0;
  modal.style.transform = '';
  layer.hidden = false;
  closeButton.focus();
}

document.querySelectorAll('[data-window]').forEach(card => {
  card.addEventListener('click', event => {
    if (event.target.closest('a')) return;
    openWindow(card.dataset.window, card);
  });
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openWindow(card.dataset.window, card); }
  });
});

closeButton.addEventListener('click', closeWindow);
document.querySelector('#minimize').addEventListener('click', () => {
  modal.classList.toggle('minimized');
  offsetX = 0;
  offsetY = 0;
  modal.style.transform = '';
  if (modal.classList.contains('minimized')) {
    document.querySelector('#demo-video').pause();
    const embed = document.querySelector('#demo-embed');
    if (!embed.hidden) embed.src = embed.src;
  }
});
layer.addEventListener('click', event => { if (event.target === layer) closeWindow(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !layer.hidden) closeWindow(); });

document.querySelector('#copy-email').addEventListener('click', async event => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(button.dataset.email);
    button.querySelector('span').textContent = 'COPIED!';
    setTimeout(() => button.querySelector('span').textContent = 'COPY', 1600);
  } catch { window.location.href = `mailto:${button.dataset.email}`; }
});

function updateClock() {
  document.querySelector('#clock').textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
}
updateClock();
setInterval(updateClock, 30000);

const handle = document.querySelector('.modal-handle');
let dragging = false, originX = 0, originY = 0, offsetX = 0, offsetY = 0;
let modalBaseRect;
handle.addEventListener('pointerdown', event => {
  if (event.target.closest('button') || innerWidth < 700) return;
  dragging = true; originX = event.clientX - offsetX; originY = event.clientY - offsetY;
  const rect = modal.getBoundingClientRect();
  modalBaseRect = { left: rect.left - offsetX, right: rect.right - offsetX, top: rect.top - offsetY, bottom: rect.bottom - offsetY };
  handle.setPointerCapture(event.pointerId);
});
handle.addEventListener('pointermove', event => {
  if (!dragging) return;
  const desiredX = event.clientX - originX;
  const desiredY = event.clientY - originY;
  offsetX = Math.max(8 - modalBaseRect.left, Math.min(innerWidth - 8 - modalBaseRect.right, desiredX));
  offsetY = Math.max(8 - modalBaseRect.top, Math.min(innerHeight - 8 - modalBaseRect.bottom, desiredY));
  modal.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
});
handle.addEventListener('pointerup', () => dragging = false);

const profileWindow = document.querySelector('.draggable-profile');
const profileHandle = document.querySelector('.profile-drag-handle');
let profileDragging = false;
let profileOriginX = 0;
let profileOriginY = 0;
let profileOffsetX = 0;
let profileOffsetY = 0;

profileHandle.addEventListener('pointerdown', event => {
  if (innerWidth < 700) return;
  profileDragging = true;
  profileOriginX = event.clientX - profileOffsetX;
  profileOriginY = event.clientY - profileOffsetY;
  profileHandle.setPointerCapture(event.pointerId);
  profileWindow.classList.add('is-dragging');
});

profileHandle.addEventListener('pointermove', event => {
  if (!profileDragging) return;
  const maxX = Math.min(220, innerWidth * .2);
  const maxY = 150;
  profileOffsetX = Math.max(-maxX, Math.min(maxX, event.clientX - profileOriginX));
  profileOffsetY = Math.max(-maxY, Math.min(maxY, event.clientY - profileOriginY));
  profileWindow.style.transform = `translate(${profileOffsetX}px, ${profileOffsetY}px)`;
});

function stopProfileDrag() {
  profileDragging = false;
  profileWindow.classList.remove('is-dragging');
}

profileHandle.addEventListener('pointerup', stopProfileDrag);
profileHandle.addEventListener('pointercancel', stopProfileDrag);
profileHandle.addEventListener('dblclick', () => {
  profileOffsetX = 0;
  profileOffsetY = 0;
  profileWindow.style.transform = '';
});

document.querySelectorAll('.skill-group-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const group = toggle.closest('.skill-group');
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    toggle.querySelector('i').textContent = isExpanded ? '+' : '−';
    group.classList.toggle('is-collapsed', isExpanded);
  });
});

document.querySelectorAll('.video-demo-button').forEach(button => {
  button.addEventListener('click', () => openVideoWindow(button));
});

document.querySelectorAll('.image-demo-button').forEach(button => {
  button.addEventListener('click', () => openImageWindow(button));
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'ease-out', fill: 'both' }); observer.unobserve(entry.target); }
}), { threshold: .12 });
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelectorAll('.project-card,.timeline-item,.achievement-grid article').forEach(el => observer.observe(el));

const projectGrid = document.querySelector('.project-grid');
let projectLayoutFrame;

function layoutProjectGrid() {
  if (!projectGrid) return;
  projectGrid.classList.add('masonry-layout');
  const cards = projectGrid.querySelectorAll('.project-card');
  const styles = getComputedStyle(projectGrid);
  const rowHeight = parseFloat(styles.gridAutoRows);
  const rowGap = parseFloat(styles.rowGap);

  cards.forEach(card => { card.style.gridRowEnd = 'auto'; });
  cancelAnimationFrame(projectLayoutFrame);
  projectLayoutFrame = requestAnimationFrame(() => {
    cards.forEach(card => {
      const span = Math.ceil((card.scrollHeight + rowGap) / (rowHeight + rowGap));
      card.style.gridRowEnd = `span ${span}`;
    });
  });
}

window.addEventListener('load', layoutProjectGrid);
window.addEventListener('resize', layoutProjectGrid);
if (document.fonts?.ready) document.fonts.ready.then(layoutProjectGrid);
layoutProjectGrid();

const pettableCat = document.querySelector('#pettable-cat');
const catReaction = document.querySelector('#cat-reaction');
let catPetTimer;
let catAudioContext;

function playCatMeow() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  catAudioContext ||= new AudioContextClass();
  if (catAudioContext.state === 'suspended') catAudioContext.resume();

  const now = catAudioContext.currentTime;
  const gain = catAudioContext.createGain();
  const warmTone = catAudioContext.createOscillator();
  const brightTone = catAudioContext.createOscillator();
  const filter = catAudioContext.createBiquadFilter();

  warmTone.type = 'triangle';
  brightTone.type = 'sine';
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1800, now);

  warmTone.frequency.setValueAtTime(520, now);
  warmTone.frequency.exponentialRampToValueAtTime(760, now + .16);
  warmTone.frequency.exponentialRampToValueAtTime(430, now + .58);
  brightTone.frequency.setValueAtTime(790, now);
  brightTone.frequency.exponentialRampToValueAtTime(1080, now + .14);
  brightTone.frequency.exponentialRampToValueAtTime(650, now + .5);

  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(.075, now + .035);
  gain.gain.setValueAtTime(.075, now + .22);
  gain.gain.exponentialRampToValueAtTime(.0001, now + .62);

  warmTone.connect(filter);
  brightTone.connect(filter);
  filter.connect(gain);
  gain.connect(catAudioContext.destination);
  warmTone.start(now);
  brightTone.start(now);
  warmTone.stop(now + .64);
  brightTone.stop(now + .64);
}

function petCat() {
  clearTimeout(catPetTimer);
  pettableCat.classList.remove('is-petted');
  void pettableCat.offsetWidth;
  pettableCat.classList.add('is-petted');
  pettableCat.setAttribute('aria-label', 'Happy pink pixel cat. Pet again');
  catReaction.textContent = '';
  requestAnimationFrame(() => { catReaction.textContent = 'Meow! The cat is happy.'; });
  playCatMeow();
  catPetTimer = setTimeout(() => pettableCat.classList.remove('is-petted'), 1250);
}

pettableCat?.addEventListener('click', petCat);
