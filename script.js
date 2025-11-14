// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registrado con éxito:', registration);
            })
            .catch((error) => {
                console.log('Error al registrar Service Worker:', error);
            });
    });
}

// --- THEME SWITCHER ---
const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggleButton.querySelector('i');

// Función para aplicar el tema
const applyTheme = (theme) => {
    if (theme === 'light') {
        body.classList.add('light-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        body.classList.remove('light-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
};

// Cargar tema guardado al iniciar
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

// --- THEME SWITCHER LOGIC ---
themeToggleButton.addEventListener('click', () => {
    const isLight = body.classList.toggle('light-theme');
    const newTheme = isLight ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme); // Guardar preferencia
    applyTheme(newTheme);
});

// --- HAMBURGER MENU ---
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Cierra el menú al hacer clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// --- DELIVERY CALCULATOR ---
const sectorSelect = document.getElementById('sector-select');
const deliveryResultEl = document.getElementById('delivery-result');

// 1. Coordenadas de tu local (Calle Tunti Cáceres esq. 16 de Agosto)
const localCoords = { lat: 19.3933, lon: -70.5269 };

// 2. Coordenadas de los sectores de Moca
const sectorCoords = {
    'centro': { lat: 19.3949, lon: -70.5267 },
    'viejopr': { lat: 19.3900, lon: -70.5280 },
    'isleta': { lat: 19.3985, lon: -70.5255 },
    'robles': { lat: 19.3981, lon: -70.5325 },
    'donbosco': { lat: 19.3888, lon: -70.5235 },
    'lopez': { lat: 19.4058, lon: -70.5204 },
    'espanola': { lat: 19.3833, lon: -70.5311 },
    'carolina': { lat: 19.3855, lon: -70.5377 },
    'corozo': { lat: 19.4155, lon: -70.5313 },
    'milagrosa': { lat: 19.3800, lon: -70.5200 },
    'guauci': { lat: 19.4333, lon: -70.5167 },
    'sanvictor': { lat: 19.4500, lon: -70.5833 },
    'colinas': { lat: 19.3750, lon: -70.5350 },
    'caimito': { lat: 19.4167, lon: -70.4833 },
    'estancia': { lat: 19.3667, lon: -70.5167 },
    'ermita': { lat: 19.3917, lon: -70.5000 },
    'juanlopito': { lat: 19.3500, lon: -70.5333 }
};

// 3. Función para calcular la distancia en KM (Fórmula de Haversine)
function getDistance(coords1, coords2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (coords2.lat - coords1.lat) * (Math.PI / 180);
    const dLon = (coords2.lon - coords1.lon) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(coords1.lat * (Math.PI / 180)) * Math.cos(coords2.lat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
}

// 4. Función para calcular el costo basado en la distancia
function calculateDeliveryCost(distance) {
    const baseFare = 100; // Tarifa base en RD$
    const pricePerKm = 25; // Precio por km en RD$
    if (distance < 1.5) return baseFare; // Si está muy cerca, se cobra la tarifa base
    const totalCost = baseFare + ((distance - 1.5) * pricePerKm); // Se cobra extra por KM adicional a la base
    return Math.ceil(totalCost / 10) * 10; // Redondear al múltiplo de 10 más cercano
}

// Evento que se dispara cuando el usuario cambia la selección del sector
sectorSelect.addEventListener('change', (event) => {
    const selectedSectorId = event.target.value;
    if (selectedSectorId && sectorCoords[selectedSectorId]) {
        const destinationCoords = sectorCoords[selectedSectorId];
        const distance = getDistance(localCoords, destinationCoords);
        const cost = calculateDeliveryCost(distance);
        deliveryResultEl.innerHTML = `Distancia: ${distance.toFixed(1)} km. Costo de envío: <strong>RD$ ${cost}</strong>`;
    } else {
        deliveryResultEl.innerHTML = ''; // Limpia el resultado si no se selecciona nada
    }
});

// Configuración de Firebase (reemplaza con tus credenciales reales desde Firebase Console)
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO_ID",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);

// Inicializar Firestore
const db = firebase.firestore();

// Función de validación
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const location = document.getElementById('location').value.trim();
    const device = document.getElementById('device').value;
    const issue = document.getElementById('issue').value.trim();

    if (!name) {
        alert('Por favor, ingresa tu nombre completo.');
        return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return false;
    }
    if (!location) {
        alert('Por favor, ingresa tu ubicación.');
        return false;
    }
    if (!device) {
        alert('Por favor, selecciona un tipo de dispositivo.');
        return false;
    }
    if (!issue) {
        alert('Por favor, describe el problema.');
        return false;
    }
    return true;
}

// Referencia al formulario
const bookingForm = document.getElementById('booking-form');

// Event listener para el envío del formulario
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenir el envío por defecto

    // Validar formulario
    if (!validateForm()) return;

    // Mostrar loading
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<div class="spinner"></div>Enviando...';
    submitButton.disabled = true;

    // Recoger datos del formulario
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        location: document.getElementById('location').value.trim(),
        device: document.getElementById('device').value,
        issue: document.getElementById('issue').value.trim(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp() // Agregar timestamp
    };

    try {
        // Agregar documento a la colección 'citas' en Firestore
        await db.collection('citas').add(formData);
        alert('¡Solicitud enviada exitosamente! Nos pondremos en contacto pronto.');
        bookingForm.reset(); // Limpiar el formulario
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Hubo un error al enviar la solicitud. Inténtalo de nuevo.');
    } finally {
        // Restaurar botón
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
});
