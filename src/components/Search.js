import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import MySpinner from "./layouts/MySpinner";
import Apis, { endpoints } from "../configs/Apis";

const Search = () => {
    const priceFilter = [
        { type: "fromPrice", placeholder: "Từ" },
        { type: "toPrice", placeholder: "Đến" },
    ];

    const [tempFilter, setTempFilter] = useState({});
    const [filter, setFilter] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchByStore, setSearchByStore] = useState(false);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [q] = useSearchParams();

    useEffect(() => {
        const searchProducts = async () => {
            const keyword = q.get("keyword");
            if (!keyword) {
                setProducts([]);
                return;
            }

            setLoading(true);
            try {
                let url = `${endpoints.product}?page=${page}`;
                url += searchByStore
                    ? `&storeName=${keyword}`
                    : `&kw=${keyword}`;
                for (let key in filter)
                    url += `&${key}=${filter[key]}`;

                const res = await Apis.get(url);
                setProducts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        searchProducts();
    }, [searchByStore, q, filter, page]);

    const resetForm = () => {
        if (Object.keys(filter).length !== 0) {
        setTempFilter({});
        setFilter({});
        setPage(1);
        }
    };

    const applyPriceFilter = (event) => {
        event.preventDefault();
        setFilter(tempFilter);
        setPage(1);
    };

    return (
        <>
            {loading && <MySpinner />}
            <Row className="mt-5">
                <Col md={3} xs={12} className="mt-3">
                    <div className="p-4">
                        <h4 className="mb-4">Bộ lọc tìm kiếm</h4>

                        <div className="d-grid gap-2 mb-4">
                            <Button
                                onClick={() => setSearchByStore(false)}
                                variant={searchByStore ? "outline-secondary" : "primary"}
                            >
                                Theo tên sản phẩm
                            </Button>
                            <Button
                                onClick={() => setSearchByStore(true)}
                                variant={searchByStore ? "primary" : "outline-secondary"}
                            >
                                Theo tên cửa hàng
                            </Button>
                        </div>

                        <div className="mb-4">
                            <h5 className="mb-2">Khoảng giá</h5>
                            <Form onSubmit={applyPriceFilter}>
                                <div className="d-flex gap-2 mb-2">
                                    {priceFilter.map((f) => (
                                        <Form.Control
                                            key={f.type}
                                            value={tempFilter[f.type] || ""}
                                            onChange={(e) =>
                                                setTempFilter({
                                                    ...tempFilter,
                                                    [f.type]: e.target.value,
                                                })
                                            }
                                            type="number"
                                            placeholder={f.placeholder}
                                        />
                                    ))}
                                </div>
                                <div className="d-flex flex-wrap gap-2 pt-1">
                                    <Button type="submit" variant="success" className="flex-fill">
                                        Áp dụng
                                    </Button>
                                    <Button onClick={resetForm} variant="outline-danger" className="flex-fill">
                                        Xóa bộ lọc
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </Col>

                <Col md={9} xs={12}>
                    <Row>
                        <Col md={12} xs={12}>
                            {q.get("keyword") ? (
                                <h2>
                                    Kết quả tìm kiếm cho {searchByStore && "cửa hàng"} "{q.get("keyword")}"
                                </h2>
                            ) : (
                                <h2>Nhập từ khóa để tìm kiếm</h2>
                            )}
                        </Col>
                        {products.length > 0 ? (
                            products.map((p) => (
                                <Col key={p.productId} md={2} xs={3} className="p-1">
                                    <Link to={`/details?id=${p.productId}`} className="text-decoration-none text-dark">
                                        <Card className="rounded">
                                            <Card.Img variant="top" src={p.imageURL} />
                                            <Card.Body>
                                                <Card.Title>{p.productName}</Card.Title>
                                                <Card.Text>{p.price} VNĐ</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Link>
                                </Col>
                            ))
                        ) : (
                            <Col
                                className="d-flex justify-content-center align-items-center"
                                style={{ height: "200px" }}
                            >
                                <div className="text-center text-muted">
                                    <i className="bi bi-box-seam fs-1 mb-3 d-block"></i>
                                    <h4 className="fw-semibold">Không có sản phẩm nào</h4>
                                </div>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default Search;
