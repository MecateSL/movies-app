import mongoose from 'mongoose';
const UserModel = mongoose.model('User');

export default async function returnTrueIfAdmin(req) {
    if (!req.auth) return false;
    
    const user = await UserModel.findOne({_id: req.auth.id});
    return user.isAdministrator;
}