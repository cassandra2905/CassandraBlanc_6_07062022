//importer mongoose pour le schéma user (utilisateur)
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/*Schéma utilisateur ("unique:true" ainsi que le package mongoose-unique-validator évitent 
d'avoir deux utilisateurs qui utilisent la même adresse mail)*/
const userSchema = mongoose.Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true}
});

userSchema.plugin(uniqueValidator);

//Exporter le schéma sous forme de modèle
module.exports = mongoose.model('User', userSchema);