import { Link } from "react-router-dom";

const Empty = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ height: "80vh"}}>
            <i className="bi bi-exclamation-triangle-fill text-dark fs-1 mb-3 d-block"></i>
            <h1 className="display-4 text-dark mb-3 fw-bold">404 - Không tồn tại</h1>
            <p className="mb-4 text-muted">Trang bạn đang truy cập không tồn tại hoặc đã bị xoá</p>
            <Link to="/" className="btn btn-outline-dark fw-bold">
                Quay về trang chủ
            </Link>
        </div>
    );
};

export default Empty;
