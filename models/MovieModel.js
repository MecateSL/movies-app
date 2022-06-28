import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import slug from 'slug';
const UserModel = mongoose.model('User');

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    title: { type: String, unique: true, index: true },
    description: String,
    images: [String],
    stock: Number,
    rentalPrice: mongoose.Decimal128,
    salePrice: mongoose.Decimal128,
    available: Boolean,
    likesCount: {type: Number, default: 0},
    slug: { type: String, lowercase: true, unique: true },
}, {timestamps: true});

MovieSchema.plugin(uniqueValidator);

MovieSchema.pre('validate', function(next) {
    if (!this.slug) {
        this.slug = slug(this.title);
    }

    next();
})

MovieSchema.methods.updateLikesCount = async function() {
    const movie = this;

    const count = await UserModel.count({likes: {$in: [movie._id]}});

    movie.likesCount = count;
    
    return movie.save();
}

mongoose.model('Movie', MovieSchema);