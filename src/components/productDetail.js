import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Image, Row } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import Apis, { endpoints } from "../configs/Apis";
import Empty from "./Emtpy";
import MySpinner from "./layouts/MySpinner";
import { UserContext } from "../configs/Contexts";

const ProductDetail = () => {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState();
  const [empty, setEmpty] = useState(false);
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [store, setStore] = useState({});
  const [q] = useSearchParams();
  let pId = q.get("id");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [pageReview, setPageReview] = useState(1);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      let res = await Apis.get(endpoints['productDetails'](pId));
      if (!res.data)
        setEmpty(true);
      else {
        setProduct(res.data);
        setStore(res.data.storeId);
      }
    } catch (error) {
      setEmpty(true);
      console.error(error);
    } finally {
      setLoading(false);
    };
  };
  const fetchRelatedProducts = async () => {
    if (page !== 0)
      try {
        setLoading(true);
        let url = `${endpoints['products']}?page=${page}&categoryId=${product.categoryId.categoryId}`
        let res = await Apis.get(url);
        if (res.data.length === 0)
          setPage(0);
        else {
          let data = res.data.filter(
            item =>
              item.productId !== product.productId &&
              !relatedProducts.some(p => p.productId === item.productId)
          );
          setRelatedProducts([...relatedProducts, ...data]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
  };
  const loadMore = () => {
    if (!loading && page !== 0)
      setPage(page + 1);
  };
  const fetchReviews = async () => {
    if(pageReview !== 0)
      try {
        let url = `${endpoints['productReviews'](pId)}?page=${pageReview}`;
        let res = await Apis.get(url);
        console.info(res.data);
      } catch (error) {
        console.error(error);
      } finally {

      }
  };
  useEffect(() => {
    fetchProduct();

    setPage(1);
    setRelatedProducts([]);
    
    setPageReview(1);
    setReviews([]);
    fetchReviews();
  }, [q]);

  useEffect(() => {
    fetchRelatedProducts();
  }, [product, page]);

  if (empty)
    return <Empty />
  return <>
    {loading && <MySpinner />}
    <Container className="my-4">
      <span className="fs-4 fw-medium">
        <Link to="/" className="text-dark" style={{ cursor: "pointer", textDecoration: "none" }}>
          Trang chủ
        </Link>
        &nbsp;&gt;&nbsp;
        <Link to={`/?category=${product?.categoryId?.categoryId}`} className="text-dark" style={{ cursor: "pointer", textDecoration: "none" }}>
          {product?.categoryId?.categoryName}
        </Link>
      </span>
      <Row className="py-3">
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
            src={store.avatarURL}
            fluid
            className="rounded-circle"
          />
        </Col>
        <Col md={3} xs={9} className="mt-2">
          <h5>{store.storeName}</h5>
          <Link to={`/store?id=${store.storeId}`} className="btn btn-primary">
            Xem cửa hàng
          </Link>
        </Col>
        <Col md={8} xs={12} className="mt-2">
          <div className="d-flex">
            <p className="mb-1">Mô tả cửa hàng:</p>
            <p className="mb-1 mx-3 fw-bold">{store.description}</p>
          </div>
        </Col>
      </Row>

      <div className="mt-4">
        <span className="fs-4 fw-medium">Các sản phẩm khác cùng danh mục</span>

        <div className="d-flex overflow-auto mt-3 pb-2" style={{ gap: "1rem" }}>
          {relatedProducts.length > 0 ? (
            <>
              {relatedProducts.map((product) => (
                <div key={`r${product.productId}`} style={{ minWidth: "160px", flexShrink: 0 }}>
                  <Link to={`/details?id=${product.productId}`} className="text-decoration-none text-dark">
                    <Card className="rounded h-100 d-flex flex-column justify-content-between">
                      <Card.Img variant="top" className="rounded" src={product.imageURL} />
                      <Card.Body>
                        <Card.Title>{product.productName}</Card.Title>
                        <Card.Text>{product.price} VNĐ</Card.Text>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="mt-2"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          So sánh
                        </Button>
                      </Card.Body>
                    </Card>
                  </Link>
                </div>
              ))}

              {page !== 0 && (
                <div style={{ minWidth: "160px", flexShrink: 0 }}>
                  <Button
                    onClick={loadMore}
                    variant="link"
                    className="text-decoration-none text-dark d-flex align-items-center justify-content-center h-100"
                  >
                    <Card className="rounded h-100 text-center border border-primary">
                      <Card.Body className="d-flex align-items-center justify-content-center">
                        <strong className="text-primary">Xem thêm →</strong>
                      </Card.Body>
                    </Card>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div
              className="w-100 d-flex flex-column justify-content-center align-items-center"
              style={{ minHeight: "150px" }}
            >
              <div className="text-center text-muted">
                <i className="bi bi-box-seam fs-1 mb-3 d-block"></i>
                <h4 className="fw-semibold">Không có sản phẩm nào</h4>
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="mt-4">
        <span className="fs-4 fw-medium">Viết đánh giá</span>
        <Row className="mt-3">
          <Col md={1} xs={3}>
            <Image
              src={user?.avatarURL}
              fluid
              className="rounded-circle"
            />
          </Col>
          <Col md={11} xs={9}>
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`bi ${star <= rating ? "bi-star-fill text-warning" : "bi-star text-secondary"} fs-4`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setRating(star)}
                  ></i>
                ))}
                {rating !== 0 &&
                  <Button
                    onClick={() => setRating(0)}
                    variant="link"
                    style={{ textDecoration: "none" }}>
                    Xóa đánh giá
                  </Button>}
              </div>
              <Form >
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Viết đánh giá của bạn..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <div className="text-end mt-2">
                  <Button variant="primary">
                    Gửi đánh giá
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </div>


      <div className="mt-4">
        <span className="fs-4 fw-medium">Đánh giá và bình luận</span>
        <Row className="mt-3">
          <Col md={1} xs={3}>
            <Image
              src=""
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