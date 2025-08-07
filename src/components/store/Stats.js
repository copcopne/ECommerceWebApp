import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import MySpinner from "../layouts/MySpinner";
import { MyToastContext } from "../../configs/Contexts";
import { authApis, endpoints } from "../../configs/Apis";

const Stats = () => {
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const [byProduct, setByProduct] = useState(true);
    const [timeUnit, setTimeUnit] = useState("MONTH");
    const [year, setYear] = useState(new Date().getFullYear());
    const [, myToastDispatch] = useContext(MyToastContext);
    const [statsData, setStatsData] = useState([]);
    const type = [{
        "label": "Tháng",
        "value": "MONTH"
    }, {
        "label": "Quý",
        "value": "QUARTER"
    }, {
        "label": "Năm",
        "value": "YEAR"
    }];

    const fetchStats = async () => {
        try {
            setLoading(true);
            let url = `${endpoints['secureStats']}?type=${byProduct ? "product" : "time"}`;
            if (!byProduct)
                url += `&timeUnit=${timeUnit}`;
            if (timeUnit !== "YEAR")
                url += `&year=${year}`;

            let res = await authApis().get(url);
            setStatsData(
                res.data
                    .filter(item => item.totalRevenue !== null)
                    .map((item, _, arr) => {
                        const total = arr.reduce((sum, i) => sum + i.totalRevenue, 0);
                        return byProduct !== true
                            ? {
                                ...item,
                                total: total,
                                timeUnit: timeUnit,
                                percentage: total ? +(item.totalRevenue / total * 100).toFixed(1) : 0
                            }
                            : item;
                    })
                    .sort((a, b) => b.totalRevenue - a.totalRevenue)
            );
            console.info(statsData);

        }
        catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchStats = () => {
        if (timeUnit !== "YEAR" && (year < 1970 || year > 3000)) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "Năm phải nằm trong khoảng hợp lệ!"
                }
            });
            return;
        }
        fetchStats();
    };

    useEffect(() => {
        fetchStats();
    }, [byProduct]);
    return <>
        <span className="fs-4 fw-medium">
            <a onClick={() => nav("/stores")} className="text-dark" style={{ cursor: "pointer" }}>
                Cửa hàng của tôi
            </a> &gt; Thống kê
        </span>
        {loading && <MySpinner />}
        <Row className="mt-5">
            <Col md={3} xs={12} className="mt-3">
                <div className="p-4">
                    <h4 className="mb-4">Loại thống kê</h4>

                    <div className="d-grid gap-2 mb-4">
                        <Button
                            onClick={() => setByProduct(true)}
                            variant={byProduct ? "primary" : "outline-secondary"}
                        >
                            Theo sản phẩm
                        </Button>
                        <Button
                            onClick={() => setByProduct(false)}
                            variant={byProduct ? "outline-secondary" : "primary"}
                        >
                            Theo khoảng thời gian
                        </Button>
                        {!byProduct && <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Khoảng thời gian</Form.Label>
                                <Form.Select
                                    value={timeUnit}
                                    onChange={(e) => setTimeUnit(e.target.value)}
                                >
                                    {type.map(t => (
                                        <option key={t.value} value={t.value}>Theo {t.label}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            {timeUnit !== "YEAR" && <Form.Group className="mb-3">
                                <Form.Label>Năm</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={year}
                                    onChange={e => setYear(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleFetchStats();
                                        }
                                    }}
                                />
                            </Form.Group>}

                            <Button variant="primary" onClick={handleFetchStats}>
                                Xem thống kê
                            </Button>
                        </Form>}
                    </div>
                </div>
            </Col>
            <Col md={9} xs={12}>
                <Row>
                    <Col md={12} xs={12}>
                        <h2>
                            Kết quả thống kê
                        </h2>
                        {statsData.length === 0 ?
                            <div className="d-flex flex-column justify-content-center align-items-center text-center my-5">
                                <i className="bi bi-file-earmark-text text-dark fs-1 mb-3 d-block"></i>
                                <p className="mb-4 text-muted">Không có dữ liệu thống kê</p>
                            </div>
                            : <>
                                {byProduct ? <table className="table table-bordered table-striped text-center">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Doanh thu (VNĐ)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {statsData.map((item, index) => (
                                            <tr
                                                key={item.productId}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => nav(`/details?id=${item.productId}`)}
                                            >
                                                <td>{index + 1}</td>
                                                <td>{item.productName}</td>
                                                <td>{item.totalRevenue.toLocaleString('vi-VN')} VND</td>
                                            </tr>
                                        ))}

                                        <tr className="font-weight-bold table-info">
                                            <td colSpan={2} className="text-end mx-5"><strong>Tổng doanh thu</strong></td>
                                            <td>
                                                <strong>
                                                    {statsData
                                                        .reduce((sum, item) => sum + (item.totalRevenue || 0), 0)
                                                        .toLocaleString('vi-VN')} VND
                                                </strong>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table> :
                                    <>
                                        <table className="table table-bordered table-striped text-center">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th>Thời gian</th>
                                                    <th>Doanh thu (VND)</th>
                                                    <th>Tỷ lệ (%)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {statsData.map((d, index) => (
                                                    <tr key={index}>
                                                        <td>{type.find(t => t.value === d.timeUnit)?.label} {d.timeValue}</td>
                                                        <td>{d.totalRevenue.toLocaleString('vi-VN')} VND</td>
                                                        <td>{d.percentage}%</td>
                                                    </tr>
                                                ))}
                                                <tr className="table-info font-weight-bold">
                                                    <td><strong>Tổng doanh thu</strong></td>
                                                    <td><strong>{statsData[0]?.total?.toLocaleString('vi-VN')} VND</strong></td>
                                                    <td><strong>100%</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </>}
                            </>}
                    </Col>
                </Row>
            </Col>
        </Row>
    </>;
};
export default Stats;