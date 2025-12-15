// ==========================================
// JL GRAPHIC - SCRIPT.JS
// ==========================================

// CREAR PARTÍCULAS DE FONDO
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 50; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  particle.style.animationDelay = Math.random() * 20 + 's';
  particle.style.animationDuration = (15 + Math.random() * 10) + 's';
  particlesContainer.appendChild(particle);
}

// MENÚ HAMBURGUESA
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// CERRAR MENÚ AL HACER CLIC EN ENLACE
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// HEADER EFECTO SCROLL
window.addEventListener('scroll', () => {
  const topbar = document.querySelector('.topbar');
  if (window.scrollY > 100) {
    topbar.classList.add('scrolled');
  } else {
    topbar.classList.remove('scrolled');
  }
});

// SCROLL SUAVE
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ENVIAR MENSAJE POR WHATSAPP
document.getElementById('send-whatsapp').addEventListener('click', () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const company = document.getElementById('company').value;
  const service = document.getElementById('service').value;
  const description = document.getElementById('description').value;

  // VALIDACIÓN
  if (!name || !email || !service || !description) {
    alert('Por favor completa todos los campos requeridos (*)');
    return;
  }

  // VALIDAR EMAIL
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Por favor ingresa un correo electrónico válido');
    return;
  }

  // CREAR MENSAJE PARA WHATSAPP
  const mensaje = `🎨 *NUEVA SOLICITUD DE PROYECTO*%0A%0A` +
                 `👤 *Nombre:* ${name}%0A` +
                 `📧 *Email:* ${email}%0A` +
                 `🏢 *Empresa:* ${company || 'N/A'}%0A` +
                 `🎯 *Servicio:* ${service}%0A%0A` +
                 `📝 *Descripción del proyecto:*%0A${description}`;

  // ABRIR WHATSAPP
  window.open(`https://wa.me/18494362242?text=${mensaje}`, '_blank');
});

// ANIMACIONES AL HACER SCROLL (OPCIONAL)
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// OBSERVAR ELEMENTOS PARA ANIMACIÓN
document.querySelectorAll('.servicio, .portfolio-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
