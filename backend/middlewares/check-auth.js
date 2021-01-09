const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(req.headers.authorization);
        const decodedToken = jwt.verify(token, "This is most be very long string here");
        req.userData = {
            userId: decodedToken.userId,
            email: decodedToken.email
        }
        next()
    } catch(err) {
        res.status(401).json({
            message: 'Auth Failed'
        })
    }
}