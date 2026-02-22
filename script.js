// ==========================================
//  PORTFOLIO — script.js  (Full Rewrite)
//  All features: preloader, cursor, particles,
//  spotlight, scroll-progress, theme toggle,
//  magnetic buttons, modal, timeline, nav dots,
//  typewriter, skill bars, stat counters, back-top
// ==========================================

/* ===== PRELOADER ===== */
(function initPreloader() {
  const el = document.getElementById("preloader");
  const bar = document.getElementById("pl-fill");
  const pct = document.getElementById("pl-pct");
  if (!el) return;
  let val = 0;
  const timer = setInterval(() => {
    val = Math.min(val + Math.floor(1 + Math.random() * 4), 100);
    if (bar) bar.style.width = val + "%";
    if (pct) pct.textContent = val + "%";
    if (val >= 100) clearInterval(timer);
  }, 40);
  window.addEventListener("load", () => {
    setTimeout(() => el.classList.add("hidden"), 2000);
  });
})();

/* ===== THEME TOGGLE ===== */
const htmlEl = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const themeIconEl = document.getElementById("theme-icon");

function applyTheme(t) {
  htmlEl.setAttribute("data-theme", t);
  localStorage.setItem("portfolio-theme", t);
  if (themeIconEl) {
    themeIconEl.className = t === "dark" ? "fas fa-moon" : "fas fa-sun";
  }
}
themeToggle?.addEventListener("click", () => {
  applyTheme(htmlEl.getAttribute("data-theme") === "dark" ? "light" : "dark");
});
// Apply saved or OS preference
const saved =
  localStorage.getItem("portfolio-theme") ||
  (window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark");
applyTheme(saved);

/* ===== CUSTOM CURSOR ===== */
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");
if (cursorDot && cursorRing) {
  let mx = -100,
    my = -100,
    rx = -100,
    ry = -100;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.left = mx + "px";
    cursorDot.style.top = my + "px";
  });
  (function animateRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    cursorRing.style.left = rx + "px";
    cursorRing.style.top = ry + "px";
    requestAnimationFrame(animateRing);
  })();
  const hoverTargets =
    "a,button,.btn,.social-icon,.project-card,.tech-card,.stat-card,.contact-card,.nav-dot,.tl-card";
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorDot.classList.add("expand");
      cursorRing.classList.add("expand");
    });
    el.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("expand");
      cursorRing.classList.remove("expand");
    });
  });
}

/* ===== SPOTLIGHT ===== */
const spotlight = document.getElementById("spotlight");
if (spotlight) {
  document.addEventListener("mousemove", (e) => {
    spotlight.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(124,58,237,0.07), transparent 70%)`;
  });
}

/* ===== PARTICLES ===== */
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W,
    H,
    particles = [],
    animFrame;
  const CFG = {
    count: 75,
    color: "124,58,237",
    accent: "6,182,212",
    minR: 0.8,
    maxR: 2.1,
    minSpeed: 0.08,
    maxSpeed: 0.26,
    connectDist: 135,
    connectOpacity: 0.16,
    mouse: { x: -1000, y: -1000, radius: 120 },
  };
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 5;
      this.r = CFG.minR + Math.random() * (CFG.maxR - CFG.minR);
      const spd = CFG.minSpeed + Math.random() * (CFG.maxSpeed - CFG.minSpeed);
      const ang = Math.random() * Math.PI * 2;
      this.vx = Math.cos(ang) * spd;
      this.vy = Math.sin(ang) * spd - 0.04;
      this.alpha = 0.3 + Math.random() * 0.5;
      this.isAccent = Math.random() > 0.78;
    }
    update() {
      const dx = this.x - CFG.mouse.x,
        dy = this.y - CFG.mouse.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < CFG.mouse.radius) {
        const f = (CFG.mouse.radius - d) / CFG.mouse.radius;
        this.vx += (dx / d) * f * 0.45;
        this.vy += (dy / d) * f * 0.45;
      }
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.isAccent ? CFG.accent : CFG.color},${this.alpha})`;
      ctx.fill();
    }
  }
  function init() {
    particles = Array.from({ length: CFG.count }, () => new Particle());
  }
  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x,
          dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CFG.connectDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CFG.color},${CFG.connectOpacity * (1 - d / CFG.connectDist)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }
  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connect();
    animFrame = requestAnimationFrame(animate);
  }
  window.addEventListener("mousemove", (e) => {
    CFG.mouse.x = e.clientX;
    CFG.mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    CFG.mouse.x = CFG.mouse.y = -1000;
  });
  window.addEventListener("resize", () => {
    resize();
    cancelAnimationFrame(animFrame);
    init();
    animate();
  });
  resize();
  init();
  animate();
})();

/* ===== SCROLL PROGRESS BAR ===== */
const scrollProgress = document.getElementById("scroll-progress");
const backTop = document.getElementById("back-top");

