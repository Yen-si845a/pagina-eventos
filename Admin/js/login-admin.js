    document.getElementById("loginForm").addEventListener("submit", async function (event) {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch('http://localhost:3000/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
          window.location.href = '../html/administrador.html';  
        } else {
          alert(data.message || 'Credenciales incorrectas');
        }
      } catch (error) {
        console.error('Error al autenticar:', error);
        alert('Hubo un error en la autenticación');
      }
    });