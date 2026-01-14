const jw = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers['Authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

    jw.verify(token, process.env.JWT_SECRET, (err, user) => {   
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
};

module.exports =  authenticateToken ;

