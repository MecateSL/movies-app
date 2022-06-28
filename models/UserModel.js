import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { secret } from '../config/index.js';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    hash: String,
    salt: String,
    isAdministrator: {
        type: Boolean,
        default: false
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
}, {timestamps: true});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function(){
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000)
    }, secret);
}

UserSchema.methods.toAuthJSON = function(){
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT()
    }
}

UserSchema.methods.like = function(movieId) {
    if (this.likes.indexOf(movieId) === -1) {
        this.likes.push(movieId);
    } 

    return this.save();
}

UserSchema.methods.unlike = function(movieId) {
    this.likes.remove(movieId);
    return this.save();
}

UserSchema.methods.isLiked = function(movieId) {
    return this.likes.indexOf(movieId) !== -1;
}

mongoose.model('User', UserSchema);