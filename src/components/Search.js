import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import MySpinner from "./layouts/MySpinner";
import Apis, { endpoints } from "../configs/Apis";

const Search = () => {
    const priceFilter = [{
        "type": "fromPrice",
        "placeholder": " Từ"
    }, {
        "type": "toPrice",
        "placeholder": "Đến"
    }];
    const [filter, setFilter] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchByStore, setSearchByStore] = useState(false);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [q] = useSearchParams();
    const searchProducts = async () => {
        let keyword = q.get("keyword");
        if (keyword)
            try {
                setLoading(true);
                let url = `${endpoints['product']}?page=${page}`;
                if (searchByStore)
                    url += `&storeName=${keyword}`;
                else url += `&kw=${keyword}`;
                for (let key in filter)
                    url += `&${key}=${filter[key]}`;

                console.info(url);
                let res = await Apis.get(url);
                setProducts(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            };
    };
    const resetForm = () => {
        if (Object.keys(filter).length !== 0) {
            setFilter({});
            searchProducts();
        }
    };
    const applyPriceFilter = (event) => {
        event.preventDefault();
        if (Object.keys(filter).length !== 0) {
            searchProducts();
        }
    };
    useEffect(() => {
        searchProducts();
    }, [searchByStore, q]);


    return <>
        {loading && <MySpinner />}
        <Row className="mt-5">
            <Col md={3} xs={12} className="mt-3">
                <div className="p-4">
                    <h4 className="mb-4">Bộ lọc tìm kiếm</h4>

                    <div className="d-grid gap-2 mb-4">
                        <Button onClick={() => setSearchByStore(false)} variant={searchByStore ? "outline-secondary" : "primary"}>
                            Theo tên sản phẩm
                        </Button>
                        <Button onClick={() => setSearchByStore(true)} variant={searchByStore ? "primary" : "outline-secondary"}>
                            Theo tên cửa hàng
                        </Button>
                    </div>

                    <div className="mb-4">
                        <h5 className="mb-2">Khoảng giá</h5>
                        <Form>
                            <div className="d-flex gap-2 mb-2">
                                {priceFilter.map(f => <Form.Control
                                    value={filter[f.type] || ""}
                                    onChange={e => setFilter({ ...filter, [f.type]: e.target.value })}
                                    type="number"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                            applyPriceFilter(e);
                                    }}
                                    placeholder={f.placeholder} />)}
                            </div>
                            <div className="d-flex flex-wrap gap-2 pt-1">
                                <Button
                                    type="submit"
                                    onClick={(event) => applyPriceFilter(event)}
                                    variant="success"
                                    className="flex-fill">Áp dụng</Button>
                                <Button
                                    onClick={resetForm}
                                    variant="outline-danger"
                                    className="flex-fill">Xóa bộ lọc</Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Col>

            <Col md={9} xs={12}>
                <Row>
                    <Col md={12} xs={12}>
                        {q.get("keyword") ?
                            <h2>Kết quả tìm kiếm cho {searchByStore && "cửa hàng"} "{q.get("keyword")}"</h2> :
                            <h2>Nhập từ khóa để tìm kiếm</h2>
                        }
                    </Col>
                    {products.map(p => <Col md={2} xs={3} className="p-1">
                        <Link to={`/details?id=${p.productId}`} className="text-decoration-none text-dark">
                            <Card className="rounded">
                                <Card.Img variant="top" src={p.imageURL} />
                                <Card.Body>
                                    <Card.Title>{p.productName}</Card.Title>
                                    <Card.Text>{p.price} VNĐ</Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>)}
                    {products.length === 0 &&
                        <Col className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                            <div className="text-center text-muted">
                                <i className="bi bi-box-seam fs-1 mb-3 d-block"></i>
                                <h4 className="fw-semibold">Không có sản phẩm nào</h4>
                            </div>
                        </Col>}
                </Row>
            </Col>
        </Row>
    </>;
};
export default Search;