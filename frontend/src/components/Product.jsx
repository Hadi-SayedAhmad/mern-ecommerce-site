import { Card } from "react-bootstrap";
import { Link } from 'react-router-dom';
import Rating from "./Rating";
function Product(props) {
    return (
        <Card className="p-1">
            <Link to={`/product/${props._id}`}>
                <Card.Img src={props.image}></Card.Img>
            </Link>

            <Card.Body>
                <Link to={`/product/${props._id}`}>
                    <Card.Title as="p" className="product-title"><strong>{props.name}</strong></Card.Title>
                </Link>
                <Card.Text as="p">
                    {props.category}
                </Card.Text>
                <Card.Text as="div">
                    <Rating value={props.rating} text={` ${props.numReviews} reviews `} />
                </Card.Text>
                <Card.Text as="h5">
                    ${props.price}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

// const Product = ({product}) => {
//     console.log(product);
// } //for the second method we need to destructure


export default Product;