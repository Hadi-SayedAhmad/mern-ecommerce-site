import { Link, useNavigate } from "react-router-dom"
import { Row, Col, ListGroup, Image, Form, Button, Card } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Message from "../components/Message"
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import "../assets/styles/bootstrap.custom.css"
const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => {
        return (
            state.cart
        );
    });
    // console.log(cartItems);

    function addToCartHandler(item, qty) {
        dispatch(addToCart({ ...item, qty }));
    }

    function removeFromCartHandler(id) {
        dispatch(removeFromCart(id));
    }

    function checkOutHandler() {
        navigate("/login?redirect=/shipping");
    }


    return (
        <>
            <Row>
                <Col md={8}>
                    <h1 style={{ marginBottom: "20px" }}>Shopping Cart</h1>
                    {cartItems.length === 0 ? (
                        <Message>
                            Your cart is empty. <Link to="/">Go Back</Link>
                        </Message>) : (<ListGroup variant="flush">
                            {
                                cartItems.map((item) => {
                                    return (
                                        <ListGroup.Item key={item._id}>
                                            <Row>
                                                <Col md={2}>
                                                    <Image src={item.image} alt={item.name} rounded fluid />
                                                </Col>
                                                <Col md={3}>
                                                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={2}>
                                                    ${item.price}
                                                </Col>
                                                <Col md={2}>
                                                    <Form.Control
                                                        as="select"
                                                        value={item.qty}
                                                        onChange={(e) => { addToCartHandler(item, Number(e.target.value)) }}
                                                    >
                                                        {[...Array(item.countInStock).keys()].map((x) => {
                                                            return (
                                                                <option key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </option>
                                                            )
                                                        })}
                                                    </Form.Control>
                                                </Col>
                                                <Col md={2}>
                                                    <Button variant="light" className="mt-2 mt-md-0" onClick={() => removeFromCartHandler(item._id)}><FaTrash ></FaTrash></Button>

                                                </Col>
                                            </Row>
                                        </ListGroup.Item>

                                    )
                                })
                            }

                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>Subtotal: {cartItems.reduce((acc, item) => {
                                    return acc + item.qty;
                                }, 0)} items</h3>
                                <h4>${cartItems.reduce((acc, item) => {
                                    return (acc + (item.qty * item.price))
                                }, 0).toFixed(2)}</h4>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button disabled={cartItems.length === 0} onClick={checkOutHandler}>Proceed To Checkout</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
           
        </>
    )
}

export default CartPage;