import mongoose from "mongoose";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
connectDB();

const importData = async () => {
    try {
        // await Order.deleteMany();
        await Product.deleteMany();
        // await User.deleteMany();

        // const insertedUsers = await User.insertMany(users);
        // const adminUser = insertedUsers[0]._id;
        const adminUser = "650b4016157764acf5b71d93";
        const sampleProducts = products.map((p) => {
            return { ...p, user: adminUser }
        })

        await Product.insertMany(sampleProducts);

        console.log("Data Imported Successfully!");
        process.exit()
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }

}

const destroyData = async () => {
    try {
        await Order.deleteMany();
        // await Product.deleteMany();
        // await User.deleteMany();

        console.log("Data Destroyed Successfully :)");
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }

}

if (process.argv[2] === '-d'){
    destroyData();
} else{
    importData();
}
