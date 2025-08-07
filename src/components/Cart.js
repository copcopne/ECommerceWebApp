import { useContext, useEffect, useState } from 'react';
import { Alert, Button, Col, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';
import cookie from 'react-cookies'
import { MyCartContext, MyToastContext, UserContext } from '../configs/Contexts';
import MySpinner from './layouts/MySpinner';
import { Link, useNavigate } from 'react-router-dom';
import { authApis, endpoints } from '../configs/Apis';
const Cart = () => {
    const [cart, setCart] = useState(cookie.load('cart') || null);
    const [, cartDispatch] = useContext(MyCartContext);
    const [, myToastDispatch] = useContext(MyToastContext);
    const user = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [editingProduct, setEdititngProduct] = useState({});
    const [show, setShow] = useState(false);
    const nav = useNavigate();
    const totalPrice = cart
        ? Object.values(cart).reduce((sum, c) => sum + c.price * c.quantity, 0)
        : 0;

    const [newQuantity, setNewQuantity] = useState(-1);

    const handleRemoveCart = () => {
        let result = window.confirm("Bạn có chắc muốn xóa giỏ hàng không?");
        if (result) {
            cookie.remove('cart');
            setCart(null);
            cartDispatch({
                "type": "update"
            })
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "success",
                    "message": "Xóa trống giỏ hàng thành công!"
                }
            });
        };
    };
    const handleRemoveProduct = (productId) => {
        let result = window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?");
        if (result) {
            delete cart[productId];
            if (Object.keys(cart).length > 0) {
                cookie.save("cart", cart);
            } else {
                cookie.remove('cart');
                setCart(null);
            }
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "success",
                    "message": "Xóa thành công khỏi giỏ hàng!"
                }
            });
            cartDispatch({
                "type": "update"
            })
            return true;
        } else return false;
    };
    const handleChangeQuantity = () => {
        if (newQuantity < 0) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "Số lượng phải là số dương!"
                }
            });
            return;
        }
        else if (+newQuantity === 0) {
            if (handleRemoveProduct(editingProduct.id)) {
                setEdititngProduct({});
                setShow(false);
            }
            else return;
        }
        else {
            cart[editingProduct.id]["quantity"] = newQuantity;
            cookie.save("cart", cart);
            cartDispatch({
                "type": "update"
            });
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "success",
                    "message": "Cập nhật thành công!"
                }
            });
            setShow(false);
            setEdititngProduct({});
        }

    };
    const handlePay = async () => {
        try {
            setLoading(true);
            console.info(Object.values(cart));
            let res = await authApis().post(`${endpoints['securePay']}?paymentMethod=${paymentMethod}`, Object.values(cart));
            if (paymentMethod === "MOMO") {
                const paymentUrl = res.data?.payUrl;
                const popup = window.open(paymentUrl, "_blank", "width=600,height=800");

                const interval = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(interval);
                        setLoading(false);
                        nav('/paymentStatus?result=failed');
                    }
                }, 500);
            } else {
                cookie.remove('cart');
                cartDispatch({
                    "type": "update"
                });
                nav('/paymentStatus?result=success');
            }
        } catch (error) {
            console.error(error);
            nav('/paymentStatus?result=failed');
        }
    };
    return <>
        {loading && <MySpinner />}

        <h1>Giỏ hàng của bạn</h1>
        {cart === null ? <div className="text-center text-muted">
            <i className="bi bi-cart fs-1 mb-3 d-block"></i>
            <h4 className="fw-semibold">Không có sản phẩm nào</h4>
        </div> : <>
            <Table responsive hover className="align-middle mb-4">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Tổng</th>
                        <th>
                            <Button
                                variant="danger"
                                size="sm"
                                className="mx-1"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveCart();
                                }}
                            >
                                Xóa giỏ hàng
                            </Button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.values(cart).map((c, idx) => (
                        <tr key={c?.id}>
                            <td>{idx + 1}</td>
                            <td>{c?.name}</td>
                            <td>{c?.price?.toLocaleString()} VND</td>
                            <td>{c.quantity}</td>
                            <td>{(c?.price * c?.quantity)?.toLocaleString()} VND</td>
                            <td>
                                <Link
                                    to={`/details?id=${c.id}`}
                                    className="btn btn-outline-success btn-sm mx-1"
                                >
                                    Xem chi tiết
                                </Link>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="mx-1"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setNewQuantity(c.quantity);
                                        setEdititngProduct(c);
                                        setShow(true);
                                    }}
                                >
                                    Cập nhật số lượng
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="mx-1"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleRemoveProduct(c.id);
                                    }}
                                >
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Row className="mb-4">
                <Col xs={12} md={6}>
                    <h5>Tổng cộng:</h5>
                </Col>
                <Col xs={12} md={6} className="text-md-end">
                    <h3 className="text-success">{totalPrice.toLocaleString()} VND</h3>
                </Col>
            </Row>

            {!user ? (
                <p className="my-4 mx-3">
                    Vui lòng
                    <Link to={`/login?next=/my-cart`} className="text-primary fw-bold text-decoration-underline mx-1">ĐĂNG NHẬP</Link>
                    để thanh toán!
                </p>
            ) : (
                <div className="text-end my-3">
                    <InputGroup
                        className="justify-content-end"
                        style={{ maxWidth: '360px', marginLeft: 'auto' }}
                    >
                        <Form.Select
                            value={paymentMethod}
                            onChange={e => setPaymentMethod(e.target.value)}
                            style={{ maxWidth: '140px' }}
                        >
                            <option value="COD">COD</option>
                            <option value="MOMO">Momo</option>
                        </Form.Select>

                        <Button
                            variant="success"
                            size="lg"
                            onClick={handlePay}
                            disabled={loading}
                        >
                            THANH TOÁN
                        </Button>
                    </InputGroup>
                </div>
            )}

            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show}
                onHide={() => setShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Cập nhật số lượng cho: {editingProduct?.productName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Số lượng</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Nhập số lượng..."
                                autoFocus
                                value={newQuantity}
                                onChange={e => setNewQuantity(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleChangeQuantity();
                                    }
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleChangeQuantity}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </>}
    </>;
};
export default Cart;