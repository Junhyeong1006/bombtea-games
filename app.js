(() => {
  'use strict';
  const translations = {
    skip: 'Skip to content', menu: 'Open menu',
    'nav.games': 'Games', 'nav.studio': 'Studio', 'nav.contact': 'Contact',
    'hero.heading': 'One more round with friends.',
    'hero.description': 'We’re six friends making games to play together.<br>Meet our first game, SYNCHRONIZED PANIC!',
    'hero.cta': 'Explore the game',
    'games.note': 'IN DEVELOPMENT', 'games.heading': 'What we’re working on',
    'games.subheading': 'SYNCHRONIZED PANIC!',
    'game.status': 'In development', 'game.genre': 'Online party tag game',
    'game.platform': 'Coming to Steam',
    'game.pitch': 'An online multiplayer party game where the Tagger controls your moves<br>and your friends pass you a ticking bomb.',
    'game.more': 'About the game', 'game.back': '← All games',
    'game.artNote': 'Game artwork · In development. Final game may differ.',
    'studio.heading': 'Six friends.<br>One small studio.',
    'studio.description': 'We met at Kookmin University and decided to make a game together. BOMBTEA games brings together three software students and three design students.',
    'studio.description2': 'Sometimes the round you remember isn’t the one you won. It’s the one where someone made a ridiculous mistake and everyone burst out laughing. That’s the kind of game we want to make — one that has your friends asking for another round.',
    'studio.description3': 'We’re currently developing SYNCHRONIZED PANIC!, an online party game where clay-like characters chase each other around.',
    'contact.heading': 'Get in touch.',
    'contact.description': 'Have a question about the game or an idea for working together? Email us here for collaborations, publishing, and press inquiries.',
    'contact.press': 'Studio & game press kit', backTop: 'Back to top ↑',
    'detail.heading': 'Why is my character<br>following your moves?',
    'detail.description': 'One Tagger chases a group of Runners in this online party game. The Tagger can take over their movement, while the Runners pass a ticking bomb between them. The friend you need to keep alive might also be the one you need to hand the bomb to.',
    'facts.developer': 'Developer', 'facts.genre': 'Genre', 'facts.play': 'Play mode',
    'facts.multiplayer': 'Online multiplayer', 'facts.status': 'Status', 'facts.platform': 'Platform',
    'facts.release': 'Release date', 'facts.tba': 'To be announced',
    'mechanics.heading': 'A few twists on a game of tag.',
    'mechanics.sync.title': 'Move in sync',
    'mechanics.sync.description': 'The Tagger’s ability makes Runners copy their movement and jumps. The Tagger tries to steer them into danger; the Runners have to adjust and find a way out.',
    'mechanics.bomb.title': 'Pass the bomb',
    'mechanics.bomb.description': 'Pass the bomb to another Runner. Each pass increases the blast radius, but the timer never resets. You might end up handing it to the friend who just saved you.',
    'mechanics.ghost.title': 'Play on as a Ghost',
    'mechanics.ghost.description': 'Eliminated players become Ghosts. Push the Tagger and Runners with gusts of wind and stay involved until the round ends.',
    'mechanics.win': 'The Tagger wins by eliminating every Runner before time runs out. If even one Runner survives, all Runners win together.',
    'gallery.note': 'SYNCHRONIZED PANIC! ARTWORK', 'gallery.heading': 'Meet the characters',
    'gallery.hint': 'Select an image to take a closer look.',
    'gallery.lobby': 'Friends in the lobby', 'gallery.chase': 'The chase is on',
    'gallery.victory': 'The Runners win',
    'gallery.disclaimer': 'Artwork used in the game’s transition screens. These are illustrations, not gameplay screenshots.',
    'outro.heading': 'Coming to Steam.',
    'outro.description': 'We haven’t set a release date yet. We’ll post updates here as development continues.',
    'outro.contact': 'Ask us about the game'
  };
  const englishLabels = {
    navigation: 'Main navigation', mobileNav: 'Mobile navigation', menu: 'Menu',
    home: 'BOMBTEA games home', scroll: 'Go to our games', 'game.details': 'Explore SYNCHRONIZED PANIC!',
    'gallery.close': 'Close image', 'gallery.prev': 'Previous image', 'gallery.next': 'Next image'
  };
  const englishAlts = {
    'studio.scene': 'The seaside island of SYNCHRONIZED PANIC!, with blue domes',
    'game.keyart': 'The stone characters of SYNCHRONIZED PANIC! gathered by the sea and blue domes',
    'game.chase': 'Stone Runners fleeing a red Tagger carrying a bat',
    'gallery.lobby': 'Stone characters gathered before the chaos — enlarge image',
    'gallery.chase': 'Stone Runners being chased by the Tagger — enlarge image',
    'gallery.victory': 'Runners celebrating with the Tagger tied to a column — enlarge image'
  };
  // 한국어 원문은 HTML에 유지하므로 JavaScript가 없어도 본문을 읽을 수 있습니다.
  const textNodes = [...document.querySelectorAll('[data-i18n]')].map(el => ({ el, ko: el.innerHTML }));
  const labelNodes = [...document.querySelectorAll('[data-label]')].map(el => ({ el, ko: el.getAttribute('aria-label') }));
  const altNodes = [...document.querySelectorAll('[data-alt]')].map(el => ({ el, ko: el.alt }));
  const baseTitle = document.title;
  const metaNodes = [...document.querySelectorAll('meta[name="description"],meta[property="og:description"],meta[property="og:title"]')].map(el => ({ el, ko: el.content }));
  const pageIsGame = document.body.dataset.page === 'game';
  const localLinks = [...document.querySelectorAll('a[href]')].filter(el => {
    const href = el.getAttribute('href');
    return !href.startsWith('#') && !el.hasAttribute('download') && !el.hasAttribute('data-gallery') && !/^(https?:|mailto:)/i.test(href);
  }).map(el => ({ el, original: el.getAttribute('href') }));
  let language = 'ko';
  let galleryIndex = 0;
  const text = key => {
    if (language === 'en') return translations[key] || key;
    return textNodes.find(node => node.el.dataset.i18n === key)?.ko || key;
  };
  function renderText(el, value) {
    // 번역의 줄바꿈만 허용합니다. 콘텐츠는 HTML로 실행되지 않습니다.
    const lines = value.split(/<br\s*\/?>/i);
    el.replaceChildren();
    lines.forEach((line, index) => { if (index) el.append(document.createElement('br')); el.append(document.createTextNode(line)); });
  }
  function setLanguage(nextLanguage, persist = false) {
    language = nextLanguage === 'en' ? 'en' : 'ko';
    document.documentElement.lang = language;
    textNodes.forEach(({ el, ko }) => renderText(el, language === 'en' ? (translations[el.dataset.i18n] || ko) : ko));
    labelNodes.forEach(({ el, ko }) => el.setAttribute('aria-label', language === 'en' ? (englishLabels[el.dataset.label] || ko) : ko));
    altNodes.forEach(({ el, ko }) => { el.alt = language === 'en' ? (englishAlts[el.dataset.alt] || ko) : ko; });
    document.querySelectorAll('[data-lang]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.lang === language)));
    const englishTitle = pageIsGame ? 'SYNCHRONIZED PANIC! — BOMBTEA games' : 'BOMBTEA games — Brewed to play.';
    const englishDescription = pageIsGame ? 'An online multiplayer party tag game with synchronized movement, bomb passing, and mischievous ghosts. Coming to Steam from BOMBTEA games.' : 'Six friends. One indie game studio. Meet BOMBTEA games and our upcoming online party game, SYNCHRONIZED PANIC!';
    document.title = language === 'en' ? englishTitle : baseTitle;
    metaNodes.forEach(({ el, ko }) => { el.content = language === 'en' ? (el.getAttribute('property') === 'og:title' ? englishTitle : englishDescription) : ko; });
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', language === 'en' ? 'en_US' : 'ko_KR');
    localLinks.forEach(({ el, original }) => {
      const target = new URL(original, location.href);
      target.searchParams.set('lang', language);
      el.href = target.href;
    });
    if (persist) {
      try { localStorage.setItem('bombtea-language', language); } catch { /* Privacy modes can disable storage. */ }
      try { const url = new URL(location.href); url.searchParams.set('lang', language); history.replaceState(null, '', url); } catch { /* file:// can restrict history. */ }
    }
    document.querySelectorAll('[data-external-kind]').forEach(el => { el.textContent = el.dataset.externalKind === 'steam' ? (language === 'en' ? 'View on Steam ↗' : 'Steam에서 보기 ↗') : (language === 'en' ? 'Watch trailer ↗' : '트레일러 보기 ↗'); });
    if (dialog?.open) updateGallery();
  }
  function validHttps(value) {
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; } catch { return null; }
  }
  const config = window.BOMBTEA_CONFIG || {};
  const contact = document.querySelector('#contact-links');
  if (contact && /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(config.email || '')) {
    const email = document.createElement('a'); email.className = 'contact-email'; email.href = `mailto:${config.email}`; email.textContent = `${config.email} ↗`;
    contact.replaceChildren(email);
  }
  const socials = Array.isArray(config.socials) ? config.socials : [];
  if (contact && socials.length) {
    const list = document.createElement('div'); list.className = 'social-links';
    socials.forEach(social => { const url = validHttps(social.url); if (!url || !social.label) return; const link = document.createElement('a'); link.href = url; link.textContent = `${social.label} ↗`; link.target = '_blank'; link.rel = 'noopener noreferrer'; list.append(link); });
    if (list.childElementCount) contact.append(list);
  }
  const external = document.querySelector('#game-external-links');
  if (external) ['steam', 'trailer'].forEach(kind => {
    const url = validHttps(config.game?.[`${kind}Url`]); if (!url) return;
    const link = document.createElement('a'); link.href = url; link.className = 'button button-dark'; link.dataset.externalKind = kind; link.target = '_blank'; link.rel = 'noopener noreferrer'; external.append(link);
  });
  const menu = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('#mobile-nav');
  const closeMenu = () => { if (!menu || !mobileNav) return; menu.setAttribute('aria-expanded', 'false'); mobileNav.hidden = true; };
  menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); mobileNav.hidden = !open; });
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  document.addEventListener('click', event => { if (menu?.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header')) closeMenu(); });
  const galleryLinks = [...document.querySelectorAll('[data-gallery]')];
  const dialog = document.querySelector('.lightbox');
  function updateGallery() {
    const link = galleryLinks[galleryIndex];
    const image = dialog.querySelector('.lightbox-image');
    image.src = link.href; image.alt = text(link.dataset.caption);
    document.querySelector('#lightbox-caption').textContent = text(link.dataset.caption);
    document.querySelector('#lightbox-count').textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(galleryLinks.length).padStart(2, '0')}`;
  }
  function moveGallery(step) { galleryIndex = (galleryIndex + step + galleryLinks.length) % galleryLinks.length; updateGallery(); }
  if (dialog && typeof dialog.showModal === 'function') {
    galleryLinks.forEach((link, index) => link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); galleryIndex = index; updateGallery(); dialog.showModal(); document.body.classList.add('is-lightbox-open');
    }));
    dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.lightbox-prev').addEventListener('click', () => moveGallery(-1));
    dialog.querySelector('.lightbox-next').addEventListener('click', () => moveGallery(1));
    dialog.addEventListener('close', () => { document.body.classList.remove('is-lightbox-open'); galleryLinks[galleryIndex]?.focus({ preventScroll: true }); });
    dialog.addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); moveGallery(event.key === 'ArrowLeft' ? -1 : 1); } });
    dialog.addEventListener('click', event => { if (event.target !== dialog) return; const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); });
    let touchX = null;
    dialog.addEventListener('touchstart', event => { touchX = event.touches.length === 1 ? event.touches[0].clientX : null; }, { passive: true });
    dialog.addEventListener('touchend', event => { if (touchX === null) return; const delta = event.changedTouches[0].clientX - touchX; if (Math.abs(delta) > 65) moveGallery(delta < 0 ? 1 : -1); touchX = null; }, { passive: true });
  }
  let savedLanguage;
  try { savedLanguage = localStorage.getItem('bombtea-language'); } catch { /* Use Korean by default. */ }
  const requestedLanguage = new URL(location.href).searchParams.get('lang');
  setLanguage(['en', 'ko'].includes(requestedLanguage) ? requestedLanguage : savedLanguage);
  document.querySelectorAll('[data-lang]').forEach(el => el.addEventListener('click', () => setLanguage(el.dataset.lang, true)));
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
