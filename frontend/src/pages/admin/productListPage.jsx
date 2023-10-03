import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa"
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from "../../slices/productsApiSlice";
import {toast} from "react-toastify"
import Message from "../../components/Message";
import Loader from "../../components/Loader";
// import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";

const ProductListPage = () => {
    const {currPage} = useParams();
    const { data, isLoading, error, refetch } = useGetProductsQuery({currPage});
    const [createProduct, {isLoading: loadingCreate}] = useCreateProductMutation();
    const [deleteProduct, {isLoading: loadingDelete}] = useDeleteProductMutation();
    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure that you want to delete this product?")) {
            try {
                console.log(id);
                await deleteProduct(id);
                refetch();
                toast.success("Product Deleted!");
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }
    const createProductHandler = async () => {
        if (window.confirm("Are you sure you want to create a new product?")) {
            try {
                await createProduct();
                
                toast.success("A new product created! Do not forget to edit it.")
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
        
        
        
    }
    // useEffect(() => {
    //     if (products) {
    //         refetch();
    //     }
        
    // }, [products])
    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className="text-end">
                    <Button onClick={createProductHandler} className="btn-sm my-3">
                        <FaEdit />  Create New Product
                    </Button>
                </Col>
            </Row>
            {loadingCreate && <Loader />}
            {loadingDelete && <Loader />}
            {isLoading ? <Loader /> : error ? (<Message variant="danger">{error?.data?.message || error.error}</Message>) : (
                <>
                    <Table striped bordered hover responsive className="my-2">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th>STOCK</th>
                                <th>OPS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.products.map((product) => {
                                return (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>${product.price}</td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                        <td>{product.countInStock}</td>
                                        <td>
                                            <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                <Button type="button" className="btn-sm me-lg-2"><FaEdit /></Button>
                                            </LinkContainer>
                                            <Button style={{color: "white"}} variant="danger" onClick={() => deleteHandler(product._id) } type="button" className="btn-sm my-2"><FaTrash /></Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                    <Paginate pages={data.pages} page={data.currPage} isAdmin={true} />
                </>
            )}
        </>
    )

}

export default ProductListPage;