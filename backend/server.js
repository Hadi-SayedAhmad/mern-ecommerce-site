import path from "path"
import express from "express";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/orderRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser()); // this will allow us to access req.cookies
connectDB();
const port = process.env.PORT || 5000;


app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/upload", uploadRoutes)

app.use("/api/config/paypal", (req, res)=>{
    res.send({
        clientId: process.env.PAYPAL_CLIENT_ID
    })
})

const __dirname = path.resolve() //setting dirname to current directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads"))) // it's a middleware used to make files static so they can be used from server to frontend

//we do this because we need the server to run the built version of react app not locally on local host 3000
if (process.env.NODE_ENV === "production") {
    //set static folder
    app.use(express.static(path.join(__dirname, "/frontend/build")))
    //we need any route that's not an api to be redirected to index.html
    app.get("*", (req, res) => 
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    ); 

} else {
    app.get("/", (req, res) => {
        res.send("API is running...")
    }) 
}

app.use(notFound); //will be invoked when no route handler preceding it in the middleware stack matches the incoming request's URL
app.use(errorHandler);
app.listen(port, () => {
    console.log("Server is live!");
})
