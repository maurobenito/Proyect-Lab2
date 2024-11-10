document.addEventListener('DOMContentLoaded', () => {
  // Slider automático
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  
  slides[0].classList.add('active');
  
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 5000);
  
  // Animaciones al scroll
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  };
  
  const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.1
  });
  
  document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
  });
}); 