import { useNavigate } from "react-router-dom";

const Stats = () => {
    const nav = useNavigate();
    return <>
        <span className="fs-4 fw-medium">
            <a onClick={() => nav("/stores")} className="text-dark" style={{ cursor: "pointer" }}>
                Cửa hàng của bạn
            </a> &gt; Thống kê
        </span>
    </>;
};
export default Stats;