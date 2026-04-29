const services = [
  {
    title: 'Web Design',
    description: 'Premium digital identities built to make a category leader feel inevitable.',
    outcomes: ['Executive credibility', 'Clear hierarchy', 'Cohesive brand story']
  },
  {
    title: 'UI/UX Strategy',
    description: 'Information architecture and user journeys aligned to buyer intent.',
    outcomes: ['Shorter decision paths', 'Sharper scanning', 'Higher engagement']
  },
  {
    title: 'Conversion Optimization',
    description: 'Layout, messaging, and friction removal designed to improve qualified action.',
    outcomes: ['Stronger CTA flow', 'Better lead quality', 'More demo requests']
  },
  {
    title: 'Branding',
    description: 'Visual systems that feel premium without drifting into ornament.',
    outcomes: ['Distinct positioning', 'Executive polish', 'Reusable design system']
  },
  {
    title: 'Development',
    description: 'Clean, fast, production-ready build quality with motion where it matters.',
    outcomes: ['Responsive performance', 'Accessible code', 'Scalable structure']
  }
];

const projects = Array.from({ length: 36 }, (_, index) => {
  const industries = ['SaaS', 'Industrial', 'Fintech', 'Healthcare', 'Logistics', 'Energy', 'Manufacturing', 'Cybersecurity', 'Consulting'];
  const verbs = ['Reframed', 'Scaled', 'Launched', 'Elevated', 'Rebuilt', 'Accelerated'];
  const nouns = ['Platform', 'Experience', 'Portal', 'Presence', 'System', 'Journey'];
  const impact = [
    'Repositioned the offer for enterprise buyers.',
    'Reduced friction across the primary conversion path.',
    'Turned dense information into a premium narrative.',
    'Aligned sales, marketing, and product messaging.',
    'Created a scalable system for future launches.'
  ];

  return {
    title: `${verbs[index % verbs.length]} ${nouns[index % nouns.length]} ${String(index + 1).padStart(2, '0')}`,
    industry: industries[index % industries.length],
    impact: impact[index % impact.length],
    accent: (index * 27 + 190) % 360,
    span: index % 11 === 0 ? 'work-card--wide' : index % 7 === 0 ? 'work-card--tall' : ''
  };
});

const processSteps = [
  ['Discovery', 'We define the business case, audience priorities, and technical boundaries.'],
  ['Strategy', 'We shape the narrative, site architecture, and conversion map before layout begins.'],
  ['Design', 'We build the visual system, motion language, and premium media treatments.'],
  ['Development', 'We implement responsive code, performance discipline, and accessible interactions.'],
  ['Launch', 'We fine-tune the finish, validate the experience, and hand over a scalable system.']
];

const advantages = [
  ['Conversion-driven design', 'Messaging and UI choices are made to support action, not decoration.'],
  ['Enterprise-level execution', 'We deliver the clarity and polish expected by senior buyers.'],
  ['Fast turnaround', 'Small, focused teams keep the process efficient without compromising quality.'],
  ['Scalable systems', 'The design language is built to extend across future pages and campaigns.']
];

const testimonials = [
  {
    quote: 'The site finally matches the value of the product. It looks premium, but more importantly, the leads got better.',
    name: 'M. Chen',
    company: 'VP Marketing, Helix Systems',
    avatarA: '#73a8ff',
    avatarB: '#a855f7'
  },
  {
    quote: 'They translated a complex proposition into a clean, high-trust experience that our sales team can actually use.',
    name: 'A. Patel',
    company: 'Founder, Northline Automation',
    avatarA: '#5df2c1',
    avatarB: '#73a8ff'
  },
  {
    quote: 'The motion is restrained, the system is sharp, and the overall finish feels like an agency twice the size.',
    name: 'S. Laurent',
    company: 'CMO, Meridian Cloud',
    avatarA: '#a855f7',
    avatarB: '#73a8ff'
  }
];

const servicesGrid = document.getElementById('servicesGrid');
const workGrid = document.getElementById('workGrid');
const processGrid = document.getElementById('processGrid');
const advantagesGrid = document.getElementById('advantagesGrid');
const testimonialTrack = document.getElementById('testimonialTrack');
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const navLinks = [...document.querySelectorAll('.topnav a')];
const parallaxElements = [...document.querySelectorAll('[data-parallax]')];