window.addEventListener(
  "scroll",
  () => {
    const s = window.scrollY;
    const h = document.body.scrollHeight - window.innerHeight;
    const pct = h > 0 ? Math.round((s / h) * 100) : 0;
    if (scrollProgress) {
      scrollProgress.style.width = pct + "%";
      scrollProgress.setAttribute("aria-valuenow", pct);
    }
    if (backTop) {
      s > 350
        ? backTop.classList.add("visible")
        : backTop.classList.remove("visible");
    }
  },
  { passive: true },
);

backTop?.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

/* ===== NAVBAR ===== */
const navbarEl = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
const navLinkEls = document.querySelectorAll(".nav-link");

hamburger?.addEventListener("click", () => {
  const expanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", String(!expanded));
  navMenu?.classList.toggle("active");
  hamburger.classList.toggle("active");
});
hamburger?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    hamburger.click();
  }
});
navLinkEls.forEach((link) =>
  link.addEventListener("click", () => {
    navMenu?.classList.remove("active");
    hamburger?.classList.remove("active");
    hamburger?.setAttribute("aria-expanded", "false");
  }),
);
document.addEventListener("click", (e) => {
  if (
    navMenu?.classList.contains("active") &&
    !navMenu.contains(e.target) &&
    !hamburger?.contains(e.target)
  ) {
    navMenu.classList.remove("active");
    hamburger?.classList.remove("active");
    hamburger?.setAttribute("aria-expanded", "false");
  }
});

// Navbar scroll style
window.addEventListener(
  "scroll",
  () => {
    window.scrollY > 60
      ? navbarEl?.classList.add("scrolled")
      : navbarEl?.classList.remove("scrolled");
  },
  { passive: true },
);

/* ===== ACTIVE NAV ON SCROLL ===== */
const sectionEls = document.querySelectorAll("section[id]");
function highlightNav() {
  const sy = window.pageYOffset;
  sectionEls.forEach((sec) => {
    const top = sec.offsetTop - 130;
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (!link) return;
    if (sy >= top && sy < top + sec.offsetHeight) {
      navLinkEls.forEach((l) => {
        l.classList.remove("active");
        l.removeAttribute("aria-current");
      });
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}
window.addEventListener("scroll", highlightNav, { passive: true });

/* ===== NAV DOTS ===== */
const navDots = document.querySelectorAll(".nav-dot");
navDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const target = document.getElementById(dot.dataset.target);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
function updateNavDots() {
  const sy = window.scrollY + window.innerHeight / 2;
  navDots.forEach((dot) => {
    const sec = document.getElementById(dot.dataset.target);
    if (!sec) return;
    const active = sy >= sec.offsetTop && sy < sec.offsetTop + sec.offsetHeight;
    dot.classList.toggle("active", active);
  });
}
window.addEventListener("scroll", updateNavDots, { passive: true });
updateNavDots();

/* ===== SCROLL REVEAL ===== */
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);
document
  .querySelectorAll("[data-reveal]")
  .forEach((el) => revealObs.observe(el));

/* ===== SKILL BARS ===== */
const skillBarObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll(".skill-bar").forEach((bar) => {
        setTimeout(() => {
          bar.style.width = bar.getAttribute("data-width") + "%";
        }, 200);
      });
      skillBarObs.unobserve(entry.target);
    });
  },
  { threshold: 0.25 },
);
const skillsSection = document.querySelector(".skills");
if (skillsSection) skillBarObs.observe(skillsSection);

/* ===== TYPEWRITER ===== */
const roleEl = document.getElementById("role-text");
if (roleEl) {
  const roles = [
    "Student & Developer",
    "AI Enthusiast",
    "Full Stack Builder",
    "Computer Vision Dev",
    "Tech Innovator",
    "Problem Solver",
  ];
  let ri = 0,
    ci = 0,
    deleting = false,
    speed = 100;
  function typeWriter() {
    const cur = roles[ri];
    if (deleting) {
      roleEl.textContent = cur.slice(0, ci - 1);
      ci--;
      speed = 45;
    } else {
      roleEl.textContent = cur.slice(0, ci + 1);
      ci++;
      speed = 100;
    }
    if (!deleting && ci === cur.length) {
      speed = 2200;
      deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
      speed = 400;
    }
    setTimeout(typeWriter, speed);
  }
  setTimeout(typeWriter, 1000);
}

/* ===== STAT COUNTERS ===== */
const statObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute("data-stat"), 10);
      const suffix = el.getAttribute("data-suffix") || "";
      if (!isFinite(target)) return;
      const dur = 1200,
        start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      statObs.unobserve(el);
    });
  },
  { threshold: 0.5 },
);
document.querySelectorAll("[data-stat]").forEach((el) => statObs.observe(el));

/* ===== TIMELINE REVEAL ===== */
const tlObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll(".tl-item").forEach((item, i) => {
        setTimeout(() => item.classList.add("visible"), i * 180);
      });
      tlObs.unobserve(entry.target);
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".timeline").forEach((el) => tlObs.observe(el));

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ===== MAGNETIC BUTTONS ===== */
document.querySelectorAll(".magnet").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2,
      cy = r.top + r.height / 2;
    const dx = e.clientX - cx,
      dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = 85;
    if (dist < radius) {
      const strength = (radius - dist) / radius;
      btn.style.transform = `translate(${dx * strength * 0.35}px, ${dy * strength * 0.35}px)`;
    }
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});

