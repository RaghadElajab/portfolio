(() => {
  'use strict';

  function initializeSkillsMotion() {
    const container = document.getElementById('skills-marquees');
    const toggle = document.getElementById('skills-motion-toggle');
    if (!container || !toggle || container.classList.contains('is-enhanced')) return;

    const label = toggle.querySelector('[data-motion-label]');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pixelsPerSecond = 12;
    const lanes = [];
    let userPaused = toggle.getAttribute('aria-pressed') === 'true';
    let resizeFrame = 0;

    container.querySelectorAll('.skills-row').forEach((row) => {
      const viewport = row.querySelector('.skills-viewport');
      const track = viewport && viewport.querySelector('.skills-track');
      const list = track && track.querySelector('.skills-list');
      if (!list) return;

      const items = Array.from(list.children);
      const group = document.createElement('div');
      group.className = 'skills-lanes';
      viewport.before(group);
      group.appendChild(viewport);
      lanes.push({ viewport, track, list, offset: 0 });

      if (items.length >= 7) {
        const secondViewport = document.createElement('div');
        const secondTrack = document.createElement('div');
        const secondList = list.cloneNode(false);
        secondViewport.className = 'skills-viewport skills-lane-offset';
        secondTrack.className = 'skills-track';
        secondList.removeAttribute('id');

        // Move real items so every skill occurs just once in the accessibility tree.
        items.slice(Math.ceil(items.length / 2)).forEach((item) => secondList.appendChild(item));
        secondTrack.appendChild(secondList);
        secondViewport.appendChild(secondTrack);
        group.appendChild(secondViewport);
        lanes.push({ viewport: secondViewport, track: secondTrack, list: secondList, offset: 48 });
      }
    });

    if (!lanes.length) return;

    function duplicateList(list) {
      const duplicate = list.cloneNode(true);
      duplicate.classList.add('skills-list-copy');
      duplicate.setAttribute('aria-hidden', 'true');
      duplicate.setAttribute('inert', '');
      duplicate.removeAttribute('id');
      duplicate.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
      return duplicate;
    }

    function measureLanes() {
      resizeFrame = 0;
      if (userPaused || motionPreference.matches) return;

      // Measure one content group, including its trailing spacing, before writing styles.
      const measurements = lanes.map((lane) => ({
        lane,
        distance: lane.list.getBoundingClientRect().width + (parseFloat(getComputedStyle(lane.track).columnGap) || 0),
        viewportWidth: lane.viewport.clientWidth
      }));

      measurements.forEach(({ lane, distance, viewportWidth }) => {
        if (!distance || !viewportWidth) return;
        if (lane.distance !== distance) {
          lane.track.style.setProperty('--skills-distance', `${distance}px`);
          lane.track.style.setProperty('--skills-duration', `${distance / pixelsPerSecond}s`);
          lane.track.style.setProperty('--skills-delay', `${-lane.offset / pixelsPerSecond}s`);
          lane.distance = distance;
        }

        // Short lists also fill wide screens throughout the entire loop.
        const requiredCopies = Math.ceil(viewportWidth / distance) + 1;
        let copies = lane.track.children.length - 1;
        while (copies < requiredCopies) {
          lane.track.appendChild(duplicateList(lane.list));
          copies += 1;
        }
        while (copies > requiredCopies) {
          lane.track.lastElementChild.remove();
          copies -= 1;
        }
      });
    }

    function scheduleMeasurement() {
      if (!resizeFrame) resizeFrame = window.requestAnimationFrame(measureLanes);
    }

    function updatePauseState() {
      container.classList.toggle('is-paused', userPaused);
      toggle.setAttribute('aria-pressed', String(userPaused));
      if (label) label.textContent = userPaused ? 'Resume motion' : 'Pause motion';
      scheduleMeasurement();
    }

    function updateMotionPreference() {
      // Preserve an explicit pause when the system preference changes.
      container.classList.toggle('is-reduced-motion', motionPreference.matches);
      toggle.hidden = motionPreference.matches;
      scheduleMeasurement();
    }

    function updatePageVisibility() {
      container.classList.toggle('is-page-hidden', document.hidden);
    }

    toggle.addEventListener('click', () => {
      userPaused = !userPaused;
      updatePauseState();
    });

    if (typeof motionPreference.addEventListener === 'function') {
      motionPreference.addEventListener('change', updateMotionPreference);
    } else {
      motionPreference.addListener(updateMotionPreference);
    }

    document.addEventListener('visibilitychange', updatePageVisibility);

    updatePauseState();
    updateMotionPreference();
    updatePageVisibility();
    container.classList.add('is-enhanced');
    measureLanes();

    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(scheduleMeasurement);
      lanes.forEach(({ viewport, list }) => {
        resizeObserver.observe(viewport);
        resizeObserver.observe(list);
      });
    } else {
      window.addEventListener('resize', scheduleMeasurement, { passive: true });
    }
    if (document.fonts) document.fonts.ready.then(scheduleMeasurement);

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          container.classList.toggle('is-in-view', entry.isIntersecting);
        });
      });
      observer.observe(container);
    } else {
      container.classList.add('is-in-view');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSkillsMotion, { once: true });
  } else {
    initializeSkillsMotion();
  }
})();
