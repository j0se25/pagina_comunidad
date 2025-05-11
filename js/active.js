 // Resalta el ítem del menú según la página actual
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop(); // Ej: "quienes.html"
    const menuItems = document.querySelectorAll('#menu-nav .nav-link');
    
    menuItems.forEach(item => {
        const itemPage = item.getAttribute('href').split('/').pop(); // Ej: "quienes.html"
        if (currentPage === itemPage || (currentPage === '' && itemPage === 'index.html')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});