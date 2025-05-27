// Función principal para cargar contenido
function loadContent(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extraer el contenido principal
            const newContent = doc.querySelector('main').innerHTML;
            document.querySelector('main').innerHTML = newContent;
            
            // Cargar CSS externos
            loadExternalCSS(doc);
            
            // Ejecutar scripts inline
            executeInlineScripts(doc);
            
            // Cargar scripts externos
            loadExternalScripts(doc);
            
            // Scroll al inicio de la página
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            setupInternalLinks();
            history.pushState({}, '', url);
        })
        .catch(err => console.error('Error al cargar:', err));
}

// Función para cargar CSS externos
function loadExternalCSS(doc) {
    const existingLinks = document.querySelectorAll('link[rel="stylesheet"]');
    const existingHrefs = Array.from(existingLinks).map(link => link.href);
    
    const cssLinks = doc.querySelectorAll('link[rel="stylesheet"]');
    
    cssLinks.forEach(link => {
        const href = link.href;
        // Solo cargar CSS que no esté ya cargado
        if (!existingHrefs.includes(href)) {
            const newLink = document.createElement('link');
            newLink.rel = 'stylesheet';
            newLink.href = href;
            document.head.appendChild(newLink);
        }
    });
}

// Función para ejecutar scripts inline
function executeInlineScripts(doc) {
    const scripts = doc.querySelectorAll('script:not([src])');
    
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        
        // Copiar atributos si los hay
        Array.from(script.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        
        document.head.appendChild(newScript);
        // Remover el script después de ejecutarlo para evitar duplicados
        setTimeout(() => {
            document.head.removeChild(newScript);
        }, 100);
    });
}

// Función para cargar scripts externos
function loadExternalScripts(doc) {
    const existingScripts = document.querySelectorAll('script[src]');
    const existingSrcs = Array.from(existingScripts).map(script => script.src);
    
    const externalScripts = doc.querySelectorAll('script[src]');
    
    externalScripts.forEach(script => {
        const src = script.src;
        // Solo cargar scripts que no estén ya cargados
        if (!existingSrcs.includes(src)) {
            const newScript = document.createElement('script');
            newScript.src = src;
            
            // Copiar otros atributos
            Array.from(script.attributes).forEach(attr => {
                if (attr.name !== 'src') {
                    newScript.setAttribute(attr.name, attr.value);
                }
            });
            
            document.head.appendChild(newScript);
        }
    });
}

// Función para limpiar recursos cuando se cambia de página
function cleanupResources() {
    // Limpiar event listeners específicos de la página anterior
    // Detener timers, intervals, etc.
    
    // Ejemplo para el calendario de eventos:
    if (window.calendarioEventos) {
        // Si hay métodos de limpieza, llamarlos aquí
        window.calendarioEventos = null;
    }
}

// scroll suave para enlaces internos
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
        cleanupResources(); // Limpiar recursos antes de cargar nuevo contenido
        loadContent(link.href);
    });
});

// Manejar el botón atrás/adelante
window.addEventListener('popstate', () => {
    cleanupResources(); // Limpiar recursos antes de cargar
    
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
