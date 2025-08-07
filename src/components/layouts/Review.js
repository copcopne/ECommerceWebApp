import { memo, useContext, useEffect, useState } from "react";
import { Button, Col, Form, Image, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaRegStar, FaStar } from "react-icons/fa";
import moment from "moment";
import 'moment/locale/vi';
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { MyToastContext } from "../../configs/Contexts";

const Review = ({ user, review, pId }) => {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [replies, setReplies] = useState([]);
    const [reply, setReply] = useState('');
    const [page, setPage] = useState(0);
    const [, myToastDispatch] = useContext(MyToastContext);

    useEffect(() => {
        const loadReplies = async () => {
            if (review?.replyCount !== 0 && page > 0) {
                console.info(page);
                try {
                    setLoading(true);
                    let res = await Apis.get(`${endpoints['productReviewReplies'](review?.reviewId)}?page=${page}`);
                    console.info(res.data);
                    if (res.data.length === 0) {
                        setPage(0)
                        return;
                    }
                    if (page === 1)
                        setReplies(res.data)
                    else {
                        let data = res.data.filter(
                            item =>
                                item.reviewId !== replies.reviewId &&
                                !replies.some(r => r.reviewId === item.reviewId)
                        );
                        setReplies([...replies, ...data]);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadReplies();
    }, [page]);

    const validate = () => {
        return reply.trim() !== '';
    };

    const handleReply = async (event) => {
        event.preventDefault();
        if (!validate()) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "Nội dung phản hồi là bắt buộc!"
                }
            });
            return;
        }
        try {
            setLoading(true);
            let form = new FormData();
            form.append('parentId', review.reviewId);
            form.append('comment', reply);
            let res = await authApis().post(endpoints['secureReplyReviewProduct'](pId), form);
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "success",
                    "message": "Phản hồi thành công!"
                }
            });
            setReplies([res.data, ...replies]);
            setReply('');
            setShow(false);

        } catch (error) {
            console.error(error);
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "LỖI xảy ra khi phản hồi đánh giá!"
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!loading && page !== 0)
            setPage(page + 1);
    };

    return <>
        <Row className="mt-3">
            <Col md={1} xs={3}>
                <img
                    src={review?.avatarURL}
                    alt="reviewer-avatar"
                    className="rounded-circle border"
                    width={80}
                    height={80}
                />
            </Col>
            <Col md={11} xs={9} className="mt-2">
                <p className="fw-semibold mb-1">{review?.username}</p>
                <div className="d-flex align-items-center mb-1">
                    {[...Array(5)].map((_, i) =>
                        i < review?.rating ? (
                            <FaStar key={i} className="text-warning me-1" />
                        ) : (
                            <FaRegStar key={i} className="text-warning me-1" />
                        )
                    )}
                </div>
                <small className="text-muted">{moment(review?.createdAt).fromNow()}</small>
                <p className="mt-2">{review?.comment}</p>
                <div className="d-flex gap-3">
                    <Button variant="link" onClick={() => setShow(!show)} className="text-decoration-none px-0">
                        {show ? "Đóng phản hồi" : "Phản hồi"}
                    </Button>
                    {(review?.replyCount !== 0 && replies.length === 0) &&
                        <Button variant="link" onClick={() => setPage(1)} className="text-decoration-none px-0">
                            Xem phản hồi
                        </Button>}
                </div>
            </Col>
        </Row>

        {show && <>
            {user ? (
                <Row className="mt-3 ms-5 ps-3 border-start border-2 border-primary">
                    <Col md={1} xs={3}>
                        <img
                            src={user?.avatarURL}
                            alt="user-avatar"
                            className="rounded-circle border"
                            width={80}
                            height={80}
                        />
                    </Col>
                    <Col md={11} xs={9}>
                        <Form onSubmit={handleReply}>
                            <Form.Group controlId="replyTextarea">
                                <Form.Label className="fw-semibold">Phản hồi</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Viết phản hồi của bạn..."
                                    value={reply}
                                    disabled={loading}
                                    onChange={(e) => setReply(e.target.value)}
                                />
                            </Form.Group>
                            <div className="text-end mt-2">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={reply.trim() === '' || loading}
                                >
                                    Gửi phản hồi
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            ) : (
                <p className="my-4 mx-5 text-muted">
                    Vui lòng
                    <Link to={`/login?next=/details?id=${pId}`} className="text-primary fw-bold text-decoration-underline mx-1">ĐĂNG NHẬP</Link>
                    để phản hồi!
                </p>
            )}
        </>}

        {loading && <div className="text-center mt-3"><Spinner animation="border" variant="secondary" /></div>}

        {replies.length > 0 && (
            <div className="mt-3 ms-5 ps-3 border-start border-2 border-info">
                {replies.map(reply => (
                    <Row key={reply.reviewId} className="mb-2">
                        <Col md={1} xs={3}>
                            <Image
                                src={reply?.avatarURL}
                                fluid
                                className="rounded-circle"
                            />
                        </Col>
                        <Col md={11} xs={9}>
                            <p className="fw-semibold mb-1">{reply?.username}</p>
                            <small className="text-muted">{moment(reply?.createdAt).fromNow()}</small>
                            <p className="mt-1">{reply?.comment}</p>
                        </Col>
                    </Row>
                ))}
                {page !== 0 && (
                    <div>
                        <Button variant="link" className="text-decoration-none px-0" onClick={loadMore}>Xem thêm phản hồi</Button>
                    </div>
                )}
            </div>
        )}
    </>
};

export default memo(Review);
