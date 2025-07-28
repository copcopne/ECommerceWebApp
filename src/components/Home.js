import { Badge, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
    return (<>
        <div>
            <h3>Danh mục sản phẩm</h3>
            <Row className="mt-3">
                <Col md={2} xs={4} className="border p-2 text-center">
                    <h3>Danh mục 1</h3>
                </Col>
                <Col md={2} xs={4} className="border p-2 text-center">
                    <h3>Danh mục 1</h3>
                </Col>
                <Col md={2} xs={4} className="border p-2 text-center">
                    <h3>Danh mục 1</h3>
                </Col>
                <Col md={2} xs={4} className="border p-2 text-center">
                    <h3>Danh mục 1</h3>
                </Col>
                <Col md={2} xs={4} className="border p-2 text-center">
                    <h3>Danh mục 1</h3>
                </Col>
                <Col md={2} xs={4} className="border p-2 text-center">
                    <h3>Danh mục 1</h3>
                </Col>
            </Row>
        </div>

        <div className="mt-3">
            <h3>Danh sách sản phẩm</h3>
            <Row className="mt-3">
                <Col md={2} xs={3} className="p-1">
                    <Link to="/details" className="text-decoration-none text-dark">
                        <Card className="rounded">
                            <Card.Img variant="top" className="rounded" src="https://res.cloudinary.com/dq3dtj8lz/image/upload/v1746975885/mjkzffehkm2gws3b8ybl.jpg" />
                            <Card.Body>
                                <Card.Title>test</Card.Title>
                                <Card.Text>VNĐ</Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            </Row>
        </div>
    </>);
}
export default Home;
