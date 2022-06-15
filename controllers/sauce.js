const Sauce = require('../models/sauce');
const fs = require('fs');
const validator = require('validator');


//Fonction servant à enregistrer notre objet sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject?._id;

  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0
  });

  // Sécurisation des données pour la BDD
  // On vérifie si l'echelle heat est un nombre correct
  if (typeof +sauce.heat != 'number') {
    res.status(400).json({ error: "Heat n'est pas un nombre" });
  } else if (+sauce.heat < 1 && +sauce.heat > 10) {
    res.status(400).json({ error: "Heat doit être compris entre 1 et 10 inclus" })
  }

  // On échappe le potentiel code du texte des champs qu'on reçoit
  sauce.name = validator.escape(sauce.name);
  sauce.description = validator.escape(sauce.description);
  sauce.manufacturer = validator.escape(sauce.manufacturer);
  sauce.mainPepper = validator.escape(sauce.mainPepper);

  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

//Fonction servant à modifier notre objet
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

//Fonction servant à supprimer un objet 
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`./images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//Fonction servant à récupérer UN SEUL objet de la liste de sauce en vente
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

//Fonction servant à récupérer la liste de TOUS les objets sauces en vente
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

//Fonction servant à liker ou disliker une sauce
exports.likeSauce = (req, res, next) => {
  Sauce
    .findOne({ _id: req.params.id })
    .then(sauce => {

      // On met un like
      if (req.body.like == 1) {

        // Si il n'a jamais mis de like
        if (!existLike(sauce, req.body.userId)) {
          const newUsersLiked = [...sauce.usersLiked];
          newUsersLiked.push(req.body.userId);

          Sauce
            .updateOne({ _id: req.params.id }, {
              usersLiked: newUsersLiked,
              likes: newUsersLiked.length
            })
            .then(() => res.status(200).json({ message: "Like effectué !" }))
            .catch(error => res.status(400).json({ error }));
        } else {
          res.status(403).json({ error: "Vous avez déjà mis un like à cette sauce!" });
        }
      }

      // On met un dislike
      else if (req.body.like == -1) {

        // Si il n'a jamais mis de dislike
        if (!existLike(sauce, req.body.userId, true)) {
          const newUsersDisliked = [...sauce.usersDisliked];
          newUsersDisliked.push(req.body.userId);

          Sauce
            .updateOne({ _id: req.params.id }, {
              usersDisliked: newUsersDisliked,
              dislikes: newUsersDisliked.length
            })
            .then(() => res.status(200).json({ message: "Dislike effectué !" }))
            .catch(error => res.status(400).json({ error }));
        } else {
          res.status(403).json({ error: "Vous avez déjà mis un dislike à cette sauce!" });
        }
      }

      // On enlève les likes/dislikes
      else if (req.body.like == 0) {
        const newUsersLiked = sauce.usersLiked.filter(id => id != req.body.userId);
        const newUsersDisliked = sauce.usersDisliked.filter(id => id != req.body.userId);

        Sauce
          .updateOne({ _id: req.params.id }, {
            usersLiked: newUsersLiked,
            usersDisliked: newUsersDisliked,
            likes: newUsersLiked.length,
            dislikes: newUsersDisliked.length,
          })
          .then(() => res.status(200).json({ message: "Supression du like et dislike effectuée" }))
          .catch(error => res.status(400).json({ error }));
      }

      // Sinon erreur de chiffre
      else {
        res.status(400).json({ error: "Le chiffre du paramètre like ne correspond pas à ce qui est attendu" });
      }
    })
    .catch(error => res.status(404).json({ error: `Produit non trouvé : ${error}` }));
};

// Vérifie si le like/dislike existe déjà
function existLike(sauce, userId, dislike = false) {
  if (dislike) {
    return sauce.usersDisliked.includes(userId);
  } else {
    return sauce.usersLiked.includes(userId);
  }
}