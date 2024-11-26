fetch('/api/usuario')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const usuario = data.user;
                const nombreUsuario = usuario.username;

                const canvas = document.getElementById("perfil-canvas");
                const ctx = canvas.getContext("2d");

                const canvasSize = 100;

                const resolutionFactor = 3; 
                canvas.width = canvasSize * window.devicePixelRatio * resolutionFactor; 
                canvas.height = canvasSize * window.devicePixelRatio * resolutionFactor;

                ctx.scale(window.devicePixelRatio * resolutionFactor, window.devicePixelRatio * resolutionFactor);

                ctx.fillStyle = "#f2f2f2"; 
                ctx.beginPath();
                ctx.arc(canvasSize / 2, canvasSize / 2, (canvasSize - 10) / 2, 0, 2 * Math.PI); // Círculo
                ctx.fill();

                ctx.fillStyle = "#0d0d0d"; 
                ctx.font = "50px Open Sans, sans serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                const primeraLetra = nombreUsuario.charAt(0).toUpperCase();
                ctx.fillText(primeraLetra, canvasSize / 2, canvasSize / 2);
            } else {
                alert('No hay un usuario logueado.');
                window.location.href = '/html/login.html';
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos del usuario:', error);
            alert('Hubo un error al cargar los datos del usuario.');
        });