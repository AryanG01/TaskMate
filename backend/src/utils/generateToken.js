import jwt from 'jsonwebtoken';

// Generate token using userId
const generateToken = (id) => {
    //token must be returned to client
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

export default generateToken;