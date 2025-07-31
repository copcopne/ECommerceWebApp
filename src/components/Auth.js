import { useContext, useEffect, useState } from "react";
import MySpinner from "./layouts/MySpinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import cookie from 'react-cookies';
import { authApis, endpoints } from "../configs/Apis";
import { DispatchContext } from "../configs/Contexts";

const Auth = () => {
    const [q, ] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const dispatch = useContext(DispatchContext);

    useEffect(() => {
        const loadUserdata = async () => {
            try {
                setLoading(true);
                let token = cookie.load("token") || null;
                let next = token ? q.get("next") : `/login?next=${q.get("next")}`;
                if (token) {
                    let u = await authApis().get(endpoints['profile']);
                    dispatch({
                        "type": "login",
                        "payload": u.data
                    });
                }
                setTimeout(() => nav(next), 500);
            } catch (error) {
                console.error(error);
                nav("/");
            } finally {
                setLoading(false);
            };
        };
        loadUserdata();
    }, []);
    return <>
        <div style={{ height: "80vh"}}>
            {loading && <MySpinner />}
        </div>
    </>;
};
export default Auth;