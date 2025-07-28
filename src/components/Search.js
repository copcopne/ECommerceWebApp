import { Button, Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Search = () => {
    const nav = useNavigate();
    return <>
        <Row className="mt-5">
            <Col md={3} xs={12}>
            <h4>Bộ lọc tìm kiếm</h4>
            <Button>Theo tên sản phẩm</Button>
            <Button>Theo tên cửa hàng</Button>
            <h5>Khoảng giá</h5>
            <p>từ - đến</p>
            <Button>Xóa bộ lọc</Button>
            </Col>
            <Col md={9} xs={12}>

                <Row>
                    <Col md={12} xs={12}>
                    <h2>Kết quả tìm kiếm cho từ khóa -------</h2>
                    </Col>
                    <Col md={2} xs={3} className="p-1">
                        <Link to="/details" className="text-decoration-none text-dark">
                            <Card className="rounded">
                                <Card.Img variant="top" src="https://res.cloudinary.com/dq3dtj8lz/image/upload/v1746975885/mjkzffehkm2gws3b8ybl.jpg" />
                                <Card.Body>
                                    <Card.Title>test</Card.Title>
                                    <Card.Text>VNĐ</Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                </Row>
            </Col>
        </Row>
    </>;
};
export default Search;