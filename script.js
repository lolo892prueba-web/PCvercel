document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://192.168.1.10:3000/api'; // IMPORTANTE: Reemplaza 192.168.1.10 con la IP de tu computadora
    const HERCOM_COORDS = { lat: 19.3958, lon: -70.5278 }; // Coordenadas de tu negocio (9FVC+8RP, Tunti Caceres).

    // --- Manejo del Menú Hamburguesa ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // --- Cambio de Tema (Dark/Light Mode) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        // Simplemente alternamos la clase 'light-mode' en el body
        body.classList.toggle('light-mode');
        
        const isLight = body.classList.contains('light-mode');
        if (isLight) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        } else { // Es modo oscuro
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Cargar tema guardado al iniciar la página
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        // Por defecto es oscuro, solo ajustamos el ícono
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // --- Lógica del Formulario de Citas (WhatsApp y Email) ---
    const sendWhatsappBtn = document.getElementById('send-whatsapp');
    const sendEmailBtn = document.getElementById('send-email');
    const formError = document.getElementById('form-error');

    const getFormData = () => {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const location = document.getElementById('location').value.trim();
        const device = document.getElementById('device').value;
        const issue = document.getElementById('issue').value.trim();

        if (!name || !email || !location || !device || !issue) {
            formError.style.display = 'block';
            return null;
        }
        formError.style.display = 'none';
        return { name, email, location, device, issue };
    };

    if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener('click', () => {
            const data = getFormData();
            if (data) {
                const deliveryResult = document.getElementById('delivery-result').innerHTML;
                const whatsappNumber = '18494362242'; // Tu número de WhatsApp sin '+' o '()'
                let message = `
¡Hola HERCOM! Quisiera agendar una cita.

*Nombre:* ${data.name}
*Email:* ${data.email}
*Ubicación:* ${data.location}
*Dispositivo:* ${data.device}
*Problema:* ${data.issue}`;

                // Añadir costo de delivery al mensaje si se ha calculado
                if (deliveryResult) {
                    const costText = deliveryResult.replace(/<[^>]*>/g, ' '); // Limpiar HTML
                    message += `\n\n_${costText.trim()}_`;
                }
                message = message.trim();

                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            }
        });
    }

    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', () => {
            const data = getFormData();
            if (data) {
                const recipientEmail = 'contacto@hercom.com'; // Reemplaza con tu correo real
                const subject = `Solicitud de Cita para Reparación - ${data.name}`;
                const body = `
Se ha recibido una nueva solicitud de cita con los siguientes detalles:

Nombre del Cliente: ${data.name}
Correo Electrónico: ${data.email}
Ubicación: ${data.location}
Tipo de Dispositivo: ${data.device}
Descripción del Problema:
${data.issue}

-------------------------
Por favor, contactar al cliente para coordinar la cita.
                `.trim();

                const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.location.href = mailtoUrl;
            }
        });
    }

    // --- Carga Dinámica de Contenido ---

    /**
     * Función genérica para cargar datos desde la API y renderizarlos.
     * @param {string} endpoint - El endpoint de la API (ej: '/servicios').
     * @param {HTMLElement} container - El elemento contenedor donde se renderizará el contenido.
     * @param {function} renderFn - La función que renderiza cada item.
     * @param {string} entityName - El nombre de la entidad para los mensajes de error (ej: 'servicios').
     */
    const fetchData = async (endpoint, container, renderFn, entityName) => {
        if (!container) return;
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!response.ok) throw new Error(`Respuesta de red no fue OK para ${entityName}`);
            const data = await response.json();
            container.innerHTML = ''; // Limpiar contenido previo
            data.forEach(item => container.appendChild(renderFn(item)));
        } catch (error) {
            console.error(`Error al cargar ${entityName}:`, error);
            container.innerHTML = `<p>No se pudieron cargar los ${entityName}. Intenta de nuevo más tarde.</p>`;
        }
    };

    // Cargar Servicios
    fetchData('/servicios', document.querySelector('.service-cards'), (servicio) => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'card';
        serviceCard.innerHTML = `
            <i class="fas ${servicio.Icono || 'fa-laptop-code'} card-icon"></i>
            <h3>${servicio.Nombre}</h3>
            <p>${servicio.Descripcion}</p>
        `;
        return serviceCard;
    }, 'servicios');

    // Cargar Componentes (Localmente)
    const loadComponentes = () => {
        const container = document.querySelector('.parts-container');
        if (!container) return;

        const componentes = [
            { nombre: 'Memoria RAM 8GB DDR4', descripcion: 'Memoria RAM para laptop, marca Kingston. Condición: Nueva.', precio: '2500.00', imagen: 'https://fullh4rd.com.ar/img/productos/4/memoria-8gb-ddr4-3200-kingston-value-ram-kvr-0.jpg' },
            { nombre: 'SSD 240GB SATA', descripcion: 'Disco de estado sólido para PC o Laptop. Condición: Nuevo.', precio: '1800.00', imagen: 'https://sis.omega.com.do/ProductImages/b0a92eb2-9541-4aa6-9093-77968db1f11f.png' }
        ];

        container.innerHTML = ''; // Limpiar contenido de ejemplo
        componentes.forEach(componente => {
            const partCard = document.createElement('div');
            partCard.className = 'part-card';
            
            // Crear mensaje de WhatsApp con la imagen incluida
            const whatsappMessage = `🛒 *Solicitud de Compra - HERCOM*

*Producto:* ${componente.nombre}
*Precio:* RD$ ${parseFloat(componente.precio).toFixed(2)}
*Descripción:* ${componente.descripcion}

📷 *Imagen del producto:*
${componente.imagen}

Hola, estoy interesado en comprar este componente. ¿Está disponible?`;
            
            partCard.innerHTML = `
                <img src="${componente.imagen}" alt="${componente.nombre}" loading="lazy">
                <div class="part-card-info">
                    <h3 class="part-name">${componente.nombre}</h3>
                    <p class="part-description">${componente.descripcion}</p>
                    <p class="part-price">RD$ ${parseFloat(componente.precio).toFixed(2)}</p>
                    <a href="https://wa.me/18494362242?text=${encodeURIComponent(whatsappMessage)}" class="cta-button" target="_blank">
                        <i class="fab fa-whatsapp"></i> Comprar por WhatsApp
                    </a>
                </div>`;
            container.appendChild(partCard);
        });
    };
    loadComponentes();

    // Cargar Sectores
    const sectorSelect = document.getElementById('sector-select');
    const locationInput = document.getElementById('location'); // Input de ubicación
    if (sectorSelect && locationInput) { // Aseguramos que ambos elementos existan
        const deliveryResult = document.getElementById('delivery-result');

        // Función para calcular distancia (Fórmula de Haversine)
        const calculateDistance = (coords1, coords2) => {
            const R = 6371; // Radio de la Tierra en km
            const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
            const dLon = (coords2.lon - coords1.lon) * Math.PI / 180;
            const a =
                0.5 - Math.cos(dLat) / 2 +
                Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) *
                (1 - Math.cos(dLon)) / 2;
            return R * 2 * Math.asin(Math.sqrt(a)); // Distancia en km
        };

        // Función para calcular el costo del delivery
        const calculateDeliveryCost = (distanceKm) => {
            if (distanceKm < 0) return 0;
            const baseFare = 100; // Tarifa base en RD$
            const perKmRate = 25; // Costo adicional por km en RD$
            // Si la distancia es menor a 1km, se cobra solo la tarifa base
            if (distanceKm <= 1) {
                return baseFare;
            }
            // Para distancias mayores, se cobra la base + extra por km
            const additionalCost = (distanceKm - 1) * perKmRate;
            return baseFare + additionalCost;
        };

        sectorSelect.addEventListener('change', (event) => {
            const selectedOption = event.target.options[event.target.selectedIndex];
            const lat = selectedOption.dataset.lat;
            const lon = selectedOption.dataset.lon;
            const sectorName = selectedOption.textContent;

            if (lat && lon) {
                const sectorCoords = { lat: parseFloat(lat), lon: parseFloat(lon) };
                const distanceKm = calculateDistance(HERCOM_COORDS, sectorCoords);
                const cost = calculateDeliveryCost(distanceKm);

                const distanceText = distanceKm < 1 
                    ? `${(distanceKm * 1000).toFixed(0)} metros` 
                    : `${distanceKm.toFixed(2)} km`;

                deliveryResult.innerHTML = `Distancia: <strong>${distanceText}</strong><br>Costo de envío: <strong>RD$ ${cost.toFixed(2)}</strong>`;
                
                // MEJORA: Rellenar automáticamente el campo de ubicación
                if (locationInput) {
                    locationInput.value = sectorName;
                }
            } else {
                deliveryResult.innerHTML = '';
                locationInput.value = ''; // Limpiar si se deselecciona
            }
        });

        const sectoresMocanos = [
            { NombreSector: 'Centro de la Ciudad', ValorOpcion: 'centro_ciudad', Latitud: 19.3945, Longitud: -70.5280 }, // Punto de referencia
            { NombreSector: 'Los López', ValorOpcion: 'los_lopez', Latitud: 19.4081, Longitud: -70.5252 },
            { NombreSector: 'La Española', ValorOpcion: 'la_espanola', Latitud: 19.3905, Longitud: -70.5203 },
            { NombreSector: 'El Caimito', ValorOpcion: 'el_caimito', Latitud: 19.4251, Longitud: -70.5356 },
            { NombreSector: 'Guauci', ValorOpcion: 'guauci', Latitud: 19.4008, Longitud: -70.5055 },
            { NombreSector: 'La Isleta', ValorOpcion: 'la_isleta', Latitud: 19.3853, Longitud: -70.5301 },
            { NombreSector: 'Villa Bartola', ValorOpcion: 'villa_bartola', Latitud: 19.3820, Longitud: -70.5385 }, // Corregido previamente
            { NombreSector: 'San Víctor', ValorOpcion: 'san_victor', Latitud: 19.4455, Longitud: -70.5308 },
            { NombreSector: 'Las Colinas', ValorOpcion: 'las_colinas', Latitud: 19.3872, Longitud: -70.5153 },
            { NombreSector: 'El Corozo', ValorOpcion: 'el_corozo', Latitud: 19.3756, Longitud: -70.5452 },
            { NombreSector: 'La Milagrosa', ValorOpcion: 'la_milagrosa', Latitud: 19.3925, Longitud: -70.5404 },
            { NombreSector: 'Sal si Puedes', ValorOpcion: 'sal_si_puedes', Latitud: 19.3992, Longitud: -70.5215 },
            { NombreSector: 'Don Bosco', ValorOpcion: 'don_bosco', Latitud: 19.3889, Longitud: -70.5258 },
            { NombreSector: 'Euclides Morillo', ValorOpcion: 'euclides_morillo', Latitud: 19.4035, Longitud: -70.5314 },
            { NombreSector: 'Villa Carolina', ValorOpcion: 'villa_carolina', Latitud: 19.4115, Longitud: -70.5201 }
        ];

        const populateSectores = () => {
            sectorSelect.innerHTML = '<option value="">-- Selecciona tu sector --</option>';

            sectoresMocanos.forEach(sector => {
                const option = document.createElement('option');
                option.value = sector.ValorOpcion;
                option.textContent = sector.NombreSector;
                option.dataset.lat = sector.Latitud;
                option.dataset.lon = sector.Longitud;
                sectorSelect.appendChild(option);
            });
        };

        populateSectores(); // Llamamos a la función para que se ejecute al cargar la página
    }
});
