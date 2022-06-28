import mongoose from 'mongoose';

const dbUser = 'moviesAppDBUser';
const dbPass = 'moviesAppDBPass';
// const dbHost = '0.0.0.0';
// const dbPort = '33807';
const MONGOURI = `mongodb+srv://${dbUser}:${dbPass}@cluster0.6uvam.mongodb.net/?retryWrites=true&w=majority/`;

const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(MONGOURI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default InitiateMongoServer;