import mongoose from 'mongoose';
import '../models/MovieModel.js';
const MovieModel = mongoose.model('Movie');
const UserModel = mongoose.model('User');
import returnTrueIfAdmin from '../config/utils.js';

export const MovieController = {
    all: async (req, res) => {
        const isAdmin = await returnTrueIfAdmin(req);

        if (!isAdmin) {
            await MovieModel.find({ available: true }).then(all => res.json(all))
        }
        else {
            await MovieModel.find().then(all => res.json(all))
        }
    },

    find: async (req, res) => {
        const isAdmin = await returnTrueIfAdmin(req);

        if (!isAdmin) {
            await MovieModel.findOne({ title: req.params.movie, available: true }).then(found => res.json(found))
        } else {
            await MovieModel.findOne({title: req.params.movie}).then(found => res.json(found))
        }
    },

    create: async (req, res, next) => {
        const isAdmin = await returnTrueIfAdmin(req);

        if (!isAdmin) return res.status(403).json({error: 'you are not allowed to do this operation'});

        const { title, description, images, stock, rentalPrice, salePrice, available } = req.body;
        const newMovie = new MovieModel();
        
        newMovie.title = title;
        newMovie.description = description;
        newMovie.images = images;
        newMovie.stock = stock;
        newMovie.rentalPrice = rentalPrice;
        newMovie.salePrice = salePrice;
        newMovie.available = available;

        newMovie.save().then(() => res.json({movie: newMovie})).catch(next);
    },

    update: async (req, res, next) => {
        const isAdmin = await returnTrueIfAdmin(req);

        if (!isAdmin) return res.status(403).json({error: 'you are not allowed to do this operation'});

        const { movie } = req.params;
        const { title, description, images, stock, rentalPrice, salePrice, available } = req.body;
        
        await MovieModel
                    .findOneAndUpdate(
                        {title: movie},
                        {title, description, images, stock, rentalPrice, salePrice, available},
                        {new: true}
                    ).then(updated => res.json(updated));
    },

    like: async (req, res, next) => {
        const { movie: title } = req.params;
        const movieObj = await MovieModel.findOne({ title });
        const movieId = movieObj._id.toString();

        UserModel.findById(req.auth.id).then( function (user) {
            if (!user) { return res.sendStatus(401); }
        
            return user.like(movieId).then(function(){
              return movieObj.updateLikesCount().then(function(movie){
                return res.json({ movie });
              });
            });
          }).catch(next);

    },

    unLike: async (req, res, next) => {
        const { movie: title } = req.params;
        const movieObj = await MovieModel.findOne({ title });
        const movieId = movieObj._id.toString();

        UserModel.findById(req.auth.id).then(function (user) {
            if (!user) { return res.sendStatus(401); }

            return user.unlike(movieId).then(function(){
                return movieObj.updateLikesCount().then(function(movie){
                    return res.json({movie});
                });
            });
        }).catch(next);
    },

    delete: async (req, res, next) => {
        const isAdmin = await returnTrueIfAdmin(req);

        if (!isAdmin) return res.status(403).json({error: 'you are not allowed to do this operation'});

        const { movie } = req.params;
        await MovieModel.findOneAndDelete({title: movie}).then(deleted => res.json(deleted));
    }
}