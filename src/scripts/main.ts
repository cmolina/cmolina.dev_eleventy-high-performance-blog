export {};

if (location.search) {
  const a = document.createElement('a');
  a.href = location.href;
  a.search = '';
  history.replaceState(null, '', a.href);
}

function prefetch(e: Event): void {
  const target = e.target as HTMLElement;
  if (target.tagName !== 'A') return;
  const anchor = target as HTMLAnchorElement;
  if (anchor.origin !== location.origin) return;
  const removeFragment = (url: string) => url.split('#')[0];
  if (removeFragment(window.location.href) === removeFragment(anchor.href)) return;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = anchor.href;
  document.head.appendChild(link);
}
document.documentElement.addEventListener('mouseover', prefetch, { capture: true, passive: true });
document.documentElement.addEventListener('touchstart', prefetch, { capture: true, passive: true });

const progress = document.getElementById('reading-progress');
if (window.ResizeObserver && progress) {
  let timeOfLastScroll = 0;
  let requestedAniFrame = false;
  let winHeight = 1000;
  let bottom = 10000;

  function updateProgress(): void {
    requestedAniFrame = false;
    const percent = Math.min(
      (document.scrollingElement!.scrollTop / (bottom - winHeight)) * 100,
      100,
    );
    progress!.style.transform = `translate(-${100 - percent}vw, 0)`;
    if (Date.now() - timeOfLastScroll < 3000) {
      requestAnimationFrame(updateProgress);
      requestedAniFrame = true;
    }
  }

  function scroll(): void {
    if (!requestedAniFrame) {
      requestAnimationFrame(updateProgress);
      requestedAniFrame = true;
    }
    timeOfLastScroll = Date.now();
  }

  addEventListener('scroll', scroll);

  new ResizeObserver(() => {
    const marker = document.querySelector('#comments,footer');
    if (marker) {
      bottom = document.scrollingElement!.scrollTop + marker.getBoundingClientRect().top;
    }
    winHeight = window.innerHeight;
    scroll();
  }).observe(document.body);
}

document.body.addEventListener(
  'load',
  (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'IMG') return;
    (target as HTMLImageElement).style.backgroundImage = 'none';
  },
  true,
);

document.body.addEventListener(
  'load',
  (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'IFRAME') return;
    target.removeAttribute('hidden');
  },
  true,
);
