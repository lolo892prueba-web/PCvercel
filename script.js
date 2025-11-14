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

    // --- THEME SWITCHER LOGIC ---
    themeToggleButton.addEventListener('click', () => {
        const isLight = body.classList.toggle('light-theme');
        const newTheme = isLight ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme); // Guardar preferencia
        applyTheme(newTheme);
    });

    // Validar formulario
    if (!validateForm()) return;

    // Mostrar loading
    const submitButton = document.querySelector('.cta-button');
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
