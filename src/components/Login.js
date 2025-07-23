import { useState } from "react";
import { Button, Form } from "react-bootstrap";

const Login = () => {
    const info = [ {
            "title": "Tên đăng nhập",
            "field": "username",
            "type": "text"
        }, {
            "title": "Mật khẩu",
            "field": "password",
            "type": "password"
        }];
    
      
        const [user, setUser] = useState({});

    const login = async (e) => {
        e.preventDefault();
    }

    return (
        <>
            <h1 className="text-center text-success mt-2">ĐĂNG NHẬP</h1>
            <Form onSubmit={login}>
                {info.map(i => <Form.Group key={i.field} className="mb-3" controlId={i.field}>
                    <Form.Label>{i.title}</Form.Label>
                    <Form.Control value={user[i.field]} onChange={e => setUser({...user, [i.field]: e.target.value})} type={i.type} placeholder={i.title} />
                </Form.Group>)}

              
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                    <Button type="submit" variant="success">Đăng nhập</Button>
                </Form.Group>
            </Form>
        </>
    );
}

export default Login;