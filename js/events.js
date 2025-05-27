// Función principal para cargar contenido con manejo específico de páginas
function loadContent(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Limpiar recursos previos
            cleanupCurrentPage();
            
            // Extraer el contenido principal
            const newContent = doc.querySelector('main').innerHTML;
            document.querySelector('main').innerHTML = newContent;
            
            // Cargar recursos específicos de la página
            loadPageResources(doc, url);
            
            // Scroll al inicio
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            setupInternalLinks();
            history.pushState({}, '', url);
        })
        .catch(err => console.error('Error al cargar:', err));
}

// Función para cargar recursos específicos de cada página
function loadPageResources(doc, url) {
    // Cargar CSS externos nuevos
    loadNewCSS(doc);
    
    // Determinar el tipo de página y ejecutar código específico
    if (url.includes('eventos') || url.includes('events')) {
        initEventosPage(doc);
    } else if (url.includes('noticias') || url.includes('news')) {
        initNoticiasPage(doc);
    } else {
        // Para otras páginas, ejecutar scripts normalmente
        executePageScripts(doc);
    }
}

// Función específica para inicializar la página de eventos
function initEventosPage(doc) {
    // Primero cargar los scripts externos necesarios
    loadBootstrapJS();
    
    // Luego ejecutar el código del calendario
    setTimeout(() => {
        // Código del calendario copiado y adaptado
        class CalendarioEventos {
            constructor() {
                this.eventos = [];
                this.currentDate = new Date();
                this.currentView = 'calendar';
                this.meses = [
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                ];
                this.diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
                
                this.init();
            }

            async init() {
                await this.cargarEventos();
                this.setupEventListeners();
                this.renderCalendario();
                this.renderLista();
            }

            async cargarEventos() {
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    this.eventos = [
                        
                        {
                            id: 1,
                            titulo: "Asamblea General Mensual",
                            descripcion: "Reunión mensual de la comunidad para tratar temas importantes, evaluar proyectos en curso y tomar decisiones colectivas para el bienestar común.",
                            fecha: "2025-06-08",
                            hora: "09:00 AM",
                            ubicacion: "Salón Principal",
                            tipo: "comunitario"
                        },
                        {
                            id: 2,
                            titulo: "Festival de Cosecha",
                            descripcion: "Celebración de agradecimiento por los frutos de la tierra. Incluye danzas tradicionales, música ancestral, artesanías y compartir comunitario.",
                            fecha: "2025-06-15",
                            hora: "10:00",
                            ubicacion: "Plaza Central",
                            tipo: "festividad"
                        },
                        {
                            id: 3,
                            titulo: "Curso de Lengua Ancestral",
                            descripcion: "Clases para preservar y transmitir nuestra lengua originaria a las nuevas generaciones. Impartido por los mayores de la comunidad.",
                            fecha: "2025-06-20",
                            hora: "16:00",
                            ubicacion: "Aula Cultural",
                            tipo: "educativo"
                        },
                        {
                            id: 4,
                            titulo: "Jornada de Siembra Comunitaria",
                            descripcion: "Actividad colectiva de siembra en la huerta comunitaria. Participación de todas las familias para fortalecer la soberanía alimentaria.",
                            fecha: "2025-05-30",
                            hora: "08:00",
                            ubicacion: "Huerta Comunitaria",
                            tipo: "ambiental"
                        },
                        {
                            id: 5,
                            titulo: "Jornada para que me chupes la verga",
                            descripcion: "Actividad colectiva de siembra en la huerta comunitaria. Participación de todas las familias para fortalecer la soberanía alimentaria.",
                            fecha: "2025-05-30",
                            hora: "10:00",
                            ubicacion: "Huerta Comunitaria",
                            tipo: "ambiental"
                        }
                    ];

                    const loadingMsg = document.getElementById('loadingMsg');
                    const calendarContainer = document.getElementById('calendarContainer');
                    
                    if (loadingMsg) loadingMsg.style.display = 'none';
                    if (calendarContainer) calendarContainer.style.display = 'block';
                } catch (error) {
                    console.error('Error cargando eventos:', error);
                    const loadingMsg = document.getElementById('loadingMsg');
                    const errorMsg = document.getElementById('errorMsg');
                    
                    if (loadingMsg) loadingMsg.style.display = 'none';
                    if (errorMsg) errorMsg.style.display = 'block';
                }
            }

            setupEventListeners() {
                const prevBtn = document.getElementById('prevMonth');
                const nextBtn = document.getElementById('nextMonth');
                const calendarViewBtn = document.getElementById('calendarView');
                const listViewBtn = document.getElementById('listView');
                const closeModalBtn = document.getElementById('closeModal');

                if (prevBtn) prevBtn.addEventListener('click', () => this.previousMonth());
                if (nextBtn) nextBtn.addEventListener('click', () => this.nextMonth());
                if (calendarViewBtn) calendarViewBtn.addEventListener('click', () => this.switchView('calendar'));
                if (listViewBtn) listViewBtn.addEventListener('click', () => this.switchView('list'));
                if (closeModalBtn) closeModalBtn.addEventListener('click', () => this.closeModal());
                
                window.addEventListener('click', (e) => {
                    if (e.target === document.getElementById('eventModal')) {
                        this.closeModal();
                    }
                });
            }

            previousMonth() {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.renderCalendario();
            }

            nextMonth() {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.renderCalendario();
            }

            switchView(view) {
                this.currentView = view;
                const calendarBtn = document.getElementById('calendarView');
                const listBtn = document.getElementById('listView');
                const calendarContainer = document.getElementById('calendarContainer');
                const eventsListContainer = document.getElementById('eventsListContainer');

                if (view === 'calendar') {
                    if (calendarBtn) calendarBtn.classList.add('active');
                    if (listBtn) listBtn.classList.remove('active');
                    if (calendarContainer) calendarContainer.style.display = 'block';
                    if (eventsListContainer) eventsListContainer.classList.remove('active');
                } else {
                    if (listBtn) listBtn.classList.add('active');
                    if (calendarBtn) calendarBtn.classList.remove('active');
                    if (calendarContainer) calendarContainer.style.display = 'none';
                    if (eventsListContainer) eventsListContainer.classList.add('active');
                }
            }

            renderCalendario() {
                const grid = document.getElementById('calendarGrid');
                const monthDisplay = document.getElementById('currentMonth');
                
                if (!grid || !monthDisplay) return;
                
                monthDisplay.textContent = `${this.meses[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
                
                grid.innerHTML = '';

                // Headers de días
                this.diasSemana.forEach(dia => {
                    const dayHeader = document.createElement('div');
                    dayHeader.className = 'day-header';
                    dayHeader.innerHTML = `<i class="fas fa-calendar-day me-1"></i>${dia}`;
                    grid.appendChild(dayHeader);
                });

                // Calcular días del calendario
                const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
                const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
                const startDate = new Date(firstDay);
                startDate.setDate(startDate.getDate() - firstDay.getDay());

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                for (let i = 0; i < 42; i++) {
                    const cellDate = new Date(startDate);
                    cellDate.setDate(startDate.getDate() + i);
                    
                    const dayCell = document.createElement('div');
                    dayCell.className = 'day-cell';
                    
                    if (cellDate.getMonth() !== this.currentDate.getMonth()) {
                        dayCell.classList.add('other-month');
                    }
                    
                    if (cellDate.getTime() === today.getTime()) {
                        dayCell.classList.add('today');
                    }

                    const dayNumber = document.createElement('div');
                    dayNumber.className = 'day-number';
                    dayNumber.textContent = cellDate.getDate();
                    dayCell.appendChild(dayNumber);

                    // Agregar eventos del día
                    const dayEvents = this.getEventosDelDia(cellDate);
                    dayEvents.forEach(evento => {
                        const eventDiv = document.createElement('div');
                        eventDiv.className = 'event-item';
                        eventDiv.innerHTML = `<i class="fas fa-circle me-1" style="font-size: 6px;"></i>${evento.titulo}`;
                        eventDiv.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.showEventModal(evento);
                        });
                        dayCell.appendChild(eventDiv);
                    });

                    grid.appendChild(dayCell);
                }
            }

            renderLista() {
                const listContainer = document.getElementById('eventsList');
                if (!listContainer) return;
                
                listContainer.innerHTML = '';

                if (this.eventos.length === 0) {
                    listContainer.innerHTML = '<p class="text-center text-muted">No hay eventos programados.</p>';
                    return;
                }

                // Ordenar eventos por fecha
                const eventosOrdenados = [...this.eventos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

                eventosOrdenados.forEach(evento => {
                    const eventCard = document.createElement('div');
                    eventCard.className = 'event-card';
                    
                    const fecha = new Date(evento.fecha);
                    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    const tipoIconos = {
                        ceremonial: 'fas fa-moon',
                        educativo: 'fas fa-book',
                        comunitario: 'fas fa-users',
                        festividad: 'fas fa-music',
                        ambiental: 'fas fa-leaf'
                    };

                    const icono = tipoIconos[evento.tipo] || 'fas fa-calendar-alt';

                    eventCard.innerHTML = `
                        <div class="event-date-calendar">
                            <i class="${icono} me-2"></i>${fechaFormateada} - ${evento.hora}
                        </div>
                        <div class="event-title-calendar">${evento.titulo}</div>
                        <div class="event-description-calendar">${evento.descripcion}</div>
                        <div class="event-location-calendar">
                            <i class="fas fa-map-marker-alt me-2"></i>${evento.ubicacion}
                        </div>
                    `;

                    eventCard.addEventListener('click', () => this.showEventModal(evento));
                    listContainer.appendChild(eventCard);
                });
            }

            closeModal() {
                const modal = document.getElementById('eventModal');
                if (modal) modal.style.display = 'none';
            }

            getEventosDelDia(date) {
                const dateStr = date.toISOString().split('T')[0];
                return this.eventos.filter(evento => evento.fecha === dateStr);
            }

            showEventModal(evento) {
                const modal = document.getElementById('eventModal');
                const modalContent = document.getElementById('modalContent');
                
                if (!modal || !modalContent) return;
                
                const fecha = new Date(evento.fecha);
                const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                const tipoIconos = {
                    ceremonial: 'fas fa-moon',
                    educativo: 'fas fa-book',
                    comunitario: 'fas fa-users',
                    festividad: 'fas fa-music',
                    ambiental: 'fas fa-leaf'
                };

                const icono = tipoIconos[evento.tipo] || 'fas fa-calendar-alt';

                modalContent.innerHTML = `
                    <div class="event-date-calendar">
                        <i class="${icono} me-2"></i>${fechaFormateada} - ${evento.hora}
                    </div>
                    <div class="event-title-calendar">${evento.titulo}</div>
                    <div class="event-description-calendar">${evento.descripcion}</div>
                    <div class="event-location-calendar">
                        <i class="fas fa-map-marker-alt me-2"></i>${evento.ubicacion}
                    </div>
                `;

                modal.style.display = 'block';
            }
        }

        // Inicializar el calendario
        if (document.getElementById('calendarGrid')) {
            window.calendarioEventos = new CalendarioEventos();
        }
    }, 500);
}

// Función para cargar Bootstrap JS si no está cargado
function loadBootstrapJS() {
    if (!window.bootstrap) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js';
        document.head.appendChild(script);
    }
}

// Función para cargar CSS nuevos
function loadNewCSS(doc) {
    const existingLinks = document.querySelectorAll('link[rel="stylesheet"]');
    const existingHrefs = Array.from(existingLinks).map(link => link.href);
    
    const cssLinks = doc.querySelectorAll('link[rel="stylesheet"]');
    
    cssLinks.forEach(link => {
        const href = link.href;
        if (!existingHrefs.includes(href)) {
            const newLink = document.createElement('link');
            newLink.rel = 'stylesheet';
            newLink.href = href;
            document.head.appendChild(newLink);
        }
    });
}

// Función para ejecutar scripts de páginas normales
function executePageScripts(doc) {
    const scripts = doc.querySelectorAll('script:not([src])');
    scripts.forEach(script => {
        try {
            eval(script.textContent);
        } catch (error) {
            console.error('Error ejecutando script:', error);
        }
    });
}

// Función para limpiar recursos de la página actual
function cleanupCurrentPage() {
    // Limpiar el calendario si existe
    if (window.calendarioEventos) {
        window.calendarioEventos = null;
    }
    
    // Limpiar otros recursos específicos de página aquí
}

// Resto del código permanece igual...
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

document.querySelectorAll('#menu-nav a:not([target="_blank"]), footer a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        loadContent(link.href);
    });
});

window.addEventListener('popstate', () => {
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        const initialContent = '<div>Contenido de Inicio</div>';
        document.querySelector('main').innerHTML = initialContent;
    } else {
        loadContent(window.location.pathname);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    setupInternalLinks();
});