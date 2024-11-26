  function formatearFecha(fecha) {
    const opciones = { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric' 
    };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

        function cargarCotizaciones() {
            fetch('http://localhost:3000/api/cotizaciones')
                .then(response => response.json())
                .then(data => {
                    const cotizacionesList = document.querySelector('#cotizaciones-list');
                    cotizacionesList.innerHTML = '';  
    
                    // Agrupar cotizaciones por estado
                    const cotizacionesPorEstado = {
                        pendiente: [],
                        realizado: [],
                        anulado: []
                    };
    
                    // Asignar cotizaciones a sus respectivas secciones según su estado
                    data.forEach(cotizacion => {
                        const estado = cotizacion.estado || 'pendiente';
                        cotizacionesPorEstado[estado].push(cotizacion);
                    });
    
                    // Crear las secciones para cada estado
                    Object.keys(cotizacionesPorEstado).forEach(estado => {
                        const section = document.createElement('section');
                        const title = document.createElement('h3');
                        title.textContent = `Cotizaciones ${estado.charAt(0).toUpperCase() + estado.slice(1)}`; 
                        section.appendChild(title);
    
                        // Llenar las cotizaciones de ese estado
                        cotizacionesPorEstado[estado].forEach(cotizacion => {
                            const cotizacionDiv = document.createElement('div');
                            cotizacionDiv.classList.add('cotizacion', estado);  
                            cotizacionDiv.id = `cotizacion-${cotizacion.id}`;  
    
                            cotizacionDiv.innerHTML = ` 
                                <h4>Cotización ID: ${cotizacion.id}</h4>
                                <p><strong>Usuario:</strong> ${cotizacion.username}</p>
                                <p><strong>Nombre:</strong> ${cotizacion.nombre}</p>
                                <p><strong>Teléfono:</strong> ${cotizacion.telefono}</p>
                                <p><strong>Email:</strong> ${cotizacion.email}</p>
                                <p><strong>Tipo de Evento:</strong> ${cotizacion.tipo_evento || 'N/A'}</p>
                                <p><strong>Fecha del evento:</strong> ${formatearFecha(cotizacion.fecha)}</p>
                                <p><strong>Fecha de solicitud:</strong> ${formatearFecha(cotizacion.created_at)}</p>
                                <p><strong>Hora de Inicio:</strong> ${cotizacion.hora_inicio}</p>
                                <p><strong>Hora de Fin:</strong> ${cotizacion.hora_fin}</p>
                                <p><strong>Asistentes:</strong> ${cotizacion.asistentes}</p>
                                <p><strong>Presupuesto:</strong> ${cotizacion.presupuesto}</p>
                                <p><strong>Comentarios adicionales:</strong> ${cotizacion.comentarios}</p>
                                <!--<p class="estado-texto"><strong>Estado:</strong> ${cotizacion.estado.charAt(0).toUpperCase() + cotizacion.estado.slice(1)}</p>-->
                                <div class="estado-select">
                                    <label for="estado-${cotizacion.id}">Estado:</label>
                                    <select id="estado-${cotizacion.id}" onchange="actualizarEstado(${cotizacion.id}, this.value)">
                                        <option value="realizado" ${cotizacion.estado === 'realizado' ? 'selected' : ''}>Realizado</option>
                                        <option value="pendiente" ${cotizacion.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                                        <option value="anulado" ${cotizacion.estado === 'anulado' ? 'selected' : ''}>Anulado</option>
                                    </select>
                                </div>
                            `;
    
                            section.appendChild(cotizacionDiv);
                        });
    
                        cotizacionesList.appendChild(section);
                    });
                })
                .catch(error => {
                    console.error('Error al obtener las cotizaciones:', error);
                });
        }
    
        // Función para actualizar el estado de la cotización en la base de datos
        function actualizarEstado(idCotizacion, nuevoEstado) {
            fetch(`http://localhost:3000/api/cotizaciones/${idCotizacion}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estado: nuevoEstado })  
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Estado actualizado correctamente en la base de datos');
                    
                    // Encontramos el div correspondiente a esta cotización
                    const cotizacionDiv = document.getElementById(`cotizacion-${idCotizacion}`);
                    const selectEstado = cotizacionDiv.querySelector('select');
                    
                    // Actualizamos la clase CSS de la cotización según el nuevo estado
                    cotizacionDiv.classList.remove('pendiente', 'realizado', 'anulado');
                    cotizacionDiv.classList.add(nuevoEstado);  
                    
                    // Se actualiza el valor del select para reflejar el nuevo estado
                    selectEstado.value = nuevoEstado;  
    
                    // Ahora movemos la cotización a la nueva sección según su estado
                    moverCotizacion(cotizacionDiv, nuevoEstado);
                } else {
                    console.error('Error al actualizar el estado:', data.message);
                }
            })
            .catch(error => {
                console.error('Error al actualizar el estado:', error);
            });
        }
    
        // Función para mover la cotización a la nueva sección según el estado
        function moverCotizacion(cotizacionDiv, nuevoEstado) {
            const cotizacionesList = document.querySelector('#cotizaciones-list');
            const secciones = cotizacionesList.querySelectorAll('section');
            
            secciones.forEach(section => {
                const stateClass = section.querySelector('h3').textContent.toLowerCase();
                if (stateClass.includes(nuevoEstado)) {
                    section.appendChild(cotizacionDiv);
                }
            });
        }
    
        document.addEventListener('DOMContentLoaded', function () {
            cargarCotizaciones();  
        });
    
        // Función para filtrar cotizaciones por estado
        function filtrarCotizaciones(estado) {
            const cotizacionesDivs = document.querySelectorAll('.cotizacion');
            cotizacionesDivs.forEach(cotizacionDiv => {
                if (estado === 'todos' || cotizacionDiv.classList.contains(estado)) {
                    cotizacionDiv.style.display = 'block';
                } else {
                    cotizacionDiv.style.display = 'none';
                }
            });
        }