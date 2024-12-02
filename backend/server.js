const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

//  CORS 
app.use(cors());
app.use(express.json()); // Middleware 

// Conexión a la base de datos 
const pool = new Pool({
  user: 'postgres',        // Usuario de la base de datos
  host: 'localhost',       // Host de PostgreSQL
  database: 'likeme',      // Nombre de la base de datos
  password: 'gaviotas',    // Contraseña de la base de datos
  port: 5432               // Puerto por defecto de PostgreSQL
});

// Ruta GET 
app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});

// Ruta POST para agregar 
app.post('/posts', async (req, res) => {
  const { titulo, img, descripcion } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO posts (titulo, img, descripcion) VALUES ($1, $2, $3) RETURNING *',
      [titulo, img, descripcion]
    );
    res.json({ message: 'Post agregado con éxito', post: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el post' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
