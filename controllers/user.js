const { hashSync } = require('bcrypt');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const validator = require('validator');

//Enregistrement/création de nouveaux utilisateurs
//Fonction signup qui va crypter le mot de passe et qui va créer un nouvel user (utilisateur)
exports.signup = (req, res, next) => {
    bcrypt
        .hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            user.email = validator.escape(user.email);

            if (validator.isEmail(user.email)) {
                user
                    .save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé ! ' }))
                    .catch(error => res.status(400).json({ error }));
            } else {
                res.status(400).json({ error: "Adresse mail invalide" });
            }
        })
        .catch(error => res.status(500).json({ hash: error }));
};

/*VERIFICATION DES INFORMATIONS D'IDENTIFICATION D'UN UTILISATEUR*/


//On récupère l'utilisateur de la base qui correspond à l'adresse mail entrée
//Si jamais l'email n'est pas bon et qu'on ne reçoit pas de user on renvoie le message 'utilisateur non trouvé'
//On compare le mot de passe entré avec le hash qui est gardé dans la base de données
//Si la comparaison n'est pas bonne on renvoie le message 'utilisateur non trouvé !'
//Si la comparaison est bonne on va lui renvoyer son userId

//On créer un TOKEN et une chaîne aléatoire secrete afin que l'utilisateur puisse se connecter qu'une seule fois à son compte
//La validité ici est temporaire et d'une durée de 24h
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN,
                            { expiresIn: '24h' }

                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};