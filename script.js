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
    points: ['Extensive cleaning, feature selection, and preprocessing', 'Handled missing and inconsistent data while reducing dimensionality', 'Built and optimized multiple models, including a neural network', 'Earned a 100% project grade'],
    links: [['Browse GitHub profile', 'https://github.com/RaghadElajab']]
  }
};

// Reuse a small glow image instead of applying a canvas shadow to every dot.
function makeParticleGlow(color) {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 32;
  const context = sprite.getContext('2d');
  const glow = context.createRadialGradient(16, 16, 0, 16, 16, 16);
  glow.addColorStop(0, color);
  glow.addColorStop(.19, color);
  glow.addColorStop(.32, `${color}90`);
  glow.addColorStop(.65, `${color}18`);
  glow.addColorStop(1, `${color}00`);
  context.fillStyle = glow;
  context.fillRect(0, 0, 32, 32);
  return sprite;
}

function initNeuralVortex() {
  const canvas = document.querySelector('#neural-vortex-canvas');
  const hero = document.querySelector('.hero');
  if (!canvas || !hero) return;

  const context = canvas.getContext('2d', { alpha: true });
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const colors = ['#ff77ad', '#ff9bc3', '#84edbb', '#4da7c8'];
  const glows = colors.map(makeParticleGlow);
  const pointer = { x: .7, y: .48, targetX: .7, targetY: .48, active: false };
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let animationFrame = 0;
  let visible = true;
  let pageVisible = !document.hidden;
  let running = false;
  let pauseStarted = 0;
  let pausedDuration = 0;
  let lastFrame = 0;
  let resizeFrame = 0;
  let heroLeft = 0;
  let heroTop = 0;
  let nodes = [];
  let arms = [];

  const core = document.createElement('canvas');
  core.width = core.height = 256;
  const coreContext = core.getContext('2d');
  const coreGlow = coreContext.createRadialGradient(128, 128, 0, 128, 128, 128);
  coreGlow.addColorStop(0, 'rgba(255, 155, 195, .28)');
  coreGlow.addColorStop(.32, 'rgba(132, 237, 187, .1)');
  coreGlow.addColorStop(1, 'rgba(7, 20, 38, 0)');
  coreContext.fillStyle = coreGlow;
  coreContext.fillRect(0, 0, 256, 256);

  function makeNodes() {
    const count = innerWidth < 700 ? 60 : 110;
    const nodesPerArm = Math.ceil(count / 5);
    nodes = Array.from({ length: count }, (_, index) => {
      const arm = index % 5;
      const progress = Math.floor(index / 5) / Math.max(1, nodesPerArm - 1);
      return {
        arm,
        offset: progress * Math.PI * 5.8 + (Math.random() - .5) * .13,
        radius: .07 + progress * .93 + (Math.random() - .5) * .018,
        size: .7 + Math.random() * 2.2,
        drift: .74 + Math.random() * .38,
        glow: glows[index % colors.length],
        x: 0,
        y: 0
      };
    });
    arms = Array.from({ length: 5 }, (_, arm) => nodes.filter(node => node.arm === arm).sort((a, b) => a.radius - b.radius));
  }

  function resizeVortex() {
    const bounds = hero.getBoundingClientRect();
    heroLeft = bounds.left + scrollX;
    heroTop = bounds.top + scrollY;
    width = Math.max(1, Math.round(bounds.width));
    height = Math.max(1, Math.round(bounds.height));
    pixelRatio = Math.min(devicePixelRatio || 1, 1.35);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    makeNodes();
    drawVortex(reducedMotion.matches ? 1400 : performance.now() - pausedDuration);
  }

  function drawVortex(time) {
    context.clearRect(0, 0, width, height);
    pointer.x += (pointer.targetX - pointer.x) * .07;
    pointer.y += (pointer.targetY - pointer.y) * .07;

    const centerX = width * (.66 + (pointer.x - .5) * .09);
    const centerY = height * (.5 + (pointer.y - .5) * .1);
    const maxRadius = Math.min(width, height) * .58;
    for (const node of nodes) {
      const radius = node.radius * maxRadius + Math.sin(time * .0007 * node.drift + node.offset) * 5;
      const angle = node.offset + node.arm * (Math.PI * 2 / 5) + time * .00009 * node.drift;
      node.x = centerX + Math.cos(angle) * radius * 1.42;
      node.y = centerY + Math.sin(angle) * radius * .72;
    }

    context.save();
    context.globalCompositeOperation = 'lighter';

    for (let arm = 0; arm < 5; arm += 1) {
      const armNodes = arms[arm];
      context.beginPath();
      armNodes.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      });
      context.strokeStyle = arm % 2 ? 'rgba(132, 237, 187, .16)' : 'rgba(255, 119, 173, .2)';
      context.lineWidth = arm % 2 ? 1 : 1.25;
      context.stroke();
    }

    const linkDistanceSquared = (Math.min(width, height) * .22) ** 2;
    context.beginPath();
    for (let index = 0; index < nodes.length; index += 1) {
      const point = nodes[index];
      const neighbor = nodes[(index + 17) % nodes.length];
      if ((point.x - neighbor.x) ** 2 + (point.y - neighbor.y) ** 2 < linkDistanceSquared) {
        context.moveTo(point.x, point.y);
        context.lineTo(neighbor.x, neighbor.y);
      }
    }
    context.strokeStyle = 'rgba(139, 186, 206, .07)';
    context.lineWidth = .65;
    context.stroke();

    for (const point of nodes) {
      const radius = point.size * (pointer.active ? 4.5 : 4);
      context.drawImage(point.glow, point.x - radius, point.y - radius, radius * 2, radius * 2);
    }
    const coreRadius = Math.min(width, height) * .18;
    context.drawImage(core, centerX - coreRadius, centerY - coreRadius, coreRadius * 2, coreRadius * 2);
    context.restore();
  }

  function animateVortex(time) {
    if (!running) return;
    if (document.hidden || reducedMotion.matches) {
      syncVortex();
      return;
    }
    animationFrame = requestAnimationFrame(animateVortex);
    // Decorative motion needs only 30 fps; scrolling retains the display's full refresh rate.
    if (time - lastFrame < 1000 / 30 - 1) return;
    lastFrame = time;
    drawVortex(time - pausedDuration);
  }

  function syncVortex() {
    const shouldRun = visible && pageVisible && !reducedMotion.matches;
    if (shouldRun && !running) {
      if (pauseStarted) {
        pausedDuration += performance.now() - pauseStarted;
        pauseStarted = 0;
      }
      running = true;
      lastFrame = 0;
      animationFrame = requestAnimationFrame(animateVortex);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(animationFrame);
      pauseStarted = performance.now();
    }
  }

  hero.addEventListener('pointermove', event => {
    pointer.targetX = (event.pageX - heroLeft) / width;
    pointer.targetY = (event.pageY - heroTop) / height;
    pointer.active = event.pointerType !== 'touch';
  });

  hero.addEventListener('pointerleave', () => {
    pointer.targetX = .7;
    pointer.targetY = .48;
    pointer.active = false;
  });

  const visibilityObserver = new IntersectionObserver(entries => {
    // Freeze the small remaining hero strip before the page background starts moving.
    visible = (entries[0]?.intersectionRatio ?? 0) > .4;
    syncVortex();
  }, { threshold: [0, .4] });

  visibilityObserver.observe(hero);
  const resizeObserver = new ResizeObserver(() => {
    if (!resizeFrame) resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      resizeVortex();
    });
  });
  resizeObserver.observe(hero);
  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    syncVortex();
  });
  reducedMotion.addEventListener?.('change', () => {
    syncVortex();
    if (reducedMotion.matches) drawVortex(1400);
  });
  resizeVortex();
  syncVortex();
}

