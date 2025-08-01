import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { UserContext } from "../../configs/Contexts";
import { Link, useNavigate } from "react-router-dom";
import MySpinner from "../layouts/MySpinner";

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
    }, {
        "title": "Địa chỉ",
        "field": "address",
        "type": "text"
    }];
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const avatar = useRef();
    const user = useContext(UserContext);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (!user) {
            nav("/auth?next=/profile");
        } else {
            setFormData(user);
        }
    }, [user]);

    const handleUploadAvatar = () => {

    };

    const validate = () => {
        return true;
    }
    const submitEdit = (event) => {
        event.preventDefault();
        if (validate())
            try {
                setLoading(true);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
    };
    return <>
        {!formData || loading ? (
            <MySpinner />
        ) : (
            <>
                <span className="display-6 fw-bold">Hồ sơ của bạn</span>
                <Row className=" py-3 mx-3 my-2 me-auto">
                    <Col md={3} xs={12}>
                        <div className="d-flex align-items-center">
                            <img src={formData.avatarURL} width={80} height={80} className="rounded-circle" />
                            <div className="pt-2 px-3">
                                <h4>{formData.name}</h4>
                                <Form>
                                    <span
                                        onClick={() => avatar.current?.click()}
                                        className="nav-link text-primary p-0"
                                        style={{ cursor: 'pointer', display: 'inline-block', textDecoration: 'underline' }}
                                    >
                                        Cập nhật ảnh đại diện
                                    </span>
                                    <Form.Control
                                        type="file"
                                        ref={avatar}
                                        style={{ display: 'none' }}
                                        accept="image/png, image/jpeg"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                handleUploadAvatar(file);
                                            }
                                        }}
                                    />
                                </Form>
                            </div>
                        </div>
                        <hr />
                        <div>
                            <Link>Đơn hàng đã đặt</Link>
                        </div>
                    </Col>
                    <Col md={9} xs={12}>
                        <h2>Cập nhật thông tin tài khoản</h2>
                        <Form onSubmit={submitEdit}>
                            {info.map(i => (
                                <Form.Group key={i.field} className="p-3" controlId={i.field}>
                                    <Row className="align-items-center">
                                        <Col xs={4} md={3}>
                                            <Form.Label className="mb-0">{i.title}:</Form.Label>
                                        </Col>
                                        <Col xs={8} md={9}>
                                            <Form.Control
                                                value={formData[i.field]}
                                                onChange={e => setFormData({ ...formData, [i.field]: e.target.value })}
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
                                <Button type="submit">Lưu thay đổi</Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </>
        )}

    </>;
};
export default Profile;