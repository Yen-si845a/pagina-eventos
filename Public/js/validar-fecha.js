 document.getElementById('cotizacionForm').addEventListener('submit', function(event) {
    const fechaEvento = document.getElementById('fecha').value;
    const fechaActual = new Date();
    const fechaEventoObj = new Date(fechaEvento);

    const diferenciaDias = (fechaEventoObj - fechaActual) / (1000 * 3600 * 24);

    if (diferenciaDias < 2) {
        event.preventDefault(); 
        alert('La fecha del evento debe ser al menos 3 días después de la fecha actual.');
    }
});