import express from 'express';
import mysql from 'mysql2/promise';
import nunjucks from 'nunjucks';

// configuración de MySQL
const db = mysql.createPool({
  host: 'localhost',    
  user: 'root',
  password: 'pass1234',
  database: 'paneldb_dump' // Cambiado de 'CTF' a 'paneldb_dump'
});

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('view engine', 'njk');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index.njk', { title: 'Home' });
});

app.get('/users', (req, res) => {
    db.query('SELECT * FROM users') 
        .then(([rows]) => {
            res.render('users.njk', { title: 'Users', users: rows });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error retrieving users');
        });
});

app.get('/chats', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT clientid, content, created_at FROM chats ORDER BY clientid, created_at'
        );

        // Agrupar los chats por clientid
        const groupedObj = rows.reduce((acc, row) => {
            if (!acc[row.clientid]) acc[row.clientid] = [];
            acc[row.clientid].push({ content: row.content, created_at: row.created_at });
            return acc;
        }, {});

        const grouped = Object.entries(groupedObj).map(([clientid, chats]) => ({
            clientid,
            chats
        }));

        res.render('chats.njk', { title: 'Chats', chats: grouped });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving chats');
    }
});

app.get('/btc-addresses', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM btc_addresses');
        res.render('btc_addresses.njk', { title: 'BTC Addresses', addresses: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving BTC addresses');
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
}
);