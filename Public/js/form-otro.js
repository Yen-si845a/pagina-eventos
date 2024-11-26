function toggleOtherEvent() {
    const tipoEvento = document.getElementById('tipo-evento').value;
    const otroTipoEventoContainer = document.getElementById('otroTipoEventoContainer');
    if (tipoEvento === 'otro') {
        otroTipoEventoContainer.style.display = 'block';
    } else {
        otroTipoEventoContainer.style.display = 'none';
    }
}

function toggleOtherInput() {
    const ubicacion = document.getElementById('ubicacion').value;
    const otroLugarContainer = document.getElementById('otroLugarContainer');
    if (ubicacion === 'otro') {
        otroLugarContainer.style.display = 'block';
    } else {
        otroLugarContainer.style.display = 'none';
    }
}
