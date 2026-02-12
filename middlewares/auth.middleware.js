import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import user from '../models/user.model.js';


// Example for what purpose this middleware.?
// Someone is making a request to get user details -> authorize middleware -> verify -> if valid -> next -> get user details.
const authorize = async (req, res, next) => {
    try {
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) {
            return res.status(401).json({
                message: 'Unauthorizedkkk'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const User = await user.findById(decoded.userId);
        
        if(!User) {
            return res.status(401).json({
                message: 'Unauthorizeddd'
            });
        }

        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorizedsss',
            error: error.message
        });
    }
};

export default authorize;