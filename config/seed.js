import mongoose from 'mongoose';
import '../models/UserModel.js';
const UserModel = mongoose.model('User');

const admin = new UserModel();
console.log(admin);
admin.username = 'admin';
admin.email = 'admin@mail.com';
admin.isAdministrator= true;
admin.setPassword('123');

admin.save().then(() => {
    console.log({admin: admin.toAuthJSON()})
});