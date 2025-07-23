import { Badge, Button, ButtonGroup, Col, Container, Image, Row } from "react-bootstrap";

const ProductDetail = () => {
  return <>
    <Container className="my-4">
      <Row>
        <Col md={5} xs={4}>
          <Image
            src="https://res.cloudinary.com/dq3dtj8lz/image/upload/v1746975885/mjkzffehkm2gws3b8ybl.jpg"
            fluid
            className="rounded"
          />
        </Col>
        <Col md={7} xs={8}>
          <h1>Tên sản phẩm</h1>
          <p>
            <strong className="text-danger">Tiền đ</strong>{'  '}
            <strong className="text-info">69 lượt mua</strong>{'  '}
            <strong className="text-info">96 lượt đánh giá</strong>{'  '}
          </p>
          <hr />
          <h2>Mô tả sản phẩm</h2>
          <p>bla bla bla ble ble ble</p>
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
        <h3>Danh sách đánh giá và bình luận</h3>
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