function renderServices() {
  servicesGrid.innerHTML = services
    .map(
      (service, index) => `
        <article class="service-card reveal" data-delay="${index * 70}">
          <div>
            <div class="service-card__media" aria-hidden="true"></div>
            <p class="eyebrow">${String(index + 1).padStart(2, '0')}</p>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
          </div>
          <div>
            <ul>
              ${service.outcomes.map((item) => `<li>${item}</li>`).join('')}
            </ul>
            <a href="#contact">Discuss this service</a>
          </div>
        </article>
      `
    )
    .join('');
}

function renderWork() {
  workGrid.innerHTML = projects
    .map(
      (project, index) => `
        <article class="work-card reveal ${project.span}" style="--card-accent: hsl(${project.accent} 82% 62%);" data-delay="${index * 25}">
          <div class="work-card__media" aria-hidden="true"></div>
          <div class="work-card__meta">
            <span>${project.industry}</span>
            <span>Case ${String(index + 1).padStart(2, '0')}</span>
          </div>
          <div>
            <h3>${project.title}</h3>
            <p>${project.impact}</p>
            <span class="work-card__link">View concept</span>
          </div>
        </article>
      `
    )
    .join('');
}

function renderProcess() {
  processGrid.innerHTML = processSteps
    .map(
      ([title, copy], index) => `
        <article class="process-card reveal" data-delay="${index * 90}">
          <div class="process-card__media" aria-hidden="true"></div>
          <p class="eyebrow">Step ${index + 1}</p>
          <h3>${title}</h3>
          <p>${copy}</p>
        </article>
      `
    )
    .join('');
}

function renderAdvantages() {
  advantagesGrid.innerHTML = advantages
    .map(
      ([title, copy], index) => `
        <article class="proof-item reveal" data-delay="${index * 60}">
          <div class="proof-item__icon" aria-hidden="true"></div>
          <h3>${title}</h3>
          <p>${copy}</p>
        </article>
      `
    )
    .join('');
}

function renderTestimonials() {
  testimonialTrack.innerHTML = testimonials
    .map(
      (item, index) => `
        <article class="testimonial-card ${index === 0 ? 'is-active' : ''}" data-index="${index}">
          <p class="testimonial-card__quote">"${item.quote}"</p>
          <div class="testimonial-card__author">
            <span class="avatar" aria-hidden="true" style="--avatar-a:${item.avatarA};--avatar-b:${item.avatarB};"></span>
            <span>
              <strong>${item.name}</strong><br />
              ${item.company}
            </span>
          </div>
        </article>
      `
    )
    .join('');
}

function setupRevealObserver() {
  const revealElements = [...document.querySelectorAll('.reveal')];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = Number(entry.target.dataset.delay || 0);
          window.setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));
}

function setupSectionObserver() {
  const sections = [...document.querySelectorAll('main section[id]')];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupParallax() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    return;
  }

  let ticking = false;

  const update = () => {
    ticking = false;
    const viewportHeight = window.innerHeight || 1;

    parallaxElements.forEach((el) => {
      const speed = Number(el.dataset.parallax || 0);
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = (center - viewportHeight / 2) / viewportHeight;
      const translate = distance * -48 * speed;
      el.style.transform = `translate3d(0, ${translate}px, 0)`;
    });
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

function setupTestimonials() {
  const cards = [...document.querySelectorAll('.testimonial-card')];
  const controls = [...document.querySelectorAll('[data-carousel]')];
  let current = 0;
  let timer = window.setInterval(() => rotate(1), 7000);

  function show(index) {
    current = (index + cards.length) % cards.length;
    cards.forEach((card, cardIndex) => {
      card.classList.toggle('is-active', cardIndex === current);
    });
  }

  function rotate(step) {
    show(current + step);
  }

  controls.forEach((button) => {
    button.addEventListener('click', () => {
      window.clearInterval(timer);
      rotate(button.dataset.carousel === 'next' ? 1 : -1);
      timer = window.setInterval(() => rotate(1), 7000);
    });
  });
}

function setupContactForm() {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus.textContent = 'Inquiry received. We will respond within one business day.';
    form.reset();
  });
}

renderServices();
renderWork();
renderProcess();
renderAdvantages();
renderTestimonials();
setupRevealObserver();
setupSectionObserver();
setupParallax();
setupTestimonials();
setupContactForm();
