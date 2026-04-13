const PageTransitions = {
  navigate(url) {
    const target = document.querySelector('main');
    if (target) {
      target.style.opacity = '0';
      target.style.transition = 'opacity 0.3s ease';
    }
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  },

  navigateWithZoom(url, element) {
    window.location.href = url;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('page-ready');
});

window.navigateTo = (url) => PageTransitions.navigate(url);
window.navigateWithZoom = (url, element) => PageTransitions.navigateWithZoom(url, element);
