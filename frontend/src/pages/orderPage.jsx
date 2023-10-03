import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap"
import "../assets/styles/bootstrap.custom.css"
import { useDeliverOrderMutation ,useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery } from "../slices/ordersApiSlice";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { toast } from "react-toastify";
import { useEffect } from "react";
import {  } from "../slices/productsApiSlice";
function OrderPage() {

    const { id: orderId } = useParams();

    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId); //refetch will comes in if the order changed to paid, then we want to refetch the order details without refreshing the page
    
    
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer(); // connect us with paypal api mentioning someinfo like client id and the currency and we use isPending to wait for the payment to complete
    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery()
    const { userInfo } = useSelector((state) => {
        return state.auth;
    })
    useEffect(() => {
        //connecting our client id with paypal
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        "client-id": paypal.clientId,
                        currency: "USD"
                    }
                });
                paypalDispatch({
                    type: "setLoadingStatus",
                    value: "pending" // setup as pending initially
                })
            }
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPayPalScript();
                }

            }

        }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal])
    // console.log(order);

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({ orderId, details });
                refetch();
                toast.success("Payment Successful!")
            } catch (err) {
                toast.error(err?.data?.message || err.message)
            }
        })
    }
    // async function onApproveTest() {
    //     await payOrder({ orderId, details: {payer: {}} });
    //     refetch();
    //     toast.success("Payment Successful!")
    // }
    function onError(err) {
        toast.error(err.message)
    }
    function createOrder(data, actions) { // creating our order inside paypal: after this, onApprove comes in
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice,
                    }
                }
            ]
        }).then((orderId) => { // this is the order id inside paypal
            return orderId;
        })
    }
    // so steps for paypal:
    //1. initialize setup: dispatch + client id + create setup script in useEffect
    //2. create paypal buttons from paypal package of react
    //3. now once the button is triggered, order gets created in paypal using create Order function... once paypal approve the payment, onApprove will be triggered to update the isPaid field in database and inform the user that everything is okay!
    // const [updateStock, {isLoading: loadUpdateStock}] = useUpdateStockMutation();



    async function deliverOrderHandler() {
        try {
            // await updateStock(order.orderItems);
            await deliverOrder(orderId);
            refetch();
            toast.success("Order Delivered!")
            
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }
    return (
        <>
            {
                isLoading ? (<Loader />) : error ? (<Message variant="danger">{error?.data?.message || error.error}</Message>) : (<>

                    <h1>Order ID: <span style={{ fontSize: "0.85rem" }}>{order._id}</span></h1>
                    <Row>
                        <Col md={8}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2>Shipping</h2>
                                    <p>
                                        <strong>Name: </strong> {order.user.name}
                                    </p>
                                    <p>
                                        <strong>Email: </strong> {order.user.email}
                                    </p>
                                    <p>
                                        <strong>Address: </strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                    </p>
                                    {order.isDelivered ? (
                                        <Message variant="success">Delivered on {order.deliveredAt}</Message>
                                    ) : (
                                        <Message variant="danger">Not Delivered Yet.</Message>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h2>Payment Method</h2>
                                    <p>
                                        <strong>Method: </strong>{order.paymentMethod}
                                    </p>
                                    {order.isPaid ? (
                                        <Message variant="success">Paid on {order.paidAt}</Message>
                                    ) : (
                                        <Message variant="danger">Not Paid Yet.</Message>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h2>Order Items</h2>
                                    {
                                        order.orderItems.map((i, index) => {
                                            return (
                                                <ListGroup.Item key={index}>
                                                    <Row>
                                                        <Col md={2}>
                                                            <Image src={i.image} alt={i.name} fluid rounded></Image>
                                                        </Col>
                                                        <Col>
                                                            <Link to={`/product/${i.product}`}>{i.name}</Link>
                                                        </Col>
                                                        <Col md={4}>
                                                            {i.qty} x ${i.price} = ${(i.qty * i.price).toFixed(2)}
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            )
                                        })
                                    }
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>

                        <Col md={4}>
                            <Card>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <h2>Order Summary</h2>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Items Price: </Col>
                                            <Col>
                                                ${order.itemsPrice}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Shipping Fees: </Col>
                                            <Col>
                                                ${order.shippingPrice}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Tax: </Col>
                                            <Col>
                                                ${order.taxPrice}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Total: </Col>
                                            <Col>
                                                ${order.totalPrice}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {!order.isPaid && (
                                        <ListGroup.Item>
                                            {loadingPay && (<Loader></Loader>)}
                                            {isPending ? (<Loader></Loader>) : (
                                                <div>
                                                    {/* <Button onClick={onApproveTest} style={{ marginBottom: "10px" }}>Test Pay Order</Button> */}
                                                    <div>
                                                        <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>

                                                    </div>
                                                </div>
                                            )}
                                        </ListGroup.Item>
                                    )}



                                    {loadingDeliver && <Loader />}
                                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                        <ListGroup.Item>
                                            <Button type="button" className="btn btn-block" onClick={deliverOrderHandler}>Mark As Delivered</Button>
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </>)
            }
        </>
    )

}

export default OrderPage;