import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import MySpinner from "./layouts/MySpinner";
import Apis, { endpoints } from "../configs/Apis";
import { MyToastContext } from "../configs/Contexts";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const info = [{
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
    }, {
        "title": "Tên đăng nhập",
        "field": "username",
        "type": "text"
    }, {
        "title": "Mật khẩu",
        "field": "password",
        "type": "password"
    }, {
        "title": "Xác nhận mật khẩu",
        "field": "confirm",
        "type": "password"
    }];
    const sellerInfo = [{
        "title": "Tên doanh nghiệp",
        "field": "businessName",
        "type": "text"
    }, {
        "title": "Giấy phép kinh doanh",
        "field": "businessLicense",
        "type": "text"
    }];
    const [isSeller, setIsSeller] = useState(false);
    const avatar = useRef();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [, myToastDispatch] = useContext(MyToastContext);
    const nav = useNavigate();

    useEffect(() => {
        if (!isSeller) {
            setUser(u => {
                const { businessName, businessLicense, ...user } = u;
                return user;
            });
        }
    }, [isSeller]);

    const validate = () => {
        if (Object.values(user).length === 0) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "Thông tin phải được điền đầy đủ!"
                }
            })
            return false;
        }

        for (let i of info)
            if (!user[i.field]) {
                myToastDispatch({
                    "type": "set",
                    "payload": {
                        "variant": "danger",
                        "message": "Vui lòng nhập " + i.title + "!"
                    }
                })
                return false;
            }

        if (isSeller)
            for (let i of sellerInfo)
                if (!user[i.field]) {
                    myToastDispatch({
                        "type": "set",
                        "payload": {
                            "variant": "danger",
                            "message": "Vui lòng nhập " + i.title + "!"
                        }
                    })
                    return false;
                }

        if (user['password'] !== user['confirm']) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "Mật khẩu không khớp!"
                }
            })
            return false;
        }

        if (!user['avatar']) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "Vui lòng chọn ảnh đại diện!"
                }
            })
            return false;
        }
        
        return true;
    };

    const register = async (event) => {
        event.preventDefault();
        if (validate())
            try {
                setLoading(true);

                let formData = new FormData();
                for (let key in user)
                    if (key !== 'confirm')
                        formData.append(key, user[key]);

                if (avatar.current.files.length > 0) {
                    formData.append("avatar", avatar.current.files[0]);
                }
                let url = !isSeller ? endpoints['register'] : endpoints['sellerRegister']
                await Apis.post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                myToastDispatch({
                    "type": "set",
                    "payload": {
                        "variant": "success",
                        "message": `Đăng ký thành công! Bạn bây giờ đã có thể đăng nhập vào hệ thống.${isSeller && '\nVui lòng chờ xác nhận của hệ thống để có thể tạo cửa hàng.'}`
                    }
                });
                nav("/login");

            }
            catch (error) {
                let msg;
                if (error.response?.status === 400)
                    msg = "Thông tin không hợp lệ!";
                else msg = "Lỗi xảy ra, vui lòng thử lại sau!";

                myToastDispatch({
                    "type": "set",
                    "payload": {
                        "variant": "danger",
                        "message": msg
                    }
                })
                console.error(error);
            } finally {
                setLoading(false);
            }
    }

    return (
        <div className="container py-3" style={{ maxWidth: 800 }}>
            {loading && <MySpinner />}
            <h2 className="text-center my-3">Đăng ký tài khoản</h2>

            <Form onSubmit={register}>
                <Form.Group className="mb-2 mx-3">
                    <Form.Check
                        type="switch"
                        label="Đăng ký làm người bán"
                        checked={isSeller}
                        onChange={() => setIsSeller(prev => !prev)}
                    />
                </Form.Group>

                {info.map(i => (
                    <Form.Group as={Row} className="mb-2" controlId={i.field} key={i.field}>
                        <Form.Label column sm={4} className="text-end">
                            {i.title}:
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control
                                size="sm"
                                type={i.type}
                                placeholder={i.title}
                                value={user[i.field] || ''}
                                onChange={e => setUser({ ...user, [i.field]: e.target.value })}
                            />
                        </Col>
                    </Form.Group>
                ))}

                {isSeller && sellerInfo.map(s => (
                    <Form.Group as={Row} className="mb-2" controlId={s.field} key={s.field}>
                        <Form.Label column sm={4} className="text-end">
                            {s.title}:
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control
                                size="sm"
                                type={s.type}
                                placeholder={s.title}
                                value={user[s.field] || ''}
                                onChange={e => setUser({ ...user, [s.field]: e.target.value })}
                            />
                        </Col>
                    </Form.Group>
                ))}

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4} className="text-end">
                        Ảnh đại diện:
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            size="sm"
                            type="file"
                            ref={avatar}
                            accept="image/png, image/jpeg"
                        />
                    </Col>
                </Form.Group>

                <Button type="submit" size="sm" variant="success" className="w-100">
                    Đăng ký
                </Button>
            </Form>
        </div>
    );
}

export default Register;