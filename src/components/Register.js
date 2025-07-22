import { Button, Form } from "react-bootstrap";

const Register = () => {
    return <>
    <h1>Đăng ký tài khoản</h1>
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Tên người dùng</Form.Label>
        <Form.Control type="text" placeholder="Nhập tên người dùng..." />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Mật khẩu</Form.Label>
        <Form.Control type="password" placeholder="Nhập mật khẩu..." />
      </Form.Group>
      <Button variant="primary" type="submit">
        Đăng ký
      </Button>
    </Form>
    </>
};
export default Register;