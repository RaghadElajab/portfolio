(() => {
  'use strict';

  function initializeSkillsMotion() {
    const container = document.getElementById('skills-marquees');
    const toggle = document.getElementById('skills-motion-toggle');
    if (!container || !toggle || container.classList.contains('is-enhanced')) return;

    const tracks = container.querySelectorAll('.skills-track');
    let enhancedTracks = 0;

    tracks.forEach((track) => {
      const list = track.querySelector('.skills-list');
      if (!list) return;

      // Only the original list belongs in the accessibility tree or tab order.
      const duplicate = list.cloneNode(true);
      duplicate.classList.add('skills-list-copy');
      duplicate.setAttribute('aria-hidden', 'true');
      duplicate.setAttribute('inert', '');
      duplicate.removeAttribute('id');
      duplicate.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
      track.appendChild(duplicate);
      enhancedTracks += 1;
    });

    if (!enhancedTracks) return;

    const label = toggle.querySelector('[data-motion-label]');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let userPaused = toggle.getAttribute('aria-pressed') === 'true';

    function updatePauseState() {
      container.classList.toggle('is-paused', userPaused);
      toggle.setAttribute('aria-pressed', String(userPaused));
      if (label) label.textContent = userPaused ? 'Resume motion' : 'Pause motion';
    }

    function updateMotionPreference() {
      // Preserve an explicit pause when the system preference changes.
      container.classList.toggle('is-reduced-motion', motionPreference.matches);
      toggle.hidden = motionPreference.matches;
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