initNeuralVortex();

function initSpecialText() {
  const elements = document.querySelectorAll('[data-special-text]');
  if (!elements.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]';

  elements.forEach(element => {
    const original = element.textContent.trim();
    element.setAttribute('aria-label', original);
    let started = false;

    const animate = () => {
      if (started) return;
      started = true;
      element.classList.add('is-scrambling');
      let animationStart = 0;
      let lastTime = 0;

      const frame = time => {
        if (!animationStart) animationStart = time;
        if (time - lastTime < 34) {
          requestAnimationFrame(frame);
          return;
        }
        lastTime = time;
        const progress = Math.min(original.length, ((time - animationStart) / 1400) * original.length);
        element.textContent = [...original].map((character, index) => {
          if (character === ' ' || /[—,.!']/u.test(character)) return character;
          if (index < progress) return character;
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        }).join('');

        if (progress < original.length) requestAnimationFrame(frame);
        else {
          element.textContent = original;
          element.classList.remove('is-scrambling');
        }
      };

      setTimeout(() => requestAnimationFrame(frame), 320);
    };

    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        animate();
      }
    }, { threshold: .6 });
    observer.observe(element);
  });
}

initSpecialText();

function initAmbientParticles() {
  const layer = document.querySelector('#ambient-particles');
  const canvas = document.querySelector('#ambient-particles-canvas');
  const hero = document.querySelector('.hero');
  if (!layer || !canvas || !hero) return;

  const context = canvas.getContext('2d', { alpha: true });
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const palette = ['#ff77ad', '#ff9bc3', '#84edbb', '#4da7c8'];
  const glows = palette.map(makeParticleGlow);
  const pointer = { x: 0, y: 0, active: false };
  let width = 0;
  let height = 0;
  let ratio = 1;
  let particles = [];
  let animationFrame = 0;
  let scrollFrame = 0;
  let running = false;
  let reveal = 0;
  let lastFrame = 0;
  let resizeFrame = 0;
  let fadeStart = 0;
  let fadeLength = 1;
  let baseCount = 0;
  let linkDistance = 0;
  let columns = 0;
  let rows = 0;
  let cells = [];
  const linkGroups = Array.from({ length: 4 }, () => []);

  function createParticle(x = Math.random() * width, y = Math.random() * height) {
    const angle = Math.random() * Math.PI * 2;
    const speed = .12 + Math.random() * .28;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: .8 + Math.random() * 1.8,
      glow: glows[Math.floor(Math.random() * glows.length)]
    };
  }

  function makeParticles() {
    baseCount = innerWidth < 700 ? 36 : 72;
    particles = Array.from({ length: baseCount }, () => createParticle());
  }

  function resizeParticles() {
    const heroBounds = hero.getBoundingClientRect();
    fadeStart = heroBounds.top + scrollY + heroBounds.height * .62;
    fadeLength = Math.max(180, heroBounds.height * .38);
    width = Math.max(1, innerWidth);
    height = Math.max(1, innerHeight);
    ratio = Math.min(devicePixelRatio || 1, 1.25);
    linkDistance = innerWidth < 700 ? 110 : 170;
    columns = Math.ceil(width / linkDistance);
    rows = Math.ceil(height / linkDistance);
    cells = Array.from({ length: columns * rows }, () => []);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    makeParticles();
    drawParticles(0);
    updateReveal();
  }

  function drawParticles(step) {
    context.clearRect(0, 0, width, height);
    for (const cell of cells) cell.length = 0;
    for (const group of linkGroups) group.length = 0;

    particles.forEach((particle, index) => {
      if (step) {
        particle.x += particle.vx * step;
        particle.y += particle.vy * step;
        if (particle.x <= 0 || particle.x >= width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= height) particle.vy *= -1;
        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));
      }

      const column = Math.min(columns - 1, Math.floor(particle.x / linkDistance));
      const row = Math.min(rows - 1, Math.floor(particle.y / linkDistance));
      cells[row * columns + column].push(index);
      const radius = particle.size * 4;
      context.drawImage(particle.glow, particle.x - radius, particle.y - radius, radius * 2, radius * 2);
    });

    // Check nearby grid cells only, then paint connections in four opacity batches.
    const linkDistanceSquared = linkDistance * linkDistance;
    for (let first = 0; first < particles.length; first += 1) {
      const a = particles[first];
      const column = Math.min(columns - 1, Math.floor(a.x / linkDistance));
      const row = Math.min(rows - 1, Math.floor(a.y / linkDistance));
      for (let nearbyRow = Math.max(0, row - 1); nearbyRow <= Math.min(rows - 1, row + 1); nearbyRow += 1) {
        for (let nearbyColumn = Math.max(0, column - 1); nearbyColumn <= Math.min(columns - 1, column + 1); nearbyColumn += 1) {
          for (const second of cells[nearbyRow * columns + nearbyColumn]) {
            if (second <= first) continue;
            const b = particles[second];
            const distanceSquared = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
            if (distanceSquared >= linkDistanceSquared) continue;
            const opacityGroup = Math.min(3, Math.floor((1 - Math.sqrt(distanceSquared) / linkDistance) * 4));
            linkGroups[opacityGroup].push(a.x, a.y, b.x, b.y);
          }
        }
      }
    }

    context.lineWidth = .7;
    linkGroups.forEach((links, index) => {
      context.beginPath();
      for (let offset = 0; offset < links.length; offset += 4) {
        context.moveTo(links[offset], links[offset + 1]);
        context.lineTo(links[offset + 2], links[offset + 3]);
      }
      context.strokeStyle = `rgba(132, 237, 187, ${(index + .5) * .07})`;
      context.stroke();
    });

    if (pointer.active && !reducedMotion.matches) {
      particles.forEach(particle => {
        const distanceSquared = (particle.x - pointer.x) ** 2 + (particle.y - pointer.y) ** 2;
        if (distanceSquared < 190 * 190) {
          const distance = Math.sqrt(distanceSquared);
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(pointer.x, pointer.y);
          context.strokeStyle = `rgba(255, 119, 173, ${(1 - distance / 190) * .42})`;
          context.lineWidth = 1;
          context.stroke();
        }
      });
    }
  }

  function animateParticles(time) {
    if (!running) return;
    if (document.hidden || reducedMotion.matches) {
      syncAnimation();
      return;
    }
    animationFrame = requestAnimationFrame(animateParticles);
    if (time - lastFrame < 1000 / 30 - 1) return;
    const step = lastFrame ? Math.min(3, (time - lastFrame) / (1000 / 60)) : 1;
    lastFrame = time;
    drawParticles(step);
  }

  function syncAnimation() {
    const shouldRun = reveal > .01 && !reducedMotion.matches && !document.hidden;
    if (shouldRun && !running) {
      running = true;
      lastFrame = 0;
      animationFrame = requestAnimationFrame(animateParticles);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(animationFrame);
    }
  }

  function updateReveal() {
    scrollFrame = 0;
    reveal = Math.max(0, Math.min(1, (scrollY - fadeStart) / fadeLength));
    const opacity = reveal.toFixed(3);
    if (layer.style.opacity !== opacity) layer.style.opacity = opacity;
    syncAnimation();
  }

  function queueRevealUpdate() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateReveal);
  }

  addEventListener('pointermove', event => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = reveal > .08 && event.pointerType !== 'touch';
  }, { passive: true });

  document.documentElement.addEventListener('pointerleave', () => {
    pointer.active = false;
  });

  addEventListener('click', event => {
    if (reveal < .15 || reducedMotion.matches || event.target.closest('a, button, input, video, iframe')) return;
    for (let index = 0; index < 4; index += 1) {
      particles.push(createParticle(event.clientX, event.clientY));
    }
    if (particles.length > baseCount + 12) particles.splice(0, 4);
  });

  addEventListener('scroll', queueRevealUpdate, { passive: true });
  const queueResize = () => {
    if (!resizeFrame) resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      resizeParticles();
    });
  };
  addEventListener('resize', queueResize, { passive: true });
  const resizeObserver = new ResizeObserver(queueResize);
  resizeObserver.observe(hero);
  document.addEventListener('visibilitychange', syncAnimation);
  reducedMotion.addEventListener?.('change', () => {
    syncAnimation();
    if (reducedMotion.matches) drawParticles(0);
  });

  resizeParticles();
}

