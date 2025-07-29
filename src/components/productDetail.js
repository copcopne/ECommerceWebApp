import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import Apis, { endpoints } from "../configs/Apis";
import Empty from "./Emtpy";
import MySpinner from "./layouts/MySpinner";

const ProductDetail = () => {
  const [loading, setLoading] = useState();
  const [empty, setEmpty] = useState(false);
  const [product, setProduct]= useState({});
  const [q] = useSearchParams();
  
  const loadProduct = async () => {
    try {
      setLoading(true);
      let pId = q.get("id");
      let res = await Apis.get(endpoints['productDetail'](pId));
      if (!res.data)
        setEmpty(true);
      else setProduct(res.data);
    } catch (error) {
      setEmpty(true);
      console.error(error);
    } finally {
      setLoading(false);
    };
  };
  useEffect(() => {
    loadProduct();
  }, []);

  if (empty)
    return <Empty />
  return <>
    {loading && <MySpinner />}
    <Container className="my-4">
      <Row>
        <Col md={5} xs={4}>
          <Image
            src={product.imageURL}
            fluid
            className="rounded"
          />
        </Col>
        <Col md={7} xs={8}>
          <h1>{product.productName}</h1>
          <p>
            <strong className="text-danger">{product.price} VNĐ</strong>{'  '}
            <strong className="text-info">69 lượt mua</strong>{'  '}
            <strong className="text-info">96 lượt đánh giá</strong>{'  '}
          </p>
          <hr />
          <h2>Mô tả sản phẩm</h2>
          <p>{product.description}</p>
          <hr />
          <Button variant="outline-primary" className="me-2 m-2">
            Thêm vào giỏ hàng
          </Button>
          <Button variant="success" className="me-2 m-2">Mua ngay</Button>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={1} xs={3} className="mt-2">
          <Image
            src="https://res.cloudinary.com/dq3dtj8lz/image/upload/v1746975885/mjkzffehkm2gws3b8ybl.jpg"
            fluid
            className="rounded-circle"
          />
        </Col>
        <Col md={3} xs={9} className="mt-2">
          <h5>Tên cửa hàng</h5>
          <Button variant="outline-secondary" className="me-2">
            Xem cửa hàng
          </Button>
        </Col>
        <Col md={4} xs={6} className="mt-2">
          <div className="d-flex justify-content-between">
            <p className="mb-1">Lượt đánh giá:</p>
            <p className="mb-1 fw-bold text-danger">69,96k</p>
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Điểm đánh giá:</p>
            <p className="mb-1 fw-bold text-danger">4.9 ⭐</p>
          </div>
        </Col>
        <Col md={4} xs={6} className="mt-2">
          <div className="d-flex justify-content-between">
            <p className="mb-1">Sản phẩm:</p>
            <p className="mb-1 fw-bold text-danger">1000</p>
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-1">Tham gia vào:</p>
            <p className="mb-1 fw-bold text-danger">Tháng 7, 2025</p>
          </div>
        </Col>
      </Row>

      <div className="mt-4">
        <h3>Các sản phẩm tương tự</h3>
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

      <div className="mt-4">
        <h3>Đánh giá và bình luận</h3>
        <Row className="mt-3">
          <Col md={1} xs={3}>
          <Image
            src="https://res.cloudinary.com/dq3dtj8lz/image/upload/v1746975885/mjkzffehkm2gws3b8ybl.jpg"
            fluid
            className="rounded-circle"
          />
          </Col>
          <Col md={11} xs={9} className="mt-2">
          <h5>Tên người dùng</h5>
          <p>số sao nếu có</p> 
          <small>Thời gian mua</small>
          <p>bla bla bla ble ble ble</p>
        </Col>
        </Row>
      </div>
    </Container>
  </>;
};
export default ProductDetail;