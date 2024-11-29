# pagina-eventos
# Página de Eventos

Este proyecto es una plataforma web para gestionar eventos, donde los usuarios pueden registrarse, iniciar sesión y realizar cotizaciones para eventos personalizados. La página está diseñada para ser moderna, fácil de usar y eficiente, ofreciendo una experiencia fluida tanto para los usuarios como para los administradores.

## Características

- **Registro y Login de Usuario**: Los usuarios pueden crear una cuenta y acceder con su usuario y contraseña.
- **Cotización de Eventos**: Los usuarios pueden solicitar cotizaciones personalizadas para sus eventos, seleccionando servicios y detallando requisitos.
- **Gestión de Eventos**: Los administradores pueden gestionar los eventos, servicios y cotizaciones desde el backend.
- **Interfaz de Usuario Moderna**: La página cuenta con un diseño limpio y atractivo, optimizado para una excelente experiencia de usuario.

## Tecnologías Usadas

- **Frontend**: HTML, CSS, JavaScript (para la funcionalidad dinámica).
- **Backend**: Nodejs, para gestionar las cotizaciones y el login.
- **Base de Datos**: MySQL, para almacenar los datos de los usuarios, cotizaciones y detalles de eventos.
  
## Instalación

Para ejecutar este proyecto localmente, sigue estos pasos:

### 1. Clonar el Repositorio
Descargar el repositorio.

### 2. Configurar el Backend
Asegúrate de tener Nodejs y Xampp/MySQL instalados en tu máquina.

- Abre el proyecto en Visual Studio Code.
- Prende el xampp y en el MySQL implementa la base de datos
- Configura la conexión a la base de datos.
- Al tener Nodejs instalado en el terminal del proyecto haz los siquientes codigos:
```
npm init -y

npm install express mysql2 bcryptjs body-parser express-session cors
```

### 3. Ejecutar el Proyecto
Una vez configurado, ejecute el proyecto, en el terminal escriba:
```
node server.js
```
Este archivo contiene todas las conexciones y la corrida del servidor el cual se corre en el "http://localhost:3000"

### 4. Correr la pagina
Habre la pagina de index.html y a partir de ahi se puede empezar a probar el funcionamiento completo.

## Uso

- **Registro de Usuario:** Los nuevos usuarios pueden registrarse.
- **Login:** Los usuarios registrados pueden acceder a la plataforma utilizando su usuario y contraseña.
- **Cotización de Eventos:** Después de iniciar sesión, los usuarios pueden ir a la sección de cotizacion para hacer una nueva cotización de un evento.

