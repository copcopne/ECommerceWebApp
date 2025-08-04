import { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import Apis, { endpoints } from "../configs/Apis";

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [cates, setCates] = useState([]);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [q] = useSearchParams();

    const loadCates = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['categories']);
            setCates(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        };
    };
    const loadProds = async () => {
        if (page === 0) return;

        try {
            setLoading(true);
            let url = `${endpoints['products']}?page=${page}`;
            let cateId = q.get("category");
            if (cateId)
                url += `&categoryId=${cateId}`;
            let res = await Apis.get(url);
            if (res.data.length === 0)
                setPage(0);
            else {
                if (page === 1)
                    setProducts(res.data);
                else {
                    let data = res.data.filter(
                        item =>
                            !products.some(p => p.productId === item.productId)
                    );
                    setProducts([...products, ...data]);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        };
    };
    const loadMore = () => {
        if (!loading && page !== 0)
            setPage(page + 1);
    };

    useEffect(() => {
        loadCates();
    }, []);

    useEffect(() => {
        loadProds();
    }, [page, q]);

    useEffect(() => {
        setPage(1);
        setProducts([]);
    }, [q]);

    return (<>
        <div>
            <span className="fs-4 fw-medium">Danh mục sản phẩm</span>
            <div className="d-flex overflow-auto mt-3 pb-2" style={{ gap: "1rem" }}>
                <div className="border p-2 d-flex justify-content-center align-items-center" style={{ minWidth: "160px", flexShrink: 0 }}>
                    <Link to="/" className="navbar-brand fw-bold text-center">Tất cả sản phẩm</Link>
                </div>
                {cates.map((c) => (
                    <div
                        key={c.categoryId}
                        className="border p-2 d-flex justify-content-center align-items-center"
                        style={{ minWidth: "160px", flexShrink: 0 }}
                    >
                        <Link to={`/?category=${c.categoryId}`} className="navbar-brand fw-bold text-center">
                            {c.categoryName}
                        </Link>
                    </div>
                ))}
            </div>
        </div>


        <div className="mt-3">
            <span className="fs-4 fw-medium">Danh sách sản phẩm</span>
            <Row className="my-3">
                {products.map((p) => (
                    <Col key={p.productId} md={2} xs={3} className="p-1">
                        <Link to={`/details?id=${p.productId}`} className="text-decoration-none text-dark">
                            <Card className="rounded h-100 d-flex flex-column justify-content-between">
                                <Card.Img variant="top" className="rounded" src={p.imageURL} />
                                <Card.Body>
                                    <Card.Title>{p.productName}</Card.Title>
                                    <Card.Text>{p.price} VNĐ</Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}

                {(!loading && products.length === 0) && (
                    <Col className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                        <div className="text-center text-muted">
                            <i className="bi bi-box-seam fs-1 mb-3 d-block"></i>
                            <h4 className="fw-semibold">Không có sản phẩm nào</h4>
                        </div>
                    </Col>
                )}

                {page !== 0 && products.length > 0 && (
                    <Col xs={12} className="text-center my-3">
                        <Button variant="outline-primary" onClick={loadMore}>
                            Xem thêm sản phẩm
                        </Button>
                    </Col>
                )}
            </Row>

        </div>
    </>);
}
export default Home;
