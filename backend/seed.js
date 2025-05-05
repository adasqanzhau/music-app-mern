import mongoose from "mongoose";
import dotenv from 'dotenv';
import User from './models/users.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            console.log("Admin user already exists");
            return;
        }

        const adminUser = new User({
            username: 'admin',
            password: 'Admin@123',
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.log('Error creating admin:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedAdmin();