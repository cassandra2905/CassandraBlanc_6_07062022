const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

//Importer Router de sauce 
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://Cassandra_P6:0597POMMEVERTE@cluster0.txzvgpp.mongodb.net/p6?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log('Connexion à MongoDB Atlas réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(express.json());

// Afin d'éviter les erreurs de CORS on ajoute des headers à notre objet response afin d'acceder à l'API depuis n'importe quelle origine ('*')
// On veut aussi pouvoir envoyer des requêtes avec les méthodes mentionnées
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);

//Router d'authentification utilisateur
app.use('/api/auth', userRoutes);

module.exports = app;