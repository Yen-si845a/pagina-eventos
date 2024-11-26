const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path'); 
const cors = require('cors');


const app = express();
const PORT = 3000;

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'auth_system',
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de autenticación
function authMiddleware(req, res, next) {
    if (!req.session.user) {
        return res.send(`<script>alert('Por favor inicia sesión'); window.location.href='/html/login.html';</script>`);
    }
    next();
}

// Ruta para la página de registro (Sign Up)
app.post('/signup', async (req, res) => {
    const { username, password, email, telefono } = req.body;

    try {
        db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, results) => {
            if (err) {
                console.error(err);
                return res.send(`<script>alert('Error en el registro'); window.location.href='/html/registrarse.html';</script>`);
            }

            if (results.length > 0) {
                return res.send(`<script>alert('El usuario o correo ya existe'); window.location.href='/html/registrarse.html';</script>`);
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query('INSERT INTO users (username, password, email, telefono) VALUES (?, ?, ?, ?)', [username, hashedPassword, email, telefono], (err) => {
                if (err) {
                    console.error(err);
                    return res.send(`<script>alert('Error en el registro'); window.location.href='/html/registrarse.html';</script>`);
                }
                res.send(`<script>alert('Registro exitoso'); window.location.href='/html/login.html';</script>`);
            });
        });
    } catch (err) {
        console.error(err);
        res.send(`<script>alert('Hubo un error. Inténtalo nuevamente.'); window.location.href='/html/registrarse.html';</script>`);
    }
});

// Ruta para la página de login 
app.post('/login', (req, res) => {
    const { usernameLogin, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [usernameLogin], async (err, results) => {
        if (err) {
            console.error(err);
            return res.send(`<script>alert('Error al acceder al login'); window.location.href='/html/login.html';</script>`);
        }

        if (results.length === 0) {
            return res.send(`<script>alert('El usuario no existe'); window.location.href='/html/login.html';</script>`);
        }

        if (!(await bcrypt.compare(password, results[0].password))) {
            return res.send(`<script>alert('Contraseña incorrecta'); window.location.href='/html/login.html';</script>`);
        }

        req.session.user = results[0];
        res.send(`<script>alert('Login exitoso'); window.location.href='/html/inicio.html';</script>`);
    });
});


// Rutas protegidas
app.get('/html/inicio.html', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'inicio.html'));
});

app.get('/html/cotizacion.html', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'cotizacion.html'));
});

app.get('/html/sobre-nosotros.html', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'sobre-nosotros.html'));
});

// API para verificar si el usuario está logueado
app.get('/api/usuario', (req, res) => {
    if (req.session.user) {
        res.json({
            success: true,
            user: {
                username: req.session.user.username,
                email: req.session.user.email,
                telefono: req.session.user.telefono,
            },
        });
    } else {
        res.status(401).json({ success: false, message: 'No hay un usuario logueado.' });
    }
});

// Lógica de cierre de sesión
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al cerrar sesión.' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Sesión cerrada con éxito.' });
    });
});

// Ruta para manejar la creación de cotización
app.post('/cotizacion', authMiddleware, (req, res) => {
    const { nombre, telefono, email, tipoEvento, otroTipoEvento, fecha, horaInicio, horaFin, ubicacion, otroUbicacion, asistentes, servicios, presupuesto, comentarios } = req.body;

    const user_id = req.session.user.id;
    const serviciosJSON = JSON.stringify(servicios); // servicios será un arreglo
    db.query('INSERT INTO cotizaciones (user_id, nombre, telefono, email, tipo_evento, otro_tipo_evento, fecha, hora_inicio, hora_fin, ubicacion, otro_ubicacion, asistentes, servicios, presupuesto, comentarios) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [user_id, nombre, telefono, email, tipoEvento, otroTipoEvento, fecha, horaInicio, horaFin, ubicacion, otroUbicacion, asistentes, serviciosJSON, presupuesto, comentarios], 
    (err) => {
        if (err) {
            console.error('Error al insertar cotización:', err);
            return res.send(`<script>alert('Error al enviar la cotización'); window.location.href='/html/cotizacion.html';</script>`);
        }
        res.send(`<script>alert('Cotización enviada con éxito'); window.location.href='/html/cotizacion.html';</script>`);
    });
});



// Ruta para obtener eventos del usuario
app.get('/api/eventos', authMiddleware, (req, res) => {
    const userId = req.session.user.id;

    db.query('SELECT id, tipo_evento, fecha, hora_inicio, hora_fin, ubicacion, asistentes, presupuesto, created_at FROM cotizaciones WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error al obtener eventos:', err);
            return res.status(500).json({ success: false, message: 'Error al obtener eventos' });
        }
        res.json({ success: true, eventos: results });
    });
});

