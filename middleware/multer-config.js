/*POUR QUE l'UTILISATEUR PUISSE CHARGER UNE PHOTO DE L'OBJET QU'il VEUT VENDRE*/

//Configuration du middleware de gestion des fichiers
const multer = require('multer');

//Génère l'extension du fichier
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'

};

//La fonction destination indique à multer d'enregistrer les fichiers dans le dossier images
//La fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores
//Et ajoute un timestamp pour rendre le fichier encore plus unique possible
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.'+ extension);

    }
});

module.exports = multer({storage}).single('image');
//Fichier unique et il s'agit que d'images