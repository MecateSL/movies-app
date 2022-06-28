import { expressjwt as jwt } from 'express-jwt';
import { secret } from '../config/index.js';

const getTokenFromHeader = (req) => {
    if ( 
        req.headers.authorization
         && 
        req.headers.authorization.split(' ')[0] === 'Token' 
        ) {
            return req.headers.authorization.split(' ')[1];
        }

    return null;
}

export const auth = {
    required: jwt({
        secret: secret,
        userProperty: 'payload',
        getToken: getTokenFromHeader,
        algorithms: ["HS256"],
    }),
    optional: jwt({
        secret: secret,
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getTokenFromHeader,
        algorithms: ["HS256"],
    })
}