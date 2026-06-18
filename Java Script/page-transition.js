(function () {
  const transitionDuration = 450;

  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);

  function navigateWithAnimation(url) {
    overlay.classList.add('show');
    setTimeout(() => {
      window.location.href = url;
    }, transitionDuration);
  }

  document.querySelectorAll('footer nav a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    link.addEventListener('click', event => {
      const targetUrl = link.href;
      const currentUrl = window.location.href.split('#')[0];
      if (targetUrl === currentUrl) return;

      event.preventDefault();
      navigateWithAnimation(targetUrl);
    });
  });
})();
