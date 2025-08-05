import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Tab, Nav, Tabs, Card, Button, Image, Form } from "react-bootstrap";
import { FaStore, FaStar, FaUserFriends, FaRegStar } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MyToastContext, UserContext } from "../../configs/Contexts";
import Empty from "../Emtpy";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import moment from "moment";
import 'moment/locale/vi';
import MySpinner from "../layouts/MySpinner";
const Store = () => {
    const user = useContext(UserContext);
    const [store, setStore] = useState({});
    const [empty, setEmpty] = useState(false);
    const [q,] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [activeKey, setActiveKey] = useState("products");
    const [tabData, setTabData] = useState([]);
    const storeId = q.get("id") || null;
    const [page, setPage] = useState(1);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [, myToastDispatch] = useContext(MyToastContext);
    const nav = useNavigate();

    useEffect(() => {
        if (!user) {
            nav(`/auth?next=/stores${storeId ? `?id=${storeId}` : ""}`);
        }
    }, [user]);

    useEffect(() => {
        const loadStore = async () => {
            if (!storeId && user?.role !== "ROLE_SELLER")
                setEmpty(true);
            else
                try {
                    setEmpty(false);
                    setLoading(true);
                    let res = await Apis.get(endpoints['store'](storeId));
                    if (!res.data)
                        setEmpty(true);
                    else
                        setStore(res.data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
        };
        loadStore();
    }, [q, user]);

    const loadTabData = async () => {
        if (page === 0)
            return;
        try {
            setLoading(true);
            let url;
            if (activeKey === "products")
                url = `${endpoints['storeProducts'](storeId)}?page=${page}`;
            else
                url = `${endpoints['storeReviews'](storeId)}?page=${page}`;
            let res = await Apis.get(url);
            if (res.data.length === 0) {
                setPage(0);
                return;
            }
            if (page === 1)
                setTabData(res.data);
            else {
                let data = res.data.filter(item => {
                    if (activeKey === "products") {
                        return !tabData.some(d => d.productId === item.productId);
                    } else
                        return !tabData.some(d => d.reviewId === item.reviewId);
                });
                setTabData([...tabData, ...data]);
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

    useEffect(() => {
        if (empty !== true)
            loadTabData();
    }, [activeKey, page]);

    const handleChangeTab = (key) => {
        if (key === activeKey) return;
        setPage(1);
        setTabData([]);
        setActiveKey(key);
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
    const handleReview = async (event) => {
        event.preventDefault();
        if (!validate())
            return;
        try {
            setLoading(true);
            let form = new FormData();
            form.append('comment', review);
            form.append('rating', rating);
            let res = await authApis().post(endpoints['reviewStore'](storeId), form);
            if (activeKey === 'reviews')
                setTabData([res.data, ...tabData]);
            setReview("");
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
                msg = "Bạn ĐÃ đánh giá cửa hàng này rồi!";
            else msg = "LỖI khi đánh giá cửa hàng!";
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

    if (empty)
        return <Empty />
    return (
        <>
            {loading && <MySpinner />}
            <div className="py-3">
                <Container>
                    <Row className="align-items-center">
                        <Col xs={12} md={2} className="text-center">
                            <img
                                src={store?.avatarURL}
                                alt="store-logo"
                                className="rounded-circle border"
                                width={80}
                                height={80}
                            />
                        </Col>

                        <Col xs={12} md={7}>
                            <h5 className="mb-0 d-flex align-items-center">
                                {store?.storeName}
                            </h5>
                            <div className="mt-2">
                                <p>{store?.description}</p>
                            </div>
                        </Col>

                        <Col xs={12} md={3}>
                            <div><FaStore className="me-2" />Sản Phẩm: <strong>{store?.productCount}</strong></div>
                            <div><FaUserFriends className="me-2" />Người Theo Dõi: <strong>92,3k</strong></div>
                            <div><FaStar className="me-2" />Đánh Giá: <strong>{store?.avgRating?.toLocaleString("vi-VN", { minimumFractionDigits: 1, maximumFractionDigits: 2 })} ({store?.reviewCount} lượt đánh giá)</strong></div>
                            <div>Tham Gia: <strong>{moment(store?.createdAt).fromNow()}</strong></div>
                        </Col>
                    </Row>

                    <Tabs
                        defaultActiveKey="products"
                        id="fill-tab-example"
                        className="my-3"
                        activeKey={activeKey}
                        onSelect={handleChangeTab}
                        fill
                    >
                        <Tab eventKey="products" title="Sản phẩm">
                            <Row className="p-3">
                                {(tabData.length !== 0 && activeKey === "products") && tabData.map(p =>
                                    <Col key={`p${p.productId}`} md={2} xs={3} className="p-1">
                                        <Link to={`/details?id=${p.productId}`} className="text-decoration-none text-dark">
                                            <Card className="rounded h-100 d-flex flex-column justify-content-between">
                                                <Card.Img variant="top" className="rounded" src={p.imageURL} />
                                                <Card.Body>
                                                    <Card.Title>{p.productName}</Card.Title>
                                                    <Card.Text>{p.price} VNĐ</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Link>
                                    </Col>)}
                                {page !== 0 && tabData.length > 0 && (
                                    <Col xs={12} className="text-center my-3">
                                        <Button variant="outline-primary" onClick={loadMore}>
                                            Xem thêm sản phẩm
                                        </Button>
                                    </Col>
                                )}
                            </Row>
                            {tabData.length === 0 &&
                                <p className="fs-6 my-2 mx-3">Chưa có sản phẩm nào</p>
                            }
                        </Tab>

                        <Tab eventKey="reviews" title="Đánh giá">
                            <div className="mt-4">
                                <span className="fs-4 fw-medium">Viết đánh giá</span>
                                {user ? <Row className="mt-3">
                                    <Col md={1} xs={3}>
                                        <Image
                                            src={user?.avatarURL}
                                            fluid
                                            className="rounded-circle"
                                        />
                                    </Col>
                                    <Col md={11} xs={9}>
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
                                                <Button type="submit" variant="primary">
                                                    Gửi đánh giá
                                                </Button>
                                            </div>
                                        </Form>
                                    </Col>
                                </Row> :
                                    <p className="my-4 mx-3">
                                        Vui lòng
                                        <Link to={`/login?next=/stores?id=${storeId}`} className="text-primary fw-bold text-decoration-underline mx-1">ĐĂNG NHẬP</Link>
                                        để đánh giá!
                                    </p>}
                            </div>

                            {(tabData.length !== 0 && activeKey === "reviews") && tabData.map(review =>
                                <Row key={review?.reviewId} className="mt-3">
                                    <Col md={1} xs={3}>
                                        <Image
                                            src={review?.avatarURL}
                                            fluid
                                            className="rounded-circle"
                                        />
                                    </Col>
                                    <Col md={11} xs={9}>
                                        <p className="mx-0 my-0 fw-semibold">{review?.username}</p>
                                        <div className="d-flex align-items-center mb-1">
                                            {[...Array(5)].map((_, i) =>
                                                i < review?.rating ? (
                                                    <FaStar key={i} className="text-warning me-1" />
                                                ) : (
                                                    <FaRegStar key={i} className="text-warning me-1" />
                                                )
                                            )}
                                        </div>
                                        <small>{moment(review?.createdAt).fromNow()}</small>
                                        <p className="mx-0 my-0">{review?.comment}</p>
                                    </Col>
                                </Row>
                            )}

                            <div xs={12} className="my-3 mx-2">

                                {page !== 0 && tabData.length > 0 && (
                                    <Button variant="link" onClick={loadMore}>
                                        Xem thêm đánh giá
                                    </Button>
                                )}
                            </div>
                            {tabData.length === 0 &&
                                <p className="fs-6 my-2 mx-3">Chưa có đánh giá nào</p>
                            }
                        </Tab>
                    </Tabs>
                </Container>
            </div>
        </>
    );
};

export default Store;
