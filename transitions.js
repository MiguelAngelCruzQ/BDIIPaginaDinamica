const PageTransitions = {
  navigate(url) {
    if (!document.startViewTransition) {
      window.location.href = url;
      return;
    }

    document.startViewTransition(() => {
      window.location.href = url;
    });
  },

  navigateWithZoom(url, element) {
    if (!document.startViewTransition || !element) {
      window.location.href = url;
      return;
    }

    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    document.documentElement.style.setProperty('--zoom-x', `${x}px`);
    document.documentElement.style.setProperty('--zoom-y', `${y}px`);
    document.documentElement.style.setProperty('--zoom-size', `${Math.max(rect.width, rect.height)}px`);

    document.startViewTransition(() => {
      window.location.href = url;
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('page-ready');
});

window.navigateTo = (url) => PageTransitions.navigate(url);
window.navigateWithZoom = (url, element) => PageTransitions.navigateWithZoom(url, element);
