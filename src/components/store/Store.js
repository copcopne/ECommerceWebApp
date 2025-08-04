import { useContext, useEffect, useState } from "react";
import { Button, Container, Row, Col, Badge } from "react-bootstrap";
import { FaStore, FaCommentDots, FaStar, FaUserFriends } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { UserContext } from "../../configs/Contexts";
import Empty from "../Emtpy";
import Apis, { endpoints } from "../../configs/Apis";
import moment from "moment";
import 'moment/locale/vi';
const Store = () => {
    const user = useContext(UserContext);
    const [store, setStore] = useState({});
    const [empty, setEmpty] = useState(false);
    const [q, ] = useSearchParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadStore = async () => {
            console.info(user);
            let storeId = q.get("id") || null;
            if (!storeId )
                setEmpty(true);
            else
                try {
                    setLoading(true);
                    let res = await Apis.get(endpoints['store'](storeId));
                    if(!res.data)
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

    if (empty)
        return <Empty />
    return (
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
                        <div><FaStar className="me-2" />Đánh Giá: <strong>{store?.avgRating?.toLocaleString("vi-VN", { minimumFractionDigits: 1, maximumFractionDigits: 2})} ({store?.reviewCount} lượt đánh giá)</strong></div>
                        <div>Tham Gia: <strong>{moment(store?.createdAt).fromNow()}</strong></div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Store;
