import mongoose from 'mongoose';
import '../models/UserModel.js';
const UserModel = mongoose.model('User');
import passport from 'passport';
import '../config/passport.js';
import returnTrueIfAdmin from '../config/utils.js';

export const UserController = {
    all: async (req, res) => {
        const isAdmin = await returnTrueIfAdmin(req);

        if (!isAdmin) return res.status(403).json({error: 'you are not allowed to do this operation'});

        await UserModel.find().then(all => res.json(all))
    },

    find: async (req, res) => {
        const isAdmin = await returnTrueIfAdmin(req);

        if (!isAdmin) return res.status(403).json({error: 'you are not allowed to do this operation'});

        await UserModel.findOne({username: req.params.username}).then(found => res.json(found));
    },

    create: async (req, res, next) => {
        const {username, email, password} = req.body;
        const newUser = new UserModel();
        
        newUser.username = username;
        newUser.email = email;
        newUser.setPassword(password);

        newUser.save().then(() => res.json({user: newUser.toAuthJSON()})).catch(next);
    },

    login: async (req, res, next) => {

        if (!req.body.user) return res.status(400).json({message: 'No user data provided'});
        
        if (!req.body.user.email) return res.status(422).json({errors: {email: "can't be blank"}});

        if (!req.body.user.password) return res.status(422).json({errors: {password: "can't be blank"}});
        
        passport.authenticate('local', {session: false}, (err, user, info) => {
            if (err) return next(err);

            if (user) {
                user.token = user.generateJWT();
                return res.json({user: user.toAuthJSON()})
            } 

            return res.status(422).json(info);
        })(req, res, next);
    },

    update: async (req, res, next) => {
        const [ userRequested, userRequesting ]  = [ req.params.username, req.auth.username ];
        const isSameUser = userRequesting === userRequested;
        const isAdmin = await returnTrueIfAdmin(req);
        
        if (!isAdmin && !isSameUser) return res.status(403).json({error: 'you are not allowed to do this operation'});
        
        const userToUpdate = await UserModel.findOne({username: userRequested});
        const {username, email, password} = req.body;

        if (!userToUpdate) return res.status(404).json({error: `user ${userRequested} not found`});

        if (username) {
            userToUpdate.username = username;
        }

        if (email) {
            userToUpdate.email = email;
        }

        if (password) {
            userToUpdate.setPassword(password);
        }

        if (req.body.hasOwnProperty('isAdministrator') && isAdmin) {
            userToUpdate.isAdministrator = req.body.isAdministrator;
        }

        userToUpdate.save().then(() => res.json({user: userToUpdate.toAuthJSON()})).catch(next);
    }
}