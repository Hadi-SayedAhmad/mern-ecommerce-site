import { Container, Row, Col } from "react-bootstrap";

function Footer() {
    const currYear = new Date().getFullYear();
    return (
        <footer className="bg-dark text-light p-3 text-center">
            <Container>
                <Row>
                    <Col>
                        <h5>Hadi's Shop &copy; {currYear} </h5>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer;