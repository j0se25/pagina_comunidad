// Función principal para cargar contenido
function loadContent(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.querySelector('main').innerHTML;
            document.querySelector('main').innerHTML = newContent;
            
            // Scroll al inicio de la página (agrega esto)
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Efecto suave (opcional)
            });
            
            // Resto de tu lógica...
            setupInternalLinks();
            history.pushState({}, '', url);
        })
        .catch(err => console.error('Error al cargar:', err));
}

// Configurar anclas internas (scroll suave)
function setupInternalLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Eventos del menú principal
document.querySelectorAll('#menu-nav a:not([target="_blank"]), footer a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        loadContent(link.href);
    });
});

// Manejar el botón atrás/adelante
window.addEventListener('popstate', () => {
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        // Restaurar contenido inicial si existe
        const initialContent = '<div>Contenido de Inicio</div>'; // Reemplaza con tu contenido inicial real
        document.querySelector('main').innerHTML = initialContent;
    } else {
        loadContent(window.location.pathname);
    }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    setupInternalLinks();
});