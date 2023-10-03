import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
//@desc Fetch all products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
    //now for efficiency purposes we can make pagination!

    //how much do i want each page to have products
    const pageSize = process.env.PAGINATION_LIMIT;
    //in what page am i right now (get this from frontend in query string)
    const currPage = Number(req.query.currPage) || 1;
    
    //i need also a keyword for search functionality... we will search based on this keyword case in sensitive
    const keyword = req.query.keyword ? {name: {$regex: req.query.keyword, $options: "i"}} : {}
    
    //i need to know how much products document i have in the db
    const count = await Product.countDocuments({...keyword});

    
   
   
    //now find products but with the pageSize limit and skipping the products found in the previous page
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (currPage - 1));
    res.json({
        products,
        currPage,
        pages: Math.ceil(count / pageSize) // return first smallest nbr greater than count / pageSize
    });
});


//@desc update stock
//@route PUT /api/products
//@access Admin/Private
// const updateProductStock = asyncHandler(async (req, res) => {
//     const orderItems = req.body;
//     orderItems.forEach(async (orderItem) => {
//         try {
//             const product = await Product.findById(orderItem.product)
//             product.countInStock = product.countInStock - orderItem.qty
//             const updatedProduct = await product.save();
//         } catch (error) {
//             res.status(400);
//             throw new Error("Stock didn't update!");
//         }

//     });

//     res.status(200).json("Stock Updated!");
// });

//@desc Fetch single product
//@route GET /api/products/:id
//@access Public

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Resource not found!");
    }
});


//@desc create new product
//@route POST /api/products
//@access Admin/Private
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: "Edit Product Name",
        price: 0,
        category: "Edit Category",
        user: req.user._id, //admin id added this product
        image: "/images/sample.jpg",
        brand: "Edit Brand",

        countInStock: 0,
        numReviews: 0,
        description: "Edit Description"
    })
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);

});


//@desc update a product
//@route PUT /api/products/:id
//@access Admin/Private
const updateProduct = asyncHandler(async (req, res) => {
    const {name, price, description, image, brand, category, countInStock} = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updateProduct);
    } else {
        res.status(404);
        throw new Error("Resource not found!");
    }
    

   
});

//@desc delete a product
//@route Delete /api/products/:id
//@access Admin/Private
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await Product.deleteOne({_id: product._id});
        res.status(200).json({message: "Product Deleted!"});
    } else {
        res.status(404);
        throw new Error("Resource not found!");
    }
})


//@desc create a review
//@route POST /api/products/:id/reviews
//@access Private
const createProductReview = asyncHandler(async (req, res) => {
    const {rating, comment} = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        const alreadyReviewed = product.reviews.find(
            (review) => {
                return review.user.toString() === req.user._id.toString();
            }
        )

        if(alreadyReviewed) {
            res.status(400);
            throw new Error("Product already reviewed!");
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review);
        product.numReviews = product.reviews.length;

        product.rating = product.reviews.reduce((acc, review) => {
            return acc + review.rating
        },0) / product.reviews.length;

        await product.save();
        res.status(201).json({message: "Review Added!"});

    } else {
        res.status(404);
        throw new Error("Resource not found!");
    }

})


//@desc Get top products
//@route GET /api/products/top
//@access Public
const getTopProducts = asyncHandler(async(req,res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(3); // -1 means in descending order
    res.status(200).json(products)
})




export { createProductReview, getProducts, getProductById, deleteProduct, createProduct, updateProduct, getTopProducts};