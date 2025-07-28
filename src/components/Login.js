import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import MySpinner from "./layouts/MySpinner";
import { DispatchContext, MyToastContext } from "../configs/Contexts";
import Apis, { authApis, endpoints } from "../configs/Apis";
import { useNavigate, useSearchParams } from "react-router-dom";
import cookie from 'react-cookies'

const Login = () => {
    const info = [{
        "title": "Tên đăng nhập",
        "field": "username",
        "type": "text"
    }, {
        "title": "Mật khẩu",
        "field": "password",
        "type": "password"
    }];
    const [user, setUser] = useState({});
    const dispatch = useContext(DispatchContext);
    const [loading, setLoading] = useState(false);
    const [, myToastDispatch] = useContext(MyToastContext);
    const q = useSearchParams() || null;
    const nav = useNavigate();

    const validate = () => {
        if (Object.values(user).length === 0) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "Tài khoản và mật khẩu không được để trống!"
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

        return true;
    }

    const login = async (e) => {
        e.preventDefault();
        if (validate())
            try {
                setLoading(true);
                let res = await Apis.post(endpoints['login'], {
                     ...user 
                    });
                cookie.save('token', res.data.token);
                console.info(res.data);

                let u = await authApis().get(endpoints['profile']);
                dispatch({
                    "type": "login",
                    "payload": u.data
                });

                let next = q.get('next');
                nav(next ? next : "/");

            } catch (error) {
                let msg;
                if (error.response?.status >= 500 && error.response?.status < 600)
                    msg = "Hệ thống đang có lỗi, vui lòng thử lại sau!";
                if (error.response?.status === 401)
                    msg = "Tài khoản hoặc mật khẩu không đúng!";

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
            <h1 className="text-center mt-2">ĐĂNG NHẬP</h1>
            <Form onSubmit={login}>
                {info.map(i => <Form.Group key={i.field} className="mb-3" controlId={i.field}>
                    <Form.Label>{i.title}</Form.Label>
                    <Form.Control required value={user[i.field]} onChange={e => setUser({...user, [i.field]: e.target.value})} type={i.type} placeholder={i.title} />
                </Form.Group>)}


                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                    <Button type="submit" variant="success">Đăng nhập</Button>
                </Form.Group>
            </Form>
        </>
    );
}

export default Login;