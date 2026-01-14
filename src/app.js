require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');

const authenticateToken = require('./middleware.js/auth');



app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
  const hashedPassword = await bcrypt.hash(password, 10);})









app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);
});






