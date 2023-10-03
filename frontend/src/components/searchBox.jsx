import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";


const SearchBox = () => {
    const navigate = useNavigate();
    const {keyword: urlKeyword} = useParams();
    const [keyword, setKeyword] = useState(urlKeyword || "");
    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate("/");
        }
    }
    return (
        <Form onSubmit={submitHandler} className="d-flex">
            <Form.Control autocomplete='off' type="text" name="q" onChange={(e) => setKeyword(e.target.value)} value={keyword} placeholder="Search Products..." className="me-2 p-1" ></Form.Control>
            <Button type="submit" variant="outline-light" className="px-2 py-1">Search</Button>
        </Form>
    )
}

export default SearchBox;