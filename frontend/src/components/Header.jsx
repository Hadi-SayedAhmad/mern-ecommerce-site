import { Badge, Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from 'react-icons/fa'

import { LinkContainer } from "react-router-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { unSetCredentials } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import SearchBox from "./searchBox";
function Header() {
    const { cartItems } = useSelector((state) => {
        return state.cart 
    })
    const { userInfo } = useSelector((state) => {
        return state.auth 
    });
    const nbrItemsInCart = cartItems.length;
    const [logout] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logoutHandler= async () => {
        try {
            await logout().unwrap();
            dispatch(unSetCredentials());
            navigate("/login")
        } catch (err) {
            console.log(err);
        }
        
        
        
    }

    return (
        <header >
            <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand >
                            {/* <img src={logo} alt="logo" width="100" height="50"/> */}
                            Hadi's Shop
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle></Navbar.Toggle>

                    <Navbar.Collapse id="basic-navbar-nav ">
                        <Nav className="ms-auto mt-1">
                            <SearchBox />
                            <LinkContainer to="/">
                                <Nav.Link>Home</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/cart">
                                <Nav.Link><FaShoppingCart /> Cart { nbrItemsInCart > 0 ? (<Badge pill bg="danger">{cartItems.reduce((a, i) => {
                                    return (a + i.qty)
                                }, 0)}</Badge>) : null } </Nav.Link>
                            </LinkContainer>

                            {userInfo ? (
                                <NavDropdown title={userInfo.name}>
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>My Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    
                                        <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                    
                                </NavDropdown>
                            ) : (<LinkContainer to="/login">
                                <Nav.Link><FaUser /> Login</Nav.Link>
                            </LinkContainer>)}
                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title="Admin" id="adminMenu">
                                    <LinkContainer to="/admin/orderlist">
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/productlist">
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/userlist">
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>

                </Container>
            </Navbar>
        </header>
    )
}

export default Header