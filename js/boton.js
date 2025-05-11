document.addEventListener('DOMContentLoaded', function () {
    const btnInicio = document.getElementById("btnInicio");
    const flecha = document.getElementById("flechaImg");

    if (!btnInicio || !flecha) {
        console.error("No se encontró el botón o la imagen de la flecha.");
        return;
    }
    window.addEventListener("scroll", function () {
        btnInicio.style.display = window.scrollY > 150 ? "block" : "none";
    });
    // Función para volver arriba con animación y flecha voladora
    window.scrollToTop = function () {
        const animacion = flecha.animate([
            { transform: 'translateY(0)', opacity: 1 },
            { transform: 'translateY(-600px)', opacity: 0 }
        ], {
            duration: 500,
            easing: 'ease-out',
            fill: 'forwards'
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        // Restaurar visibilidad de la flecha después de un tiempo
        setTimeout(() => {
            // Cancelar la animación en lugar de establecer estilos directamente
            animacion.cancel();
        }, 400);
    }
});
