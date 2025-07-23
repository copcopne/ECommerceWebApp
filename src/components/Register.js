import { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";

const Register = () => {
    const info = [{
        "title": "Tên",
        "field": "firstName",
        "type": "text"
    }, {
        "title": "Họ và tên lót",
        "field": "lastName",
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

    const register = (event) => {
        event.preventDefault();

        let formData = new FormData();
        for (let key in user)
            if (key !== 'confirm')
                formData.append(key, user['key']);

        if (avatar.current.files.length > 0) {
            formData.append("avatar", avatar.current.files[0]);
        }

        console.info(formData);
    }

    return (
        <>
            <h1 className="text-center mt-2">ĐĂNG KÝ TÀI KHOẢN</h1>

            <Form onSubmit={register}>
                {info.map(i => <Form.Group key={i.field} className="mb-3" controlId={i.field}>
                    <Form.Label>{i.title}</Form.Label>
                    <Form.Control value={user[i.field]} onChange={e => setUser({...user, [i.field]: e.target.value})} type={i.type} placeholder={i.title} />
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