initAmbientParticles();

const projectDashboardLayer = document.querySelector('#project-dashboard-layer');
const projectDashboard = document.querySelector('#project-dashboard');
const projectDashboardClose = document.querySelector('#dashboard-close');
let projectDashboardTrigger;
let dashboardBackground = [];
let dashboardImageView;

function dashboardFocusableElements() {
  return [...projectDashboard.querySelectorAll('button, a[href], iframe, video[controls], [tabindex]:not([tabindex="-1"])')]
    .filter(element => !element.disabled && !element.closest('[hidden], [inert]') && element.getClientRects().length);
}

function focusDashboardEdge(last = false) {
  const elements = dashboardFocusableElements();
  (last ? elements.at(-1) : elements[0])?.focus();
}

function closeDashboardImage(restoreFocus = true) {
  if (!dashboardImageView) return;
  const { viewer, sections, trigger, scrollTop } = dashboardImageView;
  const content = projectDashboard.querySelector('.dashboard-content');
  viewer.remove();
  sections.forEach(({ element, hidden }) => { element.hidden = hidden; });
  content.classList.remove('is-viewing-image');
  content.scrollTop = scrollTop;
  dashboardImageView = undefined;
  if (restoreFocus) trigger.focus({ preventScroll: true });
}

function openDashboardImage(button, trigger) {
  const content = projectDashboard.querySelector('.dashboard-content');
  const viewer = document.createElement('div');
  viewer.className = 'dashboard-image-viewer';
  const back = document.createElement('button');
  back.className = 'dashboard-image-back';
  back.type = 'button';
  back.textContent = '\u2190 Back to project';
  back.addEventListener('click', () => closeDashboardImage());
  const title = document.createElement('h3');
  title.textContent = button.dataset.imageTitle || 'Project result';
  const image = document.createElement('img');
  image.src = button.dataset.image;
  image.alt = button.dataset.imageDescription || title.textContent;
  image.decoding = 'async';
  viewer.append(back, title, image);
  if (button.dataset.imageDescription) {
    const caption = document.createElement('p');
    caption.className = 'dashboard-media-caption';
    caption.textContent = button.dataset.imageDescription;
    viewer.appendChild(caption);
  }
  dashboardImageView = {
    viewer,
    trigger,
    scrollTop: content.scrollTop,
    sections: [...content.children].map(element => ({ element, hidden: element.hidden }))
  };
  dashboardImageView.sections.forEach(({ element }) => { element.hidden = true; });
  content.appendChild(viewer);
  content.classList.add('is-viewing-image');
  content.scrollTop = 0;
  back.focus();
}

