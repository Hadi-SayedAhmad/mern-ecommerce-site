import { Form, Button, Row, Col,  FormControl } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FormContainer from "../components/FormContainer";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";


const RegisterPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [register, { isLoading }] = useRegisterMutation(); // return the mutator function register and other objects
    const { search } = useLocation(); //Returns the current location object, which represents the current URL in web browsers
    const sp = new URLSearchParams(search); // used to extract and parse the query parameters (the part of the URL that comes after the "?" symbol).The “search” property of the location object returns a string containing the query part of the URL
    const { userInfo } = useSelector((state) => {
        return state.auth;
    })
    const redirect = sp.get("redirect") || "/" //retrieve the value of a query parameter named "redirect"

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, redirect, navigate])

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
        } else {
            try {
                const res = await register({ name, email, password }).unwrap();
                dispatch(setCredentials({ ...res }));
                navigate(redirect)

            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }


    }

    return (

        <FormContainer>
            <h1>Sign Up</h1>
            <Form autoComplete="off" onSubmit={submitHandler}>
                <Form.Group controlId="name" className="my-3">
                    <Form.Label>Name</Form.Label>
                    <FormControl type="text" placeholder="Enter name" value={name} onChange={(e) => {
                        return (setName(e.target.value))
                    }}></FormControl>
                </Form.Group>
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
                <Form.Group controlId="cPassword" className="my-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <FormControl type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => {
                        return (setConfirmPassword(e.target.value))
                    }}></FormControl>
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-1" disabled={isLoading}>Register</Button>
                {isLoading && <Loader />}
            </Form>
            <Row className="py-3">
                <Col>
                    Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>Login</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterPage;