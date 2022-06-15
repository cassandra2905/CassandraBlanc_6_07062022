const express = require('express');
const router = express.Router();
// Notre objet contenu dans le controller
const sauceCtrl = require('../controllers/sauce');
// Importation de notre middleware pour protéger la route Stuff
const auth = require('../middleware/auth');
//On importe le middleware multer qui nous permet de gérer les fichiers entrants
const multer = require('../middleware/multer-config');


// Route de l'enregistrement de notre objet Sauce protégée avec le middleware d'authentification (auth)
router.post('/', auth, multer, sauceCtrl.createSauce);

// Route de la modification d'un objet Sauce protégée avec le middleware d'authentification (auth)
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// Route de la suppression d'un objet existant protégée avec le middleware d'authentification (auth)
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Route de la récupération d'un seul élément de la liste de Sauces en vente protégée avec le middleware d'authentification (auth)
router.get('/:id', auth, sauceCtrl.getOneSauce);

// Route de la récupération de la liste de Sauces en vente protégée avec le middleware d'authentification (auth)
router.get('/', auth, sauceCtrl.getAllSauce);

// Route pour liker ou disliker une sauce protégée avec le middleware d'authentification (auth)
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;