function createDashboardMediaPanel(title, accent) {
  const panel = document.createElement('article');
  panel.className = 'dashboard-media-panel';
  panel.style.setProperty('--tile-accent', accent);
  const heading = document.createElement('h3');
  heading.textContent = title;
  panel.appendChild(heading);
  return panel;
}

function createDashboardPreview(source, title, label) {
  const preview = document.createElement('button');
  preview.className = 'dashboard-media-preview';
  preview.type = 'button';
  preview.setAttribute('aria-label', `${label}: ${title}`);
  if (source) {
    const image = document.createElement('img');
    image.src = source;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    preview.appendChild(image);
  }
  const action = document.createElement('span');
  action.className = label === 'Play demo' ? 'dashboard-media-play' : 'dashboard-media-zoom';
  action.textContent = label === 'Play demo' ? label : `\u2197 ${label}`;
  action.setAttribute('aria-hidden', 'true');
  preview.appendChild(action);
  return preview;
}

function appendDashboardCaption(panel, text) {
  if (!text) return;
  const caption = document.createElement('p');
  caption.className = 'dashboard-media-caption';
  caption.textContent = text;
  panel.appendChild(caption);
}

function openProjectDashboard(card, trigger) {
  const title = card.querySelector('.project-copy h3').textContent.trim();
  const tag = card.querySelector('.project-copy .tag').textContent.trim();
  const summary = card.querySelector('.project-copy > p:not(.tag)').textContent.trim();
  const accent = getComputedStyle(card).getPropertyValue('--tile-accent').trim() || '#ff77ad';
  const detailList = card.querySelector('.project-details > ul');
  const mediaGrid = document.querySelector('#dashboard-media-grid');
  const mediaHeading = document.querySelector('#dashboard-media-heading');
  const resourcesPanel = document.querySelector('#dashboard-resources-panel');
  const resources = document.querySelector('#dashboard-resources');

  closeDashboardImage(false);
  projectDashboardTrigger = trigger;
  projectDashboard.style.setProperty('--tile-accent', accent);
  document.querySelector('#dashboard-file').textContent = 'Project details';
  document.querySelector('#dashboard-tag').textContent = tag;
  document.querySelector('#dashboard-title').textContent = title;
  document.querySelector('#dashboard-summary').textContent = summary;
  document.querySelector('#dashboard-highlights').innerHTML = card.querySelector('.project-highlights').innerHTML;
  document.querySelector('#dashboard-details').innerHTML = detailList?.innerHTML || '';
  document.querySelector('#dashboard-stack').replaceChildren(
    ...[...card.querySelectorAll('.project-meta span')].map(item => item.cloneNode(true))
  );

  mediaGrid.replaceChildren();
  card.querySelectorAll('.video-demo-button').forEach(button => {
    const demoTitle = button.dataset.videoTitle || 'Project demo';
    const panel = createDashboardMediaPanel(demoTitle, accent);
    const preview = createDashboardPreview(button.dataset.poster || card.querySelector('img')?.src, demoTitle, 'Play demo');
    preview.addEventListener('click', () => {
      let player;
      if (button.dataset.embed) {
        player = document.createElement('iframe');
        player.src = button.dataset.embed;
        player.title = demoTitle;
        player.allow = 'autoplay; fullscreen';
        player.allowFullscreen = true;
      } else {
        player = document.createElement('video');
        player.src = button.dataset.video;
        player.controls = true;
        player.playsInline = true;
      }
      player.tabIndex = 0;
      preview.replaceWith(player);
      panel.classList.add('is-playing');
      player.focus();
      if (player instanceof HTMLVideoElement) player.play().catch(() => {});
    });
    panel.appendChild(preview);
    appendDashboardCaption(panel, button.dataset.videoDescription);
    const link = document.createElement('a');
    link.className = 'dashboard-media-link';
    link.href = button.dataset.video || button.dataset.embed.replace(/\/preview(?:\?.*)?$/, '/view');
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Open video \u2197';
    link.setAttribute('aria-label', `Open ${demoTitle} in a new tab`);
    panel.appendChild(link);
    mediaGrid.appendChild(panel);
  });

  card.querySelectorAll('.image-demo-button').forEach(button => {
    const imageTitle = button.dataset.imageTitle || 'Project result';
    const panel = createDashboardMediaPanel(imageTitle, accent);
    panel.classList.add('dashboard-image-panel');
    const preview = createDashboardPreview(button.dataset.image, imageTitle, button.dataset.imageAction || 'Expand image');
    preview.addEventListener('click', () => openDashboardImage(button, preview));
    panel.appendChild(preview);
    appendDashboardCaption(panel, button.dataset.imageDescription);
    mediaGrid.appendChild(panel);
  });
  mediaGrid.dataset.count = String(mediaGrid.children.length);
  mediaGrid.hidden = mediaGrid.children.length === 0;
  mediaHeading.hidden = mediaGrid.hidden;
  document.querySelector('#dashboard-aside').hidden = mediaGrid.hidden;
  projectDashboard.classList.toggle('has-media', !mediaGrid.hidden);
  const hasVideos = Boolean(card.querySelector('.video-demo-button'));
  const hasImages = Boolean(card.querySelector('.image-demo-button'));
  projectDashboard.dataset.mediaCount = String(mediaGrid.children.length);
  projectDashboard.dataset.mediaKind = hasVideos ? 'video' : 'image';
  mediaHeading.querySelector('.dashboard-label').textContent = hasVideos ? (hasImages ? 'Demos & results' : 'Watch demos') : 'Results & diagrams';

  resources.replaceChildren();
  card.querySelectorAll('.project-details a').forEach(link => {
    const resource = document.createElement('a');
    resource.href = link.href;
    resource.target = '_blank';
    resource.rel = 'noopener noreferrer';
    resource.textContent = link.textContent.trim();
    resources.appendChild(resource);
  });
  resourcesPanel.hidden = resources.children.length === 0;

  projectDashboardLayer.hidden = false;
  dashboardBackground = [...document.body.children]
    .filter(element => element !== projectDashboardLayer && !element.contains(projectDashboardLayer))
    .map(element => ({ element, inert: element.inert }));
  dashboardBackground.forEach(({ element }) => { element.inert = true; });
  document.body.classList.add('dashboard-open');
  projectDashboard.querySelector('.dashboard-content').scrollTop = 0;
  projectDashboardClose.focus();
}

