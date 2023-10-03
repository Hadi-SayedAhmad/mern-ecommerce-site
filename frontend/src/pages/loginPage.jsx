import { Form, Button, Row, Col, FormControl } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import { useLoginMutation } from "../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";


const LoginPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [login, { isLoading }] = useLoginMutation(); // return the mutator function login and other objects
    const { search } = useLocation(); //Returns the current location object, which represents the current URL in web browsers
    const sp = new URLSearchParams(search); // used to extract and parse the query parameters (the part of the URL that comes after the "?" symbol).The “search” property of the location object returns a string containing the query part of the URL
    
    const redirect = sp.get('redirect') || "/" //retrieve the value of a query parameter named "redirect"
    const { userInfo } = useSelector((state) => {
        return state.auth;
    })
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, redirect, navigate])

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect)

        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }

    }

    return (

        <FormContainer>
            <h1>Sign In</h1>
            <Form autoComplete="off" onSubmit={submitHandler}>
                <Form.Group controlId="email" className="my-3">
                    <Form.Label>Email Address</Form.Label>
                    <FormControl type="email" placeholder="Enter email" value={email} onChange={(e) => {
                        return (setEmail(e.target.value))
                    }}></FormControl>
                </Form.Group>
                <Form.Group controlId="password" className="my-3">
                    <Form.Label>Password</Form.Label>
                    <FormControl type="password" placeholder="Enter password" value={password} onChange={(e) => {
                        return (setPassword(e.target.value))
                    }}></FormControl>
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-1" disabled={isLoading}>Sign In</Button>
                {isLoading && <Loader />}
            </Form>
            <Row className="py-3">
                <Col>
                    New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>Register</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginPage;