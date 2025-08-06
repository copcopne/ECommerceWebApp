import { useContext, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { DispatchContext, MyToastContext, UserContext } from "../../configs/Contexts";
import MySpinner from "../layouts/MySpinner";
import { Link, useNavigate } from "react-router-dom";
import Apis, { authApis, endpoints } from "../../configs/Apis";

const EditPassword = () => {
    const info = [{
        "title": "Mật khẩu hiện tại",
        "field": "password"
    }, {
        "title": "Mật khẩu mới",
        "field": "newPassword"
    }, {
        "title": "Xác nhận mật khẩu",
        "field": "confirm"
    }];
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [, myToastDispatch] = useContext(MyToastContext);
    const dispatch = useContext(DispatchContext);
    const validate = () => {
        if (Object.values(data).length === 0) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "Mật khẩu cũ và mới là bắt buộc!"
                }
            })
            return false;
        }

        for (let i of info)
            if (!data[i.field]) {
                myToastDispatch({
                    "type": "set",
                    "payload": {
                        "variant": "danger",
                        "message": "Vui lòng nhập " + i.title + "!"
                    }
                })
                return false;
            }

        if (data["newPassword"] !== data["confirm"]) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "Mật khẩu mới không khớp!"
                }
            })
            return false;
        }
        return true;
    };
    const submitEidt = async () => {
        if (validate())
            try {
                setLoading(true);
                let form = new FormData();
                form.append("oldPassword", data["password"]);
                form.append("password", data["newPassword"]);
                let u = await authApis().patch(endpoints['profile'], form);
                dispatch({
                    "type": "login",
                    "payload": u.data
                });
                myToastDispatch({
                    "type": "set",
                    "payload": {
                        "variant": "success",
                        "message": "Đổi mật khẩu thành công"
                    }
                });
                nav("/profile");

            } catch (error) {
                let msg;
                if (error.response?.status === 401)
                    msg = "Mật khẩu cũ không đúng!";
                else if (error.response?.status >= 500 && error.response?.status < 600)
                    msg = "Hệ thống đang có lỗi, vui lòng thử lại sau!";
                else msg = "Đầu vào không hợp lệ!";

                myToastDispatch({
                    "type": "set",
                    "payload": {
                        "variant": "danger",
                        "message": msg
                    }
                });
                console.error(error);
            } finally {
                setLoading(false);
            }
    };
    const backHandler = () => {
        if (Object.keys(data).length > 0) {
            let result = window.confirm("Bạn có chắc muốn quay lại không?");
            if (result)
                nav("/profile");
        }
        else nav("/profile");
    }
    return <>

        {loading && <MySpinner />}

        <span className="fs-4 fw-medium">
            <a onClick={backHandler} className="text-dark" style={{ cursor: "pointer" }}>
                Hồ sơ của bạn
            </a> &gt; Cập nhật mật khẩu
        </span>
        <Form className="m-3">
            {info.map(i => (
                <Form.Group key={i.field} className="p-3" controlId={i.field}>
                    <Row className="align-items-center">
                        <Col xs={4} md={3}>
                            <Form.Label className="mb-0">{i.title}:</Form.Label>
                        </Col>
                        <Col xs={8} md={9}>
                            <Form.Control
                                value={data[i.field]}
                                onChange={e => setData({ ...data, [i.field]: e.target.value })}
                                type="password"
                                placeholder={i.title}
                            />
                        </Col>
                    </Row>
                </Form.Group>
            ))}
            <div className="text-end mt-3 mx-4">
                <Button onClick={submitEidt}>Lưu thay đổi</Button>
            </div>
        </Form>
    </>
};
export default EditPassword;