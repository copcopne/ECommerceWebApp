import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Tab, Nav, Tabs, Card, Button, Image } from "react-bootstrap";
import { FaStore, FaStar, FaUserFriends, FaRegStar } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import { UserContext } from "../../configs/Contexts";
import Empty from "../Emtpy";
import Apis, { endpoints } from "../../configs/Apis";
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

    useEffect(() => {
        const loadStore = async () => {
            if (!storeId)
                setEmpty(true);
            else
                try {
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
    }, [q]);

    const loadTabData = async () => {
        if (page === 0)
            return;
        try {
            setLoading(true);
            let url;
            if (activeKey === "products")
                url = `${endpoints['products']}?storeId=${storeId}&page=${page}`;
            else
                url = `${endpoints['storeReviews'](storeId)}?page=${page}`;
            console.info(url);
            let res = await Apis.get(url);
            console.info(res.data);
            if (res.data.length === 0) {
                setPage(0);
                return;
            }
            if (page === 1)
                setTabData(res.data);
            else {
                setTabData([...tabData, ...res.data]);
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
                            {(tabData.length !== 0 && activeKey === "reviews") &&  tabData.map(review =>
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
                                            {[...Array(review?.rating)].map((_, i) =>
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
