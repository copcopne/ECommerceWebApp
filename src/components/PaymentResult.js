import { Link, useSearchParams } from "react-router-dom";

const PaymentResult = () => {
    const [q,] = useSearchParams();
    const result = q.get("result") || "failed";
    return <>
        <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ height: "80vh" }}>
            {result === "success" ?
                <i className="bi bi-check-circle-fill text-success fs-1 mb-3 d-block"></i> :
                <i className="bi bi-x-circle-fill text-danger fs-1 mb-3 d-block"></i>
            }

            <h1 className="display-4 text-dark mb-3 fw-bold">{result === "success" ? "Thành công" : "Thất bại"}</h1>
            <p className="mb-4 text-muted">Thanh toán {result !== "success" ? "không" : ""} thành công - Ấn nút phía dưới để quay về {result === "success" ? "trang chủ" : "giỏ hàng"}.</p>
            <Link to={`${result === "success" ? "/" : "/my-cart"}`} className="btn btn-outline-dark fw-bold">
                Quay về
            </Link>
        </div>
    </>;
};
export default PaymentResult;