/* ===== 3D TILT ON PROJECT CARDS ===== */
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left,
      y = e.clientY - r.top;
    const cx = r.width / 2,
      cy = r.height / 2;
    const rotX = ((y - cy) / cy) * -4;
    const rotY = ((x - cx) / cx) * 4;
    card.style.transform = `translateY(-8px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.click();
    }
  });
});

/* ===== PROJECT MODAL ===== */
const PROJECTS = {
  erp: {
    title: "St. Xavier's ERP",
    icon: "fas fa-graduation-cap",
    banner: "banner-erp",
    desc: "A comprehensive college ERP system built with TypeScript, streamlining administrative tasks, student records, and academic processes. Features role-based access, grade management, and a real-time dashboard.",
    tags: ["TypeScript", "Web App", "Database", "ERP", "Node.js"],
    link: "https://github.com/kelvinkbk/stxavier-erp",
  },
  fences: {
    title: "OpenFences",
    icon: "fas fa-network-wired",
    banner: "banner-net",
    desc: "An open-source C# project focused on creating innovative solutions for network management and system organization. Built on .NET with a clean architecture pattern and extensive unit testing.",
    tags: ["C#", ".NET", "Open Source", "Networking"],
    link: "https://github.com/kelvinkbk/OpenFences",
  },
  anidox: {
    title: "Anidox",
    icon: "fas fa-globe",
    banner: "banner-web",
    desc: "A modern web application featuring dynamic HTML design and interactive UI elements with smooth CSS animations, a clean component system, and a fully responsive layout — all without frameworks.",
    tags: ["HTML5", "CSS3", "JavaScript", "Responsive"],
    link: "https://github.com/kelvinkbk/anidox",
  },
  project1: {
    title: "PROJECT-1",
    icon: "fas fa-flask",
    banner: "banner-py",
    desc: "A private Python-based experimental project exploring advanced algorithms and data structures with optimized problem-solving solutions.",
    tags: ["Python", "Algorithms", "Data Structures"],
    link: "https://github.com/kelvinkbk",
  },
};

const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");

window.openModal = function (key) {
  const p = PROJECTS[key];
  if (!p) return;
  document.getElementById("modal-title").textContent = p.title;
  document.getElementById("modal-desc").textContent = p.desc;
  document.getElementById("modal-icon").className = p.icon;
  document.getElementById("modal-banner").className =
    "modal-banner " + p.banner;
  document.getElementById("modal-link").href = p.link;
  document.getElementById("modal-tags").innerHTML = p.tags
    .map((t) => `<span class="modal-tag">${t}</span>`)
    .join("");
  modalOverlay?.classList.add("open");
  document.body.style.overflow = "hidden";
};
window.closeModal = function () {
  modalOverlay?.classList.remove("open");
  document.body.style.overflow = "";
};
modalClose?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* ===== FORM SUBMIT ===== */
const contactForm = document.querySelector(".contact-form-card form");
const submitBtn = document.getElementById("submit-btn");
contactForm?.addEventListener("submit", () => {
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    submitBtn.disabled = true;
  }
});

console.log(
  "%c✦ Portfolio loaded 🚀",
  "color:#7C3AED;font-size:14px;font-weight:800;",
);

/* ===== LENIS SMOOTH SCROLL ===== */
(function initLenis() {
  if (typeof Lenis === "undefined") return;
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1.0,
    touchMultiplier: 1.5,
  });

  // Integrate with GSAP ticker if available
  if (typeof gsap !== "undefined") {
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    function rafLoop(time) {
      lenis.raf(time);
      requestAnimationFrame(rafLoop);
    }
    requestAnimationFrame(rafLoop);
  }

  // Override smooth-scroll anchor clicks to use Lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    });
  });
})();

/* ===== GSAP SCROLL ANIMATIONS ===== */
(function initGSAP() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
    return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero — stagger entrance
  gsap.from(".hero-badge, .hero-title, .hero-description, .hero-cta", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out",
    delay: 0.3,
  });

  // Section headings — fade in from below
  gsap.utils.toArray(".section-title").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 88%" },
      opacity: 0,
      y: 24,
      duration: 0.7,
      ease: "power3.out",
    });
  });

  // Stat cards — stagger
  gsap.utils.toArray(".stat-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 90%" },
      opacity: 0,
      y: 20,
      scale: 0.97,
      duration: 0.5,
      delay: i * 0.08,
      ease: "back.out(1.5)",
    });
  });

  // Testimonial cards — stagger on scroll
  gsap.utils.toArray(".testi-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 92%" },
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: i * 0.1,
      ease: "power3.out",
    });
  });

  // Tech cards — stagger
  gsap.utils.toArray(".tech-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 92%" },
      opacity: 0,
      scale: 0.9,
      duration: 0.45,
      delay: i * 0.05,
      ease: "back.out(1.8)",
    });
  });
})();
