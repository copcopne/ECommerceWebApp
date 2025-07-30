import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
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
            let res = await Apis.get(endpoints['category']);
            setCates(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        };
    };
    const loadProds = async () => {
        try {
            setLoading(true);
            let cateId = q.get("category");
            let url = `${endpoints['product']}?page=${page}`;
            if (cateId)
                url += `&categoryId=${cateId}`;
            let res = await Apis.get(url);
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        };
    };
    useEffect(() => {
        loadCates();
    }, []);
    useEffect(() => {
        setProducts([]);
        loadProds();
    }, [q]);
    return (<>
        <div>
            <h3>Danh mục sản phẩm</h3>
            <Row className="mt-3">
                <Col md={2} xs={4} className="border p-2 d-flex justify-content-center align-items-center">
                    <Link to={"/"} className="navbar-brand fw-bold">Tất cả sản phẩm</Link>
                </Col>
                {cates.map(c => (
                    <Col key={c.categoryId} md={2} xs={4} className="border p-2 d-flex justify-content-center align-items-center">
                        <Link to={`/?category=${c.categoryId}`} className="navbar-brand fw-bold">{c.categoryName}</Link>
                    </Col>
                ))}
            </Row>
        </div>

        <div className="mt-3">
            <h3>Danh sách sản phẩm</h3>
            <Row className="mt-3">
                {products.map(p => (
                    <Col md={2} xs={3} className="p-1">
                        <Link to={`/details?id=${p.productId}`} className="text-decoration-none text-dark">
                            <Card className="rounded">
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
            </Row>
        </div>
    </>);
}
export default Home;