function closeProjectDashboard() {
  if (projectDashboardLayer.hidden) return;
  closeDashboardImage(false);
  projectDashboardLayer.hidden = true;
  document.body.classList.remove('dashboard-open');
  document.querySelector('#dashboard-media-grid').replaceChildren();
  dashboardBackground.forEach(({ element, inert }) => { element.inert = inert; });
  dashboardBackground = [];
  projectDashboardTrigger?.focus({ preventScroll: true });
}

document.querySelectorAll('.project-detail-button').forEach(button => {
  button.addEventListener('click', () => openProjectDashboard(button.closest('.project-card'), button));
});

projectDashboardClose.addEventListener('click', closeProjectDashboard);
projectDashboardLayer.addEventListener('click', event => {
  if (event.target === projectDashboardLayer) closeProjectDashboard();
});
document.addEventListener('keydown', event => {
  if (projectDashboardLayer.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    if (dashboardImageView) closeDashboardImage();
    else closeProjectDashboard();
  }
  if (event.key === 'Tab') {
    const elements = dashboardFocusableElements();
    const first = elements[0];
    const last = elements.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
});
document.addEventListener('focusin', event => {
  if (!projectDashboardLayer.hidden && !projectDashboard.contains(event.target)) focusDashboardEdge();
});

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
