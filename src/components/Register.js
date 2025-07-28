import { useContext, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import MySpinner from "./layouts/MySpinner";
import Apis, { endpoints } from "../configs/Apis";
import { MyToastContext } from "../configs/Contexts";

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

    const avatar = useRef();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [, myToastDispatch] = useContext(MyToastContext);

    const validate = () => {
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
                        formData.append(key, user['key']);

                if (avatar.current.files.length > 0) {
                    formData.append("avatar", avatar.current.files[0]);
                }
                await Apis.post(endpoints['register'], formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                myToastDispatch({
                    "type": "set",
                    "payload": {
                        "variant": "success",
                        "message": "Đăng ký thành công! Bạn bây giờ đã có thể đăng nhập vào hệ thống."
                    }
                })
                
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
        <>
            {loading && <MySpinner />}
            <h1 className="text-center mt-2">ĐĂNG KÝ TÀI KHOẢN</h1>

            <Form onSubmit={register}>
                {info.map(i => <Form.Group key={i.field} className="mb-3" controlId={i.field}>
                    <Form.Label>{i.title}</Form.Label>
                    <Form.Control value={user[i.field]} onChange={e => setUser({ ...user, [i.field]: e.target.value })} type={i.type} placeholder={i.title} />
                </Form.Group>)}

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Ảnh đại diện</Form.Label>
                    <Form.Control type="file" ref={avatar} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                    <Button type="submit" variant="success">Đăng ký</Button>
                </Form.Group>
            </Form>
        </>
    );
}

export default Register;