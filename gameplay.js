(() => {
  'use strict';
  const slider = document.querySelector('.gameplay-slider');
  if (!slider) return;
  const slides = [...slider.querySelectorAll('.gameplay-slide')];
  const videos = slides.map(slide => slide.querySelector('video'));
  const selectors = [...slider.querySelectorAll('[data-clip]')];
  const viewport = slider.querySelector('.gameplay-viewport');
  const announcement = slider.querySelector('#clip-announcement');
  let active = 0;
  let inView = false;
  let requestId = 0;

  function updatePlayback() {
    const currentRequest = ++requestId;
    videos.forEach((video, index) => {
      if (index !== active || !inView || document.hidden) {
        video.autoplay = false;
        video.pause();
      }
    });
    if (!inView || document.hidden) return;
    const video = videos[active];
    const screen = video.parentElement;
    video.muted = true;
    video.defaultMuted = true;
    video.autoplay = true;
    if (!video.hasAttribute('src')) {
      screen.dataset.playback = 'loading';
      video.src = video.dataset.videoSrc;
      video.load();
    }
    const attempt = video.play();
    if (attempt) attempt.catch(error => {
      // Fast slide changes interrupt an older play request without being a failure.
      if (currentRequest !== requestId || error.name === 'AbortError') return;
      screen.dataset.playback = 'error';
    });
  }

  function announceSlide() {
    const caption = slides[active].querySelector('figcaption p').textContent;
    announcement.textContent = `${active + 1} / ${slides.length} — ${caption}`;
  }

  function showSlide(index) {
    const next = (index + slides.length) % slides.length;
    if (next !== active) {
      videos[active].pause();
      active = next;
      slides.forEach((slide, i) => { slide.hidden = i !== active; });
      selectors.forEach((button, i) => button.setAttribute('aria-pressed', String(i === active)));
      // Each selection starts its short loop at the beginning.
      videos[active].currentTime = 0;
      announceSlide();
    }
    updatePlayback();
  }

  videos.forEach(video => {
    video.controls = false;
    video.muted = true;
    video.defaultMuted = true;
    video.addEventListener('playing', () => {
      if (video !== videos[active] || !inView || document.hidden) { video.pause(); return; }
      video.parentElement.dataset.playback = 'playing';
    });
    video.addEventListener('waiting', () => { video.parentElement.dataset.playback = 'loading'; });
    video.addEventListener('error', () => { video.parentElement.dataset.playback = 'error'; });
  });
  slider.querySelector('.clip-prev').addEventListener('click', () => showSlide(active - 1));
  slider.querySelector('.clip-next').addEventListener('click', () => showSlide(active + 1));
  selectors.forEach((button, index) => button.addEventListener('click', () => showSlide(index)));
  slider.addEventListener('keydown', event => {
    const key = event.key;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;
    event.preventDefault();
    showSlide(key === 'Home' ? 0 : key === 'End' ? slides.length - 1 : active + (key === 'ArrowRight' ? 1 : -1));
    if (event.target.matches('[data-clip]')) selectors[active].focus({ preventScroll: true });
  });

  // The frame handles swipes; the video itself never receives player gestures.
  let gesture = null;
  viewport.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener('pointerup', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    gesture = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) showSlide(active + (dx < 0 ? 1 : -1));
  });
  viewport.addEventListener('pointercancel', () => { gesture = null; });
  viewport.addEventListener('contextmenu', event => event.preventDefault());
  viewport.addEventListener('dragstart', event => event.preventDefault());

  // Fetch only the selected clip, near the viewport, rather than all seven files.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      updatePlayback();
    }, { rootMargin: '100px 0px', threshold: 0 }).observe(viewport);
  } else {
    inView = true;
    updatePlayback();
  }
  document.addEventListener('visibilitychange', updatePlayback);
  new MutationObserver(() => { if (announcement.textContent) announceSlide(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  window.addEventListener('pagehide', () => { ++requestId; videos.forEach(video => { video.autoplay = false; video.pause(); }); });
  window.addEventListener('pageshow', updatePlayback);
})();
