import { useContext, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { MyToastContext } from "../../configs/Contexts";
import MySpinner from "../layouts/MySpinner";

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
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [, myToastDispatch] = useContext(MyToastContext);
    const validate = () => {
        return true;
    };
    const submitEidt = () => {
        if (validate())
            try {
                setLoading(true);
                myToastDispatch({
                    "type": "set",
                    "payload": {
                        "variant": "success",
                        "message": "Đổi mật khẩu thành công"
                    }
                });
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
    return <>

        {loading && <MySpinner />}
        <h1>Cập nhật mật khẩu</h1>
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