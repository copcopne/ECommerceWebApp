import { useContext, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { UserContext } from "../../configs/Contexts";
import { Link } from "react-router-dom";

const Profile = () => {
    const info = [{
        "title": "Tên đăng nhập",
        "field": "username",
        "type": "text"
    }, {
        "title": "Họ và tên",
        "field": "name",
        "type": "text"
    }, {
        "title": "Số điện thoại",
        "field": "phone",
        "type": "tel"
    }, {
        "title": "Email",
        "field": "email",
        "type": "email"
    }];
    const avatar = useRef();
    const [user, setUser] = useState(useContext(UserContext));
    return <>
        <h1>Hồ sơ của bạn</h1>
        <Row className=" py-3 mx-3 me-auto">
            <Col md={3} xs={12}>
                <div className="d-flex text-center">
                    <img src={user.avatarURL} width={80} height={80} className="rounded-circle" />
                    <h4 className="p-2">{user.name}</h4>
                </div>
                <Form>
                    <Form.Label>Cập nhật ảnh đại diện</Form.Label>
                    <Form.Control type="file" ref={avatar} />
                </Form>
                <hr />
                <div>
                    <Link>Đơn hàng đã đặt</Link>
                </div>
            </Col>
            <Col md={9} xs={12}>
                <h2>Cập nhật thông tin tài khoản</h2>
                <Form>
                    {info.map(i => (
                        <Form.Group key={i.field} className="p-3" controlId={i.field}>
                            <Row className="align-items-center">
                                <Col xs={4} md={3}>
                                    <Form.Label className="mb-0">{i.title}:</Form.Label>
                                </Col>
                                <Col xs={8} md={9}>
                                    <Form.Control
                                        value={user[i.field]}
                                        onChange={e => setUser({ ...user, [i.field]: e.target.value })}
                                        type={i.type}
                                        placeholder={i.title}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                    ))}
                    <Form.Group className="p-3" controlId="passwordControl">
                            <Row className="align-items-center">
                                <Col xs={4} md={3}>
                                    <Form.Label className="mb-0">Mật khẩu:</Form.Label>
                                </Col>
                                <Col xs={8} md={9}>
                                    <Link to="/profile/edit-password">Cập nhật mật khẩu</Link>
                                </Col>
                            </Row>
                        </Form.Group>
                    <div className="text-end mt-3">
                        <Button>Lưu thay đổi</Button>
                    </div>
                </Form>
            </Col>
        </Row>
    </>;
};
export default Profile;