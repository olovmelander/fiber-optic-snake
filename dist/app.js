const dialog = document.querySelector('#artwork-dialog');
const links = [...document.querySelectorAll('[data-artwork]')];
const image = dialog.querySelector('.dialog-image');
const title = dialog.querySelector('.dialog-title');
const caption = dialog.querySelector('.dialog-caption');
const counter = dialog.querySelector('.dialog-counter');
const stage = dialog.querySelector('.dialog-stage');
const status = dialog.querySelector('.dialog-status');
const retry = dialog.querySelector('[data-retry]');
let current = 0;
let opener = null;

function loadArtwork(url) {
  stage.setAttribute('aria-busy', 'true');
  status.hidden = false;
  status.querySelector('p').textContent = 'Bilden laddas…';
  retry.hidden = true;
  image.style.visibility = 'hidden';
  image.src = url;
}
image.addEventListener('load', () => {
  stage.setAttribute('aria-busy', 'false');
  image.style.visibility = 'visible';
  status.hidden = true;
});
image.addEventListener('error', () => {
  stage.setAttribute('aria-busy', 'false');
  status.querySelector('p').textContent = 'Bilden kunde inte laddas.';
  status.hidden = false;
  retry.hidden = false;
});
retry.addEventListener('click', () => loadArtwork(links[current].href));

function showArtwork(index) {
  current = (index + links.length) % links.length;
  const link = links[current];
  const figure = link.closest('figure');
  loadArtwork(link.href);
  image.alt = link.querySelector('img').alt;
  title.textContent = figure.querySelector('h3').textContent;
  caption.textContent = figure.querySelector('.caption p').textContent;
  counter.textContent = `${String(current + 1).padStart(2, '0')} / ${links.length}`;
}

links.forEach((link, index) => {
  link.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    opener = link;
    showArtwork(index);
    dialog.showModal();
    document.documentElement.classList.add('dialog-open');
    dialog.querySelector('[data-close]').focus();
  });
});
dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
dialog.querySelector('[data-previous]').addEventListener('click', () => showArtwork(current - 1));
dialog.querySelector('[data-next]').addEventListener('click', () => showArtwork(current + 1));
dialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showArtwork(current + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
dialog.addEventListener('close', () => {
  document.documentElement.classList.remove('dialog-open');
  opener?.focus({ preventScroll: true });
});
