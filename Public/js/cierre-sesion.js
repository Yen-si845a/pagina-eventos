fetch('/api/usuario')
    .then(response => {
        if (response.status === 401) {
            throw new Error('No autorizado: el usuario no está logueado.');
        }
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // datos del usuario
            document.getElementById('nombre-usuario').textContent = data.user.username;
            document.getElementById('username').textContent = data.user.username;
            document.getElementById('email').textContent = data.user.email;
            document.getElementById('telefono').textContent = data.user.telefono;
        } else {
            alert('Error: ' + data.message);
            window.location.href = '../html/login.html';
        }
    })
    .catch(error => {
        console.error('Error al obtener los datos del usuario:', error.message);
        alert('Hubo un problema al cargar los datos del usuario.');
        window.location.href = '../html/index.html';
    });

document.querySelector("button").addEventListener('click', () => {
    fetch('/logout', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.reload();  

            history.replaceState(null, '', '../html/index.html'); 

            setTimeout(() => {
                window.location.href = '../html/index.html';  
            }, 0);  
        }
    })
    .catch(error => {
        console.error('Error al cerrar sesión:', error);
        alert('Hubo un error al intentar cerrar sesión.');
    });
});
