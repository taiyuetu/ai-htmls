const slides = Array.from(document.querySelectorAll("[data-slide]"));
const currentLabel = document.querySelector("[data-hero-current]");
const totalLabel = document.querySelector("[data-hero-total]");
const prevButton = document.querySelector("[data-hero-prev]");
const nextButton = document.querySelector("[data-hero-next]");
const revealItems = document.querySelectorAll(".reveal");
const heroMedia = document.querySelector("[data-hero-media]");

let activeSlide = 0;
let slideTimer;

function formatIndex(index) {
  return String(index + 1).padStart(2, "0");
}

function setSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("hero-visual--active", slideIndex === activeSlide);
  });

  if (currentLabel) currentLabel.textContent = formatIndex(activeSlide);
  if (totalLabel) totalLabel.textContent = formatIndex(slides.length - 1);
}

function nextSlide() {
  setSlide(activeSlide + 1);
}

function previousSlide() {
  setSlide(activeSlide - 1);
}

function restartTimer() {
  clearInterval(slideTimer);
  slideTimer = window.setInterval(nextSlide, 6500);
}

prevButton?.addEventListener("click", () => {
  previousSlide();
  restartTimer();
});

nextButton?.addEventListener("click", () => {
  nextSlide();
  restartTimer();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => observer.observe(item));

if (heroMedia) {
  heroMedia.addEventListener("mousemove", (event) => {
    const rect = heroMedia.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
    heroMedia.style.setProperty("--tilt-x", `${x}px`);
    heroMedia.style.setProperty("--tilt-y", `${y}px`);
    heroMedia.style.transform = `translateY(0) perspective(1200px) rotateX(${-y / 6}deg) rotateY(${x / 6}deg)`;
  });

  heroMedia.addEventListener("mouseleave", () => {
    heroMedia.style.transform = "";
    heroMedia.style.removeProperty("--tilt-x");
    heroMedia.style.removeProperty("--tilt-y");
  });
}

setSlide(0);
restartTimer();
