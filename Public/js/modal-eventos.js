function formatearFecha(fecha) {
    const opciones = { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric' 
    };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

document.addEventListener('DOMContentLoaded', () => {
    const eventosContainer = document.querySelector('.eventos');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.getElementById('close-modal');


    function cargarEventos() {
        fetch('/api/eventos')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    eventosContainer.innerHTML = ''; 
                    data.eventos.forEach(evento => {
                        const eventoDiv = document.createElement('div');
                        eventoDiv.className = 'evento';
                        eventoDiv.innerHTML = `
                            <p><strong>Evento:</strong> ${evento.tipo_evento}</p>
                            <p><strong>Fecha del evento:</strong> ${formatearFecha(evento.fecha)}</p>
                            <p><strong>Fecha de solicitud:</strong> ${formatearFecha(evento.created_at)}</p>
                            <button class="detalle-btn" data-id="${evento.id}">Ver Detalles</button>
                            <button class="eliminar-btn" data-id="${evento.id}">Eliminar</button>
                        `;
                        eventosContainer.appendChild(eventoDiv);
                    });
                }
            })
            .catch(err => console.error('Error al cargar eventos:', err));
    }


    eventosContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('detalle-btn')) {
            const eventoId = e.target.getAttribute('data-id');
            mostrarDetalles(eventoId);
        } else if (e.target.classList.contains('eliminar-btn')) {
            const eventoId = e.target.getAttribute('data-id');
            const eventoElemento = e.target.closest('.evento');
            eliminarCotizacion(eventoId, eventoElemento);
        }
    });

    function mostrarDetalles(id) {
        fetch(`/api/eventos/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const evento = data.evento;
                    modalBody.innerHTML = `
                        <h3>Detalles de la Cotización</h3>
                        <p><strong>Nombre:</strong> ${evento.nombre}</p>
                        <p><strong>Teléfono:</strong> ${evento.telefono}</p>
                        <p><strong>Email:</strong> ${evento.email}</p>
                        <p><strong>Tipo de Evento:</strong> ${evento.tipo_evento || 'No especificado'}</p>
                        <p><strong>Otro Tipo de Evento:</strong> ${evento.otro_tipo_evento || 'No especificado'}</p>
                        <p><strong>Fecha del evento:</strong> ${formatearFecha(evento.fecha)}</p>
                        <p><strong>Fecha de solicitud:</strong> ${formatearFecha(evento.created_at)}</p>
                        <p><strong>Hora:</strong> ${evento.hora_inicio} - ${evento.hora_fin}</p>
                        <p><strong>Ubicación:</strong> ${evento.ubicacion || 'No especificada'}</p>
                        <p><strong>Otra Ubicación:</strong> ${evento.otro_ubicacion || 'No especificada'}</p>
                        <p><strong>Asistentes:</strong> ${evento.asistentes}</p>
                        <p><strong>Servicios:</strong> ${
                            evento.servicios 
                                ? Array.isArray(evento.servicios) 
                                    ? evento.servicios.join(', ') 
                                    : JSON.parse(evento.servicios).join(', ') 
                                : 'No especificados'
                        }</p>
                        <p><strong>Presupuesto:</strong> ${evento.presupuesto || 'No especificado'}</p>
                        <p><strong>Comentarios:</strong> ${evento.comentarios || 'Sin comentarios'}</p>
                        <p><strong>Estado:</strong> <span style= "color: #0487d9;"">${evento.estado}</span></p>

                    `;
                    modal.style.display = 'block';
                }
            })
            .catch(err => console.error('Error al cargar detalles:', err));
    }

    function eliminarCotizacion(id, eventoElemento) {
        const confirmar = confirm('¿Estás seguro de que deseas eliminar esta cotización?');
        if (confirmar) {
            fetch(`/api/eventos/${id}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Cotización eliminada exitosamente');
                    eventoElemento.remove();
                } else {
                    alert('Hubo un problema al eliminar la cotización');
                }
            })
            .catch(err => console.error('Error al eliminar la cotización:', err));
        }
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    cargarEventos();
});
