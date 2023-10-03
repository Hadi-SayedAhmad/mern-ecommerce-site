import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

//@desc create new order
//@route POST /api/orders
//@access Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.send(400);
        throw new Error("No order items!");
    }

    const order = new Order({
        orderItems: orderItems.map((x) => {
            return ({
                ...x, product: x._id, _id: undefined
            })
        }),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

})

//@desc create loggedin user orders
//@route GET /api/orders/myorders
//@access Private
const getMyOrders = asyncHandler(async (req, res) => {
    const myOrders = await Order.find({ user: req.user._id });
    res.status(200).json(myOrders);
})

//@desc get order by id
//@route GET /api/orders/:id
//@access Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name email"); //transform the user field into an object and add to the user id, the name and email fields from the reference User model
    if (order) {
        res.status(200).json(order);
    } else {
        res.status(404)
        throw new Error("Order Not Found!");
    }
})

//@desc update order to paid 
//@route PUT /api/orders/:id/pay
//@access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order Not Found!")
    }


})



//@desc update order to Delivered 
//@route PUT /api/orders/:id/deliver
//@access Private/admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        const orderItems = order.orderItems;
        orderItems.forEach(async (orderItem) => {
            const product = await Product.findById(orderItem.product)
            product.countInStock = product.countInStock - orderItem.qty
            const updatedProduct = await product.save();
        });
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found!");
    }
})

//@desc get all orders
//@route GET /api/orders
//@access Private/admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "id name");
    res.status(200).json(
        orders
    )
})

export {

    getOrderById,
    getMyOrders,
    updateOrderToDelivered,
    updateOrderToPaid,
    addOrderItems,
    getOrders
};