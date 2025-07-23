import { Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Search = () => {
    const nav = useNavigate();
    return <>
    <h1>Tìm kiếm sản phẩm</h1>
        <Row>
            <Link to="/details" className="text-decoration-none text-dark">
                <Col md={3} xs={6} className="p-1">
                    <Card>
                        <Card.Img variant="top" src="https://res.cloudinary.com/dq3dtj8lz/image/upload/v1746975885/mjkzffehkm2gws3b8ybl.jpg" />
                        <Card.Body>
                            <Card.Title>test</Card.Title>
                            <Card.Text>VNĐ</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Link>
        </Row>
    </>;
};
export default Search;