import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";

const ProductCarousel = () => {
    const {data: products, isLoading: loadingCarousel} = useGetTopProductsQuery();
    // console.log(products);
    return (
        <>
            {!loadingCarousel && (
                <Carousel className="bg-primary mb-4"  >
                    {products.map((product) => {
                        return (
                            <Carousel.Item key={product._id}>
                            <Link to={`/product/${product._id}`}>
                                <Image src={product.image} alt={product.name} fluid />
                                <Carousel.Caption className="carousel-caption">
                                    <h2>{product.name}. ${product.price} Only!</h2>
                                </Carousel.Caption>
                            </Link>
                        </Carousel.Item>
                        )
                        
                    })}
                </Carousel>
            )}
        </>
    )
}

export default ProductCarousel;