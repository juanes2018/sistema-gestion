require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

const authenticateToken = require('./middleware.js/auth');



//app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(require('cookie-parser')());





const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send (` 
    <h1>Proyecto en nodejs con express</h1>
    <p>Bienvenido al Proyecto</p>
    <p>Corriendo Super bien en el Puerto: ${PORT} </p>`);

});

  


    app.get('/users/:id' , (req, res) => {
  const userId = req.params.id;
  res.send(`Mostra Informacion del Usuario con ID: ${userId}`);
   
});

     
 app.get('/usersBien/:id' , async (req, res) => {

  try { 
    const userId = req.params.id;
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);  

    if (rows.length === 0) {
      return res.status(404).send(`Usuario con ID: ${userId} no encontrado`);
    }

    res.json(rows[0]);

  } catch (error) {
    console.error('Error al obtener usuario de la base de datos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }

});


app.get('/products/:category/:id' , (req, res) => {
  const category = req.params.category;
  const productId = req.params.id;
  res.send(`Mostra Informacion del Producto con ID: ${productId} en la Categoria: ${category}`);  });


app.get('/search', (req, res) => {
  const query = req.query.q;
  res.send(`Resultados de busqueda para: ${query}`);
});


app.get('/headers', (req, res) => {
  const userAgent = req.headers['user-agent'];
  res.send(`Tu User-Agent es: ${userAgent}`);
});

app.get('/cookies', (req, res) => {
  const cookies = req.cookies;
  res.send(`Tus Cookies son: ${JSON.stringify(cookies)}`);
});

app.get('/status', (req, res) => {
  res.status(200).send('Todo esta bien!');
});

app.get('/redirect', (req, res) => {
  res.redirect('https://www.example.com');
});

app.get('/search/html', (req, res) => {
  
  const query = req.query.q || 'ninguno';
  const category = req.query.categoria || 'todas';
  res.send(`
    <html>
      <body>
        <h1>Resultados de busqueda</h1>
        <p>Termino: ${query}</p>
        <p>Categoria: ${category}</p>
      </body>
    </html>
  `);
});


app.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'Acceso concedido a la ruta protegida', user: req.user });
});

app.post('/register', async (req, res) => {
  const { name, password, email,role } = req.body;

  try { 
    //validaciones basicas 
    if ( !name || !password || !email ) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });

  }
            // Rol permitido
  const allowedRoles = ['admin', 'sales', 'support'];
  const userRole = allowedRoles.includes(role) ? role : 'sales';

           // Verificar si el usuario ya existe
  
  const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

  if (existingUser.length > 0) {
    return res.status(409).json({ message: 'El usuario ya existe' });
  }

          // Encriptar Password

    const hashedPassword = await bcrypt.hash(password, 10);



          // Insertar nuevo usuario en la base de datos

    await db.query('INSERT INTO users (name, password, email, role) VALUES (?, ?, ?, ?)', [name, hashedPassword, email, userRole]);

    res.status(201).json({ message: 'Usuario registrado exitosamente' });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    
    res.status(500).json({ message: 'Error del servidor' });
  }
});



app.get('/db-users' , async (req, res) => { 

   try {
     
    const  [results] = await db.query('SELECT * FROM users');
      res.json(results);

  } catch (error) {
    console.error('Error al obtener usuarios de la base de datos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }

});


  app.post('/login', async (req, res) => {  

    try {
      const { email, password } = req.body;

         // 1️⃣ Validar datos

      if (!email || !password) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
      }

         // 2️⃣ Verificar si el usuario existe    

      const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

      if (users.length === 0) {
        return res.status(401).json({ message: 'Credenciales invalidas' });
      }

      const user = users[0];

         // 3️⃣ Verificar password

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciales invalidas' });
      }

         // 4️⃣ Generar JWT

      const tokenPayload = { id: user.id, role: user.role };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

         // 5️⃣ Enviar respuesta

      res.json({ token });      

    } catch (error) {
      console.error('Error en el proceso de login:', error);
      res.status(500).json({ message: 'Error del servidor' });    

    };
  });

app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);
});






