
import { Row, Col } from "react-bootstrap"
import Product from "../components/Product"
// import axios from "axios"
//instead we want now to fetch products using rtk
import Paginate from "../components/Paginate"
import { useGetProductsQuery } from "../slices/productsApiSlice"
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useParams } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel"

function HomePage() {
    // const [products, setProducts] = useState([]);

    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         const { data } = await axios.get("/api/products");
    //         // console.log(data);
    //         setProducts(data);
    //     }
    //     fetchProducts();
    // }, [])

    //useEffect is  a react hook to do something based on some specfic variables which are dependencies... these dependencies are contained inside the 2nd parameter in an array and the first parameter is the code we need to execute depending on these dependencies. if array is empty, then the code will run on the initial render of the page only and this is popular when we make get requests... if we don't have 2nd parameter, we will execute the code on all renders of the component.
    const { currPage, keyword } = useParams()
    const { data, isLoading, error } = useGetProductsQuery({ currPage, keyword });



    return (
        <>
            {
                !keyword ? <ProductCarousel /> : (
                    <Link to="/" className="btn btn-light mb-4">
                        Go Back
                    </Link>)
            }
            {
                isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">
                        {error?.data?.message || error.error}
                    </Message>
                ) : (
                    <>
                        
                        <h1>Latest Products</h1>
                        <Row>
                            {
                                data.products.map((product) => {
                                    return (
                                        <Col className="mb-3" key={product._id} sm={12} md={6} lg={4} xl={3}>
                                            <Product
                                                {...product} //spread all key value pairs as props
                                            />
                                        </Col>

                                        //ORRR: but you will need to destructure on the parameter of the product component because here we are sending the whole product to the props object so they're nested now!
                                        /* <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                           <Product
                                               product={product} 
                                           />
                                       </Col>  */

                                    )


                                })
                            }

                        </Row>
                        <Paginate pages={data.pages} page={data.currPage} keyword={keyword ? keyword : ""} />
                    </>
                )

            }
        </>
    )
}
export default HomePage;