// Ruta para obtener detalles de un evento específico
app.get('/api/eventos/:id', authMiddleware, (req, res) => {
    const eventoId = req.params.id;
    const userId = req.session.user.id;

    db.query('SELECT *, created_at FROM cotizaciones WHERE id = ? AND user_id = ?', [eventoId, userId], (err, results) => {
        if (err) {
            console.error('Error al obtener detalles del evento:', err);
            return res.status(500).json({ success: false, message: 'Error al obtener detalles del evento' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' });
        }

        res.json({ success: true, evento: results[0] });
    });
});

// Endpoint para eliminar una cotización
app.delete('/api/eventos/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM cotizaciones WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al eliminar cotización' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
        }

        res.json({ success: true, message: 'Cotización eliminada exitosamente' });
    });
});

// Ruta para manejar la eliminación de cuenta
app.post('/eliminar-cuenta', (req, res) => {
    if (!req.session.user) {
        return res.status(403).send({ success: false, message: 'No estás autenticado. Por favor, inicia sesión.' });
    }
    const userId = req.session.user.id;
    const { password } = req.body;

    if (!password) {
        return res.status(400).send({ success: false, message: 'Por favor, ingresa tu contraseña.' });
    }

    // Consultamos la base de datos para obtener la contraseña del usuario
    const query = 'SELECT password FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).send({ success: false, message: 'Error al consultar la base de datos' });
        }

        if (results.length === 0) {
            return res.status(404).send({ success: false, message: 'Usuario no encontrado' });
        }

        const hashedPassword = results[0].password;

        // Comparamos la contraseña ingresada por el usuario con la contraseña encriptada
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
                return res.status(500).send({ success: false, message: 'Error al comparar las contraseñas' });
            }

            if (!isMatch) {
                return res.status(400).send({ success: false, message: 'Contraseña incorrecta' });
            }

            const deleteQuery = 'DELETE FROM users WHERE id = ?';
            db.query(deleteQuery, [userId], (err, result) => {
                if (err) {
                    return res.status(500).send({ success: false, message: 'Error al eliminar la cuenta' });
                }

                // Eliminar la sesión después de eliminar la cuenta
                req.session.destroy((err) => {
                    if (err) {
                        return res.status(500).send({ success: false, message: 'Error al destruir la sesión' });
                    }

                    res.status(200).send({ success: true, message: 'Cuenta eliminada con éxito' });
                });
            });
        });
    });
});

app.use(cors());

// Administrador
app.get('/Admin/administrador.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Admin', 'administrador.html'));
});

app.get('/api/cotizaciones', (req, res) => {
    const sql = `
      SELECT cotizaciones.id, cotizaciones.nombre, cotizaciones.telefono, cotizaciones.email, cotizaciones.tipo_evento, cotizaciones.fecha, cotizaciones.created_at, cotizaciones.hora_inicio, cotizaciones.hora_fin, cotizaciones.asistentes, cotizaciones.presupuesto,  cotizaciones.comentarios, cotizaciones.estado, users.username 
      FROM cotizaciones 
      INNER JOIN users ON cotizaciones.user_id = users.id 
      ORDER BY cotizaciones.created_at DESC
    `;
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error al obtener las cotizaciones:', err);
        res.status(500).send('Error al obtener las cotizaciones');
        return;
      }
      res.json(results);
    });
  });
  
  app.put('/api/cotizaciones/:id', (req, res) => {
    const { estado } = req.body;
    const { id } = req.params;

    // Verificar que el estado es válido
    if (!['realizado', 'pendiente', 'anulado'].includes(estado)) {
        return res.status(400).send('Estado no válido');
    }

    // Actualizar el estado en la base de datos
    const sql = `UPDATE cotizaciones SET estado = ? WHERE id = ?`;

    db.query(sql, [estado, id], (err, results) => {
        if (err) {
            console.error('Error al actualizar el estado:', err);
            res.status(500).send('Error al actualizar el estado');
            return;
        }
        res.json({ message: 'Estado actualizado correctamente' });
    });
});

// Ruta para manejar la autenticación de admin
app.post('/auth', (req, res) => {
    const { username, password } = req.body;
  
    const query = 'SELECT * FROM admin WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error en la base de datos' });
  
      if (results.length === 0) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
      }
  
      const user = results[0]; 
  
      if (user.password === password) {
        req.session.isAuthenticated = true;
        req.session.username = user.username; 
  
        return res.json({ success: true, message: 'Autenticación exitosa' });
      } else {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }
    });
  }); 
  
// Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
