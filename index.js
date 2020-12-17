const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
require('dotenv').config()

const app = express();

// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Conexión a Base de datos
// const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.tmbrf.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const uri = `mongodb://localhost:27017/${process.env.DBNAME}`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connect to mongoDB success!'))
    .catch(e => console.log('Error to connect db:', e))

// import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin')

//import middleware
const tokenMiddleware = require('./middlewares/validate-token');

// route middlewares
app.use('/api/user', authRoutes);
app.use('/api/admin', tokenMiddleware, adminRoutes);
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'works!'
    })
});

// iniciar server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})