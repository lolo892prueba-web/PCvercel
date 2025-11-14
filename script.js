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

// Referencia al formulario
const bookingForm = document.getElementById('booking-form');

// Event listener para el envío del formulario
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenir el envío por defecto

    // Recoger datos del formulario
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        location: document.getElementById('location').value,
        device: document.getElementById('device').value,
        issue: document.getElementById('issue').value,
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
    }
});