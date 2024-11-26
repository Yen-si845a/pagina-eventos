//mostrar el formulario de eliminación de cuenta
function mostrarEliminar() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('eliminar-cuenta-form').style.display = 'block';
    setTimeout(function() {
        document.getElementById('eliminar-cuenta-form').classList.add('show');
    }, 10);
}

function eliminarCuenta() {
    const userId = sessionStorage.getItem('userId');  
    const password = document.getElementById('password').value;

    if (!password) {
        alert('Por favor ingresa tu contraseña');
        return;
    }

    fetch('/eliminar-cuenta', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, password }),  
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            window.location.href = '/html/login.html'; 
        } else {
            alert(data.message); 
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Hubo un problema al eliminar tu cuenta.');
    });
}

function cancelarEliminar() {
    document.getElementById('eliminar-cuenta-form').classList.remove('show');
    
    setTimeout(function() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('eliminar-cuenta-form').style.display = 'none';
    }, 300); 
}

