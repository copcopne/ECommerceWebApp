import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Image, Modal, Row } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import Apis, { authApis, endpoints } from "../configs/Apis";
import Empty from "./Emtpy";
import MySpinner from "./layouts/MySpinner";
import { MyCartContext, MyToastContext, StoreContext, UserContext } from "../configs/Contexts";
import { FaStar } from "react-icons/fa";
import Review from "./layouts/Review";
import cookie from 'react-cookies'
import ProductModal from "./layouts/ProductModal";

const ProductDetail = () => {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState();
  const [empty, setEmpty] = useState(false);
  const [product, setProduct] = useState({});
  const [otherProduct, setOtherProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [store, setStore] = useState({});
  const [q,] = useSearchParams();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [pageReview, setPageReview] = useState(1);
  const [, myToastDispatch] = useContext(MyToastContext);
  let pId = q.get("id");

  const [show, setShow] = useState(false);
  const [, cartDispatch] = useContext(MyCartContext);
  const [myStore,] = useContext(StoreContext);

  const [showEdit, setShowEdit] = useState(false);
  const handleAddToCart = (p) => {
    let cart = cookie.load("cart") || null;
    if (!cart) {
      cart = {};
    }
    if (p.productId in cart) {
      cart[p.productId]["quantity"]++;
    } else {
      cart[p.productId] = {
        "id": p.productId,
        "name": p.productName,
        "price": p.price,
        "quantity": 1
      }
    };
    cookie.save("cart", cart);
    cartDispatch({
      "type": "update"
    });
    myToastDispatch({
      "type": "set",
      "payload": {
        "variant": "success",
        "message": "Thêm vào giỏ hàng thành công!"
      }
    });
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      let res = await Apis.get(endpoints['product'](pId));
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
    if (pageReview !== 0)
      try {
        setLoading(true);
        let url = `${endpoints['productReviews'](pId)}?page=${pageReview}`;
        let res = await Apis.get(url);
        if (res.data.length === 0) {
          setPageReview(0);
          return;
        }
        if (pageReview === 1)
          setReviews(res.data)
        else {
          let data = res.data.filter(
            item =>
              !reviews.some(r => r.reviewId === item.reviewId)
          );
          setReviews([...reviews, ...data]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
  };

  const loadMoreReview = () => {
    if (!loading && pageReview !== 0)
      setPageReview(pageReview + 1);
  };
  const validate = () => {
    if (rating === 0 || review.trim() === "") {
      myToastDispatch({
        "type": "set",
        "payload": {
          "variant": "danger",
          "message": "Đánh số sao và nội dung đánh giá là bắt buộc!"
        }
      });
      return false;
    }
    return true;
  };
  const showCompare = async (productId) => {
    try {
      setShow(true);
      setLoading(true);
      let res = await Apis.get(endpoints['compare'](product.productId, productId));
      console.info(res.data);
      for (let p of res.data) {
        if (p.productId === product.productId)
          setProduct(p);
        else
          setOtherProduct(p);
      }
    } catch (error) {
      console.error(error);
      myToastDispatch({
        "type": "set",
        "payload": {
          "variant": "danger",
          "message": "LỖI xảy ra khi tải dữ liệu!"
        }
      });
    } finally {
      setLoading(false);
    }
  };
  const handleReview = async (event) => {
    event.preventDefault();
    if (!validate())
      return;
    try {
      setLoading(true);
      let form = new FormData();
      form.append('comment', review);
      form.append('rating', rating);
      let res = await authApis().post(endpoints['reviewProduct'](pId), form);
      setReviews([res.data, ...reviews]);
      setReview("");
      setRating(0);
      myToastDispatch({
        "type": "set",
        "payload": {
          "variant": "success",
          "message": "Đánh giá thành công!"
        }
      });
    } catch (error) {
      let msg;
      if (error.response.status === 403)
        msg = "Bạn ĐÃ đánh giá sản phẩm này rồi!";
      else msg = "LỖI khi đánh giá sản phẩm!";
      myToastDispatch({
        "type": "set",
        "payload": {
          "variant": "danger",
          "message": msg
        }
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProduct();

    setPage(1);
    setRelatedProducts([]);

    setPageReview(1);
    setReviews([]);
    fetchReviews();

    setShow(false);
  }, [q]);

  useEffect(() => {
    if (!show)
      setTimeout(() =>
        setOtherProduct({})
        , 200);
  }, [show]);

  useEffect(() => {
    if (pageReview > 1)
      fetchReviews();
  }, [pageReview]);

  useEffect(() => {
    if (Object.keys(product).length !== 0)
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
          <h1 className="mb-3">{product.productName}</h1>

          <div className="d-flex align-items-center mb-4 gap-4">
            <div className="fs-5">
              <span className="text-secondary">Giá:</span>{' '}
              <strong className="text-dark">{product?.price?.toLocaleString('vi-VN')} VND</strong>
            </div>
            <div className="d-flex align-items-center fs-5">
              <span className="text-secondary me-2">Đánh giá trung bình:</span>
              <FaStar />{' '}
              <strong className="text-dark"> {product?.avgRating ? product?.avgRating : 0} ({product?.reviewCount ? product?.reviewCount : 0} lượt đánh giá)</strong>
            </div>
          </div>

          <hr />

          <h2>Mô tả sản phẩm</h2>
          <p>{product.description}</p>

          <hr />

          <div className="d-flex gap-2">
            {product?.storeId?.storeId == myStore?.storeId ?
              <Button
                variant="success"
                className="flex-fill"
                onClick={() => setShowEdit(true)}
              >
                Chỉnh sửa sản phẩm
              </Button> :
              <Button onClick={() => handleAddToCart(product)} variant="outline-success" className="flex-fill">
                Thêm vào giỏ hàng
              </Button>}
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={2} xs={3} className="mt-2 text-end">
          <img
            src={store?.avatarURL}
            alt="store-avatar"
            className="rounded-circle border"
            width={80}
            height={80}
          />
        </Col>
        <Col md={3} xs={9} className="mt-2">
          <h5>{store.storeName}</h5>
          <Link to={`/stores?id=${store.storeId}`} className="btn btn-primary">
            Xem cửa hàng
          </Link>
        </Col>
        <Col md={7} xs={12} className="mt-2">
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
              {relatedProducts.map((p) => (
                <div key={`r${p.productId}`} style={{ minWidth: "160px", flexShrink: 0 }}>
                  <Link to={`/details?id=${p.productId}`} className="text-decoration-none text-dark">
                    <Card className="rounded h-100 d-flex flex-column justify-content-between">
                      <Card.Img style={{ maxHeight: "250px", maxWidth: "200px" }} variant="top" className="rounded" src={p.imageURL} />
                      <Card.Body>
                        <Card.Title style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                          {p.productName}
                        </Card.Title>
                        <Card.Text>{p.price.toLocaleString('vi-VN')} VND</Card.Text>
                        {p.storeId.storeId !== product.storeId.storeId &&
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="mx-1 mb-2 flex-fill"
                            onClick={(e) => {
                              e.preventDefault();
                              showCompare(p.productId);
                            }}
                          >
                            So sánh
                          </Button>}

                        {p?.storeId?.storeId == myStore?.storeId &&
                          <Button
                            variant="outline-success"
                            size="sm"
                            className="mx-1 mb-2 flex-fill"
                            onClick={handleAddToCart}
                          >
                            Thêm vào giỏ hàng
                          </Button>}

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
        {user ? <Row className="mt-3">
          <Col md={1} xs={3}>
            <img
              src={user?.avatarURL}
              alt="user-avatar"
              className="rounded-circle border"
              width={80}
              height={80}
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
              <Form
                onSubmit={handleReview}
              >
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Viết đánh giá của bạn..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <div className="text-end mt-2">
                  <Button type="submit" variant="primary" disabled={review.trim() === '' || rating === 0}>
                    Gửi đánh giá
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row> :
          <p className="my-4 mx-3">
            Vui lòng
            <Link to={`/login?next=/details?id=${pId}`} className="text-primary fw-bold text-decoration-underline mx-1">ĐĂNG NHẬP</Link>
            để đánh giá!
          </p>}
      </div>

      <div className="mt-4">
        <span className="fs-4 fw-medium">Đánh giá và bình luận</span>
        {reviews.map(review =>
          <Review key={review.reviewId} review={review} pId={pId} user={user} />
        )}
        {pageReview !== 0 && (
          <div>
            <Button variant="link" className="text-decoration-none px-0" onClick={loadMoreReview}>Xem thêm đánh giá</Button>
          </div>
        )}
        {reviews.length === 0 &&
          <p className="fs-6 my-2 mx-3">Chưa có đánh giá nào</p>
        }
      </div>
    </Container >

    <Modal
      show={show}
      onHide={() => { setShow(false) }}
      dialogClassName="modal-xl"
      aria-labelledby="compare-modal-title"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="compare-modal-title">
          So sánh sản phẩm
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="text-center fw-bold mb-3 align-items-center">
          <Col xs={2}></Col>
          <Col xs={5}>{product?.productName}</Col>
          <Col xs={5}>{otherProduct?.productName}</Col>
        </Row>

        <Row className="align-items-center mb-3">
          <Col xs={2} className="fw-semibold text-end pe-4">Hình sản phẩm:</Col>
          <Col xs={5} className="text-center">
            <Image style={{ maxHeight: "250px" }} src={product.imageURL} fluid rounded />
          </Col>
          <Col xs={5} className="text-center">
            <Image src={otherProduct.imageURL} fluid rounded />
          </Col>
        </Row>

        <Row className="align-items-start mb-3">
          <Col xs={2} className="fw-semibold text-end pe-4">Mô tả:</Col>
          <Col xs={5}>{product?.description}</Col>
          <Col xs={5}>{otherProduct?.description}</Col>
        </Row>

        <Row className="align-items-center mb-4">
          <Col xs={2} className="fw-semibold text-end pe-4">Giá:</Col>
          <Col xs={5}>{product?.price?.toLocaleString()} VND</Col>
          <Col xs={5}>{otherProduct?.price?.toLocaleString()} VND</Col>
        </Row>

        <Row className="text-center align-items-center">
          <Col xs={2} className="fw-semibold text-end pe-4">Hành động:</Col>

          <Col xs={5}>
            {product?.storeId?.storeId !== myStore?.storeId &&
              <Button
                variant="outline-primary"
                className="me-2 mb-2"
                onClick={() => handleAddToCart(product)}
              >
                Thêm vào giỏ hàng
              </Button>}
          </Col>

          <Col xs={5}>
            <Link
              className="me-2 mb-2 btn btn-outline-dark"
              to={`/details?id=${otherProduct.productId}`}
            >
              Xem chi tiết
            </Link>
            {otherProduct?.storeId?.storeId !== myStore?.storeId &&
              <Button
                variant="outline-primary"
                className="me-2 mb-2"
                onClick={() => handleAddToCart(otherProduct)}
              >
                Thêm vào giỏ hàng
              </Button>}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>

    <ProductModal
      currentProduct={product}
      isUpdate={true}
      setShow={setShowEdit}
      show={showEdit}
      setLoading={setLoading}
      setCurrentProduct={setProduct}
      myToastDispatch={myToastDispatch}

    />

  </>;
};
export default ProductDetail;