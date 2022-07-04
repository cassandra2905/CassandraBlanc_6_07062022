const jwt = require('jsonwebtoken');

//Middleware d'authentification qui protège les routes sélectionnées 
//vérifie que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes.

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;
        req.userId = { userId: userId };
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: `Requête non authentifiée : ${error}` })
    }
};