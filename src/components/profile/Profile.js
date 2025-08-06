import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { DispatchContext, MyToastContext, UserContext } from "../../configs/Contexts";
import { Link, useNavigate } from "react-router-dom";
import MySpinner from "../layouts/MySpinner";
import { authApis, endpoints } from "../../configs/Apis";

const Profile = () => {
    const info = [{
        "title": "Tên đăng nhập",
        "field": "username",
        "type": "text",
        "disabled": true
    }, {
        "title": "Họ và tên",
        "field": "name",
        "type": "text",
        "disabled": false
    }, {
        "title": "Số điện thoại",
        "field": "phone",
        "type": "tel",
        "disabled": true
    }, {
        "title": "Email",
        "field": "email",
        "type": "email",
        "disabled": true
    }, {
        "title": "Địa chỉ",
        "field": "address",
        "type": "text",
        "disabled": false
    }];
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const avatar = useRef();
    const user = useContext(UserContext);
    const dispatch = useContext(DispatchContext);
    const [formData, setFormData] = useState(null);
    const [, myToastDispatch] = useContext(MyToastContext);

    useEffect(() => {
        if (!user) {
            nav("/auth?next=/profile");
        } else {
            setFormData(user);
        }
    }, [user]);

    const handleUploadAvatar = async () => {
        try {
            setLoading(true);
            let form = new FormData();
            form.append("avatar", avatar.current.files[0]);
            let res = await authApis().patch(endpoints['profile'], form);
            dispatch({
                "type": "login",
                "payload": res.data
            });
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "success",
                    "message": "Thay đổi ảnh đại diện thành công!"
                }
            });
        } catch (error) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "LỖI xảy ra khi thay đổi ảnh đại diện!"
                }
            });
            console.error(error);
        } finally {
            setLoading(false);
        };
    };

    const validate = () => {
        return true;
    }
    const submitEdit = async (event) => {
        event.preventDefault();
        if (validate())
            try {
                setLoading(true);
                let form = new FormData();
                for (let key in formData)
                    form.append(key, formData[key]);
                let res = await authApis().patch(endpoints['profile'], form);
                dispatch({
                    "type": "login",
                    "payload": res.data
                });
                myToastDispatch({
                    "type": "set",
                    "payload": {
                        "variant": "success",
                        "message": "Thay đổi thông tin thành công!"
                    }
                });
            } catch (error) {
                myToastDispatch({
                    "type": "set",
                    "payload": {
                        "variant": "danger",
                        "message": "LỖI xảy ra khi thay đổi thông tin!"
                    }
                });
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
                <span className="fs-4 fw-medium">Hồ sơ của bạn</span>
                <Row className=" py-3 mx-3 my-2 me-auto">
                    <Col md={3} xs={12}>
                        <div className="d-flex align-items-center">
                            <img src={formData.avatarURL} width={80} height={80} className="rounded-circle" />
                            <div className="pt-2 px-3">
                                <div style={{ width: "100%", maxWidth: "300px" }}>
                                    <h4 style={{ wordBreak: "break-word" }}>{user?.name}</h4>
                                </div>

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
                                                disabled={i.disabled}
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